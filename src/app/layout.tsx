import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import TanStackProvider from "@/components/providers/TanStackProvider";
import { Boxes, Brain, Images, LayoutDashboard, Settings } from "lucide-react";
import { ClerkProvider } from "@clerk/nextjs";

const font = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cool AI Photo",
  description: "Your Personal AI Photo Photographer",
  keywords: ["AI", "Photo", "Photography", "Artificial Intelligence", "Generator"],
  authors: [{ name: "CoolAIPhoto Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.variable} scroll-smooth`} suppressHydrationWarning>
      <ClerkProvider afterSignOutUrl="/refresh">
        <body className={`${font.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TanStackProvider>
              <div className="relative flex overflow-x-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                  <Navbar />
                  <main className="pt-[72px] flex-grow">
                    {children}
                  </main>
                  <footer className="py-6 border-t border-gray-200 dark:border-gray-800 mt-auto">
                    <div className="container flex flex-col md:flex-row justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CoolAIPhoto. All rights reserved.
                      </p>
                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                        <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                        <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </TanStackProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
