import request from '@/utils/request';
import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function queryRule(params:TableListParams) {
  // return request('/api/rule', {
  //   params,
  // });

  return (Axios.post(URL.orderList,params));
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
// 是否拥有指定权限
export async function getUserPermissionListCtrl(params: any) {
  return (Axios.post(URL.getUserPermissionList, params));
}