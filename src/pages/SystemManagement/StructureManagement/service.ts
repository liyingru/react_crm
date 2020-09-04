import { AddStructureParams, DeleteStructureParams, TableListParams } from './data';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';


export async function getCompanyList(params: TableListParams) {
  return Axios.post(URL.getCompanyList, params);
};

export async function getStructureList(params: TableListParams) {
  return Axios.post(URL.getListStructure, params);
};

export async function addStructure(params: AddStructureParams) {
  return Axios.post(URL.addStructure, params);
};

export async function deleteStructure(params: DeleteStructureParams) {
  return Axios.post(URL.deleteStructure, params);
};

export async function editStructure(params: AddStructureParams) {
  return Axios.post(URL.eidtStructure, params);
};

