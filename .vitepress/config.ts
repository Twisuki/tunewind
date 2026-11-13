import type { UserConfig } from "vitepress"
import type { VitePressSidebarOptions } from "vitepress-sidebar/types"
import { defineConfig } from "vitepress"
import { withSidebar } from "vitepress-sidebar"

const sidebarOptions = {
  documentRootPath: "docs",
  includeRootIndexFile: true,
  includeFolderIndexFile: true,
  sortMenusByFrontmatterOrder: true,
  useTitleFromFrontmatter: true,
}

/** sidebar options of the root locale, excluding the nested locale directory */
function rootSidebar(): VitePressSidebarOptions {
  return {
    ...sidebarOptions,
    resolvePath: "/",
    excludeByGlobPattern: ["zh"],
  }
}

/** sidebar options of a nested locale directory */
function localeSidebar(path: string): VitePressSidebarOptions {
  return {
    ...sidebarOptions,
    scanStartPath: path,
    resolvePath: `/${path}/`,
  }
}

const config = {
  srcDir: "docs",
  title: "Tunewind",
  description: "A highly configurable, strongly constrained and extensible atomic CSS solution and design system.",
  lastUpdated: true,
  sitemap: {
    hostname: "https://tune.twis.uk",
  },
  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/Twisuki/tunewind" },
    ],
    search: {
      provider: "local",
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
    },
  },
  markdown: {
    html: false,
  },
} satisfies UserConfig

export default defineConfig(withSidebar(config, [
  rootSidebar(),
  localeSidebar("zh"),
]))
