import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "passport";

const app = express();

// .env config
import dotenv from "dotenv";
dotenv.config();

// Connect DB
import connectDB from "./utils/db";
connectDB();

// Passport config
import initializeAuth from "./utils/passport";
initializeAuth();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT_URLS?.split(','), credentials: true }));
app.use(morgan('dev'));
app.set('trust proxy', 1);
app.use(session({ secret: process.env.SESSION_SECRET!, resave: true, saveUninitialized: true, cookie: { maxAge: 60 * 60 * 1000, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' }}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Routes
import authRouter from "./routes/auth";
import adminsRouter from "./routes/admins";
import membersRouter from "./routes/members";
import eventsRouter from "./routes/events";
import newsRouter from "./routes/news";

app.use('/api/auth', authRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/members', membersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/news', newsRouter);

// Handle Error
import errorHandler from "./middleware/error";
app.use(errorHandler);

// Server frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req: express.Request, res: express.Response) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));