import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, image, favorite } = req.body;

    try {
      const favoriteRecord = await prisma.favoriteImages.upsert({
        where: { userId },
        create: { userId, favoriteImages: favorite ? [image] : [] },
        update: {
          favoriteImages: favorite
            ? { push: image }
            : {
                set:
                  (
                    await prisma.favoriteImages.findUnique({
                      where: { userId },
                    })
                  )?.favoriteImages.filter((img) => img !== image) || [],
              },
        },
      });
      res.status(200).json(favoriteRecord);
    } catch (error) {
      res.status(500).json({ error: "Error toggling favorite image" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
