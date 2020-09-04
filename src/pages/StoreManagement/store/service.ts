// import request from '@/utils/request';

// export async function fakeSubmitForm(params: any) {
//   return request('/api/forms', {
//     method: 'POST',
//     data: params,
//   });
// }
import { storeParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';


export async function initData(params: storeParams) {
  return (Axios.post(URL.customerConfig,params));
}


export async function storeHotelConfig(params: any) {
  return (Axios.post(URL.storeHotelConfig,params));
}

export async function storeHotelList(params: any) {
  return (Axios.post(URL.storeHotelList,params));
}

export async function storeHotelDetail(params: any) {
  return (Axios.post(URL.storeHotelDetail,params));
}

export async function storeWeddingConfig(params: any) {
  return (Axios.post(URL.storeWeddingConfig,params));
}

export async function storeWeddingList(params: any) {
  return (Axios.post(URL.storeWeddingList,params));
}

export async function storeWeddingDetail(params: any) {
  return (Axios.post(URL.storeWeddingDetail,params));
}

export async function storeHunqingList(params: any) {
  return (Axios.post(URL.storeHunqingList,params));
}

export async function storeHunqingDetail(params: any) {
  return (Axios.post(URL.storeHunqingDetail,params));
}

export async function storeClothingList(params: any) {
  return (Axios.post(URL.storeClothingList,params));
}

export async function storeClothingDetail(params: any) {
  return (Axios.post(URL.storeClothingDetail,params));
}

export async function storeHoneymoonList(params: any) {
  return (Axios.post(URL.storeHoneymoonList,params));
}

export async function storeHoneymoonDetail(params: any) {
  return (Axios.post(URL.storeHoneymoonDetail,params));
}
export async function storeCustomerDetail(params: any) {
  return (Axios.post(URL.customerDetail,params));
}
export async function saveRecommendCtrlReq(params: any) {
  return (Axios.post(URL.merchantRecommend,params));
}

/**
 * 获取配置项
 */
export async function getCustomerConfig(){
  return Axios.post(URL.customerConfig)
}

export async function getNewCategory(params: any){
  return Axios.post(URL.newCategory,params)
}

export async function getNewCategoryDetail(params: any){
  return Axios.post(URL.newCategoryDetail,params)
}

// 推荐详情
export async function recommendCsDetail(params: any){
  return Axios.post(URL.reqDetail,params)
}
// 获取商家联系人
export async function getStoreContact(params: any){
  return Axios.post(URL.storeContact,params)
}

// 获取商家活动
export async function getStoreCoupon(params: any){
  return Axios.post(URL.storeCoupon,params)
}

// 获取商家套系
export async function getStoreGoods(params: any){
  return Axios.post(URL.storeGoods,params) 
}

// 获取商家套系
export async function getMoorPhoneDialout(params: any){
  return Axios.post(URL.moorPhoneDialout,params) 
}
