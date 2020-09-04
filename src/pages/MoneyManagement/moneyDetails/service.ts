import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { TableListParams, ParamsDetail } from './data';


// 获取回款列表
export async function getMoneyMangementList(params: TableListParams) {
  return (Axios.post(URL.moneyMangementList, params));
}

// 回款详情
export async function getMoneyDetail(params:ParamsDetail){
  return Axios.post(URL.settlementDetail,params)
}

// 公共config
export async function getCommonConfig(){
  return Axios.post(URL.commonConfig)
}
