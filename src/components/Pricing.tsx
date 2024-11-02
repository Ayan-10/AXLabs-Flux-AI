import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import PaymentLink from "./PaymentLink";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
  href: string;
  billing: string;
  paymentLink?: string;
}

const pricingList: PricingProps[] = [
  {
    title: "Free",
    popular: 0,
    price: 0,
    description: "for starters",
    buttonText: "Get Started",
    benefitList: ["2 AI Image Generations", "0 Model Training Credits"],
    href: "/api/auth/login",
    paymentLink: process.env.STRIPE_STARTER_PLAN_LINK,
    billing: "/month",
  },
  {
    title: "Pro",
    popular: 1,
    price: 19,
    description: "for enthusiasts",
    buttonText: "Subscribe",
    benefitList: [
      "100 AI Image Generations",
      "1 Model Training Credits",
      "Priority support",
      "Medium Quality Photos",
      "Commercial use license",
    ],
    href: "/api/auth/login",
    paymentLink: process.env.STRIPE_PRO_PLAN_LINK,
    billing: "/month",
  },
  {
    title: "Elite",
    popular: 0,
    price: 39,
    description: "for creators",
    buttonText: "Subscribe",
    benefitList: [
      "500 AI Image Generations",
      "3 Model Training Credits",
      "Upto 10 pages",
      "Priority support",
      "Highest Quality Photos",
      "Commercial use license",
    ],
    href: "/api/auth/login",
    paymentLink: process.env.STRIPE_ELITE_PLAN_LINK,
    billing: "/year",
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      {/* <h2 className='text-3xl md:text-4xl font-bold text-center'>
				Get
				<span className='bg-gradient-to-b from-[#667EEA] to-[#764BA2] uppercase text-transparent bg-clip-text'>
					{" "}
					Unlimited{" "}
				</span>
				Access
			</h2>
			<h3 className='text-xl text-center text-muted-foreground pt-4 pb-8'>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias reiciendis.
			</h3> */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={`transition-transform duration-300 ease-in-out ${
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 transform scale-105"
                : "hover:shadow-lg"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground">{pricing.billing}</span>
              </div>
              <CardDescription className="text-gray-600">
                {pricing.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="inline-flex items-center justify-center w-full">
              <PaymentLink
                href={pricing.href}
                text={pricing.buttonText}
                paymentLink={pricing.paymentLink}
              />
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className="flex items-center">
                    <Check className="text-purple-500" />
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
