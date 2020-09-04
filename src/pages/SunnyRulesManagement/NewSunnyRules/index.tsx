import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect, ReactNode } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Icon, Popconfirm, Anchor, Spin, Empty, Alert } from 'antd';
import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import { StateType } from './model';
import styles from './index.less';
import { connect } from 'dva';
import NewTaskDialog from './NewTaskDialog';
import NewInvitation from './components/NewInvitation';
import NewDemandConfirmation from './components/NewDemandConfirmation';
import RetailMarket from './components/RetailMarket';
import { DeleteTwoTone, DeleteFilled, DeleteOutlined, GoldFilled } from '@ant-design/icons';
import { DeleteTwoTone, DeleteFilled, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CrmUtil from '@/utils/UserInfoStorage';
import NewRecorder from './components/NewRecorder';
import { search } from '@/pages/CustomerManagement/startDuplicateCustomer/service';
import { RulesDetail } from '../RuleDetail/data';
const dateFormat = 'YYYY-MM-DD';
const { Link } = Anchor;

const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
interface NewSunnyRulesProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  newRuleModel: StateType;
  loading: boolean;
}
interface NewSunnyRulesState {
  isEditReady: boolean;
  companyId: number;
  isClearingForm: boolean;
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

class NewSunnyRules extends Component<NewSunnyRulesProps, NewSunnyRulesState>{
  // 新建规则 还是编辑规则
  isAdd0orEdit1: 0 | 1 = 0;
  rulesId = undefined;
  state = {
    isEditReady: false,
    companyId: 0,
    isClearingForm: false,
  }

  constructor(props:NewSunnyRulesProps) {
    super(props);
    if(this.props.location.state) {
      this.isAdd0orEdit1 = this.props.location.state.isAdd0orEdit1;
      this.rulesId = this.props.location.state.rulesId;
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    console.log("111componentDidMount111");
    dispatch({
      type: 'newRuleModel/getRulesCompanyLsit',
    });

    // 如果是编辑，先获取详情，成功后再获取各项配置
    if(this.isAdd0orEdit1 == 1 && this.rulesId) {
      dispatch({
        type: 'newRuleModel/getRulesDetailById',
        payload: { rulesId: this.rulesId },
        callback: (success: boolean, ruleDetail: RulesDetail) => {

          this.handleChangeCompany(ruleDetail.rulesInfo.company_id || 0);

          if(success) {
            this.setState({
              isEditReady: true,
            })
          }
        }
      });
    } else {
      // 如果是新建，就等用户手动选了公司后，再根据公司获取对应的配置
    }
  }

  newRecorder: NewRecorder|undefined;

  getNewRecorderComponent = (child: NewRecorder) => {
    this.newRecorder = child;
  }

  handleChangeCompany = (value: number) => {
    const companyId = value;
    this.setState({companyId})
    const {dispatch, form} = this.props;
    dispatch({
      type: 'newRuleModel/getChannels',
      payload: {
        companyId: companyId == 0 ? undefined: companyId
      }
    });
    dispatch({
      type: 'newRuleModel/getGroupUserListCtrl',
      payload: {
        companyId: companyId == 0 ? undefined: companyId
      }
    });
    dispatch({
      type: 'newRuleModel/searchUserCtrl',
      payload: {
        companyId: companyId == 0 ? undefined: companyId
      }
    });
    dispatch({
      type: 'newRuleModel/distributeCompanyListCtrl',
      payload: {
        companyId: companyId == 0 ? undefined: companyId
      }
    });

    // this.newRecorder?.clearForms();
    form.resetFields();
    this.setState({
      isClearingForm: true,
    }, ()=>{
      setTimeout(()=>{
        this.setState({
          isClearingForm: false,
        })
      }, 10)
    })
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      console.log("fieldsValue = " ,fieldsValue);

      for(let i in fieldsValue){
        if(fieldsValue[i] == undefined)fieldsValue[i] = '';
      }
      let res = [];
      let arr = [];
      
      for(let key in fieldsValue){
        if(key.startsWith("channelId")) {
          res.push(fieldsValue[key])
        }
      }
      if(res.length > 0){
        res.map((item,index)=>{
          let json = {};
          json.channelId = (item.flatMap((item)=>{return item.key})).join(',');
          json.isShow = fieldsValue['isShow'+index];
          json.isInvite = fieldsValue['isInvite'+index];
          json.routineReceiveUser = fieldsValue['receiverTypeForRecorder'+index] == 1 && fieldsValue['routineReceiveUserD'][index]?fieldsValue['routineReceiveUserD'][index]:'';
          json.routineReceiveGroup = fieldsValue['receiverTypeForRecorder'+index] == 0 && fieldsValue['routineReceiveGroupD'][index]?fieldsValue['routineReceiveGroupD'][index]:'';
          arr.push(json)
        })
      }
      
      let params = {};
      let obj = fieldsValue;
      params.name = obj.name;
      params.companyId = obj.companyId;
      params.activityName = obj.activityName;
       

      params.intoGroupData = arr

      let distributeChannelList = new Array();
      if(obj.distributeCompanyIdA) {
        obj.distributeCompanyIdA.map(companyId => {
          distributeChannelList.push ( {
            distributeCompanyId: companyId,
            distributeChannelId: obj['distributeChannelId'+companyId],
          })
        })
      }

      params.verifierData = {
        isSkip:obj.isSkip,
        isInvite:obj.isInviteA,
        routineReceiveUser: obj.receiverTypeForDemand == 1 && obj.routineReceiveUserA?.length > 0?obj.routineReceiveUserA.join(','):'',
        routineReceiveGroup: obj.receiverTypeForDemand == 0 && obj.routineReceiveGroupA?.length > 0?obj.routineReceiveGroupA.join(','):'',
        isDistribute:obj.isDistributeA,
        distributeCompanyId:obj.distributeCompanyIdA?.length > 0?obj.distributeCompanyIdA.join(','):'',
        distributeChannelList,
      }
      params.inviteData = {
        isSkip:obj.isSkipForInvitation,
        routineReceiveUser:obj.receiverTypeForInvitation == 1 && obj.routineReceiveUserB?.length > 0?obj.routineReceiveUserB.join(','):'',
        routineReceiveGroup:obj.receiverTypeForInvitation == 0 && obj.routineReceiveGroupB?.length > 0?obj.routineReceiveGroupB.join(','):'',
        isCustomerGrade:obj.isCustomerGrade,
        gradeA:obj.gradeA?.length > 0?obj.gradeA.join(','):'',
        gradeB:obj.gradeB?.length > 0?obj.gradeB.join(','):'',
        gradeC:obj.gradeC?.length > 0?obj.gradeC.join(','):'',
        gradeD:obj.gradeD?.length > 0?obj.gradeD.join(','):'',
        // 2020-4-11  把邀约人的派发公司去掉了，只保留需求确认人的派发公司 
        // isDistribute:obj.isDistributeB,
        // distributeCompanyId:obj.distributeCompanyIdB?.length > 0?obj.distributeCompanyIdB.join(','):''
      }
      
      params.orderData = {
        isSkip:obj.isSkipForOrder,
        routineReceiveUser:obj.receiverTypeForOrder == 1 && obj.routineReceiveUserC?.length > 0?obj.routineReceiveUserC.join(','):'',
        routineReceiveGroup:obj.receiverTypeForOrder == 0 && obj.routineReceiveGroupC?.length > 0?obj.routineReceiveGroupC.join(','):'',
      }

      // console.log('params===',params)

      this.submitCtrl(params);
    });
  }

