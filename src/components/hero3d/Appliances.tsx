"use client";

import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import type { Group, Mesh } from "three";
import type { ServiceId } from "@/config/business";
import { BOLT_EMISSIVE, EDGE, LIME, SILVER } from "./materials";

type SelectableProps = {
  id: ServiceId;
  lowPower: boolean;
  onSelect: (id: ServiceId) => void;
  children: ReactNode;
  scale?: number;
};

function Selectable({
  id,
  lowPower,
  onSelect,
  children,
  scale = 1,
}: SelectableProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const target = hovered ? scale * 1.1 : scale;
    g.scale.x += (target - g.scale.x) * 0.14;
    g.scale.y = g.scale.x;
    g.scale.z = g.scale.x;
  });

  return (
    <group
      ref={ref}
      scale={scale}
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
        <Edges threshold={12} color={EDGE} scale={1.02} />
      ) : null}
    </group>
  );
}

export function DishwasherMesh({
  lowPower,
  animate = true,
}: {
  lowPower: boolean;
  animate?: boolean;
}) {
  const door = useRef<Group>(null);
  const rack = useRef<Mesh>(null);
  const spray = useRef<Mesh>(null);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    // Door gently opens and closes
    if (door.current) {
      const open = (Math.sin(t * 0.55) + 1) * 0.5;
      door.current.rotation.x = open * 0.85;
    }
    if (rack.current) {
      rack.current.position.z = 0.05 + Math.sin(t * 0.55) * 0.18;
    }
    if (spray.current) {
      const mat = spray.current.material as import("three").MeshStandardMaterial;
      if (mat) mat.emissiveIntensity = 0.25 + (Math.sin(t * 4) + 1) * 0.35;
      spray.current.rotation.y = t * 2.2;
    }
  });

  return (
    <group>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.08, -0.05]}>
        <boxGeometry args={[1.15, 0.95, 0.65]} />
        <meshStandardMaterial {...SILVER} />
        {!lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      {/* Inner cavity */}
      <mesh position={[0, 0.05, 0.12]}>
        <boxGeometry args={[0.95, 0.7, 0.35]} />
        <meshStandardMaterial color="#0F1517" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh ref={rack} position={[0, 0.0, 0.1]}>
        <boxGeometry args={[0.85, 0.04, 0.28]} />
        <meshStandardMaterial color="#9D9EA2" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh ref={spray} position={[0, 0.28, 0.12]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        <meshStandardMaterial
          color={LIME}
          emissive={BOLT_EMISSIVE}
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Hinged door */}
      <group ref={door} position={[0, -0.38, 0.28]}>
        <mesh castShadow position={[0, 0.42, 0.02]}>
          <boxGeometry args={[1.12, 0.88, 0.06]} />
          <meshStandardMaterial {...SILVER} metalness={0.88} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.7, 0.06]}>
          <boxGeometry args={[0.55, 0.04, 0.04]} />
          <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0.3, 0.78, 0.06]}>
          <boxGeometry args={[0.22, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#0A0E0F"
            emissive={BOLT_EMISSIVE}
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}

export function WashingMachineMesh({
  lowPower,
  spin = true,
}: {
  lowPower: boolean;
  spin?: boolean;
}) {
  const drum = useRef<Group>(null);
  const body = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!spin) return;
    if (drum.current) drum.current.rotation.z += delta * 2.4;
    if (body.current) {
      // Subtle spin-cycle shake
      const t = state.clock.elapsedTime;
      body.current.rotation.z = Math.sin(t * 8) * 0.012;
      body.current.position.x = Math.sin(t * 10) * 0.008;
    }
  });

  return (
    <group ref={body}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.15, 1.25, 0.8]} />
        <meshStandardMaterial {...SILVER} />
        {!lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      {/* Control panel */}
      <mesh position={[0, 0.52, 0.41]}>
        <boxGeometry args={[1.05, 0.14, 0.04]} />
        <meshStandardMaterial color="#1B2225" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[-0.32, 0.52, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.05, 16]} />
        <meshStandardMaterial
          color={LIME}
          emissive={BOLT_EMISSIVE}
          emissiveIntensity={0.65}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.2, 0.52, 0.44]}>
        <boxGeometry args={[0.35, 0.05, 0.02]} />
        <meshStandardMaterial
          color="#0A0E0F"
          emissive={BOLT_EMISSIVE}
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Door glass */}
      <mesh position={[0, -0.08, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.07, 32]} />
        <meshStandardMaterial
          color="#1B2225"
          metalness={0.2}
          roughness={0.12}
          transparent
          opacity={0.65}
        />
      </mesh>
      <mesh position={[0, -0.08, 0.45]}>
        <torusGeometry args={[0.34, 0.03, 8, 32]} />
        <meshStandardMaterial color="#CFCACE" metalness={0.9} roughness={0.28} />
      </mesh>
      <group ref={drum} position={[0, -0.08, 0.44]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 4) * Math.PI * 2) * 0.18,
              Math.sin((i / 4) * Math.PI * 2) * 0.18,
              0.02,
            ]}
            rotation={[0, 0, (i / 4) * Math.PI * 2]}
          >
            <boxGeometry args={[0.05, 0.16, 0.025]} />
            <meshStandardMaterial
              color={LIME}
              emissive={BOLT_EMISSIVE}
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color={BOLT_EMISSIVE}
            emissive={BOLT_EMISSIVE}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}

