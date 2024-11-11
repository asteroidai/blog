import * as React from "react"
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BlogCardProps {
  title: string,
  description: string,
  frontMatter: { [key: string]: string }
}

export function BlogCard({ title, description, frontMatter }: BlogCardProps) {
  const [postDate, setPostDate] = useState<string>('');

  useEffect(() => {
    const date = DateTime.fromISO(frontMatter.date).toLocaleString(DateTime.DATE_FULL);
    setPostDate(date);
  }, []);

  return (
    <Card className="w-full max-w-md outline-none border-none">
      <CardHeader>
        <img
          className="w-full h-48 object-cover rounded-t-lg"
          src={frontMatter.thumbnail}
          alt="Blog post thumbnail"
        />
      </CardHeader >
      <CardContent>
        <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{postDate}</p>
      </CardFooter>
    </Card >
  )
}
