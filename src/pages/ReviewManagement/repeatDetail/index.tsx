
import { StateType } from "./model";
import styles from './style.less';
import Form, { FormComponentProps } from "antd/lib/form";
import { connect } from "dva";
import { Component } from "react";
import React from "react";
import { Card, Row, Col, Button, Timeline, Table, Modal, message, Spin, Divider, Descriptions, List, Steps, Radio, Input, Result, Checkbox, Empty } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Dispatch, Action } from "redux";
import { AuditData, CustomerDataSimple, RepeatDetailData, AuditHistoryItem } from "./data";
import LOCAL from '@/utils/LocalStorageKeys';
import FormItem from "antd/lib/form/FormItem";
import { RadioChangeEvent } from "antd/lib/radio";
import TextArea from "antd/lib/input/TextArea";
import CrmUtil from "@/utils/UserInfoStorage";
const { Step } = Steps;
const { confirm } = Modal;

interface RepeatDetailProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'reviewManagementRepeatDetail/do'
      | 'reviewManagementRepeatDetail/info'
      | 'reviewManagementRepeatDetail/toCustomerDetail'
    >
  >;
  loading: boolean;
  reviewManagementRepeatDetail: StateType;
}

interface RepeatDetailState {
  current: number;
  rejectModalVisible: boolean;
  rejectConfirmLoading: boolean;
  keepCustomerId: string | undefined;
}

@connect(
  ({
    reviewManagementRepeatDetail,
    loading,
  }: {
    reviewManagementRepeatDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    reviewManagementRepeatDetail,
    loading: loading.models.reviewManagementRepeatDetail,
  }),
)

class RepeatDetail extends Component<RepeatDetailProps, RepeatDetailState> {
  auditId = this.props.location?.state?.auditId ?? '';

  state: RepeatDetailState = {
    current: -1,
    rejectModalVisible: false,
    rejectConfirmLoading: false,
    keepCustomerId: undefined,
  }
  currentUserId: number = 0;
  componentDidMount() {
    this.currentUserId = CrmUtil.getUserInfo()?.user_id || 0;
    const { dispatch } = this.props;
    const payload = {
      aId: this.auditId,
    }
    //请求详情信息
    dispatch({
      type: 'reviewManagementRepeatDetail/info',
      payload: payload,
    });
  }

  refreshSelf = () => {
    const { dispatch } = this.props;
    const payload = {
      aId: this.auditId,
    }
    //请求详情信息
    dispatch({
      type: 'reviewManagementRepeatDetail/info',
      payload: payload,
    });
    this.setState({ current: -1 });

  }

  /**
   * 选择保留客户
   */
  onChangeKeepCustomer = (event: RadioChangeEvent) => {
    console.log("要保留的客户Id： " + JSON.stringify(event.target.value));
    const keepCustomerId = event.target.value;
    this.setState({
      keepCustomerId
    })
  }

  /**
   * 选择保留有效单
   */
  handleCheckReq = (event) => {
    console.log("event =  " + JSON.stringify(event))
    // event.value,
    // event.checked;
  }


  /**
   * 查看客户详情
   */
  checkCustomerDetail = (event: MouseEvent, customerId: string) => {
    event.preventDefault();
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("/review/");
    const targetUrl = currentUrl.substring(0, index) + "/customer/customerManagement/customerDetail";
    window.open(targetUrl + "?customerId=" + customerId);
  }

  /**
   * 查看有效单详情
   */
  checkRequestDetail = (customerId: string, reqId: string) => {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("/review/");
    const targetUrl = currentUrl.substring(0, index) + "/demand/demandManagement/demandDetails";
    window.open(targetUrl + "?customerId=" + customerId + "&reqId=" + reqId);
  }

  /**
   * 开始处理审批
   */
  handleStartReview = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  /**
   * 发起驳回
   */
  reject = () => {
    this.setState({
      rejectModalVisible: true
    })
  }

  /**
   * 确认驳回审批
   */
  handleRejectOk = () => {
    const { form } = this.props;
    form.validateFields(["remark"], (err, fieldsValue) => {
      if (err) return;

      this.setState({
        rejectConfirmLoading: true,
      });
      const { dispatch } = this.props;

      const payload = {
        remark: fieldsValue.remark,
        aId: this.auditId,
        status: 2,
      }
      dispatch({
        type: 'reviewManagementRepeatDetail/do',
        payload,
        callback: (result: boolean) => {
          this.setState({
            rejectModalVisible: false,
            rejectConfirmLoading: false,
          })
          if (result) {
            message.success("审批驳回成功");
            // 刷新当前页，客户重复详情。
            this.refreshSelf();
          }
        }
      });

    })
  }

