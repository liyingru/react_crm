import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Radio,
  Row,
  Select,
  message,
  Cascader,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import FileUpload from '@/components/FileUpload';
import AreaSelect from '@/components/AreaSelect';
import { RadioChangeEvent } from 'antd/lib/radio';
import { getCustomerConfigData, CustomerConfigDataState } from '@/utils/remoteConfig';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams, ConfigListItem } from './data';
import styles from './style.less';
import LOCAL from '@/utils/LocalStorageKeys';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<any>>;
  loading: boolean;
  newOrderTableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string } | undefined;
  stepFormValues: Partial<TableListItem>;
  cityCode: string
  resetArea: boolean;
  configData?: ConfigState;
  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
}
interface ConfigState {
  channel: ConfigListItem[];
  category: ConfigListItem[];
  followRes: ConfigListItem[];
  weddingStyle: ConfigListItem[];
  source: ConfigListItem[];
  orderFollowStatus: ConfigListItem[];
  orderFollowTag: ConfigListItem[];
  orderType: ConfigListItem[];
  orderStatus: ConfigListItem[];
  orderPhase: ConfigListItem[];
  orderReceipt: ConfigListItem[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    newOrderTableList,
    loading,
  }: {
    newOrderTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newOrderTableList,
    loading: loading.models.newOrderTableList,
  }),
)
class TableList extends Component<TableListProps, TableListState, ConfigState> {
  leadsStatus = undefined;
  currentUserInfo = CrmUtil.getUserInfo();

  columns: CrmStandardTableColumnProps<TableListItem>[] = [
    {
      title: '订单编号',
      dataIndex: 'order_num',
      width: 220,
      key: 'order_num',
      fixed: 'left'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 150,
      key: 'create_time',
    },
    {
      title: '客户姓名',
      disableSelect: true,
      dataIndex: 'customer_name',
      key: 'customer_name',
      width: 100,
    },
    {
      title: '客户编号',
      dataIndex: 'customer_id',
      key: 'customer_id',
      width: 100,
    },
    {
      title: '客户电话',
      disableSelect: true,
      dataIndex: 'mobile',
      key: 'mobile',
      width: 160,
    },
    {
      title: '客户微信',
      dataIndex: 'wechat',
      key: 'wechat',
      width: 120,
    },

    {
      title: '联系人',
      dataIndex: 'contacts',
      key: 'contacts',
      width: 120,
    },
    {
      title: '订单类型',
      dataIndex: 'category_txt',
      key: 'category_txt',
      width: 120,
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      width: 150,
      render(city_info: any) {
        const { full } = city_info;
        return (
          <div>
            {
              full
            }
          </div>
        )
      },
    },
    {
      title: '客资来源',
      dataIndex: 'channel_txt',
      key: 'channel_txt',
      width: 120,
    },
    {
      title: '有效单编号',
      dataIndex: 'req_num',
      key: 'req_num',
      width: 200,
    },
    {
      title: '推荐商家',
      dataIndex: 'merchant',
      key: 'merchant',
      width: 100,
    },
    {
      title: '婚期',
      dataIndex: 'wedding_date',
      key: 'wedding_date',
      width: 180,
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
    },
    {
      title: '订单状态',
      dataIndex: 'status_txt',
      key: 'status_txt',
      width: 120,
    },
    {
      title: '跟进标签',
      dataIndex: 'follow_tag_txt',
      key: 'follow_tag_txt',
      width: 120,
    },
    {
      title: '跟进结果',
      dataIndex: 'follow_status_txt',
      key: 'follow_status_txt',
      width: 120,
    },
    {
      title: '合同签订时间',
      dataIndex: 'sign_time',
      key: 'sign_time',
      width: 130,
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
      key: 'owner_name',
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 100,
    },
    {
      title: '操作',
      key: 'edit',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.orderDetailCtrl(record)}>跟进</a>
        </Fragment>
      )
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
      orderReceipt: [],
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    Axios.post(URL.customerConfig)
      .then(
        res => {
          if (res.code == 200) {
            res.data.result.orderPhase.unshift({ id: '', name: "全部" })
            this.setState({
              configData: res.data.result
            })

          }
        }
      );
    // 拉取表单信息
    dispatch({
      type: 'newOrderTableList/fetch',
    });
    //拉取搜索用户
    dispatch({
      type: 'newOrderTableList/getDistributePeopleConifgInfo',
    });
    dispatch({
      type: 'newOrderTableList/getUserPermissionList',
    });

