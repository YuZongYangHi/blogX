import { request } from 'umi';

export async function HeaderTopRoutersRequest() {
  return request('/api/v1/public/category/routers/', {
    method: 'GET',
  });
}
