import { request } from 'umi';

export async function TagListRequest(params: any) {
  return request('/api/v1/admin/tag/', {
    method: 'GET',
    params: params,
  });
}


export async function TagPutRequest(id: number, data: any) {
  return request(`/api/v1/admin/tag/${id}/`, {
    method: 'PUT',
    data
  });
}

export async function TagCreateRequest(data: any) {
  return request(`/api/v1/admin/tag/`, {
    method: 'POST',
    data
  });
}

export async function TagDeleteRequest(id: number) {
  return request(`/api/v1/admin/tag/${id}/`, {
    method: 'DELETE',
  });
}
