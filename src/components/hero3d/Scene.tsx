"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import type { ServiceId } from "@/config/business";
import { Dishwasher, Refrigerator, WashingMachine } from "./Appliances";
import { AMBIENT, EMERALD, LIME } from "./materials";

type SceneProps = {
  lowPower: boolean;
  reducedMotion: boolean;
  onSelectAppliance: (id: ServiceId) => void;
};

const INTRO_MS = 1400;

/** Simple arc — three appliances, soft float, nothing else. */
const SLOTS: {
  id: ServiceId;
  x: number;
  y: number;
  z: number;
  rotY: number;
  scale: number;
}[] = [
  { id: "dishwasher", x: -1.35, y: -0.25, z: 0.1, rotY: 0.22, scale: 0.85 },
  { id: "washing-machine", x: 0.05, y: -0.1, z: 0.35, rotY: 0, scale: 0.95 },
  { id: "refrigerator", x: 1.35, y: 0.05, z: 0.05, rotY: -0.22, scale: 0.8 },
];

export function Scene({
  lowPower,
  reducedMotion,
  onSelectAppliance,
}: SceneProps) {
  const root = useRef<Group>(null);
  const carriers = useRef<(Group | null)[]>([]);
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const [intro, setIntro] = useState(reducedMotion ? 1 : 0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setIntro(1);
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (start.current === null) start.current = now;
      const p = Math.min(1, (now - start.current) / INTRO_MS);
      setIntro(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (reducedMotion) return;
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const heroH = Math.max(size.height, 1);
    const scrollT = Math.min(1, scrollY / heroH);
    const wide = size.width >= 768;

    if (root.current) {
      const targetY = scrollT * (-14 * (Math.PI / 180));
      root.current.rotation.y += (targetY - root.current.rotation.y) * 0.06;
    }

    carriers.current.forEach((carrier, i) => {
      if (!carrier) return;
      const slot = SLOTS[i];
      if (!slot) return;
      const bob = reducedMotion ? 0 : Math.sin(t * 0.7 + i * 1.4) * 0.05;
      const rise = intro;

      carrier.position.set(
        slot.x,
        slot.y + bob - (1 - rise) * 1.2,
        slot.z,
      );
      carrier.rotation.set(0, slot.rotY, 0);
      carrier.scale.setScalar(slot.scale * rise);
    });

    if (!reducedMotion) {
      const yaw = pointer.current.x * (4 * (Math.PI / 180));
      const pitch = pointer.current.y * (2 * (Math.PI / 180));
      camera.rotation.y += (yaw - camera.rotation.y) * 0.04;
      camera.rotation.x += (-pitch - camera.rotation.x) * 0.04;
    }

    camera.position.x = wide ? 1.0 : 0.25;
    camera.position.y = wide ? 0.45 : 0.3;
    camera.position.z = (wide ? 5.3 : 6.4) + scrollT * 0.5;
  });

  const animate = !reducedMotion;

  return (
    <>
      <color attach="background" args={["#0A0E0F"]} />
      <ambientLight color={AMBIENT} intensity={0.55} />
      <directionalLight
        position={[-3, 5, 3]}
        intensity={1.15}
        color="#F1F3F2"
        castShadow={!lowPower}
      />
      <directionalLight position={[3, 2, -2]} intensity={0.45} color={LIME} />
      <directionalLight
        position={[-1.5, -1, 1.5]}
        intensity={0.25}
        color={EMERALD}
      />

      <Environment resolution={lowPower ? 64 : 256}>
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[-4, 3, 2]}
          scale={[4, 2, 1]}
          color="#CFCACE"
        />
        <Lightformer
          form="ring"
          intensity={0.7}
          position={[2, 1, -2]}
          scale={3}
          color={LIME}
        />
      </Environment>

      <group ref={root} position={[0.55, -0.2, 0]}>
        {SLOTS.map((slot, i) => (
          <group
            key={slot.id}
            ref={(el) => {
              carriers.current[i] = el;
            }}
          >
            {slot.id === "washing-machine" ? (
              <WashingMachine
                lowPower={lowPower}
                onSelect={onSelectAppliance}
                scale={1}
                spin={animate}
              />
            ) : null}
            {slot.id === "refrigerator" ? (
              <Refrigerator
                lowPower={lowPower}
                onSelect={onSelectAppliance}
                scale={1}
                animate={animate}
              />
            ) : null}
            {slot.id === "dishwasher" ? (
              <Dishwasher
                lowPower={lowPower}
                onSelect={onSelectAppliance}
                scale={1}
                animate={animate}
              />
            ) : null}
          </group>
        ))}
      </group>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.4, -1.4, 0]}
        receiveShadow
      >
        <circleGeometry args={[7, 48]} />
        <meshStandardMaterial color="#050809" roughness={0.95} metalness={0.05} />
      </mesh>

      {!lowPower ? (
        <ContactShadows
          position={[0.4, -1.39, 0]}
          opacity={0.5}
          scale={12}
          blur={2.6}
          far={4}
          color="#000000"
        />
      ) : null}

      {!lowPower ? (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.85}
            luminanceSmoothing={0.35}
            intensity={0.4}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </>
  );
}
