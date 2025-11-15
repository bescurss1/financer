import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function FilterPanel({ selectedMonth, onMonthChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleMonthChange = (month: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(months.indexOf(month));
    onMonthChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setFullYear(parseInt(year));
    onMonthChange(newDate);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Month</Label>
            <Select
              value={months[selectedMonth.getMonth()]}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Year</Label>
            <Select
              value={selectedMonth.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
