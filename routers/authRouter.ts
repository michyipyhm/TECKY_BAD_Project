import express from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { isLoggedIn, isAdmin } from "../utils/guards"

export const authRouter = express.Router();

const authService = new AuthService()
const authController = new AuthController(authService)

authRouter.post("/register", authController.registerNewMember)
authRouter.post("/login", authController.loginUser)

authRouter.get("/userinfo", isLoggedIn, authController.getUserInfo);
authRouter.post("/logout", isLoggedIn, authController.logoutUser);
authRouter.post("/editProfile", isLoggedIn, authController.editUserInfo);
authRouter.post("/changePassword", isLoggedIn, authController.changePassword);

authRouter.get("/getallItem", isAdmin, authController.getAllItem);
authRouter.post("/adminDeleteItem", isAdmin, authController.adminDeleteItem);
authRouter.post("/adminCopyItem", isAdmin, authController.adminCopyItem);
authRouter.get("/editProduct", isAdmin, authController.adminGetItem);
authRouter.post("/saveEditProduct", isAdmin, authController.saveEditProduct);
authRouter.get("/addProductSelect", isAdmin, authController.addProductSelect);
authRouter.post("/addNewProduct", isAdmin, authController.addNewProduct);





import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}