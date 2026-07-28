"use client";

import { BlockList } from "@/components/cms/block-renderer";
import { useDemoUser } from "@/features/auth/role-context";
import type { ContentBlock } from "@/types/content";

export function BlockListClient({ blocks }: { blocks: ContentBlock[] }) {
  const { user } = useDemoUser();
  return <BlockList blocks={blocks} role={user.role} />;
}
