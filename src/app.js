import express from "express";

import cookieParser from "cookie-parser";

import helmet from "helmet";

import rateLimit from "express-rate-limit";

import cors from "cors";

import learnerRoutes from "./routes/learner.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import commonRoutes from "./routes/common.route.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.set("trust proxy", 1);

// security middlewares
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 1000,

  message: {
    success: false,

    message: "Too many requests from this IP",
  },
});
// app.use(limiter);

// parsers

app.use(express.json());

app.use(cookieParser());

// cors

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
// routes

app.use("/api/v1/learner", learnerRoutes);

app.use("/api/v1/tutor", tutorRoutes);

app.use("/api/v1/session", sessionRoutes);

app.use("/api/v1/common", commonRoutes);

// global error middleware

app.use(errorMiddleware);

export default app;
