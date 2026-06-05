import * as cheerio from "cheerio";

export interface ExtractedData {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  textContent: string | null;
  links: string[];
}

/**
 * Extracts metadata, headings, text content, and outgoing links from HTML.
 * Strips script and style tags before extracting text content.
 */
export function extractPageData(html: string): ExtractedData {
  const $ = cheerio.load(html);

  const title = $("title").text().trim() || null;
  const description = $("meta[name=description]").attr("content")?.trim() || null;
  const canonicalUrl = $("link[rel=canonical]").attr("href")?.trim() || null;

  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];

  $("h1").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h1.push(text);
  });
  $("h2").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h2.push(text);
  });
  $("h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h3.push(text);
  });

  // Clone body and remove script, style, noscript, and iframe elements
  const bodyClone = $("body").clone();
  bodyClone.find("script, style, noscript, iframe").remove();
  const textContent = bodyClone.text().replace(/\s+/g, " ").trim() || null;

  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim();
    if (href) {
      links.push(href);
    }
  });

  return {
    title,
    description,
    canonicalUrl,
    headings: { h1, h2, h3 },
    textContent,
    links,
  };
}
