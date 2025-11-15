# Finance Dashboard - Supabase Integration Guide

## Project Summary

Income Zenith is a smart finance tracking dashboard that calculates projected balance for any date based on monthly incomes, deductions, investments, and spending. The application features interactive calendar visualization, semicircle progress gauges, and detailed financial projections.

## Database Schema

The application uses three main tables to store financial data:

### Tables Created

1. **monthly_incomes** - Recurring monthly income sources
2. **monthly_deductions** - Recurring monthly expenses/deductions
3. **investment_returns** - One-time or recurring investment returns

All tables include:
- Row Level Security (RLS) enabled
- User isolation (users can only access their own data)
- Audit timestamps (created_at, updated_at)
- Proper indexes for performance

## Integration Checklist

### 1. Environment Setup
- [ ] Install Supabase client library (already in package.json)
- [ ] Create `.env` file with Supabase credentials
  - [ ] Add `VITE_SUPABASE_URL`
  - [ ] Add `VITE_SUPABASE_ANON_KEY`
- [ ] Verify Supabase project is created and accessible

### 2. Database Migration
- [x] Create database schema (completed)
- [x] Enable Row Level Security on all tables (completed)
- [x] Create RLS policies for user isolation (completed)
- [x] Add indexes for query performance (completed)
- [ ] Verify migration success in Supabase dashboard

### 3. Authentication Setup
- [ ] Set up Supabase Auth
  - [ ] Create authentication context/hook
  - [ ] Implement sign-up functionality
  - [ ] Implement sign-in functionality
  - [ ] Implement sign-out functionality
  - [ ] Add protected routes
- [ ] Create login page component
- [ ] Create registration page component
- [ ] Update MainLayout to handle auth state
- [ ] Add user profile management

### 4. Supabase Client Configuration
- [ ] Create Supabase client singleton (`src/lib/supabase.ts`)
- [ ] Configure client with environment variables
- [ ] Set up TypeScript types from database schema
- [ ] Generate TypeScript types: `npx supabase gen types typescript`

### 5. Update Finance Store (Zustand)
- [ ] Add Supabase integration to financeStore
  - [ ] Replace mock data with Supabase queries
  - [ ] Implement `fetchIncomes()` function
  - [ ] Implement `fetchDeductions()` function
  - [ ] Implement `fetchInvestments()` function
  - [ ] Add error handling for all queries
  - [ ] Add loading states

### 6. CRUD Operations Integration
- [ ] **Monthly Incomes**
  - [ ] Integrate `addIncome()` with Supabase INSERT
  - [ ] Integrate `removeIncome()` with Supabase DELETE
  - [ ] Add update income functionality
  - [ ] Handle double_pay_days JSONB field properly

- [ ] **Monthly Deductions**
  - [ ] Integrate `addDeduction()` with Supabase INSERT
  - [ ] Integrate `removeDeduction()` with Supabase DELETE
  - [ ] Add update deduction functionality

- [ ] **Investment Returns**
  - [ ] Integrate `addInvestment()` with Supabase INSERT
  - [ ] Integrate `removeInvestment()` with Supabase DELETE
  - [ ] Add update investment functionality
  - [ ] Handle growth_percentage for monthly returns

### 7. Real-time Subscriptions (Optional)
- [ ] Set up real-time listeners for income changes
- [ ] Set up real-time listeners for deduction changes
- [ ] Set up real-time listeners for investment changes
- [ ] Handle real-time updates in UI

### 8. Data Migration
- [ ] Create script to migrate existing sample data
- [ ] Test data migration with test accounts
- [ ] Verify calculations work with real data

### 9. Testing
- [ ] Test user registration and authentication flow
- [ ] Test adding new incomes
- [ ] Test adding new deductions
- [ ] Test adding new investments
- [ ] Test editing existing records
- [ ] Test deleting records
- [ ] Test date range filtering
- [ ] Test projected balance calculations
- [ ] Test calendar event display
- [ ] Verify RLS policies work correctly
- [ ] Test with multiple users to ensure data isolation

### 10. UI/UX Updates
- [ ] Add loading spinners for async operations
- [ ] Add error messages for failed operations
- [ ] Add success notifications
- [ ] Handle empty states when no data exists
- [ ] Add data validation before submission
- [ ] Improve form error handling

### 11. Performance Optimization
- [ ] Implement data caching strategy
- [ ] Optimize queries with proper indexes
- [ ] Add pagination for large datasets (if needed)
- [ ] Implement optimistic UI updates
- [ ] Add request debouncing where appropriate

### 12. Security Review
- [ ] Verify all RLS policies are working
- [ ] Test unauthorized access attempts
- [ ] Ensure no sensitive data in client-side code
- [ ] Review API key usage (use anon key only)
- [ ] Add input sanitization
- [ ] Implement CSRF protection if needed

### 13. Documentation
- [ ] Document Supabase setup process
- [ ] Document environment variable requirements
- [ ] Create API integration guide
- [ ] Update deployment documentation
- [ ] Add troubleshooting guide

### 14. Deployment Preparation
- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Test production database connection
- [ ] Set up database backups
- [ ] Configure monitoring and alerts

## Database Schema Reference

### monthly_incomes
```sql
CREATE TABLE monthly_incomes (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  amount numeric(12, 2) NOT NULL,
  frequency text DEFAULT 'monthly',
  start_date date NOT NULL,
  end_date date,
  tax_percentage numeric(5, 2) DEFAULT 0,
  double_pay_days jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### monthly_deductions
```sql
CREATE TABLE monthly_deductions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  amount numeric(12, 2) NOT NULL,
  frequency text DEFAULT 'monthly',
  start_date date NOT NULL,
  end_date date,
  category text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### investment_returns
```sql
CREATE TABLE investment_returns (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  return_amount numeric(12, 2) NOT NULL,
  date date NOT NULL,
  return_type text DEFAULT 'once',
  growth_percentage numeric(5, 2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Environment Variables Template

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

1. Set up your Supabase project at https://supabase.com
2. Copy the environment variables from your Supabase dashboard
3. Start implementing authentication
4. Integrate the finance store with Supabase queries
5. Test thoroughly with multiple users

## Important Notes

- The database migration has been applied successfully
- All tables have RLS enabled - authentication is required
- Double pay days are stored as JSONB array of dates
- All monetary values use NUMERIC type for precision
- Timestamps are automatically managed with triggers
- User data is completely isolated through RLS policies

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review the FINANCE_DASHBOARD_README.md for application logic
3. Check RLS policies in Supabase dashboard if data access issues occur
