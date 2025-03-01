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
import { Check, Sparkles, Zap } from "lucide-react";
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
  highlight?: string[];
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
    highlight: ["100 AI photo generations"],
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
    highlight: ["500 AI photo generations", "Commercial usage rights"],
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
    highlight: ["1,000 AI photo generations", "10 AI model trainings"],
    billing: "/month",
    paymentLink: process.env.STRIPE_ELITE_PLAN_LINK,
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="flex justify-center w-full py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950"
    >
      <div className="w-[90%] md:container md:max-w-[1200px]">
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-20">
          <Badge variant="outline" className="py-1.5 px-4 border-primary/20 bg-primary/5 text-primary font-medium rounded-full mb-4 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Flexible Plans
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Choose Your <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Perfect Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the ideal package for your AI photography needs with no hidden fees or commitments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {pricingList.map((plan) => (
            <Card 
              key={plan.title} 
              className={`flex flex-col border-2 card-hover transition-all duration-300 ${
                plan.popular === PopularPlanType.YES 
                  ? "border-primary/50 shadow-lg shadow-primary/20" 
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <CardHeader className={`pb-8 ${plan.popular === PopularPlanType.YES ? "bg-primary/5 dark:bg-primary/10" : ""}`}>
                {plan.popular === PopularPlanType.YES && (
                  <Badge className="w-fit bg-primary hover:bg-primary text-white mb-2">Most Popular</Badge>
                )}
                <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                <CardDescription className="text-md">{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    {plan.billing}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mt-2 space-y-3">
                  {plan.benefitList.map((benefit) => (
                    <div key={benefit} className="flex items-start">
                      <div className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full ${
                        plan.highlight?.includes(benefit) 
                          ? "bg-primary text-white" 
                          : "bg-primary/10 text-primary"
                      }`}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className={`text-sm ${
                        plan.highlight?.includes(benefit) 
                          ? "font-medium" 
                          : ""
                      }`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4">
                {plan.paymentLink ? (
                  <PaymentLink
                    variant={plan.popular === PopularPlanType.YES ? "default" : "outline"}
                    className={`w-full rounded-full font-medium ${
                      plan.popular === PopularPlanType.YES 
                        ? "shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    paymentLink={plan.paymentLink}
                  >
                    {plan.buttonText}
                    {plan.popular === PopularPlanType.YES && <Zap className="ml-2 h-4 w-4" />}
                  </PaymentLink>
                ) : (
                  <Link
                    href="#"
                    className={buttonVariants({
                      variant: plan.popular === PopularPlanType.YES ? "default" : "outline",
                      className: `w-full rounded-full font-medium ${
                        plan.popular === PopularPlanType.YES 
                          ? "shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    })}
                  >
                    {plan.buttonText}
                    {plan.popular === PopularPlanType.YES && <Zap className="ml-2 h-4 w-4" />}
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include access to our basic features. Need something custom?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact us
            </Link>
            {" "}for enterprise solutions.
          </p>
        </div>
      </div>
    </section>
  );
};
