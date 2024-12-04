import { Canvas } from "@react-three/fiber";
import Cursor from "./Cursor";
import { useEffect, useState } from "react";

const CursorScene = (props) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true); // Ensure rendering only happens on the client
  }, []);
  if (!isClient) return null; 
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        pointerEvents: "none",
      }}
      orthographic
      camera={{
        zoom: 100,
        position: [0, 0, 10],
        near: 0.1,
        far: 1000,
      }}
    >
      <ambientLight intensity={0.5} />
      <Cursor {...props} />
    </Canvas>
  );
};

export default CursorScene;
