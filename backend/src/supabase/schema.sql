CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  budget_type TEXT NOT NULL CHECK (budget_type IN ('personal', 'shared', 'family')),
  group_id TEXT NOT NULL,
  group_name TEXT NOT NULL,
  name TEXT NOT NULL,
  budgeted DECIMAL(10,2) DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  available DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  payee TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own data
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users see own categories" ON categories
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users insert own categories" ON categories
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users update own categories" ON categories
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users delete own categories" ON categories
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users see own transactions" ON transactions
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users insert own transactions" ON transactions
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users update own transactions" ON transactions
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users delete own transactions" ON transactions
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);
