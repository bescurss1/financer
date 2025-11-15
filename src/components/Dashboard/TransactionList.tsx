
import React from "react";
import { Transaction } from "@/context/FinanceContext";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your most recent financial activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTransactions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No recent transactions
            </p>
          ) : (
            displayTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      transaction.type === "income"
                        ? "bg-green-100 text-income dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-expense dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category} • {format(transaction.date, "MMM dd")}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "font-medium",
                    transaction.type === "income" ? "text-income" : "text-expense"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
