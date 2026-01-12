/**
 * Filename: auth.ts
 *
 * Desc: Authentication and miscellaneous API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { supabase } from "../server";

const router = express.Router();

router.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", message: "we goood gng" });
});

router.post("/api/auth/signUp", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
});

router.post("/api/auth/signOut", async (req: Request, res: Response) => {
  const { error } = await supabase.auth.signOut();
});

export default router;
