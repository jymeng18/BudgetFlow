/**
 * Filename: index.ts
 *
 * Desc: Main entry point for all API routes
 *
 * Author: Jerry Meng
 */

import express from "express";
import authRoutes from "./auth";
import categoriesRoutes from "./categories";
import transactionsRoutes from "./transactions";
import analyticsRoutes from "./analytics";
import chatbotRoutes from "./chatbot";

const router = express.Router();

// Combine all route modules
router.use(authRoutes);
router.use(categoriesRoutes);
router.use(transactionsRoutes);
router.use(analyticsRoutes);
router.use(chatbotRoutes);

export default router;
