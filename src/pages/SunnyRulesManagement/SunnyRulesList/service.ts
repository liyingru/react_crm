import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// 初始化数据
export async function getList(params: any) {
  return (Axios.post(URL.xpRuleList, params));
}

// 配置接口
export async function getConfig(params: any){
  return Axios.post(URL.customerConfig, params)
}


// 删除规则
export async function deleteRule(params: any){
  return Axios.post(URL.deleteXpRule, params)
}

// 跟新规则
export async function updateRule(params: any){
  return Axios.post(URL.updateXpRule, params)
}

// 查询公司员工
export async function getUserLsit(params: any){
  return Axios.post(URL.getcreatUsersList, params)
}

// 查询当前用户可操作的公司
export async function getRulesCompanyLsit(params: any){
  return Axios.post(URL.rulesCompanyList, params)
}



