import { Request, Response, NextFunction } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
//   if (req.session?.userId) {
//     next();
//   } else {
//     res.status(401).json({ message: "please login first" });
//     return;
//   }
    req.session.userId = "1"
    next()
};
