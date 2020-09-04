import Axios from 'axios';
import URL from '@/api/serverAPI.config';

//获取线索详情信息
export async function fetchLeadDetail(params: any) {
  return (Axios.post(URL.getLeadsDetail, params));
}

//更新客户信息
export async function updateCustomerInfoRule(params: any) {
  return (Axios.post(URL.updateCustomer, params));
}

//获取联系人
export async function queryContactInfoRule(params: any) {
  return (Axios.post(URL.contactUserListCustomer, params));
}

//增加联系人
export async function addContactInfoRule(params: any) {
  return (Axios.post(URL.createContactUser, params));
}

//订单列表
export async function orderListRule(params: any) {
  return (Axios.post(URL.orderList, params));
}

//指定邀约
export async function turnTrueRule(params: any) {
  return (Axios.post(URL.turnTrue, params));
}

//推荐商家
export async function recommendMerchantRule(params: any) {
  return (Axios.post(URL.recommendMerchantCustomer, params));
}

// 获取配置项
export async function getConfigData(params: any) {
  return (Axios.post(URL.customerConfig, params));
}

// 获取跟进列表
export async function followList(params: any) {
  return (Axios.post(URL.followList, params));
}

// 获取通话记录
export async function getRecordList(params: any) {
  return (Axios.post(URL.getRecordList, params));
}

//有效单列表
export async function reqListRule(params: any) {
  return (Axios.post(URL.reqList, params));
}

//客户线索
export async function customerLeadsRule(params: any) {
  return (Axios.post(URL.customerLeads, params));
}

//创建有效单
export async function createReqRule(params: any) {
  return (Axios.post(URL.createReq, params));
}

//更新有效单
export async function updateReqRule(params: any) {
  return (Axios.post(URL.updateReq, params));
}

// 获取人员列表
export async function getGroupUserList(params: any) {
  return (Axios.post(URL.getGroupUserList, params));
}

// 获获取下一个线索
export async function nextLeadsId(params: any) {
  return (Axios.post(URL.nextLeadsId, params));
}

// 是否已经是好友
export async function isFriend(params: any) {
  return (Axios.post(URL.isFriend, params));
}

// 线索派发和添加协呈人员列表
export async function distributeUserListRule(params: any) {
  return (Axios.post(URL.distributeUserList, params));
}

// 创建需求团队
export async function createReqTeamRule(params: any) {
  return (Axios.post(URL.createReqTeam, params));
}

// 添加有效单
export async function createAssociatesRule(params: any) {
  return (Axios.post(URL.createAssociates, params));
}

// 是否拥有指定权限
export async function getUserPermissionList(params: any) {
  return (Axios.post(URL.getUserPermissionList, params));
}

// 关闭有效单
export async function closeReqRule(params: any) {
  return (Axios.post(URL.closeReq, params));
}
// 开启有效单
export async function openReqRule(params: any) {
  return (Axios.post(URL.openReq, params));
}

// 提交客诉工单
export async function submitComplaint(params: any) {
  return (Axios.post(URL.submitComplaint, params));
}

// 派发公司
export async function distributeCompany(params: any) {
  return (Axios.post(URL.distributeCompany, params));
}