  /**
   * 取消驳回
   */
  handleCancelReject = () => {
    this.setState({
      rejectModalVisible: false,
    });
  }

  /**
   * 确认提交
   */
  doSubmit = () => {
    const { form, dispatch } = this.props;
    const auditId = this.auditId;
    const { reviewManagementRepeatDetail: { data } } = this.props;
    const that = this;
    let fieldsKey: string[] = [];
    data?.auditContent.customer.req_category_data.map(requestInfo => {
      fieldsKey.push("cat" + requestInfo.category_id);
    })
    form.validateFieldsAndScroll(fieldsKey, (err, values) => {
      if (err) {
        return;
      } else {
        confirm({
          title: '是否确认提交?',
          okText: "确认",
          cancelText: "取消",
          onOk() {
            const keepCid = that.state.keepCustomerId;
            let keepRIds: string[] = [];
            fieldsKey.map(key => {
              if (values[key]) {
                keepRIds = [...keepRIds, ...values[key]];
              }
            })
            console.log("keepRIds = " + JSON.stringify(keepRIds));
            return new Promise<boolean>((resolve, reject) => {
              try {
                dispatch({
                  type: 'reviewManagementRepeatDetail/do',
                  payload: {
                    aId: auditId,
                    status: 3,
                    decision: {
                      keepCid,
                      keepRIds
                    }
                  },
                  callback: (success: boolean) => {
                    resolve(!!success);
                    if (success) {
                      that.next();
                    }
                  }
                })
              } catch (error) {
                reject(error);
              }
            });
          }
        });
      }
    })
  }

  steps = ["选择保留客户", "选择保留有效单", "完成"];

  next() {
    if (this.state.current == 0) {
      const { form } = this.props;
      form.validateFields(["keepCustomerId"], (errors, values) => {
        if (errors) {
          return;
        } else {
          const current = this.state.current + 1;
          this.setState({ current });
        }
      })
    } else {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  renderAuditData(auditData: AuditData) {
    return (
      <div>
        <Descriptions title={"状态：" + auditData.status_txt} column={1} layout="horizontal">
          <Descriptions.Item label="申请时间">{auditData.create_time}</Descriptions.Item>
          <Descriptions.Item label="申请人">{auditData.user_name}</Descriptions.Item>
          <Descriptions.Item label="申请说明">{auditData.remark ? auditData.remark : "暂无内容"}</Descriptions.Item>
        </Descriptions>
      </div>
    )
  }

  renderCustomersData(customersData: CustomerDataSimple[]) {
    const { reviewManagementRepeatDetail: { data } } = this.props;
    const status = data?.auditInfo.status;
    return (
      <div>
        <List
          grid={status == 1 ? { gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3, } : { gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2, }}
          dataSource={customersData}
          renderItem={(customerInfo, index) => (
            <List.Item>
              {this.renderCustomerInfoCard(customerInfo, index)}
            </List.Item>
          )}
        />
        {
          (data?.auditInfo?.auditor_id == this.currentUserId + "") && (data?.auditInfo?.is_owner == 1) && status == 1 && (
            <div style={this.buttonContainerStyle}>
              <Button type="danger" style={this.negButtonStyle} onClick={() => this.reject()}>审批驳回</Button>
              <Button type="primary" style={this.posButtonStyle} onClick={this.handleStartReview}>去处理</Button>
            </div>
          )
        }

      </div>

    )
  }

  buttonContainerStyle = {
    width: "50%",
    marginTop: 20,
    marginBottom: 20
  }
  negButtonStyle = {
    width: "30%",
    marginRight: "5%"
  }

  posButtonStyle = {
    width: "65%",
    marginLeft: "0%"
  }

  renderCustomerInfoCard(customerInfo: CustomerDataSimple, index: number) {
    const { reviewManagementRepeatDetail: { data } } = this.props;
    const status = data?.auditInfo.status;
    return (
      <div>
        <p>{index == 0 ? (status == 1 ? "申请保留客户" : "保留客户") : "重复客户"}</p>
        <Card size="small" title={customerInfo.customer_name + " " + customerInfo.phone} extra={<a onClick={(event) => { this.checkCustomerDetail(event, customerInfo.customer_id) }}>详情</a>}>
          {/* <p style={{fontWeight:500}}>{status == 1 ? "关联有效单" : "Ta的有效单"}</p> */}
          {
            customerInfo.req_info.length > 0 ? customerInfo.req_info.map(value => (
              <div>
                <p style={{ fontWeight: 500 }}>|{value.category_name}品类：</p>
                {
                  value.data.map(req_detail => (
                    // <Card type="inner" size="small" bordered={true} style={{paddingLeft:0, margin:0}}>
                    <Descriptions size="small" bordered={false} column={1} layout="horizontal" style={{ marginLeft: 10 }}>
                      <Descriptions.Item label="有效单编号"><a onClick={() => { this.checkRequestDetail(customerInfo.customer_id, req_detail.id) }}>{req_detail.req_num}</a></Descriptions.Item>
                      <Descriptions.Item label="归属人">{req_detail.full_user_name}</Descriptions.Item>
                    </Descriptions>
                    // </Card>
                  )
                  )
                }
              </div>
            )
            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>无有效单数据</span>} />
          }
        </Card>
      </div>

    )
  }

  renderReviewSteps(data: RepeatDetailData) {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current} style={{ width: "50%" }}>
          {this.steps.map(item => (
            <Step key={item} title={item} />
          ))}
        </Steps>

        {this.renderStepContent(current, data)}

        <div style={this.buttonContainerStyle}>
          {current == 0 && (
            <Button type="ghost" style={this.negButtonStyle} onClick={() => this.prev()}>
              取消
            </Button>
          )}
          {current > 0 && current < this.steps.length - 1 && (
            <Button type="ghost" style={this.negButtonStyle} onClick={() => this.prev()}>
              上一步
            </Button>
          )}
          {current < this.steps.length - 2 && (
            <Button type="primary" style={this.posButtonStyle} onClick={() => this.next()} >
              下一步
            </Button>
          )}
          {current === this.steps.length - 2 && (
            <Button type="primary" style={this.posButtonStyle} onClick={() => this.doSubmit()}>
              确认提交
            </Button>
          )}
          {/* {current === this.steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            已经完成
                        </Button>
                    )} */}
        </div>
      </div>
    )
  }

