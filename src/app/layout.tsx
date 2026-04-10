import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapCook - AI Recipe Generator from Photo",
  description: "Upload any photo of food or ingredients, get instant AI-generated recipes. Convert images to recipes instantly. Perfect for home cooks. Best Chinese food recognition.",
  keywords: "AI recipe generator, photo to recipe, image to recipe, recipe from photo, food to recipe, food recognition recipe, convert image to recipe, AI cooking, Chinese food recognition, meal photo to recipe, what's in this dish",
  openGraph: {
    title: "SnapCook - AI Recipe from Photo",
    description: "Snap a photo, get a recipe instantly. AI-powered recipe generator.",
    type: "website",
    url: "https://snapcook.today",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
