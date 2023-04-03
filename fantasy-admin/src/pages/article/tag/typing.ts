export type TagItem = {
  id: number;
  name: string;
  created: string;
  updated: string
}

export type SearchItem = {
  name: string;
  current: number;
  pageSize: number;
}

export const SearchParamsReverse = {
  name: "name__icontains",
}
