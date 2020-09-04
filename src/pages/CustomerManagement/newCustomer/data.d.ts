


export interface AddCustomerParamsType {

  /**
   *  channel 	是 	int 	来源渠道
      customerName 	是 	string 	客户姓名
      flowStatus 	否 	int 	跟进情况
      identity 	否 	int 	客户身份
      gender 	否 	int 	性别 ：0:女,1:男
      weddingDate 	是 	string 	婚期
      customerLevel 	是 	int 	客户评级
      phone 	是 	string 	联系方式，电话
      weChat 	否 	string 	微信号
      liveProvince 	否 	string 	居住地 省
      liveCity 	否 	string 	居住地 市
      liveAddress 	否 	string 	居住地 地址
      workProvince 	否 	string 	工作 省
      workCity 	否 	string 	工作 市
      workAddress 	否 	string 	工作 地址
      contactTime 	否 	string 	方便 联系 时间
      referrerName 	否 	string 	推荐人姓名
      budget 	是 	string 	预算
      cityCode 	否 	string 	意向城市
      cityArea 	否 	string 	意向区域
      categoryIds 	是 	string 	业务品类 1,2,3 逗号隔开
      categoryMerchant 	是 	string 	业务品类商家 喜铺,喜莊,礼合 逗号隔开
      weddingStyle 	否 	string 	婚礼风格
      deskNum 	否 	string 	桌数
      hotel 	否 	string 	酒店
   */
    channel: string;
    customerName: string;
    flowStatus: string;
    identity: string;
    gender: string;
    weddingDate: string;
    customerLevel: string;
    phone: string;
    weChat: string;
    liveCityCode: string;
    liveAddress: string;
    workCityCode: string;
    workAddress: string;
    contactTime: string;
    referrerName: string;
    referrerPhone: string;
    budget: string;
    likeProvince: string;
    likeCity: string;
    likeDistrict: string;
    categoryIds: string;
    categoryMerchant: string;
    weddingStyle: string;
    deskNum: string;
    hotel: string;
}

export interface ConfigListItem {
   id: string;
   name: string;
 }

 export interface cityInfo{
   province: string;
   city: string;
   district: string;
   full: string;
   city_code: string;
 }

 export interface customerInfo{
   customer_id: 	int 	//客户ID
   wechat 	:int 	//微信号
   customer_name 	:string 	//客户姓名
   phone 	:string 	//手机号
   gender 	:int 	//性别
   gender_text: 	string 	//性别文本
   identity 	:int 	//客户身份
   identity_text: 	string 	//客户身份文本
   live_city_info: 	cityInfo 	//居住城市
   live_address 	:string 	//居住地址
   work_city_info :	cityInfo 	//居住城市
   work_address 	:string 	//居住地址
   like_city_info :	cityInfo 	//意向城市
   hotel 	:string 	//酒店
   hall 	:string 	//宴会厅
   service_user :	string 	//服务客服
   wedding_date 	:string 	//婚期
   budget 	:string 	//预算
   wedding_style: 	int //	婚礼风格
   wedding_style_text: 	string 	//婚礼风格文本
   table_num 	:int 	//桌数
   level 	:int 	//客户级别
   level_text: 	string 	//客户级别文本
   virtual_status: 	int 	//客户状态 0：虚拟 1：正常
 }

 //婚宴实体
 interface BanquetInfoState {
  cityCode?: string;
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
//cityCode: "",weddingStyle:"",hotelTables: "",perBudget:"",budget: "", hotel: "", hotelHall: ""
interface OneStopInfoState {
  cityCode?: string;
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
//cityCode: "",budget: "",dressUseWay: "", dressType: "",dressModel:"",dressNum:""
interface DressInfoState {
  cityCode?: string;
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
  city_code: any;
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


