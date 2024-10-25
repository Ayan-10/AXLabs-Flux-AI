import { useState } from "react";

function ImageCard({ src }: { src: string }) {
  const [hover, setHover] = useState(false);

  // const handleDownload = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent click from opening the image in a new tab
  //   const link = document.createElement("a");
  //   link.href = src;
  //   link.download = "image.jpg"; // You can customize the image name here
  //   link.click();
  // };

  const openInNewTab = () => {
    window.open(src, "_blank");
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={openInNewTab}
    >
      <img src={src} alt="image" className="w-full h-auto" />

      {hover && (
        <button
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded"
          onClick={openInNewTab}
        >
          Download
        </button>
      )}
    </div>
  );
}

export default ImageCard;
