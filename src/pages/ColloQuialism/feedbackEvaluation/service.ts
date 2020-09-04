import { TableListParams,statusParams} from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

// 获取分组列表
export async function getGroupMangementList(params: TableListParams) {
  return (Axios.post(URL.groupMangementList, params));
}

// 冻结分组
export async function getChangeStatus(params: statusParams) {
  return (Axios.post(URL.changeStatus, params));
}


  

