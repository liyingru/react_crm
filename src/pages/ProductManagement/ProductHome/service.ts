import { TableListParams,DelParams} from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

// 获取分组列表
export async function getProductMangementList(params: TableListParams) {
  return (Axios.post(URL.getProductList, params));
}

// 删除分组
export async function delProductList(params: DelParams) {
  return (Axios.post(URL.delProduct, params));
}

  
// 商家列表
export async function getStoreList(params: any) {
  return (Axios.post(URL.storeList, params));
}

