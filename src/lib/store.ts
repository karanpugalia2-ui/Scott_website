import { promises as fs } from "fs";
import path from "path";
import {
  defaultArtists,
  defaultContent,
  type ArtistProject,
  type ArtistType,
  type GearItem,
  type NavLink,
  type SiteContent,
  type SocialLink,
  type Testimonial,
} from "./content";
import { sanitizeHtml, sanitizeText } from "./sanitize";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export interface Store {
  artists: ArtistProject[];
  content: SiteContent;
}

export class StoreError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const ARTIST_TYPES: ArtistType[] = ["concert", "music-video", "documentary", "event"];

export function slugify(input: string): string {
  return sanitizeText(input, 80)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function assertSlug(id: string): string {
  const s = String(id ?? "");
  if (!SLUG_RE.test(s)) throw new StoreError(`Invalid id: ${id}`);
  return s;
}

function artistDir(id: string): string {
  return path.join(PUBLIC_DIR, "work", assertSlug(id));
}

function assertArtistPath(id: string, p: unknown): string {
  const s = sanitizeText(p, 300);
  const prefix = `/work/${id}/`;
  if (!s.startsWith(prefix) || s.includes("..") || !/^[\w.\-/]+$/.test(s)) {
    throw new StoreError(`Invalid photo path: ${p}`);
  }
  return s;
}

function mergeSection<T extends object>(def: T, stored: unknown): T {
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    return { ...def, ...(stored as Partial<T>) };
  }
  return structuredClone(def);
}

export function mergeContent(stored: Partial<SiteContent> | undefined): SiteContent {
  if (!stored || typeof stored !== "object") return structuredClone(defaultContent);
  const out = structuredClone(defaultContent) as unknown as Record<string, unknown>;
  const def = defaultContent as unknown as Record<string, unknown>;
  const src = stored as Record<string, unknown>;
  for (const key of Object.keys(out)) {
    if (src[key] === undefined) continue;
    const d = def[key];
    if (
      d &&
      typeof d === "object" &&
      !Array.isArray(d) &&
      src[key] &&
      typeof src[key] === "object" &&
      !Array.isArray(src[key])
    ) {
      out[key] = mergeSection(d as object, src[key]);
    } else {
      out[key] = src[key];
    }
  }
  return out as unknown as SiteContent;
}

function str(v: unknown, max = 300): string {
  return sanitizeText(v, max);
}

function arr(v: unknown, max = 50, maxItem = 300): string[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, max).map((item) => str(item, maxItem)).filter((s) => s.length > 0);
}

function sanitizeGearItems(items: unknown): GearItem[] {
  if (!Array.isArray(items)) return structuredClone(defaultContent.gear.items);
  const out: GearItem[] = [];
  for (const raw of items.slice(0, 30)) {
    if (!raw || typeof raw !== "object") continue;
    const it = raw as Partial<GearItem>;
    const id = slugify(str(it.id || it.name || "gear", 80)) || `gear-${out.length + 1}`;
    out.push({
      id,
      name: str(it.name, 100),
      category: str(it.category, 80),
      tagline: str(it.tagline, 160),
      description: str(it.description, 300),
      specs: arr(it.specs, 12, 60),
      image: str(it.image, 300),
      imageW: Math.max(1, Math.min(4000, Number(it.imageW) || 800)),
      imageH: Math.max(1, Math.min(4000, Number(it.imageH) || 600)),
      span: /^[\w [\](),/.-]{0,60}$/.test(String(it.span ?? "")) ? String(it.span) : "",
      link: str(it.link, 400),
      accent: HEX_RE.test(String(it.accent ?? "")) ? String(it.accent) : "#c8ff00",
      column: it.column === "right" ? "right" : "left",
    });
  }
  return out.length ? out : structuredClone(defaultContent.gear.items);
}

function sanitizeTestimonials(items: unknown): Testimonial[] {
  if (!Array.isArray(items)) return structuredClone(defaultContent.testimonials.items);
  return items.slice(0, 30).map((raw, i) => {
    const it = (raw && typeof raw === "object" ? raw : {}) as Partial<Testimonial>;
    return {
      id: slugify(str(it.id, 60)) || `t${i + 1}`,
      quote: str(it.quote, 400),
      author: str(it.author, 100),
      event: str(it.event, 120),
    };
  });
}

function sanitizeSocials(items: unknown): SocialLink[] {
  if (!Array.isArray(items)) return structuredClone(defaultContent.contact.socials);
  return items.slice(0, 10).map((raw, i) => {
    const it = (raw && typeof raw === "object" ? raw : {}) as Partial<SocialLink>;
    const icon =
      it.icon === "instagram" || it.icon === "whatsapp" || it.icon === "youtube"
        ? it.icon
        : "generic";
    return {
      id: slugify(str(it.id, 40)) || `social-${i + 1}`,
      label: str(it.label, 60),
      href: str(it.href, 400),
      icon,
    };
  });
}

