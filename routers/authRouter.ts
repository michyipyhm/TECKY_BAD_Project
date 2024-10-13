import express from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";

export const authRouter = express.Router();

const authService = new AuthService()
const authController = new AuthController(authService)

authRouter.post("/register", authController.registerNewMember)
authRouter.post("/login", authController.loginUser)
authRouter.get("/userinfo", authController.getUserInfo);
authRouter.post("/logout", authController.logoutUser);
authRouter.post("/editProfile", authController.editUserInfo);
authRouter.post("/changePassword", authController.changePassword);

import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}