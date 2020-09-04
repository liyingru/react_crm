import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { ParamsAdd} from './data';

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

// 添加产品
export async function addProduct(params:ParamsAdd){
   return Axios.post(URL.addProduct,params)
}