export interface TableListParams {
    page: number;
    pageSize: number;
}

export interface TableListData {
  
}

export interface ParamsDetail{
    id:string
 }

 /**
 * 通用配置项
 */
export interface ConfigList {
    channel: ConfigListItem[]; // 渠道
    customerLevel: ConfigListItem[]; // 客户级别
    identity: ConfigListItem[]; // 客户身份
    gender: ConfigListItem[]; // 性别
    weddingStyle: ConfigListItem[]; // 婚礼风格
    category: ConfigListItem[]; // 业务品类
    contactTime: ConfigListItem[]; // 方便联系时间
    contactWay: ConfigListItem[]; // 跟进方式
    payType: ConfigListItem[]; // 付款方式
    requirementStatus: ConfigListItem[]; // 有效单状态
    followTag: ConfigListItem[]; // 跟进标签
    leadsFollowStatus: ConfigListItem[]; // 客资跟进状态
    customerFollowStatus: ConfigListItem[]; // 客户跟进状态
    orderFollowStatus: ConfigListItem[]; // 订单跟进状态
    leadsStatus: ConfigListItem[]; // 客资状态
    banquetType: ConfigListItem[]; // 婚宴类型
    carBrand: ConfigListItem[]; // 车辆品牌
    photoStyle: ConfigListItem[]; // 婚照风格
    hotelStar: ConfigListItem[]; // 酒店星级
    source:ConfigListItem[]; // 活动来源
    category2:ConfigListItem[]; // 多级渠道
    customerStatus: ConfigListItem[];
    customerRepeatStatus: ConfigListItem[]; // 合并标识
    complaintType: ConfigListItem[]; // 客诉类型
}

export interface CustomerDetail {
    customerData:    Partial<CustomerData>;
}


export interface CustomerData {
    customerId:        string;
    customerLevel:     string;
    customerLevelText: string;
    channel:           string;
    customerName:      string;
    gender:            string;
    genderText:        string;
    identity:          string;
    identityText:      string;
    weddingDate:       string;
    phone:             string;
    weChat:            string;
    liveCityInfo:      CityInfo;
    liveAddress:       string;
    workCityInfo:      CityInfo;
    workAddress:       string;
    contactTime:       string;
    referrerName:      string;
    likeCityInfo:      CityInfo;
    budget:            string;
    category:          string;
    weddingStyle:      string;
    weddingStyleText:  string;
    deskNum:           string;
    hotel:             string;
    encryptPhone:      string;
    nextContactTime:   string;
    allotTime:         string;
    createTime:        string;
    createUser:        string;
  
    referrerPhone:     string;
    customerFollowStatus: string;
    editable:          0 | 1; // 0 不可编辑  1 可编辑
    showFollowButton:  0 | 1; // 0 不可展示跟进按钮  1 可展示跟进按钮
    showFollowProductAndCoupon: 0 | 1; // 0 不可展示意向产品  1 可展示意向产品
  
    status_txt:        string;
  
    repeatStatus:            1 | 2 | 3;  //  客户重单状态 1:正常,2:客户合并,3:亲子单
    repeatAuditStatus:       0 | 1 | 2 | 3;  //  客户重单审核状态 0:正常无重单提审 1:待审核,2:驳回,3:通过
    status:              string;   // 客户状态
}


export interface receivablesInfo {
    order_num:string,
    contract_num:string,
    sign_date:string,
    contract_amount:string,
    plan_number:string,
    plan_receivables_money:number,
    already_receivables_money:number,
    no_receivables_money:number,
    number:string,
    receivables_date:string,
    money:string,
    overdue_days:string,
    status:string,
    order_amount:string,
    payment_mode:string,
    payment_user:string,
    payment_account:string,
    payment_voucher:Array,
    remark:string,
    receivables_status:string
}


/**
 * 订单信息
 */
export interface OrderData {
    id: number;
    order_num: string;
    category: number;
    category_txt: string;
    city: string;
    district: string;
    channel: string;
    merchant: string;
    status: number;
    status_txt: string;
    follow_status: number;
    follow_status_txt: string;
    create_time: string;
    update_time: string;
    req_id: number;
    customer_id: number;
    customer_name: string;
    contacts: string;
    gender: number;
    mobile: string;
    wechat: string;
    wedding_day: string;
    service_time: string;
    sign_time: string;
    budget: string;
    kefu: string;
    sale: string;
    user_id: number;
    merchant_city:string;
    merchant_district:string;
  }


  // 财务结算
export interface SummaryData {
    contract_num:string,
    sign_date:string,
    sign_user:string,
    sign_structure:string,
    receipt_num:string,
    contractRatioInfo:SummaryDataItem[],
}


// 合同信息

export interface ContractData {

}