  renderStepContent(stepIndex: number, data: RepeatDetailData) {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div style={{ margin: 30 }}>
        {stepIndex == 0 && (
          <div>
            <p style={{ fontWeight: 500 }}>|第一步 请选择保留客户</p>
            <Form>
              {/* <Row gutter={{ md: 24, lg: 24, xl: 48 }}> */}
              {/* <Col span={15}> */}
              <FormItem style={{ width: '100%' }} >
                {
                  getFieldDecorator("keepCustomerId", {
                    rules: [{ required: true, message: '必须选择一个保留的客户' }],
                    initialValue: this.state.keepCustomerId ? this.state.keepCustomerId : undefined
                  })(
                    <Radio.Group onChange={this.onChangeKeepCustomer}>
                      {
                        data.auditContent.customer.customer_data.map((customerData, index) => (
                          <Radio style={{ ...radioStyle }} value={customerData.customer_id} >
                            {customerData.customer_name + "  " + customerData.phone}<span style={{ fontWeight: 500 }}> | </span>{"创建时间：" + customerData.create_time}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={(event) => { this.checkCustomerDetail(event, customerData.customer_id) }}>查看详情></a>
                          </Radio>
                        ))
                      }
                    </Radio.Group>
                  )
                }

              </FormItem>
              {/* </Col> */}
              {/* <Col span={5}>
                                    {
                                        data.auditContent.customer.customer_data.map((customerData, index) => (
                                            <a style={{...radioStyle, background:"yellow"}} onClick={()=>{this.checkCustomerDetail(customerData.customer_id)}}>查看详情></a>
                                        ))
                                    }
                                </Col> */}
              {/* </Row> */}
            </Form>

          </div>
        )}
        {stepIndex == 1 && (
          <div>
            <p>
              <span style={{ fontWeight: 500 }}>|第一步 已选保留客户  </span>
              <span>{
                data.auditContent.customer.customer_data.filter(customerData => {
                  return customerData.customer_id == this.state.keepCustomerId
                })[0].customer_name + " " +
                data.auditContent.customer.customer_data.filter(customerData => {
                  return customerData.customer_id == this.state.keepCustomerId
                })[0].phone
              } </span>
              <a onClick={(event) => { this.checkCustomerDetail(event, this.state.keepCustomerId ? this.state.keepCustomerId : "") }}>查看详情></a>
            </p>
            <p style={{ fontWeight: 500 }}>|第二步 请选择有效有效单</p>
            <Form>
              {
                data.auditContent.customer.req_category_data.map(requestInfo => (
                  <div>
                    <FormItem style={{ width: '100%' }} label={"|" + requestInfo.category_name + "品类："} >
                      {
                        getFieldDecorator("cat" + requestInfo.category_id)(
                          <Checkbox.Group >
                            {
                              requestInfo.data.map(requestSheetDetail => (
                                <div>
                                  <Checkbox value={requestSheetDetail.id} onChange={this.handleCheckReq} >有效单编号{requestSheetDetail.req_num}
                                  </Checkbox>
                                  <Card size="small" style={{ marginLeft: 10 }} bordered={false}>
                                    <Descriptions size="small" layout="horizontal" bordered={true} column={2}>
                                      <Descriptions.Item span={2} label={
                                        this.state.keepCustomerId && this.state.keepCustomerId == requestSheetDetail.customer_id ? (
                                          <span style={{ fontWeight: 500, color: "red" }}>保留客户</span>
                                        ) : "客户"}  >
                                        {
                                          this.state.keepCustomerId && this.state.keepCustomerId == requestSheetDetail.customer_id ? (
                                            <span style={{ fontWeight: 500, color: "red" }}>{requestSheetDetail.customer_name + " " + requestSheetDetail.customer_phone}</span>
                                          ) : requestSheetDetail.customer_name + " " + requestSheetDetail.customer_phone
                                        }
                                      </Descriptions.Item>
                                      <Descriptions.Item label="负责人">{requestSheetDetail.full_user_name}</Descriptions.Item>
                                      <Descriptions.Item label="建单时间">{requestSheetDetail.create_time}</Descriptions.Item>
                                    </Descriptions>
                                  </Card>
                                </div>
                              ))
                            }
                          </Checkbox.Group>
                        )
                      }
                    </FormItem>
                  </div>
                ))
              }
            </Form>
          </div>
        )}
        {
          stepIndex == 2 && (
            <Result
              status="success"
              title="审批完毕!"
              // subTitle={this.state.orderSuccessMsg}
              extra={[
                <Button type="primary" key="console" onClick={this.refreshSelf}>
                  查看详情
                                </Button>
              ]}
            />
          )
        }
      </div>
    )
  }

  render() {
    const { form, reviewManagementRepeatDetail: { data }, loading } = this.props;
    const { getFieldDecorator } = form;
    const { current, rejectModalVisible, rejectConfirmLoading } = this.state;
    if (data) {
      const status = data.auditInfo.status;
      return (
        <PageHeaderWrapper title={'客户重复详情'}>
          <Spin spinning={loading} >
            <Row gutter={{ md: 3, lg: 12, xl: 24 }}>
              <Col span={status == 1 ? 24 : 16}>
                <Card bordered={false}>
                  {this.renderAuditData(data.auditInfo)}
                  <Divider />
                  {
                    current < 0 && this.renderCustomersData(data.auditContent.customer.customer_data)
                  }
                  {
                    current >= 0 && this.renderReviewSteps(data)
                  }
                </Card>
              </Col>
              {
                status != 1 && (
                  <Col span={8}>
                    <Card bordered={false}>
                      <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>审批历史</div>
                      {
                        this.renderTimeline()
                      }
                    </Card>
                  </Col>
                )}

            </Row>

            <Modal
              title="驳回原因"
              visible={rejectModalVisible}
              onOk={this.handleRejectOk}
              confirmLoading={rejectConfirmLoading}
              onCancel={this.handleCancelReject}
            >
              <Form >
                <FormItem style={{ width: '100%' }} >
                  {
                    getFieldDecorator('remark', {
                      rules: [{ required: true, message: '驳回原因不能为空！' }]
                    })(
                      <TextArea rows={4} placeholder="请填写驳回原因" maxLength={1000} />
                    )
                  }
                </FormItem>
              </Form>
            </Modal>
          </Spin>
        </PageHeaderWrapper>
      );
    } else {
      return null;
    }
  }

  renderTimeline() {
    const { reviewManagementRepeatDetail: { data } } = this.props;
    return (
      <Timeline>
        {
          (data && data.auditRecord && data.auditRecord.length > 0) ? data.auditRecord.map(record => (
            <Timeline.Item>
              {
                this.renderTimelineItem(record)
              }
            </Timeline.Item>
          )) : null
        }
      </Timeline>
    )
  }

  renderTimelineItem(record: AuditHistoryItem) {
    return (
      <div>
        {
          (record.time && record.time != "" && record.time != null) ? record.time : null
        }
        <br />
        {
          (record.msg && record.msg != "" && record.msg != null) ? record.msg : null
        }
        <br />
        {
          (record.remark && record.remark != "" && record.remark != null) ? "详情：" + record.remark : null
        }
      </div>
    )
  }
}

export default Form.create<RepeatDetailProps>()(RepeatDetail);
