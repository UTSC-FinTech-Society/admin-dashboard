import express from "express";
const newsRouter = express.Router();

// Load Middleware
import isAuthenticated from "../middleware/auth";

// Load Multer
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load Controllers
import { getAllNews, getSingleNews, createNews, updateNews, deleteNews } from "../controllers/news";

newsRouter.route('/').get(getAllNews).post([isAuthenticated, upload.single('picture')], createNews);

newsRouter.route('/:news_id').get(getSingleNews).put([isAuthenticated, upload.single('picture')], updateNews).delete(isAuthenticated, deleteNews);

export default newsRouter;