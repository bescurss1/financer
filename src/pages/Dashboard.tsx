
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { StatCard } from "@/components/Dashboard/StatCard";
import { TransactionList } from "@/components/Dashboard/TransactionList";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { IncomeVsExpenseChart } from "@/components/Dashboard/IncomeVsExpenseChart";
import { BudgetProgress } from "@/components/Dashboard/BudgetProgress";
import { SavingsGoalCard } from "@/components/Dashboard/SavingsGoalCard";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/components/Transactions/TransactionForm";
import { ChartBar, Wallet, CircleDollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const {
    transactions,
    budgets,
    savingsGoals,
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateNetBalance,
    getTransactionsForCurrentMonth,
  } = useFinance();

  const currentMonthTransactions = getTransactionsForCurrentMonth();
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const netBalance = calculateNetBalance();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record your income or expenses.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Income"
            value={`$${totalIncome.toFixed(2)}`}
            icon={<TrendingUp className="h-4 w-4" />}
            description="Total income recorded"
            className="border-l-4 border-income"
          />
          <StatCard
            title="Total Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            icon={<Wallet className="h-4 w-4" />}
            description="Total expenses recorded"
            className="border-l-4 border-expense"
          />
          <StatCard
            title="Net Balance"
            value={`$${netBalance.toFixed(2)}`}
            icon={<CircleDollarSign className="h-4 w-4" />}
            description="Income minus expenses"
            className="border-l-4 border-primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IncomeVsExpenseChart transactions={transactions} />
          </div>
          <div>
            <ExpenseChart transactions={transactions} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <BudgetProgress budgets={budgets} />
          </div>
          <div>
            <SavingsGoalCard goals={savingsGoals} />
          </div>
          <div>
            <TransactionList
              transactions={currentMonthTransactions}
              limit={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
