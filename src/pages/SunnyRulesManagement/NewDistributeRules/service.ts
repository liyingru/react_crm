import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// get
export async function getPublicRulesChannel(params: any) {
  return (Axios.post(URL.getPublicRulesChannel, params));
}

// 获取 喜铺 澜 尼克 3个公司的公域渠道
export async function getChannel3Company(params: any) {
  return (Axios.post(URL.getChannel3Company, params));
}

// 添加规则
export async function addPublicRule(params: any) {
  return (Axios.post(URL.addPublicRule, params));
}

// 编辑规则
export async function editPublicRule(params: any) {
  return (Axios.post(URL.editPublicRule, params));
}
