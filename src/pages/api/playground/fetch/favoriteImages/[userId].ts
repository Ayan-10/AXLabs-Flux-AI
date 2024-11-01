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
    const favoriteRecord = await prisma.favoriteImages.findUnique({
      where: { userId: String(userId) },
      // orderBy: {
      //   createdAt: "desc", // Order by createdAt in descending order
      // },
    });
      // Flatten array of image arrays
      const images = favoriteRecord?.favoriteImages || [];
      console.log(images);

      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch images" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
