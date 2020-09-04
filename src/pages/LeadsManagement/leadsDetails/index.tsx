import URL from '@/api/serverAPI.config';
import LOCAL from '@/utils/LocalStorageKeys';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Drawer, Modal, Row, Select, Tabs, message, Dropdown, Menu, Empty, Spin } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form/Form';
import Axios from 'axios';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import React, { Component } from 'react';
import { Action, Dispatch } from "redux";
import ContactInfo from './components/ContactInfo';
import CustomerInfo from './components/CustomerInfo';
import FollowUpInfo from './components/FollowUpInfo';
import IntentionalDemand from './components/IntentionalDemand';
import LeadRntryFollow from './components/LeadRntryFollow';
import OrderInfo from './components/OrderInfo';
import QualityInspection from './components/qualityInspection';
import RecommendMerchant from './components/RecommendMerchant';
import { StateType } from "./model";
import styles from './style.less';
import TextArea from 'antd/lib/input/TextArea';
import FileUpload from '@/components/FileUpload';
import MultiFilesUpload from '@/components/MultiFilesUpload';
import StartCustomerComplaintModal from '@/components/StartCustomerComplaintModal';
import CategoryReq from '@/pages/DxlLeadsManagement/dxlLeadsList/components/CategoryReq';
import { ConfigData } from './data';
import CustomerLeads from '@/pages/DxlLeadsManagement/dxlLeadsList/components/CustomerLeads';
import MerchantRemark from '@/pages/DxlLeadsManagement/dxlLeadsList/components/MerchantRemark';
import ThirdRecord from '@/pages/DxlLeadsManagement/dxlLeadsList/components/ThirdRecord';
import CrmUtil from '@/utils/UserInfoStorage';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';


const FormItem = Form.Item;
const { Option } = Select;

interface CustomerDetailProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'leadManagementDetail/getFollowConfigInfo'
      | 'leadManagementDetail/getGroupUserList'
      | 'leadManagementDetail/fetchCustomerInfo'
      | 'leadManagementDetail/getNextLeadsId'
      | 'leadManagementDetail/getIsFriend'
      | 'leadManagementDetail/getFollowList'
      | 'leadManagementDetail/getDistributeGroupConifgInfo'
      | 'leadManagementDetail/getDistributePeopleConifgInfo'
      | 'leadManagementDetail/distributeUserList'
      | 'leadManagementDetail/updateReqList'
      | 'leadManagementDetail/createAssociates'
      | 'leadManagementDetail/getUserPermissionList'
      | 'leadManagementDetail/submitComplaint'
      | 'leadManagementDetail/toComplaintDetail'
      | 'leadManagementDetail/fetchReqList'
      | 'leadManagementDetail/fetchCustomerLeadsList'
      | 'leadManagementDetail/fetchOrderList'
      //商家备注
      | 'leadManagementDetail/fetchMerchantnotes'
      //三方录音
      | 'leadManagementDetail/fetchThirdrecards'
    >
  >;
  loading: boolean;
  leadManagementDetail: StateType;
}

interface TableListState {
  showColleagueChange: boolean;
  colleagueChangeId: string;
  customerId: string,
  leadId: string,
  categoryId: string,
  isFinshRequestWeChat: boolean;
  showFollowInfo: boolean;
  isclaimFlag: boolean;
  isDistribute: boolean;

  showLeadsDistribute: boolean;
  showCollaborators: boolean;
  selectReqId: string;
  slelectUserId: string;

  tabActiveKey: string;
  complaintModalVisible: boolean,
  complaintLoading: boolean,
  uploadedFiles: string[];
  isUploadFile: boolean;
  currentUserInfo: any;
  isFirstFollowRequets: boolean,
}

@connect(
  ({
    leadManagementDetail,
    loading,
  }: {
    leadManagementDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    leadManagementDetail,
    loading: loading.models.leadManagementDetail,
  }),
)

