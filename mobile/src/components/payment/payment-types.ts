export type PaymentMethod = { id: "bank_transfer" | "virtual_account" | "card" | "ewallet"; name: string; type: string; description?: string; enabled: boolean };
export type PaymentDetail = {
  registrationId: string;
  bookingNumber: string;
  packageName: string;
  total: number;
  paid: number;
  outstanding: number;
  status: "unpaid" | "pending" | "processing" | "paid" | "failed" | "expired" | "partial";
  selectedMethod?: string | null;
  methods: PaymentMethod[];
  bankAccounts: Array<{ id: string; name: string; bankName?: string | null; accountNumber?: string | null; accountHolder?: string | null }>;
};
