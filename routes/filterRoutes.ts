import express, { Request, Response } from "express";
import { knex } from "knex";

export const filter = express.Router();

filter.get("/getProduct", async (req: Request, res: Response) => {
  try {
    const product_info_result = await knex('product')
      .select(
        'product.product_id',
        'product_image.image_path',
        'product.product_name',
        'product.product_price',
        'product.product_quantity'
      )
      .join('product_image', 'product.id', 'product_image.product_id')
      .orderBy('created_at', 'desc');

    res.json(
      product_info_result.map((row:any) => ({
        id: row.product_id,
        product_name: row.product_name,
        product_price: row.product_price,
        image_path: row.image_path,
        product_id: row.product_id,
        product_quantity: row.product_quantity
        
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving the product information.",
    });
  }
});
