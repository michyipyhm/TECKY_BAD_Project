import express, { Request, Response } from "express";
import formidable from 'formidable';
import { knex } from '../main';
import { createTypeReferenceDirectiveResolutionCache } from "typescript";

export const userRouter = express.Router();

userRouter.post("/register", registerNewMember);
userRouter.post("/login", loginUser);
userRouter.get("/userinfo", checkUserInfo);
userRouter.post("/logout", logoutUser);

async function registerNewMember(req: Request, res: Response) {
    const data = req.body;
    console.log(data)
    const username = data.username;
    const password = data.password;
    const phone = data.phone;
    const address = data.address;
    const email = data.email
    const nameResult = await knex.select('username').from('members').where('username', username)
    if (nameResult.length > 0) {
        res.status(400).json({ message: "Username has been registered." });
        return;
    } else {
        const emailResult = await knex.select('email').from('members').where('email', email)
        if (emailResult.length > 0) {
            res.status(400).json({ message: "Email has been registered." });
            return;
        }
    }

    const insertResult = await knex.insert([
        {
            username: username,
            password: password,
            phone: phone,
            address: address,
            email: email,
            admin: false
        }
    ]).into('members').returning('id')
    req.session.userId = insertResult[0].id
    res.json({ message: "Register successful" });
}

async function loginUser(req: Request, res: Response) {

    const data = req.body
    const email = data.email
    const password = data.password

    const emailResult = await knex.select('*').from('members').where('email', email).returning('id')
    if (emailResult.length == 0) {
        res.status(400).json({ message: "The email or password is incorrect." });
        return;
    } else {
        const passwordResult = await knex.select('username').from('members').where('password', password)
        if (!passwordResult) {
            res.status(401).json({ message: "The username or password is incorrect." });
            return
        }
        req.session.userId = emailResult[0].id
        console.log(req.session.userId)
        res.json({ message: "Login successful" });
    }
}

async function checkUserInfo(req: Request, res: Response) {
    const userId = req.session.userId
    if (!userId) {
        res.status(401).json({ message: "Please login first." });
        return;
    }
    const userResult = await knex.select('*').from('members').where('id', userId)
    const userInfo = userResult[0]
    res.json({ userInfo })
}

async function logoutUser(req: Request, res: Response) {
    if (req.session.userId) {
        req.session.destroy(() => {
            res.json({ message: "Logout successful." })
        })
    } else {
        res.json({ message: "Please login first." })
    }
}