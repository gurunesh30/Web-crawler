import { describe, it, expect } from "vitest";
import { extractPageData } from "../worker/extractor.js";

describe("HTML Extractor", () => {
  it("should extract metadata, headings, clean text, and links", () => {
    const sampleHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page Title</title>
          <meta name="description" content="This is a test description.">
          <link rel="canonical" href="https://example.com/canonical-url">
        </head>
        <body>
          <style>body { color: red; }</style>
          <h1>Heading One</h1>
          <h2>Heading Two</h2>
          <h3>Heading Three</h3>
          <p>This is some body text. <a href="/about">About Us</a> and <a href="https://google.com">Google</a>.</p>
          <script>console.log("hello");</script>
        </body>
      </html>
    `;

    const result = extractPageData(sampleHtml);

    expect(result.title).toBe("Test Page Title");
    expect(result.description).toBe("This is a test description.");
    expect(result.canonicalUrl).toBe("https://example.com/canonical-url");
    expect(result.headings).toEqual({
      h1: ["Heading One"],
      h2: ["Heading Two"],
      h3: ["Heading Three"],
    });
    // Style and script tags should be stripped, only body paragraph and headings remain
    expect(result.textContent).toContain("Heading One Heading Two Heading Three This is some body text. About Us and Google.");
    expect(result.textContent).not.toContain("color: red");
    expect(result.textContent).not.toContain("console.log");
    
    expect(result.links).toEqual(["/about", "https://google.com"]);
  });

  it("should handle missing tags gracefully", () => {
    const sampleHtml = `
      <html>
        <body>
          <p>Just some text</p>
        </body>
      </html>
    `;

    const result = extractPageData(sampleHtml);

    expect(result.title).toBeNull();
    expect(result.description).toBeNull();
    expect(result.canonicalUrl).toBeNull();
    expect(result.headings).toEqual({ h1: [], h2: [], h3: [] });
    expect(result.textContent).toBe("Just some text");
    expect(result.links).toEqual([]);
  });
});
