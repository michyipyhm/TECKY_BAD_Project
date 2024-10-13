import express, { Request, Response } from "express";
import { knex } from "../main";

export const productsRoutes = express.Router();

productsRoutes.get("/products/subcategory/", getProducts);
productsRoutes.get("/products", getProducts);
// productsRoutes.get("/filterProducts", filterProducts);

async function getProducts(req: Request, res: Response) {
  console.log("productsFilterRoutes.ts getProducts start");
  const { categoryType, subCategoryType, sorting } = req.query;
  console.log("sorting: ", sorting);
  // const { category_type } = req.query;
  console.log("productsFilterRoutes.ts getProducts hi 1.1");
  try {
    const product_image_result = knex
      .select("*")
      .distinctOn("product_id")
      .from("product_image")
      .as("image")
      .orderBy("product_id", "desc");

    const test = await product_image_result;

    console.log(
      "productsFilterRoutes.ts test:[" +
        test.length +
        "] product_image_result:[" +
        JSON.stringify(test) +
        "]"
    );

    const product_info_result = knex
      .select(
        "products.id as product_id",
        "image.image_path as image_path",
        "sub_category.category_name as sub_category_name",
        "category.category_name as category_name",
        "products.product_name as product_name",
        "products.product_price as product_price",
        "product_quantity",
        "po.created_at as created_at"
      )
      .from("product_option As po")
      .join("products", "products.id", "po.products_id")
      .join("sub_category", "sub_category.id", "products.sub_category_id")
      .join("category", "category.id", "sub_category.category_id")
      .join(
        knex
          .select("*")
          .distinctOn("product_id")
          .from("product_image")
          .as("image")
          .orderBy("product_id", "desc"),
        "products.id",
        "image.product_id"
      )
      .groupBy(
        "products.id",
        "image.image_path",
        "sub_category_name",
        "category.category_name",
        "product_name",
        "products.product_price",
        "product_quantity",
        "po.created_at"
      )
      .orderBy("created_at", "desc");
    if (categoryType) {
      product_info_result.where("category.id", categoryType);
    }
    if (sorting) {
      product_info_result.orderBy("products.product_price", sorting.toString());
    }
    if (subCategoryType) {
      product_info_result.where("sub_category.id", subCategoryType);
    }
    console.log("productsFilterRoutes.ts getProducts hi 3");

    const results = await product_info_result;

    console.log(
      "productsFilterRoutes.ts getProducts hi 4 results:[" +
        results.length +
        "]"
    );
    res.json(
      results.map((row: any) => ({
        id: row.product_id,
        product_name: row.product_name,
        product_price: row.product_price,
        image_path: row.image_path,
        product_id: row.product_id,
        product_type: row.product_type,
        category_name: row.category_name,
        product_quantity: row.product_quantity,
      }))
    );
  } catch (error) {
    console.log("error: [" + error + "]");
    res.status(500).json({
      message: "An error occurred while retrieving the product information.",
    });
  }
  console.log("productsFilterRoutes.ts getProducts end");
}
