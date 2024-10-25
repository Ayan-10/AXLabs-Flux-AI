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

const items: SidebarItemProps[] = [
  {
    icon: LayoutDashboard,
    text: "Home",
    path: "/home",
  },
  {
    icon: Images,
    text: "My Images",
    path: "/gallery",
  },
  {
    icon: ImagePlay,
    text: "Generate Image",
    path: "/playground",
  },
  {
    icon: Boxes,
    text: "Models",
    path: "/models",
  },
  {
    icon: Brain,
    text: "Train new model",
    path: "/train",
  },
  {
    icon: Settings,
    text: "Billing & Usage",
    path: "/",
  },
];
export const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });

  const userId = authData?.user_id;
  const isAuthenticated = authData?.success;
  const firstName = authData?.first_name
  const lastName = authData?.last_name
  const email = authData?.email

  return (
    <aside className="fixed inset-y-0 left-0 min-w-max shadow-xl min-h-screen z-50 transition-transform duration-300 ease-in-out">
      <nav className="h-full w-auto flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ease-in-out ${
              expanded ? "w-32 mr-12" : "w-0"
            }`}
          />
          <button
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            onClick={() => setExpanded((curr) => !curr)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <hr className="my-3" />
        <SidebarContext.Provider value={{ expanded }}>
          <div className="flex-grow">
            {items.map((item, index) => (
              <ul className="px-3" key={index}>
                <SidebarItem key={index} item={item} />
              </ul>
              // <SidebarItem key={index} item={item} />
            ))}
          </div>
        </SidebarContext.Provider>
        {isAuthenticated && (
          <div className="border-t flex p-3 flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${firstName}+${lastName}`}
              alt=""
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{firstName} {lastName}</h4>
                <span className="text-xs text-gray-600">{email}</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

// interface SidebarItemProps {
//   icon: ReactNode;
//   text: string;
//   active?: boolean;
//   alert?: boolean;
//   path?: string;
// }

// export const SidebarItem: React.FC<SidebarItemProps> = ({
//   path,
//   icon,
//   text,
//   active,
//   alert,
// }) => {
//   const context = useContext(SidebarContext);

//   if (!context) {
//     throw new Error("SidebarItem must be used within a Sidebar");
//   }

//   const { expanded } = context;

//   return (
//     <li
//       className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
//         ${
//           active
//             ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//             : "hover:bg-indigo-50 text-gray-600"
//         }
//         `}
//       style={{ minHeight: "40px" }} // Ensure consistent height
//     >
//       <div className="flex justify-center items-center min-w-[20px] h-[20px]">
//         {icon}
//       </div>
//       <span
//         className={`transition-all ml-3 ${
//           expanded ? "w-auto" : "absolute opacity-0"
//         }`}
//         style={{ minWidth: expanded ? "auto" : "0px" }} // Collapse text completely when sidebar is collapsed
//       >
//         {text}
//       </span>
//       {alert && (
//         <div
//           className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
//             expanded ? "" : "top-2"
//           }`}
//         ></div>
//       )}
//       {!expanded && (
//         <div
//           className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm
//             invisible opacity-20 -translate-x-3 transition-all
//             group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap min-w-fit`}
//         >
//           {text}
//         </div>
//       )}
//     </li>
//   );
// };

// export const getSidebarItems = () => {
//   const pathname = usePathname();

//   function isNavItemActive(pathname: string, nav: string) {
//     return pathname.includes(nav);
//   }

//   return [
//     {
//       name: "Home",
//       href: "/",
//       icon: <LayoutDashboard size={20} />,
//       active: pathname === "/",
//       position: "top",
//     },
//     {
//       name: "Profile",
//       href: "/profile",
//       icon: <Images size={20} />,
//       active: isNavItemActive(pathname, "/profile"),
//       position: "top",
//     },
//     {
//       name: "Notifications",
//       href: "/notifications",
//       icon: <Boxes size={20} />,
//       active: isNavItemActive(pathname, "/notifications"),
//       position: "top",
//     },
//     {
//       name: "Projects",
//       href: "/projects",
//       icon: <Brain size={20} />,
//       active: isNavItemActive(pathname, "/projects"),
//       position: "top",
//     },
//     {
//       name: "Settings",
//       href: "/settings",
//       icon: <Settings size={20} />,
//       active: isNavItemActive(pathname, "/settings"),
//       position: "bottom",
//     },
//   ];
// };
