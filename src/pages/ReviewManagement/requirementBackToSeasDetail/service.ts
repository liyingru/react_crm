import Axios from "axios";
import URL from '@/api/serverAPI.config';

export async function doRule(params: any) {
    return (Axios.post(URL.doAudit, params));
}


export async function infoRule(params: any) {
    return (Axios.post(URL.auditInfo, params));
}

export async function redistribute(params: any) {
    return (Axios.post(URL.auditInfo, params));
}

