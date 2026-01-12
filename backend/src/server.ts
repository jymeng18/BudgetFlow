/**
 * Filename: server.ts
 *
 * Desc: Backend Server for webapp
 *
 * Author: Jerry Meng
 *
 * Last modified: Dec 2025
 */

import dotenv from "dotenv"; // LOAD THIS FIRSTTTT
dotenv.config();

import express from "express";
import cors from "cors";
import router from "./routes/routes";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
