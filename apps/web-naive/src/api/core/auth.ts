import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password: string;
    username: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    token: string;
    refreshToken?: string;
    userId?: string;
    username?: string;
    roles?: string[];
    expiresIn?: number;
  }

  export interface RefreshTokenResult {
    token: string;
    refreshToken?: string;
    status?: number;
  }

  export interface AuthCodesResult {
    codes: string[];
    role?: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return baseRequestClient.post<AuthApi.LoginResult>('/admin/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(refreshToken: string) {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/admin/auth/refresh',
    { refreshToken },
    {
      withCredentials: true,
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post(
    '/admin/auth/logout',
    {},
    {
      withCredentials: true,
    },
  );
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<AuthApi.AuthCodesResult>('/admin/auth/codes');
}
