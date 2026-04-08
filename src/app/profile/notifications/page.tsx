"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Loader2, Check } from "lucide-react";

interface NotificationSettings {
  newRecipe: boolean;
  communityLike: boolean;
  weeklyReport: boolean;
  systemUpdate: boolean;
}

export default function Notifications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    newRecipe: true,
    communityLike: true,
    weeklyReport: false,
    systemUpdate: true
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      // TODO: 从数据库加载通知设置
      setTimeout(() => setLoading(false), 500);
    }
  }, [status, router]);

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: 保存到数据库
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    alert("通知设置已保存");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-white">通知设置</h1>
          <div className="w-16" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium text-gray-800">推送通知</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">新食谱推荐</p>
                <p className="text-gray-400 text-sm">AI 推荐你可能喜欢的新食谱</p>
              </div>
              <button
                onClick={() => toggleSetting('newRecipe')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.newRecipe ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.newRecipe ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">社区互动</p>
                <p className="text-gray-400 text-sm">有人点赞或评论你的分享</p>
              </div>
              <button
                onClick={() => toggleSetting('communityLike')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.communityLike ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.communityLike ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">周报推送</p>
                <p className="text-gray-400 text-sm">每周食谱使用情况总结</p>
              </div>
              <button
                onClick={() => toggleSetting('weeklyReport')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.weeklyReport ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.weeklyReport ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">系统通知</p>
                <p className="text-gray-400 text-sm">重要功能更新和维护通知</p>
              </div>
              <button
                onClick={() => toggleSetting('systemUpdate')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.systemUpdate ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.systemUpdate ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              保存设置
            </>
          )}
        </button>
      </div>
    </div>
  );
}