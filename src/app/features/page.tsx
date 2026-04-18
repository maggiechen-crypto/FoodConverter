"use client";

import { Camera, ChefHat, Sparkles, Users, Bookmark, Crown, Check, ArrowRight, Download, Image, BookOpen, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { LangSwitcher } from "@/components/LangSwitcher";

const features = [
  {
    icon: Camera,
    key: "feature.recognition",
  },
  {
    icon: Sparkles,
    key: "feature.recipe",
  },
  {
    icon: BookOpen,
    key: "feature.library",
  },
  {
    icon: Users,
    key: "feature.community",
  },
  {
    icon: Download,
    key: "feature.export",
  },
  {
    icon: Heart,
    key: "feature.suggest",
  },
];

const pricingPlans = [
  {
    tier: "Free",
    price: "$0",
    highlight: false,
  },
  {
    tier: "Premium",
    price: "$5.99",
    highlight: true,
  },
];

function FeaturesContent() {
  const { t } = useLang();

  const featuresData = [
    { icon: Camera, title: t("feature.recognition"), desc: t("feature.recognition.desc") },
    { icon: Sparkles, title: t("feature.recipe"), desc: t("feature.recipe.desc") },
    { icon: BookOpen, title: t("feature.library"), desc: t("feature.library.desc") },
    { icon: Users, title: t("feature.community"), desc: t("feature.community.desc") },
    { icon: Download, title: t("feature.export"), desc: t("feature.export.desc") },
    { icon: Heart, title: t("feature.suggest"), desc: t("feature.suggest.desc") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold flex items-center gap-2">
            <ChefHat className="w-8 h-8" /> SnapCook
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-white/80 hover:text-white">{t("nav.features")}</Link>
            <Link href="/pricing" className="text-white/80 hover:text-white">{t("nav.pricing")}</Link>
            <Link href="/#faq" className="text-white/80 hover:text-white">{t("nav.faq")}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <Link href="/" className="px-4 py-2 bg-white text-purple-600 rounded-full font-medium hover:bg-white/90">
              {t("nav.tryNow")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-white/90 shadow-lg">
              {t("hero.cta")} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-8 py-4 bg-white/20 text-white rounded-xl font-medium text-lg hover:bg-white/30 border border-white/30">
              {t("hero.secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{t("features.title")}</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">{t("how.title")}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#667eea] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t("how.step1")}</h3>
              <p className="text-gray-600">{t("how.step1.desc")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#764ba2] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t("how.step2")}</h3>
              <p className="text-gray-600">{t("how.step2.desc")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f5576c] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t("how.step3")}</h3>
              <p className="text-gray-600">{t("how.step3.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{t("pricing.title")}</h2>
          <p className="text-gray-600 text-center mb-12">{t("pricing.subtitle")}</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-6 ${plan.highlight ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-50 border border-gray-200'}`}>
                <h3 className="text-xl font-bold mb-2">{plan.tier === "Free" ? t("pricing.free") : t("pricing.premium")}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/70">{t("pricing.perMonth")}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className={`w-5 h-5 ${plan.highlight ? 'text-yellow-300' : 'text-green-500'}`} />
                    <span className={plan.highlight ? 'text-white' : 'text-gray-600'}>20 {t("pricing.unlimited").toLowerCase().replace("unlimited", "")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className={`w-5 h-5 ${plan.highlight ? 'text-yellow-300' : 'text-green-500'}`} />
                    <span className={plan.highlight ? 'text-white' : 'text-gray-600'}>{t("pricing.noWatermark")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className={`w-5 h-5 ${plan.highlight ? 'text-yellow-300' : 'text-green-500'}`} />
                    <span className={plan.highlight ? 'text-white' : 'text-gray-600'}>{t("pricing.community")}</span>
                  </li>
                  {plan.highlight && (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-yellow-300" />
                        <span className="text-white">{t("pricing.library")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-yellow-300" />
                        <span className="text-white">{t("pricing.preferences")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-yellow-300" />
                        <span className="text-white">{t("pricing.priority")}</span>
                      </li>
                    </>
                  )}
                </ul>
                <Link href="/pricing" className={`block w-full py-3 rounded-xl text-center font-medium ${plan.highlight ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  {plan.tier === "Free" ? t("pricing.getStarted") : t("pricing.goPremium")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">{t("testimonials.title")}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              <p className="text-white mb-4">"{t("testimonial.1")}"</p>
              <p className="text-white/70 text-sm">{t("testimonial.1.author")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              <p className="text-white mb-4">"{t("testimonial.2")}"</p>
              <p className="text-white/70 text-sm">{t("testimonial.2.author")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t("faq.title")}</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">{t("faq.q1")}</h3>
              <p className="text-gray-600">{t("faq.a1")}</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">{t("faq.q2")}</h3>
              <p className="text-gray-600">{t("faq.a2")}</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">{t("faq.q3")}</h3>
              <p className="text-gray-600">{t("faq.a3")}</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">{t("faq.q4")}</h3>
              <p className="text-gray-600">{t("faq.a4")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t("cta.title")}</h2>
          <p className="text-white/80 mb-8">{t("cta.subtitle")}</p>
          <Link href="/" className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-lg">
            {t("cta.button")}
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
              <h4 className="font-bold mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/features" className="hover:text-white">{t("nav.features")}</Link></li>
                <li><Link href="/pricing" className="hover:text-white">{t("nav.pricing")}</Link></li>
                <li><Link href="/" className="hover:text-white">{t("nav.home")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">{t("footer.about")}</a></li>
                <li><a href="#" className="hover:text-white">{t("footer.blog")}</a></li>
                <li><a href="#" className="hover:text-white">{t("footer.careers")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">{t("footer.privacy")}</a></li>
                <li><a href="#" className="hover:text-white">{t("footer.terms")}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            {t("footer.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function FeaturesPage() {
  return <FeaturesContent />;
}