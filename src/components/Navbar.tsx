"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Tooltip from "@mui/material/Tooltip";
import { Box, Image, LogOut } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { isUserSubscribed } from "@/app/premium/actions";
import { Zoom } from "@mui/material";

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
  const { isAuthenticated } = useKindeBrowserClient();

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
    <header className="sticky top-0 z-40 w-full border-b-[1px] dark:border-b-slate-700 
    bg-white shadow-md dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
    ml-16">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container min-h-[72px] w-screen flex justify-between items-center">
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

          <div className="hidden md:flex gap-4 items-center">
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#7355B0",
                    "& .MuiTooltip-arrow": {
                      color: "#7355B0",
                    },
                  },
                },
              }}
              title="Model Training Credits Left"
              placement="top"
            >
              <div className="flex items-center justify-center gap-2 pr-4">
                <Box size={20} />
                <h1 className="font-semibold text-gray-800 dark:text-white">{modelsLeft}</h1>
              </div>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#7355B0",
                    "& .MuiTooltip-arrow": {
                      color: "#7355B0",
                    },
                  },
                },
              }}
              title="Image Generation Credits Left"
              placement="top"
            >
              <div className="flex items-center justify-center gap-2 pr-4">
                <Image size={20} />
                <h1 className="font-semibold text-gray-800  dark:text-white">{imagesLeft}</h1>
              </div>
            </Tooltip>

            {isAuthenticated && (
              <Link
                rel="noreferrer noopener"
                href="/api/auth/logout"
                className={`border ${buttonVariants({ variant: "secondary" })} px-4 py-2 rounded-md hover:bg-gray-200 transition`}
              >
                Logout
                <LogOut className="w-4 h-4 ml-2" />
              </Link>
            )}

            {!isAuthenticated && (
              <Link
                rel="noreferrer noopener"
                href="/api/auth/register"
                className={`border ${buttonVariants({ variant: "secondary" })} px-4 py-2 rounded-md hover:bg-gray-200 transition`}
              >
                Login
              </Link>
            )}

            {isAuthenticated && isSubscribed && (
              <Link
                rel="noreferrer noopener"
                href="/premium"
                className={`border bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white ${buttonVariants(
                  {
                    variant: "secondary",
                  }
                )} px-4 py-2 rounded-md hover:opacity-90 transition`}
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
