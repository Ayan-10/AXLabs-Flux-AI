"use client";

import { checkAuthStatus } from "@/app/auth/callback/actions";
import { useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { usePromptStore } from "../usePromptStore";
import { useEffect, useState } from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import Button from "@mui/material/Button";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useTheme } from "next-themes";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";
import { templates } from "@/content/templates";

interface SidebarItemProps {
  images: Array<string>;
  text: string;
  path?: string;
  prompt?: string;
}

export const Home = () => {
  const router = useRouter();

  const setPrompt = usePromptStore((state) => state.setPrompt);
  const [localTemplates, setLocalTemplates] = useState(templates);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const navigateToPlayground = (prompt: string) => {
    setPrompt(prompt); // Set the prompt in Zustand state
    router.push("/playground"); // Navigate to Playground
  };

  const sortTemplates = (criteria: "Popular" | "Recent" | "Name") => {
    const [first, ...rest] = [...localTemplates];
    const sorted = [...rest];

    if (criteria === "Popular") {
      sorted.sort((a, b) => b.runCount - a.runCount);
    } else if (criteria === "Recent") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (criteria === "Name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    setLocalTemplates([first, ...sorted]);
    setAnchorEl(null);
  };

  return (
    <div className="md:ml-[68px] px-4 md:px-0">
      <div className="md:px-20 pt-6 md:pt-10 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
          Choose the Style to create your AI Photo
        </p>
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <Button
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="w-full md:w-auto border rounded-[8px] hover:bg-gray-300 transition duration-200"
            startIcon={<FilterAltOutlinedIcon />}
            endIcon={
              anchorEl ? (
                <KeyboardArrowUpOutlinedIcon />
              ) : (
                <KeyboardArrowDownOutlinedIcon />
              )
            }
            sx={{
              color: "#7C3AED",
              borderColor: "#4F46E5",
              "&:hover": {
                backgroundColor: "gray",
              },
            }}
          >
            Filter
          </Button>
        </div>
        <Menu
          className="text-white"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{ sx: { padding: 0 } }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme === "dark" ? "#334155" : "white",
              color: theme === "dark" ? "white" : "black",
              width: anchorEl ? anchorEl.offsetWidth : undefined,
            },
          }}
        >
          <MenuItem onClick={() => sortTemplates("Popular")}>Popular</MenuItem>
          <MenuItem onClick={() => sortTemplates("Recent")}>Recent</MenuItem>
          <MenuItem onClick={() => sortTemplates("Name")}>A - Z</MenuItem>
        </Menu>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader className="w-8 md:w-12 h-8 md:h-12 animate-spin text-primary" />
        </div>
      ) : localTemplates.length === 0 ? (
        <p className="text-center py-6 md:py-10 text-gray-700">
          No templates available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-6 md:py-10 px-0 md:px-20">
          {localTemplates.map((item, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-300 rounded-[12px] shadow hover:shadow-lg transition duration-300 dark:bg-gray-800 dark:border-gray-600"
            >
              {item.images.length === 0 ? (
                <Link href="/playground">
                  <div 
                    onClick={() => navigateToPlayground("Your prompt here")}
                    className="flex flex-col items-center"
                  >
                    <div className="h-[180px] md:h-[220px] w-full flex items-center justify-center rounded-t-[12px]">
                      <Plus className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div className="px-4 py-4 md:pb-8 w-full text-center">
                      <h5 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        Start from scratch
                      </h5>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href={`/playground/${item.pageId}`}>
                  <div className="rounded-[12px] overflow-hidden">
                    <div className="h-[240px] md:h-52 w-full flex flex-row gap-0 p-2">
                      <img
                        className="w-1/2 h-full object-cover rounded-l-[12px]"
                        src={item.images[0]}
                        alt={`${item.name} preview 1`}
                      />
                      <img
                        className="w-1/2 h-full object-cover rounded-r-[12px]"
                        src={item.images[1]}
                        alt={`${item.name} preview 2`}
                      />
                    </div>
                    <div className="px-3 md:px-4 py-2 flex flex-row items-center justify-between">
                      <h5 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[80%]">
                        {item.name}
                      </h5>
                      <div className="flex items-center gap-2">
                        {item.isNew && (
                          <span className="bg-green-200 text-green-900 text-xs font-semibold px-2 md:px-3 py-1 rounded dark:bg-green-300 dark:text-green-900">
                            new
                          </span>
                        )}
                        {/* <span className="bg-fuchsia-200 text-fuchsia-900 text-xs font-semibold px-2 md:px-3 py-1 rounded dark:bg-fuchsia-300 dark:text-fuchsia-900">
                          <div className="flex items-center">
                            <BoltIcon fontSize="small" />
                            <p className="text-xs ml-1">{item.runCount}</p>
                            <p className="text-xs pl-1">runs</p>
                          </div>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
