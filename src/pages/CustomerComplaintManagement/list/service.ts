import request from '@/utils/request';
import { CustomerComplaintListParams } from '../data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';


export async function customerComplaintList(params: CustomerComplaintListParams) {
  return (Axios.post(URL.customerComplaintList, params));
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
