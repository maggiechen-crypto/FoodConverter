"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  ChefHat, 
  Settings, 
  Heart, 
  CheckCircle, 
  Sparkles, 
  Crown, 
  LogOut,
  ArrowLeft,
  User,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 模拟数据：实际需要从数据库获取
  const usageCount = 3;
  const monthlyLimit = 10;
  const isPremium = false; // 后续从数据库判断是否为高级会员
  const usagePercent = (usageCount / monthlyLimit) * 100;

  // 未登录时跳转回首页
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const menuItems: {
    title: string;
    icon: any;
    items: { label: string; icon: any; href: string; count?: number }[];
  }[] = [
    {
      title: "我的食谱库",
      icon: ChefHat,
      items: [
        { label: "收藏食谱", icon: Heart, href: "/profile/collections", count: 0 },
        { label: "已做过的", icon: CheckCircle, href: "/profile/cooked", count: 0 },
        { label: "AI 生成的", icon: Sparkles, href: "/profile/generated", count: 0 },
      ],
    },
    {
      title: "偏好设置",
      icon: Settings,
      items: [
        { label: "口味偏好", icon: User, href: "/profile/preferences" },
        { label: "通知设置", icon: Clock, href: "/profile/notifications" },
      ],
    },
    {
      title: "会员中心",
      icon: Crown,
      items: [
        { label: "当前：免费版", icon: Crown, href: "/profile/vip" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <div className="max-w-2xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold text-white">个人中心</h1>
          <div className="w-16" /> {/* 占位保持对称 */}
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "用户"}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-8 h-8 text-purple-500" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {session?.user?.name || "用户"}
              </h2>
              <p className="text-sm text-gray-500">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* 使用额度卡片 - 免费版显示，会员版隐藏 */}
        {!isPremium && (
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">📈 本月使用额度</h3>
              <span className="text-xs text-purple-600 font-medium">免费版</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {usageCount}/{monthlyLimit} 次
              </span>
            </div>
            <p className="text-xs text-gray-400">
              已使用 {usageCount} 次，剩余 {monthlyLimit - usageCount} 次
            </p>
            <Link 
              href="/pricing"
              className="block mt-3 text-center py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl text-sm font-medium hover:opacity-90"
            >
              升级为会员，享无限次数 →
            </Link>
          </div>
        )}

        {/* 会员版显示 */}
        {isPremium && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-medium">高级会员</h3>
                <p className="text-white/70 text-xs">无限次使用额度</p>
              </div>
            </div>
            <p className="text-white/80 text-sm">有效期至：2026年12月31日</p>
          </div>
        )}

        {/* 统计卡片 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">📊 我的数据</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-pink-50 rounded-xl">
              <div className="text-2xl font-bold text-pink-500">0</div>
              <div className="text-xs text-gray-500">收藏</div>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-500">0</div>
              <div className="text-xs text-gray-500">已做</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-500">0</div>
              <div className="text-xs text-gray-500">生成</div>
            </div>
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="space-y-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-5 h-5 text-purple-500" />
                <h3 className="font-medium text-gray-800">{section.title}</h3>
              </div>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && item.count > 0 && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                          {item.count}
                        </span>
                      )}
                      <span className="text-gray-400">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 退出登录 */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full mt-6 p-4 bg-white/20 text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>

        {/* 版本信息 */}
        <p className="text-center text-white/50 text-xs mt-4">
          SnapCook v1.0.0
        </p>
      </div>
    </div>
  );
}