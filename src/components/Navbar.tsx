"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Box, Container, LogOut } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { isUserSubscribed } from "@/app/premium/actions";
import { Image } from "lucide-react";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "#about",
    label: "About",
  },
  // {
  // 	href: "#testimonials",
  // 	label: "Testimonials",
  // },
];

export const Navbar = () => {
  const { isAuthenticated } = useKindeBrowserClient();

  const { data } = useQuery({
    queryKey: ["isUserSubscribed"],
    queryFn: async () => isUserSubscribed(),
  });

  const isSubscribed = data?.subscribed;

  return (
    <header
      className="sticky top-0 z-40 w-full border-b-[1px] dark:border-b-slate-700 
    bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
    ml-16"
    >
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container min-h-[72px] w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold md:flex hidden">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <span className="uppercase bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-transparent bg-clip-text">
                AXLabs Flux AI
              </span>
            </a>
          </NavigationMenuItem>

          {/* <nav className="md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <Link
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </Link>
            ))}
            {isAuthenticated && isSubscribed && (
              <Link
                rel="noreferrer noopener"
                href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL!}
                target="_blank"
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                Billing Portal
              </Link>
            )}
          </nav> */}

          <div className="hidden md:flex gap-2">
            <div className="flex items-center justify-center gap-2 pr-4">
              <Box size={20} />
              <h1>10</h1>
            </div>
            <div className="flex items-center justify-center gap-2 pr-4">
              <Image size={20} />
              <h1>43</h1>
            </div>
            {isAuthenticated && (
              <Link
                rel="noreferrer noopener"
                href="/api/auth/logout"
                className={`border ${buttonVariants({ variant: "secondary" })}`}
              >
                Logout
                <LogOut className="w-4 h-4 ml-2" />
              </Link>
            )}

            {!isAuthenticated && (
              <Link
                rel="noreferrer noopener"
                href="/api/auth/login"
                className={`border ${buttonVariants({ variant: "secondary" })}`}
              >
                Login
              </Link>
            )}

            {isAuthenticated && isSubscribed && (
              <Link
                rel="noreferrer noopener"
                href="/premium"
                // shining animated button with purple gradient
                className={`border bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white ${buttonVariants(
                  {
                    variant: "secondary",
                  }
                )}`}
              >
                Premium ✨
              </Link>
            )}
            <div className="mr-10">
              <ModeToggle />
            </div>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
