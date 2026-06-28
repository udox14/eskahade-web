"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/psb/content";
import { api } from "@/lib/psb/api";

// Static pages render instantly with DEFAULT_CONTENT, then hydrate from
// /api/psb/content so admin edits show without a rebuild.
export function useContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  useEffect(() => {
    api
      .get<SiteContent>("/api/psb/content")
      .then(setContent)
      .catch(() => {});
  }, []);
  return content;
}
