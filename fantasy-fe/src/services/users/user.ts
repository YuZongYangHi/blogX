import {request} from "@@/plugin-request/request";

export async function UserLogoutRequest() {
  return request('/api/v1/public/users/logout/', {
    method: 'GET',
  });
}

export async function UserRegisterRequest(params: any) {
  return request('/api/v1/public/users/register/', {
    method: 'POST',
    data: params,
  });
}

export async function UserResetPasswordCaptchaRequest(email: any) {
  return request(`/api/v1/public/users/sendResetCaptcha?email=${email}`, {
    method: 'GET',
  });
}


export async function UserResetPasswordRequest(data: any) {
  return request(`/api/v1/public/users/resetPassword`, {
    method: 'POST',
    data
  });
}

export async function UserInfoRequest() {
  return request('/api/v1/public/users/currentUser/', {
    method: 'GET',
  });
}

export async function UserUpdateRequest(userId: string, data: any) {
  return request(`/api/v1/public/users/${userId}/`, {
    method: 'PUT',
    data
  });
}

export async function UserSecurityInfoRequest() {
  return request('/api/v1/public/users/userSecurity/', {
    method: 'GET',
  });
}

export async function UserSecuritySendEmailRequest(params: any) {
  return request('/api/v1/public/users/sendEmailCaptcha/', {
    method: 'GET',
    params
  });
}

export async function UserSecurityChangeEmailRequest(data: any) {
  return request('/api/v1/public/users/changeEmail/', {
    method: 'POST',
    data
  });
}

export async function UserSecurityChangePasswordRequest(data: any) {
  return request('/api/v1/public/users/changePassword/', {
    method: 'POST',
    data
  });
}
