import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries //Testing only!!! Do not do this in production
    await knex("shopping_cart").del();
    await knex("chat_box").del();
    await knex("order_details").del();
    await knex("transaction").del();
    await knex("orders").del();
    await knex("product_image").del();
    await knex("products").del();
    await knex("members").del();
    await knex("category").del();
    

    // Inserts seed entries
    await knex("category").insert([
        { id: 1, category_name: 'phoneCase', category_type: "ownBrand" },
        { id: 2, category_name: 'phoneCase', category_type: "notOwnBrand" },
        { id: 3, category_name: 'lensProtector', category_type: "cameraGuard" },
        { id: 4, category_name: 'lensProtector', category_type: "lensGuard" },
        { id: 5, category_name: 'screenProtector', category_type: "ar" },
        { id: 6, category_name: 'screenProtector', category_type: "privacy" },
        { id: 7, category_name: 'screenProtector', category_type: "antiBlue" },
        { id: 8, category_name: 'screenProtector', category_type: "antiFingerprint" }
    ]);

    await knex("members").insert([
        { id:1, username: "admin", password: "111111", phone: "98765432", address: "tuen mun ", email: "admin@gmail.com" , admin: true },
        { id:2, username: "kees", password: "111111", phone: "98765452", address: "tuen mun", email: "kees@gmail.com" , admin: false },
        { id:3, username: "victor", password: "111111", phone: "98765472", address: "tuen mun", email: "victor@gmail.com" , admin: false }
    ]);

    await knex("products").insert([
        {
            id: 1,
            product_name: "2.5D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTHY EYES",
            category_id: 7,
            phone_type: "iPhone16ProMax",
            color: "",
            product_price: 100,
            product_quantity: 100
        },
        {
            id: 2,
            product_name: '2.5D ANTI-FINGERPRINT WITH NANO COATING FOR GAME PLAYER', 
            category_id: 8,
            phone_type: "iPhone16ProMax", 
            color: "",
            product_price: 100, 
            product_quantity: 100
        },
        {
            id: 3,
            product_name: '2.5D ANTI-REFLECTION FOR BETTER SCREEN CLARITY & COLOR VIBRANCY', 
            category_id: 5,
            phone_type: "iPhone16ProMax", 
            color: "",
            product_price: 100, 
            product_quantity: 100
        },
        {
            id: 4,
            product_name: '2.5D 360 ° PRIVACY PROTECTING SCREEN PRIVATE FROM ALL SIDES', 
            category_id: 6,
            phone_type: "iPhone16ProMax", 
            color: "",
            product_price: 100, 
            product_quantity: 100
        },
        {
            id: 5,
            product_name: 'AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 
            category_id: 4,
            phone_type: "iPhone16ProMax", 
            color: "blackTitanium",
            product_price: 100, 
            product_quantity: 100
        },
        {
            id: 6,
            product_name: 'HD CAMERA GUARD FOR FULL COVERAGE', 
            category_id: 3,
            phone_type: "iPhone16ProMax", 
            color: "",
            product_price: 100, 
            product_quantity: 100
        },
        {
            id: 7,
            product_name: 'AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 
            category_id: 4,
            phone_type: "iPhone16", 
            color: "black",
            product_price: 100, 
            product_quantity: 100
        },
        {
            id: 8,
            product_name: 'Flying Chess Case For Iphone16ProMax', 
            category_id: 1,
            phone_type: "iPhone16ProMax", 
            color: "",
            product_price: 100, 
            product_quantity: 100
        }

    ]);

    await knex("product_image").insert([
        { id:1, product_id: 1, image_path: "/photos/products/antiBlue_16.jpg" },
        { id:2, product_id: 2, image_path: "/photos/products/antiFingerprint_16.jpg" },
        { id:3, product_id: 3, image_path: "/photos/products/ar_16.jpg" },
        { id:4, product_id: 4, image_path: "/photos/products/privacy_16.jpg" },
        { id:5, product_id: 5, image_path: "/photos/products/cameraIphonePro1.jpg" },
        { id:6, product_id: 6, image_path: "/photos/products/cameraIphonePro7.jpg" },
        { id:7, product_id: 7, image_path: "/photos/products/cameraIphone1.jpg" },
        { id:8, product_id: 8, image_path: "/photos/products/case13To15_1.jpg" }
    ]);

    await knex("orders").insert([
        { id: 1, member_id: 3, total: 100, state: "Pending", stripe_id: 1, payment_type: "Cash" },
        { id: 2, member_id: 2, total: 200, state: "Completed", stripe_id: 2, payment_type: "Credit Card" },
        { id: 3, member_id: 2, total: 300, state: "Cancelled", stripe_id: 3, payment_type: "Credit Card" }
    ]);

    await knex("transaction").insert([
        { id: 1, order_id: 1, success: true, log: "", payment_type: "Cash" },
        { id: 2, order_id: 2, success: false, log: "", payment_type: "Credit Card" },
        { id: 3, order_id: 3, success: false, log: "", payment_type: "Credit Card" }
    ]);

  await knex("order_details").insert([
    { id: 1, product_id: 1, quantity: 1, product_price: 100, subtotal: 100 },
    { id: 2, product_id: 2, quantity: 3, product_price: 300, subtotal: 300 },
    { id: 3, product_id: 3, quantity: 5, product_price: 500, subtotal: 500 },
  ]);
    
    await knex("chat_box").insert([
        { 
            id:1,
            role: "admin", 
            member_id: 1, 
            order_id: 1, 
            product_id: 3, 
            comment_text:"nice", 
            comment_image:"/photos/products/antiFingerprint_16.jpg" },
        { 
            id:2,
            role: "robot", 
            member_id: 2, 
            order_id: 2, 
            product_id: 2, 
            comment_text:"very good", 
            comment_image:"/photos/products/antiFingerprint_16.jpg" },
        { 
            id:3,
            role: "robot", 
            member_id: 3, 
            order_id: 3, 
            product_id: 1, 
            comment_text:"good", 
            comment_image:"/photos/products/antiFingerprint_16.jpg" }
    ]);
    
    await knex("shopping_cart").insert([
        { id:1, product_id: 1, member_id: 1, quantity: 2 },
        { id:2, product_id: 2, member_id: 2, quantity: 3 },
        { id:3, product_id: 3, member_id: 3, quantity: 3 }
    ]);

};