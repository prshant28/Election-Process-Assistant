import type { ElectionPhase, ElectionTopic, ElectionTopicDetail } from "@workspace/api-client-react";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function normalizeTopics(value: unknown): ElectionTopic[] {
  if (!Array.isArray(value)) return [];
  return value.map((topic, index) => {
    const item = (topic && typeof topic === "object" ? topic : {}) as Record<string, unknown>;
    return {
      id: asString(item.id, `topic-${index}`),
      title: asString(item.title, "Untitled Topic"),
      titleHindi: asString(item.titleHindi, ""),
      description: asString(item.description, ""),
      icon: asString(item.icon, ""),
      tags: asStringArray(item.tags),
    };
  });
}

export function normalizeTopicDetail(value: unknown): ElectionTopicDetail | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  return {
    id: asString(item.id, "topic"),
    title: asString(item.title, "Untitled Topic"),
    titleHindi: asString(item.titleHindi, ""),
    description: asString(item.description, ""),
    icon: asString(item.icon, ""),
    tags: asStringArray(item.tags),
    content: asString(item.content, ""),
    steps: asStringArray(item.steps),
    officialLinks: Array.isArray(item.officialLinks)
      ? item.officialLinks
          .filter((link): link is Record<string, unknown> => Boolean(link && typeof link === "object"))
          .map((link) => ({
            label: asString(link.label, "Official Link"),
            url: asString(link.url, "#"),
          }))
      : [],
  };
}

export function normalizeTimeline(value: unknown): ElectionPhase[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((phase): phase is Record<string, unknown> => Boolean(phase && typeof phase === "object"))
    .map((phase, index) => ({
      phase: asNumber(phase.phase, index + 1),
      title: asString(phase.title, `Phase ${index + 1}`),
      description: asString(phase.description, ""),
      durationDays: asNumber(phase.durationDays, 0),
      keyActivities: asStringArray(phase.keyActivities),
    }));
}
