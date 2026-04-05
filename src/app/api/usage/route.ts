import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { action } = await req.json();
    const userId = session.user.email;

    // 检查会员状态
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', userId)
      .single();
    
    const isPremium = sub && sub.status === 'active' && (sub.tier === 'basic' || sub.tier === 'pro');

    if (action === 'check') {
      // 会员无限次
      if (isPremium) {
        return NextResponse.json({ remaining: 999, limit: 999, tier: sub.tier });
      }
      
      // 免费版检查次数
      const today = new Date().toISOString().split('T')[0];
      const { data: usage } = await supabase
        .from('user_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      const remaining = usage ? Math.max(0, 2 - usage.count) : 2;
      return NextResponse.json({ remaining, limit: 2, tier: 'free' });
    }

    if (action === 'increment') {
      // 会员不扣次数
      if (isPremium) {
        return NextResponse.json({ success: true });
      }
      
      // 免费版增加次数
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existing } = await supabase
        .from('user_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (existing) {
        await supabase
          .from('user_usage')
          .update({ count: existing.count + 1 })
          .eq('user_id', userId)
          .eq('date', today);
      } else {
        await supabase
          .from('user_usage')
          .insert({ user_id: userId, date: today, count: 1 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: '无效操作' }, { status: 400 });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}