  submitCtrl = (obj:any)=>{
    const { dispatch } = this.props;
    if(this.isAdd0orEdit1 == 0) {
      dispatch({
        type: 'newRuleModel/addRuleCtrl',
        payload:obj,
        callback:(data:any)=>{
          console.log(data)
          if(data.code == 200){
            message.success('新建规则成功')
            localStorage?.setItem('rulesListRefreshTag', 'reset')
            this.props.dispatch(routerRedux.push({
              pathname: '/sunnyrules/sunnyruleslist',
            }));
          }
        }
      });
    } else if(this.isAdd0orEdit1 == 1) {
      dispatch({
        type: 'newRuleModel/updateRuleCtrl',
        payload:{
          rulesId: this.rulesId,
          ...obj
        },
        callback:(data:any)=>{
          console.log(data)
          if(data.code == 200){
            localStorage?.setItem('rulesListRefreshTag', 'list')
            message.success('编辑规则成功')
            this.props.dispatch(routerRedux.goBack());
          }
        }
      });
    }
  }

  renderRecorderForm = () => {
    if(this.state.isClearingForm) {
      return null;
    }
    const {newRuleModel: {channelsData, searchUserData, getGroupUserData , rulesDetail }, form} = this.props;
    return channelsData && searchUserData && getGroupUserData ? (
      <NewRecorder 
        getThis={this.getNewRecorderComponent}
        channelsData={channelsData} 
        form={form} 
        receiverUsers={searchUserData} 
        receiverGroups={getGroupUserData}
        editValue={this.isAdd0orEdit1==1?rulesDetail?.intoGroupData:undefined} 
      />
    ) : null;
  } 

  renderRequirementConfirmerForm = () => {
    if(this.state.isClearingForm) {
      return null;
    }
    const {newRuleModel: { searchUserData, getGroupUserData, rulesDetail }, form} = this.props;
    return searchUserData && getGroupUserData ? (
      <Card size="small" bordered={true} >
        <NewDemandConfirmation 
          form={form} 
          receiverUsers={searchUserData} 
          receiverGroups={getGroupUserData} 
          editValue={this.isAdd0orEdit1==1?rulesDetail?.verifierData:undefined} 
        />
      </Card>
    ) : null;
  }

