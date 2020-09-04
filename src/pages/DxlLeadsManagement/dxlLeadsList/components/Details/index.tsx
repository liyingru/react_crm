
import StartCustomerComplaintModal from '@/components/StartCustomerComplaintModal';
import { ConfigData, ContactInfoData, CustomerInfoData, CustomerLeadsListData, CustomerQualityInspection, FollowTime, OrderData, RequirementDataGroupDetails } from '@/pages/LeadsManagement/leadsDetails/data';
import { DistributeUser } from '@/pages/OrderManagement/orderDetails/data';
import LOCAL from '@/utils/LocalStorageKeys';
import { Button, Dropdown, Form, Menu, message, Modal, Select, Spin, Tabs } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import CategoryReq from '../CategoryReq';
import ContactInfo from '../ContactInfo';
import CustomerInfo from '../Customer';
import CustomerLeads from '../CustomerLeads';
import FollowTable from '../FollowTable';
import OrderInfo from '../OrderInfo';
import QualityInspection from '../QualityInspection';
import MerchantRemark from '../MerchantRemark';
import ThirdRecord from '../ThirdRecord';

const { TabPane } = Tabs;
const { Option } = Select;

interface DetailsProps extends FormComponentProps {
  onDetailsRef: (ref: any) => void;
  checkCustomerInfo?: () => boolean; //新建编辑时检查客户信息
  leadsId: string;
  customer: CustomerInfoData;
  config: ConfigData;
  permission: Permission;
  reqGroupDetails: RequirementDataGroupDetails,
  customerLeadsListData: CustomerLeadsListData[],
  contacts: ContactInfoData[];
  qualityInspection: CustomerQualityInspection[],
  orderList: OrderData[];
  followListData: FollowTime[] | undefined;
  distributeUserList: DistributeUser[];
  isShowNextLeads: boolean;
  categoryId?: string;

  //刷新当前线索列表
  fun_refreshLeadsList: Function;
  //获取联系人列表
  fun_fetchContactList: Function;
  //获取有效单列表
  fun_fetchCategoryReqList: Function;
  //获取客户线索
  fun_fetchCutomerLeadsList: Function;
  //刷新线索详情
  fun_refreshLeadsDetails: Function;
  //获取质量核查列表
  fun_fetchRecordList: Function;
  //获取订单列表
  fun_fetchOrderList: Function;
  //获取跟进列表
  fun_fetchfFollowList: Function;
  //线索派发
  fun_distributeLeads: Function;
  //添加协作人
  fun_addCollaborators: Function;
  //推荐商家
  fun_recommend: Function;
  //审批流审核
  fun_review: Function;
  //客诉单
  fun_complaint: Function;
  fun_toComplaintDetail: Function;
  //下一单
  fun_nextLeads: Function;
  //商家备注
  fun_fetchMerchantRemarkList: Function;
  //三方录音
  fun_fetchThirdRecordList: Function;

  //用户信息loading
  loading_customer: boolean;
  //联系人信息loading
  loading_contact: boolean;
  //意向需求loading
  loading_reqList: boolean;
  //客户线索loading
  loading_customerLeadsList: boolean;
  //质检核查列表loading
  loading_recordList: boolean;
  //订单列表loading
  loading_orderList: boolean;
  //跟进列表loading
  loading_followList: boolean;
  //商家备注loading
  loading_merchantRemark: boolean;
  //三方录音loading
  loading_thirdRecord: boolean;
}

interface DetailsState {
  loginInfo: any;
  showLeadsDistribute: boolean;
  showCollaborators: boolean;
  selectReqId: string;
  selectUserId: string;

  complaintLoading: boolean;
  complaintModalVisible: boolean;

  activeKey: string;
}

class Details extends Component<DetailsProps, DetailsState> {
  customerChild: any;
  customerLeadsChild: any;
  categoryReqChild: any;
  contactChild: any;

  state: DetailsState = {
    loginInfo: {},

    showLeadsDistribute: false,
    showCollaborators: false,
    selectReqId: '',
    selectUserId: '',

    complaintLoading: false,
    complaintModalVisible: false,

    activeKey: "1",
  }

  constructor(props: DetailsProps) {
    super(props)
    this.props.onDetailsRef(this)
    this.fetchLoginIngo()
  }

  componentDidMount() {

  }

