import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("docs/design/glossy-audit");
const cellWidth = 220;
const imageHeight = 488;
const labelHeight = 38;
const columns = 5;

const manifest = { generatedAt: new Date().toISOString(), platforms: {} };
for (const platform of ["android", "ios"]) {
  const directory = path.join(root, platform);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".png")).sort();
  manifest.platforms[platform] = files;
  const rows = Math.ceil(files.length / columns);
  const composites = [];
  for (const [index, file] of files.entries()) {
    const left = (index % columns) * cellWidth;
    const top = Math.floor(index / columns) * (imageHeight + labelHeight);
    const screenshot = await sharp(path.join(directory, file)).resize({ width: cellWidth - 12, height: imageHeight - 12, fit: "contain", background: "#FBFAF6" }).png().toBuffer();
    const label = file.replace(/\.png$/, "").replaceAll("-", " ").toLocaleUpperCase("id-ID");
    const svg = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#06152B"/><text x="${cellWidth / 2}" y="24" text-anchor="middle" fill="#F5D97A" font-family="Arial" font-size="12" font-weight="700">${label}</text></svg>`);
    composites.push({ input: screenshot, left: left + 6, top: top + 6 });
    composites.push({ input: svg, left, top: top + imageHeight });
  }
  await sharp({ create: { width: columns * cellWidth, height: rows * (imageHeight + labelHeight), channels: 3, background: "#E9E4D8" } })
    .composite(composites)
    .jpeg({ quality: 82 })
    .toFile(path.join(root, `contact-sheet-${platform}.jpg`));
}
await writeFile(path.join(root, "screenshot-manifest.json"), JSON.stringify(manifest, null, 2));

console.log("Built Android and iOS glossy audit contact sheets.");
