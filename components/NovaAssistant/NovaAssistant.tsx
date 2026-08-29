"use client";

import React from "react";
import NovaBuddy, { NovaState } from "@/components/tools/NovaBuddy";
import { ToolDefinition } from "@/lib/tools/tool-types";

export type { NovaState };

interface Props {
  state?: NovaState;
  tool?: ToolDefinition;
  toolSlug?: string;
}

export default function NovaAssistant({ state = "idle", tool, toolSlug }: Props) {
  return <NovaBuddy state={state} tool={tool} toolSlug={toolSlug} />;
}