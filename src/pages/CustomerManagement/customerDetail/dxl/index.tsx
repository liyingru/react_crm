import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';

import { Spin, Card, Tabs, Button, message, Divider, Row, Col, Menu, Dropdown, Modal, Checkbox, Empty, Tag, Drawer, Form, Select, Input, Alert, List, Popover } from 'antd';
import getUserInfo from '@/utils/UserInfoStorage'
import styles from './index.less';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { Action, Dispatch } from 'redux';
import { StateType } from './model';
import { connect } from 'dva';
import CustomerAll from '../components/customerall';
import CustomerInfo from '../components/customerinfo';
import ContactTab from '../components/contactlist';
import FollowView from '../components/FollowView';
// import AddFollowInfo from '../components/addFollow';
import ContractTab from '../../OrderManagement/newContractNew/components/contract';
import TeamTab from '../components/projectteam';
import CustomerRequire from '../components/customrequir';
import RntryFollow from '../components/RntryFollow';
import QualityInspection from '../components/qualityInspection';
import OrderInfo from '../components/OrderInfo';

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
import IntentionalDemand from '../components/IntentionalDemand';

import { customerChildren } from './service';
import CustomerChildrenModal from '../components/CustomerChildren';
import StartCustomerComplaintModal from '@/components/StartCustomerComplaintModal';
import CooperationTab from '../components/cooperation';
import CrmUtil from '@/utils/UserInfoStorage';
import CategoryReq from '@/pages/DxlLeadsManagement/dxlLeadsList/components/CategoryReq';
import CustomerLeads from '@/pages/DxlLeadsManagement/dxlLeadsList/components/CustomerLeads';
import { CustomerLeadsData } from '@/pages/LeadsManagement/leadsDetails/data';
import MerchantRemark from '@/pages/DxlLeadsManagement/dxlLeadsList/components/MerchantRemark';
import ThirdRecord from '@/pages/DxlLeadsManagement/dxlLeadsList/components/ThirdRecord';
import { QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';



const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;


interface TableListProps {
  dispatch: Dispatch<
    Action<any>
  >;
  loading: boolean;
  customerDetailMode: StateType;
}

interface TableListState {
  customerId: string;
  reqId: string;
  /** 0 表示客户， 1 表示有效单 */
  showStyle: 0 | 1;   // 
  /** 0 表示只读    1  表示可操作 */
  readOrWrite: 0 | 1;  // 
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

  qaModalVisible: boolean;
  qaReason: string;
  qaSelelctIds: string;
  qaDropVisble: boolean;

  complaintLoading: boolean;
  complaintModalVisible: boolean;

  backModalVisible: boolean; //退回×海
  backToSeaReason: string,
  backToSeaRemark: string,

  isFirstFollowRequets: boolean,
  // 跟进记录请求的标签
  tab: string,

  activeKey: string;

  arriveVisible: boolean;

  isFirstConfigRequest: boolean;
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

  child: any;
  orderRef: any;
  currentUserInfo: any;

  isMult = false; //是否是多条质检

  backType: number = 3; //3退回公海 4退回死海
  collaType: number = 1; //1:联系协作人,2:联系归属人

  currentCategoryId: string | undefined;
  currentLeadsCategory: string | undefined;

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

    qaModalVisible: false,
    qaReason: '',
    qaSelelctIds: '',
    qaDropVisble: false,

    complaintLoading: false,
    complaintModalVisible: false,

    backModalVisible: false,
    backToSeaReason: '',
    backToSeaRemark: '',

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
        this.setState({
          isFinshRequestWeChat: true
        });
      };

    }
  }

  /** 是否是有效单质检列表进来的，如果是，就只有“质检”按钮可以使用 */
  isQA: boolean = false;

  //质检用来区分来源
  companyId:any;

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
      readOrWrite = this.props.location.state.readOrWrite ?? 1;
      this.isQA = this.props.location.state.isQA ?? false;
      this.companyId = this.props.location.state.companyId;
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

    dispatch({
      type: 'customerDetailMode/config',
      callback: (success: boolean, msg: string) => {
        if (this.state.isFirstConfigRequest && success) {
          this.setState({
            isFirstConfigRequest: false
          }, () => {
            if (showStyle == 0) {
              this.handleCategoryReqList(undefined)
              this.handleCategoryLeadsList(undefined)
            }
          })
        }
      }
    })
    dispatch({
      type: 'customerDetailMode/getAllUser'
    })
    dispatch({
      type: 'customerDetailMode/getMerchantList'
    })

    // 用户权限
    dispatch({
      type: 'customerDetailMode/getUserPermissionList',
      payload: '',
    });

    //团队角色
    dispatch({
      type: 'customerDetailMode/getTeamRole'
    })
  }

  fetchMerchantRemarkList = (reqId: string, page: number, pageSize: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/fetchMerchantnotes',
      payload: {
        requmentId: reqId,
        index: page,
        size: pageSize,
      }
    });
  }

  fetchThirdRecordList = (reqId: string, page: number, pageSize: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/fetchThirdrecards',
      payload: {
        requmentId: reqId,
        index: page,
        size: pageSize,
      }
    });
  }

  // 跟进数据
  getFollowList = (tab: string, showStyle: 0 | 1, isRequetsCustomerDate: boolean, customerId?: string, reqId?: string) => {
    const { dispatch } = this.props;
    let values = {}
    values['customerId'] = customerId ? customerId : this.state.customerId;

    if (showStyle == 0) {
      values['tab'] = tab;
      values['type'] = 4
      values['relationId'] = customerId ? customerId : this.state.customerId;
    } else {
      values['tab'] = tab;
      values['type'] = 2
      values['relationId'] = reqId ? reqId : this.state.reqId;
    }

    dispatch({
      type: 'customerDetailMode/getFollowList',
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
    // console.log('onRecommClick=======customer',data)
    // let url = window.location.href;
    // let str = '';
    //   if(url.indexOf('/customer/')!=-1){
    //     str = '/customer/';
    //   }else{
    //     str = '/demand/';
    //   }
    // url = url.split(str)[0]+'/store/storeDetails?customerId='+data.customer_id+'&reqId='+data.id+'&category='+ data.category+'&cityInfo='+data.city_info.city_code;
    // window.open(url);

  }

  tabsChanged = (activeKey: string) => {
    this.setState({
      activeKey,
    })
  }

  fetchCustomerDetail = () => {
    const { dispatch } = this.props;
    const { customerId, reqId, showStyle, isFirstFollowRequets } = this.state;
    const params = {
      customerId: customerId
    }
    if (showStyle == 1) {
      params['reqId'] = reqId
    }
    if(this.companyId){
      params['companyId'] = this.companyId
    }
    dispatch({
      type: 'customerDetailMode/fetch',
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

            if (showStyle == 1) {
              this.handleCategoryReqList(data?.reqLiteData?.top_category)
            }
          })
        }
      }
    });
  }

  onContactChanged = (bean: ContactUserData, callback: () => void) => {
    const { customerData } = this.props.customerDetailMode.data
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

  // onRequirementChanged = (bean: RequirementBean, callback: () => void) => {
  //   const { customerData } = this.props.customerDetailMode.data
  //   const { dispatch } = this.props;
  //   Axios.post((bean['reqId'] == undefined || bean['reqId'] == "") ? URL.createReq : URL.updateReq, {
  //     ...bean,
  //     customerId: customerData.customerId,
  //   }).then(
  //     res => {
  //       if (res.code == 200) {
  //         callback();
  //         message.info('操作成功');
  //         this.fetchCustomerDetail();
  //       }
  //     })
  // }

  onTeamChanged = (params: any, isCreate: boolean, callback: () => void) => {
    const { customerData } = this.props.customerDetailMode.data
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
    const { customerData } = this.props.customerDetailMode.data
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
    const { data: customerDetail } = this.props.customerDetailMode

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
    const { customerData } = this.props.customerDetailMode.data
    const { dispatch } = this.props;
    Axios.post(URL.updateCustomer, params).then(
      res => {
        if (res.code == 200) {
          callback();
          message.info('操作成功');
          localStorage?.setItem('demandListRefreshTag', 'list')
          this.fetchCustomerDetail();
          if (this.state.showStyle == 0) {
            this.handleCategoryReqList(this.currentCategoryId)
            this.handleCategoryLeadsList(this.currentLeadsCategory)
          }
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
      type: 'customerDetailMode/transferCustomer',
      payload: valuesResult,
      callback: this.onTransferCustomerCallback,
    });
  }

  //转让客户回调
  onTransferCustomerCallback = (result: boolean, msg: String) => {
    const { customerData } = this.props.customerDetailMode.data
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

  // //跳转到客户管理主页方法
  // handleCustomerManagementHomePage = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'customerDetailMode/customerManagementPage'
  //   });
  // }

  onRef = (ref: any) => {
    this.child = ref
  }

  onOrderRef = (ref: any) => {
    this.orderRef = ref
  }

  categoryClick = (item: ConfigListItem) => {
    this.child.handleSelectCategory("新建" + item.name + "有效单", Number(item.id))
  }

  checkCustomerInfo = () => {
    const { customerData } = this.props.customerDetailMode.data
    let that = this;
    if(!customerData?.identityText){
      Modal.confirm({
        title: '系统提示：',
        icon:<ExclamationCircleOutlined />,
        content: '当前客户【客户信息】信息未填写，请先完善该内容',
        cancelText:'暂不建单',
        okText:'立即填写',
        onOk() {
          that.setState({
            activeKey:'2'
          })
        },
        onCancel() {},
      });
      return false;
    }else{
      return true;
    }
  }

  onCloseClick = (bean: RequirementBean) => {
    this.child.handleCloseReq(bean)
  }


  onQaClick = (bean: ConfigListItem) => {
    this.isMult = false
    if (bean.id == 1) {
      this.onReqQaChange({
        reqId: this.state.reqId,
        qtResult: bean.id,
      })
    } else if (bean.id == 2) {
      this.setQaVisible(true)
    }
  }

  onQaMultClick = (id:number) => {
    if(this.state.checkedValue.length == 0) {
      message.info('请选择有效单')
      return;
    }
    this.handleqaDropVisbleChange(false)
    this.isMult = true
    if(id == 1){
      this.onReqQaChange({
        reqId: this.state.checkedValue + '',
        qtResult: 1,
      })
    } else if (id == 2) {
      this.setQaVisible(true)
    }
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
    const { dispatch, customerDetailMode: { data } } = this.props;
    const customerId = data.customerData.customerId;
    if (customerId) {
      dispatch({
        type: 'customerDetailMode/startDuplicateCustomer',
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
    const { customerDetailMode: { data } } = this.props;
    const customerId = data.customerData.customerId;
    dispatch({
      type: 'customerDetailMode/getCustomerChildren',
      payload: {
        customerId
      },
      callback: (success: boolean) => {
        if (success) {
          this.setState({
            customerChildrenModalVisible: true
          })
          const { customerDetailMode: { customerChildrenData } } = this.props;
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


  handleqaDropVisbleChange = (flag: boolean) => {
    if (flag) {
      this.state.checkedValue = [];
    }
    this.setState({ qaDropVisble: flag });
  }

  dropDownClick = (e: any) => {
    if (e.key === '3') {
      this.setState({
        transVisible: false,
        postVisible: false,
        qaDropVisble: false,
      });
    }
  }

  transReqChange = (checkedValue: Array<CheckboxValueType>) => {
    this.setState({
      checkedValue: checkedValue
    })
  }



  postOkHandle = () => {
    const { customerData } = this.props.customerDetailMode.data
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
          localStorage?.setItem('demandListRefreshTag', 'list')
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
    const { associates } = this.props.customerDetailMode.data.reqLiteData
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
      type: this.backType == 3 ? 'customerDetailMode/backToPubSea' : 'customerDetailMode/backToDeadSea',
      payload: {
        ...params
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.info(msg);
          localStorage?.setItem('demandListRefreshTag', 'list')
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
      type: 'customerDetailMode/updateReqLite',
      payload: {
        reqId: this.state.reqId,
        level: value
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success('有效单级别修改成功');
          localStorage?.setItem('demandListRefreshTag', 'list')
          this.fetchCustomerDetail();
          this.handleCategoryReqList(this.currentCategoryId)
        }
      }
    });
  }

  onReqQaChange = (value: any) => {
    const { dispatch } = this.props
    dispatch({
      type: 'customerDetailMode/dxlQtReq',
      payload: {
        ...value,
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success(msg);
          localStorage?.setItem('demandListRefreshTag', 'list')
          this.fetchCustomerDetail();
          this.handleCategoryReqList(this.currentCategoryId);
          this.setQaVisible(false);
        }
      }
    });
  }
  //质检Modal
  onQAModeSure = () => {
    if (this.state.qaSelelctIds == '') {
      message.error("至少选择一项驳回原因");
      return;
    }
    // if (this.state.qaReason == '') {
    //   message.error("请填写质检驳回原因");
    //   return;
    // }
    this.onReqQaChange({
      reqId: this.isMult ? this.state.checkedValue + '' : this.state.reqId,
      qtResult: 2,
      qtResultReason: this.state.qaReason,
      qtInvalidReasonId: this.state.qaSelelctIds,
    })
  }
  setQaVisible = (b: boolean) => {
    if (b) { this.state.qaReason = ''; this.state.qaSelelctIds = ''; }
    this.setState({ qaModalVisible: b })
  }
  qaModeTextChange = ({ target: { value } }) => {
    this.setState({ qaReason: value });
  };
  onCompanyChange = (checkedValues: any) => {
    this.setState({
      qaSelelctIds: checkedValues + ''
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
   */
  getButtons = () => {
    let company_tag = this.currentUserInfo.company_tag
    if (company_tag == 'DXL' || company_tag == 'XX') {  // 到喜啦  星享非凡
      return (
        <span>
          {this.btnAddReq()}
          {this.btnCloseReq()}
          {this.btnCollaborator()}
          {this.btnComplaint()}
          {this.btnRecMerchant()}
          {this.btnCustomerRepeat()}
          {this.btnChildrenSheet()}
          {this.btnArriveCounts()}
        </span>
      )
    } else if (company_tag == 'XZ' || company_tag == 'SEW') {  // 喜庄  塞尔维
      return <span>
        {this.btnPostReq()}
        {this.btnAddReq()}
        {this.btnCloseReq()}
        {this.btnComplaint()}
        {this.btnCollaborator()}
        {this.btnBackPubSeas()}
        {this.btnCustomerRepeat()}
        {this.btnChildrenSheet()}
        {this.btnArriveCounts()}
      </span>
    } else if (company_tag == 'AFE') {  // 爱菲尔
      return <span>
        {this.btnPostReq()}
        {this.btnAddReq()}
        {this.btnCloseReq()}
        {this.btnComplaint()}
        {this.btnCollaborator()}
        {this.btnBackDeadSeas()}
        {this.btnCustomerRepeat()}
        {this.btnChildrenSheet()}
        {this.btnArriveCounts()}
      </span>
    } else {  // 其他 
      return <span>
        {this.btnPostReq()}
        {this.btnAddReq()}
        {this.btnCloseReq()}
        {this.btnComplaint()}
        {this.btnCollaborator()}
        {this.btnBackPubSeas()}
        {this.btnBackDeadSeas()}
        {this.btnCustomerRepeat()}
        {this.btnChildrenSheet()}
        {this.btnArriveCounts()}
      </span>
    }
  }

  filterMyOperateReq = () => {
    const { data: { requirementData } } = this.props.customerDetailMode
    return !requirementData.my ? [] : requirementData.my.flatMap(value => value.data).filter(value => (value.phase == '1' || value.phase == '2' || value.phase == '6'))
  }

  //添加有效单
  btnAddReq = () => {
    const { config, permission, data } = this.props.customerDetailMode
    if (permission?.requirementadapter_createreq) {
      const menu = (
        <Menu>
          {
            config.category.map(categ => (
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
    return ''
  }
  //关闭有效单
  btnCloseReq = () => {
    return ''
    const { permission: { requirementadapter_closereq } } = this.props.customerDetailMode
    if (requirementadapter_closereq) {
      const operateRequires = this.filterMyOperateReq()
      const reqIds = (
        <Menu>
          {
            operateRequires.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
              operateRequires.map(req => (
                <Menu.Item>
                  <a onClick={() => this.onCloseClick(req)}>
                    {req.req_num}
                    <span style={{ marginLeft: 5 }}>{req.category_txt}</span>
                  </a>
                </Menu.Item>
              ))
          }
        </Menu>
      );
      return <Dropdown overlay={reqIds} placement="bottomLeft">
        <Button className={styles.topbutton} type="primary">关闭有效单</Button>
      </Dropdown>
    }
    return ''
  }
  //联系协作人
  btnCollaborator = () => {
    const { config, data: { reqLiteData }, permission } = this.props.customerDetailMode
    if (permission?.requirementadapter_createcooperationmessag) {
      if (reqLiteData.role == 1) {
        return <Button className={styles.topbutton} type="primary"
          onClick={() => { this.collaType = 1; this.checkCollaVisible() }}>联系协作人</Button>
      } else {
        return <Button className={styles.topbutton} type="primary"
          onClick={() => { this.collaType = 2; this.checkCollaVisible() }}>联系归属人</Button>
      }
    }
    return ''
  }
  //客诉单
  btnComplaint = () => {
    const { customerDetailMode: { data } } = this.props;
    const { permission } = this.props.customerDetailMode; // 是否有查看客诉的权限
    const complaintadapter_btn = permission ? permission.complaintadapter_btn : false;
    // 如果有客诉信息，且客诉状态为处理中，
    const complaintIsGoingOn = data.reqLiteData && (data.reqLiteData.complaint_status == 1 || data.reqLiteData.complaint_status == 2 || data.reqLiteData.complaint_status == 3)
    return <Button className={styles.topbutton} type="primary"
      disabled={complaintIsGoingOn && (!complaintadapter_btn)}
      onClick={() => {
        if (complaintIsGoingOn && data.reqLiteData.complaint_id) {
          // 跳转到客诉详情
          this.toComplaintDetail(data.reqLiteData.complaint_id);
        } else {
          // 发起客诉
          this.setState({
            complaintModalVisible: true
          });
        }
      }
      }
    >{complaintIsGoingOn ? "客诉处理中" : "客诉单"}</Button>
  }

  // 客户重复
  btnCustomerRepeat = () => {
    const { customerDetailMode: { data } } = this.props;
    const { repeatStatus, repeatAuditStatus } = data.customerData;
    // 正常或亲子单（非被合并），且，角色为归属人。展示客户重复按钮
    if ((repeatStatus == 1 || repeatStatus == 3) && data.reqLiteData.role == 1) {
      return (
        <Button style={{ marginRight: 20, marginTop: 10 }} type="primary" onClick={this.handleDuplicate} disabled={repeatAuditStatus == 1}>客户重复{repeatAuditStatus == 1 ? "（处理中）" : ""}</Button>
      )
    } else {
      return null;
    }
  }

  // 亲子单
  btnChildrenSheet = () => {
    const { customerDetailMode: { data: { customerData: { repeatStatus } } } } = this.props;
    if (repeatStatus == 3) {
      return (
        <Button style={{ marginRight: 20, marginTop: 10 }} type="primary" onClick={this.handleChildrenSheet}>亲子单</Button>
      )
    } else {
      return null;
    }
  }

  //推荐商家
  btnRecMerchant = () => {
    const { reqLiteData } = this.props.customerDetailMode.data;
    if (reqLiteData.role == 1) {
      const operateRequires = this.filterMyOperateReq()
      const postReqIds = (
        <Menu>
          {
            operateRequires.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
              operateRequires.map(req => (
                <Menu.Item>
                  <a onClick={() => this.onRecMechantDrawpClick(req)}>
                    {req.req_num}
                    <span style={{ marginLeft: 5 }}>{req.category_txt}</span>
                  </a>
                </Menu.Item>
              ))
          }
        </Menu>
      );
      return <Dropdown overlay={postReqIds} placement="bottomLeft">
        <Button className={styles.topbutton} type='primary'>推荐商家</Button>
      </Dropdown>
    }
    return ''
  }
  //派发有效单
  btnPostReq = () => {
    const { permission } = this.props.customerDetailMode;
    const requirementadapter_updatereq = permission ? permission.requirementadapter_updatereq : false;
    if (requirementadapter_updatereq) {
      const operateRequires = this.filterMyOperateReq()
      const postReqIds = (
        <Menu>
          {
            operateRequires.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
              operateRequires.map(req => (
                <Menu.Item>
                  <a onClick={() => this.onPostDrawpClick(req)}>
                    {req.req_num}
                    <span style={{ marginLeft: 5 }}>{req.category_txt}</span>
                  </a>
                </Menu.Item>
              ))
          }
        </Menu>
      );
      return <Dropdown overlay={postReqIds} placement="bottomLeft">
        <Button className={styles.topbutton} type='primary'>派发需求</Button>
      </Dropdown>
    }
    return ''
  }
  //退回公海
  btnBackPubSeas = () => {
    const { reqLiteData } = this.props.customerDetailMode.data;
    // 是否有退回公海的权限
    const { permission } = this.props.customerDetailMode;
    const requirementadapter_reqreturntopublicsea = permission ? permission.requirementadapter_reqreturntopublicsea : false;
    if (requirementadapter_reqreturntopublicsea && reqLiteData.role == 1) {
      return <Button className={styles.topbutton} type="primary"
        onClick={() => { this.backType = 3; this.setBackVisible(true); }}>退回公海</Button>
    } else {
      return null;
    }
  }

  //退回死海
  btnBackDeadSeas = () => {
    const { reqLiteData } = this.props.customerDetailMode.data;
    // 是否有退回死海的权限
    const { permission } = this.props.customerDetailMode;
    const requirementadapter_reqreturntodeadsea = permission ? permission.requirementadapter_reqreturntodeadsea : false;
    if (requirementadapter_reqreturntodeadsea && reqLiteData.role == 1) {
      return <Button className={styles.topbutton} type="primary"
        onClick={() => { this.backType = 4; this.setBackVisible(true); }}>退回死海</Button>
    }
    return ''
  }

  //到店次数
  btnArriveCounts = () => {
    const { reserveData: arriveList } = this.props.customerDetailMode.data
    if (arriveList && arriveList.length > 0) {
      return <Button className={styles.topbutton} type="primary"
        onClick={() => { this.setArriveVisible(true) }}>预约到店({arriveList.length}次)</Button>
    }
    return ''
  }

  //质检核查
  btnQA = () => {
    const { reqLiteData } = this.props.customerDetailMode.data;
    const { permission, config } = this.props.customerDetailMode;
    if (permission.showqtbutton && this.isQA) {
      let qtConfig: any[] = []
      if (config.requirementQtResult && config.requirementQtResult.length > 0) {
        if (reqLiteData?.qt_result == 1) {
          qtConfig = config.requirementQtResult.filter(item => item.id == 2)
        } else if (reqLiteData?.qt_result == 2) {
          qtConfig = config.requirementQtResult.filter(item => item.id == 1)
        } else {
          qtConfig = config.requirementQtResult
        }
      }
      let reqIds = (
        <Menu>
          {
            qtConfig.length > 0 ?
              qtConfig.map((item: any) => {
                if (item?.id > 0) {
                  return (
                    <Menu.Item>
                      <a onClick={() => this.onQaClick(item)}>{item.name}</a>
                    </Menu.Item>
                  );
                }
              }
              ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Menu>
      );
      if (reqLiteData?.qt_result == 1) {
        return <Dropdown overlay={reqIds} placement="bottomLeft" trigger={['click']}>
          <Button className={styles.topbutton} style={{ backgroundColor: 'rgb(87,194,45)', color: 'white' }}
            onClick={e => e.preventDefault()}>质检通过</Button>
        </Dropdown>
      } else if (reqLiteData?.qt_result == 2) {
        return <Dropdown overlay={reqIds} placement="bottomLeft" trigger={['click']}>
          <Button className={styles.topbutton} style={{ backgroundColor: "rgb(253,79,84)", color: 'white' }}
            onClick={e => e.preventDefault()}>质检驳回</Button>
        </Dropdown>
      } else {
        return <Dropdown overlay={reqIds} placement="bottomLeft" trigger={['click']}>
          <Button className={styles.topbutton} type="primary" onClick={e => e.preventDefault()}>质检检核</Button>
        </Dropdown>
      }
    }
    return ''
  }


  //质检核查所有有效单
  btnQaAll = () => {
    const { reqLiteData, requirementData } = this.props.customerDetailMode.data;
    const { permission, config } = this.props.customerDetailMode;
    if (permission.showqtbutton && this.isQA) {
      let myList = !requirementData.my ? [] : requirementData.my.flatMap(value => value.data)
      let otherList = !requirementData.other ? [] : requirementData.other.flatMap(value => value.data)
      let operateRequires = [...myList, ...otherList]
      const reqIds = (
        operateRequires.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
          <div className={styles.checkgroupWrapper}>
            {
              <div className={styles.checkgroup} onClick={this.dropDownClick}>
                <Checkbox.Group onChange={this.transReqChange} value={this.state.checkedValue}>
                  {
                    operateRequires.map(req => (
                      <Row>
                        <Col span={24} className={styles.checkbox}>
                          <Checkbox value={req.id}>
                            <span>
                              {req.category_txt}
                              <span style={{ marginLeft: 5 }}>{req.req_num}</span>
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                    ))
                  }
                </Checkbox.Group>
                <div className={styles.checkgroupBtn}>
                  <Button size='small' type="primary" onClick={() => this.onQaMultClick(1)}>质检通过</Button>
                  <Button style={{ marginLeft: 20 }} size='small' type="primary" onClick={() => this.onQaMultClick(2)}>质检驳回</Button>
                </div>
              </div>
            }
          </div>
      );
      return <Dropdown overlay={reqIds} placement="bottomLeft" trigger={['click']}
        onVisibleChange={this.handleqaDropVisbleChange}
        visible={this.state.qaDropVisble}>
        <Button className={styles.topbutton} type="primary" onClick={e => e.preventDefault()}>合并质检</Button>
      </Dropdown>
    }
    return ''
  }

  handleShowQaReson = () => {
    const { reqLiteData } = this.props.customerDetailMode.data
    Modal.info({
      title: '驳回原因',
      okText: "知道啦",
      content: (
        <div>{reqLiteData?.qt_result_reason}</div>
      ),
      onOk() { },
      width: "45%"
    });
  }

  // 提起客诉
  handleSubmitComplaint = (fieldsValue: any) => {
    const { customerDetailMode: { data: { reqLiteData } } } = this.props;
    let params = {
      ...fieldsValue,
      customerId: this.state.customerId,
      ownerId: reqLiteData.owner_id,
      linkId: reqLiteData.req_id,
      from: 2,  // 有效单
    };

    this.setState({
      complaintLoading: true,
    })
    const { dispatch } = this.props;
    dispatch({
      type: "customerDetailMode/submitComplaint",
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
      type: "customerDetailMode/toComplaintDetail",
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
      type: 'customerDetailMode/router',
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
      type: 'customerDetailMode/router',
      payload: {
        pathname: '/leads/distributeList/leadsDetails',
        params: {
          customerId: record.customer_id,
          leadId: record.id,
          categoryId: record.category,
          ownerId: record.owner_id,
        }
      },
    })
  }

  handleCategoryReqList = (categoryId: string | undefined) => {
    const { dispatch } = this.props;
    const { customerId } = this.state;
    const { config } = this.props.customerDetailMode
    this.currentCategoryId = categoryId || config?.category[0]?.id || '1'
    let other = {};
    if(this.companyId){
      other['companyId'] = this.companyId
    }
    dispatch({
      type: 'customerDetailMode/fetchReqList',
      payload: {
        customerId,
        aggregation: '1',
        category: this.currentCategoryId,
        ...other,
      },
    })
  }

  handleCategoryLeadsList = (categoryId: string | undefined) => {
    const { dispatch } = this.props;
    const { customerId } = this.state;
    const { config } = this.props.customerDetailMode
    this.currentLeadsCategory = categoryId || config?.category[0]?.id || '1'
    dispatch({
      type: 'customerDetailMode/fetchCustomerLeadsList',
      payload: {
        customerId: customerId,
        category: this.currentLeadsCategory,
      },
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMode/clearData',
    })
  }



  render() {
    const { isFriend, data: customerDetail, config, allUser, merchantList, customerLeadsListData, teamRole, merchantRemarkData, thirdRecordData } = this.props.customerDetailMode;
    const { customerFollowInfo, reqGroupData } = this.props.customerDetailMode;
    const { customerData, contactUserData, requirementData, reqTeamData, cooperationData } = this.props.customerDetailMode.data
    const { followData, reqLiteData, reserveData: arriveList } = this.props.customerDetailMode.data
    const { modalVisible, showStyle, readOrWrite, postModalVisible, reqId } = this.state;

    if (!customerDetail?.customerData) return ''

    const { loading } = this.props;
    // 各种权限
    const { permission } = this.props.customerDetailMode;
    const requirementadapter_closereq = permission ? permission.requirementadapter_closereq : false;
    const callcenteradapter_getrecordlist = permission ? permission.callcenteradapter_getrecordlist : false;
    const customeradapter_updatecustomer = permission ? permission.customeradapter_updatecustomer : false;
    const updatecustomerlevel = permission ? permission.updatecustomerlevel : false;
    const listenrecorder = permission ? permission.listenrecorder : false;
    const updatereqlevel = permission ? permission.updatereqlevel : false;
    const sendreqreport = permission ? permission.sendreqreport : false;


    const { repeatStatus } = customerData;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleTransfer: this.handleTransfer,
      handleCancelTransfer: this.handleCancelTransfer
    };

    const operateAble = reqLiteData.phase != 5 && reqLiteData.phase != 0 && reqLiteData.phase != 30

    return (

      <PageHeaderWrapper title={showStyle == 0 ? '客户详情' :
        <div>
          <span>有效单详情</span>
          <span style={{ marginLeft: 20, fontWeight: 'normal', color: 'grey' }}>{reqLiteData?.req_num}</span>
          {
            this.currentUserInfo.company_tag == 'DXL' ?
              (<span style={{ marginLeft: 20, fontWeight: 'normal', color: 'grey' }}>有效单级别：{reqLiteData?.level_txt}</span>)
              : (<span style={{ marginLeft: 20, fontWeight: 'normal', color: 'grey' }}>有效单级别：{
                updatereqlevel ? <Select disabled={!operateAble} onChange={this.onReqLevelChange} value={reqLiteData?.level ? reqLiteData?.level : ''} style={{ width: 70 }}>
                  {
                    config.requirementLevel && config.requirementLevel.map(item => (<Option value={item.id + ''}>{item.name}</Option>))
                  }
                </Select> : reqLiteData?.level_txt
              }</span>)
          }
          <span style={{ marginLeft: 20, fontWeight: 'normal', color: 'grey' }}>
            质检结果：{reqLiteData?.qt_result_txt}
            {
              reqLiteData?.qt_result == 2 && <Popover content={(<div style={{ maxWidth: 250, maxHeight: 100, overflowY: 'auto' }}>{'驳回原因：' + reqLiteData?.qt_result_reason}</div>)}>
                    <QuestionCircleOutlined style={{marginLeft:5,color:'#1890ff'}}/>
                </Popover>
            }
          </span>
        </div>}>
        <Spin spinning={!!loading}>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <Card bordered={false}>
                <div className={styles.toolbarwrapper}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    { // 客户被合并 *
                      repeatStatus == 2 && (
                        <div>
                          <Tag color="#c00" style={{ width: 65, fontSize: 10, marginTop: "auto", marginBottom: "auto" }}>客户合并</Tag>
                          {/* <a onClick={()=>this.toCustomerDetail(customerDetail.customerData.customerId)}>切换到保留客户 ></a>
                          <Alert message="该客户已被判定为重复客户，请切换到保留客户继续跟进原有效单。" type="warning" showIcon closable /> */}
                        </div>
                      )
                    }

                    <div>
                      <span style={{ fontWeight: "bold", fontSize: 20 }}>{customerData.customerName}</span>
                      { // 如果是有效单详情，显示如下信息：
                        showStyle == 1 && (
                          <span>
                            <span style={{ marginLeft: 30, marginRight: 10 }}>负责客服 :</span>
                            <span>{reqLiteData.kefu}</span>
                            {CrmUtil.getCompanyType() == 2 ? <span style={{ marginLeft: 50, marginRight: 10 }}>负责邀约 :</span> : <span style={{ marginLeft: 50, marginRight: 10 }}>负责顾问 :</span>}
                            <span>{reqLiteData.sale}</span>
                            <span style={{ marginLeft: 50, marginRight: 10 }}>负责协作人 :</span>
                            <span>{reqLiteData.associates}</span>
                          </span>
                        )
                      }
                    </div>

                    { // 操作按钮区域。 前提是有操作权限：
                      <div>
                        {  // 有效单详情，且，有效单没有被合并掉,没关单，不是无效。 才展示操作按钮
                          readOrWrite == 1 && (showStyle == 1 && operateAble) && this.getButtons()
                        }
                        <span>{
                          (showStyle == 1) && this.btnQA()
                        }</span>
                        <span>{
                          (showStyle == 1) && this.btnQaAll()
                        }</span>
                      </div>
                    }
                  </div>

                  <div className={styles.followWrapper}>
                    {
                      showStyle == 1 && (
                        <div style={{ marginTop: 10, marginBottom: 9 }}>下次回访时间:<span style={{ width: 50 }}>{reqLiteData.next_contact_time}</span></div>
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
                  {/* <TabPane tab="客户全景" key="1">
                  <CustomerAll showStyle={this.state.showStyle} customerDetail={customerDetail} onRecommClick={this.onRecommClick}></CustomerAll>
                </TabPane> */}
                  <TabPane tab="客户信息" key="2">
                    <CustomerInfo
                      permission={permission}
                      editable={readOrWrite}
                      customerData={customerData}
                      config={config}
                      allUser={allUser}
                      onChange={this.updateCustomerInfo}>
                    </CustomerInfo>
                  </TabPane>
                  {
                    showStyle == 0 && config?.category?.length > 0 && <TabPane tab="客户线索" key="5">
                      <CustomerLeads
                        config={config}
                        customerLeadsListData={customerLeadsListData}
                        fun_refreshCustomerLeadsAll={() => { }}
                        fun_refreshCustomerLeadsList={this.handleCategoryLeadsList}
                        optionable={0}
                        fun_reqLeadsRender={this.handleLeadsNumRender} />
                    </TabPane>
                  }
                  <TabPane tab="联系人" key="3">
                    <ContactTab editable={readOrWrite == 1 && showStyle == 1} contactUserData={contactUserData} config={config} onChanged={this.onContactChanged}></ContactTab>
                  </TabPane>
                  {
                    this.state.customerId && (
                      <TabPane tab="意向需求" key="4" forceRender={true}>
                        {/* <IntentionalDemand
                          customerId={this.state.customerId}
                          isclaimFlag={false}
                          onRef={this.onRef}
                          currentUserInfo={this.currentUserInfo}
                          reqId={this.state.reqId}
                          showStyle={showStyle}
                          readOrWrite={readOrWrite}
                        /> */}
                        {
                          customerData?.customerId && config?.category?.length > 0 && <CategoryReq
                            customerId={customerData.customerId}
                            optionable={(readOrWrite == 1 && showStyle == 1) ? 1 : 0}
                            config={config}
                            leadsId={reqLiteData.leads_id}
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
                            defaultCategoryId={reqLiteData.top_category}
                            reqId={this.state.reqId}
                            fun_reqNumRender={this.handleReqNumRender} 
                            checkCustomerInfo={this.checkCustomerInfo}/>
                        }
                      </TabPane>
                    )
                  }
                  <TabPane tab="订单信息" key="6">
                    <OrderInfo onRef={this.onOrderRef} customerId={this.state.customerId} loading={this.props.loading} />
                  </TabPane>
                  {
                    CrmUtil.getCompanyType() == 1 && this.state.showStyle == 1 && permission.thirdnotebutton && <TabPane tab="商家备注" key="10">
                      <MerchantRemark reqId={this.state.reqId} data={merchantRemarkData} fun_fetchMerchantRemarkList={this.fetchMerchantRemarkList} />
                    </TabPane>
                  }
                  {
                    CrmUtil.getCompanyType() == 1 && this.state.showStyle == 1 && permission.thirdnotebutton && <TabPane tab="三方录音" key="11">
                      <ThirdRecord reqId={this.state.reqId} data={thirdRecordData} fun_fetchThirdRecordDataList={this.fetchThirdRecordList} />
                    </TabPane>
                  }
                  {callcenteradapter_getrecordlist == true ? <TabPane tab="通话记录" key="7">
                    <QualityInspection
                      reqId={this.state?.reqId}
                      customerId={this.state?.customerId}
                      showStyle={this.state.showStyle}
                      listenrecorder={listenrecorder}
                      showqtbutton={permission?.showqtbutton ?? false}
                      reqLiteData={reqLiteData ?? {}}
                    />
                  </TabPane> : ''}
                  <TabPane tab="项目成员" key="8">
                    <TeamTab teamRole={teamRole} showStyle={this.state.showStyle} teamList={reqTeamData} allUser={allUser} requirementList={requirementData} onChanged={this.onTeamChanged} onDeleteTeam={this.onDeleteTeam}></TeamTab>
                  </TabPane>
                  {
                    showStyle == 1 && <TabPane tab="协作列表" key="9">
                      <CooperationTab cooperationData={cooperationData}></CooperationTab>
                    </TabPane>
                  }
                </Tabs>
              </Card>
            </Col>

            <Col span={7}>
              <Card bordered={false}>
                <FollowView showStyle={this.state.showStyle}
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
                showStyle={this.state.showStyle}
                reqId={this.state.reqId}
                customer={customerData ? customerData : {}}
                customerConfig={config}
                sendreqreport={sendreqreport}
                followData={followData}
                wechat={customerData ? customerData.weChat : ''}
                isFriend={isFriend}
                getFollowList={this.getFollowList}
                hiddenFollowInfo={this.canceladdSalesOfDynamicFunction}
                contacts={contactUserData}
                defaultCategoryId={reqLiteData.top_category}
                refreshFunction={() => {
                  this.fetchCustomerDetail()
                  this.handleCategoryReqList(this.currentCategoryId)
                }}
                tab={this?.state?.tab}
              />
            </div>
          </Drawer>

          <TransferToUserForm {...parentMethods} visible={modalVisible} defaultValue={this.currentUserInfo.id} label="负责销售" />

          <Modal
            destroyOnClose
            title="派发有效单"
            visible={postModalVisible}
            centered={true}
            onOk={this.postOkHandle}
            onCancel={() => this.setPostModalVisible(false)}>
            <div>
              <span>请选择接收人</span>
              <span>
                <Select
                  allowClear
                  showSearch
                  style={{ width: 300 }}
                  placeholder="请选择接收人"
                  optionFilterProp="children"
                  onChange={this.onChange}>
                  {
                    merchantList && merchantList.map(item => (
                      <Option value={item.id}>
                        {item.name}
                      </Option>
                    )
                    )
                  }
                </Select>
              </span>
            </div>
          </Modal>

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

          <Modal
            title='质检驳回原因'
            visible={this.state.qaModalVisible}
            centered
            destroyOnClose={true}
            onOk={this.onQAModeSure}
            onCancel={() => this.setQaVisible(false)}>
            <div>
              <Checkbox.Group style={{ width: '100%' }} onChange={this.onCompanyChange}>
                <Row>
                  {
                    config.requirementQtInvalidReason && config.requirementQtInvalidReason.length > 0 &&
                    config.requirementQtInvalidReason.map((item: any) => (
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Popover content={item.tips}>
                          <Checkbox value={item.id}>{item.name}</Checkbox>
                        </Popover>
                      </Col>
                    ))
                  }
                </Row>
              </Checkbox.Group>

              <TextArea
                onChange={this.qaModeTextChange}
                placeholder='请填写质检驳回原因'
                rows={6}>
              </TextArea>
            </div>
          </Modal>

          <StartCustomerComplaintModal
            loading={this.state.complaintLoading}
            visible={this.state.complaintModalVisible}
            configDatas={config.complaintType}
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
                    config.requirementReturnReason && config.requirementReturnReason.map(item => (
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
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;