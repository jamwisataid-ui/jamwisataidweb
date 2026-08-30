export type MarketingAttribution = {
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
};

export const CAMPAIGN_STORAGE_KEY = "jamwisata_campaign_attribution";
export const WEBSITE_WHATSAPP_NOTE = "Saya melihat informasi ini di website Jam Wisata.";

export function campaignFromSearch(search: string): MarketingAttribution {
  const params = new URLSearchParams(search);
  const clean = (key: string) => params.get(key)?.trim().slice(0, 160) || undefined;
  return { utmSource: clean("utm_source"), utmCampaign: clean("utm_campaign"), utmContent: clean("utm_content") };
}

export function hasCampaign(attribution: MarketingAttribution) {
  return Boolean(attribution.utmSource || attribution.utmCampaign || attribution.utmContent);
}

export function readStoredCampaign(storage: Storage): MarketingAttribution {
  try {
    const value = JSON.parse(storage.getItem(CAMPAIGN_STORAGE_KEY) || "{}") as MarketingAttribution;
    return { utmSource: value.utmSource, utmCampaign: value.utmCampaign, utmContent: value.utmContent };
  } catch {
    return {};
  }
}
