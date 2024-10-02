import express, { Request, Response } from "express";
import formidable from 'formidable';
import { knex } from '../main';

export const memberRouter = express.Router();

memberRouter.post("/register", registerNewMember);
// memberRouter.post("/login", login);

async function registerNewMember(req: Request, res: Response){

    const data = req.body;
    const username = data.username;
    const password = data.password;
    const phone = data.phone;
    const address = data.address;
    const email = data.email你

    const nameResult = await knex.select('username').from('members').where('username', username)
    if (nameResult.length > 0) {
      res.status(400).json({ message: "Username has been registered." });
      return;
    }
    const emailResult = await knex.select('email').from('members').where('email', email)
    if (emailResult.length > 0) {
        res.status(400).json({ message: "Email has been registered." });
        return;
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