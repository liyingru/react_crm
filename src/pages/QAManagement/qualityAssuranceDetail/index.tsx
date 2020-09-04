import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';

import { Spin, Card, Tabs, Button, message, Divider, Row, Col, Menu, Dropdown, Modal, Checkbox, Empty, Tag, Drawer, Form, Select, Input, Alert, List } from 'antd';
import getUserInfo from '@/utils/UserInfoStorage'
import styles from '@/pages/CustomerManagement/customerDetail/xp/index.less';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { Action, Dispatch } from 'redux';
import { StateType } from './model';
import { connect } from 'dva';
import CustomerAll from '@/pages/CustomerManagement/customerDetail/components/customerall';
import CustomerInfo from '@/pages/CustomerManagement/customerDetail/xp/components/customerinfo';
import ContactTab from '@/pages/CustomerManagement/customerDetail/components/contactlist';
import FollowView from '../../CustomerManagement/customerDetail/xp/components/followView';
import ContractTab from '../../OrderManagement/orderDetails/components/OrderDetailsContractInfo';
import TeamTab from '@/pages/CustomerManagement/customerDetail/components/projectteam';
import CustomerRequire from '@/pages/CustomerManagement/customerDetail/components/customrequir';
import RntryFollow from '../../CustomerManagement/customerDetail/xp/components/rntryFollow';
import QualityInspection from './components/qualityInspection';
import OrderInfo from '@/pages/CustomerManagement/customerDetail/components/OrderInfo';

