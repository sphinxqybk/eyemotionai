// EyeMotion Payment Service with Stripe Integration
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createSubscription } from './database-setup.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Stripe API Configuration
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

// EyeMotion Subscription Plans
const SUBSCRIPTION_PLANS = {
  freemium: {
    name: 'Freemium',
    price: 0,
    currency: 'thb',
    credits: 100,
    features: ['basic_editing', 'watermark', 'limited_exports'],
    stripe_price_id: null
  },
  creator: {
    name: 'Creator',
    price: 29900, // ฿299 in satang
    currency: 'thb',
    credits: 1000,
    features: ['hd_export', 'basic_ai', 'cloud_storage_5gb'],
    stripe_price_id: 'price_creator_monthly_thb'
  },
  pro: {
    name: 'Pro',
    price: 99900, // ฿999 in satang
    currency: 'thb',
    credits: 5000,
    features: ['4k_export', 'advanced_ai', 'cloud_storage_50gb', 'priority_support'],
    stripe_price_id: 'price_pro_monthly_thb'
  },
  studio: {
    name: 'Studio',
    price: 299900, // ฿2,999 in satang
    currency: 'thb',
    credits: 20000,
    features: ['unlimited_export', 'premium_ai', 'cloud_storage_500gb', 'white_label', 'api_access'],
    stripe_price_id: 'price_studio_monthly_thb'
  }
};

// Create Stripe Customer
export const createStripeCustomer = async (userId: string, email: string, name: string) => {
  try {
    console.log('💳 Creating Stripe customer:', email);

    const response = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: email,
        name: name,
        metadata: JSON.stringify({
          eyemotion_user_id: userId,
          created_via: 'eyemotion_platform'
        })
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create Stripe customer');
    }

    const customer = await response.json();
    
    console.log('✅ Stripe customer created:', customer.id);
    return { success: true, customerId: customer.id };
  } catch (error) {
    console.error('❌ Create Stripe customer failed:', error);
    return { success: false, error: error.message };
  }
};

// Create Subscription Checkout Session
export const createCheckoutSession = async (
  userId: string, 
  planName: string, 
  successUrl: string, 
  cancelUrl: string
) => {
  try {
    console.log('💳 Creating checkout session for plan:', planName);

    const plan = SUBSCRIPTION_PLANS[planName as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan || !plan.stripe_price_id) {
      throw new Error('Invalid subscription plan');
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    
    let customerId: string;
    const customerResult = await createStripeCustomer(
      userId, 
      authUser.user?.email || '', 
      profile?.full_name || ''
    );
    
    if (!customerResult.success) {
      throw new Error(customerResult.error);
    }
    customerId = customerResult.customerId;

    // Create checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: customerId,
        mode: 'subscription',
        'line_items[0][price]': plan.stripe_price_id,
        'line_items[0][quantity]': '1',
        success_url: successUrl,
        cancel_url: cancelUrl,
        'metadata[eyemotion_user_id]': userId,
        'metadata[plan_name]': planName,
        allow_promotion_codes: 'true',
        billing_address_collection: 'required'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create checkout session');
    }

    const session = await response.json();
    
    console.log('✅ Checkout session created:', session.id);
    return { 
      success: true, 
      sessionId: session.id,
      checkoutUrl: session.url 
    };
  } catch (error) {
    console.error('❌ Create checkout session failed:', error);
    return { success: false, error: error.message };
  }
};

// Handle Stripe Webhook
export const handleStripeWebhook = async (body: string, signature: string) => {
  try {
    console.log('💳 Handling Stripe webhook');

    // Verify webhook signature
    const event = await verifyStripeWebhook(body, signature);
    
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
        
      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return { success: true, message: 'Webhook processed' };
  } catch (error) {
    console.error('❌ Stripe webhook failed:', error);
    return { success: false, error: error.message };
  }
};

