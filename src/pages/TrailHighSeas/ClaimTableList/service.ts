import request from '@/utils/request';
import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function leadsConfig() {
  return (Axios.post(URL.customerConfig));
}
// 搜索客户
export async function getCustomerByNameCtrl() {
  return (Axios.post(URL.getCustomerByName));
}
// 根据收据
export async function getCustomerInfoCtrl() {
  return (Axios.post(URL.getCustomerInfo));
}


export async function queryRule(params: TableListParams) {
  return (Axios.post(URL.allLeadsList, params));
}

export async function leadsClaim(params: {[key:string] : string}) {
  return (Axios.post(URL.leadsClaim, params));
}

export async function listRole(params: {[key:string] : string}) {
  return (Axios.post(URL.getGroupUserList, params));
}

export async function groupList(params: {[key:string] : string}) {
  return (Axios.post(URL.getGroupList, params));
}

export async function leadsDistribute(params: {[key:string] : string}) {
  return (Axios.post(URL.leadsDistribute, params));
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


export async function getDistributePeopleConifgRule(params: any) {
  return (Axios.post(URL.searchUser, params));
}

export async function getDistributeGroupConifgRule(params: any) {
  return (Axios.post(URL.searchGroup, params));
}
export async function getUserPermissionList(params: any) {
  return (Axios.post(URL.getUserPermissionList, params));
}

