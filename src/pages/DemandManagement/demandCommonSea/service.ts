import request from '@/utils/request';
import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { async } from 'q';


export async function reqPublicSea(params: TableListParams) {
  return (Axios.post(URL.reqPublicSea, params));
}

export async function reqDeadSea(params: TableListParams) {
  return (Axios.post(URL.reqDeadSea, params));
}

export async function reqDistribute(params: TableListParams) {
  return (Axios.post(URL.reqDistribute, params));
}

export async function distribute(params: TableListParams) {
  return (Axios.post(URL.distribute, params));
}

export async function claim(params: TableListParams) {
  return (Axios.post(URL.claim, params));
}

// 是否拥有指定权限
export async function getUserPermissionList(params: any) {
  return (Axios.post(URL.getUserPermissionList, params));
}

export async function getConfigRule(params: any) {
  return (Axios.post(URL.customerConfig, params));
}

export async function getDistributeGroupConifgRule(params: any) {
  return (Axios.post(URL.searchGroup, params));
}

// export async function leadsDistributeRule(params: any) {
//   return (Axios.post(URL.requirementDistribute, params));
// }

export async function getDistributePeopleConifgRule(params: any) {
  return (Axios.post(URL.searchUser, params));
}

// export async function getLeadStatusConfigRule(params: any) {
//   return (Axios.post(URL.leadsHeader, params));
// }

// export async function getRequirementList(params: any){
//   return Axios.post(URL.reqList, params);
// }

// export async function removeRule(params: TableListParams) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'delete',
//     },
//   });
// }

// export async function addRule(params: TableListParams) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'post',
//     },
//   });
// }

// export async function updateRule(params: TableListParams) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'update',
//     },
//   });
// }
