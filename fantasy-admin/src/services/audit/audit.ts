import { request } from 'umi';

export async function AuditUserRequest(params: any) {
  return request('/api/v1/admin/audit/users/', {
    method: 'GET',
    params,
  });
}

export async function AuditUserLoginUpdateRequest(data: any) {
  return request('/api/v1/admin/audit/users/allowLogin/', {
    method: 'POST',
    data,
  });
}

export async function AuditUserLoginRequest(params: any) {
  return request('/api/v1/admin/audit/users/login', {
    method: 'GET',
    params,
  });
}

export async function AuditUserOperationRequest(params: any) {
  return request('/api/v1/admin/audit/users/operation', {
    method: 'GET',
    params,
  });
}

export async function AuditUserAccessRequest(params: any) {
  return request('/api/v1/admin/audit/users/access', {
    method: 'GET',
    params,
  });
}

export async function AuditUserBlackListRequest(params: any) {
  return request('/api/v1/admin/audit/users/blacklist', {
    method: 'GET',
    params,
  });
}


export async function AuditUserAddBlackListRequest(data: any) {
  return request('/api/v1/admin/audit/users/blacklist', {
    method: 'POST',
    data,
  });
}
