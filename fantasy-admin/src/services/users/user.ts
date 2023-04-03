import { request } from 'umi';

export type CurrentUser = {
  userId?: number;
  username?: string;
  email?: string;
  avatar?: string;
};

export async function queryCurrentUser() {
  return request('/api/v1/admin/users/currentUser/', {
    method: 'GET',
  });
}

export async function UserInfoRequest() {
  return request('/api/v1/admin/users/info/', {
    method: 'GET',
  });
}

export async function UserUpdateRequest(userId: string, data: any) {
  return request(`/api/v1/admin/users/${userId}/`, {
    method: 'PUT',
    data
  });
}

export async function UserSecurityInfoRequest() {
  return request('/api/v1/admin/users/userSecurity/', {
    method: 'GET',
  });
}

export async function UserSecuritySendEmailRequest(params: any) {
  return request('/api/v1/admin/users/sendEmailCaptcha/', {
    method: 'GET',
    params
  });
}

export async function UserSecurityChangeEmailRequest(data: any) {
  return request('/api/v1/admin/users/changeEmail/', {
    method: 'POST',
    data
  });
}

export async function UserSecurityChangePasswordRequest(data: any) {
  return request('/api/v1/admin/users/changePassword/', {
    method: 'POST',
    data
  });
}

export async function UserNoticeSettingInfoRequest() {
  return request('/api/v1/admin/users/userNoticeSetting/', {
    method: 'GET'
  });
}


export async function UserNoticeSettingPutRequest(data: any) {
  return request('/api/v1/admin/users/userNoticeSetting/', {
    method: 'POST',
    data
  });
}
