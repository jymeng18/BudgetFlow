/**
 * Filename: auth.ts
 *
 * Desc: Authentication and miscellaneous API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", message: "we goood gng" });
});

export default router;
