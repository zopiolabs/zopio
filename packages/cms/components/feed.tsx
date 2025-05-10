import type { ReactNode } from 'react';

// Define the type for our mock data structure
type MockDataItem = {
  blog?: {
    posts: {
      items: Array<{
        _slug: string;
        _title: string;
        date: string;
      }>;
      item: {
        _slug: string;
        _title: string;
        date: string;
      } | null;
    };
  };
  legalPages?: {
    items: Array<{
      _slug: string;
      _title: string;
      description: string;
    }>;
    item: {
      _slug: string;
      _title: string;
      description: string;
    } | null;
  };
};

// Create a custom Feed component to replace the basehub Pump component
type FeedProps = {
  children?: ReactNode | ((data: MockDataItem[]) => ReactNode);
  queries?: Record<string, unknown>[];
  [key: string]: unknown;
};

export function Feed({ children, queries, ...props }: FeedProps) {
  // This is a temporary replacement for the basehub Pump component
  // Create mock data for the function children based on the query type
  const mockData: MockDataItem[] = queries?.map((query) => {
    // Determine what type of query this is based on the query structure
    const queryString = JSON.stringify(query);
    
    // Create appropriate mock data based on query type
    if (queryString.includes('blog')) {
      return {
        blog: {
          posts: {
            items: [{
              _slug: 'mock-post',
              _title: 'Mock Post',
              date: new Date().toISOString(),
            }],
            item: {
              _slug: 'mock-post',
              _title: 'Mock Post',
              date: new Date().toISOString(),
            }
          }
        }
      };
    }
    
    if (queryString.includes('legalPages')) {
      return {
        legalPages: {
          items: [
            {
              _slug: 'terms',
              _title: 'Terms of Service',
              description: 'Our terms of service',
            },
            {
              _slug: 'privacy',
              _title: 'Privacy Policy',
              description: 'Our privacy policy',
            }
          ],
          item: {
            _slug: 'terms',
            _title: 'Terms of Service',
            description: 'Our terms of service',
          }
        }
      };
    }
    
    // Default fallback if we can't determine the query type
    return {
      blog: {
        posts: {
          items: [{
            _slug: 'mock-post',
            _title: 'Mock Post',
            date: new Date().toISOString(),
          }],
          item: {
            _slug: 'mock-post',
            _title: 'Mock Post',
            date: new Date().toISOString(),
          }
        }
      },
      legalPages: {
        items: [
          {
            _slug: 'terms',
            _title: 'Terms of Service',
            description: 'Our terms of service',
          }
        ],
        item: {
          _slug: 'terms',
          _title: 'Terms of Service',
          description: 'Our terms of service',
        }
      }
    };
  }) || [];

  // Handle function children by calling the function with mock data
  const content = typeof children === 'function' 
    ? children(mockData)
    : children;

  return (
    <div {...props}>
      {content}
    </div>
  );
}
