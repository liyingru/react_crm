import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Card, Button, Row, Col, Form, Select, message, Spin } from 'antd';
import styles from './index.less';
import { Action, Dispatch } from 'redux';
import { StateType } from './model';
import { connect } from 'dva';

import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { FormComponentProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import { setTimeout } from 'timers';
import LOCAL from '@/utils/LocalStorageKeys';
const { Option } = Select;
import CustomerRepeatConfirmModal from '@/components/CustomerRepeatConfirmModal';
import { CustomerDataSimple } from '@/pages/ReviewManagement/repeatDetail/data';

interface StartDuplicateCustomerProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'startDuplicateCustomerModel/submitForm'
      | 'startDuplicateCustomerModel/toReview'
      | 'startDuplicateCustomerModel/backToCustomerDetail'
      | 'startDuplicateCustomerModel/search'
      | 'startDuplicateCustomerModel/customerDetailById'
    >
  >;
  loading: boolean;
  startDuplicateCustomerModel: StateType;
}

interface StartDuplicateCustomerState {
  customerData: CustomerDataSimple|undefined;
  customerList: CustomerDataSimple[];
  repeatCids: string[];
  reqId:string;
  showStyle:number;
  contactShow: boolean;
  modalVisible: boolean;
  // 添加跟进
  showAddFollowInfo: boolean;

  transVisible: boolean;
  checkedValue: Array<CheckboxValueType>;
  currentUserInfo: any;
  selectingCustomer: CustomerDataSimple|undefined;
  targetSimilarCustomer: CustomerDataSimple|undefined;
  confirmVisible: boolean;
}


@connect(
  ({
    startDuplicateCustomerModel,
    loading,
  }: {
    startDuplicateCustomerModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    startDuplicateCustomerModel,
    loading: loading.models.startDuplicateCustomerModel,
  }),
)

class StartDuplicateCustomer extends Component<StartDuplicateCustomerProps, StartDuplicateCustomerState>{

  child: any;

  state: StartDuplicateCustomerState = {
    customerData: undefined,
    customerList: new Array(),
    repeatCids: new Array(),
    showStyle:0,
    contactShow: false,
    modalVisible: false,
    showAddFollowInfo: false,
    transVisible: false,
    checkedValue: [],
    reqId:'',
    currentUserInfo:{},
    selectingCustomer: undefined,
    targetSimilarCustomer: undefined,
    confirmVisible: false,
  }

  componentDidMount() {
    // 从上一页取参数。  有可能没有（如果从客户管理列表页发起重复，就没有具体某个客户的信息。）
    const {customerData} = this.props.location.state;
    const customerDataSimple: CustomerDataSimple|undefined = customerData ? {
      customer_id: customerData.customerId,
      customer_name: customerData.customerName,
      phone: customerData.phone,
      wedding_date: customerData.weddingDate,
      create_time: customerData.createTime,
      repeat_status: "",
      req_info: [],
      repeat_audit_status: 0,
      similar_id: 0,
      status: "",
    } : undefined;

    if(customerDataSimple) {
      this.setState({customerData: customerDataSimple});
      const customerList:CustomerDataSimple[] = [customerDataSimple]
      this.setState({customerList});
      this.keepCid = customerData.customerId
    }
    
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    try {
      if (currentUserInfoStr) {
        const currentUserInfo = JSON.parse(currentUserInfoStr);
        this.setState({
          currentUserInfo
        })
      }
    } catch (e) {
      this.setState({
        currentUserInfo:{}
      })
    }
  }

  timeOut:NodeJS.Timeout|undefined = undefined;
  currentKeyWord:string|undefined = undefined;

  // 搜索
  handleSearchCustomer = (val:string, isSelf?: boolean) => {
    if(!val) return;

    if(this.timeOut) {
      clearTimeout(this.timeOut);

      this.timeOut = undefined;
    }
    this.currentKeyWord = val;
    this.page = 1;
    this.noMoreData = false;

    this.setState({
      customerList: new Array()
    })
    
    this.timeOut = setTimeout(()=>{
      this.executeSearchByKeys(val, isSelf);
    }, 1000);
    
  }

  handleSearchOptionsScroll = (event) => {

    if(event.target.scrollTop + event.target.clientHeight == event.target.scrollHeight) {

      this.loadMore();
    }
  }

  page: number = 1;
  pageSize: number = 10;
  noMoreData: boolean = false;

  executeSearchByKeys = (key: string|undefined, isSelf?: boolean) => {
    const {
      dispatch,
    } = this.props;
    if(key && key == this.currentKeyWord && !this.noMoreData) {
      dispatch({
        type: 'startDuplicateCustomerModel/search',
        payload: {
          page: this.page,
          pageSize: this.pageSize,
          keyword: key,
          self: isSelf ? 1 : undefined
        },
        callback: (result:boolean, msg: string)=>{
          if(result) {
            this.page += 1;
            const {customerList} = this.state;
            const {startDuplicateCustomerModel:{customerListSinglePageData, stayCustomerSearchAmount}} = this.props;
            if(customerListSinglePageData) {
              customerList.push(...customerListSinglePageData);
            }
            this.setState({
              customerList
            });
            if(stayCustomerSearchAmount <= customerList.length) {
              this.noMoreData = true;
            }
          }
        }
      });
    }
    
  }

