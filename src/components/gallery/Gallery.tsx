"use client";

import Button from "@mui/material/Button";
import Download from "@mui/icons-material/Download";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteTwoTone from "@mui/icons-material/FavoriteTwoTone";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { FilterIcon, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isUserSubscribed } from "@/app/premium/actions";
import { checkAuthStatus } from "@/app/auth/callback/actions";
import { redirect } from "next/navigation";

interface GalleryItem {
  image: string;
}

export const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch authentication status
  const { data: authData } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await checkAuthStatus(),
  });

  const userId = authData?.user_id;

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/playground/fetch/images/${userId}`);
      const data = await res.json();

      if (data.length === 0) {
        setItems([]);
      } else {
        const fetchedImages = data.map((image: string) => ({ image }));
        setItems(fetchedImages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchFavoriteImages = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/playground/fetch/favoriteImages/${userId}`);
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      console.error("Error fetching favorite images:", error);
    }
  };

  const handleToggleFavorite = async (image: string) => {
    try {
      const isFavorite = favorites.includes(image);
      const res = await fetch("/api/playground/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, image, favorite: !isFavorite }),
      });
      if (res.ok) {
        setFavorites((prev) =>
          isFavorite ? prev.filter((img) => img !== image) : [...prev, image]
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDownload = (e: React.MouseEvent, src: string) => {
    window.open(src, "_blank");
  };

  // Polling logic to fetch new images every 5 seconds
  useEffect(() => {
    fetchImages();
    fetchFavoriteImages();
    const interval = setInterval(fetchImages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [userId]);

  const displayedItems = showFavoritesOnly
    ? items.filter((item) => favorites.includes(item.image))
    : items;

  return (
    <div className="ml-[68px]">
      <div className="px-4 sm:px-20 pt-10 text-2xl font-semibold text-gray-900 dark:text-white flex flex-row gap-4">
        <p>Your Generated Images</p>
        <Button
          startIcon={showFavoritesOnly ? <Favorite /> : <FavoriteTwoTone />}
          variant="outlined"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`border rounded-[8px] text-sm transition duration-200 
            ${showFavoritesOnly ? "bg-blue-500 text-white hover:bg-blue-600" : "border-gray-300 hover:bg-gray-200"}`}
          sx={{
            padding: "6px 12px",
            fontWeight: "bold",
          }}
        >
          {showFavoritesOnly ? "All Images" : "Favorites"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : displayedItems.length === 0 ? (
        <p className="text-center py-10 text-gray-600">No images found</p>
      ) : (
        <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 px-12 sm:px-20 items-center justify-center">
          {displayedItems.map((item, index) => {
            const isFavorite = favorites.includes(item.image);
            return (
              <div
                key={index}
                className="relative w-64 max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition duration-300 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="h-48 w-full overflow-hidden rounded-t-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={`Generated image ${index}`}
                  />
                </div>
                <div className="px-2 py-2 flex justify-between items-center gap-2">
                  <Button
                    startIcon={<Download />}
                    onClick={(e) => handleDownload(e, item.image)}
                    className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200 px-4"
                  >
                    Download
                  </Button>
                  <Button
                    startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={() => handleToggleFavorite(item.image)}
                    className="hover:text-red-500 transition duration-200"
                  >
                    Favorite
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
