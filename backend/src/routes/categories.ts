/**
 * Filename: categories.ts
 *
 * Desc: Category-related API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { categories } from "../data/categories";
import { isValidBudgetType, findAndUpdateCategory } from "./utils";

const router = express.Router();

router.get("/api/categories/:budgetType", (req: Request, res: Response) => {
  const { budgetType } = req.params;

  if (!isValidBudgetType(budgetType)) {
    res.status(400).json({
      error: "Invalid budget type.",
    });
    return;
  }

  res.json(categories[budgetType]);
});

router.put(
  "/api/categories/:budgetType/:categoryId/budget",
  (req: Request, res: Response) => {
    const { budgetType, categoryId } = req.params;
    const { budgeted } = req.body;

    if (!isValidBudgetType(budgetType)) {
      res.status(400).json({
        message: "Invalid budget type.",
      });
      return;
    }

    if (typeof budgeted !== "number" || budgeted < 0) {
      res.status(400).json({
        error: "Expected amount to be positive.",
      });
      return;
    }

    const category = findAndUpdateCategory(
      budgetType,
      categoryId,
      (category) => {
        category.budgeted = budgeted;
        category.available = budgeted - category.spent;
      }
    );

    if (!category) {
      res.status(404).json({
        error: "Category not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Updated budget succesffuly.",
      category,
    });
  }
);

export default router;
