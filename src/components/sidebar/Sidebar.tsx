"use client";

import { useScrollTrigger } from "@mui/material";
import {
  ChevronFirst,
  ChevronLast,
  ImagePlay,
  LucideIcon,
  MoreVertical,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { createContext, useContext } from "react";
import { Boxes, Brain, Images, LayoutDashboard, Settings, Camera, User, Home, Zap } from "lucide-react";
import React from "react";
import { SidebarItem } from "./SidebarItem";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

interface SidebarContextType {
  expanded: boolean;
}

interface SidebarProps {
  children: ReactNode;
}

interface SidebarItemProps {
  icon: LucideIcon;
  text: string;
  path?: string;
}
export const SidebarContext = createContext<SidebarContextType | false>(false);

const items = [
  { icon: Home, text: "Home", path: "/home" },
  { icon: Images, text: "My Gallery", path: "/gallery" },
  { icon: Camera, text: "Generate", path: "/playground" },
  { icon: Boxes, text: "My Models", path: "/models" },
  { icon: Zap, text: "Billing & Usage", path: "/" },
];

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState(false);
  const pathname = usePathname();

  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });

  const userId = authData?.user_id;
  const isAuthenticated = authData?.success;
  const firstName = authData?.first_name;
  const lastName = authData?.last_name;
  const email = authData?.email;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 min-w-max shadow-lg min-h-screen z-40 transition-all duration-300 ease-in-out bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm hidden md:block">
        <nav className="h-full flex flex-col border-r border-gray-200 dark:border-gray-800">
          <div className="p-4 pb-[44px] flex justify-between items-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              {expanded ? <ChevronFirst className="h-5 w-5" /> : <ChevronLast className="h-5 w-5" />}
            </button>
          </div>
          <hr className="border-gray-200 dark:border-gray-800" />
          <SidebarContext.Provider value={{ expanded }}>
            <div className="flex-grow pt-6">
              {items.map((item, index) => (
                <ul className="px-3 mb-2" key={index}>
                  <li>
                    <Link
                      href={item.path || '#'}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 
                      ${pathname === item.path 
                        ? 'bg-primary text-white font-medium shadow-lg' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      <item.icon className={`h-5 w-5 ${expanded ? 'mr-3' : ''}`} />
                      <span className={`truncate transition-all duration-300 ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>{item.text}</span>
                    </Link>
                  </li>
                </ul>
              ))}
            </div>
          </SidebarContext.Provider>
          {isAuthenticated && (
            <div className="border-t border-gray-200 dark:border-gray-800 flex p-3 flex-shrink-0 bg-gray-50 dark:bg-gray-900 gap-4">
              <img
                src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${firstName}+${lastName}`}
                alt=""
                className="w-10 h-10 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                onClick={() => setExpandedProfile((curr) => !curr)}
              />
              <div
                className={`absolute flex justify-between items-center overflow-hidden transition-all bg-gray-50 dark:bg-gray-900 left-14 bottom-0 py-[15px] rounded-se-md ${
                  expandedProfile ? "w-44 px-3 ml-3 border-t border-r border-gray-200 dark:border-gray-800" : "w-0"
                }`}
              >
                <div className="leading-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {firstName} {lastName}
                  </h4>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{email}</span>
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.path || '#'}
              className={`flex flex-col items-center justify-center w-full h-full px-1 py-2 text-xs font-medium
              ${pathname === item.path
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'}`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${pathname === item.path ? 'text-primary' : ''}`} />
              <span className={`${pathname === item.path ? 'text-primary' : ''}`}>{item.text}</span>
            </Link>
          ))}
        </div>
        {isAuthenticated && (
          <div className="absolute bottom-full right-0 mb-2 mr-2">
            <button
              onClick={() => setExpandedProfile(!expandedProfile)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${firstName}+${lastName}`}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
                unoptimized
              />
            </button>
            {expandedProfile && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-sm">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {firstName} {lastName}
                  </h4>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {email}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};