import LOCAL from '@/utils/LocalStorageKeys';
import { RequirementData, ContactUserData, RequirementBean, CustomerData, ProjectTeam } from '@/pages/CustomerManagement/customerDetail/dxl/data';
import RequirementInfo from '@/pages/CustomerManagement/customerDetail/components/requirment';
import { routerRedux } from 'dva/router';
import { declareExportDeclaration } from '@babel/types';
import TransferToUserForm, { FormValueType } from '@/components/TransferToUserForm';
import { ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { type } from 'os';

import FormItem from 'antd/lib/form/FormItem';

import CustomerChildrenModal from '@/pages/CustomerManagement/customerDetail/components/CustomerChildren';
import StartCustomerComplaintModal from '@/components/StartCustomerComplaintModal';
import CooperationTab from '@/pages/CustomerManagement/customerDetail/components/cooperation';
import CrmUtil from '@/utils/UserInfoStorage';
import CategoryReq from './components/CategoryReq';
import CustomerLeads from '@/pages/DxlLeadsManagement/dxlLeadsList/components/CustomerLeads';
import { CustomerLeadsData } from '@/pages/LeadsManagement/leadsDetails/data';
import OperationLogPage from '@/pages/CustomerManagement/customerDetail/xp/components/OperationLogPage';



const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;


interface TableListProps {
  dispatch: Dispatch<
    Action<any>
  >;
  loading: boolean;
  qaManagementDetail: StateType;
}

interface TableListState {
  customerId: string;
  reqId: string;
  showStyle: 0 | 1;   // 0 表示客户， 1 表示有效单
  readOrWrite: 0 | 1;  // 0 表示只读    1  表示可操作
  contactShow: boolean;
  modalVisible: boolean;
  postModalVisible: boolean;
  // 添加跟进
  showAddFollowInfo: boolean;

  transVisible: boolean;
  postVisible: boolean;
  checkedValue: Array<CheckboxValueType>;

  postSelected: string;
  postSelectedId: string;
  isFinshRequestWeChat: boolean;

  customerChildrenModalVisible: boolean;

  collaModalVisible: boolean;
  collaReason: string;

  complaintLoading: boolean;
  complaintModalVisible: boolean;

  backModalVisible: boolean; //退回×海
  backToSeaReason: string,
  backToSeaRemark: string,

  redistributeModalVisible: boolean;
  selectCompany: string;

  isFirstFollowRequets: boolean,
  // 跟进记录请求的标签
  tab: string,

  activeKey: string;

  arriveVisible: boolean;

  isFirstConfigRequest: boolean;
}


@connect(
  ({
    qaManagementDetail,
    loading,
  }: {
    qaManagementDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    qaManagementDetail,
    loading: loading.models.qaManagementDetail,
  }),
)

class TableList extends Component<TableListProps, TableListState>{

  child: any;
  orderRef: any;
  qaRef: any;
  currentUserInfo: any;
  logRef: any;

  backType: number = 3; //3退回公海 4退回死海
  collaType: number = 1; //1:联系协作人,2:联系归属人

  currentCategoryId: string | undefined;

  state: TableListState = {
    showStyle: 0,
    readOrWrite: 1,
    contactShow: false,
    modalVisible: false,
    postModalVisible: false,
    showAddFollowInfo: false,
    transVisible: false,
    postVisible: false,
    postSelected: '',
    postSelectedId: '',

    checkedValue: [],

    reqId: '',
    customerChildrenModalVisible: false,
    customerId: '',
    isFinshRequestWeChat: false,
    collaModalVisible: false,
    collaReason: '',

    complaintLoading: false,
    complaintModalVisible: false,

    backModalVisible: false,
    backToSeaReason: '',
    backToSeaRemark: '',

    redistributeModalVisible: false,
    selectCompany: '',

    // 第一次请求跟进
    isFirstFollowRequets: true,

    activeKey: "2",

    arriveVisible: false,

    isFirstConfigRequest: true,
  }

  constructor(props: TableListProps) {
    super(props);
    this.currentUserInfo = CrmUtil.getUserInfo() || {};
    console.log('收到参数' + JSON.stringify(props.location.state))
  }

  componentDidMount() {
    console.log('收到参数' + JSON.stringify(this.props.location))
    this.getOrderDetailsFunction()
    this.setState({
      isFinshRequestWeChat: false
    })
  }

  componentWillReceiveProps = (nextProps: any) => {
    const { qaManagementDetail: { data: { customerData } } } = nextProps;
    const { isFinshRequestWeChat } = this.state;
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
          type: 'qaManagementDetail/getIsFriend',
          payload: values,
        });
        this.setState({
          isFinshRequestWeChat: true
        });
      };

    }
  }



  getOrderDetailsFunction = () => {
    var showStyle: 0 | 1 = 0;
    var reqId;
    var customerId;
    let readOrWrite;

    if (this.props.location.state) {
      if (this.props.location.state.showStyle) {
        showStyle = this.props.location.state.showStyle;
      }
      customerId = this.props.location.state.customerId;
      reqId = this.props.location.state.reqId;
      readOrWrite = this.props.location.state.readOrWrite == undefined ? 1 : this.props.location.state.readOrWrite;
    }

    this.state.readOrWrite = readOrWrite;

    if (!customerId) {
      const currentUrl = window.location.href;
      if (currentUrl.indexOf("customerId=") > 0) {
        if (currentUrl.indexOf("&") > 0) {
          customerId = currentUrl.substr(currentUrl.indexOf("=") + 1, currentUrl.indexOf("&") - currentUrl.indexOf("=") - 1);
        } else {
          customerId = currentUrl.substr(currentUrl.indexOf("=") + 1);
        }
      }
    }

    if (!reqId) {
      const currentUrl = window.location.href;
      if (currentUrl.indexOf("reqId=") > 0) {
        reqId = currentUrl.substr(currentUrl.lastIndexOf("=") + 1);
        showStyle = 1;
      }
    }

    this.state.showStyle = showStyle;
    this.state.reqId = reqId;
    this.state.customerId = customerId;

    //详情打开意向需求tab，其他打开客户信息tab
    this.state.activeKey = showStyle == 1 ? "4" : "2"

    const { dispatch } = this.props;

    this.fetchCustomerDetail();

    // 用户权限
    dispatch({
      type: 'qaManagementDetail/getUserPermissionList',
      payload: '',
    });
  }

  // 跟进数据
  getFollowList = (tab: string, showStyle: 0 | 1, isRequetsCustomerDate: boolean, customerId?: string, reqId?: string) => {
    const { dispatch } = this.props;
    let values = {}
    values['customerId'] = customerId ? customerId : this.state.customerId;
    values['tab'] = tab;
    values['type'] = 5
    values['relationId'] = customerId ? customerId : this.state.customerId;

    dispatch({
      type: 'qaManagementDetail/getFollowList',
      payload: values,
    });

    // 同步tab标签
    this.setState({
      tab: tab,
    })

    if (isRequetsCustomerDate) {
      this.fetchCustomerDetail()
    }
  }

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

  tabsChanged = (activeKey: string) => {
    this.setState({
      activeKey,
    })
  }

  fetchCustomerDetail = () => {
    const { dispatch } = this.props;
    const { customerId, reqId, showStyle, isFirstFollowRequets } = this.state;
    const { allUser, config, rulesUserInfo } = this.props.qaManagementDetail
    const params = {
      customerId: customerId,
      reqId: reqId,
    }
    dispatch({
      type: 'qaManagementDetail/fetchQaDetail',
      payload: params,
      callback: (data: any) => {
        if (isFirstFollowRequets) {
          this.setState({
            isFirstFollowRequets: false,
          }, () => {
            if (data?.followData?.followTab?.length > 0) {
              let item = data?.followData?.followTab[0]
              this.getFollowList(item.key, showStyle, false, customerId, reqId);
            } else {
              this.getFollowList("1", showStyle, false, customerId, reqId);
            }

            this.handleCategoryReqList(data?.reqQaLiteData?.top_category)
          })
        }

        if (!allUser || allUser?.length == 0) {
          this.getCompanyUserList(data?.customerData?.company_id)
        }
        if (!config?.category) {
          this.getCompanyConfig(data?.customerData?.company_id)
        }

        if ((rulesUserInfo?.into_user_list ?? []).length == 0) {
          dispatch({
            type: 'qaManagementDetail/getRulesUserInfo',
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

  getCompanyConfig = (companyId: number) => {
    if (!companyId) return;
    const { dispatch } = this.props;
    // 获取公共配置信息
    dispatch({
      type: 'qaManagementDetail/config',
      payload: {
        companyId: companyId
      },
      callback: (success: boolean, msg: string) => { }
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
      type: 'qaManagementDetail/getAllUser',
      payload: params,
    });
  }

  onContactChanged = (bean: ContactUserData, callback: () => void) => {
    const { customerData } = this.props.qaManagementDetail.data
    const { dispatch } = this.props;
    Axios.post((bean['contactId'] == undefined || bean['contactId'] == "") ? URL.createContactUser : URL.updateContactUser, {
      ...bean,
      customerId: customerData.customerId,
    }).then(
      res => {
        if (res.code == 200) {
          callback();
          message.info('操作成功');
          this.fetchCustomerDetail();
        }
      }
    );
  }

  onTeamChanged = (params: any, isCreate: boolean, callback: () => void) => {
    const { customerData } = this.props.qaManagementDetail.data
    const { dispatch } = this.props;
    Axios.post(isCreate == true ? URL.createReqTeam : URL.updateReqTeam, {
      ...params
    }).then(
      res => {
        if (res.code == 200) {
          callback();
          message.info('操作成功');
          this.fetchCustomerDetail();
        }
      })
  }

  onDeleteTeam = (reqId: string) => {
    const { customerData } = this.props.qaManagementDetail.data
    const { dispatch } = this.props;
    Axios.post(URL.deleteReqTeam, {
      reqId: reqId
    }).then(
      res => {
        if (res.code == 200) {
          message.info('操作成功');
          this.fetchCustomerDetail();
        }
      })
  }

  // 跟进记录
  addSalesOfDynamicFunction = () => {
    this.setState({
      showAddFollowInfo: true,
    })
  }

  // 取消
  canceladdSalesOfDynamicFunction = () => {
    this.setState({
      showAddFollowInfo: false,
    })
  }
  // 请求
  addSalesOfDynamicRequetsFunction = (value: any) => {
    const { data: customerDetail } = this.props.qaManagementDetail

    value["type"] = '2'
    value["customerId"] = customerDetail.customerData.customerId;
    value['relationId'] = this.state.reqId;

    console.log(value)

    Axios.post(URL.createFollow, value).then(
      res => {
        if (res.code == 200) {

          message.success('操作成功');

          this.getOrderDetailsFunction()
          this.setState({
            showAddFollowInfo: false,
          })
        }
      }
    );
  }

  updateCustomerInfo = (params: CustomerData, callback: () => void) => {
    const { customerData } = this.props.qaManagementDetail.data
    const { dispatch } = this.props;
    Axios.post(URL.updateCustomer, params).then(
      res => {
        if (res.code == 200) {
          callback();
          message.info('操作成功');
          localStorage?.setItem('qaListRefreshTag', 'list')
          this.fetchCustomerDetail();
        }
      })
  }

  // 显示转给同事弹框

  showTransferModal = () => {
    if (this.state.checkedValue.length == 0) {
      message.info('请选择转移的有效单')
      return;
    }
    this.setState({
      transVisible: false,
      modalVisible: true,  // !!可以把undefined转成false
    });
  }

  showPostModal = () => {
    if (this.state.checkedValue.length == 0) {
      message.info('请选择派发的有效单')
      return;
    }
    this.setState({
      postVisible: false,
      postModalVisible: true,
    });
  }

  //是否显示转让弹框方法
  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,  // !!可以把undefined转成false
    });
  };

  //转让客户给同事
  handleTransfer = (fields: FormValueType) => {
    const { dispatch } = this.props;
    const valuesResult = {
      ...fields,
      'reqId': this.state.checkedValue.join(',')
    }
    dispatch({
      type: 'qaManagementDetail/transferCustomer',
      payload: valuesResult,
      callback: this.onTransferCustomerCallback,
    });
  }

  //转让客户回调
  onTransferCustomerCallback = (result: boolean, msg: String) => {
    const { customerData } = this.props.qaManagementDetail.data
    const { dispatch } = this.props;
    if (result) {
      message.success('转让成功');
      this.handleModalVisible(false);
      this.fetchCustomerDetail();
      this.handleCategoryReqList(this.currentCategoryId)
    } else {
      this.handleModalVisible(true);
    }
  };

  //取消转让按钮方法调用
  handleCancelTransfer = () => {
    //取消转让后隐藏弹框
    this.handleModalVisible(false);
  }

  onRef = (ref: any) => {
    this.child = ref
  }

  onOrderRef = (ref: any) => {
    this.orderRef = ref
  }

  onQaRef = (ref: any) => {
    this.qaRef = ref
  }

  onLogRef = (ref: any) => {
    this.logRef = ref
  }

  categoryClick = (item: ConfigListItem) => {
    this.child.handleSelectCategory("新建" + item.name + "有效单", Number(item.id))
  }

  onCloseClick = (bean: RequirementBean) => {
    this.child.handleCloseReq(bean)
  }

  onPostDrawpClick = (bean: RequirementBean) => {
    this.setState({
      postSelectedId: bean.id,
      postVisible: false,
      postModalVisible: true,
    })
  }

  onRecMechantDrawpClick = (bean: RequirementBean) => {
    this.child.handleRecommend(bean)
  }

  handleTransVisible = (flag: boolean) => {
    if (flag == true) {
      this.setState({
        checkedValue: []
      })
    }
    this.setState({ transVisible: flag });
  };


  handlePostVisible = (flag: boolean) => {
    if (flag == true) {
      this.setState({
        checkedValue: []
      })
    }
    this.setState({ postVisible: flag });
  };


  handleDuplicate = () => {
    // 进入客户重单发起页
    const { dispatch, qaManagementDetail: { data } } = this.props;
    const customerId = data.customerData.customerId;
    if (customerId) {
      dispatch({
        type: 'qaManagementDetail/startDuplicateCustomer',
        payload: {
          customerData: data.customerData
        }
      });
    }
  };

  /**
   * 查看当前客户的亲子单
   */
  handleChildrenSheet = () => {
    const { dispatch } = this.props;
    const { qaManagementDetail: { data } } = this.props;
    const customerId = data.customerData.customerId;
    dispatch({
      type: 'qaManagementDetail/getCustomerChildren',
      payload: {
        customerId
      },
      callback: (success: boolean) => {
        if (success) {
          this.setState({
            customerChildrenModalVisible: true
          })
          const { qaManagementDetail: { customerChildrenData } } = this.props;
          Modal.info({
            title: '亲子单详情',
            okText: "知道啦",
            content: (
              <CustomerChildrenModal
                data={customerChildrenData}
                checkoutCustomerDetail={this.checkOtherCustomerDetail}
              />
            ),
            onOk() { },
            width: "45%"
          });
        }
      }
    });
  }

  checkOtherCustomerDetail = (customerId: string) => {
    const { showStyle } = this.state;
    const currentUrl = window.location.href;
    const index = showStyle == 0 ? currentUrl.indexOf("/customer/") : currentUrl.indexOf("/demand/");
    const targetUrl = currentUrl.substring(0, index) + "/customer/customerManagement/customerDetail";
    window.open(targetUrl + "?customerId=" + customerId);
  }


  transWrapperClick = (e: any) => {
    console.log(e.key)
    if (e.key === '3') {
      this.setState({
        transVisible: false,
        postVisible: false
      });
    }
  }

  transReqChange = (checkedValue: Array<CheckboxValueType>) => {
    this.setState({
      checkedValue: checkedValue
    })
  }



  postOkHandle = () => {
    const { customerData } = this.props.qaManagementDetail.data
    const { dispatch } = this.props;
    if (this.state.postSelected == '') {
      message.error("请选择接收人");
      return;
    }
    if (this.state.postSelectedId == '') {
      message.error("请选择有效单");
      return;
    }
    const params = {
      reqId: this.state.postSelectedId,
      ownerId: this.state.postSelected,
    };
    Axios.post(URL.updateReq, params).then(
      res => {
        if (res.code == 200) {
          message.info('操作成功');
          this.setState({
            postSelected: '',
            postSelectedId: ''
          })
          localStorage?.setItem('qaListRefreshTag', 'list')
          this.setPostModalVisible(false)
          this.getOrderDetailsFunction()
        }
      })
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
          this.fetchCustomerDetail()
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
    const { associates } = this.props.qaManagementDetail.data.reqQaLiteData
    if (this.collaType == 1 && !associates) {
      message.info('暂无协作人，请到线索详情添加协作人')
      return
    }
    this.setCollaVisible(true)
  };


  //退回X海Modal->确定按钮
  onBackModeSure = () => {
    if (!this.state.backToSeaReason || this.state.backToSeaReason == '') {
      message.error("请选择退回原因");
      return;
    }
    const params = {
      reqId: this.state.reqId,
      reasonId: this.state.backToSeaReason,
      remark: this.state.backToSeaRemark,
    };
    const { dispatch } = this.props;
    dispatch({
      type: this.backType == 3 ? 'qaManagementDetail/backToPubSea' : 'qaManagementDetail/backToDeadSea',
      payload: {
        ...params
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.info(msg);
          localStorage?.setItem('qaListRefreshTag', 'list')
          this.setBackVisible(false);
          // 退出当前详情页
          history.back();
        }
      }
    })
  }
  setBackVisible = (visible: boolean) => {
    if (visible) {
      this.setState({
        backToSeaRemark: "",
        backToSeaReason: "",
      })
    }
    this.setState({
      backModalVisible: visible,
    })
  }

  backModeTextChange = ({ target: { value } }) => {
    this.setState({
      backToSeaRemark: value
    });
  };

  /**
   * 退回公海/死海的原因选择
   */
  onBackReasonChanged = (value: string) => {
    this.setState({ backToSeaReason: value })
  }


  setPostModalVisible = (visible: boolean) => {
    this.setState({ postModalVisible: visible })
  }

  onChange = (value: string) => {
    this.setState({ postSelected: value })
  }

  onReqLevelChange = (value: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'qaManagementDetail/updateReqLite',
      payload: {
        reqId: this.state.reqId,
        level: value
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success('有效单级别修改成功');
          localStorage?.setItem('qaListRefreshTag', 'list')
          this.fetchCustomerDetail();
          this.handleCategoryReqList(this.currentCategoryId)
        }
      }
    });
  }



  //重新分配
  onRedistributeModeSure = () => {
    const { reqQaLiteData } = this.props.qaManagementDetail.data
    let that = this;
    if (!this.state.selectCompany) {
      message.error("请选择公司");
      return;
    }
    const params = {
      companyIds: this.state.selectCompany,
      reqIds: reqQaLiteData.valid_req_qa_data?.map(item => item.id) + ''
    };
    const { dispatch } = this.props;

    dispatch({
      type: 'qaManagementDetail/redistributeCompany',
      payload: {
        ...params
      },
      callback: (reqsuccess: boolean, result: any) => {
        localStorage?.setItem('qaListRefreshTag', 'list')
        that.setRedistributeVisible(false);
        if (reqsuccess) {
          Modal.info({
            title: '提示',
            okText: "好的",
            content: (<div>
              {
                result?.success && result?.success.length > 0 && <div style={{ marginBottom: 10, fontWeight: 'bold' }}>分配成功:</div>
              }
              {
                result?.success && result?.success.length > 0 && result?.success?.map(item => <div>{item}</div>)
              }
              {
                result?.fail && result?.fail.length > 0 && <div style={{ marginBottom: 10, marginTop: 10, fontWeight: 'bold' }}>分配失败:</div>
              }
              {
                result?.fail && result?.fail.length > 0 && result?.fail?.map(item => <div>{item}</div>)
              }
            </div>),
            onOk() {
              that.fetchCustomerDetail();
              that.handleCategoryReqList(that.currentCategoryId)
              // 退出当前详情页
              // history.back();
            },
          });
        }
      }
    })
  }
  setRedistributeVisible = (visible: boolean) => {
    if (visible) {
      this.setState({
        selectCompany: '',
      })
    }
    this.setState({
      redistributeModalVisible: visible,
    })
  }
  onCompanyChange = (checkedValues: any) => {
    this.setState({
      selectCompany: checkedValues + ''
    });
  }


  /**
   * 到店次数
   */
  setArriveVisible = (visible: boolean) => {
    this.setState({
      arriveVisible: visible
    })
  }

  getButtons = () => {
    return <span>
      {this.btnAddReq()}
      {this.btnRedistribute()}
    </span>
  }

  //添加有效单
  btnAddReq = () => {
    const { config } = this.props.qaManagementDetail
    const menu = (
      <Menu>
        {
          config?.category?.map(categ => (
            <Menu.Item>
              <a onClick={() => this.categoryClick(categ)}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return <Dropdown overlay={menu} placement="bottomLeft">
      <Button className={styles.topbutton} type="primary">添加有效单</Button>
    </Dropdown>
  }

  btnRedistribute = () => {
    const { reqQaLiteData } = this.props.qaManagementDetail.data
    if (reqQaLiteData.allot_status == 1 &&
      reqQaLiteData.valid_req_qa_data &&
      reqQaLiteData.valid_req_qa_data.length > 0) {
      return <Button className={styles.topbutton} type="primary" onClick={() => this.setRedistributeVisible(true)}>重新分配</Button>
    }
    return ''
  }

  // 提起客诉
  handleSubmitComplaint = (fieldsValue: any) => {
    const { qaManagementDetail: { data: { reqQaLiteData } } } = this.props;
    let params = {
      ...fieldsValue,
      customerId: this.state.customerId,
      ownerId: reqQaLiteData.owner_id,
      linkId: reqQaLiteData.req_id,
      from: 2,  // 有效单
    };

    this.setState({
      complaintLoading: true,
    })
    const { dispatch } = this.props;
    dispatch({
      type: "qaManagementDetail/submitComplaint",
      payload: params,
      callback: (success: boolean, msg: string, id: string) => {
        if (success) {
          message.success("客诉单提交成功！");
          // 刷新客户资料
          this.fetchCustomerDetail();
          this.handleCategoryReqList(this.currentCategoryId)

        }
        this.setState({
          complaintModalVisible: false,
          complaintLoading: false,
        })
      }
    });
  }

  toComplaintDetail = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: "qaManagementDetail/toComplaintDetail",
      payload: {
        id,
        customerId: this.state.customerId
      }
    });
  }

  toCustomerDetail = (customer_id: string) => {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("/customer/");
    const targetUrl = currentUrl.substring(0, index) + "/customer/customerManagement/customerDetail";
    window.open(targetUrl + "?customerId=" + customer_id);
  };

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

  handleReqNumRender = (text: any, record: RequirementData) => {
    return <Fragment>
      {
        (this.state.readOrWrite == 1 && this.state.showStyle == 0) ? <a onClick={() => this.handleCustomerDetails(record)}>{text}</a> : <div>{text}</div>
      }
    </Fragment>
  }

  handleCustomerDetails = (record: any) => {
    if (record.customer_id == null) {
      message.error('跟进失败，客户id不能为空');
      return;
    }
    if (record.id == null) {
      message.error('跟进失败，有效单id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'qaManagementDetail/router',
      payload: {
        pathname: '/demand/demandManagement/demandDetails',
        params: {
          reqId: record.id,
          customerId: record.customer_id,
          showStyle: 1,
        }
      },
    })
  }


  handleLeadsNumRender = (text: any, record: CustomerLeadsData) => {
    return <Fragment>
      {
        (this.state.readOrWrite == 1 && this.state.showStyle == 0) ? <a onClick={() => this.handleLeadsDetails(record)}>{text}</a> : <div>{text}</div>
      }
    </Fragment>
  }

  handleLeadsDetails = (record: any) => {
    if (record.customer_id == null) {
      message.error('跟进失败，客户id不能为空');
      return;
    }
    if (record.id == null) {
      message.error('跟进失败，线索id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'qaManagementDetail/router',
      payload: {
        pathname: '/leads/distributeList/leadsDetails',
        params: {
          customerId: record.customer_id,
          leadId: record.id,
          categoryId: record.category_id,
          ownerId: record.owner_id,
        }
      },
    })
  }

  handleCategoryReqList = (categoryId: string | undefined) => {
    const { dispatch } = this.props;
    const { customerId, reqId } = this.state;
    const { config } = this.props.qaManagementDetail
    this.currentCategoryId = categoryId || config?.category[0]?.id || '1'
    dispatch({
      type: 'qaManagementDetail/fetchReqList',
      payload: {
        customerId,
        reqId: reqId,
        category: this.currentCategoryId,
      },
    })
  }

  handleCategoryLeadsList = (categoryId: string | undefined) => {
    const { dispatch } = this.props;
    const { customerId } = this.state;
    const { config } = this.props.qaManagementDetail
    dispatch({
      type: 'qaManagementDetail/fetchCustomerLeadsList',
      payload: {
        customerId: customerId,
        category: categoryId || config?.category[0]?.id || '1',
      },
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'qaManagementDetail/clearData',
    })
  }

  render() {
    const { isFriend, data: customerDetail, config, allUser, customerLeadsListData } = this.props.qaManagementDetail;
    const { customerFollowInfo, reqGroupData, rulesUserInfo } = this.props.qaManagementDetail;
    const { customerData, contactUserData, requirementData, reqTeamData, cooperationData } = this.props.qaManagementDetail.data
    const { followData, reqQaLiteData, reserveData: arriveList } = this.props.qaManagementDetail.data
    const { modalVisible, showStyle, readOrWrite, postModalVisible, reqId } = this.state;

    const { loading } = this.props;
    // 各种权限
    const { permission } = this.props.qaManagementDetail;
    const requirementadapter_closereq = permission ? permission.requirementadapter_closereq : false;
    const callcenteradapter_getrecordlist = permission ? permission.callcenteradapter_getrecordlist : false;
    const customeradapter_updatecustomer = permission ? permission.customeradapter_updatecustomer : false;
    const updatecustomerlevel = permission ? permission.updatecustomerlevel : false;
    const listenrecorder = permission ? permission.listenrecorder : false;
    const updatereqlevel = permission ? permission.updatereqlevel : false;

    const { repeatStatus, repeatAuditStatus } = customerData;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleTransfer: this.handleTransfer,
      handleCancelTransfer: this.handleCancelTransfer
    };

    var plainOptions: any = [];
    if (reqQaLiteData.allot_company && reqQaLiteData.allot_company.length > 0) {
      plainOptions = reqQaLiteData.allot_company.map(item => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    }

    return (
      <PageHeaderWrapper title='质检详情'>
        <Spin spinning={!!loading}>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <Card bordered={false}>
                <div className={styles.toolbarwrapper}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                      <span style={{ fontWeight: "bold", fontSize: 20 }}>{customerData.customerName}</span>
                      <span>
                        <span style={{ marginLeft: 30, marginRight: 10 }}>负责客服 :</span>
                        <span>{reqQaLiteData.kefu}</span>
                        {CrmUtil.getCompanyType() == 2 ? <span style={{ marginLeft: 50, marginRight: 10 }}>负责邀约 :</span> : <span style={{ marginLeft: 50, marginRight: 10 }}>负责销售 :</span>}
                        <span>{reqQaLiteData.sale}</span>
                        <span style={{ marginLeft: 50, marginRight: 10 }}>负责协作人 :</span>
                        <span>{reqQaLiteData.associates}</span>
                      </span>
                    </div>

                    <div>
                      {this.getButtons()}
                    </div>
                  </div>

                  <div className={styles.followWrapper}>
                    {
                      showStyle == 1 && (
                        <div style={{ marginTop: 10, marginBottom: 9 }}>下次回访时间:<span style={{ width: 50 }}>{reqQaLiteData.next_contact_time}</span></div>
                      )
                    }
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={{ md: 24, lg: 24, xl: 24 }} style={{ marginTop: 20 }}>
            <Col span={17}>
              <Card bordered={false}>
                <Tabs activeKey={this.state.activeKey} type="card" style={{ marginTop: 15 }} onChange={this.tabsChanged}>
                  <TabPane tab="客户信息" key="2">
                    <CustomerInfo
                      permission={permission}
                      editable={0}
                      customerData={customerData}
                      config={config}
                      allUser={rulesUserInfo?.into_user_list}
                      onChange={this.updateCustomerInfo}>
                    </CustomerInfo>
                  </TabPane>
                  <TabPane tab="联系人" key="3">
                    <ContactTab contactUserData={contactUserData} config={config} onChanged={this.onContactChanged}
                    ></ContactTab>
                  </TabPane>
                  {
                    this.state.customerId && (
                      <TabPane tab="意向需求" key="4" forceRender={true}>
                        {
                          customerData?.customerId && config?.category?.length > 0 && <CategoryReq
                            customerId={customerData.customerId}
                            optionable={(readOrWrite == 1 && showStyle == 1) ? 1 : 0}
                            config={config}
                            leadsId={reqQaLiteData.leads_id}
                            reqGroupDetails={reqGroupData}
                            onCategoryReqRef={this.onRef}
                            fun_refreshCategoryAll={(categoryId: string) => {
                              this.fetchCustomerDetail()
                              this.handleCategoryReqList(categoryId)
                              this.orderRef?.requstData()
                            }}
                            fun_recommend={this.handleRecommend}
                            fun_review={this.handleReview}
                            fun_refreshCategoryReqList={this.handleCategoryReqList}
                            defaultCategoryId={reqQaLiteData.top_category}
                            reqId={this.state.reqId}
                            fun_reqNumRender={this.handleReqNumRender} />
                        }
                      </TabPane>
                    )
                  }
                  <TabPane tab="订单信息" key="6">
                    <OrderInfo onRef={this.onOrderRef} customerId={this.state.customerId} loading={this.props.loading} />
                  </TabPane>
                  {callcenteradapter_getrecordlist == true ? <TabPane tab="通话记录" key="7">
                    <QualityInspection onQaRef={this.onQaRef} customerId={this.state?.customerId} listenrecorder={listenrecorder} />
                  </TabPane> : ''}
                  {
                    permission?.showlog && <TabPane tab="客户日志" key="10">
                      <OperationLogPage logRef={this.onLogRef} customerId={this.state.customerId} type={5} id={reqQaLiteData?.req_qa_id} />
                    </TabPane>
                  }
                </Tabs>
              </Card>
            </Col>

            <Col span={7}>
              <Card bordered={false}>
                <FollowView
                  showStyle={5}
                  followList={customerFollowInfo}
                  showAddNewDynamicFunction={this.addSalesOfDynamicFunction}
                  getFollowFounction={this.getFollowList}
                  customerData={customerData}
                  followData={followData}
                />
              </Card>
            </Col>

          </Row>

          {/* <AddFollowInfo
          saveFunction={this.addSalesOfDynamicRequetsFunction}
          onCancel={this.canceladdSalesOfDynamicFunction}
          visible={this.state.showAddFollowInfo}
          flowStatus={customerFollowStatus && customerFollowStatus}
          contactWay={contactWay && contactWay}
          followTag={followTag && followTag}
        /> */}

          <Drawer
            width={590}
            visible={this.state.showAddFollowInfo}
            closable={true}
            onClose={this.canceladdSalesOfDynamicFunction}>
            <div>
              <RntryFollow
                customerId={this.state.customerId}
                showStyle={5}
                relationId={this.state.reqId}
                customer={customerData ? customerData : {}}
                isShowStatusBlock={true}
                customerConfig={config}
                followData={followData}
                wechat={customerData ? customerData.weChat : ''}
                isFriend={isFriend}
                getFollowList={this.getFollowList}
                hiddenFollowInfo={this.canceladdSalesOfDynamicFunction}
                contacts={contactUserData}
                refreshFunction={() => {
                  this.fetchCustomerDetail()
                  this.handleCategoryReqList(this.currentCategoryId)
                  this.qaRef?.requestData()
                  this.logRef?.requestData(1)
                }}
                tab={this?.state?.tab}
              />
            </div>
          </Drawer>

          <TransferToUserForm {...parentMethods} visible={modalVisible} defaultValue={this.currentUserInfo.id} label="负责销售" />

          {/* <CustomerChildrenModal visible={this.state.customerChildrenModalVisible} /> */}

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

          <StartCustomerComplaintModal
            loading={this.state.complaintLoading}
            visible={this.state.complaintModalVisible}
            configDatas={config?.complaintType}
            onOk={this.handleSubmitComplaint}
            onCancel={() => {
              this.setState({ complaintModalVisible: false });
            }}
          />

          <Modal
            title={<div>
              {
                this.backType == 3 ? '退回公海' : '退回死海'
              }
            </div>}
            visible={this.state.backModalVisible}
            centered
            destroyOnClose={true}
            onOk={this.onBackModeSure}
            onCancel={() => this.setBackVisible(false)}>
            <div>
              <span>退回原因</span>
              <span>
                <Select
                  allowClear
                  showSearch
                  style={{ width: 300, marginLeft: 15 }}
                  placeholder=""
                  optionFilterProp="children"
                  onChange={this.onBackReasonChanged}>
                  {
                    config?.requirementReturnReason && config?.requirementReturnReason.map(item => (
                      <Option value={item.id}>
                        {item.name}
                      </Option>
                    )
                    )
                  }
                </Select>
              </span>
            </div>
            <TextArea
              style={{ marginTop: 15 }}
              onChange={this.backModeTextChange}
              placeholder='补充原因'
              rows={6}>
            </TextArea>
          </Modal>


          <Modal
            title="到店记录"
            visible={this.state.arriveVisible}
            centered
            destroyOnClose={true}
            onCancel={() => this.setArriveVisible(false)}
            footer={[
              <Button type="primary" onClick={() => this.setArriveVisible(false)}>知道了</Button>
            ]}>
            <List
              size="small"
              bordered
              style={{ maxHeight: 400, overflowY: 'auto' }}
              dataSource={arriveList}
              renderItem={item => <List.Item>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <div style={{ paddingTop: 5 }}>
                    <span>预约时间：{item.reserve_time}</span>
                    <span style={{ marginLeft: 15 }}>预约人：{item.user_name}</span>
                  </div>
                  <div style={{ paddingTop: 5 }}>
                    <span>到店时间：{item.arrival_time}</span>
                    <span style={{ marginLeft: 15 }}>确认人：{item.confirm_user_name}</span>
                  </div>
                </div>
              </List.Item>}
            />
          </Modal>

          <Modal
            title="有效数据"
            visible={this.state.redistributeModalVisible}
            centered
            destroyOnClose={true}
            onCancel={() => this.setRedistributeVisible(false)}
            onOk={() => this.onRedistributeModeSure()}>
            <div>
              <List
                size="small"
                bordered
                style={{ maxHeight: 400, overflowY: 'auto' }}
                dataSource={reqQaLiteData.valid_req_qa_data}
                renderItem={item => <List.Item>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div>
                      <span>{item.category_text}</span>
                      <span style={{ marginLeft: 15 }}>({item.req_num})</span>
                    </div>
                  </div>
                </List.Item>}
              />
              <div style={{ marginTop: 15 }}>
                <span>选择公司</span>
                <span style={{ marginLeft: 15 }}>
                  <Checkbox.Group options={plainOptions} onChange={this.onCompanyChange} />
                </span>
              </div>
            </div>
          </Modal>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;