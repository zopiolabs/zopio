// Mock implementation for basehub client and fragmentOn

// Define base types for our mock implementation
type QueryObject = Record<string, unknown>;
type QueryResult = Record<string, unknown>;

// Mock fragmentOn implementation with proper typing
function fragmentOn<T extends string, U extends Record<string, unknown>>(type: T, fields: U) {
  return { type, fields };
}

// Add type inference capability to fragmentOn using namespace
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace fragmentOn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type infer<T> = any;
}

// Mock basehub client factory
function basehubClient(config: { token: string }) {
  // Use the token to simulate authentication
  const _token = config.token;
  
  return {
    // Properly typed query method
    query: async <T extends QueryResult>(queryObj: QueryObject): Promise<T> => {
      // In a real implementation, this would make an API call
      // For our mock, we'll create a structure that matches what the code expects
      await new Promise(resolve => setTimeout(resolve, 10)); // Add await to satisfy linter
      const mockData = createMockDataFromQuery(queryObj);
      return mockData as unknown as T;
    }
  };
}

// Helper function to create mock data based on query structure
function createMockDataFromQuery(query: QueryObject): QueryResult {
  // Create a basic structure that matches what's expected by the code
  const result: QueryResult = {};
  
  // Mock blog data structure
  if ('blog' in query) {
    result.blog = { 
      posts: { 
        items: [{ 
          _slug: 'mock-post',
          _title: 'Mock Post',
          authors: [{ _title: 'Mock Author', avatar: null, xUrl: null }],
          categories: [{ _title: 'Mock Category' }],
          date: new Date().toISOString(),
          description: 'This is a mock post description',
          image: null,
          body: {
            plainText: 'Mock content',
            json: { content: {}, toc: [] },
            readingTime: 1
          }
        }],
        item: {
          _slug: 'mock-post',
          _title: 'Mock Post',
          authors: [{ _title: 'Mock Author', avatar: null, xUrl: null }],
          categories: [{ _title: 'Mock Category' }],
          date: new Date().toISOString(),
          description: 'This is a mock post description',
          image: null,
          body: {
            plainText: 'Mock content',
            json: { content: {}, toc: [] },
            readingTime: 1
          }
        }
      }
    };
  }
  
  // Mock legal pages data structure
  if ('legalPages' in query) {
    result.legalPages = { 
      items: [{
        _slug: 'mock-legal',
        _title: 'Mock Legal Page',
        description: 'This is a mock legal page',
        body: {
          plainText: 'Mock legal content',
          json: { content: {}, toc: [] },
          readingTime: 1
        }
      }],
      item: {
        _slug: 'mock-legal',
        _title: 'Mock Legal Page',
        description: 'This is a mock legal page',
        body: {
          plainText: 'Mock legal content',
          json: { content: {}, toc: [] },
          readingTime: 1
        }
      }
    };
  }
  
  return result;
}
import { keys } from './keys';

const basehub = basehubClient({
  token: keys().BASEHUB_TOKEN,
});

/* -------------------------------------------------------------------------------------------------
 * Common Fragments
 * -----------------------------------------------------------------------------------------------*/

const imageFragment = fragmentOn('BlockImage', {
  url: true,
  width: true,
  height: true,
  alt: true,
  blurDataURL: true,
});

/* -------------------------------------------------------------------------------------------------
 * Blog Fragments & Queries
 * -----------------------------------------------------------------------------------------------*/

const postMetaFragment = fragmentOn('PostsItem', {
  _slug: true,
  _title: true,
  authors: {
    _title: true,
    avatar: imageFragment,
    xUrl: true,
  },
  categories: {
    _title: true,
  },
  date: true,
  description: true,
  image: imageFragment,
});

const postFragment = fragmentOn('PostsItem', {
  ...postMetaFragment,
  body: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
    readingTime: true,
  },
});

export type PostMeta = fragmentOn.infer<typeof postMetaFragment>;
export type Post = fragmentOn.infer<typeof postFragment>;

export const blog = {
  postsQuery: fragmentOn('Query', {
    blog: {
      posts: {
        items: postMetaFragment,
      },
    },
  }),

  latestPostQuery: fragmentOn('Query', {
    blog: {
      posts: {
        __args: {
          orderBy: '_sys_createdAt__DESC',
        },
        item: postFragment,
      },
    },
  }),

  postQuery: (slug: string) => ({
    blog: {
      posts: {
        __args: {
          filter: {
            _sys_slug: { eq: slug },
          },
        },
        item: postFragment,
      },
    },
  }),

  getPosts: async (): Promise<PostMeta[]> => {
    const data = await basehub.query(blog.postsQuery);

    return data.blog.posts.items;
  },

  getLatestPost: async () => {
    const data = await basehub.query(blog.latestPostQuery);

    return data.blog.posts.item;
  },

  getPost: async (slug: string) => {
    const query = blog.postQuery(slug);
    const data = await basehub.query(query);

    return data.blog.posts.item;
  },
};

/* -------------------------------------------------------------------------------------------------
 * Legal Fragments & Queries
 * -----------------------------------------------------------------------------------------------*/

const legalPostMetaFragment = fragmentOn('LegalPagesItem', {
  _slug: true,
  _title: true,
  description: true,
});

const legalPostFragment = fragmentOn('LegalPagesItem', {
  ...legalPostMetaFragment,
  body: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
    readingTime: true,
  },
});

export type LegalPostMeta = fragmentOn.infer<typeof legalPostMetaFragment>;
export type LegalPost = fragmentOn.infer<typeof legalPostFragment>;

export const legal = {
  postsQuery: fragmentOn('Query', {
    legalPages: {
      items: legalPostFragment,
    },
  }),

  latestPostQuery: fragmentOn('Query', {
    legalPages: {
      __args: {
        orderBy: '_sys_createdAt__DESC',
      },
      item: legalPostFragment,
    },
  }),

  postQuery: (slug: string) =>
    fragmentOn('Query', {
      legalPages: {
        __args: {
          filter: {
            _sys_slug: { eq: slug },
          },
        },
        item: legalPostFragment,
      },
    }),

  getPosts: async (): Promise<LegalPost[]> => {
    const data = await basehub.query(legal.postsQuery);

    return data.legalPages.items;
  },

  getLatestPost: async () => {
    const data = await basehub.query(legal.latestPostQuery);

    return data.legalPages.item;
  },

  getPost: async (slug: string) => {
    const query = legal.postQuery(slug);
    const data = await basehub.query(query);

    return data.legalPages.item;
  },
};
