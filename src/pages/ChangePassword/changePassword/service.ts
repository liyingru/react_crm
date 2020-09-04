import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// 初始化数据
export async function updatePasswordCtrl(params: any) {
  return (Axios.post(URL.updatePassword, params));
}





