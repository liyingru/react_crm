import { type } from 'os';
import { ProductInfo } from '../orderDetails/data';

//weddingStyleList 	array 	婚礼风格
//weddingTypeList 	array 	婚礼类型
//contractStatusList 	array 	合同状态
//taocanList 	array 	套餐列表

/**
 * 跟进配置项
 */
export interface ContractConfigData {
  weddingStyleList: []
  weddingTypeList: []
  contractStatusList: []
  taocanList: []
  baseInfo: {}
  structureList: []
  photoStyleList: []
}

export interface TableListItem {
  id: number
  planReceivablesDate: string;
  planReceivablesMoney: string;
  receivablesType: string;
  receivablesTypeTxt: string;
  remark: string;
}
export interface preferentialInfo {
  type?: string
  typeName?: string
  content?: string
}

export interface productInfo {
  /**
   * "id": 10,
      "name": "测试产品2",
      "price_min": "112.00",
      "price_max": "322.00",
      "merchant_name ": "武汉喜庄婚纱摄影",
      "category_name": "婚宴"
   */
  id?: string
  name?: string
  price_min?: string
  price_max?: string
  merchant_name?: string
  category_name?: string
}

export interface ContractConfigData {
  weddingStyleList: [],
  weddingTypeList: [],
  contractStatusList: [],
  taocanList: [],
  baseInfo: {},
  structureList: [],
  photoStyleList: [],
  preferentialTypeList: [],
  receivablesTypeList: [],
  agreementTypeList: [],
  productList: ProductInfo[],
}







