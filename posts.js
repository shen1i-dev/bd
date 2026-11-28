const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function createPosts() {
    try {
        await client.connect();

        const db = client.db("blog_system");

        const users = await db.collection("users").find({
            role: { $in: ["admin", "author"] }
        }).toArray();

        const categories = await db.collection("categories")
            .find()
            .toArray();

        if (users.length === 0 || categories.length === 0) {
            throw new Error("Спочатку потрібно створити користувачів і категорії.");
        }

        const postsData = [];

        const topics = [
            "Основи програмування",
            "Сучасні технології",
            "Розробка вебзастосунків",
            "Штучний інтелект",
            "Інформаційна безпека",
            "Комп'ютерні ігри",
            "Мобільні технології",
            "Основи дизайну",
            "Навчання програмуванню",
            "Розвиток цифрового світу"
        ];

        for (let i = 0; i < 50; i++) {
            const author = users[i % users.length];
            const category = categories[i % categories.length];
            const topic = topics[i % topics.length];

            const content =
                `${topic}. У цій публікації розглядаються основні поняття та практичні особливості цієї теми. ` +
                "Матеріал допомагає краще зрозуміти сучасні інформаційні технології, їх використання та можливості. " +
                "Також наведено корисні рекомендації для початківців і приклади застосування отриманих знань.";

            const createdAt = new Date();

            postsData.push({
                title: `${topic} - стаття №${i + 1}`,
                slug: `post-${i + 1}`,
                content: content,
                excerpt: `Короткий опис публікації №${i + 1}.`,

                author: {
                    user_id: author._id,
                    username: author.username
                },

                category: {
                    category_id: category._id,
                    name: category.name
                },

                tags: [
                    `tag-${(i % 5) + 1}`,
                    `topic-${(i % 3) + 1}`
                ],

                featured_image: null,
                status: "published",
                comments: [],

                statistics: {
                    views: 0,
                    likes: 0,
                    dislikes: 0,
                    comments_count: 0
                },

                created_at: createdAt,
                updated_at: createdAt,
                published_at: createdAt
            });
        }

        const result = await db.collection("posts").insertMany(postsData);

        console.log("Публікацій успішно створено:", result.insertedCount);

    } catch (error) {
        console.error("Помилка:", error);
    } finally {
        await client.close();
    }
}

createPosts();