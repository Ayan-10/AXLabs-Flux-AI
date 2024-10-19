"use client";

import Button from "@mui/material/Button";
import Download from "@mui/icons-material/Download";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { FilterIcon } from "lucide-react";

interface SidebarItemProps {
  images: Array<string>;
  text: string;
  path?: string;
}

const items: SidebarItemProps[] = [
  {
    images: [
      "https://fal.media/files/rabbit/fhXWELruSm2l7YiJmuN6P.png",
      "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
    ],
    text: "Home",
    path: "/",
  },
  {
    images: ["https://fal.media/files/elephant/DA98fEF1CHP9ThzTb9Yzq.png"],
    text: "My Images",
    path: "/playground",
  },
  {
    images: ["https://fal.media/files/koala/Sk6qFhdL_G_UDqJClHOnE.png"],
    text: "Models",
    path: "/gallery",
  },
  {
    images: ["https://fal.media/files/koala/Mca-YTc7MN0H13Jp6RjlA.png"],
    text: "Train new model",
    path: "/train",
  },
  {
    images: [
      "https://fal.media/files/zebra/KU360iEhYCb0MkddBkjAG_71f84cce2f5841b280c3ccf296e00a6e.png",
    ],
    text: "Home",
    path: "/",
  },
  {
    images: [
      "https://fal.media/files/tiger/JtrhUxwJd4ck_7z-ZQf9-_8954a1c6817042cfb63d156a4663e228.png",
    ],
    text: "My Images",
    path: "/playground",
  },
  {
    images: [
      "https://fal.media/files/lion/F_CTgaFuaOQV20C_7pDxJ_93e287e34d4046c1882eda086b0c5f9f.png",
    ],
    text: "Models",
    path: "/gallery",
  },
  {
    images: [
      "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
    ],
    text: "Train new model",
    path: "/train",
  },
  {
    images: [
      "https://fal.media/files/monkey/pIiZUCbsJz2uRD051dRjK_c4990bee193941d68a50d56c1216171d.png",
    ],
    text: "Home",
    path: "/",
  },
  {
    images: [
      "https://fal.media/files/lion/CLyb_68SgCMxKdxbHEnBa_a72fa19137d34189996f57ab9f6a17c8.png",
    ],
    text: "My Images",
    path: "/playground",
  },
  {
    images: [
      "https://fal.media/files/koala/dKyn30oN2fKZmkiA2Qwxx_15af157ecdee4ba1b2f8eed994297d4c.png",
    ],
    text: "Models",
    path: "/gallery",
  },
  {
    images: [
      "https://fal.media/files/penguin/fNldac3OJXEXfm8xiaR82_44319ff7e6a54bd391d92db0724402af.png",
    ],
    text: "Train new model",
    path: "/train",
  },
];
export const Gallery = () => {
  return (
    <div className="ml-[68px]">
      <div className="px-4 md:px-20 pt-10 text-3xl font-semibold tracking-tight flex flex-row gap-4">
        <p>Images You Generated</p>
        <Button
          variant="outlined"
          startIcon={<FilterAltOutlinedIcon />}
          endIcon={<KeyboardArrowDownOutlinedIcon />}
        >
          Filter
        </Button>
      </div>
      <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 px-20">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative max-w-sm bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-xl  px-2 pt-2"
                src={item.images[0]}
                alt=""
              />
            </div>
            <div className="px-2 py-2 flex justify-between items-center">
              <Button startIcon={<Download />}>Download</Button>
              <Button startIcon={<FavoriteBorder />}>Favorite</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