  //拉取登录信息
  fetchLoginIngo = () => {
    const loginInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    var loginInfo;
    try {
      if (loginInfoStr) {
        loginInfo = JSON.parse(loginInfoStr);
      }
    } catch (e) {
      loginInfo = loginInfoStr;
    }
    this.setState({
      loginInfo: loginInfo
    })
  }

  //线索派发
  distributeLeads = () => {
    this.setState({
      showLeadsDistribute: true
    });
  }

  //更新用户表单信息
  updateCustomerForm() {
    if (this.customerChild != undefined) {
      this.customerChild.updateCustomerForm();
    }
  }

  leadsDistributeReqChange = (value: any) => {
    this.setState({
      selectUserId: value,
    })
  }

  leadsDistributeCategoryChange = (value: any) => {
    this.setState({
      selectReqId: value,
    })
  }

  handleDistributeOk = () => {
    const { fun_distributeLeads } = this.props
    if (this.state.selectUserId == '') {
      message.error("请选择接收人");
      return;
    }
    if (this.state.selectReqId == '') {
      message.error("请选择有效单");
      return;
    }
    fun_distributeLeads(this.state.selectReqId, this.state.selectUserId, '派发线索', (code: number, msg: string) => {
      this.setState({
        showLeadsDistribute: false,
        selectReqId: '',
        selectUserId: '',
      });
      if (code != 200) {
        return;
      }
      message.success('线索派发成功');
    })
  }

  handleDistributeCancel = () => {
    this.setState({
      showLeadsDistribute: false,
      selectReqId: '',
      selectUserId: '',
    });
  }

  //添加协作人
  addCollaborators = () => {
    this.setState({
      showCollaborators: true,
    });
  }

