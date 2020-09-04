
//weddingStyleList 	array 	婚礼风格
//weddingTypeList 	array 	婚礼类型
//contractStatusList 	array 	合同状态
//taocanList 	array 	套餐列表

/**
 * 跟进配置项
 */
export interface ContractConfigData {
  weddingStyleList: [],
  weddingTypeList: [],
  contractStatusList: [],
  taocanList: [],
  baseInfo:{},
  structureList:[],
  photoStyleList:[],
  preferentialTypeList:[],
  receivablesTypeList:[],
  agreementTypeList:[],
  productList:[],
}

export interface TableListItem {
  id:number
  planReceivablesDate: string;
  planReceivablesMoney: string;
  receivablesType: string;
  receivablesTypeTxt: string;
  remark: string;
}







