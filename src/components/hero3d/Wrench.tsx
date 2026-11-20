"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ExtrudeGeometry, Shape, type Group } from "three";
import { LIME } from "./materials";

type WrenchProps = {
  reducedMotion: boolean;
  intro: number;
};

function createWrenchGeometry() {
  const shape = new Shape();
  shape.moveTo(-0.15, 0.55);
  shape.lineTo(-0.35, 0.75);
  shape.lineTo(-0.55, 0.55);
  shape.lineTo(-0.4, 0.4);
  shape.lineTo(-0.25, 0.5);
  shape.lineTo(-0.15, 0.35);
  shape.lineTo(-0.08, -0.55);
  shape.quadraticCurveTo(0, -0.7, 0.08, -0.55);
  shape.lineTo(0.15, 0.35);
  shape.lineTo(0.25, 0.5);
  shape.lineTo(0.4, 0.4);
  shape.lineTo(0.55, 0.55);
  shape.lineTo(0.35, 0.75);
  shape.lineTo(0.15, 0.55);
  shape.lineTo(0.08, 0.4);
  shape.lineTo(-0.08, 0.4);
  shape.closePath();

  return new ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
}

/** Chunky wrench that tumbles like a cartoon prop. */
export function Wrench({ reducedMotion, intro }: WrenchProps) {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => createWrenchGeometry(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = reducedMotion ? 0.5 : state.clock.elapsedTime;
    const hop = Math.abs(Math.sin(t * 2.2)) * 0.45;
    g.position.set(
      Math.cos(t * 0.9) * 2.35,
      0.6 + hop,
      Math.sin(t * 0.9) * 1.2,
    );
    g.rotation.set(t * 2.5, t * 1.8, t * 1.2);
    const squash = 1 + Math.sin(t * 4) * 0.12;
    g.scale.set(0.4 * intro, 0.4 * intro * squash, 0.4 * intro);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color={LIME}
          metalness={0.25}
          roughness={0.45}
          emissive={LIME}
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}
