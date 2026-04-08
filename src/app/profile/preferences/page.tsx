"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Loader2, Check } from "lucide-react";

interface Preferences {
  cuisine: string[];
  diet: string[];
  spiceLevel: string;
  cookingTime: string;
}

const cuisineOptions = ["川菜", "粤菜", "湘菜", "西餐", "日料", "韩餐", "家常菜", "烘焙"];
const dietOptions = ["无特殊要求", "素食", "低碳水", "高蛋白", "无麸质"];
const spiceOptions = ["不辣", "微辣", "中辣", "重辣"];
const timeOptions = ["15分钟以内", "15-30分钟", "30-60分钟", "60分钟以上"];

export default function Preferences() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    cuisine: [],
    diet: [],
    spiceLevel: "不辣",
    cookingTime: "15-30分钟"
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      // TODO: 从数据库加载偏好设置
      setTimeout(() => setLoading(false), 500);
    }
  }, [status, router]);

  const toggleCuisine = (c: string) => {
    setPreferences(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(c) 
        ? prev.cuisine.filter(x => x !== c)
        : [...prev.cuisine, c]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: 保存到数据库
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    alert("偏好设置已保存");
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
          <h1 className="text-xl font-bold text-white">口味偏好</h1>
          <div className="w-16" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium text-gray-800">偏好菜系</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map(c => (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  preferences.cuisine.includes(c)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="font-medium text-gray-800 mb-4">饮食偏好</h3>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map(d => (
              <button
                key={d}
                onClick={() => setPreferences(prev => ({ ...prev, diet: d === prev.diet ? [] : [d] }))}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  preferences.diet.includes(d)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="font-medium text-gray-800 mb-4">辣度</h3>
          <div className="flex flex-wrap gap-2">
            {spiceOptions.map(s => (
              <button
                key={s}
                onClick={() => setPreferences(prev => ({ ...prev, spiceLevel: s }))}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  preferences.spiceLevel === s
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="font-medium text-gray-800 mb-4">烹饪时间</h3>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map(t => (
              <button
                key={t}
                onClick={() => setPreferences(prev => ({ ...prev, cookingTime: t }))}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  preferences.cookingTime === t
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
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