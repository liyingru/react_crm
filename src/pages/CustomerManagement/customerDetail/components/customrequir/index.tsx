import { CustomerData, CityInfo } from "../../dxl/data";
import { Component } from "react";
import React from "react";
import { Dropdown, Button, Menu, Form, Modal, Input, Select, message, DatePicker, Icon } from "antd";
import { FormComponentProps } from "antd/es/form";
import styles from "./index.less"
import AreaSelect from "@/components/AreaSelect";
import moment from "moment";
import getCategoryColumn, { ConfigListItem, ConfigList } from "@/pages/CustomerManagement/commondata";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

export interface Attrs {
    name: string[];
    enable: boolean;
    disable: boolean;
    isEditing: boolean;
    citycode?: string;
}

export interface CustomerInfoPros extends FormComponentProps {
    customerData: Partial<CustomerData>;
    config: ConfigList;
    onChange: (params: CustomerData, callback: () => void) => void;
}

export interface CustomerInfoState {
    itemAttrs: Attrs[];
}

class CustomerRequire extends Component<CustomerInfoPros, CustomerInfoState>{

    attrs: Attrs[] = [{
        name: ['likeCityCode'],
        enable: true,
        disable: true,
        isEditing: false,
        citycode: '100000',
    }, {
        name: ['category'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        name: ['budget'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        name: ['weddingStyle'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        name: ['deskNum'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        name: ['hotel'],
        enable: true,
        disable: true,
        isEditing: false,
    }]

    state: CustomerInfoState = {
        itemAttrs: this.attrs
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
        if (cityinfo) {  //if(a) 可以过滤 undefined ，null，空字符串，0
            if (cityinfo.city_code) {
                return cityinfo.city_code
            }
        }
        return '100000'
    }


    editClick = (item: Attrs) => {
        const { itemAttrs } = this.state;
        const { form } = this.props;
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


    likeCityChange = (code: string) => {
        this.props.form.setFieldsValue({
            'likeCityCode': code,
        })
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const { customerData, config } = this.props;
        const { itemAttrs } = this.state;
        const timeFormat = 'YYYY-MM-DD HH:mm:ss'
        const dateFormat = 'YYYY-MM-DD'

        this.attrs.forEach(value => {
            if(value.citycode != undefined){
                if(value.name[0] == 'likeCityCode'){
                    value.citycode = this.formatDefaultCode(customerData.likeCityInfo)
                }
            }
        })


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
            let item = itemAttrs[index];
            return !item.enable ? '' : (
                item.isEditing ? (<div className={styles.editingIcon}>
                    <Icon type={'check'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.checkClick(item)} />
                    <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.closeClick(item)} />
                </div>) : <Icon type={'edit'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.editClick(item)} />)

        }

        return (
            <Form {...formItemLayout} layout='horizontal' >
                <FormItem label='意向城市'>
                    <div className={styles.infoItem}>
                        <div style={{ width: '60%' }}>
                            {
                                getFieldDecorator(itemAttrs[0].name[0])
                                    (<AreaSelect
                                        selectedCode={itemAttrs[0].citycode}
                                        areaSelectChange={(code) => this.likeCityChange(code)}
                                        disabled={itemAttrs[0].disable} />)
                            }
                        </div>
                        {
                            operateArea(0)
                        }
                    </div>
                </FormItem>
                <FormItem label='业务品类'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[1].name[0], {
                                initialValue: this.formatDefaultInput(customerData.category),
                            })(<Input style={{ width: '40%' }} placeholder="请输入" disabled={itemAttrs[1].disable} />)
                        }
                        {
                            operateArea(1)
                        }
                    </div>
                </FormItem>
                <FormItem label='婚礼预算'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[2].name[0], {
                                initialValue: this.formatDefaultInput(customerData.budget),
                            })(<Input style={{ width: '40%' }} placeholder="请输入" disabled={itemAttrs[2].disable} />)
                        }
                        {
                            operateArea(2)
                        }
                    </div>
                </FormItem>
                <FormItem label='婚礼风格'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[3].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.weddingStyle),
                            })(
                                <Select style={{ width: '40%' }} placeholder='请选择' disabled={itemAttrs[3].disable}>
                                    {
                                        config.weddingStyle.map(state => (
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
                <FormItem label='婚礼桌数'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[4].name[0], {
                                initialValue: this.formatDefaultInput(customerData.deskNum),
                                rules: [{ required: false, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效桌数' }], getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\D/g, '')
                                  },
                            })(<Input style={{ width: '40%' }} placeholder="请输入" disabled={itemAttrs[4].disable} />)
                        }
                        {
                            operateArea(4)
                        }
                    </div>
                </FormItem>
                <FormItem label='预定酒店'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[5].name[0], {
                                initialValue: this.formatDefaultInput(customerData.hotel),
                            })(<Input style={{ width: '60%' }} placeholder="请输入" disabled={itemAttrs[5].disable} />)
                        }
                        {
                            operateArea(5)
                        }
                    </div>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create<CustomerInfoPros>()(CustomerRequire)