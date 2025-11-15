import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import useFinanceStore from '@/store/financeStore';
import { cn } from '@/lib/utils';

interface DailyDetailsPanelProps {
  date: Date;
}

export function DailyDetailsPanel({ date }: DailyDetailsPanelProps) {
  const { getIncomeUpToDate, getDeductionsUpToDate, getInvestmentReturnsOnDate, calculateProjectedBalance } =
    useFinanceStore();

  const income = getIncomeUpToDate(date);
  const deductions = getDeductionsUpToDate(date);
  const investments = getInvestmentReturnsOnDate(date);
  const projectedBalance = calculateProjectedBalance(date);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Details for {format(date, 'MMMM d, yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-income/10">
            <span className="text-sm font-medium">Income Accumulated</span>
            <span className="text-lg font-bold text-income">
              +${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-expense/10">
            <span className="text-sm font-medium">Deductions Accumulated</span>
            <span className="text-lg font-bold text-expense">
              -${deductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
            <span className="text-sm font-medium">Investment Returns</span>
            <span className="text-lg font-bold text-primary">
              +${investments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-muted">
              <span className="text-base font-semibold">Projected Balance</span>
              <span
                className={cn(
                  'text-2xl font-bold',
                  projectedBalance >= 0 ? 'text-income' : 'text-expense'
                )}
              >
                ${projectedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
