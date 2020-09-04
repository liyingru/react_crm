import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect, ReactNode } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Icon, Popconfirm, Anchor, Spin, Empty, Alert, Dropdown, Menu } from 'antd';
import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
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
import NewRecorder from './components/NewCompanyPanel';
import { ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { ClickParam } from 'antd/lib/menu';
import NewCompanyPanel from './components/NewCompanyPanel';
import RadioGroup from 'antd/lib/radio/group';
import { RadioChangeEvent } from 'antd/lib/radio';
import { RulesDetail } from '../QaRuleDetail/data';
const dateFormat = 'YYYY-MM-DD';
const { Link } = Anchor;

const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
interface NewQaRulesProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  newQaRuleModel: StateType;
  loading: boolean;
}
interface NewQaRulesState {
  isEditReady: boolean;
  selectedCompanyIds: string[];
  isClearingForm: boolean;
  companyRules: {channel: string, category: string}[];
}
@connect(
  ({
    newQaRuleModel,
    loading,
  }: {
    newQaRuleModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newQaRuleModel,
    loading: loading.models.newQaRuleModel,
  }),
)

class NewQaRules extends Component<NewQaRulesProps, NewQaRulesState>{
  // 新建规则 还是编辑规则
  isAdd0orEdit1: 0 | 1 = 0;
  rulesId = undefined;
  state = {
    isEditReady: false,
    selectedCompanyIds: [],
    isClearingForm: false,
    companyRules: [],
  }

  constructor(props:NewQaRulesProps) {
    super(props);
    if(this.props.location.state) {
      this.isAdd0orEdit1 = this.props.location.state.isAdd0orEdit1;
      this.rulesId = this.props.location.state.rulesId;
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newQaRuleModel/getConfig',
    });

