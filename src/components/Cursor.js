import { useRef, useEffect, useState } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { Raycaster } from "three";

// Custom Shader Material for the ring
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

// Extend to the THREE namespace
extend({ MirrorMaterial });

export default function Cursor() {
  const cursorRef = useRef();
  const raycasterRef = useRef(new Raycaster()); // Raycaster instance
  const [isClient, setIsClient] = useState(false);
  const [resolution, setResolution] = useState([1, 1]);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const { camera, mouse, scene } = useThree(); // Destructure mouse and camera from the context

  useEffect(() => {
    const canvasElement = document.querySelector('canvas');
    if (canvasElement) {
      canvasElement.style.visibility = "visible"; // Show the canvas
      canvasElement.style.opacity = "1"; // Make it visible
    }
    if (typeof window !== "undefined") {
      setIsClient(true);

      const updateResolution = () => {
        setResolution([window.innerWidth, window.innerHeight]);
      };

      updateResolution();
      window.addEventListener("resize", updateResolution);

      const handleMouseMove = (event) => {
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
            duration: 0.2,
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Handle click events
      const handleClick = () => {
        if (cursorRef.current && isHovered) {
          console.log("Cursor clicked on interactive object!");
        }
      };

      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", updateResolution);
        window.removeEventListener("click", handleClick);
      };
    }
  }, [isHovered]);

  // Update raycaster position and check for hover status
  useFrame(() => {
    if (cursorRef.current && raycasterRef.current) {
      // Set raycaster position and direction (from camera)
      raycasterRef.current.ray.origin.copy(camera.position);
      raycasterRef.current.ray.direction.set(mouse.x, -mouse.y, 0.5).normalize();

      // Get all intersected objects, including the ring itself
      const intersects = raycasterRef.current.intersectObjects(scene.children);

      // Check if the ray intersects any objects (ring or interactive elements)
      const isIntersecting = intersects.some((intersect) => {
        return intersect.object === cursorRef.current || intersect.object.userData?.interactive;
      });

      if (isIntersecting) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }

      // Update the hover state of the material
      if (cursorRef.current.material.uniforms.uHover) {
        cursorRef.current.material.uniforms.uHover.value = isHovered ? 1.0 : 0.0;
      }
    }
  });

  useFrame(({ clock }) => {
    if (cursorRef.current?.material?.uniforms) {
      cursorRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  if (!isClient) return null;

  return (
    <>
      {/* The ring mesh (cursor) */}
      <mesh ref={cursorRef} scale={2} userData={{ interactive: true }}>
        <ringGeometry args={[0.6, 0.8, 64]} />
        {isClient && (
          <mirrorMaterial
            attach="material"
            uResolution={resolution}
            uHover={isHovered ? 1.0 : 0.0} // Pass hover state to the shader
          />
        )}
      </mesh>
    </>
  );
}
