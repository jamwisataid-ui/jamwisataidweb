export type TemplateTextAlign = "left" | "center" | "right";
export type TemplateVerticalAlign = "top" | "middle" | "bottom";

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
  verticalAlign?: TemplateVerticalAlign;
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
  verticalAlign: "middle",
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
  verticalAlign: "middle",
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
    customerName: invoiceField({ x: 140, y: 558, width: 320, height: 66, fontSize: 27, lineHeight: 31, minFontSize: 18, maxLines: 2, verticalAlign: "middle" }),
    date: invoiceField({ x: 792, y: 536, width: 165, height: 30, fontSize: 18, lineHeight: 24, minFontSize: 15 }),
    documentNumber: invoiceField({ x: 792, y: 584, width: 178, height: 44, fontSize: 18, lineHeight: 21, minFontSize: 11, maxLines: 2, verticalAlign: "middle" }),
    description: invoiceField({ x: 60, y: 0, width: 342, height: 62, fontSize: 20, lineHeight: 28, minFontSize: 15, maxLines: 2 }),
    qty: invoiceField({ x: 486, y: 0, width: 62, height: 30, fontSize: 16, lineHeight: 23, textAlign: "center" }),
    price: invoiceField({ x: 604, y: 0, width: 164, height: 30, fontSize: 20, lineHeight: 27, textAlign: "right", minFontSize: 15 }),
    itemTotal: invoiceField({ x: 797, y: 0, width: 164, height: 30, fontSize: 20, lineHeight: 27, textAlign: "right", minFontSize: 15 }),
    grandTotal: invoiceField({ x: 688, y: 997, width: 272, height: 50, fontSize: 35, lineHeight: 42, textAlign: "right", minFontSize: 22, color: "#f9b947" }),
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
  masks: [
    { x: 1060, y: 842, width: 325, height: 42 },
    { x: 1045, y: 951, width: 360, height: 50 },
  ],
  signature: { src: "/templates/kwitansi-signature-stamp.png", x: 1083, y: 884, width: 280, height: 68 },
  fields: {
    customerName: receiptField({ x: 73, y: 440, width: 580, height: 66, fontSize: 42, lineHeight: 31, minFontSize: 21, maxLines: 2, fontWeight: 700, fontStyle: "italic", fontFamily: "serif", color: "#d69a20", verticalAlign: "bottom" }),
    date: receiptField({ x: 1242, y: 284, width: 224, height: 36, fontSize: 24, lineHeight: 32, minFontSize: 20 }),
    documentNumber: receiptField({ x: 1242, y: 349, width: 224, height: 52, fontSize: 24, lineHeight: 24, minFontSize: 13, maxLines: 2 }),
    paymentMethod: receiptField({ x: 1242, y: 427, width: 224, height: 50, fontSize: 20, lineHeight: 23, minFontSize: 13, maxLines: 2 }),
    rowNumber: receiptField({ x: 85, y: 0, width: 98, height: 38, fontSize: 18, lineHeight: 26, textAlign: "center" }),
    description: receiptField({ x: 210, y: 0, width: 720, height: 78, fontSize: 19, lineHeight: 29, minFontSize: 15, maxLines: 2 }),
    qty: receiptField({ x: 1120, y: 0, width: 72, height: 38, fontSize: 18, lineHeight: 26, textAlign: "center" }),
    itemTotal: receiptField({ x: 1235, y: 0, width: 230, height: 38, fontSize: 20, lineHeight: 28, textAlign: "right", minFontSize: 16 }),
    amountInWords: receiptField({ x: 372, y: 760, width: 440, height: 67, fontSize: 20, lineHeight: 21, minFontSize: 13, maxLines: 3, fontStyle: "italic", verticalAlign: "middle" }),
    grandTotal: receiptField({ x: 1198, y: 758, width: 252, height: 58, fontSize: 39, lineHeight: 46, textAlign: "right", minFontSize: 22, fontWeight: 700, color: "#f9b947" }),
    signerRole: receiptField({ x: 1065, y: 843, width: 315, height: 39, fontSize: 18, lineHeight: 19, minFontSize: 14, maxLines: 2, textAlign: "center", fontWeight: 700 }),
    signerName: receiptField({ x: 1050, y: 958, width: 345, height: 40, fontSize: 24, lineHeight: 27, minFontSize: 15, maxLines: 1, textAlign: "center", fontWeight: 700 }),
  },
};

export const documentTemplates = { invoice: invoiceTemplate, receipt: receiptTemplate } as const;

export function templateCurrency(value: number, includePrefix = true) {
  const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
  return includePrefix ? `Rp. ${amount}` : amount;
}
