/**
 * SPDX-License-Identifier: MIT
 */

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { blog } from "@repo/cms";
import { Body } from "@repo/cms/components/body";
import { CodeBlock } from "@repo/cms/components/code-block";
import { Feed } from "@repo/cms/components/feed";
import { Image } from "@repo/cms/components/image";
import { TableOfContents } from "@repo/cms/components/toc";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { Sidebar } from "@/components/sidebar";
import { env } from "@/env";

const url = new URL(env.NEXT_PUBLIC_WEB_URL || "");

type BlogPostProperties = {
  readonly params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: BlogPostProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = await blog.getPost(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post._title,
    description: post.description,
    image: post.image.url,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const posts = await blog.getPosts();

  return posts
    .filter((post) => post._slug !== undefined && post._slug !== null)
    .map((post) => ({ slug: String(post._slug) }));
};

const BlogPost = async ({ params }: BlogPostProperties) => {
  const { slug } = await params;

  const blogData = await blog.getPost(slug);

  return (
    <Feed data={{ blog: blogData }}>
      {(data: Record<string, unknown>) => {
        const page = data.blog as typeof blogData;

        if (!page) {
          notFound();
        }

        return (
          <>
            <JsonLd
              code={{
                "@type": "BlogPosting",
                "@context": "https://schema.org",
                datePublished: page.date,
                description: page.description,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": new URL(`/blog/${page._slug}`, url).toString(),
                },
                headline: page._title,
                image: page.image.url,
                dateModified: page.date,
                author: page.authors.at(0)?._title,
                isAccessibleForFree: true,
              }}
            />
            <div className="container mx-auto py-16">
              <Link
                className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
                href="/blog"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Blog
              </Link>
              <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row">
                <div className="sm:flex-1">
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl">
                      <Balancer>{page._title}</Balancer>
                    </h1>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      <Balancer>{page.description}</Balancer>
                    </p>
                    {page.image ? (
                      <Image
                        alt={page.image.alt ?? ""}
                        className="my-16 h-full w-full rounded-xl"
                        height={page.image.height}
                        priority
                        src={page.image.url}
                        width={page.image.width}
                      />
                    ) : null}
                    <div className="mx-auto max-w-prose">
                      <Body
                        components={{
                          pre: ({ code, language }) => {
                            // Define a type that matches what the CodeBlock component expects
                            type CodeLanguage =
                              | "plainText"
                              | "javascript"
                              | "typescript"
                              | "jsx"
                              | "tsx"
                              | "html"
                              | "css"
                              | "json"
                              | "markdown"
                              | "python"
                              | "ruby"
                              | "go"
                              | "rust"
                              | "java"
                              | "c"
                              | "cpp"
                              | "csharp"
                              | "php"
                              | "bash"
                              | "shell"
                              | "yaml"
                              | "sql"
                              | "graphql";

                            // Use a type assertion to ensure the language is one of the supported types
                            // Default to 'plainText' if the language is not provided
                            const safeLanguage = (language ||
                              "plainText") as CodeLanguage;

                            return (
                              <CodeBlock
                                snippets={[{ code, language: safeLanguage }]}
                                theme="vesper"
                              />
                            );
                          },
                        }}
                        content={page.body.json.content}
                      />
                    </div>
                  </div>
                </div>
                <div className="sticky top-24 hidden shrink-0 md:block">
                  <Sidebar
                    date={new Date(page.date)}
                    readingTime={`${page.body.readingTime} min read`}
                    toc={<TableOfContents data={page.body.json.toc} />}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Feed>
  );
};

export default BlogPost;
