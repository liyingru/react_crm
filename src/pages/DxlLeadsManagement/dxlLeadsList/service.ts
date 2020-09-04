import request from '@/utils/request';
import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function queryRule(params: TableListParams) {
  // return request('/api/rule', {
  //   params,
  // });
  return (Axios.post(URL.leadsList, params));
}

export async function getConfigRule(params: any) {
  return (Axios.post(URL.customerConfig, params));
}

export async function getXPFlowInfoRule(params: any) {
  return (Axios.post(URL.getXPFlowInfo, params));
}

export async function getDistributeGroupConifgRule(params: any) {
  return (Axios.post(URL.searchGroup, params));
}

export async function leadsDistributeRule(params: any) {
  return (Axios.post(URL.leadsDistribute, params));
}

export async function getDistributePeopleConifgRule(params: any) {
  return (Axios.post(URL.searchUser, params));
}

export async function getLeadStatusConfigRule(params: any) {
  return (Axios.post(URL.leadsHeader, params));
}

export async function updateReqLiteRule(params: any) {
  return (Axios.post(URL.updateReqLite, params));
}
export async function merchantnotesRule(params: any) {
  return (Axios.post(URL.merchantnotes, params));
}
export async function thirdrecardsRule(params: any) {
  return (Axios.post(URL.thirdrecards, params));
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

