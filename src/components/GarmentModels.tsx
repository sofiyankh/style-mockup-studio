import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export type GarmentId = "tee" | "hoodie" | "jeans" | "puffer";

const FABRIC = {
  black: "#111214",
  charcoal: "#252629",
  denim: "#536b80",
  denimDark: "#344655",
  cream: "#d8d2c5",
  lining: "#8f938e",
  metal: "#bababa",
};

function FabricMaterial({ color, sheen = 0.15 }: { color: string; sheen?: number }) {
  const bump = useMemo(() => {
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const i = (y * size + x) * 4;
        const weave = ((x * 7 + y * 11) % 17) * 5 + (x % 3) * 18;
        data[i] = weave;
        data[i + 1] = weave;
        data[i + 2] = weave;
        data[i + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(7, 9);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.78}
      metalness={0}
      sheen={sheen}
      sheenRoughness={0.82}
      bumpMap={bump}
      bumpScale={0.018}
    />
  );
}

function Stitch({ points, color = FABRIC.lining }: { points: THREE.Vector3[]; color?: string }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 36, 0.012, 5, false]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function DisplayStand() {
  return (
    <group>
      <mesh position={[0, -2.76, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.28, 0.13, 64]} />
        <meshPhysicalMaterial color="#bebbb4" roughness={0.18} metalness={0.05} clearcoat={0.65} />
      </mesh>
      <mesh position={[0, -2.66, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.5, 0.14, 48]} />
        <meshStandardMaterial color="#26272a" roughness={0.3} />
      </mesh>
    </group>
  );
}

function OversizedTee() {
  return (
    <group position={[0, 0.1, 0]}>
      <RoundedBox args={[2.75, 2.85, 0.38]} radius={0.18} smoothness={5} position={[0, -0.2, 0]} castShadow>
        <FabricMaterial color={FABRIC.cream} />
      </RoundedBox>
      <RoundedBox args={[1.28, 1.28, 0.36]} radius={0.18} smoothness={5} position={[-1.65, 0.55, 0]} rotation-z={-0.28} castShadow>
        <FabricMaterial color={FABRIC.cream} />
      </RoundedBox>
      <RoundedBox args={[1.28, 1.28, 0.36]} radius={0.18} smoothness={5} position={[1.65, 0.55, 0]} rotation-z={0.28} castShadow>
        <FabricMaterial color={FABRIC.cream} />
      </RoundedBox>
      <mesh position={[0, 1.2, 0.12]} rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[0.42, 0.1, 16, 64]} />
        <FabricMaterial color={FABRIC.cream} />
      </mesh>
      <Stitch points={[new THREE.Vector3(-1.22, -1.6, 0.22), new THREE.Vector3(0, -1.65, 0.22), new THREE.Vector3(1.22, -1.6, 0.22)]} />
      <Stitch points={[new THREE.Vector3(-0.38, 1.17, 0.23), new THREE.Vector3(0, 1.05, 0.3), new THREE.Vector3(0.38, 1.17, 0.23)]} />
    </group>
  );
}

function Hoodie() {
  return (
    <group position={[0, -0.05, 0]}>
      <RoundedBox args={[2.85, 3.05, 0.62]} radius={0.26} smoothness={6} position={[0, -0.18, 0]} castShadow>
        <FabricMaterial color={FABRIC.charcoal} sheen={0.08} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.68, 0.05, 0]} rotation-z={side * -0.12}>
          <RoundedBox args={[0.9, 2.75, 0.58]} radius={0.24} smoothness={6} castShadow>
            <FabricMaterial color={FABRIC.charcoal} sheen={0.08} />
          </RoundedBox>
          <RoundedBox args={[0.94, 0.28, 0.61]} radius={0.1} smoothness={4} position={[0, -1.45, 0]} castShadow>
            <FabricMaterial color={FABRIC.black} />
          </RoundedBox>
        </group>
      ))}
      <mesh position={[0, 1.25, -0.1]} rotation-x={-0.12} castShadow>
        <sphereGeometry args={[0.92, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <FabricMaterial color={FABRIC.charcoal} sheen={0.08} />
      </mesh>
      <mesh position={[0, 0.95, 0.5]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.52, 0.055, 12, 64]} />
        <meshStandardMaterial color={FABRIC.black} roughness={0.85} />
      </mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.39]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 1.55, 8]} />
          <meshStandardMaterial color={FABRIC.lining} roughness={0.75} />
        </mesh>
      ))}
      <RoundedBox args={[1.55, 0.7, 0.24]} radius={0.22} smoothness={5} position={[0, -0.7, 0.42]} castShadow>
        <FabricMaterial color={FABRIC.charcoal} />
      </RoundedBox>
      <RoundedBox args={[2.78, 0.3, 0.63]} radius={0.1} smoothness={4} position={[0, -1.72, 0]}>
        <FabricMaterial color={FABRIC.black} />
      </RoundedBox>
    </group>
  );
}

