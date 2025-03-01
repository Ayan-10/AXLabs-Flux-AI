"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { permanentRedirect, redirect, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface PaymentLinkProps {
  text?: string;
  children?: ReactNode;
  paymentLink?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const PaymentLink = ({ 
  paymentLink, 
  text, 
  children, 
  className, 
  variant = "default" 
}: PaymentLinkProps) => {
  const router = useRouter();

  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });
  
  return (
    <button
      className={buttonVariants({
        variant,
        className,
      })}
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
      {children || text}
    </button>
  );
};

export default PaymentLink;