    if (CrmUtil.getCompanyType() == 1) {
      // var tempCo = this.state?.showColumns
      this.columns.map((item) => {
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

      this.columns.splice(6, 1, activityName);

      // this.setState({
      //   showColumns: tempCo
      // })
    } else {
      const groupCustomerId = {
        title: '集团id',
        dataIndex: 'group_customer_id',
        key: 'group_customer_id',
        width: 120,
      };
      this.columns.splice(2, 0, groupCustomerId);

      const receipt = {
        title: '商家回执',
        dataIndex: 'receipt',
        key: 'receipt',
        width: 120,
      };
      this.columns.splice(8, 0, receipt);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const needResetList = localStorage.getItem(LOCAL.LIST_RESET_REFRESH)?.toString();
    if (needResetList == 'orderList') {
      this.handleFormReset();
      localStorage.removeItem(LOCAL.LIST_RESET_REFRESH);
    } else {
      // 刷新页面数据
      const isRefreshList = localStorage ? localStorage.getItem('orderListentryFollowIsRefresh')?.toString() : '';
      if (isRefreshList?.length > 0) {
        localStorage?.setItem('orderListentryFollowIsRefresh', '')
        this?.handleRefresh()
      }
    }

  }

  renderCity = (record: any) => (
    <div>{(record && record.city) ? record.city : null}</div>
  )

  renderDistrict = (record: any) => (
    <div>{(record && record.district) ? `-${record.district}` : null}</div>
  )

  // new 分页组件
  handleStandardTableChange = (
    page: number, pageSize: number
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      // status: this.leadsStatus,
      cityCode: this.state.cityCode
    };

    // 分页信息
    params.page = page;
    params.pageSize = pageSize;

    dispatch({
      type: 'newOrderTableList/fetch',
      payload: params,
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
      // 'status': this.leadsStatus,
      // 'city':'全国',
      // 'district':'',
      cityCode: '100000',
      // status: this.leadsStatus,


    };
    // 取出分页信息
    const { newOrderTableList: { data } } = this.props;
    const { pagination } = data;
    if (pagination !== undefined) {
      values.page = 1;
      values.pageSize = pagination.pageSize;
    }
    // this.setState({
    //   formValues: values,
    // });
    this.setState({
      formValues: undefined,
      originalFormValus: undefined,
    });

    dispatch({
      type: 'newOrderTableList/fetch',
      payload: values,
    });
  };

  // 订单状态切换
  handleOrderStatus = (e: RadioChangeEvent) => {
    this.leadsStatus = e.target.value;
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      ...formValues,
      phase: this.leadsStatus,
      cityCode: this.state.cityCode
    };


    // 取出分页信息
    const { newOrderTableList: { data: { pagination } } } = this.props;
    if (pagination !== undefined) {
      params.page = pagination.current;
      params.pageSize = pagination.pageSize;
    }

    dispatch({
      type: 'newOrderTableList/fetch',
      payload: params,
    });

    this.setState({
      formValues: params
    })

  };

  handleSearch = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        originalFormValus: fieldsValue,
      }, () => { })
      // 表单信息和状态
      const values = {
        ...fieldsValue,
        // phase: this.leadsStatus,
        cityCode: this.state.cityCode
      };

      // 取出起始和结束时间
      const { transferRangeTime } = fieldsValue
      if (transferRangeTime !== undefined && transferRangeTime != '') {
        delete values.transferRangeTime
        values.createStartTime = moment(transferRangeTime[0]).format('YYYY-MM-DD');
        values.createEndTime = moment(transferRangeTime[1]).format('YYYY-MM-DD');
      }
      const { signRangeTime } = fieldsValue
      if (signRangeTime !== undefined && transferRangeTime != '') {
        delete values.signRangeTime
        values.signStartTime = moment(signRangeTime[0]).format('YYYY-MM-DD');
        values.signEndTime = moment(signRangeTime[1]).format('YYYY-MM-DD');
      }

      const channelArr = fieldsValue.channel
      if (channelArr !== undefined && transferRangeTime != '') {
        delete values.channel
        if (channelArr.length > 0) {
          values.channel = channelArr[channelArr.length - 1]
        }
      }

      // 取出分页信息
      const { newOrderTableList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        // values.page = pagination.current;
        values.page = 1;
        values.pageSize = pagination.pageSize;
      }

      if (values.category) {
        values.category = values.category[values.category.length - 1];
      }

      if (values.ownerId) {
        values.ownerId = values.ownerId.join();
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'newOrderTableList/fetch',
        payload: values,
      });
    });
  };

  // 刷新本页数据
  handleRefresh = () => {
    const { dispatch } = this.props;
    console.log('this.state.formValues', this.state.formValues)
    dispatch({
      type: 'newOrderTableList/fetch',
      payload: this.state.formValues,
    });
  }

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  newOrderCtrl = () => {
    const { dispatch } = this.props;
    console.log(this.props)
    dispatch({
      type: 'newOrderTableList/newOrder'
    });

  };

  serviceCtrl = record => {
    console.log(record)
  }

  orderDetailCtrl = record => {
    let { id, customer_id } = record;
    if (!record) {
      id = 1;
    }
    this.props.dispatch(routerRedux.push({
      pathname: '/order/orderManagement/orderDetails',
      query: {
        orderId: id,
        customerId: customer_id
      }
    }))
  };



  areaSelectChange = (code: string, province: string, city: string) => {
    this.setState({
      cityCode: code
    });
  };

  renderFilterForm() {
    const {
      form: { getFieldDecorator },
      newOrderTableList: { distributePeopleConifg, permission }
    } = this.props;
    const { configData } = this.state;
    const formItemList: JSX.Element[] = new Array();
    if (CrmUtil.getCompanyType() != 1) {
      formItemList.push(
        <FormItem label="集团id">
          {getFieldDecorator('groupCustomerId', {
            initialValue: this.state.originalFormValus?.groupCustomerId
          })(<Input placeholder="请输入集团id" />)}
        </FormItem>
      );
    }
    formItemList.push(
      <FormItem label="客户电话">
        {getFieldDecorator('customerPhone', {
          rules: [{ required: false, pattern: new RegExp(/^-?[0-9]*(\.[0-9]*)?$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
            return event.target.value.replace(/\D/g, '')
          },
          initialValue: this.state.originalFormValus?.customerPhone
        })(<Input placeholder="请输入手机号" maxLength={11} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户微信">
        {getFieldDecorator('customerWechat', { initialValue: this.state.originalFormValus?.customerWechat })(<Input placeholder="请输入微信号" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户姓名">
        {getFieldDecorator('customerName', { initialValue: this.state.originalFormValus?.customerName })(<Input placeholder="请输入客户姓名" maxLength={5} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="业务城市">
        {getFieldDecorator('city')(
          <AreaSelect areaSelectChange={this.areaSelectChange} reset={this.state.resetArea} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客资来源">
        {getFieldDecorator('channel', { initialValue: this.state.originalFormValus?.channel })(
          <Cascader showSearch style={{ width: '100%', }} options={configData && configData.channel} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="订单类型">
        {getFieldDecorator('category', { initialValue: this.state.originalFormValus?.category })(
          <Cascader showSearch style={{ width: '100%', }} options={configData && configData.category2} changeOnSelect />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="创建时间">
        {getFieldDecorator('transferRangeTime', { initialValue: this.state.originalFormValus?.transferRangeTime })(
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="合同签单时间">
        {getFieldDecorator('signRangeTime', { initialValue: this.state.originalFormValus?.signRangeTime })(
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="跟进结果">
        {getFieldDecorator('followStatus', { initialValue: this.state.originalFormValus?.followStatus })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData && configData.orderFollowStatus.map(followStatus => (
                <Option value={followStatus.id}>{followStatus.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label={CrmUtil.getCompanyType() == 1 ? "呼叫结果" : "跟进标签"}>
        {getFieldDecorator('followTag', { initialValue: this.state.originalFormValus?.orderFollowTag })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData && configData.orderFollowTag.map(tag => (
                <Option value={tag.id}>{tag.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="订单编号">
        {getFieldDecorator('orderNum', { initialValue: this.state.originalFormValus?.orderNum })(<Input placeholder="请输入订单编号" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="有效单编号">
        {getFieldDecorator('reqNum', { initialValue: this.state.originalFormValus?.reqNum })(<Input placeholder="请输入有效单编号" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户编号">
        {getFieldDecorator('customerId', { initialValue: this.state.originalFormValus?.customerId })(<Input placeholder="请输入客户编号" />)}
      </FormItem>
    );

    formItemList.push(
      <FormItem label="订单状态">
        {getFieldDecorator('status', { initialValue: this.state.originalFormValus?.status })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData && configData.orderStatus.map(orderStatus => (
                <Option value={orderStatus.id}>{orderStatus.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="推荐商家">
        {getFieldDecorator('merchant', { initialValue: this.state.originalFormValus?.merchant })(<Input placeholder="请输入商家" />)}
      </FormItem>
    );
    if (CrmUtil.getCompanyType() != 1) {
      formItemList.push(
        <FormItem label="商家回执">
          {getFieldDecorator('receipt', {
            initialValue: this.state.originalFormValus?.receipt
          })(
            <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
              {
                configData && configData.orderReceipt && configData.orderReceipt.map(orderReceipt => (
                  <Option value={orderReceipt.id}>{orderReceipt.name}</Option>))
              }
            </Select>,
          )}
        </FormItem>
      );
    }
    if (permission && permission.owneridfilter) {
      formItemList.push(
        <FormItem label="归属人">
          {getFieldDecorator('ownerId', { initialValue: this.state.originalFormValus?.ownerId })(
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
              placeholder="请选择归属人">
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
      );
    }
    if (CrmUtil.getCompanyType() === 1) {
      formItemList.push(
        <FormItem label="活动名称">
          {getFieldDecorator('activityName', { initialValue: this.state.originalFormValus?.activity })(
            <Input placeholder="请输入活动名称" />
          )}
        </FormItem>
      );
    }
    return formItemList;
  }

  render() {

    const {
      newOrderTableList: { data },
      loading,
    } = this.props;
    return (
      <>
        <Card bordered={false}>
          <div className={styles.tableList}>

            <CrmFilterForm
              expandable={true}
              retainFilterNumber={3}
              formItemList={this.renderFilterForm()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={this.handleSearch}
            />

            <Divider />
            {/* <div className={styles.tableListOperator}> */}
            {/* {CrmUtil.getCompanyType() == 2 &&
                <Radio.Group defaultValue={''} buttonStyle="solid" onChange={this.handleOrderStatus}>
                  {
                    configData.orderPhase.map(item => (
                      <Radio.Button value={item.id}>{item.name}</Radio.Button>
                    ))
                  }
                </Radio.Group >
              } */}
            {/* <div style={{ display: 'flex', float: "right" }}> */}
            {/* <Button style={{ flexGrow: 1, marginRight: '0', borderColor: '#1791FF', color: '#1791FF', visibility: 'hidden' }} onClick={() => this.handleModalVisible}>
                  数据导出
                </Button> */}
            {/* <Button icon="plus" type="primary" onClick={this.newOrderCtrl}>
                  新建订单
              </Button>
              </div>
            </div> */}

            <MyTable
              rowKey="id"
              loading={loading}
              data={data}
              columns={this.columns}
              columnsEditable={true}
              onPaginationChanged={this.handleStandardTableChange}
              renderTopButtons={
                () => (
                  <Button icon="plus" type="primary" onClick={this.newOrderCtrl}>
                    新建订单
                  </Button>
                )
              }
            />

            {/* <StandardTable 
              scroll={{ x: 'max-content' }}
              selectedRows={selectedRows}

              data={data}
              columns={this.state?.showColumns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}

            /> */}
          </div>
        </Card>
      </>
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
