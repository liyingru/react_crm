import { Dispatch, Component } from "react";
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "./model";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React from "react";
import { Spin, Form, Modal, Row, Col, Card, message, Descriptions, Divider, Button, Timeline } from "antd";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { FormComponentProps } from "antd/lib/form";
import { RequestEntity } from "@/pages/DemandManagement/demandCommonSea/data";
import { AuditData, AuditHistoryItem } from "../reviewDetail/data";
import CrmUtil from "@/utils/UserInfoStorage";
import DistributeModalAdvanced from "@/components/DistributeModalAdvanced";

interface RequirementBackToSeasDetailProps extends FormComponentProps {
    dispatch: Dispatch<
        Action<
            | 'reviewManagementRequirBackToSeaDetail/info'
            | 'reviewManagementRequirBackToSeaDetail/do'
            | 'reviewManagementRequirBackToSeaDetail/redistribute'
            | 'reviewManagementRequirBackToSeaDetail/toReqDetail'
        >
    >;
    loading: boolean;
    reviewManagementRequirBackToSeaDetail: StateType;
}

interface RequirementBackToSeasDetailState {
    currentUserId: number;
    redistributeModalVisible: boolean;
    redistributeConfirmLoading: boolean;
    distributeExtraParams: {
        from: string,
        auditId: string
    }
}

@connect(
    ({
        reviewManagementRequirBackToSeaDetail,
        loading,
    }: {
        reviewManagementRequirBackToSeaDetail: StateType;
        loading: {
            models: {
                [key: string]: boolean;
            };
        };
    }) => ({
        reviewManagementRequirBackToSeaDetail,
        loading: loading.models.reviewManagementRequirBackToSeaDetail,
    }),
)

class RequirementBackToSeasDetail extends Component<RequirementBackToSeasDetailProps, RequirementBackToSeasDetailState> {
    auditId = this.props.location.state.auditId;
    isPubSeaOrDeadSeaOrClose: 1 | 2 | 3 = this.props.location.state.reviewType;  // 1:退回公海  2:退回死海 3: 关闭有效单
    userId = CrmUtil.getUserInfo()?.id;