class LeadDetails extends Component<CustomerDetailProps> {
  //客户id
  customerId = this.props.location.query.customerId ?? this.props.location.state?.customerId ?? '';
  leadId = this.props.location.query.leadId ?? this.props.location.state?.leadId ?? '';
  categoryId = this.props.location.query.categoryId ?? this.props.location.state?.categoryId ?? '';
  saveParams = this.props.location.state?.saveParams ?? '';
  ownerId = this.props.location.query.ownerId ?? this.props.location.state?.ownerId ?? '';
  hiddenNextButton = this.props.location.state?.hiddenNextButton ? this.props.location.state?.hiddenNextButton : false;
  isDistribute = this.props.location.state?.isDistribute ?? '';
  child: any;
  childCustomerLeads: any;

  state: TableListState = {
    showColleagueChange: false,
    colleagueChangeId: '',
    customerId: this.customerId,
    leadId: this.leadId,
    categoryId: this.categoryId,
    isFinshRequestWeChat: false,
    showFollowInfo: false,
    isclaimFlag: false,
    isDistribute: this.isDistribute,
    showLeadsDistribute: false,
    showCollaborators: false,
    selectReqId: '',
    slelectUserId: '',
    tabActiveKey: '1',
    complaintModalVisible: false,
    complaintLoading: false,
    uploadedFiles: [],
    isUploadFile: false,
    currentUserInfo: {},
    isFirstFollowRequets: true,
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    console.log(">>>FUCNTION>>>  componentDidMount   ")
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    console.log("currentUserInfo = " + currentUserInfoStr);
    var tempCurrentUserInfo;
    try {
      if (currentUserInfoStr) {
        tempCurrentUserInfo = JSON.parse(currentUserInfoStr);
      }
    } catch (e) {
      tempCurrentUserInfo = currentUserInfoStr;
    }
    this.setState({
      currentUserInfo: tempCurrentUserInfo
    })

    this.getDetailsFunction()

    if (this.props.location.state?.claimTableListFlag) {
      this.setState({
        isclaimFlag: true
      })
    } else {
      this.setState({
        isclaimFlag: false
      })
    }
    const { dispatch } = this.props;
    //拉取搜索组
    dispatch({
      type: 'leadManagementDetail/getDistributeGroupConifgInfo',
    });
    //拉取搜索用户
    dispatch({
      type: 'leadManagementDetail/getDistributePeopleConifgInfo',
    });
    //协作人和派发人列表
    dispatch({
      type: 'leadManagementDetail/distributeUserList',
    });
    // 用户权限
    dispatch({
      type: 'leadManagementDetail/getUserPermissionList',
      payload: '',
    });

    //console.log('this.props.location.state.claimTableListFlag',this.props.location.state.claimTableListFlag)
    // console.log(this.saveParams);
  }

  //刷新有效单（自动会刷新详情）
  refreshDeatailAndDemand = (customerId: string, leadsId: string, tab: string) => {
    const { dispatch } = this.props;
    if (this.child != undefined) {
      this.child.refreshCurrentCategoryReqList()
    }
    //刷新客户信息（有有效单信息）
    dispatch({
      type: 'leadManagementDetail/fetchCustomerInfo',
      payload: {
        id: this.state.customerId,
        leadsId: this.state.leadId,
      },
    });
  }

  getDetailsFunction = () => {
    const { dispatch } = this.props;
    const { leadManagementDetail: { customer } } = this.props;
    const { leadId, customerId } = this.state;
    let values = {}
    let values3 = {}
    let values4 = this.saveParams ? this.saveParams : {};
    values['followType'] = '1'
    values3['leadsId'] = leadId;
    values4['leadsId'] = leadId;
    console.log(customerId)

    this.setState({
      isFinshRequestWeChat: false
    })

    dispatch({
      type: 'leadManagementDetail/getFollowConfigInfo',
      payload: values,
      callback: (config: ConfigData) => {
        if (config.category.length == 0) {
          return
        }
        //意向需求
        const params = {
          customerId: customerId,
          leadsId: leadId,
          aggregation: '1',
          category: config.category[0].id,
        };
        dispatch({
          type: 'leadManagementDetail/fetchReqList',
          payload: params,
        });
        // console.log("cateId", this.state.categoryId)
        // console.log("cateIddd=",(!this.state.categoryId || this.state.categoryId == undefined)  ? config.category[0].id : this.state.categoryId)
        // console.log('cateIdconfig', config)
        //客户线索
        const params2 = {
          id: leadId,
          category: (!this.state.categoryId || this.state.categoryId == undefined) ? config.category[0].id : this.state.categoryId,
        };
        dispatch({
          type: 'leadManagementDetail/fetchCustomerLeadsList',
          payload: params2,
        });
      }
    });

    dispatch({
      type: 'leadManagementDetail/getGroupUserList',
    });

    this.getCustomerInfoFunction()

    dispatch({
      type: 'leadManagementDetail/getNextLeadsId',
      payload: values4,
    });

  }

