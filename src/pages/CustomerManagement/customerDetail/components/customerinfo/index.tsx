import { CustomerData, CityInfo, UserEntity } from "../../data";
import { Component } from "react";
import React from "react";
import { Dropdown, Button, Menu, Form, Modal, Input, Select, message, DatePicker, Icon } from "antd";
import { FormComponentProps } from "antd/es/form";
import { ConfigList } from "@/pages/CustomerManagement/commondata";
import styles from "./index.less"
import AreaSelect from "@/components/AreaSelect";
import moment from "moment";
import NumericInput from "@/components/NumericInput";
import { Permission } from "@/commondata";
import CrmUtil from "@/utils/UserInfoStorage";
import { CheckOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export interface Attrs {
    name: string[];
    enable: boolean;
    disable: boolean;
    isEditing: boolean;
    citycode?: string;
}

export interface CustomerInfoPros extends FormComponentProps {
    editable?: 0 | 1;  // 0表示只读，  1 表示可编辑
    customerData: Partial<CustomerData>;
    config: ConfigList;
    onChange: (params: CustomerData, callback: () => void) => void;
    permission: Permission | {};
    allUser?: UserEntity[];
}

export interface CustomerInfoState {
    itemAttrs: Attrs[];
}

class CustomerInfo extends Component<CustomerInfoPros, CustomerInfoState>{

    // #可编辑 o有效单详情不显示
    attrs: Attrs[] = [{
        //客户编号
        name: ['customerId'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //客户姓名
        name: ['customerName'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //客户级别 # o
        name: ['customerLevel'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //客户状态 # o
        name: ['customerStatus'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //性别 #
        name: ['gender'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //客户身份 #
        name: ['identity'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //客户来源
        name: ['channel'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //手机号码
        name: ['phone'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //微信号
        name: ['weChat'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //居住地址  #
        name: ['liveCityCode', 'liveAddress'],
        enable: true,
        disable: true,
        isEditing: false,
        citycode: '',
    }, {
        //工作地址  #
        name: ['workCityCode', 'workAddress'],
        enable: true,
        disable: true,
        isEditing: false,
        citycode: '',
    }, {
        //方便联系时间 #
        name: ['contactTime'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //创建时间 (实际为划入时间)
        name: ['allotTime'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //创建人 (不显示)
        name: ['creatName'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //推荐人
        name: ['referrerName'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //推荐人手机
        name: ['referrerPhone'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //婚期
        name: ['weddingDate'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //备注
        name: ['comment'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //提供人ID (北京)
        name: ['recordUserId'],
        enable: true,
        disable: true,
        isEditing: false,
    }]

    state: CustomerInfoState = {
        itemAttrs: this.attrs,
    }

    formatDefaultSelect = (propName: string | undefined) => {
        if (propName != undefined && propName != null && propName != '' && propName != '0') {
            return propName
        }
        return null
    }

    formatDefaultInput = (propName: string | undefined) => {
        if (propName != undefined && propName != null && propName) {
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
        if (cityinfo) {  //if(a) 可以过滤 undefined ，null，空字符串，0
            if (cityinfo.city_code && cityinfo.city_code.length > 0) {
                return cityinfo.city_code
            }
        }
        return ''
    }


    editClick = (item: Attrs) => {
        const { itemAttrs } = this.state;
        const { form, customerData } = this.props;
        form.resetFields()
        let attrs = itemAttrs.map(value => {
            let attr = { ...value }
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
            let params = { ...fieldsValue }
            params['customerId'] = customerData.customerId

            if (item.name[0] == 'weddingDate') {
                let weddingdate = fieldsValue['weddingDate'];
                delete params['weddingDate']
                if (weddingdate && weddingdate.length > 0) {
                    params['weddingDateFrom'] = weddingdate[0].format('YYYY-MM-DD');
                    params['weddingDateEnd'] = weddingdate[1].format('YYYY-MM-DD');
                } else {
                    params['weddingDateFrom'] = '';
                    params['weddingDateEnd'] = '';
                }
            }

            let contactTime = fieldsValue['contactTime'];
            if (contactTime != undefined && contactTime != "") {
                params['contactTime'] = contactTime.format('YYYY-MM-DD');
            }
            let allotTime = fieldsValue['allotTime'];
            if (allotTime != undefined && allotTime != "") {
                params['allotTime'] = allotTime.format('YYYY-MM-DD HH:mm:ss');
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
        const { customerData, config, editable, allUser } = this.props;
        const { itemAttrs } = this.state;
        const timeFormat = 'YYYY-MM-DD HH:mm:ss'
        const dateFormat = 'YYYY-MM-DD'

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 3 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
        };
        const inputWidthStyle = { minWidth: 230, width: "45%" };
        const operateArea = (index: number, isNoValue: boolean = false) => {
            if (editable == 1) {
                let item = itemAttrs[index];
                if (this.props.permission.updatecustomer) {  //修改全部
                    return item.enable && (
                        <div className={styles.editingIcon}>
                            {
                                item.isEditing ? <>
                                    <CheckOutlined onClick={() => this.checkClick(item)} />
                                    <CloseOutlined onClick={() => this.closeClick(item)} style={{ marginLeft: 10 }} />
                                </> : <><EditOutlined onClick={() => this.editClick(item)} /></>
                            }
                        </div>
                    )
                } else if (this.props.permission.customeradapter_updatecustomer) {  //为空时可修改
                    if (isNoValue) {
                        return item.enable && (
                            <div className={styles.editingIcon}>
                                {
                                    item.isEditing ? <>
                                        <CheckOutlined onClick={() => this.checkClick(item)} />
                                        <CloseOutlined onClick={() => this.closeClick(item)} style={{ marginLeft: 10 }} />
                                    </> : <><EditOutlined onClick={() => this.editClick(item)} /></>
                                }
                            </div>
                        )
                    }
                }
            }
            return ''
        }

        this.attrs.forEach(value => {
            if (value.citycode != undefined) {
                if (value.name[0] == 'liveCityCode') {
                    value.citycode = this.formatDefaultCode(customerData.liveCityInfo)
                } else if (value.name[0] == 'workCityCode') {
                    value.citycode = this.formatDefaultCode(customerData.workCityInfo)
                } else if (value.name[0] == 'likeCityCode') {
                    value.citycode = this.formatDefaultCode(customerData.likeCityInfo)
                }
            }
        })

        return (
            <Form {...formItemLayout} layout='horizontal' className={styles.formStyle}>
                <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 24 }}>基础信息</div>
                <FormItem label='客户编号'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[0].name[0], {
                                initialValue: this.formatDefaultInput(customerData.customerId),
                            })(<Input size='small' style={inputWidthStyle} disabled={itemAttrs[0].disable} />)
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
                                rules: [{
                                    required: true, pattern: new RegExp(/[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d]/, "g"), max: 8, message: '请输入有效客户姓名',
                                }],
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/[0-9]/, '')
                                },
                                initialValue: this.formatDefaultInput(customerData.customerName),
                            })(<Input size='small' style={inputWidthStyle} disabled={itemAttrs[1].disable} maxLength={8} />)
                        }
                        {
                            operateArea(1, this.formatDefaultInput(customerData.customerName) == null)
                        }
                    </div>
                </FormItem>
                {
                    <FormItem label='客户级别'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[2].name[0], {
                                    initialValue: this.formatDefaultSelect(customerData.customerLevel),
                                })(
                                    <Select size='small' style={inputWidthStyle} placeholder='' disabled={itemAttrs[2].disable}>
                                        {
                                            config.customerLevel.map(state => (
                                                <Option value={state.id} key={state.id}>{state.name}</Option>))
                                        }
                                    </Select>
                                )
                            }
                            {
                                operateArea(2, this.formatDefaultSelect(customerData.customerLevel) == null)
                            }
                        </div>
                    </FormItem>
                }
                {
                    <FormItem label='客户状态'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[3].name[0], {
                                    initialValue: customerData.status ? this.formatDefaultSelect(customerData.status) : undefined,
                                })(
                                    <Select size='small' style={inputWidthStyle} placeholder='' disabled={itemAttrs[3].disable}>
                                        {
                                            config.customerStatus && config.customerStatus.map(state => (
                                                <Option value={state.id} key={state.id}>{state.name}</Option>))
                                        }
                                    </Select>
                                )
                            }
                            {
                                operateArea(3, this.formatDefaultSelect(customerData.status) == null)
                            }
                        </div>
                    </FormItem>
                }
                <FormItem label='性别'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[4].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.gender),
                            })(
                                <Select size='small' style={inputWidthStyle} placeholder='' disabled={itemAttrs[4].disable}>
                                    {
                                        config.gender.map(state => (
                                            <Option value={state.id} key={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(4, this.formatDefaultSelect(customerData.gender) == null)
                        }
                    </div>
                </FormItem>
                <FormItem label='客户身份'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[5].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.identity),
                            })(
                                <Select size='small' style={inputWidthStyle} placeholder='' disabled={itemAttrs[5].disable}>
                                    {
                                        config.identity.map(state => (
                                            <Option value={state.id} key={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(5, this.formatDefaultSelect(customerData.identity) == null)
                        }
                    </div>
                </FormItem>
                <FormItem label='客户来源'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[6].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.channel),
                            })(<Input size='small' style={inputWidthStyle} placeholder="" disabled={itemAttrs[6].disable} />)
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
                                rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\D/g, '')
                                },
                                initialValue: this.formatDefaultInput(customerData.phone),
                            })(<Input size='small' style={inputWidthStyle} placeholder="" disabled={itemAttrs[7].disable} maxLength={11} />)
                        }
                        {
                            operateArea(7, this.formatDefaultInput(customerData.phone) == null)
                        }
                    </div>
                </FormItem>
                <FormItem label='微信号'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[8].name[0], {
                                initialValue: this.formatDefaultInput(customerData.weChat),
                                rules: [{ pattern: new RegExp(/^\w{3,20}$/g, "g"), message: '请输入有效微信号' }],
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/[\u4e00-\u9fa5]/g, '')
                                },
                            })(<Input size='small' style={inputWidthStyle} placeholder="" disabled={itemAttrs[8].disable} />)
                        }
                        {
                            operateArea(8, this.formatDefaultInput(customerData.weChat) == null)
                        }
                    </div>
                </FormItem>
                <FormItem label='婚期'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[16].name[0], {
                                initialValue: [this.formatDefaultTime(customerData.weddingDateFrom, dateFormat), this.formatDefaultTime(customerData.weddingDateEnd, dateFormat)]
                            })
                                (
                                    <RangePicker
                                        size='small' style={inputWidthStyle}
                                        disabled={itemAttrs[16].disable}
                                        format={dateFormat} />
                                )
                        }
                        {
                            operateArea(16, this.formatDefaultTime(customerData.weddingDateFrom, dateFormat) == null)
                        }
                    </div>
                </FormItem>
                <FormItem label='居住地址'>
                    <div className={styles.areaItem}>
                        <div style={inputWidthStyle}>
                            {
                                getFieldDecorator(itemAttrs[9].name[0])
                                    (<AreaSelect
                                        size='small'
                                        level3={true}
                                        selectedCode={itemAttrs[9].citycode ? itemAttrs[9].citycode : undefined}
                                        areaSelectChange={(code) => this.liveCityChange(code)}
                                        disabled={itemAttrs[9].disable} />)
                            }
                        </div>

                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[9].name[1], {
                                    initialValue: this.formatDefaultInput(customerData.liveAddress),
                                })(<TextArea size='small' style={inputWidthStyle} placeholder="" disabled={itemAttrs[9].disable} />)
                            }
                            {
                                operateArea(9, this.formatDefaultInput(itemAttrs[9].citycode) == null && this.formatDefaultInput(customerData.liveAddress) == null)
                            }
                        </div>
                    </div>
                </FormItem>
                <FormItem label='工作地址'>
                    <div className={styles.areaItem}>
                        <div style={inputWidthStyle}>
                            {
                                getFieldDecorator(itemAttrs[10].name[0])
                                    (<AreaSelect
                                        size='small'
                                        level3={true}
                                        selectedCode={itemAttrs[10].citycode ? itemAttrs[10].citycode : undefined}
                                        areaSelectChange={(code) => this.workCityChange(code)}
                                        disabled={itemAttrs[10].disable} />)
                            }
                        </div>

                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[10].name[1], {
                                    initialValue: this.formatDefaultInput(customerData.workAddress),
                                })(<TextArea size='small' style={inputWidthStyle} placeholder="" disabled={itemAttrs[10].disable} />)
                            }
                            {
                                operateArea(10, this.formatDefaultInput(itemAttrs[10].citycode) == null && this.formatDefaultInput(customerData.workAddress) == null)
                            }
                        </div>
                    </div>
                </FormItem>
                <FormItem label='方便联系时间'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[11].name[0], {
                                initialValue: this.formatDefaultTime(customerData.contactTime, dateFormat)
                            })
                                (<DatePicker
                                    size='small'
                                    style={inputWidthStyle}
                                    disabled={itemAttrs[11].disable}
                                    format={dateFormat}
                                    placeholder='' />)
                        }
                        {
                            operateArea(11, this.formatDefaultTime(customerData.contactTime, dateFormat) == null)
                        }
                    </div>
                </FormItem>
                {
                    editable == 1 && <FormItem label='创建时间'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[12].name[0], {
                                    initialValue: this.formatDefaultTime(customerData.allot_time, timeFormat),
                                })(<DatePicker
                                    size='small'
                                    style={inputWidthStyle}
                                    disabled={itemAttrs[12].disable}
                                    format={timeFormat}
                                    showTime
                                    placeholder='' />)
                            }
                            {
                                operateArea(12, this.formatDefaultTime(customerData.allot_time, timeFormat) == null)
                            }
                        </div>
                    </FormItem>
                }
                {
                    CrmUtil.getCompanyType() == 2 ?
                        <FormItem label='提供人'>
                            <div className={styles.infoItem}>
                                {
                                    getFieldDecorator(itemAttrs[18].name[0], {
                                        initialValue: this.formatDefaultSelect(customerData.record_user_id),
                                    })(
                                        <Select size='small' style={inputWidthStyle} showSearch
                                            optionFilterProp="children" disabled={itemAttrs[18].disable}>
                                            {
                                                allUser && allUser.map(item => (
                                                    <Option value={item.id}>{item.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                                {
                                    operateArea(18, this.formatDefaultSelect(customerData.record_user_id) == null)
                                }
                            </div>
                        </FormItem> :
                        <FormItem label='提供人'>
                            <div className={styles.infoItem}>
                                {
                                    getFieldDecorator(itemAttrs[14].name[0], {
                                        initialValue: this.formatDefaultInput(customerData.referrerName),
                                    })(<Input size='small' style={inputWidthStyle} disabled={itemAttrs[14].disable} />)
                                }
                                {
                                    operateArea(14, this.formatDefaultInput(customerData.referrerName) == null)
                                }
                            </div>
                        </FormItem>
                }
                {
                    CrmUtil.getCompanyType() == 2 ? '' :
                        <FormItem label='提供人手机'>
                            <div className={styles.infoItem}>
                                {
                                    getFieldDecorator(itemAttrs[15].name[0], {
                                        rules: [{ pattern: new RegExp(/^[1-9]\d*$/, "g") }],
                                        getValueFromEvent: (event) => {
                                            return event.target.value.replace(/\D/g, '')
                                        },
                                        initialValue: this.formatDefaultInput(customerData.referrerPhone),
                                    })(<Input size='small' style={inputWidthStyle} placeholder="" disabled={itemAttrs[15].disable} maxLength={11} />)
                                }
                                {
                                    operateArea(15, this.formatDefaultInput(customerData.referrerPhone) == null)
                                }
                            </div>
                        </FormItem>
                }
                <FormItem label='备注'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[17].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.comment),
                            })(<TextArea size='small' style={inputWidthStyle} placeholder="" disabled={itemAttrs[17].disable} />)
                        }
                        {
                            operateArea(17, this.formatDefaultSelect(customerData.comment) == null)
                        }
                    </div>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create<CustomerInfoPros>()(CustomerInfo)