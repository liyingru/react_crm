import { Component } from "react";
import React from "react";
import { Button, Table, Modal, Form, Row, Col, Input, Select, DatePicker, message, Divider, Descriptions, Icon, Spin, Card } from 'antd';
import styles from './index.less';
import { FormComponentProps } from "antd/es/form";
import { ColumnProps } from "antd/lib/table";
import Axios from "axios";
import URL from '@/api/serverAPI.config';
import PicBrowser from '@/components/PicBrowser';
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { ConfigListItem } from "@/pages/OrderManagement/newOrder/data";
import LOCAL from '@/utils/LocalStorageKeys';
import { routerRedux } from "dva/router";
import { Dispatch, Action } from 'redux';
import { connect } from 'dva';
import OrderDetailsInputPerCent from "../OrderDetailsInputPerCent";
import moment from "moment";
import getUserInfo from '@/utils/UserInfoStorage'
import CrmUtil from "@/utils/UserInfoStorage";
import { ContractEntity } from "../../data";


function CompareDate(startTime: string, endTime: string) {
    if (startTime || endTime) {
        return true
    } else {
        return ((new Date(startTime.replace(/-/g, "\/"))) > (new Date(endTime.replace(/-/g, "\/"))));
    }
}

export interface ContractTabPros extends FormComponentProps {
    contractList: ContractEntity[];
    orderId: string;
    editegiscontract: boolean
    dispatch: Dispatch<Action>

}

export interface ConfigState {
    agreementTypeList: ConfigListItem[]
}

export interface agreementInfo {
    type?: string
    content?: string
}

export interface ContractTabState {
    contractDetail: ContractItem[];
    showDetail: boolean;
    loading: boolean;
    agreementInfoList: agreementInfo[]
    agreementInfoVisible: boolean
    contractConfig: ConfigState
    currentContractId: string
    currentAgreementNum: string
    contractList: ContractEntity[];
    showInputPercent: boolean
}

/*删除数组中的某一个对象
_arr:数组
_obj:需删除的对象
*/
function removeAaary(_arr, _obj) {
    var length = _arr.length;
    for (var i = 0; i < length; i++) {
        if (_arr[i] == _obj) {
            _arr.splice(i, 1); //删除下标为i的元素
            return _arr
            break
        }
    }
}

@connect(() => ({}))
class ContractTab extends Component<ContractTabPros, ContractTabState>{
    currentUserInfo: any;

    constructor(props: Readonly<ContractTabPros>) {
        super(props);
        this.setState({
            'contractList': this.props.contractList
        })
        this.currentUserInfo = CrmUtil.getUserInfo() || {};
    }
    state: ContractTabState = {
        showDetail: false,
        loading: false,
        contractDetail: [],
        agreementInfoList: [],
        agreementInfoVisible: false,
        contractConfig: {
            agreementTypeList: []
        },
        currentContractId: '',
        currentAgreementNum: '',
        contractList: this.props.contractList,
        showInputPercent: false
    }

