/**
 * Filename: auth.ts
 *
 * Desc: Authentication and miscellaneous API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { supabase } from "../server";
import validator from "validator";
import { error } from "node:console";

const router = express.Router();

router.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", message: "we goood gng" });
});

router.post("/api/auth/signUp", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if(!email || !password){
    res.status(400).json({
      message: "Email and password are required.",
    });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({
      message: "Invalid Email Format",
    });
    return;
  }

  if(password.length < 4){
    res.status(400).json({
      message: "Password must be at least 4 characters long."
    });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // Supabase specific err
    if(error){
      res.status(400).json({
        message: error.message
      });
      return;
    }

    res.status(201).json({
        message: "User successfully created.",
        user: data.user,
        session: data.session,
    });

  } catch (error) {
    console.log("SignUp error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during signup.",
    });
  }
});

router.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if(!email || !password){
    res.status(400).json({
      message: "Email and password are required."
    });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({
      message: "Invalid Email Format",
    });
    return;
  }

  if (password.length < 4) {
    res.status(400).json({
      message: "Password must be at least 4 characters long.",
    });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if(error){
      res.status(400).json({
        message: error.message,
      });
      return;
    }
    
    res.status(201).json({
      message: "User successfully logged in.",
      user: data.user,
      session: data.session,
    });
  }

  catch(error){
    console.log("Sign in error: ", error);
    res.status(500).json({
      message: "An unexpected error occurred during signup.",
    });
  }
});

router.post("/api/auth/signOut", async (req: Request, res: Response) => {

  try {
    const { error } = await supabase.auth.signOut();
    if(error){
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(201).json({
      mesasge: "User logged out successfully.",
    });
  } 

  catch {
    console.log("SignOut Error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during signup.",
    });
  }
});

export default router;
