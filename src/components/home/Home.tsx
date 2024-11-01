"use client";

import { checkAuthStatus } from "@/app/auth/callback/actions";
import { useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { usePromptStore } from "../usePromptStore";
import { useEffect, useState } from "react";
import BoltIcon from "@mui/icons-material/Bolt";

interface SidebarItemProps {
  images: Array<string>;
  text: string;
  path?: string;
  prompt?: string;
}

interface Template {
  id: string;
  pageId: string;
  name: string;
  images: string[];
  runCount: number;
  prePrompt: string;
}

const items: SidebarItemProps[] = [
  {
    images: [],
    text: "Sparrow",
    path: "/playground",
    prompt: "gjh",
  },

  {
    images: [
      "https://fal.media/files/rabbit/fhXWELruSm2l7YiJmuN6P.png",
      "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
    ],
    text: "Tinder & Bumble Dating",
    path: "/playground/1",
    prompt:
      "Generate photo for dating profile, for <<model>> , this person is a <<gender>>, this person is <<posture>> in front of <<place>>, generate images which will impress other gender.",
  },

  {
    images: [
      "https://fal.media/files/zebra/KU360iEhYCb0MkddBkjAG_71f84cce2f5841b280c3ccf296e00a6e.png",
      "https://fal.media/files/tiger/JtrhUxwJd4ck_7z-ZQf9-_8954a1c6817042cfb63d156a4663e228.png",
    ],
    text: "Professional Headshot",
    path: "/playground/2",
    prompt:
      "Generate professional headshot, for <<model>>. this person is a <<gender>>,",
  },

  {
    images: [
      "https://fal.media/files/lion/F_CTgaFuaOQV20C_7pDxJ_93e287e34d4046c1882eda086b0c5f9f.png",
      "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
    ],
    text: "Old Money Dressing",
    path: "/playground/3",
    prompt:
      "Generate images, for <<model>> dressed with old money clothing, wearning this <<dress>>",
  },

  {
    images: [
      "https://fal.media/files/lion/CLyb_68SgCMxKdxbHEnBa_a72fa19137d34189996f57ab9f6a17c8.png",
      "https://fal.media/files/koala/Mca-YTc7MN0H13Jp6RjlA.png",
    ],
    text: "Model AI",
    path: "/playground/4",
    prompt:
      "Generate images, for <<model>>, as a proffesional model, wearning this <<dress>>.",
  },
  {
    images: [
      "https://fal.media/files/koala/dKyn30oN2fKZmkiA2Qwxx_15af157ecdee4ba1b2f8eed994297d4c.png",
      "https://fal.media/files/koala/Sk6qFhdL_G_UDqJClHOnE.png",
    ],
    text: "Travel Photography",
    path: "/playground/5",
    prompt:
      "Generate images, for <<model>>, this person is a <<gender>>, this person is <<posture>> in front of <<place>>, doing <<activity>>",
  },
];
export const Home = () => {
  const router = useRouter();

  const setPrompt = usePromptStore((state) => state.setPrompt);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/template/fetch");
      const data = await res.json();
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const navigateToPlayground = (prompt: string) => {
    setPrompt(prompt); // Set the prompt in Zustand state
    router.push("/playground"); // Navigate to Playground
  };

  return (
    <div className="ml-[68px]">
      <div className="px-4 md:px-20 pt-10 text-2xl font-semibold flex flex-row gap-4">
        <p>Create New Image</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : templates.length === 0 ? (
        <p className="text-center py-10">No templates available</p>
      ) : (
        <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 px-20">
          {templates.map((item, index) => (
            <div
              key={index}
              className="relative max-w-sm bg-gray-50 border border-gray-200 rounded-[8px] shadow dark:bg-gray-800 dark:border-gray-700"
            >
              {item.images.length === 0 ? (
                // <Link
                //   href={{
                //     pathname: "/playground",
                //     query: { prompt: item.prompt }, // Pass prompt as a query parameter
                //   }}
                //   as={"/playground"}
                // >
                <Link
                  href={{
                    pathname: `/playground`,
                  }}
                >
                  <div onClick={() => navigateToPlayground("Your prompt here")}>
                    <div className="h-[186px] w-full overflow-hidden flex flex-row gap-0 items-center justify-center">
                      <Plus />
                    </div>
                    <div className="px-4 pb-8 flex justify-center items-center">
                      <h5 className="text-base font-semibold text-gray-900 dark:text-white">
                        Start from scratch
                      </h5>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  href={{
                    pathname: `/playground/${item.pageId}`,
                  }}
                >
                  <div>
                    <div className="h-48 w-full overflow-hidden flex flex-row gap-0">
                      <img
                        className="w-1/2 h-full object-cover rounded-l-xl  pl-2 pt-2"
                        src={item.images[0]}
                        alt=""
                      />
                      <img
                        className="w-1/2 h-full object-cover rounded-r-xl  px-2 pt-2"
                        src={item.images[1]}
                        alt=""
                      />
                    </div>
                    <div className="px-4 pt-2 pb-2 flex justify-between items-center">
                      <h5 className="text-base font-semibold  text-gray-900 dark:text-white">
                        {item.name}
                      </h5>
                    </div>

                    <div className="px-4 pb-4 flex  justify-between items-center">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gren-200 dark:text-green-800">
                        New
                      </span>
                      <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-rose-200 dark:text-rose-800">
                        <div className="flex flex-1 justify-end items-center">
                          <BoltIcon fontSize="small"/>
                          <p className="text-xs">{item.runCount} </p>
                          <p className="text-xs pl-1">runs</p>
                        </div>
                      </span>
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
