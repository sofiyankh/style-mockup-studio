import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, ContactShadows } from "@react-three/drei";
import { ChevronLeft, ChevronRight, Rotate3D, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { GarmentModel, type GarmentId } from "./GarmentModels";

const GARMENTS: Array<{ id: GarmentId; name: string; category: string; color: string; note: string }> = [
  { id: "tee", name: "Boxer Tee", category: "Oversized jersey", color: "Bone", note: "420 GSM cotton" },
  { id: "hoodie", name: "Weight Hoodie", category: "Oversized fleece", color: "Graphite", note: "Brushed heavyweight" },
  { id: "jeans", name: "Volume Jean", category: "Baggy denim", color: "Washed indigo", note: "14 oz denim" },
  { id: "puffer", name: "Nuptse Puffer", category: "The North Face", color: "Black", note: "700-fill silhouette" },
];

function StudioScene({ garment }: { garment: GarmentId }) {
  return (
    <>
      <color attach="background" args={["#d7d5d0"]} />
      <fog attach="fog" args={["#d7d5d0", 9, 16]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[-4, 5, 3]} intensity={45} angle={0.55} penumbra={0.85} color="#eff5ff" />
      <GarmentModel garment={garment} />
      <ContactShadows position={[0, -2.7, 0]} opacity={0.42} scale={8} blur={2.6} far={5} color="#363636" />
      <mesh rotation-x={-Math.PI / 2} position={[0, -2.82, 0]} receiveShadow>
        <circleGeometry args={[8, 96]} />
        <meshStandardMaterial color="#d7d5d0" roughness={0.88} />
      </mesh>
      <Environment resolution={256}>
        <Lightformer intensity={2.5} position={[0, 5, 3]} scale={[4, 4, 1]} />
        <Lightformer intensity={1.5} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer intensity={1.1} position={[5, 0, -2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} enablePan={false} minDistance={5.4} maxDistance={9} minPolarAngle={Math.PI * 0.25} maxPolarAngle={Math.PI * 0.62} target={[0, -0.15, 0]} />
    </>
  );
}

function GarmentSelector({ selected, onSelect }: { selected: GarmentId; onSelect: (id: GarmentId) => void }) {
  return (
    <div className="showroom-selector" aria-label="Select a garment">
      {GARMENTS.map((garment, index) => (
        <button
          key={garment.id}
          type="button"
          className="garment-option"
          data-active={selected === garment.id}
          onClick={() => onSelect(garment.id)}
          aria-pressed={selected === garment.id}
        >
          <span className="garment-index">0{index + 1}</span>
          <span className="garment-option-copy">
            <strong>{garment.name}</strong>
            <small>{garment.category}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

export function GarmentViewer() {
  const [selected, setSelected] = useState<GarmentId>("tee");
  const currentIndex = GARMENTS.findIndex((item) => item.id === selected);
  const current = GARMENTS[currentIndex] ?? GARMENTS[0];
  const move = (direction: number) => {
    const next = (currentIndex + direction + GARMENTS.length) % GARMENTS.length;
    const garment = GARMENTS[next];
    if (garment) setSelected(garment.id);
  };

  return (
    <main className="showroom-shell">
      <header className="showroom-header">
        <a href="/" className="wordmark" aria-label="Form Archive home">FORM/ARCHIVE</a>
        <div className="collection-label">Digital Sample Room · 001</div>
        <div className="header-actions">
          <button type="button" className="icon-control" aria-label="Search"><Search size={18} strokeWidth={1.6} /></button>
          <button type="button" className="icon-control" aria-label="Collection bag"><ShoppingBag size={18} strokeWidth={1.6} /></button>
        </div>
      </header>

      <section className="viewer-stage" aria-label={`${current.name} 3D viewer`}>
        <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.2, 7.2], fov: 40 }} gl={{ antialias: true }}>
          <StudioScene garment={selected} />
        </Canvas>
        <div className="viewer-instruction"><Rotate3D size={16} /> Drag to inspect · Pinch to zoom</div>
        <div className="viewer-count">0{currentIndex + 1} <span>/ 04</span></div>
        <div className="viewer-nav">
          <button type="button" className="circle-control" aria-label="Previous garment" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
          <button type="button" className="circle-control" aria-label="Next garment" onClick={() => move(1)}><ChevronRight size={20} /></button>
        </div>
      </section>

      <aside className="showroom-panel">
        <div className="product-heading">
          <span className="product-kicker">{current.category}</span>
          <h1>{current.name}</h1>
          <p>Digital garment study</p>
        </div>
        <GarmentSelector selected={selected} onSelect={setSelected} />
        <dl className="material-specs">
          <div><dt>Colour</dt><dd>{current.color}</dd></div>
          <div><dt>Material</dt><dd>{current.note}</dd></div>
          <div><dt>Fit</dt><dd>Oversized</dd></div>
        </dl>
      </aside>
    </main>
  );
}