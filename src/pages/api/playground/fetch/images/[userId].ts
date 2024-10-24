import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid userId" });
    }

    try {
      const userImages = await prisma.play.findMany({
        where: { userId },
        select: {
          images: true, // fetch only images field
        },
      });
      // Flatten array of image arrays
      const images = userImages.flatMap((play) => play.images);
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch images" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
