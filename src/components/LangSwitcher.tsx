"use client";

import { useLang } from "./LangContext";
import { Globe } from "lucide-react";

export function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      className="flex items-center gap-1 px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
      title={lang === "zh" ? "Switch to English" : "切换到中文"}
    >
      <Globe className="w-4 h-4" />
      {lang === "zh" ? "EN" : "中"}
    </button>
  );
}