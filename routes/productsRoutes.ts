import express, { Request, Response } from "express";
import formidable from "formidable";
import { knex } from "../main";

import { createTypeReferenceDirectiveResolutionCache } from "typescript";
export const productsRoutes = express.Router();
// export const userRouter = express.Router();
productsRoutes.get("/products", getProducts);
productsRoutes.get("/products", filterProducts);

async function getProducts(req: Request, res: Response) {
  try {
    const product_info_result = await knex
      .select(
        "product_image.image_path",
        "category_name as product_type",
        "category_type",
        "model.name as model_name",
        "color.name as color_name",
        "products.product_name",
        "products.product_price",
        "products.product_quantity"
      )
      .from("product_option As po")
      .join("products", "products.id", "po.products_id")
      .join("color", "color.id", "po.color_id")
      .join("model", "model.id", "po.model_id")
      .join("category", "category.id", "category_id")
      .join("product_image", "products.id", "product_image.product_id")
      .orderBy("po.created_at", "desc");

    res.json(
      product_info_result.map((row: any) => ({
        id: row.product_id,
        product_name: row.product_name,
        product_price: row.product_price,
        image_path: row.image_path,
        product_id: row.product_id,
        product_quantity: row.product_quantity,
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving the product information.",
    });
  }
}

let flow_one_phoneCase = ["category_name", "category_type", "model"];

let flow_two_lensProtector = ["category_name", "category_type", "color"];

let flow_three_screenProtector = ["category_name", "category_type", "model"];
async function filterProducts(req: Request, res: Response) {
  try {
    const query = await knex ("products")
      .select(
        "product_image.image_path",
        "category_name as product_type",
        "category_type",
        "model.name as model_name",
        "color.name as color_name",
        "products.product_name",
        "products.product_price",
        "products.product_quantity"
      )
      .from("product_option As po")
      .join("products", "products.id", "po.products_id")
      .join("color", "color.id", "po.color_id")
      .join("model", "model.id", "po.model_id")
      .join("category", "category.id", "category_id")
      .join("product_image", "products.id", "product_image.product_id")
      .orderBy("po.created_at", "desc");

    // const { request, response } = require("express"); // 确保导入 express 中的 request 和 response
    const knex = require("knex")(/* 配置数据库连接 */);

    // 添加过滤条件
    if (Object.keys(req.body).length > 0) {
      Object.keys(req.body).forEach((key, index) => {
        // 忽略 price_order 字段
        if (key === "price_order") return;

        query.where(key, req.body[key]);
      });
    }

    // 处理价格排序
    if (req.body.price_order === "dec") {
      query.orderBy("product_price", "desc");
    } else if (req.body.price_order === "asc") {
      query.orderBy("product_price", "asc");
    }

    // 执行查询
    const products = await query;

    let lastCriteria =
      Object.keys(req.body).length > 0
        ? Object.keys(req.body)[Object.keys(req.body).length - 1]
        : "none";

    // 处理条件流逻辑
    let nextCriteria;
    let destined_flow;

    if (req.body.category_name === "phoneCase") {
      // destined_flow = req.body.category_name === 'digital' ? flow_one_Digital : flow_one_Analog;
      destined_flow = flow_one_phoneCase;
    } else if (req.body.category_name === "lensProtector") {
      destined_flow = flow_two_lensProtector;
    } else {
      destined_flow = flow_three_screenProtector;
      // (req.body.category_name === "screenProtector")
    }

    let currentIndex = destined_flow.findIndex((step) => step === lastCriteria);

    nextCriteria = destined_flow[currentIndex + 1];

    let nextOptions = [];
    if (nextCriteria) {
      // 获取下一个标准的选项
      const optionQuery = knex("products")
        .select(
          "product_image.image_path",
          "category_name as product_type",
          "category_type",
          "model.name as model_name",
          "color.name as color_name",
          "products.product_name",
          "products.product_price",
          "products.product_quantity"
        )
        .from("product_option As po")
        .join("products", "products.id", "po.products_id")
        .join("color", "color.id", "po.color_id")
        .join("model", "model.id", "po.model_id")
        .join("category", "category.id", "category_id")
        .join("product_image", "products.id", "product_image.product_id")
        .orderBy("po.created_at", "desc");

      // 添加相同的过滤条件
      Object.keys(req.body).forEach((key) => {
        if (key === "price_order") return;
        optionQuery.where(key, req.body[key]);
      });

      // 使用 GROUP BY
      optionQuery.groupBy(nextCriteria);

      nextOptions = await optionQuery;
    }

    // 返回过滤结果
    res.status(200).json({
      nextCriteria: nextCriteria || "",
      nextOptions: nextOptions,
      products: products,
      priceOrder: req.body.price_order,
    });
  } catch (err) {
    console.error("error is", err);
    res.status(500).json({ message: "filter error" });
  }
}

