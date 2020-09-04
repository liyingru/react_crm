
import { StateType } from "./model";
import styles from './style.less';
import Form, { FormComponentProps } from "antd/lib/form";
import { connect } from "dva";
import { Component } from "react";
import React from "react";
import { Card, Row, Col, Button, Timeline, Table, Modal, message, Spin } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Dispatch, Action } from "redux";
import { AuditHistoryItem, ContractItem, ReceivablesData, LeadsData, TransferData } from "./data";
import PicBrowser from '@/components/PicBrowser';
import TextArea from "antd/lib/input/TextArea";
import CrmUtil from "@/utils/UserInfoStorage";

interface ReviewDetailProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'reviewManagementReviewDetail/do'
      | 'reviewManagementReviewDetail/info'
      | 'reviewManagementReviewDetail/leadDetail'
      | 'reviewManagementReviewDetail/orderDetail'
    >
  >;
  loading: boolean;
  reviewManagementReviewDetail: StateType;
}

interface ReviewDetailState {
  closeModalVisible: boolean,
  optionVisible: boolean,
  userId: any;
}

@connect(
  ({
    reviewManagementReviewDetail,
    loading,
  }: {
    reviewManagementReviewDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    reviewManagementReviewDetail,
    loading: loading.models.reviewManagementReviewDetail,
  }),
)

class ReviewDetail extends Component<ReviewDetailProps, ReviewDetailState> {
  auditId = this.props.location?.state?.auditId ?? '';

  state: ReviewDetailState = {
    closeModalVisible: false,
    optionVisible: true,
    userId: ''
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const payload = {
      aId: this.auditId,
    }
    //配置信息
    dispatch({
      type: 'reviewManagementReviewDetail/info',
      payload: payload,
    });

    const userId = CrmUtil.getUserInfo()?.id;
    this.setState({
      userId
    })
  }

  handleReviewOk = () => {
    const { dispatch } = this.props;
    const payload = {
      aId: this.auditId,
      status: 3,
    }
    dispatch({
      type: 'reviewManagementReviewDetail/do',
      payload: payload,
      callback: () => {
        message.success('审批通过成功')
        this.setState({
          optionVisible: false,
        })
      }
    });
  }

  handleReviewCancel = () => {
    this.setState({
      closeModalVisible: true,
    })
  }

