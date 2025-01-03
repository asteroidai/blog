import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MailIcon, CalendarIcon, BookIcon, LibraryIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

function Blog({ Component, pageProps }: AppProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("founders@asteroid.ai")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main>
      <div className="font-serif mx-auto pb-32 max-w-6xl">
        <div className="container mx-auto space-y-16 pt-36 px-8">
          <Card className="outline-none shadow-none border-none">
            <CardHeader className="px-0 pb-12">
              <CardTitle className="">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                  <Link href="https://asteroid.ai">
                    <p className="text-4xl font-bold">
                      Asteroid
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
                        href="https://calendly.com/founders-asteroid/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground font-mono font-normal tracking-wide hover:text-foreground transition-colors relative flex items-center gap-2"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        Demo
                      </a>

                      <a href="https://docs.asteroid.ai"
                        className="text-sm text-muted-foreground font-mono font-normal tracking-wide hover:text-foreground transition-colors relative flex items-center gap-2">
                        <BookIcon className="h-4 w-4" />
                        Docs
                      </a>

                      <a href="https://blog.asteroid.ai/agents"
                        className="text-sm text-muted-foreground font-mono font-normal tracking-wide hover:text-foreground transition-colors relative flex items-center gap-2">
                        <LibraryIcon className="h-4 w-4" />
                        Blog
                      </a>
                    </div>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-lg">Runtime agent control</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Component {...pageProps} />
      </div>
    </main>
  );
}

export default Blog
