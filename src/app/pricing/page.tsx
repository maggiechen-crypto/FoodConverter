"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, Crown, Zap, Star, Loader2 } from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => any;
    };
  }
}

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<"basic" | "pro">("basic");
  const [currentTier, setCurrentTier] = useState<string>("free");
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // 检查当前会员状态
  useEffect(() => {
    if (!session?.user?.email) return;
    fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check', user_id: session.user.email })
    })
      .then(res => res.json())
      .then(data => setCurrentTier(data.tier || 'free'))
      .catch(console.error);
  }, [session]);

  // 加载 PayPal SDK
  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = "https://www.paypal.com/sdk/js?client-id=AZ_Ku0abVkadEeOm9TNLflI0SWRB3L9ZjCPksIuWUv1kwVVlnXkT6vGfAROviORSsTC4Zx3cd9bWW2rO&currency=USD";
    script.async = false;
    script.onload = () => setPaypalLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 渲染 PayPal 按钮
  useEffect(() => {
    if (!session || !window.paypal || !paypalLoaded) return;
    
    const tierConfig = {
      basic: { price: "2.99" },
      pro: { price: "5.99" }
    };
    
    const config = tierConfig[tier];
    const container = document.getElementById(`paypal-button-${tier}`);
    if (!container) return;
    
    // 清理旧的按钮
    container.innerHTML = '';
    
    window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "rect" },
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: `SnapCook ${tier === "basic" ? "Basic" : "Pro"} Plan`,
            amount: { currency_code: "USD", value: config.price }
          }]
        });
      },
      onApprove: async (_data: any, actions: any) => {
        setLoading(true);
        try {
          // 捕获订单
          await actions.order.capture();
          
          // 检查用户登录状态
          if (!session?.user?.email) {
            alert("请先登录后再支付");
            setLoading(false);
            return;
          }
          
          // 调用会员升级 API
          const res = await fetch('/api/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'upgrade',
              user_id: session.user.email,
              tier: tier
            })
          });
          
          if (!res.ok) {
            throw new Error("API request failed");
          }
          
          const result = await res.json();
          
          if (result.success) {
            // 直接跳转
            window.location.href = '/profile';
          } else {
            alert("支付成功，开通会员失败，请联系客服");
            setLoading(false);
          }
        } catch (err) {
          console.error("Payment error:", err);
          alert("支付出错，请刷新页面重试");
          setLoading(false);
        }
      },
      onError: (err: any) => {
        console.error("PayPal error:", err);
        alert("Payment failed. Please try again.");
      },
      onCancel: () => {
        alert("Payment cancelled.");
        setLoading(false);
      }
    }).render(`#paypal-button-${tier}`);
  }, [session, tier, paypalLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-white text-lg font-medium">← 返回</Link>
          <h1 className="text-2xl font-bold text-white">会员定价</h1>
          <div className="w-16"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 免费版 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">免费版</h2>
              <p className="text-3xl font-bold text-gray-800 mb-4">¥0<span className="text-sm font-normal text-gray-500">/月</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 3次AI生成（用完为止）
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 社区浏览与点赞
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span className="w-5 h-5 inline-flex items-center justify-center">×</span> 社区图片水印
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span className="w-5 h-5 inline-flex items-center justify-center">×</span> 专属食谱库
              </li>
            </ul>
            <button className="w-full py-3 border border-gray-300 text-gray-500 rounded-xl font-medium cursor-not-allowed">
              {/* 免费版不显示任何文字 */}
            </button>
          </div>

          {/* 基础会员 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg relative transform scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-4 py-1 rounded-full text-sm font-medium">
              最受欢迎
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">基础会员</h2>
              <p className="text-3xl font-bold text-purple-600 mb-4">$2.99<span className="text-sm font-normal text-gray-500">/月</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 每月25次AI生成
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 社区无水印
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 专属食谱库
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span className="w-5 h-5 inline-flex items-center justify-center">×</span> 高级功能
              </li>
            </ul>
            {session ? (
              <button 
                type="button"
                onClick={() => setTier("basic")}
                disabled={currentTier === "basic"}
                className={`w-full py-3 rounded-xl font-medium ${currentTier === "basic" ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90'}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (currentTier === "basic" ? "当前方案" : "立即升级")}
              </button>
            ) : (
              <Link href="/api/auth/signin" className="block w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium text-center hover:opacity-90">
                登录后购买
              </Link>
            )}
            {session && tier === "basic" && (
              <div id="paypal-button-basic" className="mt-2"></div>
            )}
          </div>

          {/* 高级会员 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">高级会员</h2>
              <p className="text-3xl font-bold text-yellow-600 mb-4">$5.99<span className="text-sm font-normal text-gray-500">/月</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 每月70次AI生成
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 社区无水印
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 专属食谱库
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 高级功能
              </li>
            </ul>
            {session ? (
              <button 
                type="button"
                onClick={() => setTier("pro")}
                disabled={currentTier === "pro"}
                className={`w-full py-3 rounded-xl font-medium ${currentTier === "pro" ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90'}`}
              >
                {loading && tier === "pro" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (currentTier === "pro" ? "当前方案" : "立即升级")}
              </button>
            ) : (
              <Link href="/api/auth/signin" className="block w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium text-center hover:opacity-90">
                登录后购买
              </Link>
            )}
            {session && tier === "pro" && (
              <div id="paypal-button-pro" className="mt-2"></div>
            )}
          </div>
        </div>

        <p className="text-center text-white/60 mt-8 text-sm">
          * 会员可随时取消，次月生效
        </p>
      </div>
    </div>
  );
}