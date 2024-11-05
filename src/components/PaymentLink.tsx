"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { permanentRedirect, redirect, useRouter } from "next/navigation";

type PaymentLinkProps = {
  href: string;
  paymentLink?: string;
  text: string;
};

const PaymentLink = ({ href, paymentLink, text }: PaymentLinkProps) => {
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
			console.log("Login first")
			router.push(`/api/auth/login`);
		}
      }}
    >
      {text}
    </button>
  );
};
export default PaymentLink;
