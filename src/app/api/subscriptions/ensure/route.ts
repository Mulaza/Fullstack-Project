// src/app/api/subscriptions/ensure/route.ts
// Call this endpoint if a user doesn't have a subscription
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase-server';

async function getUserFromRequest(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  return error ? null : user;
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Check if subscription exists
    const { data: existingSub } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingSub) {
      // Already has subscription
      const { data: subDetails } = await supabaseAdmin
        .from('user_subscription_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return NextResponse.json({
        success: true,
        subscription: subDetails,
        created: false
      });
    }

    // Create subscription
    const { data: freePlan } = await supabaseAdmin
      .from('subscription_plans')
      .select('id')
      .eq('name', 'free')
      .single();

    if (!freePlan) {
      return NextResponse.json(
        { error: 'Free plan not found' },
        { status: 500 }
      );
    }

    const { data: newSub, error: createError } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: freePlan.id
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create subscription:', createError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Get full details
    const { data: subDetails } = await supabaseAdmin
      .from('user_subscription_details')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      subscription: subDetails,
      created: true
    });

  } catch (error: any) {
    console.error('Ensure subscription error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}