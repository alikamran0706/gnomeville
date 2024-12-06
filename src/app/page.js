'use client';
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Cursor from '@/components/CanvasWrapper';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const sectionsRef = useRef([]);
    const collapseRef = useRef([]);
    const cursorRef = useRef();

    const [activeIndex, setActiveIndex] = useState(null);

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

    const textRef = useRef(null);

    const handleMouseMove = (event) => {
        const textSpans = textRef.current?.querySelectorAll("span");

        const { clientX, clientY } = event;
        // Loop through each text span and calculate the distance from the cursor
        textSpans.forEach((span) => {
            const spanRect = span.getBoundingClientRect();
            const spanCenterX = spanRect.left + spanRect.width / 2;
            const spanCenterY = spanRect.top + spanRect.height / 2;

            // Calculate the distance between the ring's center (clientX, clientY) and the center of each span
            const distance = Math.sqrt(
                Math.pow(clientX - spanCenterX, 2) + Math.pow(clientY - spanCenterY, 2)
            );

            // Highlight the text if the distance is within a certain range
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

        let hoveredIndex = null;

        // Check which section is being hovered
        collapseRef.current?.forEach((section, index) => {
          if (!section) return;
      
          const rect = section.getBoundingClientRect();
      
          // Check if the cursor's position is within the section's vertical bounds
          if (clientY >= rect.top && clientY <= rect.bottom+30) {
            hoveredIndex = index; // Set the index of the hovered section
          }
        });
      
        // If a section is hovered, activate it
        if (hoveredIndex !== null) {
          if (hoveredIndex !== activeIndex) {
            setActiveIndex(hoveredIndex); // Update active index
      
            // Animate only the hovered section
            collapseRef.current?.forEach((section, index) => {
              if (index === hoveredIndex) {
                // Apply hover animation
                gsap.to(section.querySelector(".description"), {
                  height: "auto",
                  opacity: 1,
                  duration: 0.4,
                  ease: "power3.out",
                });
      
                // Add active styles
                section.style.color = "#00f2ff"; // Example: Active color
              } else {
                // Reset styles and animation for all other sections
                gsap.to(section.querySelector(".description"), {
                  height: 0,
                  opacity: 0,
                  duration: 0.2,
                  ease: "power3.out",
                });
      
                // Reset to default styles
                section.style.color = ""; // Reset color to default
              }
            });
          }
        } else {
            setActiveIndex(null);

            collapseRef.current?.forEach((section) => {
              // Check if the section's description is still animated or visible
              const description = section.querySelector(".description");
              const isAnimated = gsap.getProperty(description, "height") !== "0px" || gsap.getProperty(description, "opacity") > 0;
          
              if (isAnimated) {
                // Reset all animations and styles
                gsap.to(description, {
                  height: 0,
                  opacity: 0,
                  duration: 0.4,
                  ease: "power3.out",
                });
          
                // Reset styles to default
                section.style.color = ""; // Reset color to default
              }
            });
        }
      

    };
   
    const handleMouseEnter = (index) => {
        setActiveIndex(index);
        const section = collapseRef.current[index];
        gsap.to(section.querySelector(".description"), {
            height: "auto",
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
        });
    };

    const handleMouseLeave = (index) => {
        setActiveIndex(null);
        const section = collapseRef.current[index];
        gsap.to(section.querySelector(".description"), {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
        });
    };

    useEffect(() => {
        return () => {
            collapseRef.current?.forEach((section) => {
                if (section) {
                    gsap.killTweensOf(section.querySelector(".description"));
                }
            });
        };
    }, []);



    const handleCustomCursorClick = () => {
        const { x, y, z } = cursorRef.current.position;
        const worldPosition = new THREE.Vector3(x, y, z);
        worldPosition.project(camera);
      
        const clientX = ((worldPosition.x + 1) / 2) * window.innerWidth;
        const clientY = ((-worldPosition.y + 1) / 2) * window.innerHeight;
      
        console.log(`Cursor Position: clientX=${clientX}, clientY=${clientY}`);
      
        const linkElement = document.querySelector(".about-us-link");
        const rect = linkElement.getBoundingClientRect();
      
        console.log(`Link Bounds: top=${rect.top}, right=${rect.right}, bottom=${rect.bottom}, left=${rect.left}`);
      
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          console.log("Cursor intersects with the 'About Us' link");
          linkElement.click(); // Simulate a click
        }
      };
      
      
      // Add click event listener
      useEffect(() => {
        window.addEventListener("click", handleCustomCursorClick);
      
        // Cleanup on component unmount
        return () => {
          window.removeEventListener("click", handleCustomCursorClick);
        };
      }, []);
    return (
        <div className="font-sans relative">
            <Cursor handleMouse={handleMouseMove} cursorRef={cursorRef} />
            {/* Header Section */}
            <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
                {/* Logo in the Top Left Corner */}
                <div className="flex justify-between">
                    <div className="absolute top-6 left-6">
                        <Image src="/logo.png" alt="Logo" width={82} height={82} />
                    </div>
                    {/* About Us Button */}
                    <Link
                        href="/about-us"  style={{ zIndex: 10 }}
                        className="text-xl absolute top-6 right-6 cursor-none text-gray-300 font-bold py-2 px-6 bg-transparent hover:text-[#6ee7b7] hover:underline transition-all duration-300"
                    >
                        About Us
                    </Link>
                </div>
                {/* Main Content */}
                <div className="text-center">
                    <h1
                        className="text-5xl md:text-8xl font-extrabold mb-4 tracking-wide"
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
            <div
                ref={(el) => (sectionsRef.current[0] = el)}
                className=" bg-pink-500"
            >
                {/* Collapsible Section */}
                <div className="min-h-screen flex p-14">
                    <div className="w-full mx-auto space-y-4">
                        {sections.map((section, index) => {
                            const isInternalLink = section.link && section.link.startsWith('/');

                            const linkContent = (
                                <div
                                    ref={(el) => (collapseRef.current[index] = el)}
                                    className="border-t border-gray-300 overflow-hidden py-4"
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
                                <Link key={index} href={section.link} className="cursor-none">
                                    {linkContent}
                                </Link>
                            ) : (
                                <a
                                    key={index}
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block cursor-none"
                                >
                                    {linkContent}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="bg-black text-white py-12 items-start flex  px-12">
                <div className="w-full mb-6 flex flex-col md:flex-row md:justify-between">
                    {/* Social Media Links */}
                    <div className="flex md:justify-center space-x-6 mb-4">
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
