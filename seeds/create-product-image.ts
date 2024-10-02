import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("product_image").del();

    // Inserts seed entries
    await knex("product_image").insert([
        { product_id: 1, colName: "/photos/products/antiBlue_16.jpg" },
        { product_id: 2, colName: "/photos/products/antiFingerprint_16.jpg" },
        { product_id: 3, colName: "/photos/products/ar_16.jpg" },
        { product_id: 4, colName: "/photos/products/privacy_16.jpg" },
        { product_id: 5, colName: "/photos/products/cameraIphonePro1.jpg" },
        { product_id: 6, colName: "/photos/products/cameraIphonePro7.jpg" },
        { product_id: 7, colName: "/photos/products/cameraIphone1.jpg" },
        { product_id: 8, colName: "/photos/products/case13To15_1.jpg" }
    ]);
};
