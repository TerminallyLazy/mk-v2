import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/app/components/ui/toaster";
import { SettingsProvider } from "@/app/contexts/settings-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MomsKidz",
  description:
    "Data Acquisition meets gamification with rich health data courtesy of Moms!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SettingsProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange
            storageKey="momskidz-theme"
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
