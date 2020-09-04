import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function queryStructureList(params: any) {
  return Axios.post(URL.getListStructure, params);
}

export async function queryUserList(params: any) {
  return Axios.post(URL.queryUsersList, params);
}
