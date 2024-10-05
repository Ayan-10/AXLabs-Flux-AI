import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import prisma from "@/db/prisma";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable"; // Correct import for formidable

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // console.log(req.body)
    const form = new IncomingForm();

    // if (!files || files.length < 10) {
    //     console.log("no hi");
    //   return res
    //     .status(400)
    //     .json({ error: "Please upload at least 10 files." });
    // }

    //     const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error parsing form" });
      }

      const userId = Array.isArray(fields.userId)
        ? fields.userId[0]
        : fields.userId;
      const uploadedFiles = Object.values(files)[0]; // Get uploaded files
      console.log(userId)

      // Ensure at least 10 files are uploaded
      if (uploadedFiles.length < 10) {
        return res
          .status(400)
          .json({ error: "Please upload at least 10 files." });
      }
      try {
        // Upload files to Cloudinary
        const uploadedImages = await Promise.all(
          uploadedFiles.map(async (file) => {
            const uploadResponse = await cloudinary.uploader.upload(
              file.filepath,
              {
                folder: "training_images",
              }
            );
            return uploadResponse.secure_url;
          })
        );
        console.log(uploadedImages.length);
        // Store the training data in MongoDB using Prisma
        const training = await prisma.training.create({
          data: {
            userId: userId,
            images: uploadedImages,
          },
        });

        res.status(200).json({ message: "Files uploaded successfully", training });
      } catch (error) {
        console.error("Error uploading files: ", error);
        res
          .status(500)
          .json({ error: "Failed to upload files or save training data" });
      }
    });
  }
  console.log("hi");
  return res.status(200).json({ message: "Hello from Next.js!" });
}
