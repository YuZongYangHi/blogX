import { request } from 'umi';

export async function ArticleOverviewRequest() {
  return request('/api/v1/admin/overview/article', {
    method: 'GET',
  });
}

export async function UserOverviewRequest() {
  return request('/api/v1/admin/overview/user', {
    method: 'GET',
  });
}


export async function UserLoginTrendRequest() {
  return request('/api/v1/admin/overview/userLoginTrend', {
    method: 'GET',
  });
}


export async function ArticleReleaseTrendRequest() {
  return request('/api/v1/admin/overview/articleReleaseTrend', {
    method: 'GET',
  });
}
