import { create } from 'zustand';

export interface MonthlyIncome {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly';
  start_date: Date;
  end_date?: Date;
  tax_percentage: number;
  double_pay_days: Date[];
}

export interface MonthlyDeduction {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly';
  start_date: Date;
  end_date?: Date;
  category: string;
  notes?: string;
}

export interface InvestmentReturn {
  id: string;
  name: string;
  return_amount: number;
  date: Date;
  return_type?: 'once' | 'monthly';
  growth_percentage?: number;
}

interface FinanceStore {
  incomes: MonthlyIncome[];
  deductions: MonthlyDeduction[];
  investments: InvestmentReturn[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addIncome: (income: Omit<MonthlyIncome, 'id'>) => void;
  addDeduction: (deduction: Omit<MonthlyDeduction, 'id'>) => void;
  addInvestment: (investment: Omit<InvestmentReturn, 'id'>) => void;
  removeIncome: (id: string) => void;
  removeDeduction: (id: string) => void;
  removeInvestment: (id: string) => void;
  calculateProjectedBalance: (date: Date) => number;
  getIncomeUpToDate: (date: Date) => number;
  getDeductionsUpToDate: (date: Date) => number;
  getInvestmentReturnsOnDate: (date: Date) => number;
  getEventsForDate: (date: Date) => Array<{
    type: 'income' | 'deduction' | 'investment';
    name: string;
    amount: number;
  }>;
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isDateInRange = (date: Date, startDate: Date, endDate?: Date): boolean => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const check = new Date(date);
  check.setHours(0, 0, 0, 0);

  if (check < start) return false;

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return check <= end;
  }

  return true;
};

