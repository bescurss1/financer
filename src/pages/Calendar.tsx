
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TransactionList } from "@/components/Dashboard/TransactionList";
import { TransactionForm } from "@/components/Transactions/TransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  const { transactions, getTransactionsByDate } = useFinance();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const transactionsForSelectedDate = getTransactionsByDate(selectedDate);
  
  // Calculate the daily totals for each date
  const getDailyTotals = (date: Date) => {
    const dailyTransactions = getTransactionsByDate(date);
    
    const income = dailyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = dailyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, net: income - expenses };
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Financial Calendar</CardTitle>
              <CardDescription>
                View your transactions by date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                components={{
                  Day: ({ day, ...props }) => {
                    const date = day.date;
                    const dailyTotals = getDailyTotals(date);
                    
                    // Determine if there are transactions on this day and what type
                    let className = "";
                    if (dailyTotals.income > 0 && dailyTotals.expenses === 0) {
                      className = "bg-income/10 text-income font-medium";
                    } else if (dailyTotals.expenses > 0 && dailyTotals.income === 0) {
                      className = "bg-expense/10 text-expense font-medium";
                    } else if (dailyTotals.income > 0 && dailyTotals.expenses > 0) {
                      className = dailyTotals.net >= 0 
                        ? "bg-income/10 text-income font-medium" 
                        : "bg-expense/10 text-expense font-medium";
                    }
                    
                    return (
                      <div 
                        {...props} 
                        className={cn(
                          props.className,
                          className
                        )}
                      >
                        <div>{format(date, "d")}</div>
                        {dailyTotals.income > 0 || dailyTotals.expenses > 0 ? (
                          <div className="w-1 h-1 mx-auto mt-1 rounded-full bg-current opacity-70" />
                        ) : null}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Transactions for {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsForSelectedDate.length > 0 ? (
                  <TransactionList transactions={transactionsForSelectedDate} />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No transactions for this date.
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Income:</span>
                    <span className="font-medium text-income">
                      +${getDailyTotals(selectedDate).income.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expenses:</span>
                    <span className="font-medium text-expense">
                      -${getDailyTotals(selectedDate).expenses.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-medium">Net:</span>
                    <span className={cn(
                      "font-bold",
                      getDailyTotals(selectedDate).net >= 0 
                        ? "text-income" 
                        : "text-expense"
                    )}>
                      ${getDailyTotals(selectedDate).net.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
