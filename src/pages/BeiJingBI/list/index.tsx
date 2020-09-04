import { CategoryConfigItem, ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Spin, Tabs, TreeSelect, Radio, message, Cascader } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Component, default as React, default as React, Fragment } from 'react';
import { Action, Dispatch } from 'redux';
import { KeepAlive } from 'umi';
import ShearchChannelSelectPropsPage from './components/ShearchChannelSelect';
import { CustomListItem, TableListItem, TableListPagination, CompanyChannel, CompanyUser, User, RulesUsers } from './data';
import { StateType } from './model';
import styles from './style.less';
import { RadioChangeEvent } from 'antd/lib/radio';
import CrmUtil from '@/utils/UserInfoStorage';
import LOCAL from '@/utils/LocalStorageKeys';
import CrmStandardTable, { CrmStandardTableColumnProps, getCrmTableColumn } from '@/components/CrmStandardTable';
import { PlusOutlined } from '@ant-design/icons';
import CrmFilterForm from '@/components/CrmFilterForm';
import { TreeNodeValue } from 'antd/lib/tree-select/interface';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface BeiJingBIListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<any>
  >;
  beiJingBI: StateType;
  //线索列表loading
  fetchLoading: boolean;
  //配置列表loading
  fetchConfigLoading: boolean;
  //权限loading
  fetchPermissionLoading: boolean;
  //目标公司渠道loading
  fetchCompanyChannelLoading: boolean;
  //公司用户loading
  fetchCompanyUsersLoading: boolean;
  //外部分配loading
  externalFlowLoading: boolean;
  //内部分配loading
  internalFlowLoading: boolean;
  //用户loading
  fetchNBUsersLoading: boolean;
}

interface BeiJingBIListState {
  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
  isShowChannelSelect: boolean;
  selectedRows: TableListItem[];

  channelSelectList: any[];
  isShowForm: boolean;
  isShowFormText: string;
  formValues: { [key: string]: string };


  assignsModal: boolean;


  assignsRows: TableListItem[];
  assignsValue: number,
  assignsCompanyId: string | undefined;
  assignsChannelId: string | undefined;

  assignsChannelPlaceholder: string | undefined,
  assignsChannels: CompanyChannel[];

  assignsRecordUserPlaceholder: string | undefined,
  assignsReceiveUserPlaceholder: string | undefined,
  assignsRecordUser: User[];
  assignsReceiveUser: User[];

  assignsChangeStatus: number,

  filterCategorys: number[],
  filterCategorysExtra: number[],
}

@connect(
  ({
    beiJingBI,
    loading,
  }: {
    beiJingBI: StateType;
    loading: { effects: any };
  }) => ({
    beiJingBI,

    fetchLoading: loading.effects['beiJingBI/fetch'],
    fetchConfigLoading: loading.effects['beiJingBI/getConfigInfo'],
    fetchPermissionLoading: loading.effects['beiJingBI/getUserPermissionList'],
    fetchCompanyChannelLoading: loading.effects['beiJingBI/getCompanyChannel'],
    fetchCompanyUsersLoading: loading.effects['beiJingBI/getRulesUserInfo'],
    externalFlowLoading: loading.effects['beiJingBI/externalFlow'],
    internalFlowLoading: loading.effects['beiJingBI/internalFlow'],
    fetchNBUsersLoading: loading.effects['beiJingBI/fetchNBUsers'],
  }),
)

class BeiJingBIList extends Component<BeiJingBIListProps, BeiJingBIListState> {
  detailsChild: any
  leadsStatus: any;
  saveParams: any;

  isReqList = (): boolean => {
    if (window.location.pathname == '/bjReqBIList') {
      return true;
    } else {
      return false;
    }
  }

  generateStandardTableColumnProps = (): CrmStandardTableColumnProps<TableListItem>[] => {
    const columns: CrmStandardTableColumnProps<TableListItem>[] = [];
    const get = getCrmTableColumn;
    const disable = !this.isReqList()
    columns.push(get('group_customer_id', '集团客户id', {}, true));
    columns.push(get('customer_id', '客户编号', {
      render: (text: string, recoder: TableListItem) => <a onClick={() => this.handleIdClick(recoder)}>{text}</a>
    }, true));
    columns.push(get('company_name', '所在公司', {}, disable));
    columns.push(get('channel', '渠道来源', {}, disable));
    columns.push(get('category', '主营品类', {}, disable));
    columns.push(get('other_category', '其他品类'));
    columns.push(get('hotel', '酒店名称', { width: 160 }));
    columns.push(get('allot_time', '入库时间', {}));
    columns.push(get('customer_name', '客户姓名', {}));
    columns.push(get('phone', '客户电话', {}));
    columns.push(get('wechat', '客户微信', {}));
    columns.push(get('record_user_name', '提供人', {}));
    columns.push(get('leads_owner_name', '客服', {}));
    columns.push(get('req_owner_name', '邀约人', {}));
    columns.push(get('team_user', '项目协作成员', {}));
    columns.push(get('customer_follow_time', '最新沟通时间'))
    columns.push(get('customer_follow_status', '跟进结果'));
    columns.push(get('customer_follow_content', '最新沟通记录', { width: 300 }))
    columns.push(get('follow_user', '跟进人', {}))
    columns.push(get('next_contact_time', '下次回访时间', {}))
    columns.push(get('team_follow_num', '项目成员协作次数', {}))
    columns.push(get('follow_num', '跟进次数', {}))
    columns.push(get('order_wedding_owner_name', '婚庆销售', {}));
    columns.push(get('order_banquet_owner_name', '婚宴销售', {}));
    columns.push(get('other_category_order_user', '其他品类销售', {}));
    columns.push(get('customer_level', '客户级别', {}));
    columns.push(get('customer_status', '客户实时状态', {}));
    columns.push(get('call_valid_status', '通话状态', {}));
    columns.push(get('wedding_commission', '婚庆返佣'));
    columns.push(get('wedding_status', '婚庆实时状态'));
    columns.push(get('leads_wedding_status', '婚庆客服状态'));
    columns.push(get('req_wedding_status', '婚庆邀约状态'));
    columns.push(get('req_wedding_once_valid', '婚庆邀约首次有效'));
    columns.push(get('req_first_valid_wedding_time', '婚庆邀约首次有效时间'));
    columns.push(get('order_wedding_arrive_status', '婚庆进店状态'));
    columns.push(get('banquet_commission', '婚宴返佣'));
    columns.push(get('banquet_status', '婚宴实时状态'));
    columns.push(get('leads_banquet_status', '婚宴客服状态'));
    columns.push(get('req_banquet_status', '婚宴邀约状态'));
    columns.push(get('req_banquet_once_valid', '婚宴邀约首次有效'));
    columns.push(get('req_first_valid_banquet_time', '婚宴邀约首次有效时间'));
    columns.push(get('order_banquet_arrive_status', '婚宴进店状态'));
    columns.push(get('other_status', '其他品类实时状态'));
    columns.push(get('leads_follow_tag', '客服级别'));
    columns.push(get('req_follow_tag', '邀约级别'));
    columns.push(get('balance_target_company_name', '目标公司'));
    columns.push(get('balance_status', '分配结果'));
    columns.push(get('balance_remark', '分配备注'));
    // if (this.isReqList()) {
    //   columns.push(get('team_user', '项目协作成员'));
    //   columns.push(get('team_user', '项目协作成员'));
    // }
    if (!this.isReqList()) {
      columns.push(get('action', '操作', {
        fixed: 'right',
        render: (text: any, record: TableListItem) => <a onClick={() => this.handleAssign(record)}>分配</a>
      }, true));
    }
    return columns;
  }
  // 列表表头
  columns: CrmStandardTableColumnProps<TableListItem>[] = this.generateStandardTableColumnProps();

