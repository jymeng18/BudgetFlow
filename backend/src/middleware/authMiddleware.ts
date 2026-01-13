/**
 * Filename: authMiddleware.ts
 *
 * Desc: Middleware to authenticate requests and extract user ID from JWT
 *
 * Author: Jerry Meng
 *
 * Last Modified: Jan 2026
 */

import { Request, Response, NextFunction } from "express";
import { supabase } from "../server";

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
}
