import crypto from "crypto";
import prisma from "@/db/prisma";

export async function POST(req: Request) {
  try {
    // Catch the event type
    const clonedReq = req.clone();
    const eventType = req.headers.get("X-Event-Name");
    const body = await req.json();

    // Check signature
    const secret = process.env.STRIPE_WEBHOOK_SECRET as string;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(
      hmac.update(await clonedReq.text()).digest("hex"),
      "utf8"
    );
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    console.log(body);
    console.log(body.data.attributes.first_order_item);
    // Logic according to event
    if (eventType === "order_created") {
      //   const userId: string = body.meta.custom_data.user_id;
      const isSuccessful = body.data.attributes.status === "paid";
      const userEmail = body.data.attributes.user_email;
      const priceId : string = body.data.attributes.first_order_item.product_id;

      if (isSuccessful) {
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });
        if (!user) throw new Error("User not found");
        
    console.log("YO");
        console.log(user.id);
        console.log("Yu");
         console.log(priceId);
        console.log(" Yi ");
        console.log(process.env.STRIPE_STARTER_PRICE_ID);
        console.log("si "+" "+(priceId  as string === process.env.STRIPE_STARTER_PRICE_ID as string));

        if (priceId as string === process.env.STRIPE_STARTER_PRICE_ID as string ) {
          await addCredits(user.id, 1, 2); // 1 model, 2 images for Starter
        } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          await addCredits(user.id, 2, 4); // 2 models, 4 images for Pro
        } else if (priceId === process.env.STRIPE_ELITE_PRICE_ID) {
          await addCredits(user.id, 3, 6); // 3 models, 6 images for Elite
        }
      } else {
        return Response.json({ message: "Payment Failed" });
      }
    }

    return Response.json({ message: "Webhook received" });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

async function addCredits(userId: string, models: number, images: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      modelCredits: {
        increment: models,
      },
      imageCredits: {
        increment: images,
      },
    },
  });
}
