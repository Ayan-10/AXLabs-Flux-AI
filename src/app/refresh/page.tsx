"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
    window.location.href = "/";
  }, [router]);

  return null; // No UI needed on this page
}
