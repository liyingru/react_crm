import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
  Radio,
  Cascader,
  Spin,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { CustomerComplaintDetail, TableListPagination, CustomerComplaintListParams } from '../data';
import styles from './style.less';
import { RadioChangeEvent } from 'antd/lib/radio';
import LOCAL from '@/utils/LocalStorageKeys';
import DealWithCustomerComplaint from './components/DealWithCustomerComplaint';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface CustomerComplaintListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customerComplaintListModel/fetchList'
      | 'customerComplaintListModel/toDetail'
      | 'customerComplaintListModel/getConfigInfo'
    >
  >;
  loading: boolean;
  customerComplaintListModel: StateType;
}

interface CustomerComplaintListState {
  currentDealWithRecord: CustomerComplaintDetail | undefined;
  filterFormValues: { [key: string]: string };
  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    customerComplaintListModel,
    loading,
  }: {
    customerComplaintListModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerComplaintListModel,
    loading: loading.models.customerComplaintListModel,
  }),
)

class CustomerComplaintList extends Component<CustomerComplaintListProps, CustomerComplaintListState> {
  status: any;
  currentUserInfo: any;

  constructor(props: CustomerComplaintListProps) {
    super(props);
    this.currentUserInfo = CrmUtil.getUserInfo();
  }

  state: CustomerComplaintListState = {
    currentDealWithRecord: undefined,
    filterFormValues: {},
    originalFormValus: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 请求列表数据
    dispatch({
      type: 'customerComplaintListModel/fetchList',
    });
    // 请求配置项
    dispatch({
      type: 'customerComplaintListModel/getConfigInfo',
    });
  }

  handleStandardTableChange = (pagination: Partial<TableListPagination>) => {
    //状态 //分页信息
    const params: CustomerComplaintListParams = {
      ...this.state.filterFormValues,
      headerType: this.status,
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'customerComplaintListModel/fetchList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    //表单重置
    form.resetFields();
    this.setState({
      filterFormValues: {},
      originalFormValus: undefined,
    });

    //状态
    let params: any = {
      headerType: this.status,
    };

    //取出分页信息
    const { customerComplaintListModel: { data } } = this.props;
    const { pagination } = data;
    if (pagination) {
      params = {
        ...params,
        page: 1,
        pageSize: pagination.pageSize,
      }
    }

    dispatch({
      type: 'customerComplaintListModel/fetchList',
      payload: params,
    });
  };

  handleChangeStatus = (e: RadioChangeEvent) => {
    this.status = e.target.value;
    const { dispatch } = this.props;
    //表单信息和状态
    const values = {
      ...this.state.filterFormValues,
      headerType: this.status,
    };

    //取出分页信息
    const { customerComplaintListModel: { data } } = this.props;
    const { pagination } = data;
    if (pagination !== undefined) {
      values['page'] = 1;
      values['pageSize'] = pagination.pageSize;
    }

    dispatch({
      type: 'customerComplaintListModel/fetchList',
      payload: values,
    });
  };

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
        ...fieldsValue
      };

      //取出起始和结束时间
      const action_range_time = fieldsValue['action_range_time']
      if (action_range_time !== undefined && action_range_time != '') {
        delete values['action_range_time']
        values['actionTime'] = moment(action_range_time[0]).format('YYYY-MM-DD');
        values['endTime'] = moment(action_range_time[1]).format('YYYY-MM-DD');
      }

      const channelArr = fieldsValue['channel']
      if (channelArr !== undefined) {
        delete values['channel']
        if (channelArr.length > 0) {
          values['channel'] = channelArr[channelArr.length - 1]
        }
      }

      this.setState({
        filterFormValues: values,
      });

