import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import TanStackProvider from "@/components/providers/TanStackProvider";
import { Boxes, Brain, Images, LayoutDashboard, Settings } from "lucide-react";
import { ClerkProvider } from "@clerk/nextjs";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cool AI Photo",
  description: "Your Personal AI Photo Photographer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider afterSignOutUrl="/refresh">
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
                  <main className="pt-[72px]">{children}</main>
                </div>
              </div>
            </TanStackProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
