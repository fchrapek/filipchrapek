export const translations = {
  en: {
    sections: {
      services: "Services",
      posts: { title: "Posts", href: "/posts/" },
      pinnedPosts: "Pinned Posts",
      notes: { title: "Notes", href: "/notes/" },
    },
    notFound: {
      meta: {
        title: "Oops! You found a missing page!",
        description: "Oops! It looks like this page is lost in space!",
      },
      title: "404 | Oops something went wrong",
      message: "Please use the navigation to find your way back",
    },
    pages: {
      posts: {
        meta: {
          title: "Posts",
          description:
            "Read my collection of posts and the things that interest me",
        },
        title: "Posts",
        pinnedPosts: "Pinned Posts",
        postsIn: "Posts in",
        rssFeed: "RSS feed",
        tags: "Tags",
        viewAllTags: "View all",
        viewAllTagsSr: "blog tags",
        viewAllPostsWithTag: "View all posts with the tag",
      },
      notes: {
        meta: {
          title: "Notes",
          description: "Read my collection of notes",
        },
        title: "Notes",
        rssFeed: "RSS feed",
      },
      tags: {
        meta: {
          title: "All Tags",
          description:
            "A list of all the topics I've written about in my posts",
        },
        title: "Tags",
        postsAbout: "Posts about",
        viewAllPostsWithTag: "View all posts with the tag",
        postCount: (count: number) => `${count} Post${count > 1 ? "s" : ""}`,
      },
    },
    pagination: {
      previousPage: "← Previous Page",
      nextPage: "Next Page →",
      previousTags: "← Previous Tags",
      nextTags: "Next Tags →",
    },
    breadcrumbs: {
      tags: "Tags",
    },
  },
  pl: {
    sections: {
      services: "Usługi",
      posts: { title: "Artykuły", href: "/artykuly/" },
      pinnedPosts: "Przypięte Artykuły",
      notes: { title: "Notatki", href: "/notatki/" },
    },
    notFound: {
      meta: {
        title: "Ups! Strona nie znaleziona!",
        description: "Ups! Wygląda na to, że ta strona zaginęła!",
      },
      title: "404 | Ups, coś poszło nie tak",
      message: "Użyj nawigacji, żeby wrócić na właściwą stronę",
    },
    pages: {
      posts: {
        meta: {
          title: "Artykuły",
          description:
            "Przeczytaj moją kolekcję artykułów i rzeczy, które mnie interesują",
        },
        title: "Artykuły",
        pinnedPosts: "Przypięte Artykuły",
        postsIn: "Artykuły z",
        rssFeed: "RSS feed",
        tags: "Tagi",
        viewAllTags: "Zobacz wszystkie",
        viewAllTagsSr: "tagi",
        viewAllPostsWithTag: "Zobacz wszystkie artykuły z tagiem",
      },
      notes: {
        meta: {
          title: "Notatki",
          description: "Przeczytaj moje notatki",
        },
        title: "Notatki",
        rssFeed: "RSS feed",
      },
      tags: {
        meta: {
          title: "Wszystkie tagi",
          description: "Lista wszystkich tematów, o których pisałem",
        },
        title: "Tagi",
        postsAbout: "Artykuły o",
        viewAllPostsWithTag: "Zobacz wszystkie artykuły z tagiem",
        postCount: (count: number) => {
          if (count === 1) return "1 artykuł";
          if (count < 5) return `${count} artykuły`;
          return `${count} artykułów`;
        },
      },
    },
    pagination: {
      previousPage: "← Poprzednia strona",
      nextPage: "Następna strona →",
      previousTags: "← Poprzednie",
      nextTags: "Następne →",
    },
    breadcrumbs: {
      tags: "Tagi",
    },
  },
} as const;

export type Lang = keyof typeof translations;
export type Translations = (typeof translations)[Lang];
