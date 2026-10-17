import { describe, expect, it } from "vitest";

import { testimonialVideoData, testimonialVideoUrl } from "../src/lib/cms/testimonial-video";

describe("video jamaah YouTube URL", () => {
  it("preserves a Shorts URL across draft and publish while deriving the embed ID", () => {
    const url = "https://www.youtube.com/shorts/vSJpHgoAFkY";
    const draft = { primary: url };
    expect(draft.primary).toBe(url);

    const published = testimonialVideoData(draft.primary);
    expect(published).toEqual({ youtubeUrl: url, youtubeId: "vSJpHgoAFkY" });
    expect(testimonialVideoUrl(published)).toBe(url);
  });

  it.each([
    "https://www.youtube.com/watch?v=vSJpHgoAFkY&t=10s",
    "https://youtu.be/vSJpHgoAFkY",
  ])("preserves the entered URL %s", (url) => {
    expect(testimonialVideoUrl(testimonialVideoData(url))).toBe(url);
  });

  it("shows a full URL for legacy published records containing only an ID", () => {
    expect(testimonialVideoUrl({ youtubeId: "vSJpHgoAFkY" })).toBe("https://www.youtube.com/watch?v=vSJpHgoAFkY");
  });

  it("normalizes an entered bare ID to a full URL and rejects invalid input", () => {
    expect(testimonialVideoData("vSJpHgoAFkY").youtubeUrl).toBe("https://www.youtube.com/watch?v=vSJpHgoAFkY");
    expect(() => testimonialVideoData("bukan link YouTube")).toThrow("URL YouTube tidak valid.");
    expect(() => testimonialVideoData("https://notyoutube.com/shorts/vSJpHgoAFkY")).toThrow("URL YouTube tidak valid.");
  });
});
