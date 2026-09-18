export const MAX_BYTES = 15 * 1024 * 1024;
export const MAX_FILES = 30;

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
]);

export function isAllowedFile(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  const name = file.name.toLowerCase();
  if (name.endsWith(".gif")) return false;
  if (ALLOWED.has(type)) return true;
  return /\.(jpe?g|png|webp|avif|heic|heif)$/.test(name);
}

export interface CleanResult {
  blob: Blob;
  outName: string;
  preview: string;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encode failed"))),
      type,
      quality
    );
  });
}

function u32le(n: number): [number, number, number, number] {
  return [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255];
}

/** Placeholder camera EXIF APP1 for JPEG (Make/Model only). */
export async function injectJpegExif(
  jpegBlob: Blob,
  make = "Canon",
  model = "EOS R5"
): Promise<Blob> {
  const buf = await jpegBlob.arrayBuffer();
  const src = new Uint8Array(buf);
  if (src[0] !== 0xff || src[1] !== 0xd8) return jpegBlob;

  const makeBytes = new TextEncoder().encode(`${make}\0`);
  const modelBytes = new TextEncoder().encode(`${model}\0`);

  const ifdCount = 2;
  const headerSize = 8;
  const ifdSize = 2 + ifdCount * 12 + 4;
  const makeOff = headerSize + ifdSize;
  const modelOff = makeOff + makeBytes.length;
  const tiffLen = modelOff + modelBytes.length;

  const tiff = new Uint8Array(tiffLen);
  tiff.set([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00]);
  tiff[8] = ifdCount;
  tiff[9] = 0;
  let p = 10;
  tiff.set([0x0f, 0x01, 0x02, 0x00, ...u32le(makeBytes.length), ...u32le(makeOff)], p);
  p += 12;
  tiff.set([0x10, 0x01, 0x02, 0x00, ...u32le(modelBytes.length), ...u32le(modelOff)], p);
  p += 12;
  tiff.set([0, 0, 0, 0], p);
  tiff.set(makeBytes, makeOff);
  tiff.set(modelBytes, modelOff);

  const exifHeader = new TextEncoder().encode("Exif\0\0");
  const app1Len = 2 + exifHeader.length + tiff.length;
  const app1 = new Uint8Array(2 + 2 + exifHeader.length + tiff.length);
  app1[0] = 0xff;
  app1[1] = 0xe1;
  app1[2] = (app1Len >> 8) & 255;
  app1[3] = app1Len & 255;
  app1.set(exifHeader, 4);
  app1.set(tiff, 4 + exifHeader.length);

  const out = new Uint8Array(2 + app1.length + (src.length - 2));
  out.set(src.subarray(0, 2), 0);
  out.set(app1, 2);
  out.set(src.subarray(2), 2 + app1.length);
  return new Blob([out], { type: "image/jpeg" });
}

export async function cleanFile(
  file: File,
  injectCameraExif: boolean
): Promise<CleanResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0);

  const name = file.name.toLowerCase();
  const wantJpeg =
    file.type.includes("jpeg") ||
    file.type.includes("jpg") ||
    /\.jpe?g$/.test(name);
  const wantWebp = file.type === "image/webp" || name.endsWith(".webp");

  const mime = wantJpeg ? "image/jpeg" : wantWebp ? "image/webp" : "image/png";
  const ext = wantJpeg ? "jpg" : wantWebp ? "webp" : "png";
  let blob = await canvasToBlob(
    canvas,
    mime,
    wantJpeg || wantWebp ? 0.92 : undefined
  );

  if (wantJpeg && injectCameraExif) {
    blob = await injectJpegExif(blob);
  }

  const base = file.name.replace(/\.[^.]+$/, "");
  return {
    blob,
    outName: `${base}-clean.${ext}`,
    preview: canvas.toDataURL("image/jpeg", 0.6),
  };
}
