import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_ROOT = "C:\\Users\\Dear\\Desktop\\محصولات مانا";
const OUT_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_EDGE = 1400;
const QUALITY = 78;

/** folder → product slugs (matched to DB) */
const FOLDER_MAP = {
  1: [
    "dehu-du-nvr7110j-4k-1s",
    "dehu-du-nvr7116j-4k-1s",
    "dehu-du-nvr7116j-4k-2s",
    "dehu-du-nvr7136j-4k-2s",
  ],
  2: ["dehu-du-dvr5016-5h"], // txt: Du-XVR5016-5H
  3: ["dehu-du-xvr5045j-ai", "dehu-du-xvr5085j-ai", "dehu-du-xvr5016j-ai"],
  4: ["utec-ut-1215a"], // txt: UT-IPS1215A
  5: ["dehu-du-h-1200sb-l4", "dehu-du-p-2510sb-l4", "dehu-du-p-2811sb-l4"],
  6: ["dehu-du-h-1200kb-l4", "dehu-du-p-3500kb-l4-f-s"],
  7: [
    "dehu-du-h-1200ad-l2a",
    "dehu-du-h-1500db-l2",
    "dehu-du-h-1500ad-l2a",
    "dehu-du-p-2500db-l2",
  ],
  8: [
    "dehu-du-p-2510hb-l6",
    "dehu-du-p-2510hb-l6-z",
    "dehu-du-p-2811hb-l6",
    "dehu-du-p-3500hb-l6-lp",
  ],
  9: ["dehu-du-h-1510gb-l4"],
  10: ["dehu-du-h-1200td-l2"],
  11: ["dehu-du-p-2510pd-l4", "dehu-du-p-2811pd-l4"],
  12: ["utec-ut-1215a-b", "utec-ut-1230a-b"], // txt: UT-IPS*
  13: ["utec-ut-1230a"], // txt: UT-IPS1230A
};

function listImages(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .map((f) => {
      const full = path.join(dir, f);
      return { name: f, full, size: fs.statSync(full).size };
    })
    .sort((a, b) => b.size - a.size); // largest first = usually main photo
}

async function optimizeOne(srcPath, destPath) {
  await sharp(srcPath)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY })
    .toFile(destPath);
  const before = fs.statSync(srcPath).size;
  const after = fs.statSync(destPath).size;
  return { before, after };
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const mapping = [];

for (const [folder, slugs] of Object.entries(FOLDER_MAP)) {
  const dir = path.join(SRC_ROOT, folder);
  if (!fs.existsSync(dir)) {
    console.warn("missing folder", folder);
    continue;
  }
  const images = listImages(dir).filter((img) => img.size > 20_000); // skip tiny junk
  if (!images.length) {
    console.warn("no usable images in", folder);
    continue;
  }

  const urls = [];
  for (let i = 0; i < images.length; i++) {
    const outName = `folder${folder}-${i + 1}.webp`;
    const outPath = path.join(OUT_DIR, outName);
    const stats = await optimizeOne(images[i].full, outPath);
    const url = `/uploads/products/${outName}`;
    urls.push(url);
    console.log(
      `folder ${folder}: ${images[i].name} -> ${outName} (${Math.round(stats.before / 1024)}KB -> ${Math.round(stats.after / 1024)}KB)`,
    );
  }

  for (const slug of slugs) {
    mapping.push({
      slug,
      cover: urls[0],
      gallery: urls,
    });
  }
}

const mapPath = path.join(process.cwd(), "tmp", "product-image-map.json");
fs.mkdirSync(path.dirname(mapPath), { recursive: true });
fs.writeFileSync(mapPath, JSON.stringify(mapping, null, 2), "utf8");
console.log("\nWrote", mapPath, "items:", mapping.length);
