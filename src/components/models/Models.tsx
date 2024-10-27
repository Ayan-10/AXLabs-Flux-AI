"use client";

import { checkAuthStatus } from "@/app/auth/callback/actions";
import { isUserSubscribed } from "@/app/premium/actions";
import { useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface SidebarItemProps {
  images: Array<string>;
  status: string;
  name?: string;
}

const initialItems: SidebarItemProps[] = [
  {
    images: [],
    status: "Sparrow",
    name: "/",
  },

  {
    images: [
      "https://fal.media/files/rabbit/fhXWELruSm2l7YiJmuN6P.png",
      "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
    ],
    status: "In Progress",
    name: "Sparrow",
  },

  {
    images: [
      "https://fal.media/files/zebra/KU360iEhYCb0MkddBkjAG_71f84cce2f5841b280c3ccf296e00a6e.png",
      "https://fal.media/files/tiger/JtrhUxwJd4ck_7z-ZQf9-_8954a1c6817042cfb63d156a4663e228.png",
    ],
    status: "Completed",
    name: "GTA 5",
  },

  // {
  //   images: [
  //     "https://fal.media/files/lion/F_CTgaFuaOQV20C_7pDxJ_93e287e34d4046c1882eda086b0c5f9f.png",
  //     "https://fal.media/files/panda/cbPwEgwt2VG8Tz3PiJ_NR_5839e66b84a34eedb56667a9b1c15d21.png",
  //   ],
  //   text: "Shelby",
  //   path: "/gallery",
  // },

  // {
  //   images: [
  //     "https://fal.media/files/lion/CLyb_68SgCMxKdxbHEnBa_a72fa19137d34189996f57ab9f6a17c8.png",
  //     "https://fal.media/files/koala/Mca-YTc7MN0H13Jp6RjlA.png",
  //   ],
  //   text: "Gangstar",
  //   path: "/playground",
  // },
  // {
  //   images: [
  //     "https://fal.media/files/koala/dKyn30oN2fKZmkiA2Qwxx_15af157ecdee4ba1b2f8eed994297d4c.png",
  //     "https://fal.media/files/koala/Sk6qFhdL_G_UDqJClHOnE.png",
  //   ],
  //   text: "Shekhar",
  //   path: "/gallery",
  // },
  // {
  //   images: [
      // "https://fal.media/files/penguin/fNldac3OJXEXfm8xiaR82_44319ff7e6a54bd391d92db0724402af.png",
      // "https://fal.media/files/elephant/DA98fEF1CHP9ThzTb9Yzq.png",
  //   ],
  //   text: "Viking",
  //   path: "/train",
  // },
];
export const Models = () => {
  const [items, setItems] = useState<SidebarItemProps[]>(initialItems);
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
  
  const isAuthenticated = authData?.success;
  if (!isAuthenticated) {
    return redirect("/api/auth/login");
  }
  
  // console.log(userId)
  // Fetch training data from MongoDB using Prisma
  const fetchTrainingData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/training/history?userId=${userId}`);
      const data = await res.json();

      // Format data to match SidebarItemProps structure
      const fetchedItems = data.map((training: any) => ({
        images: training.images.slice(0, 2), // Only take first 2 images
        status: training.status,
        name: training.name,
      }));

      // Append fetched items to the existing items array
      setItems([...initialItems, ...fetchedItems]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching training data:", error);
      setLoading(false);
    }
  };

  // Poll the data every 5 seconds to keep it updated
  useEffect(() => {
    fetchTrainingData(); // Initial fetch
    const interval = setInterval(fetchTrainingData, 5000); // Polling every 5 seconds
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  return (
    <div className="ml-[68px]">
      <div className="px-4 md:px-20 pt-10 text-3xl font-semibold tracking-tight flex flex-row gap-4">
        <p>Your Models</p>
      </div>
      {/* {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin text-primary" />
        </div> */}
      {items.length === 0 ? (
        <p className="text-center py-10">No models found</p>
      ) : (
        <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 px-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative max-w-sm bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              {item.images.length === 0 ? (
                <Link href="/train">
                  <div>
                    <div className="h-[186px] w-full overflow-hidden flex flex-row gap-0 items-center justify-center">
                      <Plus />
                    </div>
                    <div className="px-4 pb-8 flex justify-center items-center">
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Train a new model
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
                  <div className="px-4 pt-2 pb-4  flex justify-between items-center">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {item.name}
                    </h5>
                    {/* <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gren-200 dark:text-green-800 ms-3">
                      In Progress
                    </span> */}
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded ms-3 ${
                        item.status.toLowerCase() === "in progress"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200"
                          : item.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-gren-200"
                          : "bg-red-100 text-red-800 dark:bg-red-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
