import { request } from 'umi';

export async function UserLoginRequest(params: API.LoginParams) {
  return request('/api/v1/public/users/login/', {
    method: 'POST',
    data: params,
  });
}

