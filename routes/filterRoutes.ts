import express, { Request, Response } from "express";
import { knex } from "knex";

export const filter = express.Router();

filter.get("/getProduct", async (req: Request, res: Response) => {
  try {
    const product_info_result = await knex('products')
      .select(
        'products.product_id',
        'product_image.image_path',
        'model.name',
        'color.name',
        'products.product_name',
        'products.product_price',
        'products.product_quantity'
      )
      .join('product_image', 'products.id', 'product_image.product_id')
      .join('product_option', 'products.id', 'product_option.product_id')
      .join('product_option','color.id','product_option.color.id')
      .join('product_option','color.id','product_option.model.id')
      .join('products','category.id','products.category_id')
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

let flow_one = ["product_type", "camera_type"];

let flow_one_phoneCase = [
  "camera_type",
  "is_used",
  "origin_country",
  "brand_name",
  "product_type",
];

let flow_two_lensProtector = [
  "product_type",
  "camera_type",
  "is_used",
  "iso",
  "origin_country",
  "brand_name",
];

let flow_three_screenProtector = [
  "product_type",
  "format_name",
  "iso",
  "origin_country",
  "brand_name",
];

filter.post("/filter", async (req: Request, res: Response) => {
  

  let query = knex('products')
    .select('products.*', 
      'product_image.image_path', 
      'model.name', 
      'color.name', 
      'product_option.product_id',)
    .join('product_image', 'product.id', 'product_image.product_id')
    .join('brand', 'product.brand_id', 'brand.id')
    .join('origin', 'product.origin_id', 'origin.id')
    .join('format', 'product.format_id', 'format.id');

  if (Object.keys(req.body).length > 0) {
    // 添加条件
    let whereConditions = {};

    for (let key in req.body) {
      if (key === "price_order") continue; // 忽略 price_order
      whereConditions[key] = req.body[key]; // 将条件加入对象
    }

    query.where(whereConditions);
  }

  // 处理价格排序
  if (req.body.price_order === "dec") {
    query.orderBy('product_price', 'desc');
  } else if (req.body.price_order === "asc") {
    query.orderBy('product_price', 'asc');
  }

  

  let products;
  try {
    products = await query; // 执行查询
  } catch (err) {
    
    return res.status(500).json({ message: "filter error 1" });
  }

  let ObjectArray = Object.keys(req.body);
  let lastCriteria = ObjectArray.length > 0 ? ObjectArray[ObjectArray.length - 1] : "none";
  

  let nextCriteria;
  let destined_flow;

  // 处理产品类型流
  if (req.body.product_type === "camera") {
    destined_flow = req.body.camera_type === "digital" ? flow_one_phoneCase : flow_two_lensProtector;
  } else {
    destined_flow = flow_three_screenProtector;
  }

  let currentIndex = destined_flow.findIndex((step) => step === lastCriteria);
  nextCriteria = destined_flow[currentIndex + 1];

  let nextOptions: any[];
  if (!nextCriteria) {
    nextOptions = [];
  } else {
    // 查询下一个选项
    let optionQuery = knex('product')
      .select(nextCriteria)
      .join('product_image', 'product.id', 'product_image.product_id')
      .join('brand', 'product.brand_id', 'brand.id')
      .join('origin', 'product.origin_id', 'origin.id')
      .join('format', 'product.format_id', 'format.id');

    if (Object.keys(req.body).length > 0) {
      whereConditions = {};
      for (let key in req.body) {
        if (key === "price_order") continue; // 忽略 price_order
        whereConditions[key] = req.body[key]; // 将条件加入对象
      }
      optionQuery.where(whereConditions);
      optionQuery.groupBy(nextCriteria); // 分组
    }

    

    try {
      nextOptions = await optionQuery; // 执行查询
      console.log("nextOptions are", nextOptions);
    } catch (err) {
      res.status(500).json({ message: "filter error 2" });
      return;
    }
  }

  res.status(200).json({
    nextCriteria: nextCriteria,
    nextOptions: nextOptions,
    products: products,
    priceOrder: req.body.price_order,
  });
  return;
});