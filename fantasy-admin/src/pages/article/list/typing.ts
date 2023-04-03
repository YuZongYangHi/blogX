type CategoryItem = {
  id: number;
  name: string;
}

type TagItem = {
  id: number;
  name: string;
  created: string;
  updated: string
}

type AuthorItem = {
  userId: string;
  name: string;
  description: string;
  isAdmin: boolean;
  level: number;
  isGrant: boolean;
  isActive: boolean;
  isSuper: boolean;
  city: string;
  followers: number;
  avatar: string;
  gender: number;
}

export type ArticleItem = {
  id: number;
  title: string;
  category: CategoryItem;
  tags: TagItem[];
  author: AuthorItem;
  isDraft: boolean;
  isTop: boolean;
  isOriginal: boolean;
  created: string;
  updated: string;
  isDisabledComment: boolean;
};

export type SearchItem = {
  title: string;
  category: number;
  tags: number;
  isDraft: boolean;
  isOriginal: boolean;
  isTop: boolean;
  author: string;
  current: number;
  pageSize: number;
}

export const SearchParamsReverse = {
  title: "title__icontains",
  category: "category__id",
  tags: "tags__tag__id",
  isDraft: "isDraft",
  isOriginal: "isOriginal",
  author: "author__userid",
  isTop: "isTop"
}
