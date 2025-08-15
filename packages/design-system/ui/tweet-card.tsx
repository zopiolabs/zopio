/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified } from "lucide-react";

import { cn } from "@repo/design-system/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";

const tweetCardVariants = cva(
  "relative rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
  {
    variants: {
      variant: {
        default: "p-6",
        compact: "p-4",
      },
      size: {
        default: "max-w-lg",
        sm: "max-w-md",
        lg: "max-w-xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TweetData {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  metrics?: {
    likes: number;
    retweets: number;
    replies: number;
  };
  media?: {
    type: "image" | "video";
    url: string;
    alt?: string;
  }[];
}

export interface TweetCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tweetCardVariants> {
  tweet: TweetData;
  showMetrics?: boolean;
  showMedia?: boolean;
  showActions?: boolean;
  onLike?: () => void;
  onRetweet?: () => void;
  onReply?: () => void;
  onShare?: () => void;
}

const TweetCard = React.forwardRef<HTMLDivElement, TweetCardProps>(
  (
    {
      className,
      variant,
      size,
      tweet,
      showMetrics = true,
      showMedia = true,
      showActions = true,
      onLike,
      onRetweet,
      onReply,
      onShare,
      ...props
    },
    ref
  ) => {
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    };

    const formatTimestamp = (timestamp: string): string => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes}m`;
      }
      if (diffInHours < 24) {
        return `${diffInHours}h`;
      }
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d`;
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    return (
      <div
        ref={ref}
        className={cn(tweetCardVariants({ variant, size, className }))}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={tweet.author.avatar} alt={tweet.author.name} />
              <AvatarFallback>
                {tweet.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-semibold text-foreground truncate">
                  {tweet.author.name}
                </span>
                {tweet.author.verified && (
                  <Verified className="h-4 w-4 text-blue-500 shrink-0" />
                )}
                <span className="text-muted-foreground truncate">
                  @{tweet.author.username}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground text-sm">
                  {formatTimestamp(tweet.timestamp)}
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mt-3 space-y-3">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {tweet.content}
          </p>

          {/* Media */}
          {showMedia && tweet.media && tweet.media.length > 0 && (
            <div className="rounded-lg overflow-hidden border">
              {tweet.media[0].type === "image" ? (
                <img
                  src={tweet.media[0].url}
                  alt={tweet.media[0].alt || "Tweet image"}
                  className="w-full h-auto max-h-96 object-cover"
                />
              ) : (
                <video
                  src={tweet.media[0].url}
                  controls
                  className="w-full h-auto max-h-96"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between mt-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReply}
              className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 -ml-2"
            >
              <MessageCircle className="h-4 w-4" />
              {showMetrics && tweet.metrics?.replies && (
                <span className="text-sm">{formatNumber(tweet.metrics.replies)}</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRetweet}
              className="flex items-center gap-2 text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
            >
              <Repeat2 className="h-4 w-4" />
              {showMetrics && tweet.metrics?.retweets && (
                <span className="text-sm">{formatNumber(tweet.metrics.retweets)}</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Heart className="h-4 w-4" />
              {showMetrics && tweet.metrics?.likes && (
                <span className="text-sm">{formatNumber(tweet.metrics.likes)}</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }
);

TweetCard.displayName = "TweetCard";

export { TweetCard, tweetCardVariants };
