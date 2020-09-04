import { ContractEntity, ContractItem, UserEntity } from "../../../../CustomerManagement/customerDetail/dxl/data";
import { Component } from "react";
import React from "react";
import { Button, Table, Modal, Form, Row, Col, Input, Select, DatePicker, message, Divider, Descriptions, Icon, Spin, Card } from 'antd';
import styles from './index.less';
import { FormComponentProps } from "antd/es/form";
import Axios from "axios";
import URL from '@/api/serverAPI.config';
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { CloseOutlined } from "@ant-design/icons";
import { ConfigListItem } from "@/pages/OrderManagement/newOrder/data";
import LOCAL from '@/utils/LocalStorageKeys';
import { routerRedux } from "dva/router";
import { Dispatch, Action } from 'redux';
import { connect } from 'dva';
import moment from "moment";
import getUserInfo from '@/utils/UserInfoStorage'
import CrmUtil from "@/utils/UserInfoStorage";
import { SettlementInfoItem, SettlementInfo } from "../../data";


function CompareDate(startTime: string, endTime: string) {
    if (startTime || endTime) {
        return true
    } else {
        return ((new Date(startTime.replace(/-/g, "\/"))) > (new Date(endTime.replace(/-/g, "\/"))));
    }
}

interface MerchantsSettlementPros extends FormComponentProps {
    orderId: string;
    visible: boolean,
    saveFunction: Function;
    onCancel: Function;
    showSettlementInfoView: any
    settlementInfoList: SettlementInfoItem[]
}

export interface ConfigState {
    storeServiceType: ConfigListItem[]
}


export interface MerchantsSettlementState {

    loading: boolean;
    visible: boolean,
    settlementInfoList: SettlementInfoItem[],
    settlementList: SettlementInfo[],
    customerConfig: ConfigState
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
class MerchantsSettlement extends Component<MerchantsSettlementPros, MerchantsSettlementState>{
    currentUserInfo: any;

    constructor(props: Readonly<MerchantsSettlementPros>) {
        super(props);
        this.setState({
            visible: this.props.visible,
            settlementInfoList: this.props.settlementInfoList
        })
        this.currentUserInfo = CrmUtil.getUserInfo() || {};
    }
    state: MerchantsSettlementState = {
        loading: false,
        settlementInfoList: [],
        visible: false,
        customerConfig: {
            storeServiceType: []
        },
        settlementList:[]
    }

    componentDidMount() {
        //配置信息
        Axios.post(URL.customerConfig)
            .then(
                res => {
                    if (res.code == 200) {
                        this.setState({
                            customerConfig: res.data.result
                        })
                    }
                }
            );

        if (this.state.settlementInfoList.length == 0) {
            this.state.settlementInfoList.push({id:"", service_type: "", store_name: "", contact_user: "", settlement_amount: "" })
        }
    }


    componentWillReceiveProps(nextProps: any) {
        if (nextProps.visible !== this.props.visible) {
            this.setState({ 'visible': nextProps.visible });
        }

        if (nextProps.settlementInfoList !== this.props.settlementInfoList) {
            this.setState({ 'settlementInfoList': nextProps.settlementInfoList });
            if (this.state.settlementInfoList && this.state.settlementInfoList.length == 0) {
                this.state.settlementInfoList.push({id:"",service_type: "", store_name: "", contact_user: "", settlement_amount: "" })
            }
        }
    }

    // 添加结算
    addSettlement = (e: React.FormEvent) => {
        this.state.settlementInfoList.push({id:"",service_type: "", store_name: "", contact_user: "", settlement_amount: "" })
        this.setState((prevState) => {
            const list = [...prevState.settlementInfoList];
            return { settlementInfoList: list }
        })
    }

    // 结算取消
    handleCancelSettlement = (e: React.FormEvent) => {
        this.setState({
            visible: false,
        })
        this.props.showSettlementInfoView(false)
    }


    // 结算确认
    handleOkSettlement = (e: React.FormEvent) => {
        const { form, dispatch } = this.props;
        const { settlementList } = this.state
        form.validateFieldsAndScroll((err: any, values: any) => {
            if (!err) {

                if (settlementList.length == 0) {
                    message.info("结算不能为空");
                    return
                }
                this.setState({
                    loading: true
                })
                const valuesResult =
                {
                    'orderId': this.props.orderId,
                    'settlementInfo': settlementList,
                }
                Axios.post(URL.saveStoreSettlement, valuesResult).then(
                    res => {
                        if (res.code == 200) {
                            message.info(res.msg);
                            // 商家结算
                            const settlementListParams = { orderId: this.props.orderId, }
                            dispatch({
                                type: 'getDetailsModelType/getStoreSettlement',
                                payload: settlementListParams,
                            });
                        }
                        this.setState({
                            loading: false
                        })
                    }
                );

                this.setState({
                    visible: false,
                })
                this.props.showSettlementInfoView(false)
            }
        })
    }


