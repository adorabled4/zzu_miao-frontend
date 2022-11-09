import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginParams {
  userAccount: string;
  userPassword: string;
  // checkPassword: string;
  // phone: string;
  // prefix: string;
  // captcha: string;
}
/** 登录接口 POST /user/login */
export async function login(body: LoginParams,options?: { [key: string]: any }) {
  console.log(body);
  return request('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 需要使用json格式的请求, 直接post可能会导致密码泄露
    },
    data: body,
    ...(options || {}),
  });
}

