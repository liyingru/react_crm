import AreaSelect from '@/components/AreaSelect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Cascader, Col, DatePicker, Divider, Form, Input, Row, Select, Spin, Tabs, Modal, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import React, { Component } from 'react';
import { Action, Dispatch } from 'redux';
import CountDown from './components/CountDown';
import Details from './components/Details';
import LeadRntryFollow from './components/LeadRntryFollow';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, CustomListItem } from './data';
import { StateType } from './model';
import { CustomerInfoData, ConfigData } from '@/pages/LeadsManagement/leadsDetails/data';
import getUserInfo from '@/utils/UserInfoStorage';
import styles from './style.less';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import { ColumnProps } from 'antd/lib/table';
import { SearchOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Search from 'antd/lib/input/Search';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      //配置信息 -- 一次加载
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getConfigInfo'
      //状态配置信息 -- 一次加载
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getLeadStatusConfigInfo'
      //跟进配置 -- 一次加载
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getFollowConfigInfo'
      //线索转派和添加协作人的人列表 -- 一次加载
      | 'dxlLeadsManagementAndsearchAndLeadTableList/distributeUserList'
      //转给同事人列表 -- 一次加载
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getGroupUserList'
      //权限信息 -- 一次加载
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getUserPermissionList'
      //人员列表 -- 一次加载
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getDistributePeopleConifgInfo'

      //线索列表
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetch'
      //线索详情-用户信息（包含有效单信息）
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetchCustomerInfo'
      //线索详情-获取是否是微信好友
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getIsFriend'
      //线索详情-联系人列表
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetchContactInfo'
      //线索详情-意向需求列表
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetchReqList'
      //线索详情-客户线索
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetchCustomerLeadsList'
      //线索详情-质检核查列表
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getRecordList'
      //线索详情-订单列表
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetchOrderList'
      //线索详情-跟进列表
      | 'dxlLeadsManagementAndsearchAndLeadTableList/getFollowList'
      //添加协作人
      | 'dxlLeadsManagementAndsearchAndLeadTableList/createAssociates'
      //更新有效单
      | 'dxlLeadsManagementAndsearchAndLeadTableList/updateReqList'
      //
      | 'dxlLeadsManagementAndsearchAndLeadTableList/submitComplaint'
      //
      | 'dxlLeadsManagementAndsearchAndLeadTableList/toComplaintDetail'
      //新建客资
      | 'dxlLeadsManagementAndsearchAndLeadTableList/newCustomer'
      //商家备注
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetchMerchantnotes'
      //三方录音
      | 'dxlLeadsManagementAndsearchAndLeadTableList/fetchThirdrecards'
    >
  >;
  dxlLeadsManagementAndsearchAndLeadTableList: StateType;
  //线索列表loading
  listLoading: boolean;
  //用户信息loading
  customerLoading: boolean;
  //是否是微信好友loading
  friendLoading: boolean;
  //联系人信息loading
  contactLoading: boolean;
  //意向需求loading
  reqListLoading: boolean;
  //客户线索loading
  customerLeadsListLoading: boolean;
  //质检核查loading
  recordListLoading: boolean;
  //订单列表loading
  orderListLoading: boolean;
  //跟进列表loading
  followListLoading: boolean;
  //商家备注loading
  merchantRemarkLoading: boolean;
  //三方录音loading
  thirdRecordLoading: boolean;

  configLoading: boolean;
  leadStatusConfigLoading: boolean;
  followConfigLoading: boolean;
  distributeUserListLoading: boolean;
  groupUserListLoading: boolean;
  userPermissionListLoading: boolean;
  distributePeopleLoading: boolean;
}

interface TableListState {
  areaRest: boolean,
  isShowFilter: boolean,
  filterText: string,
  followTab: string,
  //当前选中的线索
  selectLeadsData: TableListItem | undefined;

  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;

  //自定义列表
  tableModalVisible: boolean;
  allCustomListItems: CustomListItem[];
  selectCustomListItems: CustomListItem[];
  tempSelectCustomListItems: CustomListItem[];
}

