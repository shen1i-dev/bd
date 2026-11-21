-- 1. Таблиця категорій
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 2. Таблиця брендів
CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100)
);

-- 3. Таблиця товарів
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(category_id),
    brand_id INTEGER NOT NULL REFERENCES brands(brand_id),
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Таблиця покупців
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    registration_date DATE DEFAULT CURRENT_DATE
);

-- 5. Таблиця працівників
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    hire_date DATE DEFAULT CURRENT_DATE
);

-- 6. Таблиця замовлень
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    employee_id INTEGER REFERENCES employees(employee_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'Нове'
        CHECK (status IN ('Нове', 'Оплачено', 'Відправлено', 'Виконано', 'Скасовано')),
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (total_amount >= 0)
);

-- 7. Таблиця товарів у замовленнях
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    UNIQUE (order_id, product_id)
);
