import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries //Testing only!!! Do not do this in production
    await knex("category").del();
    await knex("products").del();

    // Inserts seed entries
    await knex("category").insert([
        { category_name: 'phoneCase', category_type: "ownBrand" },
        { category_name: 'phoneCase', category_type: "notOwnBrand" },
        { category_name: 'lensProtector', category_type: "cameraGuard" },
        { category_name: 'lensProtector', category_type: "lensGuard" },
        { category_name: 'screenProtector', category_type: "ar" },
        { category_name: 'screenProtector', category_type: "privacy" },
        { category_name: 'screenProtector', category_type: "antiBlue" },
        { category_name: 'screenProtector', category_type: "antiFingerprint" },
    ]);

    await knex("products").insert([
        {
            product_name: "2.5D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTHY EYES",
            category_id: "7",
            phone_type: "iPhone16ProMax",
            color: "",
            product_price: "100",
            product_quantity: "100"
        },
        {
            product_name: 'phoneCase', category_id: "ownBrand",
            phone_type: "", color: "",
            product_price: "", product_quantity: ""
        },
        {
            product_name: 'phoneCase', category_id: "ownBrand",
            phone_type: "", color: "",
            product_price: "", product_quantity: ""
        },
        {
            product_name: 'phoneCase', category_id: "ownBrand",
            phone_type: "", color: "",
            product_price: "", product_quantity: ""
        },
    ]);
};
