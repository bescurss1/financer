import React, { useState } from 'react';
import useFinanceStore from '@/store/financeStore';
import { SemicircleGauge } from '@/components/Finance/SemicircleGauge';
import { FinanceCalendar } from '@/components/Finance/FinanceCalendar';
import { DailyDetailsPanel } from '@/components/Finance/DailyDetailsPanel';
import { EventsTable } from '@/components/Finance/EventsTable';
import { FilterPanel } from '@/components/Finance/FilterPanel';
import { AddIncomeForm } from '@/components/Finance/AddIncomeForm';
import { AddDeductionForm } from '@/components/Finance/AddDeductionForm';
import { AddInvestmentForm } from '@/components/Finance/AddInvestmentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

export default function FinanceDashboard() {
  const { selectedDate, setSelectedDate, getIncomeUpToDate, getDeductionsUpToDate } = useFinanceStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const monthlyIncome = getIncomeUpToDate(endOfMonth);
  const monthlyExpenses = getDeductionsUpToDate(endOfMonth);

  const monthlyIncomeTarget = 10000;
  const monthlyExpenseTarget = 5000;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance Dashboard</h1>
          <p className="text-muted-foreground">Track your projected balance for any date</p>
        </div>
        <div className="flex gap-2">
          <FilterPanel selectedMonth={currentMonth} onMonthChange={setCurrentMonth} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Entry</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="deduction">Deduction</TabsTrigger>
                  <TabsTrigger value="investment">Investment</TabsTrigger>
                </TabsList>
                <TabsContent value="income" className="mt-4">
                  <AddIncomeForm onSuccess={() => setIsAddDialogOpen(false)} />
                </TabsContent>
                <TabsContent value="deduction" className="mt-4">
                  <AddDeductionForm onSuccess={() => setIsAddDialogOpen(false)} />
                </TabsContent>
                <TabsContent value="investment" className="mt-4">
                  <AddInvestmentForm onSuccess={() => setIsAddDialogOpen(false)} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SemicircleGauge
          title="Income Progress"
          value={monthlyIncome}
          max={monthlyIncomeTarget}
          color="income"
        />
        <SemicircleGauge
          title="Spending Progress"
          value={monthlyExpenses}
          max={monthlyExpenseTarget}
          color="expense"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinanceCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>

        <div className="space-y-6">
          <DailyDetailsPanel date={selectedDate} />
        </div>
      </div>

      <div>
        <EventsTable date={selectedDate} />
      </div>
    </div>
  );
}
