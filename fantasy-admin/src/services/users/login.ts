import { request } from 'umi';

export async function fakeAccountLogin(params: API.LoginParams) {
  return request('/api/v1/admin/users/login/', {
    method: 'POST',
    data: params,
  });
}
