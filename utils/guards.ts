import { Request, Response, NextFunction } from 'express'
import { knex } from "../main";


export const isLoggedIn = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.session?.userId) {
        next()
    } else {
        res.send(`
            <script>
                alert("Please login first.");
                window.location.href = "/index.html";
            </script>
        `);
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.session?.userId) {
        try {
            const user = await knex('members').where({ id: req.session.userId }).first();
            if (user?.admin) {
                next();
            } else {
                res.status(403).json({ message: 'Access denied. Admins only.' });
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        res.status(401).json({ message: 'Please login first.' });
    }
};