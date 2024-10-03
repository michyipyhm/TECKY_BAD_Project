import express, { Request, Response } from "express";
import formidable from 'formidable';
import { knex } from '../main';
<<<<<<< HEAD
=======
import { createTypeReferenceDirectiveResolutionCache } from "typescript";
>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a

export const userRouter = express.Router();

userRouter.post("/register", registerNewMember);
userRouter.post("/login", loginUser);
<<<<<<< HEAD

async function registerNewMember(req: Request, res: Response) {
userRouter.post("/register", async (req: Request, res: Response) => {
    
=======
userRouter.get("/userinfo", checkUserInfo);

async function registerNewMember(req: Request, res: Response) {
>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a
    const data = req.body;
    console.log(data)
    const username = data.username;
    const password = data.password;
    const phone = data.phone;
    const address = data.address;
    const email = data.email
<<<<<<< HEAD
    
=======

>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a
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
<<<<<<< HEAD
})
=======
}
>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a

async function loginUser(req: Request, res: Response) {

    const data = req.body
<<<<<<< HEAD
    const username = data.username
    const password = data.password //from client input

    const nameResult = await knex.select('username').from('members').where('username', username)
    if (nameResult.length == 0) {
        res.status(400).json({ message: "The username or password is incorrect." });
        return;
    } else {
        const passwordResult = await knex.select('username').from('members').where('password', password)
        res.status(400).json({ message: "The username or password is incorrect." });
        return;
    }
    req.session.userId = row.id
}}
=======
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
    const userResult =  await knex.select('*').from('members').where('id', userId)
    const userInfo = userResult[0]
    res.json({ userInfo })
}
>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a
