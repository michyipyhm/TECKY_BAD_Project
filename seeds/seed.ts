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
  await knex("sub_category").del();
  await knex("category").del();
  await knex("color").del();
  await knex("model").del();


  // Inserts seed entries

  await knex("model").insert([
    { id: 1, name: "iPhone 16 ProMax" },
    { id: 2, name: "iPhone 16 Pro" },
    { id: 3, name: "iPhone 16 Plus" },
    { id: 4, name: "iPhone 16" },
    { id: 5, name: "iPhone 15 ProMax" },
    { id: 6, name: "iPhone 15 Pro" },
    { id: 7, name: "iPhone 15 Plus" },
    { id: 8, name: "iPhone 15" },
    { id: 9, name: "iPhone 14 ProMax" },
    { id: 10, name: "iPhone 14 Pro" },
    { id: 11, name: "iPhone 14 Plus" },
    { id: 12, name: "iPhone 14" },
    { id: 13, name: "iPhone 13 ProMax" },
    { id: 14, name: "iPhone 13 Pro" },
    { id: 15, name: "iPhone 13 Plus" },
    { id: 16, name: "iPhone 13" },
  ]);

  await knex("color").insert([
    { id: 1, name: "Desert Titanium" },
    { id: 2, name: "Natural Titanium" },
    { id: 3, name: "White Titanium" },
    { id: 4, name: "Black Titanium" },
    { id: 5, name: "Black" },
    { id: 6, name: "White" },
    { id: 7, name: "Pink" },
    { id: 8, name: "Teal" },
    { id: 9, name: "null" },
  ]);

  await knex("category").insert([
    { id: 1, category_name: "phoneCase" },
    { id: 2, category_name: "lensProtector" },
    { id: 3, category_name: "screenProtector" },
  ]);
  await knex("sub_category").insert([
    { id: 1, category_name: "ownBrand", category_id: 1 },
    { id: 2, category_name: "notOwnBrand", category_id: 1 },
    { id: 3, category_name: "cameraGuard", category_id: 2 },
    { id: 4, category_name: "lensGuard", category_id: 2 },
    { id: 5, category_name: "ar", category_id: 3 },
    { id: 6, category_name: "privacy", category_id: 3 },
    { id: 7, category_name: "antiBlue", category_id: 3 },
    { id: 8, category_name: "antiFingerprint", category_id: 3 },
  ]);

  await knex("members").insert([
    {
      id: 1,
      username: "admin",
      password: "123123",
      phone: "97776888",
      address: "tuen mun ",
      email: "admin@gmail.com",
      admin: true,
    },
    {
      id: 2,
      username: "kees",
      password: "123123",
      phone: "98887666",
      address: "tuen mun",
      email: "kees@gmail.com",
      admin: false,
    },
    {
      id: 3,
      username: "victor",
      password: "123123",
      phone: "96668777",
      address: "tuen mun",
      email: "victor@gmail.com",
      admin: false,
    },
  ]);

  await knex("products").insert([
    {
      id: 1,
      product_name: "2.5D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTHY EYES",
      sub_category_id: 1,
      product_price: 120,
      custom_made: false,
    },
    {
      id: 2,
      product_name: "2.5D ANTI-FINGERPRINT WITH NANO COATING FOR GAME PLAYER",
      sub_category_id: 8,
      product_price: 120,
      custom_made: false,
    },
    {
      id: 3,
      product_name:
        "2.5D ANTI-REFLECTION FOR BETTER SCREEN CLARITY & COLOR VIBRANCY",
      sub_category_id: 5,
      product_price: 120,
      custom_made: false,
    },
    {
      id: 4,
      product_name:
        "2.5D 360 ° PRIVACY PROTECTING SCREEN PRIVATE FROM ALL SIDES",
      sub_category_id: 6,
      product_price: 120,
      custom_made: false,
    },
    {
      id: 5,
      product_name: "AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY",
      sub_category_id: 4,
      product_price: 70,
      custom_made: false,
    },
    {
      id: 6,
      product_name: "HD CAMERA GUARD FOR FULL COVERAGE",
      sub_category_id: 3,
      product_price: 80,
      custom_made: false,
    },
    {
      id: 7,
      product_name: "AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY",
      sub_category_id: 4,
      product_price: 80,
      custom_made: false,
    },
    {
      id: 8,
      product_name: "Flying Chess Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 9,
      product_name: "4D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTHY EYES",
      sub_category_id: 7,
      product_price: 120,
      custom_made: false,
    },
    //   {
    //     product_name: "Condom Phone Case ",
    //     sub_category_id: 1,
    //     product_price: 160,
    //     custom_made: false,
    //   },
    {
      id: 10,
      product_name: "Cheers Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 11,
      product_name: "Merry-Go-Meow Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 12,
      product_name: "Hai Lou Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 13,
      product_name: "Condom/2 Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 14,
      product_name: "Condom/3 Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 15,
      product_name: "Cat Nation Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 16,
      product_name: "Egg Puffs Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 17,
      product_name: "Purple Color Phone Case ",
      sub_category_id: 2,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 18,
      product_name: "Merry-Go-Meow Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 19,
      product_name: "Pink Color Phone Case ",
      sub_category_id: 2,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 20,
      product_name: "Contrasting Color Phone Case ",
      sub_category_id: 2,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 21,
      product_name: "Sky Blue Color Phone Case ",
      sub_category_id: 2,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 22,
      product_name: "Contrasting Color Phone Case ",
      sub_category_id: 2,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 23,
      product_name: "Contrasting Color Phone Case ",
      sub_category_id: 2,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 24,
      product_name: "Cat Nation Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 25,
      product_name: "Hai Lou Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
    {
      id: 26,
      product_name: "Cat Nation Phone Case ",
      sub_category_id: 1,
      product_price: 160,
      custom_made: false,
    },
  ]);

  await knex("product_option").insert([
    { id: 1, model_id: 4, color_id: 9, products_id: 1, product_quantity: 100 },
    { id: 2, model_id: 5, color_id: 9, products_id: 8, product_quantity: 100 },
    { id: 3, model_id: 4, color_id: 9, products_id: 2, product_quantity: 100 },
    { id: 4, model_id: 4, color_id: 9, products_id: 4, product_quantity: 100 },
    { id: 5, model_id: 4, color_id: 9, products_id: 3, product_quantity: 100 },
    { id: 6, model_id: 10, color_id: 4, products_id: 5, product_quantity: 100 },
    { id: 7, model_id: 3, color_id: 4, products_id: 7, product_quantity: 100 },
    { id: 8, model_id: 3, color_id: 1, products_id: 6, product_quantity: 100 },
    { id: 9, model_id: 5, color_id: 9, products_id: 9, product_quantity: 100 },
    {id: 10, model_id: 1, color_id: 9, products_id: 10, product_quantity: 100},
    {
      id: 11,
      model_id: 1,
      color_id: 9,
      products_id: 11,
      product_quantity: 100
    },
    {
      id: 12,
      model_id: 1,
      color_id: 9,
      products_id: 12,
      product_quantity: 100
    },
    {
      id: 13,
      model_id: 1,
      color_id: 9,
      products_id: 13,
      product_quantity: 100
    },
    {
      id: 14,
      model_id: 1,
      color_id: 9,
      products_id: 14,
      product_quantity: 100
    },
    {
      id: 15,
      model_id: 1,
      color_id: 9,
      products_id: 15,
      product_quantity: 100
    },
    {
      id: 16,
      model_id: 1,
      color_id: 9,
      products_id: 16,
      product_quantity: 100
    },
    {
      id: 17,
      model_id: 1,
      color_id: 9,
      products_id: 17,
      product_quantity: 100
    },
    {
      id: 18,
      model_id: 3,
      color_id: 9,
      products_id: 18,
      product_quantity: 100
    },
    {
      id: 19,
      model_id: 1,
      color_id: 9,
      products_id: 19,
      product_quantity: 100
    },
    {
      id: 20,
      model_id: 1,
      color_id: 9,
      products_id: 20,
      product_quantity: 100
    },
    {
      id: 21,
      model_id: 3,
      color_id: 9,
      products_id: 21,
      product_quantity: 100
    },
    {
      id: 22,
      model_id: 3,
      color_id: 9,
      products_id: 22,
      product_quantity: 100
    },
    {
      id: 23,
      model_id: 3,
      color_id: 9,
      products_id: 23,
      product_quantity: 100
    },
    {
      id: 24,
      model_id: 3,
      color_id: 9,
      products_id: 24,
      product_quantity: 100
    },
    {
      id: 25,
      model_id: 3,
      color_id: 9,
      products_id: 25,
      product_quantity: 100
    },
    {
      id: 26,
      model_id: 3,
      color_id: 9,
      products_id: 26,
      product_quantity: 100
    },
    { id: 27, model_id: 3, color_id: 1, products_id: 5, product_quantity: 100 },
    { id: 28, model_id: 3, color_id: 4, products_id: 7, product_quantity: 100 },
    { id: 29, model_id: 3, color_id: 8, products_id: 7, product_quantity: 100 },
    { id: 30, model_id: 3, color_id: 6, products_id: 7, product_quantity: 100 },
    { id: 31, model_id: 3, color_id: 9, products_id: 1, product_quantity: 100 },
    { id: 32, model_id: 2, color_id: 9, products_id: 1, product_quantity: 100 },
    { id: 33, model_id: 1, color_id: 9, products_id: 1, product_quantity: 100 },
    { id: 34, model_id: 3, color_id: 9, products_id: 2, product_quantity: 100 },
    { id: 35, model_id: 2, color_id: 9, products_id: 2, product_quantity: 100 },
    { id: 36, model_id: 1, color_id: 9, products_id: 2, product_quantity: 100 },
    { id: 37, model_id: 3, color_id: 9, products_id: 3, product_quantity: 100 },
    { id: 38, model_id: 2, color_id: 9, products_id: 3, product_quantity: 100 },
    { id: 39, model_id: 1, color_id: 9, products_id: 3, product_quantity: 100 },
    { id: 40, model_id: 3, color_id: 9, products_id: 4, product_quantity: 100 },
    { id: 41, model_id: 2, color_id: 9, products_id: 4, product_quantity: 100 },
    { id: 42, model_id: 1, color_id: 9, products_id: 4, product_quantity: 100 },
  ]);

  await knex("product_image").insert([
    { id: 1, product_id: 1, image_path: "/photos/products/antiBlue_16.jpg" },
    { id: 2, product_id: 2, image_path: "/photos/products/antiFingerprint_16.jpg"},
    { id: 3, product_id: 3, image_path: "/photos/products/ar_16.jpg" },
    { id: 4, product_id: 4, image_path: "/photos/products/privacy_16.jpg" },
    {
      id: 5,
      product_id: 5,
      image_path: "/photos/products/cameraIphonePro1.jpg"
    },
    {
      id: 6,
      product_id: 6,
      image_path: "/photos/products/cameraIphonePro7.jpg"
    },
    { id: 7, product_id: 7, image_path: "/photos/products/cameraIphone6.jpg" },
    { id: 8, product_id: 8, image_path: "/photos/products/case13To15_1.jpg" },
    { id: 9, product_id: 9, image_path: "/photos/products/case15_3.jpg" },
    { id: 10, product_id: 10, image_path: "/photos/products/case13To16_3.jpg" },
    { id: 11, product_id: 11, image_path: "/photos/products/case14To16_1.jpg" },
    { id: 12, product_id: 12, image_path: "/photos/products/case13To16_2.jpg" },
    { id: 13, product_id: 13, image_path: "/photos/products/case15_2.jpg" },
    { id: 14, product_id: 14, image_path: "/photos/products/case15_1.jpg" },
    { id: 15, product_id: 15, image_path: "/photos/products/case13To16_1.jpg" },
    { id: 16, product_id: 16, image_path: "/photos/products/case13To15_2.jpg" },
    {
      id: 17,
      product_id: 17,
      image_path: "/photos/products/case15To16NOB_PM_1.jpg"
    },
    { id: 18, product_id: 18, image_path: "/photos/products/case14To16_2.jpg" },
    {
      id: 19,
      product_id: 19,
      image_path: "/photos/products/case13To16NOB_PM_2.jpg"
    },
    {
      id: 20,
      product_id: 20,
      image_path: "/photos/products/case13To16NOB_PM_1.jpg"
    },
    {
      id: 21,
      product_id: 21,
      image_path: "/photos/products/case13To16NOB_3.jpg"
    },
    {
      id: 22,
      product_id: 22,
      image_path: "/photos/products/case13To16NOB_2.jpg"
    },
    {
      id: 23,
      product_id: 23,
      image_path: "/photos/products/case13To16NOB_1.jpg"
    },
    { id: 24, product_id: 24, image_path: "/photos/products/case13To16_6.jpg" },
    { id: 25, product_id: 25, image_path: "/photos/products/case13To16_5.jpg" },
    { id: 26, product_id: 26, image_path: "/photos/products/case13To16_4.jpg" },
    {
      id: 27,
      product_id: 5,
      image_path: "/photos/products/cameraIphonePro2.jpg"
    },
    { id: 28, product_id: 7, image_path: "/photos/products/cameraIphone3.jpg" },
    { id: 29, product_id: 7, image_path: "/photos/products/cameraIphone2.jpg" },
    { id: 30, product_id: 7, image_path: "/photos/products/cameraIphone1.jpg" },
    {
      id: 31,
      product_id: 1,
      image_path: "/photos/products/antiBlue_16Plus.jpg"
    },
    {
      id: 32,
      product_id: 1,
      image_path: "/photos/products/antiBlue_16Pro.jpg"
    },
    {
      id: 33,
      product_id: 1,
      image_path: "/photos/products/antiBlue_16ProMax.jpg"
    },
    {
      id: 34,
      product_id: 2,
      image_path: "/photos/products/antiFingerprint_16Plus.jpg"
    },
    {
      id: 35,
      product_id: 2,
      image_path: "/photos/products/antiFingerprint_16Pro.jpg"
    },
    {
      id: 36,
      product_id: 2,
      image_path: "/photos/products/antiFingerprint_16ProMax.jpg"
    },
    { id: 37, product_id: 3, image_path: "/photos/products/ar_16Plus.jpg" },
    { id: 38, product_id: 3, image_path: "/photos/products/ar_16Pro.jpg" },
    { id: 39, product_id: 3, image_path: "/photos/products/ar_16ProMax.jpg" },
    { id: 40, product_id: 4, image_path: "/photos/products/privacy_16Plus.jpg" },
    { id: 41, product_id: 4, image_path: "/photos/products/privacy_16Pro.jpg" },
    { id: 42, product_id: 4, image_path: "/photos/products/privacy_16ProMax.jpg" },
  ]);

  await knex("orders").insert([
    {
      id: 1,
      member_id: 3,
      total: 100,
      state: "Pending",
      stripe_id: 1,
      payment_type: "Cash",
    },
    {
      id: 2,
      member_id: 2,
      total: 200,
      state: "Completed",
      stripe_id: 2,
      payment_type: "Credit Card",
    },
    {
      id: 3,
      member_id: 2,
      total: 300,
      state: "Cancelled",
      stripe_id: 3,
      payment_type: "Credit Card",
    },
  ]);

  await knex("transaction").insert([
    { id: 1, order_id: 1, success: true, log: "", payment_type: "Cash" },
    {
      id: 2,
      order_id: 2,
      success: false,
      log: "",
      payment_type: "Credit Card",
    },
    {
      id: 3,
      order_id: 3,
      success: false,
      log: "",
      payment_type: "Credit Card",
    },
  ]);

  await knex("order_details").insert([
    { id: 1, product_id: 1, quantity: 1, product_price: 100, subtotal: 100 },
    { id: 2, product_id: 2, quantity: 3, product_price: 300, subtotal: 300 },
    { id: 3, product_id: 3, quantity: 5, product_price: 500, subtotal: 500 },
  ]);

  await knex("chat_box").insert([
    {
      id: 1,
      member_id: 2,
      user_message: "Hello, I want to ask something.",
      response_message: "",
    },
    {
      id: 2,
      member_id: 2,
      user_message: "",
      response_message: "What can i help you?",
    },
  ]);

  await knex("shopping_cart").insert([
    { id: 1, product_option_id: 1, member_id: 1, quantity: 2 },
    { id: 2, product_option_id: 2, member_id: 2, quantity: 3 },
    { id: 3, product_option_id: 3, member_id: 3, quantity: 3 },
    { id: 4, product_option_id: 6, member_id: 2, quantity: 3 },
    { id: 5, product_option_id: 7, member_id: 2, quantity: 3 },
  ]);

  await knex.raw("ALTER SEQUENCE shopping_cart_id_seq RESTART WITH 5;")  
  await knex.raw("ALTER SEQUENCE chat_box_id_seq RESTART WITH 2;")
  await knex.raw("ALTER SEQUENCE order_details_id_seq RESTART WITH 4;")
  await knex.raw("ALTER SEQUENCE transaction_id_seq RESTART WITH 4;")
  await knex.raw("ALTER SEQUENCE order_id_seq RESTART WITH 4;")
  await knex.raw("ALTER SEQUENCE product_image_id_seq RESTART WITH 43;")
  await knex.raw("ALTER SEQUENCE product_option_id_seq RESTART WITH 43;")
  await knex.raw("ALTER SEQUENCE products_id_seq RESTART WITH 27;")
  await knex.raw("ALTER SEQUENCE members_id_seq RESTART WITH 4;")
  await knex.raw("ALTER SEQUENCE sub_category_id_seq RESTART WITH 9;")
  await knex.raw("ALTER SEQUENCE category_id_seq RESTART WITH 4;")
  await knex.raw("ALTER SEQUENCE color_id_seq RESTART WITH 10;")
  await knex.raw("ALTER SEQUENCE model_id_seq RESTART WITH 17;")
}