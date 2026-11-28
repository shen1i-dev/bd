const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function createUsers() {
    try {
        await client.connect();

        const db = client.db("blog_system");
        const users = db.collection("users");

        const userData = [];

        for (let i = 1; i <= 20; i++) {
            userData.push({
                username: `user${i}`,
                email: `user${i}@example.com`,
                password_hash: "a".repeat(60),

                role: i === 1
                    ? "admin"
                    : i <= 10
                        ? "author"
                        : "reader",

                profile: {
                    first_name: `Ім'я${i}`,
                    last_name: `Прізвище${i}`
                },

                statistics: {
                    posts_count: 0,
                    comments_count: 0
                },

                created_at: new Date(),
                last_login: new Date(),
                status: "active"
            });
        }

        const result = await users.insertMany(userData);

        console.log("Користувачів успішно створено:", result.insertedCount);

    } catch (error) {
        console.error("Помилка:", error);
    } finally {
        await client.close();
    }
}

createUsers();