  handleCloseReqOk = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error('请输入驳回原因')
        return;
      }
      const payload = {
        ...values,
        aId: this.auditId,
        status: 2,
      }
      dispatch({
        type: 'reviewManagementReviewDetail/do',
        payload: payload,
        callback: () => {
          this.setState({
            closeModalVisible: false,
            optionVisible: false,
          })
          message.success('审批驳回成功')
        }
      });
    })
  }

  handleCloseReqCancel = () => {
    this.setState({
      closeModalVisible: false,
    })
  }

  handleOrder = (orderId: number, customerId: number) => {
    const { dispatch } = this.props;
    const payload = {
      orderId: orderId,
      customerId: customerId
    }
    dispatch({
      type: 'reviewManagementReviewDetail/orderDetail',
      payload: payload,
    });
  }

  handleLeads = (leadId: number, customerId: number) => {
    const { dispatch } = this.props;
    const payload = {
      customerId: customerId,
      leadId: leadId,
      hiddenNextButton: true,
      claimTableListFlag: true,
    }
    dispatch({
      type: 'reviewManagementReviewDetail/leadDetail',
      payload: payload,
    });
  }

  render() {
    const { form, reviewManagementReviewDetail: { data }, loading } = this.props;
    const { getFieldDecorator } = form;
    //console.log('data?.auditInfo?.auditor_id',data?.auditInfo?.auditor_id)
    return (
      <PageHeaderWrapper title={'审批详情'}>
        <Spin spinning={loading}>
          <Row gutter={{ md: 3, lg: 12, xl: 24 }}>
            <Col span={16}>
              <Card bordered={false}>
                <div className={styles.line}>
                  <div className={styles.lineKey}>审批ID：</div>
                  <div className={styles.lineValue}>{data?.auditInfo?.id}</div>
                </div>
                <div className={styles.line}>
                  <div className={styles.lineKey}>审核类型：</div>
                  <div className={styles.lineValue}>{data?.auditInfo?.type_txt}</div>
                </div>
                <div className={styles.line}>
                  <div className={styles.lineKey}>状态：</div>
                  <div className={styles.lineValue}>{data?.auditInfo?.status_txt}</div>
                </div>
                <div className={styles.line}>
                  <div className={styles.lineKey}>提交人：</div>
                  <div className={styles.lineValue}>{data?.auditInfo?.user_name}</div>
                </div>
                <div className={styles.line}>
                  <div className={styles.lineKey}>提交时间：</div>
                  <div className={styles.lineValue}>{data?.auditInfo?.create_time}</div>
                </div>
                <div className={styles.typleContent}>{this.renderContent()}</div>
                {
                  (data?.auditInfo?.auditor_id == this.state.userId) && (data?.auditInfo?.is_owner == 1) && (data?.auditInfo?.status == 1) || this.state.userId == 771 ?
                    < div className={styles.subContent} hidden={!this.state.optionVisible}>
                      <Button type="primary" style={{ flexGrow: 1 }} onClick={() => this.handleReviewOk()}>审批通过</Button>
                      <Button style={{ marginLeft: '20px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={() => this.handleReviewCancel()}>审批驳回</Button>
                    </div> : ''
                }

              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>审批历史</div>
                {
                  this.renderTimeline()
                }
              </Card>
            </Col>
          </Row>
          <Modal
            title={'驳回说明'}
            visible={this.state.closeModalVisible}
            onOk={() => this.handleCloseReqOk()}
            destroyOnClose={true}
            onCancel={() => this.handleCloseReqCancel()}>
            <Form>
              {getFieldDecorator('remark', {
                rules: [{ required: true, message: '请输入驳回原因' }],
              })(
                <TextArea autoSize={{ minRows: 10, maxRows: 10 }} placeholder="请输入驳回原因" />
              )}
            </Form>
          </Modal>
        </Spin>
      </PageHeaderWrapper >
    );
  }

  renderContent() {
    const { reviewManagementReviewDetail: { data } } = this.props;
    if (data) {
      if (data.auditContent) {
        let type: string = data.auditInfo.type;
        if (type + '' === '1') {  //合同
          if (data.auditContent.contract && data.auditContent.contract.length > 0) {
            return (
              <Card title="合同" size={'default'}>
                {
                  this.renderContract(data.auditContent.contract)
                }
              </Card>
            )
          }
        } else if (type + '' === '2') {  //订单回款
          if (data.auditContent.receivables) {
            return (
              <Card title="订单回款" size={'default'}>
                {
                  this.renderOrderPayment(data.auditContent.receivables)
                }
              </Card>
            )
          }
        } else if (type + '' === '3') {  //退回公海
          if (data.auditContent.leads) {
            return (
              <Card title="申请退回公海" size={'default'}>
                {
                  this.renderReturnHighSeas(data.auditContent.leads)
                }
              </Card>
            )
          }
        } else if (type + '' === '4') {  //拉重单
          // if (data.auditContent.contract && data.auditContent.contract.length > 0) {
          //     return (
          //         <Card title="拉重单" size={'default'}>
          //             {
          //                 this.renderContract(data.auditContent.contract)
          //             }
          //         </Card>
          //     )
          // }
        } else if (type + '' === '5') {  //转给同事
          if (data.auditContent.transfer) {
            return (
              <Card title="转给同事" size={'default'}>
                {
                  this.renderTransferColleagues(data.auditContent.transfer)
                }
              </Card>
            )
          }
        }
      }
    }
    return (null)
  }

  //合同渲染
  renderContract(contractItems: ContractItem[]) {
    return (
      <div>
        <Row gutter={[8, 8]}>
          {
            contractItems.map(item => {
              if (item.type == 'input') {
                return <Col span={12}>
                  <div className={styles.contractitem}>
                    <span className={styles.keystyle}>{item.key}</span>
                    <span className={styles.maostyle}>:</span>
                    <span>{item.value}</span>
                  </div>
                </Col>
              } else if (item.type == 'text') {
                return <Col span={24}>
                  <div className={styles.contractitem}>
                    <span className={styles.keystyle}>{item.key}</span>
                    <span className={styles.maostyle}>:</span>
                    <span>{item.value}</span>
                  </div>
                </Col>
              } else if (item.type == 'image') {
                return <Col span={24}>
                  <div className={styles.contractitem}>
                    <div className={styles.keystyle}>{item.key}<span className={styles.maostyle}>:</span></div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {
                        item.value.map((url: string) => (
                          <div style={{ padding: 5 }}>
                            <PicBrowser wt={100} ht={100} imgSrc={url} ></PicBrowser>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </Col>
              } else if (item.type == 'receivables_plan') {
                return <Col span={24}>
                  <div className={styles.contractitem}>
                    <div className={styles.keystyle}>{item.key}<span className={styles.maostyle}>:</span></div>
                    <Table
                      size='small'
                      style={{ marginTop: 5 }}
                      columns={item.columns}
                      dataSource={item.value}
                      pagination={false}
                    />
                  </div>
                </Col>
              } else if (item.type == 'preferential_info') {
                return <Col span={24}>
                  <div className={styles.contractitem}>
                    <div className={styles.keystyle}>{item.key}<span className={styles.maostyle}>:</span><br /></div>
                    <div >
                      {
                        item.value.map((item, index) => (
                          <div style={{ padding: 5 }}>
                            <span>优惠{index + 1}：{item.typeName}<br />优惠内容：{item.content}<br /></span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </Col>
              } else if (item.type == 'product_info') {
                return <Col span={24}>
                  <div className={styles.contractitem}>
                    <div className={styles.keystyle}>{item.key}<span className={styles.maostyle}>:</span><br /></div>
                    <div >
                      {
                        item.value.map((item) => (
                          <div style={{ padding: 5 }}>
                            <span style={{ width: '100%' }}>
                              产品名称：{item.name}<br />
                              品类：{item.category_name}<br />
                              产品价格：{(item.price_min && item.price_max) ? item.price_min + "~" + item.price_max : "无"}<br />
                              商家：{item.merchant_name}<br /><br />
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </Col>
              } else {
                return ''
              }
            })
          }
        </Row>
      </div>
    )
  }

  renderOrderPayment(receivables: ReceivablesData) {
    return (
      <div>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>订单编号</span>
              <span className={styles.maostyle}>:</span>
              <span><a onClick={() => this.handleOrder(receivables.order_id, receivables.customer_id)}>{receivables.order_num}</a></span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>合同编号</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.contract_num}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>签单日期</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.sign_date}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>合同金额</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.contract_amount}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>计划回款期数</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.plan_number}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>本期回款期次</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.number}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>计划回款金额</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.plan_receivables_money}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>已回款金额</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.already_receivables_money}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>未回款金额</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.no_receivables_money}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>逾期天数</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.overdue_days}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>回款状态</span>
              <span className={styles.maostyle}>:</span>
              <span>{receivables.status}</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  renderReturnHighSeas(leads: LeadsData) {
    return (
      <div>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>线索编号</span>
              <span className={styles.maostyle}>:</span>
              <span><a onClick={() => this.handleLeads(leads.id, leads.customer_id)}>{leads.id}</a></span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>客户姓名</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.name}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>所属区域</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.location_city}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>客资来源</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.channel}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>活动名称</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.task_id}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>业务品类</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.category}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>婚期</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.wedding_date}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>预算</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.budget}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>线索状态</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.status}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>超时时长</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.timeout}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>创建时间</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.create_time}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>最新服务时间</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.follow_newest}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>最新联系时间</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.follow_log}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.contractitem}>
              <span className={styles.keystyle}>负责客服</span>
              <span className={styles.maostyle}>:</span>
              <span>{leads.user_name}</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  renderPullRepeatOrder() {

  }

  renderTransferColleagues(transfer: TransferData) {
    return (
      <div style={{ display: 'flex' }}>
        <span className={styles.keystyle}>划转动作</span>
        <span className={styles.maostyle}>:</span>
        <div>原客服负责</div>
        <div style={{ fontWeight: 'bold' }}>{transfer.org_owner_name}</div>
        <div>划给负责客服</div>
        <div style={{ fontWeight: 'bold' }}>{transfer.owner_name}</div>
      </div>
    )
  }

  renderTimeline() {
    const { reviewManagementReviewDetail: { data } } = this.props;
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

export default Form.create<ReviewDetailProps>()(ReviewDetail);
