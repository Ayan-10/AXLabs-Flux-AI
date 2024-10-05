import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

export const config = {
    api:{
        bodyParser: false
    }
}
export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    if( req.method === 'POST'){
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
        });
    }
    return  res.status(200).json({ message: "Hello from Next.js!" });

}