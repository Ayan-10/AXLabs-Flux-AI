"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "./actions";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const Page = () => {
  const router = useRouter();
  const { user, error } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
    staleTime: Infinity, // Optional: prevent frequent refetches
  });

  console.log("qwertyuio....................")
  useEffect(() => {
    if (!isLoading) {
      const stripePaymentLink =
        typeof window !== "undefined"
          ? localStorage.getItem("stripePaymentLink")
          : null;

      if (data?.success && stripePaymentLink && user?.email) {
        localStorage.removeItem("stripePaymentLink");
        router.push(stripePaymentLink + `?checkout[email]=${user.email}`);
      } else if (data?.success === false) {
        router.push("/");
      } else if (data?.success) {
        router.push("/home");
      }
    }
  }, [isLoading, data, router, user]);

  if (isLoading) {
    return (
      <div className="mt-20 w-full flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-10 h-10 animate-spin text-primary" />
          <h3 className="text-xl font-bold">Redirecting...</h3>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Page;


