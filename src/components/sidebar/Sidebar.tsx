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
import { Boxes, Brain, Images, LayoutDashboard, Settings } from "lucide-react";
import React from "react";
import { SidebarItem } from "./SidebarItem";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { useQuery } from "@tanstack/react-query";

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
  { icon: LayoutDashboard, text: "Home", path: "/home" },
  { icon: Images, text: "My Images", path: "/gallery" },
  { icon: ImagePlay, text: "Generate Image", path: "/playground" },
  { icon: Boxes, text: "Models", path: "/models" },
  { icon: Settings, text: "Billing & Usage", path: "/" },
];

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
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
    <aside className="fixed inset-y-0 left-0 min-w-max shadow-lg min-h-screen z-50 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800">
      <nav className="h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`transition-all ease-in-out ${expanded ? "w-32 mr-4" : "w-0"}`}
            alt="Logo"
          />
          <button
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={() => setExpanded((curr) => !curr)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <hr className="my-3 border-gray-200 dark:border-gray-700" />
        <SidebarContext.Provider value={{ expanded }}>
          <div className="flex-grow">
            {items.map((item, index) => (
              <ul className="px-3" key={index}>
                <SidebarItem item={item} />
              </ul>
            ))}
          </div>
        </SidebarContext.Provider>
        {isAuthenticated && (
          <div className="border-t flex p-3 flex-shrink-0 bg-gray-50 dark:bg-gray-900">
            <img
              src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${firstName}+${lastName}`}
              alt=""
              className="w-10 h-10 rounded-md"
            />
            <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
              <div className="leading-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {firstName} {lastName}
                </h4>
                <span className="text-xs text-gray-600">{email}</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

