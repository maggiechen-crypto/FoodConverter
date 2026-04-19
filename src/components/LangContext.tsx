"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "zh" | "en";

interface Translations {
  [key: string]: string | Record<string, string>;
}

const translations: Record<Lang, Translations> = {
  zh: {
    // Navigation
    "nav.features": "功能介绍",
    "nav.pricing": "定价",
    "nav.faq": "常见问题",
    "nav.tryNow": "立即体验 →",
    "nav.home": "首页",
    
    // Hero
    "hero.title": "拍照识菜 AI 食谱生成器",
    "hero.subtitle": "几秒钟内把任何美食照片变成完整食谱",
    "hero.cta": "免费开始",
    "hero.secondary": "查看定价",
    
    // Features
    "features.title": "功能介绍",
    "features.subtitle": "强大功能，全面提升烹饪体验",
    "feature.recognition": "智能食材识别",
    "feature.recognition.desc": "拍照上传任何食物图片，AI自动识别食材成分。支持中餐、西餐、日料等多种菜系。",
    "feature.recipe": "AI 食谱生成",
    "feature.recipe.desc": "识别食材后，几秒钟内生成完整的烹饪步骤和调味配方。",
    "feature.library": "个人食谱库",
    "feature.library.desc": "收藏喜欢的食谱，随时查看。高级会员还可设置饮食偏好和过敏原提醒。",
    "feature.community": "社区分享",
    "feature.community.desc": "在社区分享你的作品，看看其他人的做法，互相学习。",
    "feature.export": "导出保存",
    "feature.export.desc": "生成食谱后可保存为图片或文字，随时离线查看。",
    "feature.suggest": "智能推荐",
    "feature.suggest.desc": "根据你的口味偏好和历史使用，智能推荐类似的菜品和做法。",
    
    // How it works
    "how.title": "使用流程",
    "how.step1": "拍照",
    "how.step1.desc": "拍摄任何菜品或食材的照片",
    "how.step2": "AI 识别",
    "how.step2.desc": "我们的 AI 自动识别图中食材",
    "how.step3": "获取食谱",
    "how.step3.desc": "收到完整的食谱和烹饪步骤",
    
    // Pricing
    "pricing.title": "定价方案",
    "pricing.subtitle": "选择适合你的方案",
    "pricing.free": "免费",
    "pricing.premium": "高级会员",
    "pricing.perMonth": "/月",
    "pricing.unlimited": "无限次",
    "pricing.noWatermark": "无水印图片",
    "pricing.community": "社区分享",
    "pricing.library": "个人食谱库",
    "pricing.preferences": "偏好设置",
    "pricing.priority": "优先支持",
    "pricing.getStarted": "开始使用",
    "pricing.goPremium": "立即升级",
    
    // FAQ
    "faq.title": "常见问题",
    "faq.q1": "识别准确吗？",
    "faq.a1": "我们的 AI 模型经过数百万张美食图片训练，对常见菜品的识别准确率超过 95%。对于较少见的地方菜品，准确率可能略有差异。",
    "faq.q2": "可以离线使用吗？",
    "faq.a2": "目前 AI 识别需要联网。保存的食谱可以离线查看。",
    "faq.q3": "支持哪些菜系？",
    "faq.a3": "支持中餐、西餐、日料、韩餐、泰餐、印度菜等。我们正在不断添加更多菜系。",
    "faq.q4": "数据安全吗？",
    "faq.a4": "是的！我们使用行业标准加密。你的照片和食谱安全存储，绝不与第三方分享。",
    
    // Footer
    "footer.product": "产品",
    "footer.company": "公司",
    "footer.legal": "法律",
    "footer.about": "关于我们",
    "footer.blog": "博客",
    "footer.careers": "加入我们",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",
    "footer.copyright": "© 2026 SnapCook. 保留所有权利。",
    
    // CTA
    "cta.title": "准备好改变你的烹饪方式了吗？",
    "cta.subtitle": "每天都有成千上万的 home cooks 在发现新食谱",
    "cta.button": "免费开始使用 →",
    
    // Testimonials
    "testimonials.title": "用户评价",
    "testimonial.1": "这 app 太神了！我在餐厅拍了一道菜，几秒钟就收到了食谱。现在我可以在家做了！",
    "testimonial.1.author": "来自美国的 Sarah",
    "testimonial.2": "学习新食谱的好帮手！AI 识别出奇地准确。强烈推荐给 home cooks！",
    "testimonial.2.author": "来自英国的 Mike",
    
    // Home page
    "home.subtitle": "拍照识菜 AI 食谱生成器",
    "home.uploadPrompt": "点击上传图片或拍照",
    "home.recognize": "识别食材",
    "home.noRemainings": "本月次数已用完",
    "home.loginTitle": "登录后使用",
    "home.loginDesc": "点击下方按钮使用 Google 账号登录",
    "home.loginBtn": "使用 Google 登录",
    "home.remaining": "剩余：",
    "home.remainingMonth": "本月剩余：",
    "home.timesUsed": "次",
    "home.timesUsedUp": "次数已用完",
    "home.logout": "退出",
    "home.login": "登录",
    "home.community": "社区",
    "home.step1Title": "第 1 步",
    "home.step1Desc": "上传食材或菜品照片",
    "home.step2Title": "第 2 步",
    "home.step2Desc": "AI 自动识别食材",
    "home.step3Title": "第 3 步",
    "home.step3Desc": "获取完整食谱",
    "home.confirmIngredients": "确认食材",
    "home.editIngredients": "可点击编辑",
    "home.generateRecipe": "生成食谱",
    "home.ingredients": "食材",
    "home.seasonings": "调料",
    "home.steps": "步骤",
    "home.cannotRecognize": "无法识别图片中的食材",
    "home.ingredientPrompt": "请先上传图片",
    "home.ingredientsPrompt": "请先识别食材",
    "home.recognizeFailed": "识别失败",
    "home.generateFailed": "生成失败",
    "home.dishName": "菜名",
    
    // Profile page
    "profile.title": "个人中心",
    "profile.myCollections": "我的收藏",
    "profile.myPosts": "我的晒图",
    "profile.notifications": "通知设置",
    "profile.preferences": "偏好设置",
    "profile.membership": "会员中心",
    "profile.membershipStatus": "会员状态",
    "profile.tierFree": "免费版",
    "profile.tierBasic": "基础会员",
    "profile.tierPro": "高级会员",
    "profile.upgrade": "升级为会员，享受更多次数 →",
    "profile.logout": "退出登录",
    "profile.noRecords": "暂无记录",
    "profile.pleaseUpgrade": "请升级为高级会员后即可使用此功能",
    "profile.remainingUses": "剩余次数",
    "profile.unlimited": "无限次",
    "profile.menuCollections": "我的收藏",
    "profile.menuCooked": "我的晒图",
    "profile.menuGenerated": "生成的食谱",
    "profile.menuPreferences": "偏好设置",
    
    // Pricing page
    "pricing.title": "会员定价",
    "pricing.free": "免费版",
    "pricing.basic": "基础会员",
    "pricing.pro": "高级会员",
    "pricing.perMonth": "/月",
    "pricing.aiGenerations": "次AI生成",
    "pricing.unlimited": "无限次",
    "pricing.noWatermark": "无水印",
    "pricing.community": "社区",
    "pricing.watermark": "水印",
    "pricing.premiumFeatures": "高级功能",
    "pricing.upgrade": "立即升级",
    "pricing.loginToBuy": "登录后购买",
    "pricing.loginFirst": "请先登录后再支付",
    "pricing.paymentSuccess": "支付成功，开通会员失败，请联系客服",
    "pricing.paymentError": "支付出错，请刷新页面重试",
    "pricing.library": "专属食谱库",
    "pricing.myData": "我的数据",
    "pricing.collections": "收藏",
    "pricing.myPosts": "自己的作品",
    "pricing.generatedRecipes": "拍照识别的食谱",
    "pricing.viewDetails": "查看详情 →",
    "pricing.usageQuota": "本月使用额度",
  },
  en: {
    // Navigation
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.tryNow": "Try Now →",
    "nav.home": "Home",
    
    // Hero
    "hero.title": "AI Recipe Generator from Photo",
    "hero.subtitle": "Transform any food photo into a complete recipe in seconds",
    "hero.cta": "Start Free",
    "hero.secondary": "View Pricing",
    
    // Features
    "features.title": "Features",
    "features.subtitle": "Powerful features to transform your cooking experience",
    "feature.recognition": "Smart Food Recognition",
    "feature.recognition.desc": "Upload any food photo and our AI will automatically recognize ingredients. Supports Chinese, Western, Japanese cuisines and more.",
    "feature.recipe": "AI Recipe Generation",
    "feature.recipe.desc": "After recognizing ingredients, generate complete cooking instructions and seasoning recipes in seconds.",
    "feature.library": "Personal Recipe Library",
    "feature.library.desc": "Save your favorite recipes for easy access. Premium members can set dietary preferences and allergy alerts.",
    "feature.community": "Community Sharing",
    "feature.community.desc": "Share your creations in the community and learn from others.",
    "feature.export": "Export & Save",
    "feature.export.desc": "Save generated recipes as images or text for offline access.",
    "feature.suggest": "Smart Suggestions",
    "feature.suggest.desc": "Get smart recommendations based on your taste preferences and usage history.",
    
    // How it works
    "how.title": "How It Works",
    "how.step1": "Take a Photo",
    "how.step1.desc": "Snap a photo of any dish, ingredient, or food",
    "how.step2": "AI Recognition",
    "how.step2.desc": "Our AI identifies what's in the image",
    "how.step3": "Get Recipe",
    "how.step3.desc": "Receive a complete recipe with steps",
    
    // Pricing
    "pricing.title": "Pricing",
    "pricing.subtitle": "Choose the plan that works for you",
    "pricing.free": "Free",
    "pricing.premium": "Premium",
    "pricing.perMonth": "/month",
    "pricing.unlimited": "Unlimited AI generations",
    "pricing.noWatermark": "No watermarks",
    "pricing.community": "Community sharing",
    "pricing.library": "Personal recipe library",
    "pricing.preferences": "Dietary preferences",
    "pricing.priority": "Priority support",
    "pricing.getStarted": "Get Started",
    "pricing.goPremium": "Go Premium",
    
    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "How accurate is the food recognition?",
    "faq.a1": "Our AI model is trained on millions of food images and achieves over 95% accuracy for common dishes. For less common or regional dishes, accuracy may vary.",
    "faq.q2": "Can I use it offline?",
    "faq.a2": "Currently, AI recognition requires an internet connection. Saved recipes can be viewed offline.",
    "faq.q3": "What cuisines does it support?",
    "faq.a3": "SnapCook supports Chinese, Western, Japanese, Korean, Thai, Indian, and many other cuisines. We're continuously adding more.",
    "faq.q4": "Is my data secure?",
    "faq.a4": "Yes! We use industry-standard encryption. Your photos and recipes are stored securely and never shared with third parties.",
    
    // Footer
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.about": "About",
    "footer.blog": "Blog",
    "footer.careers": "Careers",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.copyright": "© 2026 SnapCook. All rights reserved.",
    
    // CTA
    "cta.title": "Ready to Transform Your Cooking?",
    "cta.subtitle": "Join thousands of home cooks discovering new recipes every day",
    "cta.button": "Get Started for Free →",
    
    // Testimonials
    "testimonials.title": "What Users Say",
    "testimonial.1": "This app is amazing! I took a photo of a dish at a restaurant and got the recipe in seconds. Now I can make it at home!",
    "testimonial.1.author": "- Sarah from USA",
    "testimonial.2": "Great for learning new recipes! The AI recognition is surprisingly accurate. Highly recommend for home cooks!",
    "testimonial.2.author": "- Mike from UK",
    
    // Home page
    "home.subtitle": "AI Recipe Generator from Photo",
    "home.uploadPrompt": "Tap to upload a photo or take a picture",
    "home.recognize": "Recognize",
    "home.noRemainings": "No more usage this month",
    "home.loginTitle": "Sign in to use",
    "home.loginDesc": "Sign in with your Google account",
    "home.loginBtn": "Sign in with Google",
    "home.remaining": "Remaining:",
    "home.remainingMonth": "This month:",
    "home.timesUsed": "times",
    "home.timesUsedUp": "Used up",
    "home.logout": "Logout",
    "home.login": "Sign in",
    "home.community": "Community",
    "home.step1Title": "Step 1",
    "home.step1Desc": "Upload a photo of ingredients or dish",
    "home.step2Title": "Step 2",
    "home.step2Desc": "AI recognizes ingredients",
    "home.step3Title": "Step 3",
    "home.step3Desc": "Get complete recipe",
    "home.confirmIngredients": "Confirm ingredients",
    "home.editIngredients": "Tap to edit",
    "home.generateRecipe": "Generate Recipe",
    "home.ingredients": "Ingredients",
    "home.seasonings": "Seasonings",
    "home.steps": "Steps",
    "home.cannotRecognize": "Cannot recognize ingredients in the image",
    "home.ingredientPrompt": "Please upload an image first",
    "home.ingredientsPrompt": "Please recognize ingredients first",
    "home.recognizeFailed": "Recognition failed",
    "home.generateFailed": "Generation failed",
    "home.dishName": "Dish name",
    
    // Profile page
    "profile.title": "Profile",
    "profile.myCollections": "My Collections",
    "profile.myPosts": "My Posts",
    "profile.notifications": "Notification Settings",
    "profile.preferences": "Preferences",
    "profile.membership": "Membership",
    "profile.membershipStatus": "Membership Status",
    "profile.tierFree": "Free",
    "profile.tierBasic": "Basic",
    "profile.tierPro": "Premium",
    "profile.upgrade": "Upgrade for more usage →",
    "profile.logout": "Sign Out",
    "profile.noRecords": "No records yet",
    "profile.pleaseUpgrade": "Please upgrade to Premium to use this feature",
    "profile.remainingUses": "Remaining uses",
    "profile.unlimited": "Unlimited",
    "profile.menuCollections": "My Collections",
    "profile.menuCooked": "My Posts",
    "profile.menuGenerated": "Generated Recipes",
    "profile.menuPreferences": "Preferences",
    
    // Pricing page
    "pricing.title": "Membership",
    "pricing.free": "Free",
    "pricing.basic": "Basic",
    "pricing.pro": "Premium",
    "pricing.perMonth": "/month",
    "pricing.aiGenerations": "AI generations",
    "pricing.unlimited": "Unlimited",
    "pricing.noWatermark": "No watermark",
    "pricing.community": "Community",
    "pricing.watermark": "Watermark",
    "pricing.premiumFeatures": "Premium features",
    "pricing.upgrade": "Upgrade Now",
    "pricing.loginToBuy": "Sign in to purchase",
    "pricing.loginFirst": "Please sign in first",
    "pricing.paymentSuccess": "Payment success, but failed to activate. Please contact support.",
    "pricing.paymentError": "Payment failed. Please refresh and try again.",
    "pricing.library": "Private Recipe Library",
    "pricing.myData": "My Data",
    "pricing.collections": "Collections",
    "pricing.myPosts": "My Posts",
    "pricing.generatedRecipes": "Generated",
    "pricing.viewDetails": "View Details →",
    "pricing.usageQuota": "This Month's Usage",
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 读取语言设置
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("snapcook-lang") as Lang;
    if (saved && (saved === "zh" || saved === "en")) {
      setLang(saved);
    }
  }, []);

  // 保存语言设置
  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("snapcook-lang", newLang);
  };

  // 翻译函数
  const t = (key: string): string => {
    const value = translations[lang][key] || translations["zh"][key] || key;
    if (typeof value === 'object') {
      return key; // fallback for object types
    }
    return value;
  };

  if (!mounted) {
    return null;
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
}