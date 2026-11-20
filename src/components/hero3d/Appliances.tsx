"use client";

import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import type { Group } from "three";
import type { ServiceId } from "@/config/business";
import { EDGE, SILVER } from "./materials";

type ApplianceProps = {
  id: ServiceId;
  position: [number, number, number];
  assembled: boolean;
  from: [number, number, number];
  progress: number;
  lowPower: boolean;
  onSelect: (id: ServiceId) => void;
  children: ReactNode;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function ApplianceShell({
  id,
  position,
  assembled,
  from,
  progress,
  lowPower,
  onSelect,
  children,
}: ApplianceProps) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const floatPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;

    const t = Math.min(1, progress);
    const ease = 1 - Math.pow(1 - t, 3);
    g.position.x = lerp(from[0], position[0], ease);
    g.position.y = lerp(from[1], position[1], ease);
    g.position.z = lerp(from[2], position[2], ease);

    if (assembled) {
      const float = Math.sin(state.clock.elapsedTime * 0.6 + floatPhase.current) * 0.04;
      g.position.y = position[1] + float + (hovered ? 0.08 : 0);
    }
  });

  return (
    <group
      ref={ref}
      position={from}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {children}
      {hovered && !lowPower ? (
        <Edges threshold={12} color="#CBF764" scale={1.01} />
      ) : null}
    </group>
  );
}

export function Dishwasher(props: Omit<ApplianceProps, "children" | "id">) {
  return (
    <ApplianceShell id="dishwasher" {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.85, 0.7]} />
        <meshStandardMaterial {...SILVER} />
        {!props.lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      {/* Handle bar */}
      <mesh position={[0, 0.28, 0.36]}>
        <boxGeometry args={[0.7, 0.04, 0.04]} />
        <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Display strip */}
      <mesh position={[0.28, 0.35, 0.36]}>
        <boxGeometry args={[0.28, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#0A0E0F"
          emissive="#98DA55"
          emissiveIntensity={0.25}
        />
      </mesh>
    </ApplianceShell>
  );
}

export function WashingMachine(props: Omit<ApplianceProps, "children" | "id">) {
  return (
    <ApplianceShell id="washing-machine" {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.05, 1.15, 0.75]} />
        <meshStandardMaterial {...SILVER} />
        {!props.lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      {/* Door glass — cylinder rotated to face forward */}
      <mesh position={[0, -0.05, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 32]} />
        <meshStandardMaterial
          color="#1B2225"
          metalness={0.2}
          roughness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Drum ring */}
      <mesh position={[0, -0.05, 0.41]}>
        <torusGeometry args={[0.28, 0.025, 8, 32]} />
        <meshStandardMaterial color="#CFCACE" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Controls */}
      <mesh position={[-0.28, 0.42, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#7DBF29" metalness={0.4} roughness={0.4} />
      </mesh>
    </ApplianceShell>
  );
}

export function Refrigerator(props: Omit<ApplianceProps, "children" | "id">) {
  return (
    <ApplianceShell id="refrigerator" {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.95, 1.85, 0.7]} />
        <meshStandardMaterial {...SILVER} />
        {!props.lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      {/* Door seam */}
      <mesh position={[0, 0.15, 0.36]}>
        <boxGeometry args={[0.9, 0.02, 0.02]} />
        <meshStandardMaterial color="#2C3640" />
      </mesh>
      {/* Handle */}
      <mesh position={[0.38, 0.45, 0.37]}>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0.38, -0.35, 0.37]}>
        <boxGeometry args={[0.04, 0.28, 0.04]} />
        <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
      </mesh>
    </ApplianceShell>
  );
}
