import DOMPurify from "dompurify";
import type { Renderer } from "marked";
import { marked } from "marked";

const renderer: Partial<Renderer> = {
  link(href, title, text) {
    return `<a href="${href}" title="${title || ""}" rel="noopener noreferrer" target="_blank">${text}</a>`;
  },
};

marked.use({ renderer });

function cleanArkhamdbMarkdown(content: string): string {
  // fix: deck guides using valentin1337 template all contain invalid markdown for bolding in headlines.
  return content.replaceAll(
    /\*\*\s<center>(.*?)<\/center>\s\*\*/g,
    "**<center>$1</center>**",
  );
}

export function parseMarkdown(content: string): string {
  return DOMPurify.sanitize(
    marked.parse(cleanArkhamdbMarkdown(content)) as string,
    {
      ADD_ATTR: ["target"],
    },
  );
}
