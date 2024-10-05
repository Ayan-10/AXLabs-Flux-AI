"use client";

import React, { useRef, useState } from "react";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { useQuery } from "@tanstack/react-query";


export const Train = () => {
  const { data } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });
  const inputRef = useRef < HTMLInputElement > (null);

  const handleButtonClick = () => {
    // e.preventDefault();
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  }

  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 10) {
      setMessage("Please upload atleast 10 images");
      return;
    }

    const userId = data?.user_id;
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("userId", userId as string);

    const res = await fetch("/api/training/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Training data uploaded successfully");
    } else {
      setMessage("Failed to upload training data");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center py-16">
      <div className="flex w-full flex-col px-4 lg:px-40">
        <div className="w-full mx-auto px-2 md:px-8 space-y-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="rounded-xl bg-secondary text-secondary-foreground border border-[#5345AB] shadow-[0_0_10px_#5345AB] flex-1">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="font-semibold tracking-tight text-2xl md:text-2xl">
                    Train Model
                  </h3>
                  <p className="text-description text-md md:text-sm">
                    Choose a name, type, and upload at least 4 photos to get
                    started.
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <div>
                    <form className="rounded-md flex flex-col gap-8">
                      <div className="space-y-2 w-full rounded-md">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Name
                        </label>
                        <p
                          id=":R1deuuunjla:-form-item-description"
                          className="text-[0.8rem] text-muted-foreground"
                        >
                          Give your model a name so you can easily identify it
                          later.
                        </p>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-screen-sm"
                          placeholder="e.g. Natalie Headshots"
                          autoComplete="off"
                          id=":R1deuuunjla:-form-item"
                          aria-describedby=":R1deuuunjla:-form-item-description"
                          aria-invalid="false"
                          name="name"
                          value=""
                        />
                      </div>
                      <div
                        role="presentation"
                        className=" rounded-md justify-center align-middle cursor-pointer flex flex-col gap-4"
                      >
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="undefined-form-item"
                        >
                          Samples
                        </label>
                        <p
                          id="undefined-form-item-description"
                          className="text-[0.8rem] text-muted-foreground"
                        >
                          Upload 4-20 images of the subject you want to train
                          for.
                        </p>
                        <div
                          className="outline-dashed outline-2 outline-gray-100 hover:outline-blue-500 w-full h-full rounded-md p-4 flex justify-center align-middle"
                          onClick={handleButtonClick}
                        >
                          <input
                            accept="image/png,.png,image/jpeg,.jpg,.jpeg,image/webp,.webp"
                            multiple
                            type="file"
                            ref={inputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <div className="flex justify-center flex-col items-center gap-2">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 576 512"
                              className="text-gray-700"
                              height="32"
                              width="32"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path>
                            </svg>
                            <p className="self-center">
                              Drop images here, or click to select.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          className="inline-flex items-center justify-center text-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-11 px-8 rounded-lg w-full bg-brand text-white hover:bg-brand/90 transition-colors duration-200 bg-purple-800"
                          onClick={handleSubmit}
                          type="submit"
                        >
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
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                            <path d="m3.3 7 8.7 5 8.7-5"></path>
                            <path d="M12 22V12"></path>
                          </svg>
                          Train Model
                        </button>
                        <p className="text-sm text-center text-description mt-4">
                          <a
                            className="text-brand-secondary hover:underline"
                            href="/billing"
                          >
                            {message && <p>{message}</p>}
                          </a>{" "}
                        </p>
                      </div>

                      {/* <div className="space-y-2 w-full rounded-md"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for=":R2deuuunjla:-form-item">Subject Type</label><p id=":R2deuuunjla:-form-item-description" className="text-[0.8rem] text-muted-foreground">Select the type of subject you want to train on.</p><div role="radiogroup" aria-required="false" dir="ltr" className="grid grid-cols-4 gap-4" id=":R2deuuunjla:-form-item" aria-describedby=":R2deuuunjla:-form-item-description" aria-invalid="false"  style="outline:none"><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="man" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="man" aria-label="Man" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="man"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="man"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"></path></svg>Man</label></div><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="woman" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="woman" aria-label="Woman" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="woman"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="woman"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M128 0c35.346 0 64 28.654 64 64s-28.654 64-64 64c-35.346 0-64-28.654-64-64S92.654 0 128 0m119.283 354.179l-48-192A24 24 0 0 0 176 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H80a24 24 0 0 0-23.283 18.179l-48 192C4.935 369.305 16.383 384 32 384h56v104c0 13.255 10.745 24 24 24h32c13.255 0 24-10.745 24-24V384h56c15.591 0 27.071-14.671 23.283-29.821z"></path></svg>Woman</label></div><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="product" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="product" aria-label="Product" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="product"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="product"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M509.5 184.6L458.9 32.8C452.4 13.2 434.1 0 413.4 0H272v192h238.7c-.4-2.5-.4-5-1.2-7.4zM240 0H98.6c-20.7 0-39 13.2-45.5 32.8L2.5 184.6c-.8 2.4-.8 4.9-1.2 7.4H240V0zM0 224v240c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V224H0z"></path></svg>Product</label></div><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="style" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="style" aria-label="Style" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="style"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="style"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg>Style</label></div><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="object" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="object" aria-label="Object" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="object"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="object"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg>Object</label></div><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="font" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="font" aria-label="Font" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="font"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="font"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"></path></svg>Font</label></div><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="pet" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="pet" aria-label="Pet" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="pet"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="pet"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 224c-79.41 0-192 122.76-192 200.25 0 34.9 26.81 55.75 71.74 55.75 48.84 0 81.09-25.08 120.26-25.08 39.51 0 71.85 25.08 120.26 25.08 44.93 0 71.74-20.85 71.74-55.75C448 346.76 335.41 224 256 224zm-147.28-12.61c-10.4-34.65-42.44-57.09-71.56-50.13-29.12 6.96-44.29 40.69-33.89 75.34 10.4 34.65 42.44 57.09 71.56 50.13 29.12-6.96 44.29-40.69 33.89-75.34zm84.72-20.78c30.94-8.14 46.42-49.94 34.58-93.36s-46.52-72.01-77.46-63.87-46.42 49.94-34.58 93.36c11.84 43.42 46.53 72.02 77.46 63.87zm281.39-29.34c-29.12-6.96-61.15 15.48-71.56 50.13-10.4 34.65 4.77 68.38 33.89 75.34 29.12 6.96 61.15-15.48 71.56-50.13 10.4-34.65-4.77-68.38-33.89-75.34zm-156.27 29.34c30.94 8.14 65.62-20.45 77.46-63.87 11.84-43.42-3.64-85.21-34.58-93.36s-65.62 20.45-77.46 63.87c-11.84 43.42 3.64 85.22 34.58 93.36z"></path></svg>Pet</label></div><div className="cursor-pointer"><button type="button" role="radio" aria-checked="false" data-state="unchecked" value="food" className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer sr-only" id="food" aria-label="Food" tabindex="-1" data-radix-collection-item=""></button><input type="radio" aria-hidden="true" style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 16px; height: 16px;" tabindex="-1" value="food"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&amp;:has([data-state=checked])]:border-primary cursor-pointer" for="food"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="mb-3 h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 256H48a48 48 0 0 0 0 96h416a48 48 0 0 0 0-96zm16 128H32a16 16 0 0 0-16 16v16a64 64 0 0 0 64 64h352a64 64 0 0 0 64-64v-16a16 16 0 0 0-16-16zM58.64 224h394.72c34.57 0 54.62-43.9 34.82-75.88C448 83.2 359.55 32.1 256 32c-103.54.1-192 51.2-232.18 116.11C4 180.09 24.07 224 58.64 224zM384 112a16 16 0 1 1-16 16 16 16 0 0 1 16-16zM256 80a16 16 0 1 1-16 16 16 16 0 0 1 16-16zm-128 32a16 16 0 1 1-16 16 16 16 0 0 1 16-16z"></path></svg>Food</label></div></div></div><div role="presentation"  className=" rounded-md justify-center align-middle cursor-pointer flex flex-col gap-4"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="undefined-form-item">Samples</label><p id="undefined-form-item-description" className="text-[0.8rem] text-muted-foreground">Upload 4-20 images of the subject you want to train for.</p><div className="outline-dashed outline-2 outline-gray-100 hover:outline-blue-500 w-full h-full rounded-md p-4 flex justify-center align-middle"><input accept="image/png,.png,image/jpeg,.jpg,.jpeg,image/webp,.webp" multiple="" type="file" style="display:none" tabindex="-1"><div className="flex justify-center flex-col items-center gap-2"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" className="text-gray-700" height="32" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg><p className="self-center">Drop images here, or click to select.</p></div></div></div><div><button className="inline-flex items-center justify-center text-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-11 px-8 rounded-lg w-full bg-brand text-white hover:bg-brand/90 transition-colors duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2 h-4 w-4"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>Unlock Training</button><p className="text-sm text-center text-description mt-4"><a className="text-brand-secondary hover:underline" href="/billing">Upgrade to train a new model.</a> </p></div> */}
                    </form>
                    <div className="mt-2 p-4 bg-secondary rounded-md text-secondary-foreground text-xs">
                      <h4 className="text-sm font-semibold mb-3 text-primary">
                        Important Details
                      </h4>
                      <ul className="list-disc pl-4 mb-4 space-y-1">
                        <li>
                          Training usually takes between 20 to 40 minutes.
                        </li>
                        <li>
                          When your model is ready, we'll send you an email.
                        </li>
                        <li>No nudes / NSFW images allowed.</li>
                      </ul>
                      <h4 className="text-sm font-semibold mb-3 text-primary">
                        Tips
                      </h4>
                      <ul className="list-disc pl-4 space-y-2">
                        <li>
                          <strong>Use Square Samples:</strong> For the best
                          results, upload images with a 1:1 aspect ratio
                          (square).
                        </li>
                        <li>
                          <strong>Use Multiple Zoom Levels:</strong> Upload
                          10-20 high-quality photos of the person, object, or
                          style you want to train on. If training on a person,
                          we recommend using 10 close-ups (face only), 5
                          mid-shots (from the chest up), and 3 full-body shots.
                        </li>
                        <li>
                          <strong>Add Variety:</strong> Change up poses,
                          backgrounds, and where the subject is looking. This
                          makes your model better.
                        </li>
                      </ul>
                      <p className="mt-4">
                        You'll be more likely to get a good model by uploading
                        high quality samples.
                      </p>
                      <p className="mt-1">
                        Keep in mind there is no single best way to train a
                        great model, it may take some experimentation to get the
                        results.
                      </p>
                    </div>
                    {/* <div className="mt-2 p-4 bg-secondary rounded-md text-secondary-foreground text-xs"><h4 className="text-sm font-semibold mb-3 text-primary">Important Details</h4><ul className="list-disc pl-4 mb-4 space-y-1"><li>Training usually takes between 20 to 40 minutes.</li><li>When your model is ready, we'll send you an email.</li><li>No nudes / NSFW images allowed.</li></ul><h4 className="text-sm font-semibold mb-3 text-primary">Tips</h4><ul className="list-disc pl-4 space-y-2"><li><strong>Use Square Samples:</strong> For the best results, upload images with a 1:1 aspect ratio (square).</li><li><strong>Use Multiple Zoom Levels:</strong> Upload 10-20 high-quality photos of the person, object, or style you want to train on. If training on a person, we recommend using 10 close-ups (face only), 5 mid-shots (from the chest up), and 3 full-body shots.</li><li><strong>Add Variety:</strong> Change up poses, backgrounds, and where the subject is looking. This makes your model better.</li></ul><p className="mt-4">You'll be more likely to get a good model by uploading high quality samples.</p><p className="mt-1">Keep in mind there is no single best way to train a great model, it may take some experimentation to get the results.</p></div> */}
                  </div>
                </div>
              </div>
              <div className="hidden lg:block flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
{
  /* <div className="rounded-xl border shadow w-full max-w-6xl mx-auto bg-secondary text-secondary-foreground">
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <h3 className="tracking-tight text-2xl font-semibold">
                      Tutorial
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <div dir="ltr" data-orientation="horizontal">
                      <div
                        data-state="active"
                        data-orientation="horizontal"
                        role="tabpanel"
                        aria-labelledby="radix-:R5uuuunjla:-trigger-Person"
                        id="radix-:R5uuuunjla:-content-Person"
                        className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8"
                      >
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">
                            How to get results:
                          </h3>
                          <div className="flex flex-wrap justify-center gap-4">
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="How to get results: image 1"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                srcSet="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fzebra%2FxSPD_fI06ZkpAG1rgZExx_16138f5ff8314a0a881ff01b967937e8.jpg&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="How to get results: image 2"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                srcSet="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fkangaroo%2Ff6sEik9QZcfD7wXpxKRNn_7b9df0ce664a4fa6aed6ba73a70c7265.jpg&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="How to get results: image 3"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                srcSet="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Fpanda%2FzTckvlvtM6u2cavh8rWCZ_ca15cf58fa3d4febbf283054bdd3333b.jpg&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="How to get results: image 4"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                srcSet="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ffal.media%2Ffiles%2Ftiger%2F5lyRIbNHQt-LHmF72A6X2_b6c4254706df4b8eb113cd2e2b2671d8.jpg&amp;w=3840&amp;q=75"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">
                            ✅ Input model name and type
                          </h3>
                          <p className="text-sm text-description">
                            Name your model any name you want, and select the
                            type of subject (Person, Man, Woman)
                          </p>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">
                            ✅ Choose good pictures
                          </h3>
                          <p className="text-sm text-description">
                            5-10 high-quality samples, front facing, square
                            aspect ratio, 1 person in frame, variety
                          </p>
                          <div className="flex flex-wrap justify-center gap-4">
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="✅ Choose good pictures image 1"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                sizes="100vw"
                                srcSet="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_2-Tpn4lNZQBC0I7YYKPAJHDQCvxFEFQh.png&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="✅ Choose good pictures image 2"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                sizes="100vw"
                                srcSet="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_4-O6YDt8imZ9qNClbfNtGCWGkxqv8bZQ.png&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="✅ Choose good pictures image 3"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                sizes="100vw"
                                srcSet="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_5-uCtKrNy2o2B1EgXq4y9yoIaJNOr6Ye.png&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="✅ Choose good pictures image 4"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                sizes="100vw"
                                srcSet="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2Fimage_6-BJgAt8M1JVsfTNoBMfJ9B2bTlTcrUG.png&amp;w=3840&amp;q=75"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">
                            ❌ Example of bad pictures
                          </h3>
                          <p className="text-sm text-description">
                            Multiple subjects, face covered, NSFW images,
                            blurry, uncropped, full length
                          </p>
                          <div className="flex flex-wrap justify-center gap-4">
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="❌ Example of bad pictures image 1"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                sizes="100vw"
                                srcSet="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.48.38%2520PM-YdVuOzvp6ES0eAEf3KcSif2vgNEQVb.png&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="❌ Example of bad pictures image 2"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                sizes="100vw"
                                srcSet="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.52.14%2520PM-2TjRxwJxB1jNC7RYJsssuJ25vv7Uhd.png&amp;w=3840&amp;q=75"
                              />
                            </div>
                            <div className="relative w-[110px] h-[130px]">
                              <img
                                alt="❌ Example of bad pictures image 3"
                                loading="lazy"
                                decoding="async"
                                data-nimg="fill"
                                className="rounded-md"
                                style={{
                                  position: "absolute",
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  color: "transparent",
                                }}
                                sizes="100vw"
                                srcSet="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=3840&amp;q=75 3840w"
                                src="/_next/image?url=https%3A%2F%2Ftncnlztihyicwsra.public.blob.vercel-storage.com%2Fexample_samples%2FScreen%2520Shot%25202024-09-04%2520at%25205.49.01%2520PM-LEiif0NHcKTgSdHsyomZ8iI3kOlShz.png&amp;w=3840&amp;q=75"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">
                            ✅ Train your model
                          </h3>
                          <p className="text-sm text-description">
                            Training your model takes ~30 minutes. You can leave
                            the page and come back later.
                          </p>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">
                            ✅ Generate images
                          </h3>
                          <p className="text-sm text-description">
                            Once your model is trained, you can generate images
                            using prompts. Make sure to include the subject
                            keyword in your prompts.
                          </p>
                        </div>
                      </div>
                      <div
                        data-state="inactive"
                        data-orientation="horizontal"
                        role="tabpanel"
                        aria-labelledby="radix-:R5uuuunjla:-trigger-Product"
                        id="radix-:R5uuuunjla:-content-Product"
                        className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8"
                      ></div>
                      <div
                        data-state="inactive"
                        data-orientation="horizontal"
                        role="tabpanel"
                        aria-labelledby="radix-:R5uuuunjla:-trigger-Style"
                        id="radix-:R5uuuunjla:-content-Style"
                        className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8"
                      ></div>
                      <div
                        data-state="inactive"
                        data-orientation="horizontal"
                        role="tabpanel"
                        aria-labelledby="radix-:R5uuuunjla:-trigger-Pet"
                        id="radix-:R5uuuunjla:-content-Pet"
                        className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8"
                      ></div>
                    </div>
                  </div>
                </div> */
}
