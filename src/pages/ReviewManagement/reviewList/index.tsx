
import { StateType } from "./model";
import styles from './style.less';
import Form, { FormComponentProps } from "antd/lib/form";
import { connect } from "dva";
import { Component, Fragment } from "react";
import React from "react";
import { Card, Divider, Row, Col, Select, Input, Button, Radio, DatePicker } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Dispatch, Action } from "redux";
import { Pagination, ReviewData } from "./data";
import Table, { ColumnProps } from "antd/lib/table";
import { RadioChangeEvent } from "antd/lib/radio";
import moment from "moment";
import LOCAL from '@/utils/LocalStorageKeys';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

type IStatusMapType = 0 | 1 | 2 | 3 | 99;
const statusKey = [0, 1, 2, 3, 99];
const statusValue = ["失效", '待审核', "驳回", "审批通过", '审核中'];

interface ReviewListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'reviewManagementReviewList/list'
      | 'reviewManagementReviewList/config'
      | 'reviewManagementReviewList/option'
    >
  >;
  loading: boolean;
  reviewManagementReviewList: StateType;
}

interface ReviewListState {
  formValues: { [key: string]: string };
  pagination: Pagination;
  status: string;
  userId: any
}

@connect(
  ({
    reviewManagementReviewList,
    loading,
  }: {
    reviewManagementReviewList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    reviewManagementReviewList,
    loading: loading.models.reviewManagementReviewList,
  }),
)

class ReviewList extends Component<ReviewListProps, ReviewListState> {
  state: ReviewListState = {
    formValues: {},
    pagination: {
      pageSize: 10,
      total: 0,
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true,
    },
    status: "",
    userId: ''
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //配置信息
    dispatch({
      type: 'reviewManagementReviewList/config',
    });
    //列表信息
    const payload = {
      page: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      phase: this.state.status,
    }
    dispatch({
      type: 'reviewManagementReviewList/list',
      payload: payload,
      callback: (total: number) => {
        this.state.pagination.total = total;
      }
    });
    let userInfo = JSON.parse(localStorage.getItem(LOCAL.USER_INFO));
    if (userInfo) {
      this.setState({
        userId: userInfo.id
      })
    }
  }

