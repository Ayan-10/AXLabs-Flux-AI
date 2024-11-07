import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable"; // Correct import for formidable
import JSZip from "jszip";
import { Prisma } from "@prisma/client";

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
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error parsing form" });
      }

      const userId = Array.isArray(fields.userId)
        ? fields.userId[0]
        : fields.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId as string },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (user?.modelCredits < 1) {
        return res.status(402).json({
          message: "Don't have enough credits left",
        });
      }
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const uploadedFiles = Object.values(files)[0]; // Get uploaded files
      // Ensure uploadedFiles is an array
      if (
        !uploadedFiles ||
        (Array.isArray(uploadedFiles) && uploadedFiles.length < 10)
      ) {
        return res
          .status(400)
          .json({ message: "Please upload at least 10 files." });
      }

      // Check that userId is defined
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Invalid userId." });
      }

      if (!name || typeof name !== "string") {
        return res.status(400).json({ message: "Invalid name" });
      }
      // Ensure at least 10 files are uploaded
      if (uploadedFiles.length < 10) {
        return res
          .status(400)
          .json({ message: "Please upload at least 10 files." });
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
            return {
              url: uploadResponse.secure_url, // Store the URL
              original_filename: uploadResponse.original_filename, // Original file name
              format: uploadResponse.format, // File format (e.g., jpg, png)
            };
          })
        );

        const zip = new JSZip();
        // uploadedImages.forEach((imageUrl, index) => {
        //   zip.file(`image-${index}.jpg`, imageUrl);
        // });
        await Promise.all(
          uploadedImages.map(async (image) => {
            const response = await fetch(image.url);
            const arrayBuffer = await response.arrayBuffer(); // Get the binary data as ArrayBuffer
            const imageName = `${image.original_filename}.${image.format}`;
            zip.file(imageName, Buffer.from(arrayBuffer)); // Add the image content to the zip
          })
        );

        // Generate the zip as a buffer
        // const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        // // Save the exact zip file locally before sending it to the API
        // const zipFilePath = path.join(
        //   process.cwd(),
        //   `./public/training_${name}.zip`
        // );
        // fs.writeFileSync(zipFilePath, zipBuffer);
        // // console.log(`Exact zip file saved at: ${zipFilePath}`);

        // // Convert the buffer to base64 and create the data URL format
        // const zipBase64 = zipBuffer.toString("base64");
        // const zipDataUrl = `data:zip;base64,${zipBase64}`;

        // // Save the base64 zip content for debugging
        // const base64FilePath = path.join(
        //   process.cwd(),
        //   `./public/training_${name}_base64.txt`
        // );
        // fs.writeFileSync(base64FilePath, zipDataUrl);
        // // console.log(`Base64 zip content saved at: ${zipDataUrl}`);

        // const { request_id } = await fal.queue.submit(
        //   "fal-ai/flux-lora-fast-training",
        //   {
        //     input: {
        //       images_data_url: zipDataUrl as string, // Pass the base64 data URL
        //     },
        //     webhookUrl: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/webhook`, // Set your webhook URL
        //   }
        // );
        console.log(uploadedImages.length);
        const response = await fetch("https://api.astria.ai/tunes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tune: {
              title: `${userId.substring(5)?.concat(" " + name)}`,
              base_tune_id: 1504944, // Example base tune ID
              model_type: "lora",
              name: userId.substring(5)?.concat(" " + name),
              image_urls: uploadedImages.map((image) => image.url),
              callback: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/training/webhook?userId=${userId}&userEmail=${user.email}`,
            },
          }),
        });

        const data = await response.json();
        console.log(data);

        // Store the training data in MongoDB using Prisma
        const training = await prisma.training.create({
          data: {
            userId: userId,
            images: uploadedImages.map((image) => image.url),
            name: name,
            triggerWord: userId.substring(5)?.concat(" " + name.toLowerCase()),
            tuneId: String(data.id), // Store request_id to track status
            token: String(data.token),
          },
        });

        await removeCredits(userId as string, 1, 0);

        return res.status(200).json({
          message: "Training data uploaded successfully",
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Check if the error is a unique constraint violation
          console.log("erro");
          console.log(error);
          if (error.code === "P2002") {
            return res.status(409).json({
              success: false,
              message: "Duplicate name, please choose a different name.",
            });
          } else {
            return res.status(500).json({
              message: "Failed to upload files or save training data",
            });
          }
        } else {
          return res.status(500).json({
            message: "Failed to upload files or save training data",
          });
        }
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export async function removeCredits(
  userId: string,
  models: number,
  images: number
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      modelCredits: {
        decrement: models,
      },
      imageCredits: {
        decrement: images,
      },
    },
  });
}
