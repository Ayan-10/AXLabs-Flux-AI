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
      "https://static01.nyt.com/images/2022/04/05/business/04musk-twitter-sub2/04musk-twitter-sub2-mediumSquareAt3X.jpg",
      "https://assets-us-01.kc-usercontent.com/5cb25086-82d2-4c89-94f0-8450813a0fd3/0c3fcefb-bc28-4af6-985e-0c3b499ae832/Elon_Musk_Royal_Society.jpg",
    ],
    status: "COMPLETED",
    name: "Elon Musk",
  },
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
      <div className="px-4 md:px-20 pt-10 text-2xl font-semibold flex flex-row gap-4">
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
              className="relative max-w-sm bg-white border border-gray-300 rounded-[12px] shadow-lg hover:shadow-2xl transition duration-300 dark:bg-gray-800 dark:border-gray-600"
            >
              {item.images.length === 0 ? (
                <Link href="/train">
                  <div>
                    <div className="h-[210px] w-full overflow-hidden flex flex-row gap-0 items-center justify-center rounded-t-[12px]">
                      <Plus className="text-gray-500" />
                    </div>
                    <div className="px-4 pb-8 flex justify-center items-center">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Train a new model
                      </h5>
                    </div>
                  </div>
                </Link>
              ) : (
                <div>
                  <div className="h-[200px] w-full overflow-hidden flex flex-row gap-0">
                    <img
                      className="w-1/2 h-full object-cover rounded-l-[12px] pl-2 pt-2"
                      src={item.images[0]}
                      alt=""
                    />
                    <img
                      className="w-1/2 h-full object-cover rounded-r-[12px] px-2 pt-2"
                      src={item.images[1]}
                      alt=""
                    />
                  </div>
                  <div className="px-4 pt-2 pb-4 flex justify-between items-center">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h5>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                        item.status.toLowerCase() === "in progress"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200"
                          : item.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-200"
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
