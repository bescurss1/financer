import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import useFinanceStore from '@/store/financeStore';
import { cn } from '@/lib/utils';

interface FinanceCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function FinanceCalendar({ selectedDate, onSelectDate, currentMonth, onMonthChange }: FinanceCalendarProps) {
  const { calculateProjectedBalance, getEventsForDate } = useFinanceStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayColor = (date: Date) => {
    if (!isSameMonth(date, currentMonth)) return 'bg-transparent text-muted-foreground';

    const events = getEventsForDate(date);
    const hasIncome = events.some((e) => e.type === 'income');
    const hasDeduction = events.some((e) => e.type === 'deduction');
    const hasInvestment = events.some((e) => e.type === 'investment');

    if (hasIncome && hasDeduction) {
      return 'bg-gradient-to-br from-income/20 to-expense/20 text-foreground';
    } else if (hasIncome) {
      return 'bg-income/20 text-income-dark';
    } else if (hasDeduction) {
      return 'bg-expense/20 text-expense-dark';
    } else if (hasInvestment) {
      return 'bg-primary/20 text-primary-dark';
    }

    return 'bg-transparent hover:bg-muted';
  };

  const hasEvents = (date: Date) => {
    const events = getEventsForDate(date);
    return events.length > 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onMonthChange(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onMonthChange(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={index}
                onClick={() => onSelectDate(day)}
                className={cn(
                  'relative p-3 rounded-lg text-sm font-medium transition-all duration-200',
                  getDayColor(day),
                  isSelected && 'ring-2 ring-primary ring-offset-2',
                  isToday && 'font-bold',
                  !isCurrentMonth && 'opacity-40',
                  'hover:scale-105 active:scale-95'
                )}
              >
                <div className="flex flex-col items-center justify-center">
                  <span>{format(day, 'd')}</span>
                  {hasEvents(day) && isCurrentMonth && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-income/20 border border-income/40" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-expense/20 border border-expense/40" />
            <span>Deduction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary/40" />
            <span>Investment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