    componentDidMount() {
        //配置信息
        Axios.post(URL.getContractConfig)
            .then(
                res => {
                    if (res.code == 200) {
                        this.setState({
                            contractConfig: res.data.result
                        })
                    }
                }
            );


    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.contractList !== this.props.contractList) {
            this.setState({ 'contractList': nextProps.contractList });
        }
    }


    column: ColumnProps<ContractEntity>[] = [
        {
            title: '签订时间',
            dataIndex: 'sign_date',
        },

        {
            title: '合同类别',
            dataIndex: 'category_txt',
        },
        {
            title: '合同号',
            dataIndex: 'contract_num',
            render: (text, recoder) => (
                <span>
                    <a onClick={() => this.contractDetail(recoder)}>{recoder.contract_num}</a>
                </span>

            )
        },
        {
            title: '关联协议',
            dataIndex: 'agreement_num',
            render: (text, recoder) => (
                <span>
                    <a onClick={() => this.agreementInfoHint(recoder)}>{recoder.agreement_num}</a>
                </span>

            )
        },

        {
            title: '合同标题',
            dataIndex: 'contract_alias',
        },
        {
            title: '合同金额',
            dataIndex: 'total_amount',
        },
        {
            title: '合同状态',
            dataIndex: 'audit_status_txt',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 150
        },
        {
            title: '创建人',
            dataIndex: 'create_by',
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            render: (text, recoder) => (this.operateMethod(recoder))
        }
    ];

    //审核状态(0:待提交;1:待审核 2:审核驳回 3:审核通过)
    operateMethod = (recoder: ContractEntity) => {
        /**
         * （录占比目前只对武汉喜庄和塞尔维开放）
            1、合同号可以进入合同详情页
            2、对于合同状态为”待提交“的对应操作按钮”提交“和”录占比“
            3、对于合同状态为"审核驳回"的对应操作按钮”重新编辑“和”录占比“
            4、待审核的合同只有”录占比“
         */
        if (recoder.audit_status == 0) {//待提交：提交和补充协议
            if (CrmUtil.getCompanyType() == 3) {
                return (
                    <span>
                        <a onClick={() => this.submitContractAudit(recoder)}>提交审核</a>|
                        <label style={{ color: "gray", cursor: "not-allowed" }}>录占比</label>
                        <a onClick={() => this.editContract(recoder)}>|修改</a>|
                    </span>
                )
            } else {
                return (
                    <span>
                        <a onClick={() => this.submitContractAudit(recoder)}>提交审核</a>|
                        <a onClick={() => this.supplementAgreement(recoder)}>{recoder.agreement_num ? '修改协议' : '录协议'}</a>
                        <a onClick={() => this.editContract(recoder)}>|修改</a>
                    </span>
                )
            }
        } else if (recoder.audit_status == 3) {//审批通过：补充协议
            if (CrmUtil.getCompanyType() == 3) {
                var time = new Date()
                let currentDate = moment(time).format('YYYY-MM-DD');
                //合同审核通过+婚期结束后放开录占比功能
                if (CompareDate(currentDate, recoder.wedding_date)) {
                    return (
                        <span>
                            <a onClick={() => this.supplementAgreement(recoder)}>{recoder.agreement_num ? '修改协议' : '录协议'}</a>|
                            <a onClick={() => this.entryProportion(recoder)}>录占比</a>
                        </span>
                    )
                } else {
                    return (
                        <span>
                            <a onClick={() => this.supplementAgreement(recoder)}>{recoder.agreement_num ? '修改协议' : '录协议'}</a>|
                            <label style={{ color: "gray", cursor: "not-allowed" }}>录占比</label>
                        </span>
                    )
                }
            } else {
                return (
                    <span>
                        <a onClick={() => this.supplementAgreement(recoder)}>{recoder.agreement_num ? '修改协议' : '录协议'}</a>
                        {this.props.editegiscontract && CrmUtil.getCompanyType() != 1 && <a onClick={() => this.editContract(recoder)}>|修改</a>}
                    </span>
                )
            }

        } else if (recoder.audit_status == 2) {//2:审核驳回：重新编辑
            if (CrmUtil.getCompanyType() == 3) {
                return (
                    <span>

                        <label style={{ color: "gray", cursor: "not-allowed" }}>录占比</label>
                        <a onClick={() => this.editContract(recoder)}>修改</a>|
                    </span>
                )
            } else {
                return (
                    <span>
                        <a onClick={() => this.editContract(recoder)}>修改</a>
                    </span>
                )
            }

        } else if (recoder.audit_status == 1) {
            //1:待审核 待审批：无操作按钮
            if (CrmUtil.getCompanyType() == 3) {
                return (
                    <span>
                        <label style={{ color: "gray", cursor: "not-allowed" }}>录占比</label>
                    </span>
                )
            } else {
                return (
                    <span>
                        {this.props.editegiscontract && CrmUtil.getCompanyType() != 1 ? <a onClick={() => this.editContract(recoder)}>修改</a> : undefined}
                    </span>
                )
            }
        } else {
            return (
                <span>
                    {this.props.editegiscontract && CrmUtil.getCompanyType() != 1 ? <a onClick={() => this.editContract(recoder)}>修改</a> : undefined}
                </span>
            )
        }


    }

    agreementInfoHint = (recoder: any) => {
        Modal.info({
            title: '协议信息',
            content: (
                <div>
                    <span>协议编号：{recoder.agreement_num}</span><br /><br />
                    {
                        recoder.agreementInfo.map((item, index) => (
                            item.typeName != '' && item.content != '' ? (
                                <span>项目类型{index + 1}：{item.type_txt}<br />项目内容：{item.content}<br /><br /></span>)
                                : ''))
                    }
                </div>
            ),
            onOk() { },
        });
    }

    //录占比 目前只对武汉喜庄和塞尔维开放
    entryProportion = (recoder: any) => {
        this.setState({
            showInputPercent: true,
            currentContractId: recoder.id,
        })

    }

    cancelInputPercentFunction = () => {
        this.setState({
            showInputPercent: false,
        })
    }

    //重新编辑合同
    editContract = (recoder: any) => {
        if (recoder.id) {
            // var pathName = ''
            // if (recoder.category == '1') {
            //   pathName = '/saleManagement/hy/saleList/orderDetails/editContract'
            // } else if (recoder.category == '2') {
            //   pathName = '/saleManagement/hq/saleList/orderDetails/editContract'
            // } else if (recoder.category == '4') {
            //   pathName = '/saleManagement/qd/saleList/orderDetails/editContract'
            // }else if (recoder.category == '7') {
            //   pathName = '/saleManagement/hslf/saleList/orderDetails/editContract'
            // }
            const pathName = window.location.href.substr(window.location.href.indexOf(window.location.pathname)) + "/editContract";

            this.props.dispatch(routerRedux.push({
                pathname: pathName,
                query: {
                    contractId: recoder.id,
                    orderId: this.props.orderId
                }
            }))
        }
    }

    //获取指定订单下的合同列表
    getContractByOrderId = () => {
        //配置信息
        Axios.post(URL.contractList, { 'orderId': this.props.orderId })
            .then(
                res => {
                    if (res.code == 200) {
                        this.setState({
                            'contractList': res.data.result.rows
                        })
                    }
                }
            );
    }

    //补充协议
    supplementAgreement = (recoder: any) => {
        const { form } = this.props;
        if (recoder.agreement_num) {
            form.setFieldsValue({
                agreementNum: recoder.agreement_num
            })
        } else {
            form.setFieldsValue({
                agreementNum: ''
            })
        }

        this.setState({
            currentContractId: recoder.id,
            currentAgreementNum: recoder.agreement_num
        })
        this.showAgreementInfoView(recoder)
    }

    // 添加协议视图展示
    showAgreementInfoView = (recoder: any) => {
        this.state.agreementInfoList.push(...recoder.agreementInfo)
        if (this.state.agreementInfoList.length == 0) {
            this.state.agreementInfoList.push({ type: "", content: "", })
        }

        this.setState({
            agreementInfoVisible: true
        })
    }

    // 添加协议
    addAgreement = (e: React.FormEvent) => {
        this.state.agreementInfoList.push({ type: "", content: "", })
        this.setState((prevState) => {
            const list = [...prevState.agreementInfoList];
            return { agreementInfoList: list }
        })
    }

    // 协议取消
    handleCancelAgreement = (e: React.FormEvent) => {
        this.setState({
            agreementInfoVisible: false,
            agreementInfoList: []
        })
    }

    // 协议确认
    handleOkAgreement = (e: React.FormEvent) => {
        const { form } = this.props;
        const { agreementInfoList, currentAgreementNum, currentContractId } = this.state
        form.validateFieldsAndScroll((err: any, values: any) => {
            if (!err) {

                var agreementInfoStr = ''
                if (agreementInfoList.length > 0) {
                    agreementInfoStr = JSON.stringify(agreementInfoList);
                } else {
                    message.info("协议不能为空");
                    return
                }
                this.setState({
                    loading: true
                })
                const valuesResult =
                {
                    'contractId': currentContractId,
                    'agreementNum': currentAgreementNum,
                    'agreementInfo': agreementInfoStr,
                }
                Axios.post(URL.updateAgreement, valuesResult).then(
                    res => {
                        if (res.code == 200) {
                            message.info(res.msg);
                            this.getContractByOrderId()
                        }
                        this.setState({
                            loading: false
                        })
                    }
                );

                this.setState({
                    agreementInfoVisible: false,
                    agreementInfoList: []
                })
            }
        })
    }

    //协议编号
    agreementNumChange = (e) => {
        this.setState({
            currentAgreementNum: e.target.value
        })
    }

    //协议类型监听
    agreementTypeChange = (e, index) => {
        this.state.agreementInfoList[index].type = e.key;
        this.state.agreementInfoList[index].type_txt = e.label;
    }

    //协议内容监听
    agreementContentChange = (e, index) => {
        this.state.agreementInfoList[index].content = e.target.value;
    }

    //删除协议信息
    deleteAgreement = (e: React.FormEvent, item: any) => {
        var agreementArray = removeAaary(this.state.agreementInfoList, item)
        this.setState({
            agreementInfoList: agreementArray,
        })
    }

    //提交审批
    submitContractAudit = (bean: ContractEntity) => {
        this.setState({
            loading: true
        })
        Axios.post(URL.submitAudit, { contractId: bean.id }).then(
            res => {
                if (res.code == 200) {
                    message.info(res.msg);
                    this.getContractByOrderId()
                }
                this.setState({
                    loading: false
                })
            }
        );
    }

    contractDetail = (bean: ContractEntity) => {
        this.setState({
            loading: true
        })
        Axios.post(URL.contractDetail, { contractId: bean.id }).then(
            res => {
                if (res.code == 200) {
                    this.setState({
                        contractDetail: res.data.result,
                        showDetail: true,
                        loading: false,
                    })
                } else {
                    this.setState({
                        loading: false
                    })
                }
            }
        );
    }

    backList = () => {
        this.setState({
            showDetail: false
        })
    }

    getAgreementTodoItem(obj: any) {
        const { form: { getFieldDecorator, getFieldValue }, } = this.props;
        const { contractConfig } = this.state

        return (
            obj.map((item, index) => {
                return (
                    <div className={styles.tableListForm}>
                        <div key={index} style={{ marginBottom: 10, }}>
                            <Card style={{ width: '95%' }}>
                                <div className={styles.picWrap}>
                                    <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                                        <Col span={24}>
                                            <FormItem label={"项目类型" + (index + 1)}>
                                                {getFieldDecorator('type' + index, {
                                                    rules: [{ required: true, message: '请选择项目类型', }],
                                                    initialValue: item.type_txt ? { label: item.type_txt } : undefined
                                                })(
                                                    <Select labelInValue={true} placeholder="请选择项目类型" style={{ width: '100%', }} onChange={(e) => this.agreementTypeChange(e, index)}>
                                                        {
                                                            contractConfig.agreementTypeList.map(agreementType => (
                                                                <Option value={agreementType.id}>{agreementType.name}</Option>))

                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                        <Col span={24}>
                                            <FormItem label="项目内容">
                                                {getFieldDecorator('content' + index, { rules: [{ required: true, message: '请填写项目内容', }], initialValue: item.content })(
                                                    <TextArea rows={2} autoComplete="off" style={{ width: '100%', marginTop: 20 }} placeholder="请填写项目内容" onChange={(e) => this.agreementContentChange(e, index)} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <CloseOutlined className={styles.deleteBt} onClick={(e) => { this.deleteAgreement(e, item) }} />

                                </div>
                            </Card>
                        </div>
                    </div>
                )
            })
        )
    }


    render() {
        const { form: { getFieldDecorator, getFieldValue }, } = this.props;

        const { contractList } = this.state;
        const { showDetail, contractDetail = [] } = this.state;

        return (
            <div>
                {
                    showDetail == false ? (
                        <div>
                            <Spin spinning={this.state.loading}>
                                <Table
                                    scroll={{ x: 'max-content' }}
                                    size='small'
                                    columns={this.column}
                                    dataSource={contractList}
                                    pagination={false} />
                            </Spin>
                        </div>) :
                        (<div>
                            <Button size="small" onClick={() => this.backList()}><LeftOutlined />返回上级</Button>
                            <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
                                {
                                    contractDetail.map(item => {
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

                        </div>)
                }
                <Modal
                    title="填写协议"
                    visible={this.state.agreementInfoVisible}
                    onOk={this.handleOkAgreement}
                    onCancel={this.handleCancelAgreement}
                >
                    <div >
                        <div className={styles.tableListForm}>
                            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                <Col span={24}>
                                    <FormItem label="协议编号" style={{ width: '90%' }}>
                                        {getFieldDecorator('agreementNum', { rules: [{ required: false, message: '请输入协议编号', }] })(
                                            <Input autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入" onChange={(e) => { this.agreementNumChange(e) }} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={24}>
                                <div style={{ marginTop: 20, height: 350, overflowY: 'auto', overflowX: 'hidden', marginBottom: 30 }}>
                                    {this.getAgreementTodoItem(this.state.agreementInfoList)}
                                    <a style={{ width: 100, marginBottom: 30, marginLeft: 200 }} type="primary" onClick={(e) => { this.addAgreement(e) }}>+添加项目 </a>

                                </div>
                            </Col>
                        </Row>

                    </div>
                </Modal>

                <OrderDetailsInputPerCent
                    contractId={this.state.currentContractId}
                    visible={this.state.showInputPercent}
                    onCancel={this.cancelInputPercentFunction}
                />
            </div>
        )
    }
}

export default Form.create<ContractTabPros>()(ContractTab);