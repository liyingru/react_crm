import React, { Component } from "react";

import { Form, Input, Select, DatePicker, Icon } from "antd";
import { FormComponentProps } from "antd/es/form";
import { ConfigList } from "@/pages/CustomerManagement/commondata";
import AreaSelect from "@/components/AreaSelect";
import moment from "moment";
import NumericInput from "@/components/NumericInput";
import styles from "./index.less"
import { CustomerData, CityInfo } from "../../data";

const FormItem = Form.Item;
const { Option } = Select;

export interface Attrs {
    name: string[];
    enable: boolean;
    disable: boolean;
    isEditing: boolean;
    citycode?: string;
}

export interface CustomerInfoPros extends FormComponentProps {
    showStyle?: 0 | 1; // 0 表示客户， 1 表示有效单
    customerData: Partial<CustomerData>;
    config: ConfigList;
    onChange: (params: CustomerData, callback: () => void) => void;
}

export interface CustomerInfoState {
    itemAttrs: Attrs[];
}

class CustomerInfo extends Component<CustomerInfoPros, CustomerInfoState>{


    // #可编辑 o有效单详情不显示
    attrs: Attrs[] = [{
        // 客户编号
        name: ['customer_id'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 客户姓名
        name: ['customer_name'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 客户级别 # o
        name: ['customerLevel'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 客户状态 # o
        name: ['customerStatus'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 性别 #
        name: ['gender'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 客户身份 #
        name: ['identity'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 客户来源
        name: ['channel'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 手机号码
        name: ['phone'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 
        name: ['weChat'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 居住地址  #
        name: ['liveCityCode', 'liveAddress'],
        enable: false,
        disable: true,
        isEditing: false,
        citycode: '100000',
    }, {
        // 工作地址  #
        name: ['workCityCode', 'workAddress'],
        enable: false,
        disable: true,
        isEditing: false,
        citycode: '100000',
    }, {
        // 方便联系时间 #
        name: ['contactTime'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 创建时间
        name: ['creatTime'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 创建人
        name: ['creatName'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 推荐人
        name: ['referrerName'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 推荐人手机
        name: ['referrerPhone'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        // 婚期
        name: ['weddingDate'],
        enable: false,
        disable: true,
        isEditing: false,
    }]


    state: CustomerInfoState = {
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

    formatDefaultTime = (propName: string | undefined, format: string) => {
        if (propName != undefined && propName != null && propName != "") {
            return moment(propName, format)
        }
        return null
    }

    formatDefaultCode = (cityinfo?: CityInfo) => {
        if (cityinfo) {  // if(a) 可以过滤 undefined ，null，空字符串，0
            if (cityinfo.city_code) {
                return cityinfo.city_code
            }
        }
        return '100000'
    }


    editClick = (item: Attrs) => {
        const { itemAttrs } = this.state;
        const { form, customerData } = this.props;
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
        const { form, customerData } = this.props;
        form.validateFields(item.name, (err, fieldsValue) => {
            if (err) return;
            const params = { ...fieldsValue }
            params.customerId = customerData.customerId
            const weddingdate = fieldsValue.weddingDate;
            if (weddingdate != undefined && weddingdate != "") {
                params.weddingDate = weddingdate.format('YYYY-MM-DD');
            }
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

    liveCityChange = (code: string) => {
        this.props.form.setFieldsValue({
            'liveCityCode': code,
        })
    }

    workCityChange = (code: string) => {
        this.props.form.setFieldsValue({
            'workCityCode': code,
        })
    }

    likeCityChange = (code: string) => {
        this.props.form.setFieldsValue({
            'likeCityCode': code,
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { customerData, config, showStyle } = this.props;
        const { itemAttrs } = this.state;
        const timeFormat = 'YYYY-MM-DD HH:mm:ss'
        const dateFormat = 'YYYY-MM-DD'

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
            if (customerData.editable == 0) return ''
            const item = itemAttrs[index];
            return !item.enable ? '' : (
                item.isEditing ? (<div className={styles.editingIcon}>
                    <Icon type="check" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.checkClick(item)} />
                    <Icon type="close" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.closeClick(item)} />
                </div>) : <Icon type="edit" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.editClick(item)} />)

        }

        this.attrs.forEach(value => {
            if (value.citycode != undefined) {
                if (value.name[0] == 'liveCityCode') {
                    value.citycode = this.formatDefaultCode(customerData.live_city_info)
                } else if (value.name[0] == 'workCityCode') {
                    value.citycode = this.formatDefaultCode(customerData.work_city_info)
                } else if (value.name[0] == 'likeCityCode') {
                    value.citycode = this.formatDefaultCode(customerData.like_city_info)
                }
            }
        })

        return (
            <Form {...formItemLayout} layout='horizontal' className={styles.formIem}>
                <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 24 }}>基础信息</div>
                <FormItem label='客户编号'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[0].name[0], {
                                initialValue: this.formatDefaultInput(customerData.customer_id),
                            })(<Input style={{ width: '40%' }} disabled={itemAttrs[0].disable} />)
                        }
                        {
                            operateArea(0)
                        }
                    </div>
                </FormItem>
                <FormItem label='客户姓名'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[1].name[0], {
                                initialValue: this.formatDefaultInput(customerData.customer_name),
                            })(<Input style={{ width: '40%' }} disabled={itemAttrs[1].disable} maxLength={8} />)
                        }
                        {
                            operateArea(1)
                        }
                    </div>
                </FormItem>
                <FormItem label='客户级别'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[2].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.level + 1),
                            })(
                                <Select style={{ width: '40%' }} placeholder='请选择' disabled={itemAttrs[2].disable}>
                                    {
                                        config.customerLevel.map(state => (
                                            <Option value={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(2)
                        }
                    </div>
                </FormItem>
                <FormItem label='客户状态'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[3].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.status + 1),
                            })(
                                <Select style={{ width: '40%' }} placeholder='请选择' disabled={itemAttrs[3].disable}>
                                    {
                                        config.customerStatus && config.customerStatus.map(state => (
                                            <Option value={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(3)
                        }
                    </div>
                </FormItem>
                <FormItem label='性别'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[4].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.gender),
                            })(
                                <Select style={{ width: '20%' }} placeholder='请选择' disabled={itemAttrs[4].disable}>
                                    {
                                        config.gender.map(state => (
                                            <Option value={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(4)
                        }
                    </div>
                </FormItem>
                <FormItem label='客户身份'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[5].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.identity),
                            })(
                                <Select style={{ width: '40%' }} placeholder='请选择' disabled={itemAttrs[5].disable}>
                                    {
                                        config.identity.map(state => (
                                            <Option value={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(5)
                        }
                    </div>
                </FormItem>
                <FormItem label='客户来源'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[6].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.channel_text),
                            })(<Input style={{ width: '40%' }} placeholder="请输入" disabled={itemAttrs[6].disable} />)
                        }
                        {
                            operateArea(6)
                        }
                    </div>
                </FormItem>
                <FormItem label='手机号码'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[7].name[0], {
                                rules: [{ required: false, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: event => event.target.value.replace(/\D/g, ''),
                                initialValue: this.formatDefaultInput(customerData.phone),
                            })(<Input style={{ width: '40%' }} placeholder="请输入" disabled={itemAttrs[7].disable} maxLength={11} />)
                        }
                        {
                            operateArea(7)
                        }
                    </div>
                </FormItem>
                <FormItem label='微信号'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[8].name[0], {
                                initialValue: this.formatDefaultInput(customerData.weChat),
                            })(<Input style={{ width: '40%' }} placeholder="请输入" disabled={itemAttrs[8].disable} />)
                        }
                        {
                            operateArea(8)
                        }
                    </div>
                </FormItem>
                <FormItem label='婚期'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[16].name[0], {
                                initialValue: this.formatDefaultTime(customerData.wedding_date, dateFormat)
                            })
                                (<DatePicker
                                    disabled={itemAttrs[16].disable}
                                    format={dateFormat}
                                    placeholder='' />)
                        }
                        {
                            operateArea(16)
                        }
                    </div>
                </FormItem>
                <FormItem label='居住地址'>
                    <div className={styles.areaItem}>
                        <div style={{ width: '60%' }}>
                            {
                                getFieldDecorator(itemAttrs[9].name[0])
                                    (<AreaSelect
                                        selectedCode={itemAttrs[9].citycode}
                                        areaSelectChange={code => this.liveCityChange(code)}
                                        disabled={itemAttrs[9].disable} />)
                            }
                        </div>

                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[9].name[1], {
                                    initialValue: this.formatDefaultInput(customerData.liveAddress),
                                })(<Input style={{ width: '80%' }} placeholder="请输入" disabled={itemAttrs[9].disable} />)
                            }
                            {
                                operateArea(9)
                            }
                        </div>
                    </div>
                </FormItem>
                <FormItem label='工作地址'>
                    <div className={styles.areaItem}>
                        <div style={{ width: '60%' }}>
                            {
                                getFieldDecorator(itemAttrs[10].name[0])
                                    (<AreaSelect
                                        selectedCode={itemAttrs[10].citycode}
                                        areaSelectChange={code => this.workCityChange(code)}
                                        disabled={itemAttrs[10].disable} />)
                            }
                        </div>

                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[10].name[1], {
                                    initialValue: this.formatDefaultInput(customerData.workAddress),
                                })(<Input style={{ width: '80%' }} placeholder="请输入" disabled={itemAttrs[10].disable} />)
                            }
                            {
                                operateArea(10)
                            }
                        </div>
                    </div>
                </FormItem>
                <FormItem label='方便联系时间'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[11].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.contact_time),
                            })(
                                <Select style={{ width: '40%' }} placeholder='请选择' disabled={itemAttrs[11].disable}>
                                    {
                                        config.contactTime.map(state => (
                                            <Option value={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(11)
                        }
                    </div>
                </FormItem>
                <FormItem label='创建时间'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[12].name[0], {
                                initialValue: this.formatDefaultInput(customerData.create_time),
                            })(<Input style={{ width: '40%' }} disabled={itemAttrs[12].disable} />)
                        }
                        {
                            operateArea(12)
                        }
                    </div>
                </FormItem>
                <FormItem label='创建人'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[13].name[0], {
                                initialValue: this.formatDefaultInput(customerData.create_user),
                            })(<Input style={{ width: '40%' }} placeholder="请输入" disabled={itemAttrs[13].disable} />)
                        }
                        {
                            operateArea(13)
                        }
                    </div>
                </FormItem>
                <FormItem label='推荐人'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[14].name[0], {
                                initialValue: this.formatDefaultInput(customerData.referrer_name),
                            })(<Input style={{ width: '40%' }} disabled={itemAttrs[14].disable} />)
                        }
                        {
                            operateArea(14)
                        }
                    </div>
                </FormItem>
                <FormItem label='推荐人手机'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[15].name[0], {
                                initialValue: this.formatDefaultInput(customerData.referrer_phone),
                            })(<Input style={{ width: '40%' }} disabled={itemAttrs[15].disable} />)
                        }
                        {
                            operateArea(15)
                        }
                    </div>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create<CustomerInfoPros>()(CustomerInfo)