import request from '@/utils/request';
import Axios from 'axios';
import URL from '@/api/serverAPI.config'; 
import { NewLeadsParamsType } from './data';
import { TransferToUserParams } from '@/components/TransferToUserForm';



 
 
 
//创建线索 
export async function createLeads(params: NewLeadsParamsType) { 
  return Axios.post(URL.createLeads, params); 
}

//转让线索 
export async function transferLeads(params: TransferToUserParams) { 
  return Axios.post(URL.transfereLeads, params); 
}

//获取用户列表
export async function userList(params: any) { 
  return Axios.post(URL.transfereLeads, params); 
}

export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}


