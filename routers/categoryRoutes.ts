import express, { Request, Response } from "express";
import { knex } from "../main";

export const categoryRoutes = express.Router();

categoryRoutes.get("/category/:id/subcategory", getSubCategories);

async function getSubCategories(req: Request, res: Response) {
  const { id } = req.params;
  const result = await knex
    .select()
    .from("sub_category")
    .where("category_id", id);
  res.json(result);
  try {
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while retrieving the subCategories information.",
    });
  }
}
