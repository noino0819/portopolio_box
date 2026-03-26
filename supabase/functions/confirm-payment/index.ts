import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TOSS_SECRET_KEY = Deno.env.get('TOSS_SECRET_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? 'https://portopolio.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_PRICES: Record<string, number> = {
  monthly: 4900,
  yearly: 39000,
  permanent: 99000,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '인증이 필요합니다.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    ).auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: '유효하지 않은 세션입니다.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { paymentKey, orderId, amount, planType, slug } = await req.json();

    const expectedAmount = PLAN_PRICES[planType];
    if (!expectedAmount) {
      return new Response(JSON.stringify({ error: '유효하지 않은 플랜입니다.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (amount !== expectedAmount) {
      return new Response(JSON.stringify({ error: '결제 금액이 올바르지 않습니다.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const confirmRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(TOSS_SECRET_KEY + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const confirmData = await confirmRes.json();

    if (!confirmRes.ok) {
      return new Response(JSON.stringify({ error: confirmData.message ?? 'Payment confirmation failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (confirmData.totalAmount !== expectedAmount) {
      return new Response(JSON.stringify({ error: '결제 금액이 일치하지 않습니다.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let expiresAt: string | null = null;
    if (planType === 'monthly') {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (planType === 'yearly') {
      expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    await adminClient.from('payments').insert({
      user_id: user.id,
      email: user.email ?? '',
      plan_type: planType,
      amount: expectedAmount,
      status: 'completed',
      toss_payment_key: paymentKey,
      toss_order_id: orderId,
      slug_reserved: slug,
      expires_at: expiresAt,
      completed_at: new Date().toISOString(),
    });

    const { data: existing } = await adminClient
      .from('portfolios')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!existing) {
      await adminClient.from('portfolios').insert({
        user_id: user.id,
        slug,
        is_active: true,
      });
    }

    return new Response(JSON.stringify({ success: true, slug }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
