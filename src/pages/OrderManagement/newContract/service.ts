import request from '@/utils/request';
import Axios from 'axios';
import URL from '@/api/serverAPI.config'; 




 
 
 
//创建合同 
export async function createContract(params: any) { 
  return Axios.post(URL.createContract, params); 
}

export async function getContractConfig(params: any) {
  return (Axios.post(URL.getContractConfig, params));
}

export async function searchUser(params: any) {
  return (Axios.post(URL.searchUser, params));
}


export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}


