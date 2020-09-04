import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';

import { Spin, Card, Tabs, Button, message, Divider, Row, Col, Menu, Dropdown, Modal, Checkbox, Empty, Tag, Drawer, Form, Select, Input, Alert, List, Icon } from 'antd';
import getUserInfo from '@/utils/UserInfoStorage'
import styles from './index.less';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { Action, Dispatch } from 'redux';
import { StateType } from './model';
import { connect } from 'dva';
import CustomerInfo from './components/customerinfo';
import ContactTab from '../xp/components/contactlist';
import FollowView from '../xp/components/followView';
// import AddFollowInfo from '../components/addFollow';
import ContractTab from "./components/contract";
import OrderDetailsReceivableRecordList from "./components/OrderDetailsReceivableRecordList";
// 回款
import ShowEditAndAddReceivableRecord from "../../../OrderManagement/orderDetails/components/OrderDetailsShowEditAndAddReceivableRecord"
import ShowDeleteReceivableRecord from "../../../OrderManagement/orderDetails/components/OrderDetailsShowDeleteReceivableRecord"
import ShowEditReceivableRecordPlan from "../../../OrderManagement/orderDetails/components/OrderDetailsShowEditReceivablePlan"

// 回款记录详情
import OrderReceivableRecordDetails from "../../../OrderManagement/orderDetails/components/OrderReceivableRecordDetails"
import TeamTab from '../components/projectteam';
import CustomerRequire from '../components/customrequir';
import RntryFollow from '../xp/components/rntryFollow';
import QualityInspection from '../xp/components/qualityInspection';
import OrderInfo from '../components/OrderInfo';
import OrderDetailsConfirmShop from "./components/OrderDetailsConfirmShop";

// 项目成员
import NewEditProjectMembersPage from './components/NewEditProjectMembers';

import LOCAL from '@/utils/LocalStorageKeys';
import { RequirementData, ContactUserData, RequirementBean, CustomerData, ProjectTeam } from './data';
import RequirementInfo from '../components/requirment';
import { routerRedux } from 'dva/router';
import { declareExportDeclaration } from '@babel/types';
import TransferToUserForm, { FormValueType } from '@/components/TransferToUserForm';
import { ConfigListItem } from '../commondata';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { type } from 'os';

import FormItem from 'antd/lib/form/FormItem';
import IntentionalDemand from './components/IntentionalDemand';

import { customerChildren } from './service';
import CustomerChildrenModal from '../components/CustomerChildren';
import StartCustomerComplaintModal from '@/components/StartCustomerComplaintModal';
import CooperationTab from '../components/cooperation';
import CrmUtil from '@/utils/UserInfoStorage';
import CategoryReq from './components/CategoryReq';
import CustomerLeads from './components/CustomerLeads';
import OperationLogPage from './components/OperationLogPage'
import { CustomerLeadsData } from '@/pages/LeadsManagement/leadsDetails/data';
import OrderDetailsInfo from './components/OrderDetailsInfo';
import { ProductInfo, PlansItemList } from '@/pages/OrderManagement/orderDetails/data';
import { PlusOutlined } from '@ant-design/icons';
import { bool } from 'prop-types';

import ProjectMember from './components/projectmember';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface TableListProps {
  dispatch: Dispatch<
    Action<
      | 'customerDetailMode/fetch'
      | 'customerDetailMode/config'
      | 'customerDetailMode/fetchCustomerLeadsList'
      | 'customerDetailMode/fetchReqList'
      | 'customerDetailMode/getOrderDetails'
      | 'customerDetailMode/searchProduct'
      | 'customerDetailMode/bindProduct'
      | 'customerDetailMode/unBindProduct'
      | 'customerDetailMode/updateOrder'
      | 'customerDetailMode/transferCustomer'
      | 'customerDetailMode/customerManagementPage'
      | 'customerDetailMode/getCustomerChildren'
      | 'customerDetailMode/getAllUser'
      | 'customerDetailMode/getMerchantList'
      | 'customerDetailMode/getFollowList'
      | 'customerDetailMode/getUserPermissionList'
      | 'customerDetailMode/updateReqLite'
      | 'customerDetailMode/router'
      | 'customerDetailMode/clearData'
      | 'customerDetailMode/getIsFriend'
      | 'customerDetailMode/getContractList'
      | 'customerDetailMode/getRulesUserInfo'
      | 'customerDetailMode/getMoneyConfig'
      | 'customerDetailMode/getPercentUserList'
      | 'customerDetailMode/getPercentUserListForReqBI'
      | 'customerDetailMode/requestCustomerImportantInfo'
    >
  >;
  loading: boolean;
  customerDetailMode: StateType;
}

interface TableListState {
  currentUserId: string | undefined;
  currentUserName: string | undefined;
  customerId: string;
  orderId: string;
  /** 1：需求，2：邀约，3：订单, 4：提供人（集团客户信息/分公司客户信息）  10: 客户BI列表  */
  showStyle: 1 | 2 | 3 | 4 | 10;
  editable: boolean;
  contactShow: boolean;

  // 添加跟进
  showAddFollowInfo: boolean;

  // -----------------  订单  -------------------

  // -----------------  确认到店
  // 展示确认到店
  isShowConfirmShop: boolean,
  // 确认到店展示数据
  reserveData: any[],

  // 订单 -----------------  回款记录 
  //  展示修改和添加新的回款记录
  showEditAndAddReceivableRecordInfo: boolean
  // 展示删除提示回款记录框
  showDeleteReceivableRecordInfoItem: boolean;
  // 修改的回款记录的计划对象  
  editReceivableRecordInfoItem: PlansItemList;
  // 修改回款记录的合同对象
  editReceivableRecordConstomerInfo: any;
  // 修改回款记录的对象id
  plansItemModel: any;
  // 修改回款记录样式
  receivableRecordType: number,
  // 订单 -----------------  回款记录详情 
  showReceivableRecordDetails: boolean,
  showReceivableRecordDetailsItem: PlansItemList,
  // 订单 -----------------  回款计划 
  showEditReceivableRecordPlan: boolean;
  editReceivabRecordPlanItemModel: any;

  checkedValue: Array<CheckboxValueType>;

  isFinshRequestWeChat: boolean;

  customerChildrenModalVisible: boolean;

  collaModalVisible: boolean;
  collaReason: string;

  qaModalVisible: boolean;
  qaReason: string;

  // 跟进记录请求的标签
  tab: string,

  activeKey: string;

  arriveVisible: boolean;

  isFirstConfigRequest: boolean;

  // 项目成员 --------- 
  isShowNewEditProjectMembers: boolean,

  editProjectMembersModel: any,
  customerPhoneDecryptText: string | undefined,
  customerWechatDecryptText: string | undefined,
}


@connect(
  ({
    customerDetailMode,
    loading,
  }: {
    customerDetailMode: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerDetailMode,
    loading: loading.models.customerDetailMode,
  }),
)

class TableList extends Component<TableListProps, TableListState>{
  leadsRef: any;
  reqRef: any;
  orderRef: any;
  recommendOrderRef: any;
  logRef: any;

  backType: number = 3; //3退回公海 4退回死海
  collaType: number = 1; //1:联系协作人,2:联系归属人

  currentCategoryId: string | undefined;
  currentLeadsCategory: string | undefined;

  state: TableListState = {

    currentUserId: undefined,
    currentUseName: undefined,
    showStyle: 10,
    editable: true,
    contactShow: false,
    showAddFollowInfo: false,

    // -----------------  订单  -------------------

    // -----------------  确认到店
    // 展示确认到点
    isShowConfirmShop: false,
    // 确认到点展示数据
    reserveData: [],

    // -----------------  跟进记录
    // 这个参数是跟进标签点击tab时记录
    tab: "这个参数有什么用？",

    // -----------------  回款记录 
    // 展示修改和添加新的回款记录
    showEditAndAddReceivableRecordInfo: false,
    // 展示删除提示回款记录框
    showDeleteReceivableRecordInfoItem: false,
    // 修改的回款记录的计划对象
    editReceivableRecordInfoItem: {},
    // 修改回款记录的合同对象
    editReceivableRecordConstomerInfo: {},
    // 修改回款记录的对象id
    plansItemModel: {},
    // 修改回款记录样式
    receivableRecordType: 0,
    // 订单-----------------  回款记录详情 
    showReceivableRecordDetails: false,
    showReceivableRecordDetailsItem: {},
    // 订单-----------------  回款计划 
    // 修改和新增回款计划
    showEditReceivableRecordPlan: false,
    // 修改计划的模型
    editReceivabRecordPlanItemModel: {},

    checkedValue: [],

    orderId: '',
    customerChildrenModalVisible: false,
    customerId: '',
    isFinshRequestWeChat: false,
    collaModalVisible: false,
    collaReason: '',

    qaModalVisible: false,
    qaReason: '',

    activeKey: "1",

    arriveVisible: false,

    isFirstConfigRequest: true,
    // 项目成员 --------- 
    isShowNewEditProjectMembers: false,

    editProjectMembersModel: {},
    customerPhoneDecryptText: undefined,
    customerWechatDecryptText: undefined,

  }

