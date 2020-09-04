import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// 初始化数据
export async function getPublicRuleDetail(params: any) {
  return (Axios.post(URL.getPublicRuleDetail, params));
}
export async function delPublicRules(params: any) {
  return (Axios.post(URL.delPublicRules, params));
}
