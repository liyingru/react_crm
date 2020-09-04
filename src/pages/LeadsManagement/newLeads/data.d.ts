


export interface NewLeadsParamsType {
  channel: string;
  name: string;
  identity: string;
  gender: string;
  phone: string;
  wechat: string;
  locationCityCode: string;
  liveCityCode: string;
  liveAddress: string;
  workCityCode: string;
  workAddress: string;
  mainContactName: string;
  mainContactPhone: string;
  referrerName: string;
  referrerPhone: string;
  contactTime: string;
  category: string;
  weddingDate: string;
  hotel: string;
  hall: string;
  weddingStyle: string;
  tableNum: string;
  budget: string;
  bookTag: string;

}

export interface ConfigListItem {
  id: string;
  name: string;
}

export interface customerParams {
  phone: string
}

export interface bookTagParams {
  brand?: string;
  price?: string;
}

export interface bookTagContent {
  banquet: bookTagParams
  wedding: bookTagParams
  photography: bookTagParams
  car: bookTagParams
  celebration: bookTagParams
  oneStop: bookTagParams
  dress: bookTagParams
}

export interface bookTagResult {
  category: string,
  bizContent: bookTagContent
}

export interface cityInfo {
  province: string
  city: string
  district: string
  full: string
  city_code: string
}


//业务品类state类型 
interface reqState { 
  banquet: BanquetInfoState;//婚宴 
  wedding: WeddingInfoState;// 婚庆 
  photography: PhotographytInfoState;//婚纱摄影 
  car: CarInfoState;//婚车 
  celebration: CelebrationInfoState;// 到喜啦叫喜宴 其它叫喜宴 
  oneStop: OneStopInfoState;//一站式 
  dress: DressInfoState;//一站式 
}

 //婚宴实体
 interface BanquetInfoState {
  cityCode?: string;
  commission?: string;
  siteType?:string;
  scheduleType?:string;
  hotelFeature?:string;
  finalCategory?:string;
  hotelTablesFrom?:string;
  hotelTablesEnd?:string;
  budgetFrom?:string;
  budgetEnd?:string;
  perBudgetFrom?:string;
  perBudgetEnd?:string;
  remark?:string;
  needAutoDistribute?:string;
  reqOwnerId?:string;
}

//cityCode: "",weddingStyle:"",hotelTables: "",perBudget:"",budget: "", hotel: "", hotelHall: ""
//婚庆实体
interface WeddingInfoState {
  cityCode?: string;
  commission?: string;
  weddingStyle?:string;
  hotel?:string;
  hotelHall?:string;
  finalCategory?:string;
  hotelTablesFrom?:string;
  hotelTablesEnd?:string;
  budgetFrom?:string;
  budgetEnd?:string;
  perBudgetFrom?:string;
  perBudgetEnd?:string;
  remark?:string;
  needAutoDistribute?:string;
  reqOwnerId?:string;
}

//cityCode: "", photoStyle: "",budget: ""
//婚照实体
interface PhotographytInfoState {
  cityCode?: string;
  commission?: string;
  photoStyle?: string;
  finalCategory?:string;
  budgetFrom?:string;
  budgetEnd?:string;
  remark?:string;
  needAutoDistribute?:string;
  reqOwnerId?:string;
}


interface CarJsonInfoState {
  carBrandName?:string
  carBrand?: string;
  carNum?: string;
}

//婚车实体
interface CarInfoState {
  cityCode?: string;
  commission?: string;
  carTime?: string;
  carJson?:CarJsonInfoState [] ;
  finalCategory?:string;
  budgetFrom?:string;
  budgetEnd?:string;
  remark?:string;
  needAutoDistribute?:string;
  reqOwnerId?:string;
}

//庆典or喜宴实体
//cityCode: "",category:"",hotelTables: "",perBudget:"",budget: "", hotel: "", hotelHall: ""
interface CelebrationInfoState {
  cityCode?: string;
  commission?: string;
  hotel?:string;
  hotelHall?:string;
  finalCategory?:string;
  hotelTablesFrom?:string;
  hotelTablesEnd?:string;
  budgetFrom?:string;
  budgetEnd?:string;
  perBudgetFrom?:string;
  perBudgetEnd?:string;
  remark?:string;
  needAutoDistribute?:string;
  reqOwnerId?:string;
}

//一站式实体
//cityCode: "",weddingStyle:"",hotelTables: "",perBudgetFrom:"",perBudgetEnd: "", hotel: "", hotelHall: "",hotelTablesFrom:"",hotelTablesEnd:"",remark:""
interface OneStopInfoState {
  cityCode?: string;
  commission?: string;
  weddingStyle?:string;
  hotel?:string;
  hotelHall?:string;
  finalCategory?:string;
  hotelTablesFrom?:string;
  hotelTablesEnd?:string;
  budgetFrom?:string;
  budgetEnd?:string;
  perBudgetFrom?:string;
  perBudgetEnd?:string;
  remark?:string;
  needAutoDistribute?:string;
  reqOwnerId?:string;
}

//礼服实体
//cityCode: "",dressUseWay: "", dressType: "",dressModel:"",dressNum:""，finalCategory:"",budgetFrom:"",budgetEnd:"",needAutoDistribute:"",reqOwnerId:"",remark:""
interface DressInfoState {
  cityCode?: string;
  commission?: string;
  dressUseWay?: string;
  dressType?: string;
  dressModel?: string;
  dressNum?: string;
  finalCategory?:string;
  budgetFrom?:string;
  budgetEnd?:string;
  remark?:string;
  needAutoDistribute?:string;
  reqOwnerId?:string;
}

//客户信息数据
interface CustomerInfoState {
  customer_id?: string;
  wechat?: string;
  level?: string;
  customer_name?: string;
  phone?: string;
  wedding_date?: string;
  wedding_date_from?: string;
  wedding_date_end?: string;
  budget?: string;
  gender?: string;
  identity?: string;
  live_city_code?: string;
  live_address?: string;
  work_city_code?: string
  like_city_code?: string
  work_address?: string;
  hotel?: string;
  hall?: string;
  wedding_style?: string;
  table_num?: string;
  leads_cid?: number[]
  book_tag?: bookTagResult
  
}








