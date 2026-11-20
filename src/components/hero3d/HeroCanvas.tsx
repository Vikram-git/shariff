"use client";

import { Canvas } from "@react-three/fiber";
import {
  Component,
  useCallback,
  type ErrorInfo,
  type ReactNode,
} from "react";
import type { ServiceId } from "@/config/business";
import { Poster } from "./Poster";
import { Scene } from "./Scene";

type HeroCanvasProps = {
  lowPower: boolean;
  reducedMotion: boolean;
  visible: boolean;
  onSelectAppliance: (id: ServiceId) => void;
  onError: () => void;
};

class CanvasErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return <Poster />;
    return this.props.children;
  }
}

export function HeroCanvas({
  lowPower,
  reducedMotion,
  visible,
  onSelectAppliance,
  onError,
}: HeroCanvasProps) {
  const handleCreated = useCallback(
    ({ gl }: { gl: { getContext: () => WebGLRenderingContext | null } }) => {
      const ctx = gl.getContext();
      if (!ctx) onError();
    },
    [onError],
  );

  return (
    <CanvasErrorBoundary onError={onError}>
      <Canvas
        aria-hidden
        dpr={[1, 1.75]}
        camera={{ position: [0.4, 0.55, 5.4], fov: 46, near: 0.1, far: 50 }}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: lowPower ? "low-power" : "default",
          failIfMajorPerformanceCaveat: false,
        }}
        frameloop={visible ? "always" : "never"}
        onCreated={handleCreated}
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
        onPointerMissed={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <Scene
          lowPower={lowPower}
          reducedMotion={reducedMotion}
          onSelectAppliance={onSelectAppliance}
        />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
