"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { BOLT_EMISSIVE, EDGE, LIME } from "./materials";

type WashPortalProps = {
  reducedMotion: boolean;
  lowPower: boolean;
  intro: number;
};

/** Oversized front-load door — the creative stage for the hero orbit. */
export function WashPortal({
  reducedMotion,
  lowPower,
  intro,
}: WashPortalProps) {
  const rim = useRef<Mesh>(null);
  const paddles = useRef<Group>(null);
  const ring = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (paddles.current) paddles.current.rotation.z += delta * 1.15;
    if (rim.current) rim.current.rotation.z -= delta * 0.35;
    if (ring.current) ring.current.rotation.z += delta * 0.55;
  });

  const s = 0.15 + intro * 0.85;

  return (
    <group scale={s} rotation={[0.12, -0.35, 0.08]}>
      {/* Outer cabinet hint */}
      <mesh position={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[3.4, 3.6, 0.55]} />
        <meshStandardMaterial
          color="#1B2225"
          metalness={0.55}
          roughness={0.55}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Door glass */}
      <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0]}>
        <circleGeometry args={[1.55, lowPower ? 32 : 64]} />
        <meshStandardMaterial
          color="#0F1517"
          transparent
          opacity={0.45}
          metalness={0.3}
          roughness={0.2}
          emissive={EDGE}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Main rim */}
      <mesh ref={rim} position={[0, 0, 0.08]}>
        <torusGeometry args={[1.55, 0.08, lowPower ? 8 : 12, lowPower ? 48 : 72]} />
        <meshStandardMaterial
          color="#CFCACE"
          metalness={0.92}
          roughness={0.22}
          emissive={LIME}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Inner dashed energy ring */}
      <mesh ref={ring} position={[0, 0, 0.12]}>
        <torusGeometry args={[1.15, 0.025, 8, lowPower ? 32 : 64]} />
        <meshStandardMaterial
          color={LIME}
          emissive={BOLT_EMISSIVE}
          emissiveIntensity={0.7}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* Spinning paddles */}
      <group ref={paddles} position={[0, 0, 0.1]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 4) * Math.PI * 2]}
            position={[0, 0, 0]}
          >
            <boxGeometry args={[0.08, 1.05, 0.04]} />
            <meshStandardMaterial
              color={LIME}
              emissive={BOLT_EMISSIVE}
              emissiveIntensity={0.4}
              metalness={0.35}
              roughness={0.4}
              transparent
              opacity={0.75}
            />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color={BOLT_EMISSIVE}
            emissive={BOLT_EMISSIVE}
            emissiveIntensity={1.1}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Accent bolts on rim */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0.14]}
          >
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color="#9D9EA2"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
