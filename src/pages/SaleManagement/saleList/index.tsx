import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  // Icon,
  Input,
  // InputNumber,
  // Menu,
  // Radio,
  Row,
  Select,
  // message,
  // Cascader,
  TreeSelect,
  Cascader,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import { StateType } from './model';
import { TableListItem, TableListPagination } from './data';
import styles from './style.less';
import LOCAL from '@/utils/LocalStorageKeys';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import { ConfigListItem } from "@/pages/CustomerManagement/commondata";
import CrmFilterForm from '@/components/CrmFilterForm';
import { ConfigCommon } from '@/commondata';
import { PlusOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<any>>;
  loading: boolean;
  SaleOrderTableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string | number } | undefined;
  stepFormValues: Partial<TableListItem>;
  cityCode: string
  result: Object;
  resetArea: boolean;
  configData?: ConfigCommon;
  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
  showColumns: CrmStandardTableColumnProps<TableListItem>[];

}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    SaleOrderTableList,
    loading,
  }: {
    SaleOrderTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    SaleOrderTableList,
    loading: loading.models.SaleOrderTableList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  leadsStatus = undefined;
  currentUserInfo = CrmUtil.getUserInfo();
  currentCategory = ''
  columns: CrmStandardTableColumnProps<TableListItem>[] = [
    {
      title: '集团客户ID',
      dataIndex: 'group_customer_id',
      key: 'group_customer_id',
      fixed: 'left',
      width: 120,
      disableSelect: true,
    },
    {
      title: '订单编号',
      dataIndex: 'id',
      width: 120,
      key: 'id',
      fixed: 'left',
      disableSelect: true,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.orderDetailCtrl(record)}>{text}</a>
        </Fragment>
      )
    },
    {
      title: '客户编号',
      dataIndex: 'customer_id',
      key: 'customer_id',
      width: 120,
    },
    {
      title: '渠道来源',
      dataIndex: 'channel_txt',
      key: 'channel_txt',
      width: 150,
    },
    {
      title: '业务品类',
      dataIndex: 'category_txt',
      key: 'category_txt',
      width: 150,
    },
    {
      title: '酒店名称',
      dataIndex: 'hotel',
      key: 'hotel',
      width: 160,
    },
    {
      title: '入库时间',
      dataIndex: 'create_time',
      width: 150,
      key: 'create_time',
    },
    {
      title: '签单时间',
      dataIndex: 'contract_time',
      width: 150,
      key: 'contract_time',
    },
    {
      title: '执行时间',
      dataIndex: 'contract_wedding_date',
      width: 150,
      key: 'contract_wedding_date',
    },
    {
      title: '客户姓名',
      dataIndex: 'customer_name',
      key: 'customer_name',
      width: 150,
      disableSelect: true,
    },
    {
      title: '提供人',
      dataIndex: 'record_user_name',
      key: 'record_user_name',
      width: 150,
    },
    {
      title: '客服',
      dataIndex: 'leads_owner_name',
      key: 'leads_owner_name',
      width: 150,
    },
    {
      title: '邀约人',
      dataIndex: 'req_owner_name',
      key: 'req_owner_name',
      width: 150,
    },
    {
      title: '客户级别',
      dataIndex: 'customer_level_txt',
      key: 'customer_level_txt',
      width: 150,
    },
    {
      title: '合同编号',
      dataIndex: 'contract_num',
      key: 'contract_num',
      width: 120,
      disableSelect: true,
    },
    {
      title: '进店状态',
      dataIndex: 'arrival_status_txt',
      key: 'arrival_status_txt',
      width: 150,
    },
    {
      title: '最新沟通时间',
      dataIndex: 'follow_time',
      key: 'follow_time',
      width: 150,
    },
    {
      title: '最新沟通记录',
      dataIndex: 'follow_content',
      key: 'follow_content',
      width: 300,
    },
    {
      title: '下次回访时间',
      dataIndex: 'next_contact_time',
      key: 'next_contact_time',
      width: 150,
    },
    {
      title: '跟进次数',
      dataIndex: 'follow_num',
      key: 'follow_num',
      width: 150,
    },
    {
      title: '销售状态',
      dataIndex: 'phase_txt',
      key: 'phase_txt',
      width: 150,
    },
    {
      title: '销售级别',
      dataIndex: 'follow_tag_txt',
      key: 'follow_tag_txt',
      width: 150,
    },
    {
      title: '跟进结果',
      dataIndex: 'follow_status_txt',
      key: 'follow_status_txt',
      width: 150,
    },
    {
      title: '销售',
      dataIndex: 'order_owner_name',
      key: 'order_owner_name',
      width: 150,
    },
    {
      title: '项目协作成员',
      dataIndex: 'team_user',
      key: 'team_user',
    },
  ];

  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    cityCode: '',
    result: {},
    resetArea: false,
    configData: {
      channel: [],
      category: [],
      followRes: [],
      weddingStyle: [],
      source: [],
      orderFollowStatus: [],
      orderFollowTag: [],
      orderType: [],
      orderStatus: [],
      orderPhase: [],
      orderFollowState: [],
      customerLevel: [],
      customerStatus: [],
      orderArrivalStatus: [],
    },
    showColumns: this.columns,
  };

  componentDidMount() {
    if (window.location.href.indexOf("/hy/") > 0) {
      this.currentCategory = "1"
    } else if (window.location.href.indexOf("/hq/") > 0) {
      this.currentCategory = "2"
    } else if (window.location.href.indexOf("/other/") > 0) {
      this.currentCategory = "-1"
    }
    const { dispatch } = this.props;
    const params = {
      // 'companyId': CrmUtil.getUserInfo()?.company_id
    }
    Axios.post(URL.customerConfig, params)
      .then(
        res => {
          if (res.code == 200) {
            this.setState({
              configData: res.data.result
            })
          }
        }
      );
    // 拉取表单信息
    dispatch({
      type: 'SaleOrderTableList/fetch',
      payload: { category: this.currentCategory, isMy: this.isMy }, // -1 代表除婚庆婚宴外的其他品类
      callback: this.listOrderCallback,
    });
    //拉取搜索用户
    dispatch({
      type: 'SaleOrderTableList/getDistributePeopleConifgInfo',
    });
    dispatch({
      type: 'SaleOrderTableList/getUserPermissionList',
    });

    if (CrmUtil.getCompanyType() == 1) {
      var tempCo = this.state?.showColumns
      tempCo.map((item) => {
        if (item.title == '跟进标签') {
          item.title = '呼叫结果'
        }
      })

      const activityName = {
        title: '活动名称',
        dataIndex: 'activity_name',
        key: 'activity_name',
        width: 120,
      };

      tempCo.splice(6, 1, activityName);
      tempCo.splice(8, 1);
      this.setState({
        showColumns: tempCo
      })
    }

    localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
  }

  componentWillReceiveProps(nextProps: any) {

    // 刷新页面数据
    const isRefreshList = localStorage ? localStorage.getItem('orderListentryFollowIsRefresh')?.toString() : '';
    const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';
    if (isRefreshList?.length > 0) {
      localStorage?.setItem('orderListentryFollowIsRefresh', '')
      if (isRefreshList == 'reset') {
        this.handleFormReset();
      }
    } else if (autoRefresh === '1') {
      this.handleSearch();
      localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
    }
  }

  renderCity = (record: any) => (
    <div>{(record && record.city) ? record.city : null}</div>
  )

  renderDistrict = (record: any) => (
    <div>{(record && record.district) ? `-${record.district}` : null}</div>
  )


  listOrderCallback = (res: Object) => {
    this.setState({
      result: res.data.result
    })
  }

  // new 分页组件
  handleStandardTableChange = (
    page: number, pageSize: number
  ) => {
    const { dispatch } = this.props;
    const { formValues = {} } = this.state;
    const params = {
      ...formValues,
      category: formValues['category'] ?? this.currentCategory,
      status: this.leadsStatus,
      cityCode: this.state.cityCode,
      isMy: this.isMy
    };

    dispatch({
      type: 'SaleOrderTableList/fetch',
      payload: {
        ...params,
        page,
        pageSize
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const that = this;
    this.setState({
      resetArea: true,
    }, () => {
      that.state.resetArea = false;
    });
    // 状态
    const values = {
      status: this.leadsStatus,
      category: this.currentCategory

    };
    // 取出分页信息
    const { SaleOrderTableList: { hyData, hqData, otherData } } = this.props;
    const data = this.currentCategory == '1' ? hyData : this.currentCategory == '2' ? hqData : otherData
    this.setState({
      formValues: undefined,
      originalFormValus: undefined,
    });

    dispatch({
      type: 'SaleOrderTableList/fetch',
      payload: {
        ...values,
        isMy: this.isMy,
        page: 1,
        pageSize: data.pagination?.pageSize
      },
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  /** 1：我的销售单  0：我的协作单  默认是1 */
  isMy = 1;

  handleSearch = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        originalFormValus: fieldsValue,
      })

      let values = {
        ...fieldsValue,
      };
      // 处理二级品类cascader
      const category = fieldsValue['category']
      if (category) {
        if (category.length > 0) {
          values['category'] = category[category.length - 1];
        }
      } else {
        values['category'] = this.currentCategory;
      }

      // 取出入库起始和结束时间
      const { createRangeTime } = fieldsValue
      if (createRangeTime !== undefined) {
        delete values.createRangeTime
        values.createStartTime = moment(createRangeTime[0]).format('YYYY-MM-DD');
        values.createEndTime = moment(createRangeTime[1]).format('YYYY-MM-DD');
      }


      // 取出执行时间起始和结束时间
      const { contractWeddingDate } = fieldsValue
      if (contractWeddingDate !== undefined) {
        delete values.contractWeddingDate
        values.contractWeddingDateStartTime = moment(contractWeddingDate[0]).format('YYYY-MM-DD');
        values.contractWeddingDateEndTime = moment(contractWeddingDate[1]).format('YYYY-MM-DD');
      }

      // 取出签单起始和结束时间
      const { contractRangeTime } = fieldsValue
      if (contractRangeTime !== undefined) {
        delete values.contractRangeTime
        values.contractStartTime = moment(contractRangeTime[0]).format('YYYY-MM-DD');
        values.contractEndTime = moment(contractRangeTime[1]).format('YYYY-MM-DD');
      }

      //渠道来源
      const channelArr = fieldsValue.channel
      if (channelArr !== undefined) {
        delete values.channel
        if (channelArr.length > 0) {
          values.channel = channelArr.join()
        }
      }

      //客户实时状态
      const customerStatusArr = fieldsValue.customerStatus
      if (customerStatusArr !== undefined) {
        delete values.customerStatus
        if (customerStatusArr.length > 0) {
          values.customerStatus = customerStatusArr.join()
        }
      }

      //销售状态
      const phaseArr = fieldsValue.phase
      if (phaseArr !== undefined) {
        delete values.phase
        if (phaseArr.length > 0) {
          values.phase = phaseArr.join()
        }
      }

      //进店状态
      const arrivalStatusArr = fieldsValue.arrivalStatus
      if (arrivalStatusArr !== undefined) {
        delete values.arrivalStatus
        if (arrivalStatusArr.length > 0) {
          values.arrivalStatus = arrivalStatusArr.join()
        }
      }

      //项目协作成员
      const teamUserIds = fieldsValue.teamUserIds
      if (teamUserIds !== undefined) {
        delete values.teamUserIds
        if (teamUserIds.length > 0) {
          values.teamUserIds = teamUserIds.join()
        }
      }

      const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';

      // 取出分页信息
      const { SaleOrderTableList: { hyData, hqData, otherData } } = this.props;
      const data = this.currentCategory == '1' ? hyData : this.currentCategory == '2' ? hqData : otherData
      if (data.pagination !== undefined && autoRefresh !== '1') {
        values.page = 1;
        values.pageSize = data.pagination.pageSize;
      } else {
        values.page = data.pagination?.current ?? 1;
        values.pageSize = data.pagination?.pageSize ?? 20;
      }

      this.setState({
        formValues: values,
      });

      values.isMy = this.isMy;

      dispatch({
        type: 'SaleOrderTableList/fetch',
        payload: values,
      });
    });
  };

  handleChangeListTab = (e: RadioChangeEvent) => {
    this.setState({
      selectedRows: [],
    });

    this.isMy = e.target.value

    const { dispatch } = this.props;
    const { formValues } = this.state;
    // 表单信息和状态
    const values: { [x: string]: string | number; } = {
      ...formValues,
    };

    // 取出分页信息
    const { SaleOrderTableList: { hyData, hqData, otherData } } = this.props;
    const data = this.currentCategory == '1' ? hyData : this.currentCategory == '2' ? hqData : otherData
    values.page = 1;
    values.pageSize = data.pagination?.pageSize ?? 20;

    this.setState({
      formValues: values,
    });

    values.isMy = this.isMy.toString();
    values.category = formValues && formValues['category'] ? formValues['category'] : this.currentCategory,

      dispatch({
        type: 'SaleOrderTableList/fetch',
        payload: values,
      });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  /**
   * 领取订单
   */
  newOrder = () => {
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    var pathName = window.location.href.substr(window.location.href.indexOf(window.location.pathname)) + "/getOrder"
    this.props.dispatch(routerRedux.push({
      pathname: pathName,
    }))
  };

  /** 订单详情 */
  orderDetailCtrl = record => {
    let { id, customer_id } = record;
    if (!record) {
      id = 1;
    }

    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    var pathName = window.location.href.substr(window.location.href.indexOf(window.location.pathname)) + "/orderDetails"
    this.props.dispatch(routerRedux.push({
      pathname: pathName,
      state: {
        orderId: id,
        customerId: customer_id,
        showStyle: 3
      }
    }))
  };

  /**
   * 新建客资
   */
  handleNewLeads = () => {
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    var pathName = window.location.href.substr(window.location.href.indexOf(window.location.pathname)) + "/newCustomer"
    this.props.dispatch(routerRedux.push({
      pathname: pathName,
    }))
  }


  renderFilterForm = () => {
    const {
      form: { getFieldDecorator },
      SaleOrderTableList: { distributePeopleConifg }
    } = this.props;
    const { configData } = this.state;

    const formItemList: JSX.Element[] = new Array();

    // 集团客户id
    formItemList.push(
      <FormItem label="集团客户ID">
        {getFieldDecorator('groupCustomerId', { initialValue: this.state.originalFormValus?.groupCustomId })(<Input placeholder="请输入集团客户ID" />)}
      </FormItem>
    );

    // 客户编号
    formItemList.push(
      <FormItem label="客户编号">
        {getFieldDecorator('customerId', { initialValue: this.state.originalFormValus?.customerId })(<Input placeholder="请输入客户编号" />)}
      </FormItem>
    );

    // 渠道来源
    formItemList.push(
      <FormItem label="渠道来源">
        {getFieldDecorator('channel', { initialValue: this.state.originalFormValus?.channel })(
          <TreeSelect style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={configData?.allchannel}
            filterTreeNode={(inputValue: string, treeNode: any) => {
              return treeNode.props.label.indexOf(inputValue) >= 0;
            }}
            placeholder="请选择（多选）"
            treeNodeLabelProp="label"
            treeCheckable={true}
            allowClear
            showCheckedStrategy={TreeSelect.SHOW_CHILD} />
        )}
      </FormItem>
    );

    // 品类
    if (this.currentCategory == '-1') {
      formItemList.push(
        <FormItem label="品类">
          {getFieldDecorator("category", { initialValue: this.state.originalFormValus?.category })(
            <Cascader showSearch style={{ width: '100%', }} options={configData?.otherCategory} allowClear={true} />
          )}
        </FormItem>
      );
    }

    // 客户姓名
    formItemList.push(
      <FormItem label="客户姓名">
        {getFieldDecorator('customerName', { initialValue: this.state.originalFormValus?.customerName })(<Input placeholder="请输入客户姓名" maxLength={5} />)}
      </FormItem>
    );

    // 客户电话
    formItemList.push(
      <FormItem label="客户电话">
        {getFieldDecorator('customerPhone', {
          rules: [{ required: false, pattern: new RegExp(/^-?[0-9]*(\.[0-9]*)?$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
            return event.target.value.replace(/\D/g, '')
          },
          initialValue: this.state.originalFormValus?.customerPhone
        })(<Input placeholder="请输入客户电话" maxLength={11} />)}
      </FormItem>
    );


    // 客户微信
    formItemList.push(
      <FormItem label={'客户微信'}>
        {getFieldDecorator('wechat', {
          initialValue: this.state.originalFormValus?.wechat
        })(<Input placeholder="请输入" />)}
      </FormItem>
    )

    // 入库时间
    formItemList.push(
      <FormItem label="入库时间">
        {getFieldDecorator('createRangeTime', { initialValue: this.state.originalFormValus?.createRangeTime })(
          <RangePicker
            placeholder={['开始时间', '结束时间']}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
    );

    // 销售状态
    formItemList.push(
      <FormItem label="销售状态">
        {getFieldDecorator('phase', { initialValue: this.state.originalFormValus?.phase })(
          <Select placeholder="请选择（多选）" style={{ width: '100%' }} allowClear mode="multiple">
            {
              configData && configData.orderPhase.map(orderPhase => (
                <Option key={orderPhase.id} value={orderPhase.id}>{orderPhase.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );

    // 销售负责人
    formItemList.push(
      <FormItem label="销售负责人">
        {getFieldDecorator('ownerId', { initialValue: this.state.originalFormValus?.ownerId })(
          <Select
            showSearch
            optionFilterProp="children"
            style={{ width: '100%' }}
            placeholder="请选择">
            {
              (distributePeopleConifg && distributePeopleConifg.length > 0) ?
                distributePeopleConifg.map(config => (
                  <Option key={config.id} value={config.id}>{config.name}</Option>))
                :
                null
            }
          </Select>
        )}
      </FormItem>
    );

    // 客户级别
    formItemList.push(
      <FormItem label="客户级别">
        {getFieldDecorator('customerLevel', { initialValue: this.state.originalFormValus?.customerLevel })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData && configData.customerLevel.map(customerLevel => (
                <Option key={customerLevel.id} value={customerLevel.id}>{customerLevel.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );

    // 项目协作成员
    formItemList.push(
      <FormItem label='项目协作成员'>
        {getFieldDecorator('teamUserIds', {
          initialValue: this.state.originalFormValus?.teamUserIds
        })(
          <Select
            style={{ width: '100%' }}
            mode="multiple"
            placeholder="请选择"
            optionFilterProp="children"
            showSearch
            allowClear
          >
            {distributePeopleConifg && distributePeopleConifg.map((item: any) =>
              <Option key={item.id} value={item.id} >{item.name}</Option>)}
          </Select>
        )}
      </FormItem>
    );

    // 合同编号
    formItemList.push(
      <FormItem label="合同编号">
        {getFieldDecorator('contractNum', { initialValue: this.state.originalFormValus?.contractNum })(
          <Input placeholder="请输入合同编号" />)}
      </FormItem>
    );

    // 销售级别
    formItemList.push(
      <FormItem label="销售级别">
        {getFieldDecorator('followTag', { initialValue: this.state.originalFormValus?.followTag })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData && configData.orderFollowTag.map(tag => (
                <Option key={tag.id} value={tag.id}>{tag.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );

    // 进店状态
    formItemList.push(
      <FormItem label="进店状态">
        {getFieldDecorator('arrivalStatus', { initialValue: this.state.originalFormValus?.arrivalStatus })(
          <Select placeholder="请选择（多选）" style={{ width: '100%' }} allowClear mode="multiple">
            {
              configData && configData.orderArrivalStatus?.map(orderArrivalStatus => (
                <Option key={orderArrivalStatus.id} value={orderArrivalStatus.id}>{orderArrivalStatus.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );

    // 执行时间
    formItemList.push(
      <FormItem label="执行时间" >
        {getFieldDecorator('contractWeddingDate', {
          initialValue: this.state.originalFormValus?.contractWeddingDate,
        })(
          <RangePicker placeholder={['开始时间', '结束时间']} style={{ width: '100%', }}
          />
        )}
      </FormItem>
    );

    // 签单时间
    formItemList.push(
      <FormItem label="签单时间" >
        {getFieldDecorator('contractRangeTime', {
          initialValue: this.state.originalFormValus?.contractRangeTime,
        })(
          <RangePicker placeholder={['开始时间', '结束时间']} style={{ width: '100%', }}
          />
        )}
      </FormItem>
    );

    // 跟进结果
    formItemList.push(
      <FormItem label="跟进结果">
        {getFieldDecorator('followStatus', { initialValue: this.state.originalFormValus?.followStatus })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData && configData.orderFollowStatus.map(followStatus => (
                <Option key={followStatus.id} value={followStatus.id}>{followStatus.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );

    // 酒店名称
    formItemList.push(
      <FormItem label="酒店名称">
        {getFieldDecorator('hotel', { initialValue: this.state.originalFormValus?.hotel })(
          <Input placeholder="请输入酒店名称关键词" />)}
      </FormItem>
    );

    // 酒店名称
    formItemList.push(
      <FormItem label="提供人">
        {getFieldDecorator('recordUserName', { initialValue: this.state.originalFormValus?.recordUserName })(
          <Input placeholder="请输入提供人" />)}
      </FormItem>
    );

    return formItemList;
  }

  render() {
    const { SaleOrderTableList: { hyData, hqData, otherData }, loading, } = this.props;
    const data = this.currentCategory == '1' ? hyData : this.currentCategory == '2' ? hqData : otherData
    const { selectedRows } = this.state;

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <CrmFilterForm
            expandable={true}
            retainFilterNumber={5}
            formItemList={this.renderFilterForm()}
            onFilterReset={this.handleFormReset}
            onFilterSearch={this.handleSearch}
          />

          <Divider />

          <MyTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            rowKey='id'
            columns={this.state?.showColumns}
            onSelectRow={this.handleSelectRows}
            onPaginationChanged={this.handleStandardTableChange}
            columnsEditable={true}
            renderTopButtons={
              () => (
                <div style={{ display: 'flex', width: '100%' }}>
                  {
                    <Radio.Group style={{ flex: 1 }} defaultValue={1} buttonStyle="solid" onChange={this.handleChangeListTab}>
                      <Radio.Button value={1} key={1}>我的销售单</Radio.Button>
                      <Radio.Button value={0} key={0}>我的协作单</Radio.Button>
                    </Radio.Group >
                  }
                  <div style={{ flex: 1 }} />
                  <Button style={{ marginRight: 10 }} type="primary" onClick={(e) => { this.handleNewLeads(e) }} ><PlusOutlined />新建客资</Button>
                  <Button onClick={this.newOrder}>领取订单</Button>
                </div>
              )
            }
          />
        </div>
      </Card>

    );
  }
}
class TableList1 extends Component<TableListProps, TableListState> {

  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <TableList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}

class MyTable extends CrmStandardTable<TableListItem>{ }

export default Form.create<TableListProps>()(TableList1);
