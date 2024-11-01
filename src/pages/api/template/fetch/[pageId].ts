import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pageId } = req.query;

  if (typeof pageId !== "string") {
    return res.status(400).json({ error: "Invalid pageId parameter" });
  }

  try {
    const template = await prisma.templatePlayground.findUnique({
      where: { pageId },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.status(200).json({ template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
