import { createFileRoute } from "@tanstack/react-router";
import { GarmentViewer } from "../components/GarmentViewer";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "FORM/ARCHIVE — 3D Garment Showroom" },
      { name: "description", content: "Explore oversized streetwear garments in an interactive 3D studio." },
      { property: "og:title", content: "FORM/ARCHIVE — 3D Garment Showroom" },
      { property: "og:description", content: "Explore oversized streetwear garments in an interactive 3D studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <GarmentViewer />;
}
