import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId as string },
      });
      res
        .status(200)
        .json({
          imageCredits: user?.imageCredits,
          modelCredits: user?.modelCredits,
        });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch training count" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
