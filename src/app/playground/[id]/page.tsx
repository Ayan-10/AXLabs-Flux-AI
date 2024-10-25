"use client";

import { DatingPlayground } from "@/components/playground/DatingPlayground";
import { HeadshotPlayground } from "@/components/playground/HeadshotPlayground";
import { ModelPlayground } from "@/components/playground/ModelPlayground";
import { OldMoneyPlayground } from "@/components/playground/OldMoneyPlayground";
import { TravelPlayground } from "@/components/playground/TravelPlayground";
import { Playground } from "@/components/playground/Playground";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const PlaygroundWithInitialPrompt = () => {
  const params = useParams(); // Gets the dynamic route parameters
  const { id } = params || {}; // Extract the 'id' parameter

  console.log(id)
  if (id === "1") {
    return <DatingPlayground />;
  } else if (id === "2") {
    return <HeadshotPlayground />;
  } else if (id === "3") {
    return <OldMoneyPlayground />;
  } else if (id === "4") {
    return <ModelPlayground />;
  } else if (id === "5") {
    return <TravelPlayground />;
  }

  return <Playground />;
};

export default PlaygroundWithInitialPrompt;
