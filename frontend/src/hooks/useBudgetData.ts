/**
 * Filename: useBudgetData.ts
 *
 * Desc: React Query hooks with optimistic updates for budget data
 *
 * Author: Jerry Meng
 *
 * Last Modified: Jan 2026
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCategories,
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateCategoryBudget,
    getBudgetSummary,
    type Transaction,
    type CategoryGroup,
    type BudgetSummary,
} from "@/lib/api";

// Query keys for cache management
export const queryKeys = {
    transactions: ["transactions"] as const,
    categories: (budgetType: string) => ["categories", budgetType] as const,
    summary: (budgetType: string) => ["summary", budgetType] as const,
};

// ============ TRANSACTIONS ============

export function useTransactions() {
    return useQuery({
        queryKey: queryKeys.transactions,
        queryFn: getTransactions,
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    });
}

export function useAddTransaction(budgetType: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addTransaction,

        // Optimistic update - runs before the API call
        onMutate: async (newTransaction) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: queryKeys.transactions });
            await queryClient.cancelQueries({ queryKey: queryKeys.summary(budgetType) });

            // Snapshot previous values for rollback
            const previousTransactions = queryClient.getQueryData<Transaction[]>(
                queryKeys.transactions
            );
            const previousSummary = queryClient.getQueryData<BudgetSummary>(
                queryKeys.summary(budgetType)
            );
            const previousCategories = queryClient.getQueryData<CategoryGroup[]>(
                queryKeys.categories(budgetType)
            );

            // Create optimistic transaction with temp ID
            const optimisticTransaction: Transaction = {
                id: `temp-${Date.now()}`,
                date: newTransaction.date,
                payee: newTransaction.payee,
                categoryId: newTransaction.categoryId,
                amount: newTransaction.amount,
                notes: newTransaction.notes,
                type: newTransaction.type,
            };

            // Optimistically update transactions list
            queryClient.setQueryData<Transaction[]>(
                queryKeys.transactions,
                (old = []) => [optimisticTransaction, ...old]
            );

            // Optimistically update summary
            if (previousSummary) {
                const updatedSummary = { ...previousSummary };
                if (newTransaction.type === "income") {
                    updatedSummary.totalIncome += newTransaction.amount;
                    updatedSummary.totalAvailable += newTransaction.amount;
                }
                // Expenses affect category spent/available, handled below
                queryClient.setQueryData(queryKeys.summary(budgetType), updatedSummary);
            }

            // Optimistically update category based on transaction type
            if (newTransaction.categoryId && previousCategories) {
                const updatedCategories = previousCategories.map((group) => ({
                    ...group,
                    categories: group.categories.map((cat) => {
                        if (cat.id === newTransaction.categoryId) {
                            if (newTransaction.type === "expense") {
                                return {
                                    ...cat,
                                    spent: cat.spent + newTransaction.amount,
                                    available: cat.available - newTransaction.amount,
                                };
                            } else if (newTransaction.type === "income") {
                                // Income adds to the category's available amount
                                return {
                                    ...cat,
                                    available: cat.available + newTransaction.amount,
                                };
                            }
                        }
                        return cat;
                    }),
                }));
                queryClient.setQueryData(queryKeys.categories(budgetType), updatedCategories);

                // Also update summary for expense
                if (newTransaction.type === "expense" && previousSummary) {
                    queryClient.setQueryData<BudgetSummary>(
                        queryKeys.summary(budgetType),
                        (old) => old ? {
                            ...old,
                            totalSpent: old.totalSpent + newTransaction.amount,
                            totalAvailable: old.totalAvailable - newTransaction.amount,
                        } : old
                    );
                }
            }

            // Return context for rollback
            return { previousTransactions, previousSummary, previousCategories };
        },

        // Rollback on error
        onError: (_err, _newTransaction, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(queryKeys.transactions, context.previousTransactions);
            }
            if (context?.previousSummary) {
                queryClient.setQueryData(queryKeys.summary(budgetType), context.previousSummary);
            }
            if (context?.previousCategories) {
                queryClient.setQueryData(queryKeys.categories(budgetType), context.previousCategories);
            }
        },

        // Always refetch after error or success to sync with server
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
            queryClient.invalidateQueries({ queryKey: queryKeys.summary(budgetType) });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories(budgetType) });
        },
    });
}

export function useDeleteTransaction(budgetType: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTransaction,

        onMutate: async (transactionId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.transactions });
            await queryClient.cancelQueries({ queryKey: queryKeys.summary(budgetType) });
            await queryClient.cancelQueries({ queryKey: queryKeys.categories(budgetType) });

            const previousTransactions = queryClient.getQueryData<Transaction[]>(
                queryKeys.transactions
            );
            const previousSummary = queryClient.getQueryData<BudgetSummary>(
                queryKeys.summary(budgetType)
            );
            const previousCategories = queryClient.getQueryData<CategoryGroup[]>(
                queryKeys.categories(budgetType)
            );

            // Find the transaction being deleted
            const deletedTransaction = previousTransactions?.find((t) => t.id === transactionId);

            // Optimistically remove from list
            queryClient.setQueryData<Transaction[]>(
                queryKeys.transactions,
                (old = []) => old.filter((t) => t.id !== transactionId)
            );

            // Optimistically update summary and categories
            if (deletedTransaction) {
                if (deletedTransaction.type === "income" && previousSummary) {
                    queryClient.setQueryData<BudgetSummary>(
                        queryKeys.summary(budgetType),
                        (old) => old ? {
                            ...old,
                            totalIncome: old.totalIncome - deletedTransaction.amount,
                            totalAvailable: old.totalAvailable - deletedTransaction.amount,
                        } : old
                    );
                }

                if (deletedTransaction.type === "expense" && deletedTransaction.categoryId) {
                    // Update category
                    if (previousCategories) {
                        const updatedCategories = previousCategories.map((group) => ({
                            ...group,
                            categories: group.categories.map((cat) => {
                                if (cat.id === deletedTransaction.categoryId) {
                                    return {
                                        ...cat,
                                        spent: cat.spent - deletedTransaction.amount,
                                        available: cat.available + deletedTransaction.amount,
                                    };
                                }
                                return cat;
                            }),
                        }));
                        queryClient.setQueryData(queryKeys.categories(budgetType), updatedCategories);
                    }

                    // Update summary
                    if (previousSummary) {
                        queryClient.setQueryData<BudgetSummary>(
                            queryKeys.summary(budgetType),
                            (old) => old ? {
                                ...old,
                                totalSpent: old.totalSpent - deletedTransaction.amount,
                                totalAvailable: old.totalAvailable + deletedTransaction.amount,
                            } : old
                        );
                    }
                }

                // Handle income transaction with category - reverse the available increase
                if (deletedTransaction.type === "income" && deletedTransaction.categoryId) {
                    if (previousCategories) {
                        const updatedCategories = previousCategories.map((group) => ({
                            ...group,
                            categories: group.categories.map((cat) => {
                                if (cat.id === deletedTransaction.categoryId) {
                                    return {
                                        ...cat,
                                        available: cat.available - deletedTransaction.amount,
                                    };
                                }
                                return cat;
                            }),
                        }));
                        queryClient.setQueryData(queryKeys.categories(budgetType), updatedCategories);
                    }
                }
            }

            return { previousTransactions, previousSummary, previousCategories };
        },

        onError: (_err, _transactionId, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(queryKeys.transactions, context.previousTransactions);
            }
            if (context?.previousSummary) {
                queryClient.setQueryData(queryKeys.summary(budgetType), context.previousSummary);
            }
            if (context?.previousCategories) {
                queryClient.setQueryData(queryKeys.categories(budgetType), context.previousCategories);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
            queryClient.invalidateQueries({ queryKey: queryKeys.summary(budgetType) });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories(budgetType) });
        },
    });
}

// ============ CATEGORIES ============

export function useCategories(budgetType: string) {
    return useQuery({
        queryKey: queryKeys.categories(budgetType),
        queryFn: () => getCategories(budgetType),
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateCategoryBudget(budgetType: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, budgeted }: { categoryId: string; budgeted: number }) =>
            updateCategoryBudget(budgetType, categoryId, budgeted),

        onMutate: async ({ categoryId, budgeted }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.categories(budgetType) });
            await queryClient.cancelQueries({ queryKey: queryKeys.summary(budgetType) });

            const previousCategories = queryClient.getQueryData<CategoryGroup[]>(
                queryKeys.categories(budgetType)
            );
            const previousSummary = queryClient.getQueryData<BudgetSummary>(
                queryKeys.summary(budgetType)
            );

            // Find current category to calculate diff
            let oldBudgeted = 0;
            let oldAvailable = 0;
            if (previousCategories) {
                for (const group of previousCategories) {
                    const cat = group.categories.find((c) => c.id === categoryId);
                    if (cat) {
                        oldBudgeted = cat.budgeted;
                        oldAvailable = cat.available;
                        break;
                    }
                }
            }

            const budgetDiff = budgeted - oldBudgeted;

            // Optimistically update categories
            if (previousCategories) {
                const updatedCategories = previousCategories.map((group) => ({
                    ...group,
                    categories: group.categories.map((cat) => {
                        if (cat.id === categoryId) {
                            return {
                                ...cat,
                                budgeted: budgeted,
                                available: cat.available + budgetDiff,
                            };
                        }
                        return cat;
                    }),
                }));
                queryClient.setQueryData(queryKeys.categories(budgetType), updatedCategories);
            }

            // Optimistically update summary
            if (previousSummary) {
                queryClient.setQueryData<BudgetSummary>(
                    queryKeys.summary(budgetType),
                    (old) => old ? {
                        ...old,
                        totalBudgeted: old.totalBudgeted + budgetDiff,
                        totalAvailable: old.totalAvailable + budgetDiff,
                    } : old
                );
            }

            return { previousCategories, previousSummary };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousCategories) {
                queryClient.setQueryData(queryKeys.categories(budgetType), context.previousCategories);
            }
            if (context?.previousSummary) {
                queryClient.setQueryData(queryKeys.summary(budgetType), context.previousSummary);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories(budgetType) });
            queryClient.invalidateQueries({ queryKey: queryKeys.summary(budgetType) });
        },
    });
}

// ============ SUMMARY ============

export function useBudgetSummary(budgetType: string) {
    return useQuery({
        queryKey: queryKeys.summary(budgetType),
        queryFn: () => getBudgetSummary(budgetType),
        staleTime: 1000 * 60 * 5,
    });
}
