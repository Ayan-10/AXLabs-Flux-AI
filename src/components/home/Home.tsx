"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarItemProps {
  images: Array<string>;
  text: string;
  path?: string;
}

const items: SidebarItemProps[] = [
  {
    images: [],
    text: "Sparrow",
    path: "/",
  },

  {
    images: [
      "https://fal.media/files/rabbit/fhXWELruSm2l7YiJmuN6P.png",
      "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
    ],
    text: "Tinder & Bumble Dating",
    path: "/",
  },

  {
    images: [
      "https://fal.media/files/zebra/KU360iEhYCb0MkddBkjAG_71f84cce2f5841b280c3ccf296e00a6e.png",
      "https://fal.media/files/tiger/JtrhUxwJd4ck_7z-ZQf9-_8954a1c6817042cfb63d156a4663e228.png",
    ],
    text: "Professional Headshot",
    path: "/",
  },

  {
    images: [
      "https://fal.media/files/lion/F_CTgaFuaOQV20C_7pDxJ_93e287e34d4046c1882eda086b0c5f9f.png",
      "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
    ],
    text: "Old Money Dressing",
    path: "/gallery",
  },

  {
    images: [
      "https://fal.media/files/lion/CLyb_68SgCMxKdxbHEnBa_a72fa19137d34189996f57ab9f6a17c8.png",
      "https://fal.media/files/koala/Mca-YTc7MN0H13Jp6RjlA.png",
    ],
    text: "Model AI",
    path: "/playground",
  },
  {
    images: [
      "https://fal.media/files/koala/dKyn30oN2fKZmkiA2Qwxx_15af157ecdee4ba1b2f8eed994297d4c.png",
      "https://fal.media/files/koala/Sk6qFhdL_G_UDqJClHOnE.png",
    ],
    text: "Travel Photography",
    path: "/gallery",
  },

];
export const Home = () => {
  return (
    <div className="ml-[68px]">
      <div className="px-4 md:px-20 pt-10 text-3xl font-semibold tracking-tight flex flex-row gap-4">
        <p>Create New Image</p>
      </div>
      <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 px-20">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative max-w-sm bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            {item.images.length === 0 ? (
              <Link href="/playground">
                <div>
                  <div className="h-[186px] w-full overflow-hidden flex flex-row gap-0 items-center justify-center">
                    <Plus />
                  </div>
                  <div className="px-4 pb-8 flex justify-center items-center">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      Start from scratch
                    </h5>
                  </div>
                </div>
              </Link>
            ) : (
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
                <div className="px-4 pt-2 pb-4 flex justify-between items-center">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {item.text}
                  </h5>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gren-200 dark:text-green-800 ms-3">
                    New
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
