import Image from "next/image";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Camera, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
	return (
		<div className="hero-section relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
				<div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-32 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
			</div>
			
			<section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 relative z-10">
				<div className="text-center lg:text-start space-y-8">
					<div className="inline-block bg-white/90 dark:bg-gray-900/90 rounded-full px-4 py-1.5 text-sm font-medium text-primary border border-purple-100 dark:border-gray-800 shadow-md">
						<span className="flex items-center gap-1">
							<Sparkles className="h-4 w-4" />
							AI-Powered Photo Generation
						</span>
					</div>
					
					<main className="space-y-4">
						<h1 className="text-5xl md:text-6xl font-bold tracking-tight">
							<span className="bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text">
								Create Amazing Photos
							</span>
						</h1>
						<h2 className="text-4xl md:text-5xl font-bold">
							With Your Personal AI Photographer
						</h2>
					</main>

					<p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0 text-balance leading-relaxed">
						Generate stunning, personalized photos using our advanced AI models. 
						Perfect for social media, professional profiles, or creative projects.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
						<Link href="/playground" className={buttonVariants({
							size: "lg",
							className: "rounded-full font-medium shadow-lg gap-2 group"
						})}>
							Start Creating <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>

						<Link href="/gallery" className={buttonVariants({
							variant: "outline",
							size: "lg",
							className: "rounded-full font-medium border-2 group"
						})}>
							Explore Gallery <Camera className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
						</Link>
					</div>
					
					<div className="pt-4">
						<div className="flex items-center justify-center lg:justify-start -space-x-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
									<Image 
										src={`https://i.pravatar.cc/100?img=${i+20}`} 
										width={40} 
										height={40} 
										alt="User" 
										className="w-full h-full object-cover"
									/>
								</div>
							))}
							<div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-primary flex items-center justify-center text-white text-xs font-medium">
								+2K
							</div>
						</div>
						<p className="text-sm text-muted-foreground mt-2 text-center lg:text-left">
							Trusted by thousands of users worldwide
						</p>
					</div>
				</div>

				<div className="relative z-10 w-full max-w-md mx-auto lg:mx-0">
					<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
					<div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
						<Image
							src="/hero.png"
							width={600}
							height={400}
							alt="AI generated photos"
							className="w-full h-auto rounded-t-lg"
						/>
						<div className="p-5">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">AI Photo Session</h3>
								<span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Professional</span>
							</div>
							<div className="grid grid-cols-4 gap-2">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
										<div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
