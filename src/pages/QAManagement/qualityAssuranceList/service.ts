import request from '@/utils/request';
import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { async } from 'q';


export async function queryRule(params: TableListParams) {
  // return request('/api/rule', {
  //   params,
  // });
  return (Axios.post(URL.leadsList, params));
}

export async function getConfigRule(params: any) {
  return (Axios.post(URL.customerConfig, params));
}

export async function getDistributeGroupConifgRule(params: any) {
  return (Axios.post(URL.searchGroup, params));
}

export async function leadsDistributeRule(params: any) {
  return (Axios.post(URL.requirementDistribute, params));
}

export async function getDistributePeopleConifgRule(params: any) {
  return (Axios.post(URL.searchUser, params));
}

export async function getLeadStatusConfigRule(params: any) {
  return (Axios.post(URL.leadsHeader, params));
}

export async function getRequirementList(params: any){
  return Axios.post(URL.reqList, params);
}
// 是否拥有指定权限
export async function getUserPermissionListCtrl(params: any) {
  return (Axios.post(URL.getUserPermissionList, params));
}
// 批量更新有效单
export async function updateReqLiteCtrl(params: any) {
  return (Axios.post(URL.updateReqLite, params));
}


export async function removeRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

// 质检列表
export async function fetchQAList(params: any) {
  return (Axios.post(URL.reqQaList, params));
}


// 质检配置项
export async function fetchReqConfig(params: any) {
  return (Axios.post(URL.reqQaConfig, params));
}
