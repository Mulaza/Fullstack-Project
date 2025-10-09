
# Database Schema

### Overview

This database is used for the ExpenseFlow app, which lets users track their expenses and manage subscription plans.
The setup avoids using the default Supabase auth trigger so that user and subscription data are handled manually and more transparently.

---

### Design Choices

**1. Minimal**
The database is small, so a single schema is enough. Each concept (plans, user subscriptions, expenses) has its own table, and everything is linked clearly.This structure keeps things easy to maintain and understand.

**2. `subscription_plans` Table**
Holds all the available plans: Free, Pro, and Business. Each plan has a price, features, and some flags for what the user can do (like exporting PDFs or CSVs). Using a JSONB field for features makes it easier to add or remove things later without changing the table structure.

**3. `user_subscriptions` Table**
Connects each user to a plan.
There’s a `UNIQUE(user_id)` rule so that one user can only have one active subscription. It also tracks when the user joined and last updated their plan.

**4. `expenses` Table**
Stores all expenses for each user.
Every expense includes a title, amount, date, category, and optional notes. Indexes are added for faster lookups by user, date, and category.

**5. `user_subscription_details` View**
This view joins user subscriptions with their plan info. It makes it easier for the frontend to get everything about a user’s plan in one query instead of writing complex joins.

---

### Security (RLS)

Row Level Security (RLS) is turned on for all tables.
Each user can only see or edit their own data.
The service role can access everything (for admin or backend use). Anyone can view the list of available plans.

---

### Triggers and Updates

A simple trigger updates the `updated_at` column automatically whenever a record is changed.
This helps keep timestamps consistent without having to handle them in the app.

