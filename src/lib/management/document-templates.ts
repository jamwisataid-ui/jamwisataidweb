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
  scaleToFit?: boolean;
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
  rows: [674, 713, 752, 791, 830],
  signature: { src: "/templates/kwitansi-signature-stamp.png", x: 704, y: 1241, width: 220, height: 58 },
  fields: {
    customerName: invoiceField({ x: 203, y: 445, width: 284, height: 42, fontSize: 19, lineHeight: 21, minFontSize: 12, maxLines: 2 }),
    date: invoiceField({ x: 747, y: 295, width: 236, height: 31, fontSize: 17, lineHeight: 21, minFontSize: 12 }),
    documentNumber: invoiceField({ x: 747, y: 264, width: 236, height: 31, fontSize: 17, lineHeight: 21, minFontSize: 8, scaleToFit: true }),
    packageName: invoiceField({ x: 720, y: 445, width: 263, height: 34, fontSize: 17, lineHeight: 21, minFontSize: 8 }),
    departure: invoiceField({ x: 720, y: 477, width: 263, height: 34, fontSize: 17, lineHeight: 21, minFontSize: 8 }),
    makkahHotel: invoiceField({ x: 720, y: 509, width: 263, height: 34, fontSize: 17, lineHeight: 21, minFontSize: 8 }),
    madinahHotel: invoiceField({ x: 720, y: 541, width: 263, height: 34, fontSize: 17, lineHeight: 21, minFontSize: 8 }),
    airline: invoiceField({ x: 720, y: 573, width: 263, height: 34, fontSize: 17, lineHeight: 21, minFontSize: 8 }),
    rowNumber: invoiceField({ x: 52, y: 0, width: 58, height: 36, fontSize: 16, lineHeight: 21, textAlign: "center" }),
    description: invoiceField({ x: 125, y: 0, width: 390, height: 36, fontSize: 16, lineHeight: 19, minFontSize: 11, maxLines: 2 }),
    price: invoiceField({ x: 545, y: 0, width: 200, height: 36, fontSize: 16, lineHeight: 21, textAlign: "right", minFontSize: 11 }),
    itemTotal: invoiceField({ x: 777, y: 0, width: 190, height: 36, fontSize: 16, lineHeight: 21, textAlign: "right", minFontSize: 11 }),
    grandTotal: invoiceField({ x: 706, y: 887, width: 258, height: 61, fontSize: 31, lineHeight: 38, textAlign: "right", minFontSize: 19, color: "#f9c65b", fontWeight: 700 }),
    continuation: invoiceField({ x: 704, y: 895, width: 260, height: 44, fontSize: 15, lineHeight: 20, textAlign: "right", minFontSize: 11, color: "#f9c65b" }),
    signerName: invoiceField({ x: 694, y: 1296, width: 232, height: 29, fontSize: 15, lineHeight: 19, minFontSize: 8, textAlign: "center", fontWeight: 600 }),
  },
};

export const receiptTemplate: DocumentTemplateConfig = {
  width: 1600,
  height: 800,
  background: "/templates/kwitansi-jamwisata.png",
  rows: [0],
  masks: [
    { x: 1175, y: 610, width: 370, height: 42, color: "#faf7f2" },
  ],
  signature: { src: "/templates/kwitansi-signature-stamp.png", x: 1247, y: 672, width: 220, height: 48 },
  fields: {
    customerName: receiptField({ x: 363, y: 325, width: 1180, height: 42, fontSize: 25, lineHeight: 28, minFontSize: 16, maxLines: 2 }),
    date: receiptField({ x: 1175, y: 610, width: 370, height: 42, fontSize: 20, lineHeight: 25, minFontSize: 14, textAlign: "right" }),
    documentNumber: receiptField({ x: 1124, y: 241, width: 403, height: 45, fontSize: 23, lineHeight: 28, minFontSize: 13 }),
    numericAmount: receiptField({ x: 374, y: 373, width: 1155, height: 58, fontSize: 25, lineHeight: 31, minFontSize: 16, fontWeight: 600 }),
    description: receiptField({ x: 363, y: 448, width: 1180, height: 76, fontSize: 23, lineHeight: 30, minFontSize: 15, maxLines: 2 }),
    amountInWords: receiptField({ x: 374, y: 535, width: 1155, height: 64, fontSize: 23, lineHeight: 28, minFontSize: 14, maxLines: 2, fontStyle: "italic" }),
    grandTotal: receiptField({ x: 192, y: 625, width: 552, height: 67, fontSize: 36, lineHeight: 43, textAlign: "right", minFontSize: 21, fontWeight: 700, color: "#092b55" }),
    signerName: receiptField({ x: 1237, y: 710, width: 248, height: 32, fontSize: 17, lineHeight: 21, minFontSize: 11, maxLines: 1, textAlign: "center", fontWeight: 600 }),
  },
};

export const documentTemplates = { invoice: invoiceTemplate, receipt: receiptTemplate } as const;

export function templateCurrency(value: number, includePrefix = true) {
  const amount = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);
  return includePrefix ? `Rp. ${amount}` : amount;
}
