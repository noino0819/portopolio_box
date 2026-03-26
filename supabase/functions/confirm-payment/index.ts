import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TOSS_SECRET_KEY = Deno.env.get('TOSS_SECRET_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { paymentKey, orderId, amount, planType, slug, userId } = await req.json();

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

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let expiresAt: string | null = null;
    if (planType === 'monthly') {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (planType === 'yearly') {
      expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    await supabase.from('payments').insert({
      user_id: userId || null,
      email: confirmData.card?.ownerType === 'PERSONAL' ? '' : '',
      plan_type: planType,
      amount,
      status: 'completed',
      toss_payment_key: paymentKey,
      toss_order_id: orderId,
      slug_reserved: slug,
      expires_at: expiresAt,
      completed_at: new Date().toISOString(),
    });

    if (userId) {
      const { data: existing } = await supabase
        .from('portfolios')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!existing) {
        await supabase.from('portfolios').insert({
          user_id: userId,
          slug,
          is_active: true,
        });
      }
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
