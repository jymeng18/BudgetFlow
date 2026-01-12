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
import router from "./routes/index";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);