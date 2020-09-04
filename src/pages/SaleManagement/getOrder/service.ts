// import request from '@/utils/request';

// export async function fakeSubmitForm(params: any) {
//   return request('/api/forms', {
//     method: 'POST',
//     data: params,
//   });
// }
import { ClaimOrderParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function claimOrder(params: ClaimOrderParams) {
  return (Axios.post(URL.claimOrder,params));
}


export async function orderList(params:any) {
  return (Axios.post(URL.orderList,params));
}


