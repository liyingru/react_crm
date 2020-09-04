import { CustomerListParams,TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

/**
 * 获取配置项
 */
export async function getCustomerConfig(){
   return Axios.post(URL.customerConfig)
}

/**
 * 获取客户列表
 */
export async function groupRecordCustomerList(params: CustomerListParams){
   return Axios.post(URL.groupRecordCustomerList,params)
}

/**
 * 获取用户字段列表
 */
export async function getCustomerFields(){
   return Axios.post(URL.customerFields)
}

/**
 * 获取信息变更-更改来源
 */
export async function getMessageConfig(params: any){
   return Axios.post(URL.messageConfig,params)
}

// 是否拥有指定权限
export async function getUserPermissionList(params: any) {
   return (Axios.post(URL.getUserPermissionList, params));
}

// 批量更新客户
export async function batchUpdateCustomer(params: any) {
   return (Axios.post(URL.batchUpdateCustomer, params));
 }

 export async function queryUsersList(params: TableListParams) {
   return Axios.post(URL.queryUsersList, params);
 }