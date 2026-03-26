import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api.siliconflow.cn/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, imageBase64, ingredients, lang, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: '请先设置 API Key' }, { status: 401 });
    }

    let result = '';

    if (action === 'recognize') {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'Qwen/Qwen2-VL-72B-Instruct',
          messages: [{ role: 'user', content: [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            { type: 'text', text: '请识别这张图片中的食材。用中文列出所有食材，用逗号分隔。只输出食材名称，不要其他解释。' }
          ] }],
          max_tokens: 1024,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      result = data.choices[0].message.content;
    } else if (action === 'generate') {
      const langPrompt = lang === 'en' ? 'Reply in English.' : '请用中文回复。';
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-72B-Instruct',
          messages: [{ role: 'user', content: `食材：${ingredients}\n\n请根据以上食材生成一道菜的食谱。格式如下：\n菜名：xxx\n食材：xxx（给出具体用量，如200g, 2个）\n调料：xxx（绝对不要写"适量",必须写具体用量如盐半勺=3g, 生抽1勺=15ml, 糖1茶匙=5g）\n步骤：1.xxx 2.xxx 3.xxx\n${langPrompt}` }],
          max_tokens: 2048,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      result = data.choices[0].message.content;
    }

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '服务器错误' }, { status: 500 });
  }
}