export function RefrigeratorMesh({
  lowPower,
  animate = true,
}: {
  lowPower: boolean;
  animate?: boolean;
}) {
  const topDoor = useRef<Group>(null);
  const bottomDoor = useRef<Group>(null);
  const glow = useRef<Mesh>(null);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    // Top door opens on a slower cycle than bottom
    if (topDoor.current) {
      const open = Math.max(0, Math.sin(t * 0.4));
      topDoor.current.rotation.y = open * 0.7;
    }
    if (bottomDoor.current) {
      const open = Math.max(0, Math.sin(t * 0.4 + 1.8));
      bottomDoor.current.rotation.y = open * 0.55;
    }
    if (glow.current) {
      const mat = glow.current.material as import("three").MeshStandardMaterial;
      if (mat) {
        const open =
          Math.max(0, Math.sin(t * 0.4)) + Math.max(0, Math.sin(t * 0.4 + 1.8));
        mat.emissiveIntensity = 0.15 + open * 0.55;
      }
    }
  });

  return (
    <group>
      {/* Cabinet shell */}
      <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
        <boxGeometry args={[1.0, 1.95, 0.7]} />
        <meshStandardMaterial {...SILVER} />
        {!lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      {/* Interior glow when doors open */}
      <mesh ref={glow} position={[0, 0.15, 0.1]}>
        <boxGeometry args={[0.85, 1.7, 0.4]} />
        <meshStandardMaterial
          color="#0F1517"
          emissive={BOLT_EMISSIVE}
          emissiveIntensity={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Top door (hinged on left) */}
      <group ref={topDoor} position={[-0.48, 0.5, 0.32]}>
        <mesh castShadow position={[0.48, 0, 0]}>
          <boxGeometry args={[0.96, 0.9, 0.08]} />
          <meshStandardMaterial {...SILVER} metalness={0.88} roughness={0.28} />
        </mesh>
        <mesh position={[0.85, 0.05, 0.05]}>
          <boxGeometry args={[0.04, 0.35, 0.04]} />
          <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      {/* Bottom door */}
      <group ref={bottomDoor} position={[-0.48, -0.48, 0.32]}>
        <mesh castShadow position={[0.48, 0, 0]}>
          <boxGeometry args={[0.96, 0.88, 0.08]} />
          <meshStandardMaterial {...SILVER} metalness={0.88} roughness={0.28} />
        </mesh>
        <mesh position={[0.85, 0.05, 0.05]}>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      {/* Seam */}
      <mesh position={[0, 0.05, 0.36]}>
        <boxGeometry args={[0.98, 0.03, 0.02]} />
        <meshStandardMaterial color="#2C3640" />
      </mesh>
    </group>
  );
}

export function Dishwasher(
  props: Omit<SelectableProps, "children" | "id"> & {
    scale?: number;
    animate?: boolean;
  },
) {
  return (
    <Selectable id="dishwasher" {...props}>
      <DishwasherMesh lowPower={props.lowPower} animate={props.animate} />
    </Selectable>
  );
}

export function WashingMachine(
  props: Omit<SelectableProps, "children" | "id"> & {
    scale?: number;
    spin?: boolean;
  },
) {
  return (
    <Selectable id="washing-machine" {...props}>
      <WashingMachineMesh lowPower={props.lowPower} spin={props.spin} />
    </Selectable>
  );
}

export function Refrigerator(
  props: Omit<SelectableProps, "children" | "id"> & {
    scale?: number;
    animate?: boolean;
  },
) {
  return (
    <Selectable id="refrigerator" {...props}>
      <RefrigeratorMesh lowPower={props.lowPower} animate={props.animate} />
    </Selectable>
  );
}
