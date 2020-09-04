
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

export async function fetchListRule(params: any) {
  return (Axios.post(URL.knowledgeList, params));
}

//话术分类列表
export async function fetchCategoryListRule(params: any) {
  return (Axios.post(URL.knowledgeCategoryList, params));
}
//话术分类删除
export async function deleteCategoryRule(params: any) {
  return (Axios.post(URL.knowledgeCategoryDel, params));
}
//话术分类新增修改
export async function changeCategoryRule(params: any) {
  return (Axios.post(URL.knowledgeCategoryChange, params));
}

/**新增话术*/
export async function addKnowledge(params: any) {
  return (Axios.post(URL.addKnowledge, params));
}

/**编辑话术*/
export async function editKnowledge(params: any) {
  return (Axios.post(URL.editKnowledge, params));
}

/**删除话术*/
export async function delKnowledge(params: any) {
  return (Axios.post(URL.delKnowledge, params));
}






