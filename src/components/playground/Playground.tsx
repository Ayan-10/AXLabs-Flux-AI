"use client";

import { useEffect, useState } from "react";
import * as fal from "@fal-ai/serverless-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import prisma from "@/db/prisma";
import LinearProgress from "@mui/material/LinearProgress"; // Import LinearProgress
import ImageCard from "./ImageCrad";
import { Loader } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { usePromptStore } from "../usePromptStore";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Link from "next/link";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

interface FalResult {
  images: Array<{
    url: string;
  }>;
}

interface Model {
  name: string;
  triggerWord: string;
  tuneId: string;
  token: string;
}

type Training = {
  id: string;
  name: string;
  status: string;
  images: string[]; // assuming it's an array of image URLs
};

const initialItems: Model[] = [
  {
    name: "Elon Musk",
    triggerWord: "elon musk",
    tuneId: "1763462",
    token: "ohwx",
  },
];

export const Playground = () => {
  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string>(
    "https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
  );
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>(initialItems);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [numImages, setNumImages] = useState<number>(1);
  const [playData, setPlayData] = useState<Training[]>([]);
  const [open, setOpen] = useState(false);

  const userId = authData?.user_id;

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      console.log(userId);
      const response = await fetch(
        `/api/training/history?userId=${userId}&status=COMPLETED`
      );
      const data = await response.json();
      setModels([...initialItems, ...data]);
      setLoading(false);
    };

    fetchModels();
  }, [userId]);

  useEffect(() => {
    fetchPlayData();
    const interval = setInterval(fetchPlayData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [userId]);

  const fetchPlayData = async () => {
    try {
      const response = await fetch(
        `/api/playground/fetch/plays?userId=${userId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setPlayData(data);
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };

  const handleGenerate = async () => {
    setImageUrl(
      "https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
    );
    setIsLoading(true);

    if (prompt === "") {
      toast.error("The prompt can't be empty.");
      setIsLoading(false);
      return;
    }

    if (numImages < 1 || numImages > 4) {
      toast.error("Must choose 1-4 number of images.");
      setIsLoading(false);
      return;
    }

    console.log(selectedModel?.name);
    console.log(selectedModel?.token);
    console.log(selectedModel?.triggerWord);
    console.log(selectedModel?.tuneId);

    if (selectedModel) {
      if (!prompt.includes(selectedModel.name)) {
        toast.error(
          "The prompt must contain the selected model name from the dropdown."
        );
        setIsLoading(false);

        return;
      } else {
        const modifiedPrompt = prompt.replace(
          new RegExp(selectedModel?.name, "g"),
          `${selectedModel?.token} ${selectedModel?.triggerWord}`
        );

        const finalPrompt = `${modifiedPrompt}`;

        const res = await fetch("/api/playground/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authData?.user_id,
            prompt: prompt,
            finalPrompt: finalPrompt,
            negativePrompt: negativePrompt,
            numImages: numImages,
            tuneId: selectedModel.tuneId,
          }),
        });

        const resjson = await res.json();

        if (res.ok) {
          setIsLoading(false);
          toast.success(resjson.message);
        } else if (res.status === 402) {
          setIsLoading(false);
          setOpen(true);
        } else {
          setIsLoading(false);
          toast.error(resjson.message);
        }
      }
    } else {
      setIsLoading(false);
      toast.error("Model selection is required");
    }
  };

  return (
    <div className="ml-[68px]">
      <ToastContainer />

      <div className="px-4 md:px-20 pt-10 text-2xl font-semibold flex flex-row gap-4">
        <p>Create Images from Text</p>
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      No Credits Left
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You do not have enough credits left to generate more
                        images. Please buy some credits to continue your
                        endeavor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Link href="/">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                  >
                    Buy Now
                  </button>
                </Link>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <div className="flex flex-1 flex-col items-center mr-0 py-6">
        <div className="flex w-full flex-col px-4 md:px-20">
          <div className="w-full h-full">
            <div className="flex flex-col w-full mt-4 gap-8">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-2">
                <div className="flex flex-col w-full lg:w-2/6 rounded-md sm:pr-6">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="space-y-2">
                      <label htmlFor="dropdown" className="block text-base">
                        Select Model
                      </label>
                      <select
                        id="dropdown"
                        className="block w-full p-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedModel ? selectedModel.name : ""}
                        onChange={(e) => {
                          const model = models.find(
                            (m) => m.name === e.target.value
                          );
                          setPrompt(model?.name as string);
                          setSelectedModel(model || null);
                        }}
                      >
                        <optgroup label="Public models">
                          {initialItems.map((model) => (
                            <option key={model.tuneId} value={model.name}>
                              {model.name}
                            </option>
                          ))}
                        </optgroup>

                        <optgroup label="Your trained models">
                          {models
                            .filter(
                              (model) =>
                                !initialItems.some(
                                  (initial) => initial.name === model.name
                                )
                            )
                            .map((model) => (
                              <option key={model.tuneId} value={model.name}>
                                {model.name}
                              </option>
                            ))}
                        </optgroup>
                      </select>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <h1 className="text-base">Detailed Prompt</h1>
                    </div>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-[8px] border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="a good prompt is the key to a good image, be detailed and specific"
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="space-y-2 pt-4 pb-8">
                      <label htmlFor="numImages" className="block text-base">
                        Number of Images (1-4)
                      </label>
                      <input
                        type="number"
                        id="numImages"
                        min={1}
                        max={4}
                        className="block w-full p-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={numImages}
                        onChange={(e) => setNumImages(Number(e.target.value))}
                      />
                    </div>
                    <button
                      className="inline-flex items-center justify-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-secondary shadow hover:bg-primary/90 h-10 px-4 py-2 dark:text-white"
                      onClick={handleGenerate}
                    >
                      Generate
                    </button>
                    {isLoading && (
                      <div className="mt-4 px-2">
                        <LinearProgress />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col rounded-md border border-stroke-light bg-surface group lg:w-4/6">
                  <div className="mb-2 p-6">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl">Result</h1>
                    </div>
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <Loader className="w-10 h-10 animate-spin text-primary" />
                    </div>
                  ) : playData.length === 0 ? (
                    <p className="inline-flex justify-center items-center">
                      No images found
                    </p>
                  ) : (
                    playData.map((item, idx) => (
                      <div key={idx} className="border p-4">
                        <div className="flex justify-between items-center">
                          <h2 className="font-bold">{item.name}</h2>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded ms-3 ${
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

                        {item.status === "IN PROGRESS" ? (
                          <div className="relative w-full bg-gray-200 mt-2">
                            <div className="absolute top-0 left-0 w-full">
                              <LinearProgress />
                            </div>
                          </div>
                        ) : item.images.length > 0 ? (
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {item.images.map((image, imgIdx) => (
                              <ImageCard key={imgIdx} src={image} />
                            ))}
                          </div>
                        ) : (
                          <p>No images found</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
