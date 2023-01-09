import express from "express";
const authRouter = express.Router();

// Load Middleware
import isAuthenticated from "../middleware/auth";

// Load Controllers
import { loginAdmin, logoutAdmin } from "../controllers/auth";

if (process.env.NODE_ENV === 'production') {
    authRouter.post('/login', loginAdmin);
    authRouter.get('/logout', isAuthenticated, logoutAdmin);
} else {
    authRouter.post('/login', loginAdmin);
    authRouter.get('/logout', logoutAdmin);
}

export default authRouter;
