
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

// Define types
export type TransactionCategory = 
  | "Housing" 
  | "Food" 
  | "Transportation" 
  | "Utilities" 
  | "Health" 
  | "Entertainment" 
  | "Personal" 
  | "Education" 
  | "Savings" 
  | "Income" 
  | "Other";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: Date;
  type: TransactionType;
  recurring: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  current: number;
  period: "weekly" | "monthly" | "yearly";
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: Date | null;
}

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, "id" | "current">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "current">) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  calculateTotalIncome: () => number;
  calculateTotalExpenses: () => number;
  calculateNetBalance: () => number;
  getTransactionsByDate: (date: Date) => Transaction[];
  getTransactionsForCurrentMonth: () => Transaction[];
}

// Sample data
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const generateSampleTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  
  // Sample income
  transactions.push({
    id: "1",
    amount: 3000,
    description: "Monthly Salary",
    category: "Income",
    date: new Date(currentYear, currentMonth, 1),
    type: "income",
    recurring: true,
    recurringFrequency: "monthly"
  });
  
  // Sample expenses
  transactions.push({
    id: "2",
    amount: 1200,
    description: "Rent Payment",
    category: "Housing",
    date: new Date(currentYear, currentMonth, 3),
    type: "expense",
    recurring: true,
    recurringFrequency: "monthly"
  });
  
  transactions.push({
    id: "3",
    amount: 85,
    description: "Electricity Bill",
    category: "Utilities",
    date: new Date(currentYear, currentMonth, 10),
    type: "expense",
    recurring: true,
    recurringFrequency: "monthly"
  });
  
  transactions.push({
    id: "4",
    amount: 120,
    description: "Groceries",
    category: "Food",
    date: new Date(currentYear, currentMonth, 7),
    type: "expense",
    recurring: false
  });
  
  transactions.push({
    id: "5",
    amount: 65,
    description: "Dinner with friends",
    category: "Food",
    date: new Date(currentYear, currentMonth, 15),
    type: "expense",
    recurring: false
  });
  
  transactions.push({
    id: "6",
    amount: 200,
    description: "Side Project Income",
    category: "Income",
    date: new Date(currentYear, currentMonth, 20),
    type: "income",
    recurring: false
  });
  
  return transactions;
};

const generateSampleBudgets = (): Budget[] => {
  return [
    {
      id: "1",
      category: "Housing",
      limit: 1300,
      current: 1200,
      period: "monthly"
    },
    {
      id: "2",
      category: "Food",
      limit: 400,
      current: 185,
      period: "monthly"
    },
    {
      id: "3",
      category: "Transportation",
      limit: 200,
      current: 0,
      period: "monthly"
    },
    {
      id: "4",
      category: "Entertainment",
      limit: 150,
      current: 0,
      period: "monthly"
    }
  ];
};

const generateSampleSavingsGoals = (): SavingsGoal[] => {
  return [
    {
      id: "1",
      name: "Emergency Fund",
      target: 10000,
      current: 5400,
      deadline: null
    },
    {
      id: "2",
      name: "Vacation",
      target: 2000,
      current: 750,
      deadline: new Date(currentYear, currentMonth + 6, 1)
    }
  ];
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    generateSampleTransactions()
  );
  const [budgets, setBudgets] = useState<Budget[]>(
    generateSampleBudgets()
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(
    generateSampleSavingsGoals()
  );

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    setTransactions((prev) => [...prev, newTransaction]);

    // Update budget if it's an expense
    if (transaction.type === "expense") {
      setBudgets((prev) =>
        prev.map((budget) => {
          if (budget.category === transaction.category) {
            return {
              ...budget,
              current: budget.current + transaction.amount,
            };
          }
          return budget;
        })
      );
    } else if (transaction.type === "income" && transaction.category === "Savings") {
      // Update savings goals if transaction is marked for savings
      // Simple logic: distribute proportionally among all goals
      const totalTarget = savingsGoals.reduce((acc, goal) => acc + (goal.target - goal.current), 0);
      if (totalTarget > 0) {
        setSavingsGoals((prev) =>
          prev.map((goal) => {
            const proportion = (goal.target - goal.current) / totalTarget;
            return {
              ...goal,
              current: Math.min(goal.current + transaction.amount * proportion, goal.target),
            };
          })
        );
      }
    }

    toast.success(`Transaction added successfully!`);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...transaction } : t))
    );
    toast.success(`Transaction updated`);
  };

  const deleteTransaction = (id: string) => {
    // First find the transaction to update budgets accordingly
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction && transaction.type === "expense") {
      setBudgets((prev) =>
        prev.map((budget) => {
          if (budget.category === transaction.category) {
            return {
              ...budget,
              current: Math.max(0, budget.current - transaction.amount),
            };
          }
          return budget;
        })
      );
    }
    
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success(`Transaction deleted`);
  };

  const addBudget = (budget: Omit<Budget, "id" | "current">) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      current: 0,
    };
    setBudgets((prev) => [...prev, newBudget]);
    toast.success(`Budget for ${budget.category} added`);
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...budget } : b))
    );
    toast.success(`Budget updated`);
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    toast.success(`Budget deleted`);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, "id" | "current">) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      current: 0,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    toast.success(`Savings goal added: ${goal.name}`);
  };

  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...goal } : g))
    );
    toast.success(`Savings goal updated`);
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success(`Savings goal deleted`);
  };

  const calculateTotalIncome = () => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const calculateNetBalance = () => {
    return calculateTotalIncome() - calculateTotalExpenses();
  };

  const getTransactionsByDate = (date: Date) => {
    return transactions.filter(
      (t) =>
        t.date.getFullYear() === date.getFullYear() &&
        t.date.getMonth() === date.getMonth() &&
        t.date.getDate() === date.getDate()
    );
  };

  const getTransactionsForCurrentMonth = () => {
    const now = new Date();
    return transactions.filter(
      (t) =>
        t.date.getFullYear() === now.getFullYear() &&
        t.date.getMonth() === now.getMonth()
    );
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        savingsGoals,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        calculateTotalIncome,
        calculateTotalExpenses,
        calculateNetBalance,
        getTransactionsByDate,
        getTransactionsForCurrentMonth,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
