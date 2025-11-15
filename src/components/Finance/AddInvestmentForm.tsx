import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import useFinanceStore from '@/store/financeStore';
import { toast } from 'sonner';

const investmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  return_amount: z.coerce.number().positive('Amount must be positive'),
  date: z.date(),
  return_type: z.enum(['once', 'monthly']).optional(),
  growth_percentage: z.coerce.number().min(0).max(100).optional(),
});

export function AddInvestmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addInvestment } = useFinanceStore();

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: '',
      return_amount: 0,
      date: new Date(),
      return_type: 'once',
      growth_percentage: 0,
    },
  });

  const returnType = form.watch('return_type');

  function onSubmit(data: z.infer<typeof investmentSchema>) {
    addInvestment(data);
    toast.success('Investment return added successfully!');
    form.reset();
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Stock Portfolio Return" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="return_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="return_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="once">One-time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{returnType === 'monthly' ? 'Start Date' : 'Return Date'}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {returnType === 'monthly' && (
          <FormField
            control={form.control}
            name="growth_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growth Percentage (%) - Optional</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          Add Investment Return
        </Button>
      </form>
    </Form>
  );
}
