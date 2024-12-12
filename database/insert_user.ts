import { hashPassword } from "../utils/hash";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pgClient = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
});

pgClient.connect();

let users = [
  {
    username: "michael",
    password: "12345678",
    nickname: "mick",
    email: "michael@example.com",
  },
  {
    username: "victor",
    password: "12345678",
    nickname: "vic",
    email: "victor@example.com",
  },
  {
    username: "kees",
    password: "12345678",
    nickname: "k",
    email: "kees@example.com",
  },
];
async function insertUser() {
  for (let user of users) {
    await pgClient.query(
      `INSERT INTO member (username,password,nickname,email) VALUES ('${
        user.username
      }','${await hashPassword(user.password)}','${user.nickname}','${
        user.email
      }')`
    );
  }

  console.log("insert member done");
}

// async function insertAdmin() {
//   await pgClient.query(
//     `INSERT INTO admin (admin_name,password) VALUES ('admin1','${await hashPassword(
//       "12345678"
//     )}')`
//   );
//   console.log("insert admin done");
// }

// INSERT INTO admin (admin_name,password)
//     VALUES ('admin1', '12345678');

async function main() {
  await insertUser();
//   await insertAdmin();
  pgClient.end();
}

main();
