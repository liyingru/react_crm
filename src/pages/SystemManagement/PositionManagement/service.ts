import { AddPositionParams, DeletePositionParams, EditPositionParams, TableListParams } from './data';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';


export async function getCompanyList(params: TableListParams) {
  return Axios.post(URL.getCompanyList, params);
};

export async function getPositionList(params: TableListParams) {
  return Axios.post(URL.listPosition, params);
};

export async function addPosition(params: AddPositionParams) {
  return Axios.post(URL.addPosition, params);
};

export async function deletePosition(params: DeletePositionParams) {
  return Axios.post(URL.deletePosition, params);
};

export async function editPosition(params: EditPositionParams) {
  return Axios.post(URL.eidtPosition, params);
};

