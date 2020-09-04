
import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function getMenuList(params: any|undefined) {
  return Axios.post(URL.getPermissionsList, params);
};

export async function addMenu(params: any|undefined) {
  return Axios.post(URL.addMenu, params);
};

export async function editMenu(params: any|undefined) {
  return Axios.post(URL.editMenu, params);
};

export async function deleteMenu(params: any|undefined) {
  return Axios.post(URL.deleteMenu, params);
};

export async function listAct(params: any|undefined) {
  return Axios.post(URL.listAct, params);
};

export async function planList(params: any|undefined) {
  return Axios.post(URL.planList, params);
};





