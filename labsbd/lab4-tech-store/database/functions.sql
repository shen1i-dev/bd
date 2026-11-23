-- 1. Пошук товарів за назвою
CREATE OR REPLACE FUNCTION search_products(search_text TEXT)
RETURNS TABLE (
    product_id INTEGER,
    product_name VARCHAR,
    price NUMERIC
)
LANGUAGE SQL
AS $$
    SELECT p.product_id, p.product_name, p.price
    FROM products p
    WHERE p.product_name ILIKE '%' || search_text || '%';
$$;


-- 2. Обчислення загальної вартості замовлення
CREATE OR REPLACE FUNCTION get_order_total(order_number INTEGER)
RETURNS NUMERIC
LANGUAGE SQL
AS $$
    SELECT COALESCE(SUM(quantity * unit_price), 0)
    FROM order_items
    WHERE order_id = order_number;
$$;


-- 3. Статистика продажів за місяцями
CREATE OR REPLACE FUNCTION get_monthly_sales()
RETURNS TABLE (
    sales_month DATE,
    total_sales NUMERIC,
    orders_count BIGINT
)
LANGUAGE SQL
AS $$
    SELECT
        DATE_TRUNC('month', order_date)::DATE,
        SUM(total_amount),
        COUNT(order_id)
    FROM orders
    WHERE status <> 'Скасовано'
    GROUP BY DATE_TRUNC('month', order_date)::DATE
    ORDER BY DATE_TRUNC('month', order_date)::DATE;
$$;
