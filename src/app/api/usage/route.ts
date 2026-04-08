import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '@/lib/supabase';

// 每月1号重置次数
function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7); // "2026-04"
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { action } = await req.json();
    const userId = session.user.email;
    const currentMonth = getCurrentMonth();

    // 检查会员状态
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', userId)
      .single();
    
    const tier = sub?.tier || 'free';
    const isBasic = sub && sub.status === 'active' && tier === 'basic';
    const isPro = sub && sub.status === 'active' && tier === 'pro';
    const isPremium = isBasic || isPro;

    // 次数限制配置
    const limits: Record<string, number> = {
      free: 3,
      basic: 25,
      pro: 70
    };

    if (action === 'check') {
      // 免费用户：只有3次，用完就没，不会重置
      if (tier === 'free') {
        const { data: usage } = await supabase
          .from('user_usage')
          .select('count')
          .eq('user_id', userId)
          .single();

        const used = usage?.count || 0;
        const remaining = Math.max(0, 3 - used);
        return NextResponse.json({ remaining, limit: 3, tier: 'free' });
      }
      
      // 会员：每月次数，每月1号重置
      const { data: usage } = await supabase
        .from('user_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', currentMonth)
        .single();

      const used = usage?.count || 0;
      const remaining = Math.max(0, limits[tier] - used);
      return NextResponse.json({ remaining, limit: limits[tier], tier });
    }

    if (action === 'increment') {
      // 免费用户：累计3次，用完就没（不按月份，直接存总数）
      if (tier === 'free') {
        const { data: existing } = await supabase
          .from('user_usage')
          .select('count')
          .eq('user_id', userId)
          .single();

        if (existing) {
          await supabase
            .from('user_usage')
            .update({ count: existing.count + 1 })
            .eq('user_id', userId);
        } else {
          await supabase
            .from('user_usage')
            .insert({ user_id: userId, count: 1 });
        }
        return NextResponse.json({ success: true });
      }
      
      // 会员：每月次数（按月份存储）
      const { data: existing } = await supabase
        .from('user_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', currentMonth)
        .single();

      if (existing) {
        await supabase
          .from('user_usage')
          .update({ count: existing.count + 1 })
          .eq('user_id', userId)
          .eq('date', currentMonth);
      } else {
        await supabase
          .from('user_usage')
          .insert({ user_id: userId, date: currentMonth, count: 1 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: '无效操作' }, { status: 400 });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}