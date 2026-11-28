
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

app.use(express.json());
app.use(express.static("public"));

let db;

async function startServer() {
    try {
        await client.connect();

        db = client.db("blog_system");

        console.log("Підключено до MongoDB");

        app.listen(PORT, () => {
            console.log(`Сервер запущено: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Помилка підключення:", error);
        process.exit(1);
    }
}

// Отримання списку публікацій
app.get("/api/posts", async (req, res) => {
    try {
        const posts = await db.collection("posts")
            .find({ status: "published" })
            .sort({ published_at: -1 })
            .toArray();

        res.json(posts);

    } catch (error) {
        res.status(500).json({ error: "Не вдалося отримати публікації" });
    }
});

// Пошук публікацій за декількома тегами
app.get("/api/posts/tags", async (req, res) => {
    try {
        const tags = (req.query.tags || "")
            .split(",")
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);

        if (tags.length === 0) {
            return res.status(400).json({
                error: "Вкажіть хоча б один тег"
            });
        }

        const posts = await db.collection("posts")
            .find({
                status: "published",
                tags: { $all: tags }
            })
            .sort({ published_at: -1 })
            .toArray();

        res.json(posts);

    } catch (error) {
        res.status(500).json({
            error: "Помилка пошуку за тегами"
        });
    }
});

// Пошук публікацій за автором
app.get("/api/posts/author/:username", async (req, res) => {
    try {
        const username = req.params.username;

        const posts = await db.collection("posts")
            .find({
                "author.username": username,
                status: "published"
            })
            .sort({ published_at: -1 })
            .toArray();

        res.json(posts);

    } catch (error) {
        res.status(500).json({
            error: "Помилка пошуку публікацій автора"
        });
    }
});

// Повнотекстовий пошук публікацій
app.get("/api/posts/search", async (req, res) => {
    try {
        const searchText = (req.query.q || "").trim();

        if (!searchText) {
            return res.status(400).json({
                error: "Введіть текст для пошуку"
            });
        }

        const posts = await db.collection("posts")
            .find(
                {
                    status: "published",
                    $text: {
                        $search: searchText
                    }
                },
                {
                    projection: {
                        score: {
                            $meta: "textScore"
                        }
                    }
                }
            )
            .sort({
                score: {
                    $meta: "textScore"
                }
            })
            .toArray();

        res.json(posts);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Помилка повнотекстового пошуку"
        });
    }
});

// Додавання лайка до публікації
app.post("/api/posts/:id/like", async (req, res) => {
    try {
        const postId = req.params.id;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: "Некоректний ID публікації"
            });
        }

        const result = await db.collection("posts").updateOne(
            {
                _id: new ObjectId(postId),
                status: "published"
            },
            {
                $inc: {
                    "statistics.likes": 1
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Публікацію не знайдено"
            });
        }

        const post = await db.collection("posts").findOne(
            { _id: new ObjectId(postId) },
            { projection: { statistics: 1 } }
        );

        res.json({
            message: "Лайк додано",
            likes: post.statistics.likes,
            dislikes: post.statistics.dislikes
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Помилка додавання лайка"
        });
    }
});

// Додавання дизлайка до публікації
app.post("/api/posts/:id/dislike", async (req, res) => {
    try {
        const postId = req.params.id;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: "Некоректний ID публікації"
            });
        }

        const result = await db.collection("posts").updateOne(
            {
                _id: new ObjectId(postId),
                status: "published"
            },
            {
                $inc: {
                    "statistics.dislikes": 1
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Публікацію не знайдено"
            });
        }

        const post = await db.collection("posts").findOne(
            { _id: new ObjectId(postId) },
            { projection: { statistics: 1 } }
        );

        res.json({
            message: "Дизлайк додано",
            likes: post.statistics.likes,
            dislikes: post.statistics.dislikes
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Помилка додавання дизлайка"
        });
    }
});

// Отримання публікацій із пагінацією
app.get("/api/posts/paginated", async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 10;
        const skip = (page - 1) * limit;

        const pipeline = [
            {
                $match: {
                    status: "published"
                }
            },
            {
                $sort: {
                    published_at: -1
                }
            },
            {
                $facet: {
                    posts: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    metadata: [
                        { $count: "totalPosts" }
                    ]
                }
            }
        ];

        const result = await db.collection("posts")
            .aggregate(pipeline)
            .toArray();

        const posts = result[0].posts;

        const totalPosts = result[0].metadata.length > 0
            ? result[0].metadata[0].totalPosts
            : 0;

        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            posts,
            currentPage: page,
            totalPages,
            totalPosts
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Помилка отримання сторінки публікацій"
        });
    }
});

// Отримання однієї публікації
app.get("/api/posts/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Некоректний ID" });
        }

        const post = await db.collection("posts").findOne({
            _id: new ObjectId(req.params.id),
            status: "published"
        });

        if (!post) {
            return res.status(404).json({ error: "Публікацію не знайдено" });
        }

        res.json(post);

    } catch (error) {
        res.status(500).json({ error: "Помилка отримання публікації" });
    }
});

startServer();
