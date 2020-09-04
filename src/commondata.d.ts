export interface ConfigCommon {
  channel: ConfigItemCommon[]; //渠道
  bjcreatechannel: ConfigItemCommon[];
  customerLevel: ConfigItemCommon[]; //客户级别
  identity: ConfigItemCommon[]; //客户身份
  gender: ConfigItemCommon[]; //性别
  weddingStyle: ConfigItemCommon[]; //婚礼风格
  category: ConfigItemCommon[]; //业务品类
  /** 主营品类 */
  mainCategory: ConfigItemCommon[]
  /** 其他品类（除主营品类外， 且有多级品类） */
  otherCategory: CategoryConfigItem[]
  contactTime: ConfigItemCommon[]; //方便联系时间
  contactWay: ConfigItemCommon[]; //跟进方式
  payType: ConfigItemCommon[]; //付款方式
  requirementStatus: ConfigItemCommon[]; //有效单状态
  followTag: ConfigItemCommon[]; //跟进标签
  requirementFollowTag: ConfigItemCommon[]; //需求单跟进标签
  requirementLevel: ConfigItemCommon[]; //需求单级别
  requirementPhase: ConfigItemCommon[];
  requirementCloseReason: ConfigItemCommon[];
  leadsFollowTag: ConfigItemCommon[];
  task: ConfigItemCommon[];
  activity: ConfigItemCommon[];
  weddingDateTag: ConfigItemCommon[];
  requirementFollowStatus: ConfigItemCommon[];
  timeoutStatus: ConfigItemCommon[];
  validStatus: ConfigItemCommon[];
  leadsFollowStatus: ConfigItemCommon[]; //客资跟进状态
  customerFollowStatus: ConfigItemCommon[]; //客户跟进状态
  orderFollowStatus: ConfigItemCommon[]; //订单跟进状态
  orderPhase: ConfigItemCommon[]; // 订单销售状态
  orderType: ConfigItemCommon[]; // 订单类型
  leadsStatus: ConfigItemCommon[]; //客资状态
  banquetType: ConfigItemCommon[]; //婚宴类型
  carBrand: ConfigItemCommon[]; //车辆品牌
  photoStyle: ConfigItemCommon[]; //婚照风格
  hotelStar: ConfigItemCommon[]; //酒店星级
  source: ConfigItemCommon[]; //活动来源
  category2: ConfigItemCommon[]; //多级渠道
  customerStatus: ConfigItemCommon[];
  customerRepeatStatus: ConfigItemCommon[]; // 合并标识
  complaintType: ConfigItemCommon[]; // 客诉类型
  requirementReturnReason: ConfigItemCommon[]; //退回原因
  dressModel: ConfigItemCommon[];
  dressType: ConfigItemCommon[];
  siteType: ConfigItemCommon[];
  scheduleType: ConfigItemCommon[];
  dressUseWay: ConfigItemCommon[];
  coupon: ConfigItemCommon[];
  /** 订单状态 - [{id: 300, name: "销售未接待"}, {id: 305, name: "销售已接待"}, {id: 310, name: "销售待定"}, {id: 320, name: "销售无效"},…] */
  orderStatus: ConfigItemCommon[];
  /** 肖像授权 - [{id: 0, name: "未签"}, {id: 1, name: "已签"}] */
  avatarGrant: ConfigItemCommon[];
  /** [{id: 410, name: "首次进店"}, {id: 420, name: "无效进店"}, {id: 430, name: "再次进店"}] */
  orderArrivalStatus: ConfigItemCommon[];
}

export interface ConfigItemCommon {
  id: string;
  name: string;
  value: string;
  label: string;
  pid: string;
  children: ConfigItemCommon[];
}

export interface Permission {
  allcustomer: boolean;
  amindcheckinorout: boolean;
  callcenteradapter_getrecordlist: boolean;
  updatereqlevel: boolean;
  closeotherreq: boolean;
  customeradapter_updatecustomer: boolean;
  editotherreq: boolean;
  leadsadapter_leaderassign: boolean;
  leadsadapter_leadslist: boolean;
  leadsadapter_transfer: boolean;
  listenrecorder: boolean;
  openotherreq: boolean;
  orderadapter_orderlist: boolean;
  recommendreq: boolean;
  recommendotherreq: boolean;
  requirementadapter_closereq: boolean;
  requirementadapter_dispatchreq: boolean;
  requirementadapter_openreq: boolean;
  requirementadapter_reqlist: boolean;
  showcustomermergetab: boolean;
  updatecustomer: boolean;
  updatecustomerlevel: boolean;
  viewotherreq: boolean;
  workspaceadapter_getbosssea: boolean;
  callcenteradapter_getrecordlist: boolean;
  requirementadapter_updatereq: boolean;
  viewotherreq: boolean;
  recommendotherreq: boolean;
  listenrecorder: boolean;
  complaintadapter_btn: boolean;  // 查看客诉单的权限
  requirementadapter_reqreturntopublicsea: boolean; // 有效单退回公海的权限
  requirementadapter_reqreturntodeadsea: boolean; // 有效单退回死海的权限
  leadsadapter_hignseabtn: boolean; // 线索退回公海的权限
  requirementadapter_distribute: boolean; // 有效单分配的权限
  /** 有效单列表-信息变更的权限 */
  reqinformationchange: boolean; // 有效单列表-信息变更的权限
  /** 分配有效单的权限 */
  piliangfenpeiyxd: boolean;
  requirementadapter_createreq: boolean, //详情添加意向需求的权限
  requirementadapter_createcooperationmessag: boolean, //联系协作人、归属人
  editegiscontract: boolean, //修改合同
  /** 更改订单的销售状态 */
  bjchangeorderphase: boolean,
  /** 更改订单的销售负责人 */
  bjchangeorderowner: boolean,
  /** 修改客户详情中的手机号 */
  bjchangephone: boolean,
  /** 修改客户详情中的“客户身份”和“性别” */
  updatecustomeridentity: boolean,
  bjchangechannel: boolean, // 修改客户详情中的渠道来源
  bjchangeallottime: boolean, // 修改客户详情中的入库时间
  bjchangerecorduser: boolean, // 修改客户详情中的提供人
  showteam: boolean, // 是否显示团队成员
  /** 是否有权限显示客户详情中的手机明文 */
  plaintextcellphonenumber: boolean, // 是否显示客户详情中的手机明文
  thirdnotebutton: boolean, //是否显示商家备注和三方录音
  /** 需求人列表分配权限 */
  transfercustomerleads: boolean,
  /** 邀约列表分配权限码 */
  transfercustomerreq: boolean,
  showpushordertab: boolean, //邀约详情推荐订单权限
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}
