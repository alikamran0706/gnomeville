import gsap from 'gsap';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

const Loading = ({ setIsLoading }) => {
  const logoWrapperRef = useRef(null);
  const logoRef = useRef(null);
  const whiteImageRef = useRef(null);
  const outlineImageRef = useRef(null);
  const grayImageRef = useRef(null);

  useEffect(() => {
    // GSAP Timeline for faster animations
    const timeline = gsap.timeline({ defaults: { ease: 'power1.inOut', duration: 0.5 } });

    // Animate images in faster sequence
    timeline.fromTo(whiteImageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    timeline.fromTo(outlineImageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3'); // Overlap
    timeline.fromTo(grayImageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');
    timeline.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, '-=0.4');

    // End animation and hide loading
    timeline.call(() => setIsLoading && setIsLoading(false), null, '+=0.2'); // Reduce wait time
  }, []);

  return (
    <div
      ref={logoWrapperRef}
      className="fixed inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex justify-center items-center z-50"
    >
      <div>
        <div className="relative mx-auto">
          {/* Different versions of the logo */}
          <Image
            ref={whiteImageRef}
            src="/logo-white.png"
            alt="White Logo"
            width={82}
            height={82}
            className="absolute opacity-0"
            priority // Preload critical image
          />
          <Image
            ref={outlineImageRef}
            src="/logo-outline.png"
            alt="Outline Logo"
            width={82}
            height={82}
            className="absolute opacity-0"
            priority // Preload critical image
          />
          <Image
            ref={grayImageRef}
            src="/logo-gray.png"
            alt="Gray Logo"
            width={82}
            height={82}
            className="absolute opacity-0"
            priority // Preload critical image
          />
          <Image
            ref={logoRef}
            src="/logo.png"
            alt="Final Logo"
            width={82}
            height={82}
            className="absolute opacity-0"
            priority // Preload critical image
          />
        </div>
        <div className="text-white text-xl font-bold mt-4 w-20"></div>
      </div>
    </div>
  );
};

export default Loading;
