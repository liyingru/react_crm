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
interface SunnyRulesListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  sunnyRulesListModel: StateType;
}
interface SunnyRulesListState {
  formValues: { [key: string]: string };
  originValues: { [key: string]: string };
}

@connect(
  ({
    sunnyRulesListModel,
    loading,
  }: {
    sunnyRulesListModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sunnyRulesListModel,
    loading: loading.models.sunnyRulesListModel,
  }),
)

class SunnyRulesList extends Component<SunnyRulesListProps, SunnyRulesListState>{
  status: string = '';

  selectRule: RulesListItem | null = null;

  state: SunnyRulesListState = {
    formValues: {},
    originValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // const filter = { company_id: CrmUtil.getUserInfo()?.company_id };
    // const op = { company_id: '=' };

    dispatch({
      type: 'sunnyRulesListModel/getList',
    });

    dispatch({
      type: 'sunnyRulesListModel/getConfig',
    });

    dispatch({
      type: 'sunnyRulesListModel/getRulesCompanyLsit',
    });

    dispatch({
      type: 'sunnyRulesListModel/getUserList',
      // payload:{
      //   filter: filter,
      //   op: op,
      // }
    });
  }

  // 获取列表 表头
  getTableColumns = (): ColumnProps<RulesListItem>[] => [
    {
      title: '规则名称',
      dataIndex: 'name',
      fixed: 'left',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.toRulesDetail(record)}>{text}</a>
        </Fragment>
      )
    },
    {
      title: '客资来源',
      dataIndex: 'kjChannelName',
    },
    {
      title: '规则描述',
      dataIndex: 'activity_name',
    },
    {
      title: '录入人',
      dataIndex: 'recoder',
      render: (text, recoder) => {
        return <div>
          <div>{recoder.kj}</div>
          <div>{recoder.bkj}</div>
        </div>
      }
    },
    {
      title: '跳过确认',
      dataIndex: 'is_skip',
      render: (text) => text == '1' ? '跳过' : '不跳过'
    },
    {
      title: '需求指定邀约',
      dataIndex: 'is_invite',
      render: (text) => text == '1' ? '指定' : '不指定'
    },
    {
      title: '客户级别分配',
      dataIndex: 'is_customer_grade',
      render: (text) => text == '1' ? '设置' : '不设置'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => text == '1' ? '有效' : '无效'
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'btns',
      key: 'action',
      render: (text, record) => (
        <div>
          <a onClick={() => this.handleEdit(record)}>编辑</a>
          <Divider type="vertical" />
          {
            record.status == '1' ? <a onClick={() => this.handleUpdate(record)}>关闭</a> : <a onClick={() => this.handleUpdate(record)}>开启</a>
          }
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record)}>删除</a>
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
      pathname: '/sunnyrules/sunnyruleslist/editrules',
      state: {
        isAdd0orEdit1: 1,
        rulesId: record.id
      }
    }))
  }

  handleUpdate = (record: RulesListItem) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sunnyRulesListModel/updateRule',
      payload: {
        rulesId: record.id,
        status: record.status == '1' ? 0 : 1
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.info(msg)
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
      sunnyRulesListModel: { configData, userList, companyList },
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
              <FormItem label="客资来源">
                {getFieldDecorator('channelName', {
                  initialValue: this.state.originValues?.channelName
                })(
                  <Cascader showSearch style={{ width: '100%', }} options={configData.channel} placeholder="请选择客资来源" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="跳过确认">
                {getFieldDecorator('isSkip', { initialValue: this.state.originValues?.isSkip })(
                  <Select placeholder="是否跳过需求确认" style={{ width: '100%' }}>
                    <Option value='1'>跳过</Option>
                    <Option value='0'>不跳过</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="需求指定邀约">
                {getFieldDecorator('isInvite', { initialValue: this.state.originValues?.isInvite })(
                  <Select placeholder="需求是否指定邀约" style={{ width: '100%' }}>
                    <Option value='1'>指定</Option>
                    <Option value='0'>不指定</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="创建人">
                {getFieldDecorator('createUserId', { initialValue: this.state.originValues?.createUserId })(
                  <Select
                    placeholder="请选择规则创建人"
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children">
                    {
                      userList && userList.map(item => (
                        <Option value={item.user_id}>{item.name}</Option>
                      ))
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="规则生效公司">
                {getFieldDecorator('companyId', { initialValue: this.state.originValues?.companyId })(
                  <Select
                    placeholder="请指定规则生效公司"
                    style={{ width: '100%' }}>
                    {
                      companyList && companyList.map(company => (
                        <Option value={company.company_id}>{company.company_name}</Option>
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
        status: this.status,
      };

      // 取出起始和结束时间
      const { create_range_time } = fieldsValue
      if (create_range_time !== undefined && create_range_time != '') {
        delete values.create_range_time
        values.startTime = moment(create_range_time[0]).format('YYYY-MM-DD');
        values.endTime = moment(create_range_time[1]).format('YYYY-MM-DD');
      }

      const channelArr = fieldsValue.channelName
      if (channelArr !== undefined && channelArr.length > 0) {
        delete values.channelName
        if (channelArr.length > 0) {
          values.channelName = channelArr[channelArr.length - 1]
        }
      }

      // 取出分页信息
      const { pagination } = this.props.sunnyRulesListModel.data;
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
        type: 'sunnyRulesListModel/getList',
        payload: values,
      });
    });
  };

  //tab变化
  handleLeadsStatus = (e: any) => {
    this.status = e.target.value;
    const { dispatch, form, } = this.props;
    const { formValues } = this.state;
    // 表单信息和状态
    const values = {
      ...formValues,
      status: this.status,
    };
    // 取出分页信息
    const { pagination } = this.props.sunnyRulesListModel.data;
    if (pagination !== undefined) {
      values.page = 1;
      values.pageSize = pagination.pageSize;
    }
    this.setState({
      formValues: values,
    });

    dispatch({
      type: 'sunnyRulesListModel/getList',
      payload: values,
    });
  };

  //新建规则
  handleNewRule = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/newrules',
    }))
  }

  // 分页
  handleChangePage = (page: any) => {
    const { form, dispatch } = this.props;
    const valuesResult = {
      ...this.state.formValues,
      page: page.current,
      pageSize: 10,
    }
    dispatch({
      type: 'sunnyRulesListModel/getList',
      payload: valuesResult,
    });
  }

  //跳转详情
  toRulesDetail = (obj: any) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/sunnyrules/sunnyruleslist/ruledetail',
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
      type: 'sunnyRulesListModel/getList',
      payload: params,
    });
  };


  onDeleteSure = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'sunnyRulesListModel/deleteRule',
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
      sunnyRulesListModel: { data: { pagination, list }, configData },
      loading
    } = this.props;
    const columns = this.getTableColumns();
    return (
      <div className={styles.tableListForm}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Radio.Group
                style={{ flexGrow: 1 }}
                defaultValue=""
                buttonStyle="solid"
                onChange={this.handleLeadsStatus}
              >
                <Radio.Button value="">全部</Radio.Button>
                <Radio.Button value="1">有效</Radio.Button>
                <Radio.Button value="0">无效</Radio.Button>
              </Radio.Group>
              {/* <Button type="primary" onClick={this.handleNewRule}>刷新规则</Button> */}
              <Button type="primary" onClick={this.handleNewRule}><PlusOutlined />新建规则</Button>
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


class SunnyRulesListWrapper extends Component<SunnyRulesListProps, SunnyRulesListState> {

  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <SunnyRulesList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}
export default Form.create<SunnyRulesListProps>()(SunnyRulesListWrapper);