  getCustomerInfoFunction = () => {
    const { dispatch } = this.props;
    const { customerId, leadId } = this.state;
    let values2 = {}
    values2['id'] = customerId;
    values2['leadsId'] = leadId;
    dispatch({
      type: 'leadManagementDetail/fetchCustomerInfo',
      payload: values2,
      callback: (data: any) => {
        if (this.state?.isFirstFollowRequets) {
          this.setState({
            isFirstFollowRequets: false,
          }, () => {
            if (data?.followData?.followTab?.length > 0) {
              let item = data?.followData?.followTab[0]
              this.getFollowList(item.key);
            } else {
              this.getFollowList("1");
            }
          })
        }
      },
    });

  }

  componentWillReceiveProps = (nextProps: any) => {
    const { location, leadManagementDetail: { customer } } = nextProps;
    const { isFinshRequestWeChat, customerId } = this.state;
    const { dispatch } = this.props;
    console.log(">>>FUCNTION>>>  componentWillReceiveProps    customer = " + customer)

    let tempCustomerId = this.props.location.query?.customerId ?? this.props.location.state?.customerId ?? location.state?.customerId ?? '';

    if (tempCustomerId != customerId) {
      this.setState({
        customerId: location.state.customerId,
        leadId: location.state.leadId
      }, () => {
        this.loadData();
      });

    } else {
      if ((customer?.weChat?.length > 0 || customer?.encryptPhone?.length > 0) && customerId == customer?.customerId) {

        const wechat = customer?.weChat;
        const encryptPhone = customer?.encryptPhone;

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
            type: 'leadManagementDetail/getIsFriend',
            payload: values,
          })
          this.setState({
            isFinshRequestWeChat: true
          })
        }
      }
    }
  }

  // 转给同事
  colleagueChange = () => {
    this.setState({
      showColleagueChange: true,
    });

  }

  colleagueChangeRequest = () => {
    const { colleagueChangeId } = this.state;

    let value = {};
    value["id"] = this.state.leadId;
    value["ownerId"] = colleagueChangeId;

    Axios.post(URL.transfer, value).then(
      res => {
        if (res.code == 200) {

          this.getDetailsFunction()

          this.setState({
            showColleagueChange: false,
            colleagueChangeId: '',
          })

          window.history.back();
        }
      }
    );

  }

  colleagueSelectChange = (value: any) => {
    console.log(value)
    this.setState({
      colleagueChangeId: value,
    })
  }

  //线索派发
  leadsDistribute = () => {
    this.setState({
      showLeadsDistribute: true
    });
  }

  leadsDistributeReqChange = (value: any) => {
    console.log(value)
    this.setState({
      slelectUserId: value,
    })
  }

  leadsDistributeCategoryChange = (value: any) => {
    console.log(value)
    this.setState({
      selectReqId: value,
    })
  }

  onRef = (ref: any) => {
    this.child = ref
  }

  onCustomerLeadsRef = (ref: any) => {
    this.childCustomerLeads = ref
  }

  handleDistributeOk = () => {
    const { dispatch } = this.props;
    if (this.state.slelectUserId == '') {
      message.error("请选择接收人");
      return;
    }
    if (this.state.selectReqId == '') {
      message.error("请选择有效单");
      return;
    }
    const params = {
      reqId: this.state.selectReqId,
      ownerId: this.state.slelectUserId,
      remark: '派发线索'
    };
    dispatch({
      type: 'leadManagementDetail/updateReqList',
      payload: params,
      callback: (code: number, msg: string) => {
        this.setState({
          showLeadsDistribute: false,
          selectReqId: '',
          slelectUserId: '',
        });
        if (code != 200) {
          return;
        }
        message.success('线索派发成功');
      }
    });
  }

  handleDistributeCancel = () => {
    this.setState({
      showLeadsDistribute: false,
      selectReqId: '',
      slelectUserId: '',
    });
  }

  //添加协作人
  addCollaborators = () => {
    this.setState({
      showCollaborators: true,
    });
  }

  addCollaboratorsReqChange = (value: any) => {
    console.log(value)
    this.setState({
      slelectUserId: value,
    })
  }

  addCollaboratorsCategoryChange = (value: any) => {
    console.log(value)
    this.setState({
      selectReqId: value,
    })
  }

  handleAddCollaboratorsOk = () => {
    const { dispatch } = this.props;
    if (this.state.slelectUserId == '') {
      message.error("请选择协作人");
      return;
    }
    if (this.state.selectReqId == '') {
      message.error("请选择有效单");
      return;
    }
    this.setState({
      showCollaborators: false,
      selectReqId: '',
      slelectUserId: '',
    });
    const params = {
      reqId: this.state.selectReqId,
      associatesId: this.state.slelectUserId,
    };
    dispatch({
      type: 'leadManagementDetail/createAssociates',
      payload: params,
      callback: (code: number, msg: string) => {
        this.setState({
          showLeadsDistribute: false,
          selectReqId: '',
          slelectUserId: '',
        });
        if (code != 200) {
          return;
        }
        message.success('添加协作人成功');
      }
    });
  }

  handleAddCollaboratorsCancel = () => {
    this.setState({
      showCollaborators: false,
      selectReqId: '',
      slelectUserId: '',
    });
  }

  //添加客户线索
  handleCreateLeads = (name: string, value: number) => {
    this.childCustomerLeads.handleCreateLeads(name, value);
  }

  //添加有效单
  handleSelectCategory = (name: string, value: number) => {
    this.child.handleSelectCategory(name, value);
  }

  checkCustomerInfo = () => {
    const { leadManagementDetail: { customer } } = this.props
    if (customer && customer.identity != '0' && customer.identity != '' && customer.identity != null) {
      return true;
    } else {
      Modal.confirm({
        title: '系统提示：',
        icon: <ExclamationCircleOutlined />,
        content: '当前客户【客户信息】信息未填写，请先到客户列表-客户详情页-客户信息页完善该内容',
        okText: '知道了',
        onOk() {

        },
      });
      return false;
    }
  }



  //关闭有效单
  handleCloseReq = (reqId: string) => {
    const data = {
      id: reqId,
    }
    this.child.handleCloseReq(data);
  }


  //客诉单
  customerComplaint = () => {
    this.setState({
      complaintModalVisible: true
    })
  }

  cancaleColleagueChange = () => {
    this.setState({
      showColleagueChange: false,
      colleagueChangeId: '',
    });
  }

  // 退回公海
  returnTheClues = () => {
    let value = {};
    value["id"] = this.state.leadId;

    Axios.post(URL.giveback, value).then(
      res => {
        if (res.code == 200) {

          this.getDetailsFunction()

          window.history.back();

          // this.setState({
          //   showColleagueChange: false,
          //   colleagueChangeId: '',
          // })
        }
      }
    );

  }

  // 商家信息
  storeDetails = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/store/storeDetails',
      query: {
        customerId: this.state.customerId,
      }
    }))
  }

  // 下一单
  nextLeads = () => {

    const { leadManagementDetail: { nextLeadsInfo: { customer_id, leads_id } } } = this.props;

    if (customer_id > 0 && leads_id > 0) {
      this.state.customerId = customer_id;
      this.state.leadId = leads_id;
      this.setState({
        customerId: customer_id,
        leadId: leads_id,
        isFirstFollowRequets: true,
      }, () => {
        const { customerId } = this.state;
        console.log(customer_id)
        console.log(leads_id)

        this.getDetailsFunction()
      });
    }
  }

  // 跟进数据
  getFollowList = (tab: string) => {
    this.setState({
      tabActiveKey: tab
    })
    const { dispatch } = this.props;
    let values = {}
    values['customerId'] = this.state.customerId;
    values['relationId'] = this.state.leadId;
    values['tab'] = tab;
    values['type'] = 1
    console.log('请求了')
    dispatch({
      type: 'leadManagementDetail/getFollowList',
      payload: values,
    });
  }

  showFollowInfo = () => {
    this.setState({
      showFollowInfo: true,
    })
  }

  hiddenFollowInfo = () => {
    this.setState({
      showFollowInfo: false,
    })
  }

  // onUploadDone = (full_paths: string[]) => {
  //   this.setState({
  //     isUploadFile: true,
  //     uploadedFiles: full_paths,
  //   })
  // }

  handleSubmitComplaint = (fieldsValue: any) => {
    let params = {
      ...fieldsValue,
      customerId: this.state.customerId,
      ownerId: this.ownerId,
      linkId: this.state.leadId,
      from: 1,  // 线索
    };

    this.setState({
      complaintLoading: true,
    })
    const { dispatch } = this.props;
    dispatch({
      type: "leadManagementDetail/submitComplaint",
      payload: params,
      callback: (success: boolean, msg: string, id: string) => {
        if (success) {
          message.success("客诉单提交成功！");
          // 更新线索详情
          this.getCustomerInfoFunction();
        } else {
          message.error(msg);
        }
        this.setState({
          complaintModalVisible: false,
          complaintLoading: false,
        })
      }
    });
  }

  toComplaintDetail = (id: string) => {
    const { dispatch, } = this.props;
    dispatch({
      type: "leadManagementDetail/toComplaintDetail",
      payload: {
        id,
        customerId: this.state.customerId
      }
    });
  }

  refreshCustomerLeadsAll = (categoryId: string) => {
    const { dispatch } = this.props;
    //客户线索
    const params = {
      id: this.state.leadId,
      category: categoryId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchCustomerLeadsList',
      payload: params,
    });
    //刷新客户信息（有有效单信息）
    dispatch({
      type: 'leadManagementDetail/fetchCustomerInfo',
      payload: {
        id: this.state.customerId,
        leadsId: this.state.leadId,
      },
    });
  }

  refreshCustomerLeadsList = (categoryId: string) => {
    const { dispatch } = this.props;
    //客户线索
    const params = {
      id: this.state.leadId,
      category: categoryId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchCustomerLeadsList',
      payload: params,
    });
  }

  refreshCategoryReq = (categoryId: string) => {
    const { dispatch } = this.props;
    //刷新意向需求
    const params = {
      customerId: this.state.customerId,
      leadsId: this.state.leadId,
      aggregation: '1',
      category: categoryId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchReqList',
      payload: params,
    });
    //刷新客户信息（有有效单信息）
    dispatch({
      type: 'leadManagementDetail/fetchCustomerInfo',
      payload: {
        id: this.state.customerId,
        leadsId: this.state.leadId,
      },
    });
    //刷新订单信息
    const params2 = {
      customerId: this.state.customerId,
      pageSize: '1000',
    };
    dispatch({
      type: 'leadManagementDetail/fetchOrderList',
      payload: params2,
    });
  }

  refreshCategoryReqList = (categoryId: string) => {
    const { dispatch } = this.props;
    const params = {
      customerId: this.state.customerId,
      leadsId: this.state.leadId,
      aggregation: '1',
      category: categoryId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchReqList',
      payload: params,
    });
  }

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

  fetchMerchantRemarkList = (leadsId: string, page: number, pageSize: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'leadManagementDetail/fetchMerchantnotes',
      payload: {
        leadId: leadsId,
        index: page,
        size: pageSize,
      }
    });
  }

  fetchThirdRecordList = (leadsId: string, page: number, pageSize: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'leadManagementDetail/fetchThirdrecards',
      payload: {
        leadId: leadsId,
        index: page,
        size: pageSize,
      }
    });
  }

  render() {
    const { TabPane } = Tabs;

    const { leadManagementDetail: { customer, customerConfig, userList, isFriend, contacts, reqGroupData, customerLeadsListData, merchantRemarkData, thirdRecordData }, form: { getFieldDecorator }, } = this.props;

    const { leadManagementDetail: { nextLeadsInfo: { customer_id, leads_id } } } = this.props;
    const { leadManagementDetail: { customerFollowInfo } } = this.props;
    const { leadManagementDetail: { distributeUserList } } = this.props;
    const { leadManagementDetail: { permission } } = this.props;
    const { callcenteradapter_getrecordlist, requirementadapter_updatereq, requirementadapter_closereq, leadsadapter_transfer, listenrecorder, complaintadapter_btn, requirementadapter_createreq, chuangjianxs } = permission;

    const categoryMenu = (
      <Menu>
        {
          customerConfig.category.map(categ => (
            <Menu.Item>
              <a onClick={() => this.handleSelectCategory("新建" + categ.name + "有效单", Number(categ.id))}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );

    const leadsMenu = (
      <Menu>
        {
          customerConfig.category.map(categ => (
            <Menu.Item>
              <a onClick={() => this.handleCreateLeads("新建" + categ.name + "线索", Number(categ.id))}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );

    const { currentUserInfo } = this.state.currentUserInfo;
    //暂不打开，目前权限需求只有同事操作权限，线索返回的需求单对我的和同事的还不明确
    const categoryCloseMenu = (
      <Menu>
        {
          customer && customer.requirement.map(item => (
            (item.phase == 1 || item.phase == 2) && requirementadapter_closereq ? <Menu.Item><a onClick={() => this.handleCloseReq(item.reqId)}>{item.category}{item.req_num}</a></Menu.Item> : null
          ))
        }
      </Menu>
      // <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    // 如果有客诉信息，且客诉状态为处理中，
    const complaintIsGoingOn = customer && (customer.complaint_status == 1 || customer.complaint_status == 2 || customer.complaint_status == 3);

    console.log("details", this.state.categoryId);
    return (
      <PageHeaderWrapper title={
        <div>
          <span>线索详情</span>
          <span style={{ marginLeft: 20, fontWeight: 'normal', color: 'grey' }}>{this.state.leadId}</span>
        </div>
      }>
        <Spin spinning={this.props.loading}>
          <Card bordered={false}>
            <div className={styles.boxInline}>
              <div className={styles.headerMaxTitle}>{customer && customer.customerName}</div>
              <div
                className={styles.headerMinTitle}
                style={{
                  marginLeft: 15,
                  marginTop: 8,
                }}
              ><span>客服负责人</span>
              ：{this.props.leadManagementDetail.customer ? this.props.leadManagementDetail.customer.owner_name : ""}
              </div>
            </div>
            <div hidden={this.state.isclaimFlag || this.state.isDistribute} style={{
              marginTop: 18,
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div>
                <Button hidden={true} type="primary" onClick={this.storeDetails}>商家信息</Button>
                <Button hidden={true} type="primary" onClick={this.returnTheClues} style={{ marginLeft: 10 }} >退回公海</Button>
                <Button type="primary" onClick={this.addCollaborators}>添加协作人</Button>
                {requirementadapter_updatereq == true ? <Button type="primary" onClick={this.leadsDistribute} style={{ marginLeft: 10 }} >线索派发</Button> : ''}
                {/* {leadsadapter_transfer == true ? <Button type="primary" onClick={this.colleagueChange} style={{ marginLeft: 10 }} >转给同事</Button> : null} */}
                {chuangjianxs ? <Dropdown overlay={leadsMenu}>
                  <Button type="primary" style={{ marginLeft: 10 }}>添加线索</Button>
                </Dropdown> : null}
                {requirementadapter_createreq ? <Dropdown overlay={categoryMenu}>
                  <Button type="primary" style={{ marginLeft: 10 }}>添加有效单</Button>
                </Dropdown> : null}
                {/* <Dropdown overlay={categoryCloseMenu}>
                <Button type="primary" style={{ marginLeft: 10 }}>关闭有效单</Button>
              </Dropdown> */}
                <Button style={{ marginLeft: 10 }} type="primary"
                  disabled={complaintIsGoingOn && (!complaintadapter_btn)}
                  onClick={() => {
                    // 如果有客诉信息，且客诉状态为处理中，
                    if (complaintIsGoingOn && customer && customer.complaint_id) {
                      // 跳转到客诉详情
                      this.toComplaintDetail(customer.complaint_id);
                    } else {
                      this.setState({
                        complaintModalVisible: true
                      });
                    }
                  }}
                >{complaintIsGoingOn ? "客诉处理中" : "客诉单"}</Button>
              </div>
              <div>
                <Button type="primary" onClick={this.showFollowInfo} style={{ marginLeft: 10 }} ><EditOutlined />录跟进</Button>
                {this.hiddenNextButton ? <span /> : (customer_id > 0 ? <Button style={{ marginLeft: 10 }} onClick={this.nextLeads}> 下一单</Button> : <span />)}
              </div>
            </div>
          </Card>

          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col span={16}>
              <Card bordered={false}>
                <Tabs type="card">
                  <TabPane tab="客户信息" key="1">
                    <CustomerInfo isclaimFlag={this.state.isclaimFlag} isDistribute={this.state.isDistribute} leadsId={this.state.leadId} />
                  </TabPane>
                  <TabPane tab="客户线索" key="5" forceRender={true}>
                    {customerConfig?.category?.length > 0 && <CustomerLeads config={customerConfig} customerLeadsListData={customerLeadsListData} fun_refreshCustomerLeadsAll={this.refreshCustomerLeadsAll} fun_refreshCustomerLeadsList={this.refreshCustomerLeadsList} optionable={(this.state.isclaimFlag || this.state.isDistribute) ? 0 : 1} defaultCategoryId={this.state.categoryId} onCustomerLeadsRef={this.onCustomerLeadsRef} leadsId={this.state.leadId} />}
                  </TabPane>
                  <TabPane tab="联系人" key="2" forceRender={true}>
                    <ContactInfo customerId={this.state.customerId} customerConfig={customerConfig} isclaimFlag={this.state.isclaimFlag} isDistribute={this.state.isDistribute} />
                  </TabPane>
                  {
                    this.state.customerId && customerConfig?.category?.length > 0 && (<TabPane tab="意向需求" key="3" forceRender={true}>
                      <CategoryReq customerId={this.state.customerId} config={customerConfig} leadsId={this.state.leadId} reqGroupDetails={reqGroupData} onCategoryReqRef={this.onRef} fun_refreshCategoryAll={this.refreshCategoryReq} fun_refreshCategoryReqList={this.refreshCategoryReqList} fun_recommend={this.handleRecommend} fun_review={this.handleReview} optionable={(this.state.isclaimFlag || this.state.isDistribute) ? 0 : 1} checkCustomerInfo={this.checkCustomerInfo} />
                    </TabPane>)
                  }
                  {/* <TabPane tab="浏览足迹" key="4">
                  <BrowseHistory customerId={this.customerId}/>
                </TabPane>
                <TabPane tab="收藏商家" key="5">
                  <FavoriteMerchant customerId={this.customerId}/>
                </TabPane> */}
                  {/* <TabPane tab="推荐商家" key="6">
                  <RecommendMerchant customerId={this.state.customerId} isclaimFlag={this.state.isclaimFlag} />
                </TabPane> */}
                  <TabPane tab="订单信息" key="7">
                    <OrderInfo customerId={this.state.customerId} />
                  </TabPane>
                  {/* {
                    CrmUtil.getCompanyType() == 1 && <TabPane tab="商家备注" key="10">
                      <MerchantRemark leadsId={this.leadId} data={merchantRemarkData} fun_fetchMerchantRemarkList={this.fetchMerchantRemarkList} />
                    </TabPane>
                  }
                  {
                    CrmUtil.getCompanyType() == 1 && <TabPane tab="三方录音" key="11">
                      <ThirdRecord leadsId={this.leadId} data={thirdRecordData} fun_fetchThirdRecordDataList={this.fetchThirdRecordList} />
                    </TabPane>
                  } */}
                  {callcenteradapter_getrecordlist == true ? <TabPane tab="通话记录" key="8">
                    <QualityInspection leadId={this.state?.leadId} isclaimFlag={this.state.isclaimFlag} listenrecorder={listenrecorder} />
                  </TabPane> : ''}
                  {/* <TabPane tab="跟进记录" key="9">
                    <RollowTable
                      customerFollowInfo={customerFollowInfo ? customerFollowInfo : {}}
                      getFollowList={this.getFollowList} />
                  </TabPane> */}
                </Tabs>
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <FollowUpInfo
                  followList={customerFollowInfo}
                  followData={customer && customer?.followData}
                  getFollowFounction={this.getFollowList}
                />
              </Card>
            </Col>
          </Row>
        </Spin>


        <Modal
          visible={this.state.showColleagueChange}
          onCancel={this.cancaleColleagueChange}
          onOk={this.colleagueChangeRequest}
          style={{ marginTop: 250 }}
          title="转给同事">
          <div>
            <Form>
              <Form.Item {...formItemLayout} label='请选择转派人'>
                <Select
                  placeholder='请选择转派人'
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  onChange={this.colleagueSelectChange}>
                  {userList && userList.map((item) => {
                    return (
                      <Option value={item.user_id}>{item.username} {item.group_name}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          title="派发线索"
          okText='确认'
          cancelText='取消'
          visible={this.state.showLeadsDistribute}
          onOk={this.handleDistributeOk}
          onCancel={this.handleDistributeCancel}
          destroyOnClose={true}>
          <Form>
            <Form.Item {...formItemLayout} label='请选择接收人'>
              <Select
                placeholder='请选择接受人'
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                onChange={this.addCollaboratorsReqChange}>
                {distributeUserList && distributeUserList.map((item) => {
                  return (
                    <Option value={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item {...formItemLayout} label='请选择有效单'>
              <Select
                placeholder='请选择有效单'
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                onChange={this.leadsDistributeCategoryChange}>
                {customer?.requirement && customer.requirement.map((item) => {
                  return (
                    (item.phase == 1 || item.phase == 2) ? <Option value={item.reqId}>{item.category}{item.req_num}</Option> : null
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="添加协作人"
          okText='确认'
          cancelText='取消'
          visible={this.state.showCollaborators}
          onOk={this.handleAddCollaboratorsOk}
          onCancel={this.handleAddCollaboratorsCancel}
          destroyOnClose={true}>
          <Form>
            <Form.Item {...formItemLayout} label='请选择协作人'>
              <Select
                placeholder='请选择协作人'
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                onChange={this.addCollaboratorsReqChange}>
                {distributeUserList && distributeUserList.map((item) => {
                  return (
                    <Option value={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item {...formItemLayout} label='请选择有效单'>
              <Select
                placeholder='请选择有效单'
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                onChange={this.addCollaboratorsCategoryChange}>
                {customer?.requirement && customer.requirement.map((item) => {
                  return (
                    (item.phase == 1 || item.phase == 2) ? <Option value={item.reqId}>{item.category}{item.req_num}</Option> : null
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <StartCustomerComplaintModal
          loading={this.state.complaintLoading}
          visible={this.state.complaintModalVisible}
          configDatas={customerConfig.complaintType}
          onOk={this.handleSubmitComplaint}
          onCancel={() => {
            this.setState({ complaintModalVisible: false });
          }}
        />
        <Drawer
          width={590}
          visible={this.state.showFollowInfo}
          closable={true}
          onClose={this.hiddenFollowInfo}>
          <div>
            <LeadRntryFollow
              customerId={this.state.customerId}
              leadId={this.state.leadId}
              customer={customer ? customer : {}}
              customerConfig={customerConfig}
              wechat={customer ? customer.weChat : ''}
              isFriend={isFriend}
              getFollowList={this.getFollowList}
              hiddenFollowInfo={this.hiddenFollowInfo}
              contacts={contacts}
              refreshFunction={this.refreshDeatailAndDemand}
              tabActiveKey={this.state?.tabActiveKey}

            />
          </div>
        </Drawer>
      </PageHeaderWrapper>
    );
  }

}

export default Form.create<CustomerDetailProps>()(LeadDetails);
