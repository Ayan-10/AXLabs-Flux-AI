"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Tooltip from "@mui/material/Tooltip";
import { Box, Image, Loader, LogOut, Menu, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { isUserSubscribed } from "@/app/premium/actions";
import { Zoom } from "@mui/material";
import Logo from "/logo.svg";
import ImageNext from "next/image";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Aperture, Camera } from "lucide-react";

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
];

export const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch subscription status
  const { data: subscriptionData } = useQuery({
    queryKey: ["isUserSubscribed"],
    queryFn: async () => await isUserSubscribed(),
  });

  // Fetch authentication status
  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });

  const isSubscribed = subscriptionData?.subscribed;
  const userId = authData?.user_id;

  // Define state for image and model credits left
  const [imagesLeft, setImagesLeft] = useState<number>(0);
  const [modelsLeft, setModelsLeft] = useState<number>(0);

  // Fetch the current values of the training credits left
  const fetchTrainingsLeft = async () => {
    if (!userId) return; // No need to proceed if userId is not available
    try {
      const res = await fetch(`/api/training/fetch/credit/${userId}`);
      const data = await res.json();
      setImagesLeft(data.imageCredits || 0);
      setModelsLeft(data.modelCredits || 0);
    } catch (error) {
      console.error("Error fetching training credits:", error);
    }
  };

  // Polling every 5 seconds to get updated training credits
  useEffect(() => {
    if (userId) {
      fetchTrainingsLeft(); // Fetch once on mount
      const interval = setInterval(fetchTrainingsLeft, 5000); // Poll every 5 seconds
      return () => clearInterval(interval); // Clean up the interval
    }
  }, [userId]); // Rerun when userId changes

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b-[1px] dark:border-b-slate-800 
    bg-white/90 shadow-lg dark:bg-gray-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300"
    >
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container min-h-[72px] w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex items-center">
            <Link href="/" className="flex items-center gap-2 transition-all duration-200 hover:scale-105">
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">CoolAIPhoto</span>
            </Link>
          </NavigationMenuItem>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <div className="flex items-center space-x-4">
                <div className="flex gap-2">
                  <div className="shadow-md bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Images: </span>
                    <span className="font-bold text-primary">{imagesLeft}</span>
                  </div>
                  <div className="shadow-md bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Models: </span>
                    <span className="font-bold text-primary">{modelsLeft}</span>
                  </div>
                </div>
                
                {!isSubscribed && (
                  <Link
                    href="/premium"
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "font-medium rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-primary/30",
                    })}
                  >
                    Upgrade
                  </Link>
                )}

                <ModeToggle />
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 rounded-full ring-2 ring-primary/30",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-4">
                <ModeToggle />
                <SignInButton mode="modal">
                  <button
                    className={buttonVariants({
                      size: "sm",
                      className: "rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-primary/30",
                    })}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg animate-in slide-in-from-top">
          <div className="container py-4 flex flex-col space-y-4">
            <SignedIn>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 w-fit">
                    <span className="text-gray-500 dark:text-gray-400">Images: </span>
                    <span className="font-bold text-primary">{imagesLeft}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 w-fit">
                    <span className="text-gray-500 dark:text-gray-400">Models: </span>
                    <span className="font-bold text-primary">{modelsLeft}</span>
                  </div>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
              {!isSubscribed && (
                <Link
                  href="/premium"
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full rounded-full font-medium shadow-lg",
                  })}
                >
                  Upgrade
                </Link>
              )}
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className={buttonVariants({
                    className: "w-full rounded-full font-medium shadow-lg",
                  })}
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
};
