// by xiaosong 2020.1.6
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Radio,
  Modal,
  message,
  InputGroup,
  Divider,
  Table,
  Cascader
} from 'antd';
import { KeepAlive } from 'umi';

import { ColumnProps } from 'antd/es/table'; // 引用table中的行参数

import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';

import { connect } from 'dva';
import { StateType } from './model';
import styles from './index.less';
import { RulesListItem, DistributeLisItem } from './data';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CrmUtil from '@/utils/UserInfoStorage';

const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;

const { confirm } = Modal;

const FormItem = Form.Item;
interface SunnyRulesListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  sunnyDistributeListModel: StateType;
}
interface SunnyRulesListState {
  formValues: { [key: string]: string };
  originValues: { [key: string]: string };
}

@connect(
  ({
    sunnyDistributeListModel,
    loading,
  }: {
    sunnyDistributeListModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sunnyDistributeListModel,
    loading: loading.models.sunnyDistributeListModel,
  }),
)


class SunnyRulesList extends Component<SunnyRulesListProps, SunnyRulesListState>{

  selectRule: RulesListItem | null = null;

  state: SunnyRulesListState = {
    formValues: {},
    originValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sunnyDistributeListModel/getBalanceList',
    });
    dispatch({
      type: 'sunnyDistributeListModel/getConfig',
    });
  }

  // 获取列表 表头
  getTableColumns = (): ColumnProps<DistributeLisItem>[] => [
    {
      title: '客户id',
      dataIndex: 'customer_id',
      fixed: 'left',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.toCustomerDetail(record.customer_id.toString())}>{text}</a>
        </Fragment>
      )

    },
    {
      title: '渠道',
      dataIndex: 'channel_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'category_txt',
    },
    {
      title: '接收公司',
      dataIndex: 'company_name',
    },
    {
      title: '入库时间',
      dataIndex: 'create_time',
    },
  ];

  componentWillReceiveProps(nextProps: any) {
    var isRefresh = localStorage ? localStorage.getItem('rulesListRefreshTag')?.toString() : '';
    if (isRefresh && isRefresh?.length > 0) {
      localStorage?.setItem('rulesListRefreshTag', '')
      if (isRefresh == 'reset') {
        this.handleFormReset()
      } else if (isRefresh == 'list') {
        this.handleSearch(null)
      }
    }
  }

  renderForm() {
    const {
      form,
      sunnyDistributeListModel: { configData, userList, companyList },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="入库时间">
                {getFieldDecorator('allot_range_time', {
                  initialValue: this.state.originValues?.create_range_time
                })(
                  <RangePicker style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="业务品类">
                {getFieldDecorator('category', { initialValue: this.state.originValues?.name })(
                  <Select placeholder="请选择业务品类">
                    {
                      configData && configData.category2.map(cat=>(
                        <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            {
              configData && (
              <Col span={8}>
                <FormItem label="渠道">
                  {getFieldDecorator('channel', {
                    initialValue: this.state.originValues?.channelName
                  })(
                    <Cascader showSearch style={{ width: '100%', }} options={configData.channel} placeholder="请选择客资来源" />
                  )}
                </FormItem>
              </Col>
              )
            }
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
                <FormItem label="接收公司">
                  {getFieldDecorator('companyId', { initialValue: this.state.originValues?.companyId })(
                    <Select
                      placeholder="请指定规则生效公司"
                      style={{ width: '100%' }}>
                      {
                        configData && configData.nbCompany.map(company => (
                          <Option key={company.id} value={company.id}>{company.name}</Option>
                        ))
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8} offset={8}>
                <div style={{ display: 'flex' }}>
                  <Button style={{ flexGrow: 1, marginLeft: 90, borderColor: '#1791FF', color: '#1791FF' }} onClick={e => { this.handleFormReset() }}>
                    重置
                </Button>
                  <Button type="primary" style={{ flexGrow: 1, marginLeft: 20 }} onClick={e => { this.handleSearch(e) }}>
                    筛选
                </Button>
                </div>
              </Col>
            </Row>
          <Divider />
        </Form>
      </div>
    )
  }

  //*********************************************************************************************** */
  // 提交搜索
  handleSearch = (e: React.FormEvent | null) => {
    e?.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        originValues: fieldsValue,
      })

      // 表单信息和状态
      const values = {
        ...fieldsValue,
      };

      // 取出起始和结束时间
      const { allot_range_time } = fieldsValue
      if (allot_range_time !== undefined && allot_range_time != '') {
        delete values.allot_range_time
        values.allotStartTime = moment(allot_range_time[0]).format('YYYY-MM-DD');
        values.allotEndTime = moment(allot_range_time[1]).format('YYYY-MM-DD');
      }

      // 取出分页信息
      const { pagination } = this.props.sunnyDistributeListModel.data;
      if (pagination !== undefined) {
        if (e == null) {
          values.page = pagination.current;
          values.pageSize = pagination.pageSize;
        } else {
          values.pageSize = pagination.pageSize;
          values.page = 1;
        }
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sunnyDistributeListModel/getBalanceList',
        payload: values,
      });
    });
  };

  

  // 分页
  handleChangePage = (page: any) => {
    const { form, dispatch } = this.props;
    const valuesResult = {
      ...this.state.formValues,
      page: page.current,
      pageSize: 10,
    }
    dispatch({
      type: 'sunnyDistributeListModel/getBalanceList',
      payload: valuesResult,
    });
  }

  //跳转到客户详情
  toCustomerDetail = (customerId: string) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/customer/customerManagement/customerDetail',
      state: {
        customerId,
        showStyle: 0,
        readOrWrite: 0,
      },
    }));
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      originValues: {},
    });
    dispatch({
      type: 'sunnyDistributeListModel/getBalanceList',
    });
  };

  render() {
    const {
      sunnyDistributeListModel: { data: { pagination, list } },
      loading
    } = this.props;
    const columns = this.getTableColumns();
    return (
      <div className={styles.tableListForm}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            
            <Table
              rowKey="id"
              loading={loading}
              dataSource={list}
              columns={columns}
              onChange={this.handleChangePage}
              pagination={{
                ...pagination,
                showTotal:(total:number, range:[number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
                onChange: page => this.handleChangePage
              }}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Card>
      </div>
    )
  }
}


class SunnyRulesListWrapper extends Component<SunnyRulesListProps, SunnyRulesListState> {

  render() {
    return (
      <PageHeaderWrapper title="数据明细">
        <KeepAlive>
          <SunnyRulesList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}
export default Form.create<SunnyRulesListProps>()(SunnyRulesListWrapper);
