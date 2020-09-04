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
export async function getCustomerConfig(params:any){
   return Axios.post(URL.customerConfig,params)
}

/**
 * 
 * @param params 获取订单详情
 */
export async function getOrderDetails(params: {orderId: string}) {
   return Axios.post(URL.getOrderDetails, params);
}

// 搜索产品
export async function contractSearchProduct(params: any) {
   return (Axios.post(URL.contractSearchProduct, params));
}
// 绑定产品
export async function bindProductCtrl(params: any) {
   return (Axios.post(URL.bindProduct, params));
}
// 修改并更新订单信息
export async function updateOrder(params: any) {
   return (Axios.post(URL.updateOrder, params));
}

// 获取回款配置项
export async function getMoneyConfig(params: any) {
   return (Axios.post(URL.moneyonfig, params));
}

// 获取人员列表
export async function getGroupUserList(params: any) {
   return (Axios.post(URL.getGroupUserList, params));
}












//转让客户给同事
export async function transferCustomer(params: TransferToUserParams) { 
   return Axios.post(URL.transferCustomer, params); 
 }

//获取所有用户
 export async function getAllUser(params:any){
    return Axios.post(URL.queryUsersList, params)
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

// 获取用户列表
export async function percentUserList(params: any) {
   return (Axios.post(URL.searchUser, params));
}

// 获取合同列表
export async function getContractList(params: any) {
   return (Axios.post(URL.contractList, params));
}

// 获取渠道获取提供人和录入人
export async function getRulesUserInfo(params: any) {
   return (Axios.post(URL.getRulesUserInfo, params));
}

// 解绑产品
export async function unBindProduct(params: any) {
   return (Axios.post(URL.unBindProduct, params));
}

// 获取项目成员列表
export async function getProjectMemberList(params: any) {
   return (Axios.post(URL.getTeamInfo, params));
}

// 操作项目成员
export async function operateProjectMember(params: any) {
   return (Axios.post(URL.operateTeam, params));
}

export async function customerImportantInfo(params: any) {
   return (Axios.post(URL.customerImportantInfo, params));
}

// 录占比
export async function updateRatio(params: any) {
   return (Axios.post(URL.updateRatio, params));
}






