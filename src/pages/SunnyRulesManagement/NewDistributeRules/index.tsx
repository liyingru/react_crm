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
import DistributorForm from './components/DistributorForm';
import { RulesDetail } from '../DistributeRuleDetail/data';
const dateFormat = 'YYYY-MM-DD';
const { Link } = Anchor;

const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
interface NewDistributeRulesProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  newDistributeRuleModel: StateType;
  loading: boolean;
}
interface NewDistributeRulesState {
  isEditReady: boolean;
  companyId: number;
  distributeDisabled: boolean;
}
@connect(
  ({
    newDistributeRuleModel,
    loading,
  }: {
    newDistributeRuleModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newDistributeRuleModel,
    loading: loading.models.newDistributeRuleModel,
  }),
)

class NewDistributeRules extends Component<NewDistributeRulesProps, NewDistributeRulesState>{
  // 新建规则 还是编辑规则
  isAdd0orEdit1: 0 | 1 = 0;
  rulesId = undefined;
  state = {
    isEditReady: false,
    companyId: 0,
    distributeDisabled: false,
  }

  constructor(props:NewDistributeRulesProps) {
    super(props);
    if(this.props.location.state) {
      this.isAdd0orEdit1 = this.props.location.state.isAdd0orEdit1;
      this.rulesId = this.props.location.state.rulesId;
    }
  }

  componentDidMount() {
    console.log("111componentDidMount111");
    const { dispatch } = this.props;
    
    dispatch({
      type: 'newDistributeRuleModel/getChannel3Company',
    });

    // 如果是编辑，需要获取详情
    if(this.isAdd0orEdit1 == 1 && this.rulesId) {
      dispatch({
        type: 'newDistributeRuleModel/getPublicRuleDetail',
        payload: { rulesId: this.rulesId },
        callback: (success: boolean, ruleDetail: RulesDetail) => {
          if(success) {
            this.setState({
              isEditReady: true,
              distributeDisabled: ruleDetail.is_copy == 1
            })
          }
        }
      });
    } else {  // 当新建时，才允许选择渠道，这时候再去获取渠道项
      dispatch({
        type: 'newDistributeRuleModel/getPublicChannels',
      });
    }
  }

  handleChangeDistributeType = (e) => {
    const value = e.target.value;
    this.setState({
      distributeDisabled: !!value,
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      console.log("fieldsValue = " ,fieldsValue);
      if(parseInt(fieldsValue.percentageXp) + parseInt(fieldsValue.percentageLan) + parseInt(fieldsValue.percentageNk) < 100) {
        Modal.warn({
          title: "当前数据分配系数总计不足100%，请调整",
          centered: true,
          onOk: () => {
          }
        })
        return; 
      }
      
      let params = fieldsValue;

      if(this.isAdd0orEdit1 == 0) {
        dispatch({
          type: 'newDistributeRuleModel/addPublicRule',
          payload:params,
          callback:(data:any)=>{
            console.log(data)
            if(data.code == 200){
              message.success('新建规则成功')
              localStorage?.setItem('rulesListRefreshTag', 'reset')
              this.props.dispatch(routerRedux.push({
                pathname: '/sunnyrules/distributeruleslist',
              }));
            }
          }
        });
      } else if(this.isAdd0orEdit1 == 1) {
        dispatch({
          type: 'newDistributeRuleModel/editPublicRule',
          payload:{
            rulesId: this.rulesId,
            ...params
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
    });
  }

  render() {
    if(this.isAdd0orEdit1 == 1 && !this.state.isEditReady) {
      return null;
    }
    const {
      loading,
      newDistributeRuleModel: { publicChannelsData, channel3Company,  rulesDetail },
      form: { getFieldDecorator },
    } = this.props;
    if(this.isAdd0orEdit1 == 1 && !rulesDetail) {
      return null;
    } 

    if(!channel3Company) {
      return null;
    }

    return (
      <PageHeaderWrapper title={this.isAdd0orEdit1==1?"编辑分配规则":"新建分配规则"}>
        <Spin spinning={loading}>
        <Card bordered={false} className={styles.body} >
          <div >
            <Form layout="inline" onSubmit={this.handleSubmit} className={styles.form} >

              <FormItem style={{ display: "block" }} label="规则名称">
                {getFieldDecorator('name', { 
                  rules: [{ required: true, message:"请填写规则名称" }],
                  initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.name : undefined,
                 })(
                  <Input style={{ width: '100%' }} placeholder="请填写规则名称"></Input>
                )}
              </FormItem>

              <FormItem style={{ display: "block" }} label="选择渠道">
                {getFieldDecorator("channelId", { 
                  rules: [{ required: true, message:'请选择渠道'}],
                  initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.channel_id.toString() : undefined,
                })(
                  <Select
                    disabled={this.isAdd0orEdit1==1}
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    placeholder="请选择"
                  >
                    {
                      this.isAdd0orEdit1==1&&rulesDetail ? (
                        <Option key={rulesDetail.channel_id.toString()} value={rulesDetail.channel_id.toString()}>{rulesDetail.channel_name}</Option>
                      )
                      :
                      publicChannelsData?.map(channel => (
                        <Option key={channel.value.toString()} value={channel.value.toString()}>{channel.label}</Option>
                      ))
                    }
                  </Select>,
                )}
              </FormItem>

              <FormItem label="是否全部分配">
                {getFieldDecorator('isCopy',
                  { 
                    rules: [{ required: true, message: "请选择分配方式" }], 
                    initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.is_copy : 0,
                  })(
                    <Radio.Group  style={{ width: '100%' }} onChange={this.handleChangeDistributeType}>
                      <Radio value={1} key={1}>全部分配</Radio>
                      <Radio value={0} key={0}>按比例分配</Radio>
                    </Radio.Group>
                  )}
              </FormItem>
              
              <FormItem label="数据分配系数">
                <div >
                  <b>（系数总计为{this.state.distributeDisabled?"3":"1"}）</b>
                  <DistributorForm
                    disabled={this.state.distributeDisabled}
                    channels={channel3Company}
                    form={this.props.form}
                    editValue={(this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail : undefined}
                    />
                </div>
              </FormItem>
              
              <FormItem label="规则状态">
                {getFieldDecorator('status',
                  { 
                    rules: [{ required: true, message: "请选择规则的生效状态" }], 
                    initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.status : undefined,
                  })(
                    <Radio.Group  style={{ width: '100%' }}>
                      <Radio value={1} key={1}>有效</Radio>
                      <Radio value={0} key={0}>无效</Radio>
                    </Radio.Group>
                  )}
              </FormItem>

              <FormItem style={{display: 'block'}} label="描述说明">
                {getFieldDecorator('remark',
                  { 
                    rules: [{ required: false,  }], 
                    initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.remark : undefined,
                  })(
                    <TextArea
                      placeholder="请输入数据分配规则的描述说明"
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  )}
              </FormItem>

              <div style={{marginTop:20}}>
                <Button style={{ width:250, marginLeft: 130, marginTop: 20}} type="primary" htmlType="submit">
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
export default Form.create<NewDistributeRulesProps>()(NewDistributeRules);
