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
import { useUser } from "@auth0/nextjs-auth0/client";

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
  const { user, error, isLoading } = useUser();
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

  console.log("hfsd");
  console.log(user);
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>{error.message}</div>;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b-[1px] dark:border-b-slate-700 
    bg-white shadow-md dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container min-h-[72px] w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex items-center">
            <ImageNext
              src="/logo.svg"
              width={50}
              height={50}
              alt="Picture of the author"
            />

            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <span className="uppercase bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-transparent bg-clip-text">
                Cool AI Photo
              </span>
            </a>
          </NavigationMenuItem>

          <div className="flex sm:gap-2 md:gap-4 gap-1 items-center justify-end">
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
              <div className="flex items-center justify-center gap-2 sm:pr-4 pr-2">
                <Box size={20} />
                <h1 className="font-semibold text-gray-800 dark:text-white">
                  {modelsLeft}
                </h1>
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
              <div className="flex items-center justify-center gap-2 sm:pr-4 pr-2">
                <Image size={20} />
                <h1 className="font-semibold text-gray-800  dark:text-white">
                  {imagesLeft}
                </h1>
              </div>
            </Tooltip>

            <div className="flex sm:hidden gap-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-700 dark:text-gray-200 mr-5"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <div className="hidden sm:flex gap-2">
              {isLoading ? (
                <Loader
                  className={`border ${buttonVariants({
                    variant: "secondary",
                  })} px-4 py-2 rounded-md hover:bg-gray-200 transition`}
                />
              ) : (
                <>
                  {user ? (
                    <Link
                      rel="noreferrer noopener"
                      href="/api/auth/logout"
                      className={`border ${buttonVariants({
                        variant: "secondary",
                      })} px-4 py-2 rounded-md hover:bg-gray-200 transition`}
                    >
                      Logout
                      <LogOut className="w-4 h-4 ml-2" />
                    </Link>
                  ) : (
                    <Link
                      rel="noreferrer noopener"
                      href="/api/auth/login"
                      className={`border ${buttonVariants({
                        variant: "secondary",
                      })} px-4 py-2 rounded-md hover:bg-gray-200 transition`}
                    >
                      Login
                    </Link>
                  )}
                </>
              )}

              {user && isSubscribed && (
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
              <div className="">
                <ModeToggle />
              </div>
            </div>

            {/* <div className="hidden sm:flex gap-2">
              {isAuthenticated && (
                <Link
                  rel="noreferrer noopener"
                  href="/api/auth/logout"
                  className={`border ${buttonVariants({
                    variant: "secondary",
                  })}`}
                >
                  Logout
                  <LogOut className="w-4 h-4 ml-2" />
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  rel="noreferrer noopener"
                  href="/api/auth/login"
                  className={`border ${buttonVariants({
                    variant: "secondary",
                  })}`}
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
            </div> */}
            {menuOpen && (
              <div className="absolute block sm:hidden top-12 right-8 mt-6 w-36 bg-secondary shadow-lg rounded-lg  z-50 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                {user && (
                  <Link
                    rel="noreferrer noopener"
                    href="/api/auth/logout"
                    className={`border ${buttonVariants({
                      variant: "secondary",
                    })} px-4  rounded-md hover:bg-gray-200 transition`}
                  >
                    Logout
                    <LogOut className="w-4 h-4 ml-2" />
                  </Link>
                )}

                {!user && (
                  <Link
                    rel="noreferrer noopener"
                    href="/api/auth/login"
                    className={`border ${buttonVariants({
                      variant: "secondary",
                    })} px-4  rounded-md hover:bg-gray-200 transition`}
                  >
                    Login
                  </Link>
                )}
                {user && isSubscribed && (
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
                <hr className="mt-2 border-gray-200 dark:border-gray-700" />

                <div className="w-full flex justify-center ">
                  <ModeToggle />
                </div>
              </div>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
