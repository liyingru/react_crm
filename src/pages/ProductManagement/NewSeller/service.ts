import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { ParamsAdd } from './data';

/**
 * 获取配置项
 */
export async function getCustomerConfig(){
   return Axios.post(URL.commonConfig)
}

// 用户列表
export async function getUserList(params: any) {
   return (Axios.post(URL.searchUser, params));
}

// 添加商家
export async function addSeller(params:any){
   return Axios.post(URL.addSeller,params)
}
// 商家详情
export async function storeDetail(params:any){
   return Axios.post(URL.storeDetail,params)
}
// 编辑商家
export async function editSeller(params:any){
   return Axios.post(URL.editSeller,params)
}