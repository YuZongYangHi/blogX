import { request } from 'umi';

export async function CategoryListRequest(params: any) {
  return request('/api/v1/admin/category/', {
    method: 'GET',
    params: params,
  });
}

export async function CategoryPutRequest(id: number, data: any) {
  return request(`/api/v1/admin/category/${id}/`, {
    method: 'PUT',
    data
  });
}

export async function CategoryCreateRequest(data: any) {
  return request(`/api/v1/admin/category/`, {
    method: 'POST',
    data
  });
}

export async function CategoryDeleteRequest(id: number) {
  return request(`/api/v1/admin/category/${id}/`, {
    method: 'DELETE',
  });
}