  constructor(props: TableListProps) {
    super(props);
  }

  isBIReqDetail = (): boolean => {
    if (window.location.pathname == '/bjReqBIList/detail_xp') {
      return true;
    } else {
      return false;
    }
  }

  // 初始化方法
  componentDidMount() {
    console.log('收到参数' + JSON.stringify(this.props.location))

    this.init()
    this.setState({
      isFinshRequestWeChat: false
    })
  }

  // 刷新props方法
  componentWillReceiveProps = (nextProps: any) => {
    const { customerDetailMode: { data: { customerData } } } = nextProps;
    const { isFinshRequestWeChat, customerId } = this.state;
    const { dispatch } = this.props;

    if ((customerData?.weChat?.length > 0 || customerData?.encryptPhone?.length > 0) && customerId == customerData?.customerId) {
      const wechat = customerData?.weChat;
      const encryptPhone = customerData?.encryptPhone;

      const values = {};
      if (wechat?.length > 0) {
        values['wechat'] = wechat;
      } else {
        values['wechat'] = '';
      };

      if (encryptPhone?.length > 0) {
        values['encryptPhone'] = encryptPhone;
      } else {
        values['encryptPhone'] = '';
      };
      if (!isFinshRequestWeChat) {
        dispatch({
          type: 'customerDetailMode/getIsFriend',
          payload: values,
        });

        dispatch({
          type: 'customerDetailMode/getPercentUserList'
        });
        if (this.isBIReqDetail()) {
          dispatch({
            type: 'customerDetailMode/getPercentUserListForReqBI',
            payload: {
              companyId: customerData.company_id,
            }
          });
        }
        this.receivablesUserIdSearch('')
        this.setState({
          isFinshRequestWeChat: true
        });
      };

    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/clearData',
    })
  }


  // --------------------------------------------  自定义方法 ---------------------------------------------

  // 初始化方法
  init = () => {
    var showStyle: 1 | 2 | 3 | 4 | 10 = 10;
    var customerId: string;
    var orderId;

    if (this.props.location.state) {
      console.log("接收到参数： " + JSON.stringify(this.props.location.state));
      showStyle = this.props.location.state.showStyle;
      this.state.showStyle = showStyle;
      // 设置详情页默认显示的tab
      this.state.activeKey = showStyle == 3 ? "6" : "1";
      customerId = this.props.location.state.customerId;
      this.state.customerId = customerId;
      if (showStyle == 3) {
        orderId = this.props.location.state.orderId;
        this.state.orderId = orderId;
      }
    }

    this.state.currentUserId = CrmUtil.getUserInfo()?.user_id.toString();
    this.state.currentUserName = CrmUtil.getUserInfo()?.name.toString();

    const { dispatch } = this.props;
    // 请求客户信息详情
    this.fetchCustomerDetail();

    // 如果是订单，需要拿到orderId参数之后，获取订单详情和合同信息
    if (showStyle == 3) {
      this.fetchOrderDetails(orderId);
      this.fetchContractListInfo(orderId);
      this.fetchOrderReceiveBaseInfo();
    }

    // 获取当前登录用户的权限
    dispatch({
      type: 'customerDetailMode/getUserPermissionList',
      payload: '',
    });

    // 获取商家列表
    dispatch({
      type: 'customerDetailMode/getMerchantList'
    });
  }

  getCompanyConfig = (companyId: number) => {
    if (!companyId) return;
    const { dispatch } = this.props;
    // 获取公共配置信息
    dispatch({
      type: 'customerDetailMode/config',
      payload: {
        companyId: companyId
      },
      callback: (success: boolean, msg: string) => {
        if (this.state.isFirstConfigRequest && success) {
          this.setState({
            isFirstConfigRequest: false
          }, () => { // 根据showStyle的类型 调用相应的tab接口
            // 所有阶段，都要展示“客户线索”组件
            this.handleCategoryLeadsList()
            // 除了需求确认阶段，其他都是需要展示“意向需求”组件的
            if (this.state.showStyle != 1) {
              this.handleCategoryReqList()
            }
          })
        }
      }
    });
  }

  getCompanyUserList = (companyId: number) => {
    if (!companyId) return;
    const { dispatch } = this.props;
    // 获取当前公司的所有用户列表
    let filters = {
      company_id: companyId
    }

    const ops = {};
    for (let key in filters) {
      if (key == 'company_id') {
        ops[key] = '=';
      } else {
        ops[key] = 'IN';
      }
    }

    const params = {
      page: 1,
      pageSize: 10000,
      filter: filters,
      op: ops
    };
    dispatch({
      type: 'customerDetailMode/getAllUser',
      payload: params,
    });
  }


  // 修改订单状态
  editOrderStateFunction = (e: any) => {
    const { orderId } = this.state;
    const value = {}
    value['phase'] = e
    value["orderId"] = orderId

    Axios.post(URL.updateOrder, value).then(
      res => {
        if (res.code === 200) {
          if (res.data.result) {
            message.success('修改成功');
            this.refreshCustomerDetail();
            this.fetchOrderDetails(orderId);
          }
        }
      }
    );
  }

  // -------------------- 项目成员 ------------------ 
  newProjectMembers = () => {
    this.setState({
      isShowNewEditProjectMembers: true,
      editProjectMembersModel: {}
    })
  }

  editProjectMembers = (model: any) => {
    this.setState({
      isShowNewEditProjectMembers: true,
      editProjectMembersModel: model
    })
  }

  saveProjectMembers = (values: any) => {
    // 点击成功了
    const { dispatch } = this.props;
    const { customerDetailMode: { data, orderDetail } } = this.props;
    const that = this;

    console.log("values", values)
    Axios.post(URL.operateTeam, values).then(
      res => {
        if (res.code === 200) {
          message.success('操作成功');
          var newValues = {};
          newValues['customerId'] = data?.customerData?.customerId;
          newValues['type'] = this.state?.showStyle;

          if (this.state?.showStyle === 3) {
            newValues['category'] = orderDetail?.orderInfo?.category;
          }

          dispatch({
            type: 'customerDetailMode/getProjectMemberList',
            payload: newValues,
          });

          that.logRef?.requestData(1)
          that.hiddenProjectMembers()
        }
      }
    );

  }

  hiddenProjectMembers = () => {
    this.setState({
      isShowNewEditProjectMembers: false,
      editProjectMembersModel: {}
    })
  }


  // ---------------------  订单自定义方法

  /// --------------------------------------------  修改回款计划 ---------------------------------------------
  // 回款计划调整
  editReceivableRecordPlanFunction = (value: any) => {
    this.setState({
      showEditReceivableRecordPlan: true,
      editReceivabRecordPlanItemModel: value,
    })
  }

  // 关闭调整回款计划
  cancelReceivableRecordPlanFunction = () => {
    this.setState({
      showEditReceivableRecordPlan: false,
      editReceivabRecordPlanItemModel: {},
    })
  }

  // 调整回款计划请求
  editReceivableRecordPlanRequetsFunction = (value: any, objc: any) => {
    const { orderId } = this.state;
    const { orderDetail } = this.props.customerDetailMode;

    value["orderId"] = orderId;
    value["customerId"] = orderDetail?.orderInfo.customer_id;

    Axios.post(URL.adjustReceivablesPlan, value).then(
      res => {
        if (res.code == 200) {
          message.success('调整成功');
          this.refreshCustomerDetail();
          this.fetchOrderDetails(orderId);

          this.setState({
            showEditReceivableRecordPlan: false,
          })
          const { form } = objc.formRef.props;
          form.resetFields();
        }
      }
    );

  }


  // ------------ 确认到店 ----------------

  showConfirmShopFunction = () => {
    const { orderDetail } = this.props?.customerDetailMode;
    const { reserve, reserve_confirm_count } = orderDetail;
    let tempArr = []


    let other = {}
    other.id = -99
    other.name = '再次进店'

    if (reserve && reserve?.length > 0) {
      tempArr = [...reserve]
      if (reserve_confirm_count > 0) {
        tempArr.push(other)
      }

      this.setState({
        isShowConfirmShop: true,
        reserveData: tempArr
      })
    } else {

      if (reserve_confirm_count > 0) {
        tempArr.push(other)
      }

      this.setState({
        isShowConfirmShop: true,
        reserveData: tempArr
      })
    }
  }


  // 确认到店 请求
  confirmShopRequetsFunction = (value: any, objc: any) => {
    this.setState({
      isShowConfirmShop: false,
    })

    value['orderId'] = this.state.orderId

    Axios.post(URL.confirmArrival, value).then(
      res => {
        if (res.code == 200) {

          message.success('确认成功');
          this.refreshCustomerDetail();
          this.fetchOrderDetails(this.state.orderId);

          this.setState({
            showEditReceivableRecordPlan: false,
          })

        }
      }
    );

  }
  // 取消 确认到店 
  cancelShowConfirmShopFunction = () => {
    this.setState({
      isShowConfirmShop: false,
    })
  }

  // 签订合同
  categoryClick = () => {
    const { orderDetail } = this.props?.customerDetailMode;
    const { dispatch } = this.props;
    var pathName = window.location.href.substr(window.location.href.indexOf(window.location.pathname)) + "/newContract"
    // var pathName = ''
    // if (orderDetail?.orderInfo.category == '1') {
    //   pathName = '/saleManagement/hy/saleList/orderDetails/newContract'
    // } else if (orderDetail?.orderInfo.category == '2') {
    //   pathName = '/saleManagement/hq/saleList/orderDetails/newContract'
    // } else if (orderDetail?.orderInfo.category == '4' || this.isSecondaryCategoryIn4(orderDetail?.orderInfo.category)) {
    //   pathName = '/saleManagement/other/saleList/orderDetails/newContract'
    // } else if (orderDetail?.orderInfo.category == '7') {
    //   pathName = '/saleManagement/hslf/saleList/orderDetails/newContract'
    // } else if (orderDetail?.orderInfo.category == '8') { // 属于4庆典的二级品类 8年会
    //   pathName = '/saleManagement/qd/saleList/orderDetails/newContract'
    // }

    dispatch(routerRedux.push({
      pathname: pathName,
      query: {
        orderId: this.state.orderId,
        categoryId: orderDetail?.orderInfo.category,
        categoryName: orderDetail?.orderInfo.category_txt,
        customerId: this.state.customerId
      }
    }))
  }

  isSecondaryCategoryIn4 = (categoryId: string | undefined) => {
    const { config } = this.props.customerDetailMode;
    if (categoryId && config) {
      const targetCategory = config.category2.filter(item => item.value + "" == '4');
      const childrenCategories = targetCategory[0].children;
      const result = childrenCategories.filter(item => item.value + "" == categoryId.toString());
      return !!(result[0]);
    } else {
      return false;
    }

  }



  // 获取跟进数据
  getFollowList = (tab: string, showStyle: 1 | 2 | 3 | 4 | 10, isRequetsCustomerDate: boolean, customerId?: string) => {
    const { dispatch } = this.props;
    let values = {}
    values['customerId'] = customerId ? customerId : this.state.customerId;
    values['tab'] = tab;
    values['type'] = showStyle;
    if (showStyle == 3) {
      values['relationId'] = this.state.orderId;
    }

    dispatch({
      type: 'customerDetailMode/getFollowList',
      payload: values,
    });

    // 同步tab标签
    this.setState({ tab })

    if (isRequetsCustomerDate) {
      this.refreshCustomerDetail()
    }
  }

  /**
   * 推荐商家
   */
  onRecommClick = (data: RequirementBean) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/store/storeDetails',
      query: {
        customerId: data.customer_id,
        reqId: data.id,
        category: data.top_category,
        cityInfo: data.city_info.city_code
      }
    }));
  }

  handleTabsChanged = (activeKey: string) => {
    this.setState({
      activeKey,
    })
  }

  /**
   * 获取客户详情信息
   */
  fetchCustomerDetail = () => {
    const { dispatch } = this.props;
    const { customerId, showStyle, orderId } = this.state;
    const { allUser, config, rulesUserInfo } = this.props.customerDetailMode
    const params = {
      customerId,
      type: showStyle,
      orderId
    }

    if (showStyle == 10) {
      params['isAll'] = '1'
    }
    dispatch({
      type: 'customerDetailMode/fetch',
      payload: params,
      callback: (data: any) => {
        if (data?.followData?.followTab?.length > 0) {
          let item = data?.followData?.followTab[0]
          this.getFollowList(item.key, showStyle, false, customerId);
        } else {
          this.getFollowList("1", showStyle, false, customerId);
        }
        if (!allUser || allUser?.length == 0) {
          this.getCompanyUserList(data?.customerData?.company_id)
        }
        if (!config) {
          this.getCompanyConfig(data?.customerData?.company_id)
        }

        if ((rulesUserInfo?.into_user_list ?? []).length == 0) {
          dispatch({
            type: 'customerDetailMode/getRulesUserInfo',
            payload: {
              channelId: data?.customerData?.channel_id,
              companyId: data?.customerData?.company_id,
              recordUserId: data?.customerData?.record_user_id
            }
          });
        }
      }
    });
  }

  /**
   * 刷新客户详情信息
   */
  refreshCustomerDetail = () => {
    const { dispatch } = this.props;
    const { customerId, showStyle, orderId } = this.state;
    dispatch({
      type: 'customerDetailMode/fetch',
      payload: {
        customerId,
        type: showStyle,
        orderId
      },
    });
  }

  /**
   * 获取订单详情信息
   */
  fetchOrderDetails = (orderId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/getOrderDetails',
      payload: { orderId }
    });
  }

  /**
   * 获取合同信息
   */
  fetchContractListInfo = (orderId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/getContractList',
      payload: { orderId },
    });
  }

  /**
   * 获取回款/合同的配置项
   */
  fetchOrderReceiveBaseInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/getMoneyConfig',
    });
  }

  /**
   * 编辑或添加联系人
   */
  onContactChanged = (bean: ContactUserData, executeAfterSuccess: () => void) => {
    const { customerData } = this.props.customerDetailMode.data
    Axios.post((bean['contactId'] == undefined || bean['contactId'] == "") ? URL.createContactUser : URL.updateContactUser, {
      ...bean,
      customerId: customerData.customerId,
    }).then(
      res => {
        if (res.code == 200) {
          executeAfterSuccess();
          message.success('操作成功');
          this.refreshCustomerDetail();
        }
      }
    );
  }

  /**
   * 编辑或添加联系人
   */
  onTeamChanged = (params: any, isCreate: boolean, executeAfterSuccess: () => void) => {
    Axios.post(isCreate == true ? URL.createReqTeam : URL.updateReqTeam, {
      ...params
    }).then(
      res => {
        if (res.code == 200) {
          executeAfterSuccess();
          message.success('操作成功');
          this.refreshCustomerDetail();
        }
      })
  }

  /**
   * 删除XX
   */
  onDeleteTeam = (reqId: string) => {
    const { customerData } = this.props.customerDetailMode.data
    Axios.post(URL.deleteReqTeam, {
      reqId: reqId
    }).then(
      res => {
        if (res.code == 200) {
          message.success('操作成功');
          this.refreshCustomerDetail();
        }
      })
  }

  // 跟进记录 - 录跟进
  addSalesOfDynamicFunction = () => {
    this.setState({
      showAddFollowInfo: true,
    })
  }

  // 取消 - 取消录跟进
  canceladdSalesOfDynamicFunction = () => {
    this.setState({
      showAddFollowInfo: false,
    })
  }
  /**
   * 修改更新客户信息（如客户级别、客户状态、性别、客户身份等）
   * 修改成功后需要刷新客户详情信息
   */
  updateCustomerInfo = (params: any, callback: () => void) => {
    Axios.post(URL.updateCustomer, params).then(
      res => {
        if (res.code == 200) {
          callback();
          message.success('操作成功');
          localStorage?.setItem('demandListRefreshTag', 'list')
          this.refreshCustomerDetail();
          this.handleCategoryReqList(this.currentCategoryId)
          this.handleCategoryLeadsList(this.currentLeadsCategory)
          if (params['phone']) {
            this.setState({
              customerPhoneDecryptText: params['phone']
            })
          }
          if (params['weChat']) {
            this.setState({
              customerWechatDecryptText: params['weChat']
            })
          }
        }
      })
  }

  /** 申请查看客户的手机号明文 */
  handleCheckOutPhoneNumber = (type: 1 | 2) => {
    const { dispatch } = this.props;
    const { customerId } = this.state;
    dispatch({
      type: 'customerDetailMode/requestCustomerImportantInfo',
      payload: {
        type,
        customerId
      },
      callback: (success: boolean, decryptText: string | undefined) => {
        if (success) {
          if (type == 1) {
            this.setState({
              customerPhoneDecryptText: decryptText
            })
          } else if (type == 2) {
            this.setState({
              customerWechatDecryptText: decryptText
            })
          }
        }
      }
    })
  }

  onRef = (ref: any) => {
    this.reqRef = ref
  }

  onLeadsRef = (ref: any) => {
    this.leadsRef = ref
  }

  onOrderRef = (ref: any) => {
    this.orderRef = ref
  }

  onRecommendOrderRef = (ref: any) => {
    this.recommendOrderRef = ref
  }

  onLogRef = (ref: any) => {
    this.logRef = ref
  }

  /**
   * 添加有效单（调用意向需求组件中的方法）
   */
  handleCreateReq = (item: ConfigListItem) => {
    this.reqRef.handleSelectCategory("新建" + item.name + "有效单", Number(item.id))
  }

  /**
   * 添加线索（调用客户线索组件中的方法）
   */
  handleCreateLeads = (name: string, value: number) => {
    this.leadsRef.handleCreateLeads(name, value);
  }

  onCloseClick = (bean: RequirementBean) => {
    this.reqRef.handleCloseReq(bean)
  }


  onQaClick = (bean: ConfigListItem) => {
    if (bean.id == 1) {
      this.onReqQaChange({ qtResult: bean.id })
    } else if (bean.id == 2) {
      this.setQaVisible(true)
    }
  }

  //联系协作人Modal
  onCollaModeSure = () => {
    if (this.state.collaReason == '') {
      message.error("请填写协作内容");
      return;
    }
    const params = {
      reqId: this.state.reqId,
      type: this.collaType,
      comment: this.state.collaReason,
    };
    Axios.post(URL.collaborateMsg, params).then(
      res => {
        if (res.code == 200) {
          message.info(res.msg);
          this.setCollaVisible(false)
          this.refreshCustomerDetail()
        }
      })
  }
  setCollaVisible = (b: boolean) => {
    if (b) { this.state.collaReason = '' }
    this.setState({ collaModalVisible: b })
  }
  collaModeTextChange = ({ target: { value } }) => {
    this.setState({ collaReason: value });
  };
  checkCollaVisible = () => {
    const { associates } = this.props.customerDetailMode.data.reqLiteData
    if (this.collaType == 1 && !associates) {
      message.info('暂无协作人，请到线索详情添加协作人')
      return
    }
    this.setCollaVisible(true)
  };



  onReqLevelChange = (value: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'customerDetailMode/updateReqLite',
      payload: {
        reqId: this.state.reqId,
        level: value
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success('有效单级别修改成功');
          localStorage?.setItem('demandListRefreshTag', 'list')
          this.refreshCustomerDetail();
          this.handleCategoryReqList(this.currentCategoryId)
        }
      }
    });
  }

  onCustomerLevelChanged = (value: string) => {
    let params = {
      customerId: this.state.customerId,
      customerLevel: value,
    }
    this.updateCustomerInfo(params, () => { })
  }

  onReqQaChange = (value: any) => {
    const { dispatch } = this.props
    dispatch({
      type: 'customerDetailMode/updateReqLite',
      payload: {
        reqId: this.state.reqId,
        ...value,
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success(msg);
          this.setQaVisible(false);
          localStorage?.setItem('demandListRefreshTag', 'list')
          this.refreshCustomerDetail();
          this.handleCategoryReqList(this.currentCategoryId);
        }
      }
    });
  }
  //质检Modal
  onQAModeSure = () => {
    if (this.state.qaReason == '') {
      message.error("请填写质检无效原因");
      return;
    }
    this.onReqQaChange({
      qtResult: 2,
      qtResultReason: this.state.qaReason
    })
  }
  setQaVisible = (b: boolean) => {
    if (b) { this.state.qaReason = '' }
    this.setState({ qaModalVisible: b })
  }
  qaModeTextChange = ({ target: { value } }) => {
    this.setState({ qaReason: value });
  };


  /**
   * 到店次数
   */
  setArriveVisible = (visible: boolean) => {
    this.setState({
      arriveVisible: visible
    })
  }

  renderHeaderInfo = () => {
    const { customerData } = this.props.customerDetailMode.data
    const { showStyle } = this.state;
    if (showStyle == 1) { // 线索详情
      const { } = this.props;
      return (
        <>
          <span style={{ marginRight: 10 }}>客服：{customerData.leads_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>客户状态：{customerData.leads_status}</span>
        </>
      )
    } else if (showStyle == 2) { // 有效单详情
      return (
        <>
          <span style={{ marginRight: 10 }}>客服：{customerData.leads_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>邀约人：{customerData.req_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>客户状态：{customerData.req_status}</span>
        </>
      )
    } else if (showStyle == 3) { // 订单详情
      const { customerDetailMode: { orderDetail } } = this.props;
      return (
        <>
          <span style={{ marginRight: 10 }}>客服：{orderDetail?.orderInfo?.leads_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>邀约人：{orderDetail?.orderInfo?.req_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>销售：{orderDetail?.orderInfo?.order_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>客户销售状态：{orderDetail?.orderInfo?.phase_txt}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>进店状态：{orderDetail?.orderInfo?.arrival_status_txt}</span>
        </>
      )
    } else {  // 客户详情
      return (
        <>
          <span style={{ marginRight: 10 }}>客服：{customerData.leads_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>邀约人：{customerData.req_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>婚宴销售：{customerData.order_banquet_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>婚庆销售：{customerData.order_wedding_owner_name}</span>
          <span style={{ marginLeft: 50, marginRight: 10 }}>客户状态：{customerData.statusText}</span>
        </>
      )
    }
  }

  //推荐商家
  handleRecommend = (customerId: string, reqId: string, category: string, cityInfo: string) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/store/storeDetails',
      query: {
        customerId,
        reqId,
        category,
        cityInfo,
      }
    }))
  }

  //审批流审核
  handleReview = (aid: string) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/review/reviewlist/requirementBackToSeasDetail',
      state: {
        auditId: aid,
        reviewType: 3,
      }
    }))
  }

  // ---------------------  请求方法 -----------


  /**
   * 获取线索列表
   */
  handleCategoryLeadsList = (categoryId?: string) => {
    const { dispatch } = this.props;
    const { config } = this.props.customerDetailMode
    this.currentLeadsCategory = categoryId || this.findFirstLeadsCategoryId() || config?.category[0]?.id || '1'
    console.log('defaultCategory', 'currentLeadsCategory:' + this.currentLeadsCategory)
    dispatch({
      type: 'customerDetailMode/fetchCustomerLeadsList',
      payload: {
        customerId: this.state.customerId,
        category: this.currentLeadsCategory,
      },
    })
  }

  /**
   * 获取有效单列表
   */
  handleCategoryReqList = (categoryId?: string) => {
    const { dispatch } = this.props;
    const { config } = this.props.customerDetailMode
    this.currentCategoryId = categoryId || this.findFirstReqCategoryId() || config?.category[0]?.id || '1'
    dispatch({
      type: 'customerDetailMode/fetchReqList',
      payload: {
        customerId: this.state.customerId,
        aggregation: '1',
        category: this.currentCategoryId,
      },
    })
  }

  findFirstLeadsCategoryId = () => {
    const { category_num } = this.props.customerDetailMode.data.customerData
    const { config } = this.props.customerDetailMode
    if (config?.category && category_num && category_num.leads_category_num && category_num.leads_category_num.length > 0) {
      var map = new Map()
      category_num.leads_category_num.forEach(element => {
        map.set(element.id, element.num)
      });
      for (let element of config.category) {
        if (map.has(element.id) && (map.get(element.id) > 0)) {
          return element.id;
        }
      }
    }
  }

  findFirstReqCategoryId = () => {
    const { category_num } = this.props.customerDetailMode.data.customerData
    const { config } = this.props.customerDetailMode
    if (config?.category && category_num && category_num.req_category_num && category_num.req_category_num.length > 0) {
      var map = new Map()
      category_num.req_category_num.forEach(element => {
        map.set(element.id, element.num)
      });
      for (let element of config.category) {
        if (map.has(element.id) && (map.get(element.id) > 0)) {
          return element.id
        }
      }
    }
  }

  // ---------------------  订单请求方法

  /**
   * 搜索产品
   */
  handleSearchProductByKeyword = (keyword: string, hookback: (productList: ProductInfo[], total: number) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/searchProduct',
      payload: {
        keyword,
      },
      callback: (productList: ProductInfo[], total: number) => {
        hookback(productList, total);
      }
    });
  }

  /**
   * 确定绑定产品
   */
  handleBindProducts = (productIds: string) => {
    const { dispatch } = this.props;
    const { orderId } = this.state;
    dispatch({
      type: 'customerDetailMode/bindProduct',
      payload: {
        orderId,
        productIds,
      },
      callback: (success: boolean) => {
        if (success) {
          message.success("绑定成功！");
          this.fetchOrderDetails(this.state.orderId);
        }
      }
    });
  }

  /**
   * 解绑产品
   */
  handleUnbindProduct = (product: ProductInfo) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/unBindProduct',
      payload: {
        orderId: this.state.orderId,
        productId: product.id
      },
      callback: (success: boolean) => {
        if (success) {
          message.success("解除绑定产品成功！");
          // 刷新当前页面
          // this.refreshCustomerDetail();
          this.fetchOrderDetails(this.state.orderId);
        }
      }
    });
  }

  handleUpdateOrderInfo = (paramsObj: any) => {
    const { dispatch } = this.props;
    const { orderId } = this.state;
    dispatch({
      type: 'customerDetailMode/updateOrder',
      payload: paramsObj,
      callback: (success: boolean) => {
        if (success) {
          message.success("修改成功！");
        }
        this.refreshCustomerDetail();
        this.fetchOrderDetails(orderId);
      }
    });
  }

  // 展示删除记录弹框
  addReceivableRecordItemFunction = (value: any) => {
    this.setState({
      showEditAndAddReceivableRecordInfo: true,
      planId: {},
    })
  }

  // ----- 编辑单条
  editReceivableRecordItemFunction = (contactsInfoModel: any, plansModel: any, plansItemModel: PlansItemList) => {

    var typeNumber = 0
    if (contactsInfoModel?.id && plansModel?.plan_id && plansItemModel?.id) {
      // 定合同和定计划模式修改模式
      typeNumber = 3
      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        editReceivableRecordConstomerInfo: contactsInfoModel,
        editReceivableRecordInfoItem: plansModel,
        plansItemModel: plansItemModel,
        receivableRecordType: typeNumber,
      })

    } else if (contactsInfoModel?.id && plansModel?.plan_id) {
      // 定合同和定计划模式
      typeNumber = 2
      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        editReceivableRecordConstomerInfo: contactsInfoModel,
        editReceivableRecordInfoItem: plansModel,
        receivableRecordType: typeNumber,
      })
    } else if (contactsInfoModel?.id) {
      // 定合同和定计划模式
      typeNumber = 1
      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        editReceivableRecordConstomerInfo: contactsInfoModel,
        receivableRecordType: typeNumber,
      })
    } else {
      // 自选模式
      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        receivableRecordType: typeNumber,
      })
    }
  }

  // ----- 删除单条
  deleteReceivableRecordItemFunction = (value: any, model: PlansItemList) => {
    this.setState({
      showDeleteReceivableRecordInfoItem: true,
      editReceivableRecordInfoItem: model,
      planId: value,
    })
  }

  // 汇款
  showReceivableRecordDetailsFunction = (model: any) => {
    // console.log("model", model)
    this.setState({
      showReceivableRecordDetails: true,
      showReceivableRecordDetailsItem: model
    })
  }

  cancelReceivableRecordDetailsFunction = () => {
    this.setState({
      showReceivableRecordDetails: false,
      showReceivableRecordDetailsItem: {}
    })
  }

  // 确定
  addReceivableRecordItemRequetsFunction = (isEdit: boolean, value: any, objc: any) => {

    if (!isEdit) {
      Axios.post(URL.addReceivablesRecord, value).then(
        res => {
          if (res.code == 200) {

            message.success('修改成功');
            this.refreshCustomerDetail();
            this.fetchOrderDetails(this.state.orderId);

            this.setState({
              showEditAndAddReceivableRecordInfo: false,
              editReceivableRecordInfoItem: {},
            })
            const { form } = objc.formRef.props;
            form.resetFields();
          }
        }
      );
    } else {
      Axios.post(URL.editReceivablesRecord, value).then(
        res => {
          if (res.code == 200) {
            message.success('新建成功');
            this.refreshCustomerDetail();
            this.fetchOrderDetails(this.state.orderId);
            this.setState({
              showEditAndAddReceivableRecordInfo: false,
            })
            const { form } = objc.formRef.props;
            form.resetFields();
          }
        }
      );
    }

  }

  // 取消添加或编辑汇款记录
  cancelAddReceivableRecordItemFunction = (value: any) => {
    this.setState({
      showEditAndAddReceivableRecordInfo: false,
      editReceivableRecordInfoItem: {},
      editReceivableRecordConstomerInfo: {},
      plansItemModel: {},
    })
  }

  // -----用户搜索
  receivablesUserIdSearch = (value: any) => {
    const { dispatch } = this.props;

    const userListParams = { 'keywords': value }
    dispatch({
      type: 'customerDetailMode/getGroupUserList',
      payload: userListParams,
    });
  }

  // --------------------------------------------  UI方法 ---------------------------------------------

  /**
   * 一、到喜啦
      1、到喜啦归属人角色：添加有效单，联系协作人，客诉单，客户重复，推荐商家
      2、到喜啦协作人角色：联系归属人，客诉单
      3、领导：没有编辑和操作按钮
    二、喜庄和塞尔维
      1、喜庄和塞尔维归属人：添加有效单，联系协作人，客诉单，客户重复，退回公海，派发需求
      2、喜庄和塞尔维协作人：联系归属人，客诉单
      3、领导：没有编辑和操作按钮
    三、爱菲尔
      1、爱菲尔归属人：添加有效单，联系协作人，客诉单，客户重复，退回死海，派发需求
      2、爱菲尔协作人：联系归属人，客诉单
      3、领导：没有编辑和操作按钮
    四、其他业务线：同喜庄和塞尔维按钮展示逻辑
    
    2020.3.27：关于退回死海/公海按钮，四、其他业务线 两个一起展示。

    2020.3.20需求：
    归属人按钮全部展示，其他人同协作人按钮

    2020.5.13需求：
    喜铺全不要了。 根据showStyle 来显示按钮
   */
  getButtons = () => {
    const { showStyle } = this.state;
    const { orderDetail } = this.props.customerDetailMode;
    const { data: { customerData } } = this.props.customerDetailMode;
    const status = customerData.status;
    return (
      <>
        {
          showStyle === 3 ? (
            <span>
              {orderDetail?.orderInfo && orderDetail?.orderInfo?.phase !== 320 && <>
                {/* {this.btnOrderStatus()} */}
                {(!(orderDetail?.contractInfo) || orderDetail.contractInfo.length == 0) && orderDetail?.orderInfo?.show_money_button && this.btnCreateContract()}
                {/* {this.btnAddReceivablesPlan(orderDetail?.orderInfo?.show_money_button)} */}
                {/* {this.btnAddReceivablesRecord(orderDetail?.orderInfo?.show_money_button)} */}
                {/* {this.btnConfirmReserve()} */}
              </>}
            </span>
          ) : showStyle == 2 ? (
            <span>
              {this.btnAddReq()}
            </span>
          ) : showStyle == 1 ? (
            <span>
              {this.btnAddLeads()}
            </span>
          ) : showStyle == 4 ? (  // 添加 线索或有效单
            <>
              {
                status && status >= 100 && status < 200 && <span>
                  {this.btnAddLeads()}
                </span>
              }
              {
                status && status >= 200 && status < 300 && <span>
                  {this.btnAddReq()}
                </span>
              }
            </>
          ) : null
        }
      </>
    )
  }

  // 根据showStyle获取头部展示样式
  getHeaderUI = () => {
    const { showStyle } = this.state;
    const { editable } = this.state;
    const { config, orderDetail, permission, data: { customerData } } = this.props.customerDetailMode;
    if (!customerData) return null;
    // 订单展示需要参数
    let isDisabledButton = true;
    isDisabledButton = (orderDetail?.orderInfo?.arrival_status === 410 || orderDetail?.orderInfo?.arrival_status === 430)
    let customerLevelEditable = permission?.updatecustomerlevel == true || (!customerData.customerLevel)

    if (showStyle === 3) {
      return (
        <>
          <div className={styles.toolbarwrapper}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                {this.renderHeaderInfo()}
              </div>

              { // 操作按钮区域。 前提是非BI列表和提供人列表进入的：
                editable && (
                  <div>{this.getButtons()}</div>
                )
              }
            </div>
          </div>
        </>
      )
    } else {
    }

    return (
      <>
        <div className={styles.toolbarwrapper}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <span style={{ fontWeight: "bold", fontSize: 20 }}>{customerData.customerName}</span>
              <span style={{ marginLeft: 50, fontWeight: 'normal' }}>客户级别：{
                <Select onChange={this.onCustomerLevelChanged}
                  size='small'
                  value={customerData?.customerLevel ? customerData?.customerLevel + '' : ''}
                  disabled={!customerLevelEditable}
                  style={{ width: 70 }}>
                  {
                    config?.customerLevel && config?.customerLevel?.map(item => (<Option value={item.id + ''}>{item.name}</Option>))
                  }
                </Select>
              }</span>
            </div>

            <div style={{ marginTop: 10 }}>
              {this.renderHeaderInfo()}
            </div>

            { // 操作按钮区域。 前提是有操作权限, 且不是提供人和BI列表进入：
              editable && (
                <div>{this.getButtons()}</div>
              )
            }
          </div>
        </div>
      </>
    );
  }

  filterMyOperateReq = () => {
    const { data: { requirementData } } = this.props.customerDetailMode
    return !requirementData.my ? [] : requirementData.my.flatMap(value => value.data).filter(value => (value.phase == '1' || value.phase == '2' || value.phase == '6'))
  }


  handleNewCustomer = () => {
    const pathName = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/newCustomer';
    const { dispatch } = this.props;
    const { customerDetailMode: { data } } = this.props;
    dispatch(routerRedux.push({
      pathname: pathName,
      state: {
        customerData: data.customerData
      }
    }))
  }

  // ---------------------  订单页面头部按钮
  // 订单状态
  btnOrderStatus = () => {
    const { orderDetail } = this.props.customerDetailMode;
    const orderInfo = orderDetail ? orderDetail.orderInfo : undefined;
    // 状态修改
    const statusType = (
      <Menu>
        {orderInfo?.phaseItems && orderInfo?.phaseItems?.map((item: { id: string | number | undefined; name: {} | null | undefined; }) => {

          if (item.id === orderDetail?.orderInfo?.phase) {
            return (
              <Menu.Item key={item.id}>
                <div>
                  <a onClick={() => this.editOrderStateFunction(item.id)}>{item.name}</a>
                </div>
              </Menu.Item>
            );
          }
          return (
            <Menu.Item key={item.id}>
              <a onClick={() => {
                if (item.id === 320) {
                  Modal.confirm({
                    title: '确定改为无效？',
                    onOk: () => {
                      this.editOrderStateFunction(item.id)
                    }
                  })
                } else {
                  this.editOrderStateFunction(item.id);
                }

              }}>{item.name}</a>

            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <>
        {orderInfo?.show_order_phase_button ?
          <Dropdown overlay={statusType} >
            <Button className={styles.topbutton} type="primary">销售跟进状态</Button>
          </Dropdown> : ''
        }
      </>
    )
  }

  // +签订单合同
  btnCreateContract = () => {
    return (
      <Button className={styles.topbutton} type="primary" onClick={() => { this.categoryClick() }} ><PlusOutlined />签订单合同</Button>
    )
  }

  // +回款计划
  btnAddReceivablesPlan = (isDisabled: boolean) => {
    return isDisabled && (
      <Button className={styles.topbutton} type="primary" onClick={() => { this.editReceivableRecordPlanFunction() }} ><PlusOutlined />回款计划</Button>
    )
  }

  // +回款记录
  btnAddReceivablesRecord = (isDisabled: boolean) => {
    return isDisabled && (
      <Button className={styles.topbutton} type="primary" onClick={() => { this.editReceivableRecordItemFunction(undefined, undefined, undefined) }} ><PlusOutlined />回款记录</Button>
    )
  }

  /**
  * 确认到店
  * 点击有效后，出现再次进店的按钮
  * 无效：点击后，按钮无法再次点击
  */
  btnConfirmReserve = () => {
    const { orderDetail } = this.props?.customerDetailMode;
    const { reserve_confirm_count } = orderDetail;
    const title = '确认到店(' + reserve_confirm_count?.toString() + ')'
    if (orderDetail?.orderInfo?.show_confirm_arrival_button == 1) {
      return (
        <Button className={styles.topbutton} type="primary" onClick={() => { this.showConfirmShopFunction() }} >{reserve_confirm_count > 0 ? title : '确认到店'}</Button>
      )
    }
  }

  /**
   * 客服详情-添加品类按钮（添加线索）
   */
  btnAddLeads = () => {
    const { config } = this.props.customerDetailMode
    // const { showStyle } = this.state;
    let categorys = config?.category;
    // 2020-7-25 全国统一，不过滤品类 - yy
    // if (categorys) {
    //   /** 北京公司， 客服(需求)和邀约 不能添加婚纱礼服品类线索 */
    //   if (CrmUtil.getCompanyType() == 2 && (showStyle == 1 || showStyle == 2)) {
    //     categorys = categorys.filter(cate => cate.id + '' != '7');
    //   }
    // }
    const menu = (
      <Menu>
        {
          categorys?.map(categ => (
            <Menu.Item>
              <a onClick={() => this.handleCreateLeads("新建" + categ.name + "线索", Number(categ.id))}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <Dropdown overlay={menu} placement="bottomLeft">
        <Button className={styles.topbutton} type="primary"><PlusOutlined />添加品类</Button>
      </Dropdown>
    )
  }

  /**
   * 邀约详情 - 添加品类按钮 （添加有效单）
   */
  btnAddReq = () => {
    const { config, permission } = this.props.customerDetailMode
    // const { showStyle } = this.state;
    if (permission?.requirementadapter_createreq) {
      let categorys = config?.category;
      // 2020-7-25 全国统一，不过滤品类 - yy
      // if (categorys) {
      //   if (CrmUtil.getCompanyType() == 2 && (showStyle == 1 || showStyle == 2)) {
      //     categorys = categorys.filter(cate => cate.id + '' != '7');
      //   }
      // }
      const menu = (
        <Menu>
          {
            categorys?.map(categ => (
              <Menu.Item>
                <a onClick={() => this.handleCreateReq(categ)}>{categ.name}</a>
              </Menu.Item>
            ))
          }
        </Menu>
      );
      return <Dropdown overlay={menu} placement="bottomLeft">
        <Button className={styles.topbutton} type="primary"><PlusOutlined />添加品类</Button>
      </Dropdown>
    }
    return ''
  }

  handleShowQaReson = () => {
    const { reqLiteData } = this.props.customerDetailMode.data
    Modal.info({
      title: '无效原因',
      okText: "知道啦",
      content: (
        <div>{reqLiteData?.qt_result_reason}</div>
      ),
      onOk() { },
      width: "45%"
    });
  }

  /**
   * 根据不同的类型，显示不同tab栏
   */
  renderTabsByShowStyle = () => {
    const { showStyle } = this.state;
    return (
      <>
        {
          showStyle == 1 && (
            <Tabs activeKey={this.state.activeKey} type="card" style={{ marginTop: 15 }} onChange={this.handleTabsChanged}>
              {this.getTabCustomerInfo()}
              {this.getTabLeadsList()}
              {this.getTabContactsList()}
              {this.getTabCallRecordsList()}
              {this.getTabCustomerLogList()}
              {this.getTabProjectMember()}
            </Tabs>
          )
        }
        {
          showStyle == 2 && (
            <Tabs activeKey={this.state.activeKey} type="card" style={{ marginTop: 15 }} onChange={this.handleTabsChanged}>
              {this.getTabCustomerInfo()}
              {this.getTabContactsList()}
              {this.getTabLeadsList()}
              {this.getTabReqList()}
              {this.getTabOrderList()}
              {this.getTabCallRecordsList()}
              {this.getTabCustomerLogList()}
              {this.getTabProjectMember()}
              {this.getTabRecommendOrder()}
            </Tabs>
          )
        }
        {
          showStyle == 3 && (
            <Tabs activeKey={this.state.activeKey} type="card" style={{ marginTop: 15 }} onChange={this.handleTabsChanged}>
              {this.getTabOrderDetail()}
              {this.getTabCustomerInfo()}
              {this.getTabContactsList()}
              {this.getTabLeadsList()}
              {this.getTabReqList()}
              {this.getTabCallRecordsList()}
              {this.getTabContractInfo()}
              {this.getTabOrderReceivableRecordList()}
              {this.getTabCustomerLogList()}
              {this.getTabProjectMember()}
            </Tabs>
          )
        }
        {
          (showStyle == 4 || showStyle == 10) && (
            <Tabs activeKey={this.state.activeKey} type="card" style={{ marginTop: 15 }} onChange={this.handleTabsChanged}>
              {this.getTabCustomerInfo()}
              {this.getTabLeadsList()}
              {this.getTabContactsList()}
              {this.getTabReqList()}
              {this.getTabOrderList()}
              {this.getTabCallRecordsList()}
              {this.getTabCustomerLogList()}
              {this.getTabProjectMember()}
            </Tabs>
          )
        }
      </>
    )
  }
  /**
   * Tab - 客户信息
   */
  getTabCustomerInfo = () => {
    const { customerDetailMode: { config, permission, rulesUserInfo, data: { customerData }, allUser }, } = this.props;
    const { editable, customerPhoneDecryptText, customerWechatDecryptText } = this.state;
    console.log(customerPhoneDecryptText)
    return (
      <TabPane tab="客户信息" key="1">
        {
          permission && (
            <CustomerInfo
              permission={permission}
              editable={editable ? 1 : 0}
              customerData={customerData}
              config={config}
              allUser={rulesUserInfo?.into_user_list}
              onChange={this.updateCustomerInfo}
              customerPhoneDecryptText={customerPhoneDecryptText}
              customerWechatDecryptText={customerWechatDecryptText}
              onCheckPhone={() => { this.handleCheckOutPhoneNumber(1) }}
              onCheckWechat={() => { this.handleCheckOutPhoneNumber(2) }}
            >
            </CustomerInfo>
          )
        }

      </TabPane>
    )
  }

  /**
   * Tab - 客服详情 （原需求详情）（原：客户线索）
   */
  getTabLeadsList = () => {
    const { customerDetailMode: { config, customerLeadsListData, data: { customerData } } } = this.props;
    return (
      config && config?.category?.length > 0 &&
      <TabPane tab="客服详情" key="2" forceRender={true}>
        <CustomerLeads
          config={config}
          customerId={this.state.customerId}
          ownerId={customerData.leads_owner_id}
          onCustomerLeadsRef={this.onLeadsRef}
          customerLeadsListData={customerLeadsListData}
          fun_refreshCustomerLeadsAll={(categ: string) => {
            this.handleCategoryLeadsList(categ);
            this.fetchCustomerDetail();
          }}
          fun_refreshCustomerLeadsList={this.handleCategoryLeadsList}
          optionable={0}
          defaultCategoryId={this.currentLeadsCategory}
          category_num={customerData.category_num} />
      </TabPane>
    )
  }

  /**
   * Tab - 联系人
   */
  getTabContactsList = () => {
    const { customerDetailMode: { config, data: { contactUserData }, permission } } = this.props;
    const { editable } = this.state;
    return (
      <TabPane tab="联系人" key="3">
        <ContactTab
          editable={editable}
          contactUserData={contactUserData}
          config={config}
          onChanged={this.onContactChanged}
          permission={permission}></ContactTab>
      </TabPane>
    )
  }

  /**
   * Tab - 邀约详情（原：意向需求）
   */
  getTabReqList = () => {
    const { customerDetailMode: { config, data: { customerData }, reqGroupData } } = this.props;
    const { editable } = this.state;
    return (
      <TabPane tab="邀约详情" key="4" forceRender={true}>
        {
          customerData.customerId && config && config?.category?.length > 0 &&
          <CategoryReq
            customerId={customerData.customerId}
            optionable={editable}
            config={config}
            leadsId={'0'}
            ownerId={customerData.req_owner_id}
            reqGroupDetails={reqGroupData}
            onCategoryReqRef={this.onRef}
            fun_refreshCategoryAll={(categoryId: string) => {
              this.refreshCustomerDetail()
              this.handleCategoryReqList(categoryId)
              this.orderRef?.requstData()
              this.recommendOrderRef?.requstData()
            }}
            fun_recommend={this.handleRecommend}
            fun_review={this.handleReview}
            fun_refreshCategoryReqList={this.handleCategoryReqList}
            defaultCategoryId={this.currentCategoryId}
            category_num={customerData.category_num}
          />
        }
      </TabPane>
    )
  }

  /**
   * Tab - 订单信息列表（针对客户详情的）
   */
  getTabOrderList = () => {
    return (
      <TabPane tab="订单信息" key="5">
        <OrderInfo onRef={this.onOrderRef} customerId={this.state.customerId} loading={this.props.loading} columns={this.orderListColumns} />
      </TabPane>
    )
  }

  /**
   * Tab - 订单信息详情（针对订单详情的）
   */
  getTabOrderDetail = () => {
    const { customerDetailMode: { config, orderDetail, allUser, permission } } = this.props;
    return (
      <TabPane tab="订单信息" key="6">
        {
          orderDetail && (
            <OrderDetailsInfo
              orderInfo={orderDetail.orderInfo}
              canUpdateOrderTag={orderDetail.commonInfo.canUpdateOrderTag}
              bindedProducts={orderDetail.product}
              config={config}
              permission={permission}
              allUsersList={allUser}
              onSearchProductByKeyWord={this.handleSearchProductByKeyword}
              onBindProduct={this.handleBindProducts}
              onUnbindProduct={this.handleUnbindProduct}
              onUpdateOrderInfo={this.handleUpdateOrderInfo}
            />
          )
        }
      </TabPane>
    )
  }

  /**
   * Tab - 通话记录（质检核查）列表（针对订单详情的）
   */
  getTabCallRecordsList = () => {
    const { customerDetailMode: { permission } } = this.props;
    const listenrecorder = permission ? permission.listenrecorder : false;
    const callcenteradapter_getrecordlist = permission ? permission.callcenteradapter_getrecordlist : false;
    return (
      callcenteradapter_getrecordlist && (
        <TabPane tab="通话记录" key="7">
          <QualityInspection customerId={this.state.customerId} listenrecorder={listenrecorder} showStyle={this.state.showStyle} />
        </TabPane>
      )
    )
  }


  /**
   * Tab - 合同信息
   */
  getTabContractInfo = () => {
    const { customerDetailMode: { permission } } = this.props;
    const { contractList } = this.props.customerDetailMode;
    if (!permission?.hidecontractandreceivables) {
      return (
        <TabPane tab="合同信息" key="8">
          {
            contractList && (
              <ContractTab editegiscontract={permission?.editegiscontract} contractList={contractList} orderId={this.state.orderId} />
            )
          }
        </TabPane>
      )
    }

  }

  /**
   * Tab - 回款记录
   */
  getTabOrderReceivableRecordList = () => {
    const { customerDetailMode: { orderDetail, permission } } = this.props;
    if (!permission?.hidecontractandreceivables) {
      if (orderDetail?.contractInfo && orderDetail?.contractInfo?.audit_status == 3) {
        return (
          orderDetail && <TabPane tab="回款记录" key="9">
            <OrderDetailsReceivableRecordList
              refunRecordModels={orderDetail.receivablesRecord ? orderDetail.receivablesRecord : []}
              showAddModal={this.addReceivableRecordItemFunction}
              editModal={this.editReceivableRecordItemFunction}
              deleteModal={this.deleteReceivableRecordItemFunction}
              editPlanModel={this.editReceivableRecordPlanFunction}
              showItemDetails={this.showReceivableRecordDetailsFunction}
              orderInfo={orderDetail?.orderInfo ?? {}}
            />
          </TabPane>
        )
      }
    }
  }

  /**
   * Tab - 客户日志
   */
  getTabCustomerLogList = () => {
    const { permission } = this.props.customerDetailMode
    return (
      permission?.showlog && <TabPane tab="客户日志" key="10">
        <OperationLogPage logRef={this.onLogRef} customerId={this.state.customerId} type={this.state.showStyle} />
      </TabPane>
    )
  }


  /**
 * Tab - 项目成员
 */
  getTabProjectMember = () => {
    const { customerDetailMode: { permission } } = this.props;
    const showteam = permission ? permission.showteam : false;
    return (
      showteam && (
        <TabPane tab="项目成员" key="11">
          <ProjectMember
            type={this.state.showStyle}
            category={this.currentCategoryId}
            customerId={this.state.customerId}
            newProjectMembers={this.newProjectMembers}
            editProjectMembers={this.editProjectMembers}
          />
        </TabPane>
      )
    )
  }

  /**
 * Tab - 推荐订单
 */
  getTabRecommendOrder = () => {
    const { customerDetailMode: { permission } } = this.props;
    const showpushordertab = permission ? permission.showpushordertab : false;
    return (
      showpushordertab && (
        <TabPane tab="推荐订单" key="12">
          <OrderInfo onRef={this.onRecommendOrderRef} customerId={this.state.customerId} loading={this.props.loading} from="1.0.0" />
        </TabPane>
      )
    )
  }

  renderTitle = () => {
    if (this.state.showStyle == 1) {
      return '客户详情'
    } else if (this.state.showStyle == 2) {
      return '邀约详情'
    } else if (this.state.showStyle == 3) {
      return '订单详情'
    } else if (this.state.showStyle == 4 || this.state.showStyle == 10) {
      return '客户详情'
    }
    return ''
  }

  render() {
    const { isFriend, config, moneyConfig, userList, merchantList, customerFollowInfo, orderDetail, percentUserList, percentUserListForReqBI } = this.props.customerDetailMode;
    const { customerData, contactUserData, followData } = this.props.customerDetailMode.data
    const { loading } = this.props;

    return (
      <PageHeaderWrapper title={this.renderTitle()}>
        <Spin spinning={!!loading} style={{ width: '100%' }}>
          {
            config && (
              <>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={24}>
                    <Card bordered={false}>
                      {this.getHeaderUI()}
                    </Card>
                  </Col>
                </Row>

                <Row gutter={{ md: 24, lg: 24, xl: 24 }} style={{ marginTop: 20 }}>
                  <Col span={17}>
                    <Card bordered={false}>
                      {
                        this.renderTabsByShowStyle()
                      }
                    </Card>
                  </Col>

                  <Col span={7}>
                    <Card bordered={false}>
                      {
                        followData && (
                          <FollowView showStyle={this.state.showStyle}
                            followList={customerFollowInfo}
                            showAddNewDynamicFunction={this.addSalesOfDynamicFunction}
                            getFollowFounction={this.getFollowList}
                            customerData={customerData}
                            followData={followData}
                          />
                        )
                      }
                    </Card>
                  </Col>
                </Row>

                <Drawer
                  width={590}
                  visible={this.state.showAddFollowInfo}
                  closable={true}
                  onClose={this.canceladdSalesOfDynamicFunction}>
                  <div>
                    <RntryFollow
                      customerId={this.state.customerId}
                      showStyle={this.state.showStyle}
                      customer={customerData ? customerData : {}}
                      customerConfig={config}
                      followData={followData}
                      isFriend={isFriend}
                      relationId={this.state.orderId}
                      isShowStatusBlock={true}
                      getFollowList={this.getFollowList}
                      hiddenFollowInfo={this.canceladdSalesOfDynamicFunction}
                      contacts={contactUserData}
                      refreshFunction={() => {
                        this.fetchCustomerDetail()
                        if (this.state?.showStyle === 3) {
                          this.fetchOrderDetails(orderDetail?.orderInfo?.id)
                        }
                        this.handleCategoryReqList(this.currentCategoryId)
                        this.handleCategoryLeadsList(this.currentLeadsCategory)
                        this.logRef?.requestData(1)
                      }}
                      tab={this.state.tab}
                      orderDetail={orderDetail}
                    />
                  </div>
                </Drawer>

                <Modal
                  title='填写协作单'
                  visible={this.state.collaModalVisible}
                  centered
                  destroyOnClose={true}
                  onOk={this.onCollaModeSure}
                  onCancel={() => this.setCollaVisible(false)}>
                  <TextArea
                    onChange={this.collaModeTextChange}
                    placeholder='请填写需要协作的内容'
                    rows={6}>
                  </TextArea>
                </Modal>

                <Modal
                  title='质检无效原因'
                  visible={this.state.qaModalVisible}
                  centered
                  destroyOnClose={true}
                  onOk={this.onQAModeSure}
                  onCancel={() => this.setQaVisible(false)}>
                  <TextArea
                    onChange={this.qaModeTextChange}
                    placeholder='请填写质检无效原因'
                    rows={6}>
                  </TextArea>
                </Modal>

                {/* 确认到店 */}
                <OrderDetailsConfirmShop
                  visible={this.state?.isShowConfirmShop}
                  saveFunction={this.confirmShopRequetsFunction}
                  onCancel={this.cancelShowConfirmShopFunction}
                  data={this.state?.reserveData}
                  orderDetail={orderDetail}
                />

                {/***编辑添加回款记录 */}
                {
                  orderDetail &&
                  <ShowEditAndAddReceivableRecord
                    saveFunction={this.addReceivableRecordItemRequetsFunction}
                    onCancel={this.cancelAddReceivableRecordItemFunction}
                    receivablesUserIdSearch={this.receivablesUserIdSearch}
                    visible={this.state.showEditAndAddReceivableRecordInfo}
                    orderInfo={orderDetail?.orderInfo}
                    moneyonfig={moneyConfig}
                    userList={userList}
                    currentUserId={this.state.currentUserId ? this.state.currentUserId : ''}
                    currentUserName={this.state.currentUserName ? this.state.currentUserName : ''}
                    type={this.state.receivableRecordType}
                    contactsInfo={this.state.editReceivableRecordConstomerInfo}
                    planInfo={this.state.editReceivableRecordInfoItem}
                    plansItemModel={this.state?.plansItemModel}
                  />
                }

                {/**删除单条回款计划 */}
                <ShowDeleteReceivableRecord
                  saveFunction={this.deleteReceivableRecordItemRequetsFunction}
                  onCancel={this.cancelDeleteReceivableRecordItemFunction}
                  visible={this.state.showDeleteReceivableRecordInfoItem}
                  data={this.state.editReceivableRecordInfoItem}
                  planId={this.state.planId}
                />

                {/** 回款计划调整和新增*/}
                {
                  orderDetail &&
                  <ShowEditReceivableRecordPlan
                    saveFunction={this.editReceivableRecordPlanRequetsFunction}
                    onCancel={this.cancelReceivableRecordPlanFunction}
                    visible={this.state.showEditReceivableRecordPlan}
                    data={orderDetail.receivablesRecord}
                    orderInfo={orderDetail.orderInfo}
                    contractInfo={this.state?.editReceivabRecordPlanItemModel}
                    planId={this.state.planId}
                  />
                }


                {/**回款记录详情 */}
                <OrderReceivableRecordDetails
                  isVisble={this.state.showReceivableRecordDetails}
                  cancelFunction={this.cancelReceivableRecordDetailsFunction}
                  model={this.state.showReceivableRecordDetailsItem}
                />

                {/* 项目成员 */}
                <NewEditProjectMembersPage
                  saveFunction={this.saveProjectMembers}
                  onCancel={this.hiddenProjectMembers}
                  visible={this.state?.isShowNewEditProjectMembers}
                  customer={customerData ? customerData : {}}
                  orderDetail={orderDetail ? orderDetail : {}}
                  showStyle={this.state?.showStyle}
                  allUser={(this.isBIReqDetail() ? percentUserListForReqBI : percentUserList) ?? []}
                  projectMembersModel={this.state?.editProjectMembersModel}
                />
              </>
            )
          }
        </Spin>
      </PageHeaderWrapper>
    );
  }

  orderListColumns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户编号',
      dataIndex: 'customer_id',
      key: 'customer_id',
    },
    {
      title: '客户姓名',
      dataIndex: 'customer_name',
      key: 'customer_name',
    },
    {
      title: '渠道来源',
      dataIndex: 'channel_txt',
      key: 'channel',
    },
    {
      title: '提供人',
      dataIndex: 'order_user_name',
      key: 'order_user_name',
    },
    {
      title: '入库时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '客资实时状态',
      dataIndex: 'customer_status_txt',
      key: 'customer_status_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'category_txt',
      key: 'category_txt',
    },
    {
      title: '最新沟通时间',
      dataIndex: 'follow_time',
      key: 'follow_time',
    },
    {
      title: '最新沟通记录',
      dataIndex: 'follow_content',
      key: 'follow_content',
    },
    {
      title: '销售状态',
      dataIndex: 'phase_txt',
      key: 'phase',
    },
    {
      title: '客户级别',
      dataIndex: 'customer_level_txt',
      key: 'customer_level_txt',
    },
    {
      title: '销售级别',
      dataIndex: 'follow_tag_txt',
      key: 'follow_tag_txt',
    },
    {
      title: '跟进结果',
      dataIndex: 'follow_status_txt',
      key: 'follow_status_txt',
    },
    {
      title: '客服',
      dataIndex: 'leads_owner_name',
      key: 'leads_owner_name',
    },
    {
      title: '邀约人',
      dataIndex: 'req_owner_name',
      key: 'req_owner_name',
    },
    {
      title: '销售',
      dataIndex: 'order_owner_name',
      key: 'order_owner_name',
    },
  ]

}




export default TableList;