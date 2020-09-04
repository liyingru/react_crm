import { } from './data';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';


export async function getCompanyList(params: any) {
  return Axios.post(URL.getCompanyList, params);
};

export async function getRoleList(params: any) {
  return Axios.post(URL.getRoleList, params);
};

export async function getPermissionsList(params: any) {
  return Axios.post(URL.getPermissionsList, params);
};

export async function getRoleTree(params: any) {
  return Axios.post(URL.getRoleTree, params);
};

export async function addRole(params: any) {
  return Axios.post(URL.addRole, params);
};

export async function deleteRole(params: any) {
  return Axios.post(URL.deleteRole, params);
};

export async function editRole(params: any) {
  return Axios.post(URL.editRole, params);
};

