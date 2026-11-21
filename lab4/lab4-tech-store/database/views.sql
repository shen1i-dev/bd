-- 1. Представлення каталогу товарів
CREATE OR REPLACE VIEW product_catalog AS
SELECT
    p.product_id,
    p.product_name,
    b.brand_name,
    c.category_name,
    p.price,
    p.quantity
FROM products p
JOIN brands b ON p.brand_id = b.brand_id
JOIN categories c ON p.category_id = c.category_id;


-- 2. Представлення статистики продажів товарів
CREATE OR REPLACE VIEW product_sales AS
SELECT
    p.product_id,
    p.product_name,
    COALESCE(SUM(oi.quantity), 0) AS sold_quantity,
    COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS sales_amount
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id
    AND o.status <> 'Скасовано'
GROUP BY p.product_id, p.product_name;
