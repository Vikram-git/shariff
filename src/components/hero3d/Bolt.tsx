"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ExtrudeGeometry, Shape, type Mesh } from "three";
import { BOLT_EMISSIVE, LIME } from "./materials";

type BoltProps = {
  reducedMotion: boolean;
  lowPower: boolean;
  intro: number;
};

function createBoltGeometry() {
  const shape = new Shape();
  shape.moveTo(0.05, 0.7);
  shape.lineTo(-0.2, 0.15);
  shape.lineTo(-0.02, 0.15);
  shape.lineTo(-0.18, -0.7);
  shape.lineTo(0.25, 0.05);
  shape.lineTo(0.05, 0.05);
  shape.lineTo(0.28, 0.7);
  shape.closePath();

  return new ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 1,
  });
}

/** Jumpy cartoon lightning bolt. */
export function Bolt({ reducedMotion, lowPower, intro }: BoltProps) {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => createBoltGeometry(), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const hop = Math.abs(Math.sin(t * 3.2)) * 0.55;
    m.position.set(
      Math.sin(t * 1.1) * 2.1,
      1.1 + hop,
      Math.cos(t * 1.1) * 0.9,
    );
    m.rotation.set(0.3, t * 3, Math.sin(t * 4) * 0.4);
    const pulse = 0.45 + Math.sin(t * 6) * 0.12;
    m.scale.setScalar(pulse * intro * (lowPower ? 0.9 : 1.15));

    const mat = m.material as import("three").MeshStandardMaterial;
    if (mat) mat.emissiveIntensity = 1.2 + Math.sin(t * 8) * 0.5;
  });

  return (
    <mesh ref={mesh} geometry={geometry} castShadow>
      <meshStandardMaterial
        color={LIME}
        emissive={BOLT_EMISSIVE}
        emissiveIntensity={1.2}
        metalness={0.1}
        roughness={0.4}
        toneMapped={false}
      />
    </mesh>
  );
}
