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
  billing: string;
  paymentLink?: string;
}

const pricingList: PricingProps[] = [
  {
    title: "Starter",
    popular: PopularPlanType.NO,
    price: 19,
    description: "Perfect for trying out AI photos",
    buttonText: "Get Started",
    benefitList: [
      "100 AI photo generations",
      "1 AI model training",
      "Hyper-realistic photos",
      "Medium-quality images",
      "Personal use license",
    ],
    billing: "/month",
    paymentLink: process.env.STRIPE_STARTER_PLAN_LINK,
  },
  {
    title: "Pro",
    popular: PopularPlanType.YES,
    price: 39,
    description: "Best for creators and professionals",
    buttonText: "Get Pro",
    benefitList: [
      "500 AI photo generations",
      "3 AI model trainings",
      "Hyper-realistic photos",
      "High-quality images",
      "Priority support",
      "Commercial usage rights",
    ],
    billing: "/month",
    paymentLink: process.env.STRIPE_PRO_PLAN_LINK,
  },
  {
    title: "Elite",
    popular: PopularPlanType.NO,
    price: 99,
    description: "For agencies and power users",
    buttonText: "Go Elite",
    benefitList: [
      "1,000 AI photo generations",
      "10 AI model trainings",
      "Hyper-realistic photos",
      "High-quality images",
      "Priority support",
      "Commercial usage rights",
    ],
    billing: "/month",
    paymentLink: process.env.STRIPE_ELITE_PLAN_LINK,
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="flex justify-center w-full py-8 sm:py-12"
    >
      <div className="w-[90%] md:container md:max-w-[1200px]">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Pay Once, Lifetime Access
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Choose the perfect plan for your AI photography needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-8 items-stretch">
          {pricingList.map((pricing: PricingProps) => (
            <div
              key={pricing.title}
              className={`relative rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex flex-col justify-between ${
                pricing.popular === PopularPlanType.YES
                  ? "ring-2 ring-purple-500 dark:ring-purple-400"
                  : ""
              }`}
            >
              {pricing.popular === PopularPlanType.YES && (
                <div className="absolute -top-4 sm:-top-5 left-0 right-0 mx-auto w-28 sm:w-32">
                  <div className="text-center py-1 px-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs sm:text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{pricing.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    {pricing.description}
                  </p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-bold">
                    ${pricing.price}
                  </span>
                  <span className="text-sm sm:text-base text-muted-foreground ml-1">
                    {pricing.billing}
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {pricing.benefitList.map((benefit: string) => (
                    <div key={benefit} className="flex items-center">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <PaymentLink
                  text={pricing.buttonText}
                  paymentLink={pricing.paymentLink}
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-center text-sm sm:text-base font-medium transition-colors ${
                    pricing.popular === PopularPlanType.YES
                      ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
