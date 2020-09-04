import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Tabs } from 'antd';
import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import { StateType } from './model';
import styles from './index.less';
import { connect } from 'dva';
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
import CustomerConsult from '../Comments/CustomerConsult';
import CustomerContract from '../Comments/CustomerContract';
import CustomerEnclosure from '../Comments/CustomerEnclosure';
import CustomerExecute from '../Comments/CustomerExecute';
import CustomerInfor from '../Comments/CustomerInfor';
import CustomerJournal from '../Comments/CustomerJournal';
import CustomerPanorama from '../Comments/CustomerPanorama';
import CustomerPreparation from '../Comments/CustomerPreparation';
import DialogLayer from '../Comments/DialogLayer';

import { UserAddOutlined, SendOutlined } from '@ant-design/icons';
import BenefitAmountModal from '../modals/BenefitAmountModal';
const { TabPane } = Tabs;

interface LiheProProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  LiheProDetail: StateType;
  loading: boolean;
}
interface currentState {
  tabMenu: number,
  benefitAmountModalVisible: boolean,
  editVisible:boolean;
  tabDialog: number,
}
let arr1 = [
  { id: 1, name: "客户全景" },
  { id: 2, name: "客户资料" },
  { id: 3, name: "咨询阶段" },
  { id: 4, name: "筹备阶段" },
  { id: 5, name: "执行阶段" },
  { id: 6, name: "合同" },
  { id: 7, name: "附件" },
  { id: 8, name: "操作日志" }
];
@connect(
  ({
    LiheProDetail,
    loading,
  }: {
    LiheProDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LiheProDetail,
    loading: loading.models.LiheProDetail,
  }),
)

class LiheProDetail extends Component<LiheProProps, currentState>{

  constructor(props: LiheProProps) {
    super(props);
    this.state = {
      tabMenu: 1,
      benefitAmountModalVisible: false,
      editVisible:false,
      tabDialog: 0
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //拉取配置信息
    dispatch({
      type: 'LiheProDetail/commonConfigCtrl',
    });
    dispatch({
      type: 'LiheProDetail/fetchCustomerStatusConfig',
    });
  }

  handleLiheTab = (e:any) => {
    const value = e.target.value;
    this.setState((prevState) => {
      return {
        tabMenu: value
      }
    })
  }

  /**
   * 新增任务
   */
  handleAddNewTask = () => {

  }

  /**
   * 设为已完成
   */
  handleSetTaskDone = () => {

  }

  /**
   * 填写收款金额
   */
  handleModifyBenefitAmount = () => {
    this.setState({
      benefitAmountModalVisible: true
    })
  }

  /**
   * 保存”填写收款金额“
   */
  handleSubmitBenefitAmount = () => {
    const result = true;
    if (result) {
      this.setState({
        benefitAmountModalVisible: false
      })
    }
  }

  /**
   * 上传文件
   */
  handleUploadFile = () => {

  }

  /**
   * 下载文件
   */
  handleDownloadFile = () => {

  }

  renderForm = () => {
    const { LiheProDetail: { customerStatusMap } } = this.props;

    return (
      <Fragment>
        <div className={styles.nav}>
          <span className={styles.personName}>张女士 13300101010</span>
          <span className={styles.p1} style={{ paddingRight: '20px' }}>策划师：张女士</span>
          <span className={styles.p1}>销售：张女士</span>
        </div>
        <div className={styles.actions} >
          <Select defaultValue={1} disabled={!customerStatusMap} style={{ width: 120 }}>
            {
              customerStatusMap && customerStatusMap.map(status => (
                <Option key={status.id} value={status.id}>{status.name}</Option>
              ))
            }
          </Select>
          <Button onClick={() => this.distributionTearchCtrl(1)}>分配策划师</Button>
          <Button onClick={() => this.distributionTearchCtrl(2)}><UserAddOutlined />添加协作人</Button>
          <Button onClick={() => this.distributionTearchCtrl(3)}>转移给他人</Button>
          <Button onClick={() => this.distributionTearchCtrl(4)}><SendOutlined />转移至客户公海</Button>
          <Button icon='edit' onClick={()=>this.handleCustomerEdit(true)}>编辑</Button>
          <Button icon="message" onClick={() => this.distributionTearchCtrl(5)}>发送短信</Button>
        </div>


        <Tabs defaultActiveKey="1" type="card" style={{ marginTop: 20 }}>
          {arr1.map((item) =>
            <TabPane tab={item.name} key={item.id + ""}>
              {this.tabTemplateCtrl(item.id)}
            </TabPane>
          )}
        </Tabs>

      </Fragment>
    )
  }
  //分配策划师
  distributionTearchCtrl = (type: any) => {
    this.setState({
      tabDialog: type,
    });
  }
  closeDialogCtrl = ()=>{
    this.setState({
      tabDialog: 0,
    });
  }

  handleCustomerEdit = (visible:any) => {
    this.setState({
      editVisible:visible
    })
  }


  tabTemplateCtrl = (tabId: number) => {
    const {editVisible} = this.state;
    switch (tabId) {
      case 1:
        // 全景
        return (
          <CustomerPanorama />
        );
      case 2:
        // 客户资料
        return (
          <CustomerInfor visible={editVisible} changeVisible={()=>this.handleCustomerEdit(false)}/>
        );
      case 3:
      // 咨询阶段
      case 4:
      // 筹备阶段
      case 5:
        // 执行阶段
        return (
          <CustomerConsult
            onAddNewTask={this.handleAddNewTask}
            setTaskDone={this.handleSetTaskDone}
            uploadFile={this.handleUploadFile}
            downloadFile={this.handleDownloadFile}
            modifyBenefitAmount={this.handleModifyBenefitAmount}
          />
        );
      case 4:
        // 筹备阶段
        return (
          <CustomerPreparation />
        );
      case 5:
        // 执行阶段
        return (
          <CustomerExecute />
        );
      case 6:
        // 合同
        return (
          <CustomerContract />
        );
      case 7:
        // 附件
        return (
          <CustomerEnclosure />
        );
      case 8:
        // 操作日志
        return (
          <CustomerJournal />
        );
      default:
        return null;
    }

  }
  
  render() {
    const { tabDialog } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
        </Card>
        <BenefitAmountModal
          handleSubmit={this.handleSubmitBenefitAmount}
          handleCancel={() => { this.setState({ benefitAmountModalVisible: false }) }}
          modalVisible={this.state.benefitAmountModalVisible}
        />
        <DialogLayer tabDialog={tabDialog} closeDialogCtrl={this.closeDialogCtrl}/>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<LiheProProps>()(LiheProDetail);
