const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = '/Users/adityajandu/Coding/brothers-car-rental';
const OUTPUT_FILE = path.join(WORKSPACE_DIR, 'blog_and_seo_compiled.md');

const CORE_CODE_FILES = [
  'next.config.ts',
  'mdx-components.tsx',
  'src/app/layout.tsx',
  'src/app/sitemap.ts',
  'src/app/(onboarding)/blog/page.tsx',
  'src/app/(onboarding)/blog/[slug]/page.tsx',
  'src/lib/mdx.ts',
  'src/modules/info/blog/types.ts',
  'src/modules/info/blog/ui/views/BlogView.tsx',
  'src/modules/info/blog/ui/views/BlogPostView.tsx',
  'src/modules/info/blog/ui/components/PostCard.tsx',
  'src/modules/info/blog/ui/components/RelatedPosts.tsx',
  'src/modules/info/blog/ui/components/ReadingProgressBar.tsx',
  'src/modules/info/blog/ui/components/BlogFilters.tsx',
  'src/components/blog/seo/ArticleStructuredData.tsx',
  'src/components/blog/seo/EditorialTrustBlock.tsx',
  'src/components/blog/TableOfContents.tsx',
  'src/components/blog/BlogCallToAction.tsx',
  'src/components/blog/ComparisonTable.tsx',
  'src/components/blog/Heading.tsx'
];

function getMdxFiles() {
  const contentDir = path.join(WORKSPACE_DIR, 'content', 'blog');
  if (!fs.existsSync(contentDir)) {
    console.warn(`Warning: content/blog directory not found at ${contentDir}`);
    return [];
  }
  return fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join('content/blog', file));
}

function getFileLanguage(filePath) {
  const ext = path.extname(filePath);
  if (ext === '.ts') return 'typescript';
  if (ext === '.tsx') return 'tsx';
  if (ext === '.mdx') return 'mdx';
  if (ext === '.json') return 'json';
  return 'text';
}

function run() {
  console.log('Starting compilation of Blog & SEO files...');
  let markdown = `# Brothers Car Rental - Blog & SEO Context Compiled

This document is a compiled snapshot of all blog and SEO-related files in the project. It includes Next.js App Router route handlers, core blog React components, custom MDX libraries, structured SEO data (JSON-LD), table of contents, sitemap generators, and all 100 blog posts (MDX format). 

Use this file to provide complete context to other AI agents or online LLM services.

---

## Table of Contents
1. **Core Blog & SEO Code Files**
${CORE_CODE_FILES.map((file, idx) => `   - [${file}](#file-${file.replace(/[^a-zA-Z0-9]/g, '-')})`).join('\n')}
2. **Blog Posts (MDX Articles)**
   - Listed alphabetically below the code files.

---

## Core Blog & SEO Code Files

`;

  // Compile code files
  for (const file of CORE_CODE_FILES) {
    const fullPath = path.join(WORKSPACE_DIR, file);
    const anchorId = `file-${file.replace(/[^a-zA-Z0-9]/g, '-')}`;
    console.log(`Processing core file: ${file}`);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lang = getFileLanguage(file);
      markdown += `<a id="${anchorId}"></a>\n### File: [${file}](file://${fullPath})\n\n`;
      markdown += `\`\`\`${lang}\n${content}\n\`\`\`\n\n---\n\n`;
    } else {
      markdown += `<a id="${anchorId}"></a>\n### File: ${file} (NOT FOUND)\n\n---\n\n`;
      console.warn(`File not found: ${fullPath}`);
    }
  }

  // Compile MDX files
  markdown += `## Blog Posts (MDX Articles)\n\n`;
  const mdxFiles = getMdxFiles();
  console.log(`Found ${mdxFiles.length} MDX blog post files.`);

  // Sort them alphabetically for consistency
  mdxFiles.sort();

  for (const file of mdxFiles) {
    const fullPath = path.join(WORKSPACE_DIR, file);
    const basename = path.basename(file);
    const slug = basename.replace(/\.mdx$/, '');
    const anchorId = `post-${slug}`;
    console.log(`Processing MDX file: ${basename}`);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      markdown += `<a id="${anchorId}"></a>\n### Blog Post: [${file}](file://${fullPath})\n\n`;
      markdown += `\`\`\`mdx\n${content}\n\`\`\`\n\n---\n\n`;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
  console.log(`Successfully generated compiled file: ${OUTPUT_FILE}`);
}

run();
