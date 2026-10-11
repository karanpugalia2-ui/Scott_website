import { promises as fs } from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

const VIDEO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const IMAGE_NAME_RE = /\.(jpe?g|png|webp|avif|gif)$/i;
const VIDEO_NAME_RE = /\.(mp4|webm)$/i;

export function isImageFile(file: File): boolean {
  return Boolean(IMAGE_EXT[file.type]) || (!file.type && IMAGE_NAME_RE.test(file.name));
}

export function isVideoFile(file: File): boolean {
  return Boolean(VIDEO_EXT[file.type]) || (!file.type && VIDEO_NAME_RE.test(file.name));
}

export function imageSize(buf: Buffer): { w: number; h: number } | null {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      const size = buf.readUInt16BE(i + 2);
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + size;
    }
  }
  if (
    buf.length > 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const fmt = buf.toString("ascii", 12, 16);
    if (fmt === "VP8X") {
      return {
        w: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
        h: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
      };
    }
    if (fmt === "VP8 ") {
      return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    }
    if (fmt === "VP8L") {
      const b0 = buf[21];
      const b1 = buf[22];
      const b2 = buf[23];
      const b3 = buf[24];
      return {
        w: 1 + (((b1 & 0x3f) << 8) | b0),
        h: 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
  }
  return null;
}

export async function nextPhotoPath(
  artistId: string,
  ext: string,
): Promise<{ absPath: string; publicPath: string }> {
  const dir = path.join(PUBLIC_DIR, "work", artistId);
  await fs.mkdir(dir, { recursive: true });
  const existing = await fs.readdir(dir);
  let max = 0;
  for (const f of existing) {
    const m = /^(\d+)\.[a-z0-9]+$/i.exec(f);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  const next = max + 1;
  return {
    absPath: path.join(dir, `${next}${ext}`),
    publicPath: `/work/${artistId}/${next}${ext}`,
  };
}

function sanitizeBaseName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.replace(/^[.-]+/, "").slice(0, 80) || "file";
}

export async function saveMediaUpload(
  file: File,
  kind: "image" | "video",
): Promise<{ publicPath: string; width?: number; height?: number }> {
  const ext =
    kind === "image"
      ? IMAGE_EXT[file.type] ??
        (IMAGE_NAME_RE.test(file.name)
          ? `.${/\.([a-z0-9]+)$/i.exec(file.name)?.[1].toLowerCase()}`
          : undefined)
      : VIDEO_EXT[file.type] ??
        (VIDEO_NAME_RE.test(file.name)
          ? `.${/\.([a-z0-9]+)$/i.exec(file.name)?.[1].toLowerCase()}`
          : undefined);
  if (!ext) throw new Error(`Unsupported ${kind} type: ${file.type}`);

  const limit = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > limit) {
    throw new Error(
      `${kind} too large (${Math.round(file.size / 1024 / 1024)}MB, max ${Math.round(limit / 1024 / 1024)}MB)`,
    );
  }

  const dir = path.join(PUBLIC_DIR, "uploads");
  await fs.mkdir(dir, { recursive: true });

  const base = sanitizeBaseName(file.name);
  const stem = base.replace(/\.[a-z0-9]+$/i, "") || "file";
  let target = path.join(dir, `${stem}${ext}`);
  let i = 1;
  while (true) {
    try {
      await fs.access(target);
      target = path.join(dir, `${stem}-${i}${ext}`);
      i++;
    } catch {
      break;
    }
  }

  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(target, buf);

  let width: number | undefined;
  let height: number | undefined;
  if (kind === "image") {
    const size = imageSize(buf);
    if (size) {
      width = size.w;
      height = size.h;
    }
  }

  return {
    publicPath: `/uploads/${path.basename(target)}`,
    width,
    height,
  };
}
