import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase-server';

// CSV export is ONLY for Business plan
const PLANS_WITH_CSV = ['business'];

async function getUserFromRequest(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  return error ? null : user;
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 400 }
      );
    }

    if (!PLANS_WITH_CSV.includes(subscription.plan)) {
      return NextResponse.json(
        {
          error: 'CSV export requires Business plan',
          requiresUpgrade: true,
          currentPlan: subscription.plan
        },
        { status: 403 }
      );
    }

    const { data: expenses, error: expensesError } = await supabaseAdmin
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (expensesError) {
      return NextResponse.json(
        { error: expensesError.message },
        { status: 400 }
      );
    }

    const headers = ['Title', 'Amount', 'Date', 'Category', 'Notes', 'Created At'];
    const rows = expenses.map(exp => [
      exp.title,
      exp.amount,
      exp.date,
      exp.category,
      exp.notes || '',
      exp.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=expenses_${new Date().toISOString().split('T')[0]}.csv`
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}