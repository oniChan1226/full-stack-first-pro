import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";

// declare routes
// http://localhost/${PORT}/api/v1/user/${logic}
app.use("/api/v1/users", userRouter);

export { app };