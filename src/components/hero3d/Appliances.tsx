"use client";

import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import type { Group } from "three";
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
    const target = hovered ? scale * 1.06 : scale;
    g.scale.x += (target - g.scale.x) * 0.12;
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

export function WashingMachineMesh({
  lowPower,
  spin = true,
}: {
  lowPower: boolean;
  spin?: boolean;
}) {
  const drum = useRef<Group>(null);

  useFrame((_, delta) => {
    if (spin && drum.current) drum.current.rotation.z += delta * 1.2;
  });

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.05, 1.15, 0.75]} />
        <meshStandardMaterial {...SILVER} />
        {!lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      <mesh position={[0, -0.05, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 32]} />
        <meshStandardMaterial
          color="#1B2225"
          metalness={0.2}
          roughness={0.15}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh position={[0, -0.05, 0.41]}>
        <torusGeometry args={[0.28, 0.025, 8, 32]} />
        <meshStandardMaterial color="#CFCACE" metalness={0.9} roughness={0.3} />
      </mesh>
      <group ref={drum} position={[0, -0.05, 0.42]}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 0.14,
              Math.sin((i / 3) * Math.PI * 2) * 0.14,
              0,
            ]}
            rotation={[0, 0, (i / 3) * Math.PI * 2]}
          >
            <boxGeometry args={[0.04, 0.12, 0.02]} />
            <meshStandardMaterial color={LIME} metalness={0.4} roughness={0.4} />
          </mesh>
        ))}
      </group>
      <mesh position={[-0.28, 0.42, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial
          color={LIME}
          emissive={BOLT_EMISSIVE}
          emissiveIntensity={0.4}
        />
      </mesh>
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
  const door = useRef<Group>(null);

  useFrame((state) => {
    if (!animate || !door.current) return;
    const open = Math.max(0, Math.sin(state.clock.elapsedTime * 0.35)) * 0.45;
    door.current.rotation.y = open;
  });

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.95, 1.85, 0.7]} />
        <meshStandardMaterial {...SILVER} />
        {!lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      <group ref={door} position={[-0.45, 0.1, 0.36]}>
        <mesh position={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 1.7, 0.06]} />
          <meshStandardMaterial {...SILVER} metalness={0.88} roughness={0.3} />
        </mesh>
        <mesh position={[0.78, 0.2, 0.04]}>
          <boxGeometry args={[0.04, 0.35, 0.04]} />
          <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      <mesh position={[0, 0.15, 0.36]}>
        <boxGeometry args={[0.9, 0.02, 0.02]} />
        <meshStandardMaterial color="#2C3640" />
      </mesh>
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

  useFrame((state) => {
    if (!animate || !door.current) return;
    door.current.rotation.x =
      (Math.sin(state.clock.elapsedTime * 0.4) + 1) * 0.25;
  });

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.05, -0.02]}>
        <boxGeometry args={[1.1, 0.9, 0.7]} />
        <meshStandardMaterial {...SILVER} />
        {!lowPower ? <Edges threshold={15} color={EDGE} /> : null}
      </mesh>
      <group ref={door} position={[0, -0.35, 0.32]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.05, 0.82, 0.05]} />
          <meshStandardMaterial {...SILVER} metalness={0.88} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.65, 0.04]}>
          <boxGeometry args={[0.45, 0.04, 0.03]} />
          <meshStandardMaterial color="#9D9EA2" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      <mesh position={[0.28, 0.4, 0.34]}>
        <boxGeometry args={[0.28, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#0A0E0F"
          emissive={BOLT_EMISSIVE}
          emissiveIntensity={0.3}
        />
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