  loadMore = () => {
    this.executeSearchByKeys(this.currentKeyWord);
  }

  clearOptionsData = () => {
    this.setState({
      customerList: new Array()
    })
  }

  keepCid : string|undefined = undefined;
  repeatCids: string[]|undefined = undefined;

  handleChangeKeepCid = (value:string) => {
    this.keepCid = value;
  }

  handleChangeRepeatCids = (value) => {
    this.repeatCids = value;
    if(this.repeatCids) {
      this.setState({
        repeatCids: this.repeatCids
      });
    }
  }

  /**
   * 选择了重复客户的选项
   */
  handleSelectRepeatOption = (value:string, option) => {
    const { customerList } = this.state;
    const {dispatch} = this.props;
    // 通过选中的customerId，查看该客户的similarId是否存在且不为0
    const selectedCustomer = customerList.filter(item => {
      return value == item.customer_id;
    })[0];
    // 如果存在有效的similarId，说明不能关联该选中的客户  // 要弹出窗口提示用户
    if(selectedCustomer && selectedCustomer.similar_id != 0) {
      this.setState({
        selectingCustomer: selectedCustomer
      })
      // 但是弹出窗口中要展示similarId客户的信息，要先获取到才行。
      // 先从已有的选项中看有没有这个客户，有的话就不用去请求接口了
      const similarCustomer = customerList.filter(item => {
        return item.customer_id == selectedCustomer.similar_id;
      });
      if(similarCustomer && similarCustomer.length > 0) {
        // 说明列表中已经有该父节点了
        const targetSimilarCustomer = similarCustomer[0];
        this.setState({
          targetSimilarCustomer,
          confirmVisible: true
        })
      } else {
        // 如果没有现成的similarId客户，就要通过接口去请求客户详情了
        dispatch({
          type: 'startDuplicateCustomerModel/customerDetailById',
          payload: {
            customerId:selectedCustomer.similar_id
          },
          callback: (result:boolean, customerData: CustomerDataSimple)=>{
            if(result) {
              if(customerData) {
                this.setState({
                  targetSimilarCustomer: customerData,
                  confirmVisible: true
                })
              }
            }
          }
        });
      }

    } else {
      return;
    }
  }

  /**
   * 查看客户详情
   */
  checkCustomerDetail = (customerId: string)=> {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("/customer/");
    const targetUrl = currentUrl.substring(0, index)+"/customer/customerManagement/customerDetail";
    window.open(targetUrl+"?customerId="+customerId);
  }

  handleAutoSwitchRepeatCustomer = () => {
    const {customerList, targetSimilarCustomer} = this.state;
    // 为了能自动选中选项，对于本来不在选项中的数据，要先把数据加入到选项列表。
    if(customerList.indexOf(targetSimilarCustomer) < 0) {
      customerList.push(targetSimilarCustomer);
    }
    // 点击确定按钮，要把原来选中的客户清除掉，然后替换成similarId客户的id。
    this.repeatCids?.pop();
    this.repeatCids?.push(targetSimilarCustomer.customer_id);
    // 更改完选中的数据后，刷新界面
    if(this.repeatCids) {
      this.setState({
        customerList,
        repeatCids:this.repeatCids,
      });
    }
  }

  handleCancelSwitchRepeatCustomer = ()=> {
    // 如果取消了，就把用户之前选中的那条非法数据，从选中项里清掉。
    this.repeatCids?.pop();
    if(this.repeatCids) {
      this.setState({
        repeatCids:this.repeatCids
      });
    }
  }

