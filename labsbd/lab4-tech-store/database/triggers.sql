-- 1. Перевірка та зменшення кількості товару на складі
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET quantity = quantity - NEW.quantity
    WHERE product_id = NEW.product_id
      AND quantity >= NEW.quantity;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Недостатня кількість товару на складі!';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_stock ON order_items;

CREATE TRIGGER trg_update_stock
BEFORE INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();


-- 2. Автоматичний перерахунок суми замовлення
CREATE OR REPLACE FUNCTION recalculate_order_total()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE orders
        SET total_amount = (
            SELECT COALESCE(SUM(quantity * unit_price), 0)
            FROM order_items
            WHERE order_id = OLD.order_id
        )
        WHERE order_id = OLD.order_id;

        RETURN OLD;
    ELSE
        UPDATE orders
        SET total_amount = (
            SELECT COALESCE(SUM(quantity * unit_price), 0)
            FROM order_items
            WHERE order_id = NEW.order_id
        )
        WHERE order_id = NEW.order_id;

        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_recalculate_total ON order_items;

CREATE TRIGGER trg_recalculate_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION recalculate_order_total();
