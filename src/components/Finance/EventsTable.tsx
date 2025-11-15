import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import useFinanceStore from '@/store/financeStore';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react';

interface EventsTableProps {
  date: Date;
}

export function EventsTable({ date }: EventsTableProps) {
  const { getEventsForDate } = useFinanceStore();
  const events = getEventsForDate(date);

  const getIcon = (type: 'income' | 'deduction' | 'investment') => {
    switch (type) {
      case 'income':
        return <ArrowUp className="h-4 w-4 text-income" />;
      case 'deduction':
        return <ArrowDown className="h-4 w-4 text-expense" />;
      case 'investment':
        return <TrendingUp className="h-4 w-4 text-primary" />;
    }
  };

  const getTypeLabel = (type: 'income' | 'deduction' | 'investment') => {
    switch (type) {
      case 'income':
        return 'Income';
      case 'deduction':
        return 'Deduction';
      case 'investment':
        return 'Investment';
    }
  };

  const getAmountColor = (type: 'income' | 'deduction' | 'investment') => {
    switch (type) {
      case 'income':
        return 'text-income';
      case 'deduction':
        return 'text-expense';
      case 'investment':
        return 'text-primary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Events on {format(date, 'MMM d, yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No events scheduled for this date
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIcon(event.type)}
                      <span className="text-sm">{getTypeLabel(event.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className={cn('text-right font-semibold', getAmountColor(event.type))}>
                    {event.type === 'deduction' ? '-' : '+'}$
                    {event.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
