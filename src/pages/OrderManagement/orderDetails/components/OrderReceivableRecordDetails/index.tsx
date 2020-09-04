
import { Modal, Form, Select, DatePicker, Input, Row, Col, Button, Divider, Timeline, Spin } from 'antd';
import React from 'react';
import styles from "./index.less";
import { FormComponentProps } from 'antd/es/form';
import { PlansItem, PlansItemList, receivableRecordItem } from '../../data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import PicBrowser from '@/components/PicBrowser'
import moment from 'moment';
import NumericInput from '@/components/NumericInput';


interface RecordDetailsProps extends FormComponentProps {
    isVisble: boolean,
    cancelFunction: Function,
    model: PlansItemList,
}

class OrderReceivableRecordDetailsPage extends React.Component<RecordDetailsProps> {

    constructor(props: any) {
        super(props);
        // 初始化
        this.state = {
            isFinshRequest: false,
            detailsModel: {}

        }
    }

    componentWillReceiveProps(nextProps) {
        const { model } = nextProps;
        if (model?.id != this.props?.model?.id) {
            this.getDetails(model)
        }
    }

    getDetails = (model: PlansItemList) => {

        if (model?.id) {
            var values = {};
            values['receivablesId'] = model?.id
            values['planId'] = model?.plan_id

            Axios.post(URL.moneyDetail, values).then(
                res => {
                    if (res.code == 200) {
                        this.setState({
                            detailsModel: res.data.result,
                            isFinshRequest: true
                        })
                    }
                }
            );
        }

    }

    cancel = () => {
        const { cancelFunction } = this.props;
        cancelFunction()
        this.setState({
            isFinshRequest: false
        })
    }

    render() {

        const { isVisble } = this.props;
        const { detailsModel } = this.state;

        return (
            <Modal
                visible={isVisble}
                closable={false}
                onCancel={this.cancel}
                title={[
                    // 0:待提交;1:待审核 2:审核驳回 3:审核通过
                    <div>
                        {this.state?.isFinshRequest ?
                            detailsModel?.check_status == 2 ?
                                <div style={{ display: 'flex' }}>
                                    <div>回款记录</div>
                                    <div style={{ marginLeft: '10px', color: 'red' }}>{detailsModel?.check_status_txt}</div>
                                </div>
                                :
                                <div style={{ display: 'flex' }}>
                                    <div>回款记录</div>
                                    <div style={{ marginLeft: '10px' }}>{detailsModel?.check_status_txt}</div>
                                </div>
                            :
                            <div>回款记录</div>}
                    </div>

                ]}
                footer={[
                    <Button
                        type='primary'
                        onClick={
                            this.cancel
                        }>
                        返回
                    </Button>
                ]}
            >

                < div >
                    {
                        this.state?.isFinshRequest ?
                            <div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>关联合同：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.contract_num}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>回款计划：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.receivables_number}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>回款日期：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.plan_receivables_date}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>回款金额：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.money}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>回款类型：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.receivables_type_txt}</div>
                                </div>
                                <Divider />
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>付款方式：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.payment_mode_txt}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>付款名称：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.payment_user}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>付款账户：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.payment_account}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>回款说明：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.remark}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>收款票据：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.receipt_note}</div>
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>回款凭证：</div>
                                    {detailsModel && detailsModel?.payment_voucher?.map((item) => {
                                        return (
                                            <PicBrowser wt={25} ht={25} imgSrc={item} />
                                        );
                                    })}
                                </div>
                                <div className={styles.itemStyle}>
                                    <div className={styles.itemHeader}>回款销售：</div>
                                    <div className={styles.itemValue}>{detailsModel && detailsModel?.payee_txt}</div>
                                </div>
                                <Divider />


                                <Timeline style={{ overflowY: 'auto', maxHeight: 200, paddingTop: 10 }}>
                                    {detailsModel && detailsModel?.auditInfo?.map((item, index) => {

                                        if (detailsModel && detailsModel?.check_status == 2) {

                                            if (item?.status == 2) {
                                                return (
                                                    <Timeline.Item color='red'>
                                                        {item?.status_txt}
                                                        <p>{item?.user_name} {item?.audit_time}</p>
                                                        <p style={{ color: 'red' }}>{item?.remark}</p>
                                                    </Timeline.Item>
                                                );
                                            } else {
                                                return (
                                                    <Timeline.Item color='green'>
                                                        {item?.status_txt}
                                                        <p>{item?.user_name} {item?.audit_time}</p>
                                                        <p>{item?.remark}</p>
                                                    </Timeline.Item>
                                                );
                                            }

                                        } else {
                                            return (
                                                <Timeline.Item color='green'>
                                                    {item?.status_txt}
                                                    <p>{item?.user_name} {item?.audit_time}</p>
                                                    <p>{item?.remark}</p>
                                                </Timeline.Item>
                                            );
                                        }

                                    })}

                                </Timeline>
                            </div> : <Spin />
                    }
                </div>

            </Modal >
        )
    }
}

export default OrderReceivableRecordDetailsPage;