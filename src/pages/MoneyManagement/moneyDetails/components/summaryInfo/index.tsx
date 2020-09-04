import React, { Component } from "react";

import {Form, Input, Icon ,Table,Divider } from "antd";
import { FormComponentProps } from "antd/es/form";
import styles from "./index.less"
import { SummaryData } from "../../data";

const FormItem = Form.Item;

export interface Attrs {
    name: string[];
    enable: boolean;
    disable: boolean;
    isEditing: boolean;
}

export interface SummaryInfoPros extends FormComponentProps {
    summaryInfo: Partial<SummaryData>;
    onChange: (params: SummaryData, callback: () => void) => void;
}

export interface SummaryInfoState {
    itemAttrs: Attrs[];
}

class SummaryInfo extends Component<SummaryInfoPros, SummaryInfoState>{


    // #可编辑 o有效单详情不显示
    attrs: Attrs[] = [{
        // 收据号
        name: ['receipt_num'],
        enable: true,
        disable: true,
        isEditing: false,
    }]


    state: SummaryInfoState = {
        itemAttrs: this.attrs,
    }

    formatDefaultSelect = (propName: string | undefined) => {
        if (propName != undefined && propName != null && propName != '0') {
            return propName
        }
        return null
    }

    formatDefaultInput = (propName: string | undefined) => {
        if (propName != undefined && propName != null) {
            return propName
        }
        return null
    }

    editClick = (item: Attrs) => {
        const { itemAttrs } = this.state;
        const { form} = this.props;
        form.resetFields()
        const attrs = itemAttrs.map(value => {
            const attr = { ...value }
            if (attr.name == item.name && attr.enable) {
                attr.disable = false
                attr.isEditing = true
            } else {
                attr.disable = true
                attr.isEditing = false
            }
            return attr;
        })
        this.setState({
            itemAttrs: attrs
        })
    }

    checkClick = (item: Attrs) => {
        const { form} = this.props;
        form.validateFields(item.name, (err, fieldsValue) => {
            if (err) return;
            const params = { ...fieldsValue }
            this.props.onChange(params, () => {
                form.resetFields()
                this.setState({
                    itemAttrs: this.attrs
                })
            })
        })
    }

    closeClick = (item: Attrs) => {
        const { form } = this.props;
        form.resetFields()
        this.setState({
            itemAttrs: this.attrs
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { summaryInfo } = this.props;
        const { itemAttrs } = this.state;

        const attrs = [{
            name:'合同编号：',
            value:summaryInfo.contract_num
        },{
            name:'签单时间：',
            value:summaryInfo.sign_date
        },{
            name:'签单人：',
            value:summaryInfo.sign_user
        },{
            name:'签单部门：',
            value:summaryInfo.sign_structure
        }]

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const operateArea = (index: number) => {
            if(summaryInfo.editable == 0) return ''
            const item = itemAttrs[index];
            return !item.enable ? '' : (
                item.isEditing ? (<div className={styles.editingIcon}>
                    <Icon type="check" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.checkClick(item)} />
                    <Icon type="close" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.closeClick(item)} />
                </div>) : <Icon type="edit" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.editClick(item)} />)

        }

        const plannerColumns = [
            {
                title: '策划师',
                dataIndex: 'user_name',
                key: 'user_name',
            },
            {
                title: '分佣占比',
                dataIndex: 'ratio',
                key: 'ratio',
            },
            {
                title: '订单占比',
                dataIndex: 'order_amount',
                key: 'order_amount',
            },
            {
                title: '合同占比',
                dataIndex: 'contract_amount',
                key: 'contract_amount',
            },
            {
                title: '实收占比',
                dataIndex: 'receivables_amount',
                key: 'receivables_amount',
            },
            {
                title: '未收占比',
                dataIndex: 'no_receivables_amount',
                key: 'no_receivables_amount',
            },
            {
                title: '录入人',
                dataIndex: 'create_user',
                key: 'create_user',
            },
            {
                title: '录入时间',
                dataIndex: 'create_time',
                key: 'create_time',
            },
        ];

        const storeColumns = [
            {
                title: '服务类型',
                dataIndex: 'service_type',
                key: 'service_type',
            },
            {
                title: '商家名称',
                dataIndex: 'store_name',
                key: 'store_name',
            },
            {
                title: '联系人',
                dataIndex: 'contact_user',
                key: 'contact_user',
            },
            {
                title: '结算金额',
                dataIndex: 'settlement_amount',
                key: 'settlement_amount',
            },
            {
                title: '录入人',
                dataIndex: 'create_user',
                key: 'create_user',
            },
            {
                title: '录入时间',
                dataIndex: 'create_time',
                key: 'create_time',
            },
        ];
        return (
            <Form {...formItemLayout} layout='horizontal' className={styles.formIem}>
                {/* <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 24 }}>基础信息</div>
                <ul className={styles.ullist}>
                    {
                        attrs.map(item=><li><span>{item.name}</span><span>{item.value}</span></li>)
                    }
                </ul>
                <FormItem label='收据号'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[0].name[0], {
                                initialValue: this.formatDefaultInput(summaryInfo.receipt_num),
                            })(<Input style={{ width: '40%' }} disabled={itemAttrs[0].disable} />)
                        }
                        {
                            operateArea(0)
                        }
                    </div>
                </FormItem> */}
                <div className={styles.content}>
                    <h4>商家服务</h4>
                    <Table dataSource={summaryInfo.storeServiceList} columns={storeColumns} />
                </div>
                <Divider />
                <div className={styles.content}>
                    <h4>策划师佣金比</h4>
                    <Table dataSource={summaryInfo.plannerRatioList} columns={plannerColumns} />
                </div>
            </Form>
        )
    }
}

export default Form.create<SummaryInfoPros>()(SummaryInfo)