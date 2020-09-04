import { CustomerData, CityInfo, UserEntity } from "../../data";
import { Component } from "react";
import React from "react";
import { Form, Input, Select, DatePicker, Icon, Cascader, Button } from "antd";
import { FormComponentProps } from "antd/es/form";
import { ConfigList, ConfigListItem } from "@/pages/CustomerManagement/commondata";
import styles from "./index.less"
import AreaSelect from "@/components/AreaSelect";
import moment from "moment";
import { Permission } from "@/commondata";
import CrmUtil from "@/utils/UserInfoStorage";
import { EyeOutlined } from "@ant-design/icons";
import CrmInfos, { InfoItemType } from "@/components/CrmInfosTabPanel";
import recordItem from "@/pages/OrderManagement/orderDetails/components/OrderDetailsReceivableRecord";

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
    onChange: (params: any, callback: () => void) => void;
    /** 查看客户的手机明文 */
    onCheckPhone: () => void;
    /** 查看客户的微信明文 */
    onCheckWechat: () => void;
    permission: Permission;
    allUser?: UserEntity[];
    /** 客户手机号明文，需要根据权限决定是否展示 */
    customerPhoneDecryptText: string | undefined;
    /** 客户微信号明文，需要根据权限决定是否展示 */
    customerWechatDecryptText: string | undefined;
}

export interface CustomerInfoState {
    itemAttrs: Attrs[];
}

class CustomerInfo extends Component<CustomerInfoPros, CustomerInfoState>{