  columns: ColumnProps<ReviewData>[] = [
    // {
    //     title: 'id',
    //     dataIndex: 'id',
    // },
    {
      title: '审批编号',
      dataIndex: 'id',
    },
    {
      title: '业务编号',
      dataIndex: 'related_id',
    },
    {
      title: '客户编号',
      dataIndex: 'customer_id',
    },
    {
      title: '客户姓名',
      dataIndex: 'customer_name',
    },
    {
      title: '业务类型',
      dataIndex: 'type_txt',
    },
    {
      title: '提交人',
      dataIndex: 'user_name',
    },
    {
      title: '提交时间',
      dataIndex: 'create_time',
    },
    // {
    //   title: '阶段',
    //   dataIndex: 'phase_txt',
    // },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '当前审核人',
      dataIndex: 'auditor_name',
    },
    {
      title: '审批时间',
      dataIndex: 'audit_time',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => {
        return (
          <Fragment>
            {
              (this.state.userId == record.auditor_id) && (record.is_owner == 1) && (record.status == 1) || this.state.userId == 771 ?
                <a onClick={() => this.handleOption(record)}>处理</a> : <a onClick={() => this.handleOption(record)}>查看</a>
            }
          </Fragment>
        )
      }
    },
  ];

  //重制
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    //表单重置
    form.resetFields();
    this.setState({
      formValues: {},
    })
    const payload = {
      page: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      phase: this.state.status,
    }
    //列表信息
    dispatch({
      type: 'reviewManagementReviewList/list',
      payload: payload,
      callback: (total: number) => {
        this.state.pagination.total = total;
      }
    });
  }

  //筛选
  handleSearch = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //表单信息和状态
      const values = {
        ...fieldsValue,
      };
      const userRangeTime = fieldsValue['userRangeTime']
      if (userRangeTime !== undefined && userRangeTime != '') {
        delete values['userRangeTime']
        values['startTime'] = moment(userRangeTime[0]).format('YYYY-MM-DD');
        values['endTime'] = moment(userRangeTime[1]).format('YYYY-MM-DD');
      }
      console.log(values);

      var params = values;
      // let id = values['id']
      // let type = values['type']
      // let userName = values['userName']
      // let startTime = values['startTime']
      // let endTime = values['endTime']
      // if (id && id != '') {
      //   params['id'] = id
      // }
      // if (type && type != '') {
      //   params['type'] = type
      // }
      // if (userName && userName != '') {
      //   params['userName'] = userName
      // }
      // if (userRangeTime !== undefined) {
      //   params['startTime'] = startTime
      //   params['endTime'] = endTime
      // }

      this.setState({
        formValues: params,
      })
      const payload = {
        ...params,
        page: this.state.pagination.current,
        pageSize: this.state.pagination.pageSize,
        phase: this.state.status,
      }
      if (payload.page) {
        payload.page = 1;
      }

      //列表信息
      dispatch({
        type: 'reviewManagementReviewList/list',
        payload: payload,
        callback: (total: number) => {
          this.state.pagination.total = total;
        }
      });
    })
  }

  //table页码变化
  handleTableChange = (pagination: any) => {
    const { dispatch } = this.props;
    this.setState({
      pagination: pagination,
    })
    const payload = {
      ...this.state.formValues,
      page: pagination.current,
      pageSize: pagination.pageSize,
      phase: this.state.status,
    }
    //列表信息
    dispatch({
      type: 'reviewManagementReviewList/list',
      payload: payload,
      callback: (total: number) => {
        this.state.pagination.total = total;
      }
    });
  }

  //状态变化
  handleStatus = (e: RadioChangeEvent) => {
    const { dispatch } = this.props;
    let pagination = this.state.pagination;
    pagination.current = 1;
    this.setState({
      status: e.target.value,
      pagination: pagination,
    }, () => {
      const payload = {
        ...this.state.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
        phase: this.state.status,
      }
      //列表信息
      dispatch({
        type: 'reviewManagementReviewList/list',
        payload: payload,
        callback: (total: number) => {
          this.state.pagination.total = total;
        }
      });
    })
  }

  //处理
  handleOption = (record: ReviewData) => {
    const { dispatch } = this.props;

    //console.log(record)
    //跳转
    const payload = {
      auditId: record.id,
      type: record.type
    }
    dispatch({
      type: 'reviewManagementReviewList/option',
      payload: payload,
    });
  }

  render() {
    const { loading, reviewManagementReviewList: { list } } = this.props;
    const paginationProps = (list.rows && list.rows.length > 0)
      ? {
        ...this.state.pagination,
        showTotal: (total: number, range: [number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
      }
      : false;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <Divider />
          {this.renderRadio()}
          <Table
            scroll={{ x: 'max-content' }}
            loading={loading}
            dataSource={list.rows}
            rowKey="id"
            columns={this.columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderForm() {
    const { form, reviewManagementReviewList: { config } } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="审批编号">
              {getFieldDecorator('id')(<Input placeholder="请输入审批编号" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="业务类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    config.auditType ? config.auditType.map(auditType => (
                      <Option key={auditType.id} value={auditType.id}>{auditType.name}</Option>)) : null
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="提交人">
              {getFieldDecorator('userName')(<Input placeholder="请输入提交人" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="提交时间">
              {getFieldDecorator('userRangeTime')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="客户编号">
              {getFieldDecorator('customerId')(
                <Input placeholder="客户id" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginBottom: '-24px' }}>
            <div style={{ display: 'flex' }}>
              <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
              <Button type="primary" style={{ marginLeft: '20px', flexGrow: 1 }} onClick={this.handleSearch}>筛选</Button>
            </div>
          </Col>
        </Row>
      </Form>
    )
  }

  renderRadio() {
    const { reviewManagementReviewList: { config: { auditPhase } } } = this.props;
    if (auditPhase && auditPhase.length > 0) {
      return (
        <Radio.Group defaultValue="" buttonStyle="solid" onChange={this.handleStatus} style={{ marginBottom: '24px' }}>
          <Radio.Button value="">全部</Radio.Button>
          {
            auditPhase.map(item => (
              <Radio.Button key={item.id} value={item.id}>{item.name}</Radio.Button>
            ))
          }
        </Radio.Group>
      );
    } else {
      return null;
    }
    // return (
    //   <Radio.Group defaultValue="" buttonStyle="solid" onChange={this.handleStatus} style={{ marginBottom: '24px' }}>
    //     <Radio.Button value="">全部</Radio.Button>
    //     <Radio.Button value="1">待审核</Radio.Button>
    //     <Radio.Button value="99">审核中</Radio.Button>
    //     <Radio.Button value="3">审批通过</Radio.Button>
    //     <Radio.Button value="2">驳回</Radio.Button>
    //     <Radio.Button value="0">失效</Radio.Button>
    //   </Radio.Group>
    // )
  }
}

export default Form.create<ReviewListProps>()(ReviewList);
