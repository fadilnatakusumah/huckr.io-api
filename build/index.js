"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./utils/db");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
(0, db_1.connectDB)();
// middlewares
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
}));
app.use((0, morgan_1.default)("dev"));
app.get("/", (_req, res) => res.json({ data: "Hello World" }));
app.use("/api", routes_1.default);
app.listen(PORT, () => console.log(`Server running at localhost:${PORT}`));
