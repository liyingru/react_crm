import request from '@/utils/request';
import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function queryRule(params:TableListParams) {
  return (Axios.post(URL.orderList,params));
}

export async function getDistributePeopleConifgRule(params: any) {
  return (Axios.post(URL.searchUser, params));
}
// 是否拥有指定权限
export async function getUserPermissionListCtrl(params: any) {
  return (Axios.post(URL.getUserPermissionList, params));
}