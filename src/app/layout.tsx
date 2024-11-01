import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import TanStackProvider from "@/components/providers/TanStackProvider";
import { Boxes, Brain, Images, LayoutDashboard, Settings } from "lucide-react";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AXLabs Flux AI",
  description: "Write prompt to generate images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TanStackProvider>
              <div className="relative flex overflow-x-hidden overflow-y-auto">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
                  <Navbar />
                  {children}
                </div>
              </div>
            </TanStackProvider>
          </ThemeProvider>
        </body>
      </html>
  );
}