// Verify Stripe Webhook Signature
const verifyStripeWebhook = async (body: string, signature: string) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(STRIPE_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const sigHeader = signature.split(',').reduce((acc: any, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const payload = `${sigHeader.t}.${body}`;
  const expectedSignature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  const expectedHex = Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (expectedHex !== sigHeader.v1) {
    throw new Error('Invalid webhook signature');
  }

  return JSON.parse(body);
};

// Handle Checkout Completed
const handleCheckoutCompleted = async (session: any) => {
  try {
    const userId = session.metadata.eyemotion_user_id;
    const planName = session.metadata.plan_name;
    
    // Get subscription from Stripe
    const subResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${session.subscription}`, {
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
    });
    
    const subscription = await subResponse.json();
    
    // Get plan details
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', planName)
      .single();

    if (planError) throw planError;

    // Create subscription in database
    await createSubscription(userId, planData.id, {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      creditsIncluded: planData.credits_included
    });

    // Record payment transaction
    await recordPaymentTransaction(userId, session, 'completed');

    console.log('✅ Checkout completed for user:', userId);
  } catch (error) {
    console.error('❌ Handle checkout completed failed:', error);
    throw error;
  }
};

// Handle Payment Succeeded
const handlePaymentSucceeded = async (invoice: any) => {
  try {
    const subscriptionId = invoice.subscription;
    
    // Update subscription status
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'active',
        current_period_start: new Date(invoice.period_start * 1000).toISOString(),
        current_period_end: new Date(invoice.period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) throw error;

    console.log('✅ Payment succeeded for subscription:', subscriptionId);
  } catch (error) {
    console.error('❌ Handle payment succeeded failed:', error);
    throw error;
  }
};

// Handle Payment Failed
const handlePaymentFailed = async (invoice: any) => {
  try {
    const subscriptionId = invoice.subscription;
    
    // Update subscription status
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) throw error;

    // TODO: Send payment failure notification email

    console.log('✅ Payment failed handled for subscription:', subscriptionId);
  } catch (error) {
    console.error('❌ Handle payment failed failed:', error);
    throw error;
  }
};

// Handle Subscription Updated
const handleSubscriptionUpdated = async (subscription: any) => {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) throw error;

    console.log('✅ Subscription updated:', subscription.id);
  } catch (error) {
    console.error('❌ Handle subscription updated failed:', error);
    throw error;
  }
};

// Handle Subscription Cancelled
const handleSubscriptionCancelled = async (subscription: any) => {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) throw error;

    console.log('✅ Subscription cancelled:', subscription.id);
  } catch (error) {
    console.error('❌ Handle subscription cancelled failed:', error);
    throw error;
  }
};

// Record Payment Transaction
const recordPaymentTransaction = async (userId: string, paymentData: any, status: string) => {
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        stripe_payment_intent_id: paymentData.payment_intent,
        amount: paymentData.amount_total,
        currency: paymentData.currency,
        status: status,
        payment_method: 'stripe',
        metadata: paymentData,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    console.log('✅ Payment transaction recorded:', paymentData.payment_intent);
  } catch (error) {
    console.error('❌ Record payment transaction failed:', error);
    throw error;
  }
};

// Cancel Subscription
export const cancelSubscription = async (userId: string) => {
  try {
    console.log('💳 Cancelling subscription for user:', userId);

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subError) throw subError;

    // Cancel in Stripe
    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscription.stripe_subscription_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to cancel subscription');
    }

    console.log('✅ Subscription cancelled:', subscription.stripe_subscription_id);
    return { success: true };
  } catch (error) {
    console.error('❌ Cancel subscription failed:', error);
    return { success: false, error: error.message };
  }
};

// Purchase Additional Credits
export const purchaseCredits = async (userId: string, creditAmount: number) => {
  try {
    console.log('💳 Purchasing credits:', userId, creditAmount);

    const pricePerCredit = 0.50; // ฿0.50 per credit
    const totalAmount = Math.round(creditAmount * pricePerCredit * 100); // Convert to satang

    // Create one-time payment session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        mode: 'payment',
        'line_items[0][price_data][currency]': 'thb',
        'line_items[0][price_data][product_data][name]': `EyeMotion Credits (${creditAmount})`,
        'line_items[0][price_data][unit_amount]': totalAmount.toString(),
        'line_items[0][quantity]': '1',
        'metadata[eyemotion_user_id]': userId,
        'metadata[credit_amount]': creditAmount.toString(),
        'metadata[transaction_type]': 'credit_purchase',
        success_url: `${Deno.env.get('FRONTEND_URL')}/dashboard?purchase=success`,
        cancel_url: `${Deno.env.get('FRONTEND_URL')}/dashboard?purchase=cancelled`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create credit purchase session');
    }

    const session = await response.json();
    
    console.log('✅ Credit purchase session created:', session.id);
    return { 
      success: true, 
      sessionId: session.id,
      checkoutUrl: session.url 
    };
  } catch (error) {
    console.error('❌ Purchase credits failed:', error);
    return { success: false, error: error.message };
  }
};

// Get Payment History
export const getPaymentHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('❌ Get payment history failed:', error);
    return { success: false, error: error.message };
  }
};

// Initialize Subscription Plans in Database
export const initializeSubscriptionPlans = async () => {
  try {
    console.log('💳 Initializing subscription plans...');

    for (const [key, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
      const { error } = await supabase
        .from('subscription_plans')
        .upsert({
          name: key,
          display_name: plan.name,
          price: plan.price,
          currency: plan.currency,
          credits_included: plan.credits,
          features: plan.features,
          stripe_price_id: plan.stripe_price_id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'name'
        });

      if (error) throw error;
    }

    console.log('✅ Subscription plans initialized');
    return { success: true };
  } catch (error) {
    console.error('❌ Initialize subscription plans failed:', error);
    return { success: false, error: error.message };
  }
};