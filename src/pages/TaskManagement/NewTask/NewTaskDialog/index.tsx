import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber } from 'antd';
import { StateType } from '../model';
import { Action } from 'redux';
import moment from 'moment';
import { connect } from 'dva';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import styles from '../index.less';
import { values } from 'lodash';
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;


function disabledDate(current: any) {
  // Can not select days before today and today
  return current && current < moment(new Date(moment('2019-01-01').format('YYYY-MM-DD')))

}

interface TaskDialogProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<any>
  >;
  loading: boolean;
  newTask: StateType;
}
interface ContactState {
  resetArea: boolean;
  province: string;
  city: string;
  district: string;
  cityCode: string;
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
class NewTaskDialog extends Component<TaskDialogProps, ContactState> {
  state: ContactState = {
    resetArea: false,
    province: '',
    city: '',
    district: '',
    cityCode: ''
  }
  componentDidMount() {
    const { dispatch } = this.props;
  }
  handleAddContactModalOk = () => {
    const { dispatch, form, dialogPropsCtrl, params } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      for (let i in values) {
        if (values[i] == undefined) {
          values[i] = '';
        }
      }

      if (values.weddingDate !== '') {
        let startTime = moment(values.weddingDate[0]).format('YYYY-MM-DD');
        let endTime = moment(values.weddingDate[1]).format('YYYY-MM-DD');
        values.weddingDate = startTime + '~' + endTime;
      }

      if (values.dataTimeRange !== '') {
        let startTime = moment(values.dataTimeRange[0]).format('YYYY-MM-DD');
        let endTime = moment(values.dataTimeRange[1]).format('YYYY-MM-DD');
        values.dataTimeRange = startTime + '~' + endTime;
      }
      // console.log('values.cityCode[0]',values.cityCode[0])
      // console.log('params.cityCode',params.cityCode)
      if (params.cityCode == undefined) {
        values.cityCode = values.cityCode ? values.cityCode[0] : '';
      }
      if (values.cityCode[0] == undefined) {
        values.cityCode = params.cityCode;
      }
      if (Object.prototype.toString.call(values.cityCode ? values.cityCode[0] : '') === '[object Array]' && params.cityCode != undefined && values.cityCode[0] != undefined) {
        values.cityCode = values.cityCode ? values.cityCode[0] : '';
      }
      if (params.groupIds) {
        values.groupIds = params.groupIds;
      }



      // values.cityCode = values.cityCode[0];
      if (values.payStart && values.payEnd) {
        values.budget = values.payStart + '~' + values.payEnd;
      }
      if (!values.payStart && values.payEnd) {
        values.budget = 0 + '~' + values.payEnd;
      }
      if (values.payStart && !values.payEnd) {
        values.budget = values.payStart + '~' + 0;
      }
      if (!values.payStart && !values.payEnd) {
        values.budget = 0;
      }
      delete values.payStart;
      delete values.payEnd;

      const valuesResult = {
        ...values,
      }
      dialogPropsCtrl(valuesResult);
      this.handleAddContactModalCancel();
    });

  }

  handleAddContactModalCancel = () => {
    const { closeModalCancel } = this.props;
    closeModalCancel(false)
  }
  citySelectChange = (codes: string) => {
    this.setState({
      //   province: province,
      //   city: city,
      //   district: district,
      cityCode: codes
    })
  };
  formatDefaultInput = (obj: any, config: any, num: number) => {
    let defaultArr = [];
    if (num == 1) {
      let arr1 = config.leadsAttributeList.channelList;
      arr1.map((itme, index) => {
        index = index + 1;
        obj.map((itme1, index1) => {
          if (itme1 == index) {
            defaultArr.push(index);
          }
        })
      })
    }
    return defaultArr;
  }


  // initialValue: this.formatDefaultInput(params.channel,configData,1)
  render() {
    const {
      newTask: { configData },
      form: { getFieldDecorator },
      dialogFlag,
      params,
      scopeListNum
    } = this.props;
    if (JSON.stringify(params) == '{}') {
      return (
        <Modal
          title="添加执行条件"
          visible={dialogFlag}
          onOk={() => { this.handleAddContactModalOk(1) }}
          onCancel={this.handleAddContactModalCancel}
          destroyOnClose={true}>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>数据范围</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('dataTimeRange', {
              })(
                <RangePicker
                  disabledDate={disabledDate}
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: 300 }} />
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>客资来源</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('channel')(
                <Select placeholder="请选择客资来源"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.channelList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>婚期范围</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('weddingDate', {
              })(
                <RangePicker
                  ranges={{
                    '本周': [moment().startOf('week'), moment().endOf('week')],
                  }}
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: 300 }} />
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>预算</p>
            <div style={{ marginTop: -2 }}>
              <InputGroup compact style={{ width: 300 }}>
                {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', }} />)}
                <Input
                  style={{
                    width: '20%',
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                    color: '#4a4a4a'
                  }}
                  placeholder="~"
                  disabled
                />
                {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', borderLeft: 0 }} />)}
              </InputGroup>
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>活动名称</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('activityId')(
                <Select placeholder="选择活动名称"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.activityList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>跟进次数</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('followNum')(<Input placeholder="跟进次数" min={0} style={{ width: 300, }} />)}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>跟进结果</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('followStatus')(
                <Select placeholder="选择跟进结果"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.followStatusList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,

              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>业务城市</p>
            <div style={{ marginTop: -2, width: '64%' }}>
              {getFieldDecorator('cityCode', {
                trigger: 'citySelectChange',
                getValueFromEvent: (...rest) => {
                  return rest
                }
              })(
                <CityMultipleSelect placeholder="选择业务城市" reset={this.state.resetArea} />
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>业务品类</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('category')(
                <Select placeholder="选择业务品类"
                  mode="multiple"
                  style={{ width: 200 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.categoryList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('categoryLogic')(
                <Select placeholder="品类关系"
                  style={{ width: 100 }}
                  optionLabelProp="label">
                  {configData.customerAttributeList && configData.customerAttributeList.logicRelationList && configData.customerAttributeList.logicRelationList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>

          {
            scopeListNum == 1 ?
              (<div className={styles.rt_content}>
                <p className={styles.labelName}>线索状态</p>
                <div style={{ marginTop: -2 }}>
                  {getFieldDecorator('status')(
                    <Select placeholder="选择线索状态"
                      mode="multiple"
                      style={{ width: 300 }}
                      optionLabelProp="label">
                      {configData.leadsAttributeList && configData.leadsAttributeList.statusList?.map(item => {
                        return <Option value={item.id} label={item.name}>
                          {item.name}
                        </Option>
                      })}
                    </Select>,
                  )}
                </div>
              </div>) :
              (<div className={styles.rt_content}>
                <p className={styles.labelName}>销售阶段</p>
                <div style={{ marginTop: -2 }}>
                  {getFieldDecorator('phase')(
                    <Select placeholder="选择销售阶段"
                      mode="multiple"
                      style={{ width: 300 }}
                      optionLabelProp="label">
                      {configData && configData.customerAttributeList && configData.customerAttributeList.phaseList?.map(item => {
                        return <Option value={item.id} label={item.name}>
                          {item.name}
                        </Option>
                      })}
                    </Select>,
                  )}
                </div>
              </div>)
          }

          <div className={styles.rt_content}>
            <p className={styles.labelName}>有效单级别</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('level')(
                <Select placeholder="选择有效单级别"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.customerAttributeList && configData.customerAttributeList.requirementLevelList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          {
            scopeListNum == 1 ?
              (
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>Tag标签</p>
                  <div style={{ marginTop: -2 }}>
                    {getFieldDecorator('leadsTag')(
                      <Select placeholder="请选择Tag标签"
                        mode="multiple"
                        style={{ width: 300 }}
                        optionLabelProp="label">
                        {configData.leadsAttributeList && configData.leadsAttributeList.leadsTagList?.map(item => {
                          return <Option value={item.id} label={item.name}>
                            {item.name}
                          </Option>
                        })}
                      </Select>,
                    )}
                  </div>
                </div>
              ) : null
          }
        </Modal>
      );
    } else {
      // 这是编辑的
      console.log('params', params)
      if (Object.prototype.toString.call(params.cityCode) === '[object Array]') {
        params.cityCode.map((value, index) => {
          params.cityCode[index] = value?.toString();
        });

      }
      return (
        <Modal
          title="添加执行条件"
          visible={dialogFlag}
          onOk={() => { this.handleAddContactModalOk(2) }}
          onCancel={this.handleAddContactModalCancel}
          destroyOnClose={true}>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>数据范围</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('dataTimeRange', {
                initialValue: params.dataTimeRange ? [moment(params.dataTimeRange.split('~')[0], dateFormat), moment(params.dataTimeRange.split('~')[1], dateFormat)] : ''
              })(
                <RangePicker
                  disabledDate={disabledDate}
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: 300 }} />
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>客资来源</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('channel', { initialValue: params.channel ? params.channel : [] })(
                <Select placeholder="请选择客资来源"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.channelList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>婚期范围</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('weddingDate',
                {
                  initialValue: params.weddingDate ? [moment(params.weddingDate.split('~')[0], dateFormat), moment(params.weddingDate.split('~')[1], dateFormat)] : ''
                })(
                  <RangePicker
                    ranges={{ '本周': [moment().startOf('week'), moment().endOf('week')], }}
                    format={dateFormat}
                    placeholder={['开始日期', '结束日期']}
                    style={{ width: 300 }} />
                )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>预算</p>
            <div style={{ marginTop: -2 }}>
              <InputGroup compact style={{ width: 300 }}>
                {getFieldDecorator('payStart', { initialValue: params.budget ? params.budget.split('~')[0] : '' })(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', }} />)}
                <Input
                  style={{
                    width: '20%',
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                    color: '#4a4a4a'
                  }}
                  placeholder="到"
                  disabled
                />
                {getFieldDecorator('payEnd', { initialValue: params.budget ? params.budget.split('~')[1] : '' })(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', borderLeft: 0 }} />)}
              </InputGroup>
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>活动名称</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('activityId', { initialValue: params.activityId ? params.activityId : [] })(
                <Select placeholder="活动名称"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.activityList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>跟进次数</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('followNum', { initialValue: params.followNum ? params.followNum : '' })(<Input placeholder="跟进次数" min={0} style={{ width: 300, }} />)}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>跟进结果</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('followStatus', { initialValue: params.followStatus ? params.followStatus : [] })(
                <Select placeholder="跟进结果"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.followStatusList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>业务城市</p>
            <div style={{ marginTop: -2, width: '64%' }}>
              {getFieldDecorator('cityCode', {
                trigger: 'citySelectChange',
                getValueFromEvent: (...rest) => {
                  return rest
                }
              })(
                <CityMultipleSelect reset={this.state.resetArea} selectedCodes={params.cityCode ? params.cityCode : []} />
              )}
            </div>
          </div>
          <div className={styles.rt_content}>
            <p className={styles.labelName}>业务品类</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('category', { initialValue: params.category ? params.category : [] })(
                <Select placeholder="业务品类"
                  mode="multiple"
                  style={{ width: 200 }}
                  optionLabelProp="label">
                  {configData.leadsAttributeList && configData.leadsAttributeList.categoryList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('categoryLogic', { initialValue: params.categoryLogic ? params.categoryLogic : '' })(
                <Select placeholder="品类关系"
                  style={{ width: 100 }}
                  optionLabelProp="label">
                  {configData.customerAttributeList && configData.customerAttributeList.logicRelationList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          {
            scopeListNum == 1 ?
              (<div className={styles.rt_content}>
                <p className={styles.labelName}>线索状态</p>
                <div style={{ marginTop: -2 }}>
                  {getFieldDecorator('status', { initialValue: params.status ? params.status : [] })(
                    <Select placeholder="选择线索状态"
                      mode="multiple"
                      style={{ width: 300 }}
                      optionLabelProp="label">
                      {configData.leadsAttributeList && configData.leadsAttributeList.statusList?.map(item => {
                        return <Option value={item.id} label={item.name}>
                          {item.name}
                        </Option>
                      })}
                    </Select>,
                  )}
                </div>
              </div>) :
              (<div className={styles.rt_content}>
                <p className={styles.labelName}>销售阶段</p>
                <div style={{ marginTop: -2 }}>
                  {getFieldDecorator('phase', { initialValue: params.phase ? params.phase : [] })(
                    <Select placeholder="选择销售阶段"
                      mode="multiple"
                      style={{ width: 300 }}
                      optionLabelProp="label">
                      {configData && configData.customerAttributeList && configData.customerAttributeList.phaseList?.map(item => {
                        return <Option value={item.id} label={item.name}>
                          {item.name}
                        </Option>
                      })}
                    </Select>,
                  )}
                </div>
              </div>)

          }
          <div className={styles.rt_content}>
            <p className={styles.labelName}>有效单级别</p>
            <div style={{ marginTop: -2 }}>
              {getFieldDecorator('level', { initialValue: params.level ? params.level : [] })(
                <Select placeholder="选择有效单级别"
                  mode="multiple"
                  style={{ width: 300 }}
                  optionLabelProp="label">
                  {configData.customerAttributeList && configData.customerAttributeList.requirementLevelList?.map(item => {
                    return <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  })}
                </Select>,
              )}
            </div>
          </div>
          {
            scopeListNum == 1 ?
              (
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>Tag标签</p>
                  <div style={{ marginTop: -2 }}>
                    {getFieldDecorator('leadsTag', { initialValue: params.leadsTag ? params.leadsTag : [] })(
                      <Select placeholder="请选择Tag标签"
                        mode="multiple"
                        style={{ width: 300 }}
                        optionLabelProp="label">
                        {configData.leadsAttributeList && configData.leadsAttributeList.leadsTagList?.map(item => {
                          return <Option value={item.id} label={item.name}>
                            {item.name}
                          </Option>
                        })}
                      </Select>,
                    )}
                  </div>
                </div>
              ) : null
          }
        </Modal>
      );
    }
  };
}
export default Form.create<TaskDialogProps>()(NewTaskDialog);