  handleIdClick = (record: TableListItem) => {
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    if (this.isReqList()) {
      this.props.dispatch(routerRedux.push({
        pathname: '/bjReqBIList/detail_xp',
        state: {
          customerId: record.customer_id,
          showStyle: 2,
        }
      }))
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/beiJingBI/list/customerDetail_xp',
        state: {
          customerId: record.customer_id,
          showStyle: 10
        }
      }))
    }
  }

  state: BeiJingBIListState = {
    originalFormValus: undefined,
    isShowChannelSelect: false,
    selectedRows: [],

    // 测试
    channelSelectList: [],
    isShowForm: false,
    isShowFormText: '展开',
    formValues: {},

    assignsModal: false,
    assignsRows: [],
    assignsValue: 1,
    assignsCompanyId: CrmUtil.getUserInfo()?.company_id,
    assignsChannelId: undefined,
    assignsChannelPlaceholder: undefined,
    assignsChannels: [],
    assignsRecordUserPlaceholder: undefined,
    assignsReceiveUserPlaceholder: undefined,
    assignsRecordUser: [],
    assignsReceiveUser: [],
    assignsChangeStatus: 2,
    filterCategorys: [],
    filterCategorysExtra: []
  };

  componentDidMount() {

    //拉去列表信息
    this.fetchList({
      page: 1,
      pageSize: 20,
    });
    //拉取配置信息
    this.fetchConfig()
    //nb公司人员
    // if (this.isReqList()) {
    this.fetchNBUsers()
    // }
    //拉取权限信息
    this.fetchPermission();
    this.initChannelDataFunction()

    localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');

  }

  componentWillReceiveProps(nextProps: any) {
    const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';
    if (autoRefresh === '1') {
      // this.handleSearch();
      //刷新列表
      const { beiJingBI: { biData, reqData } } = this.props;
      const data = this.isReqList() ? reqData : biData
      const { pagination } = data;
      const page = pagination ? pagination.current : 1
      const pageSize = pagination ? pagination.pageSize : 20
      let params = {
        ...this.state.formValues,
        page,
        pageSize,
      }
      this.fetchList(params)

      localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
    }

    if (this.state?.channelSelectList?.length <= 0) {
      this.initChannelDataFunction()
    }
  }

  initChannelDataFunction = () => {

    const { beiJingBI: { biConfig, reqConfig } } = this.props;
    let customerConfig = this.isReqList() ? reqConfig : biConfig
    if (customerConfig?.nbChannel?.list?.length > 0) {
      const nbChannelListTemp = JSON.parse(JSON.stringify(customerConfig?.nbChannel?.list));
      let tempGroup = [];


      for (let index = 0; index < nbChannelListTemp.length; index++) {
        const item = nbChannelListTemp[index];
        var newOptionGroups = []
        if (item.optionGroups?.length > 0) {
          newOptionGroups.push(...this.itemChannelDataFunction(item.optionGroups))
        }
        item.optionGroups = newOptionGroups;
        tempGroup.push(item)
      }

      this.setState({
        channelSelectList: tempGroup,
      })
    }
  }

  itemChannelDataFunction = (items: any[]) => {
    var newTs = [];

    for (let index = 0; index < items.length; index++) {
      var item = items[index];
      var newItem = {}
      newItem.title = item.name;
      newItem.key = item.id?.toString();
      newItem.value = item.id?.toString();
      newItem.selectKeys = [];
      var itemOps = [];
      if (item?.childlist?.length > 0) {
        itemOps.push(...this.itemChannelDataFunction(item.childlist))
      }
      newItem.children = itemOps;
      newTs.push(newItem)
    }

    return newTs;
  }

  fetchList = (params: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/fetch',
      payload: {
        ...params,
        type: this.isReqList() ? 9 : 10,
        isReq: this.isReqList() ? true : false,
      }
    });
  }

  fetchNBUsers = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/fetchNBUsers',
      payload: {
        type: 'NB',
      }
    });
  }

  fetchConfig = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/getConfigInfo',
      payload: {
        source: this.isReqList() ? 'xutaobi' : 'bi',
        isReq: this.isReqList() ? true : false,
      }
    });
  }

  fetchPermission = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/getUserPermissionList',
    });
  }

  fetchCompanyChannel = (companyId: string, keywords: string, callback: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/getCompanyChannel',
      payload: {
        companyId,
        keywords,
      },
      callback: callback
    });
  }

  fetchCompanyUsers = (companyId: string, channelId?: string, type?: number, callback?: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/getRulesUserInfo',
      payload: {
        channelId,
        companyId,
        type,
      },
      callback: callback
    });
  }

  fetchExternalFlow = (params: any, callback?: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/externalFlow',
      payload: {
        ...params
      },
      callback: callback
    });
  }

  fetchInternalFlow = (params: any, callback?: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'beiJingBI/internalFlow',
      payload: {
        ...params
      },
      callback: callback
    });
  }

  handleFormShow = () => {
    const isShowForm = !this.state.isShowForm
    let isShowFormText = "展开"
    if (isShowForm) {
      isShowFormText = '收起'
    }
    this.setState({
      isShowForm,
      isShowFormText,
    })
  }

  handleFormReset = () => {
    const { form, beiJingBI: { reqData, biData } } = this.props;
    const data = this.isReqList() ? reqData : biData
    const { pagination } = data;

    //重置渠道
    this.initChannelDataFunction()

    //重置信息
    this.setState({
      selectedRows: [],
      originalFormValus: undefined,
      formValues: {},
    });
    //重置筛选表单
    form.resetFields();


    //分页信息
    const page = 1
    const pageSize = pagination ? pagination.pageSize : 20
    //请求参数
    const params: { [key: string]: string | number | undefined } = {
      page,
      pageSize,
    };
    this.fetchList(params)
  }

  handleSearch = () => {
    const { form, beiJingBI: { biData, reqData } } = this.props;
    const data = this.isReqList() ? reqData : biData
    const { pagination } = data;
    //重置选中数据
    this.setState({
      selectedRows: [],
    });

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const tempFieldsValue = {
        ...fieldsValue,
      };
      this.setState({
        originalFormValus: tempFieldsValue,
      });

      // 处理二级品类
      const otherCategory = fieldsValue['otherCategory']
      if (otherCategory !== undefined) {
        delete fieldsValue['otherCategory']
        if (otherCategory.length > 0) {
          fieldsValue['otherCategory'] = otherCategory[otherCategory.length - 1]
        }
      }

      //时间处理
      //入库时间
      const allotTime = fieldsValue['allotTime']
      if (allotTime != undefined && allotTime != '') {
        delete fieldsValue['allotTime']
        fieldsValue['allotStartTime'] = moment(allotTime[0]).format('YYYY-MM-DD');
        fieldsValue['allotEndTime'] = moment(allotTime[1]).format('YYYY-MM-DD');
      }


      //首次有效
      const firstValidTime = fieldsValue['firstValidTime']
      if (firstValidTime != undefined && firstValidTime != '') {
        delete fieldsValue['firstValidTime']
        fieldsValue['firstValidStartTime'] = moment(firstValidTime[0]).format('YYYY-MM-DD');
        fieldsValue['firstValidEndTime'] = moment(firstValidTime[1]).format('YYYY-MM-DD');
      }

      //保存筛选表达
      this.setState({
        formValues: fieldsValue
      })

      //分页信息
      const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';

      let page = 1;
      let pageSize = pagination ? pagination.pageSize : 20;

      if (autoRefresh === '1') {
        page = pagination?.current ?? 1
      }

      //请求参数
      const params: { [key: string]: string | number | undefined } = {
        ...fieldsValue,
        page,
        pageSize,
      };
      this.fetchList(params)
    })
  }

  renderFilterFormList = () => {
    const { beiJingBI } = this.props;
    const { filterCategorys, filterCategorysExtra } = this.state;
    const { permission, biConfig, reqConfig, nbUsers } = beiJingBI;
    let list = [];
    let customerConfig = this.isReqList() ? reqConfig : biConfig
    if (permission && permission.bjbichangecompany) {
      list.push(this.renderFormMulSelect("companyId", "所在公司", this.state.originalFormValus?.companyId, customerConfig && customerConfig.nbCompany))
    }

    list.push(this.renderFormInput('groupCustomerId', "集团客户id", this.state.originalFormValus?.groupCustomId))
    list.push(this.renderFormInput("customerId", "客户编号", this.state.originalFormValus?.customerId))
    list.push(this.renderFormInput("phone", "客户电话", this.state.originalFormValus?.phone))
    list.push(this.renderFormInput("customerName", "客户姓名", this.state.originalFormValus?.customerName))
    list.push(this.renderFormInput("recordUserName", "提供人", this.state.originalFormValus?.recordUserName))
    list.push(this.renderFormInput("leadsOwnerName", "客服", this.state.originalFormValus?.leadsOwnerName))
    list.push(this.renderFormInput("reqOwnerName", "邀约人", this.state.originalFormValus?.reqOwnerName))
    list.push(this.renderFormInput("orderOwnerName", "销售", this.state.originalFormValus?.orderOwnerName))
    list.push(this.renderFormRange("allotTime", "入库时间", this.state.originalFormValus?.allotTime))
    list.push(this.renderFormMulSelect("category", "主营品类", this.state.originalFormValus?.mainCategory, customerConfig?.mainCategory))
    list.push(this.renderFormMulSelect("mainCategoryStatus", "品类实时状态", this.state.originalFormValus?.mainCategoryStatus, customerConfig && customerConfig.customerStatus))
    list.push(this.renderFormCascader("otherCategory", "其他品类", this.state.originalFormValus?.otherCategory, customerConfig?.otherCategory))
    list.push(this.renderFormMulSelect("otherCategoryStatus", "其他品类实时状态", this.state.originalFormValus?.otherCategoryStatus, customerConfig && customerConfig.customerStatus))
    list.push(this.renderFormSelect("leadsStatus", "客服状态", this.state.originalFormValus?.leadsStatus, customerConfig && customerConfig.leadsStatus))
    list.push(this.renderFormSelect("reqStatus", "邀约状态", this.state.originalFormValus?.reqStatus, customerConfig && customerConfig.requirementPhase))
    list.push(this.renderFormSelect("orderStatus", "销售状态", this.state.originalFormValus?.orderWeddingStatus, customerConfig && customerConfig.orderPhase))
    list.push(this.renderFormSelect("orderArriveStatus", "进店状态", this.state.originalFormValus?.orderArriveStatus, customerConfig && customerConfig.orderArrivalStatus))
    list.push(this.renderFormInput("commission", "返佣", this.state.originalFormValus?.commission, '请输入返佣关键词'))
    if (this.isReqList()) {
      list.push(this.renderFormTreeSelect("channel", "客资来源", this.state.originalFormValus?.channel, customerConfig && customerConfig.channel))
    } else {
      list.push(this.renderFormChannel())
    }
    list.push(this.renderFormMulSelect("customerStatus", "客户实时状态", this.state.originalFormValus?.customerStatus, customerConfig && customerConfig.customerStatus))
    list.push(this.renderFormSelect("contactFilter", "联系方式过滤", this.state.originalFormValus?.callStatus, [{ id: 0, name: '全部' }, { id: 1, name: '只有微信号' }]))
    list.push(this.renderFormSelect("reqOnceValid", "首次有效", this.state.originalFormValus?.reqOnceValid, [{ id: 1, name: '首次有效' }]))
    list.push(this.renderFormRange("firstValidTime", "首次有效时间", this.state.originalFormValus?.firstValidTime))
    list.push(this.renderFormSelect("callStatus", "通话状态", this.state.originalFormValus?.callStatus, [{ id: 1, name: '有效' }, { id: 0, name: '无效' }]))
    list.push(this.renderFormSelect("customerLevel", "客户级别", this.state.originalFormValus?.customerLevel, customerConfig && customerConfig.customerLevel))
    // 需求级别 （leadsFollowTag）
    list.push(this.renderFormSelect("leadsFollowTag", "客服级别", this.state.originalFormValus?.leadsFollowTag, customerConfig && customerConfig.leadsFollowTag))

    // 邀约级别  (requirementFollowTag)
    list.push(this.renderFormSelect("requirementFollowTag", "邀约级别", this.state.originalFormValus?.requirementFollowTag, customerConfig && customerConfig.requirementFollowTag))

    // 跟进结果
    list.push(this.renderFormSelect("customerFollowStatus", "跟进结果", this.state.originalFormValus?.customerFollowStatus, customerConfig && customerConfig.customerFollowStatus))

    list.push(this.renderFormSelect("balanceTargetCompanyId", "目标公司", this.state.originalFormValus?.balanceTargetCompanyId, customerConfig && customerConfig.nbCompany))
    list.push(this.renderFormSelect("balanceStatus", "分配状态", this.state.originalFormValus?.balanceStatus, [{ id: 1, name: '成功' }, { id: 2, name: '失败' }]))

    list.push(this.renderFormInput("hotel", "酒店名称", this.state.originalFormValus?.hotel, '请输入酒店名称关键词'))

    // 是否有项目协作
    list.push(this.renderFormSelect("isHaveTeam", "是否有项目协作", this.state.originalFormValus?.isHaveTeam, customerConfig && customerConfig.isHaveTeam))

    // 跟进筛选
    list.push(this.renderFormSelect("teamAndIFollowState", "跟进筛选", this.state.originalFormValus?.teamAndIFollowState, customerConfig && customerConfig.teamAndIFollowState))

    // 项目成员
    list.push(this.renderFormMulSelect("teamUserIds", "项目协作成员", this.state.originalFormValus?.teamUserIds, nbUsers))
    return list;
  }

  renderFormInput = (id: string, label: string, initialValue?: any, placeholder?: string) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <Input placeholder={placeholder ? placeholder : '请输入' + label} />)}
    </FormItem>
  }

  renderFormRange = (id: string, label: string, initialValue?: any) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <RangePicker style={{ width: '100%' }} />)}
    </FormItem>
  }

  renderFormCascader = (id: string, label: string, initialValue?: any, options?: CategoryConfigItem[]) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <Cascader showSearch style={{ width: '100%', }} options={options} allowClear={true} />
      )}
    </FormItem>
  }

  renderFormSelect = (id: string, label: string, initialValue?: any, options?: ConfigItem[]) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
          {
            options ? options.map(option => (
              <Option key={option.id} value={option.id}>{option.name}</Option>)) : null
          }
        </Select>,
      )}
    </FormItem>
  }

  renderFormMulSelect = (id: string, label: string, initialValue?: any, options?: ConfigItem[]) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <Select
          mode="multiple"
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          placeholder='请选择'>
          {
            options ? options.map(option => (
              <Option key={option.id} value={option.id}>{option.name}</Option>)) : null
          }
        </Select>
      )}
    </FormItem>
  }

  /** 选择“其他品类” 多选-数组 */
  onChangeOtherCategory = (value: TreeNodeValue, label: any, extra: any) => {
    this.setState({ filterCategorys: value });
    if (value && value.length == 0) { // 如果“业务品类清空了，就把组合品类的已选项也清空，并隐藏”
      this.setState({ filterCategorysExtra: [] });
    }
  }

  /** 选择“业务品类” 多选-数组 */
  onChangeCategory = (value: TreeNodeValue, label: any, extra: any) => {
    this.setState({ filterCategorys: value });
    if (value && value.length == 0) { // 如果“业务品类清空了，就把组合品类的已选项也清空，并隐藏”
      this.setState({ filterCategorysExtra: [] });
    }
  }


  /** 选择“组合品类” 多选-数组 */
  onChangeCategoryExtra = (value: TreeNodeValue, label: any, extra: any) => {
    this.setState({ filterCategorysExtra: value });
  }

  renderFormTreeSelect = (id: string, label: string, initialValue?: any, options?: CategoryConfigItem[], onChange?: (value: TreeNodeValue, label: any, extra: any) => void) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={options}
          filterTreeNode={(inputValue: string, treeNode: any) => {
            return treeNode.props.label.indexOf(inputValue) >= 0;
          }}
          placeholder="请选择(多选)"
          treeNodeLabelProp="label"
          treeCheckable={true}
          allowClear
          showCheckedStrategy={TreeSelect.SHOW_CHILD}
          onChange={onChange}
        />
      )}
    </FormItem>
  }

  renderFormChannel = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label="渠道来源">
      {getFieldDecorator('channel')(
        <Button style={{ width: '100%' }} onClick={this.showSearchChannelSelect}> 选择渠道</Button>
      )}
    </FormItem>
  }

  // ------- 选择渠道 -------
  // 展示选择渠道页面
  showSearchChannelSelect = () => {
    this.setState({
      isShowChannelSelect: true,
    })
  }

  // 隐藏渠道页面
  hiddenSearchChannelSelect = () => {
    this.setState({
      isShowChannelSelect: false,
    })
  }

  // 保存筛选项目并且搜索 
  searchChannelDidSelect = (selectChannelValues: string, selectChannelList: any[]) => {
    // selectChannelValues 筛选结果
    // selectChannelList 选择后的安检状态
    // const { formValues } = this.state;
    // formValues['channel'] = selectChannelValues;
    this.props.form.setFieldsValue({ 'channel': selectChannelValues })
    this.setState({
      channelSelectList: selectChannelList,
    }, () => {
      this.hiddenSearchChannelSelect()
    })
  }

  handleStandardTableChange = (page: number, pageSize: number) => {
    const { formValues } = this.state;
    this.fetchList({
      ...formValues,
      page,
      pageSize
    })
  }

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleNewLeads = () => {
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    this.props.dispatch(routerRedux.push({
      pathname: '/beiJingBI/list/newCustomer',
    }))
  }

  handleAssign = (record: TableListItem) => {
    const myCompanyId = CrmUtil.getUserInfo()?.company_id;
    //拉取本公司渠道
    this.fetchCompanyChannel(myCompanyId ? myCompanyId : '', '', (assignsChannels: CompanyChannel[]) => {
      this.setState({
        assignsChannels,
      })
    })
    //拉取人员
    this.fetchCompanyUsers(this.state.assignsCompanyId ? this.state.assignsCompanyId : '', this.state.assignsChannelId, 2, (rulesUsers: RulesUsers) => {
      this.setState({
        assignsRecordUser: rulesUsers.into_user_list,
        assignsReceiveUser: rulesUsers.receive_user_list,
      })
    })
    this.setState({
      selectedRows: [],
      assignsModal: true,
      assignsRows: [record],
      assignsValue: 1,
      assignsCompanyId: CrmUtil.getUserInfo()?.company_id,
      assignsChannelId: undefined,
      // assignsRecordUserPlaceholder: undefined,
      assignsRecordUserPlaceholder: '搜索提供人',
      // assignsReceiveUserPlaceholder: undefined,
      assignsReceiveUserPlaceholder: '搜索接收人（多选）',
      assignsRecordUser: [],
      assignsReceiveUser: [],
    })
  }

  handleAssigns = () => {
    let isAllowAssign: boolean = true
    let companyName = this.state.selectedRows[0].company_name;
    for (let i = 1; i < this.state.selectedRows.length; i++) {
      if (this.state.selectedRows[i].company_name != companyName) {
        isAllowAssign = false
        break
      }
    }
    if (!isAllowAssign) {
      message.info("数据中包含多个公司，无法批量选择")
      return
    }
    const myCompanyId = CrmUtil.getUserInfo()?.company_id;
    //拉取本公司渠道
    this.fetchCompanyChannel(myCompanyId ? myCompanyId : '', '', (assignsChannels: CompanyChannel[]) => {
      this.setState({
        assignsChannels,
      })
    })
    //拉取人员
    this.fetchCompanyUsers(this.state.assignsCompanyId ? this.state.assignsCompanyId : '', this.state.assignsChannelId, 2, (rulesUsers: RulesUsers) => {
      this.setState({
        assignsRecordUser: rulesUsers.into_user_list,
        assignsReceiveUser: rulesUsers.receive_user_list,
      })
    })
    this.setState({
      assignsModal: true,
      assignsRows: this.state.selectedRows,
      assignsValue: 1,
      assignsCompanyId: CrmUtil.getUserInfo()?.company_id,
      assignsChannelId: undefined,
      // assignsRecordUserPlaceholder: undefined,
      assignsRecordUserPlaceholder: '搜索提供人',
      // assignsReceiveUserPlaceholder: undefined,
      assignsReceiveUserPlaceholder: '搜索接收人（多选）',
      assignsRecordUser: [],
      assignsReceiveUser: [],
    })
  }

  handleAssignSubmit = () => {
    const { form, beiJingBI: { reqData, biData } } = this.props;
    const data = this.isReqList() ? reqData : biData
    const { pagination } = data;
    const formFeilds = []
    if (this.state.assignsValue == 1) { //内部
      formFeilds.push('assign_channel')
      formFeilds.push('assign_recordUserId')
      formFeilds.push('assign_receiveUserId')
      formFeilds.push('assign_category')
      formFeilds.push('assign_status')
      formFeilds.push('assign_allotTimeStatus')
      formFeilds.push('assign_followStatus')
    } else { //外部
      formFeilds.push('assign_companyId')
      formFeilds.push('assign_channel')
      formFeilds.push('assign_recordUserId')
      formFeilds.push('assign_followStatus')
    }
    form.validateFieldsAndScroll(formFeilds, (err, values) => {
      if (err) {
        return
      }
      const params = {};
      const customerIds = this.state.assignsRows.map((item) => {
        return item.customer_id
      });
      const companyId = values['assign_companyId']
      const channel = values['assign_channel']
      const recordUserId = values['assign_recordUserId'] ? values['assign_recordUserId'] : []
      const receiveUserId = values['assign_receiveUserId'] ? values['assign_receiveUserId'] : []
      const category = values['assign_category']
      const status = values['assign_status']
      const allotTimeStatus = values['assign_allotTimeStatus']
      const followStatus = values['assign_followStatus']

      params['customerIds'] = customerIds;
      params['channel'] = channel;
      params['recordUserId'] = recordUserId;
      params['followStatus'] = followStatus;

      if (this.state.assignsValue == 1) { //内部
        params['receiveUserId'] = receiveUserId;
        params['category'] = category;
        params['status'] = status;
        params['allotTimeStatus'] = allotTimeStatus;
        params['type'] = this.state.assignsChangeStatus;

        this.fetchInternalFlow(params);
        this.setState({
          assignsModal: false,
          assignsRows: [],
          selectedRows: [],
        })
        Modal.success({
          title: '操作结果',
          content: '分配成功！',
          onCancel: () => {
            //刷新列表
            const page = pagination ? pagination.current : 1
            const pageSize = pagination ? pagination.pageSize : 20
            let params = {
              ...this.state.formValues,
              page,
              pageSize,
            }
            this.fetchList(params)
          },
          onOk: () => {
            //刷新列表
            const page = pagination ? pagination.current : 1
            const pageSize = pagination ? pagination.pageSize : 20
            let params = {
              ...this.state.formValues,
              page,
              pageSize,
            }
            this.fetchList(params)
          },
        });
      } else { //外部
        params['companyId'] = companyId;
        this.fetchExternalFlow(params);
        this.setState({
          assignsModal: false,
          assignsRows: [],
          selectedRows: [],
        })
        Modal.success({
          title: '操作结果',
          content: '分配成功！',
          onCancel: () => {
            //刷新列表
            const page = pagination ? pagination.current : 1
            const pageSize = pagination ? pagination.pageSize : 20
            let params = {
              ...this.state.formValues,
              page,
              pageSize,
            }
            this.fetchList(params)
          },
          onOk: () => {
            //刷新列表
            const page = pagination ? pagination.current : 1
            const pageSize = pagination ? pagination.pageSize : 20
            let params = {
              ...this.state.formValues,
              page,
              pageSize,
            }
            this.fetchList(params)
          },
        });
      }
    })
  }
  handleAssignCancel = () => {
    this.setState({
      assignsModal: false,
      assignsRows: []
    })
  }

  onChangeCompany = (value: string | undefined) => {
    const { form } = this.props;
    this.setState({
      assignsCompanyId: value,
      assignsChannels: [],
      assignsChannelId: undefined,
      assignsRecordUserPlaceholder: undefined,
      assignsReceiveUserPlaceholder: undefined,
      assignsRecordUser: [],
      assignsReceiveUser: [],
    })
    const restFeilds = ['assign_channel', 'assign_recordUserId']
    form.resetFields(restFeilds)
    if (value == undefined) {
      this.setState({
        assignsChannelPlaceholder: undefined,
        assignsRecordUserPlaceholder: undefined,
      })
    } else {
      this.setState({
        assignsChannelPlaceholder: '搜索渠道',
        assignsRecordUserPlaceholder: '搜索提供人',
        assignsReceiveUserPlaceholder: '搜索接收人（多选）',
      })
      this.fetchCompanyChannel(value, '', (assignsChannels: CompanyChannel[]) => {
        this.setState({
          assignsChannels,
        })
      })
    }
  }

  onChangeChannel = (value: string | undefined) => {
    const { form } = this.props;
    this.setState({
      assignsChannelId: value,
      assignsRecordUserPlaceholder: '搜索提供人',
      assignsReceiveUserPlaceholder: '搜索接收人（多选）',
      assignsRecordUser: [],
      assignsReceiveUser: [],
    }, () => {
      const restFeilds = ['assign_recordUserId', 'assign_receiveUserId']
      form.resetFields(restFeilds)
      if (value != undefined || this.state.assignsValue == 1) {
        let type: number | undefined = undefined;
        if (this.state.assignsValue == 1) {
          type = this.state.assignsChangeStatus;
        }
        //拉取人员
        this.fetchCompanyUsers(this.state.assignsCompanyId ? this.state.assignsCompanyId : '', this.state.assignsChannelId, type, (rulesUsers: RulesUsers) => {
          this.setState({
            assignsRecordUser: rulesUsers.into_user_list,
            assignsReceiveUser: rulesUsers.receive_user_list,
          })
        })
      }
    })
  }

  onChangeAssigns = (e: RadioChangeEvent) => {
    this.setState({
      assignsValue: e.target.value,
      assignsChannels: [],
      assignsChannelId: undefined,
      // assignsRecordUserPlaceholder: undefined,
      assignsRecordUserPlaceholder: '搜索提供人',
      // assignsReceiveUserPlaceholder: undefined,
      assignsReceiveUserPlaceholder: '搜索接收人（多选）',
      assignsRecordUser: [],
      assignsReceiveUser: [],
    }, () => {
      const { form } = this.props;
      const restFeilds = ['assign_companyId', 'assign_channel', 'assign_recordUserId', 'assign_receiveUserId']
      form.resetFields(restFeilds)

      const value = e.target.value
      if (value == 1) { //内部扭转
        this.setState({
          assignsCompanyId: CrmUtil.getUserInfo()?.company_id,
          assignsChannelPlaceholder: '搜索渠道',
        })
        const myCompanyId = CrmUtil.getUserInfo()?.company_id;
        //拉取本公司渠道
        this.fetchCompanyChannel(myCompanyId ? myCompanyId : '', '', (assignsChannels: CompanyChannel[]) => {
          this.setState({
            assignsChannels,
          })
        })
        //拉取人员
        this.fetchCompanyUsers(myCompanyId ? myCompanyId : '', this.state.assignsChannelId, 2, (rulesUsers: RulesUsers) => {
          this.setState({
            assignsRecordUser: rulesUsers.into_user_list,
            assignsReceiveUser: rulesUsers.receive_user_list,
          })
        })
      } else {  //外部
        this.setState({
          assignsCompanyId: undefined,
          assignsChannelPlaceholder: undefined,
        })
      }
    })
  }

  onClickAssignStatusYaoyueType = () => {
    const { form } = this.props;
    this.setState({
      assignsChangeStatus: 2,
      assignsRecordUser: [],
      assignsReceiveUser: [],
    }, () => {
      const restFeilds = ['assign_recordUserId', 'assign_receiveUserId', 'assign_status']
      form.resetFields(restFeilds)
      //拉取人员
      this.fetchCompanyUsers(this.state.assignsCompanyId ? this.state.assignsCompanyId : '', this.state.assignsChannelId, 2, (rulesUsers: RulesUsers) => {
        this.setState({
          assignsRecordUser: rulesUsers.into_user_list,
          assignsReceiveUser: rulesUsers.receive_user_list,
        })
      })
    })
  }

  onClickAssignStatusXuqiuType = () => {
    const { form } = this.props;
    this.setState({
      assignsChangeStatus: 1,
      assignsRecordUser: [],
      assignsReceiveUser: [],
    }, () => {
      const restFeilds = ['assign_recordUserId', 'assign_receiveUserId', 'assign_status']
      form.resetFields(restFeilds)
      //拉取人员
      this.fetchCompanyUsers(this.state.assignsCompanyId ? this.state.assignsCompanyId : '', this.state.assignsChannelId, 1, (rulesUsers: RulesUsers) => {
        this.setState({
          assignsRecordUser: rulesUsers.into_user_list,
          assignsReceiveUser: rulesUsers.receive_user_list,
        })
      })
    })
  }

  alassignrecordUserId = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const recordUserOptions = this.state.assignsRecordUser.map(option => <Option key={option.id}>{option.name}</Option>);

    return (
      <FormItem label='提供人' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
        {getFieldDecorator('assign_recordUserId', {
          rules: [{ required: this.state.assignsValue == 0 ? true : false, message: '请选择提供人' }]
        })(
          < Select
            disabled={(this.state.assignsValue == 0 && this.state.assignsChannelId == undefined) ? true : false}
            showSearch
            allowClear
            placeholder={this.state.assignsRecordUserPlaceholder}
            defaultActiveFirstOption={false}
            showArrow={false}
            optionFilterProp="children">
            {recordUserOptions}
          </Select>
        )}
      </FormItem>
    )
  }


  renderAssignModal() {
    const { form, beiJingBI, fetchConfigLoading, fetchCompanyChannelLoading, fetchCompanyUsersLoading, externalFlowLoading, internalFlowLoading } = this.props;
    const { biConfig, reqConfig, permission } = beiJingBI;
    const { getFieldDecorator } = form;

    let customerConfig = this.isReqList() ? reqConfig : biConfig
    const channelOptions = this.state.assignsChannels.map(option => <Option key={option.value}>{option.label}</Option>);
    const recordUserOptions = this.state.assignsRecordUser.map(option => <Option key={option.id}>{option.name}</Option>);
    const receiveUserOptions = this.state.assignsReceiveUser.map(option => <Option key={option.id}>{option.name}</Option>);


    return (
      <Modal
        title="分配数据"
        okText='提交'
        cancelText='取消'
        // okButtonProps={{ disabled: externalFlowLoading || internalFlowLoading }}
        // cancelButtonProps={{ disabled: externalFlowLoading || internalFlowLoading }}
        visible={this.state.assignsModal}
        onOk={this.handleAssignSubmit}
        onCancel={this.handleAssignCancel}
        destroyOnClose={true}>
        {/* <Spin spinning={fetchConfigLoading || (externalFlowLoading != undefined ? externalFlowLoading : false) || (internalFlowLoading != undefined ? internalFlowLoading : false) || (fetchCompanyChannelLoading != undefined ? fetchCompanyChannelLoading : false) || (fetchCompanyUsersLoading != undefined ? fetchCompanyUsersLoading : false)}> */}
        <Spin spinning={fetchConfigLoading || (fetchCompanyChannelLoading != undefined ? fetchCompanyChannelLoading : false) || (fetchCompanyUsersLoading != undefined ? fetchCompanyUsersLoading : false)}>
          <div style={{ width: '160px', margin: '0 auto' }}>
            <Radio.Group defaultValue="1" buttonStyle="solid" onChange={this.onChangeAssigns}>
              <Radio.Button value="0">外部流转</Radio.Button>
              <Radio.Button value="1">内部流转</Radio.Button>
            </Radio.Group>
            {
              this.state.assignsValue == 1 && <div style={{ display: 'flex', marginTop: '20px', marginBottom: '-10px' }}>
                <Button type='link' onClick={this.onClickAssignStatusYaoyueType} style={{ color: this.state.assignsChangeStatus == 2 ? '#1C86EE' : '#3B3B3B' }}>变更邀约</Button>
                <Button type='link' style={{ color: this.state.assignsChangeStatus == 1 ? '#1C86EE' : '#3B3B3B' }} onClick={this.onClickAssignStatusXuqiuType}>变更客服</Button>
              </div>
            }
          </div>
          <Form style={{ marginTop: '25px' }}>
            {
              this.state.assignsValue == 0 && <FormItem label='目标公司' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
                {getFieldDecorator('assign_companyId', { rules: [{ required: true, message: '请选择目标公司' }] })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear onChange={this.onChangeCompany}>
                    {
                      customerConfig && customerConfig.nbCompany ? customerConfig.nbCompany.map(option => (
                        <Option key={option.id} value={option.id}>{option.name}</Option>)) : null
                    }
                  </Select>,
                )}
              </FormItem>
            }
            <FormItem label='渠道' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
              {getFieldDecorator('assign_channel', {
                rules: [{ required: this.state.assignsValue == 0 ? true : false, message: '请选择渠道' }]
              })(
                < Select
                  disabled={this.state.assignsCompanyId == undefined ? true : false}
                  showSearch
                  allowClear
                  placeholder={this.state.assignsChannelPlaceholder}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  optionFilterProp="children"
                  onChange={this.onChangeChannel}>
                  {channelOptions}
                </Select>
              )}
            </FormItem>

            {
              // 内部流转提供人 
              this.state.assignsValue == 0 && permission?.bjdistributioninternalassignrecorduserid && this.alassignrecordUserId()
            }
            {
              // 外部流转提供人
              this.state.assignsValue == 1 && permission?.bjdistributionexternalassignrecorduserid && this.alassignrecordUserId()
            }

            {
              // bjDistributionInternalAssignRecordUserId (bi分配内部流转提供人)
              // bjDistributionExternalAssignRecordUserId (bi分配外部流转提供人)
              // bjDistributionDelimitTime（bi分配变更划入时间）
            }

            {/* <FormItem label='提供人' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
              {getFieldDecorator('assign_recordUserId', {
                rules: [{ required: this.state.assignsValue == 0 ? true : false, message: '请选择提供人' }]
              })(
                < Select
                  disabled={(this.state.assignsValue == 0 && this.state.assignsChannelId == undefined) ? true : false}
                  showSearch
                  allowClear
                  placeholder={this.state.assignsRecordUserPlaceholder}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  optionFilterProp="children">
                  {recordUserOptions}
                </Select>
              )}
            </FormItem> */}
            {
              this.state.assignsValue == 1 && <FormItem label='接收人' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
                {getFieldDecorator('assign_receiveUserId', {
                  // rules: [{ required: true, message: '请选择接收人' }]
                })(
                  < Select
                    // disabled={this.state.assignsChannelId == undefined ? true : false}
                    placeholder={this.state.assignsReceiveUserPlaceholder}
                    mode="multiple"
                    showSearch
                    allowClear
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    optionFilterProp="children">
                    {receiveUserOptions}
                  </Select>
                )}
              </FormItem>
            }
            {
              this.state.assignsValue == 1 && <FormItem label={'品类'} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('assign_category', { initialValue: '2', rules: [{ required: true, message: '请选择品类' }] })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={customerConfig?.category2}
                    filterTreeNode={(inputValue: string, treeNode: any) => {
                      return treeNode.props.label.indexOf(inputValue) >= 0;
                    }}
                    placeholder="请选择(多选)"
                    treeNodeLabelProp="label"
                    treeCheckable={true}
                    allowClear
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  />
                )}
              </FormItem>

            }
            {
              this.state.assignsValue == 1 && <FormItem label={this.state.assignsChangeStatus == 2 ? '是否变更邀约状态' : '是否变更客服状态'} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
                {getFieldDecorator('assign_status', {
                  rules: [{ required: true, message: this.state.assignsChangeStatus == 2 ? '请选择是否变更邀约状态' : '请选择是否变更客服状态' }]
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value={'0'}>不变更</Option>
                    {
                      this.state.assignsChangeStatus == 2 && customerConfig && customerConfig.requirementPhase ? customerConfig.requirementPhase.map(option => (
                        <Option key={option.id} value={option.id}>{option.name}</Option>)) : null
                    }
                    {
                      this.state.assignsChangeStatus == 1 && customerConfig && customerConfig.leadsStatus ? customerConfig.leadsStatus.map(option => (
                        <Option key={option.id} value={option.id}>{option.name}</Option>)) : null
                    }
                  </Select>
                )}
              </FormItem>
            }
            {
              this.state.assignsValue == 1 && permission.bjdistributiondelimittime && <FormItem label='是否变更划入时间' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
                {getFieldDecorator('assign_allotTimeStatus', {
                  rules: [{ required: true, message: '请选择是否变更划入时间' }]
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value={'1'}>变更</Option>
                    <Option value={'0'}>不变更</Option>
                  </Select>
                )}
              </FormItem>
            }
            <FormItem label='历史是否可见' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} >
              {getFieldDecorator('assign_followStatus', {
                initialValue: '1'
              })(
                <Radio.Group>
                  <Radio value={'1'}>可见</Radio>
                  <Radio value={'0'}>不可见</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal >
    )
  }

  rowClassName = (recoder: TableListItem, index: number) => {
    if (moment(recoder.create_time).isBefore('2020-06-03 23:59:59')) {
      return styles.lightTime
    }
    return '';
  }

  render() {
    const { beiJingBI: { biData, reqData }, fetchLoading, fetchConfigLoading, fetchPermissionLoading, fetchNBUsersLoading } = this.props;
    const data = this.isReqList() ? reqData : biData
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper className={styles.innerHeader}>
        <Spin spinning={false}>
          <Card bordered={false}>
            {this.state.assignsModal && this.renderAssignModal()}
            <div>
              <Spin spinning={fetchConfigLoading || fetchPermissionLoading || (fetchNBUsersLoading != undefined && fetchNBUsersLoading)}>
                <CrmFilterForm
                  expandable={true}
                  retainFilterNumber={11}
                  formItemList={this.renderFilterFormList()}
                  onFilterReset={this.handleFormReset}
                  onFilterSearch={this.handleSearch}
                />
              </Spin>
              <Divider />
              <MyTable
                selectedRows={selectedRows}
                loading={fetchLoading}
                selecteMode={!this.isReqList() ? 'checkbox' : undefined}
                rowKey='customer_id'
                onRowsSelectChanged={this.handleSelectRows}
                data={data}
                columns={this.columns}
                onPaginationChanged={this.handleStandardTableChange}
                columnsEditable={true}
                renderTopButtons={
                  () => (
                    <>
                      {selectedRows.length > 0 ?
                        <Button style={{ marginRight: '10px' }} onClick={this.handleAssigns}>批量分配</Button>
                        :
                        null}
                      <Button type="primary" onClick={this.handleNewLeads}><PlusOutlined />新建客资</Button>
                    </>
                  )
                }
                rowClassName={this.rowClassName}
              />
            </div>
          </Card>
          <ShearchChannelSelectPropsPage
            saveFunction={this.searchChannelDidSelect}
            onCancel={this.hiddenSearchChannelSelect}
            visible={this.state?.isShowChannelSelect}
            data={this.state?.isShowChannelSelect === true ? (this.state?.channelSelectList ?? []) : []}
          />
        </Spin>

      </PageHeaderWrapper>
    );
  }

}

class TableList extends Component<BeiJingBIListProps, BeiJingBIListState> {
  render() {
    return (
      <PageHeaderWrapper className={styles.outerHeader}>
        <KeepAlive>
          <BeiJingBIList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }
}
class MyTable extends CrmStandardTable<TableListItem>{ }
export default Form.create<BeiJingBIListProps>()(TableList);
