import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the client module
vi.mock("../db/client.js", () => {
  return {
    query: vi.fn(),
  };
});

import { query } from "../db/client.js";
import { getPendingDomains, getPendingCounts } from "../frontier/frontier.js";

const mockedQuery = vi.mocked(query);

describe("URL Frontier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPendingDomains", () => {
    it("should query and return active pending domains", async () => {
      mockedQuery.mockResolvedValue({
        rows: [{ domain: "react.dev" }, { domain: "typescriptlang.org" }],
      } as any);

      const domains = await getPendingDomains();

      expect(mockedQuery).toHaveBeenCalledTimes(1);
      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining("SELECT DISTINCT domain"));
      expect(domains).toEqual(["react.dev", "typescriptlang.org"]);
    });
  });

  describe("getPendingCounts", () => {
    it("should query and return count breakdown of pending domains", async () => {
      mockedQuery.mockResolvedValue({
        rows: [
          { domain: "react.dev", count: "10" },
          { domain: "typescriptlang.org", count: "5" },
        ],
      } as any);

      const counts = await getPendingCounts();

      expect(mockedQuery).toHaveBeenCalledTimes(1);
      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining("COUNT(*)"));
      expect(counts).toEqual({
        "react.dev": 10,
        "typescriptlang.org": 5,
      });
    });
  });
});
