"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ExtrudeGeometry, Shape, type Group } from "three";

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

/** Wrench rests near the stage, turning slowly. */
export function Wrench({ reducedMotion, intro }: WrenchProps) {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => createWrenchGeometry(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    g.position.set(
      1.15 + Math.sin(t * 0.3) * 0.08,
      0.85 + Math.sin(t * 0.55) * 0.06,
      1.05,
    );
    g.rotation.set(0.55, 0.8 + t * 0.25, 0.35);
    g.scale.setScalar(0.3 + intro * 0.2);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#E8EAE9"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
