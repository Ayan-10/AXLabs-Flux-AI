"use client";

import Button from "@mui/material/Button";
import Download from "@mui/icons-material/Download";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { FilterIcon, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isUserSubscribed } from "@/app/premium/actions";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { it } from "node:test";
import { redirect } from "next/navigation";

interface GalleryItem {
  image: string;
}

// const items: GalleryItem[] = [
//   {
//     images: [
//       "https://fal.media/files/rabbit/fhXWELruSm2l7YiJmuN6P.png",
//       "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
//     ],
//     text: "Home",
//     path: "/",
//   },
// ];
export const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  // // const isAuthenticated = authData?.success;
  // // console.log(" is "+isAuthenticated)
  // // if (!isAuthenticated) {
  // //   return redirect("/api/auth/login");
  // // }
  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       const response = await fetch("/api/checkAuthStatus");
  //       const data = await response.json();

  //       if (!data.success) {
  //         return redirect("/api/auth/login");
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch auth status", error);
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/playground/fetch/images/${userId}`);
      const data = await res.json();

      if (data.length === 0) {
        setItems([]);
      } else {
        const fetchedImages = data.map((image: string) => ({ image }));
        // Append fetched images to the initial dummy array
        setItems(fetchedImages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleDownload = (e: React.MouseEvent, src: string) => {
    window.open(src, "_blank");
  };

  // Polling logic to fetch new images every 5 seconds
  useEffect(() => {
    fetchImages();
    const interval = setInterval(fetchImages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [userId]);

  return (
    <div className="ml-[68px]">
      <div className="px-4 md:px-20 pt-10 text-3xl font-semibold tracking-tight flex flex-row gap-4">
        <p>Images You Generated</p>
        {/* <Button
          variant="outlined"
          startIcon={<FilterAltOutlinedIcon />}
          endIcon={<KeyboardArrowDownOutlinedIcon />}
        >
          Filter
        </Button> */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center py-10">No images found</p>
      ) : (
        <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 px-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative w-72 max-w-sm bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" // Fixed width set here
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded-xl px-2 pt-2"
                  src={item.image}
                  alt={`Generated image ${index}`}
                />
              </div>
              <div className="px-2 py-2 flex justify-between items-center">
                <Button
                  startIcon={<Download />}
                  onClick={(e) => handleDownload(e, item.image)}
                >
                  Download
                </Button>
                <Button startIcon={<FavoriteBorder />}>Favorite</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
