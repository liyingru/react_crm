import Axios from 'axios';
import URL from '@/api/serverAPI.config';


export async function getReqQaDetail(params:any){
   return Axios.post(URL.reqQaCustomerDetail,params)
}

export async function getReqQaCreate(params:any){
   return Axios.post(URL.reqQaCreate,params)
}

export async function getReqQaPhase(params:any){
   return Axios.post(URL.reqQaPhase,params)
}

export async function getReqQaReqList(params:any){
   return Axios.post(URL.reqQaDetail,params)
}

export async function reDistributeCompany(params:any){
   return Axios.post(URL.reqQaDistribute,params)
}

export async function getAllRecordList(params:any){
   return Axios.post(URL.allRecordList,params)
}

