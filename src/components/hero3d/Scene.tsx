"use client";

import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import type { ServiceId } from "@/config/business";
import { Dishwasher, Refrigerator, WashingMachine } from "./Appliances";
import { Bolt } from "./Bolt";
import { AMBIENT, EMERALD, LIME } from "./materials";
import { Wrench } from "./Wrench";

type SceneProps = {
  lowPower: boolean;
  reducedMotion: boolean;
  onSelectAppliance: (id: ServiceId) => void;
};

const ASSEMBLY_MS = 2200;

export function Scene({
  lowPower,
  reducedMotion,
  onSelectAppliance,
}: SceneProps) {
  const group = useRef<Group>(null);
  const { camera, size } = useThree();
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);
  const [assembled, setAssembled] = useState(reducedMotion);
  const start = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      setAssembled(true);
      return;
    }

    let raf = 0;
    const tick = (now: number) => {
      if (start.current === null) start.current = now;
      const p = Math.min(1, (now - start.current) / ASSEMBLY_MS);
      setProgress(p);
      if (p >= 1) {
        setAssembled(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (reducedMotion) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current = { x, y };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;

    // Scroll drives rotation 0 → -35deg and slight dolly
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const heroH = Math.max(size.height, 1);
    const scrollT = Math.min(1, scrollY / heroH);
    const targetRot = scrollT * (-35 * (Math.PI / 180));
    g.rotation.y += (targetRot - g.rotation.y) * 0.08;

    if (!reducedMotion && assembled) {
      const yaw = pointer.current.x * (6 * (Math.PI / 180));
      const pitch = pointer.current.y * (3 * (Math.PI / 180));
      camera.rotation.y += (yaw - camera.rotation.y) * 0.04;
      camera.rotation.x += (-pitch - camera.rotation.x) * 0.04;
    }

    // Bias stack to the right so copy stays clear on the left
    const wide = size.width >= 768;
    camera.position.x = wide ? 1.15 : 0.35;
    camera.position.y = wide ? 0.35 : 0.15;
    camera.position.z = (wide ? 5.4 : 6.2) + scrollT * 0.65;
  });

  return (
    <>
      <color attach="background" args={["#0A0E0F"]} />
      <ambientLight color={AMBIENT} intensity={0.55} />
      {/* Cool-white key — upper left */}
      <directionalLight
        position={[-3.5, 4.5, 2.5]}
        intensity={1.15}
        color="#F1F3F2"
        castShadow={!lowPower}
      />
      {/* Lime rim — back right */}
      <directionalLight position={[3.2, 2.2, -2.5]} intensity={0.55} color={LIME} />
      {/* Emerald fill — below left */}
      <directionalLight position={[-2, -1.5, 1.5]} intensity={0.35} color={EMERALD} />

      <Environment resolution={lowPower ? 64 : 256}>
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-4, 3, 2]}
          scale={[4, 2, 1]}
          color="#CFCACE"
        />
        <Lightformer
          form="ring"
          intensity={0.8}
          position={[3, 1, -2]}
          scale={3}
          color={LIME}
        />
        <Lightformer
          form="circle"
          intensity={0.5}
          position={[-2, -2, 1]}
          scale={2}
          color={EMERALD}
        />
      </Environment>

      <group ref={group} position={[0.55, -0.45, 0]} scale={1.08}>
        <Dishwasher
          position={[-1.15, -0.35, 0.1]}
          from={[-2.4, -0.9, -0.5]}
          progress={progress}
          assembled={assembled}
          lowPower={lowPower}
          onSelect={onSelectAppliance}
        />
        <WashingMachine
          position={[-0.15, -0.2, 0]}
          from={[0.2, -1.4, -0.8]}
          progress={progress}
          assembled={assembled}
          lowPower={lowPower}
          onSelect={onSelectAppliance}
        />
        <Refrigerator
          position={[1.05, 0.15, -0.15]}
          from={[2.5, -0.6, -0.6]}
          progress={progress}
          assembled={assembled}
          lowPower={lowPower}
          onSelect={onSelectAppliance}
        />
        <Wrench progress={progress} assembled={assembled} />
        <Bolt
          progress={progress}
          assembled={assembled}
          lowPower={lowPower}
        />
      </group>

      {/* Dark floor — no grid */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.4, -1.15, 0]}
        receiveShadow
      >
        <circleGeometry args={[6, 48]} />
        <meshStandardMaterial color="#050809" roughness={0.95} metalness={0.05} />
      </mesh>

      {!lowPower ? (
        <ContactShadows
          position={[0.4, -1.14, 0]}
          opacity={0.45}
          scale={10}
          blur={2.4}
          far={4}
          color="#000000"
        />
      ) : null}

      {!lowPower ? (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.85}
            luminanceSmoothing={0.3}
            intensity={0.55}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </>
  );
}
