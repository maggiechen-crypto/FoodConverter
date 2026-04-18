import type { Metadata } from "next";
import { Camera, ChefHat, Sparkles, Users, Bookmark, Crown, Check, ArrowRight, Download, Image, BookOpen, Heart, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features - SnapCook | AI Recipe Generator from Photo",
  description: "Discover SnapCook's powerful features: AI food recognition, instant recipe generation, personal recipe library, community sharing, and more. Transform any food photo into a delicious recipe in seconds.",
  keywords: "AI recipe features, food photo to recipe, AI cooking assistant, recipe generator features, smart kitchen, food recognition technology, recipe app features",
  openGraph: {
    title: "SnapCook Features - AI Recipe Generator",
    description: "Transform any food photo into a delicious recipe in seconds. Discover all SnapCook features.",
    type: "website",
  },
};

const features = [
  {
    icon: Camera,
    title: "Smart Food Recognition",
    titleZh: "智能食材识别",
    description: "拍照上传任何食物图片，AI 自动识别食材成分。支持中餐、西餐、日料等多种菜系。",
    descriptionEn: "Upload any food photo and our AI will automatically recognize ingredients. Supports Chinese, Western, Japanese cuisines and more.",
  },
  {
    icon: Sparkles,
    title: "Instant Recipe Generation",
    titleZh: "AI 食谱生成",
    description: "识别食材后，几秒钟内生成完整的烹饪步骤和调味配方。",
    descriptionEn: "After recognizing ingredients, generate complete cooking instructions and seasoning recipes in seconds.",
  },
  {
    icon: BookOpen,
    title: "Personal Recipe Library",
    titleZh: "个人食谱库",
    description: "收藏喜欢的食谱，随时查看。高级会员还可设置饮食偏好和过敏原提醒。",
    descriptionEn: "Save your favorite recipes for easy access. Premium members can set dietary preferences and allergy alerts.",
  },
  {
    icon: Users,
    title: "Community Sharing",
    titleZh: "社区分享",
    description: "在社区分享你的作品，看看其他人的做法，互相学习。",
    descriptionEn: "Share your creations in the community and learn from others.",
  },
  {
    icon: Download,
    title: "Export & Save",
    titleZh: "导出保存",
    description: "生成食谱后可保存为图片或文字，随时离线查看。",
    descriptionEn: "Save generated recipes as images or text for offline access.",
  },
  {
    icon: Heart,
    title: "Smart Suggestions",
    titleZh: "智能推荐",
    description: "根据你的口味偏好和历史使用，智能推荐类似的菜品和做法。",
    descriptionEn: "Get smart recommendations based on your taste preferences and usage history.",
  },
];

const pricingPlans = [
  {
    tier: "Free",
    price: "$0",
    period: "/month",
    features: [
      "20 AI generations/month",
      "Watermarked images",
      "Browse community",
      "Basic features",
    ],
    highlight: false,
  },
  {
    tier: "Premium",
    price: "$5.99",
    period: "/month",
    features: [
      "Unlimited AI generations",
      "No watermarks",
      "Community sharing",
      "Personal recipe library",
      "Dietary preferences",
      "Priority support",
    ],
    highlight: true,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold flex items-center gap-2">
            <ChefHat className="w-8 h-8" /> SnapCook
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-white/80 hover:text-white">Features</Link>
            <Link href="/pricing" className="text-white/80 hover:text-white">Pricing</Link>
            <Link href="/#faq" className="text-white/80 hover:text-white">FAQ</Link>
          </nav>
          <Link href="/" className="px-4 py-2 bg-white text-purple-600 rounded-full font-medium hover:bg-white/90">
            Try Now →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Turn Any Food Photo Into <span className="text-yellow-300">Delicious Recipes</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            SnapCook uses advanced AI to recognize ingredients from photos and generate complete recipes in seconds. Perfect for home cooks, food enthusiasts, and anyone curious about what's in their dish.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-white/90 shadow-lg">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-8 py-4 bg-white/20 text-white rounded-xl font-medium text-lg hover:bg-white/30 border border-white/30">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Powerful Features</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to transform your cooking experience
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#667eea] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Take a Photo</h3>
              <p className="text-gray-600">Snap a photo of any dish, ingredient, or food</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#764ba2] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">AI Recognition</h3>
              <p className="text-gray-600">Our AI identifies what's in the image</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f5576c] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Get Recipe</h3>
              <p className="text-gray-600">Receive a complete recipe with steps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Simple Pricing</h2>
          <p className="text-gray-600 text-center mb-12">Choose the plan that works for you</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-6 ${plan.highlight ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-50 border border-gray-200'}`}>
                <h3 className="text-xl font-bold mb-2">{plan.tier}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/70">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className={`w-5 h-5 ${plan.highlight ? 'text-yellow-300' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-white' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className={`block w-full py-3 rounded-xl text-center font-medium ${plan.highlight ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  {plan.tier === "Free" ? "Get Started" : "Go Premium"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">What Users Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              <p className="text-white mb-4">"This app is amazing! I took a photo of a dish at a restaurant and got the recipe in seconds. Now I can make it at home!"</p>
              <p className="text-white/70 text-sm">- Sarah from USA</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              <p className="text-white mb-4">"Great for learning new recipes! The AI recognition is surprisingly accurate. Highly recommend for home cooks!"</p>
              <p className="text-white/70 text-sm">- Mike from UK</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">How accurate is the food recognition?</h3>
              <p className="text-gray-600">Our AI model is trained on millions of food images and achieves over 95% accuracy for common dishes. For less common or regional dishes, accuracy may vary.</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">Can I use it offline?</h3>
              <p className="text-gray-600">Currently, AI recognition requires an internet connection. Saved recipes can be viewed offline.</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">What cuisines does it support?</h3>
              <p className="text-gray-600">SnapCook supports Chinese, Western, Japanese, Korean, Thai, Indian, and many other cuisines. We're continuously adding more.</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">Yes! We use industry-standard encryption. Your photos and recipes are stored securely and never shared with third parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Cooking?</h2>
          <p className="text-white/80 mb-8">Join thousands of home cooks discovering new recipes every day</p>
          <Link href="/" className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-lg">
            Get Started for Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl flex items-center gap-2 mb-4">
                <ChefHat className="w-6 h-6" /> SnapCook
              </div>
              <p className="text-gray-400 text-sm">AI-powered recipe generator from any food photo.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/" className="hover:text-white">Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 SnapCook. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}