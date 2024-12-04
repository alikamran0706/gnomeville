import { useRef, useEffect, useState } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { gsap } from "gsap";

const MirrorMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: [1, 1], // Default resolution (will be updated later)
    uHover: 0, // Uniform to handle hover effect
  },
  `varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  `varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uHover; // Hover state

  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uv, sin(uTime) * 0.5 + 0.5);
    
    // If hovering, change the ring's color
    if (uHover > 0.0) {
      color = vec3(1.0, 0.5, 0.0); // Example: orange color for hover
    }

    gl_FragColor = vec4(color, 1.0);
  }`
);

extend({ MirrorMaterial });

export default function Cursor() {
  const cursorRef = useRef();
  const [isClient, setIsClient] = useState(false);
  const [resolution, setResolution] = useState([1, 1]);
  const isHovered =false;
  const inactivityTimer = useRef(null);
  const isMouseMoving = useRef(false);

  useEffect(() => {
    const canvasElement = document.querySelector("canvas");
    if (canvasElement) {
      canvasElement.style.visibility = "visible";
      canvasElement.style.opacity = "1";
    }
    if (typeof window !== "undefined") {
      setIsClient(true);

      const updateResolution = () => {
        setResolution([window.innerWidth, window.innerHeight]);
      };
      
      updateResolution();
      window.addEventListener("resize", updateResolution);

      const handleMouseMove = (event) => {
        isMouseMoving.current = true;
        // handleMouse()
        clearTimeout(inactivityTimer.current);

        const { clientX: x, clientY: y } = event;
        const aspectRatio = window.innerWidth / window.innerHeight;

        const normalizedX = (x / window.innerWidth) * 2 - 1;
        const normalizedY = -(y / window.innerHeight) * 2 + 1;

        const worldX = normalizedX * aspectRatio * 4.5;
        const worldY = normalizedY * 4.5;

        if (cursorRef.current) {
          gsap.to(cursorRef.current.position, {
            x: worldX,
            y: worldY,
            duration: 3,
          });
        }

        // Start timer for random movement
        inactivityTimer.current = setTimeout(() => {
          isMouseMoving.current = false;
          startRandomMovement();
        }, 1000); // 1 second of inactivity
      };

      window.addEventListener("mousemove", handleMouseMove);

      const handleClick = () => {
        if (cursorRef.current && isHovered) {
          console.log("Cursor clicked on interactive object!");
        }
      };

      window.addEventListener("click", handleClick);
      startRandomMovement();
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", updateResolution);
        window.removeEventListener("click", handleClick);
      };
    }
  }, [isHovered]);

  const startRandomMovement = () => {
    if (!isMouseMoving.current) {
      const randomX = (Math.random() - 0.5) * 10; 
      const randomY = (Math.random() - 0.5) * 10; 

      if (cursorRef.current) {
        gsap.to(cursorRef.current.position, {
          x: randomX,
          y: randomY,
          duration: 18,
          onComplete: startRandomMovement, 
        });
      }
    }
  };

  useFrame(({ clock }) => {
    if (cursorRef.current?.material?.uniforms) {
      cursorRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <>
      {/* The ring mesh (cursor) */}
      <mesh ref={cursorRef} scale={2} userData={{ interactive: true }}>
        <ringGeometry args={[0.6, 0.8, 64]} />
        {isClient && (
          <mirrorMaterial
            attach="material"
            uResolution={resolution}
            uHover={isHovered ? 1.0 : 0.0}
          />
        )}
      </mesh>
    </>
  );
}
