-- 1. Виведення всіх товарів
SELECT * FROM products;

-- 2. Пошук товарів дорожче 20000 грн
SELECT product_name, price
FROM products
WHERE price > 20000
ORDER BY price DESC;

-- 3. Виведення товарів разом із брендами та категоріями
SELECT
    p.product_name,
    b.brand_name,
    c.category_name,
    p.price
FROM products p
JOIN brands b ON p.brand_id = b.brand_id
JOIN categories c ON p.category_id = c.category_id;

-- 4. Підрахунок кількості товарів у кожній категорії
SELECT
    c.category_name,
    COUNT(p.product_id) AS product_count
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
GROUP BY c.category_id, c.category_name
ORDER BY product_count DESC;

-- 5. Пошук товарів, ціна яких вища за середню
SELECT product_name, price
FROM products
WHERE price > (
    SELECT AVG(price)
    FROM products
)
ORDER BY price DESC;
