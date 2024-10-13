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
}