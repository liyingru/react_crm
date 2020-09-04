import { OrderDetailsParams, CreateContactUserParams } from './data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { response } from 'express';

// 获取订单信息接口
export async function getOrderDetails(params: OrderDetailsParams) {
    return (Axios.post(URL.getOrderDetails, params));
}

// 获取配置项
export async function getConfigData(params: OrderDetailsParams) {
    return (Axios.post(URL.customerConfig, params));
}

// 获取人员列表
export async function getGroupUserList(params: any) {
    return (Axios.post(URL.getGroupUserList, params));
}

// 获取合同列表
export async function getContractList(params: any) {
    return (Axios.post(URL.contractList, params));
}

// 获取商家结算列表
export async function getStoreSettlement(params: any) {
    return (Axios.post(URL.getStoreSettlement, params));
}



// 更新订单
export async function updateOrderCtrl(params: any) {
    return (Axios.post(URL.updateOrder, params));
}
// 是否已经是好友
export async function isFriend(params: any) {
    return (Axios.post(URL.isFriend, params));
}

// 是否拥有指定权限
export async function getUserPermissionList(params: any) {
    return (Axios.post(URL.getUserPermissionList, params));
}

// 获取跟进列表
export async function getFollowList(params: any) {
    return (Axios.post(URL.followList, params));
}

// 获取用户列表
export async function percentUserList(params: any) {
    return (Axios.post(URL.searchUser, params));
}

// 获取回款配置项
export async function getMoneyonfig(params: any) {
    return (Axios.post(URL.moneyonfig, params));
}

// 录占比
export async function updateRatio(params: any) {
    return (Axios.post(URL.updateRatio, params));
}

// 搜索产品
export async function contractSearchProduct(params: any) {
    return (Axios.post(URL.contractSearchProduct, params));
}
// 绑定产品
export async function bindProductCtrl(params: any) {
    return (Axios.post(URL.bindProduct, params));
}

// 解绑产品
export async function unBindProduct(params: any) {
    return (Axios.post(URL.unBindProduct, params));
 }
 

