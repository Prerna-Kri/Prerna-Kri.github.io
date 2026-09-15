import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Base path configuration per §3.4:
// If repository is exactly <username>.github.io or using a custom domain, base should be undefined.
// For project repository deployment on GitHub Pages (e.g., /Prerna_Website), set base: '/Prerna_Website'.
const REPO_NAME = 'Prerna-Kri.github.io';
const GITHUB_USERNAME = 'Prerna-Kri';
const isUserPage = REPO_NAME.toLowerCase() === `${GITHUB_USERNAME.toLowerCase()}.github.io`;

export default defineConfig({
  site: `https://${GITHUB_USERNAME}.github.io`,
  base: isUserPage ? undefined : `/${REPO_NAME}`,
  output: 'static',
  compressHTML: true,
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        themes: {
          light: 'github-light',
          dark: 'github-dark-default',
        },
        wrap: true,
      },
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
