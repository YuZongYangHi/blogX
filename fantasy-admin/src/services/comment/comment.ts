import { request } from 'umi';

export async function DialogueListRequest() {
  return request('/api/v1/admin/users/dialogue/', {
    method: 'GET',
  });
}

export async function DialogueDetailRequest(params: any) {
  return request(`/api/v1/admin/users/dialogue/message`, {
    method: 'GET',
    params
  });
}

export async function DialogueAddMessageRequest(data: any) {
  return request(`/api/v1/admin/users/dialogue/message`, {
    method: 'POST',
    data
  });
}