function sanitizeLinks(items: unknown): NavLink[] {
  if (!Array.isArray(items)) return structuredClone(defaultContent.nav.links);
  return items.slice(0, 12).map((raw) => {
    const it = (raw && typeof raw === "object" ? raw : {}) as Partial<NavLink>;
    return { name: str(it.name, 60), href: str(it.href, 200) };
  });
}

function sanitizeArtistType(v: unknown): ArtistType {
  return ARTIST_TYPES.includes(v as ArtistType) ? (v as ArtistType) : "concert";
}

export function sanitizeArtist(a: Partial<ArtistProject>, id: string): ArtistProject {
  const out: ArtistProject = {
    id,
    artist: str(a.artist, 100),
    tagline: str(a.tagline, 200),
    type: sanitizeArtistType(a.type),
    cover: a.cover ? assertArtistPath(id, a.cover) : "",
    images: Array.isArray(a.images)
      ? a.images.slice(0, 100).map((p) => assertArtistPath(id, p))
      : [],
    year: str(a.year, 20),
    featured: Boolean(a.featured),
  };
  if (a.video !== undefined) out.video = str(a.video, 400) || undefined;
  return out;
}

export function sanitizeContent(input: Partial<SiteContent>): SiteContent {
  const base = structuredClone(defaultContent);
  const c = (input ?? {}) as Partial<SiteContent>;

  const site = { ...base.site, ...(c.site ?? {}) };
  base.site = {
    title: str(site.title, 160) || base.site.title,
    description: str(site.description, 400) || base.site.description,
    ogImage: str(site.ogImage, 300) || base.site.ogImage,
  };

  const nav = { ...base.nav, ...(c.nav ?? {}) };
  base.nav = {
    brand: str(nav.brand, 40) || "SCOTT",
    links: sanitizeLinks(nav.links),
  };

  const hero = { ...base.hero, ...(c.hero ?? {}) };
  base.hero = {
    eyebrow: str(hero.eyebrow, 120),
    titleLine1: str(hero.titleLine1, 60),
    titleLine2: str(hero.titleLine2, 60),
    paragraph: str(hero.paragraph, 400),
    scrollHint: str(hero.scrollHint, 80),
    video: str(hero.video, 400),
    poster: str(hero.poster, 300),
  };

  const marquee = { ...base.marquee, ...(c.marquee ?? {}) };
  base.marquee = { items: arr(marquee.items, 20, 40) };

  const work = { ...base.work, ...(c.work ?? {}) };
  base.work = {
    eyebrow: str(work.eyebrow, 80),
    heading: str(work.heading, 100),
    featuredLabel: str(work.featuredLabel, 60),
    allProjectsLabel: str(work.allProjectsLabel, 60),
  };

  const about = { ...base.about, ...(c.about ?? {}) };
  base.about = {
    eyebrow: str(about.eyebrow, 60),
    headingLine1: str(about.headingLine1, 80),
    headingLine2: str(about.headingLine2, 80),
    photo: str(about.photo, 300) || base.about.photo,
    photoAlt: str(about.photoAlt, 120),
    name: str(about.name, 60),
    subtitle: str(about.subtitle, 120),
    paragraphs: arr(about.paragraphs, 8, 1500).map((p) => sanitizeHtml(p)),
    ctaLabel: str(about.ctaLabel, 80),
  };

  const gear = { ...base.gear, ...(c.gear ?? {}) };
  base.gear = {
    eyebrow: str(gear.eyebrow, 60),
    heading: str(gear.heading, 80),
    description: str(gear.description, 300),
    items: sanitizeGearItems(gear.items),
  };

  const testimonials = { ...base.testimonials, ...(c.testimonials ?? {}) };
  base.testimonials = {
    eyebrow: str(testimonials.eyebrow, 60),
    heading: str(testimonials.heading, 80),
    backgroundImage: str(testimonials.backgroundImage, 300),
    items: sanitizeTestimonials(testimonials.items),
  };

  const contact = { ...base.contact, ...(c.contact ?? {}) };
  base.contact = {
    eyebrow: str(contact.eyebrow, 60),
    headingLine1: str(contact.headingLine1, 80),
    headingLine2: str(contact.headingLine2, 80),
    paragraph: str(contact.paragraph, 400),
    email: str(contact.email, 160),
    socials: sanitizeSocials(contact.socials),
    footerCopyright: str(contact.footerCopyright, 120),
    footerCrafted: str(contact.footerCrafted, 60),
    footerHeart: str(contact.footerHeart, 10),
    footerLocation: str(contact.footerLocation, 80),
  };

  const preloader = { ...base.preloader, ...(c.preloader ?? {}) };
  base.preloader = {
    brand: str(preloader.brand, 40),
    bottomLeft: str(preloader.bottomLeft, 80),
    bottomRight: str(preloader.bottomRight, 80),
  };

  return base;
}

export async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    const artists = Array.isArray(parsed.artists)
      ? parsed.artists.map((a, i) => {
          const id = assertSlug(String(a?.id ?? `artist-${i + 1}`));
          return sanitizeArtist(a ?? {}, id);
        })
      : structuredClone(defaultArtists);
    return { artists, content: mergeContent(parsed.content) };
  } catch {
    return {
      artists: structuredClone(defaultArtists),
      content: structuredClone(defaultContent),
    };
  }
}

