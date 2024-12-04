import { Canvas, useLoader } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Image from 'next/image';
import gsap from 'gsap';
import * as THREE from 'three';
import Loading from './Loading';
import './gnome.css'; 

const tabs = [
  { id: "Cap", icon: "🧢" },
  { id: "Clothes", icon: "🥼" },
  { id: "Beard", icon: "🧔🏽‍♂️" },
];
const capIcons = [
  "/cap-boy-baseball-svgrepo-com.svg",
  "/cap-svgrepo-com.svg",
  "/santa-claus-cap-christmas-svgrepo-com.svg",
  "/knitted-cap-svgrepo-com.svg",
  "/halloween-witch-hat-svgrepo-com.svg",
];
const costumeIcons = [
  "/clothes-suit-svgrepo-com.svg",
  "/policeman-svgrepo-com.svg",
  "/costume-svgrepo-com.svg",
  "/chef-suit-svgrepo-com.svg",
  "/chef-svgrepo-com.svg",
];
const beardIcons = [
  "/man-with-goatbeard-and-moustache-svgrepo-com.svg",
  "/moustache-svgrepo-com.svg",
  "/beard-1.svg",
  "/fluffy-moustache-svgrepo-com.svg",
];

export default function HomePage({loading, setLoading}) {
  const [selectedTab, setSelectedTab] = useState("Cap");
  const [selectedShape, setSelectedShape] = useState(null);
  const capRef = useRef([]);
  const costumeRef = useRef([]);
  const beardRef = useRef([]);
  const timeline = useRef(null);

  const [meshConfig, setMeshConfig] = useState({
    Costume1_Low: { visible: false },
    Costume2_Low: { visible: false },
    Costume3_Low: { visible: false },
    Costume4_Low: { visible: false },
    Costume5_Low: { visible: false },
    Red_C_Costume: { visible: true },
    GnomeCostume1_Low: { visible: true },
    Beard1_low: { visible: false },
    Beard2_low: { visible: false },
    Beard3_low: { visible: false },
    Beard4_low: { visible: false },
    Red_C_Beard: { visible: true },
    GnomeBeard_Low: { visible: false },
    Hat1_low: { visible: false },
    Hat2_low: { visible: false },
    Hat3_low: { visible: false },
    Hat4_low: { visible: false },
    Hat5_low: { visible: false },
    Red_C_Hat: { visible: true },
    Red_C_Body: { visible: true },
    GnomeHatDefault_Low: { visible: false },
  });

  const changeCostumeHandler = (index) => {
    setSelectedShape(index - 1)
    setMeshConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };
      Object.keys(updatedConfig).forEach((key) => {
        if (key.startsWith('Costume') || key === 'Red_C_Costume') {
          updatedConfig[key].visible = false;
        }
      });
      updatedConfig[`Costume${index}_Low`].visible = true;

      return updatedConfig;
    });
  };

  const changeGapHandler = (index) => {
    setSelectedShape(index - 1)
    setMeshConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };
      Object.keys(updatedConfig).forEach((key) => {
        if (key.startsWith('Hat') || key === 'Red_C_Hat') {
          updatedConfig[key].visible = false;
        }
      });
      updatedConfig[`Hat${index}_low`].visible = true;

      return updatedConfig;
    });
  };
  const changeBeardHandler = (index) => {
    setSelectedShape(index - 1)
    setMeshConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };
      Object.keys(updatedConfig).forEach((key) => {
        if (key.startsWith('Beard') || key === 'Red_C_Beard') {
          updatedConfig[key].visible = false;
        }
      });
      updatedConfig[`Beard${index}_low`].visible = true;

      return updatedConfig;
    });
  };
  const animateItems = (items) => {
    if (timeline.current) timeline.current.kill();
    timeline.current = gsap.timeline();
    timeline.current.fromTo(
      items,
      { x: -100, opacity: 0 }, 
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.2, 
        ease: "power3.out",
      }
    );
  };

  useEffect(() => {
    if (selectedTab === "Cap") {
      animateItems(capRef.current);
    } else if (selectedTab === "Clothes") {
      animateItems(costumeRef.current);
    } else if (selectedTab === "Beard") {
      animateItems(beardRef.current);
    }
  }, [selectedTab]);
  
  
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between w-full" >
      {
        !loading &&
        <div className="w-full lg:w-auto flex flex-col gap-y-8 px-4 lg:px-12 mt-8 lg:mt-24">
          <div className="flex mb-4 overflow-x-auto flex-wrap gap-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex flex-col items-center px-2 py-1 lg:px-4 lg:py-2 ${selectedTab === tab.id ? 'text-blue-500 font-bold' : 'text-gray-400'
                  }`}
                onClick={() => {
                  setSelectedShape(null);
                  setSelectedTab(tab.id);
                }}
              >
                <div className="text-base lg:text-xl">{tab.icon}</div>
                <span className="text-xs lg:text-sm">{tab.id}</span>
              </button>
            ))}
          </div>

          {selectedTab === 'Cap' ? (
            <Category
              title="Cap"
              items={capIcons}
              refs={capRef}
              onClick={(i) => changeGapHandler(i + 1)}


              selectedShape={selectedShape}
            />
          ) : selectedTab === 'Clothes' ? (
            <Category
              title="Costume"
              items={costumeIcons}
              refs={costumeRef}
              onClick={(i) => changeCostumeHandler(i + 1)}
              selectedShape={selectedShape}
            />
          ) : (
            <Category
              title="Beard"
              items={beardIcons}
              refs={beardRef}
              onClick={(i) => changeBeardHandler(i + 1)}
              selectedShape={selectedShape}
            />
          )}
        </div>
      }

      <div className={loading ? 'w-full' : `w-full lg:w-[calc(100%-43rem)] h-[90vh] flex items-center justify-center`}>
        <Canvas style={{ width: '100%', height: '85.5vh' }} camera={{ fov: 85 }} dpr={[1, 2]} shadows className='custom-canvas'>
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={3.5} />
            <pointLight position={[0.1, -0.5, 2]} decay={0} intensity={0.1} />
            <spotLight intensity={0.7} position={[5, 10, 5]} angle={0.3} penumbra={0.5} castShadow />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
            <Box 
              meshConfig={meshConfig} 
              setLoading={setLoading}
              loading={loading}
            />
            <ContactShadows position={[0, -1.4, 0]} opacity={0.75} scale={10} blur={3} far={4} />
          </Suspense>
        </Canvas>
      </div>

    </div>
  );
}
const Loader = () => {
  return (
    <Html>
      {/* <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="w-[10vw] h-[10vw] rounded-full text-white">
          Loading...
        </div>
      </div> */}
      <Loading setIsLoading={null} />
    </Html>
  )
}
const Category = ({ title, items, refs, onClick, selectedShape }) => (
  <div>
    <div className="text-gray-200 font-semibold text-xl mb-5">{title}</div>
    <div className="rounded-full text-center p-2 gap-x-4 flex flex-wrap">
      {items.map((icon, i) => (
        <div
          key={i}
          className={`rounded-full bg-white ${selectedShape === i
              ? "shadow-indigo-500/50 border-2 border-indigo-600 h-28 w-28 scale-110"
              : "h-24 w-24 scale-100"
            } flex items-center justify-center cursor-pointer`}
          ref={(el) => (refs.current[i] = el)}
          onClick={() => onClick(i)}
        >
          <Image src={icon} alt={`${title} ${i + 1}`} width={64} height={64} className="rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const Box = ({ meshConfig, setLoading, loading }) => {
  const fbx = useLoader(FBXLoader, '/models/RatchetCostumesRigged.fbx');
  const mixer = useRef(null);
  const modelContainerRef = useRef(null);

  const [animationTriggered, setAnimationTriggered] = useState(false); // Track animation state

  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          if (meshConfig[child.name]) {
            child.visible = meshConfig[child.name].visible;
            child.material.metalness = 1;
            child.material.roughness = 1;
            child.material.needsUpdate = true;
            setLoading(false);
          }
        }
      });
    }
  }, [fbx, meshConfig]);

  useEffect(() => {
    if (fbx) {
      if (fbx.animations && fbx.animations.length > 0) {
        mixer.current = new THREE.AnimationMixer(fbx);
        const action = mixer.current.clipAction(fbx.animations[0]);
        action.play();
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && modelContainerRef.current && !loading && !animationTriggered) {
      setAnimationTriggered(true); // Ensure the animation only triggers once
  
      // Make the canvas and modelContainerRef visible before animation starts
      const canvasElement = document.querySelector('canvas');
      if (canvasElement) {
        canvasElement.style.visibility = "visible"; // Show the canvas
        canvasElement.style.opacity = "1"; // Make it visible
      }
  
      // Set initial hidden state for the model
      gsap.set(modelContainerRef.current.scale, { x: 0.8, y: 0.8, z: 0.8 });
      gsap.set(modelContainerRef.current, { opacity: 0 });
  
      // Animate the model into view
      gsap.to(modelContainerRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'power3.in',
        delay: 0.5,
      });
      gsap.to(modelContainerRef.current, {
        opacity: 1,
        duration: 1,
        ease: "power3.in",
        delay: 0.5,
      });
    }
  }, [loading, animationTriggered]);
  
  

  return (
    <group ref={modelContainerRef}>
      <primitive object={fbx} scale={[0.044, 0.044, 0.044]} position={[0, -2.2, 0]} />
    </group>
  );
};

