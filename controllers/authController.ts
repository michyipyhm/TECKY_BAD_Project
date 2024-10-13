import { AuthService } from '../services/authService'
import { Request, Response } from "express";

export class AuthController {
    constructor(private authService: AuthService) { }

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
}