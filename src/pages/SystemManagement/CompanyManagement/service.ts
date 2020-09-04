import { AddCompanyParams, DeleteCompanyParams, TableListParams } from './data';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';

export async function getCompanyList(params: TableListParams) {
  return Axios.post(URL.getCompanyList, params);
};

export async function addCompany(params: AddCompanyParams) {
  return Axios.post(URL.addCompany, params);
};

export async function deleteCompany(params: DeleteCompanyParams) {
  return Axios.post(URL.deleteCompany, params);
};

export async function editCompany(params: DeleteCompanyParams) {
  return Axios.post(URL.eidtCompany, params);
};

