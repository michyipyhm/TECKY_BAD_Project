import { knex } from "../main";
import { hashPassword, checkPassword } from '../utils/hash'

export class AuthService {
    [x: string]: any;
    constructor() { }

    registerNewMember = async (username: string, password: string, email: string) => {
        //check username 有無重覆
        const usernameResult = await knex("members")
            .select("username")
            .where("username", username)
        if (usernameResult.length > 0) {
            throw new Error("Username has been registered.")
        }

        // check email 有無重覆
        const emailResult = await knex("members")
            .select("email")
            .where("email", email)
        if (emailResult.length > 0) {
            throw new Error("Email has been registered.")
        }

        // insert 資料
        const hashedPassword = await hashPassword(password)
        const insertResult = await knex("members")
            .insert([
                {
                    username: username,
                    password: hashedPassword,
                    email: email,
                    admin: false,
                },
            ])
            .returning("id")
        return insertResult[0].id
    }

    loginUser = async (email: string, password: string) => {
        // check email 是否存在
        const emailResult = await knex("members")
            .select("*")
            .where("email", email)
        if (emailResult.length === 0) {
            throw new Error("The email or password is incorrect.")
        }

        // check password 是否正確
        const isPasswordValid = await checkPassword({
            plainPassword: password,
            hashedPassword: emailResult[0].password,
        })
        if (!isPasswordValid) {
            throw new Error("The email or password is incorrect.");
        }
        return emailResult[0].id

    }

    getUserInfo = async (userId: number) => {
        // 用userId 去check 資料
        const userResult = await knex("members")
            .select("*")
            .where("id", userId)
        if (userResult.length === 0) {
            throw new Error("User not found.")
        }
        return userResult[0];
    }

    editUserInfo = async (userId: number, phone: string, address: string) => {
        await knex("members")
            .update({
                phone: phone,
                address: address
            })
            .where("id", userId);
    }

    changePassword = async (userId: number, oldPassword: string, newPassword: string) => {
        const user = await knex("members")
            .select("password")
            .where("id", userId)
            .first()

        const isPasswordValid = await checkPassword({
            plainPassword: oldPassword,
            hashedPassword: user.password
        })

        if (!isPasswordValid) {
            throw new Error("Old password is incorrect.")
        }

        const hashedNewPassword = await hashPassword(newPassword)

        await knex("members")
            .update({ password: hashedNewPassword })
            .where("id", userId);
    }

    getAllItem = async () => {
        const allItemResult = await knex('product_option')
            .select(
                "product_option.id as product_option_id",
                "product_option.model_id",
                "model.name as model_name",
                "product_option.color_id",
                "color.name as color_name",
                "products.id as product_id",
                "products.product_name as product_name",
                "sub_category.id as sub_category_id",
                "sub_category.category_name as sub_category_name",
                "category.id as category_id",
                "category.category_name as category_name"
            )
            .join("model", "model.id", "product_option.model_id")
            .join("color", "color.id", "product_option.color_id")
            .join("products", "products.id", "product_option.products_id")
            .join("sub_category", "sub_category.id", "products.sub_category_id")
            .join("category", "category.id", "sub_category.category_id");

        return allItemResult;
    }

    adminDeleteItem = async (product_option_id: number) => {
        const deleteProduct = await knex('product_option')
            .where('product_option.id', product_option_id)
            .del();
        if (!deleteProduct) {
            throw new Error('Product not found');
        }
    }

    adminCopyItem = async (product_option_id: number) => {
        try {
            // 查找原商品
            const copyProduct = await knex('product_option')
                .where('product_option.id', product_option_id)
                .first();

            if (!copyProduct) {
                throw new Error('Product not found');
            }

            // 插入新商品，複製相應字段
            const [newProductId] = await knex('product_option')
                .insert({
                    model_id: copyProduct.model_id,
                    color_id: copyProduct.color_id,
                    products_id: copyProduct.products_id,
                    product_quantity: copyProduct.product_quantity
                })
                .returning('id')

            return newProductId
        } catch (error) {
            console.error("Error copying product:", error);
            throw new Error("Failed to copy product.");
        }
    }

    adminGetItem = async (product_option_id: number) => {
        const queryProduct = await knex('product_option')
            .select(
                "product_option.id as product_option_id",
                "product_option.model_id",
                "model.name as model_name",
                "product_option.color_id",
                "color.name as color_name",
                "products.id as product_id",
                "products.product_name as product_name",
                "sub_category.id as sub_category_id",
                "sub_category.category_name as sub_category_name",
                "category.id as category_id",
                "category.category_name as category_name"
            )
            .join("model", "model.id", "product_option.model_id")
            .join("color", "color.id", "product_option.color_id")
            .join("products", "products.id", "product_option.products_id")
            .join("sub_category", "sub_category.id", "products.sub_category_id")
            .join("category", "category.id", "sub_category.category_id")
            .where("product_option.id", product_option_id)

        const imagePath = await knex('product_image')
            .select('*')
            .where('product_id', queryProduct[0].product_id)

        const result = {
            product: queryProduct[0],
            images: imagePath
        }

        return result
    }
}