// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase-server';
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/app/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate inputs
    const nameValidation = validateUsername(name);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());

    console.log('Creating user:', sanitizedEmail);

    // Create user with admin client (NO TRIGGER, so this should work)
    const { data: userData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: sanitizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: sanitizedName }
    });

    if (signUpError) {
      console.error('User creation error:', signUpError);
      return NextResponse.json(
        { error: signUpError.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    if (!userData?.user) {
      console.error('No user data returned');
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    console.log('User created successfully:', userData.user.id);

    // Now create the subscription (using service_role, bypassing RLS)
    try {
      // Get the free plan ID
      const { data: freePlan, error: planError } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .eq('name', 'free')
        .single();

      if (planError || !freePlan) {
        console.error('Failed to fetch free plan:', planError);
        // User is created but no subscription - they can still use the app
        return NextResponse.json({
          success: true,
          user: userData.user,
          subscription: null,
          message: 'Account created successfully',
          warning: 'Default subscription not assigned. Please contact support.'
        });
      }

      console.log('Creating subscription for user:', userData.user.id, 'with plan:', freePlan.id);

      // Create subscription using service role (has full permissions)
      const { data: subscription, error: subError } = await supabaseAdmin
        .from('user_subscriptions')
        .insert({
          user_id: userData.user.id,
          plan_id: freePlan.id
        })
        .select()
        .single();

      if (subError) {
        console.error('Subscription creation error:', subError);
        // User exists but subscription failed - they can still login
        return NextResponse.json({
          success: true,
          user: userData.user,
          subscription: null,
          message: 'Account created successfully',
          warning: 'Default subscription not assigned. Please contact support.'
        });
      }

      console.log('Subscription created successfully:', subscription);

      // Get full subscription details with plan info
      const { data: subscriptionDetails } = await supabaseAdmin
        .from('user_subscription_details')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();

      return NextResponse.json({
        success: true,
        user: userData.user,
        subscription: subscriptionDetails,
        message: 'Account created successfully'
      });

    } catch (subCreationError: any) {
      console.error('Unexpected subscription error:', subCreationError);
      // User is created, subscription failed - not critical
      return NextResponse.json({
        success: true,
        user: userData.user,
        subscription: null,
        message: 'Account created successfully',
        warning: 'Default subscription not assigned. Please contact support.'
      });
    }

  } catch (error: any) {
    console.error('Unexpected signup error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during signup' },
      { status: 500 }
    );
  }
}