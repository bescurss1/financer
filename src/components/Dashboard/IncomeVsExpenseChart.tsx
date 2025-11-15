
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/context/FinanceContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IncomeVsExpenseChartProps {
  transactions: Transaction[];
}

export function IncomeVsExpenseChart({ transactions }: IncomeVsExpenseChartProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");

  const getCurrentWeek = () => {
    const today = new Date();
    const onejan = new Date(today.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((today.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
    );
    return weekNumber;
  };

  const getDayOfWeek = (date: Date): number => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, and shift others by 1
  };

  const formatData = () => {
    if (period === "weekly") {
      // Group data by day of week
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const weekData = Array(7)
        .fill(0)
        .map((_, i) => ({
          name: days[i],
          income: 0,
          expense: 0,
        }));

      // Filter current week transactions
      const now = new Date();
      const currentWeek = getCurrentWeek();
      
      transactions.forEach((transaction) => {
        const transactionWeek = Math.ceil(
          ((transaction.date.getTime() - new Date(transaction.date.getFullYear(), 0, 1).getTime()) / 86400000 + 
          new Date(transaction.date.getFullYear(), 0, 1).getDay() + 1) / 7
        );

        if (transactionWeek === currentWeek) {
          const dayIndex = getDayOfWeek(transaction.date);
          if (transaction.type === "income") {
            weekData[dayIndex].income += transaction.amount;
          } else {
            weekData[dayIndex].expense += transaction.amount;
          }
        }
      });

      return weekData;
    } else {
      // Group data by month
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      
      const monthlyData = Array(12)
        .fill(0)
        .map((_, i) => ({
          name: monthNames[i],
          income: 0,
          expense: 0,
        }));

      // Only include current year
      const currentYear = new Date().getFullYear();
      
      transactions.forEach((transaction) => {
        if (transaction.date.getFullYear() === currentYear) {
          const monthIndex = transaction.date.getMonth();
          if (transaction.type === "income") {
            monthlyData[monthIndex].income += transaction.amount;
          } else {
            monthlyData[monthIndex].expense += transaction.amount;
          }
        }
      });

      return monthlyData;
    }
  };

  const data = formatData();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Income vs Expenses</CardTitle>
        <Select value={period} onValueChange={(value) => setPeriod(value as "weekly" | "monthly")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
              labelFormatter={(label) => `${label} ${period === "weekly" ? "(This Week)" : ""}`}
            />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#34A853" />
            <Bar dataKey="expense" name="Expenses" fill="#EA4335" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
