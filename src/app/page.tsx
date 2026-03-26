"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Loader2, ChefHat, Languages } from "lucide-react";

interface Recipe {
  name: string;
  ingredients: string[];
  seasonings: string[];
  steps: string[];
}

export default function Home() {
  const [step, setStep] = useState<"upload" | "ingredients" | "recipe">("upload");
  const [apiKey, setApiKey] = useState("");
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

  useEffect(() => {
    const saved = localStorage.getItem("sf_apikey");
    if (saved) setApiKey(saved);
  }, []);

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      setError("请输入 API Key");
      return;
    }
    localStorage.setItem("sf_apikey", apiKey);
    setError("");
  };

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
    if (!imageBase64) {
      setError("请先上传图片");
      return;
    }

    setLoading(true);
    setLoadingText("正在识别食材...");
    setError("");

    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "recognize",
          imageBase64,
          apiKey,
        }),
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
    if (!ingredients.trim()) {
      setError("请先识别食材");
      return;
    }

    setLoading(true);
    setLoadingText("正在生成食谱...");
    setError("");

    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          ingredients,
          lang,
        }),
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
    const recipe: Recipe = {
      name: "未命名菜品",
      ingredients: [],
      seasonings: [],
      steps: [],
    };
    let section = "";
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith("菜名：") || trimmed.startsWith("菜名:")) {
        recipe.name = trimmed.replace(/菜名[：:]\s*/, "");
      } else if (trimmed.startsWith("食材：") || trimmed.startsWith("食材:")) {
        section = "ingredients";
        const items = trimmed.replace(/食材[：:]\s*/, "").split(/[,，、]/);
        items.forEach((item) => {
          if (item.trim()) recipe.ingredients.push(item.trim());
        });
      } else if (trimmed.startsWith("调料：") || trimmed.startsWith("调料:")) {
        section = "seasonings";
        const items = trimmed.replace(/调料[：:]\s*/, "").split(/[,，、]/);
        items.forEach((item) => {
          if (item.trim()) recipe.seasonings.push(item.trim());
        });
      } else if (trimmed.match(/^\d+[.、]/)) {
        const step = trimmed.replace(/^\d+[.、]\s*/, "");
        if (step) recipe.steps.push(step);
      } else if (section === "ingredients" && trimmed) {
        recipe.ingredients.push(trimmed);
      } else if (section === "seasonings" && trimmed) {
        recipe.seasonings.push(trimmed);
      }
    });
    return recipe;
  };

  const toggleLang = async () => {
    const newLang = lang === "zh" ? "en" : "zh";
    setLang(newLang);
    if (ingredients) {
      setLoading(true);
      try {
        const res = await fetch("/api/food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate", ingredients, lang: newLang }),
        });
        const data = await res.json();
        if (!data.error) setRecipe(parseRecipe(data.result));
      } catch {}
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center text-white mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <ChefHat className="w-8 h-8" />
            FoodConverter
          </h1>
          <p className="text-white/80 text-sm">拍照识菜 AI 食谱生成器</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">{error}</div>}

        {step === "upload" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
              ) : (
                <>
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">点击上传图片或拍照</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {imagePreview && (
              <button
                onClick={handleRecognize}
                disabled={loading}
                className="w-full mt-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChefHat className="w-5 h-5" />}
                {loading ? loadingText : "识别食材"}
              </button>
            )}
          </div>
        )}

        {step === "ingredients" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🥬 识别出的食材</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {detectedIngredients.split(/[,，]/).map((ing, i) => (
                <span key={i} className="px-4 py-2 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white rounded-full text-sm">
                  {ing.trim()}
                </span>
              ))}
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-2">📝 可编辑食材（逗号分隔）：</label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setStep("upload"); setImagePreview(""); setImageBase64(""); }}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl"
              >
                重新拍照
              </button>
              <button
                onClick={handleGenerateRecipe}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-xl disabled:opacity-50"
              >
                {loading ? loadingText : "生成食谱"}
              </button>
            </div>
          </div>
        )}

        {step === "recipe" && recipe && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-end mb-4">
              <button onClick={toggleLang} className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-600 rounded-full">
                <Languages className="w-4 h-4" />
                {lang === "zh" ? "English" : "中文"}
              </button>
            </div>
            <h2 className="text-xl font-bold text-center mb-6">{recipe.name}</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-600 mb-3">🥩 {lang === "zh" ? "食材" : "Ingredients"}</h3>
              <div className="bg-gray-50 p-4 rounded-xl">{recipe.ingredients.join(", ")}</div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-600 mb-3">🧂 {lang === "zh" ? "调料" : "Seasonings"}</h3>
              <div className="space-y-2">
                {recipe.seasonings.map((s, i) => (
                  <div key={i} className="bg-green-50 px-4 py-2 rounded-lg text-sm">{s}</div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-600 mb-3">📝 {lang === "zh" ? "步骤" : "Steps"}</h3>
              <ol className="space-y-3">
                {recipe.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-600">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <button onClick={() => { setStep("ingredients"); setRecipe(null); }} className="w-full py-3 border border-gray-300 text-gray-600 rounded-xl">
              ← 返回修改食材
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">{loadingText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}