    infoItems: InfoItemType<CustomerData>[] = [
        {
            name: '集团客户ID',
            index: 'group_customer_id'
        },
        {
            name: '客户编号',
            index: 'customerId'
        },
        {
            name: '手机号码',
            index: 'phone',
            editType: 'phone',
            editable: record => {
                const { permission: { bjchangephone } } = this.props;
                const hasValue = !!record.phone;
                return !hasValue || bjchangephone;
            },
            initialValue: record => this.props.customerPhoneDecryptText || this.formatDefaultInput(record.phone),
            encryptInfo: {
                showCheck: () => !(this.props.permission.plaintextcellphonenumber || this.props.customerPhoneDecryptText),
                onCheckEncrypt: this.props.onCheckPhone,
            }
        },
        {
            name: '微信号',
            index: 'weChat',
            editType: 'weChat',
            editable: record => {
                const { permission: { updatecustomer } } = this.props;
                return !record.weChat || updatecustomer;
            },
            initialValue: record => this.props.customerWechatDecryptText || this.formatDefaultInput(record.weChat),
            encryptInfo: {
                showCheck: () => !(this.props.permission.plaintextcellphonenumber || this.props.customerWechatDecryptText),
                onCheckEncrypt: this.props.onCheckWechat,
            }
        },
        {
            name: '居住地址',
            editType: this.props.permission.updatecustomer ? "address" : undefined,
            editable: record => {
                const { permission: { updatecustomer } } = this.props;
                const hasValue = (record.liveCityInfo && record.liveCityInfo.city_code) || record.liveAddress;
                return !hasValue || updatecustomer;
            },
            index: ['liveCityCode', 'liveAddress'],
            renderText: record => record.liveCityInfo.full + "; " + record.liveAddress,
            addressInfo: {
                getCityCode: record => record.liveCityInfo.city_code
            }
        },
        {
            name: '工作地址',
            editType: this.props.permission.updatecustomer ? "address" : undefined,
            editable: record => {
                const { permission: { updatecustomer } } = this.props;
                const hasValue = (record.workCityInfo && record.workCityInfo.city_code) || record.workAddress;
                return !hasValue || updatecustomer;
            },
            index: ['workCityCode', 'workAddress'],
            renderText: record => record.workCityInfo.full + "; " + record.workAddress,
            addressInfo: {
                getCityCode: record => record.workCityInfo.city_code
            }
        },
    ]

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
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //手机号码
        name: ['phone'],
        enable: true,
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
        //入库时间
        name: ['allotTime'],
        enable: true,
        disable: true,
        isEditing: false,
    }, {
        //创建人
        name: ['creatUserId'],
        enable: true,
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
    }, {
        //婚庆返佣
        name: ['weddingCommission'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //婚宴返佣
        name: ['banquetCommission'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //集团客户ID
        name: ['groupCustomerId'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //礼服返佣
        name: ['dressCommission'],
        enable: false,
        disable: true,
        isEditing: false,
    }, {
        //摄影返佣
        name: ['photoCommission'],
        enable: false,
        disable: true,
        isEditing: false,
    },]

    handleEditSaveOrderInfo = (params: Object) => {
        const { onChange, customerData } = this.props;
        // params['ownerId'] = params['owner_id'];
        // params['avatarGrant'] = params['avatar_grant'];

        if (onChange) {
            onChange({
                ...params,
                customerId: customerData.customerId
            }, () => {

            })
        }

    }


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
            let weddingdate = fieldsValue['weddingDate'];
            if (weddingdate && weddingdate.length > 0) {
                params['weddingDateFrom'] = weddingdate[0].format('YYYY-MM-DD');
                params['weddingDateEnd'] = weddingdate[1].format('YYYY-MM-DD');
                delete params['weddingDate']
            }
            let contactTime = fieldsValue['contactTime'];
            if (contactTime != undefined && contactTime != "") {
                params['contactTime'] = contactTime.format('YYYY-MM-DD');
            }
            let allotTime = fieldsValue['allotTime'];
            if (allotTime != undefined && allotTime != "") {
                params['allotTime'] = allotTime.format('YYYY-MM-DD HH:mm:ss');
            }

            const channelArr = fieldsValue['channel']
            if (channelArr !== undefined && channelArr.length > 0) {
                delete params.channel
                if (channelArr.length > 0) {
                    params['channel'] = channelArr[channelArr.length - 1]
                }
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

    mulitSelectFormat = (prop: string, values: any, fieldsValue: any) => {
        const formValue = fieldsValue[prop]
        delete values[prop]
        if (formValue && formValue != '' && formValue.length > 0) {
            values[prop] = formValue + ''
        }
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

    channelArr = (channels: ConfigListItem[], value: string, result: any[]) => {
        for (let i = 0; i < channels.length; i++) {
            let item = channels[i];
            if (item.value == value) {
                result.unshift(item.value)
                return 1
            } else if (item.children && item.children.length > 0) {
                if (this.channelArr(item.children, value, result) == 1) {
                    result.unshift(item.value)
                    return 1
                }
            }
        }
        return 0
    }

    operateView = (item: Attrs) => {
        return item.enable && (
            item.isEditing ? (<div className={styles.editingIcon}>
                <Icon type={'check'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.checkClick(item)} />
                <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.closeClick(item)} />
            </div>) : <Icon type={'edit'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.editClick(item)} />)
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { customerData, config, permission, editable, allUser, customerPhoneDecryptText, customerWechatDecryptText } = this.props;
        const { itemAttrs } = this.state;
        const timeFormat = 'YYYY-MM-DD HH:mm:ss'
        const minFormat = 'YYYY-MM-DD HH:mm'
        const dateFormat = 'YYYY-MM-DD'

        console.log("allUser = " + JSON.stringify(allUser));

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

        const operateArea = (index: number, isNoValue: boolean = false) => {
            if (editable == 1) {
                let item = itemAttrs[index];
                if (index == 1) {
                    //客户姓名可以任意修改
                    return this.operateView(item)
                } else if (index == 4) {
                    //性别
                    if (permission.updatecustomeridentity == true || isNoValue) return this.operateView(item)
                } else if (index == 5) {
                    //客户身份
                    if (permission.updatecustomeridentity == true || isNoValue) return this.operateView(item)
                } else if (index == 6) {
                    //修改渠道来源
                    if (permission.bjchangechannel == true) return this.operateView(item)
                } else if (index == 7) {
                    if (permission.plaintextcellphonenumber == true || customerPhoneDecryptText) { // 显示明文
                        //修改客户手机号码  显示编辑按钮
                        if (permission.bjchangephone == true || isNoValue) return this.operateView(item)
                    } else {  // 显示密文
                        if (customerData.phone && customerData.phone.length > 0) {
                            // 如果有手机号，就显示“查看”按钮
                            return (
                                <EyeOutlined style={{ fontSize: 20, marginLeft: 20 }} onClick={() => { this.props.onCheckPhone() }} ></EyeOutlined>
                            )
                        } else {
                            // 如果没有手机号，显示编辑按钮
                            if (permission.bjchangephone == true || isNoValue) return this.operateView(item)
                        }
                    }
                    //修改客户手机号码
                    // if (permission.bjchangephone == true || isNoValue) return this.operateView(item)
                } else if (index == 8) {
                    if (permission.plaintextcellphonenumber == true || customerWechatDecryptText) { // 显示明文
                        //修改客户微信  显示编辑按钮
                        return this.operateView(item)
                    } else {  // 显示密文
                        if (customerData.weChat && customerData.weChat.length > 0) {
                            // 如果有微信号，就显示“查看”按钮
                            return (
                                <EyeOutlined style={{ fontSize: 20, marginLeft: 20 }} onClick={() => { this.props.onCheckWechat() }} ></EyeOutlined>
                            )
                        } else {
                            // 如果没有微信号，显示编辑按钮
                            return this.operateView(item)
                        }
                    }
                    //修改客户手机号码
                    // if (permission.bjchangephone == true || isNoValue) return this.operateView(item)
                } else if (index == 12) {
                    //修改客户入库时间
                    if (permission.bjchangeallottime == true) return this.operateView(item)
                } else if (index == 18) {
                    //修改提供人
                    if (permission.bjchangerecorduser == true) return this.operateView(item)
                } else {
                    if (permission.updatecustomer == true) {
                        //修改全部
                        return this.operateView(item)
                    } else {  //默认为空时可修改
                        if (isNoValue) {
                            return this.operateView(item)
                        }
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

        const defaultChannelArr: any[] = []
        let channelValue = this.formatDefaultSelect(customerData.channel_id)
        if (channelValue != null && config?.allchannel && config?.allchannel.length > 0) {
            this.channelArr(config?.allchannel, channelValue, defaultChannelArr)
        }
        const inputStyle = { width: '60%' };

        return (
            <div>
                {/* <MyInfos
                    form={this.props.form}
                    data={customerData}
                    infoItems={this.infoItems}
                    requestUpdateInfo={this.handleEditSaveOrderInfo}
                /> */}

                <Form {...formItemLayout} layout='horizontal' className={styles.formIem}>
                    <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 24 }}>基础信息</div>
                    <FormItem label='集团客户ID'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[21].name[0], {
                                    initialValue: this.formatDefaultInput(customerData.group_customer_id),
                                })(<Input style={inputStyle} disabled={itemAttrs[0].disable} />)
                            }
                            {
                                operateArea(0)
                            }
                        </div>
                    </FormItem>
                    <FormItem label='客户编号'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[0].name[0], {
                                    initialValue: this.formatDefaultInput(customerData.customerId),
                                })(<Input style={inputStyle} disabled={itemAttrs[0].disable} />)
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
                                })(<Input style={inputStyle} disabled={itemAttrs[1].disable} maxLength={8} />)
                            }
                            {
                                operateArea(1, this.formatDefaultInput(customerData.customerName) == null)
                            }
                        </div>
                    </FormItem>
                    {/* <FormItem label='客户级别'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[2].name[0], {
                                initialValue: this.formatDefaultSelect(customerData.customerLevel),
                            })(
                                <Select style={inputStyle} placeholder='' disabled={itemAttrs[2].disable}>
                                    {
                                        config?.customerLevel?.map(state => (
                                            <Option value={state.id} key={state.id}>{state.name}</Option>))
                                    }
                                </Select>
                            )
                        }
                        {
                            operateArea(2, this.formatDefaultSelect(customerData.customerLevel) == null)
                        }
                    </div>
                </FormItem> */}
                    {
                        <FormItem label='客户状态'>
                            <div className={styles.infoItem}>
                                {
                                    getFieldDecorator(itemAttrs[3].name[0], {
                                        initialValue: customerData.status ? this.formatDefaultSelect(customerData.status) : undefined,
                                    })(
                                        <Select style={inputStyle} placeholder='' disabled={itemAttrs[3].disable}>
                                            {
                                                config?.customerStatus && config?.customerStatus?.map(state => (
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
                                    <Select style={inputStyle} placeholder='' disabled={itemAttrs[4].disable}>
                                        {
                                            config?.gender?.map(state => (
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
                                    <Select style={inputStyle} placeholder='' disabled={itemAttrs[5].disable}>
                                        {
                                            config?.identity?.map(state => (
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
                                    initialValue: defaultChannelArr,
                                })(
                                    <Cascader
                                        showSearch
                                        style={inputStyle}
                                        options={config?.allchannel}
                                        placeholder=""
                                        changeOnSelect
                                        disabled={itemAttrs[6].disable} />)
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
                                    initialValue: customerPhoneDecryptText || this.formatDefaultInput(customerData.phone),
                                })(<Input style={inputStyle} placeholder="" disabled={itemAttrs[7].disable} maxLength={11} />)
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
                                    initialValue: customerWechatDecryptText || this.formatDefaultInput(customerData.weChat),
                                    rules: [{ pattern: new RegExp(/^\w{3,20}$/g, "g"), message: '请输入有效微信号' }],
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/[\u4e00-\u9fa5]/g, '')
                                    },
                                })(<Input style={inputStyle} placeholder="" disabled={itemAttrs[8].disable} />)
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
                                            style={inputStyle}
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
                            <div style={inputStyle}>
                                {
                                    getFieldDecorator(itemAttrs[9].name[0])
                                        (<AreaSelect
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
                                    })(<TextArea style={inputStyle} placeholder="" disabled={itemAttrs[9].disable} />)
                                }
                                {
                                    operateArea(9, this.formatDefaultInput(itemAttrs[9].citycode) == null && this.formatDefaultInput(customerData.liveAddress) == null)
                                }
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label='工作地址'>
                        <div className={styles.areaItem}>
                            <div style={inputStyle}>
                                {
                                    getFieldDecorator(itemAttrs[10].name[0])
                                        (<AreaSelect
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
                                    })(<TextArea style={inputStyle} placeholder="" disabled={itemAttrs[10].disable} />)
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
                                    initialValue: this.formatDefaultTime(customerData.contactTime, minFormat)
                                })
                                    (<DatePicker
                                        style={inputStyle}
                                        disabled={itemAttrs[11].disable}
                                        format={minFormat}
                                        showTime={{ format: 'HH:mm' }}
                                        placeholder='' />)
                            }
                            {
                                operateArea(11, this.formatDefaultTime(customerData.contactTime, minFormat) == null)
                            }
                        </div>
                    </FormItem>
                    <FormItem label='入库时间'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[12].name[0], {
                                    initialValue: this.formatDefaultTime(customerData.allot_time, timeFormat),
                                })(<DatePicker
                                    style={inputStyle}
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
                    {/* <FormItem label='创建人'>
                    <div className={styles.infoItem}>
                        {
                            getFieldDecorator(itemAttrs[13].name[0], {
                                initialValue: this.formatDefaultInput(customerData.createUser),
                            })(<Input style={inputStyle} placeholder="请输入" disabled={itemAttrs[13].disable} />)
                        }
                        {
                            operateArea(13)
                        }
                    </div>
                </FormItem> */}
                    <FormItem label='提供人'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[18].name[0], {
                                    initialValue: this.formatDefaultSelect(customerData.record_user_id),
                                })(
                                    <Select style={inputStyle} showSearch
                                        optionFilterProp="children" disabled={itemAttrs[18].disable}>
                                        {
                                            allUser && allUser.map(item => (
                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                            {
                                operateArea(18, this.formatDefaultSelect(customerData.record_user_id) == null)
                            }
                        </div>
                    </FormItem>
                    {
                        CrmUtil.getCompanyTag() == 'LMHS' ?
                            <FormItem label='礼服返佣'>
                                <div className={styles.infoItem}>
                                    {
                                        getFieldDecorator(itemAttrs[22].name[0], {
                                            initialValue: this.formatDefaultInput(customerData.dress_commission),
                                        })(<Input style={inputStyle} disabled={itemAttrs[22].disable} />)
                                    }
                                </div>
                            </FormItem> :
                            CrmUtil.getCompanyTag() == 'BJHSSY' ?
                                <FormItem label='摄影返佣'>
                                    <div className={styles.infoItem}>
                                        {
                                            getFieldDecorator(itemAttrs[23].name[0], {
                                                initialValue: this.formatDefaultInput(customerData.photo_commission),
                                            })(<Input style={inputStyle} disabled={itemAttrs[23].disable} />)
                                        }
                                    </div>
                                </FormItem> : <>
                                    <FormItem label='婚庆返佣'>
                                        <div className={styles.infoItem}>
                                            {
                                                getFieldDecorator(itemAttrs[19].name[0], {
                                                    initialValue: this.formatDefaultInput(customerData.wedding_commission),
                                                })(<Input style={inputStyle} disabled={itemAttrs[19].disable} />)
                                            }
                                        </div>
                                    </FormItem>
                                    <FormItem label='婚宴返佣'>
                                        <div className={styles.infoItem}>
                                            {
                                                getFieldDecorator(itemAttrs[20].name[0], {
                                                    initialValue: this.formatDefaultInput(customerData.banquet_commission),
                                                })(<Input style={inputStyle} disabled={itemAttrs[20].disable} />)
                                            }
                                        </div>
                                    </FormItem>
                                </>
                    }
                    <FormItem label='备注'>
                        <div className={styles.infoItem}>
                            {
                                getFieldDecorator(itemAttrs[17].name[0], {
                                    initialValue: this.formatDefaultSelect(customerData.comment),
                                })(<TextArea style={inputStyle} placeholder="" disabled={itemAttrs[17].disable} />)
                            }
                            {
                                operateArea(17, this.formatDefaultSelect(customerData.comment) == null)
                            }
                        </div>
                    </FormItem>
                </Form>
            </div >
        )
    }
}

class MyInfos extends CrmInfos<CustomerData> { };
export default Form.create<CustomerInfoPros>()(CustomerInfo)