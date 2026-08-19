import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  verification: {
    google: '-wyfWFaorPHc1hX6trdcpZ0RlEHBu-aks4Og6tXrYnI',
  },

  metadataBase: new URL('https://ieum.store'),

  applicationName: "이음",

  title: {
    default: "이음 | 학원 전문 그룹웨어",
    template: "%s | 이음",
  },

  description:
    "학생 데이터 관리와 사내 그룹웨어를 하나로 연결해 학원 운영, 조직 관리, 협업과 경영 업무를 돕는 학원 전문 그룹웨어입니다.",

  keywords: [
    "이음",
    "학원 그룹웨어",
    "학원 관리",
    "학원 운영",
    "학생 관리",
    "직원 관리",
    "학원 출결 관리",
    "학원 업무 관리",
  ],

  authors: [{ name: "Team MUDO", url: 'https://ieum.store' }],
  creator: "Team MUDO",
  publisher: "Team MUDO",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "이음",
    title: "이음 | 학원 전문 그룹웨어",
    description:
      "흩어진 학생 관리와 사내 협업 업무를 하나로 연결해 학원 운영을 더 간결하게 만드세요.",
  },

  twitter: {
    card: "summary",
    title: "이음 | 학원 전문 그룹웨어",
    description:
      "흩어진 학생 관리와 사내 협업 업무를 하나로 연결해 학원 운영을 더 간결하게 만드세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko" className={cn("font-sans", geist.variable)}
    >
      <body className="overflow-hidden">
        {children}
        <Toaster
          position="top-center"
        />
      </body>
    </html>
  );
}
