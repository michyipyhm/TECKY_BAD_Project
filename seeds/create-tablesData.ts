import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries //Testing only!!! Do not do this in production
    await knex("shopping_cart").del();
    await knex("chat_box").del();
    await knex("order_details").del();
    await knex("transaction").del();
    await knex("orders").del();
    await knex("product_image").del();
    await knex("product_option").del();
    await knex("products").del();
    await knex("members").del();
    await knex("category").del();
    await knex("color").del();
    await knex("model").del();
    

    // Inserts seed entries

    await knex("model").insert([
        {id: 1, name:"iPhone 16 ProMax"},
        {id: 2, name:"iPhone 16 Pro"},
        {id: 3, name:"iPhone 16 Plus"},
        {id: 4, name:"iPhone 16"},
        {id: 5, name:"iPhone 15 ProMax"},
        {id: 6, name:"iPhone 15 Pro"},
        {id: 7, name:"iPhone 15 Plus"},
        {id: 8, name:"iPhone 15"},
        {id: 9, name:"iPhone 14 ProMax"},
        {id: 10, name:"iPhone 14 Pro"},
        {id: 11, name:"iPhone 14 Plus"},
        {id: 12, name:"iPhone 14"},
        {id: 13, name:"iPhone 13 ProMax"},
        {id: 14, name:"iPhone 13 Pro"},
        {id: 15, name:"iPhone 13 Plus"},
        {id: 16, name:"iPhone 13"}
    ]);

    await knex("color").insert([
       {id: 1, name: "Desert Titanium"},
       {id: 2, name: "Natural Titanium"},
       {id: 3, name: "White Titanium"},
       {id: 4, name: "Black Titanium"},
       {id: 5, name: "Black"},
       {id: 6, name: "White"},
       {id: 7, name: "Pink"},
       {id: 8, name: "Teal"},
       {id: 9, name: "null"}
    ]);

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
        { id:1, username: "admin", password: "123123", phone: "97776888", address: "tuen mun ", email: "admin@gmail.com" , admin: true },
        { id:2, username: "kees", password: "123123", phone: "98887666", address: "tuen mun", email: "kees@gmail.com" , admin: false },
        { id:3, username: "victor", password: "123123", phone: "96668777", address: "tuen mun", email: "victor@gmail.com" , admin: false }
    ]);

    await knex("products").insert([
        {
            id: 1,
            product_name: "2.5D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTHY EYES",
            category_id: 7,
            product_price: 120,
            product_quantity: 100,
            custom_made:false
        },
        {
            id: 2,
            product_name: '2.5D ANTI-FINGERPRINT WITH NANO COATING FOR GAME PLAYER', 
            category_id: 8,
            product_price: 120, 
            product_quantity: 100,
            custom_made:false
        },
        {
            id: 3,
            product_name: '2.5D ANTI-REFLECTION FOR BETTER SCREEN CLARITY & COLOR VIBRANCY', 
            category_id: 5,
            product_price: 120, 
            product_quantity: 100,
            custom_made:false
        },
        {
            id: 4,
            product_name: '2.5D 360 ° PRIVACY PROTECTING SCREEN PRIVATE FROM ALL SIDES', 
            category_id: 6,
            product_price: 120, 
            product_quantity: 100,
            custom_made:false
        },
        {
            id: 5,
            product_name: 'AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 
            category_id: 4,
            product_price: 70, 
            product_quantity: 1,
            custom_made:false
        },
        {
            id: 6,
            product_name: 'HD CAMERA GUARD FOR FULL COVERAGE', 
            category_id: 3,
            product_price: 80, 
            product_quantity: 100,
            custom_made:false
        },
        {
            id: 7,
            product_name: 'AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 
            category_id: 4,
            product_price: 80, 
            product_quantity: 100,
            custom_made:false
        },
        {
            id: 8,
            product_name: 'Flying Chess Case For Iphone16ProMax', 
            category_id: 1,
            product_price: 160, 
            product_quantity: 100,
            custom_made:false
        },
        {
            id: 9,
            product_name: "4D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTHY EYES",
            category_id: 7,
            product_price: 120,
            product_quantity: 100,
            custom_made:false
        }

    ]);

    await knex("product_option").insert([
        {id: 1, model_id: 1, color_id: 9 , products_id: 1},
        {id: 2, model_id: 4, color_id: 9, products_id: 8},
        {id: 3, model_id: 5, color_id: 9, products_id: 2},
        {id: 4, model_id: 8, color_id: 9, products_id: 4},
        {id: 5, model_id: 6, color_id: 9, products_id: 3},
        {id: 6, model_id: 10, color_id: 6, products_id: 5},
        {id: 7, model_id: 2, color_id: 4, products_id: 7},
        {id: 8, model_id: 1, color_id: 9, products_id: 9}
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
            member_id: 2,
            user_message:"Hello, I want to ask something.",
            response_message:"",
        },
        { 
            id:2,
            member_id: 2,
            user_message:"",
            response_message:"What can i help you?"
        }
    ]);
    
    await knex("shopping_cart").insert([
        { id:1, product_option_id: 1, member_id: 1, quantity: 2 },
        { id:2, product_option_id: 2, member_id: 2, quantity: 3 },
        { id:3, product_option_id: 3, member_id: 3, quantity: 3 }
    ]);

};