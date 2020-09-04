import {
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { StateType } from './model';
import { TableListItem, ConfigListItem } from './data';
import styles from './style.less';
import LOCAL from '@/utils/LocalStorageKeys';
import { KeepAlive } from 'umi';
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<any>>;
  loading: boolean;
  moneyMangement: StateType;
}

interface TableListState {
  formValues: { [key: string]: string } | undefined;
  cityCode: string
  configData?: ConfigState;
  commonConfigData?: ConfigState;
  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
}
interface ConfigState {
  orderPhase: ConfigListItem[];
  receivablesStatusList: ConfigListItem[],
  avatarGrant:ConfigListItem[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    moneyMangement,
    loading,
  }: {
    moneyMangement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    moneyMangement,
    loading: loading.models.moneyMangement,
  }),
)
class TableList extends Component<TableListProps, TableListState, ConfigState> {
  leadsStatus = undefined;

  columns: CrmStandardTableColumnProps<TableListItem>[] = [
    {
      title: '订单编号',
      dataIndex: 'order_num',
      disableSelect: true,
      width: 220,
      key: 'order_num',
      fixed: 'left'
    },
    {
      title: '客户姓名',
      disableSelect: true,
      dataIndex: 'customer_name',
      key: 'customer_name',
      width: 150,
    },
    {
      title: '新郎姓名',
      dataIndex: 'groom',
      key: 'groom',
      width: 100,
    },
    {
      title: '新郎电话',
      dataIndex: 'groom_mobile',
      key: 'groom_mobile',
      width: 150,
    },
    {
      title: '新娘姓名',
      dataIndex: 'bride',
      key: 'bride',
      width: 100,
    },
    {
      title: '新娘电话',
      dataIndex: 'bride_mobile',
      key: 'bride_mobile',
      width: 150,
    },
    {
      title: '婚期',
      dataIndex: 'wedding_date',
      key: 'wedding_date',
      width: 180,
    },
    {
      title: '档期',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 180,
    },
    {
      title: '酒店名称',
      dataIndex: 'hotel',
      key: 'hotel',
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 150,
      key: 'create_time',
    },
    {
      title: '合同编号',
      dataIndex: 'contract_num',
      key: 'contract_num',
      width: 180,
    },
    {
      title: '签单时间',
      dataIndex: 'sign_time',
      key: 'sign_time',
      width: 180,
    },
    {
      title: '签单人',
      dataIndex: 'sign_user',
      key: 'sign_user',
      width: 180,
    },
    {
      title: '肖像授权',
      dataIndex: 'avatar_grant',
      key: 'avatar_grant',
      width: 180,
    },
    {
      title: '策划师1',
      dataIndex: 'planner1_name',
      key: 'planner1_name',
      width: 100,
    },
    {
      title: '策划师2',
      dataIndex: 'planner2_name',
      key: 'planner2_name',
      width: 100,
    },
    {
      title: '策划师3',
      dataIndex: 'planner3_name',
      key: 'planner3_name',
      width: 100,
    },
    {
      title: '策划师1占比',
      dataIndex: 'planner1_ratio',
      key: 'planner1_ratio',
      width: 100,
    },
    {
      title: '策划师2占比',
      dataIndex: 'planner2_ratio',
      key: 'planner2_ratio',
      width: 100,
    },
    {
      title: '策划师3占比',
      dataIndex: 'planner3_ratio',
      key: 'planner3_ratio',
      width: 100,
    },
    {
      title: '策划师1合同占比额',
      dataIndex: 'planner1_ratio_amount',
      key: 'planner1_ratio_amount',
      width: 100,
    },
    {
      title: '策划师2合同占比额',
      dataIndex: 'planner2_ratio_amount',
      key: 'planner2_ratio_amount',
      width: 100,
    },
    {
      title: '策划师3合同占比额',
      dataIndex: 'planner3_ratio_amount',
      key: 'planner3_ratio_amount',
      width: 100,
    },
    {
      title: '档期定金',
      dataIndex: 'schedule_earnest_money',
      key: 'schedule_earnest_money',
      width: 160,
    },
    {
      title: '回款金额1',
      dataIndex: 'receivable1_money',
      key: 'receivable1_money',
      width: 160,
    },
    {
      title: '回款金额2',
      dataIndex: 'receivable2_money',
      key: 'receivable2_money',
      width: 160,
    },
    {
      title: '回款金额3',
      dataIndex: 'receivable3_money',
      key: 'receivable3_money',
      width: 160,
    },
    {
      title: '回款金额4',
      dataIndex: 'receivable4_money',
      key: 'receivable4_money',
      width: 160,
    },
    {
      title: '回款金额5',
      dataIndex: 'receivable5_money',
      key: 'receivable5_money',
      width: 160,
    },
    {
      title: '订单金额',
      dataIndex: 'order_amount',
      key: 'order_amount',
      width: 120,
    },
    {
      title: '合同金额',
      dataIndex: 'contract_amount',
      key: 'contract_amount',
      width: 120,
    },
    {
      title: '实收金额',
      dataIndex: 'receivable_total_money',
      key: 'receivable_total_money',
      width: 120,
    },
    {
      title: '未收金额',
      dataIndex: 'no_receivable_total_money',
      key: 'no_receivable_total_money',
      width: 120,
    },
    {
      title: '回款状态',
      dataIndex: 'receivables_status',
      key: 'receivables_status',
      width: 100,
    },
    {
      title: '合同状态',
      dataIndex: 'contract_status',
      key: 'contract_status',
      width: 100,
    },
    {
      title: '操作',
      key: 'edit',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleDetaill(text, record)}>详情</a>
        </Fragment>
      )
    },
  ];

  state: TableListState = {
    formValues: {},
    cityCode: '',
    configData: {
      orderPhase: [],
      avatarGrant:[]
    },
    commonConfigData:{
      receivablesStatusList: [],
    }
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
    
      Axios.post(URL.moneyonfig)
      .then(
        res => {
          if (res.code == 200) {
            this.setState({
              commonConfigData: res.data.result
            })
          }
        }
      );
    // 拉取表单信息
    dispatch({
      type: 'moneyMangement/fetch',
    });
  }

  // componentWillReceiveProps(nextProps: any) {
  //   const needResetList = localStorage.getItem(LOCAL.LIST_RESET_REFRESH)?.toString();
  //   if(needResetList == 'orderList') {
  //     this.handleFormReset();
  //     localStorage.removeItem(LOCAL.LIST_RESET_REFRESH);
  //   } else {
  //     // 刷新页面数据
  //     const isRefreshList = localStorage ? localStorage.getItem('orderListentryFollowIsRefresh')?.toString() : '';
  //     if (isRefreshList?.length > 0) {
  //       localStorage?.setItem('orderListentryFollowIsRefresh', '')
  //       this?.handleRefresh()
  //     }
  //   }

  // }

  handleDetaill = (text: any, record: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moneyMangement/moneyDetails',
      payload: {
        id: record.order_id,
      },
    })
  }

  // new 分页组件
  handleStandardTableChange = (
    page: number, pageSize: number
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      cityCode: this.state.cityCode
    };

    // 分页信息
    params.page = page;
    params.pageSize = pageSize;

    dispatch({
      type: 'moneyMangement/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    // 状态
    const values = {};
    // 取出分页信息
    const { moneyMangement: { data } } = this.props;
    const { pagination } = data;
    if (pagination !== undefined) {
      values.page = 1;
      values.pageSize = pagination.pageSize;
    }
    this.setState({
      formValues: undefined,
      originalFormValus: undefined,
    });

    dispatch({
      type: 'moneyMangement/fetch',
      payload: values,
    });
  };

  // 筛选
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
      };

      // 签单时间
      const { signRangeTime } = fieldsValue
      if (signRangeTime !== undefined && signRangeTime != '') {
        delete values.signRangeTime
        values.startSignTime = moment(signRangeTime[0]).format('YYYY-MM-DD');
        values.endSignTime = moment(signRangeTime[1]).format('YYYY-MM-DD');
      }
      // 婚期 ----- 取出起始和结束时间
      const { transferRangeTime } = fieldsValue
      if (transferRangeTime !== undefined && transferRangeTime != '') {
        delete values.transferRangeTime
        values.startWeddingDate = moment(transferRangeTime[0]).format('YYYY-MM-DD');
        values.endWeddingDate = moment(transferRangeTime[1]).format('YYYY-MM-DD');
      }

      // 取出分页信息
      const { moneyMangement: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        values.page = 1;
        values.pageSize = pagination.pageSize;
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'moneyMangement/fetch',
        payload: values,
      });
    });
  };

  // 刷新本页数据
  handleRefresh = () => {
    const { dispatch } = this.props;
    console.log('this.state.formValues', this.state.formValues)
    dispatch({
      type: 'moneyMangement/fetch',
      payload: this.state.formValues,
    });
  }

  renderFilterForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { configData ,commonConfigData} = this.state;
    const formItemList: JSX.Element[] = new Array();
    formItemList.push(
      <FormItem label="签单时间">
        {getFieldDecorator('signRangeTime', { initialValue: this.state.originalFormValus?.signRangeTime })(
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="回款状态">
        {getFieldDecorator('receivablesStatus')(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              commonConfigData && commonConfigData.receivablesStatusList.map(receivablesStatusList => (
                <Option value={receivablesStatusList.id}>{receivablesStatusList.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="肖像授权">
        {getFieldDecorator('avatarGrant')(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData && configData.avatarGrant.map(avatarGrant => (
                <Option value={avatarGrant.id}>{avatarGrant.name}</Option>))
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
      <FormItem label="合同编号">
        {getFieldDecorator('contractNum')(<Input placeholder="请输入合同编号" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户姓名">
        {getFieldDecorator('customerName', { initialValue: this.state.originalFormValus?.customerName })(<Input placeholder="请输入客户姓名" maxLength={5} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户编号">
        {getFieldDecorator('customerId', { initialValue: this.state.originalFormValus?.customerId })(<Input placeholder="请输入客户编号" />)}
      </FormItem>
    );
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
      <FormItem label="婚期">
        {getFieldDecorator('transferRangeTime', { initialValue: this.state.originalFormValus?.transferRangeTime })(
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="负责销售">
        {getFieldDecorator('sale', { initialValue: this.state.originalFormValus?.sale })(<Input placeholder="请输入负责销售" />)}
      </FormItem>
    );
    return formItemList;
  }

  render() {

    const {
      moneyMangement: { data },
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
            <MyTable
              rowKey="id"
              loading={loading}
              data={data}
              columns={this.columns}
              columnsEditable={true}
              onPaginationChanged={this.handleStandardTableChange}
              />
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
        {/* <KeepAlive> */}
          <TableList {...this.props} />
        {/* </KeepAlive> */}
      </PageHeaderWrapper>
    )
  }
}
class MyTable extends CrmStandardTable<TableListItem>{ }
export default Form.create<TableListProps>()(TableList1);