    state: RequirementBackToSeasDetailState = {
        redistributeModalVisible: false,
        redistributeConfirmLoading: false,
        distributeExtraParams: {
            from: 'audit',
            auditId: ''
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const currentUserId = CrmUtil.getUserInfo()?.user_id || 0;
        this.setState({
            currentUserId,
            distributeExtraParams: {
                from: 'audit',
                auditId: this.auditId,
            }
        })
        const payload = {
            aId: this.auditId,
        }
        //请求详情信息
        dispatch({
            type: 'reviewManagementRequirBackToSeaDetail/info',
            payload,
        });
    }

    /**
     * 发起重新指派接收人
     */
    redistribute = () => {
        this.setState({
            redistributeModalVisible: true
        })
    }

    /**
     * 确认重新指派接收人
     */
    handleRedistributeOk = () => {
        this.setState({
            redistributeModalVisible: false,
        });
        //this.doAuth(3);
        // message.success("指派成功");
        // 刷新当前页，客户重复详情。
        this.refreshSelf();
    }

    /**
     * 取消重新指派
     */
    handleCancelRedistribute = () => {
        this.setState({
            redistributeModalVisible: false,
        });
    }

    /**
     * 审批通过3、驳回2、退回公海/死海
     */
    doAuth = (status: 2 | 3) => {
        const { dispatch } = this.props;
        const payload = {
            aId: this.auditId,
            status,
        }
        dispatch({
            type: 'reviewManagementRequirBackToSeaDetail/do',
            payload,
            callback: (result: boolean) => {
                if (result) {
                    message.success(status == 2 ? "驳回" : "审批" + "成功");
                    // 刷新当前页，客户重复详情。
                    this.refreshSelf();
                }
            }
        });
    }

    refreshSelf = () => {
        const { dispatch } = this.props;
        const payload = {
            aId: this.auditId,
        }
        //请求详情信息
        dispatch({
            type: 'reviewManagementRequirBackToSeaDetail/info',
            payload,
        });

    }

    /**
     * 退回公海/死海
     */
    backToSeas = () => {
        this.doAuth(3);
    }

    /**
     * 查看有效单详情
     */
    toReqDetail = (reqId: string, customerId: string) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reviewManagementRequirBackToSeaDetail/toReqDetail',
            payload: {
                reqId,
                showStyle: 1,
                customerId,
                readOrWrite: 0,  //从审批页跳过去的，不可操作
            },
        })
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

    renderAuditData = (auditData: AuditData) => {
        const otherInfo = JSON.parse(auditData.other_info);
        return (
            <div>
                <Descriptions column={1} layout="horizontal">
                    <Descriptions.Item label="审批编号">{auditData.create_time}</Descriptions.Item>
                    <Descriptions.Item label="申请类型">{auditData.type_txt}</Descriptions.Item>
                    <Descriptions.Item label="申请状态">{auditData.status_txt}</Descriptions.Item>
                    <Descriptions.Item label="申请时间">{auditData.create_time}</Descriptions.Item>
                    <Descriptions.Item label="申请人">{auditData.user_name}</Descriptions.Item>
                    <Descriptions.Item label={this.isPubSeaOrDeadSeaOrClose == 1 || this.isPubSeaOrDeadSeaOrClose == 2 ? "退回原因" : this.isPubSeaOrDeadSeaOrClose == 3 ? "关闭原因" : ""}>{auditData.remark ? auditData.remark : "无"}</Descriptions.Item>
                    {
                        this.isPubSeaOrDeadSeaOrClose == 1 || this.isPubSeaOrDeadSeaOrClose == 2 && (
                            <Descriptions.Item label="退回说明">{otherInfo.return_reason}</Descriptions.Item>
                        )
                    }
                    {
                        this.isPubSeaOrDeadSeaOrClose == 3 && (
                            <Descriptions.Item label="关闭说明">{otherInfo.close_reason}</Descriptions.Item>
                        )
                    }
                </Descriptions>
            </div>
        )
    }

    renderRequirementData = (reqData: RequestEntity) => {
        return (
            <div>
                <Descriptions column={1} layout="horizontal">
                    <Descriptions.Item label="有效单编号">
                        <a onClick={() => this.toReqDetail(reqData.id, reqData.customer_id)}>{reqData.req_num}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="创建时间">{reqData.create_time}</Descriptions.Item>
                    <Descriptions.Item label="客户姓名">{reqData.customer_name}</Descriptions.Item>
                    <Descriptions.Item label="所属区域">{reqData.city_info.full}</Descriptions.Item>
                    <Descriptions.Item label="业务品类">{reqData.category_txt}</Descriptions.Item>
                    <Descriptions.Item label="婚期">{reqData.wedding_date}</Descriptions.Item>
                    <Descriptions.Item label="历史来访渠道">{reqData.channel_txt ? reqData.channel_txt : "暂无内容"}</Descriptions.Item>
                    <Descriptions.Item label="预算">{reqData.budget}</Descriptions.Item>
                    <Descriptions.Item label="销售阶段">{reqData.phase_txt}</Descriptions.Item>
                    <Descriptions.Item label="累计跟进次数">{reqData.follow_num}</Descriptions.Item>
                    <Descriptions.Item label="累计跟进时间">{reqData.follow_time}</Descriptions.Item>
                    <Descriptions.Item label="最新跟进标签">{reqData.follow_tag_txt}</Descriptions.Item>
                    <Descriptions.Item label="最新跟进结果">{reqData.follow_status_txt}</Descriptions.Item>
                    <Descriptions.Item label="最新跟进内容">{reqData.follow_content}</Descriptions.Item>
                    <Descriptions.Item label="负责客服">{reqData.kefu}</Descriptions.Item>
                </Descriptions>
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
    renderActionButtons = (auditInfo: AuditData) => {
        if (this.isPubSeaOrDeadSeaOrClose == 1 || this.isPubSeaOrDeadSeaOrClose == 2) {
            return auditInfo.seq < auditInfo.total_seq ? (
                <div style={this.buttonContainerStyle}>
                    <Button type="danger" style={this.negButtonStyle} onClick={() => this.doAuth(2)}>驳回</Button>
                    <Button type="primary" style={this.posButtonStyle} onClick={() => this.doAuth(3)}>通过</Button>
                </div>
            ) : (
                    <div style={this.buttonContainerStyle}>
                        <Button type="danger" style={this.negButtonStyle} onClick={this.redistribute}>重新指派</Button>
                        <Button type="primary" style={this.posButtonStyle} onClick={() => this.backToSeas()}>退回{this.isPubSeaOrDeadSeaOrClose == 1 ? "公海" : "死海"}</Button>
                    </div>
                )
        } else {
            return (
                <div style={this.buttonContainerStyle}>
                    <Button type="danger" style={this.negButtonStyle} onClick={() => this.doAuth(2)}>驳回</Button>
                    <Button type="primary" style={this.posButtonStyle} onClick={() => this.doAuth(3)}>通过</Button>
                </div>
            );
        }

    }

    renderTimeline() {
        const { reviewManagementRequirBackToSeaDetail: { data } } = this.props;
        return (
            <Timeline>
                {
                    (data && data.auditRecord && data.auditRecord.length > 0) ? data.auditRecord.map(record => (
                        <Timeline.Item key={record.time}>
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

    render() {
        const { loading, form: { getFieldDecorator } } = this.props;
        const { redistributeModalVisible, redistributeConfirmLoading } = this.state;
        const { reviewManagementRequirBackToSeaDetail: { data } } = this.props;
        const { currentUserId } = this.state;
        if (data) {
            console.log("data.auditInfo.status = " + data.auditInfo.status + "   data.auditInfo.seq = " + data.auditInfo.seq)
        }
        return (
            <PageHeaderWrapper title={"有效单" + (this.isPubSeaOrDeadSeaOrClose == 1 ? "退回公海" : this.isPubSeaOrDeadSeaOrClose == 2 ? "退回死海" : this.isPubSeaOrDeadSeaOrClose == 3 ? "关闭" : "") + "审批"}>
                <Spin spinning={loading} >
                    {
                        data && (
                            <Row gutter={{ md: 3, lg: 12, xl: 24 }}>
                                <Col span={(data.auditInfo.status == 1 && data.auditInfo.seq == 1) ? 24 : 16}>
                                    <Card bordered={false}>
                                        {data.auditInfo && this.renderAuditData(data.auditInfo)}
                                        <Divider />
                                        {
                                            data.auditContent && this.renderRequirementData(this.isPubSeaOrDeadSeaOrClose == 1 ? data.auditContent.reqPublicSea : this.isPubSeaOrDeadSeaOrClose == 2 ? data.auditContent.reqDeadSea : this.isPubSeaOrDeadSeaOrClose == 3 ? data.auditContent.closeReq : {})
                                        }
                                        {
                                            data.auditInfo && data.auditInfo.auditor_id == currentUserId + "" && data.auditInfo.is_owner == 1 && this.renderActionButtons(data.auditInfo)
                                        }
                                    </Card>
                                </Col>
                                {
                                    (data.auditInfo.status != 1 || data.auditInfo.seq != 1) && (
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
                        )}

                    {data && data.auditContent && (
                        <DistributeModalAdvanced
                            title="重新指派接收人"
                            visible={redistributeModalVisible}
                            onDistributeSuccess={this.handleRedistributeOk}
                            extraParams={this.state.distributeExtraParams}
                            confirmLoading={redistributeConfirmLoading}
                            onDistributeCancel={this.handleCancelRedistribute}
                            items={this.isPubSeaOrDeadSeaOrClose == 1 ? [data.auditContent.reqPublicSea] : [data.auditContent.reqDeadSea]}
                        >
                        </DistributeModalAdvanced>
                    )}


                    {/* <DistributeModal
                        title="重新指派接收人"
                        visible={redistributeModalVisible}
                        onOk={this.handleRedistributeOk}
                        confirmLoading={redistributeConfirmLoading}
                        onCancel={this.handleCancelRedistribute}
                        >
                        <Form >
                            <FormItem style={{ width: '100%' }} >
                            {
                                getFieldDecorator('remark', {
                                rules: [{ required: true, message: '请选择接收人' }]
                                })(
                                    <TextArea rows={4} placeholder="请选择接收人" maxLength={1000} />
                                )
                            }
                            </FormItem>
                        </Form>
                    </DistributeModal> */}
                </Spin>
            </PageHeaderWrapper>
        );
    }
}

export default Form.create<RequirementBackToSeasDetailProps>()(RequirementBackToSeasDetail);