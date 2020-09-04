import React, { Component } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Icon, Popconfirm } from 'antd';
const { Option } = Select;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import Distribution from '../Distribution';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action, compose } from 'redux';
import { StateType, ReceiverUserData, ReceiverGroupData } from '../../model';
import { connect } from 'dva';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Data } from '@/pages/SunnyRulesManagement/RuleDetail/data';

interface RetailMarketProps extends FormComponentProps {
  form:WrappedFormUtils<any>,
  receiverUsers: ReceiverUserData[],
  receiverGroups: ReceiverGroupData[],
  editValue?: Data,
}

interface RetailMarketState {
  isReadyForEdit: boolean;
  isSkip: 0 | 1;
  dialogTab: 0 | 1;
  choiceGoupId: string[];
  choiceUserId: string[];
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
class RetailMarket extends Component<RetailMarketProps, RetailMarketState>{
  constructor(props: any) {
    super(props);
    this.state = {
      isReadyForEdit: false,
      isSkip: 0,
      choiceGoupId: [],
      choiceUserId: [],
      dialogTab: 0
    };
  }

  componentDidMount() {
    const editValue = this.props.editValue;
    if(editValue) {
      // 编辑-初始值回显-是否设置本流程
      const isSkip = editValue.is_skip == null ? 0 : editValue.is_skip;


      // 编辑-初始值回显-常规接收人类型 组/人
      const dialogTab = editValue.routine_receive_user && editValue.routine_receive_user.length > 0 ? 1 : 0;

      // 编辑-初始值回显-常规接收组+常规接收人
      const choiceGoupId =  editValue.routine_receive_group.length > 0 ? editValue.routine_receive_group.split(',') : [];
      const choiceUserId =  editValue.routine_receive_user.length > 0 ? editValue.routine_receive_user.split(',') : [];


      this.setState({
        dialogTab,
        isSkip,
        choiceGoupId,
        choiceUserId,
      }, ()=> {
        this.setState({
          isReadyForEdit:true,
        })
      });
    } else {
      this.setState({
        isReadyForEdit: true,
      })
    }
  }

  radioStyle = {
    width: 60,
    textAlign: 'center',
  };

  handleChangeSkip = (e) => {
    const value = e.target.value;
    this.setState({
      isSkip: value,
    });
  }

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
      routineUserD: data ? data : undefined,
    })
  }


  renderForm = () => {
    const { form } = this.props;
    const { receiverUsers, receiverGroups } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div >
        <FormItem label="流程开关">
          {getFieldDecorator('isSkipForOrder',
            { 
              rules: [{ required: true, message: "请选择是否设置门市流程" }], 
              initialValue: this.state.isSkip 
            })(
              <Radio.Group  buttonStyle="solid" size="small" style={{ width: '100%' }} onChange={this.handleChangeSkip}>
                <Radio.Button style={this.radioStyle} value={0} key={0}>设 置</Radio.Button>
                <Radio.Button style={this.radioStyle} value={1} key={1}>不设置</Radio.Button>
              </Radio.Group>
            )}
        </FormItem>
        {
          this.state.isSkip == 0 && (
            <>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={24}>
                  <FormItem label="常规接收人">
                  {getFieldDecorator('receiverTypeForOrder',
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
                </Col>
              </Row>

              <FormItem label="">
                {getFieldDecorator('routineUserD',
                  { rules: [{ required: true, message: "请选择常规接收人" }], initialValue: this.state.dialogTab == 0 ? (this.state.choiceGoupId.length > 0 ? this.state.choiceGoupId : undefined) : (this.state.choiceUserId.length > 0 ? this.state.choiceUserId : undefined) })(
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
                  {getFieldDecorator('routineReceiveUserC',
                    { rules: [{ required: false, message: "接收人" }], initialValue: this.state.choiceUserId })(
                      <Input />
                    )}
                </FormItem>
                <FormItem label="接收组">
                  {getFieldDecorator('routineReceiveGroupC',
                    { rules: [{ required: false, message: "接收组" }], initialValue: this.state.choiceGoupId })(
                      <Input />
                    )}
                </FormItem>
              </div>
            </>
          )
        }
        

      </div>
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
export default Form.create<RetailMarketProps>()(RetailMarket);