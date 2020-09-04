// by xiaosong 2020.1.6
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  message,
  Divider,
} from 'antd';
import { KeepAlive } from 'umi';

import { ColumnProps } from 'antd/es/table';

import { routerRedux } from 'dva/router';
import { Dispatch } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';

import { connect } from 'dva';
import { StateType } from './model';
import styles from './index.less';
import { RulesListItem } from './data';
import { PlusOutlined } from '@ant-design/icons';
import CrmFilterForm from '@/components/CrmFilterForm';
import CrmStandardTable from '@/components/CrmStandardTable';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FormItem = Form.Item;
interface QaRulesListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  qaRulesListModel: StateType;
}
interface QaRulesListState {
  formValues: { [key: string]: string };
  originValues: { [key: string]: string };
}

@connect(
  ({
    qaRulesListModel,
    loading,
  }: {
    qaRulesListModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    qaRulesListModel,
    loading: loading.models.qaRulesListModel,
  }),
)

class QaRulesList extends Component<QaRulesListProps, QaRulesListState>{
  status: string = '';

  selectRule: RulesListItem | null = null;

  state: QaRulesListState = {
    formValues: {},
    originValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'qaRulesListModel/getList',
    });

    dispatch({
      type: 'qaRulesListModel/getConfig',
    });
  }

  // 获取列表 表头
  getTableColumns = (): ColumnProps<RulesListItem>[] => [
    {
      title: '规则名称',
      dataIndex: 'rules_name',
      fixed: 'left',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditRule(record.rules_id)}>{text}</a>
        </Fragment>
      )
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      width: 220,
    },
    {
      title: '业务品类',
      dataIndex: 'category',
      width: 200,
    },
    {
      title: '执行状态',
      dataIndex: 'status_text'
    },
    {
      title: '规则描述',
      dataIndex: 'desc',
    },
    {
      title: '创建人',
      dataIndex: 'create_user',
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
            record.status == 1 ? <a onClick={() => this.handleUpdateStatus(record, 2)}>暂停</a> : <a onClick={() => this.handleUpdateStatus(record, 1)}>开启</a>
          }
          <Divider type="vertical" />
          <a onClick={() => this.handleEditRule(record.rules_id)}>详情</a>
        </div>
      ),
    },
  ];

  componentWillReceiveProps(nextProps: any) {
    var isRefresh = localStorage ? localStorage.getItem('rulesListRefreshTag')?.toString() : '';
    if (isRefresh && isRefresh?.length > 0) {
      if (isRefresh == 'reset') {
        this.handleFormReset()
      } else if (isRefresh == 'list') {
        this.handleSearch()
      }
      localStorage?.setItem('rulesListRefreshTag', '')
    }
  }

  handleEdit = (record: RulesListItem) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/sunnyruleslist/editrules',
      state: {
        isAdd0orEdit1: 1,
        rulesId: record.rules_id
      }
    }))
  }

  handleUpdateStatus = (record: RulesListItem, newStatus: number) => {
    const { dispatch } = this.props
    dispatch({
      type: 'qaRulesListModel/updateRule',
      payload: {
        rulesId: record.rules_id,
        status: newStatus
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.info(msg)
          this.handleSearch()
        }
      }
    });
  }


  renderFilterForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const formItemList: JSX.Element[] = new Array();
    formItemList.push(
      <FormItem label="创建时间">
        {getFieldDecorator('create_range_time', {
          initialValue: this.state.originValues?.create_range_time
        })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="规则名称">
        {getFieldDecorator('name', { initialValue: this.state.originValues?.name })(<Input placeholder="请输入规则名称" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="状态">
        {getFieldDecorator('status', {
          initialValue: this.state.originValues?.channelName
        })(
          <Select showSearch style={{ width: '100%', }} placeholder="请选择" >
            <Option key={1} value={1}>开启</Option>
            <Option key={2} value={2}>暂停</Option>
          </Select>
        )}
      </FormItem>
    );
    return formItemList;
  }


  //*********************************************************************************************** */
  // 提交搜索
  handleSearch = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        originValues: fieldsValue,
      })

      // 表单信息和状态
      const values = {
        ...fieldsValue,
        // status: this.status,
      };

      // 取出起始和结束时间
      const { create_range_time } = fieldsValue
      if (create_range_time !== undefined && create_range_time != '') {
        delete values.create_range_time
        values.createStartTime = moment(create_range_time[0]).format('YYYY-MM-DD');
        values.createEndTime = moment(create_range_time[1]).format('YYYY-MM-DD');
      }

      const channelArr = fieldsValue.channelName
      if (channelArr !== undefined && channelArr.length > 0) {
        delete values.channelName
        if (channelArr.length > 0) {
          values.channelName = channelArr[channelArr.length - 1]
        }
      }

      // 取出分页信息
      const { pagination } = this.props.qaRulesListModel.data;
      if (pagination !== undefined) {
        var isRefresh = localStorage ? localStorage.getItem('rulesListRefreshTag')?.toString() : '';
        if(isRefresh && isRefresh.length > 0) {
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
        type: 'qaRulesListModel/getList',
        payload: values,
      });
    });
  };


  //新建QA规则
  handleQaNewRule = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/qaruleslist/newqarules',
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
      type: 'qaRulesListModel/getList',
      payload: valuesResult,
    });
  }

  //跳转详情
  toRulesDetail = (obj: any) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/sunnyrules/qaruleslist/qaruledetail',
      state: {
        rulesId: obj.rules_id
      }
    }));
  }

  handleEditRule = (ruleId: string) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/qaruleslist/editqarules',
      state: {
        isAdd0orEdit1: 1,
        rulesId: ruleId
      }
    }))
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
      type: 'qaRulesListModel/getList',
      payload: params,
    });
  };

  render() {
    const { qaRulesListModel: { data }, loading } = this.props;

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false}>
          <div className={styles.tableList}>

            <CrmFilterForm
              formItemList={this.renderFilterForm()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={this.handleSearch}
            />

            <Divider />

            <MyTable
              rowKey="id"
              scroll={{ x: 'max-content' }}
              loading={loading}
              data={data}
              columns={this.getTableColumns()}
              onChange={this.handleChangePage}
              columnsEditable={false}
              renderTopButtons={
                () => (
                  <Button type="primary" onClick={this.handleQaNewRule}><PlusOutlined />创建QA规则</Button>
                )
              }
            />

          </div>
        </Card>
      </div>
    )
  }
}

class QaRulesListWrapper extends Component<QaRulesListProps, QaRulesListState> {
  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <QaRulesList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }
}
class MyTable extends CrmStandardTable<RulesListItem>{ }
export default Form.create<QaRulesListProps>()(QaRulesListWrapper);
