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

    if (action === 'check') {
      // 检查今日次数
      const today = new Date().toISOString().split('T')[0];
      const { data: usage } = await supabase
        .from('user_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      const remaining = usage ? Math.max(0, 2 - usage.count) : 2;
      return NextResponse.json({ remaining, limit: 2 });
    }

    if (action === 'increment') {
      // 增加使用次数
      const today = new Date().toISOString().split('T')[0];
      
      // 使用 upsert 自动处理今天是否已有记录
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