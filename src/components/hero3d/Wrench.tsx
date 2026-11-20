"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  ExtrudeGeometry,
  Shape,
  type Group,
  type Mesh,
} from "three";

type WrenchProps = {
  progress: number;
  assembled: boolean;
};

function createWrenchGeometry() {
  const shape = new Shape();
  // Open-end head with angled jaws (logo-like)
  shape.moveTo(-0.15, 0.55);
  shape.lineTo(-0.35, 0.75);
  shape.lineTo(-0.55, 0.55);
  shape.lineTo(-0.4, 0.4);
  shape.lineTo(-0.25, 0.5);
  shape.lineTo(-0.15, 0.35);
  // Handle
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

  // Jaw opening hole
  const hole = new Shape();
  hole.moveTo(-0.12, 0.52);
  hole.lineTo(-0.22, 0.62);
  hole.lineTo(-0.32, 0.52);
  hole.lineTo(-0.22, 0.45);
  hole.closePath();
  shape.holes.push(hole);

  const hole2 = new Shape();
  hole2.moveTo(0.12, 0.52);
  hole2.lineTo(0.22, 0.62);
  hole2.lineTo(0.32, 0.52);
  hole2.lineTo(0.22, 0.45);
  hole2.closePath();
  shape.holes.push(hole2);

  return new ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
}

export function Wrench({ progress, assembled }: WrenchProps) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => createWrenchGeometry(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    const t = Math.min(1, Math.max(0, (progress - 0.35) / 0.45));
    const ease = 1 - Math.pow(1 - t, 3);

    // Drop in from above and turn once
    g.position.set(
      0.15,
      1.8 - ease * 1.05,
      0.55,
    );
    g.rotation.set(
      -0.4 + ease * 0.15,
      -0.6 + ease * (Math.PI * 2 + 0.35),
      0.5 - ease * 0.2,
    );

    if (assembled && mesh.current) {
      mesh.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#E8EAE9"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
