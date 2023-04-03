import { request } from 'umi';

export type SaveDraftData = {
  articleId?: number;
  title?: string;
  content?: string;
  author?: string;
};

export type articleCreateParams = {
  title: string,
  content: string,
  image: string,
  categoryId: number,
  tagIds: number[],
  isTop: boolean,
  isOriginal: boolean,
  articleId: number
}

export type articleOperationParams = {
  action: string;
  field: string;
  where: boolean;
  articleId: number;
}

export async function SaveDraftRequest(data: SaveDraftData) {
  return request('/api/v1/admin/article/saveDraft/', {
    method: 'POST',
    data,
  });
}

export async function ArticleFetchByIdRequest(id: string) {
  return request(`/api/v1/admin/article/${id}/`, {
    method: 'GET',
  });
}

export async function ArticleCreateRequest(data: articleCreateParams) {
  return request(`/api/v1/admin/article/`, {
    method: 'POST',
    data,
  });
}

export async function ArticleCategorySearchRequest() {
  return request(`/api/v1/admin/category/listLabels/`, {
    method: 'GET',
  });
}

export async function ArticleTagsSearchRequest() {
  return request(`/api/v1/admin/tag/listLabels/`, {
    method: 'GET',
  });
}

export async function ArticleAuthorSearchRequest() {
  return request(`/api/v1/admin/users/listLabels/`, {
    method: 'GET',
  });
}

export async function ArticleSearchRequest(params: any) {
  return request(`/api/v1/admin/article/`, {
    method: 'GET',
    params
  });
}

export async function ArticleOperationRequest(data: articleOperationParams) {
  return request(`/api/v1/admin/article/operation/`, {
    method: 'POST',
    data,
  });
}



