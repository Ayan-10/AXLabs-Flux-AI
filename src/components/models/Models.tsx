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
    <div className="ml-0 md:ml-[68px] px-4 md:px-0">
      <div className="px-4 md:px-20 pt-6 md:pt-10">
        <h1 className="text-xl md:text-2xl font-semibold">
          Your Models
        </h1>
      </div>
      {items.length === 0 ? (
        <p className="text-center py-6 md:py-10">No models found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-6 md:py-10 px-4 md:px-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-300 rounded-[12px] shadow hover:shadow-lg transition duration-300 dark:bg-gray-800 dark:border-gray-600"
            >
              {item.images.length === 0 ? (
                <Link href="/train">
                  <div className="flex flex-col items-center">
                    <div className="h-[180px] md:h-[210px] w-full flex items-center justify-center rounded-t-[12px]">
                      <Plus className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                    </div>
                    <div className="px-4 py-4 md:pb-8 w-full text-center">
                      <h5 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        Train a new model
                      </h5>
                    </div>
                  </div>
                </Link>
              ) : (
                <div>
                  <div className="h-[180px] md:h-[200px] w-full overflow-hidden flex flex-row gap-0 p-2">
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
                    <h5 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[60%]">
                      {item.name}
                    </h5>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap ${
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
