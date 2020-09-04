import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// 初始化数据
export async function activitylist(params: any) {
    return (Axios.post(URL.activitylist, params));
}
export async function addActivity(params: any) {
    return (Axios.post(URL.addActivity, params));
}
export async function editActivity(params: any) {
    return (Axios.post(URL.editActivity, params));
}
export async function deleteActivity(params: any) {
    return (Axios.post(URL.deleteActivity, params));
}