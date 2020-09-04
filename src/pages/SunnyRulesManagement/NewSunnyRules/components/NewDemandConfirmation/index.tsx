import React, { Component } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Icon, Popconfirm } from 'antd';
const { Option } = Select;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action, compose } from 'redux';
import { StateType, ReceiverUserData, ReceiverGroupData } from '../../model';
import { connect } from 'dva';
import styles from '../../index.less';
import Distribution from '../Distribution';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Data } from '@/pages/SunnyRulesManagement/RuleDetail/data';
import { ConfigListItem } from '@/pages/CustomerManagement/commondata';
interface NewDemandConfirmationProps {
  dispatch: Dispatch<any>;
  form: WrappedFormUtils<any>;
  receiverUsers: ReceiverUserData[];
  receiverGroups: ReceiverGroupData[];
  editValue?: Data;
}

interface NewDemandConfirmationState {
  isReadyForEdit: boolean;
  checkedList: number[];
  indeterminate: boolean;
  checkAll: boolean;
  dialogTab: 0 | 1;
  choiceGoupId: any[];
  choiceUserId: any[];
  plainOptions: any[];
  isSkip: 0 | 1;
  initialIsInvites: 0 | 1;
  setUpCtrlId:0 | 1;
  initialIsDistribute: 0 | 1;
  channelsByCompanyId: ConfigListItem[][];
  initialDistributeChannelList: number[][];
}
@connect(
  ({
    newRuleModel,
    loading,
  }: {
    newRuleModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newRuleModel,
    loading: loading.models.newRuleModel,
  }),
)

