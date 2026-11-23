import psycopg2


def connect_db():
    return psycopg2.connect(
        host="localhost",
        port="5433",
        database="techstore",
        user="techstore_user",
        password="123"
    )


def show_products():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT product_id, product_name, price, quantity
        FROM products
        ORDER BY product_id
    """)

    products = cur.fetchall()

    print("\n--- СПИСОК ТОВАРІВ ---")
    for product in products:
        print(
            f"ID: {product[0]} | Назва: {product[1]} | "
            f"Ціна: {product[2]} грн | Кількість: {product[3]}"
        )

    cur.close()
    conn.close()


def add_product():
    name = input("Назва товару: ")
    category_id = int(input("ID категорії: "))
    brand_id = int(input("ID бренду: "))
    price = float(input("Ціна: "))
    quantity = int(input("Кількість: "))
    description = input("Опис: ")

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO products
        (product_name, category_id, brand_id, price, quantity, description)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (name, category_id, brand_id, price, quantity, description))

    conn.commit()
    cur.close()
    conn.close()

    print("Товар успішно додано!")


def edit_product():
    product_id = int(input("Введіть ID товару: "))
    new_price = float(input("Нова ціна: "))
    new_quantity = int(input("Нова кількість: "))

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        UPDATE products
        SET price = %s,
            quantity = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = %s
    """, (new_price, new_quantity, product_id))

    conn.commit()

    if cur.rowcount > 0:
        print("Інформацію про товар оновлено!")
    else:
        print("Товар не знайдено.")

    cur.close()
    conn.close()


def delete_product():
    product_id = int(input("Введіть ID товару для видалення: "))

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM products
        WHERE product_id = %s
    """, (product_id,))

    conn.commit()

    if cur.rowcount > 0:
        print("Товар успішно видалено!")
    else:
        print("Товар не знайдено.")

    cur.close()
    conn.close()


def main():
    while True:
        print("\n===== МАГАЗИН ТЕХНІКИ =====")
        print("1. Переглянути товари")
        print("2. Додати товар")
        print("3. Редагувати товар")
        print("4. Видалити товар")
        print("0. Вихід")

        choice = input("Виберіть дію: ")

        try:
            if choice == "1":
                show_products()
            elif choice == "2":
                add_product()
            elif choice == "3":
                edit_product()
            elif choice == "4":
                delete_product()
            elif choice == "0":
                print("Завершення роботи програми.")
                break
            else:
                print("Неправильний вибір!")

        except ValueError:
            print("Помилка: перевірте введені числові значення.")
        except psycopg2.Error as error:
            print("Помилка бази даних:", error)


if __name__ == "__main__":
    main()
