import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { pretendard } from "@/fonts/pretendard";
import "./globals.css";
import ChatbotProvider from "@/components/chatbot/ChatbotProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "완익세종 - AI 진로 로드맵",
  description: "세종대학교 학생을 위한 AI 기반 맞춤형 학습 로드맵 추천 서비스",
  keywords: ["세종대학교", "진로", "로드맵", "AI", "학습 경로", "교과목 추천"],
  authors: [{ name: "완익세종 팀" }],
  openGraph: {
    title: "완익세종 - AI 진로 로드맵",
    description: "세종대학교 학생을 위한 AI 기반 맞춤형 학습 로드맵 추천 서비스",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatbotProvider />
      </body>
    </html>
  );
}
