import React from "react";
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import Markdown from 'marked-react'
import matter from 'gray-matter';
import md from "markdown-it";
import anchor from "markdown-it-anchor";
import Lowlight from 'react-lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import go from 'highlight.js/lib/languages/go';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';
import { useEffect, useState } from 'react';

Lowlight.registerLanguage('javascript', javascript);
Lowlight.registerLanguage('go', go);
Lowlight.registerLanguage('bash', bash);
Lowlight.registerLanguage('yaml', yaml);
Lowlight.registerLanguage('json', json);

const renderer = {
  code(snippet: string, lang: string) {
    return (
      <Lowlight
        language={lang || 'javascript'}
        value={snippet}
        inline={false}
      />
    );
  },
};

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  return (
    <div className="markdown-content">
      <Markdown renderer={renderer} breaks={true} gfm={true}>{markdown}</Markdown>
    </div>
  );
};

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC<{ items: ToCItem[] }> = ({ items }) => {
  return (
    <nav className="toc-nav sticky top-4 p-4 border rounded-md bg-white shadow-sm">
      <h3 className="font-bold mb-2">Table of Contents</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ marginLeft: `${(item.level - 1) * 1}rem` }}
          >
            <a
              href={`#${item.id}`}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const BlogPost = (props: {
  frontMatter: { [key: string]: string },
  slug: string,
  content: string,
}) => {
  const [tocItems, setTocItems] = useState<ToCItem[]>([]);

  useEffect(() => {
    // Parse headers from content
    const headers = props.content.split('\n')
      .filter(line => line.startsWith('#'))
      .map(line => {
        const level = line.match(/^#+/)?.[0]?.length || 1;
        const text = line.replace(/^#+\s+/, '');
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        return { id, text, level };
      });
    setTocItems(headers);
  }, [props.content]);

  // Create markdown-it instance with anchor plugin
  const mdParser = md({
    html: true,
    linkify: true,
    typographer: true
  }).use(anchor, {
    permalink: false,
    slugify: (s: string) => s.toLowerCase().replace(/[^\w]+/g, '-')
  });

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-8">
        {/* Main content - using the existing max-width from _app.tsx */}
        <div className="font-serif max-w-4xl">
          <div className="space-y-16">
            <Image
              src={props.frontMatter.thumbnail}
              alt="Thumbnail"
              width={800}
              height={400}
              className="w-full mt-4 rounded-md"
            />
            <article
              className='prose lg:prose-lg'
              dangerouslySetInnerHTML={{
                __html: mdParser.render(props.content)
              }}
            />
          </div>
        </div>

        {/* Table of Contents sidebar */}
        <div className="w-64 flex-shrink-0">
          <TableOfContents items={tocItems} />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.filter(filename => filename.includes(".md")).map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }: never) {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  )

  const { data: frontMatter, content } = matter(markdownWithMeta)

  return {
    props: {
      frontMatter,
      slug,
      content,
    },
  }
}
