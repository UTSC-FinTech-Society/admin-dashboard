import express from "express";
import asyncHandler from "express-async-handler";
import News from "../models/News";
import { sendError } from "../middleware/error";

const getAllNews = asyncHandler(async (req: express.Request, res: express.Response) => {
    const news = await News.findAll();
    res.status(200).json({ success: true, allNews: news });
});

const getSingleNews = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { news_id } = req.params;

    const news = await News.findByPk(news_id);

    if (!news) {
        sendError(400, 'Event does not exist', next);
    }

    res.status(200).json({ success: true, news: news });
});

const createNews = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { title, content, author } = req.body as { title: string, content: string, author: string };
    const picture_type = req.file?.mimetype as string;
    const picture_data = req.file?.buffer as ArrayBuffer;

    if (!title || !content || !author || !picture_type || !picture_data) {
        sendError(400, 'Please provide all required fields', next);
    }

    const news = await News.create({ title, content, picture_type, picture_data , author, created_at: new Date() });
    res.status(201).json({ success: true, message: 'A news has been successfully created', news });
});

const updateNews = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { news_id } = req.params;
    const { title, content, author } = req.body as { title?: string, content?: string, author?: string };
    const picture_type = req.file?.mimetype as string | undefined;
    const picture_data = req.file?.buffer as ArrayBuffer | undefined;

    const news = await News.findByPk(news_id);

    if (!news) {
        sendError(400, 'Event does not exist', next);
    }

    if (title) news!.title = title;
    if (content) news!.content = content;
    if (picture_type) news!.picture_type = picture_type;
    if (picture_data) news!.picture_data = picture_data;
    if (author) news!.author = author;

    await news?.save();

    res.status(200).json({ success: true, message: 'Selected news has been successfully updated', news });
});

const deleteNews = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { news_id } = req.params;

    const news = await News.findByPk(news_id);

    if (!news) {
        sendError(400, 'Event does not exist', next);
    }

    await news?.destroy();

    res.status(200).json({ success: true, message: 'Selected news has been successfully deleted'});
});

export { getAllNews, getSingleNews, createNews, updateNews, deleteNews };