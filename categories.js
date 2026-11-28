const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function createCategories() {
    try {
        await client.connect();

        const db = client.db("blog_system");
        const categories = db.collection("categories");

        const names = [
            "Програмування",
            "Технології",
            "Ігри",
            "Наука",
            "Освіта",
            "Дизайн",
            "Бізнес",
            "Мобільні додатки",
            "Штучний інтелект",
            "Кібербезпека"
        ];

        const categoryData = names.map((name, index) => ({
            name: name,
            slug: `category-${index + 1}`,
            description: `Публікації на тему: ${name}`,
            parent_id: null,
            statistics: {
                posts_count: 0
            },
            created_at: new Date()
        }));

        const result = await categories.insertMany(categoryData);

        console.log("Категорій успішно створено:", result.insertedCount);

    } catch (error) {
        console.error("Помилка:", error);
    } finally {
        await client.close();
    }
}

createCategories();