import { describe, expect, it } from "vitest";

import { campaignFromSearch, hasCampaign } from "../src/lib/marketing-attribution";

describe("atribusi campaign website", () => {
  it("membaca parameter Meta Ads yang didukung", () => {
    const campaign = campaignFromSearch("?utm_source=meta&utm_campaign=umroh-september&utm_content=video-a");
    expect(campaign).toEqual({ utmSource: "meta", utmCampaign: "umroh-september", utmContent: "video-a" });
    expect(hasCampaign(campaign)).toBe(true);
  });

  it("tidak mengarang sumber ketika UTM tidak ada", () => {
    expect(hasCampaign(campaignFromSearch("?foo=bar"))).toBe(false);
  });
});
