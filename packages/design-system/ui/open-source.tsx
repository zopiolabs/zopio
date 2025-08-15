/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Users, ExternalLink, Github } from "lucide-react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const openSourceVariants = cva(
  "relative overflow-hidden rounded-lg border bg-gradient-to-br from-card to-card/50 text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "p-8",
        compact: "p-6",
        hero: "p-12",
      },
      size: {
        sm: "max-w-md",
        default: "max-w-lg",
        lg: "max-w-2xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface OpenSourceContributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface OpenSourceStats {
  stars: number;
  forks?: number;
  contributors: OpenSourceContributor[];
}

export interface OpenSourceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof openSourceVariants> {
  repository: string;
  title?: string;
  description?: string;
  buttonText?: string;
  defaultStats: OpenSourceStats;
  githubToken?: string;
  showContributors?: boolean;
  maxContributors?: number;
}

const OpenSource = React.forwardRef<HTMLDivElement, OpenSourceProps>(
  (
    {
      className,
      variant,
      size,
      repository,
      title = "Proudly open-source",
      description = "Join our community of developers building the future of web development.",
      buttonText = "View on GitHub",
      defaultStats,
      githubToken,
      showContributors = true,
      maxContributors = 8,
      ...props
    },
    ref
  ) => {
    const [stats, setStats] = React.useState<OpenSourceStats>(defaultStats);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
      const fetchGitHubStats = async () => {
        if (!repository) return;

        setIsLoading(true);
        try {
          const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
          };

          if (githubToken) {
            headers['Authorization'] = `token ${githubToken}`;
          }

          // Fetch repository stats
          const repoResponse = await fetch(`https://api.github.com/repos/${repository}`, {
            headers,
          });

          if (repoResponse.ok) {
            const repoData = await repoResponse.json();
            
            // Fetch contributors
            const contributorsResponse = await fetch(`https://api.github.com/repos/${repository}/contributors?per_page=${maxContributors}`, {
              headers,
            });

            const contributorsData = contributorsResponse.ok ? await contributorsResponse.json() : [];

            setStats({
              stars: repoData.stargazers_count || 0,
              forks: repoData.forks_count || 0,
              contributors: contributorsData || [],
            });
          }
        } catch (error) {
          console.warn('Failed to fetch GitHub stats:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGitHubStats();
    }, [repository, githubToken, maxContributors]);

    const formatNumber = (num: number): string => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
      }
      return num.toString();
    };

    const handleViewOnGitHub = () => {
      window.open(`https://github.com/${repository}`, '_blank');
    };

    return (
      <motion.div
        ref={ref}
        className={cn(openSourceVariants({ variant, size }), className)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...(props as any)}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Github className="h-6 w-6 text-foreground" />
              <Badge variant="secondary" className="text-xs">
                Open Source
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">
                {isLoading ? "..." : formatNumber(stats.stars)}
              </span>
              <span className="text-sm text-muted-foreground">stars</span>
            </motion.div>

            {stats.forks !== undefined && (
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <GitFork className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">
                  {isLoading ? "..." : formatNumber(stats.forks)}
                </span>
                <span className="text-sm text-muted-foreground">forks</span>
              </motion.div>
            )}

            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Users className="h-4 w-4 text-green-500" />
              <span className="font-semibold">
                {isLoading ? "..." : stats.contributors.length}
              </span>
              <span className="text-sm text-muted-foreground">contributors</span>
            </motion.div>
          </div>

          {/* Contributors */}
          {showContributors && stats.contributors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Contributors</h3>
              <div className="flex -space-x-2">
                {stats.contributors.slice(0, maxContributors).map((contributor, index) => (
                  <motion.div
                    key={contributor.login}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                  >
                    <Avatar 
                      className="h-8 w-8 border-2 border-background cursor-pointer"
                      onClick={() => window.open(contributor.html_url, '_blank')}
                    >
                      <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                      <AvatarFallback className="text-xs">
                        {contributor.login.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                ))}
                {stats.contributors.length > maxContributors && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                    +{stats.contributors.length - maxContributors}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button 
              onClick={handleViewOnGitHub}
              className="group"
              size="lg"
            >
              {buttonText}
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }
);

OpenSource.displayName = "OpenSource";

export { OpenSource, openSourceVariants };
