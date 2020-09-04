import {detailParams,updateParams} from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

// 分组详情
export async function getGroupDetail(params: detailParams) {
  return (Axios.post(URL.groupDetail, params));
}

// 分组修改
export async function getGroupUpdate(params: updateParams) {
  return (Axios.post(URL.groupUpdate, params));
}
// 删除分组
export async function deletGroupCtrl(params: updateParams) {
  return (Axios.post(URL.deleteGroup, params));
}

// 任务配置
export async function taskConfigCtrl(params: any) {
  return (Axios.post(URL.taskgetConfig, params));
}