  handleAddCollaboratorsOk = () => {
    const { fun_addCollaborators, fun_fetchCategoryReqList, customer } = this.props
    if (this.state.selectUserId == '') {
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
      selectUserId: '',
    });
    fun_addCollaborators(this.state.selectReqId, this.state.selectUserId, (code: number, msg: string) => {
      this.setState({
        showLeadsDistribute: false,
        selectReqId: '',
        selectUserId: '',
      });
      if (code != 200) {
        return;
      }
      message.success('添加协作人成功');
      //刷新意向需求
      fun_fetchCategoryReqList(customer.customerId)
    })
  }

  handleAddCollaboratorsCancel = () => {
    this.setState({
      showCollaborators: false,
      selectReqId: '',
      selectUserId: '',
    });
  }

  addCollaboratorsReqChange = (value: any) => {
    this.setState({
      selectUserId: value,
    })
  }

  addCollaboratorsCategoryChange = (value: any) => {
    this.setState({
      selectReqId: value,
    })
  }

  //客诉单
  btnComplaint = () => {
    //1:归属人,2:领导,3:协作人
    const { customer, permission: { complaintadapter_btn } } = this.props;
    // 如果有客诉信息，且客诉状态为处理中，
    const complaintIsGoingOn = customer && (customer.complaint_status == 1 || customer.complaint_status == 2 || customer.complaint_status == 3);
    return (<Button style={{ marginLeft: 10 }} type="primary"
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
    >{complaintIsGoingOn ? "客诉处理中" : "客诉单"}</Button>);
    // return <Button style={{ marginLeft: 10 }} type="primary"
    //   onClick={() => { this.setState({ complaintModalVisible: true }) }}
    //   disabled={customer?.complaint_status == 1}>{customer?.complaint_status == 1 ? "客诉处理中" : "客诉单"}</Button>
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

  handleSubmitComplaint = (fieldsValue: any) => {
    const { fun_complaint, fun_toComplaintDetail, fun_refreshLeadsDetails } = this.props;
    fun_complaint(fieldsValue, () => {
      this.setState({
        complaintLoading: true,
      })
    }, (success: boolean, msg: string, id: string) => {
      if (success) {
        message.success("客诉单提交成功！");
        //fun_toComplaintDetail(id)
        // 更新当前页面
        fun_refreshLeadsDetails(this.props.customer.customerId, this.props.leadsId);
      }
      this.setState({
        complaintModalVisible: false,
        complaintLoading: false,
      })
    }
    )
  }

  //下一个线索详情
  nextLeads = () => {
    this.props.fun_nextLeads();
  }

  //创建客户线索
  createCustomerLeads = (title: string, typeId: string) => {
    this.customerLeadsChild.handleCreateLeads(title, Number(typeId));
  }

  //创建品类有效单
  createCategoryReq = (title: string, typeId: string) => {
    this.categoryReqChild.handleSelectCategory(title, Number(typeId));
  }

  //关闭品类有效单
  closeCategoryReq = (reqId: string) => {
    const data = {
      id: reqId,
    }
    this.categoryReqChild.handleCloseReq(data);
  }

  //用户信息组件引用
  onCustomerRef = (ref: any) => {
    this.customerChild = ref
  }

  //客户线索组件引用
  onCustomerLeadsRef = (ref: any) => {
    this.customerLeadsChild = ref
  }

  //有效单组件引用
  onCategoryReqRef = (ref: any) => {
    this.categoryReqChild = ref
  }

  //联系人组件引用
  onContactRef = (ref: any) => {
    this.contactChild = ref
  }

  //增加联系人
  addContact = () => {
    this.contactChild.handleAddContact();
  }

  //刷新客户线索及关联数据（列表和title按钮都需要刷新）
  refreshCustomerLeadsAll = (categoryId: string) => {
    const { leadsId, customer } = this.props;
    this.props.fun_fetchCutomerLeadsList(leadsId, categoryId);
    this.props.fun_refreshLeadsDetails(customer.customerId, leadsId);
  }

  //刷新客户线索
  refreshCustomerLeadsList = (categoryId: string) => {
    const { leadsId } = this.props;
    this.props.fun_fetchCutomerLeadsList(leadsId, categoryId);
  }

  //刷新有效单及关联数据（列表和title按钮都需要刷新）
  refreshCategoryAll = (categoryId: string) => {
    const { leadsId, customer } = this.props;
    this.props.fun_fetchCategoryReqList(customer.customerId, leadsId, categoryId);
    this.props.fun_refreshLeadsDetails(customer.customerId, leadsId);
    this.props.fun_fetchOrderList(customer.customerId);
  }

  //刷新有效单列表
  refreshCategoryReqList = (categoryId: string) => {
    const { leadsId, customer } = this.props;
    this.props.fun_fetchCategoryReqList(customer.customerId, leadsId, categoryId);
  }

  //刷新当前有效单列表
  refreshCurrentCategoryReqList = () => {
    if (this.categoryReqChild != undefined) {
      this.categoryReqChild.refreshCurrentCategoryReqList()
    }
  }

  tabsChanged = (activeKey: string) => {
    this.setState({
      activeKey,
    })
  }

  render() {
    const { loading_customer, loading_contact, loading_reqList, loading_customerLeadsList, loading_recordList, loading_orderList, loading_followList,
      customer, distributeUserList, permission, config, leadsId, categoryId, reqGroupDetails, customerLeadsListData, contacts, qualityInspection, orderList,
      followListData, isShowNextLeads, fun_refreshLeadsList, fun_fetchCategoryReqList, fun_refreshLeadsDetails, fun_fetchContactList,
      fun_fetchRecordList, fun_fetchOrderList, fun_fetchfFollowList, fun_recommend, fun_review, fun_fetchMerchantRemarkList, loading_merchantRemark, merchantRemarkData, loading_thirdRecord, fun_fetchThirdRecordList, thirdRecordData } = this.props
    const createLeadsMenu = (
      <Menu>
        {
          config.category.map(categ => (
            <Menu.Item>
              <a onClick={() => this.createCustomerLeads("新建" + categ.name + "线索", categ.id)}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    const createReqMenu = (
      <Menu>
        {
          config.category.map(categ => (
            <Menu.Item>
              <a onClick={() => this.createCategoryReq("新建" + categ.name + "有效单", categ.id)}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    const closeReqMenu = (
      <Menu>
        {
          customer && customer.requirement.map(item => (
            (item.phase == 1 || item.phase == 2) && permission.requirementadapter_closereq ? <Menu.Item><a onClick={() => this.closeCategoryReq(item.reqId)}>{item.category}{item.req_num}</a></Menu.Item> : null
          ))
        }
      </Menu>
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
    return (
      <Spin spinning={loading_customer || loading_reqList || loading_customerLeadsList}>
        <div>
          <div style={{
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div>
              <Button type="primary" onClick={this.addCollaborators}>添加协作人</Button>
              {permission.requirementadapter_updatereq ? <Button type="primary" onClick={this.distributeLeads} style={{ marginLeft: 10 }} >线索派发</Button> : ''}
              <Button type="primary" onClick={this.addContact} style={{ marginLeft: 10 }} >添加联系人</Button>
              {permission.chuangjianxs ? <Dropdown overlay={createLeadsMenu}>
                <Button type="primary" style={{ marginLeft: 10 }}>添加线索</Button>
              </Dropdown> : null}
              {permission.requirementadapter_createreq ? <Dropdown overlay={createReqMenu}>
                <Button type="primary" style={{ marginLeft: 10 }}>添加有效单</Button>
              </Dropdown> : null}
              {/* <Dropdown overlay={closeReqMenu}>
                            <Button type="primary" style={{ marginLeft: 10 }}>关闭有效单</Button>
                        </Dropdown> */}
              {
                this.btnComplaint()
              }
            </div>
            {
              isShowNextLeads ? <div>
                <Button style={{ marginLeft: 10 }} onClick={this.nextLeads}> 下一单</Button>
              </div>
                : null
            }
          </div>

          <Tabs type="card" activeKey={this.state.activeKey} onChange={this.tabsChanged}>
            <TabPane tab="客户信息" key="1" forceRender={true}>
              <CustomerInfo loading={loading_customer} customer={customer} config={config} leadsId={leadsId} isDistribute={false} isclaimFlag={false} fun_refreshLeadsList={fun_refreshLeadsList} onCustomerRef={this.onCustomerRef} permission={permission} />
            </TabPane>
            <TabPane tab="客户线索" key="5" forceRender={true}>
              {config?.category?.length > 0 && <CustomerLeads optionable={0} config={config} customerLeadsListData={customerLeadsListData} fun_refreshCustomerLeadsAll={this.refreshCustomerLeadsAll} fun_refreshCustomerLeadsList={this.refreshCustomerLeadsList} defaultCategoryId={categoryId} onCustomerLeadsRef={this.onCustomerLeadsRef} leadsId={leadsId} />}
            </TabPane>
            <TabPane tab="联系人" key="2" forceRender={true}>
              <ContactInfo loading={loading_contact} customer={customer} config={config} contacts={contacts} isDistribute={false} isclaimFlag={false} fun_fetchContactList={fun_fetchContactList} onContactRef={this.onContactRef} />
            </TabPane>
            <TabPane tab="意向需求" key="3" forceRender={true}>
              {customer?.customerId && config?.category?.length > 0 && <CategoryReq customerId={customer?.customerId} config={config} leadsId={leadsId} reqGroupDetails={reqGroupDetails} onCategoryReqRef={this.onCategoryReqRef} fun_refreshCategoryAll={this.refreshCategoryAll} fun_refreshCategoryReqList={this.refreshCategoryReqList} fun_recommend={fun_recommend} fun_review={fun_review} checkCustomerInfo={this.props.checkCustomerInfo} />}
            </TabPane>
            <TabPane tab="订单信息" key="7">
              <OrderInfo loading={loading_orderList} customer={customer} orderList={orderList} fun_fetchOrderList={fun_fetchOrderList} />
            </TabPane>
            {/* <TabPane tab="商家备注" key="10">
              <MerchantRemark leadsId={leadsId} loading={loading_merchantRemark} data={merchantRemarkData} fun_fetchMerchantRemarkList={fun_fetchMerchantRemarkList} />
            </TabPane>
            <TabPane tab="三方录音" key="11">
              <ThirdRecord leadsId={leadsId} loading={loading_thirdRecord} data={thirdRecordData} fun_fetchThirdRecordDataList={fun_fetchThirdRecordList} />
            </TabPane> */}
            {permission.callcenteradapter_getrecordlist ? <TabPane tab="通话记录" key="8">
              <QualityInspection loading={loading_recordList} leadsId={leadsId} qualityInspection={qualityInspection} isclaimFlag={false} fun_fetchRecordList={fun_fetchRecordList} listenrecorder={permission?.listenrecorder} />
            </TabPane> : null}
            <TabPane tab="跟进记录" key="9">
              <FollowTable
                loading={loading_followList} customer={customer} leadsId={leadsId} followListData={followListData} fun_fetchfFollowList={fun_fetchfFollowList} />
            </TabPane>
          </Tabs>

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
                  onChange={this.leadsDistributeReqChange}>
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
            configDatas={config.complaintType}
            onOk={this.handleSubmitComplaint}
            onCancel={() => {
              this.setState({ complaintModalVisible: false });
            }}
          />
        </div>
      </Spin>
    )
  }
}

export default Form.create<DetailsProps>()(Details);
