export type ProjectVideo = {
  id: string;
  title: string;
  titleVi?: string;
  kind: "overview" | "tutorial";
  description?: string;
  descriptionVi?: string;
} & (
  | { provider: "youtube"; videoId: string }
  | { provider: "file"; src: string; poster?: string; captions?: { src: string; language: string; label: string }[] }
);

// Add only real recordings, keyed by the project ID in portfolioData.ts.
export const PROJECT_VIDEOS: Record<string, ProjectVideo[]> = {};
