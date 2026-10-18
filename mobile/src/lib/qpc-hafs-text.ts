// QPC Hafs maps alef + combining maddah, but not the precomposed alef-maddah.
// Keep the source text unchanged and use the canonically equivalent sequence for display.
export function qpcHafsText(text: string) {
  return text.replace(/\u0622/g, "\u0627\u0653");
}
