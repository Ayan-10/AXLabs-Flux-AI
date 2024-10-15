import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, images } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid userId" });
    }

    try {
      // Find the user in the database
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the user has enough image credits
      if (user.imageCredits <= 0) {
        return res.status(400).json({ error: "Insufficient image credits" });
      }

      // Decrement image credits by 1
      await prisma.user.update({
        where: { id: userId },
        data: {
          imageCredits: {
            decrement: images,
          },
        },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating image credits:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
