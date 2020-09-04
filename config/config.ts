import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true, // 是否开启热加载
      },
      locale: {},
      dynamicImport: {
        // 子页面加载时候的loading效果
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
      hd: false,
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
  'umi-plugin-keep-alive',
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/dashboardWorkplace',
            },
            {
              name: '工作台',
              path: '/dashboardWorkplace',
              component: './DashboardWorkplace',
            },
            {
              name: '服务流程管理',
              path: '/lihePro',
            },
            {
              name: '服务流程-流程列表',
              path: '/lihePro/Home',
              component: './LiheProManagement/LiheProHome',

            },
            {
              name: '服务流程-流程详情',
              path: '/lihePro/Detail',
              component: './LiheProManagement/LiheProDetail',

            },
            {
              name: '线索公海',
              path: '/claimTableList',
              component: './TrailHighSeas/ClaimTableList',
            },
            {
              name: '线索公海-线索详情',
              path: '/claimTableList/leadsDetails',
              component: './LeadsManagement/leadsDetails',
            },
            {
              name: '客诉管理',
              path: '/customerComplaintManagement',
              component: './CustomerComplaintManagement/list',
            },
            {
              name: '客诉单详情',
              path: '/customerComplaintManagement/detail',
              component: './CustomerComplaintManagement/detail',
            },
            {
              name: '线索',
              path: '/leads',
            },
            {
              name: '新建线索',
              path: '/leads/newLeads',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '我的线索',
              path: '/leads/leadsManagement',
              component: './LeadsManagement/leadsList',
            },
            {
              name: '到喜啦线索列表',
              path: '/leads/dxlLeadsManagement',
              component: './DxlLeadsManagement/dxlLeadsList',
            },
            {
              name: '到喜啦线索列表-新建客资',
              path: '/leads/dxlLeadsManagement/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '线索分配',
              path: '/leads/distributeList',
              component: './LeadsManagement/distributeList',
            },
            {
              name: '线索分配-线索详情',
              path: '/leads/distributeList/leadsDetails',
              component: './LeadsManagement/leadsDetails',
            },
            {
              name: '我的线索-新建客资',
              path: '/leads/leadsManagement/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '线索详情',
              path: '/leads/leadsManagement/leadsDetails',
              component: './LeadsManagement/leadsDetails',
            },
            {
              name: '有效单管理',
              path: '/demand',
            },
            {
              name: '有效单公海',
              path: '/demand/demandCommonSea',
              component: './DemandManagement/demandCommonSea',
            },
            {
              name: '有效单死海',
              path: '/demand/demandCommonDeadSea',
              component: './DemandManagement/demandCommonSea',
            },
            {
              name: '全部有效单',
              path: '/demand/demandListAll',
              component: './DemandManagement/demandList',
            },
            {
              name: '我的有效单列表',
              path: '/demand/demandManagement',
              component: './DemandManagement/demandList',
            },
            {
              name: '有效单质检',
              path: '/demand/demandsQaList',
              component: './DemandManagement/demandList',
            },
            {
              name: '有效单列表-新建客资',
              path: '/demand/demandManagement/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '有效单详情',
              path: '/demand/demandManagement/demandDetails',
              component: './CustomerManagement/customerDetail/dxl',
            },
            {
              name: '有效单详情',
              path: '/demand/demandsQaList/demandDetails',
              component: './CustomerManagement/customerDetail/dxl',
            },
            {
              name: '有效单详情',
              path: '/demand/demandListAll/demandDetails',
              component: './CustomerManagement/customerDetail/dxl',
            },
            {
              name: '有效单详情',
              path: '/demand/demandCommonSea/demandDetails',
              component: './CustomerManagement/customerDetail/dxl',
            },
            {
              name: '有效单详情',
              path: '/demand/demandCommonDeadSea/demandDetails',
              component: './CustomerManagement/customerDetail/dxl',
            },
            {
              name: '客户',
              path: '/customer',
            },
            {
              name: '客户列表',
              path: '/customer/customerManagement',
              component: './CustomerManagement/customerList',
            },
            {
              name: '新建客资',
              icon: 'smile',
              path: '/customer/customerManagement/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            // 留给到喜啦用的客户详情页
            {
              name: '客户详情',
              path: '/customer/customerManagement/customerDetail',
              component: './CustomerManagement/customerDetail/dxl',
            },
            {
              name: '发起客户重单',
              path: '/customer/customerManagement/startDuplicateCustomer',
              component: './CustomerManagement/startDuplicateCustomer',
            },
            {
              name: '客资导入',
              path: '/passengerImport',
              component: './PassengerImport',
            },
            {
              name: '订单',
              path: '/order',
            },
            {
              name: '订单列表',
              path: '/order/orderManagement',
              component: './OrderManagement/orderHome',
            },
            {
              name: '新建订单',
              path: '/order/newOrder',
              component: './OrderManagement/newOrder',
            },
            {
              name: '新建订单-新建客资',
              path: '/order/newOrder/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            // 给到喜啦用的订单详情页
            {
              name: '订单详情页',
              path: '/order/orderManagement/orderDetails',
              component: './OrderManagement/orderDetails',
            },

            {
              name: '新建合同',
              path: '/order/orderManagement/newContract',
              component: './OrderManagement/newContractNew',
            },
            {
              name: '编辑合同',
              path: '/order/orderManagement/editContract',
              component: './OrderManagement/editContract',
            },
            {
              name: '销售',
              path: '/saleManagement',
            },

            {
              name: '婚宴销售列表',
              path: '/saleManagement/hy/saleList',
              component: './SaleManagement/saleList',
            },

            {
              name: '婚宴销售列表-新建客资',
              icon: 'smile',
              path: '/saleManagement/hy/saleList/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '婚宴销售列表-领取订单',
              path: '/saleManagement/hy/saleList/getOrder',
              component: './SaleManagement/getOrder',
            },
            {
              name: '婚宴销售列表-获取订单-新建客资',
              icon: 'smile',
              path: '/saleManagement/hy/saleList/getOrder/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '婚宴销售列表-订单详情页',
              path: '/saleManagement/hy/saleList/orderDetails',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '婚宴销售列表-客户详情页',
              path: '/saleManagement/hy/saleList/customerDetail',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '婚宴销售列表-订单详情页-新建合同',
              path: '/saleManagement/hy/saleList/orderDetails/newContract',
              component: './OrderManagement/newContractNew',
            },
            {
              name: '婚宴销售列表-订单详情页-编辑合同',
              path: '/saleManagement/hy/saleList/orderDetails/editContract',
              component: './OrderManagement/editContract',
            },
            {
              name: '婚庆销售列表',
              path: '/saleManagement/hq/saleList',
              component: './SaleManagement/saleList',
            },
            {
              name: '婚庆销售列表-新建客资',
              icon: 'smile',
              path: '/saleManagement/hq/saleList/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '婚庆销售列表-领取订单',
              path: '/saleManagement/hq/saleList/getOrder',
              component: './SaleManagement/getOrder',
            },
            {
              name: '婚庆销售列表-获取订单-新建客资',
              icon: 'smile',
              path: '/saleManagement/hq/saleList/getOrder/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '婚庆销售列表-订单详情页',
              path: '/saleManagement/hq/saleList/orderDetails',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '婚庆销售列表-客户详情页',
              path: '/saleManagement/hq/saleList/customerDetail',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '婚庆销售列表-订单详情页-新建合同',
              path: '/saleManagement/hq/saleList/orderDetails/newContract',
              component: './OrderManagement/newContractNew',
            },
            {
              name: '婚庆销售列表-订单详情页-编辑合同',
              path: '/saleManagement/hq/saleList/orderDetails/editContract',
              component: './OrderManagement/editContract',
            },
            {
              name: '其他品类销售列表',
              path: '/saleManagement/other/saleList',
              component: './SaleManagement/saleList',
            },
            {
              name: '其他品类销售列表-新建客资',
              icon: 'smile',
              path: '/saleManagement/other/saleList/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '其他品类销售列表-领取订单',
              path: '/saleManagement/other/saleList/getOrder',
              component: './SaleManagement/getOrder',
            },
            {
              name: '其他品类销售列表-获取订单-新建客资',
              icon: 'smile',
              path: '/saleManagement/other/saleList/getOrder/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '其他品类销售列表-订单详情页',
              path: '/saleManagement/other/saleList/orderDetails',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '其他品类销售列表-客户详情页',
              path: '/saleManagement/other/saleList/customerDetail',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '其他品类销售列表-订单详情页-新建合同',
              path: '/saleManagement/other/saleList/orderDetails/newContract',
              component: './OrderManagement/newContractNew',
            },
            {
              name: '其他品类销售列表-订单详情页-编辑合同',
              path: '/saleManagement/other/saleList/orderDetails/editContract',
              component: './OrderManagement/editContract',
            },
            // {
            //   name: '庆典销售列表',
            //   path: '/saleManagement/qd/saleList',
            //   component: './SaleManagement/saleList',
            // },
            // {
            //   name: '庆典销售列表-新建客资',
            //   icon: 'smile',
            //   path: '/saleManagement/qd/saleList/newCustomer',
            //   component: './LeadsManagement/newLeads',
            // },
            // {
            //   name: '庆典销售列表-领取订单',
            //   path: '/saleManagement/qd/saleList/getOrder',
            //   component: './SaleManagement/getOrder',
            // },
            // {
            //   name: '庆典销售列表-获取订单-新建客资',
            //   icon: 'smile',
            //   path: '/saleManagement/qd/saleList/getOrder/newCustomer',
            //   component: './LeadsManagement/newLeads',
            // },
            // {
            //   name: '庆典销售列表-订单详情页',
            //   path: '/saleManagement/qd/saleList/orderDetails',
            //   component: './CustomerManagement/customerDetail/xp',
            // },
            // {
            //   name: '庆典销售列表-客户详情页',
            //   path: '/saleManagement/qd/saleList/customerDetail',
            //   component: './CustomerManagement/customerDetail/xp',
            // },
            // {
            //   name: '庆典销售列表-订单详情页-新建合同',
            //   path: '/saleManagement/qd/saleList/orderDetails/newContract',
            //   component: './OrderManagement/newContractNew',
            // },
            // {
            //   name: '庆典销售列表-订单详情页-编辑合同',
            //   path: '/saleManagement/qd/saleList/orderDetails/editContract',
            //   component: './OrderManagement/editContract',
            // },
            {
              name: '产品管理',
              path: '/product',
            },
            {
              name: '产品列表',
              path: '/product/productHome',
              component: './ProductManagement/ProductHome',
            },
            {
              name: '新建产品',
              path: '/product/newProduct',
              component: './ProductManagement/NewProduct',
            },
            {
              name: '产品详情',
              path: '/product/productDetails',
              component: './ProductManagement/ProductDetail',
            },
            {
              name: '新建商家',
              path: '/product/newSeller',
              component: './ProductManagement/NewSeller',
            },
            {
              name: '系统管理',
              path: '/system',
            },
            {
              name: '公司管理',
              path: '/system/companyManagement',
              component: './SystemManagement/CompanyManagement',
            },
            {
              name: '部门管理',
              path: '/system/structureManagement',
              component: './SystemManagement/StructureManagement',
            },
            {
              name: '职位管理',
              path: '/system/positionManagement',
              component: './SystemManagement/PositionManagement',
            },
            {
              name: '角色管理',
              path: '/system/roleManagement',
              component: './SystemManagement/RoleManagement',
            },
            {
              name: '菜单管理',
              path: '/system/menuManagement',
              component: './SystemManagement/MenuManagement',
            },
            {
              name: '用户管理',
              path: '/system/userManagement',
              component: './SystemManagement/UserManagement',
            },
            {
              name: '数据配置',
              path: '/dataConfig',
            },
            {
              name: '投放活动',
              path: '/dataConfig/activityManagement',
              component: './DataConfigManagement/activityConfig',
            },
            {
              name: '数据配置-客资来源',
              path: '/dataConfig/customerFromConfig',
              component: './DataConfigManagement/customerFromConfig',
            },
            {
              name: '商家管理',
              path: '/store',
            },
            {
              name: '商家明细',
              path: '/store/storeDetails',
              component: './StoreManagement/store',
            },
            {
              name: '分组',
              path: '/group',
            },
            {
              name: '分组管理',
              path: '/group/grouphome',
              component: './GroupMangement/groupHome',
            },
            {
              name: '新建分组',
              path: '/group/groupnew',
              component: './GroupMangement/NewGroup',
            },
            {
              name: '分组详情',
              path: '/groupdetail/:id',
              component: './GroupMangement/GroupDetail',
            },
            {
              name: '客资来源管理',
              path: '/sunnyrules',
            },
            {
              name: '数据分配规则列表',
              path: '/sunnyrules/distributeruleslist',
              component: './SunnyRulesManagement/DistributeRulesList',
            },
            {
              name: '新建数据分配规则',
              path: '/sunnyrules/distributeruleslist/newdistributerules',
              component: './SunnyRulesManagement/NewDistributeRules',
            },
            {
              name: '编辑数据分配规则',
              path: '/sunnyrules/distributeruleslist/editdistributerules',
              component: './SunnyRulesManagement/NewDistributeRules',
            },
            {
              name: '数据分配规则详情',
              path: '/sunnyrules/distributeruleslist/distributeruledetail',
              component: './SunnyRulesManagement/DistributeRuleDetail',
            },
            {
              name: '数据分配规则的数据明细',
              path: '/sunnyrules/distributeruleslist/distributeruledetail/datasheet',
              component: './SunnyRulesManagement/DistributeRuleDataSheet',
            },
            {
              name: 'QA配规则列表',
              path: '/sunnyrules/qaruleslist',
              component: './SunnyRulesManagement/QaRulesList',
            },
            {
              name: '新建QA规则',
              path: '/sunnyrules/qaruleslist/newqarules',
              component: './SunnyRulesManagement/NewQaRules',
            },
            {
              name: '编辑QA规则',
              path: '/sunnyrules/qaruleslist/editqarules',
              component: './SunnyRulesManagement/NewQaRules',
            },
            {
              name: 'QA规则详情',
              path: '/sunnyrules/qaruleslist/qaruledetail',
              component: './SunnyRulesManagement/QaRuleDetail',
            },
            {
              name: '客资来源列表',
              path: '/sunnyrules/sunnyruleslist',
              component: './SunnyRulesManagement/SunnyRulesList',
            },
            {
              name: '规则配置详情',
              path: '/sunnyrules/sunnyruleslist/ruledetail',
              component: './SunnyRulesManagement/RuleDetail',
            },
            {
              name: '新建规则',
              path: '/sunnyrules/newrules',
              component: './SunnyRulesManagement/NewSunnyRules',
            },
            {
              name: '编辑规则',
              path: '/sunnyrules/sunnyruleslist/editrules',
              component: './SunnyRulesManagement/NewSunnyRules',
            },
            {
              name: '任务管理',
              path: '/task',
            },
            {
              name: '任务列表',
              path: '/task/tasklist',
              component: './TaskManagement/TaskList',
            },
            {
              name: '任务详情',
              path: '/task/taskdetail',
              component: './TaskManagement/TaskDetail',
            },
            {
              name: '新建任务',
              path: '/task/newtask',
              component: './TaskManagement/NewTask',
            },

            {
              path: '/review/reviewlist',
              name: '审核管理',
              component: './ReviewManagement/reviewList',
            },
            {
              path: '/review/reviewlist/detail',
              name: '审核详情',
              component: './ReviewManagement/reviewDetail',
            },
            {
              path: '/review/reviewlist/repeatDetail',
              name: '客户重复详情',
              component: './ReviewManagement/repeatDetail',
            },
            {
              path: '/review/reviewlist/requirementBackToSeasDetail',
              name: '有效单退回公海/死海审批',
              component: './ReviewManagement/requirementBackToSeasDetail',
            },
            {
              path: '/process',
              name: '流程管理',
            },
            {
              name: '流程列表',
              path: '/process/processList',
              component: './ProcessManagement/processList',
            },
            {
              name: '新建审批流',
              path: '/process/newProcess',
              component: './ProcessManagement/newProcess',
            },
            {
              name: '修改审批流',
              path: '/process/processList/modifyProcess',
              component: './ProcessManagement/newProcess',
            },
            {
              name: '修改密码',
              path: '/changepassword',
              component: './ChangePassword/changePassword',
            },
            {
              name: '回款管理',
              icon: 'smile',
              path: '/money/moneyhome',
              component: './MoneyManagement/moneyList',
            },
            {
              name: '回款详情',
              path: '/money/moneydetails',
              component: './MoneyManagement/moneyDetails',
            },
            {
              name: '目标管理',
              icon: 'pie-chart',
              path: '/targetManagement',
            },
            {
              name: '客服目标',
              path: '/targetManagement/customerServiceTarget',
              component: './TargetManagement/customerServiceTarget',
            },
            {
              name: '销售目标',
              path: '/targetManagement/salesTarget',
              component: './TargetManagement/salesTarget',
            },
            {
              name: '消息中心',
              path: '/messageCenter',
            },
            {
              name: '消息中心 - 消息中心列表',
              path: '/messageCenter/messageCenterList',
              component: './MessageCenter/messageCenterList',
            },
            {
              name: '商家地图',
              path: '/storeMap',
              component: './CrmMap',
            },
            {
              name: '话术管理',
              path: '/colloQuialism',
            },
            {
              name: '话术管理 - 话术列表',
              path: '/colloQuialism/colloQuialismList',
              component: './ColloQuialism/colloQuialismList',
            },
            {
              name: '话术管理 - 反馈评价',
              path: '/colloQuialism/feedbackEvaluation',
              component: './ColloQuialism/feedbackEvaluation',
            },
            {
              name: '质检列表',
              path: '/qualityAssuranceList',
              component: './QAManagement/qualityAssuranceList',
            },
            {
              name: '质检详情',
              path: '/qualityAssuranceList/qualityAssuranceDetail',
              component: './QAManagement/qualityAssuranceDetail',
            },
            {
              name: '北京BI',
              path: '/beiJingBI',
            },
            {
              name: '北京BI - 北京BI列表',
              path: '/beiJingBI/list',
              component: './BeiJingBI/list',
            },
            {
              name: '北京BI-新建客资',
              path: '/beiJingBI/list/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '邀约BI列表',
              path: '/bjReqBIList',
              component: './BeiJingBI/list',
            },
            {
              name: '邀约BI详情',
              path: '/bjReqBIList/detail_xp',
              component: './CustomerManagement/customerDetail/xp',
            },
            // 给喜铺用的客户详情页-定位在BI列表下
            {
              name: '客户详情',
              path: '/beiJingBI/list/customerDetail_xp',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '提供人列表-集团版',
              path: '/bjSunnyGroupRecoderList',
              component: './CustomerManagement/sunnyListForGroup',
            },
            {
              name: '提供人详情页',
              path: '/bjSunnyGroupRecoderList/detail_xp',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '新建客资-集团版',
              path: '/bjSunnyGroupRecoderList/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            {
              name: '提供人列表',
              path: '/bjRecoderList',
              component: './CustomerManagement/sunnyList',
            },
            {
              name: '提供人列表-新建客资',
              path: '/bjRecoderList/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            // 给喜铺用的客户详情页-定位在提供人列表下
            {
              name: '提供人详情页',
              path: '/bjRecoderList/detail_xp',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '需求人列表',
              path: '/bjLeadsList',
              component: './CustomerManagement/sunnyList',
            },
            {
              name: '需求人列表-新建客资',
              path: '/bjLeadsList/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            // 给喜铺用的线索详情页-定位在需求人列表下
            {
              name: '线索详情页',
              path: '/bjLeadsList/detail_xp',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '邀约列表',
              path: '/bjReqList',
              component: './CustomerManagement/sunnyList',
            },
            {
              name: '邀约列表-新建客资',
              path: '/bjReqList/newCustomer',
              component: './LeadsManagement/newLeads',
            },
            // 调休列表
            {
              name: '调休列表',
              path: '/paidLeaveTable/paidLeaveTableHome',
              component: './PaidLeaveTable/PaidLeaveTableHome',
            },
            // 给喜铺用的有效单详情页-定位在邀约列表下
            {
              name: '有效单详情页',
              path: '/bjReqList/detail_xp',
              component: './CustomerManagement/customerDetail/xp',
            },
            {
              name: '通用错误页',
              path: '/error',
              component: './Error',
            },
            {
              component: './404',
            },
          ],
        },
        {
          name: '通用错误页',
          path: '/error',
          component: './Error',
        },
        {
          component: './404',
        },
      ],
    },
    {
      name: '通用错误页',
      path: '/error',
      component: './Error',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'font-size-base': '12px',
    'badge-font-size': '10px',
    // 'table-selected-row-color': 'white',
    // 'table-selected-row-bg': 'yellow',
    'table-row-hover-bg': 'transparent',
    'disabled-color': '#626567'
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'http://gcrm.hunli.baihe.com/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server/api/': '' },
  //   },
  // },
  proxy: {
    '/api/': {
      target: 'http://gcrmapi.hunli.baihe.com/',
      //此处是要代理的地址
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api/': '',
      },
      // [HPM] Error occurred while trying to proxy request ** from devui.baihe.com:8000 to http://gcrmapi.hunli.baihe.com/ (ECONNRESET) (https://nodejs.org/api/errors.html#errors_common_system_errors)
      headers: {
        Connection: 'keep-alive',
      },
    },
  },
} as IConfig;
