/**
 * SPDX-License-Identifier: MIT
 */

import { keys } from './keys';

// Custom implementation to replace basehub functionality
type FragmentType<T> = { __type: string } & T;
type QueryOptions = Record<string, unknown>;

// Create a namespace for fragmentOn to match the original basehub API
function createFragmentOn() {
  function fragmentOn<T extends Record<string, unknown>>(
    type: string,
    fields: T
  ): FragmentType<T> {
    return { __type: type, ...fields };
  }

  // Add infer method to the function
  fragmentOn.infer = function infer<T>(_fragment: T): T {
    return {} as T;
  };

  return fragmentOn;
}

const fragmentOn = createFragmentOn();

function basehubClient(options: { token: string }) {
  const baseUrl = `https://basehub.com/api/graphql?token=${options.token}`;

  async function query(queryOptions: QueryOptions) {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: JSON.stringify(queryOptions) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (_error) {
      // Log error but don't expose in production
      return {};
    }
  }

  return { query };
}

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

export type PostMeta = typeof postMetaFragment;
export type Post = typeof postFragment;

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
    try {
      const data = await basehub.query(blog.postsQuery);

      // Add null checks to handle potential undefined values
      if (!data || !data.blog || !data.blog.posts) {
        return [];
      }

      return data.blog.posts.items || [];
    } catch (_) {
      return [];
    }
  },

  getLatestPost: async () => {
    try {
      const data = await basehub.query(blog.latestPostQuery);

      if (!data || !data.blog || !data.blog.posts) {
        return null;
      }

      return data.blog.posts.item;
    } catch (_) {
      return null;
    }
  },

  getPost: async (slug: string) => {
    try {
      const query = blog.postQuery(slug);
      const data = await basehub.query(query);

      if (!data || !data.blog || !data.blog.posts) {
        return null;
      }

      return data.blog.posts.item;
    } catch (_) {
      return null;
    }
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

export type LegalPostMeta = typeof legalPostMetaFragment;
export type LegalPost = typeof legalPostFragment;

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
    try {
      const data = await basehub.query(legal.postsQuery);

      // Add null checks to handle potential undefined values
      if (!data || !data.legalPages) {
        return [];
      }

      return data.legalPages.items || [];
    } catch (_) {
      return [];
    }
  },

  getLatestPost: async () => {
    try {
      const data = await basehub.query(legal.latestPostQuery);

      if (!data || !data.legalPages) {
        return null;
      }

      return data.legalPages.item;
    } catch (_) {
      return null;
    }
  },

  getPost: async (slug: string) => {
    try {
      const query = legal.postQuery(slug);
      const data = await basehub.query(query);

      if (!data || !data.legalPages) {
        return null;
      }

      return data.legalPages.item;
    } catch (_) {
      return null;
    }
  },
};
