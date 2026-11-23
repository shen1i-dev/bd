from flask import Flask, render_template, request, redirect, url_for, flash
import psycopg2

app = Flask(__name__)
app.secret_key = "techstore_secret_key"


# Підключення до PostgreSQL
def get_connection():
    return psycopg2.connect(
        host="localhost",
        port=5433,
        database="techstore",
        user="techstore_user",
        password="123"
    )


# Головна сторінка - перегляд товарів
@app.route("/")
def index():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT p.product_id, p.product_name, b.brand_name,
               c.category_name, p.price, p.quantity
        FROM products p
        JOIN brands b ON p.brand_id = b.brand_id
        JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.product_id
    """)

    products = cur.fetchall()

    cur.close()
    conn.close()

    return render_template("index.html", products=products)


# Додавання нового товару
@app.route("/add", methods=["GET", "POST"])
def add_product():
    conn = get_connection()
    cur = conn.cursor()

    if request.method == "POST":
        name = request.form["name"].strip()
        brand_id = request.form["brand_id"]
        category_id = request.form["category_id"]
        price = request.form["price"]
        quantity = request.form["quantity"]

        try:
            if not name or float(price) <= 0 or int(quantity) < 0:
                raise ValueError

            cur.execute("""
                INSERT INTO products
                (product_name, brand_id, category_id, price, quantity)
                VALUES (%s, %s, %s, %s, %s)
            """, (name, brand_id, category_id, price, quantity))

            conn.commit()
            flash("Товар успішно додано!")
            return redirect(url_for("index"))

        except (ValueError, TypeError):
            flash("Перевірте правильність введених даних.")

        except psycopg2.Error:
            conn.rollback()
            flash("Помилка під час додавання товару.")

    cur.execute("SELECT brand_id, brand_name FROM brands ORDER BY brand_name")
    brands = cur.fetchall()

    cur.execute("SELECT category_id, category_name FROM categories ORDER BY category_name")
    categories = cur.fetchall()

    cur.close()
    conn.close()

    return render_template(
        "add_product.html",
        brands=brands,
        categories=categories
    )


# Редагування товару
@app.route("/edit/<int:product_id>", methods=["GET", "POST"])
def edit_product(product_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT product_name, brand_id, category_id, price, quantity
        FROM products
        WHERE product_id = %s
    """, (product_id,))

    product = cur.fetchone()

    if product is None:
        cur.close()
        conn.close()
        return "Товар не знайдено", 404

    if request.method == "POST":
        name = request.form["name"].strip()
        brand_id = request.form["brand_id"]
        category_id = request.form["category_id"]
        price = request.form["price"]
        quantity = request.form["quantity"]

        try:
            if not name or float(price) <= 0 or int(quantity) < 0:
                raise ValueError

            cur.execute("""
                UPDATE products
                SET product_name = %s,
                    brand_id = %s,
                    category_id = %s,
                    price = %s,
                    quantity = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE product_id = %s
            """, (name, brand_id, category_id, price, quantity, product_id))

            conn.commit()
            cur.close()
            conn.close()

            flash("Товар успішно оновлено!")
            return redirect(url_for("index"))

        except (ValueError, TypeError):
            flash("Перевірте правильність введених даних.")

        except psycopg2.Error:
            conn.rollback()
            flash("Помилка під час редагування товару.")

    cur.execute("SELECT brand_id, brand_name FROM brands ORDER BY brand_name")
    brands = cur.fetchall()

    cur.execute("SELECT category_id, category_name FROM categories ORDER BY category_name")
    categories = cur.fetchall()

    cur.close()
    conn.close()

    return render_template(
        "edit_product.html",
        product=product,
        product_id=product_id,
        brands=brands,
        categories=categories
    )


# Видалення товару
@app.route("/delete/<int:product_id>", methods=["POST"])
def delete_product(product_id):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "DELETE FROM products WHERE product_id = %s",
            (product_id,)
        )

        if cur.rowcount == 0:
            flash("Товар не знайдено.")
        else:
            conn.commit()
            flash("Товар успішно видалено!")

    except psycopg2.errors.ForeignKeyViolation:
        conn.rollback()
        flash("Не можна видалити товар, який використовується в замовленнях.")

    except psycopg2.Error:
        conn.rollback()
        flash("Помилка під час видалення товару.")

    finally:
        cur.close()
        conn.close()

    return redirect(url_for("index"))


# Запуск вебзастосунку
if __name__ == "__main__":
    app.run(debug=True)
