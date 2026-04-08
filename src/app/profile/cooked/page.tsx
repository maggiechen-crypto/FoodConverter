"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  image?: string;
  created_at: string;
}

export default function Cooked() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // TODO: 从数据库获取做过的食谱
  useEffect(() => {
    if (status === "authenticated") {
      setTimeout(() => {
        setRecipes([]);
        setLoading(false);
      }, 500);
    }
  }, [status]);

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
          <h1 className="text-xl font-bold text-white">自己的作品</h1>
          <div className="w-16" />
        </div>

        {recipes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">还没有做过任何食谱</p>
            <p className="text-gray-400 text-sm mt-1">开始烹饪，记录你的作品吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl p-3 shadow-lg">
                {recipe.image && (
                  <img src={recipe.image} alt={recipe.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-medium text-gray-800">{recipe.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}