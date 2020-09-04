import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { ParamsDetail } from './data';
import { TransferToUserParams } from '@/components/TransferToUserForm';
import { async } from 'q';


export async function getCustomerDetail(params:ParamsDetail){
   return Axios.post(URL.customerDetail,params)
}

/**
 * 获取配置项
 */
export async function getCustomerConfig(){
   return Axios.post(URL.customerConfig)
}


//转让客户给同事
export async function transferCustomer(params: TransferToUserParams) { 
   return Axios.post(URL.transferCustomer, params); 
 }

//获取所有用户
 export async function getAllUser(params:any){
    return Axios.post(URL.searchUser, params)
 }


// 获取通话记录
export async function getRecordList(params: any) {
   return (Axios.post(URL.getRecordList, params));
 }


 //获取操作配置项
export async function getOperateConfig(params: any) {
   return (Axios.post(URL.getOperateConfig, params));
}

//获取所有商家负责人
export async function getMerchantList(params: any) {
   return (Axios.post(URL.distributeUserList, params));
}
 // 获取跟进列表
export async function followList(params: any) {
  return (Axios.post(URL.followList, params));
}

// 是否已经是好友
export async function isFriend(params: any) {
   return (Axios.post(URL.isFriend, params));
 }

 // 有效单详情
 export async function getReqDetail(params: any){
   return (Axios.post(URL.reqDetail, params));
 }

   // 是否拥有指定权限
export async function getUserPermissionList(params: any) {
   return (Axios.post(URL.getUserPermissionList, params));
 }
 // 亲子单
 export async function customerChildren(params:any){
   return Axios.post(URL.customerChildren, params)
}
 
// 退回公海/死海
export async function backToPubSea(params:any){
   return Axios.post(URL.backToPubSea, params)
}

// 退回公海/死海
export async function backToDeadSea(params:any){
   return Axios.post(URL.backToDeadSea, params)
}

//质检
export async function dxlQtReq(params:any){
   return Axios.post(URL.dxlQtReq, params)
}

//需求单团队角色
export async function reqTeamRole(params:any){
   return Axios.post(URL.reqTeamRole, params)
}


//到喜啦发送有效单测试报告 
export async function sendReqReport(params:any){
   return Axios.post(URL.sendReqReport, params)
}