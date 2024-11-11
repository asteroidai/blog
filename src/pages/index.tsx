import Link from 'next/link';
import matter from 'gray-matter';
import fs from "fs";
import path from "path";
import { BlogCard } from '@/components/BlogCard';
import Markdown from 'marked-react'

const Home = (props: {
  posts: [{
    slug: string,
    frontMatter: { [key: string]: string }
  }]
}) => {
  var posts = props.posts;
  // Sorted by date
  var sorted = posts.sort((a, b) => (
    new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
  ));

  return (
    <>
      {/* <Markdown value="# Hello" breaks={undefined} gfm={undefined} /> */}
      <main className="flex justify-center items-center min-h-screen py-24">
        <div className="container mx-auto px-4">
          <div className="px-8">
            <h1 className="text-4xl font-bold">Entropy Labs</h1>
            <h2 className="text-2xl text-right">Runtime agent eval</h2>

          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map(({ slug, frontMatter: { title, description }, frontMatter }) => (
                <Link key={slug} href={`/blog/${slug}`} passHref>
                  <div className="w-full">
                    <BlogCard title={title} description={description} frontMatter={frontMatter} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main >
    </>
  )
}

export async function getStaticProps() {
  // Get files from the posts dir
  console.log(path.join('posts'))
  let files = fs.readdirSync(path.join('posts'))

  files = files.filter(filename => !filename.includes("draft"))

  const posts = files.filter(filename => filename.includes(".md")).map((filename) => {
    // Create slug
    const slug = filename.replace('.md', '')

    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    )

    const { data: frontMatter } = matter(markdownWithMeta)

    return {
      slug,
      frontMatter,
    }
  }).sort((a, b) => (
    new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
  ));

  return {
    props: {
      posts,
    },
  }
}

export default Home
