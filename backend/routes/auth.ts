import express from "express";
const authRouter = express.Router();

// Load Middleware
import isAuthenticated from "../middleware/auth";

// Load Controllers
import { loginAdmin, logoutAdmin } from "../controllers/auth";

authRouter.post('/login', loginAdmin);

authRouter.get('/logout', isAuthenticated, logoutAdmin);

export default authRouter;
