"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Loader2, ChefHat, Languages, LogIn, LogOut, User, UserCircle, MessageCircle, X, Crown, Check } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Recipe {
  name: string;
  ingredients: string[];
  seasonings: string[];
  steps: string[];
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState<"upload" | "ingredients" | "recipe">("upload");
  const [remainingUsage, setRemainingUsage] = useState<number>(2);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [detectedIngredients, setDetectedIngredients] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 检查每日使用次数
  useEffect(() => {
    if (session) {
      fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' })
      })
        .then(res => res.json())
        .then(data => {
          if (data.remaining !== undefined) {
            setRemainingUsage(data.remaining);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result?.toString().split(",")[1] || "";
      setImageBase64(base64);
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRecognize = async () => {
    if (!imageBase64) { setError("请先上传图片"); return; }
    
    // 检查使用次数
    if (remainingUsage <= 0) {
      setShowUpgradeModal(true);
      return;
    }
    
    setLoading(true);
    setLoadingText("正在识别食材...");
    setError("");
    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recognize", imageBase64 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDetectedIngredients(data.result);
      setIngredients(data.result);
      setStep("ingredients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "识别失败");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) { setError("请先识别食材"); return; }
    
    // 检查使用次数
    if (remainingUsage <= 0) {
      setShowUpgradeModal(true);
      return;
    }
    
    setLoading(true);
    setLoadingText("正在生成食谱...");
    setError("");
    try {
      // 先增加使用次数
      await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'increment' })
      });
      
      // 更新剩余次数
      setRemainingUsage(prev => Math.max(0, prev - 1));
      
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", ingredients, lang }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRecipe(parseRecipe(data.result));
      setStep("recipe");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  const parseRecipe = (content: string): Recipe => {
    const lines = content.split("\n");
    const recipe: Recipe = { name: "未命名菜品", ingredients: [], seasonings: [], steps: [] };
    let section = "";
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.match(/^(菜名|Dish name)[:：]/i)) {
        recipe.name = trimmed.replace(/^(菜名|Dish name)[:：]\s*/i, "");
      } else if (trimmed.match(/^(食材|Ingredients|For the)[:：]/i)) {
        section = "ingredients";
        trimmed.replace(/^(食材|Ingredients|For the)[:：]\s*/i, "").split(/[,，、;]/).forEach((item) => { if (item.trim()) recipe.ingredients.push(item.trim()); });
      } else if (trimmed.match(/^(调料|Seasonings?)[:：]/i)) {
        section = "seasonings";
        trimmed.replace(/^(调料|Seasonings?)[:：]\s*/i, "").split(/[,，、;]/).forEach((item) => { if (item.trim()) recipe.seasonings.push(item.trim()); });
      } else if (trimmed.match(/^\d+[.、]/)) {
        const s = trimmed.replace(/^\d+[.、]\s*/, "");
        if (s) recipe.steps.push(s);
      } else if (section === "ingredients" && trimmed) {
        recipe.ingredients.push(trimmed);
      } else if (section === "seasonings" && trimmed) {
        recipe.seasonings.push(trimmed);
      }
    });
    return recipe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <div className="max-w-2xl mx-auto">
        {/* 顶部用户栏 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2"><ChefHat className="w-8 h-8" /> FoodConverter</h1>
            <p className="text-white/80 text-sm">拍照识菜 AI 食谱生成器</p>
          </div>
          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link href="/community" className="p-2 bg-white/20 rounded-full hover:bg-white/30" title="社区">
                  <MessageCircle className="w-5 h-5 text-white" />
                </Link>
                <Link href="/profile">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || ""} className="w-8 h-8 rounded-full hover:ring-2 hover:ring-white/50" />
                  ) : (
                    <UserCircle className="w-8 h-8 text-white" />
                  )}
                </Link>
                <button onClick={() => signOut()} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm flex items-center gap-1 hover:bg-white/30">
                  <LogOut className="w-4 h-4" /> 退出
                </button>
              </div>
            ) : (
              <button onClick={() => signIn("google")} className="px-4 py-2 bg-white text-purple-600 rounded-full font-medium flex items-center gap-2 hover:bg-white/90">
                <LogIn className="w-4 h-4" /> 登录
              </button>
            )}
          </div>
        </div>

        {/* 显示剩余次数 */}
        {session && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-4 flex items-center justify-between">
            <span className="text-white text-sm">今日剩余：</span>
            <div className="flex items-center gap-1">
              {[...Array(2)].map((_, i) => (
                <span key={i} className={`w-3 h-3 rounded-full ${i < remainingUsage ? 'bg-green-400' : 'bg-gray-400'}`} />
              ))}
              <span className="text-white font-medium ml-2">{remainingUsage}/2</span>
            </div>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">{error}</div>}
        
        {/* 未登录时显示登录提示 */}
        {!session && status !== "loading" && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <User className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">登录后使用</h2>
            <p className="text-gray-500 mb-4">点击下方按钮使用 Google 账号登录</p>
            <button onClick={() => signIn("google")} className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium flex items-center gap-2 mx-auto hover:opacity-90">
              <LogIn className="w-5 h-5" /> 使用 Google 登录
            </button>
          </div>
        )}

        {session && step === "upload" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500">
              {imagePreview ? <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" /> : <><Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">点击上传图片或拍照</p></>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {imagePreview && (
              <button onClick={handleRecognize} disabled={loading || remainingUsage <= 0} className="w-full mt-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChefHat className="w-5 h-5" />}
                {loading ? loadingText : remainingUsage <= 0 ? "今日次数已用完" : "识别食材"}
              </button>
            )}
          </div>
        )}
        {session && step === "ingredients" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🥬 识别出的食材</h2>
            <div className="flex flex-wrap gap-2 mb-4">{detectedIngredients.split(/[,，]/).map((ing, i) => (<span key={i} className="px-4 py-2 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white rounded-full text-sm">{ing.trim()}</span>))}</div>
            <div className="mb-4"><label className="text-sm text-gray-600 block mb-2">📝 可编辑食材（逗号分隔）：</label><textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl min-h-[100px]" /></div>
            <div className="flex gap-2">
              <button onClick={() => { setStep("upload"); setImagePreview(""); setImageBase64(""); }} className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl">重新拍照</button>
              <button onClick={handleGenerateRecipe} disabled={loading || remainingUsage <= 0} className="flex-1 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-xl disabled:opacity-50">
                {loading ? loadingText : remainingUsage <= 0 ? "今日次数已用完" : "生成食谱"}
              </button>
            </div>
          </div>
        )}
        {session && step === "recipe" && recipe && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-center mb-6">{recipe.name}</h2>
            <div className="mb-6"><h3 className="text-lg font-semibold text-purple-600 mb-3">🥩 {lang === "zh" ? "食材" : "Ingredients"}</h3><div className="bg-gray-50 p-4 rounded-xl">{recipe.ingredients.join(", ")}</div></div>
            <div className="mb-6"><h3 className="text-lg font-semibold text-purple-600 mb-3">🧂 {lang === "zh" ? "调料" : "Seasonings"}</h3><div className="space-y-2">{recipe.seasonings.map((s, i) => (<div key={i} className="bg-green-50 px-4 py-2 rounded-lg text-sm">{s}</div>))}</div></div>
            <div className="mb-6"><h3 className="text-lg font-semibold text-purple-600 mb-3">📝 {lang === "zh" ? "步骤" : "Steps"}</h3><ol className="space-y-3">{recipe.steps.map((s, i) => (<li key={i} className="flex gap-3"><span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span><span className="text-gray-600">{s}</span></li>))}</ol></div>
            <button onClick={() => { setStep("ingredients"); setRecipe(null); }} className="w-full py-3 border border-gray-300 text-gray-600 rounded-xl">← 返回修改食材</button>
          </div>
        )}
        {loading && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-8 text-center"><Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" /><p className="text-gray-600">{loadingText}</p></div></div>}

        {/* 升级弹窗 */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">次数已用完</h3>
                <p className="text-gray-500">升级会员，无限次生成！</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> 无限次AI生成
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> 社区无水印
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> 专属食谱库
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowUpgradeModal(false)} className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl">
                  稍后再说
                </button>
                <button onClick={() => router.push('/pricing')} className="flex-1 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium">
                  查看方案
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}