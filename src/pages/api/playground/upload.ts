import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";

type Image = {
  url: string; // Define the structure of each image object
};

type RequestBody = {
  userId: string;
  prompt: string;
  finalPrompt: string;
  negativePrompt: string;
  numImages: number;
  tuneId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("req.body");

    const {
      userId,
      prompt,
      finalPrompt,
      negativePrompt,
      numImages,
      tuneId,
    }: RequestBody = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
    });

    if (user?.imageCredits < numImages) {
      return res.status(402).json({
        message: "Don't have enough credits left",
      });
    }

    const form = new FormData();
    form.append("prompt[text]", finalPrompt);
    // form.append("prompt[negative_prompt]", negativePrompt);
    form.append("prompt[num_images]", numImages.toString()); // Append number of images
    form.append(
      "prompt[callback]",
      `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/playground/webhook?userId=${userId}`
    );

    console.log(tuneId + " tuneid");
    const response = await fetch(
      `https://api.astria.ai/tunes/${tuneId}/prompts`,
      {
        method: "POST",
        headers: {
          // "Access-Control-Allow-Origin": "https://localhost:3000",

          Authorization: `Bearer ${process.env.FAL_KEY}`, // Add your API key here
        },
        body: form,
      }
    );

    // Try to parse JSON if the response body is not empty
    const contentType = response.headers.get("content-type");
    const resultText = await response.text();
    console.log("Non-JSON Response:", resultText);

    let result: any;
    try {
      result = JSON.parse(resultText);
    } catch (error) {
      console.error("Failed to parse response text as JSON:", error);
      return res.status(500).json({ message: "Invalid response format" });
    }

    const { id } = result;
    console.log(result);

    const dataToInsert = {
      userId: userId,
      name: prompt,
      prompt: finalPrompt,
      negativePrompt: negativePrompt,
      requestId: `${id}`, // Astria AI ID
    };
    // console.log(dataToInsert);

    const savedData = await prisma.play.create({
      data: dataToInsert,
    });

    await removeCredits(userId as string, 0, numImages);

    console.log("req.body" + savedData);
    return res.status(200).json({
      message: "Data uploaded successfully",
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
  // if (req.method === "POST") {

  //   const { userId, name, prompt, images }: RequestBody = req.body;
  //   try {
  //     const user = await prisma.user.findUnique({ where: { id: userId } });

  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     // Check if the user has enough image credits
  //     if (user.imageCredits < images.length) {
  //       return res.status(400).json({ message: "Insufficient image credits" });
  //     }

  //     // Store the training data in MongoDB using Prisma
  //     const play = await prisma.play.create({
  //       data: {
  //         userId: userId,
  //         images: images.map((image) => image.url),
  //         name: name,
  //         prompt: prompt,
  //       },
  //     });
  //     console.log(images.length)
  //     await removeCredits(userId as string, 0, 1);

  //     return res.status(200).json({
  //       message: "Data uploaded successfully",
  //     });
  //   } catch (error: unknown) {
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       // Check if the error is a unique constraint violation
  //       console.log("erro");
  //       console.log(error);
  //       if (error.code === "P2002") {
  //         return res.status(409).json({
  //           success: false,
  //           message: "Duplicate name, please choose a different name.",
  //         });
  //       } else {
  //         return res.status(500).json({
  //           message: "Failed to upload files or save training data",
  //         });
  //       }
  //     } else {
  //       return res.status(500).json({
  //         message: "Failed to upload files or save training data",
  //       });
  //     }
  //   }
  // } else {
  //   res.status(405).json({ message: "Method not allowed" });
  // }
}

export async function removeCredits(
  userId: string,
  models: number,
  images: number
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      modelCredits: {
        decrement: models,
      },
      imageCredits: {
        decrement: images,
      },
    },
  });
}
