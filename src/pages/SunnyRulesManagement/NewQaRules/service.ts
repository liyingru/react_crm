import URL from '@/api/serverAPI.config';
import Axios from 'axios';


// 配置接口
export async function getConfig(params: any){
  return Axios.post(URL.customerConfig, params)
}
// get
export async function getCompanyChannelList(params: any) {
  return (Axios.post(URL.getCompanyChannelList, params));
}

// get
export async function companyCategory(params: any) {
  return (Axios.post(URL.companyCategory, params));
}

// get
export async function getQaRuleDetail(params: any) {
  return (Axios.post(URL.getQaRuleDetail, params));
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
export async function createRules(params: any) {
  return (Axios.post(URL.createRules, params));
}
// 编辑规则
export async function updateRules(params: any) {
  return (Axios.post(URL.updateRules, params));
}
