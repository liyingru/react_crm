import { inflate } from "zlib";
import { any, string } from "prop-types";
import { ContractEntity } from "@/pages/CustomerManagement/customerDetail/dxl/data";
import { ConfigListItem } from "@/pages/CustomerManagement/commondata";

export interface OrderDetailsModel {

    // 通话记录
    callRecord: callInfoItem[]
    // 联系人
    contacts: contactsInfoItem[]
    // 合同信息
    contractInfo: ContractEntity[]

    // 客户信息
    customerInfo: CustomerData

    // 回款记录
    receivablesRecord: ReceivablesRecord[]

    // 基本信息
    orderInfo: rderInfoModel

    // 跟进配置
    followData: FollowDataModel

    // 跟进记录
    followList: FollowListItem[]

    // 确认到店数据
    reserve: any[]

    reserve_confirm_count: number

    product: ProductInfo[]

    commonInfo: {
        canUpdateOrderTag: boolean,  // 是否允许修改：订单标签、订单金额、肖像授权、售卖产品
    }
}

export interface ProductInfo {
    /**
     * "id": 10,
        "name": "测试产品2",
        "price_min": "112.00",
        "price_max": "322.00",
        "merchant_name ": "武汉喜庄婚纱摄影",
        "category_name": "婚宴"
     */
    id: string
    name?: string
    price_min?: string
    price_max?: string
    merchant_name?: string
    category_name?: string
}


export interface FollowDataModel {
    showFollowButton: string
    followTab: Array
}


export interface userlistInfoItem {
    rel_id: string
    user_id: string
    username: string
    group_id: string
    group_name: string
}

export interface percentUserlistInfoItem {
    id: string
    name: string
    company_name: string
    job_number: string
}

export interface CityInfo {
    province; string;
    city: string;
    district: string;
    full: string;
    city_code: string;
}

export interface CustomerData {
    customer_id: string;
    customer_level: string;
    customer_level_text: string;
    channel: string;
    customer_name: string;
    gender: string;
    gender_text: string;
    identity: string;
    identity_text: string;
    wedding_date: string;
    phone: string;
    wechat: string;
    live_city_info: CityInfo;
    live_address: string;
    work_city_info: CityInfo;
    work_address: string;
    contact_time: string;
    referrer_name: string;
    referrer_phone: string;
    record_user_name: string;
    like_city_info: CityInfo;
    budget: string;
    category: string;
    wedding_style: string;
    wedding_style_text: string;
    deskNum: string;
    hotel: string;
    encrypt_phone: string;
    nextContactTime: string;
    allotTime: string;
    create_time: string;
    create_user: string;
    hall: string;
    service_user: string;
    table_num: string;
    book_tag: string;
    level: string;
    level_text: string;
    virtual_status: string;
}


export interface ReceivablesRecord {
    id: string
    title: string
    contract_num: string
    contract_alias: string
    sign_amount: string
    sign_date: string
    plans: PlansItem[]
}

export interface PlansItem {

    plan_id: string
    title: string
    plan_receivables_date: string
    plan_receivables_money: string
    already_receivables_money: string
    overdue_no_receivables_money: string
    no_receivables_money: string
    status: string
    status_txt: string
    list: PlansItemList[]
    plan_receivables_money_txt: string
    already_receivables_money_txt: string
    overdue_no_receivables_money_txt: string
    no_receivables_money_txt: string
}


export interface PlansItemList {
    id: string
    plan_id: string
    receivables_date: string
    money: string
    money_txt: string
    payment_mode: string
    payment_mode_txt: string
    receivables_type: string
    receivables_type_txt: string
    payee: string
    payee_txt: string
    payment_voucher: string
    remark: string
    check_status: string
    check_status_txt: string
}

export interface callInfoItem {
    contact_duration: string
    contact_time: string
    contact_type: string
    is_answered_txt: string
    main_mobile: string
}

export interface FollowListItem {
    followTime: string
    callDuration: string
    followType: string
    results: string
    comment: string
    nextContactTime: string
    contactWay: string
    followUser: string
    attachment: string
    followTag: string
    arrivalTime: string
    productName: string
    state: string
    couponName: string
}

export interface contactsInfoItem {
    contactId: string
    userName: string
    identity: string
    identityText: string
    phone: string
    encryptPhone: string
    weChat: string
    occupation: string
    contactTime: string
    contactTimeText: string
    comment: string
}

export interface rderInfoModel {
    id: string
    customer_id: string
    arrival_time: string
    budget: string
    customer_name: string
    status: number
    status_txt: string
    gender: string
    hotel_tables: string
    kefu: string
    mobile: string
    sale: string
    schedule: string
    channel: string
    wechat: string
    wedding_day: string
    order_num: string
    wedding_style: string
    budget: string
    business_content: businessItem[]
    phase: number
    show_money_button: boolean
    show_order_phase_button: boolean
    leads_owner_name: string  // 需求确认人
    req_id: string
    req_owner_name: string  // 邀约人
    order_owner_name: string
    owner_id: string
    phaseItems: ConfigListItem[]; // 销售状态枚举列表
    phase_txt: string;// 客户销售状态
    arrival_status_txt: string; // 进店状态
    leads_id?: string;//线索id
    category: number;
    category_txt: string;
    merchant: string;
    amount: string; //  回款金额
    receipt: string; // 商家回执
    type: number; // 订单标签
}

export interface configData {
    orderStatus: any;
    channel: configDataItem[]
    customerLevel: configDataItem[]
    orderFollowStatus: configDataItem[]
    customerLevel: configDataItem[]
    identity: configDataItem[]
    gender: configDataItem[]
    weddingStyle: configDataItem[]
    category: configDataItem[]
    contactTime: configDataItem[]
    contactWay: configDataItem[]
    followTag: configDataItem[]
    storeServiceType: configDataItem[]
}

export interface configDataItem {
    id: string
    name: string
    value: string
    label: string
    children: configDataItem[]
}

export interface businessItem {
    key: string
    val: string
}

export interface OrderDetailsParams {
    orderId: string
}

export interface contractItem {
    id: string//合同ID
    sign_date: string//签订时间
    contract_num: string//合同号
    contract_alias: string//合同标题
    contract_amount: string//合同金额
    status: string//	合同状态
    remark: string//备注
    create_by: string//创建人
}
export interface DistributeUser {
    id: string//id
    name: string//名字
}

export interface inputPercentParams {
    id: string//客户id
    percent: string//百分比
}

// 回款记录的详情信息
export interface receivableRecordItem {
    contract_num: string
    check_status: string
    receivables_date: string
    money: string
    receivables_type: string
    id: string
    payment_mode: string
    payment_user: string
    payment_account: string
    payment_voucher: Array
    payee: string
    update_time: string
    number: string
    plan_receivables_date: string
    plan_receivables_money: string
    order_id: string
    contract_id: string
    check_status_txt: string
    receivables_number: string
    receivables_type_txt: string
    payment_mode_txt: string
    auditInfo: Array
}

export interface SettlementInfoItem {
    id: string
    service_type: string
    store_name: string
    contact_user: string
    settlement_amount: string
}

export interface SettlementInfo {
    id?: string
    serviceType?: string
    storeName?: string
    contactUser?: string
    settlementAmount?: string
}


