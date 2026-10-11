"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { apiJson } from "./api";
import { Btn, Field, Label, Section, TextArea, Select } from "./ui";

type ToastFn = (message: string, kind?: "ok" | "err") => void;

function clone<T>(v: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : (JSON.parse(JSON.stringify(v)) as T);
}

function ImagePreview({ src }: { src: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      className="w-16 h-12 object-cover rounded border border-white/10"
    />
  );
}

function UploadBtn({
  label,
  accept = "image/*",
  busyKey,
  hint,
  uploading,
  onPick,
  onUploaded,
}: {
  label: string;
  accept?: string;
  busyKey: string;
  hint?: string;
  uploading: string | null;
  onPick: (file: File) => Promise<{ publicPath: string; width?: number; height?: number } | null>;
  onUploaded: (path: string, width?: number, height?: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const res = await onPick(file);
          if (res) onUploaded(res.publicPath, res.width, res.height);
          if (ref.current) ref.current.value = "";
        }}
      />
      <Btn onClick={() => ref.current?.click()} disabled={uploading !== null}>
        {uploading === busyKey ? "Uploading…" : label}
      </Btn>
      {hint && <span className="text-[10px] text-[#444]">{hint}</span>}
    </div>
  );
}

export default function ContentPanel({
  content,
  setContent,
  toast,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  toast: ToastFn;
}) {
  const [draft, setDraft] = useState<SiteContent>(() => clone(content));
  const [saving, setSaving] = useState(false);
  const [uploadField, setUploadField] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDraft(clone(content)), 0);
    return () => clearTimeout(t);
  }, [content]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  function upd<K extends keyof SiteContent>(section: K, patch: Partial<SiteContent[K]>) {
    setDraft((d) => ({ ...d, [section]: { ...d[section], ...patch } }));
  }

  async function save() {
    setSaving(true);
    try {
      const { content: saved } = await apiJson<{ content: SiteContent }>(
        "/api/content",
        { method: "PUT", body: JSON.stringify({ content: draft }) },
      );
      setContent(saved);
      toast("Content saved");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(
    file: File,
    key: string,
  ): Promise<{ publicPath: string; width?: number; height?: number } | null> {
    setUploadField(key);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiJson<{ publicPath: string; width?: number; height?: number }>(
        "/api/media",
        { method: "POST", body: form },
      );
      toast(`Uploaded ${res.publicPath}`);
      return res;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "err");
      return null;
    } finally {
      setUploadField(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-14 z-40 bg-[#0a0a0a]/95 backdrop-blur-md py-3 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-white/5">
        <span className="text-xs text-[#555]">
          {dirty ? (
            <span className="text-[#c8ff00]">● Unsaved changes</span>
          ) : (
            "All changes saved"
          )}
        </span>
        <Btn variant="primary" onClick={save} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save content"}
        </Btn>
      </div>

      {/* Site */}
      <Section title="Site metadata">
        <Field
          label="Page title"
          value={draft.site.title}
          onChange={(v) => upd("site", { title: v })}
        />
        <TextArea
          label="Description"
          value={draft.site.description}
          onChange={(v) => upd("site", { description: v })}
          rows={2}
        />
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Field
              label="OG image path"
              value={draft.site.ogImage}
              onChange={(v) => upd("site", { ogImage: v })}
              mono
            />
          </div>
          <ImagePreview src={draft.site.ogImage} />
          <UploadBtn
            label="Upload"
            busyKey="ogImage"
            uploading={uploadField}
            onPick={(f) => uploadFile(f, "ogImage")}
            onUploaded={(path) => upd("site", { ogImage: path })}
          />
        </div>
      </Section>

      {/* Nav */}
      <Section title="Navigation">
        <Field
          label="Brand"
          value={draft.nav.brand}
          onChange={(v) => upd("nav", { brand: v })}
        />
        {draft.nav.links.map((link, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <Field
                label={`Link ${i + 1} name`}
                value={link.name}
                onChange={(v) => {
                  const links = [...draft.nav.links];
                  links[i] = { ...link, name: v };
                  upd("nav", { links });
                }}
              />
            </div>
            <div className="flex-1">
              <Field
                label="Href"
                value={link.href}
                onChange={(v) => {
                  const links = [...draft.nav.links];
                  links[i] = { ...link, href: v };
                  upd("nav", { links });
                }}
                mono
              />
            </div>
            <Btn
              variant="danger"
              onClick={() =>
                upd("nav", { links: draft.nav.links.filter((_, j) => j !== i) })
              }
            >
              ✕
            </Btn>
          </div>
        ))}
        <Btn
          onClick={() =>
            upd("nav", { links: [...draft.nav.links, { name: "New", href: "#" }] })
          }
        >
          + Add link
        </Btn>
      </Section>

      {/* Hero */}
      <Section title="Hero">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Eyebrow"
            value={draft.hero.eyebrow}
            onChange={(v) => upd("hero", { eyebrow: v })}
          />
          <Field
            label="Scroll hint"
            value={draft.hero.scrollHint}
            onChange={(v) => upd("hero", { scrollHint: v })}
          />
          <Field
            label="Title line 1"
            value={draft.hero.titleLine1}
            onChange={(v) => upd("hero", { titleLine1: v })}
          />
          <Field
            label="Title line 2 (outlined)"
            value={draft.hero.titleLine2}
            onChange={(v) => upd("hero", { titleLine2: v })}
          />
        </div>
        <TextArea
          label="Paragraph"
          value={draft.hero.paragraph}
          onChange={(v) => upd("hero", { paragraph: v })}
          rows={2}
        />
        <Field
          label="Video path"
          value={draft.hero.video}
          onChange={(v) => upd("hero", { video: v })}
          mono
        />
        <UploadBtn
          label="Upload video (mp4/webm)"
          accept="video/mp4,video/webm"
          busyKey="heroVideo"
          uploading={uploadField}
          hint="Large files may be limited on some hosts"
          onPick={(f) => uploadFile(f, "heroVideo")}
          onUploaded={(path) => upd("hero", { video: path })}
        />
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Field
              label="Poster path"
              value={draft.hero.poster}
              onChange={(v) => upd("hero", { poster: v })}
              mono
            />
          </div>
          <ImagePreview src={draft.hero.poster} />
          <UploadBtn
            label="Upload poster"
            busyKey="heroPoster"
            uploading={uploadField}
            onPick={(f) => uploadFile(f, "heroPoster")}
            onUploaded={(path) => upd("hero", { poster: path })}
          />
        </div>
      </Section>

      {/* Marquee */}
      <Section title="Marquee words">
        <div className="flex flex-wrap gap-2">
          {draft.marquee.items.map((word, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141414] border border-white/10 text-xs"
            >
              {word}
              <button
                onClick={() =>
                  upd("marquee", {
                    items: draft.marquee.items.filter((_, j) => j !== i),
                  })
                }
                className="text-[#666] hover:text-red-400"
                aria-label={`Remove ${word}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <AddRow
          placeholder="New word"
          onAdd={(v) => upd("marquee", { items: [...draft.marquee.items, v] })}
        />
      </Section>

      {/* Work */}
      <Section title="Work section">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Eyebrow"
            value={draft.work.eyebrow}
            onChange={(v) => upd("work", { eyebrow: v })}
          />
          <Field
            label="Heading"
            value={draft.work.heading}
            onChange={(v) => upd("work", { heading: v })}
          />
          <Field
            label="Featured label"
            value={draft.work.featuredLabel}
            onChange={(v) => upd("work", { featuredLabel: v })}
          />
          <Field
            label="All projects label"
            value={draft.work.allProjectsLabel}
            onChange={(v) => upd("work", { allProjectsLabel: v })}
          />
        </div>
      </Section>

      {/* About */}
      <Section title="About">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Eyebrow"
            value={draft.about.eyebrow}
            onChange={(v) => upd("about", { eyebrow: v })}
          />
          <Field
            label="CTA label"
            value={draft.about.ctaLabel}
            onChange={(v) => upd("about", { ctaLabel: v })}
          />
          <Field
            label="Heading line 1"
            value={draft.about.headingLine1}
            onChange={(v) => upd("about", { headingLine1: v })}
          />
          <Field
            label="Heading line 2"
            value={draft.about.headingLine2}
            onChange={(v) => upd("about", { headingLine2: v })}
          />
          <Field
            label="Name"
            value={draft.about.name}
            onChange={(v) => upd("about", { name: v })}
          />
          <Field
            label="Subtitle"
            value={draft.about.subtitle}
            onChange={(v) => upd("about", { subtitle: v })}
          />
          <Field
            label="Photo alt text"
            value={draft.about.photoAlt}
            onChange={(v) => upd("about", { photoAlt: v })}
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Field
              label="Photo path"
              value={draft.about.photo}
              onChange={(v) => upd("about", { photo: v })}
              mono
            />
          </div>
          <ImagePreview src={draft.about.photo} />
          <UploadBtn
            label="Upload"
            busyKey="aboutPhoto"
            uploading={uploadField}
            onPick={(f) => uploadFile(f, "aboutPhoto")}
            onUploaded={(path) => upd("about", { photo: path })}
          />
        </div>
        <Label>Story paragraphs (HTML allowed: span, em, strong, class)</Label>
        {draft.about.paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <TextArea
                label={`Paragraph ${i + 1}`}
                value={p}
                rows={3}
                mono
                onChange={(v) => {
                  const paragraphs = [...draft.about.paragraphs];
                  paragraphs[i] = v;
                  upd("about", { paragraphs });
                }}
              />
            </div>
            <Btn
              variant="danger"
              className="mt-6"
              onClick={() =>
                upd("about", {
                  paragraphs: draft.about.paragraphs.filter((_, j) => j !== i),
                })
              }
            >
              ✕
            </Btn>
          </div>
        ))}
        <Btn
          onClick={() =>
            upd("about", { paragraphs: [...draft.about.paragraphs, "New paragraph"] })
          }
        >
          + Add paragraph
        </Btn>
      </Section>

      {/* Gear */}
      <Section title="Gear">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Eyebrow"
            value={draft.gear.eyebrow}
            onChange={(v) => upd("gear", { eyebrow: v })}
          />
          <Field
            label="Heading"
            value={draft.gear.heading}
            onChange={(v) => upd("gear", { heading: v })}
          />
        </div>
        <TextArea
          label="Description"
          value={draft.gear.description}
          onChange={(v) => upd("gear", { description: v })}
          rows={2}
        />

        {draft.gear.items.map((item, i) => (
          <details
            key={item.id}
            className="border border-white/5 rounded-lg bg-[#0f0f0f] overflow-hidden"
          >
            <summary className="flex items-center justify-between px-3 py-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-xs">
              <span className="font-medium">
                {item.name || `Item ${i + 1}`}
                <span className="text-[#555] ml-2 font-mono">{item.category}</span>
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  upd("gear", {
                    items: draft.gear.items.filter((_, j) => j !== i),
                  });
                }}
                className="text-[#666] hover:text-red-400 text-xs"
              >
                Remove
              </button>
            </summary>
            <div className="px-3 pb-3 space-y-2 border-t border-white/5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field
                  label="Name"
                  value={item.name}
                  onChange={(v) => {
                    const items = [...draft.gear.items];
                    items[i] = { ...item, name: v };
                    upd("gear", { items });
                  }}
                />
                <Field
                  label="Category"
                  value={item.category}
                  onChange={(v) => {
                    const items = [...draft.gear.items];
                    items[i] = { ...item, category: v };
                    upd("gear", { items });
                  }}
                />
                <Field
                  label="Tagline"
                  value={item.tagline}
                  onChange={(v) => {
                    const items = [...draft.gear.items];
                    items[i] = { ...item, tagline: v };
                    upd("gear", { items });
                  }}
                />
                <Field
                  label="Accent color"
                  value={item.accent}
                  onChange={(v) => {
                    const items = [...draft.gear.items];
                    items[i] = { ...item, accent: v };
                    upd("gear", { items });
                  }}
                  mono
                />
                <Field
                  label="Link"
                  value={item.link}
                  onChange={(v) => {
                    const items = [...draft.gear.items];
                    items[i] = { ...item, link: v };
                    upd("gear", { items });
                  }}
                  mono
                />
                <Select
                  label="Column"
                  value={item.column}
                  onChange={(v) => {
                    const items = [...draft.gear.items];
                    items[i] = { ...item, column: v as "left" | "right" };
                    upd("gear", { items });
                  }}
                  options={[
                    { value: "left", label: "Left grid" },
                    { value: "right", label: "Right column" },
                  ]}
                />
              </div>
              <TextArea
                label="Description"
                value={item.description}
                rows={2}
                onChange={(v) => {
                  const items = [...draft.gear.items];
                  items[i] = { ...item, description: v };
                  upd("gear", { items });
                }}
              />
              <TextArea
                label="Specs (one per line)"
                value={item.specs.join("\n")}
                rows={2}
                onChange={(v) => {
                  const items = [...draft.gear.items];
                  items[i] = {
                    ...item,
                    specs: v.split("\n").map((s) => s.trim()).filter(Boolean),
                  };
                  upd("gear", { items });
                }}
              />
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Field
                    label="Image path"
                    value={item.image}
                    onChange={(v) => {
                      const items = [...draft.gear.items];
                      items[i] = { ...item, image: v };
                      upd("gear", { items });
                    }}
                    mono
                  />
                </div>
                <ImagePreview src={item.image} />
                <UploadBtn
                  label="Upload"
                  busyKey={`gear-${item.id}`}
                  uploading={uploadField}
                  onPick={(f) => uploadFile(f, `gear-${item.id}`)}
                  onUploaded={(path, width, height) => {
                    const items = [...draft.gear.items];
                    items[i] = {
                      ...item,
                      image: path,
                      imageW: width || item.imageW,
                      imageH: height || item.imageH,
                    };
                    upd("gear", { items });
                  }}
                />
              </div>
            </div>
          </details>
        ))}
        <Btn
          onClick={() =>
            upd("gear", {
              items: [
                ...draft.gear.items,
                {
                  id: `gear-${Date.now()}`,
                  name: "New gear",
                  category: "Category",
                  tagline: "Tagline",
                  description: "Description",
                  specs: [],
                  image: "",
                  imageW: 800,
                  imageH: 600,
                  span: "",
                  link: "",
                  accent: "#c8ff00",
                  column: "left",
                },
              ],
            })
          }
        >
          + Add gear item
        </Btn>
      </Section>

      {/* Testimonials */}
      <Section title="Testimonials">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Eyebrow"
            value={draft.testimonials.eyebrow}
            onChange={(v) => upd("testimonials", { eyebrow: v })}
          />
          <Field
            label="Heading"
            value={draft.testimonials.heading}
            onChange={(v) => upd("testimonials", { heading: v })}
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Field
              label="Background image path"
              value={draft.testimonials.backgroundImage}
              onChange={(v) => upd("testimonials", { backgroundImage: v })}
              mono
            />
          </div>
          <ImagePreview src={draft.testimonials.backgroundImage} />
          <UploadBtn
            label="Upload"
            busyKey="testimonialBg"
            uploading={uploadField}
            onPick={(f) => uploadFile(f, "testimonialBg")}
            onUploaded={(path) => upd("testimonials", { backgroundImage: path })}
          />
        </div>
        {draft.testimonials.items.map((t, i) => (
          <div key={t.id} className="border border-white/5 rounded-lg p-3 space-y-2 bg-[#0f0f0f]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#555]">
                Quote {i + 1}
              </span>
              <button
                onClick={() =>
                  upd("testimonials", {
                    items: draft.testimonials.items.filter((_, j) => j !== i),
                  })
                }
                className="text-[#666] hover:text-red-400 text-xs"
              >
                Remove
              </button>
            </div>
            <TextArea
              label="Quote"
              value={t.quote}
              rows={2}
              onChange={(v) => {
                const items = [...draft.testimonials.items];
                items[i] = { ...t, quote: v };
                upd("testimonials", { items });
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Author"
                value={t.author}
                onChange={(v) => {
                  const items = [...draft.testimonials.items];
                  items[i] = { ...t, author: v };
                  upd("testimonials", { items });
                }}
              />
              <Field
                label="Event"
                value={t.event}
                onChange={(v) => {
                  const items = [...draft.testimonials.items];
                  items[i] = { ...t, event: v };
                  upd("testimonials", { items });
                }}
              />
            </div>
          </div>
        ))}
        <Btn
          onClick={() =>
            upd("testimonials", {
              items: [
                ...draft.testimonials.items,
                {
                  id: `t${Date.now()}`,
                  quote: "New quote",
                  author: "Name",
                  event: "Event",
                },
              ],
            })
          }
        >
          + Add testimonial
        </Btn>
      </Section>

      {/* Contact */}
      <Section title="Contact & footer">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Eyebrow"
            value={draft.contact.eyebrow}
            onChange={(v) => upd("contact", { eyebrow: v })}
          />
          <Field
            label="Email"
            value={draft.contact.email}
            onChange={(v) => upd("contact", { email: v })}
            mono
          />
          <Field
            label="Heading line 1"
            value={draft.contact.headingLine1}
            onChange={(v) => upd("contact", { headingLine1: v })}
          />
          <Field
            label="Heading line 2"
            value={draft.contact.headingLine2}
            onChange={(v) => upd("contact", { headingLine2: v })}
          />
        </div>
        <TextArea
          label="Paragraph"
          value={draft.contact.paragraph}
          rows={2}
          onChange={(v) => upd("contact", { paragraph: v })}
        />
        <Label>Social links</Label>
        {draft.contact.socials.map((s, i) => (
          <div key={s.id} className="flex gap-2 items-end">
            <div className="w-32">
              <Field
                label="Label"
                value={s.label}
                onChange={(v) => {
                  const socials = [...draft.contact.socials];
                  socials[i] = { ...s, label: v };
                  upd("contact", { socials });
                }}
              />
            </div>
            <div className="flex-1">
              <Field
                label="URL"
                value={s.href}
                onChange={(v) => {
                  const socials = [...draft.contact.socials];
                  socials[i] = { ...s, href: v };
                  upd("contact", { socials });
                }}
                mono
              />
            </div>
            <div className="w-28">
              <Select
                label="Icon"
                value={s.icon}
                onChange={(v) => {
                  const socials = [...draft.contact.socials];
                  socials[i] = { ...s, icon: v as typeof s.icon };
                  upd("contact", { socials });
                }}
                options={[
                  { value: "instagram", label: "Instagram" },
                  { value: "whatsapp", label: "WhatsApp" },
                  { value: "youtube", label: "YouTube" },
                  { value: "generic", label: "Generic" },
                ]}
              />
            </div>
            <Btn
              variant="danger"
              onClick={() =>
                upd("contact", {
                  socials: draft.contact.socials.filter((_, j) => j !== i),
                })
              }
            >
              ✕
            </Btn>
          </div>
        ))}
        <Btn
          onClick={() =>
            upd("contact", {
              socials: [
                ...draft.contact.socials,
                {
                  id: `social-${Date.now()}`,
                  label: "New",
                  href: "https://",
                  icon: "generic",
                },
              ],
            })
          }
        >
          + Add social
        </Btn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Field
            label="Footer copyright"
            value={draft.contact.footerCopyright}
            onChange={(v) => upd("contact", { footerCopyright: v })}
          />
          <Field
            label="Footer 'Crafted with'"
            value={draft.contact.footerCrafted}
            onChange={(v) => upd("contact", { footerCrafted: v })}
          />
          <Field
            label="Footer heart"
            value={draft.contact.footerHeart}
            onChange={(v) => upd("contact", { footerHeart: v })}
          />
          <Field
            label="Footer location"
            value={draft.contact.footerLocation}
            onChange={(v) => upd("contact", { footerLocation: v })}
          />
        </div>
      </Section>

      {/* Preloader */}
      <Section title="Preloader">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field
            label="Brand"
            value={draft.preloader.brand}
            onChange={(v) => upd("preloader", { brand: v })}
          />
          <Field
            label="Bottom left"
            value={draft.preloader.bottomLeft}
            onChange={(v) => upd("preloader", { bottomLeft: v })}
          />
          <Field
            label="Bottom right"
            value={draft.preloader.bottomRight}
            onChange={(v) => upd("preloader", { bottomRight: v })}
          />
        </div>
      </Section>
    </div>
  );
}

function AddRow({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (v: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            onAdd(value.trim());
            setValue("");
          }
        }}
        placeholder={placeholder}
        className="flex-1 max-w-56 bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#c8ff00]/50 focus:outline-none"
      />
      <Btn
        onClick={() => {
          if (!value.trim()) return;
          onAdd(value.trim());
          setValue("");
        }}
      >
        + Add
      </Btn>
    </div>
  );
}
