/*
  # Finance Dashboard Database Schema

  ## Overview
  This migration creates the core tables for the Finance Dashboard application,
  enabling users to track monthly incomes, deductions, and investment returns
  to calculate projected balances for any date.

  ## New Tables

  ### `monthly_incomes`
  Stores recurring monthly income sources with tax calculations
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users) - Owner of the income record
  - `name` (text) - Name of income source (e.g., "Monthly Salary")
  - `amount` (numeric) - Gross income amount before tax
  - `frequency` (text) - Always "monthly" for this version
  - `start_date` (date) - When this income starts
  - `end_date` (date, nullable) - When this income ends (if applicable)
  - `tax_percentage` (numeric) - Tax percentage to deduct (0-100)
  - `double_pay_days` (jsonb) - Array of dates when double pay occurs
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `monthly_deductions`
  Stores recurring monthly expenses and deductions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users) - Owner of the deduction record
  - `name` (text) - Name of deduction (e.g., "Rent")
  - `amount` (numeric) - Deduction amount
  - `frequency` (text) - Always "monthly" for this version
  - `start_date` (date) - When this deduction starts
  - `end_date` (date, nullable) - When this deduction ends (if applicable)
  - `category` (text) - Category of expense (Housing, Bills, etc.)
  - `notes` (text, nullable) - Optional notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `investment_returns`
  Stores one-time or recurring investment returns
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users) - Owner of the investment record
  - `name` (text) - Name of investment (e.g., "Stock Portfolio Return")
  - `return_amount` (numeric) - Amount of return
  - `date` (date) - Date of return (or start date for monthly returns)
  - `return_type` (text) - "once" or "monthly"
  - `growth_percentage` (numeric, nullable) - Monthly growth rate for recurring returns
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own financial records
  - Policies for SELECT, INSERT, UPDATE, DELETE operations

  ## Important Notes
  1. All monetary amounts stored as NUMERIC for precision
  2. Dates stored without timezone for consistent daily calculations
  3. Double pay days stored as JSONB array for flexibility
  4. All tables have audit timestamps (created_at, updated_at)
*/

-- Create monthly_incomes table
CREATE TABLE IF NOT EXISTS monthly_incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount >= 0),
  frequency text NOT NULL DEFAULT 'monthly' CHECK (frequency = 'monthly'),
  start_date date NOT NULL,
  end_date date,
  tax_percentage numeric(5, 2) NOT NULL DEFAULT 0 CHECK (tax_percentage >= 0 AND tax_percentage <= 100),
  double_pay_days jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create monthly_deductions table
CREATE TABLE IF NOT EXISTS monthly_deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount >= 0),
  frequency text NOT NULL DEFAULT 'monthly' CHECK (frequency = 'monthly'),
  start_date date NOT NULL,
  end_date date,
  category text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create investment_returns table
CREATE TABLE IF NOT EXISTS investment_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  return_amount numeric(12, 2) NOT NULL CHECK (return_amount >= 0),
  date date NOT NULL,
  return_type text NOT NULL DEFAULT 'once' CHECK (return_type IN ('once', 'monthly')),
  growth_percentage numeric(5, 2) CHECK (growth_percentage >= 0 AND growth_percentage <= 100),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_monthly_incomes_user_id ON monthly_incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_incomes_dates ON monthly_incomes(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_monthly_deductions_user_id ON monthly_deductions(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_deductions_dates ON monthly_deductions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_monthly_deductions_category ON monthly_deductions(category);

CREATE INDEX IF NOT EXISTS idx_investment_returns_user_id ON investment_returns(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_returns_date ON investment_returns(date);
CREATE INDEX IF NOT EXISTS idx_investment_returns_type ON investment_returns(return_type);

-- Enable Row Level Security
ALTER TABLE monthly_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_returns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for monthly_incomes
CREATE POLICY "Users can view own incomes"
  ON monthly_incomes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own incomes"
  ON monthly_incomes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incomes"
  ON monthly_incomes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own incomes"
  ON monthly_incomes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for monthly_deductions
CREATE POLICY "Users can view own deductions"
  ON monthly_deductions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deductions"
  ON monthly_deductions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deductions"
  ON monthly_deductions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deductions"
  ON monthly_deductions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for investment_returns
CREATE POLICY "Users can view own investments"
  ON investment_returns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
  ON investment_returns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
  ON investment_returns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
  ON investment_returns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_monthly_incomes_updated_at
  BEFORE UPDATE ON monthly_incomes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_deductions_updated_at
  BEFORE UPDATE ON monthly_deductions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_returns_updated_at
  BEFORE UPDATE ON investment_returns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
