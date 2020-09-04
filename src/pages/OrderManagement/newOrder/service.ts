// import request from '@/utils/request';

// export async function fakeSubmitForm(params: any) {
//   return request('/api/forms', {
//     method: 'POST',
//     data: params,
//   });
// }
import { CreateorderParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function createOrder(params: CreateorderParams) {
  return (Axios.post(URL.createOrder,params));
}

export async function initData(params: CreateorderParams) {
  return (Axios.post(URL.customerConfig,params));
}
export async function initDataName(params: CreateorderParams) {
  return (Axios.post(URL.getCustomerByName,params));
}

export async function transferOrdersCtrl(params: CreateorderParams) {
  return (Axios.post(URL.updateOrder,params));
}
export async function getCustomerByPhoneFn(params: CreateorderParams) {
  return (Axios.post(URL.getCustomerInfo,params));
}

export async function search(params) {
  return (Axios.post(URL.getCustomerInfo, params));
}

export async function getProductList(params) {
  return (Axios.post(URL.getProductList, params));
}

export async function customerDetailById(params:any){
  return (Axios.post(URL.getCustomerInfo, params));
}

export async function customerList() {
  return (Axios.post(URL.customerList));
}

export async function reqList(params: any) {
  return (Axios.post(URL.reqList, params));
}

export async function hotelList(params: any) {
  return (Axios.post(URL.storeHotelList, params));
}

export async function weddingList(params: any) {
  return (Axios.post(URL.storeWeddingList, params));
}

export async function hunqingList(params: any) {
  return (Axios.post(URL.storeHunqingList, params));
}

export async function storeList(params: any) {
  return (Axios.post(URL.storeList, params));
}

export async function contractSearchProduct(params: any) {
  return (Axios.post(URL.contractSearchProduct, params));
}

export async function getRecommendCompanys(params: any) {
  return (Axios.post(URL.getXPFlowInfo, params));
}

