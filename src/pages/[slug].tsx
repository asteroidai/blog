import React from "react";
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import matter from 'gray-matter';
import md from "markdown-it";
import anchor from "markdown-it-anchor";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import go from 'highlight.js/lib/languages/go';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import { useEffect, useState } from 'react';

// import 'highlight.js/styles/github.css';
// import 'highlight.js/styles/github-dark.css';
// import 'highlight.js/styles/nord.css';
// import 'highlight.js/styles/dracula.css';
// import 'highlight.js/styles/monokai.css';
// import 'highlight.js/styles/night-owl.css';
// import 'highlight.js/styles/tokyo-night.css';
// import 'highlight.js/styles/github-dark-dimmed.css';
// import 'highlight.js/styles/github-dark.css';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('go', go);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);

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

const ImageModal: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
    </div>
  );
};

const BlogPost = (props: {
  frontMatter: { [key: string]: string },
  slug: string,
  content: string,
}) => {
  const [tocItems, setTocItems] = useState<ToCItem[]>([]);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

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
    typographer: true,
    highlight: function (str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (e) {
          console.error(e);
        }
      }
      return ''; // use external default escaping
    }
  }).use(anchor, {
    permalink: false,
    slugify: (s: string) => s.toLowerCase().replace(/[^\w]+/g, '-')
  });

  // Add custom container plugin
  mdParser.use(require('markdown-it-container'), 'button', {
    validate: function (params: string) {
      return params.trim().match(/^button\s+(.*)$/);
    },

    render: function (tokens: any, idx: number) {
      const m = tokens[idx].info.trim().match(/^button\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<a href="${m[1]}" class="inline-block px-4 mt-8 border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors">`;
      } else {
        // closing tag
        return '</a>\n';
      }
    }
  });

  // Add custom render rule for images
  mdParser.renderer.rules.image = (tokens: any, idx: number) => {
    const token = tokens[idx];
    const src = token.attrGet('src') || '';
    const alt = token.content || '';

    // Check if the source is an MP4 video
    if (src.endsWith('.mp4')) {
      return `
        <video 
          controls
          class="w-full rounded-lg"
          playsinline
        >
          <source src="${src}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    }

    // Regular image handling
    return `
      <div class="cursor-zoom-in" onclick="window.handleImageClick('${src}', '${alt}')">
        <img src="${src}" alt="${alt}" class="rounded-lg hover:opacity-90 transition-opacity" />
      </div>
    `;
  };

  // Add effect to setup click handler
  useEffect(() => {
    window.handleImageClick = (src: string, alt: string) => {
      setModalImage({ src, alt });
    };
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Add modal */}
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 md:flex-shrink-0">
          <TableOfContents items={tocItems} />
        </div>

        <div className="max-w-4xl">
          <div className="space-y-16">
            <Image
              src={props.frontMatter.thumbnail}
              alt="Thumbnail"
              width={800}
              height={400}
              className="w-full rounded-md"
            />
            <article
              className='prose lg:prose-lg'
              dangerouslySetInnerHTML={{
                __html: mdParser.render(props.content)
              }}
            />
          </div>
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

// Add type declaration for window
declare global {
  interface Window {
    handleImageClick: (src: string, alt: string) => void;
  }
}
