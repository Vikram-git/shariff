"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import type { ServiceId } from "@/config/business";
import { Dishwasher, Refrigerator, WashingMachine } from "./Appliances";
import { Bolt } from "./Bolt";
import { AMBIENT, BOLT_EMISSIVE, EMERALD, LIME } from "./materials";
import { Wrench } from "./Wrench";

type SceneProps = {
  lowPower: boolean;
  reducedMotion: boolean;
  onSelectAppliance: (id: ServiceId) => void;
};

const INTRO_MS = 1400;
const HOLD_S = 3.2;
const BLEND_S = 1.1;
const CYCLE_S = HOLD_S + BLEND_S;

const ORDER: ServiceId[] = [
  "washing-machine",
  "refrigerator",
  "dishwasher",
];

/** Hero stage vs two background parks. */
const STAGE = { x: 0.15, y: -0.1, z: 0.55, scale: 1.05, rotY: -0.12 };
const PARKS = [
  { x: -1.7, y: -0.25, z: -0.55, scale: 0.48, rotY: 0.45 },
  { x: 1.75, y: -0.05, z: -0.65, scale: 0.48, rotY: -0.45 },
] as const;

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function Scene({
  lowPower,
  reducedMotion,
  onSelectAppliance,
}: SceneProps) {
  const root = useRef<Group>(null);
  const carriers = useRef<(Group | null)[]>([]);
  const beam = useRef<Mesh>(null);
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
      const targetY = scrollT * (-16 * (Math.PI / 180));
      root.current.rotation.y += (targetY - root.current.rotation.y) * 0.07;
    }

    // Which appliance is hero, which are parking
    const cycleT = reducedMotion ? 0 : t;
    const cycleIndex = Math.floor(cycleT / CYCLE_S) % 3;
    const nextIndex = (cycleIndex + 1) % 3;
    const local = cycleT % CYCLE_S;
    const blending = local > HOLD_S;
    const blend = blending ? smoothstep((local - HOLD_S) / BLEND_S) : 0;

    // Map each appliance to stage or a park slot
    // Hero (cycleIndex) → stage, next → coming to stage during blend,
    // the other sits in park.
    const roles: Record<
      ServiceId,
      { x: number; y: number; z: number; scale: number; rotY: number }
    > = {
      "washing-machine": { ...PARKS[0] },
      refrigerator: { ...PARKS[1] },
      dishwasher: { ...PARKS[0] },
    };

    const heroId = ORDER[cycleIndex]!;
    const nextId = ORDER[nextIndex]!;
    const otherId = ORDER.find((id) => id !== heroId && id !== nextId)!;

    // Assign parks: other stays in park 0, next starts in park 1 then moves to stage
    roles[otherId] = { ...PARKS[0] };
    roles[heroId] = {
      x: lerp(STAGE.x, PARKS[1].x, blend),
      y: lerp(STAGE.y, PARKS[1].y, blend),
      z: lerp(STAGE.z, PARKS[1].z, blend),
      scale: lerp(STAGE.scale, PARKS[1].scale, blend),
      rotY: lerp(STAGE.rotY, PARKS[1].rotY, blend),
    };
    roles[nextId] = {
      x: lerp(PARKS[1].x, STAGE.x, blend),
      y: lerp(PARKS[1].y, STAGE.y, blend),
      z: lerp(PARKS[1].z, STAGE.z, blend),
      scale: lerp(PARKS[1].scale, STAGE.scale, blend),
      rotY: lerp(PARKS[1].rotY, STAGE.rotY, blend),
    };

    if (reducedMotion) {
      roles["washing-machine"] = { ...STAGE };
      roles.refrigerator = { ...PARKS[0] };
      roles.dishwasher = { ...PARKS[1] };
    }

    ORDER.forEach((id, i) => {
      const carrier = carriers.current[i];
      if (!carrier) return;
      const target = roles[id];
      const bob = reducedMotion ? 0 : Math.sin(t * 0.9 + i * 2.1) * 0.04;
      const rise = intro;

      carrier.position.x += (target.x - carrier.position.x) * 0.12;
      carrier.position.y +=
        (target.y - (1 - rise) * 1.4 + bob - carrier.position.y) * 0.12;
      carrier.position.z += (target.z - carrier.position.z) * 0.12;
      carrier.rotation.y += (target.rotY - carrier.rotation.y) * 0.1;
      carrier.rotation.x = (1 - rise) * 0.25;
      const s = target.scale * rise;
      carrier.scale.x += (s - carrier.scale.x) * 0.12;
      carrier.scale.y = carrier.scale.x;
      carrier.scale.z = carrier.scale.x;
    });

    if (beam.current) {
      const focus = blending
        ? {
            x: lerp(STAGE.x, STAGE.x, 0.5),
            z: lerp(roles[heroId].z, roles[nextId].z, blend),
          }
        : { x: STAGE.x, z: STAGE.z };
      beam.current.position.x += (focus.x - beam.current.position.x) * 0.1;
      beam.current.position.z += (focus.z - 0.1 - beam.current.position.z) * 0.1;
      const mat = beam.current.material as import("three").MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = reducedMotion
          ? 0.4
          : 0.5 + Math.sin(t * 2.5) * 0.2 + blend * 0.25;
      }
      beam.current.scale.setScalar(intro * (blending ? 1.15 : 1));
    }

    if (!reducedMotion) {
      const yaw = pointer.current.x * (5 * (Math.PI / 180));
      const pitch = pointer.current.y * (2.5 * (Math.PI / 180));
      camera.rotation.y += (yaw - camera.rotation.y) * 0.04;
      camera.rotation.x += (-pitch - camera.rotation.x) * 0.04;
    }

    camera.position.x = wide ? 1.05 : 0.25;
    camera.position.y = wide ? 0.5 : 0.3;
    camera.position.z = (wide ? 5.4 : 6.5) + scrollT * 0.55;
  });

  const animate = !reducedMotion;

  return (
    <>
      <color attach="background" args={["#0A0E0F"]} />
      <ambientLight color={AMBIENT} intensity={0.5} />
      <directionalLight
        position={[-3, 5, 3]}
        intensity={1.15}
        color="#F1F3F2"
        castShadow={!lowPower}
      />
      <directionalLight position={[3, 2, -2]} intensity={0.5} color={LIME} />
      <directionalLight
        position={[-2, -1, 1.5]}
        intensity={0.3}
        color={EMERALD}
      />
      <spotLight
        position={[0.3, 3.5, 2.8]}
        angle={0.42}
        penumbra={0.7}
        intensity={1.4}
        color="#F1F3F2"
        castShadow={!lowPower}
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
          intensity={0.85}
          position={[2, 1, -1.5]}
          scale={3}
          color={LIME}
        />
        <Lightformer
          form="circle"
          intensity={0.45}
          position={[-2, -2, 1]}
          scale={2}
          color={EMERALD}
        />
      </Environment>

      <group ref={root} position={[0.6, -0.25, 0]}>
        {/* Stage floor pad */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0.15, -1.2, 0.4]}
          receiveShadow
        >
          <circleGeometry args={[1.35, 48]} />
          <meshStandardMaterial
            color="#0F1517"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh
          ref={beam}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0.15, -1.18, 0.45]}
        >
          <circleGeometry args={[0.7, 32]} />
          <meshStandardMaterial
            color={LIME}
            emissive={BOLT_EMISSIVE}
            emissiveIntensity={0.55}
            transparent
            opacity={0.5}
          />
        </mesh>

        {ORDER.map((id, i) => (
          <group
            key={id}
            ref={(el) => {
              carriers.current[i] = el;
            }}
            position={[PARKS[i % 2]!.x, PARKS[i % 2]!.y - 2, PARKS[i % 2]!.z]}
            scale={0.01}
          >
            {id === "washing-machine" ? (
              <WashingMachine
                lowPower={lowPower}
                onSelect={onSelectAppliance}
                scale={1}
                spin={animate}
              />
            ) : null}
            {id === "refrigerator" ? (
              <Refrigerator
                lowPower={lowPower}
                onSelect={onSelectAppliance}
                scale={1}
                animate={animate}
              />
            ) : null}
            {id === "dishwasher" ? (
              <Dishwasher
                lowPower={lowPower}
                onSelect={onSelectAppliance}
                scale={1}
                animate={animate}
              />
            ) : null}
          </group>
        ))}

        <Wrench reducedMotion={reducedMotion} intro={intro} />
        <Bolt reducedMotion={reducedMotion} lowPower={lowPower} intro={intro} />
      </group>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.4, -1.55, 0]}
        receiveShadow
      >
        <circleGeometry args={[8, 48]} />
        <meshStandardMaterial color="#050809" roughness={0.95} metalness={0.05} />
      </mesh>

      {!lowPower ? (
        <ContactShadows
          position={[0.4, -1.54, 0]}
          opacity={0.55}
          scale={14}
          blur={2.8}
          far={5}
          color="#000000"
        />
      ) : null}

      {!lowPower ? (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.78}
            luminanceSmoothing={0.35}
            intensity={0.6}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </>
  );
}
