import prisma from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const userId = req.query.userId;
    const status = req.query.status;

    if (Array.isArray(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "userId must be a string" });
    }
    try {
      if (status) {
        const trainingData = await prisma.training.findMany({
          where: { userId: userId, status: status }, // Adjust based on your schema
        });
        console.log(trainingData)
        res.status(200).json(trainingData);
      } else {

        const trainingData = await prisma.training.findMany({
          where: { userId: userId }, // Adjust based on your schema
        });
        res.status(200).json(trainingData);
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching training data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
