import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId, status } = req.query; // Get userId from request (adjust as needed)
console.log("ytd")
console.log(userId);
console.log(status);


    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const models = await prisma.training.findMany({
        where: {
          userId: String(userId),
          status: status as string,
        },
        select: {
          name: true,
          triggerWord: true,
          tuneId: true,
          token: true,
        },
      });
      console.log(models)
      return res.status(200).json(models);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch models" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
