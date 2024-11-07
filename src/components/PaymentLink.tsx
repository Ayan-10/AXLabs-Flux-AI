"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { permanentRedirect, redirect, useRouter } from "next/navigation";

type PaymentLinkProps = {
  paymentLink?: string;
  text: string;
};

const PaymentLink = ({ paymentLink, text }: PaymentLinkProps) => {
	  const router = useRouter();

  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });
  return (
    <button
      //   href={href}
      className={buttonVariants()}
      onClick={() => {
        if (authData?.success) {
          router.push(paymentLink + `?checkout[email]=${authData.email}`);
        } else {
			router.push(
        `https://accounts.coolaiphoto.com/sign-in?redirect_url=https%3A%2F%2Fapp.coolaiphoto.com%2F`
      );
      
		}
      }}
    >
      {text}
    </button>
  );
};
export default PaymentLink;
