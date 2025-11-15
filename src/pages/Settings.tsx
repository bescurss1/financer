
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ThemeSwitcher } from "@/components/Layout/ThemeSwitcher";
import { useTheme } from "@/context/ThemeContext";

const taxSettingsSchema = z.object({
  taxPercentage: z.coerce
    .number()
    .min(0, "Must be at least 0%")
    .max(100, "Cannot be more than 100%"),
  enableTaxCalculation: z.boolean().default(true),
  enableDoublePay: z.boolean().default(false),
  doublePaysPerYear: z.coerce
    .number()
    .min(0, "Must be at least 0")
    .max(12, "Cannot be more than 12")
    .optional(),
});

export default function Settings() {
  const { theme } = useTheme();
  const form = useForm<z.infer<typeof taxSettingsSchema>>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: {
      taxPercentage: 25,
      enableTaxCalculation: true,
      enableDoublePay: false,
      doublePaysPerYear: 0,
    },
  });

  const enableDoublePay = form.watch("enableDoublePay");

  function onSubmit(data: z.infer<typeof taxSettingsSchema>) {
    console.log(data);
    toast.success("Settings saved successfully!");
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Tax & Salary Settings</CardTitle>
            <CardDescription>
              Configure how your income is calculated after taxes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="taxPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Percentage (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          min={0}
                          max={100}
                        />
                      </FormControl>
                      <FormDescription>
                        The percentage of income that goes to taxes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableTaxCalculation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Tax Calculation
                        </FormLabel>
                        <FormDescription>
                          Automatically calculate income after taxes
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableDoublePay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Double Pay
                        </FormLabel>
                        <FormDescription>
                          For days when you receive extra income
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {enableDoublePay && (
                  <FormField
                    control={form.control}
                    name="doublePaysPerYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Double Pays Per Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            min={0}
                            max={12}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of double pay days in a year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit">Save Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-base font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark mode
                </p>
              </div>
              <ThemeSwitcher />
            </div>
            <div className="mt-4 p-4 rounded-lg bg-muted flex items-center justify-center">
              <div className="text-sm text-muted-foreground">
                Currently using: <span className="font-medium">{theme === "dark" ? "Dark" : "Light"} Mode</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
