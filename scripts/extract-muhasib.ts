import ExcelJS from "exceljs";

export async function getMuhasibMasterData() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile("C:/Users/Pongo/Downloads/MUHASIB Pro Full Master.xlsx");

  const hotelSheet = wb.getWorksheet("Harga Hotel");
  if (!hotelSheet) throw new Error("Sheet Harga Hotel tidak ditemukan.");
  const makkahHotels: Array<{ no: number; name: string; low: number; medium: number; high: number }> = [];
  const madinahHotels: Array<{ no: number; name: string; low: number; medium: number; high: number }> = [];

  for (let r = 8; r <= 63; r++) {
    const row = hotelSheet.getRow(r);
    const no = Number(row.getCell(1).value) || 0;
    const name = row.getCell(2).text?.trim();
    const low = Number(row.getCell(3).value) || 0;
    const medium = Number(row.getCell(4).value) || 0;
    const high = Number(row.getCell(5).value) || 0;
    if (name && (low || medium || high)) {
      makkahHotels.push({ no, name, low, medium, high });
    }
  }

  for (let r = 71; r <= 94; r++) {
    const row = hotelSheet.getRow(r);
    const no = Number(row.getCell(1).value) || 0;
    const name = row.getCell(2).text?.trim();
    const low = Number(row.getCell(3).value) || 0;
    const medium = Number(row.getCell(4).value) || 0;
    const high = Number(row.getCell(5).value) || 0;
    if (name && (low || medium || high)) {
      madinahHotels.push({ no, name, low, medium, high });
    }
  }

  const laSheet = wb.getWorksheet("Harga Paket LA");
  if (!laSheet) throw new Error("Sheet Harga Paket LA tidak ditemukan.");
  const laPackages: Array<{ makkah: string; madinah: string; price: number }> = [];
  for (let r = 5; r <= laSheet.rowCount; r++) {
    const row = laSheet.getRow(r);
    const makkah = row.getCell(1).text?.trim();
    const madinah = row.getCell(3).text?.trim();
    const price = Number(row.getCell(6).value) || 0;
    if (makkah && madinah && price && makkah !== "MAKKAH") {
      laPackages.push({ makkah, madinah, price });
    }
  }

  return { makkahHotels, madinahHotels, laPackages };
}
