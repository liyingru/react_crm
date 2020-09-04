import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function addStructureSelltarget(params: any) {
  return (Axios.post(URL.addStructureSelltarget, params));
}

export async function editStructureSelltarget(params: any) {
  return (Axios.post(URL.editStructureSelltarget, params));
}

export async function delStructureSelltarget(params: any) {
  return (Axios.post(URL.delStructureSelltarget, params));
}

export async function getStructureSelltargetList(params: any) {
  return (Axios.post(URL.getStructureSelltargetList, params));
}

export async function getStructureSelltargetInfo(params: any) {
  return (Axios.post(URL.getStructureSelltargetInfo, params));
}

export async function addUserSelltarget(params: any) {
  return (Axios.post(URL.addUserSelltarget, params));
}

export async function editUserSelltarget(params: any) {
  return (Axios.post(URL.editUserSelltarget, params));
}

export async function delUserSelltarget(params: any) {
  return (Axios.post(URL.delUserSelltarget, params));
}

export async function getUserSelltargetList(params: any) {
  return (Axios.post(URL.getUserSelltargetList, params));
}

export async function getUserSelltargetInfo(params: any) {
  return (Axios.post(URL.getUserSelltargetInfo, params));
}
