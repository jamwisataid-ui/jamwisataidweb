import { normalizeWhatsapp } from "./validation";

export type ReferralLeadCandidate = {
  id: string;
  agentId: string;
  name: string;
  whatsapp: string;
  email: string | null;
  status: "new" | "contacted" | "converted" | "closed";
  convertedPilgrimId: string | null;
  createdAt: Date;
};

function normalizedEmail(value?: string | null) {
  return value?.trim().toLowerCase() || null;
}

export function referralContactsMatch(
  left: { whatsapp: string; email?: string | null },
  right: { whatsapp: string; email?: string | null },
) {
  const leftEmail = normalizedEmail(left.email);
  const rightEmail = normalizedEmail(right.email);
  return normalizeWhatsapp(left.whatsapp) === normalizeWhatsapp(right.whatsapp)
    || Boolean(leftEmail && rightEmail && leftEmail === rightEmail);
}

export function findMatchingContact<T extends { whatsapp: string; email?: string | null }>(
  contacts: T[],
  incoming: { whatsapp: string; email?: string | null },
) {
  const incomingWhatsapp = normalizeWhatsapp(incoming.whatsapp);
  const incomingEmail = normalizedEmail(incoming.email);
  return contacts.find((contact) => normalizeWhatsapp(contact.whatsapp) === incomingWhatsapp)
    ?? (incomingEmail ? contacts.find((contact) => normalizedEmail(contact.email) === incomingEmail) : undefined)
    ?? null;
}

export function findMatchingReferralLead(
  leads: ReferralLeadCandidate[],
  contact: { whatsapp: string; email?: string | null },
) {
  const candidates = leads
    .filter((lead) => lead.status !== "closed" && !lead.convertedPilgrimId)
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
  return findMatchingContact(candidates, contact);
}

export function latestLeadPerPilgrim<T extends ReferralLeadCandidate>(leads: T[]) {
  const latest = new Map<string, T>();
  for (const lead of [...leads].sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())) {
    if (lead.convertedPilgrimId && !latest.has(lead.convertedPilgrimId)) latest.set(lead.convertedPilgrimId, lead);
  }
  return [...latest.values()];
}
