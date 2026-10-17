import { extractYoutubeId } from "./validation";

const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export function testimonialVideoData(input: string) {
  const youtubeUrl = input.trim();
  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeId) throw new Error("URL YouTube tidak valid.");

  return {
    youtubeUrl: youtubeUrl === youtubeId ? youtubeWatchUrl(youtubeId) : youtubeUrl,
    youtubeId,
  };
}

export function testimonialVideoUrl(data: Record<string, unknown>) {
  const youtubeUrl = typeof data.youtubeUrl === "string" ? data.youtubeUrl.trim() : "";
  if (youtubeUrl && extractYoutubeId(youtubeUrl)) return youtubeUrl;

  const youtubeId = typeof data.youtubeId === "string" ? extractYoutubeId(data.youtubeId) : null;
  return youtubeId ? youtubeWatchUrl(youtubeId) : "";
}
