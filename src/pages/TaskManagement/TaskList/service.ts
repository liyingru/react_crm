import URL from '@/api/serverAPI.config';
import Axios from 'axios';

// 初始化数据
export async function initData(params: any) {
  return (Axios.post(URL.taskList, params));
}
// 任务配置
export async function taskConfigCtrl(params: any) {
  return (Axios.post(URL.taskgetConfig, params));
}
// 创建任务
export async function createTaskCtrl(params: any) {
  return (Axios.post(URL.createTask, params));
}
// 更新任务
export async function updateTaskCtrl(params: any) {
  return (Axios.post(URL.updateTask, params));
}
// 任务详情
export async function taskDetailCtrl(params: any) {
  return (Axios.post(URL.taskDetail, params));
}

// 分配任务
export async function distributeUserCtrl(params: any) {
  return (Axios.post(URL.distributeUser, params));
}
// 删除任务
export async function deleteTaskCtrl(params: any) {
  return (Axios.post(URL.deleteTask, params));
}
// 删除任务条件
export async function deleteConditionCtrl(params: any) {
  return (Axios.post(URL.deleteCondition, params));
}

// 暂停开启任务
export async function changeStatuTaskCtrl(params: any) {
  return (Axios.post(URL.changeStatuTask, params));
}

// 回收任务
export async function recoveryDataTaskCtrl(params: any) {
  return (Axios.post(URL.recoveryDataTask, params));
}

// 搜索用户组
export async function getGroupUserListCtrl(params: any) {
  return (Axios.post(URL.searchGroup, params));
}

// 搜索用户的
export async function searchUserCtrl(params: any) {
  return (Axios.post(URL.searchUser, params));
}





