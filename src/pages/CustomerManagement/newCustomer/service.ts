import request from '@/utils/request';
import Axios from 'axios';
import URL from '@/api/serverAPI.config'; 
import { AddCustomerParamsType } from './data';
import { TransferToUserParams } from '@/components/TransferToUserForm';

 
//创建线索 
export async function createLeads(params: AddCustomerParamsType) { 
  return Axios.post(URL.createLeads, params); 
}
 
//创建有效单
export async function createReq(params: AddCustomerParamsType) { 
  return Axios.post(URL.createReq, params); 
}

//转让客户给同事
export async function transferCustomer(params: TransferToUserParams) { 
  return Axios.post(URL.transferCustomer, params); 
}

export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