  renderInviterForm = () => {
    if(this.state.isClearingForm) {
      return null;
    }
    const {newRuleModel: { searchUserData, getGroupUserData, rulesDetail }, form} = this.props;
    return  searchUserData && getGroupUserData ? (
      <Card size="small" bordered={true} >
        <NewInvitation 
          form={form} 
          receiverUsers={searchUserData?searchUserData:[]} 
          receiverGroups={getGroupUserData?getGroupUserData:[]} 
          editValue={this.isAdd0orEdit1==1?rulesDetail?.inviteData:undefined} 
          />
      </Card>
    ) : null;
  }

  renderSalesDepartmentForm = () => {
    if(this.state.isClearingForm) {
      return null;
    }
    const {newRuleModel: { searchUserData, getGroupUserData, rulesDetail }, form} = this.props;
    return  searchUserData && getGroupUserData ? (
        <Card size="small" bordered={true} >
          <RetailMarket 
            form={form} 
            receiverUsers={searchUserData?searchUserData:[]} 
            receiverGroups={getGroupUserData?getGroupUserData:[]}  
            editValue={this.isAdd0orEdit1==1?rulesDetail?.orderData:undefined} 
          />
        </Card>
    ) : null;
  }

  spanTitleStyle = { borderLeft: "3px solid black", paddingLeft: 5, fontWeight: 800, fontSize: 14 };

  render() {
    if(this.isAdd0orEdit1 == 1 && !this.state.isEditReady) {
      return null;
    }
    const {
      loading,
      newRuleModel: { configData, searchUserData, getGroupUserData, rulesDetail, companyList },
      form: { getFieldDecorator },
    } = this.props;
    if(this.isAdd0orEdit1 == 1 && !rulesDetail) {
      return null;
    } 
    return (
      <PageHeaderWrapper title={this.isAdd0orEdit1==1?"编辑规则":"新建规则"}>
        <Spin spinning={loading}>
        <Card bordered={false}  >
          <div className={styles.tableListForm}>
            <Form layout="inline" onSubmit={this.handleSubmit}  >

            <FormItem style={{ display: "block" }} label="生效公司">
                {getFieldDecorator('companyId', { 
                  rules: [{ required: true, message:"请选择规则生效公司" }],
                  initialValue: (this.isAdd0orEdit1==1&&rulesDetail&&rulesDetail.rulesInfo.company_id) ? rulesDetail.rulesInfo.company_id : undefined,
                 })(
                  <Select 
                    placeholder="请选择规则生效公司（单选）"
                    onChange={this.handleChangeCompany}
                    disabled={this.isAdd0orEdit1==1}
                    >
                    {
                      companyList.map(company=>(
                      <Option key={company.company_id} value={company.company_id}>{company.company_name}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem style={{ display: "block" }} label="规则名称">
                {getFieldDecorator('name', { 
                  rules: [{ required: true, message:"请填写规则名称" }],
                  initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.rulesInfo.name : undefined,
                 })(
                  <Input placeholder="请填写规则名称"></Input>
                )}
              </FormItem>

              <FormItem  style={{ display: "block" }} label="规则描述">

                {getFieldDecorator('activityName', { 
                  rules: [{ required: false }],
                  initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.rulesInfo.activity_name : undefined,
                })(
                  <Input placeholder="请填写规则描述"></Input>
                )}
              </FormItem>

              <FormItem style={{ display: "block" }} label="流转规则">
                {this.state.companyId == 0 && <Alert message="请先选择生效公司" closable type="info" showIcon />}
                <div >
                  <b style={this.spanTitleStyle}>提供人</b>
                  {
                    this.renderRecorderForm()
                  }
                </div>
                <Divider />
                <div >
                  <b style={this.spanTitleStyle}>需求确认人</b>
                  {
                    this.renderRequirementConfirmerForm()
                  }
                </div>
                <Divider />
                <div >
                  <span style={this.spanTitleStyle}>邀约人</span>
                  {
                    this.renderInviterForm()
                  }
                </div>
                <Divider />
                <div>
                  <span style={this.spanTitleStyle}>门市</span>
                  {
                    this.renderSalesDepartmentForm()
                  }
                </div>
              </FormItem>

              <div style={{marginTop:20}}>
                {/* <Button style={{ flexGrow: 1, marginRight: 20 , marginLeft:100,}} type="ghost" >
                  取消
                </Button> */}
                <Button style={{ width:220, margin: " auto  25%" }} type="primary" htmlType="submit">
                  提交
                </Button>
              </div>

            </Form>
          </div>
        </Card>
        </Spin>
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<NewSunnyRulesProps>()(NewSunnyRules);
