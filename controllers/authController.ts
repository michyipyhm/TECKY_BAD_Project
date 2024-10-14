import { AuthService } from '../services/authService'
import { Request, Response, NextFunction } from "express";

export class AuthController {
    constructor(private authService: AuthService) { this.authService = authService }

    registerNewMember = async (req: Request, res: Response) => {
        const data = req.body;

        try {
            const userId = await this.authService.registerNewMember(
                data.username,
                data.password,
                data.email,
            );
            // console.log(userId)
            req.session.userId = userId;
            res.json({ message: "Register successful" });
        } catch (error) {
            res.status(400).json({ message: "Register failed" });
        }
    }

    loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const userId = await this.authService.loginUser(email, password);

            req.session.userId = userId;
            console.log(req.session.userId);
            res.json({ message: "Login successful" });
        } catch (error) {
            res.status(400).json({ message: "Login failed" });
        }
    }

    getUserInfo = async (req: Request, res: Response) => {
        const userId = req.session.userId
        if (!userId) {
            res.status(401).json({ message: "Please login first." })
            return;
        }
        try {
            const userInfo = await this.authService.getUserInfo(Number(userId))
            res.json({ userInfo })
        } catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ message: error.message })
            } else {
                res.status(500).json({ message: "An unexpected error occurred." })
            }
        }
    }

    logoutUser = async (req: Request, res: Response) => {
        if (req.session.userId) {
            req.session.destroy((err) => {
                if (err) {
                    res.status(500).json({ message: "Failed to logout." });
                } else {
                    res.json({ message: "Logout successful." });
                }
            });
        } else {
            res.status(400).json({ message: "Please login first." });
        }
    }

    editUserInfo = async (req: Request, res: Response) => {
        const userId = req.session.userId;
        const { phone, address } = req.body;

        try {
            await this.authService.editUserInfo(Number(userId), phone, address);
            res.json({ message: "Data updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Fail to update user information" });
        }
    }

    changePassword = async (req: Request, res: Response) => {
        const userId = req.session.userId;
        const { oldPassword, newPassword } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Please login first." });
            return;
        }
        try {
            await this.authService.changePassword(Number(userId), oldPassword, newPassword);
            res.json({ message: "Password changed successfully" });
        } catch (error) {
            res.status(400).json({ message: "Fail to change password." });
        }
    }

    getAllItem = async (req: Request, res: Response) => {
        try {
            const allProductOptions = await this.authService.getAllItem()
            res.json(allProductOptions)
        } catch (error) {
            res.status(500).json({ message: "Failed to get products." })
        }
    }

    adminDeleteItem = async (req: Request, res: Response) => {
        const { id } = req.body
        const product_option_id = id
        try {
            await this.authService.adminDeleteItem(product_option_id);
            res.json({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: "Fail to delete product." });
        }
    }

    adminCopyItem = async (req: Request, res: Response) => {
        const { id } = req.body
        const product_option_id = id
        try {
            await this.authService.adminCopyItem(product_option_id)
            res.json({ message: "New Product created successfully" })
        } catch (error) {
            res.status(400).json({ message: "Fail to create new product." })
        }
    }

    adminGetItem = async (req: Request, res: Response) => {
        const product_option_id = req.query.product
        try {
            const result = await this.authService.adminGetItem(Number(product_option_id))
            res.json(result)
        }catch (error) {
            res.status(500).json({ message: "Failed to get product." })
        }
    }

    saveEditProduct = async (req: Request, res: Response) => {
        const { product_option_id, quantity, color_id, model_id } = req.body;
        console.log(req.body)
        try {
            await this.authService.saveEditProduct(product_option_id, quantity, color_id, model_id);
            res.json({ message: "Data updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Fail to update user information" });
        }
    }

    addProductSelect = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.addProductSelect()
            res.json(result)
        } catch (error) {
            res.status(500).json({ message: "Failed to get products." })
        }

    }

    addNewProduct = async (req: Request, res: Response) => {
        const { products_name, quantity, color_id, model_id, price, sub_category_id } = req.body
        try {
            await this.authService.addNewProduct(products_name, quantity, color_id, model_id, price, sub_category_id)
            res.json({ message: "New Product created successfully" })
        } catch (error) {
            res.status(400).json({ message: "Fail to create new product." })
        }
    }
}