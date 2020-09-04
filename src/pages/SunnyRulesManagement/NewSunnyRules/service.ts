import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// get
export async function getChannelList(params: any) {
  return (Axios.post(URL.getChannelList, params));
}
// 
export async function submit(params: any) {
  return (Axios.post(URL.commonConfig, params));
}
// 搜索用户组
export async function getGroupUserListCtrl(params: any) {
  return (Axios.post(URL.searchGroup, params));
}

// 搜索用户的
export async function searchUserCtrl(params: any) {
  return (Axios.post(URL.searchUser, params));
}
// 派发公司
export async function distributeCompanyListCtrl(params: any) {
  return (Axios.post(URL.distributeCompanyList, params));
}

// 添加规则
export async function addRuleCtrl(params: any) {
  return (Axios.post(URL.addRule, params));
}
// 编辑规则
export async function updateRuleCtrl(params: any) {
  return (Axios.post(URL.updateRule, params));
}
