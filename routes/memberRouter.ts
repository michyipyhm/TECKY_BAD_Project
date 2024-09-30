import express, { Request, Response } from "express";
import formidable from 'formidable';

import Knex from "knex";
const knexConfigs = require("../knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);　//knex instance

export const memberRouter = express.Router();


async function register(){

    // const reg = await knex.insert([
    //         {
    //             username: "admin", // username,
    //             password: "123123", // password,
    //             phone: "99887766", // phone,
    //             address: "HongKong", //address,
    //             email: "admin@admin.com", // email,
    //             admin: true
    //         }
    //     ]).into('members').returning('id')

        const result = await knex.select('username', 'email').from('members').where('username', 'admin')
        // const username = result.username
    // console.log(reg)
    console.log(result.length)
}
register()

memberRouter.post("/register", async (req: Request, res: Response) => {

    const data = req.body;
    const username = data.username;
    const password = data.password;
    const phone = data.phone;
    const address = data.address;
    const email = data.email

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


    await knex.insert([
        {
            username: username,
            password: password,
            phone: phone,
            address: address,
            email: email,
            admin: false
        }
    ]).into('members')

    // const sql_1 = `Select * from member where username = '${username}'`;
    // const userResult = await pgClient.query(sql_1);
    // const row = userResult.rows;
    // const rowCount = userResult.rowCount;
    // if (rowCount == null || rowCount > 0) {
    //   res.status(400).json({ message: "username exists in database" });
    //   return;
    // }
    // const sql = `INSERT INTO member (username, password, nickname, gender, birthday, phone, address, email) 
    //   VALUES ('${username}', '${await hashPassword(password)}', '${nickname}', '${gender}', '${birthday}', '${phone}', '${address}', '${email}')RETURNING id;`;
  
    // const insertResult = await pgClient.query(sql);
    // req.session.userId = insertResult.rows[0].id
    // res.json({ message: "Register successful" });
  });