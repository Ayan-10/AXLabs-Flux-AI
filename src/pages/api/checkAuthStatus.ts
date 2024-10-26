// /pages/api/checkAuthStatus.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return res.status(200).json({ success: false });
  }

  return res.status(200).json({ success: true });
}
