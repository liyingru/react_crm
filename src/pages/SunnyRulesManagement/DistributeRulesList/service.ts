import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// 初始化数据
export async function getPublicRulesList(params: any) {
  return (Axios.post(URL.getPublicRulesList, params));
}

// 配置接口
export async function getConfig(params: any){
  return Axios.post(URL.customerConfig, params)
}


// 删除规则
export async function deleteRule(params: any){
  return Axios.post(URL.deleteXpRule, params)
}

// 开启/暂停规则
export async function openThePausePublicRules(params: any){
  return Axios.post(URL.openThePausePublicRules, params)
}

// 查询公司员工
export async function getUserLsit(params: any){
  return Axios.post(URL.getcreatUsersList, params)
}

// 查询当前用户可操作的公司
export async function getRulesCompanyLsit(params: any){
  return Axios.post(URL.rulesCompanyList, params)
}



