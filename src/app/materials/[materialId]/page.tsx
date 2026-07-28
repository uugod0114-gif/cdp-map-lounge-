import { notFound } from "next/navigation";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { MaterialDetailView } from "@/components/materials/material-detail-view";
import { getMaterialById } from "@/services/content-service";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ materialId: string }>;
}) {
  const { materialId } = await params;
  const material = await getMaterialById(materialId);
  if (!material) notFound();

  return (
    <LoungeShell>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">{material.title}</h1>
      <p className="mb-6 text-slate-500">{material.description}</p>
      <MaterialDetailView material={material} />
    </LoungeShell>
  );
}
