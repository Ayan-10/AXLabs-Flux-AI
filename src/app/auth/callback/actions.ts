"use server";

import prisma from "@/db/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function checkAuthStatus() {
  const session = await getSession();
  const user = session?.user;
  if (!user) return { success: false };

  console.log("uyf")
  console.log(user)

  const existingUser = await prisma.user.findUnique({ where: { id: user.sid } });

  // sign up
  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: user.sid,
        email: user.email!,
        name: user.given_name + " " + user.family_name,
        image: user.picture,
      },
    });
  }

  return {
    success: true,
    user_id: user.id,
    email: user.email,
    first_name: user.given_name,
    last_name: user.family_name,
  };
}
