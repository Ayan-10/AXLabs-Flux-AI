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
import { redirect } from "next/navigation";
import { checkAuthStatus } from "@/app/auth/callback/actions";

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
    <div className="ml-0 md:ml-[68px] px-4 md:px-0">
      {/* Header Section */}
      <div className="px-4 md:px-20 pt-6 md:pt-10">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
            Your Generated Images
          </p>
          <Button
            startIcon={showFavoritesOnly ? <Favorite /> : <FavoriteTwoTone />}
            variant="outlined"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="text-sm transition duration-200 h-9 md:h-10 rounded-[8px]"
            sx={{
              color: showFavoritesOnly ? "white" : "#6366F1",
              backgroundColor: showFavoritesOnly ? "#6366F1" : "transparent",
              borderColor: showFavoritesOnly ? "#7C3AED" : "#D1D5DB",
              "&:hover": {
                backgroundColor: showFavoritesOnly ? "#4F46E5" : "#E5E7EB",
              },
            }}
          >
            {showFavoritesOnly ? "All Images" : "Favorites"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader className="w-10 h-10 md:w-12 md:h-12 animate-spin text-primary" />
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-center py-10 text-gray-600">No images found</p>
        </div>
      ) : (
        /* Image Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-6 md:py-10 px-4 md:px-20">
          {displayedItems.map((item, index) => {
            const isFavorite = favorites.includes(item.image);
            return (
              <div
                key={index}
                className="relative w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition duration-300 dark:bg-gray-800 dark:border-gray-700"
              >
                {/* Image Container */}
                <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={`Generated image ${index}`}
                    loading="lazy"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="px-2 py-2 flex justify-between items-center gap-2">
                  <Button
                    startIcon={<Download />}
                    onClick={(e) => handleDownload(e, item.image)}
                    className="bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200 px-3 md:px-4 text-xs md:text-sm"
                    size="small"
                  >
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button
                    startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={() => handleToggleFavorite(item.image)}
                    className="hover:text-red-500 transition duration-200 text-indigo-500 px-2 md:px-3 text-xs md:text-sm"
                    size="small"
                  >
                    <span className="hidden sm:inline">Favorite</span>
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
