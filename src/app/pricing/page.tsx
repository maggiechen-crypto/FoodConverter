"use client";

import { useSession } from "next-auth/react";
import { Check, Crown, Zap, Star } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const { data: session } = useSession();

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
                <Check className="w-5 h-5 text-green-500" /> 每日2次AI生成
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
              当前方案
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
              <p className="text-3xl font-bold text-purple-600 mb-4">¥18<span className="text-sm font-normal text-gray-500">/月</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 无限次AI生成
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
            <button className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium hover:opacity-90">
              {session ? '立即升级' : '登录后购买'}
            </button>
          </div>

          {/* 高级会员 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">高级会员</h2>
              <p className="text-3xl font-bold text-yellow-600 mb-4">¥38<span className="text-sm font-normal text-gray-500">/月</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 无限次AI生成
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
            <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90">
              {session ? '立即升级' : '登录后购买'}
            </button>
          </div>
        </div>

        <p className="text-center text-white/60 mt-8 text-sm">
          * 会员可随时取消，次月生效
        </p>
      </div>
    </div>
  );
}