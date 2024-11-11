import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from "@vercel/analytics/react"
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MailIcon, CalendarIcon, BookIcon, LibraryIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

function Blog({ Component, pageProps }: AppProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("devs@entropy-labs.ai")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main>
      <div className="font-serif max-w-4xl mx-auto pb-32">
        <div className="container mx-auto space-y-16 pt-36 px-8">
          <Card className="outline-none shadow-none border-none">
            <CardHeader className="px-0 pb-12">
              <CardTitle className="">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                  <Link href="https://entropy-labs.ai">
                    <p className="text-4xl font-bold">
                      Entropy Labs
                    </p>
                  </Link>
                  <div className="w-full md:w-auto">
                    <div className="flex flex-row items-center gap-8">
                      <button
                        onClick={copyEmail}
                        className="text-sm text-muted-foreground font-mono font-normal tracking-wide hover:text-foreground transition-colors relative flex items-center gap-2"
                      >
                        <MailIcon className="h-4 w-4" />
                        Contact
                        {copied && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-300 text-white text-xs py-1 px-2 rounded">
                            Copied!
                          </span>
                        )}
                      </button>
                      <a
                        href="https://calendly.com/david-mlcoch-entropy-labs/entropy-labs-demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground font-mono font-normal tracking-wide hover:text-foreground transition-colors relative flex items-center gap-2"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        Demo
                      </a>

                      <a href="https://docs.entropy-labs.ai"
                        className="text-sm text-muted-foreground font-mono font-normal tracking-wide hover:text-foreground transition-colors relative flex items-center gap-2">
                        <BookIcon className="h-4 w-4" />
                        Docs
                      </a>

                      <a href="https://blog.entropy-labs.ai/agents"
                        className="text-sm text-muted-foreground font-mono font-normal tracking-wide hover:text-foreground transition-colors relative flex items-center gap-2">
                        <LibraryIcon className="h-4 w-4" />
                        Blog
                      </a>

                      <a href="https://github.com/EntropyLabsAI/sentinel" target="_blank" rel="noopener noreferrer" className="inline-block">
                        <img src="https://img.shields.io/github/stars/EntropyLabsAI/sentinel?style=social" alt="GitHub stars" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-lg">Supervision and evaluation for agentic systems</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Analytics />
        <Component {...pageProps} />
      </div>
    </main>
  );
}

export default Blog
