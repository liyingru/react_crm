import request from '@/utils/request';
import { TableListParams } from './data.d';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function queryListStructure(params) {
  return Axios.post(URL.getListStructure, params);
}

export async function queryListPosition(params) {
  return Axios.post(URL.getListPosition, params);
}

export async function queryUsersList(params: TableListParams) {
  return Axios.post(URL.queryUsersList, params);
}

export async function removeUser(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addUser(params: TableListParams) {
  return Axios.post(URL.addUser, params);
}

export async function updateUser(params: TableListParams) {
  return Axios.post(URL.editUser, params);
}

export async function getCompanyList() {
  return Axios.post(URL.getCompanyList);
};

export async function getRoleList(params: TableListParams) {
  return Axios.post(URL.getRoleList, params);
};

// 是否拥有指定权限
export async function getUserPermissionList(params: any) {
  return (Axios.post(URL.getUserPermissionList, params));
}

// 将用户离线
export async function checkInOrOut(params: {checkId:string}) {
  return (Axios.post(URL.checkInOrOut, params));
}

export async function doLoginOut(params: {checkId:string}) {
  return (Axios.post(URL.doLoginOut, params));
}