export async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = STORE_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, STORE_PATH);
}

export async function updateContent(patch: Partial<SiteContent>): Promise<SiteContent> {
  const store = await readStore();
  const merged = mergeContent({ ...store.content, ...patch } as Partial<SiteContent>);
  store.content = sanitizeContent(merged);
  await writeStore(store);
  return store.content;
}

export async function createArtist(input: Partial<ArtistProject>): Promise<ArtistProject> {
  const store = await readStore();
  let id = slugify(str(input.id || input.artist, 100));
  if (!id) id = `artist-${store.artists.length + 1}`;
  assertSlug(id);
  if (store.artists.some((a) => a.id === id)) {
    throw new StoreError(`Artist "${id}" already exists`, 409);
  }
  const artist = sanitizeArtist(
    { ...input, id, featured: input.featured ?? false },
    id,
  );
  if (!artist.artist) throw new StoreError("Artist name is required");
  store.artists.push(artist);
  await writeStore(store);
  await fs.mkdir(artistDir(id), { recursive: true });
  return artist;
}

export async function getArtist(id: string): Promise<ArtistProject> {
  const store = await readStore();
  const artist = store.artists.find((a) => a.id === id);
  if (!artist) throw new StoreError(`Artist "${id}" not found`, 404);
  return artist;
}

export async function updateArtist(
  id: string,
  patch: Partial<ArtistProject>,
): Promise<ArtistProject> {
  assertSlug(id);
  const store = await readStore();
  const idx = store.artists.findIndex((a) => a.id === id);
  if (idx === -1) throw new StoreError(`Artist "${id}" not found`, 404);
  const current = store.artists[idx];

  const next: ArtistProject = { ...current };

  if (patch.artist !== undefined) next.artist = str(patch.artist, 100);
  if (patch.tagline !== undefined) next.tagline = str(patch.tagline, 200);
  if (patch.type !== undefined) next.type = sanitizeArtistType(patch.type);
  if (patch.year !== undefined) next.year = str(patch.year, 20);
  if (patch.featured !== undefined) next.featured = Boolean(patch.featured);
  if (patch.video !== undefined) next.video = str(patch.video, 400) || undefined;

  if (Array.isArray(patch.images)) {
    const seen = new Set<string>();
    next.images = patch.images
      .slice(0, 100)
      .map((p) => assertArtistPath(id, p))
      .filter((p) => (seen.has(p) ? false : (seen.add(p), true)));
    if (next.cover && !next.images.includes(next.cover)) {
      next.cover = next.images[0] ?? "";
    }
  }
  if (patch.cover !== undefined) {
    const cover = str(patch.cover, 300);
    next.cover = cover ? assertArtistPath(id, cover) : "";
  }

  store.artists[idx] = next;
  await writeStore(store);
  return next;
}

export async function deleteArtist(id: string): Promise<void> {
  assertSlug(id);
  const store = await readStore();
  const idx = store.artists.findIndex((a) => a.id === id);
  if (idx === -1) throw new StoreError(`Artist "${id}" not found`, 404);
  store.artists.splice(idx, 1);
  await writeStore(store);
  await fs.rm(artistDir(id), { recursive: true, force: true });
}

export async function moveArtist(id: string, direction: "up" | "down"): Promise<ArtistProject[]> {
  assertSlug(id);
  const store = await readStore();
  const idx = store.artists.findIndex((a) => a.id === id);
  if (idx === -1) throw new StoreError(`Artist "${id}" not found`, 404);
  const target = direction === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= store.artists.length) return store.artists;
  const [item] = store.artists.splice(idx, 1);
  store.artists.splice(target, 0, item);
  await writeStore(store);
  return store.artists;
}

export async function addPhotos(id: string, paths: string[]): Promise<ArtistProject> {
  assertSlug(id);
  const store = await readStore();
  const idx = store.artists.findIndex((a) => a.id === id);
  if (idx === -1) throw new StoreError(`Artist "${id}" not found`, 404);
  const artist = store.artists[idx];
  artist.images = [...artist.images, ...paths.map((p) => assertArtistPath(id, p))];
  if (!artist.cover && paths.length) artist.cover = paths[0];
  store.artists[idx] = artist;
  await writeStore(store);
  return artist;
}

export async function deletePhoto(id: string, photoPath: string): Promise<ArtistProject> {
  assertSlug(id);
  const clean = assertArtistPath(id, photoPath);
  const store = await readStore();
  const idx = store.artists.findIndex((a) => a.id === id);
  if (idx === -1) throw new StoreError(`Artist "${id}" not found`, 404);
  const artist = store.artists[idx];
  if (!artist.images.includes(clean)) {
    throw new StoreError("Photo not found for this artist", 404);
  }
  artist.images = artist.images.filter((p) => p !== clean);
  if (artist.cover === clean) artist.cover = artist.images[0] ?? "";
  store.artists[idx] = artist;
  await writeStore(store);
  const abs = path.join(artistDir(id), path.basename(clean));
  await fs.rm(abs, { force: true });
  return artist;
}
