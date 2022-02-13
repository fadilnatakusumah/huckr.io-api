import express, { Response } from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

import APIRoutes from "./routes";
import { connectDB } from "./utils/db";

const app = express();

const PORT = process.env.PORT || 4000;

connectDB();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(morgan("dev"));

app.get("/", (_req, res: Response) => res.json({ data: "Hello World" }));
app.use("/api", APIRoutes);

app.listen(PORT, () => console.log(`Server running at localhost:${PORT}`));
