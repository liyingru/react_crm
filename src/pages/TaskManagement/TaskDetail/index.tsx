// by xiaosong 2020.1.6
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message, Modal, Table } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import AreaSelect from '@/components/AreaSelect';
import { StateType } from './model';
import styles from './index.less';
import { connect } from 'dva';
const FormItem = Form.Item;
const { confirm } = Modal;
interface TaskDetailProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  taskDetail: StateType;
  loading: boolean;
}
interface currentState {
  loading: boolean;
  data: Object,
}

@connect(
  ({
    taskDetail,
    loading,
  }: {
    taskDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    taskDetail,
    loading: loading.models.taskDetail,
  }),
)


class TaskInfor extends Component<TaskDetailProps, currentState>{
  state = {
    loading: false,
    data: {}
  }

  componentDidMount() {
    const { dispatch, location: { query: { taskId } } } = this.props;
    //dispatch({ type: 'taskDetail/fetch' });
    if (!taskId) {
      this.props.dispatch(routerRedux.push({
        pathname: '/task/taskList',
      }));
    }
    if (taskId) {
      dispatch({
        type: 'taskDetail/taskDetailCtrl',
        payload: { taskId: taskId },
        callback: this.taskDetailCtrl
      });
    }


  }
  taskDetailCtrl = (data: any) => {
    if (data.code == 200) {
      this.setState({
        data: data.data.result
      })
    } 
  }
  renderForm() {
    const {
      form,
      taskDetail: { configData },
    } = this.props;
    const { data } = this.state;
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>任务名：</div>
                <div className={styles.rtContent}>{data.name}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>类型：</div>
                <div className={styles.rtContent}>{data.type_txt}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>生效时间：</div>
                <div className={styles.rtContent}>{data.start_time}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>生效场景：</div>
                <div className={styles.rtContent}>{data.scope_txt ? data.scope_txt : '未填写'}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>任务权重：</div>
                <div className={styles.rtContent}>{data.weight ? data.weight : '未填写'}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>触发条件：</div>
                <div className={styles.rtContent}>
                  {this.getTodoItem(data.conditions_txt)}
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>执行规则：</div>
                <div className={styles.rtContent}>{data.exec_rule_txt ? data.exec_rule_txt : '未填写'}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>任务状态：</div>
                <div className={styles.rtContent}>{data.status ? data.status : '未选择'}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>任务描述：</div>
                <div className={styles.rtContent}>{data.remark ? data.remark : '未填写'}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <div className={styles.wrapSection}>
                <div className={styles.label}>创建人：</div>
                <div className={styles.rtContent}>{data.create_by}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <FormItem>
                <div className={styles.wrapSection}>
                  <div className={styles.label}>创建时间：</div>
                  <div className={styles.rtContent}>{data.create_time}</div>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem>
                <Button type="primary" style={{ width: '30%' }} onClick={(e) => { this.handelTaskEditCtrl(data.id) }}>
                  编辑
              </Button>
                <Button type="primary" style={{ width: '30%', marginLeft: '20%' }} onClick={(e) => { this.handelDelateCtrl(data.id) }}>
                  删除
              </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  // 条件列表
  getTodoItem = (arr: any) => {
    if (arr) {
      return (
        arr.map((item, index) => {
          return (
            <div className={styles.conditionsWrap} key={item}>
              <div className={styles.wrap}>
                <div className={styles.editBt}>
                <div>{item.title}</div>
                </div>
                <div className={styles.labelContet}>
                  {
                    item&&item.attributes&&item.attributes.map((ele, targetIndex) => {
                      return (
                        <Fragment key={item}>
                          {ele.attribute_txt}
                          {':'}
                          <span style={{ paddingRight: 6 }}>{ele.attribute_value_txt == '' ? '未填写' : ' ' + ele.attribute_value_txt}</span>
                        </Fragment>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          )
        })
      )
    }
  }
  // 编辑任务
  handelTaskEditCtrl = (id: any) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/task/newtask',
      query: { taskId: id }
    }));
  }
  // 删除任务
  handelDelateCtrl = (id: number) => {
    const { dispatch } = this.props;
    const self = this;
    confirm({
      title: '确定删除任务？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        dispatch({
          type: 'taskDetail/deleteTaskCtrl',
          payload: { taskId: id },
          callback: self.delateCtrl
        });
      },
      onCancel() { },
    });
  }
  // 删除任务回调
  delateCtrl = (data: any) => {
    if (data.code == 200) {
      message.success('删除成功');
      this.props.dispatch(routerRedux.push({
        pathname: '/task/tasklist',
      }));
      localStorage.setItem('isTask','isTask');
    }
  }
  render() {
    let { loading } = this.state;
    const { taskDetail: { configData }, } = this.props;
    // console.log(configData)
    return (
      <PageHeaderWrapper content="任务详情" className={styles.main}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<TaskDetailProps>()(TaskInfor);
