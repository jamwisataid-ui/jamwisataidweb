export type TemplateTextAlign = "left" | "center" | "right";

export type TemplateFieldConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  minFontSize?: number;
  lineHeight: number;
  maxLines?: number;
  textAlign?: TemplateTextAlign;
  fontWeight?: 400 | 600 | 700;
  fontStyle?: "normal" | "italic";
  fontFamily?: "sans" | "serif";
  color?: string;
};

export type DocumentTemplateConfig = {
  width: number;
  height: number;
  background: string;
  rows: number[];
  fields: Record<string, TemplateFieldConfig>;
  masks?: Array<{ x: number; y: number; width: number; height: number; color?: string }>;
  signature?: { src: string; x: number; y: number; width: number; height: number };
};

const invoiceField = (value: Partial<TemplateFieldConfig> & Pick<TemplateFieldConfig, "x" | "y" | "width" | "height">): TemplateFieldConfig => ({
  fontSize: 20,
  lineHeight: 27,
  maxLines: 1,
  color: "#083772",
  fontWeight: 400,
  fontStyle: "normal",
  fontFamily: "sans",
  textAlign: "left",
  ...value,
});

const receiptField = (value: Partial<TemplateFieldConfig> & Pick<TemplateFieldConfig, "x" | "y" | "width" | "height">): TemplateFieldConfig => ({
  fontSize: 29,
  lineHeight: 38,
  maxLines: 1,
  color: "#111111",
  fontWeight: 400,
  fontStyle: "normal",
  fontFamily: "sans",
  textAlign: "left",
  ...value,
});

export const invoiceTemplate: DocumentTemplateConfig = {
  width: 1024,
  height: 1536,
  background: "/templates/invoice-jamwisata.png",
  rows: [754, 824, 894],
  masks: [
    { x: 190, y: 1135, width: 270, height: 31, color: "#f7f6f6" },
    { x: 190, y: 1199, width: 270, height: 31, color: "#f7f6f6" },
    { x: 190, y: 1263, width: 270, height: 31, color: "#f7f6f6" },
  ],
  fields: {
    customerName: invoiceField({ x: 140, y: 568, width: 310, height: 42, fontSize: 27, lineHeight: 34, minFontSize: 21 }),
    date: invoiceField({ x: 792, y: 536, width: 165, height: 30, fontSize: 18, lineHeight: 24, minFontSize: 15 }),
    documentNumber: invoiceField({ x: 792, y: 594, width: 185, height: 30, fontSize: 18, lineHeight: 24, minFontSize: 15 }),
    description: invoiceField({ x: 60, y: 0, width: 342, height: 62, fontSize: 20, lineHeight: 28, minFontSize: 15, maxLines: 2 }),
    qty: invoiceField({ x: 486, y: 0, width: 62, height: 30, fontSize: 16, lineHeight: 23, textAlign: "center" }),
    price: invoiceField({ x: 604, y: 0, width: 164, height: 30, fontSize: 20, lineHeight: 27, textAlign: "right", minFontSize: 15 }),
    itemTotal: invoiceField({ x: 797, y: 0, width: 164, height: 30, fontSize: 20, lineHeight: 27, textAlign: "right", minFontSize: 15 }),
    grandTotal: invoiceField({ x: 700, y: 1000, width: 260, height: 46, fontSize: 35, lineHeight: 42, textAlign: "right", minFontSize: 27, color: "#f9b947" }),
    continuation: invoiceField({ x: 680, y: 1007, width: 280, height: 30, fontSize: 17, lineHeight: 23, textAlign: "right", minFontSize: 14, color: "#f9b947" }),
    account1: invoiceField({ x: 225, y: 1137, width: 227, height: 30, fontSize: 21, lineHeight: 27, minFontSize: 17 }),
    account2: invoiceField({ x: 225, y: 1201, width: 227, height: 30, fontSize: 21, lineHeight: 27, minFontSize: 17 }),
    account3: invoiceField({ x: 225, y: 1265, width: 227, height: 30, fontSize: 21, lineHeight: 27, minFontSize: 17 }),
  },
};

export const receiptTemplate: DocumentTemplateConfig = {
  width: 1536,
  height: 1024,
  background: "/templates/kwitansi-jamwisata.png",
  rows: [578, 620, 662, 704],
  masks: [{ x: 1065, y: 850, width: 315, height: 38 }],
  signature: { src: "/templates/kwitansi-signature-stamp.png", x: 997, y: 824, width: 314, height: 253 },
  fields: {
    customerName: receiptField({ x: 73, y: 447, width: 570, height: 62, fontSize: 42, lineHeight: 52, minFontSize: 32, fontWeight: 700, fontStyle: "italic", fontFamily: "serif", color: "#d69a20" }),
    date: receiptField({ x: 1242, y: 284, width: 224, height: 36, fontSize: 24, lineHeight: 32, minFontSize: 20 }),
    documentNumber: receiptField({ x: 1242, y: 358, width: 224, height: 36, fontSize: 24, lineHeight: 32, minFontSize: 20 }),
    paymentMethod: receiptField({ x: 1242, y: 432, width: 224, height: 36, fontSize: 20, lineHeight: 28, minFontSize: 17 }),
    rowNumber: receiptField({ x: 85, y: 0, width: 98, height: 38, fontSize: 18, lineHeight: 26, textAlign: "center" }),
    description: receiptField({ x: 210, y: 0, width: 720, height: 78, fontSize: 19, lineHeight: 29, minFontSize: 15, maxLines: 2 }),
    qty: receiptField({ x: 1120, y: 0, width: 72, height: 38, fontSize: 18, lineHeight: 26, textAlign: "center" }),
    itemTotal: receiptField({ x: 1235, y: 0, width: 230, height: 38, fontSize: 20, lineHeight: 28, textAlign: "right", minFontSize: 16 }),
    amountInWords: receiptField({ x: 372, y: 762, width: 440, height: 42, fontSize: 20, lineHeight: 28, minFontSize: 16, fontStyle: "italic" }),
    grandTotal: receiptField({ x: 1198, y: 762, width: 252, height: 48, fontSize: 39, lineHeight: 46, textAlign: "right", minFontSize: 29, fontWeight: 700, color: "#f9b947" }),
    signerRole: receiptField({ x: 1065, y: 856, width: 315, height: 32, fontSize: 18, lineHeight: 25, minFontSize: 15, textAlign: "center", fontWeight: 700 }),
    signerName: receiptField({ x: 1015, y: 966, width: 300, height: 38, fontSize: 24, lineHeight: 32, minFontSize: 19, textAlign: "center", fontWeight: 700 }),
  },
};

export const documentTemplates = { invoice: invoiceTemplate, receipt: receiptTemplate } as const;

export function templateCurrency(value: number, includePrefix = true) {
  const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
  return includePrefix ? `Rp. ${amount}` : amount;
}
