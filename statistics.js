const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function updateStatistics() {
    try {
        await client.connect();

        const db = client.db("blog_system");
        const posts = db.collection("posts");

        const allPosts = await posts.find().toArray();

        for (let i = 0; i < allPosts.length; i++) {
            const post = allPosts[i];

            await posts.updateOne(
                { _id: post._id },
                {
                    $set: {
                        "statistics.views": (i + 1) * 15,
                        "statistics.likes": (i + 1) * 3,
                        "statistics.dislikes": i + 1,
                        "statistics.comments_count": post.comments.length
                    }
                }
            );
        }

        console.log("Статистику оновлено для публікацій:", allPosts.length);

    } catch (error) {
        console.error("Помилка:", error);
    } finally {
        await client.close();
    }
}

updateStatistics();