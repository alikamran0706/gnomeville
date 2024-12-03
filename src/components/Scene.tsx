import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const collapseRef = useRef<(HTMLDivElement | null)[]>([]); // Array of refs for collapsible sections
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([]); // Array of div refs for sections

    const sections = [
        {
            title: "Morpheus",
            description: "Creating immersive gaming experiences tailored for all platforms.",
            href: "https://github.com/GnomeLabsLLC/MorpheusUnitySDK"
        },
        {
            title: "Gnomeville",
            description:
                "Experts in developing mixed reality games and experiences for Apple Vision Pro, Meta, Pico, and other XR hardware.",
            link: "/gnome"
        },
    ];

    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
        const section = collapseRef.current[index];
        if (section)
            gsap.to(section.querySelector(".description"), {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
            });
    };

    const handleMouseLeave = (index: number) => {
        setActiveIndex(null);
        const section = collapseRef.current[index];
        if (section)
            gsap.to(section.querySelector(".description"), {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power3.out",
            });
    };

    useEffect(() => {
        sectionsRef.current?.forEach((section) => {
            // Animate sections turning black and restoring color on scroll
            gsap.to(section, {
                backgroundColor: "black",
                color: "white",
                scrollTrigger: {
                    trigger: section,
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                    onLeaveBack: () => {
                        gsap.to(section, { backgroundColor: "", color: "" });
                    },
                },
            });
        });
    }, []);

    return (
        <div
            ref={(el: HTMLDivElement | null) => { sectionsRef.current[0] = el; }}
            className=" bg-pink-500"
        >
            {/* Collapsible Section */}
            <div className="min-h-screen flex p-14">
                <div className="w-full mx-auto space-y-4">
                    {sections.map((section, index) => {
                        const isInternalLink = section.link && section.link.startsWith('/');

                        const linkContent = (
                            <div
                                ref={(el: HTMLDivElement | null) => { collapseRef.current[index] = el; }}
                                className="border-t border-gray-300 overflow-hidden cursor-pointer py-4"
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                            >
                                <h2
                                    className={`text-5xl md:text-7xl font-bold ${activeIndex === index ? "text-[#6ee7b7]" : "text-white"
                                        }`}
                                >
                                    {section.title}
                                </h2>
                                <p
                                    className="description text-lg text-white mt-4"
                                    style={{
                                        height: 0,
                                        opacity: 0,
                                        overflow: "hidden",
                                    }}
                                >
                                    {section.description}
                                </p>
                            </div>
                        );

                        return isInternalLink ? (
                            <Link key={index} href={section.link}>
                                {linkContent}
                            </Link>
                        ) : (
                            <a
                                key={index}
                                href={section.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                {linkContent}
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Scene