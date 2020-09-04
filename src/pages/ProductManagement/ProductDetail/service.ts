import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import {detailParams,ParamsEdit} from './data';

/**
 * 获取配置项
 */
export async function getCustomerConfig(){
   return Axios.post(URL.commonConfig)
}

// 商家列表
export async function getStoreList(params: any) {
   return (Axios.post(URL.storeList, params));
}

// 分组详情
export async function getProductDetail(params: detailParams) {
   return (Axios.post(URL.productDetail, params));
}

// 编辑产品
export async function editProduct(params:ParamsEdit){
   return Axios.post(URL.editProduct,params)
}


// 删除分组
export async function delProductList(params: DelParams) {
   return (Axios.post(URL.delProduct, params));
 }