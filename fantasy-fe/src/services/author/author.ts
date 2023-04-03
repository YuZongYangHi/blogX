import { request } from 'umi';

export async function UserFollowerRequest(userId: string, authorId: string) {
  return request(`/api/v1/public/author/followers/?userId=${userId}&authorId=${authorId}`, {
    method: 'GET',
  });
}

export async function UserFollowerAddRequest(data: any) {
  return request('/api/v1/public/author/followers/', {
    method: 'POST',
    data
  });
}

export async function UserPrivateAuthorMessageGetRequest(params: any) {
  return request('/api/v1/public/author/message/', {
    method: 'GET',
    params
  });
}

export async function UserPrivateAuthorMessageAddRequest(data: any) {
  return request('/api/v1/public/author/message/', {
    method: 'POST',
    data
  });
}
