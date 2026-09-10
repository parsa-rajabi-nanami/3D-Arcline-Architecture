import { describe, expect, it } from "vitest";

import { navLinks, processSteps, projects, studioStats } from "./landing-data";

describe("landing content", () => {
  it("keeps the primary navigation anchored to existing sections", () => {
    expect(navLinks.map((link) => link.href)).toEqual([
      "#design",
      "#process",
      "#projects",
      "#contact",
    ]);
  });

  it("contains complete project metadata for every featured project", () => {
    expect(projects).toHaveLength(3);
    expect(
      projects.every((project) => project.alt && project.width > 0 && project.height > 0),
    ).toBe(true);
  });

  it("keeps the studio proof points and process in display order", () => {
    expect(studioStats).toHaveLength(4);
    expect(processSteps.map((step) => step.n)).toEqual(["01", "02", "03"]);
  });
});
