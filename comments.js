const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function createComments() {
    try {
        await client.connect();

        const db = client.db("blog_system");

        const users = await db.collection("users")
            .find()
            .toArray();

        const posts = await db.collection("posts")
            .find()
            .toArray();

        if (users.length === 0 || posts.length === 0) {
            throw new Error("Не знайдено користувачів або публікацій.");
        }

        let totalComments = 0;

        for (const post of posts) {
            const comments = [];

            for (let i = 0; i < 4; i++) {
                const user = users[(totalComments + i) % users.length];

                comments.push({
                    _id: new ObjectId(),
                    user_id: user._id,
                    username: user.username,
                    text: `Тестовий коментар №${totalComments + i + 1} до публікації "${post.title}".`,
                    status: "approved",
                    created_at: new Date()
                });
            }

            await db.collection("posts").updateOne(
                { _id: post._id },
                { $push: { comments: { $each: comments } } }
            );

            totalComments += 4;
        }

        console.log("Коментарів успішно створено:", totalComments);

    } catch (error) {
        console.error("Помилка:", error);
    } finally {
        await client.close();
    }
}

createComments();