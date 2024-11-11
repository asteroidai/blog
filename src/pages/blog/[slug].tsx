import React from "react";
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import Markdown from 'marked-react'
import matter from 'gray-matter';
import md from "markdown-it";
import Lowlight from 'react-lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import go from 'highlight.js/lib/languages/go';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';

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

const BlogPost = (props: {
  frontMatter: { [key: string]: string },
  slug: string,
  content: string,
}) => (
  <main className="flex justify-center items-center min-h-screen py-8 px-2">
    <div className="container max-w-3xl px-3">
      <div className="pt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="text-left">
            <Link href="/" className="no-underline">
              <h4 className="text-2xl">&#60;- home</h4>
            </Link>
          </div>
          <div className="text-right">
            <Link href={`https://github.com/joehewett/super-simple-blog/blob/main/posts/${props.slug}.md`} className="no-underline">
              <Image
                src="/img/github.png"
                alt="GitHub"
                width={30}
                height={30}
                className="inline-block"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-8">
            <Image
              src={props.frontMatter.thumbnail}
              alt="Thumbnail"
              width={800}
              height={400}
              className="w-full mt-4"
            />
            <article
              className='prose lg:prose-lg'
              dangerouslySetInnerHTML={{
                __html: md().render(props.content
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </main>
);

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
