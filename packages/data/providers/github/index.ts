/**
 * GitHub provider implementation
 */

import type { 
  CrudProvider, 
  GetListParams, 
  GetListResult,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult
} from '@repo/data-base';

// Define regex patterns at the top level scope for better performance
const LAST_PAGE_REGEX = /page=(\d+)>; rel="last"/;

export interface GitHubProviderConfig {
  token: string;
  owner: string;
  repo: string;
  resourceMapping?: Record<string, string>; // Maps resource names to GitHub API endpoints
}

/**
 * Create a GitHub provider
 */
export function createGithubProvider(config: GitHubProviderConfig): CrudProvider {
  const { 
    token, 
    owner, 
    repo,
    resourceMapping = {
      issues: 'issues',
      pulls: 'pulls',
      releases: 'releases',
      commits: 'commits',
      branches: 'branches',
      tags: 'tags'
    }
  } = config;

  // Helper to get GitHub API endpoint from resource name
  const getGitHubEndpoint = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const endpoint = getGitHubEndpoint(resource);
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}/${endpoint}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add pagination params
        if (pagination) {
          url.searchParams.append('page', String(pagination.page));
          url.searchParams.append('per_page', String(pagination.perPage));
        }
        
        // Add sort params if supported
        if (sort) {
          url.searchParams.append('sort', sort.field);
          url.searchParams.append('direction', sort.order);
        }
        
        // Add filter params if supported
        if (filter) {
          // GitHub API uses specific query parameters for filtering
          // This is a simplified approach - in a real implementation,
          // you would need to map filter fields to GitHub query parameters
          if (resource === 'issues' || resource === 'pulls') {
            const state = filter.state || 'open';
            url.searchParams.append('state', String(state));
            
            if (filter.labels) {
              url.searchParams.append('labels', String(filter.labels));
            }
            
            if (filter.since) {
              url.searchParams.append('since', String(filter.since));
            }
          }
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Get total count from Link header if available
        let total = Array.isArray(data) ? data.length : 0;
        const linkHeader = response.headers.get('Link');
        
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(LAST_PAGE_REGEX);
          if (lastPageMatch && pagination) {
            const lastPage = Number.parseInt(lastPageMatch[1], 10);
            total = lastPage * pagination.perPage;
          }
        }
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, id), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Create data
        const response = await fetch(buildUrl(resource), {
          method: 'POST',
          headers,
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Update data
        const response = await fetch(buildUrl(resource, id), {
          method: 'PATCH',
          headers,
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Delete data - note that not all GitHub resources support deletion
        const response = await fetch(buildUrl(resource, id), {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}