function BaggyJeans() {
  return (
    <group position={[0, -0.25, 0]}>
      <RoundedBox args={[2.32, 0.8, 0.55]} radius={0.2} smoothness={5} position={[0, 1.1, 0]} castShadow>
        <FabricMaterial color={FABRIC.denim} sheen={0.02} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.61, -0.45, 0]} rotation-z={side * 0.035}>
          <RoundedBox args={[1.12, 3.55, 0.58]} radius={0.2} smoothness={5} castShadow>
            <FabricMaterial color={FABRIC.denim} sheen={0.02} />
          </RoundedBox>
          <Stitch points={[new THREE.Vector3(side * -0.32, -1.68, 0.31), new THREE.Vector3(side * -0.3, 0, 0.31), new THREE.Vector3(side * -0.28, 1.45, 0.31)]} color="#a9a18c" />
          <RoundedBox args={[1.16, 0.22, 0.59]} radius={0.08} smoothness={3} position={[0, -1.8, 0]}>
            <FabricMaterial color={FABRIC.denimDark} />
          </RoundedBox>
        </group>
      ))}
      <RoundedBox args={[2.3, 0.28, 0.59]} radius={0.08} smoothness={4} position={[0, 1.43, 0]}>
        <FabricMaterial color={FABRIC.denimDark} />
      </RoundedBox>
      <mesh position={[0.72, 1.44, 0.32]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.075, 0.075, 0.04, 24]} />
        <meshStandardMaterial color={FABRIC.metal} metalness={0.85} roughness={0.25} />
      </mesh>
      <Stitch points={[new THREE.Vector3(-1.03, 0.95, 0.31), new THREE.Vector3(-0.65, 0.65, 0.35), new THREE.Vector3(-0.2, 0.95, 0.31)]} color="#a9a18c" />
      <Stitch points={[new THREE.Vector3(1.03, 0.95, 0.31), new THREE.Vector3(0.65, 0.65, 0.35), new THREE.Vector3(0.2, 0.95, 0.31)]} color="#a9a18c" />
    </group>
  );
}

function PufferJacket() {
  return (
    <group position={[0, -0.02, 0]}>
      {Array.from({ length: 7 }).map((_, i) => (
        <RoundedBox key={i} args={[2.95 - i * 0.03, 0.5, 0.78]} radius={0.22} smoothness={6} position={[0, 1.15 - i * 0.48, 0]} castShadow>
          <FabricMaterial color={FABRIC.black} sheen={0.55} />
        </RoundedBox>
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.7, 0.02, 0]} rotation-z={side * -0.12}>
          {Array.from({ length: 6 }).map((_, i) => (
            <RoundedBox key={i} args={[0.82, 0.58, 0.7]} radius={0.23} smoothness={6} position={[0, 1.1 - i * 0.52, 0]} castShadow>
              <FabricMaterial color={FABRIC.black} sheen={0.55} />
            </RoundedBox>
          ))}
        </group>
      ))}
      <mesh position={[0, 1.43, 0]} rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[0.5, 0.24, 18, 64]} />
        <FabricMaterial color={FABRIC.black} sheen={0.55} />
      </mesh>
      <mesh position={[0, -0.25, 0.42]}>
        <boxGeometry args={[0.075, 3.05, 0.055]} />
        <meshStandardMaterial color={FABRIC.metal} metalness={0.75} roughness={0.28} />
      </mesh>
      <RoundedBox args={[0.92, 0.42, 0.12]} radius={0.06} smoothness={3} position={[-0.76, 0.69, 0.45]}>
        <meshStandardMaterial color="#e8e4db" roughness={0.72} />
      </RoundedBox>
    </group>
  );
}

export function GarmentModel({ garment }: { garment: GarmentId }) {
  return (
    <group>
      <DisplayStand />
      {garment === "tee" && <OversizedTee />}
      {garment === "hoodie" && <Hoodie />}
      {garment === "jeans" && <BaggyJeans />}
      {garment === "puffer" && <PufferJacket />}
    </group>
  );
}