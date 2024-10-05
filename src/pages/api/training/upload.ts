import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { IncomingForm } from "formidable";


export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // console.log(req.body)
        const form = new IncomingForm()

        // if (!files || files.length < 10) {
        //     console.log("no hi");
        //   return res
        //     .status(400)
        //     .json({ error: "Please upload at least 10 files." });
        // }

//     const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error parsing form" });
      }

      const { userId } = fields;

      try {
        // Upload files to cloud storage (or MongoDB GridFS) and get URLs
        const uploadedImages: string[] = [];

        for (const file of Object.values(files)) {
          // Upload each file to Cloudinary (or alternative)
          console.log(file.filepath);
        }

        // Save the training data to MongoDB via Prisma
        

        return res.status(200).json({ success: true});
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error saving training data", error });
      }
    });
  }
console.log('hi')
  return res.status(200).json({ message: "Hello from Next.js!" });
}
