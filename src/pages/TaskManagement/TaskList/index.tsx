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
  Table
} from 'antd';
import { KeepAlive } from 'umi';

import { ColumnProps } from 'antd/es/table'; // 引用table中的行参数
import { RadioChangeEvent } from 'antd/lib/radio';

import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import AreaSelect from '@/components/AreaSelect';

import { connect } from 'dva';
import { StateType } from './model';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;

const { confirm } = Modal;

const FormItem = Form.Item;
interface TaskListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  taskilList: StateType;
  loading: boolean;
}
interface currentState {
  data: Object;
  tableListData: Object;
  searchParams: Object;
  tab: Number;
  modalVisible: boolean;
  dialogTab: Number,
  btTab1: String;
  btTab2: String;
  params: Object,
  choiceGoupId: any;
  choiceUserId: String;
  rangeValue: string;
  dateObj: Object;
  originalFormValus: any;
  isReload: any;
}

@connect(
  ({
    taskilList,
    loading,
  }: {
    taskilList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    taskilList,
    loading: loading.models.taskilList,
  }),
)


class StoreDetail extends Component<TaskListProps, currentState>{
  state = {
    data: {},
    tableListData: [],
    searchParams: {},
    tab: 0,
    modalVisible: false,
    dialogTab: 1,
    params: {},
    choiceGoupId: [],
    choiceUserId: '',
    rangeValue: '',
    dateObj: {},
    btTab1: 'primary',
    btTab2: '',
    originalFormValus: {},
    isReload: undefined
  }

