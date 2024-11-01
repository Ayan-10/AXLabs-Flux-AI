import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo } from "react";
import { SidebarContext } from "./Sidebar";

interface SidebarItemProps {
  icon: LucideIcon;
  text: string;
  path?: string;
}
interface SidebarContextType {
  expanded: boolean;
}

export const SidebarItem = ({ item }: { item: SidebarItemProps }) => {
  const { icon: Icon, text, path } = item;
  const router = useRouter();
  const pathname = usePathname();

  const { expanded } = useContext(SidebarContext) || {};

  //   if (!context) {
  //     throw new Error("SidebarItem must be used within a Sidebar");
  //   }

  //   const { expanded } = context;

  // const onClick = () => {
  //   return router.push(path);
  // };
  // const active = useMemo(() => {
  //   return path === pathname;
  // }, [path, pathname]);
  const alert = true;
  console.log(expanded);

  // Prefetch the route when the component mounts
  useEffect(() => {
    if (path) {
      router.prefetch(path);
    }
  }, [path, router]);

  // Handle navigation
  const onClick = () => {
    if (path && path !== pathname) {
      router.push(path);
    }
  };

  // Check if the current path is active
  const active = useMemo(() => {
    return path === pathname;
  }, [path, pathname]);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
        `}
      style={{ minHeight: "40px" }} // Ensure consistent height
      onClick={onClick}
    >
      <div className="flex justify-center items-center min-w-[20px] h-[20px]">
        <Icon size={20} />
      </div>
      <span
        className={`transition-all ml-3 overflow-hidden ease-in-out ${
          expanded ? "w-auto" : "absolute opacity-0 w-0"
        }`}
        // style={{ minWidth: expanded ? "auto" : "w-0" }} // Collapse text completely when sidebar is collapsed
      >
        {text}
      </span>
      {/* {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )} */}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap min-w-fit`}
        >
          {text}
        </div>
      )}
    </li>
  );
};
