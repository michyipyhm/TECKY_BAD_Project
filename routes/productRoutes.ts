import express, { Request, Response, Router } from 'express';

export { knex } from "knex";
export const productRoutes = express.Router()

// productRoutes.get("/product", async (req, res) => {
//     const productId = req.query.product
//     try {
//         const productResult = await pgClient.query(
//             `SELECT * FROM product 
//                 JOIN product_image ON product.id = product_image.product_id 
//                 JOIN brand ON product.brand_id = brand.id
//                 JOIN origin ON product.origin_id = origin.id
//                 JOIN format ON product.format_id = format.id
//                 WHERE product.id = ${productId};`)

//         const data = productResult.rows[0]
//         res.status(200).json({ data })
//     } catch (err) {
//         res.status(500).send({ message: 'Faile' })
//     }
// })


const knex = require('knex');

productRoutes.get("/products", async (req, res) => {
    const productId = req.query.product;
    try {
        const data = await knex('products')
            .select('*')
            .join('product_image', 'products.id', '=', 'products_image.product_id')
            .where('products.id', productId)
            .first(); 

        res.status(200).json({ data });
    } catch (err) {
        res.status(500).send({ message: 'Failed' });
    }
});

module.exports = productRoutes;