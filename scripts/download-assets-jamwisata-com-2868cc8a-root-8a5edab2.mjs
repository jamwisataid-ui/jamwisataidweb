import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/sites/jamwisata-com-2868cc8a/root-8a5edab2");

const assets = {
  "logo.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17636177504667-dhxV7uWLaD.png",
  "hero.jpg": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1638869882-890430/16605575459988-GOQumowNpNv7xGosL0p3PWN1UkFaTpAscJV8t4HX.jpg",
  "about.jpg": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1638869882-890430/16598904028467-7tvLvwqGxv8CBsTTJnmdBhF0v0wCubH4gku8UqzI.jpg",
  "about-badge.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1638869882-890430/16604611715660-TXxfyHjyFz4OoaZaZg3daXoUrMDHnBafGqju4Quc.png",
  "umrah-1.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17663046098209-kUrLk2VYk2.png",
  "umrah-2.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17657064327533-TUrqT8HnG2.png",
  "umrah-3.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17663183123744-VmbSr1mLhz.png",
  "tour-1.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17657130734535-X2VNaJc2IT.png",
  "tour-2.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17655267391119-jYP7qmn4Kc.png",
  "tour-3.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17655234924054-4s6ZX6HXre.png",
  "tour-4.png": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17653455272563-r9DEAAyxhq.png",
  "promo.jpg": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1638869882-890430/16595174792478-f0HbmGb2SfRoTZUyFj3nWWtubIPWgv9FsgjcVcXI.jpg",
  "article-1.webp": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17672366937372-nZAhU0dBoE.webp",
  "article-2.jpg": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17605281784806-Kdg8Zz1dyA.jpg",
  "article-3.jpg": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1760528106-586455/17605281795858-0Cs9j8EgkL.jpg",
  "newsletter.jpg": "https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1638869882-890430/16592839457394-FRsPpvsVgAGfeCxlFB0RYsFtrr4CR0KSIz54zMWi.jpg",
};

await mkdir(root, { recursive: true });

const entries = Object.entries(assets);
for (let index = 0; index < entries.length; index += 4) {
  await Promise.all(
    entries.slice(index, index + 4).map(async ([filename, url]) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      await writeFile(path.join(root, filename), Buffer.from(await response.arrayBuffer()));
      process.stdout.write(`downloaded ${filename}\n`);
    }),
  );
}
