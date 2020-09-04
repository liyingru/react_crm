import URL from '@/api/serverAPI.config';
import { DashboardWorkplaceParams } from './data.d';
import Axios from 'axios';

export async function getBossSea(params: DashboardWorkplaceParams) {
  return Axios.post(URL.getBossSea, params);
}

export async function setBossSea(params: DashboardWorkplaceParams) {
  return Axios.post(URL.setBossSea, params);
}

export async function getWorkList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.getWorkList, params);
}

export async function setWorkList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.setWorkList, params);
}

export async function workbenchNums(params: DashboardWorkplaceParams) {
  return Axios.post(URL.workbenchNums, params);
}

export async function queryCompanyList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.getCompanyList, params);
}

export async function queryStructureList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.getListStructure, params);
}

export async function queryUsersList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.queryUsersList, params);
}

export async function queryMyPerformance(params: DashboardWorkplaceParams) {
  return Axios.post(URL.mykpi, params);
}

export async function querySalesAssistant(params: DashboardWorkplaceParams) {
  return Axios.post(URL.saleshelper, params);
}

export async function querySalesPerformance(params: DashboardWorkplaceParams) {
  return Axios.post(URL.salesAchievement, params);
}

export async function queryForecastPerformance(params: DashboardWorkplaceParams) {
  return Axios.post(URL.forecastAchievement, params);
}

export async function queryHonorList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.talkingTop, params);
}

export async function queryReqrankingList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.reqranking, params);
}

export async function queryOrderrankingList(params: DashboardWorkplaceParams) {
  return Axios.post(URL.orderranking, params);
}

export async function querySalesFunnel(params: DashboardWorkplaceParams) {
  return Axios.post(URL.salesfunnel, params);
}

export async function queryApprovalCenter(params: DashboardWorkplaceParams) { return undefined; }

export async function queryCallAnalysis(params: DashboardWorkplaceParams) {
  return Axios.post(URL.callOutAnalyze, params);
}
