
const ENVIRONMENT = 'dev';
// const ENVIRONMENT = 'release';

const NOTICE_ENVIRONMENT = 'dev';
// const NOTICE_ENVIRONMENT = 'release';

export { ENVIRONMENT };

const BASE_DOMAIN = ENVIRONMENT == 'dev' ? '/api/' : 'http://gcrmapi.hunli.baihe.com/';
// const BASE_DOMAIN = 'http://verifydataapi.hunli.baihe.com/';

// 消息服务
const NOTICE_URL = NOTICE_ENVIRONMENT == 'dev' ? '211.159.163.220:2120' : '140.143.179.166:2120';

// const SERVER_VERSION_DEV = '1.0.0'; // 上海CRM（到喜啦）  到喜啦： 19800000000     13533262340，111111 
// const SERVER_VERSION_DEV = '2.0.0'; // 移动CRM
const SERVER_VERSION_DEV = '3.0.0'; // 北京CRM（喜铺及子公司）、武汉喜庄和 李亚蒙:18601082812  喜铺：13999999999  // 武汉 13691250165  武汉预发布： 13533262341 

const URL = {

  SERVER_VERSION: SERVER_VERSION_DEV,

  // 消息服务
  notice: `${NOTICE_URL}`,
  noticGetList: `${BASE_DOMAIN}owner/notice/getList`, // 消息列表
  noticEditReadNotice: `${BASE_DOMAIN}owner/notice/editReadNotice`, // 消息设置已读


  // 统一定义接口，有利于维护，请按分类排好写
  commonConfig: `${BASE_DOMAIN}owner/common/config`, // 公共-配置项
  customerConfig: `${BASE_DOMAIN}owner/common/config`, // 公共-配置项
  sendVerifyCode: `${BASE_DOMAIN}outer/setting/sendVerifyCode`, // 获取手机验证码
  login: `${BASE_DOMAIN}outer/setting/login`, // 登录
  logout: `${BASE_DOMAIN}outer/setting/logout`, // 退出登录
  uploadFile: `${BASE_DOMAIN}owner/common/upload`, // 上传文件
  updatePassword: `${BASE_DOMAIN}owner/setting/updatePassword`,// 重置密码
  getUserPermissionList: `${BASE_DOMAIN}/owner/common/getUserPermissionList`, // 获取用户 是否拥有指定权限
  companyCategory: `${BASE_DOMAIN}owner/common/companyCategory`,// 根据公司获取品类列表

  // 工作台
  getBossSea: `${BASE_DOMAIN}owner/workspace/getBossSea`, // 海域列表
  setBossSea: `${BASE_DOMAIN}owner/workspace/setBossSea`, // 切换公司海域
  getWorkList: `${BASE_DOMAIN}owner/workspace/getWorkList`, // 自定义工作台列表
  setWorkList: `${BASE_DOMAIN}owner/workspace/setWorkList`, // 设置自定义工作台列表
  workbenchNums: `${BASE_DOMAIN}owner/workspace/workbenchNums`, // 专员数据
  mykpi: `${BASE_DOMAIN}owner/workspace/mykpi`, // 我的业绩
  saleshelper: `${BASE_DOMAIN}owner/workspace/saleshelper`, // 销售助手
  salesAchievement: `${BASE_DOMAIN}owner/workspace/salesAchievement`,  // 销售业绩
  forecastAchievement: `${BASE_DOMAIN}owner/workspace/forecastAchievement`, // 预测业绩
  talkingTop: `${BASE_DOMAIN}owner/workspace/talkingTop`, // 荣誉榜
  reqranking: `${BASE_DOMAIN}owner/workspace/reqranking`, // 建单排行榜
  orderranking: `${BASE_DOMAIN}owner/workspace/orderranking`, // 订单排行榜
  salesfunnel: `${BASE_DOMAIN}owner/workspace/salesfunnel`, // 销售漏斗
  // 审批中心
  callOutAnalyze: `${BASE_DOMAIN}owner/workspace/callOutAnalyze`, // 呼叫分析

  // 用户相关
  checkInOrOut: `${BASE_DOMAIN}owner/user/checkInOrOut`, // 签入签出（上线离线）
  doLoginOut: `${BASE_DOMAIN}owner/user/doLoginOut`, // 登入登出（北京的登录状态）
  getRoleInfo: `${BASE_DOMAIN}owner/role/getRoleInfo`, // 获取用户角色详情
  getuserinfobyid: `${BASE_DOMAIN}owner/setting/getuserinfobyid`, // 获取个人资料
  queryUsersList: `${BASE_DOMAIN}owner/user/getUserlist`, // 用户管理-查询用户列表
  addUser: `${BASE_DOMAIN}owner/user/addUser`, // 用户管理-添加用户
  editUser: `${BASE_DOMAIN}owner/user/editUser`, // 用户管理-编辑用户
  searchUser: `${BASE_DOMAIN}owner/user/searchUser`,  // 用户管理-搜索用户
  getGroupUserList: `${BASE_DOMAIN}owner/user/getGroupUserList`,  // 获取角色列表
  getOperateConfig: `${BASE_DOMAIN}/owner/common/element`, // 客户详情页操作栏

  getListStructure: `${BASE_DOMAIN}owner/structure/listStructure`,  // 获取公司、部门树形结构列表
  getListPosition: `${BASE_DOMAIN}owner/position/listPosition`,   // 获取职位列表

  externalFlowCustomer: `${BASE_DOMAIN}owner/customer/externalFlowCustomer`,   // 分配-外部流转
  internalFlowCustomer: `${BASE_DOMAIN}owner/customer/internalFlowCustomer`,   // 分配-内部流转
  getRulesUserInfo: `${BASE_DOMAIN}owner/xpRules/getRulesUserInfo`,   // 获取规则用户信息, 集团提供人客户列表
  customerImportantInfo: `${BASE_DOMAIN}owner/customer/customerImportantInfo`,   // 客户重要信息


  getCompanyList: `${BASE_DOMAIN}owner/company/listCompany`,  // 获取公司列表
  addCompany: `${BASE_DOMAIN}owner/company/addCompany`,  // 添加公司
  deleteCompany: `${BASE_DOMAIN}owner/company/deleteCompany`,  // 删除公司
  eidtCompany: `${BASE_DOMAIN}owner/company/editCompany`,  // 编辑公司
  getStructureList: `${BASE_DOMAIN}owner/user/getStructureList`, // 获取部门列表
  getRoleList: `${BASE_DOMAIN}owner/role/listRole`,  // 获取角色列表
  addRole: `${BASE_DOMAIN}owner/role/addRole`,  // 新增角色
  editRole: `${BASE_DOMAIN}owner/role/editRole`,  // 编辑角色
  deleteRole: `${BASE_DOMAIN}owner/role/deleteRole`, // 删除角色
  getPermissionsList: `${BASE_DOMAIN}owner/menu/listMenu`,  // 获取权限列表
  leftMenu: `${BASE_DOMAIN}owner/menu/leftMenu`,  // 获取首页菜单
  getRoleTree: `${BASE_DOMAIN}owner/role/roleTree`,  // 获取角色的权限树

  addMenu: `${BASE_DOMAIN}owner/menu/addMenu`,  // 新建菜单
  editMenu: `${BASE_DOMAIN}owner/menu/editMenu`,  // 编辑菜单
  deleteMenu: `${BASE_DOMAIN}owner/menu/deleteMenu`,  // 删除菜单

  listAct: `${BASE_DOMAIN}owner/menu/listAct`,  // 请求二级action
  planList: `${BASE_DOMAIN}owner/menu/planList`,  // 请求二级action


  // 用户组
  getGroupList: `${BASE_DOMAIN}owner/usergroup/grouplist`,  // 获取用户组列表
  searchGroup: `${BASE_DOMAIN}owner/usergroup/searchGroup`,  // 搜索组
  addStructure: `${BASE_DOMAIN}owner/structure/addStructure`,  // 添加公司
  deleteStructure: `${BASE_DOMAIN}owner/structure/deleteStructure`,  // 删除公司
  eidtStructure: `${BASE_DOMAIN}owner/structure/editStructure`,  // 编辑公司

  listPosition: `${BASE_DOMAIN}owner/position/listPosition`,  // 获取职位列表
  addPosition: `${BASE_DOMAIN}owner/position/addPosition`,  // 添加职位
  deletePosition: `${BASE_DOMAIN}owner/position/deletePosition`,  // 删除职位
  eidtPosition: `${BASE_DOMAIN}owner/position/editPosition`,  // 编辑职位


  // 线索相关
  allLeadsList: `${BASE_DOMAIN}owner/leads/allLeadsList`, // 线索公海
  createLeads: `${BASE_DOMAIN}owner/leads/create`, // 创建线索
  leadsHeader: `${BASE_DOMAIN}owner/leads/leadsHeader`, // 线索-状态配置信息
  importExcel: `${BASE_DOMAIN}owner/leads/importExcel`, // 导入线索
  leadsList: `${BASE_DOMAIN}owner/leads/leadsList`, // 线索列表
  leadsClaim: `${BASE_DOMAIN}owner/leads/claim`, // 线索认领
  leadsCustomerInfo: `${BASE_DOMAIN}owner/leads/customerInfo`, // 获取客户信息
  importLog: `${BASE_DOMAIN}owner/leads/importLog`, // 导入记录
  templateDownload: `${BASE_DOMAIN}excel_template/线索导入表.xlsx`, // 线索模板下载
  reqDownload: `${BASE_DOMAIN}/excel_template/需求单导入表.xlsx`, // 有效单模板下载
  downloadUrl: `${BASE_DOMAIN}owner/leads/template`,  //下载Url
  leadsInformationChange: `${BASE_DOMAIN}owner/leads/leadsInformationChange`,  //信息变更
  customerLeads: `${BASE_DOMAIN}owner/leads/customerLeads`,  //客户线索
  leadsWuXiao: `${BASE_DOMAIN}owner/leads/wuXiao`,  //客户线索无效
  leadsYouXiao: `${BASE_DOMAIN}owner/leads/youXiao`,  //客户线索有效
  leadsDaiding: `${BASE_DOMAIN}owner/leads/daiding`,  //客户线索有效
  updateLeads: `${BASE_DOMAIN}owner/leads/updateLeads`,  //客户线索更新
  insertLeads: `${BASE_DOMAIN}owner/leads/insertLeads`,  //创建客户子线索


  leadsUpdateCustomer: `${BASE_DOMAIN}owner/leads/updateCustomer`, // 线索-更新用户信息
  leadsCustomerData: `${BASE_DOMAIN}owner/leads/customerData`, // 线索-用户信息
  transfereLeads: `${BASE_DOMAIN}owner/leads/transfer`, // 转让线索
  leadsDistribute: `${BASE_DOMAIN}owner/leads/distribute`, // 线索-分配线索
  moorDialout: `${BASE_DOMAIN}owner/callcenter/allDiaout`, // 外呼接口
  moorHangup: `${BASE_DOMAIN}owner/callcenter/allHangup`, // 挂机接口
  followList: `${BASE_DOMAIN}owner/common/followList`, // 跟进列表
  sendsms: `${BASE_DOMAIN}owner/common/sendsms`, // 发送短信
  getRecordList: `${BASE_DOMAIN}owner/callcenter/getRecordList`, // 通话记录接口
  getWechatTarget: `${BASE_DOMAIN}owner/ac/getWechatTarget`, // 奥创微信
  isFriend: `${BASE_DOMAIN}owner/ac/isFriend`, // 微信是否已经是好友
  transfer: `${BASE_DOMAIN}owner/leads/transfer`, // 转移给同事
  giveback: `${BASE_DOMAIN}owner/leads/giveback`, // 退回公海
  nextLeadsId: `${BASE_DOMAIN}owner/leads/nextLeadsId`, // 获取下一个线索
  addFriend: `${BASE_DOMAIN}owner/ac/addFriend`, // 根据用户微信号加好友
  getLeadsDetail: `${BASE_DOMAIN}owner/leads/getLeadsDetail`, // 获取线索详情
  distributeUserList: `${BASE_DOMAIN}owner/user/distributeUserList`,// 线索派发和添加协呈人员列表
  merchantnotes: `${BASE_DOMAIN}owner/callcenter/merchantnotes`,// 商家备注
  thirdrecards: `${BASE_DOMAIN}owner/callcenter/thirdrecards`,// 三方录音

  /** ************************************************ */



  // 订单相关
  createOrder: `${BASE_DOMAIN}owner/order/createOrder`,// 新建订单
  getOrderDetails: `${BASE_DOMAIN}owner/order/orderDetail`, // 订单详情
  getCustomerByName: `${BASE_DOMAIN}owner/customer/getCustomerByName`,// 通过客户名查询客户
  createContactUser: `${BASE_DOMAIN}owner/customer/createContactUser`, // 创建联系人
  updateContactUser: `${BASE_DOMAIN}owner/customer/updateContactUser`, // 更新联系人
  createFollow: `${BASE_DOMAIN}owner/common/createFollow`, // 创建跟进记录
  updateOrder: `${BASE_DOMAIN}owner/order/updateOrder`, // 更新订单
  editReceivablesRecord: `${BASE_DOMAIN}owner/receivables/editReceivablesRecord`, // 修改回款记录
  addReceivablesRecord: `${BASE_DOMAIN}owner/receivables/addReceivablesRecord`, // 增加回款记录
  deleteReceivablesRecord: `${BASE_DOMAIN}owner/receivables/deleteReceivablesRecord`, // 删除回款记
  adjustReceivablesPlan: `${BASE_DOMAIN}owner/receivables/adjustReceivablesPlan`, //  调整回款计划
  getCustomerInfo: `${BASE_DOMAIN}owner/customer/getCustomerInfo`, //  通过手机号查询客户
  bindProduct: `${BASE_DOMAIN}owner/order/bindProduct`,// 绑定产品
  unBindProduct: `${BASE_DOMAIN}owner/order/unBindProduct`,// 解绑产品
  confirmArrival: `${BASE_DOMAIN}owner/order/confirmArrival`,// 提交确认到店
  /** ************************************************ */

  // 有效单相关
  reqSea: `${BASE_DOMAIN}owner/requirement/reqSea`, // 有效单海
  reqPublicSea: `${BASE_DOMAIN}owner/requirement/reqPublicSea`, // 有效单公海列表
  reqDeadSea: `${BASE_DOMAIN}owner/requirement/reqDeadSea`, // 有效单死海列表
  reqDistribute: `${BASE_DOMAIN}owner/requirement/reqDistribute`, // 有效单分配列表
  distribute: `${BASE_DOMAIN}owner/requirement/distribute`, // 分配有效单-动作
  claim: `${BASE_DOMAIN}owner/requirement/claim`, // 认领有效单-动作
  reqList: `${BASE_DOMAIN}owner/requirement/reqList`, // 有效单列表
  createReq: `${BASE_DOMAIN}owner/requirement/createReq`, // 创建有效单
  updateReq: `${BASE_DOMAIN}owner/requirement/updateReq`, // 更新有效单
  updateReqLite: `${BASE_DOMAIN}owner/requirement/updateReqLite`, // 轻量级更新有效单
  reserveReq: `${BASE_DOMAIN}owner/requirement/reserveReq`, // 预约进店
  orderList: `${BASE_DOMAIN}owner/order/orderList`, // 订单列表
  claimOrder: `${BASE_DOMAIN}owner/order/claimOrder`, // 认领订单
  requirementDistribute: `${BASE_DOMAIN}owner/requirement/distribute`,  // 有效单分配
  createReqTeam: `${BASE_DOMAIN}owner/requirement/createReqTeam`, // 创建有效单团队
  updateReqTeam: `${BASE_DOMAIN}owner/requirement/updateReqTeam`, // 更新有效单团队
  deleteReqTeam: `${BASE_DOMAIN}owner/requirement/delReqTeam`, // 删除有效单团队
  closeReq: `${BASE_DOMAIN}owner/requirement/closeReq`, // 关闭有效单
  openReq: `${BASE_DOMAIN}owner/requirement/openReq`, // 开启有效单
  reqDetail: `${BASE_DOMAIN}owner/requirement/reqDetail`, // 有效单详情
  reqImport: `${BASE_DOMAIN}owner/requirement/importExcel`, // /导入有效单
  createAssociates: `${BASE_DOMAIN}owner/requirement/createAssociates`,  // 添加协作人
  backToPubSea: `${BASE_DOMAIN}owner/requirement/reqReturnToPublicSea`,  //退回公海
  backToDeadSea: `${BASE_DOMAIN}owner/requirement/reqReturnToDeadSea`,  //退回死海
  collaborateMsg: `${BASE_DOMAIN}owner/requirement/createCooperationMessage`,  //联系写作人|归属人
  reqImportList: `${BASE_DOMAIN}owner/requirement/reqImportList`, //导入需求单列表
  turnTrue: `${BASE_DOMAIN}owner/requirement/turnTrue`, //指定邀约
  validReq: `${BASE_DOMAIN}owner/requirement/validReq`, //有效单有效
  allReqList: `${BASE_DOMAIN}owner/requirement/allReqList`, // 全部有效单列表
  qtReqList: `${BASE_DOMAIN}owner/requirement/qtReqList`, // 质检有效单列表
  sendReqReport: `${BASE_DOMAIN}owner/requirement/sendReqReport`,// 到喜啦发送有效单测试报告


  // 客户相关
  createCustomer: `${BASE_DOMAIN}owner/customer/createCustomer`, // 创建客户
  customerList: `${BASE_DOMAIN}owner/customer/customerlist`, // 客户列表
  customerFields: `${BASE_DOMAIN}owner/customer/customerFields`, // 客户列表字段
  transferCustomer: `${BASE_DOMAIN}owner/requirement/transfer`, // 转让有效单
  customerDetail: `${BASE_DOMAIN}owner/customer/customerDetail`, // 客户详情
  contactUserListCustomer: `${BASE_DOMAIN}owner/customer/contactUserList`, // 联系人列表
  updateCustomer: `${BASE_DOMAIN}owner/customer/updateCustomer`, // 更新客户资料
  showPhone: `${BASE_DOMAIN}owner/customer/showCustomerPhone`,  // 查看手机号
  search: `${BASE_DOMAIN}owner/customer/search`, // 根据关键字分页搜索客户列表
  repeatSubmit: `${BASE_DOMAIN}owner/customer/repeatSubmit`,  // 拉重单
  customerChildren: `${BASE_DOMAIN}owner/customer/customerChildren`,  // 亲子单
  messageConfig: `${BASE_DOMAIN}owner/xprules/getChannelList`,  // 信息变更-渠道列表
  batchUpdateCustomer: `${BASE_DOMAIN}owner/customer/batchUpdateCustomer`,  // 信息变更-批量更新客户
  groupRecordCustomerList: `${BASE_DOMAIN}owner/customer/groupRecordCustomerList`,  // 集团提供人客户列表
  transferCustomerLeads: `${BASE_DOMAIN}owner/customer/transferCustomerLeads`,  // 需求分配
  transferCustomerReq: `${BASE_DOMAIN}owner/customer/transferCustomerReq`,  // 邀约分配


  // 客诉相关
  customerComplaintList: `${BASE_DOMAIN}owner/complaint/list`, // 客诉单列表
  customerComplaintDetail: `${BASE_DOMAIN}owner/complaint/detail`, // 客诉单详情
  submitComplaint: `${BASE_DOMAIN}owner/complaint/insert`, // 提交客诉单
  handleCustomerComplaint: `${BASE_DOMAIN}owner/complaint/handle`, // 处理客诉单
  customerComplaintFollowList: `${BASE_DOMAIN}owner/complaint/followList`, // 客诉单跟进情况



  // 商家相关
  recommendMerchantCustomer: `${BASE_DOMAIN}owner/customer/recommendMerchant`, // 推荐商家
  storeHotelConfig: `${BASE_DOMAIN}outer/merchant/hotelConfig`, // 婚宴酒店配置项
  storeHotelList: `${BASE_DOMAIN}owner/merchant/hotelList`, // 婚宴酒店列表(disuse)
  storeHotelDetail: `${BASE_DOMAIN}owner/merchant/hotelDetail`, // 婚宴酒店详情
  storeWeddingConfig: `${BASE_DOMAIN}outer/merchant/weddingConfig`, // 婚纱摄影，旅拍配置项
  storeWeddingList: `${BASE_DOMAIN}owner/merchant/weddingList`, // 婚纱摄影，旅拍列表(disuse)
  storeWeddingDetail: `${BASE_DOMAIN}owner/merchant/weddingDetail`, // 婚纱摄影，旅拍详情
  storeHunqingList: `${BASE_DOMAIN}owner/merchant/hunqingList`, // 婚庆服务列表(disuse)
  storeHunqingDetail: `${BASE_DOMAIN}owner/merchant/hunqingDetail`, // 婚庆服务详情
  storeList: `${BASE_DOMAIN}owner/merchant/storeList`, // 其他品类商家列表(Fix.所有品类商家列表统一为这一个)
  storeClothingList: `${BASE_DOMAIN}owner/merchant/clothingList`, // 礼服列表(disuse)
  storeClothingDetail: `${BASE_DOMAIN}owner/merchant/clothingDetail`, // 礼服详情
  storeHoneymoonList: `${BASE_DOMAIN}owner/merchant/honeymoonList`, // 蜜月列表(disuse)
  storeHoneymoonDetail: `${BASE_DOMAIN}owner/merchant/honeymoonDetail`, // 蜜月详情
  merchantRecommend: `${BASE_DOMAIN}owner/merchant/recommend`,// 推荐商家
  newCategory: `${BASE_DOMAIN}owner/merchant/storeList`, // 庆典or喜宴  婚车  一站式
  newCategoryDetail: `${BASE_DOMAIN}owner/merchant/storeDetail`,  // 庆典or喜宴  婚车  一站式 详情
  storeContact: `${BASE_DOMAIN}owner/merchant/storeContact`,  // 商家联系人
  storeCoupon: `${BASE_DOMAIN}owner/merchant/storeCoupon`,  // 商家活动
  storeGoods: `${BASE_DOMAIN}owner/merchant/storeGoods`,  // 商家活动
  moorPhoneDialout: `${BASE_DOMAIN}owner/callcenter/moorPhoneDialout`,  // 商家联系人
  nearbyMerchant: `${BASE_DOMAIN}owner/merchant/nearbyMerchant`,  // 商家酒店地图
  researchName: `${BASE_DOMAIN}owner/merchant/researchName`,  // 商家酒店酒店查询
  researchBuild: `${BASE_DOMAIN}owner/merchant/researchBuild`,  // 商家酒店筛选

  // 分组管理
  groupMangementList: `${BASE_DOMAIN}owner/usergroup/grouplist`,   // 分组列表
  groupMember: `${BASE_DOMAIN}owner/user/searchUser`, // 搜索用户
  addGroup: `${BASE_DOMAIN}owner/usergroup/addGroup`,  // 添加分组
  changeStatus: `${BASE_DOMAIN}owner/usergroup/changeStatus`,  // 冻结分组
  groupDetail: `${BASE_DOMAIN}owner/usergroup/getGroupDetail`,  // 分组详情
  groupUpdate: `${BASE_DOMAIN}owner/usergroup/editGroup`,  // 分组编辑

  deleteGroup: `${BASE_DOMAIN}owner/usergroup/deleteGroup`,  // 删除分组


  // 任务管理
  taskgetConfig: `${BASE_DOMAIN}owner/task/getConfig`, // 任务配置
  taskList: `${BASE_DOMAIN}owner/task/taskList`,// 任务列表
  createTask: `${BASE_DOMAIN}owner/task/createTask`,// 创建任务
  updateTask: `${BASE_DOMAIN}owner/task/updateTask`,// 更新任务
  taskDetail: `${BASE_DOMAIN}owner/task/getTaskDetail`,// 任务详情
  distributeUser: `${BASE_DOMAIN}owner/task/distributeUser`,// 分配
  deleteTask: `${BASE_DOMAIN}owner/task/deleteTask`,// 删除任务
  deleteCondition: `${BASE_DOMAIN}owner/task/deleteCondition`,// 删除任务条件
  recoveryDataTask: `${BASE_DOMAIN}owner/task/recoveryData`,// 重新回收任务
  changeStatuTask: `${BASE_DOMAIN}owner/task/changeStatu`,// 暂停/开启任务

  // 合同相关
  getContractConfig: `${BASE_DOMAIN}owner/contract/getconfig`,// 合同相关配置项
  contractList: `${BASE_DOMAIN}owner/contract/contractList`,// 合同列表
  createContract: `${BASE_DOMAIN}owner/contract/createContract`,// 创建合同
  updateContract: `${BASE_DOMAIN}owner/contract/updateContract`,// 修改合同
  contractDetail: `${BASE_DOMAIN}owner/contract/contractDetail`,// 合同详情
  contractSearchProduct: `${BASE_DOMAIN}/owner/product/contractSearchProduct`,// 合同搜索产品
  submitAudit: `${BASE_DOMAIN}owner/contract/submitAudit`,// 合同提交审批
  updateAgreement: `${BASE_DOMAIN}owner/contract/updateAgreement`,// 补充协议
  updateRatio: `${BASE_DOMAIN}owner/contract/updateRatio`,// 录占比




  // 跟进相关
  getFollowNextContactTime: `${BASE_DOMAIN}owner/common/getFollowNextContactTime`,// 跟进下次回访时间

  // 审核
  auditConfigList: `${BASE_DOMAIN}owner/audit/auditConfigList`, // 审核配置列表
  addAuditConfig: `${BASE_DOMAIN}owner/audit/addAuditConfig`, // 创建审核配置
  auditconfiginfo: `${BASE_DOMAIN}owner/audit/auditconfiginfo`, // 审核配置详情
  editAuditConfig: `${BASE_DOMAIN}owner/audit/editAuditConfig`, // 更新审核配置
  deleteAuditConfig: `${BASE_DOMAIN}owner/audit/deleteAuditConfig`, // 删除审核配置
  auditList: `${BASE_DOMAIN}owner/audit/auditList`, // 审核列表
  doAudit: `${BASE_DOMAIN}owner/audit/doAudit`, // 审核
  auditInfo: `${BASE_DOMAIN}owner/audit/auditInfo`, // 审核详情

  // 目标管理
  addStructureSelltarget: `${BASE_DOMAIN}owner/selltarget/addStructureSelltarget`, // 添加部门销售目标
  editStructureSelltarget: `${BASE_DOMAIN}owner/selltarget/editStructureSelltarget`, // 编辑部门销售目标
  delStructureSelltarget: `${BASE_DOMAIN}owner/selltarget/delStructureSelltarget`, // 删除部门目标
  getStructureSelltargetList: `${BASE_DOMAIN}owner/selltarget/getStructureSelltargetList`, // 部门目标列表
  getStructureSelltargetInfo: `${BASE_DOMAIN}owner/selltarget/getStructureSelltargetInfo`, // 部门目标详情

  addUserSelltarget: `${BASE_DOMAIN}owner/selltarget/addUserSelltarget`, // 添加员工销售目标
  editUserSelltarget: `${BASE_DOMAIN}owner/selltarget/editUserSelltarget`, // 编辑员工销售目标
  delUserSelltarget: `${BASE_DOMAIN}owner/selltarget/delUserSelltarget`, // 删除员工目标
  getUserSelltargetList: `${BASE_DOMAIN}owner/selltarget/getUserSelltargetList`, // 员工目标列表
  getUserSelltargetInfo: `${BASE_DOMAIN}owner/selltarget/getUserSelltargetInfo`, // 员工目标详情

  // 产品
  getProductList: `${BASE_DOMAIN}owner/product/getProductList`, // 产品列表
  addProduct: `${BASE_DOMAIN}owner/product/addProduct`, // 添加产品
  addSeller: `${BASE_DOMAIN}owner/merchant/createStore`, // 添加商家
  storeDetail: `${BASE_DOMAIN}owner/merchant/storeDetail`, // 商家详情
  editSeller: `${BASE_DOMAIN}owner/merchant/updateStore`, // 添加商家

  delProduct: `${BASE_DOMAIN}owner/product/delProduct`, // 删除产品
  productDetail: `${BASE_DOMAIN}owner/product/getProductInfo`,  // 产品详情
  editProduct: `${BASE_DOMAIN}owner/product/editProduct`,  // 编辑产品

  // 回款
  moneyMangementList: `${BASE_DOMAIN}owner/receivables/receivablesList`, // 回款列表
  moneyonfig: `${BASE_DOMAIN}owner/receivables/getBaseInfo`,  // 回款配置
  moneyDetail: `${BASE_DOMAIN}owner/receivables/getReceivablesInfo`,  // 回款记录详情
  saveStoreSettlement: `${BASE_DOMAIN}owner/receivables/saveStoreSettlement`,  // 保存商家结算
  getStoreSettlement: `${BASE_DOMAIN}owner/receivables/getStoreSettlement`,  // 回去商家结算


  // 结算
  settlementMangementList: `${BASE_DOMAIN}owner/receivables/settlementList`, // 结算列表
  settlementDetail: `${BASE_DOMAIN}owner/receivables/settlementDetail`,  // 结算详情

  getPlanInfo: `${BASE_DOMAIN}owner/receivables/getPlanInfo`, // 获取合同回款计划信息
  getNumberList: `${BASE_DOMAIN}owner/receivables/getNumberList`, // 获取回款计划期次列表
  //活动
  activitylist: `${BASE_DOMAIN}owner/activity/activitylist`, // 活动列表
  addActivity: `${BASE_DOMAIN}owner/activity/addActivity`, // 添加活动
  editActivity: `${BASE_DOMAIN}owner/activity/updateActivity`, // 修改活动
  deleteActivity: `${BASE_DOMAIN}owner/activity/deleteActivity`, // 删除活动
  // 喜铺规则
  addRule: `${BASE_DOMAIN}owner/xprules/addRule`, // 添加规则
  updateRule: `${BASE_DOMAIN}owner/xprules/updateRule`, // 编辑规则
  getXPFlowInfo: `${BASE_DOMAIN}owner/xprules/getFlowInfo`, // 喜铺获取跟进规则
  distributeCompanyList: `${BASE_DOMAIN}owner/xprules/distributeCompanyList`, // 喜铺派发公司
  xpRuleList: `${BASE_DOMAIN}owner/xprules/getList`, //喜铺规则列表
  deleteXpRule: `${BASE_DOMAIN}owner/xprules/delRule`, //删除喜铺规则
  updateXpRule: `${BASE_DOMAIN}owner/xprules/editRulesStatus`, //开启关闭喜铺规则
  distributeCompany: `${BASE_DOMAIN}owner/requirement/distributeCompany`, //派发公司
  getChannelList: `${BASE_DOMAIN}owner/xprules/getChannelList`, //客资来源渠道列表
  xpRulesDetail: `${BASE_DOMAIN}owner/xprules/getRuleDetail`, //规则详情
  rulesCompanyList: `${BASE_DOMAIN}owner/xprules/rulesCompanyList`, //规则-公司列表
  getcreatUsersList: `${BASE_DOMAIN}owner/xprules/getCreateUserList`, // 查询规则创建人列表
  // 数据分配规则
  getPublicRulesList: `${BASE_DOMAIN}owner/xprules/getPublicRulesList`, //获取 公域规则列表
  getPublicRulesChannel: `${BASE_DOMAIN}owner/xprules/getPublicRulesChannel`, //获取公域规则 可用的渠道
  getChannel3Company: `${BASE_DOMAIN}owner/xprules/getChannel3Company`, //获取 喜铺 澜 尼克 3个公司的公域渠道
  addPublicRule: `${BASE_DOMAIN}owner/xprules/addPublicRule`, //添加数据分配规则
  getPublicRuleDetail: `${BASE_DOMAIN}owner/xprules/getPublicRuleDetail`, //获取 公域规则详情
  editPublicRule: `${BASE_DOMAIN}owner/xprules/editPublicRule`, //编辑数据分配规则
  delPublicRules: `${BASE_DOMAIN}owner/xprules/delPublicRules`, //删除 公域规则
  openThePausePublicRules: `${BASE_DOMAIN}owner/xprules/openThePausePublicRules`, //开启 暂停 公域规则
  getBalanceList: `${BASE_DOMAIN}owner/xprules/getBalanceList`, // 规则的分配数据明细
  // QA规则
  createRules: `${BASE_DOMAIN}owner/qa/createRules`, // 添加QA规则
  updateRules: `${BASE_DOMAIN}owner/qa/updateRules`, // 编辑QA规则
  qaRuleList: `${BASE_DOMAIN}owner/qa/rulesList`, //QA规则列表
  getQaRuleDetail: `${BASE_DOMAIN}owner/qa/rulesDetail`, //QA规则详情

  // 操作日志
  operateList: `${BASE_DOMAIN}owner/common/operateList`, // 操作日志
  createOperate: `${BASE_DOMAIN}owner/common/createOperate`, // 新增操作日志

  // 渠道
  ownerChannelGetList: `${BASE_DOMAIN}owner/channel/getList`, // 获取渠道页面数据
  addNewChannelData: `${BASE_DOMAIN}owner/channel/addChannel`, // 新增渠道数据
  editChannelData: `${BASE_DOMAIN}owner/channel/updateChannel`, // 修改渠道数据
  delChannelData: `${BASE_DOMAIN}owner/channel/delChannel`, // 删除渠道数据
  getCompanyChannelList: `${BASE_DOMAIN}owner/channel/getCompanyChannelList`, // 获取公司渠道
  searchchannel: `${BASE_DOMAIN}owner/channel/searchchannel`, // 搜索公司渠道
  getEditChannelList: `${BASE_DOMAIN}owner/channel/getEditChannelList`, // 获取全部渠道数据


  //质检
  reqQaList: `${BASE_DOMAIN}owner/qa/reqQaList`,   //质检列表
  reqQaConfig: `${BASE_DOMAIN}owner/qa/reqConfig`,  //质检配置项
  reqQaCustomerDetail: `${BASE_DOMAIN}owner/qa/reqQaCustomerDetail`,  //质检客户详情
  reqQaCreate: `${BASE_DOMAIN}owner/qa/createReqQa`,  //质检创建需求单
  reqQaPhase: `${BASE_DOMAIN}owner/qa/changeReqQaPhase`,  //质检阶段变更
  reqQaDetail: `${BASE_DOMAIN}owner/qa/reqQaDetail`,  //质检意向需求
  reqQaDistribute: `${BASE_DOMAIN}owner/qa/distribute`, //质检分配
  allRecordList: `${BASE_DOMAIN}owner/callcenter/getAllRecordList`,  //集团下的通话记录

  //话术
  knowledgeList: `${BASE_DOMAIN}owner/knowledge/getKnowledgeList`,  //话术列表
  knowledgeCategoryList: `${BASE_DOMAIN}owner/knowledge/categoryList`,  //话术分类
  knowledgeCategoryDel: `${BASE_DOMAIN}owner/knowledge/categoryDel`,  //删除话术分类
  knowledgeCategoryChange: `${BASE_DOMAIN}owner/knowledge/categoryChange`,  //新增或修改话术分类
  getSearchKnowledge: `${BASE_DOMAIN}owner/knowledge/getSearchKnowledge`,//话术检索
  setPvToAnswer: `${BASE_DOMAIN}owner/knowledge/setPvToAnswer`,//查看全文(添加pv)
  addKnowledge: `${BASE_DOMAIN}owner/knowledge/addKnowledge`,  //新增话术
  editKnowledge: `${BASE_DOMAIN}owner/knowledge/editKnowledge`,  //编辑话术
  delKnowledge: `${BASE_DOMAIN}owner/knowledge/delKnowledge`,  //删除话术


  dxlQtReq: `${BASE_DOMAIN}owner/requirement/qtReq`,  //到喜啦质检接口

  truncitylist: `${BASE_DOMAIN}owner/callcenter/truncitylist`,  //天润获取所有城市列表

  trunlist: `${BASE_DOMAIN}owner/callcenter/trunlist`,  //天润单个城市外呼接口


  getTeamInfo: `${BASE_DOMAIN}/owner/team/getTeamInfo`,//获取团队成员
  operateTeam: `${BASE_DOMAIN}/owner/team/operateTeam`,//操作团队成员

  importListToday: `${BASE_DOMAIN}owner/workspace/getImportListToday`, //今日导入列表

  getSchedulingList: `${BASE_DOMAIN}owner/scheduling/getSchedulingList`, //调休列表
  addScheduling: `${BASE_DOMAIN}owner/scheduling/addScheduling`,
  editScheduling: `${BASE_DOMAIN}owner/scheduling/editScheduling`,
  deleteScheduling: `${BASE_DOMAIN}owner/scheduling/deleteScheduling`,

  leadsInfoChange: `${BASE_DOMAIN}owner/leads/leadsStatus`,  //蜜糖线索信息变更
  reqsInfoChange: `${BASE_DOMAIN}owner/requirement/reqStatus`, //蜜糖需求单信息变更
  reqTeamRole: `${BASE_DOMAIN}owner/requirement/listbaby`,   //需求单团队角色
};
export default URL;
