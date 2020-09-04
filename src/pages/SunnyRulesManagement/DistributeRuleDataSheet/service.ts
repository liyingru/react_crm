import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// 明细列表
export async function getBalanceList(params: any) {
  return (Axios.post(URL.getBalanceList, params));
}

export async function getConfig(params: any) {
  return (Axios.post(URL.customerConfig, params));
}



