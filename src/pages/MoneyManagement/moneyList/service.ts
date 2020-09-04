import { TableListParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function queryRule(params:TableListParams) {
  return (Axios.post(URL.orderList,params));
}

// 获取分组列表
export async function getsettlementMangementList(params: TableListParams) {
  return (Axios.post(URL.settlementMangementList, params));
}