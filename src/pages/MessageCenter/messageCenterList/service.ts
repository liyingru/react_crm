import Axios from 'axios';
import URL from '@/api/serverAPI.config';

// 消息列表
export async function getNoticList(params: any) {
  return (Axios.post(URL.noticGetList, params));
}