// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Get user subscription with plan details using the view
    const { data: subscription } = await supabaseAdmin
      .from('user_subscription_details')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user,
      plan: subscription?.plan_name || 'free',
      subscription: subscription
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}