  componentDidMount() {
    const { dispatch } = this.props;
    console.log(this.props.taskilList)
    dispatch({
      type: 'taskilList/fetch',
    });

    dispatch({
      type: 'taskilList/taskConfigCtrl',
    });
  }
  componentWillReceiveProps(nextProps) {
    const isRefresh = localStorage ? localStorage.getItem('isTask')?.toString() : '';
    if (isRefresh?.length > 0) {
      localStorage?.setItem('isTask', '')
      this.restCtrl()
    }
    // const {location: {query: { isReload }}} = this.props;
    // if(isReload){
    // this.setState({
    //   isReload:isReload
    // },()=>{
    //   if(this.state.isReload){this.restCtrl();}
    // })
    // }

  }
  isUpdatelistCtrl = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000)
  }

  orderDetailCtrl = (obj: any) => {


    console.log('this.state.searchParams======', this.state.searchParams)
    this.props.dispatch({
      type: 'taskilList/saveStore',
      payload: { 'taskState': this.state.searchParams }
    });


    this.props.dispatch(routerRedux.push({
      pathname: '/task/taskdetail',
      query: {
        taskId: obj.id
      }
    }));
  }


  // 获取列表 表头
  getTableColumns = (): ColumnProps<any>[] => [
    {
      width: 150,
      title: '活动名称',
      dataIndex: 'name',
      fixed: 'left',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.orderDetailCtrl(record)}>{text}</a>
        </Fragment>
      )

    },
    {
      width: 150,
      title: '任务类型',
      dataIndex: 'type',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 100,
      title: '执行规则',
      dataIndex: 'exec_rule',
    },
    {
      width: 150,
      title: '创建时间',
      dataIndex: 'create_time',
      render(text) {
        return <>{text || '-'}</>
      }
    },

    {
      width: 150,
      title: '任务描述',
      dataIndex: 'remark',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 120,
      title: '创建人',
      dataIndex: 'create_by',
    },
    {
      width: 100,
      title: '任务状态',
      dataIndex: 'status',
    },
    {
      width: 250,
      title: '执行时间',
      dataIndex: 'start_time',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'btns',
      key: 'action',
      render: (text, record) => (
        text.split(',').map((itemName, index) => (
          <>
            <a onClick={() => this.handleClickEdit(itemName, record)}>
              {itemName == '1' ? '分配任务' : itemName == '2' ? '暂停任务' : itemName == '3' ? '重新回收' : '再次开启'}
              {index == 0 ? <Divider type="vertical" /> : null}
            </a>
          </>
        ))
      ),
    },
  ];

  // 获取列表操作项
  handleClickEdit = (itemName: any, record: any) => {
    const { dispatch, } = this.props;
    const type = parseInt(itemName);
    const self = this;
    // 1:分配任务;2:暂停任务;3:重新回收;4:再次开启))
    const obj = {};
    obj.taskId = record.id;
    if (type == 1) {
      self.setState({
        modalVisible: true,
        params: obj
      })
    }
    //
    if (type == 2) {
      obj.status = 0;
      dispatch({
        type: 'taskilList/changeStatuTaskCtrl',
        payload: obj,
        callback: this.distributeUserCallback
      });
    }
    if (type == 3) {
      confirm({
        title: '请确认是否回收【任务名】所分配的数据？',
        okText: '确定',
        cancelText: '取消',
        centered: true,
        onOk() {
          dispatch({
            type: 'taskilList/recoveryDataTaskCtrl',
            payload: obj,
            callback: self.distributeUserCallback
          });
        },
        onCancel() { },
      });

    }
    if (type == 4) {
      obj.status = 1;
      dispatch({
        type: 'taskilList/changeStatuTaskCtrl',
        payload: obj,
        callback: this.distributeUserCallback
      });
    }
    console.log(itemName, record)
  };

  distributeUserCallback = data => {
    const { dispatch, } = this.props;
    // console.log(data)
    if (data.code == 200) {
      message.success('提交成功');
      dispatch({
        type: 'taskilList/fetch',
      });
    }
    this.setState({
      modalVisible: false,
    });
  }

  handlePickerChange = (e: any) => {
    const dateObj = {}
    // console.log(e)
    if (JSON.stringify(e) != '[]') {
      dateObj.startCreateTime = moment(e[0]).format('YYYY-MM-DD');
      dateObj.endCreateTime = moment(e[1]).format('YYYY-MM-DD');
    } else {
      dateObj.startCreateTime = '';
      dateObj.endCreateTime = '';
    }

    this.setState({
      dateObj
    })
  }

  renderForm() {
    const {
      form,
      taskilList: { configData },
    } = this.props;
    const { rangeValue } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="创建日期">
                {getFieldDecorator('timeArray', { initialValue: this.state.originalFormValus?.timeArray })(
                  <RangePicker
                    value={rangeValue}
                    ranges={{
                      '本周': [moment().startOf('week'), moment().endOf('week')],
                    }}
                    placeholder={['开始日期', '结束日期']}
                    onChange={this.handlePickerChange}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="任务类型">
                {getFieldDecorator('type', { initialValue: this.state.originalFormValus?.type })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    {configData.taskTypeList &&
                      configData.taskTypeList.map((content, index) => (
                        <Option key={content.id} value={content.id}>
                          {content.name}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="活动名称">
                {getFieldDecorator('name', { initialValue: this.state.originalFormValus?.name })(<Input maxLength={5} placeholder="请输入组名" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="创建人">
                {getFieldDecorator('create_user', { initialValue: this.state.originalFormValus?.create_user })(<Input style={{ width: '100%' }} maxLength={5} placeholder="请输入成员" />)}
              </FormItem>
            </Col>
            <Col span={8} offset={8}>
              <div style={{ display: 'flex' }}>
                <Button style={{ flexGrow: 1, marginLeft: 90, borderColor: '#1791FF', color: '#1791FF' }} onClick={e => { this.restCtrl(e, 0) }}>
                  重置
              </Button>

                <Button type="primary" style={{ flexGrow: 1, marginLeft: 20 }} onClick={e => { this.validateCtrl(e, 0) }}>
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

  // 提交搜索
  validateCtrl = (e, num: Number) => {
    const {
      form,
      dispatch,
      taskilList: { data }

    } = this.props;
    const { pagination } = data;
    form.validateFields((error, values) => {
      if (!error) {
        // submit the values
        // if (values.timeArray !== undefined) {
        //   values.startCreateTime = moment(values.timeArray[0]).format('YYYY-MM-DD');
        //   values.endCreateTime = moment(values.timeArray[1]).format('YYYY-MM-DD');
        //   delete values.timeArray
        // }
        const { timeArray } = values;
        console.log('timeArray==', timeArray);

        this.setState({
          originalFormValus: values,
        }, () => {
          console.log('originalFormValus==', this.state.originalFormValus)
          this.state.originalFormValus.timeArray = timeArray;

        })




        if (JSON.stringify(this.state.dateObj) != '{}') {
          values.startCreateTime = this.state.dateObj.startCreateTime;
          values.endCreateTime = this.state.dateObj.endCreateTime;
          delete values.timeArray;
        }
        const valuesResult = {
          ...values,
        }
        for (const i in valuesResult) {
          if (valuesResult[i] == undefined) {
            valuesResult[i] = '';
          }
        }

        if (pagination !== undefined) {
          // values['page'] = pagination.current;
          valuesResult['pageSize'] = pagination.pageSize;
          valuesResult['page'] = 1;
        }

        this.setState({
          searchParams: valuesResult
        })
        dispatch({
          type: 'taskilList/fetch',
          payload: valuesResult,
        });
      }
    });
  }

  // 重置
  restCtrl = (e, num: Number) => {
    const { form, dispatch } = this.props;
    const { rangeValue } = this.state;
    form.resetFields();
    const obj = { type: "", name: "", create_user: "", startCreateTime: "", endCreateTime: "" }
    this.setState({
      searchParams: obj,
      resetArea: true,
      originalFormValus: null,
      isReload: undefined
    })
    dispatch({
      type: 'taskilList/fetch',
      payload: obj,
    });
  }

  // 状态切换
  handleTaskTab = (e: any) => {
    const { form, dispatch } = this.props;
    const value = parseInt(e.target.value);
    this.setState({
      tab: value
    });

    const valuesResult = {
      ...this.state.searchParams,
      status: value
    }

    dispatch({
      type: 'taskilList/fetch',
      payload: valuesResult,
    });
  }

  // 分页
  handleChangePage = (page: any) => {
    console.log(page, '------hdfbvdgfvdgfvghbs');
    const { form, dispatch } = this.props;
    const valuesResult = {
      ...this.state.searchParams,
      page: page.current,
      pageSize: 10,
    }
    dispatch({
      type: 'taskilList/fetch',
      payload: valuesResult,
    });
  }

  handleAddContactModalOk = () => {
    const { dispatch } = this.props;
    const obj = {};
    obj.taskId = this.state.params.taskId;
    if (this.state.choiceGoupId) {
      obj.groupId = this.state.choiceGoupId.join(',');
    }
    if (this.state.choiceUserId) {
      obj.ownerId = this.state.choiceUserId;
    }
    dispatch({
      type: 'taskilList/distributeUserCtrl',
      payload: obj,
      callback: this.distributeUserCallback
    });
  }

  // 关闭浮层
  handleAddContactModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  // 查找组 或者是
  searchNameCtrl = (e: any, num: Number) => {
    const { dispatch, } = this.props;
    const value = e;
    const obj = {};
    obj.keywords = value;
    if (num == 1) {
      dispatch({
        type: 'taskilList/getGroupUserListCtrl',
        payload: obj
      });
    }
    if (num == 2) {
      dispatch({
        type: 'taskilList/searchUserCtrl',
        payload: obj
      });
    }
  }

  // 客户选择 && 选择
  colleagueSelectChange = (e: any, num: Number) => {
    console.log(e)
    if (num == 1) {
      // this.setState({
      //   choiceGoupId: e,
      //   choiceUserId: ''
      // });

      this.state.choiceGoupId = e;
      this.setState((prevState) => {
        let list = [...new Set([...prevState.choiceGoupId])]
        return {
          choiceGoupId: list,
          choiceUserId: '',
        }
      });
    }
    if (num == 2) {
      this.setState({
        choiceUserId: e,
        choiceGoupId: '',
      });
    }
  }

  getGroupTab = (e: any, num: Number) => {
    if (num == 1) {
      this.setState({
        dialogTab: num,
        btTab1: 'primary',
        btTab2: ''
      })
    } else {
      this.setState({
        dialogTab: num,
        btTab2: 'primary',
        btTab1: '',
      })
    }
  }


  handleNewTask = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/task/newtask',
    }))
  }

  render() {
    const {
      taskilList: { data: { pagination, list }, configData, searchUserData, getGroupUserData },
      loading
    } = this.props;
    const columns = this.getTableColumns();
    return (
      <>

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Radio.Group
                style={{ flexGrow: 1 }}
                defaultValue="0"
                buttonStyle="solid"
                onChange={this.handleTaskTab}
              >
                <Radio.Button value="0">全部</Radio.Button>
                <Radio.Button value="1">待执行</Radio.Button>
                <Radio.Button value="2">生效中</Radio.Button>
                <Radio.Button value="3">已暂停</Radio.Button>
                <Radio.Button value="4">已结束</Radio.Button>
              </Radio.Group>

              <Button type="primary" onClick={this.handleNewTask}><PlusOutlined />新建任务</Button>
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
        <Modal
          // title="分配任务" primary
          visible={this.state.modalVisible}
          onOk={this.handleAddContactModalOk}
          onCancel={this.handleAddContactModalCancel}
          destroyOnClose>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
            <Button type={this.state.btTab1} onClick={e => { this.getGroupTab(e, 1) }}>
              分配组
            </Button>
            <Button type={this.state.btTab2} style={{ marginLeft: 6 }} onClick={e => { this.getGroupTab(e, 2) }}>
              分配人
            </Button>
          </FormItem>
          {this.state.dialogTab == 1 ? (
            <FormItem label="组名" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
              <Select
                placeholder='请输入组名'
                showSearch
                mode="multiple"
                style={{ width: 300 }}
                optionFilterProp="children"
                onSearch={e => { this.searchNameCtrl(e, 1) }}
                onChange={e => { this.colleagueSelectChange(e, 1) }}
                maxTagTextLength={11}
                allowClear
              >
                {
                  getGroupUserData != '' ? getGroupUserData.map((item, index) => (
                    <Option value={item.id} key={item.name} >{item.name}</Option>)) : ''
                }
              </Select></FormItem>) : ''}
          {this.state.dialogTab == 2 ? (
            <FormItem label="人名" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
              <Select
                placeholder='请输入人员名字'
                showSearch
                style={{ width: 300 }}
                optionFilterProp="children"
                onSearch={e => { this.searchNameCtrl(e, 2) }}
                onChange={e => { this.colleagueSelectChange(e, 2) }}
                maxTagTextLength={11}
                allowClear
              >
                {
                  searchUserData != '' ? searchUserData.map((item, index) => (
                    <Option value={item.id} key={item.name} >{item.name}</Option>)) : ''
                }
              </Select></FormItem>) : ''}
        </Modal>
      </>
    )
  }
}


class StoreDetail1 extends Component<TaskListProps, currentState> {

  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <StoreDetail {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}
export default Form.create<TaskListProps>()(StoreDetail1);
