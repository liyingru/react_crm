import React, { Component } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Icon, Popconfirm } from 'antd';
const { Option } = Select;
const InputGroup = Input.Group;
const { confirm } = Modal;
const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action, compose } from 'redux';
import { StateType, ReceiverUserData, ReceiverGroupData } from '../../model';
import { connect } from 'dva';
import Distribution from '../Distribution';

import styles from './index.less';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Data } from '@/pages/SunnyRulesManagement/RuleDetail/data';
interface NewInvitationProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  form:WrappedFormUtils<any>;
  receiverUsers: ReceiverUserData[];
  receiverGroups: ReceiverGroupData[];
  editValue?: Data;
}

interface NewInvitationState {
  isReadyForEdit: boolean;
  isSkip: 0 | 1;
  dialogTab: 0 | 1;
  choiceGoupId: any[];
  choiceUserId: any[];
  initialIsDistribute: 0 | 1;
  checkedList: any[];
  initialIsCutomerGrade: 0 | 1;
  initialCustomersGradeA: any[];
  initialCustomersGradeB: any[];
  initialCustomersGradeC: any[];
  initialCustomersGradeD: any[];
  setUpCtrlId: 1;
  isCustomerCtrlId: 0 | 1;
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

class NewInvitation extends Component<NewInvitationProps, NewInvitationState>{
  constructor(props: any) {
    super(props);
    this.state = {
      isReadyForEdit: false,
      isSkip: 0,
      checkedList: [],
      initialIsDistribute: 1,
      checkAll: false,
      dialogTab: 0,
      choiceGoupId: [],
      choiceUserId: [],
      plainOptions: [],
      setUpCtrlId: 1,
      isCustomerCtrlId: 1,
      initialIsCutomerGrade: 1,
      initialCustomersGradeA: [],
      initialCustomersGradeB: [],
      initialCustomersGradeC: [],
      initialCustomersGradeD: [],
    };
  }
  setUpCtrl = (e) => {
    const {dispatch} = this.props;
    const value = e.target.value;
    this.setState({
      setUpCtrlId: value,
    });
    if(value == 0){
      this.setState({
        checkedList: [],
      },()=>{
        dispatch({
          type: 'newRuleModel/newInvitationCtrl',
          payload: { obj: [] }
        });
      })
     
    }
    
  }
  isCustomerCtrl = (e) => {
    const value = e.target.value;
    this.setState({
      isCustomerCtrlId: value,
    });

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

      // 编辑-初始值回显-客户级别
      const initialIsCutomerGrade = editValue.is_customer_grade;
      const isCustomerCtrlId = editValue.is_customer_grade;
      const initialCustomersGradeA = editValue.grade_a && editValue.grade_a.length > 0 ? editValue.grade_a.split(',') : [];
      const initialCustomersGradeB = editValue.grade_b && editValue.grade_b.length > 0 ? editValue.grade_b.split(',') : [];
      const initialCustomersGradeC = editValue.grade_c && editValue.grade_c.length > 0 ? editValue.grade_c.split(',') : [];
      const initialCustomersGradeD = editValue.grade_d && editValue.grade_d.length > 0 ? editValue.grade_d.split(',') : [];

      // 编辑-初始值回显-派发公司
      // 2020-4-11  把邀约人的派发公司去掉了，只保留需求确认人的派发公司 
      /*
      const initialIsDistribute = editValue.is_distribute;
      const setUpCtrlId = editValue.is_distribute;
      const checkedListStr = editValue.distribute_company_id.split(',');
      const checkedList = [];
      checkedListStr.map(item=>{
        checkedList.push(parseInt(item));
      })
      const {dispatch} = this.props;
      dispatch({
        type: 'newRuleModel/newInvitationCtrl',
        payload: {obj:checkedList}
      });
      */

      this.setState({
        isSkip,
        dialogTab,
        choiceGoupId,
        choiceUserId,
        isCustomerCtrlId,
        initialIsCutomerGrade,
        initialCustomersGradeA,
        initialCustomersGradeB,
        initialCustomersGradeC,
        initialCustomersGradeD,
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

  /**
   * 是否跳过本流程设置
   */
  handleChangeSkip = (e) => {
    const value = e.target.value;
    this.setState({
      isSkip: value,
    });
  }

  // 派发公司 Start
  /*
  onChangeDistributeCompany = (e) => {
    const { dispatch } = this.props;
    const value = e.target.value;
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
      type: 'newRuleModel/newInvitationCtrl',
      payload: { obj: list }
    });
  };
  */

  // 派发公司 END
  radioStyle = {
    width: 60,
    textAlign: 'center',
  };
  // 切换组和人
  choicePerson = (e: any) => {
    let value = e.target.value;
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
      routineUserC: data ? data : undefined,
    })
  }



  renderForm = () => {
    const { form, newRuleModel: { distributeCompany, searchUserData, newDemandConfirmationArr }, receiverUsers, receiverGroups } = this.props;
    const { getFieldDecorator } = form;
    if(!distributeCompany) {
      return null;
    }
    let arr = distributeCompany.flatMap((item) => {
      return item.id;
    })
    this.state.plainOptions = arr;

    distributeCompany.map((i)=>{
      i.isFlag = false;
      newDemandConfirmationArr.map((j) => {
        if (i.id == j) {
          i.isFlag = true
        }
      })
    });

    return (
      <>
        <FormItem label="流程开关">
          {getFieldDecorator('isSkipForInvitation',
            { 
              rules: [{ required: true, message: "请选择是否设置邀约流程" }], 
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
            <FormItem label="常规接收人">
            {getFieldDecorator('receiverTypeForInvitation',
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
              {getFieldDecorator('routineUserC',
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
                {getFieldDecorator('routineReceiveUserB',
                  { rules: [{ required: false, message: "接收人" }], initialValue: this.state.choiceUserId })(
                    <Input />
                  )}
              </FormItem>
              <FormItem label="接收组">
                {getFieldDecorator('routineReceiveGroupB',
                  { rules: [{ required: false, message: "接收组" }], initialValue: this.state.choiceGoupId })(
                    <Input />
                  )}
              </FormItem>
            </div>

            <FormItem label="客户级别">
              {getFieldDecorator('isCustomerGrade',
                { 
                  rules: [{ required: true, message: "客户级别" }] ,
                  initialValue:this.state.initialIsCutomerGrade
                })(
                  <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }} onChange={this.isCustomerCtrl}>
                    <Radio.Button style={this.radioStyle} value={1} key={1}>设 置</Radio.Button>
                    <Radio.Button style={this.radioStyle} value={0} key={0}>不设置</Radio.Button>
                  </Radio.Group>
                )}
            </FormItem>
            <div hidden={!this.state.isCustomerCtrlId}>
            <FormItem label="A级">
              {getFieldDecorator('gradeA',
                { 
                  rules: [{ required: false, message: "客户级别" }],
                  initialValue: this.state.initialCustomersGradeA,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: 300 }}
                    optionLabelProp="label">
                    {searchUserData.length > 0 && searchUserData.map(item => {
                      return <Option value={item.id+""} label={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    })}
                  </Select>,
                )}
            </FormItem>
            <FormItem label="B级">
              {getFieldDecorator('gradeB',
                { 
                  rules: [{ required: false, message: "客户级别" }],
                  initialValue: this.state.initialCustomersGradeB,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: 300 }}
                    optionLabelProp="label">
                    {searchUserData.length > 0 && searchUserData.map(item => {
                      return <Option value={item.id+""} label={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    })}
                  </Select>,
                )}
            </FormItem>
            <FormItem label="C级">
              {getFieldDecorator('gradeC',
                { 
                  rules: [{ required: false, message: "客户级别" }],
                  initialValue: this.state.initialCustomersGradeC,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: 300 }}
                    optionLabelProp="label">
                    {searchUserData.length > 0 && searchUserData.map(item => {
                      return <Option value={item.id+""} label={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    })}
                  </Select>,
                )}
            </FormItem>
            <FormItem label="D级">
              {getFieldDecorator('gradeD',
                { 
                  rules: [{ required: false, message: "客户级别" }],
                  initialValue: this.state.initialCustomersGradeD,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: 300 }}
                    optionLabelProp="label">
                    {searchUserData.length > 0 && searchUserData.map(item => {
                      return <Option value={item.id+""} label={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    })}
                  </Select>,
                )}
            </FormItem>
            </div>
            {/* // 2020-4-11  把邀约人的派发公司去掉了，只保留需求确认人的派发公司 */}
            {false && (
              <FormItem label="派发公司">
                {getFieldDecorator('isDistributeB',
                  { 
                    rules: [{ required: true, message: "派发公司" }],
                    initialValue: this.state.initialIsDistribute 
                  })(
                    <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }} onChange={this.setUpCtrl}>
                      <Radio.Button style={this.radioStyle} value={1} key={1}>设 置</Radio.Button>
                      <Radio.Button style={this.radioStyle} value={0} key={0}>不设置</Radio.Button>
                    </Radio.Group>
                  )}
              </FormItem>
            )}
            {false && this.state.setUpCtrlId == 1 && (  
              <FormItem>
                {getFieldDecorator('distributeCompanyIdB',
                  { rules: [{ required: false, message: "派发公司" }],initialValue: this.state.checkedList })(
                    <Checkbox.Group >
                      {
                        distributeCompany.map((item, index) => (
                          <Checkbox
                            key={item.id}
                            value={item.id}
                            onChange={this.onChangeDistributeCompany}
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
export default Form.create<NewInvitationProps>()(NewInvitation);