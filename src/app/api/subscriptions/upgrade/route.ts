// src/app/api/subscriptions/upgrade/route.ts
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
    const { planName } = await request.json();

    if (!planName) {
      return NextResponse.json(
        { error: 'Plan name is required' },
        { status: 400 }
      );
    }

    // Get the plan by name
    const { data: plan, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('name', planName)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const { data: existingSub, error: checkError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (checkError) {
      console.error('Error checking subscription:', checkError);
      return NextResponse.json(
        { error: 'Failed to check subscription' },
        { status: 500 }
      );
    }

    let data;
    let error;

    if (!existingSub || existingSub.length === 0) {
      // Create new subscription if none exists
      const result = await supabaseAdmin
        .from('user_subscriptions')
        .insert([{
          user_id: user.id,
          plan_id: plan.id,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {

      const result = await supabaseAdmin
        .from('user_subscriptions')
        .update({ 
          plan_id: plan.id,
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .select();
      
      // Take the first result if multiple exist (cleanup duplicates)
      data = result.data?.[0];
      error = result.error;

      // If we found duplicates, clean them up
      if (result.data && result.data.length > 1) {
        const keepId = result.data[0].id;
        await supabaseAdmin
          .from('user_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .neq('id', keepId);
      }
    }

    if (error) {
      console.error('Error updating subscription:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Get full subscription details with plan info
    const { data: subscriptionDetails } = await supabaseAdmin
      .from('user_subscription_details')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      subscription: subscriptionDetails,
      message: `Successfully upgraded to ${plan.display_name} plan`
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}