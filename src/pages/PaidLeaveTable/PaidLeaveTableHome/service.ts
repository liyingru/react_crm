
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

// 获取分组列表
export async function getSchedulingList(params: {page: number, pageSize: number}) {
  return (Axios.post(URL.getSchedulingList, params));
}

export async function addScheduling(params) {
  return (Axios.post(URL.addScheduling, params));
}
export async function editScheduling(params) {
  return (Axios.post(URL.editScheduling, params));
}
export async function deleteScheduling(params) {
  return (Axios.post(URL.deleteScheduling, params));
}
export async function searchUser(params) {
  return (Axios.post(URL.searchUser, params));
}




