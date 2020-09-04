// import request from '@/utils/request';
import Axios from '@/utils/gcrmhttp';
import URL from '@/api/serverAPI.config';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
  // apver:string;
  // appId:string;
}

export async function loginRequest(params: LoginParamsType) {
  return Axios.post(URL.login, params);
}

export async function accountLogout() {
  return Axios.post(URL.logout);
}

/**
 * 根据手机号获取验证码
 * @param mobile 
 */
export async function getCaptcha(params) {
  return Axios.post(URL.sendVerifyCode, params);
}
