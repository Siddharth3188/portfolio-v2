import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects, projectHref } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", ...projects.map(projectHref), "/services", "/process", "/about", "/contact"];
  return paths.map((p) => ({ url: `${site.url}${p === "/" ? "" : p}` }));
}