    // 如果是编辑，先获取详情，成功后再根据companyId获取各项配置
    if(this.isAdd0orEdit1 == 1 && this.rulesId) {
      dispatch({
        type: 'newQaRuleModel/getRulesDetailById',
        payload: { rulesId: this.rulesId },
        callback: (success: boolean, ruleDetail: RulesDetail) => {
          ruleDetail.content.map(item=>this.handleAddCompany(item.company_id, ()=>{
            const {companyRules} = this.state;
            companyRules[item.company_id].channel = item.channel,
            companyRules[item.company_id].category = item.category,
            this.setState({
              companyRules
            })
          }))

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

  handleChangeRuleStatus = (e: RadioChangeEvent) => {
    
  }



  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      console.log("fieldsValue = " ,fieldsValue);
      
      const content = [];
      const { companyRules } = this.state;

      for(let key in fieldsValue) {
        if(key.indexOf('-') >= 0) {
          delete fieldsValue[key];
        }
      }

      for(let key in companyRules){
        content.push({
          company_id: key,
          channel: companyRules[key].channel,
          category: companyRules[key].category,
        })
      }
      const params = {
        ...fieldsValue,
        content
      }
      this.submitCtrl(params);
    });
  }

  submitCtrl = (obj:any)=>{
    const { dispatch } = this.props;
    if(this.isAdd0orEdit1 == 0) {
      dispatch({
        type: 'newQaRuleModel/createRules',
        payload:obj,
        callback:(data:any)=>{
          console.log(data)
          if(data.code == 200){
            message.success('新建QA规则成功')
            localStorage?.setItem('rulesListRefreshTag', 'reset')
            this.props.dispatch(routerRedux.push({
              pathname: '/sunnyrules/qaruleslist',
            }));
          }
        }
      });
    } else if(this.isAdd0orEdit1 == 1) {
      dispatch({
        type: 'newQaRuleModel/updateRules',
        payload:{
          rulesId: this.rulesId,
          ...obj
        },
        callback:(data:any)=>{
          console.log(data)
          if(data.code == 200){
            localStorage?.setItem('rulesListRefreshTag', 'list')
            message.success('编辑QA规则成功')
            this.props.dispatch(routerRedux.goBack());
          }
        }
      });
    }
  }

  /**
   * 选择添加公司后，获取该公司的渠道列表和品类列表
   */
  handleAddCompany = (companyId: string, callback?:()=>void)=>{
    const {selectedCompanyIds} = this.state;
    selectedCompanyIds.push(companyId);
    this.setState({selectedCompanyIds});

    const {companyRules} = this.state;
    companyRules[companyId] = {};
    this.setState({
      companyRules
    }, ()=>{
      if(callback) callback();
    });

    const {dispatch} = this.props;

    dispatch({
      type: 'newQaRuleModel/getChannelsByCompanyId',
      payload: { companyId }
    })
    dispatch({
      type: 'newQaRuleModel/getCategorysByCompanyId',
      payload: { companyId }
    })
  }

  handleDeleteCompanyPanel = (companyId: string) => {
    const {selectedCompanyIds} = this.state;
    const newSelectedCompanyIds = selectedCompanyIds.filter(id=>id+""!=companyId+"");
    this.setState({
      selectedCompanyIds: newSelectedCompanyIds
    })
    const {companyRules} = this.state;
    delete companyRules[companyId];
    this.setState({
      companyRules
    })
  }

  handleChangeCategories = (categoryIds: string[], companyId: string) => {
    const {companyRules} = this.state;
    companyRules[companyId].category = categoryIds.join(',');
    this.setState({companyRules});
  }

  handleChangeChannels = (channelIds: string[], companyId: string) => {
    const {companyRules} = this.state;
    companyRules[companyId].channel = channelIds.join(',');
    this.setState({companyRules});
  }

  renderCompanyPanelForm = () => {
    const {newQaRuleModel: {configData, channelsData, categorysData, rulesDetail}, form} = this.props;

    const {selectedCompanyIds} = this.state;
    const selctedCompanys = configData?.nbCompany?.filter(item=>selectedCompanyIds.indexOf(item.id+"")>=0); 
    
    console.log("channelsData = " + JSON.stringify(channelsData));
    console.log("companyId = " + JSON.stringify(selctedCompanys));
    return configData && selctedCompanys?.map(company=>(
      <NewCompanyPanel 
        companyId={company.id}
        companyName={company.name}
        channels={channelsData.filter(item=>item.companyId==company.id)[0]?.channels||[]} 
        categories={categorysData.filter(item=>item.companyId==company.id)[0]?.categorys||[]}
        form={form} 
        onDeleteCompany={this.handleDeleteCompanyPanel}
        onChangeChannels={this.handleChangeChannels}
        onChangeCategorys={this.handleChangeCategories}
        editValue={this.isAdd0orEdit1==1?rulesDetail?.content.filter(item=>item.company_id==company.id)[0]:undefined} 
      />
    ) )
  } 

  spanTitleStyle = { borderLeft: "3px solid black", paddingLeft: 5, fontWeight: 800, fontSize: 14 };
  radioStyle = {
    width: 60,
    textAlign: 'center',
  };

  render() {
    if(this.isAdd0orEdit1 == 1 && !this.state.isEditReady) {
      return null;
    }
    const {
      loading,
      newQaRuleModel: { configData, rulesDetail },
      form: { getFieldDecorator },
    } = this.props;
    if(this.isAdd0orEdit1 == 1 && !rulesDetail) {
      return null;
    } 
    const leftCompanies : ConfigListItem[] | undefined = configData?.nbCompany?.filter(company=>this.state.selectedCompanyIds.indexOf(company.id+"")<0);
    return (
      <PageHeaderWrapper title={this.isAdd0orEdit1==1?"编辑QA规则":"新建QA规则"}>
        <Spin spinning={loading}>
        <Card bordered={false}  >
          <div className={styles.tableListForm}>
            <Form layout="inline" onSubmit={this.handleSubmit}  >

            <FormItem style={{ display: "block" }} label="规则名称">
              {getFieldDecorator('name', { 
                rules: [{ required: true, message:"请填写规则名称" }],
                initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.name : undefined,
                })(
                <Input placeholder="请填写规则名称"></Input>
              )}
            </FormItem>

            <FormItem style={{ display: "block" }} label="流转规则">
              {/* {getFieldDecorator('rules', { 
                rules: [{ required: true, message:"请指定具体规则" }],
                initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.rulesInfo.name : undefined,
                })(
                <Input value></Input>
              )} */}
              <Dropdown disabled={!leftCompanies || leftCompanies.length <= 0}
                  overlay={
                  <Menu onClick={(e)=>this.handleAddCompany(e.key)}>
                    {
                      leftCompanies?.map(company=>(
                        <Menu.Item key={company.id}>
                          {company.name}
                        </Menu.Item>
                      ))
                    }
                  </Menu>
                }>
                  <Button >
                    <PlusOutlined />添加公司
                  </Button>
                </Dropdown>
              {
                this.renderCompanyPanelForm()
              }
            </FormItem>

            <FormItem style={{ display: "block" }} label="规则状态">
              {getFieldDecorator('status', { 
                rules: [{ required: true }],
                initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.status : 1,
                })(
                  <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }} onChange={this.handleChangeRuleStatus}>
                    <Radio.Button style={this.radioStyle} value={1} key={1}>有 效</Radio.Button>
                    <Radio.Button style={this.radioStyle} value={2} key={2}>无 效</Radio.Button>
                  </Radio.Group>
              )}
            </FormItem>

            <FormItem  style={{ display: "block" }} label="描述说明">
              {getFieldDecorator('desc', { 
                rules: [{ required: false }],
                initialValue: (this.isAdd0orEdit1==1&&rulesDetail) ? rulesDetail.desc : undefined,
              })(
                <TextArea placeholder="请填写QA规则的描述说明（最多500字）" rows={4} maxLength={500}></TextArea>
              )}
            </FormItem>
            
            <FormItem  style={{ display: "block" }} label="数据回收说明">
              <span style={{color:'red'}}>规则生效后，每日凌晨回收前24小时对应渠道的婚庆品类无效的有效单（以最新一次无效时间为准）</span>
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
export default Form.create<NewQaRulesProps>()(NewQaRules);
