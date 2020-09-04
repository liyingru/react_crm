export interface MenuConfigType {
  path: string;
  name: string;
}

const menusConfig = [
  {
    path: "/dashboardWorkplace",
    name: "工作台",
  },
  {
    path: "/claimTableList",
    name: "线索公海",
  },
  {
    path: "/leads",
    name: "线索管理",
  },
  {
    path: "/leads/leadsManagement",
    name: "线索管理-线索列表",
  },
  {
    path: "/leads/dxlLeadsManagement",
    name: "线索管理-到喜啦线索列表",
  },
  {
    path: "/leads/distributeList",
    name: "线索管理-线索分配",
  },
  {
    path: "/leads/newLeads",
    name: "我的线索-新建线索",
  },
  {
    path: "/demand",
    name: "有效单管理",
  },
  {
    path: '/demand/demandCommonSea',
    name: "有效单管理-有效单公海",
  },
  {
    path: '/demand/demandCommonDeadSea',
    name: "有效单管理-有效单死海",
  },
  {
    path: "/demand/demandManagement",
    name: "有效单管理-有效单列表",
  },
  {
    name: '有效单管理-有效单详情',
    path: '/demand/demandManagement/demandDetails',
  },
  {
    path: "/demand/demandsQaList",
    name: "有效单管理-有效单质检",
  },
  {
    path: "/demand/demandListAll",
    name: "有效单管理-全部有效单",
  },
  {
    path: "/customer",
    name: "客户管理",
  },
  {
    path: "/customer/customerManagement",
    name: "客户管理-客户列表",
  },
  {
    path: "/passengerImport",
    name: "客资导入",
  },
  {
    path: "/order",
    name: "订单管理",
  },
  {
    path: "/order/orderManagement",
    name: "订单管理-订单列表",
  },

  {
    path: "/order/newOrder",
    name: "订单管理-新建订单",
  },
  {
    path: "/saleManagement",
    name: "销售管理",
  },
  {
    path: "/saleManagement/hq/saleList",
    name: "销售管理-婚庆销售列表",
  },
  {
    path: "/saleManagement/hy/saleList",
    name: "销售管理-婚宴销售列表",
  },
  {
    path: "/saleManagement/other/saleList",
    name: "销售管理-其他品类销售列表",
  },
  // {
  //   path: "/saleManagement/qd/saleList",
  //   name: "销售管理-庆典销售列表",
  // },
  {
    path: "/customerComplaintManagement",
    name: "客诉管理",
  },
  {
    path: "/store/storeDetails",
    name: "商家管理",
  },
  {
    path: "/group",
    name: "分组管理",
  },

  {
    path: "/group/grouphome",
    name: "分组管理-分组列表"
  },
  {
    path: "/group/groupnew",
    name: "分组管理-新建分组"
  },
  {
    path: "/sunnyrules",
    name: "客资来源管理"
  },
  {
    path: '/sunnyrules/distributeruleslist',
    name: "客资来源管理-数据分配规则列表"
  },
  {
    path: '/sunnyrules/qaruleslist',
    name: "客资来源管理-QA规则列表"
  },
  {
    path: '/sunnyrules/sunnyruleslist',
    name: "客资来源管理-规则列表"
  },
  {
    path: '/sunnyrules/newrules',
    name: "客资来源管理-新建规则"
  },
  {
    path: "/task",
    name: "任务管理"
  },
  {
    path: "/task/tasklist",
    name: "任务管理-任务列表"
  },
  {
    path: "/task/newtask",
    name: "任务管理-新建任务"
  },
  {
    path: "/review/reviewlist",
    name: "审核管理"
  },
  {
    path: "/process",
    name: "流程管理"
  },
  {
    name: '流程管理-流程列表',
    path: '/process/processList',
  },
  {
    name: '流程管理-新建审批流',
    path: '/process/newProcess',
  },
  {
    name: "目标管理",
    path: "/targetManagement",
  },
  {
    name: '目标管理-客户目标',
    path: '/targetManagement/customerServiceTarget',
  },
  {
    name: '目标管理-销售目标',
    path: '/targetManagement/salesTarget',
  },
  {
    name: '回款管理',
    path: '/money',
  },
  {
    name: '回款管理 - 回款列表',
    path: '/money/moneyhome',
  },
  {
    name: '产品管理',
    path: '/product',
  },
  {
    name: '产品管理 - 产品列表',
    path: '/product/productHome',
  },
  {
    name: '产品管理 - 新建产品',
    path: '/product/newProduct',
  },
  {
    name: '产品管理 - 新建商家',
    path: '/product/newSeller',
  },
  {
    path: "/system",
    name: "系统管理",
  },
  {
    path: "/system/companyManagement",
    name: "系统管理-公司管理",
  },
  {
    path: "/system/structureManagement",
    name: "系统管理-部门管理",
  },
  {
    path: "/system/roleManagement",
    name: "系统管理-角色管理",
  },
  {
    path: "/system/positionManagement",
    name: "系统管理-职位管理",
  },
  {
    path: "/system/userManagement",
    name: "系统管理-用户管理",
  },
  {
    path: "/system/menuManagement",
    name: "系统管理-菜单管理",
  },
  {
    path: "/dataConfig",
    name: "数据配置",
  },
  {
    path: "/dataConfig/customerFromConfig",
    name: "数据配置-客资来源",
  },
  {
    path: "/dataConfig/activityManagement",
    name: "数据配置-投放活动",
  },

  {
    name: '消息中心',
    path: '/messageCenter',
  },
  {
    name: '消息中心 - 消息中心列表',
    path: '/messageCenter/messageCenterList',
  },
  {
    name: '话术管理',
    path: '/colloQuialism',
  },
  {
    name: '话术管理 - 话术列表',
    path: '/colloQuialism/colloQuialismList',
  },
  {
    name: '话术管理 - 反馈评价',
    path: '/colloQuialism/feedbackEvaluation',
  },
  {
    path: '/beiJingBI',
    name: '北京BI',
  },
  {
    path: '/beiJingBI/list',
    name: '北京BI - 北京BI列表',
  },
  {
    path: '/bjReqBIList',
    name: '邀约BI列表',
  },
  {
    path: "/lihePro",
    name: "服务流程管理",
  },
  {
    path: "/lihePro/Home",
    name: "服务流程-流程列表",
  },
  {
    path: "/lihePro/Detail",
    name: "服务流程-流程详情",
  },
  {
    path: '/qualityAssuranceList',
    name: '质检列表'
  },
  {
    name: '提供人列表',
    path: '/bjRecoderList',
  },
  {
    name: '提供人列表-集团版',
    path: '/bjSunnyGroupRecoderList',
  },
  {
    name: '需求人列表',
    path: '/bjLeadsList',
  },
  {
    name: '邀约列表',
    path: '/bjReqList',
  },
  {
    name: '调休列表',
    path: '/paidLeaveTable/paidLeaveTableHome',
  },
  {
    name: '商家地图',
    path: '/storeMap',
  },


]

export default menusConfig as MenuConfigType[];
