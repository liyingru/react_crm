// import request from '@/utils/request';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

// export async function query(): Promise<any> {
//   return request('/api/users');
// }

// export async function queryCurrent(): Promise<any> {
//   return request('/api/currentUser');
// }

export async function queryNotices(params: any) {
  return Axios.post(URL.noticGetList, params);
}

export async function getGroupUserList() {
  return Axios.post(URL.getGroupUserList);
}
