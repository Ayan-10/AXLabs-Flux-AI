import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";

type Image = {
  url: string; // Define the structure of each image object
};

type RequestBody = {
  userId: string;
  name: string;
  prompt: string;
  images: Image[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, name, prompt, images }: RequestBody = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user has enough image credits
      if (user.imageCredits < images.length) {
        return res.status(400).json({ message: "Insufficient image credits" });
      }

      // Store the training data in MongoDB using Prisma
      const play = await prisma.play.create({
        data: {
          userId: userId,
          images: images.map((image) => image.url),
          name: name,
          prompt: prompt,
        },
      });
      await removeCredits(userId as string, 0, 1);

      return res.status(200).json({
        message: "Data uploaded successfully",
      });
    } catch (error: unknown) {
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