      //取出分页信息
      const { customerComplaintListModel: { data: { pagination } } } = this.props;
      dispatch({
        type: 'customerComplaintListModel/fetchList',
        payload: {
          ...values,
          headerType: this.status,
          page: pagination.current,
          pageSize: pagination.pageSize
        }
      });
    });
  };

  handleComplaintDetail = (complaintInfo: CustomerComplaintDetail) => {
    if (complaintInfo.id == null) {
      message.error('客诉单id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'customerComplaintListModel/toDetail',
      payload: {
        id: complaintInfo.id,
        customerId: complaintInfo.customer_id
      },
    })
  }

  columns: StandardTableColumnProps[] = [
    {
      title: '客诉单编号',
      dataIndex: 'ks_num',
      width: 150,
      fixed: 'left',
      render: (text: string, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleComplaintDetail(record)}>{text}</a>
          </Fragment>
        )
      }
    },
    {
      title: '客户姓名',
      dataIndex: 'customer_name',
      width: 150,
    },
    {
      title: '客诉单类型',
      dataIndex: 'type',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
    },

    {
      title: '客户评级',
      dataIndex: 'customer_level',
      width: 90,
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      width: 100,
    },
    {
      title: '责任人',
      dataIndex: 'owner_name',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 250,
    },
    {
      title: '最新处理时间',
      dataIndex: 'update_time',
      width: 250,
    },
    {
      title: '最新处理内容',
      dataIndex: 'new_content',
      // width: 300,
      ellipsis: true,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleComplaintDetail(record)}>处理</a>
          </Fragment>
        )
      }
    },
  ];

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { customerComplaintListModel: { config } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="客资来源">
              {getFieldDecorator('channel', { initialValue: this.state.originalFormValus?.channel })(
                <Cascader showSearch style={{ width: '100%', }} options={config?.channel} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="创建时间">
              {getFieldDecorator('action_range_time', { initialValue: this.state.originalFormValus?.action_range_time })(
                <RangePicker style={{ width: '100%' }} />
              )}

            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="客诉单类型">
              {getFieldDecorator('type', { initialValue: this.state.originalFormValus?.type })(
                <Select style={{ width: '100%', }} placeholder="请选择客诉单类型" >
                  {
                    config?.complaintType.map(item => (
                      <Option value={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="客户编号">
              {getFieldDecorator('customerId', { initialValue: this.state.originalFormValus?.customerId })(<Input placeholder="请输入客户id编号搜索" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="客户姓名">
              {getFieldDecorator('customerName', { initialValue: this.state.originalFormValus?.customerName })(<Input placeholder="请输入客户姓名搜索" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="客户手机号">
              {getFieldDecorator('phone', {
                initialValue: this.state.originalFormValus?.phone,
                rules: [{ required: false, pattern: new RegExp(/^[0-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                  return event.target.value.replace(/\D/g, '')
                },
              })(<Input placeholder="请输入客户手机号搜索" maxLength={11} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="客户微信号">
              {getFieldDecorator('wechat', { initialValue: this.state.originalFormValus?.wechat })(<Input placeholder="请输入客户微信号搜索" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="负责人">
              {getFieldDecorator('ownerName', { initialValue: this.state.originalFormValus?.ownerName })(<Input placeholder="请输入负责人姓名" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8} >
            <div style={{ display: 'flex' }}>
              <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
              <Button id="fsubmit" type="primary" htmlType="submit" style={{ marginLeft: '20px', flexGrow: 1 }}>筛选</Button>
            </div>
          </Col>
        </Row>



      </Form>
    );
  }

  render() {
    const {
      customerComplaintListModel: { header, data },
      loading,
    } = this.props;

    return (

      <Spin spinning={loading} size="large">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>

            <Divider></Divider>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: '16px' }}>
              <Col span={16}>
                <Radio.Group defaultValue={header && header.length > 0 ? header[0].num : 0} buttonStyle="solid" onChange={this.handleChangeStatus}>
                  {
                    header && header.map(value => (<Radio.Button value={value.num}>{value.name}</Radio.Button>))
                  }
                </Radio.Group >
              </Col>
            </Row>

            <StandardTable
              scroll={{ x: 'max-content' }}
              // loading={loading}
              data={data}
              columns={this.columns}
              // onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Spin>

    );
  }
}

class TableList1 extends Component<CustomerComplaintListProps, CustomerComplaintListState> {

  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <CustomerComplaintList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}
export default Form.create<CustomerComplaintListProps>()(TableList1);

// export default Form.create<CustomerComplaintListProps>()(CustomerComplaintList);
