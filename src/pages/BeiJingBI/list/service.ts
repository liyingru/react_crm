import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function queryRule(params: TableListParams) {
  return (Axios.post(URL.customerList, params));
}

export async function getConfigRule(params: any) {
  return (Axios.post(URL.customerConfig, params));
}
export async function getCompanyChannelRule(params: any) {
  return (Axios.post(URL.searchchannel, params));
}
export async function getCompanyUsersRule(params: any) {
  return (Axios.post(URL.queryUsersList, params));
}
export async function externalFlowRule(params: any) {
  return (Axios.post(URL.externalFlowCustomer, params));
}
export async function internalFlowRule(params: any) {
  return (Axios.post(URL.internalFlowCustomer, params));
}
export async function getRulesUserInfoRule(params: any) {
  return (Axios.post(URL.getRulesUserInfo, params));
}
export async function getNBUsersRule(params:any){
  return Axios.post(URL.searchUser, params)
}

