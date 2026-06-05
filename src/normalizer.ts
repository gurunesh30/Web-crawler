export function normalizeURL(rawUrl: string, baseUrl: string): string | null {
  try {
    // 1. Resolve relative URLs against base URL
    // Scheme and host are automatically lowercased by the URL constructor
    const url = new URL(rawUrl, baseUrl);

    // Filter allowed schemes (http, https)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    // 3. Strip fragment
    url.hash = "";

    // 2. Strip trailing slash
    let pathname = url.pathname;
    if (pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    const portPart = url.port ? `:${url.port}` : "";
    const searchPart = url.search || "";

    return `${url.protocol}//${url.hostname}${portPart}${pathname}${searchPart}`;
  } catch (e) {
    return null;
  }
}

export function getDomain(urlStr: string): string | null {
  try {
    const url = new URL(urlStr);
    return url.hostname;
  } catch (e) {
    return null;
  }
}
