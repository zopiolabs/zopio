/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from "../lib/utils";
import { Star, ExternalLink } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Button } from "./button";
import { Skeleton } from "./skeleton";

export interface Contributor {
  login: string;
  avatar_url: string;
}

export interface GitHubStats {
  stars: number;
  contributors: Contributor[];
}

export interface OpenSourceProps {
  /**
   * GitHub repository in the format "username/repository"
   */
  repository: string;
  /**
   * Optional GitHub token for API authentication
   */
  githubToken?: string;
  /**
   * Custom title for the component
   */
  title?: string;
  /**
   * Custom description for the component
   */
  description?: string;
  /**
   * Custom text for the button
   */
  buttonText?: string;
  /**
   * Default stats to show while loading or if API fails
   */
  defaultStats?: GitHubStats;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Open Source component displays GitHub repository information
 * including stars and contributors
 */
export const OpenSource = React.forwardRef<HTMLDivElement, OpenSourceProps>(
  ({
    repository,
    githubToken,
    title = "Star us on GitHub",
    description = "If you like our project, please consider giving it a star!",
    buttonText = "View on GitHub",
    defaultStats = { stars: 0, contributors: [] },
    className,
    ...props
  }, ref) => {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchGitHubStats = async () => {
        if (!repository) return;
        
        try {
          setIsLoading(true);
          setError(null);
          
          const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
          };
          
          if (githubToken) {
            headers['Authorization'] = `token ${githubToken}`;
          }
          
          // Fetch repository data
          const repoResponse = await fetch(`https://api.github.com/repos/${repository}`, { headers });
          
          if (!repoResponse.ok) {
            throw new Error(`Failed to fetch repository data: ${repoResponse.status}`);
          }
          
          const repoData = await repoResponse.json();
          
          // Fetch contributors (limited to 10)
          const contributorsResponse = await fetch(`https://api.github.com/repos/${repository}/contributors?per_page=10`, { headers });
          
          if (!contributorsResponse.ok) {
            throw new Error(`Failed to fetch contributors: ${contributorsResponse.status}`);
          }
          
          const contributorsData = await contributorsResponse.json();
          
          setStats({
            stars: repoData.stargazers_count,
            contributors: contributorsData.map((contributor: any) => ({
              login: contributor.login,
              avatar_url: contributor.avatar_url,
            })),
          });
        } catch (err) {
          console.error('Error fetching GitHub stats:', err);
          setError('Failed to load GitHub data');
          // Use default stats on error
          setStats(defaultStats);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchGitHubStats();
    }, [repository, githubToken, defaultStats]);
    
    // Use default stats until real data is loaded
    const displayStats = stats || defaultStats;
    
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card border flex flex-col p-6 rounded-lg shadow-sm text-card-foreground",
          className
        )}
        {...props}
      >
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-xl">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 text-yellow-400 w-4" />
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                <span className="font-medium">{displayStats.stars.toLocaleString()}</span>
              )}
            </div>
            
            <div className="flex-1" />
            
            <div className="flex -space-x-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </>
              ) : (
                displayStats.contributors.slice(0, 5).map((contributor) => (
                  <img
                    key={contributor.login}
                    src={contributor.avatar_url}
                    alt={`${contributor.login}'s avatar`}
                    className="border-2 border-background h-8 rounded-full w-8"
                    title={contributor.login}
                  />
                ))
              )}
              
              {displayStats.contributors.length > 5 && (
                <div className="bg-muted border-2 border-background flex font-medium h-8 items-center justify-center rounded-full text-xs w-8">
                  +{displayStats.contributors.length - 5}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-2 w-full"
            onClick={() => window.open(`https://github.com/${repository}`, '_blank')}
          >
            {buttonText}
            <ExternalLink className="h-4 ml-2 w-4" />
          </Button>
          
          {error && (
            <p className="mt-2 text-destructive text-sm">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

OpenSource.displayName = "OpenSource";

export default OpenSource;
