import Axios from "axios";
import URL from '@/api/serverAPI.config';

export async function listRule(params: any) {
    return (Axios.post(URL.auditList, params));
  }
  
  export async function configRule(params: any) {
    return (Axios.post(URL.customerConfig, params));
  }