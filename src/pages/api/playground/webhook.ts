import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);

  if (req.method === "POST") {
    const { prompt, images } = req.body;
    const { userId } = req.query;
    if (Array.isArray(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "userId must be a string" });
    }
    // try {
    //   // Extract tune_id from request body
    const tuneId = prompt.id;
    try {
      //   // Find the training in MongoDB with the tune_id and user_id
      const training = await prisma.play.findFirst({
        where: {
          requestId: String(tuneId),
          userId: userId,
        },
      });

      if (!training) {
        return res.status(404).json({ error: "Training not found" });
      }

      //   // Update the training status to 'completed'
      await prisma.play.update({
        where: { id: training.id },
        data: { status: "COMPLETED", images: prompt.images },
      });

      // Send a success response
      res.status(200).json({ message: "Training status updated to completed" });
    } catch (error) {
      console.error("Error updating training status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
