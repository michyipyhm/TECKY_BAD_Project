DROP DATABASE IF EXISTS bad_project;
CREATE DATABASE bad_project;

\c bad_project

CREATE TABLE member(
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) UNIQUE,
    "address" VARCHAR(255),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "admin" BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders(
    "id" SERIAL PRIMARY KEY,
    "member_id" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "stripe_id" VARCHAR(255),
    "payment_type" VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE
);

CREATE TABLE transaction(
    "id" SERIAL PRIMARY KEY,
    "order_id" INTEGER NOT NULL,
    "success" BOOLEAN,
    "log" VARCHAR(255),
    "payment_type" VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE category(
    "id" SERIAL PRIMARY KEY,
    "category_name" VARCHAR(255) NOT NULL,
    "category_type" VARCHAR(255) NOT NULL
);

CREATE TABLE product(
    "id" SERIAL PRIMARY KEY,
    "product_name" VARCHAR(255) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "phone_type" VARCHAR(255),
    "color" VARCHAR(255),
    "product_price" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE product_image(
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "image_path" VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE order_details(
    "id" SERIAL PRIMARY KEY,
    "order_id" INTEGER,
    "product_id" INTEGER,
    "quantity" INTEGER,
    "product_price" INTEGER,
    "subtotal" INTEGER,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE shopping_cart(
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE
);

CREATE TABLE chat_box(
    "id" SERIAL PRIMARY KEY,
    "role" VARCHAR(255) NOT NULL,
    "member_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "product_id" INTEGER,
    "comment_image" VARCHAR(255),
    "comment_text" VARCHAR(255),
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL
);



-- DROP DATABASE IF EXISTS bad_project;
-- CREATE DATABASE bad_project;

-- \c bad_project


-- CREATE TABLE member(
--     "id" SERIAL PRIMARY KEY,
--     "username" VARCHAR(255) UNIQUE NOT NULL,
--     "password" VARCHAR(255) NOT NULL,
--     "phone" VARCHAR(15) UNIQUE,
--     "address" VARCHAR(255) ,
--     "email" VARCHAR(255) UNIQUE NOT NULL,
--     "admin" BOOLEAN,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE orders(
--     "id" SERIAL PRIMARY KEY,
--     "member_id" INTEGER NOT NULL,
--     "total" INTEGER NOT NULL,
--     "state" VARCHAR(255) NOT NULL,
--     "stripe_id" VARCHAR(255),
--     "payment_type" VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (member_id) REFERENCES member(id)
-- );

-- CREATE TABLE transaction(
--     "id" SERIAL PRIMARY KEY,
--     "order_id" INTEGER NOT NULL,
--     "success" VARCHAR(255),
--     "log" VARCHAR(255),
--     "payment_type" VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (order_id) REFERENCES order(id)
-- );

-- CREATE TABLE category(
--     "id" SERIAL PRIMARY KEY,
--     "category_name" VARCHAR(255) NOT NULL,
--     "category_type" VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE product(
--     "id" SERIAL PRIMARY KEY,
--     "product_name" VARCHAR(255) NOT NULL,
--     "category_id" INTEGER NOT NULL,
--     "phone_type" VARCHAR(255),
--     "color" VARCHAR(255),
--     "product_price" INTEGER NOT NULL,
--     "product_quantity" INTEGER NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (category_id) REFERENCES category(id)
-- );

-- CREATE TABLE product_image(
--     "id" SERIAL PRIMARY KEY,
--     "product_id" INTEGER NOT NULL,
--     "image_path" VARCHAR(255) NOT NULL,
--     FOREIGN KEY (product_id) REFERENCES product(id)
-- );

-- CREATE TABLE order_details(
--     "id" SERIAL PRIMARY KEY,
--     "orders_id" INTEGER,
--     "product_id" INTEGER,
--     "quantity" INTEGER,
--     "product_price" INTEGER,
--     "subtotal" INTEGER,
--     FOREIGN KEY (product_id) REFERENCES product(id),
--     FOREIGN KEY (orders_id) REFERENCES orders(id)
-- );

-- CREATE TABLE shopping_cart(
--     "id" SERIAL PRIMARY KEY,
--     "product_id" INTEGER NOT NULL,
--     "member_id" INTEGER NOT NULL,
--     "quantity" INTEGER NOT NULL,
--     FOREIGN KEY (product_id) REFERENCES product(id),
--     FOREIGN KEY (member_id) REFERENCES member(id)
-- );

-- CREATE TABLE chat_box(
--     "id" SERIAL PRIMARY KEY,
--     "role" VARCHAR(255) NOT NULL,
--     "member_id" INTEGER NOT NULL,
--     "orders_id" INTEGER,
--     "product_id" INTEGER,
--     "comment_image" VARCHAR(255),
--     "comment_text" VARCHAR(255),
--     FOREIGN KEY (member_id) REFERENCES member(id),
--     FOREIGN KEY (orders_id) REFERENCES orders(id),
--     FOREIGN KEY (product_id) REFERENCES product(id)
-- );