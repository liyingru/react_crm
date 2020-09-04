import React, { Component, Fragment } from "react";
import { Card, Row, Col, Select, Input, Form, Button, Table, Divider, Modal, message } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { connect } from "dva";
import { StateType } from "./model";
import styles from './style.less';
import { Action, Dispatch } from "redux";
import { ColumnProps } from "antd/lib/table";
import { ProcessData, Pagination } from "./data";
import { FormComponentProps } from "antd/lib/form";

const FormItem = Form.Item;
const { Option } = Select;

interface ProcessListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'processManagementProcessList/processList'
      | 'processManagementProcessList/config'
      | 'processManagementProcessList/modify'
      | 'processManagementProcessList/new'
      | 'processManagementProcessList/delete'
      | 'processManagementProcessList/edit'
    >
  >;
  loading: boolean;
  processManagementProcessList: StateType;
}

interface ProcessListState {
  formValues: { [key: string]: string };
  pagination: Pagination;
  modalContent: string,
  modalType: number,
  modalVisible: boolean,
}

@connect(
  ({
    processManagementProcessList,
    loading,
  }: {
    processManagementProcessList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    processManagementProcessList,
    loading: loading.models.processManagementProcessList,
  }),
)

class ProcessList extends Component<ProcessListProps, ProcessListState> {
  state: ProcessListState = {
    formValues: {},
    pagination: {
      pageSize: 10,
      total: 0,
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true,
    },
    modalContent: "是否删除该审批流",
    modalType: 0,
    modalVisible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //配置信息
    dispatch({
      type: 'processManagementProcessList/config',
    });
    //列表信息
    dispatch({
      type: 'processManagementProcessList/processList',
      callback: (total: number) => {
        this.state.pagination.total = total;
      }
    });
  }

  columns: ColumnProps<ProcessData>[] = [
    {
      title: '审批流名称',
      dataIndex: 'name',
    },
    {
      title: '操作场景',
      dataIndex: 'type_txt',
    },
    {
      title: '触发部门',
      dataIndex: 'structure_txt',
    },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record) => {
        let statusTxt = record.status == 0 ? '启用' : "停用"
        return (
          <Fragment>
            <a onClick={() => this.handleProcessEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleProcessDelete(record)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleProcessStopOrStart(record)}>{statusTxt}</a>
          </Fragment>
        )
      }
    },
  ];

  //筛选
  handleSearch = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //表单信息和状态
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      })
      const payload = {
        ...values,
        page: this.state.pagination.current,
        pageSize: this.state.pagination.pageSize,
      }
      if (payload.page) {
        payload.page = 1;
      }
      //列表信息
      dispatch({
        type: 'processManagementProcessList/processList',
        payload: payload,
        callback: (total: number) => {
          this.state.pagination.total = total;
        }
      });
    })
  }

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
    }
    //列表信息
    dispatch({
      type: 'processManagementProcessList/processList',
      payload: payload,
      callback: (total: number) => {
        this.state.pagination.total = total;
      }
    });
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
    }
    //列表信息
    dispatch({
      type: 'processManagementProcessList/processList',
      payload: payload,
      callback: (total: number) => {
        this.state.pagination.total = total;
      }
    });
  }

  //流程编辑
  handleProcessEdit = (record: ProcessData) => {
    const { dispatch } = this.props;
    let payload = {
      id: record.id,
    }
    //跳转编辑
    dispatch({
      type: 'processManagementProcessList/modify',
      payload: payload,
    });
  }

  //流程删除
  handleProcessDelete = (record: ProcessData) => {
    const { confirm } = Modal;
    const { dispatch } = this.props;
    confirm({
      title: '是否删除该审批流',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        //删除
        dispatch({
          type: 'processManagementProcessList/delete',
          payload: {
            acId: record.id,
          },
          callback: () => {
            message.success('审批流删除成功');
            dispatch({
              type: 'processManagementProcessList/processList',
            })
          },
        })
      },
    });
  }

  //流程停用
  handleProcessStopOrStart = (record: ProcessData) => {
    console.log(record)
    const { confirm } = Modal;
    const { dispatch } = this.props;
    let status: string;
    let title: string;
    if (record.status == '0') {
      status = '1';
      title = '是启用该审批流';
    } else {
      status = '0';
      title = '是否停用该审批流';
    }
    confirm({
      title: title,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        //更新状态
        dispatch({
          type: 'processManagementProcessList/edit',
          payload: {
            acId: record.id,
            status: status,
          },
          callback: () => {
            message.success('审批流停用成功');
            dispatch({
              type: 'processManagementProcessList/processList',
            })
          },
        })
      },
    });
  }

  //添加审批流
  handleNewProcess = () => {
    const { dispatch } = this.props;
    //跳转新建
    dispatch({
      type: 'processManagementProcessList/new',
    })
  }

  handleModalOk = () => {

  }

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    })
  }

  render() {
    const { loading, processManagementProcessList: { list } } = this.props;
    const paginationProps = (list.rows && list.rows.length > 0)
      ? {
        ...this.state.pagination,
        showTotal:(total:number, range:[number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
      }
      : false;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <Modal
              title={'操作'}
              visible={this.state.modalVisible}
              onOk={this.handleModalOk}
              confirmLoading={loading}
              onCancel={this.handleModalCancel}
            >
              <p>{this.state.modalContent}</p>
            </Modal>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Divider />

            <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: '24px' }}>
              <Col span={8} offset={16}>
                <div style={{ display: 'flex', flexDirection:"row" }}>
                  <Button style={{ flex: 1, visibility: 'hidden' }} >我是占位按钮</Button>
                  <Button type="primary" icon='plus' style={{ }} onClick={this.handleNewProcess}>新增审批流程</Button>
                </div>
              </Col>
            </Row>

            <Table
              scroll={{ x: 'max-content' }}
              loading={loading}
              dataSource={list.rows}
              columns={this.columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderForm() {
    const { form, processManagementProcessList: { config } } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="审批流名称">
              {getFieldDecorator('name')(<Input placeholder="请输入审批流名称" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="操作场景">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    config.auditType ? config.auditType.map(auditType => (
                      <Option value={auditType.id}>{auditType.name}</Option>)) : null
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    config.auditConfigStatus ? config.auditConfigStatus.map(auditConfigStatus => (
                      <Option value={auditConfigStatus.id}>{auditConfigStatus.name}</Option>)) : null
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8} offset={16}>
            <div style={{ display: 'flex' }}>
              <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
              <Button type="primary" style={{ marginLeft: '20px', flexGrow: 1 }} onClick={this.handleSearch}>筛选</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create<ProcessListProps>()(ProcessList);
