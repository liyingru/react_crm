import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function getCustomerServiceTargetList(params: any) {
  return (Axios.post(URL.customerServiceTargetList, params));
}
