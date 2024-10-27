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

export const DatingPlayground = () => {
  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });

  let prompt = ''
  const [imageUrl, setImageUrl] = useState<string>(
    "https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
  );
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [numImages, setNumImages] = useState<number>(1);
  const [playData, setPlayData] = useState<Training[]>([]);
  const [gender, setGender] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  const userId = authData?.user_id;

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      console.log(userId);
      const response = await fetch(
        `/api/training/history?userId=${userId}&status=Completed`
      );
      const data = await response.json();
      setModels(data);
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
    if (!selectedModel || !gender || !action) {
      toast.warning("Please select all required fields!");
      return;
    }

    const newPrompt = generatePrompt(); // Call a function that returns the prompt
    prompt = newPrompt

    setIsLoading(true);

    if (prompt === "") {
      toast.error("The prompt can't be empty.");
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
        return;
      } else {
        const modifiedPrompt = prompt.replace(
          new RegExp(selectedModel?.name, "g"),
          `${selectedModel?.token} ${selectedModel?.name}`
        );
        // const modifiedPrompt = prompt.replace(
        //   new RegExp(selectedModel?.name, "g"),
        //   `${selectedModel?.token} ${selectedModel?.triggerWord}`
        // );

        const finalPrompt = `${modifiedPrompt}`;
        console.log(finalPrompt);

        const res = await fetch("/api/playground/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authData?.user_id, // Assuming userId is available from the auth status
            prompt: prompt,
            finalPrompt: finalPrompt,
            negativePrompt: negativePrompt,
            numImages: numImages,
            tuneId: selectedModel.tuneId,
          }),
        });

        const resjson = await res.json();
        console.log(resjson);

        if (res.ok) {
          setIsLoading(false);

          toast.success(resjson.message);
        } else {
          setIsLoading(false);
          toast.error(resjson.message);
        }
      }
    } else {
      console.log(prompt);
    }
    // try {
    //   // Call the API
    //   const result: FalResult = await fal.subscribe("110602490-lora", {
    //     input: {
    //       prompt: prompt,
    //       model_name: "stabilityai/stable-diffusion-xl-base-1.0",
    //       image_size: "square_hd",
    //     },
    //     logs: true,
    //     onQueueUpdate: (update) => {
    //       if (update.status === "IN_PROGRESS") {
    //         update.logs.map((log) => log.message).forEach(console.log);
    //       }
    //     },
    //   });
    //   const image = result.images[0].url;
    //   console.log("result ");
    //   console.log(userId);
    //   setImageUrl(image);

    //   console.log(result.images);
    //   const res = await fetch("/api/playground/upload", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       userId: data?.user_id, // Assuming userId is available from the auth status
    //       prompt: prompt,
    //       name: "Test the app",
    //       images: result.images, // Number of images generated
    //     }),
    //   });

    //   const resjson = await res.json();

    //   if (res.ok) {
    //     setIsLoading(false);
    //   } else {
    //     setIsLoading(false);
    //   }

    // Set the generated image URL when request is complete
    // } catch (error) {
    //   console.error("Error generating image:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const generatePrompt = () => {
    let quality = "";
    if (gender === "man") quality = "handsome";
    else if (gender === "woman") quality = "beautiful";
    else quality = "attractive"; // Fallback for other genders

    const newPrompt = `Generate photo for dating profile, for ${selectedModel?.name}, this person is a ${gender}, this person is ${action} in front of ${
      place || "a scenic location"
    }, generate some ${quality} images which will impress the opposite gender.`;
    return newPrompt;

  };

  return (
    <div className="ml-[68px]">
      <ToastContainer />

      <div className="px-4 md:px-20 pt-10 text-3xl font-semibold tracking-tight flex flex-row gap-4">
        <p>Generate Dating Profile Images</p>
      </div>
      <div className="flex flex-1 flex-col items-center mr-0 py-6">
        <div className="flex w-full flex-col px-4 md:px-20">
          <div className="w-full h-full">
            {/* <div className="flex flex-row gap-4">
              <a className="text-xs w-fit" href="/">
                <button className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background-secondary border border-[#5345AB] hover:bg-secondary/90 h-8 rounded-md px-3 text-xs">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 448 512"
                    className="mr-2"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
                  </svg>
                  Go Back{" "}
                </button>
              </a>
              <div className="flex flex-row gap-2 align-middle text-center items-center pb-4">
                <h1 className="text-xl">Generate Image from Prompt</h1>
                <div>
                  <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-secondary shadow hover:bg-primary/80 text-xs font-medium">
                    Public Model
                  </div>
                </div>
              </div> 
            </div>*/}
            <div className="w-full h-full">
              <div className="flex flex-col w-full mt-4 gap-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-2">
                  <div className="flex flex-col w-full lg:w-2/6 rounded-md sm:pr-6">
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="space-y-2">
                        <label htmlFor="dropdown" className="block text-xl">
                          Select Model
                        </label>
                        <select
                          id="dropdown"
                          className="block w-full p-2 border rounded"
                          value={selectedModel ? selectedModel.name : ""}
                          onChange={(e) => {
                            const model = models.find(
                              (m) => m.name === e.target.value
                            );
                            setSelectedModel(model || null);
                          }}
                        >
                          <option value="">Select a model</option>
                          {models.map((model) => (
                            <option key={model.tuneId} value={model.name}>
                              {model.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Gender Dropdown */}
                      <div className="space-y-2 pt-4">
                        <label className="block text-xl">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="block w-full p-2 border rounded"
                          required
                        >
                          <option value="">Select a gender</option>
                          <option value="man">Man</option>
                          <option value="woman">Woman</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="other">Other</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>

                      {/* Action Dropdown */}
                      <div className="space-y-2 pt-4">
                        <label className="block text-xl">Action</label>
                        <select
                          value={action}
                          onChange={(e) => setAction(e.target.value)}
                          className="block w-full p-2 border rounded"
                          required
                        >
                          <option value="">Select an action</option>
                          <option value="standing">Standing</option>
                          <option value="running">Running</option>
                          <option value="fighting">Fighting</option>
                          <option value="sitting">Sitting</option>
                          <option value="dancing">Dancing</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>

                      {/* Place Input */}
                      <div className="space-y-2 pt-4">
                        <label className="block text-xl">Known Place</label>
                        <input
                          type="text"
                          placeholder="Mount Fuji"
                          value={place}
                          onChange={(e) => setPlace(e.target.value)}
                          className="block w-full p-2 border rounded"
                        />
                      </div>

                      {/*<div className="flex justify-between items-center pt-4">
                        <h1 className="text-xl">Negative Prompt</h1>
                         <button className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#5345AB] hover:bg-secondary/90 h-8 rounded-md px-3 text-xs bg-zinc-800 border-none text-white">
                          Advanced
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="ml-2 h-4 w-4"
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </button> 
                      </div>
                      <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        placeholder="Enter netagive prompt"
                        rows={4}
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                      />*/}
                      <div className="space-y-2 pt-4 pb-8">
                        <label htmlFor="numImages" className="block text-xl">
                          Number of Images (1-8)
                        </label>
                        <input
                          type="number"
                          id="numImages"
                          min={1}
                          max={8}
                          className="block w-full p-2 border rounded"
                          value={numImages}
                          onChange={(e) => setNumImages(Number(e.target.value))}
                        />
                      </div>
                      <button
                        className="inline-flex items-center justify-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-secondary shadow hover:bg-primary/90 h-10 px-4 py-2"
                        onClick={handleGenerate}
                      >
                        Generate
                      </button>
                      {isLoading && (
                        <div className="mt-4 px-2">
                          {" "}
                          <LinearProgress />
                        </div>
                      )}
                      {/* <div className="transition-all duration-300 max-h-0 opacity-0">
                        <div className="relative bg-zinc-800 rounded-lg p-4">
                          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m18 15-6-6-6 6"></path>
                            </svg>
                          </button>
                          <div>
                            <h2 className="text-lg mt-2 mb-4">
                              Add LoRA Model
                            </h2>
                            <div className="flex flex-col sm:flex-row items-stretch space-y-2 sm:space-y-0 sm:space-x-4">
                              <div className="w-full flex items-center cursor-pointer group border border-gray-700 rounded-lg p-3 bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200 ease-in-out hover:border-gray-600 h-16 relative">
                                <div className="relative overflow-hidden rounded-lg mr-3 w-10 h-10 flex-shrink-0">
                                  <img
                                    src="https://tncnlztihyicwsra.public.blob.vercel-storage.com/public_model_images/frosting_lane-4KJ5NFM2C8adBss3DYnDsvgXJk64nE.jpeg"
                                    alt="1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col justify-center flex-grow">
                                  <p className="text-sm font-semibold text-white">
                                    Frosting Lane Style
                                  </p>
                                  <div className="text-xs text-gray-400 flex items-center mt-1">
                                    <span className="mr-1">
                                      Trigger Word: frstingln illustration
                                    </span>
                                  </div>
                                </div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  className="absolute top-5 right-4 w-4 h-4 text-gray-400"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap gap-4 justify-center bg-secondary">
                        <div className="relative flex justify-center cursor-pointer">
                          <img
                            src="https://fal.media/files/tiger/XhRx_19qKnAcq69ms_5sa_39f6ba241cf54b0b8f5bd7f727a0da75.jpg"
                            className="rounded-md w-60 h-60 object-cover"
                            alt="Generated"
                          />
                        </div>
                        <div className="relative flex justify-center cursor-pointer">
                          <img
                            src="https://fal.media/files/kangaroo/Dmfz9AUm1V2tbcC7pnQN5_7d9204e0a9294658b6990acfacd66480.jpg"
                            className="rounded-md w-60 h-60 object-cover"
                            alt="Generated"
                          />
                        </div>
                        <div className="relative flex justify-center cursor-pointer">
                          <img
                            src="https://fal.media/files/rabbit/EOn87ImEwQ8cAErwtrKLS_ce54e896eae04f9d82fed98cb7958e75.jpg"
                            className="rounded-md w-60 h-60 object-cover"
                            alt="Generated"
                          />
                        </div>
                        <div className="relative flex justify-center cursor-pointer">
                          <img
                            src="https://fal.media/files/rabbit/TftTMubkg2CVaaDqKVUjM_299d3753d12c4f9ca664fd50859586ba.jpg"
                            className="rounded-md w-60 h-60 object-cover"
                            alt="Generated"
                          />
                        </div>
                      </div>{" "} */}
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
                      <p className="inline-flex justify-center items-center">No images found</p>
                    ) : (
                      playData.map((item, idx) => (
                        <div key={idx} className="border p-4">
                          <div className="flex justify-between">
                            <h2 className="font-bold">{item.name}</h2>
                            <p>{item.status}</p>
                          </div>

                          {item.status === "IN PROGRESS" ? (
                            <div className="relative w-full  bg-gray-200 mt-2">
                              <div className="absolute top-0 left-0  w-full ">
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

                    {/* <div className="space-y-4 p-6">
                      <div
                        className="flex flex-col space-y-2"
                        data-testid="output-grid"
                      >
                        <a
                          data-testid="value-output-url-image"
                          href="https://replicate.delivery/yhqm/tEIKfYbofygrwU0at32V8I3fBC0YN5tE3rtd9vFIfjRBCVpNB/out-0.webp"
                          rel="noreferrer"
                          target="_blank"
                          className="inline-flex flex-col"
                        >
                          {(loading || imageLoading) && (
                            <div className="w-96 h-96 mt-6 bg-gray-300 animate-pulse rounded-lg"></div>
                          )}

                          {imageUrl && !loading && (
                            <img
                              data-testid="value-output-image"
                              src={imageUrl}
                              alt="output"
                              className={`max-w-full ${
                                imageLoading ? "hidden" : ""
                              }`}
                              onLoad={handleImageLoad}
                            />
                          )}
                        </a>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <a
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        href="/api/auth/login"
                      >
                        Download
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
