import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import { StateType } from './model';
import styles from './index.less';
import { connect } from 'dva';
import NewTaskDialog from './NewTaskDialog';
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
interface TaskListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  newTask: StateType;
  loading: boolean;
}
interface currentState {
  data: Object;
  loading: boolean;
  params: Object;
  modalVisible: boolean;
  conditionArr: Object;
  editIndex: Number;
  taskId: string;
  // 任务条件 单独参数
}
@connect(
  ({
    newTask,
    loading,
  }: {
    newTask: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newTask,
    loading: loading.models.newTask,
  }),
)

class StoreDetail extends Component<TaskListProps, currentState>{
  state = {
    data: {},
    loading: false,
    params: {},
    modalVisible: false,
    conditionArr: [],
    editIndex: -1,
    taskId: '',
    // 2020.3.13
    modalVisibleF: false,
    dialogTab: 1,
    choiceGoupId: [],
    choiceUserId: [],
    rangeValue: '',
    dateObj: {},
    btTab1: 'primary',
    btTab2: '',
    choiceGoupIdName: '',
    scopeListNum: 1,
    choiceDesc: '',
    targetGroupId:[]
  }
  renderForm() {
    const {
      form,
      newTask: { configData },
    } = this.props;
    const { getFieldDecorator } = form;
    const { data } = this.state;
    // data.execRule = data.exec_rule.split(',');

    // console.log('data.exec_rule',data.execRule)
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          {/* <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={8}>
                <FormItem label="生效公司" style={{ paddingLeft: 12 }}>
                  {getFieldDecorator('companyId',
                    { rules: [{ required: false, message: "生效公司" }] })(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        {configData.companyList &&
                          configData.companyList.map((content, index) => (
                            <Option key={content.id} value={content.id}>
                              {content.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                </FormItem>
              </Col>
            </Row> */}
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="活动名称">
                {getFieldDecorator('name',
                  { rules: [{ required: true, message: "活动名称" }] })(<Input maxLength={20} placeholder="请输入活动名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="任务类型">
                {getFieldDecorator('type',
                  { rules: [{ required: true, message: "任务类型" }] })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
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
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="生效时间" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('timeArray',
                )(
                  <RangePicker
                    ranges={{
                      '本周': [moment().startOf('week'), moment().endOf('week')],
                    }}
                    placeholder={['开始日期', '结束日期']}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="生效范围">
                {getFieldDecorator('scope',
                  { rules: [{ required: true, message: "生效范围" }] })(
                    <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.scopeListCtrl}>
                      {configData.scopeList &&
                        configData.scopeList.map((content, index) => (
                          <Option key={content.id} value={content.id}>
                            {content.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label=" 任务权重" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('weight',
                )(<InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="设置范围0-100" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={16}>
              <FormItem label=" 触发条件" style={{ paddingLeft: 12 }}>
                <Button type="primary" disabled={this.props.form.getFieldValue('scope')?false:true} onClick={() => { this.addCondationCtrl() }}>
                  添加
              </Button>
                {this.getTodoItem()}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={16}>
              <FormItem label="执行规则" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('execRule',
                  { initialValue: '1' },
                  { rules: [{ required: true, message: "执行规则" }] })(
                    <Checkbox.Group style={{ width: '100%' }}>
                      {configData.executeRuleList && configData.executeRuleList.map((content, index) => (
                        <Checkbox key={content.id} value={content.id + ''} >
                          {content.name}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>,

                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={16}>
              <FormItem label="任务状态" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('status',
                  { initialValue: 1 }
                )(
                  <Radio.Group style={{ width: '100%' }}>
                    {configData.taskStatusList &&
                      configData.taskStatusList.map((content, index) => (
                        <Radio key={content.id} value={content.id}>
                          {content.name}
                        </Radio>
                      ))}
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="任务描述" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('remark', {
                })(<TextArea rows={4} placeholder="请输入任务描述" style={{ marginTop: 10, resize: "none", width: '100%' }}></TextArea>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem style={{ paddingLeft: 12 }}>
                <Button type="primary" style={{ width: '40%' }} onClick={(e) => { this.validateCtrl(e, 1) }}>
                  提交
              </Button>
                <Button type="primary" style={{ width: '40%', marginLeft: '20%' }} onClick={(e) => { this.restCtrl(e, 2) }}>
                  返回
              </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  isIdRenderForm() {
    const {
      form,
      newTask: { configData },
    } = this.props;
    const { getFieldDecorator } = form;
    const { data } = this.state;
    data.execRule = data.exec_rule;
    if (data.exec_rule) { data.execRule = data.execRule?.toString() }
    // console.log('data.exec_rule',data.execRule)
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          {/* <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="生效公司" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('companyId',
                  { initialValue: data.company_id == 0 ? '全国':data.company_id},
                  { rules: [{ required: false, message: "生效公司" }] })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      {configData.companyList &&
                        configData.companyList.map((content, index) => (
                          <Option key={content.id} value={content.id}>
                            {content.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
              </FormItem>
            </Col>
          </Row> */}
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="活动名称" style={data.name ? { paddingLeft: 12 } : {}}>
                {getFieldDecorator('name',
                  { initialValue: data.name ? data.name : '' },
                  { rules: [{ required: true, message: "活动名称" }] })(<Input maxLength={20} placeholder="请输入活动名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="任务类型" style={data.type ? { paddingLeft: 12 } : {}}>
                {getFieldDecorator('type',
                  { initialValue: data.type },
                  { rules: [{ required: true, message: "任务类型" }] })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
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
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="生效时间" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('timeArray',
                  {
                    initialValue: data.start_time ? [moment(data.start_time.split(' ')[0], dateFormat), moment(data.end_time.split(' ')[0], dateFormat)] : ''
                  }
                )(
                  <RangePicker
                    ranges={{
                      '本周': [moment().startOf('week'), moment().endOf('week')],
                    }}
                    placeholder={['开始日期', '结束日期']}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="生效范围" style={data.scope ? { paddingLeft: 12 } : {}}>
                {getFieldDecorator('scope',
                  { initialValue: data.scope },
                  { rules: [{ required: true, message: "生效范围" }] })(
                    <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.scopeListCtrl}>
                      {configData.scopeList &&
                        configData.scopeList.map((content, index) => (
                          <Option key={content.id} value={content.id}>
                            {content.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label=" 任务权重" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('weight',
                  { initialValue: data.weight },
                )(<InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="设置范围0-100" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label=" 触发条件" style={{ paddingLeft: 12 }}>
                <Button type="primary" disabled={this.props.form.getFieldValue('scope')?false:true} onClick={() => { this.addCondationCtrl() }}>
                  添加
              </Button>
                {this.getTodoItem()}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={16}>
              <FormItem label="执行规则" style={data.execRule ? { paddingLeft: 12 } : {}}>
                {getFieldDecorator('execRule',
                  { initialValue: data.execRule ? data.execRule : undefined },
                  { rules: [{ required: true, message: "执行规则" }] })(
                    <Checkbox.Group style={{ width: '100%' }}>
                      {configData.executeRuleList && configData.executeRuleList.map((content, index) => (
                        <Checkbox key={content.id} value={content.id + ''} >
                          {content.name}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>,

                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={16}>
              <FormItem label="任务状态" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('status',
                  { initialValue: data.status },
                )(
                  <Radio.Group style={{ width: '100%' }}>
                    {configData.taskStatusList &&
                      configData.taskStatusList.map((content, index) => (
                        <Radio key={content.id} value={content.id}>
                          {content.name}
                        </Radio>
                      ))}
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="任务描述" style={{ paddingLeft: 12 }}>
                {getFieldDecorator('remark', {
                  initialValue: data.remark ? data.remark : ''
                })(<TextArea rows={4} placeholder="请输入任务描述" style={{ marginTop: 10, resize: "none", width: '100%' }}></TextArea>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem style={{ paddingLeft: 12 }}>
                <Button type="primary" style={{ width: '40%' }} onClick={(e) => { this.validateCtrl(e, 2) }}>
                  提交
              </Button>
                <Button type="primary" style={{ width: '40%', marginLeft: '20%' }} onClick={(e) => { this.restCtrl(e, 2) }}>
                  返回
              </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  scopeListCtrl = (e) => {

    this.setState((prevState) => {
      return {
        scopeListNum: e
      }
    }, () => {
      // console.log(this.state.scopeListNum)
    })
    this.setState({
      conditionArr:[]
    })
  }

  handeleTemplate = () => {
    const { location: { query: { taskId } } } = this.props;

    if (taskId) {
      return this.isIdRenderForm();
    } else {
      return this.renderForm();
    }
  }
  componentDidMount() {
    const { dispatch, location: { query: { taskId } } } = this.props;
    //dispatch({ type: 'taskDetail/fetch' });
    dispatch({
      type: 'newTask/getGroupUserListCtrl',
    });
    if (taskId) {
      console.log(taskId)
      dispatch({
        type: 'newTask/taskDetailCtrl',
        payload: { taskId: taskId },
        callback: this.taskDetailCtrl
      });
      this.setState({
        taskId: taskId,
      })
    }
    dispatch({
      type: 'newTask/taskConfigCtrl',
    });

  }
  // 如果有taskId
  taskDetailCtrl = (data: any) => {
    if (data.code == 200) {
      this.setState({
        data: data.data.result,
        conditionArr: data.data.result.conditions,
        scopeListNum: data.data.result.scope,
      })
      //this.handleData(data.data.result.conditions);
    } else {
      // message.error(data.msg);
    }
  }

  // 提交任务
  validateCtrl = (e: any, num: Number) => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;


    validateFieldsAndScroll((error, values) => {
      if (!error) {
        for (let i in values) {
          if (values[i] == undefined) {
            values[i] = '';
          }
        }
        if (!values.name) {
          message.info('请填写活动名称');
          return;
        }
        // if(JSON.stringify(this.state.conditionArr) == '[]'){
        //   message.info('请选择触发条件');
        //   return;
        // }
        if (values.timeArray) {
          values.startTime = moment(values.timeArray[0]).format('YYYY-MM-DD');
          values.endTime = moment(values.timeArray[1]).format('YYYY-MM-DD');
          delete values.timeArray
        }
        const valuesResult = {
          ...values,
          conditions: [...this.state.conditionArr]
        }
        if (this.state.taskId) {
          valuesResult.taskId = this.state.taskId
        }
        //console.log(valuesResult);
        if (num == 1) {
          dispatch({
            type: 'newTask/createTaskCtrl',
            payload: valuesResult,
            callback: this.createTaskBack
          });
        }
        if (num == 2) {
          valuesResult.companyId = valuesResult.companyId == '全国' ? 0 : valuesResult.companyId;
          dispatch({
            type: 'newTask/updateTaskCtrl',
            payload: valuesResult,
            callback: this.createTaskBack
          });
        }

      }
    });
  }
  // 重置
  restCtrl = (e: any, num: Number) => {
    const { form, dispatch } = this.props;
    // form.resetFields();
    // this.setState({
    //   conditionArr: [],
    //   params: {}
    // });
    history.back();
  }
  // 创建任务回调
  createTaskBack = (data) => {
    if (data.code == 200) {
      message.success('提交成功');
      this.props.dispatch(routerRedux.push({
        pathname: '/task/tasklist',
      }));
      localStorage.setItem('isTask', 'isTask');
    } else {
      // message.error(data.msg)
    }
  }

  // 条件列表
  getTodoItem = () => {
    if (this.state.conditionArr) {
      return (
        this.state.conditionArr.map((item, index) => {
          return (
            <div className={styles.conditionsWrap} key={item}>
              <div className={styles.wrap}>
                <div className={styles.editBt}>
                  <div>条件{index + 1}</div>
                  <div className={styles.eidtTask} onClick={() => this.handleItemEdit(index)}>编辑</div>
                  <div className={styles.eidtTask} onClick={() => this.handleItemDelete(index)}>删除</div>
                  <div className={styles.eidtTask} onClick={() => this.handleClickEdit(index, this.state.taskId)}>绑定人员</div>
                  {/* {
                    this.state.taskId?(<div className={styles.eidtTask} onClick={() => this.handleClickEdit(index,this.state.taskId)}>分配任务</div>):null
                  } */}
                </div>
                <div className={styles.labelContet}>
                  {this.getItemContentCtrl(item.groupIds, 5)}
                  {this.getItemContentCtrl(item.channel, 1)}
                  {item.dataTimeRange ? ' 数据范围:' + item.dataTimeRange + ';' : ''}
                  {item.weddingDate ? ' 婚期范围:' + item.weddingDate + ';' : ''}
                  {item.budget ? ' 预算:' + item.budget + ';' : ''}
                  {this.getItemContentCtrl(item.activityId, 2)}
                  {item.followNum ? ' 跟进次数:' + item.followNum + '次;' : ''}
                  {this.getItemContentCtrl(item.followStatus, 3)}
                  {this.getItemContentCtrl(item.category, 4)}
                  {this.cityChangeDesc(item.cityCode)}
                  {this.getItemContentCtrl(item.status, 6)}
                  {this.getItemContentCtrl(item.phase, 7)}
                  {this.getItemContentCtrl(item.level, 8)}
                  {this.getItemContentCtrl(item.categoryLogic, 9)}
                  {this.getItemContentCtrl(item.leadsTag, 10)}
                </div>
              </div>
            </div>
          )
        })
      )
    }
  }

  cityChangeDesc(arr) {
    let areaJsonData = JSON.parse(localStorage.getItem('tempCityData'));
    let str = [];
    if (arr) {
      areaJsonData.map((i, index) => {
        arr.map((j) => {
          if (i.code == j) {
            str.push(i.name);
          }
        })
      });
      str = str.join(',');
      return '业务城市：' + str + ';';
    }
  }

  // 条件内容 客资来源匹配 ，3.15 2020，号改动 待优化
  getItemContentCtrl = (arr: any, num: any) => {
    const { newTask: { configData, getGroupUserData } } = this.props;
    let strArr = [];
    if (num == 1) {
      if (arr && arr.length > 0) {
        if (configData.leadsAttributeList) {
          let arr1 = configData.leadsAttributeList.channelList;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '客资来源:' + strArr.join(',') + ';';
      }
    }
    if (num == 2) {
      if (arr && arr.length > 0) {
        if (configData.leadsAttributeList) {
          let arr1 = configData.leadsAttributeList.activityList;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '营销任务:' + strArr.join(',') + ';';
      }
    }
    if (num == 3) {
      if (arr && arr.length > 0) {
        if (configData.leadsAttributeList) {
          let arr1 = configData.leadsAttributeList.followStatusList;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '跟进结果:' + strArr.join(',') + ';';
      }
    }
    if (num == 4) {
      if (arr && arr.length > 0) {
        if (configData.leadsAttributeList) {
          let arr1 = configData.leadsAttributeList.category;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '业务品类:' + strArr.join(',') + ';';
      }
    }
    if (num == 5) {
      if (arr && arr.length > 0) {
        if (Object.prototype.toString.call(arr) !== '[object Array]') {
          arr = arr.split(',')
        }
        if (getGroupUserData) {
          let arr1 = getGroupUserData;
          arr1.map((itme, index) => {
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '分配组:' + strArr.join(',') + ';';
      }
    }
    if (num == 6) {
      if (arr && arr.length > 0) {
        if (configData.leadsAttributeList) {
          let arr1 = configData.leadsAttributeList.statusList;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '线索状态:' + strArr.join(',') + ';';
      }
    }
    if (num == 7) {
      if (arr && arr.length > 0) {
        if (configData.customerAttributeList) {
          let arr1 = configData.customerAttributeList.phaseList;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '销售阶段:' + strArr.join(',') + ';';
      }
    }
    if (num == 8) {
      if (arr && arr.length > 0) {
        if (configData.customerAttributeList) {
          let arr1 = configData.customerAttributeList.requirementLevelList;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '有效单级别:' + strArr.join(',') + ';';
      }
    }
    if (num == 9) {
      if (arr && Object.prototype.toString.call(arr) !== '[object Array]') {
        arr = arr.toString().split(',')
      }
      if (arr && arr.length > 0) {
        
        if (configData.customerAttributeList) {
          let arr1 = configData.customerAttributeList.logicRelationList;
          arr1.map((itme, index) => {
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = '品类逻辑关系:' + strArr.join(',') + ';';
      }
    }

    if (num == 10) {
      if (arr && arr.length > 0) {
        if (configData.leadsAttributeList) {
          let arr1 = configData.leadsAttributeList.leadsTagList;
          arr1.map((itme, index) => {
            index = index + 1;
            arr.map((itme1, index1) => {
              if (itme1 == itme.id) {
                strArr.push(itme.name);
              }
            })
          });
        }
        strArr = 'Tag标签:' + strArr.join(',') + ';';
      }
    }
    return strArr ? strArr : '';

  }



  // 条件数组添加----子组件调用的方法
  dialogPropsCtrl = (obj: Object) => {
    if (this.state.editIndex != -1) {
      this.setState((prevState) => {
        const list = [...prevState.conditionArr];
        list.splice(this.state.editIndex, 1, obj);
        return { conditionArr: list }
      }, () => { })
    } else {
      this.state.conditionArr.push(obj);
      this.setState((prevState) => ({
        conditionArr: [...prevState.conditionArr],
      }), () => {
        console.log('查看条件=======', this.state.conditionArr)
      });
    }

  }
  // 添加条件按钮
  addCondationCtrl = () => {
    this.setState({
      modalVisible: true,
      params: {},
      editIndex: -1
    })
  }
  // 编辑
  handleItemEdit = (index: number) => {
    let obj = {};
    this.setState((prevState) => {
      obj = [...prevState.conditionArr][index];
      return { params: obj, modalVisible: true, editIndex: index };
    }, () => { console.log(obj) });
  }
  // 删除
  handleItemDelete(index: number) {
    const self = this;
    confirm({
      title: '请确认是否删除条件？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        self.setState((prevState) => {
          const list = [...prevState.conditionArr];
          list.splice(index, 1);
          return { conditionArr: list }
        })
      },
      onCancel() { },
    });

  }

  // 关闭浮层
  closeModalCancel = (flag: boolean) => {
    this.setState({
      modalVisible: flag,
      params: {}
    });
  }
  // 分配任务 Start 2020.3.13,7:35 改天再优化

  handleClickEdit = (index) => {
    let obj = this.state.conditionArr[index];
    let choiceDesc = this.taskGroupDescCtrl(obj.groupIds);
    console.log('obj.groupIds',obj.groupIds)
    let targetGroupId = !obj.groupIds?[]:obj.groupIds;
    if(targetGroupId){
      if (Object.prototype.toString.call(targetGroupId) !== '[object Array]') {
          targetGroupId = targetGroupId.split(',')
        }
      targetGroupId =[...new Set(targetGroupId)] ;
      targetGroupId = targetGroupId.map(Number)
    }
    
  

    // console.log('taskGroupDescCtrl(obj.groupIds)',this.taskGroupDescCtrl(obj.groupIds))
    this.setState((prevState) => {
      return { modalVisibleF: true, editIndex: index, choiceDesc: choiceDesc,targetGroupId };
    },()=>{console.log(this.state.targetGroupId)});



  }
  // 选择分配---组----人
  handleAddContactModalOk = () => {

    let index = this.state.editIndex;
    let obj = {};
    this.setState((prevState) => {
      const list = [...prevState.conditionArr];
      obj = list[index];
      if (this.state.choiceGoupId) {
        obj.groupIds = this.state.choiceGoupId.join(','); //如果是数组
        // obj.groupIds = this.state.choiceGoupId;
      }
      if (this.state.choiceUserId.length) {
        obj.ownerId = this.state.choiceUserId.join(',');
      }
      list.splice(index, 1, obj);
      return {
        modalVisibleF: false,
        conditionArr: list
      };
    });

  }
  // 分配组默认文案
  taskGroupDescCtrl = (arr) => {
    const { newTask: { configData, getGroupUserData } } = this.props;
    let strArr = [];
    if (arr && arr.length > 0) {
      if (Object.prototype.toString.call(arr) !== '[object Array]') {
        arr = arr.split(',')
      }
      if (getGroupUserData) {
        let arr1 = getGroupUserData;
        arr1.map((itme, index) => {
          arr.map((itme1, index1) => {
            if (itme1 == itme.id) {
              strArr.push(itme.name);
            }
          })
        });
      }
      strArr = strArr.join(',');
    }
    return strArr;
  }
  // 组选择 && 客户选择
  colleagueSelectChange = (e: any, num: Number) => {
    // e = e.toString();
    if (num == 1) {
      // this.setState({
      //   choiceGoupId: e,
      //   choiceUserId: ''
      // });
      //如果是多选 数组
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
      this.state.choiceUserId.push(e);
      this.setState((prevState) => {
        let list = [...new Set([...prevState.choiceUserId])]
        return {
          choiceUserId: list,
          choiceGoupId: ''
        }
      });
      // this.setState({
      //   choiceUserId: arr,
      //   choiceGoupId: '',
      // });
    }
  }

  // 关闭浮层
  handleAddContactModalCancel = () => {
    this.setState({
      modalVisibleF: false,
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
        type: 'newTask/getGroupUserListCtrl',
        payload: obj
      });
    }
    if (num == 2) {
      dispatch({
        type: 'newTask/searchUserCtrl',
        payload: obj
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


  // 分配任务 END


  render() {
    let { loading, scopeListNum } = this.state;
    const {
      newTask: { configData, searchUserData, getGroupUserData },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <PageHeaderWrapper>

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.handeleTemplate()}</div>
          </div>
        </Card>
        <NewTaskDialog scopeListNum={scopeListNum} dialogFlag={this.state.modalVisible} dialogPropsCtrl={this.dialogPropsCtrl} closeModalCancel={this.closeModalCancel} params={this.state.params} />
        <Modal
          // title="分配任务" primary
          visible={this.state.modalVisibleF}
          onOk={this.handleAddContactModalOk}
          onCancel={this.handleAddContactModalCancel}
          destroyOnClose>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
            <Button type={this.state.btTab1} onClick={e => { this.getGroupTab(e, 1) }}>
              分配组
            </Button>
            {/* <Button type={this.state.btTab2} style={{ marginLeft: 6 }} onClick={e => { this.getGroupTab(e, 2) }}>
              分配人
            </Button> */}
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
                // defaultValue={this.state.choiceDesc}
                defaultValue={this.state.targetGroupId}
                // defaultValue={[123]}
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
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<TaskListProps>()(StoreDetail);
