'use client';
import { useEffect, useRef, } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Cursor from '@/components/CanvasWrapper';
import Link from "next/link";
import Scene from "@/components/Scene";



export default function Home() {
    const textRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window !== undefined) {
            const textSpans = textRef.current?.querySelectorAll("span");

            const handleMouseMove = (event: MouseEvent) => {
                const { clientX, clientY } = event;

                if (textSpans) {
                    textSpans.forEach((span) => {
                        const spanRect = span.getBoundingClientRect();
                        const spanCenterX = spanRect.left + spanRect.width / 2;
                        const spanCenterY = spanRect.top + spanRect.height / 2;

                        const distance = Math.sqrt(
                            Math.pow(clientX - spanCenterX, 2) + Math.pow(clientY - spanCenterY, 2)
                        );

                        // Animate spans within a certain distance
                        if (distance < 100) {
                            gsap.to(span, {
                                scale: 1.5,
                                color: "#00f2ff",
                                textShadow: "0px 0px 10px rgba(0, 242, 255, 0.8)",
                                duration: 0.4,
                                ease: "power3.out",
                            });
                        } else {
                            gsap.to(span, {
                                scale: 1,
                                color: "white",
                                textShadow: "none",
                                duration: 0.4,
                                ease: "power3.out",
                            });
                        }
                    });
                }
            };

            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
            };
        }
    }, []);


    return (
        <div className="font-sans relative">
            <Cursor />
            {/* Header Section */}
            <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
                {/* Logo in the Top Left Corner */}
                <div className="flex justify-between">
                    <div className="absolute top-6 left-6">
                        <Image src="/logo.png" alt="Logo" width={82} height={82} />
                    </div>
                    {/* About Us Button */}
                    <Link
                        href="/about-us"
                        className="text-xl absolute top-6 right-6 cursor-pointer text-gray-300 font-bold py-2 px-6 bg-transparent hover:text-[#6ee7b7] hover:underline transition-all duration-300"
                    >
                        About Us
                    </Link>
                </div>
                {/* Main Content */}
                <div className="text-center">
                    <h1
                        className="text-5xl md:text-8xl font-extrabold mb-4 tracking-wide cursor-pointer"
                        ref={textRef}
                    >
                        {"GnomeVille".split("").map((char, index) => (
                            <span
                                key={index}
                                className="inline-block transition-all duration-300"
                            >
                                {char}
                            </span>
                        ))}
                    </h1>
                    <p className="text-lg md:text-2xl mb-8">
                        Exploring the Frontier of Fun
                    </p>
                    {/* <div className="mt-10">
                        <a href="#our-work" className="text-white text-lg uppercase tracking-widest hover:underline">
                            OUR WORK →
                        </a>
                    </div> */}
                </div>
            </div>

            {/* Section 1 */}
            <Scene />

            {/* Footer Section */}
            <footer className="bg-black text-white py-12 flex items-start w-full flex-col  px-12">
                <div className="w-full mb-6 flex justify-between">
                    {/* Social Media Links */}
                    <div className="flex justify-center space-x-6 mb-4">
                        {/* Twitter Link */}
                        <a href="#" rel="noopener noreferrer">
                            <Image
                                src="/twitter.svg"
                                alt="Logo"
                                width={42}
                                height={42}
                                className="mx-auto"
                            />
                        </a>

                        {/* LinkedIn Link */}
                        <a href="#" rel="noopener noreferrer">
                            <Image
                                src="/linkedin.svg"
                                alt="Logo"
                                width={38}
                                height={38}
                                className="mx-auto"
                            />
                        </a>

                        {/* Medium Link */}
                        <a href="#" rel="noopener noreferrer">
                            <Image
                                src="/medium.svg"
                                alt="Logo"
                                width={38}
                                height={38}
                                className="mx-auto"
                            />
                        </a>
                    </div>


                    <p className="text-sm text-gray-400">
                        Copyright &copy; {new Date().getFullYear()} Gnome Labs LLC. All rights reserved.
                    </p>
                </div>

                {/* Footer Text */}
                {/* <div className="text-end">
                    <p className="text-sm text-gray-400">
                        Copyright &copy; {new Date().getFullYear()} Gnome Labs LLC. All rights reserved.
                    </p>
                </div> */}
            </footer>
        </div>
    );
}
