"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ExtrudeGeometry, Shape, type Mesh } from "three";
import { BOLT_EMISSIVE } from "./materials";

type BoltProps = {
  progress: number;
  assembled: boolean;
  lowPower: boolean;
};

function createBoltGeometry() {
  const shape = new Shape();
  // Lightning bolt polygon
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

export function Bolt({ progress, assembled, lowPower }: BoltProps) {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => createBoltGeometry(), []);
  const flash = useRef(0);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;

    const t = Math.min(1, Math.max(0, (progress - 0.65) / 0.3));
    const ease = 1 - Math.pow(1 - t, 3);

    m.position.set(-0.05, 0.35 + (1 - ease) * 0.8, 0.85);
    m.rotation.set(0.2, 0.4, -0.55);
    m.scale.setScalar(0.55 + ease * 0.45);

    // Single flash near end of assembly
    if (t > 0.85 && t < 1) {
      flash.current = 1;
    } else if (assembled) {
      flash.current = Math.max(0, flash.current - state.clock.getDelta() * 1.2);
    }

    const mat = m.material as import("three").MeshStandardMaterial;
    if (mat) {
      const pulse = assembled
        ? 0.55 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08
        : 0.35 + flash.current * 1.4;
      mat.emissiveIntensity = lowPower ? 0.4 : pulse;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} castShadow>
      <meshStandardMaterial
        color={BOLT_EMISSIVE}
        emissive={BOLT_EMISSIVE}
        emissiveIntensity={0.6}
        metalness={0.2}
        roughness={0.35}
      />
    </mesh>
  );
}
