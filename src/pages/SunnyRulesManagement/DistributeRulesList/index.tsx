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
import { RulesListItem } from './data';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CrmUtil from '@/utils/UserInfoStorage';

const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;

const { confirm } = Modal;

const FormItem = Form.Item;
interface SunnyDistributeRulesListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  distributeListModel: StateType;
}
interface SunnyDistributeRulesListState {
  formValues: { [key: string]: string };
  originValues: { [key: string]: string };
}

@connect(
  ({
    distributeListModel,
    loading,
  }: {
    distributeListModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    distributeListModel,
    loading: loading.models.distributeListModel,
  }),
)


class SunnyDistributeRulesList extends Component<SunnyDistributeRulesListProps, SunnyDistributeRulesListState>{

  selectRule: RulesListItem | null = null;

  state: SunnyDistributeRulesListState = {
    formValues: {},
    originValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'distributeListModel/getPublicRulesList',
    });

    // dispatch({
    //   type: 'distributeListModel/getConfig',
    // });

    // dispatch({
    //   type: 'distributeListModel/getRulesCompanyLsit',
    // });

    // dispatch({
    //   type: 'distributeListModel/getUserList',
    //   // payload:{
    //   //   filter: filter,
    //   //   op: op,
    //   // }
    // });
  }

  // 获取列表 表头
  getTableColumns = (): ColumnProps<RulesListItem>[] => [
    {
      title: '规则名称',
      dataIndex: 'name',

    },
    {
      title: '渠道',
      dataIndex: 'channel_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'btns',
      key: 'action',
      render: (text, record) => (
        <div>
          {
            record.status == '1' ? <a onClick={() => this.handleSwitchStatus(record)}>暂停</a> : <a onClick={() => this.handleSwitchStatus(record)}>开启</a>
          }
          <Divider type="vertical" />
          <a onClick={() => this.toRulesDetail(record)}>详情</a>
        </div>
      ),
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

  handleEdit = (record: RulesListItem) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/sunnydistributelist/editdistributerules',
      state: {
        isAdd0orEdit1: 1,
        rulesId: record.id
      }
    }))
  }

  handleSwitchStatus = (record: RulesListItem) => {
    const { dispatch } = this.props
    dispatch({
      type: 'distributeListModel/openThePausePublicRules',
      payload: {
        rulesId: record.id,
        status: record.status == '1' ? 0 : 1
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success(record.status == '1' ? "暂停成功" : "开启成功")
          this.handleSearch(null)
        }
      }
    });
  }

  handleDelete = (record: RulesListItem) => {
    this.selectRule = record
    let that = this
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '删除规则后，不可恢复且对应的配置规则立即停止执行',
      onOk() {
        that.onDeleteSure()
      },
      onCancel() { },
      okText: '确定删除',
      cancelText: '暂不删除'
    });
  }


  renderForm() {
    const {
      form,
      distributeListModel: { configData, userList, companyList },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="创建时间">
                {getFieldDecorator('create_range_time', {
                  initialValue: this.state.originValues?.create_range_time
                })(
                  <RangePicker style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="规则名称">
                {getFieldDecorator('name', { initialValue: this.state.originValues?.name })(<Input placeholder="请输入规则名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="状态">
                {getFieldDecorator('status', {
                  initialValue: this.state.originValues?.channelName
                })(
                  <Select placeholder="请选择规则状态">
                    <Option key={1} value={1}>有效</Option>
                    <Option key={0} value={0}>失效</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8} offset={16}>
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
      const { create_range_time } = fieldsValue
      if (create_range_time !== undefined && create_range_time != '') {
        delete values.create_range_time
        values.startTime = moment(create_range_time[0]).format('YYYY-MM-DD');
        values.endTime = moment(create_range_time[1]).format('YYYY-MM-DD');
      }


      // 取出分页信息
      const { pagination } = this.props.distributeListModel.data;
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
        type: 'distributeListModel/getPublicRulesList',
        payload: values,
      });
    });
  };

  //新建数据分配规则
  handleNewRule = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/distributeruleslist/newdistributerules',
    }))
  }

  // 分页
  handleChangePage = (page: any) => {
    const { dispatch } = this.props;
    const valuesResult = {
      ...this.state.formValues,
      page: page.current,
      pageSize: 10,
    }
    dispatch({
      type: 'distributeListModel/getPublicRulesList',
      payload: valuesResult,
    });
  }

  //跳转到规则详情
  toRulesDetail = (obj: any) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/sunnyrules/distributeruleslist/distributeruledetail',
      query: {
        rulesId: obj.id
      }
    }));
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    let params = {
      status: this.status,
    };
    this.setState({
      formValues: params,
      originValues: {},
    });
    dispatch({
      type: 'distributeListModel/getPublicRulesList',
      payload: params,
    });
  };


  onDeleteSure = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'distributeListModel/deleteRule',
      payload: {
        rulesId: this.selectRule?.id
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          this.selectRule = null
          message.info(msg)
          Modal.destroyAll();
          this.handleSearch(null)
        }
      }
    });
  }

  render() {
    const {
      distributeListModel: { data: { pagination, list }, configData },
      loading
    } = this.props;
    const columns = this.getTableColumns();
    return (
      <div className={styles.tableListForm}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <div style={{ flexGrow: 1 }} />
              <Button type="primary" onClick={this.handleNewRule}><PlusOutlined />创建规则</Button>
            </div>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={list}
              columns={columns}
              onChange={this.handleChangePage}
              pagination={{
                ...pagination,
                showTotal: (total: number, range: [number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
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


class SunnyDistributeRulesListWrapper extends Component<SunnyDistributeRulesListProps, SunnyDistributeRulesListState> {

  render() {
    return (
      <PageHeaderWrapper title="数据分配规则列表">
        <KeepAlive>
          <SunnyDistributeRulesList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}
export default Form.create<SunnyDistributeRulesListProps>()(SunnyDistributeRulesListWrapper);
