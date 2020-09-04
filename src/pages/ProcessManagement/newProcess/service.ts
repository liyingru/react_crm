import Axios from "axios";
import URL from '@/api/serverAPI.config';

export async function configRule(params: any) {
  return (Axios.post(URL.customerConfig, params));
}

export async function newRule(params: any) {
  return (Axios.post(URL.addAuditConfig, params));
}

export async function detailRule(params: any) {
  return (Axios.post(URL.auditconfiginfo, params));
}

export async function editRule(params: any) {
  return (Axios.post(URL.editAuditConfig, params));
}

export async function userListRule(params: any) {
  return (Axios.post(URL.queryUsersList, params));
}