const useFinanceStore = create<FinanceStore>((set, get) => ({
  incomes: [
    {
      id: '1',
      name: 'Monthly Salary',
      amount: 5000,
      frequency: 'monthly',
      start_date: new Date(2024, 0, 1),
      tax_percentage: 25,
      double_pay_days: [new Date(2024, 5, 15), new Date(2024, 11, 15)],
    },
  ],
  deductions: [
    {
      id: '1',
      name: 'Rent',
      amount: 1500,
      frequency: 'monthly',
      start_date: new Date(2024, 0, 1),
      category: 'Housing',
    },
    {
      id: '2',
      name: 'Utilities',
      amount: 200,
      frequency: 'monthly',
      start_date: new Date(2024, 0, 1),
      category: 'Bills',
    },
  ],
  investments: [
    {
      id: '1',
      name: 'Stock Portfolio Return',
      return_amount: 500,
      date: new Date(2024, 6, 1),
      return_type: 'once',
    },
  ],
  selectedDate: new Date(),

  setSelectedDate: (date: Date) => set({ selectedDate: date }),

  addIncome: (income) =>
    set((state) => ({
      incomes: [...state.incomes, { ...income, id: Date.now().toString() }],
    })),

  addDeduction: (deduction) =>
    set((state) => ({
      deductions: [...state.deductions, { ...deduction, id: Date.now().toString() }],
    })),

  addInvestment: (investment) =>
    set((state) => ({
      investments: [...state.investments, { ...investment, id: Date.now().toString() }],
    })),

  removeIncome: (id) =>
    set((state) => ({
      incomes: state.incomes.filter((i) => i.id !== id),
    })),

  removeDeduction: (id) =>
    set((state) => ({
      deductions: state.deductions.filter((d) => d.id !== id),
    })),

  removeInvestment: (id) =>
    set((state) => ({
      investments: state.investments.filter((i) => i.id !== id),
    })),

  getIncomeUpToDate: (date: Date) => {
    const { incomes } = get();
    let total = 0;

    incomes.forEach((income) => {
      const startDate = new Date(income.start_date);
      const endDate = income.end_date ? new Date(income.end_date) : null;

      const startMonth = startDate.getFullYear() * 12 + startDate.getMonth();
      const selectedMonth = date.getFullYear() * 12 + date.getMonth();
      const endMonth = endDate ? endDate.getFullYear() * 12 + endDate.getMonth() : Infinity;

      if (selectedMonth < startMonth || selectedMonth > endMonth) return;

      const monthsCount = Math.min(selectedMonth - startMonth + 1, endMonth - startMonth + 1);
      const netAmount = income.amount * (1 - income.tax_percentage / 100);

      let regularPayments = netAmount * monthsCount;

      income.double_pay_days.forEach((doublePayDay) => {
        const doublePayDate = new Date(doublePayDay);
        if (isDateInRange(doublePayDate, startDate, endDate) && doublePayDate <= date) {
          regularPayments += netAmount;
        }
      });

      total += regularPayments;
    });

    return total;
  },

  getDeductionsUpToDate: (date: Date) => {
    const { deductions } = get();
    let total = 0;

    deductions.forEach((deduction) => {
      const startDate = new Date(deduction.start_date);
      const endDate = deduction.end_date ? new Date(deduction.end_date) : null;

      const startMonth = startDate.getFullYear() * 12 + startDate.getMonth();
      const selectedMonth = date.getFullYear() * 12 + date.getMonth();
      const endMonth = endDate ? endDate.getFullYear() * 12 + endDate.getMonth() : Infinity;

      if (selectedMonth < startMonth || selectedMonth > endMonth) return;

      const monthsCount = Math.min(selectedMonth - startMonth + 1, endMonth - startMonth + 1);
      total += deduction.amount * monthsCount;
    });

    return total;
  },

  getInvestmentReturnsOnDate: (date: Date) => {
    const { investments } = get();
    let total = 0;

    investments.forEach((investment) => {
      const investmentDate = new Date(investment.date);

      if (investment.return_type === 'monthly') {
        const startMonth = investmentDate.getFullYear() * 12 + investmentDate.getMonth();
        const selectedMonth = date.getFullYear() * 12 + date.getMonth();

        if (selectedMonth >= startMonth) {
          const monthsCount = selectedMonth - startMonth + 1;
          let amount = investment.return_amount * monthsCount;

          if (investment.growth_percentage) {
            amount *= Math.pow(1 + investment.growth_percentage / 100, monthsCount - 1);
          }

          total += amount;
        }
      } else if (investmentDate <= date) {
        total += investment.return_amount;
      }
    });

    return total;
  },

  calculateProjectedBalance: (date: Date) => {
    const income = get().getIncomeUpToDate(date);
    const deductions = get().getDeductionsUpToDate(date);
    const returns = get().getInvestmentReturnsOnDate(date);

    return income - deductions + returns;
  },

  getEventsForDate: (date: Date) => {
    const { incomes, deductions, investments } = get();
    const events: Array<{
      type: 'income' | 'deduction' | 'investment';
      name: string;
      amount: number;
    }> = [];

    incomes.forEach((income) => {
      if (isDateInRange(date, income.start_date, income.end_date)) {
        const netAmount = income.amount * (1 - income.tax_percentage / 100);
        const isDoublePay = income.double_pay_days.some((d) => isSameDay(new Date(d), date));

        events.push({
          type: 'income',
          name: income.name + (isDoublePay ? ' (Double Pay)' : ''),
          amount: isDoublePay ? netAmount * 2 : netAmount,
        });
      }
    });

    deductions.forEach((deduction) => {
      if (isDateInRange(date, deduction.start_date, deduction.end_date)) {
        events.push({
          type: 'deduction',
          name: deduction.name,
          amount: deduction.amount,
        });
      }
    });

    investments.forEach((investment) => {
      const investmentDate = new Date(investment.date);
      if (isSameDay(investmentDate, date)) {
        events.push({
          type: 'investment',
          name: investment.name,
          amount: investment.return_amount,
        });
      }
    });

    return events;
  },
}));

export default useFinanceStore;
