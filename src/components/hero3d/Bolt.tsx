"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ExtrudeGeometry, Shape, type Mesh } from "three";
import { BOLT_EMISSIVE } from "./materials";

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
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 1,
  });
}

/** Bolt pulses above the stage spotlight. */
export function Bolt({ reducedMotion, lowPower, intro }: BoltProps) {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => createBoltGeometry(), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    m.position.set(
      -0.85 + Math.sin(t * 0.35) * 0.1,
      1.15 + Math.sin(t * 1.4) * 0.07,
      0.95,
    );
    m.rotation.set(0.2, t * 0.55, -0.4);
    m.scale.setScalar((0.3 + intro * 0.25) * (lowPower ? 0.9 : 1));

    const mat = m.material as import("three").MeshStandardMaterial;
    if (mat) {
      mat.emissiveIntensity = lowPower
        ? 0.5
        : 0.7 + Math.sin(t * 2.8) * 0.25;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} castShadow>
      <meshStandardMaterial
        color={BOLT_EMISSIVE}
        emissive={BOLT_EMISSIVE}
        emissiveIntensity={0.75}
        metalness={0.2}
        roughness={0.35}
      />
    </mesh>
  );
}
