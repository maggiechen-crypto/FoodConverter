"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; 
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
  Clock,
  Gem,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function Profile() {
  const { data: session, status } = useSession();
  const { t } = useLang();
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const [usageCount, setUsageCount] = useState(0);

  const isBasicOrPro = currentTier === 'basic' || currentTier === 'pro';
  const isPro = currentTier === 'pro';

  // 处理功能点击（只有高级会员才能使用）
  const handleFeatureClick = (e: React.MouseEvent, requiresPro: boolean, targetHref: string) => {
    e.preventDefault();
    if (!isPro && requiresPro) {
      alert(t("profile.pleaseUpgrade"));
      router.push('/pricing');
      return;
    }
    router.push(targetHref);
  };

  // 从数据库获取会员状态
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) {
      setLoading(false);
      return;
    }

    fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check', user_id: session.user.email })
    })
      .then(res => res.json())
      .then(data => {
        setCurrentTier(data.tier || 'free');
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // 获取使用次数
    fetch('/api/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' })
    })
      .then(res => res.json())
      .then(data => {
        setUsageCount(data.limit - data.remaining);
      })
      .catch(console.error);
  }, [session, status]);

  const usagePercent = (usageCount / 10) * 100;

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const tierLabels: Record<string, string> = {
    free: t("profile.tierFree"),
    basic: t("profile.tierBasic"), 
    pro: t("profile.tierPro")
  };

  // 菜单配置 - requiresPro 表示需要高级会员才能使用
  const menuSections = [
    {
      title: t("profile.myCollections"),
      icon: ChefHat,
      requiresPro: false,
      items: [
        { label: t("profile.menu.collections"), icon: Heart, href: "/profile/collections", requiresPro: false },
        { label: t("profile.menu.cooked"), icon: CheckCircle, href: "/profile/cooked", requiresPro: false },
        { label: t("profile.menu.generated"), icon: Sparkles, href: "/profile/generated", requiresPro: false },
      ],
    },
    {
      title: t("profile.preferences"),
      icon: Settings,
      requiresPro: false,
      items: [
        { label: t("profile.menu.preferences"), icon: User, href: "/profile/preferences", requiresPro: true },
        { label: t("profile.notifications"), icon: Clock, href: "/profile/notifications", requiresPro: true },
      ],
    },
    {
      title: t("profile.membership"),
      icon: Crown,
      requiresPro: false,
      items: [
        { label: `当前：${tierLabels[currentTier]}`, icon: Crown, href: "/pricing", requiresPro: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold text-white">{t("profile.title")}</h1>
          <div className="w-16" />
        </div>

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

        {!isBasicOrPro && (
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">📈 本月使用额度</h3>
              <span className="text-xs text-purple-600 font-medium">{tierLabels[currentTier]}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {usageCount}/3 次
              </span>
            </div>
            <p className="text-xs text-gray-400">
              已使用 {usageCount} 次，剩余 {3 - usageCount} 次
            </p>
            <Link 
              href="/pricing"
              className="block mt-3 text-center py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl text-sm font-medium hover:opacity-90"
            >
              {t("profile.upgrade")}
            </Link>
          </div>
        )}

        {isBasicOrPro && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              {isPro ? (
                <Gem className="w-6 h-6 text-white" />
              ) : (
                <Crown className="w-6 h-6 text-white" />
              )}
              <div>
                <h3 className="text-white font-medium">{tierLabels[currentTier]}</h3>
                <p className="text-white/70 text-xs">
                  本月剩余 {currentTier === 'basic' ? 25 - usageCount : 70 - usageCount}/{currentTier === 'basic' ? 25 : 70} 次
                </p>
              </div>
            </div>
            <Link 
              href="/pricing"
              className="inline-block mt-2 px-3 py-1 bg-white/20 text-white rounded-lg text-xs hover:bg-white/30"
            >
              查看详情 →
            </Link>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">📊 我的数据</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-pink-50 rounded-xl">
              <div className="text-2xl font-bold text-pink-500">0</div>
              <div className="text-xs text-gray-500">收藏</div>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-500">0</div>
              <div className="text-xs text-gray-500">自己的作品</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-500">0</div>
              <div className="text-xs text-gray-500">拍照识别的食谱</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {menuSections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-5 h-5 text-purple-500" />
                <h3 className="font-medium text-gray-800">{section.title}</h3>
              </div>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const isLocked = item.requiresPro && !isPro;
                  return (
                    <div
                      key={itemIdx}
                      onClick={(e) => isLocked ? handleFeatureClick(e, item.requiresPro, item.href) : router.push(item.href)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isLocked ? 'cursor-pointer hover:bg-gray-50' : 'cursor-pointer hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isLocked ? 'text-gray-300' : 'text-gray-400'}`} />
                        <span className={isLocked ? 'text-gray-400' : 'text-gray-700'}>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full mt-6 p-4 bg-white/20 text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {t("profile.logout")}
        </button>

        <p className="text-center text-white/50 text-xs mt-4">
          SnapCook v1.0.0
        </p>
      </div>
    </div>
  );
}