class NewDemandConfirmation extends Component<NewDemandConfirmationProps, NewDemandConfirmationState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isReadyForEdit: false,
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      dialogTab: 0,
      choiceGoupId: [],
      choiceUserId: [],
      plainOptions: [],
      isSkip: 0,
      setUpCtrlId:1,
      initialIsInvites:0,
      initialIsDistribute: 1,
      channelsByCompanyId:[],
      initialDistributeChannelList: [],
    };
  }

  componentDidMount() {
    const editValue = this.props.editValue;
    if (editValue) {
      // 编辑-初始值回显-是否跳过
      const isSkip = editValue.is_skip;

      // 编辑-初始值回显-常规接收人类型 组/人
      const dialogTab = editValue.routine_receive_user && editValue.routine_receive_user.length > 0 ? 1 : 0;

      // 编辑-初始值回显-常规接收组+常规接收人
      const choiceGoupId =  editValue.routine_receive_group.length > 0 ? editValue.routine_receive_group.split(',') : [];
      const choiceUserId =  editValue.routine_receive_user.length > 0 ? editValue.routine_receive_user.split(',') : [];

      // 编辑-初始值回显-指定邀约
      const initialIsInvites = editValue.is_invite;

      // 编辑-初始值回显-派发公司
      // 编辑-初始值回显-是否设置派发公司
      const initialIsDistribute = editValue.is_distribute;
      const setUpCtrlId = editValue.is_distribute;
      
      const {dispatch} = this.props;
      const checkedListStr = editValue.distribute_company_id.split(',');
      const checkedList: number[] = [];
      
      checkedListStr.map(item => {
        checkedList.push(parseInt(item));
        dispatch({
          type: 'newRuleModel/getChannelsByAll',
          payload: { companyId: item, isAll: 1 },
          callback: (success: boolean, channels: ConfigListItem[]) => {
            const {channelsByCompanyId} = this.state;
            channelsByCompanyId[item.toString()] = channels;
            this.setState({channelsByCompanyId});
          }
        });
      })
      dispatch({
        type: 'newRuleModel/newDemandConfirmationCtrl',
        payload: {obj:checkedList}
      });

      // // 编辑-初始值回显-派发公司对应的渠道
      const distributeChannelList = editValue.distribute_channel_list;
      const initialDistributeChannelList = new Array();
      distributeChannelList && distributeChannelList.map(channelCompanyPair => {
        initialDistributeChannelList[channelCompanyPair.distribute_company_id] = channelCompanyPair.distribute_channel_id;
      })

      this.setState({
        dialogTab,
        choiceGoupId,
        choiceUserId,
        isSkip,
        initialIsDistribute,
        setUpCtrlId,
        initialIsInvites,
        checkedList,
        initialDistributeChannelList,
      },()=>{
        this.setState({
          isReadyForEdit: true,
        })
      })
    } else {
      this.setState({
        isReadyForEdit: true,
      })
    }
  }

  // 派发公司 Start
  onChange = (e) => {
    const { dispatch } = this.props;
    const value = e.target.value;
    const isChecked: boolean = e.target.checked;
    let list = [...this.state.checkedList];
    if (list.indexOf(value) > -1) {
      let index = list.indexOf(value);
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    this.setState({
      checkedList: list,
      indeterminate: !!list.length && list.length < this.state.plainOptions.length,
      checkAll: list.length === this.state.plainOptions.length,
    });
    dispatch({
      type: 'newRuleModel/newDemandConfirmationCtrl',
      payload: { obj: list }
    });

    const {channelsByCompanyId} = this.state;
    if(isChecked && !channelsByCompanyId[value.toString()]) {
      dispatch({
        type: 'newRuleModel/getChannelsByAll',
        payload: { companyId: value, isAll: 1 },
        callback: (success: boolean, channels: ConfigListItem[]) => {
          channelsByCompanyId[value.toString()] = channels;
          this.setState({channelsByCompanyId});
        }
      });
    } else {

    }
    
  };

  onCheckAllChange = e => {
    const { dispatch } = this.props;
    this.setState({
      checkedList: e.target.checked ? this.state.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
    this.props.form.setFieldsValue({
      distributeCompanyIdA: e.target.checked ? this.state.plainOptions : [],
    });
    let obj = e.target.checked ? this.state.plainOptions : []
    dispatch({
      type: 'newRuleModel/newDemandConfirmationCtrl',
      payload: { obj: obj }
    });

  };
  // 派发公司 END
  radioStyle = {
    width: 60,
    textAlign: 'center',
  };
  // 切换组和人
  choicePerson = (e: any) => {
    let value = e.target.value;
    console.log(value)
    this.setState({
      dialogTab: value,
    })
  }
  // 选择组和人
  dataChoiceCtrl = (data: any, tab: any) => {
    if (tab == 0) {
      this.setState({
        choiceGoupId: data,
      });
    }
    if (tab == 1) {
      this.setState({
        choiceUserId: data,
      });
    }
    this.props.form.setFieldsValue({
      routineUserB: data ? data : undefined,
    })
  }
  skipCtrl = (e) => {
    const value = e.target.value;
    this.setState({
      isSkip: value,
    });

  }
  setUpCtrl = (e) => {
    const { dispatch } = this.props;
    const value = e.target.value;
    this.setState({
      setUpCtrlId: value,
    });
    if(value == 0){
      
      this.setState({
        checkedList: [],
      },()=>{
        dispatch({
          type: 'newRuleModel/newDemandConfirmationCtrl',
          payload: { obj: [] }
        });
      })
    }
    

  }
  
  renderForm = () => {
    const { form, newRuleModel: { distributeCompany, newInvitationArr }, receiverUsers, receiverGroups } = this.props;

    const { getFieldDecorator } = form;
    if(!distributeCompany) {
      return null;
    }
    let arr = distributeCompany?.flatMap((item) => {
      return item.id;
    })

    this.state.plainOptions = arr;
    distributeCompany?.map((i) => {
      i.isFlag = false;
      newInvitationArr.map((j) => {
        if (i.id == j) {
          i.isFlag = true
        }
      })
    });

    return (
      <>
        <FormItem label="跳过需求">
          {getFieldDecorator('isSkip',
            {
              rules: [{ required: true, message: "跳过需求" }],
              initialValue: this.state.isSkip
            })(
              <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }} onChange={this.skipCtrl}>
                <Radio.Button style={this.radioStyle} value={1} key={1}>跳 过</Radio.Button>
                <Radio.Button style={this.radioStyle} value={0} key={0}>不跳过</Radio.Button>
              </Radio.Group>
            )}
        </FormItem>
        {this.state.isSkip == 0 && (
          <>
            <FormItem label="常规接收人">
              {getFieldDecorator('receiverTypeForDemand',
                {
                  rules: [{ required: true }],
                  initialValue: this.state.dialogTab 
                })(
                  <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }} onChange={this.choicePerson}>
                    <Radio.Button style={this.radioStyle} value={0} key={0}>按组名</Radio.Button>
                    <Radio.Button style={this.radioStyle} value={1} key={1}>按人名</Radio.Button>
                  </Radio.Group>
                )}
            </FormItem>
            <FormItem label="">
              {getFieldDecorator('routineUserB',
                { rules: [{ required: this.state.isSkip==0, message: "请选择常规接收人" }], initialValue: this.state.dialogTab == 0 ? (this.state.choiceGoupId.length > 0 ? this.state.choiceGoupId : undefined) : (this.state.choiceUserId.length > 0 ? this.state.choiceUserId : undefined) })(
                  <Distribution
                    tab={this.state.dialogTab}
                    dataCtrl={this.dataChoiceCtrl}
                    receiverUsers={receiverUsers}
                    receiverGroups={receiverGroups}
                    valueUsers={this.state.choiceUserId ? this.state.choiceUserId : []}
                    valueGroups={this.state.choiceGoupId ? this.state.choiceGoupId : []}
                  />
                )}
            </FormItem>
            <div hidden={true}>
              <FormItem label="接收人">
                {getFieldDecorator('routineReceiveUserA',
                  { rules: [{ required: false, message: "接收人" }], initialValue: this.state.choiceUserId })(
                    <Input />
                  )}
              </FormItem>
              <FormItem label="接收组">
                {getFieldDecorator('routineReceiveGroupA',
                  { rules: [{ required: false, message: "接收组" }], initialValue: this.state.choiceGoupId })(
                    <Input />
                  )}
              </FormItem>
            </div>

            <FormItem label="指定邀约">
              {getFieldDecorator('isInviteA',
                { 
                  rules: [{ required: false, message: "指定邀约" }], 
                  initialValue: this.state.initialIsInvites 
                })(
                  <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }}>
                    <Radio.Button style={this.radioStyle} value={1} key={1}>指 定</Radio.Button>
                    <Radio.Button style={this.radioStyle} value={0} key={0}>不指定</Radio.Button>
                  </Radio.Group>
                )}
            </FormItem>
            <FormItem label="派发公司">
              {getFieldDecorator('isDistributeA',
                { 
                  rules: [{ required: false, message: "派发公司" }], 
                  initialValue: this.state.initialIsDistribute
                })(
                  <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }} onChange={this.setUpCtrl}>
                    <Radio.Button style={this.radioStyle} value={1} key={1}>设 置</Radio.Button>
                    <Radio.Button style={this.radioStyle} value={0} key={0}>不设置</Radio.Button>
                  </Radio.Group>
                )}
            </FormItem>

            {this.state.setUpCtrlId == 1 && (
              <FormItem>
                {/* <Checkbox
                  onChange={this.onCheckAllChange}
                  indeterminate={this.state.indeterminate}
                  checked={this.state.checkAll}
                >
                  全选
                    </Checkbox> */}
                {getFieldDecorator('distributeCompanyIdA',
                  {
                    rules: [{ required: false, message: "派发公司" }],
                    initialValue: this.state.checkedList
                  })(
                    <Checkbox.Group >
                      {
                        distributeCompany.map((item) => (
                          <Checkbox
                            key={item.id}
                            value={item.id}
                            onChange={this.onChange}
                            disabled={item.isFlag}
                          >
                            {item.name}
                          </Checkbox>
                        ))
                      }
                    </Checkbox.Group>
                  )}
              </FormItem>
            )}
            {
              this.state.checkedList && this.state.checkedList.length > 0 && this.state.checkedList.map((checkedCompanyId,index) => {
                if(this.state.checkedList.indexOf(checkedCompanyId) >= 0 && this.state.channelsByCompanyId[checkedCompanyId]) {
                  const companyNameFilter = distributeCompany.filter((company:{id:number, name:string}, index) => company.id == checkedCompanyId)
                  if(companyNameFilter && companyNameFilter[0]) {
                    const companyName =companyNameFilter[0].name;
                    return (
                      <FormItem label={companyName+"渠道"}>
                        {getFieldDecorator('distributeChannelId'+checkedCompanyId,
                          { 
                            rules: [{ required: true, message: "请选择"+companyName+"的派发渠道" }], 
                            initialValue: this.state.initialDistributeChannelList && this.state.initialDistributeChannelList[checkedCompanyId] ? this.state.initialDistributeChannelList[checkedCompanyId] : undefined
                          })(
                            <Select
                              placeholder={"请选择"+companyName+"渠道"}
                            >
                              {
                                this.state.channelsByCompanyId[checkedCompanyId.toString()].map((channel: ConfigListItem) => (
                                  <Option value={channel.value} key={channel.value}>{channel.label}</Option>
                                ))
                              }
                              
                            </Select>
                          )}
                      </FormItem>
                    )
                  } else {
                    return null;
                  }
                } else {
                  return null;
                }
              })
            }
          </>
        )}

      </>
    )
  }

  render() {
    const {isReadyForEdit} = this.state;
    if(!isReadyForEdit) {
      return null;
    }
    return this.renderForm();
  }
}
export default Form.create<NewDemandConfirmationProps>()(NewDemandConfirmation);