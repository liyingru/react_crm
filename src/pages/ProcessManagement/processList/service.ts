import Axios from "axios";
import URL from '@/api/serverAPI.config';

export async function processListRule(params: any) {
  return (Axios.post(URL.auditConfigList, params));
}

export async function configRule(params: any) {
  return (Axios.post(URL.customerConfig, params));
}

export async function processDeleteRule(params: any) {
  return (Axios.post(URL.deleteAuditConfig, params));
}

export async function processEditRule(params: any) {
  return (Axios.post(URL.editAuditConfig, params));
}