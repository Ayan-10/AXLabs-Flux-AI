import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { tune } = req.body;
    const { userId, userEmail } = req.query;
    if (Array.isArray(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "userId must be a string" });
    }
    try {
      // Extract tune_id from request body
      const tuneId = tune.id;
      // Find the training in MongoDB with the tune_id and user_id
      const training = await prisma.training.findFirst({
        where: {
          tuneId: String(tuneId),
          userId: userId,
        },
      });

      if (!training) {
        return res.status(404).json({ error: "Training not found" });
      }

      // Update the training status to 'completed'
      await prisma.training.update({
        where: { id: training.id },
        data: { status: "COMPLETED" },
      });

      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: `${process.env.EMAIL_FROM}`,
        to: [`${userEmail}`],
        subject: `${process.env.EMAIL_SUBJECT}`,
        html: `<p>Congratulations! Your training for ${training.name} is now complete. You can check the results on <a href="${process.env.KINDE_SITE_URL}/models">coolaiphoto.com</a>.</p>`,
      });

      console.log(data);
      console.log(error);

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
