// src/app/api/exports/pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Supabase client inside the function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscription_details')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError) {
      console.error('Subscription fetch error:', subError);
      return NextResponse.json(
        { error: 'Could not fetch subscription' },
        { status: 500 }
      );
    }

    if (!subscription?.can_export_pdf) {
      return NextResponse.json(
        { error: 'Upgrade required to export reports', requiresUpgrade: true },
        { status: 403 }
      );
    }

    // Fetch expenses
    const { data: expenses, error: expenseError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (expenseError) {
      console.error('Expense fetch error:', expenseError);
      return NextResponse.json(
        { error: 'Failed to fetch expenses' },
        { status: 500 }
      );
    }

    // Calculate summary
    const total = (expenses || []).reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const expenseCount = expenses?.length || 0;

    // Group by category
    const categories = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Bills', 'Other'];
    const categoryBreakdown = categories
      .map(cat => {
        const categoryExpenses = (expenses || []).filter(exp => exp.category === cat);
        return {
          category: cat,
          total: categoryExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0),
          count: categoryExpenses.length
        };
      })
      .filter(item => item.count > 0);

    // Build JSON report
    const report = {
      report_metadata: {
        generated_at: new Date().toISOString(),
        generated_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        user_email: user.email,
        report_type: 'expense_export',
        version: '1.0'
      },
      summary: {
        total_expenses: expenseCount,
        total_amount: parseFloat(total.toFixed(2)),
        average_expense: expenseCount > 0 ? parseFloat((total / expenseCount).toFixed(2)) : 0,
        currency: 'USD',
        date_range: {
          earliest: expenseCount > 0 ? expenses[expenses.length - 1].date : null,
          latest: expenseCount > 0 ? expenses[0].date : null
        }
      },
      category_breakdown: categoryBreakdown.map(item => ({
        category: item.category,
        total: parseFloat(item.total.toFixed(2)),
        count: item.count,
        percentage: total > 0 ? parseFloat(((item.total / total) * 100).toFixed(2)) : 0
      })),
      expenses: (expenses || []).map(exp => ({
        id: exp.id,
        title: exp.title || 'Untitled',
        amount: parseFloat(exp.amount || 0),
        date: exp.date,
        category: exp.category || 'Other',
        notes: exp.notes || '',
        created_at: exp.created_at,
        updated_at: exp.updated_at
      }))
    };

    // Return as formatted JSON
    const jsonString = JSON.stringify(report, null, 2);
    const filename = `expense_report_${new Date().toISOString().split('T')[0]}.json`;

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Unexpected error in export route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}