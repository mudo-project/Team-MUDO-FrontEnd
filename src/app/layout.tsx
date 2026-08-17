import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "이음 | 학원 전문 그룹웨어",
  description: "학생 데이터 관리와 사내 그룹웨어(결재·근태·메신저·업무관리)를 하나로 합친 학원 전문 그룹웨어, 이음.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" className={cn("font-sans", geist.variable)}
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
