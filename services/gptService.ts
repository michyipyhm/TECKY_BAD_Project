import { knex } from "../main"

export class GptService {
    constructor() { }

    checkProduct = async (model: string, category: string, color: string) => {
        model = model?.toLowerCase().split(' ').join('')
        category = category?.toLowerCase().split(' ').join('')
        color = color?.toLowerCase().split(' ').join('')

        console.log({ model, category, color })

        try {
            const categoryResults = await knex("category")
                .select("id")
                .whereRaw("LOWER(REPLACE(category_name, ' ', '')) like ?", [`%${category}`]);
            // .where("category_name", category.toLowerCase().split(' ').join(''))

            const reqModel = await knex("model")
                .select("id")
                .whereRaw("LOWER(REPLACE(name, ' ', '')) like ?", [`%${model}`]);
            // .where("name", model.toLowerCase().split(' ').join(''))

            const reqColor = await knex("color")
                .select("id")
                .whereRaw("LOWER(REPLACE(name, ' ', '')) like ?", [`%${color}`]);
            // .where("name", color.toLowerCase().split(' ').join(''))



            const categoryIds = categoryResults.map(item => item.id)
            const reqModelIds = reqModel.map(item => item.id)
            const reqColorIds = reqColor.map(item => item.id)

            // console.log({reqColorIds})

            const reqProducts = knex('product_option')
                .select("product_option.id as product_option_id",
                    "product_option.model_id", "model.name as model_name",
                    "product_option.color_id", "color.name as color_name",

                    "products.id as product_id", " products.product_name as product_name",
                    "sub_category.id as sub_category_id", "sub_category.category_name as sub_category_name",
                    "category.id as category_id", "category.category_name as category_name"
                )
                .join("model", "model.id", "product_option.model_id")
                .join("color", "color.id", "product_option.color_id")

                .join("products", "products.id", "product_option.products_id")
                .join("product_image", "products.id", "product_image.product_id")
                .join("sub_category", "sub_category.id", "products.sub_category_id")
                .join("category", "category.id", "sub_category.category_id")
            console.log({ categoryIds, reqColorIds, reqModelIds })

            // if (categoryIds.length > 0) {
            reqProducts.whereIn("category.id", categoryIds)
            // }
            // if (reqColorIds.length > 0) {
            reqProducts.whereIn("product_option.color_id", reqColorIds)
            // }
            // if (reqModelIds.length > 0) {
            reqProducts.whereIn("product_option.model_id", reqModelIds)
            // }
            const products = await reqProducts
            return products
            // res.json({reqModel, reqColor, productIds, categoryResults, productResults});
        } catch (error) {
            throw error
        }
    }
}