  /**
   * 提交
   */
  submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        keepCid: fieldsValue.keepCid,
        repeatCid: fieldsValue.repeatCid.join(","),
        remark: fieldsValue.remark
      }
      // 提交重单
      dispatch({
        type: 'startDuplicateCustomerModel/submitForm',
        payload: params,
        callback: (result:boolean, msg: string)=>{
          if(result) {  // 成功后回到客户详情页
            message.success(msg);
            this.backToCustomerDetail();
          } 
        }
      });

    })
  }

  /**
   * 跳转到审批列表
   */
  backToCustomerDetail = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'startDuplicateCustomerModel/backToCustomerDetail', 
      payload: {}
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const {customerList, currentUserInfo, confirmVisible} = this.state;
    return (
      <PageHeaderWrapper title="发起客户重复">
          <Spin spinning={!!loading} delay={300}>
          <Card bordered={false}>
            <div className={styles.tableListForm}>
              <span style={{color:"red"}}>注：提交客户后，会触发领导决定具体保留客户。</span>
              <br/> <br/>
              <Form onSubmit={this.submitForm}>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <Form.Item label='申请保留客户(单选)'>
                        {
                          getFieldDecorator('keepCid', { rules: [{ required: true, message: '请选择要保留的客户' }], 
                          initialValue: this.state.customerData?this.state.customerData.customer_id:undefined,
                          })(
                            <Select
                              loading={loading}
                              optionLabelProp='title'
                              placeholder='输入编号、姓名、手机号或微信号搜索客户'
                              style={{width:300}}
                              showSearch={true}
                              filterOption={false}
                              showArrow={false}
                              defaultActiveFirstOption={false}
                              onSearch={val => this.handleSearchCustomer(val, true)}
                              allowClear={true}
                              autoClearSearchValue={true}
                              onPopupScroll={this.handleSearchOptionsScroll}
                              onChange={this.handleChangeKeepCid}
                              onFocus={this.clearOptionsData}
                            >
                              {
                                customerList.map((customer, index) => (
                                    <Option 
                                      title={customer.customer_name + " " + customer.phone} 
                                      value={customer.customer_id} 
                                      key={customer.customer_id} >
                                        <div>{customer.customer_name + " " + customer.phone}<br/><span style={{marginLeft:10}}>婚期：{customer.wedding_date}</span></div>
                                    </Option>
                                  ))
                              }
                            </Select>,
                            
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <Form.Item label='关联重复客户(多选)'>
                        {
                          getFieldDecorator('repeatCid', { rules: [{ required: true, message: '请选择要关联的重复客户' }], 
                          })(
                            <Select
                              mode="multiple"
                              value={this.state.repeatCids}
                              loading={loading}
                              optionLabelProp='title'
                              placeholder='输入编号、姓名、手机号或微信号搜索客户'
                              style={{width:300}}
                              showSearch
                              filterOption={false}
                              showArrow={false}
                              defaultActiveFirstOption={false}
                              onSearch={val => this.handleSearchCustomer(val, false)}
                              allowClear={true}
                              autoClearSearchValue={true}
                              onPopupScroll={this.handleSearchOptionsScroll}
                              onChange={this.handleChangeRepeatCids}
                              onSelect={this.handleSelectRepeatOption}
                              onFocus={this.clearOptionsData}
                            >
                              {
                                customerList.map((customer, index) => (
                                    <Option 
                                      disabled={
                                        customer.customer_id==this.keepCid  // 如果当前客户和保留客户相同，不可选
                                        || (customer.similar_id!=0&&this.state.repeatCids.indexOf(customer.similar_id)>=0)  // 如果当前客户已经有了父节点并且该父节点已经被选为重复客户中的一个了，也不可选（不必再选）
                                        || customer.similar_id==this.keepCid // 如果当前客户有父节点并且父节点客户就是上面的保留客户，不可选（不必再选）
                                        || customer.repeat_audit_status==1  // 当前客户正在被其他客户拉重单，且没有审核完成，不可选。
                                      } 
                                      title={
                                        customer.customer_name + " " + customer.phone
                                      } 
                                      value={customer.customer_id} 
                                      key={customer.customer_id}
                                    >
                                      <div>
                                        {customer.customer_name + " " + customer.phone} {customer.repeat_audit_status==1 ?"(客户重单执行中)":(customer.similar_id!=0&&this.state.repeatCids.indexOf(customer.similar_id)>=0)?"（父客户已被选中）":customer.similar_id==this.keepCid?"（已发起过相同重单）":""}<br/><span style={{marginLeft:10}}>婚期：{customer.wedding_date}</span>
                                      </div>
                                    </Option>
                                  ))   
                              }
                            </Select>,
                            
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <Form.Item label='补充说明'>
                        {
                          getFieldDecorator('remark', { rules: [{ required: false}],
                          })(
                            <TextArea
                              style={{width:300}}
                              placeholder="在这里做简要说明"
                              autoSize={{ minRows: 3, maxRows: 5 }}
                              maxLength={1000}
                            />
                          )
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <Form.Item label='创建人'>
                      <span>{currentUserInfo.name}-{currentUserInfo.address}-{currentUserInfo.job_number}</span>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <Button type="primary" htmlType="submit" style={{marginLeft:60, paddingLeft:150, paddingRight:150}}>
                        提交
                      </Button>
                    </Col>
                  </Row>
              </Form>
            </div>
          </Card>
          </Spin>

          {
            this.state.selectingCustomer && this.state.targetSimilarCustomer && (
            <CustomerRepeatConfirmModal
              title="关联重复客户"
              visible={confirmVisible}
              currentCustomer={this.state.selectingCustomer}
              targetSimilarCustomer={this.state.targetSimilarCustomer}
              onOk={()=>{
                this.handleAutoSwitchRepeatCustomer();
                this.setState({
                  confirmVisible: false
                })
              }}
              onCancel={()=>{
                this.handleCancelSwitchRepeatCustomer();
                this.setState({
                  confirmVisible: false
                })
              }}
              />
            )
          }

      </PageHeaderWrapper>
    );
  }
}

export default Form.create<StartDuplicateCustomerProps>()(StartDuplicateCustomer);
