import express, { Request, Response } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { isLoggedIn, isAdmin } from "../utils/guards";

// inheritance
export class CustomError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export const authRouter = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

function errorWrapper(controllerMethod: any) {
  return async function (req: Request, res: Response) {
    try {
      console.log("hi");
      await controllerMethod(req, res);
    } catch (error) {
      console.log("caught");
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ message: error.message });
      else res.status(500).json({ message: "Internal Error" });
    }
  };
}

authRouter.post("/register", errorWrapper(authController.registerNewMember));
authRouter.post("/login", authController.loginUser);

authRouter.get("/userinfo", authController.getUserInfo);
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
