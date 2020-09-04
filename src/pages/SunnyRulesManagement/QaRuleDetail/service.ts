import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function getQaRuleDetail(params: any) {
  return (Axios.post(URL.getQaRuleDetail, params));
}
export async function delPublicRules(params: any) {
  return (Axios.post(URL.delPublicRules, params));
}
