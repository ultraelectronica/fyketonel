import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RetroNavigation from "@/components/retro-navigation";
import { ThemeProvider } from "@/components/theme-provider";
import RetroBackground from "@/components/retro-background";
import RetroFooter from "@/components/retro-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fyke's Laboratory",
  description: "My laboratory, my playground, my sandbox.",
  icons: {
    icon: [
      { url: "/assets/logobrain.png" },
      { url: "/assets/logobrain.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/logobrain.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/assets/logobrain.png",
    shortcut: "/assets/logobrain.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <RetroBackground>
              <RetroNavigation />
              {children}
              <RetroFooter />
            </RetroBackground>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
