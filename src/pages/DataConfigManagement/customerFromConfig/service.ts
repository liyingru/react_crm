import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function ownerChannelGetList(params: any) {
    return (Axios.post(URL.ownerChannelGetList, params));
}

export async function getEditChannelList(params: any) {
    return (Axios.post(URL.getEditChannelList, params));
}

