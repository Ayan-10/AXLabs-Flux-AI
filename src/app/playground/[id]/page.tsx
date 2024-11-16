"use client";

import { TemplatePlayground } from "@/components/playground/TemplatePlayground";
import { Playground } from "@/components/playground/Playground";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const PlaygroundWithInitialPrompt = () => {
  const params = useParams(); // Gets the dynamic route parameters
  const { id } = params || {}; // Extract the 'id' parameter



  console.log(id)
  if (id) {
    return <TemplatePlayground pageId={id} />;
  } 
  return <Playground />;
};

export default PlaygroundWithInitialPrompt;
