import React, { Component } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Form, Card, Button, Divider, Input, Select, DatePicker, Modal, message, Radio, Spin, Menu, Dropdown, Descriptions, Tabs } from 'antd';
import Axios from 'axios';
import { Action, Dispatch } from 'redux';
import URL from '@/api/serverAPI.config';
import OutlinedUpload from '@/components/OutlinedUpload';
import NumericInput from '@/components/NumericInput';
import { StateType } from "../../dxl/model";
import { CustomerData, ContactUserData, productItemData, FollowData } from '../../dxl/data';
import { ConfigData } from '@/pages/OrderManagement/orderDetails/data';
import moment from 'moment';
import LOCAL from '@/utils/LocalStorageKeys';
import CrmUtil from '@/utils/UserInfoStorage';
import ChooseTelephoneChannels from '@/components/ChooseTelephoneChannels';
import ColloquialismTemplate from '@/components/ColloquialismTemplate';
import { DownOutlined, PhoneOutlined, CloseCircleFilled, MessageOutlined, WechatOutlined, SettingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;

interface RntryFollowProps {
    dispatch: Dispatch<
        Action<any>
    >;
    loading: boolean;
    customerDetailMode: StateType;
}

interface RntryFollowProps extends FormComponentProps {
    // showStyle == 0 是 客户 其他是有效单子
    showStyle?: number,
    customer: CustomerData,
    reqId: string;
    customerId: string;
    customerConfig: ConfigData;
    followData: FollowData,
    wechat: string;
    isFriend: boolean;
    contacts: [ContactUserData];
    getFollowList: Function;
    refreshFunction: Function;
    tab: string,
    sendreqreport: any;
    defaultCategoryId: any;
}

interface CustomerInfoState {
    moorId: string;
    showSendMessage: boolean;
    showChooseTelephoneChannels: boolean;
    sendMessageContent: string;
    filedName: string;
    contactId: string;
    showContacts: [ContactUserData]
    contractSearchProductList: [productItemData]
    currentUserInfo: undefined,
    nextContactTimeSelectMust: boolean,
    filedPatchs: [],
    uploadDisabled: boolean,
    isRequetsFinish: boolean,
    tagInitialValue: number,
    selectTelephoneDict: any,
}


@connect(
    ({
        customerDetailMode,
        loading,
    }: {
        customerDetailMode: StateType;
        loading: {
            models: {
                [key: string]: boolean;
            };
        };
    }) => ({
        customerDetailMode,
        loading: loading.models.customerDetailMode,
    }),
)

class RntryFollow extends Component<RntryFollowProps, CustomerInfoState>{

    state: CustomerInfoState = {
        moorId: '',
        showSendMessage: false,
        sendMessageContent: '',
        filedName: '',
        tagId: '1',
        resultsId: '',
        nextPortContactTime: '',
        contactId: '',
        showContacts: [],
        contractSearchProductList: [],
        currentUserInfo: undefined,
        nextContactTimeSelectMust: false,
        filedPatchs: [],
        uploadDisabled: false,
        isRequetsFinish: true,
        tagInitialValue: 1,
    };
    formRef: any;

    componentDidMount() {
        const { customer, contacts, customerConfig } = this.props;

        let selfM: ContactUserData = {};
        selfM.contactId = ''
        selfM.userName = customer?.customerName
        selfM.phone = customer?.phone

        var tempArray = [];
        tempArray.push(selfM)
        tempArray = tempArray.concat(contacts)
        console.log(tempArray)

        this.setState({
            showContacts: tempArray,
        });

        this.onSearchProduct('')

        var currentUserInfo = CrmUtil.getUserInfo();
        this.setState({
            currentUserInfo,
        })


        if (customerConfig?.requirementFollowTag?.length > 0) {
            var initialValue = customerConfig?.requirementFollowTag[0].id

            this.setNextContactTimeMust(Number(initialValue))
            this.props.form.setFieldsValue({
                "tag": initialValue,
            })

            var values = {}
            values['tag'] = initialValue;
            values['results'] = this.state.resultsId;
            this.getNextContactTimeRequets(values)
        }

    }

    componentWillReceiveProps(nextProps: any) {
        console.log(nextProps)

        const { customer, contacts, customerConfig } = nextProps;
        console.log(contacts)

        let selfM: ContactUserData = {};
        selfM.contactId = ''
        selfM.userName = customer?.customerName
        selfM.phone = customer?.phone

        var tempArray = [];
        tempArray.push(selfM)
        tempArray = tempArray.concat(contacts)
        console.log(tempArray)

        this.setState({
            showContacts: tempArray,
        });

        if (customerConfig?.requirementFollowTag?.length != this.props?.customerConfig?.requirementFollowTag?.length) {
            if (customerConfig?.requirementFollowTag?.length > 0) {

                var initialValue = customerConfig?.requirementFollowTag[0].id
                this.setNextContactTimeMust(Number(initialValue))
                this.props.form.setFieldsValue({
                    "tag": initialValue,
                })
                var values = {}
                values['tag'] = initialValue;
                values['results'] = this.state.resultsId;
                this.getNextContactTimeRequets(values)
            }
        }
    }

    // 选择联系人
    onChangeContacts = (e) => {
        this.setState({
            contactId: e
        })
    }

    handleMenuClick = (e: any) => {
        const { dispatch, customerId, reqId } = this.props;
        confirm({
            title: `是否要发送 {${e.item.props.children}} 匹配链接给客户吗?`,
            onOk() {
                dispatch({
                    type: 'customerDetailMode/sendReq',
                    payload: {
                        customerId: customerId,
                        reqId: reqId,
                        activityId: e && e.key,
                    },
                    callback: (data: any) => {
                        if (data.code == 200) {
                            message.success(data.msg);
                        }
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onUploadChangeList = (fileList: any) => {

        if (fileList?.length >= 9) {
            this.setState({
                filedPatchs: fileList,
                uploadDisabled: true
            })
        } else {
            this.setState({
                filedPatchs: fileList,
                uploadDisabled: false
            })
        }
    }

    onUploadError = (info: any, msg: any) => {
        message.error(`${msg}`);
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    nextDisabledDate = (current) => {
        // Can not select days before today and today
        const { nextPortContactTime } = this.state;

        if (current) {
            if (nextPortContactTime != '') {
                if (current > moment(nextPortContactTime, 'YYYY-MM-DD').endOf('day') || current < moment().startOf('day')) {
                    return true;
                }
            } else {
                return current && current < moment().startOf('day');
            }
        }

        return false;

    }

    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().startOf('day');
    }

    disabledDateTime = (current: moment) => {
        let currentTime = new Date(new Date().getTime())

        var Min = currentTime.getMinutes();
        if (Min < 60) {
            Min = Min + 1
        }
        let temp = false
        if (current) {
            let c = current.format('YYYYMMDD');
            let m = moment().format('YYYYMMDD');
            temp = c == m;
        }

        if (temp) {
            return {
                disabledHours: () => this.range(0, 24).splice(0, currentTime.getHours()),
                disabledMinutes: () => this.range(0, 60).splice(0, Min),
            };
        } else {
            return {};
        }

    }

    resetDone = (isGetNextContactTimer: boolean = true) => {
        const { form } = this.props;
        const { tagInitialValue } = this.state;
        form.resetFields();
        this.setState({
            moorId: '',
            filedName: '',
            tagId: tagInitialValue,
            resultsId: '',
            nextPortContactTime: '',
            filedPatchs: [],
            uploadDisabled: false,
        })

        if (isGetNextContactTimer) {
            let values = {};
            values['tag'] = this.state?.tagInitialValue;
            this.getNextContactTimeRequets(values)
        }
    }

    // ------------------ 电话选择渠道 ------------
    doShowChooseTelephoneChannelsAction = () => {
        this.setState({
            showChooseTelephoneChannels: true,
        })
    }

    hiddenChooseTelephoneChannelsAction = () => {
        this.setState({
            showChooseTelephoneChannels: false,
        })
    }

    doSelectTelephoneChannels = (selectTelephoneDict: any) => {
        this.setState({
            selectTelephoneDict: selectTelephoneDict
        })
        this.hiddenChooseTelephoneChannelsAction()
    }

    moorDialout = () => {

        const { customer } = this.props;
        const { contactId } = this.state;

        var values = {};
        values['type'] = "customer"
        values['id'] = customer.customerId

        let platform = React.$browserInfo();
        values['platform'] = platform.type;

        if (this.state?.selectTelephoneDict && this.state?.selectTelephoneDict !== undefined) {

            // 选择了对应的拨打数据 
            const tStatus = this.state.selectTelephoneDict?.telephoneChannel;
            const clid = this.state.selectTelephoneDict?.telephoneNumber;

            if (tStatus !== undefined && tStatus > 0) {
                values['status'] = tStatus;
            }
            if (clid !== undefined && clid?.length > 0) {
                values['clid'] = clid;
            }
        }

        if (contactId && contactId != '') {
            values['contactUserId'] = contactId
        }

        Axios.post(URL.moorDialout, values).then(
            res => {
                if (res.code == 200) {
                    message.success('操作成功');
                    this.setState({
                        moorId: res.data.result,
                    })
                }
            }
        );
    }

    moorHangup = () => {

        const { customer } = this.props;

        var values = {};
        values['type'] = "customer"
        values['id'] = customer.customerId

        let platform = React.$browserInfo();
        values['platform'] = platform.type;

        if (this.state?.selectTelephoneDict && this.state?.selectTelephoneDict !== undefined) {

            // 选择了对应的拨打数据 
            const tStatus = this.state.selectTelephoneDict?.telephoneChannel;
            const clid = this.state.selectTelephoneDict?.telephoneNumber;

            if (tStatus !== undefined && tStatus > 0) {
                values['status'] = tStatus;
            }
            if (clid !== undefined && clid?.length > 0) {
                values['clid'] = clid;
            }
        }

        Axios.post(URL.moorHangup, values).then(
            res => {
                if (res.code == 200) {
                    message.success('操作成功');

                }
            }
        );
    }

    onFollowRequest = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const { reqId, getUserInfo, getFollowList, hiddenFollowInfo, refreshFunction, tab, showStyle } = this.props;
        const { customer: { customerId } } = this.props;
        const { moorId } = this.state;

        this.props.form.validateFields((err, values) => {
            if (!err) {

                let weedingDate = values['weedingDate'];
                if (weedingDate > 0 && weedingDate != undefined) {
                    values['weedingDate'] = moment(values['weedingDate']).format('YYYY-MM-DD');
                }

                var tempNextContactTime = values['nextContactTime'];
                if (tempNextContactTime && tempNextContactTime != undefined) {
                    values['nextContactTime'] = moment(values['nextContactTime']).format('YYYY-MM-DD HH:mm');
                }

                var valuesarrivalTime = values['arrivalTime'];
                if (valuesarrivalTime && valuesarrivalTime != undefined) {
                    let arrivalTime = moment(valuesarrivalTime).format('YYYY-MM-DD HH:mm');
                    values['arrivalTime'] = arrivalTime
                }

                if (this.state?.filedPatchs?.length > 0) {

                    var tempS = ''
                    this.state?.filedPatchs?.map((item, index) => {
                        if (index == 0) {
                            tempS = tempS + item?.url
                        } else {
                            tempS = tempS + ',' + item?.url
                        }
                    })

                    if (tempS.length > 0) {
                        values['attachment'] = tempS
                    }
                }

                values['type'] = '2';
                values['customerId'] = customerId;
                values['relationId'] = reqId;
                values['callDuration'] = moorId;

                this.setState({
                    isRequetsFinish: false,
                })

                Axios.post(URL.createFollow, values).then(
                    res => {
                        if (res.code == 200) {
                            message.success('操作成功');
                            this.resetDone()
                            getFollowList(tab, showStyle, true, customerId, reqId)
                            localStorage?.setItem('demandListRefreshTag', 'list')
                            this.onSearchProduct('')
                            refreshFunction()
                            hiddenFollowInfo()
                        }

                        this.setState({
                            isRequetsFinish: true,
                        })
                    }
                );

            }
        });
    }


    showSendMessage = () => {

        this.setState({
            showSendMessage: true,
        })
    }

    onSendMessage = (e: any) => {
        const { customer: { encryptPhone } } = this.props;
        const { customer } = this.props;
        console.log(customer)

        let values = {}
        values['mobile'] = encryptPhone;
        values['content'] = this.state.sendMessageContent;
        Axios.post(URL.sendsms, values).then(
            res => {
                if (res.code == 200) {
                    message.success('操作成功');
                    this.setState({
                        showSendMessage: false,
                        sendMessageContent: '',
                    })
                }
            }
        );
    }

    closeSendMessage = () => {
        this.setState({
            showSendMessage: false,
            sendMessageContent: '',
        })
    }

    messageChange = (e) => {
        console.log(e.target.value)
        this.setState({
            sendMessageContent: e.target.value,
        })
    }

    openWechat = () => {

        const { wechat } = this.props;
        const { customer: { encryptPhone } } = this.props;

        const values = {}

        if (wechat?.length > 0) {
            values['wechat'] = wechat;
        } else {
            values['wechat'] = '';
        }

        if (encryptPhone?.length > 0) {
            values['encryptPhone'] = encryptPhone;
        } else {
            values['encryptPhone'] = '';
        }

        Axios.post(URL.getWechatTarget, values).then(
            res => {
                if (res.code == 200) {
                    let msg = res.msg;
                    message.success('操作成功');

                    window.open(res.data.result.url)
                }
            }
        );
    }

    addWechat = () => {

        const { wechat } = this.props;
        const { customer: { encryptPhone } } = this.props;

        const values = {}
        if (wechat?.length > 0) {
            values['wechat'] = wechat;
        } else {
            values['wechat'] = '';
        }

        if (encryptPhone?.length > 0) {
            values['encryptPhone'] = encryptPhone;
        } else {
            values['encryptPhone'] = '';
        }

        Axios.post(URL.addFriend, values).then(
            res => {
                if (res.code == 200) {
                    message.success('操作成功');
                }
            }
        );
    }

    onChangeFollowUpResults = (e) => {
        this.setState({
            resultsId: e.target.value,
        })

        let values = {}
        values['tag'] = this.state.tagId;
        values['results'] = e.target.value;
        this.getNextContactTimeRequets(values)
    }

    onChangeFollowUpTag = (e) => {

        this.setNextContactTimeMust(e.target.value)
        // 请求时间

        let values = {}
        values['tag'] = e.target.value;
        values['results'] = this.state.resultsId;
        this.getNextContactTimeRequets(values)

    }

    getNextContactTimeRequets = (values: any) => {
        Axios.post(URL.getFollowNextContactTime, values).then(
            res => {
                if (res.code == 200) {
                    console.log(res)
                    let result = res.data.result
                    if (result != '') {
                        this.setState({
                            nextPortContactTime: result,
                        })
                        this.props.form.setFieldsValue({
                            "nextContactTime": moment(result, 'YYYY-MM-DD HH:mm'),
                        })
                    } else {
                        this.setState({
                            nextPortContactTime: '',
                        })
                    }
                }
            }
        );
    }


    /// 设置下次回访时间必填状态
    setNextContactTimeMust(tag: number) {
        if (CrmUtil.getCompanyType() == 1) {
            if (tag == 1) {
                this.setState({
                    tagId: tag,
                    nextContactTimeSelectMust: true,
                })
            } else {
                this.setState({
                    tagId: tag,
                    nextContactTimeSelectMust: false,
                })
            }
        } else {
            this.setState({
                tagId: tag,
            })
        }
    }

    onSearchProduct = (e) => {
        console.log(e)

        var values = {}
        values['keyword'] = e

        if (e.length > 0) {
            // 请求搜索
            Axios.post(URL.contractSearchProduct, values).then(
                res => {
                    if (res.code == 200) {
                        console.log(res)
                        let result = res.data.result
                        this.setState({
                            contractSearchProductList: result.rows,
                        })
                    }
                }
            );
        } else {
            // 请求列表

            Axios.post(URL.getProductList).then(
                res => {
                    if (res.code == 200) {
                        console.log(res)
                        let result = res.data.result
                        this.setState({
                            contractSearchProductList: result.rows,
                        })
                    }
                }
            );
        }


    }

    render() {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane
                    tab={<span>录跟进</span>}
                    key="1"
                >
                    {this.renderHtmlCtrl()}
                </TabPane>
                <TabPane
                    tab={<span>话术助手</span>}
                    key="2"
                >
                    <ColloquialismTemplate />
                </TabPane>
            </Tabs>
        )
    }

    renderHtmlCtrl = () => {

        const { form, wechat, isFriend, showStyle, sendreqreport, followData: { showFollowProductAndCoupon, showDistributedCompany, distributedCompany }, defaultCategoryId } = this.props;
        const { getFieldDecorator } = form;
        const { customer } = this.props;
        const { customerConfig: { leadsFollowStatus, weddingStyle, requirementFollowTag, contactWay, coupon, reqReportTitle } } = this.props;
        const { filedName, nextAccessTime, showContacts, contractSearchProductList } = this.state;
        const { Option } = Select;
        let iconWidth = '28%'

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {reqReportTitle && reqReportTitle.map((item: any) => {
                    return <Menu.Item key={item.id}>{item.name}</Menu.Item>
                })}
            </Menu>
        );

        return (
            <div style={{ width: '100%', height: '100%', paddingTop: 20 }}>
                <Card>
                    <div style={{ display: "flex" }}>
                        <Form style={{ width: '90%' }} layout='horizontal'>
                            <div >
                                <Form.Item label="通话号码：" {...formItemLayout}>
                                    {/* <div>{customer.phone ? customer.phone : ''}</div> */}
                                    <Select defaultValue='' onChange={this.onChangeContacts}>
                                        {showContacts && showContacts.map((item) => {
                                            return (
                                                <Option value={item?.contactId}>{item?.userName}  {item?.phone}</Option>
                                            );
                                        }
                                        )}
                                    </Select>
                                </Form.Item>

                            </div>
                        </Form>
                        <Button onClick={this.doShowChooseTelephoneChannelsAction} style={{ marginTop: '2.5px' }} type='default'  ><SettingOutlined /></Button>

                    </div >
                    <div className={styles.headerButtomViewStyle}>
                        <Button type='link' onClick={this.moorDialout} style={{ backgroundColor: '#85CD79', color: 'white', width: iconWidth, marginRight: 25, marginBottom: 15 }}>
                            <PhoneOutlined />呼出
                            </Button>
                        <Button type='link' onClick={this.moorHangup} style={{ backgroundColor: '#DE7A7A', color: 'white', width: iconWidth, marginRight: 25, marginBottom: 15 }}>
                            <CloseCircleFilled /> 挂断
                            </Button>
                        <Button type='default' onClick={this.showSendMessage} style={{ width: iconWidth, marginRight: 25, marginBottom: 15 }}>
                            <MessageOutlined />短信
                            </Button>
                        {isFriend ? <Button type='link' onClick={this.openWechat} style={{ width: iconWidth, backgroundColor: '#09bb07', color: 'white', marginRight: 25, marginBottom: 15 }}>
                            <WechatOutlined />微信
                            </Button> : <Button type='default' onClick={this.addWechat} style={{ width: iconWidth, marginRight: 25, marginBottom: 15 }}>
                                <WechatOutlined />添加好友
                            </Button>}
                        {sendreqreport == true && defaultCategoryId === 1 ? (
                            <Dropdown overlay={menu}>
                                <Button>
                                    发送婚礼需求匹配结果 <DownOutlined />
                                </Button>
                            </Dropdown>
                        ) : ''}


                    </div>
                    <Divider />
                    <div style={{ fontSize: 20, fontWeight: 'bolder' }}>录跟进</div>
                    <div>
                        <Form layout='horizontal' onSubmit={this.onFollowRequest}>
                            <div >
                                <Form.Item label={CrmUtil.getCompanyType() == 1 ? "联系方式：" : "跟进方式："}  {...formItemLayout} >
                                    {getFieldDecorator('contactWay', {
                                        initialValue: 1,
                                        rules: [{ required: true, message: CrmUtil.getCompanyType() == 1 ? '请选择联系方式' : '请选择跟进方式' }]
                                    })(

                                        <Radio.Group buttonStyle="solid">
                                            {contactWay && contactWay.map((item) => {
                                                return (
                                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                                )
                                            })}

                                        </Radio.Group>
                                    )}
                                </Form.Item>


                                <Form.Item label={CrmUtil.getCompanyType() == 1 ? '呼叫结果：' : '跟进标签：'} {...formItemLayout}>
                                    {getFieldDecorator('tag', {
                                        initialValue: this.state?.tagInitialValue,
                                        rules: [{ required: true, message: CrmUtil.getCompanyType() == 1 ? '请选择呼叫结果：' : '请选择跟进标签' }]
                                    })(

                                        <Radio.Group buttonStyle="solid" onChange={this.onChangeFollowUpTag}>
                                            {requirementFollowTag && requirementFollowTag.map((item) => {
                                                return (
                                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                                )
                                            })}

                                        </Radio.Group>

                                    )}
                                </Form.Item>

                                <Form.Item label="跟进结果：" {...formItemLayout}>
                                    {getFieldDecorator('results', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择跟进结果' }]
                                    })(

                                        <Radio.Group buttonStyle="solid" onChange={this.onChangeFollowUpResults}>
                                            {leadsFollowStatus && leadsFollowStatus.map((item) => {
                                                return (
                                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                                )
                                            })}

                                        </Radio.Group>
                                    )}
                                </Form.Item>


                                <Form.Item label="沟通内容：" {...formItemLayout}>
                                    {getFieldDecorator('comment', {
                                        initialValue: '',
                                        rules: [{ required: false, message: '请填写补充内容' }]
                                    })(
                                        <TextArea></TextArea>
                                    )}
                                </Form.Item>
                                <Form.Item label="附件：" {...formItemLayout}>

                                    <OutlinedUpload
                                        text={'上传文件'}
                                        superFileList={this.state?.filedPatchs}
                                        requestFinsh={this.onUploadChangeList}
                                        disabled={this.state?.uploadDisabled}
                                    />
                                </Form.Item>




                                <Form.Item label="下次回访时间：" {...formItemLayout}>
                                    {getFieldDecorator('nextContactTime', {
                                        rules: [{ required: this.state?.nextContactTimeSelectMust, message: '请选择下次回访时间' }]
                                    })(
                                        <DatePicker showTime placeholder='请选择下次回访时间' disabledDate={this.nextDisabledDate} showToday={false}
                                        ></DatePicker>
                                    )}
                                </Form.Item>

                                {showStyle && showStyle != 0 ?
                                    (CrmUtil.getCompanyType() != 2) ? <Form.Item label="预约到店：" {...formItemLayout}>
                                        {getFieldDecorator('arrivalTime', {
                                            initialValue: '',
                                            rules: [{ required: false, message: '请选择预约到店日期' }]
                                        })(
                                            <DatePicker showTime placeholder='请选择预约到店日期' disabledDate={this.disabledDate}
                                            ></DatePicker>
                                        )}
                                    </Form.Item>
                                        : ''
                                    : ''}

                                {showStyle && showStyle != 0 ?
                                    <div>
                                        {
                                            showFollowProductAndCoupon && showFollowProductAndCoupon != 0 ?
                                                <div>
                                                    <Form.Item label="有效意向产品：" {...formItemLayout}>
                                                        {getFieldDecorator('productId', {
                                                            initialValue: '',
                                                            rules: [{ required: false, message: '请选择跟有效意向产品' }]
                                                        })(

                                                            <Select placeholder={'请选择跟有效意向产品'} showSearch filterOption={false} onSearch={this.onSearchProduct}>
                                                                {contractSearchProductList && contractSearchProductList.map((item) => {
                                                                    return (<Option value={item?.id} >{item?.name}</Option>)
                                                                })}
                                                            </Select>
                                                        )}
                                                    </Form.Item>
                                                    <Form.Item label="有效优惠活动：" {...formItemLayout}>
                                                        {getFieldDecorator('couponId', {
                                                            initialValue: '',
                                                            rules: [{ required: false, message: '请选择有效优惠活动' }]
                                                        })(

                                                            <Radio.Group buttonStyle="solid" >
                                                                {coupon && coupon.map((item) => {
                                                                    return (
                                                                        <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                                                    )
                                                                })}

                                                            </Radio.Group>
                                                        )}
                                                    </Form.Item>
                                                </div>
                                                : ''
                                        }
                                    </div> : ''}


                                {/*  // 喜铺、尼克、阑 */}
                                {/* {(CrmUtil.getCompanyType() == 2) ? 
                                (this.state?.tagId == 1 || this.state?.tagId == '')? 
                                <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 40, marginRight: 40 }}>
                                        <Descriptions size="small" title={<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >关联线索 <Button type='primary' >重新设置</Button></div>} column={1}></Descriptions>
                                        
                                        <Descriptions style={{maxHeight: 200, overflowY: 'auto'}} size="small" column={1}>
                                            <Descriptions.Item >婚宴|DXL133333 邀约：李楠；派发公司：喜铺，尼克</Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                    :''
                                    : ''} */}

                                <Form.Item>
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        <Button onClick={this.resetDone}>重置</Button>
                                        <Button type='primary' htmlType="submit" disabled={!this.state?.isRequetsFinish}>确定</Button>
                                    </div>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </Card>
                <div hidden={this.state?.isRequetsFinish} style={{ position: 'absolute', top: 0, zIndex: 100, width: '100%', height: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.8)' }}>
                    <Spin />
                </div>
                <Modal style={{ paddingTop: 240 }}
                    visible={this.state.showSendMessage}
                    title="发送短信"
                    okText="保存"
                    onCancel={this.closeSendMessage}
                    onOk={this.onSendMessage}
                >
                    <TextArea placeholder='请输入发送内容' value={this.state.sendMessageContent} onChange={this.messageChange}></TextArea>

                </Modal>

                <ChooseTelephoneChannels
                    visible={this.state?.showChooseTelephoneChannels}
                    saveFunction={this.doSelectTelephoneChannels}
                    onCancel={this.hiddenChooseTelephoneChannelsAction}
                    defaultDict={this.state?.selectTelephoneDict}
                />
            </div >
        );
    };
}

const RntryFollowForm = Form.create({ name: 'form_in_modal' })(RntryFollow);

export default RntryFollowForm; 