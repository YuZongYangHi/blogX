import { request } from 'umi';

export async function ArticleTopListRequest() {
  return request('/api/v1/public/article/topList/', {
    method: 'GET',
  });
}

export async function ArticleListRequest(params: any) {
  return request('/api/v1/public/article/list/', {
    method: 'GET',
    params
  });
}

export async function ArticleDetailRequest(articleId: string) {
  return request(`/api/v1/public/article/detail/${articleId}/`, {
    method: 'GET',
  });
}

export async function ArticleAutoViewRequest(articleId: string) {
  return request(`/api/v1/public/article/${articleId}/autoView/`, {
    method: 'GET',
  });
}

export async function ArticlePopularListRequest() {
  return request('/api/v1/public/article/popular/', {
    method: 'GET',
  });
}

export async function TagPoolListRequest() {
  return request('/api/v1/public/article/tag/pool/', {
    method: 'GET',
  });
}

export async function ArticleNewestRequest() {
  return request('/api/v1/public/article/newest/', {
    method: 'GET',
  });
}

export async function ArticleLikeRequest(data: any) {
  return request('/api/v1/public/article/like/', {
    method: 'POST',
    data
  });
}

export async function ArticleCommentsRequest(articleId: string) {
  return request(`/api/v1/public/article/${articleId}/comments/`, {
    method: 'GET',
  });
}

export async function ArticleAddCommentsRequest(data: any) {
  return request(`/api/v1/public/article/comments/`, {
    method: 'POST',
    data
  });
}

export async function ArticleNewestCommentsRequest() {
  return request(`/api/v1/public/article/newestComments/`, {
    method: 'GET',
  });
}
