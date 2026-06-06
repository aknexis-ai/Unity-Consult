"use client";

/* ============================================================
   AURORA HERO — React Three Fiber WebGL scene.
   A refractive crystal core lit by three orbiting aurora lights,
   ambient sparkles, gentle float + pointer parallax, soft bloom.
   Mounts only when WebGL is available, motion is allowed, and the
   viewport is wide enough; otherwise the CSS fallback shows through
   (transparent canvas).
   ============================================================ */

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function OrbitingLight({ color, radius, speed, phase, y }: { color: string; radius: number; speed: number; phase: number; y: number }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, y + Math.sin(t * 0.7) * 0.6, Math.sin(t) * radius);
    }
  });
  return <pointLight ref={ref} color={color} intensity={28} distance={12} />;
}

function Core() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    // pointer parallax — ease group toward cursor
    const px = state.pointer.x;
    const py = state.pointer.y;
    group.current.rotation.y += (px * 0.5 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-py * 0.35 - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group} position={[1.35, 0, 0]}>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
        {/* jewel core — metallic, reflects the aurora lights as colored speculars */}
        <Icosahedron args={[1.55, 14]}>
          <MeshDistortMaterial
            color="#041918"
            roughness={0.12}
            metalness={0.92}
            distort={0.34}
            speed={1.7}
            emissive="#2F9E44"
            emissiveIntensity={0.35}
          />
        </Icosahedron>
        {/* faint wire shell for depth */}
        <Icosahedron args={[2.5, 1]}>
          <meshBasicMaterial color="#48CAE4" wireframe transparent opacity={0.07} />
        </Icosahedron>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <OrbitingLight color="#48CAE4" radius={4} speed={0.55} phase={0} y={0.4} />
      <OrbitingLight color="#8E7BFF" radius={3.4} speed={0.7} phase={2.1} y={-0.3} />
      <OrbitingLight color="#8E7BFF" radius={4.2} speed={0.45} phase={4.2} y={0.8} />
      <Core />
      <Sparkles count={70} scale={[12, 7, 5]} position={[1, 0, 0]} size={2.2} speed={0.3} color="#fefaf6" opacity={0.55} />
      <EffectComposer>
        <Bloom intensity={0.95} luminanceThreshold={0.18} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
      </EffectComposer>
    </>
  );
}

function useShould3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 760px)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      webgl = false;
    }
    setOk(webgl && !reduce && !narrow);
  }, []);
  return ok;
}

export default function AuroraHero() {
  const ok = useShould3D();
  const dpr = useMemo<[number, number]>(() => [1, 1.6], []);
  if (!ok) return null; // CSS fallback renders behind this slot

  return (
    <Canvas
      dpr={dpr}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}
