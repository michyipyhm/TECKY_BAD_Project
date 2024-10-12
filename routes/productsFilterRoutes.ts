import express, { Request, Response } from "express";
import { knex } from "../main";

export const productsRoutes = express.Router();

productsRoutes.get("/products/subcategory/", getProducts)
productsRoutes.get("/products", getProducts);
// productsRoutes.get("/filterProducts", filterProducts);

async function getProducts(req: Request, res: Response) {
  const { categoryType, subCategoryType, sorting } = req.query;
  console.log("sorting: ", sorting);
  // const { category_type } = req.query;
  try {
    const product_info_result = knex
      .select(
        "products.id as product_id",
        "product_image.image_path",
        "sub_category.category_name as sub_category_name",
        "category.category_name as category_name",
        "model.name as model_name",
        "color.name as color_name",
        "products.product_name",
        "products.product_price",
        "product_quantity"
      )
      .from("product_option As po")
      .join("products", "products.id", "po.products_id")
      .join("color", "color.id", "po.color_id")
      .join("model", "model.id", "po.model_id")
      .join("sub_category", "sub_category.id", "products.sub_category_id")
      .join("category", "category.id", "sub_category.category_id")
      .join("product_image", "products.id", "product_image.product_id")
      .orderBy("po.created_at", "desc");
    if (categoryType) {
      product_info_result.where("category.id", categoryType);
    }
    if (sorting) {
      product_info_result.orderBy("products.product_price", sorting.toString());
    }
    if (subCategoryType) {
      product_info_result.where("sub_category.id", subCategoryType);
    }

    const results = await product_info_result;
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
    res.status(500).json({
      message: "An error occurred while retrieving the product information.",
    });
  }
}
