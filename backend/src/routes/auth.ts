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
import {
  generateUserCategories,
  generateUserTransactions,
} from "../data/seedData";

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

  if(password.length < 6){
    res.status(400).json({
      message: "Password must be at least 6 characters long."
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

    const userId = data.user?.id;
    if (!userId) {
      res.status(400).json({
        message: "Failed to create user"
      });
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
      });
    
    if(profileError){
      res.status(400).json({
        message: profileError.message
      });
      return;
    }

    // Seed default categories for new user
    const userCategories = generateUserCategories(userId);
    const { error: categoriesError } = await supabase
      .from('categories')
      .insert(userCategories);

    if (categoriesError) {
      console.error("Categories seed error:", categoriesError);
      res.status(400).json({
        message: categoriesError.message
      });
      return;
    }

    // Seed default transactions for new user
    const userTransactions = generateUserTransactions(userId, userCategories);
    const { error: transactionsError } = await supabase
      .from('transactions')
      .insert(userTransactions);

    if (transactionsError) {
      console.error("Transactions seed error:", transactionsError);
      res.status(400).json({
        message: transactionsError.message
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

  if (password.length < 6) {
    res.status(400).json({
      message: "Password must be at least 6 characters long.",
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
    
    res.status(200).json({
      message: "User successfully logged in.",
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      },
    });
  }

  catch(error){
    console.log("Sign in error: ", error);
    res.status(500).json({
      message: "An unexpected error occurred during login.",
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

    res.status(200).json({
      message: "User logged out successfully.",
    });
  } 

  catch(error) {
    console.log("SignOut Error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during signout.",
    });
  }
});

export default router;
