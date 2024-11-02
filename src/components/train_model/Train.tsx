"use client";

import React, { useRef, useState } from "react";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LinearProgress from "@mui/material/LinearProgress"; // Import LinearProgress
import TrainingHistory from "./TrainingHistory";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Link from "next/link";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";

export const Train = () => {
  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(""); // Initialize state
  const [uploadTrigger, setUploadTrigger] = useState(false);
  const [open, setOpen] = useState(false);

  const isAuthenticated = authData?.success;
  if (!isAuthenticated) {
    return redirect("/api/auth/login");
  }

  const handleButtonClick = () => {
    if (!inputRef || !inputRef.current) return;
    inputRef.current.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateFiles(Array.from(e.target.files));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      updateFiles(Array.from(droppedFiles));
    }
  };

  const updateFiles = (selectedFiles: File[]) => {
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 2 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      toast.error("Each file must be smaller than 2 MB.");
      return;
    }

    if (selectedFiles.length >= 8 && selectedFiles.length <= 15) {
      const filePreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls(filePreviews);
      setFiles(selectedFiles);
    } else {
      toast.error("Please upload at least 8 and at most 15 images.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 8) {
      toast.error("Please upload at least 8 images");
      return;
    }
    if (files.length > 15) {
      toast.error("Please upload at most 15 images");
      return;
    }
    const oversizedFiles = files.filter((file) => file.size > 2 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      toast.error("Each file must be smaller than 2 MB.");
      return;
    }

    if (name === "") {
      toast.error("Name is required");
      return;
    }

    toast.info("Training data upload started");
    setIsLoading(true);
    const userId = authData?.user_id;
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("userId", userId as string);
    formData.append("name", name as string);

    const res = await fetch("/api/training/upload", {
      method: "POST",
      body: formData,
    });

    const resjson = await res.json();

    if (res.ok) {
      setIsLoading(false);
      setFiles([]);
      setPreviewUrls([]);
      setUploadTrigger((prev) => !prev);
      toast.success(resjson.message);
    } else if (res.status === 402) {
      setIsLoading(false);
      setOpen(true);
    } else {
      setIsLoading(false);
      setFiles([]);
      setPreviewUrls([]);
      toast.error(resjson.message);
      setUploadTrigger((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center py-16 ml-[68px]">
      <ToastContainer />

      <div className="flex w-full flex-col px-4 lg:px-24">
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
                          You do not have enough credits left to train more
                          models, Please buy some credits to continue your
                          endeavour.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Link
                    href={{
                      pathname: `/`,
                    }}
                  >
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

        <div className="w-full mx-auto px-2 md:px-8 space-y-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="rounded-xl bg-secondary text-secondary-foreground border border-[#5345AB] shadow-[0_0_10px_#5345AB] flex-1">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="font-semibold tracking-tight text-2xl md:text-2xl">
                    Train Model
                  </h3>
                  <p className="text-description text-md md:text-sm">
                    Choose a name, type, and upload at least 8 photos to get
                    started.
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <form className="rounded-md flex flex-col gap-8">
                    <div className="space-y-2 w-full rounded-md">
                      <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                        placeholder="John's Ai Avatar"
                        autoComplete="off"
                        id=":R1deuuunjla:-form-item"
                        aria-describedby=":R1deuuunjla:-form-item-description"
                        aria-invalid="false"
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div
                      role="presentation"
                      className=" rounded-md justify-center align-middle cursor-pointer flex flex-col gap-4"
                    >
                      <label
                        className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="undefined-form-item"
                      >
                        Samples
                      </label>
                      <p
                        id="undefined-form-item-description"
                        className="text-[0.8rem] text-muted-foreground"
                      >
                        Upload 8-15 images of the subject you want to train for.
                      </p>
                      <div
                        className="outline-dashed outline-2 outline-gray-100 hover:outline-blue-500 w-full h-full rounded-md p-4 flex justify-center align-middle"
                        onClick={handleButtonClick}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
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
                      {previewUrls.length > 0 && (
                        <div className="image-preview-container pb-8">
                          <div className="image-grid grid grid-cols-2 md:grid-cols-3 gap-1">
                            {previewUrls.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`preview-${index}`}
                                className="image-preview"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        className="inline-flex items-center justify-center text-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-11 px-8 rounded-lg w-full bg-brand text-white hover:bg-brand/90 transition-colors duration-200 bg-purple-800"
                        onClick={handleSubmit}
                        disabled={isLoading}
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

                      {isLoading && (
                        <div className="mt-4 px-2">
                          {" "}
                          <LinearProgress />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 p-4 bg-secondary rounded-md text-secondary-foreground text-xs">
                      <h4 className="text-sm font-semibold mb-3 text-primary">
                        Important Details
                      </h4>
                      <ul className="list-disc pl-4 mb-4 space-y-1">
                        <li>Training takes between 30 to 40 minutes.</li>
                        <li>
                          When your model is trained, we&apos;ll send you an
                          email.
                        </li>
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
                          style you want to train on.
                        </li>
                        <li>
                          If training on a person, upload 6 close-ups (face
                          only), 3 mid-shots (from the chest up), and 3
                          full-body shots.
                        </li>
                        <li>
                          <strong>Add Variety:</strong> Change up poses, facial
                          expressions, backgrounds, and where the subject is
                          looking. This makes your trained model better.
                        </li>
                      </ul>
                      <br></br>
                      <p className="mt-1">
                        P.S. - What you&apos;ll input is what you&apos;ll get as
                        output. To train good model, take some time to collect
                        good images
                      </p>
                    </div>
                  </form>
                </div>

                <div className="rounded-xl border shadow w-full max-w-6xl mx-auto bg-secondary text-secondary-foreground">
                  
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
                </div>
              </div>
              <div className="hidden sm:block flex-1">
                <div className="rounded-xl border w-full max-w-6xl mx-auto bg-secondary text-secondary-foreground h-full">
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <h3 className="tracking-tight text-2xl font-semibold">
                      Training History
                    </h3>
                  </div>
                  <TrainingHistory
                    userId={authData?.user_id}
                    uploadTrigger={uploadTrigger}
                  />
                </div>
              </div>
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
