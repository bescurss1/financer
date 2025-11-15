# Finance Dashboard - Complete Implementation

## Overview

A smart finance tracking dashboard that calculates projected balance for any date based on monthly incomes, deductions, investments, and spending. Features include interactive calendar visualization, semicircle progress gauges, and detailed financial projections.

## Features Implemented

### 1. UI Components

#### A. Two Semicircle Gauges
- **Income Progress Gauge**: Displays monthly income progress with smooth animations
- **Spending Progress Gauge**: Shows monthly spending against targets
- Blue/green color theme with dark mode support
- Smooth animations and responsive design

#### B. Right Sliding Panel (Filter Panel)
- Month selector with dropdown
- Year selector
- Accessible via filter icon button
- Slides in from the right side

#### C. Daily Details Panel
- Shows accumulated income up to selected date
- Displays accumulated deductions up to selected date
- Shows investment returns (if any)
- Calculates and displays projected balance
- Color-coded positive/negative balance

#### D. Events Table
- Lists all financial events for selected date
- Shows income items with green indicators
- Shows deductions with red indicators
- Shows investment returns with blue indicators
- Displays amounts with proper formatting

### 2. Finance Calendar

The calendar features:
- Color-coded days based on events:
  - Green background for days with income
  - Red background for days with deductions
  - Blue background for days with investments
  - Gradient for days with multiple event types
- Click any day to view detailed projections
- Month navigation with arrow buttons
- Visual indicators (dots) for days with events
- Current day highlighting
- Selected day highlighting with ring

### 3. Finance Logic Implementation

#### Monthly Income Object
```typescript
{
  name: string;
  amount: number;
  frequency: "monthly";
  start_date: Date;
  end_date?: Date;
  tax_percentage: number;
  double_pay_days: Date[];
}
```

#### Monthly Deduction Object
```typescript
{
  name: string;
  amount: number;
  frequency: "monthly";
  start_date: Date;
  end_date?: Date;
  category: string;
  notes?: string;
}
```

#### Investment Return Object
```typescript
{
  name: string;
  return_amount: number;
  date: Date;
  return_type?: "once" | "monthly";
  growth_percentage?: number;
}
```

### 4. Projected Balance Formula

The system calculates projected balance using:

```
ProjectedBalance =
  (sum of incomes up to date)
  - (sum of deductions up to date)
  + (sum of returns on that date)
```

**Key Features:**
- Income/deductions apply only within their date ranges
- Tax is automatically deducted from income before calculation
- Double-pay days multiply net income by 2
- Monthly recurring items are counted by number of months elapsed
- Investment returns can be one-time or monthly with optional growth

### 5. State Management

Using **Zustand** for global state:
- Manages all incomes, deductions, and investments
- Provides calculated values (projected balance, accumulated amounts)
- Handles date selection and filtering
- Efficient re-rendering with selective updates

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Zustand** for state management
- **Recharts** for data visualization
- **shadcn/ui** for UI components
- **date-fns** for date manipulation
- **React Hook Form** with Zod validation

## File Structure

```
src/
├── store/
│   └── financeStore.ts              # Zustand store with all finance logic
├── components/
│   └── Finance/
│       ├── SemicircleGauge.tsx      # Semicircle progress gauge
│       ├── FinanceCalendar.tsx      # Interactive calendar
│       ├── DailyDetailsPanel.tsx    # Daily financial details
│       ├── EventsTable.tsx          # Events list table
│       ├── FilterPanel.tsx          # Month/year filter panel
│       ├── AddIncomeForm.tsx        # Add income form
│       ├── AddDeductionForm.tsx     # Add deduction form
│       └── AddInvestmentForm.tsx    # Add investment form
└── pages/
    └── FinanceDashboard.tsx         # Main dashboard page
```

## Usage

### Adding Income
1. Click "Add Entry" button
2. Select "Income" tab
3. Fill in:
   - Name (e.g., "Monthly Salary")
   - Amount (e.g., 5000)
   - Tax percentage (e.g., 25)
   - Start date
   - Optional end date
4. Submit to add

### Adding Deduction
1. Click "Add Entry" button
2. Select "Deduction" tab
3. Fill in:
   - Name (e.g., "Rent")
   - Amount (e.g., 1500)
   - Category (Housing, Bills, etc.)
   - Start date
   - Optional end date
   - Optional notes
4. Submit to add

### Adding Investment Return
1. Click "Add Entry" button
2. Select "Investment" tab
3. Fill in:
   - Name (e.g., "Stock Portfolio")
   - Return amount (e.g., 500)
   - Return type (once or monthly)
   - Date
   - Optional growth percentage (for monthly returns)
4. Submit to add

### Viewing Projections
1. Use calendar to select any date
2. View accumulated totals in Daily Details Panel
3. See all events for that date in Events Table
4. Check projected balance calculation

### Filtering by Month
1. Click filter icon (sliders) in top right
2. Select desired month
3. Select desired year
4. Calendar updates automatically

## Sample Data

The system comes with sample data:
- Monthly Salary: $5,000 with 25% tax
- Double pay days in June and December
- Rent: $1,500/month
- Utilities: $200/month
- One-time stock return: $500 in July

## Key Algorithms

### Income Calculation
```typescript
getIncomeUpToDate(date: Date) {
  // For each income source:
  // 1. Calculate months between start and selected date
  // 2. Apply tax percentage
  // 3. Multiply by months count
  // 4. Add double-pay bonuses if applicable
  // 5. Sum all sources
}
```

### Deduction Calculation
```typescript
getDeductionsUpToDate(date: Date) {
  // For each deduction:
  // 1. Calculate months between start and selected date
  // 2. Ensure within end date if specified
  // 3. Multiply amount by months count
  // 4. Sum all deductions
}
```

### Investment Returns Calculation
```typescript
getInvestmentReturnsOnDate(date: Date) {
  // For each investment:
  // If one-time: add if date >= investment date
  // If monthly: calculate months elapsed
  // Apply growth percentage if specified
  // Sum all returns
}
```

## Color Scheme

### Light Mode
- Income: `#34A853` (Green)
- Expense: `#EA4335` (Red)
- Investment: `#1A73E8` (Blue)
- Primary: Blue tones
- Background: Clean white/gray

### Dark Mode
- Automatic contrast adjustments
- Maintained color associations
- Enhanced readability

## Performance Optimizations

1. **Memoized Calculations**: Zustand automatically optimizes re-renders
2. **Selective Updates**: Only affected components re-render on state changes
3. **Date Comparisons**: Efficient date range checks
4. **Event Filtering**: Optimized event lookups by date

## Future Enhancements (Not Implemented)

- Export data to CSV/Excel
- Import transactions from bank
- Budget alerts and notifications
- Multiple currency support
- Recurring transaction templates
- Data persistence with Supabase
- Historical trend analysis
- Bill payment reminders
- Category-based insights
- Mobile app version

## Notes

- All dates use local timezone
- Calculations are performed on-demand for efficiency
- State persists during session only (no database yet)
- Forms include validation for data integrity
- Responsive design works on mobile, tablet, and desktop
