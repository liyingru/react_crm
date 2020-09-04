import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { ParamsMember,ParamsAdd } from './data';


// 搜索用户
export async function getGroupMember(params:ParamsMember){
   return Axios.post(URL.groupMember,params)
}

// 搜索用户
export async function getAddGroup(params:ParamsAdd){
   return Axios.post(URL.addGroup,params)
}

/**
 * 获取配置项
 */
export async function getCustomerConfig(){
   return Axios.post(URL.customerConfig)
}
// 任务配置
export async function taskConfigCtrl(params: any) {
   return (Axios.post(URL.taskgetConfig, params));
 }

