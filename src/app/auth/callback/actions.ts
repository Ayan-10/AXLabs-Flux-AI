"use server";

import prisma from "@/db/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function checkAuthStatus() {
  const { userId, redirectToSignIn } = await auth();

  // console.log(userId)
  // if (!userId) return redirectToSignIn();

    const user = await currentUser();

  if (!user?.id) return { success: false };

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // sign up
  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: user?.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
        image: user.imageUrl,
      },
    });
  }

  return {
    success: true,
    user_id: user.id,
    email: user.emailAddresses[0].emailAddress,
    first_name: user.firstName,
    last_name: user.lastName,
  };
}