    //服务类型监听
    serviceTypeChange = (e, index) => {
        this.state.settlementList[index].serviceType = e.key;
    }


    //商家名称监听
    merchantNameChange = (e, index) => {
        this.state.settlementList[index].storeName = e.target.value;
    }

    //联系人监听
    contactChange = (e, index) => {
        this.state.settlementList[index].contactUser = e.target.value;
    }

    //结算金额监听
    amountChange = (e, index) => {
        this.state.settlementList[index].settlementAmount = e.target.value;
    }

    //删除结算信息
    deleteSettlement = (e: React.FormEvent, item: any) => {
        var SettlementArray = removeAaary(this.state.settlementInfoList, item)
        this.setState({
            settlementInfoList: SettlementArray,
        })
    }


    getSettlementTodoItem(obj: any) {
        const { form: { getFieldDecorator, getFieldValue }, } = this.props;
        const { customerConfig } = this.state

        return (
            obj && obj.length > 0 ? obj.map((item, index) => {
                return (
                    <div className={styles.tableListForm}>
                        <div key={index} style={{ marginBottom: 10, }}>
                            <Card style={{ width: '95%' }}>
                                <div className={styles.picWrap}>
                                    <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                                        <Col span={24}>
                                            <FormItem label="服务类型" style={{ marginTop: 20 }}>
                                                {getFieldDecorator('type' + index, {
                                                    rules: [{ required: true, message: '请选择服务类型', }],
                                                    initialValue: item && item.service_type ? item.service_type : undefined
                                                })(
                                                    <Select placeholder="请选择服务类型" style={{ width: '100%', }} onChange={(e) => this.serviceTypeChange(e, index)}>
                                                        {
                                                            customerConfig.storeServiceType.map(serviceType => (
                                                                <Option value={serviceType.id}>{serviceType.name}</Option>))

                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                        <Col span={24}>
                                            <FormItem label="商家名称" style={{ marginTop: 20 }}>
                                                {getFieldDecorator('name' + index, { rules: [{ required: true, message: '请输入商家名称', }], initialValue: item && item.store_name ? item.store_name : '' })(
                                                    <Input autoComplete="off" style={{ width: '100%' }} placeholder="请输入商家名称" onChange={(e) => this.merchantNameChange(e, index)} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                        <Col span={24}>
                                            <FormItem label="联系人" style={{ marginTop: 20 }}>
                                                {getFieldDecorator('contact' + index, { rules: [{ required: true, message: '请输入商家联系人', }], initialValue: item && item.contact_user ? item.contact_user : '' })(
                                                    <Input autoComplete="off" style={{ width: '100%' }} placeholder="请输入商家联系人" onChange={(e) => this.contactChange(e, index)} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                        <Col span={24}>
                                            <FormItem label="结算金额" style={{ marginTop: 20 }}>
                                                {getFieldDecorator('amount' + index, { rules: [{ required: true, message: '请输入结算金额', }], initialValue: item && item.settlement_amount ? item.settlement_amount : '' })(
                                                    <Input autoComplete="off" style={{ width: '100%' }} placeholder="请输入结算金额" onChange={(e) => this.amountChange(e, index)} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <CloseOutlined className={styles.deleteBt} onClick={(e) => { this.deleteSettlement(e, item) }} />

                                </div>
                            </Card>
                        </div>
                    </div>
                )
            }) : null
        )
    }


    render() {
        return (
            <div>

                <Modal
                    title="填写商家结算"
                    visible={this.state.visible}
                    onOk={this.handleOkSettlement}
                    onCancel={this.handleCancelSettlement}
                >
                    <div >
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={24}>
                                <div style={{ marginTop: 20, height: 350, overflowY: 'auto', overflowX: 'hidden', marginBottom: 30 }}>
                                    {this.getSettlementTodoItem(this.state.settlementInfoList)}
                                    <a style={{ width: 100, marginBottom: 30, marginLeft: 200 }} type="primary" onClick={(e) => { this.addSettlement(e) }}>+添加结算信息 </a>

                                </div>
                            </Col>
                        </Row>

                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create<MerchantsSettlementPros>()(MerchantsSettlement);