
import React from "react";
import { Budget } from "@/context/FinanceContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  budgets: Budget[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {budgets.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No budgets set up yet
            </p>
          ) : (
            budgets.map((budget) => {
              const percentage = (budget.current / budget.limit) * 100;
              const isOverBudget = percentage > 100;

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{budget.category}</span>
                    <span className={cn(
                      "text-sm",
                      isOverBudget ? "text-destructive" : "text-muted-foreground"
                    )}>
                      ${budget.current.toFixed(0)} / ${budget.limit.toFixed(0)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={cn({
                      "bg-destructive/30": isOverBudget
                    })}
                    indicatorClassName={cn({
                      "bg-destructive": isOverBudget
                    })}
                  />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
