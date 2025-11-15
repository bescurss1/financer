
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/context/FinanceContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type CategoryTotal = {
  name: string;
  value: number;
  color: string;
};

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A4DE6C",
  "#8884D8", "#83A6ED", "#8DD1E1", "#D0ED57", "#F49D37"
];

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const data: CategoryTotal[] = Object.entries(expensesByCategory).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
