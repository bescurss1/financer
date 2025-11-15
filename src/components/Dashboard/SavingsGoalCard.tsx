
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavingsGoal } from "@/context/FinanceContext";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface SavingsGoalCardProps {
  goals: SavingsGoal[];
}

export function SavingsGoalCard({ goals }: SavingsGoalCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {goals.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No savings goals set up yet
            </p>
          ) : (
            goals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm">{goal.name}</span>
                      {goal.deadline && (
                        <p className="text-xs text-muted-foreground">
                          Target: {format(goal.deadline, "MMM dd, yyyy")}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${goal.current.toFixed(0)} / ${goal.target.toFixed(0)}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-right text-muted-foreground">
                    {percentage.toFixed(0)}% Complete
                  </p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
