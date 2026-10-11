const ALLOWED_TAGS = new Set([
  "span",
  "em",
  "strong",
  "b",
  "i",
  "br",
  "a",
  "code",
  "sub",
  "sup",
]);

const TAG_ATTRS: Record<string, string[]> = {
  a: ["href", "target", "rel"],
};

const GLOBAL_ATTRS = ["class"];

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

export function sanitizeHtml(input: string): string {
  let s = String(input ?? "");

  s = s.replace(
    /<(script|style|iframe|object|embed|link|meta|form|input|button)[\s\S]*?<\/\1\s*>/gi,
    "",
  );
  s = s.replace(/<(script|style|iframe|object|embed|link|meta|form|input|button)[^>]*\/?>/gi, "");

  s = s.replace(/<\/?([a-zA-Z0-9][a-zA-Z0-9-]*)\s*((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (_m, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (_m.startsWith("</")) return `</${tag}>`;

    const allowed = new Set([...(TAG_ATTRS[tag] ?? []), ...GLOBAL_ATTRS]);
    const parts: string[] = [];
    const attrRe = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(rawAttrs)) !== null) {
      const name = m[1].toLowerCase();
      const value = m[2] ?? m[3] ?? m[4] ?? "";
      if (!allowed.has(name)) continue;
      if ((name === "href" || name === "src") && !SAFE_URL.test(value.trim())) continue;
      parts.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
    }
    const attrStr = parts.length ? ` ${parts.join(" ")}` : "";
    return tag === "br" ? `<br${attrStr} />` : `<${tag}${attrStr}>`;
  });

  s = s.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  s = s.replace(/javascript:/gi, "");

  return s;
}

export function sanitizeText(input: unknown, max = 500): string {
  return String(input ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, max);
}
