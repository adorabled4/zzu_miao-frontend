import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterParams {
  userAccount: string;
  email: string;
  userPassword: string;
  checkPassword: string;
  phone: string;
  prefix: string; //+86
  // captcha: string;
}


export async function fakeRegister(params: UserRegisterParams) {
  console.log(params);
  return request('/user/register', { // 直接对标后端的controller  , 因为已经设置了前缀 + 代理
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json', // 需要使用json格式的请求, 直接post可能会导致密码泄露
    },
  });
}
