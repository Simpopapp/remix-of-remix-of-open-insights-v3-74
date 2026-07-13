import { seekTo, parseTimestamp } from "./video-bus";

// Tiny markdown renderer for note previews.
// Supports: # ## ###, **bold**, *italic*, `code`, - lists, links, [mm:ss] timestamps.

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string) {
  let out = escapeHtml(s);
  // links [text](url)
  out = out.replace(
    /\[([^\]]+)\]\((https?:[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline underline-offset-2">$1</a>',
  );
  // timestamps [mm:ss] or [h:mm:ss]
  out = out.replace(
    /\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g,
    '<button data-ts="$1" class="mx-0.5 rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[11px] text-primary hover:bg-primary/25">$1</button>',
  );
  // bold **x**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic *x*
  out = out.replace(/(^|\s)\*([^*\n]+)\*/g, "$1<em>$2</em>");
  // code `x`
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">$1</code>',
  );
  return out;
}

export function renderMarkdown(src: string): string {
  const lines = src.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;
  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      html.push("");
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^###\s+(.+)/))) {
      closeList();
      html.push(`<h3 class="mt-4 font-serif text-lg">${inline(m[1])}</h3>`);
    } else if ((m = line.match(/^##\s+(.+)/))) {
      closeList();
      html.push(`<h2 class="mt-5 font-serif text-xl">${inline(m[1])}</h2>`);
    } else if ((m = line.match(/^#\s+(.+)/))) {
      closeList();
      html.push(`<h1 class="mt-6 font-serif text-2xl">${inline(m[1])}</h1>`);
    } else if ((m = line.match(/^\s*[-*]\s+(.+)/))) {
      if (!inList) {
        html.push('<ul class="ml-5 list-disc space-y-1">');
        inList = true;
      }
      html.push(`<li>${inline(m[1])}</li>`);
    } else {
      closeList();
      html.push(`<p class="leading-relaxed">${inline(line)}</p>`);
    }
  }
  closeList();
  return html.join("\n");
}

// Attach delegated click handler for timestamp buttons within an element.
export function bindTimestamps(root: HTMLElement | null) {
  if (!root) return () => {};
  const onClick = (e: Event) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-ts]");
    if (!t) return;
    e.preventDefault();
    seekTo(parseTimestamp(t.dataset.ts!));
  };
  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
