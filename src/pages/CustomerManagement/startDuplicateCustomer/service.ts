import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { ParamsDetail, SearchParams, RepeatParams } from './data';


export async function getCustomerList(params:ParamsDetail){
   return (Axios.post(URL.customerList, params));
}

export async function search(params:SearchParams){
   return (Axios.post(URL.search, params));
}

export async function customerDetailById(params:{customerId:string}){
   const realParams = {
      type: 4,
      customerId: params.customerId
   }
   return (Axios.post(URL.getCustomerInfo, realParams));
}

export async function repeatSubmit(params:RepeatParams){
   return (Axios.post(URL.repeatSubmit, params));
}