@connect(
  ({
    dxlLeadsManagementAndsearchAndLeadTableList,
    loading,
  }: {
    dxlLeadsManagementAndsearchAndLeadTableList: StateType;
    loading: { effects: any };
  }) => ({
    dxlLeadsManagementAndsearchAndLeadTableList,

    configLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getConfigInfo'],
    leadStatusConfigLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getLeadStatusConfigInfo'],
    followConfigLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getFollowConfigInfo'],
    distributeUserListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/distributeUserList'],
    groupUserListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getGroupUserList'],
    userPermissionListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getUserPermissionList'],
    distributePeopleLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getDistributePeopleConifgInfo'],


    listLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetch'],
    customerLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetchCustomerInfo'],
    friendLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getIsFriend'],
    contactLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetchContactInfo'],
    reqListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetchReqList'],
    customerLeadsListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetchCustomerLeadsList'],
    recordListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getRecordList'],
    orderListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetchOrderList'],
    followListLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/getFollowList'],
    merchantRemarkLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetchMerchantnotes'],
    thirdRecordLoading: loading.effects['dxlLeadsManagementAndsearchAndLeadTableList/fetchThirdrecards'],
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  detailsChild: any
  leadsStatus: any;
  saveParams: any;

  currentUserInfo = CrmUtil.getUserInfo();

  initCustomListItems = () => {
    const columns: CustomListItem[] = [];
    columns.push(this.creatCustomListItem('集团客户ID', 'group_customer_id'));
    columns.push(this.creatCustomListItem('线索ID', 'id'));
    columns.push(this.creatCustomListItem('客户编号', 'customer_id'));
    columns.push(this.creatCustomListItem('客户姓名', 'name', true));
    columns.push(this.creatCustomListItem('客户电话', 'hide_phone', true));
    columns.push(this.creatCustomListItem('业务类型', 'category'));
    columns.push(this.creatCustomListItem('下次回访时间', 'follow_next'));
    columns.push(this.creatCustomListItem('跟进历史', 'follow_status'));
    columns.push(this.creatCustomListItem('最新服务时间', 'follow_newest'));
    if (CrmUtil.getCompanyType() == 1) {
      columns.push(this.creatCustomListItem('关键词', 'utm_term'));
    }
    columns.push(this.creatCustomListItem('归属人', 'owner_name'));
    if (CrmUtil.getCompanyType() == 1) {
      columns.push(this.creatCustomListItem('推荐人', 'referrer_name'));
    } else if (CrmUtil.getCompanyType() == 2) {
      columns.push(this.creatCustomListItem('提供人', 'record_user_name'));
    }
    columns.push(this.creatCustomListItem('业务城市', 'location_city_info'));
    columns.push(this.creatCustomListItem('客资来源', 'channel'));
    columns.push(this.creatCustomListItem('划入时间', 'allot_time'));
    columns.push(this.creatCustomListItem('线索状态', 'status'));
    columns.push(this.creatCustomListItem('活动名称', 'activity_id'));
    columns.push(this.creatCustomListItem('客户微信', 'wechat'));
    columns.push(this.creatCustomListItem('婚期', 'wedding_date'));
    columns.push(this.creatCustomListItem('预算', 'budget'));
    columns.push(this.creatCustomListItem('跟进人', 'follow_name'));
    columns.push(this.creatCustomListItem('创建人', 'create_user'));
    columns.push(this.creatCustomListItem('历史有效', 'valid_status'));
    columns.push(this.creatCustomListItem('超时标识', 'timeout_status'));
    return columns;
  }

  creatCustomListItem = (name: string, id: string, disable?: boolean) => {
    return {
      id,
      name,
      disable: disable ? disable : false,
    }
  }

  getSelectCustomListItems = () => {
    let columnString = localStorage.getItem('dxl_leads_custom_list_items')
    if (columnString) {
      let selectCustomListItems = JSON.parse(columnString) as CustomListItem[]
      if (selectCustomListItems) {
        return selectCustomListItems
      }
    }
    return this.initCustomListItems()
  }

  saveSelectCustomListItems = (customListItems: CustomListItem[]) => {
    localStorage.setItem("dxl_leads_custom_list_items", JSON.stringify(customListItems));
    this.setState({
      selectCustomListItems: customListItems,
    })
  }

  state: TableListState = {
    areaRest: false,
    isShowFilter: false,
    filterText: '高级筛选',
    followTab: '1',
    selectLeadsData: undefined,

    originalFormValus: undefined,

    tableModalVisible: false,
    allCustomListItems: this.initCustomListItems(),
    selectCustomListItems: this.getSelectCustomListItems(),
    tempSelectCustomListItems: this.getSelectCustomListItems(),

  };


  // componentWillReceiveProps(nextProps: any) {
  //   var isRefresh = localStorage ? localStorage.getItem('leadsListRefreshTag')?.toString() : '';
  //   if (isRefresh && isRefresh?.length > 0) {
  //     localStorage?.setItem('leadsListRefreshTag', '')
  //     if (isRefresh == 'reset') {
  //       this.handleFormReset()
  //     }
  //   }
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    //加载配置信息
    this.loadConfig();
    //加载状态标签配置并加载标签对应的线索列表
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getLeadStatusConfigInfo',
      payload: {
        role: '4',
      },
      callback: (response: any) => {
        if (response.code === 200) {
          const { dispatch } = this.props;
          const {
            dxlLeadsManagementAndsearchAndLeadTableList: { leadStatusConfig }
          } = this.props;
          if (leadStatusConfig && leadStatusConfig.length > 0) {
            this.leadsStatus = leadStatusConfig[0].name;
            this.saveParams = {
              headerStatus: this.leadsStatus,
              pageSize: 8,
              page: 1,
            };
            //拉取列表
            dispatch({
              type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetch',
              payload: {
                ...this.saveParams,
              },
              callback: () => {
                const {
                  dxlLeadsManagementAndsearchAndLeadTableList: { data }
                } = this.props;
                if (data.list && data.list.length > 0) {
                  const leadsData = data.list[0];
                  this.setState({  //设置当前线索详情
                    selectLeadsData: leadsData
                  })
                  //刷新数据
                  this.fetchAll(leadsData)
                }
              }
            });
          }
        }
      }
    })
  }

  //配置只加载一次
  loadConfig = () => {
    const { dispatch } = this.props;
    //配置信息
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getConfigInfo',
      callback: (config: ConfigData) => {
        if (config.category == undefined || config.category.length == 0 || this.state.selectLeadsData == undefined) {
          return
        }
        //拉取意向需求
        this.fetchCategoryReqList(this.state.selectLeadsData.customer_id, this.state.selectLeadsData.id, config.category[0].id)
        //拉取客户线索
        this.fetchCustomerLeadsList(this.state.selectLeadsData.id, this.state.selectLeadsData.category_id)
      }
    })
    //转给同事-转派人
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getGroupUserList',
    })
    //派发线索/添加协作人-转派或协作人
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/distributeUserList',
    })
    //权限
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getUserPermissionList',
    })
    //跟进配置
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getFollowConfigInfo',
      payload: { 'followType': '1' }
    })
    //人员列表
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getDistributePeopleConifgInfo',
    })
  }

  /**
   * 切换线索
   */
  changeLeads = (leadsData: TableListItem) => {
    //更新所有模块信息
    this.fetchAll(leadsData);
  }

  /**
   * 切换线索所刷新数据
   */
  fetchAll = (leadsData: TableListItem) => {
    const { customerConfig } = this.props.dxlLeadsManagementAndsearchAndLeadTableList
    //拉取用户信息
    this.fetchCustomerInfo(leadsData.customer_id, leadsData.id, (code: number, data: CustomerInfoData) => {
      if (code == 200) {
        if (data.followData && data.followData.followTab && data.followData.followTab.length > 0) {
          //拉取跟进列表
          this.fetchFollowList(leadsData.customer_id, leadsData.id, data.followData.followTab[0].key + "");
          //更新用户表单信息
          if (this.detailsChild != undefined) {
            this.detailsChild.updateCustomerForm();
          }
          //获取是否是微信好友
          this.fetchIsFriend(data.weChat, data.encryptPhone)
        }
      }
    });
    //拉取联系人列表
    this.fetchContactList(leadsData.customer_id);
    //拉取意向需求和客户线索
    if (customerConfig != undefined && customerConfig.category && customerConfig.category.length > 0) {
      this.fetchCategoryReqList(leadsData.customer_id, leadsData.id, customerConfig.category[0].id)
      this.fetchCustomerLeadsList(leadsData.id, leadsData.category_id)
    }
    //拉取订单列表
    this.fetchOrderList(leadsData.customer_id)
    //拉取质量核查列表
    this.fetchRecordList(leadsData.id)
  }

  /**
   * 拉取线索详情-用户信息
   * @param customerId
   * @param leadsId
   * @param callback
   */
  fetchCustomerInfo = (customerId: string, leadsId: string, callback?: (code: number, data: CustomerInfoData) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetchCustomerInfo',
      payload: {
        id: customerId,
        leadsId,
      },
      callback,
    });
  }

  /**
   * 拉取线索详情-意向需求列表
   * @param customerId
   * @param leadsId
   * @param categoryId
   */
  fetchCategoryReqList = (customerId: string, leadsId: string, categoryId: string) => {
    const { dispatch } = this.props;
    const params = {
      customerId,
      leadsId,
      aggregation: '1',
      category: categoryId,
    };
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetchReqList',
      payload: params,
    });
  }

  /**
   * 拉取线索详情-客户线索列表
   * @param leadsId
   * @param categoryId
   */
  fetchCustomerLeadsList = (leadsId: string, categoryId: string) => {
    const { dispatch } = this.props;
    const { customerConfig } = this.props.dxlLeadsManagementAndsearchAndLeadTableList
    let cateId = (categoryId == undefined || categoryId == null || categoryId == '' || categoryId == 'null') ? customerConfig?.category[0]?.id : categoryId
    const params = {
      id: leadsId,
      category: cateId,
    };
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetchCustomerLeadsList',
      payload: params,
    });
  }

  /**
   * 拉取线索详情-联系人列表
   * @param customerId
   */
  fetchContactList = (customerId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetchContactInfo',
      payload: {
        customerId,
      }
    });
  }

  /**
   * 拉取线索详情-质检核查列表
   * @param leadsId
   */
  fetchRecordList = (leadsId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getRecordList',
      payload: {
        id: leadsId,
        type: 'leads',
      }
    });
  }

  /**
   * 拉取线索详情-订单列表
   * @param leadsId
   */
  fetchOrderList = (customerId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetchOrderList',
      payload: {
        customerId,
      }
    });
  }

  /**
   * 拉取线索详情-是否是好友
   * @param wechat
   * @param encryptPhone
   */
  fetchIsFriend = (wechat: string, encryptPhone: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getIsFriend',
      payload: {
        wechat: wechat ? wechat : '',
        encryptPhone: encryptPhone ? encryptPhone : '',
      }
    });
  }

  /**
   * 拉取线索详情-跟进列表
   * @param customerId
   * @param leadsId
   * @param tab
   */
  fetchFollowList = (customerId: string, leadsId: string, tab: string) => {
    const { dispatch } = this.props;
    this.setState({
      followTab: tab,
    })
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/getFollowList',
      payload: {
        customerId,
        relationId: leadsId,
        tab: tab,
        type: '1',
      }
    });
  }

  fetchMerchantRemarkList = (leadsId: string, page: number, pageSize: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetchMerchantnotes',
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
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetchThirdrecards',
      payload: {
        leadId: leadsId,
        index: page,
        size: pageSize,
      }
    });
  }

  /**
   * 跟进列表刷新相关
   * @param customerId
   * @param leadsId
   * @param tab
   */
  refreshFollowList = (customerId: string, leadsId: string, tab: string) => {
    this.fetchFollowList(customerId, leadsId, tab)
    this.fetchCustomerInfo(customerId, leadsId)
    if (this.detailsChild != undefined) {
      this.detailsChild.refreshCurrentCategoryReqList()
    }
  }

  /**
   * 刷新当前列表
   */
  refreshLeadsList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetch',
      payload: {
        ...this.saveParams,
      },
    });
  }

  /**
   * 线索派发
   * @param reqId
   * @param ownerId
   * @param remark
   * @param callback
   */
  distributeLeads = (reqId: string, ownerId: string, remark: string, callback: (code: number, msg: string) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/updateReqList',
      payload: {
        reqId,
        ownerId,
        remark,
      },
      callback: callback,
    });
  }

  /**
   * 添加协作人
   * @param reqId
   * @param associatesId
   * @param callback
   */
  addCollaborators = (reqId: string, associatesId: string, callback: (code: number, msg: string) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/createAssociates',
      payload: {
        reqId,
        associatesId,
      },
      callback: callback,
    });
  }

  checkCustomerInfo = () => {
    const { customer } = this.props.dxlLeadsManagementAndsearchAndLeadTableList
    let that = this;
    if (customer && customer.identity != '0' && customer.identity != '' && customer.identity != null) {
      return true;
    } else {
      Modal.confirm({
        title: '系统提示：',
        icon: <ExclamationCircleOutlined />,
        content: '当前客户【客户信息】信息未填写，请先完善该内容',
        cancelText: '暂不建单',
        okText: '立即填写',
        onOk() {
          if (that.detailsChild != undefined) {
            that.detailsChild.tabsChanged("1");
          }
        },
        onCancel() { },
      });
      return false;
    }
  }

  /**
   * 客诉单
   */
  handleSubmitComplaint = (fieldsValue: any, startSubmit: () => void, endSubmit: (success: boolean, msg: string, id: string) => void) => {
    const { customer } = this.props.dxlLeadsManagementAndsearchAndLeadTableList
    const { selectLeadsData } = this.state
    let params = {
      ...fieldsValue,
      customerId: customer?.customerId,
      ownerId: selectLeadsData?.owner_id,
      linkId: selectLeadsData?.id,
      from: 1,  // 线索
    };

    startSubmit()
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/submitComplaint',
      payload: params,
      callback: (success: boolean, msg: string, id: string) => endSubmit(success, msg, id)
    });
  }

  toComplaintDetail = (id: string) => {
    const { customer } = this.props.dxlLeadsManagementAndsearchAndLeadTableList
    const { dispatch, } = this.props;
    dispatch({
      type: "dxlLeadsManagementAndsearchAndLeadTableList/toComplaintDetail",
      payload: {
        id,
        customerId: customer?.customerId
      }
    });
  }

  //判断是否有下一单
  haveNextLeads = () => {
    const { dxlLeadsManagementAndsearchAndLeadTableList: { data } } = this.props;
    if (this.state.selectLeadsData && data.list.length > 0) {
      const leadsId = this.state.selectLeadsData.id
      let selectIndex: number | undefined;
      data.list.map((item, index) => {
        if (item.id == leadsId) {
          selectIndex = index
        }
      });
      if (selectIndex != undefined) {
        let page = data.pagination.current;
        let pageSize = data.pagination.pageSize;
        let total = data.pagination.total;
        if (page != undefined && pageSize != undefined && total != undefined) {
          if ((page - 1) * pageSize + selectIndex + 1 >= total) {  //如果是最后一条数据则无下一单
            return false
          } else {
            return true
          }
        } else {
          return false;
        }
      } else {
        return true
      }
    } else {
      return false
    }
  }

  //下一单
  handleNextLeads = () => {
    const { dispatch, dxlLeadsManagementAndsearchAndLeadTableList: { data } } = this.props;
    if (data.list.length > 0) {
      if (this.state.selectLeadsData) {   //比较数据
        const leadsId = this.state.selectLeadsData.id
        let selectData: TableListItem | undefined;
        let selectIndex: number | undefined;
        data.list.map((item, index) => {
          if (item.id == leadsId) {
            selectData = item
            selectIndex = index
          }
        });
        if (selectData != undefined && selectIndex != undefined) {
          let pageSize = data.pagination.pageSize ? data.pagination.pageSize : 8;
          let page = data.pagination.current ? data.pagination.current : 1;
          if (selectIndex >= pageSize - 1) { //跳转到下一页并选中第一个
            this.saveParams['page'] = page + 1
            //拉取列表
            dispatch({
              type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetch',
              payload: {
                ... this.saveParams,
              },
              callback: () => {
                const {
                  dxlLeadsManagementAndsearchAndLeadTableList: { data }
                } = this.props;
                if (data.list && data.list.length > 0) {
                  const leadsData = data.list[0];
                  this.setState({  //设置当前线索详情
                    selectLeadsData: leadsData
                  })
                  //刷新数据
                  this.fetchAll(leadsData)
                }
              }
            });
          } else {  //切换到下一个
            this.changeLeads(data.list[selectIndex + 1]);
            this.setState({
              selectLeadsData: data.list[selectIndex + 1],
            });
          }
        } else {  //未匹配到则选中第一个
          this.changeLeads(data.list[0]);
          this.setState({
            selectLeadsData: data.list[0],
          });
        }
      } else {  //没有选中数据则默认选中第一个
        this.changeLeads(data.list[0]);
        this.setState({
          selectLeadsData: data.list[0],
        });
      }
    }
  }

  /**
   * 列表分页切换
   */
  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
  ) => {
    const { dispatch } = this.props;
    //分页信息
    this.saveParams['page'] = pagination.current;
    this.saveParams['pageSize'] = pagination.pageSize;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetch',
      payload: {
        ...this.saveParams,
      },
    });
  };

  //高级筛选显示与隐藏
  handleFilterClick = () => {
    const value = !(this.state.isShowFilter);
    let text = '高级筛选'
    if (value) {
      text = '隐藏筛选'
    }
    this.setState({
      isShowFilter: value,
      filterText: text,
    })
  }

  /**
   * 城市选择
   */
  areaSelectChange = (codes: string) => {
    const { form } = this.props;
    form.setFieldsValue({
      locationCityCode: codes + ""
    });
  }

  /**
   * 高级筛选重制
   */
  handleFormReset = () => {
    this.setState({
      originalFormValus: undefined,
    });
    const { form, dispatch } = this.props;
    //表单重置
    form.resetFields();
    const that = this;
    this.setState({
      areaRest: true,
    }, () => {
      that.state.areaRest = false
      //保存请求参数
      this.saveParams = {
        headerStatus: this.leadsStatus,
        page: 1,
      };
      //取出分页信息
      const { dxlLeadsManagementAndsearchAndLeadTableList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        this.saveParams['pageSize'] = pagination.pageSize;
      } else {
        this.saveParams['pageSize'] = 8;
      }
      dispatch({
        type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetch',
        payload: {
          ...this.saveParams,
        },
      });
      console.log(this.saveParams);
    })
  };

  /**
   * 切换标签
   */
  handleLeadsStatus = (key) => {
    this.leadsStatus = key
    this.handleFormReset()
  };

  /**
   * 简单筛选
   */
  handleSimpleSearch = (value) => {
    const { dispatch, form } = this.props;
    //表单重置
    this.setState({
      originalFormValus: undefined,
    });
    form.resetFields();
    const that = this;
    this.setState({
      areaRest: true,
    }, () => {
      that.state.areaRest = false
      //const value = document.getElementById('simpleSearchInput').value
      //保存请求参数
      this.saveParams = {
        headerStatus: this.leadsStatus,
        page: 1,
        key: value,
      };
      //取出分页信息
      const { dxlLeadsManagementAndsearchAndLeadTableList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        this.saveParams['pageSize'] = pagination.pageSize;
      } else {
        this.saveParams['pageSize'] = 8;
      }
      dispatch({
        type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetch',
        payload: {
          ...this.saveParams,
        },
      });
    })
  }

  /**
   * 高级筛选
   */
  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        originalFormValus: fieldsValue,
      })
      //表单信息和状态
      const values = {
        ...fieldsValue,
        headerStatus: this.leadsStatus,
      };
      if (values.category) {
        values.category = values.category[values.category.length - 1];
      }
      const transfer_range_time = fieldsValue['transfer_range_time']
      if (transfer_range_time != undefined && transfer_range_time != '') {
        delete values['transfer_range_time']
        values['acTime'] = moment(transfer_range_time[0]).format('YYYY-MM-DD');
        values['endTime'] = moment(transfer_range_time[1]).format('YYYY-MM-DD');
      }
      //取出起始和结束时间
      const lastnew_service_range_time = fieldsValue['lastnew_service_range_time']
      if (lastnew_service_range_time != undefined && lastnew_service_range_time != '') {
        delete values['lastnew_service_range_time']
        values['followNewestAction'] = moment(lastnew_service_range_time[0]).format('YYYY-MM-DD');
        values['followNewestEnd'] = moment(lastnew_service_range_time[1]).format('YYYY-MM-DD');
      }
      //取出起始和结束时间
      const next_service_range_time = fieldsValue['next_service_range_time']
      console.log("NextTime:" + next_service_range_time)
      if (next_service_range_time != undefined && next_service_range_time != '') {
        delete values['next_service_range_time']
        values['followNextAction'] = moment(next_service_range_time[0]).format('YYYY-MM-DD');
        values['followNextEnd'] = moment(next_service_range_time[1]).format('YYYY-MM-DD');
      }
      //婚期
      const wedding_date_time = fieldsValue['wedding_date_time']
      if (wedding_date_time != undefined && wedding_date_time != '') {
        delete values['wedding_date_time']
        values['weddingDateFrom'] = moment(wedding_date_time[0]).format('YYYY-MM-DD');
        values['weddingDateEnd'] = moment(wedding_date_time[1]).format('YYYY-MM-DD');
      }
      //跟进结果多选
      values['followStatus'] = values['followStatus']?.join(',')
      const channelArr = fieldsValue['channel']
      if (channelArr !== undefined) {
        delete values['channel']
        if (channelArr.length > 0) {
          values['channel'] = channelArr[channelArr.length - 1]
        }
      }
      //保存请求参数
      this.saveParams = {
        ...values,
        page: 1,
      };
      //取出分页信息
      const { dxlLeadsManagementAndsearchAndLeadTableList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        this.saveParams['pageSize'] = pagination.pageSize;
      } else {
        this.saveParams['pageSize'] = 8;
      }
      dispatch({
        type: 'dxlLeadsManagementAndsearchAndLeadTableList/fetch',
        payload: {
          ...this.saveParams,
        },
      });
    });
  };


  //details组件引用
  onDatilsRef = (ref: any) => {
    this.detailsChild = ref
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

  //新建客资
  handleNewCustomer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dxlLeadsManagementAndsearchAndLeadTableList/newCustomer',
    })
  }

  //自定义列表
  handleCustomertable = () => {
    this.setState({
      tableModalVisible: true
    })
  }

  handleCustomListSave = () => {
    this.saveSelectCustomListItems(this.state.tempSelectCustomListItems);
    this.setState({
      tableModalVisible: false
    })
  }

  handleCustomListCancel = () => {
    this.setState({
      tableModalVisible: false
    })
  }


  onChangeCustomListItems = (checkedValues: string[]) => {
    let selectItems: CustomListItem[] = this.state.allCustomListItems.filter(item => (checkedValues.indexOf(item.id) >= 0));
    this.setState({
      tempSelectCustomListItems: selectItems
    })
  }


  createColums = (): ColumnProps<TableListItem>[] => {
    const columns: ColumnProps<TableListItem>[] = [];
    this.state.selectCustomListItems.map(item => {
      columns.push(this.createColum(item.name, item.id));
    })
    columns.push(this.createColum('剩余时长', '', 'right'));
    return columns;
  }

  createColum = (title: string | React.ReactNode, dataIndex: string, fixed?: boolean | "right" | "left" | undefined): ColumnProps<TableListItem> => {
    const colum: ColumnProps<TableListItem> = {
      title,
      dataIndex,
      fixed,
    }
    if (dataIndex == 'follow_status') {
      return {
        ...colum,
        render: (text: any, record: TableListItem) => {
          return (
            <div>
              {
                record.follow_num > 0 ? this.renderFollowHistoryNum(record.follow_num) : null
              }
              {text}
            </div>
          );
        }
      }
    } else if (dataIndex == 'location_city_info') {
      return {
        ...colum,
        render: (text: any, record: TableListItem) => {
          return (
            <div>
              {
                record.location_city_info.full
              }
            </div>
          )
        }
      }
    } else if (title == '剩余时长') {
      return {
        ...colum,
        render: (text: any, record: TableListItem) => {
          return (
            <CountDown
              id={record.id}
              cdTime={record.follow_hour * 1000}
              statusNum={record.status_num}
            />
          )
        }
      }
    }
    return colum
  }

  renderCity = (record: any) => {
    return (
      <div>
        {
          (record && record.city) ? record.city : null
        }
      </div>
    )
  }

  renderDistrict = (record: any) => {
    return (
      <div>
        {
          (record && record.district) ? '-' + record.district : null
        }
      </div>
    )
  }

  renderFollowHistoryNum = (followNum: number) => {
    return (
      <div>
        {
          '已服务（' + followNum + '）'
        }
        <br />
      </div>
    )
  }

  renderAdvancedForm() {
    console.log(this.props)
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { dxlLeadsManagementAndsearchAndLeadTableList: { customerConfig, distributePeopleConifg, permission } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
          <Col span={8}>
            <FormItem label="业务城市">
              {getFieldDecorator('locationCityCode')(<CityMultipleSelect citySelectChange={this.areaSelectChange} reset={this.state.areaRest} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="客资来源">
              {getFieldDecorator('channel', { initialValue: this.state.originalFormValus?.channel })(
                <Cascader showSearch style={{ width: '100%', }} options={customerConfig && customerConfig.channel} changeOnSelect />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="业务品类">
              {getFieldDecorator('category', { initialValue: this.state.originalFormValus?.category })(
                <Cascader showSearch style={{ width: '100%', }} options={customerConfig && customerConfig.category2} changeOnSelect />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
          <Col span={8}>
            <FormItem label="划入时间">
              {getFieldDecorator('transfer_range_time', { initialValue: this.state.originalFormValus?.transfer_range_time })(
                <RangePicker style={{ width: '100%' }} />
              )}

            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="最新服务时间">
              {getFieldDecorator('lastnew_service_range_time', { initialValue: this.state.originalFormValus?.lastnew_service_range_time })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="下次回访时间">
              {getFieldDecorator('next_service_range_time', { initialValue: this.state.originalFormValus?.next_service_range_time })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
          <Col span={8}>
            <FormItem label="活动名称">
              {getFieldDecorator('activityId', { initialValue: this.state.originalFormValus?.activityId })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    customerConfig && customerConfig.activity ? customerConfig.activity.map(activity => (
                      <Option value={activity.id}>{activity.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={CrmUtil.getCompanyType() == 1 ? '呼叫结果' : '跟进标签'}>
              {getFieldDecorator('followTag', { initialValue: this.state.originalFormValus?.followTag })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    customerConfig && customerConfig.leadsFollowTag ? customerConfig.leadsFollowTag.map(followTag => (
                      <Option value={followTag.id}>{followTag.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="跟进结果">
              {getFieldDecorator('followStatus', { initialValue: this.state.originalFormValus?.followStatus })(
                <Select mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择"
                  style={{ width: '100%' }} >
                  {
                    customerConfig && customerConfig.leadsFollowStatus ? customerConfig.leadsFollowStatus.map(leadsFollowStatus => (
                      <Option value={leadsFollowStatus.id}>{leadsFollowStatus.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
          <Col span={8}>
            <FormItem label="线索ID">
              {getFieldDecorator('id', { initialValue: this.state.originalFormValus?.id })(<Input placeholder="请输入线索ID" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="有效单编号">
              {getFieldDecorator('req_num', { initialValue: this.state.originalFormValus?.req_num })(<Input placeholder="请输入有效单编号" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="客户编号">
              {getFieldDecorator('customer_id', { initialValue: this.state.originalFormValus?.customer_id })(<Input maxLength={20} placeholder="请输入客户编号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
          <Col span={8}>
            <FormItem label="婚期">
              {getFieldDecorator('wedding_date_time', { initialValue: this.state.originalFormValus?.wedding_date_time })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="婚期标识">
              {getFieldDecorator('weddingDateTag', { initialValue: this.state.originalFormValus?.weddingDateTag })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    customerConfig && customerConfig.weddingDateTag ? customerConfig.weddingDateTag.map(tag => (
                      <Option value={tag.id}>{tag.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='负责客服'>
              {getFieldDecorator('ownerIdStr', { initialValue: this.state.originalFormValus?.ownerIdStr })(
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                  placeholder='请选择负责客服'>
                  {
                    (distributePeopleConifg && distributePeopleConifg.length > 0) ?
                      distributePeopleConifg.map(config => (
                        <Option value={config.id}>{config.name}</Option>))
                      :
                      null
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: '-24px' }}>
          {
            CrmUtil.getCompanyType() == 2 ?
              <Col span={8}>
                <FormItem label='提供人'>
                  {getFieldDecorator('recordUserId', { initialValue: this.state.originalFormValus?.recordUserId })(
                    <Select
                      mode="multiple"
                      showSearch
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                      placeholder='请选择提供人'>
                      {
                        (distributePeopleConifg && distributePeopleConifg.length > 0) ?
                          distributePeopleConifg.map(config => (
                            <Option value={config.id}>{config.name}</Option>))
                          :
                          null
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              : null
          }

          <Col span={8} offset={CrmUtil.getCompanyType() == 2 ? 8 : 16}>
            <div style={{ display: 'flex', marginBottom: '24px' }}>
              <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
              <Button id="fsubmit" type="primary" htmlType="submit" style={{ marginLeft: '20px', flexGrow: 1 }}>筛选</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  renderRadioGroup = () => {
    const {
      dxlLeadsManagementAndsearchAndLeadTableList: { data, leadStatusConfig }
    } = this.props;
    let top = data && data.list && data.list.length > 0 ? 17 : -48
    return (
      <Tabs type='card' style={{ position: 'absolute', top: top, width: '70%' }} onChange={this.handleLeadsStatus}>
        {
          (leadStatusConfig && leadStatusConfig.length > 0) ? leadStatusConfig.map(config => (
            <TabPane tab={config.name} key={config.name}>&nbsp;</TabPane>)) : null
        }
      </Tabs >
    );
  }

  rowClassName = (recoder: TableListItem, index: number) => {
    const {
      dxlLeadsManagementAndsearchAndLeadTableList: { data }
    } = this.props;
    //1:未跟进、2:待回访、3:跟进中，4:已建需求单，5：退回公海，6：已建订单，7：已建合同，8：线索合并
    if (data && data.color_status == '1') {
      if (recoder.status_num == '1' && recoder.activity_id != '二次清洗') {
        return styles.lightRed
      }
      if (recoder.status_num == '4' && recoder.req_time_status) {
        return styles.lightGreen
      }
      if (recoder.status_num == '3' && recoder.follow_time_status) {
        return styles.lightGreen
      }
      if (recoder.status_num == '2' && recoder.callback_time_status) {
        return styles.lightYellow
      }
    }
    return '';
  }

  render() {
    let contentHeight = (document.body.scrollHeight - 190 - 90 - 48) / 2
    const {
      dxlLeadsManagementAndsearchAndLeadTableList: { data, leadStatusConfig, customerConfig, permission, distributeUserList, reqGroupData, customerLeadsListData, customer, contacts, qualityInspection, orderList, customerFollowInfo, merchantRemarkData, thirdRecordData },
      listLoading,
      customerLoading,
      contactLoading,
      reqListLoading,
      customerLeadsListLoading,
      recordListLoading,
      orderListLoading,
      followListLoading,
      configLoading,
      leadStatusConfigLoading,
      followConfigLoading,
      distributeUserListLoading,
      groupUserListLoading,
      userPermissionListLoading,
      merchantRemarkLoading,
      thirdRecordLoading,
    } = this.props;
    const { followTab, selectLeadsData } = this.state;
    let maginTop = data && data.list && data.list.length > 0 ? -18 : 63
    maginTop = leadStatusConfig && leadStatusConfig.length > 0 ? maginTop : 0
    const isShowNextLeads = this.haveNextLeads();

    let defaultValue: string[] = this.state.selectCustomListItems.map((item) => {
      return item.id
    });

    return (
      <PageHeaderWrapper>
        <Modal
          title="自定义显示列" okText='保存' cancelText='取消'
          centered
          visible={this.state.tableModalVisible}
          onOk={this.handleCustomListSave}
          onCancel={this.handleCustomListCancel}
          destroyOnClose={true}
        >
          <Form>
            <FormItem>
              <Checkbox.Group defaultValue={defaultValue} onChange={(e) => this.onChangeCustomListItems(e)}>
                {
                  this.state.allCustomListItems ? this.state.allCustomListItems.map(customListItem => (
                    <Checkbox value={customListItem.id} disabled={customListItem.disable}>{customListItem.name}</Checkbox>)) : null
                }
              </Checkbox.Group>

            </FormItem>

          </Form>
        </Modal>
        <Spin spinning={configLoading || leadStatusConfigLoading || followConfigLoading || distributeUserListLoading || groupUserListLoading || groupUserListLoading || userPermissionListLoading}>
          <Card style={{ width: '100%' }}>
            <div style={{
              display: 'flex',
              marginBottom: '20px',
              justifyContent: 'space-between',
            }}>
              {
                data ? <div style={{
                  display: 'flex'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 12 }}>当日总任务量</div>
                    <div style={{ marginTop: 8, textAlign: 'center' }}>{data.all_task}</div>
                  </div>
                  <div style={{ marginLeft: 15 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 12 }}>已处理任务量</div>
                    <div style={{ marginTop: 8, textAlign: 'center' }}>{data.done_task}</div>
                  </div>
                  <div style={{ marginLeft: 15 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 12 }}>剩余任务量</div>
                    <div style={{ marginTop: 8, textAlign: 'center' }}>{data.todo_task}</div>
                  </div>
                </div>
                  :
                  <div></div>
              }
              <div style={{
                display: 'flex',
              }} >
                <Button onClick={this.handleCustomertable}>自定义列表</Button>
                <Button type="primary" onClick={this.handleNewCustomer} style={{ marginLeft: 10 }}><PlusOutlined />新建客资</Button>
                <Button onClick={this.handleFilterClick} style={{ marginLeft: 10 }}>{this.state.filterText}</Button>
                <Search
                  size="small"
                  placeholder="请输入姓名、手机号、微信号"
                  onSearch={this.handleSimpleSearch}
                  style={{ marginLeft: 10, width: '240px', maxLines: 1, height: 32 }}
                />
                {/* <Input id="simpleSearchInput" style={{ marginLeft: 10, width: '240px' }} placeholder="请输入姓名、手机号、微信号" />
                <Button onClick={this.handleSimpleSearch} type="primary" style={{ marginLeft: 5 }}>搜索</Button> */}
              </div>
            </div>
            {
              <div style={{ display: this.state.isShowFilter ? 'block' : 'none' }}>
                <div className={styles.tableListForm} >{this.renderForm()}</div>
                <Divider style={{ marginBottom: 15 }} />
              </div>
            }

            <div style={{ position: 'relative' }}>
              <StandardTable
                style={{ marginTop: maginTop }}
                scroll={{ x: 'max-content' }}
                loading={listLoading}
                data={data}
                rowKey={'id'}
                onRow={
                  (record, index) => {
                    return {
                      onClick: event => {
                        this.changeLeads(record);
                        this.setState({
                          selectLeadsData: record
                        });
                      },
                      onMouseEnter: event => {
                        event.target.style.cursor = "pointer";
                      }
                    }
                  }}
                onSelectRow={(rows: any) => {
                  if (rows.length > 0) {
                    this.changeLeads(rows[0]);
                    this.setState({
                      selectLeadsData: rows[0]
                    });
                  }
                }}
                selectedRows={selectLeadsData ? [selectLeadsData] : []}
                columns={this.createColums()}
                onChange={this.handleStandardTableChange}
                rowClassName={this.rowClassName}
              />

              {
                (leadStatusConfig && leadStatusConfig.length > 0) ? this.renderRadioGroup() : null
              }
            </div>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: 15 }}>
              <Col span={8}>
                {
                  selectLeadsData ?
                    <LeadRntryFollow
                      loading={customerLoading || followListLoading}
                      style={{ maxHeight: contentHeight }}
                      customer={customer}
                      leadId={selectLeadsData ? selectLeadsData.id : ''}
                      customerConfig={customerConfig && customerConfig}
                      contacts={contacts}
                      tab={followTab}
                      refreshFunction={this.refreshFollowList}
                      refreshListFunction={this.refreshLeadsList}
                    />
                    :
                    null
                }
              </Col>
              <Col span={16}>
                {
                  selectLeadsData && customerConfig && permission && reqGroupData ?
                    <Details
                      onDetailsRef={this.onDatilsRef}
                      checkCustomerInfo={this.checkCustomerInfo}
                      loading_merchantRemark={merchantRemarkLoading}
                      loading_thirdRecord={thirdRecordLoading}
                      loading_customer={customerLoading}
                      loading_contact={contactLoading}
                      loading_reqList={reqListLoading}
                      loading_customerLeadsList={customerLeadsListLoading}
                      loading_recordList={recordListLoading}
                      loading_orderList={orderListLoading}
                      loading_followList={followListLoading}
                      leadsId={selectLeadsData.id}
                      categoryId={selectLeadsData.category_id}
                      customer={customer}
                      config={customerConfig}
                      permission={permission}
                      reqGroupDetails={reqGroupData}
                      customerLeadsListData={customerLeadsListData}
                      contacts={contacts}
                      orderList={orderList}
                      isShowNextLeads={isShowNextLeads}
                      followListData={customerFollowInfo}
                      qualityInspection={qualityInspection}
                      distributeUserList={distributeUserList}
                      fun_refreshLeadsList={this.refreshLeadsList}
                      fun_fetchCategoryReqList={this.fetchCategoryReqList}
                      fun_fetchCutomerLeadsList={this.fetchCustomerLeadsList}
                      fun_refreshLeadsDetails={this.fetchCustomerInfo}
                      fun_fetchContactList={this.fetchContactList}
                      fun_fetchRecordList={this.fetchRecordList}
                      fun_fetchOrderList={this.fetchOrderList}
                      fun_fetchfFollowList={this.fetchFollowList}
                      fun_distributeLeads={this.distributeLeads}
                      fun_addCollaborators={this.addCollaborators}
                      fun_recommend={this.handleRecommend}
                      fun_review={this.handleReview}
                      fun_complaint={this.handleSubmitComplaint}
                      fun_toComplaintDetail={this.toComplaintDetail}
                      fun_nextLeads={this.handleNextLeads}
                      fun_fetchMerchantRemarkList={this.fetchMerchantRemarkList}
                      fun_fetchThirdRecordList={this.fetchThirdRecordList}
                    />
                    : null
                }
              </Col>
            </Row>
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

class TableList1 extends Component<TableListProps, TableListState> {

  render() {
    return (
      <KeepAlive>
        <TableList {...this.props} />
      </KeepAlive>
    )
  }

}
export default Form.create<TableListProps>()(TableList1);
