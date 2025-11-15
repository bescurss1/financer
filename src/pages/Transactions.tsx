
import React, { useState } from "react";
import { useFinance, TransactionType } from "@/context/FinanceContext";
import { TransactionForm } from "@/components/Transactions/TransactionForm";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      return sortDirection === "asc"
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    } else {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });

  const toggleSort = (column: "date" | "amount") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
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

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as "all" | TransactionType)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sortedTransactions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary"
                        onClick={() => toggleSort("date")}
                      >
                        Date {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary text-right"
                        onClick={() => toggleSort("amount")}
                      >
                        Amount {sortBy === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
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
                          </div>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium",
                            transaction.type === "income"
                              ? "text-income"
                              : "text-expense"
                          )}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTransaction(transaction.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
