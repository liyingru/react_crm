import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Form, Card, Button, Divider, Input, Select, DatePicker, Modal, message, Radio, Spin, Descriptions ,Tabs} from 'antd';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import OutlinedUpload from '@/components/OutlinedUpload';
import ChooseTelephoneChannels from '@/components/ChooseTelephoneChannels';
import NumericInput from '@/components/NumericInput';
import { StateType } from "../../model";
import { CustomerData, ContactUserData, productItemData, FollowData } from '../../data';
import { ConfigData } from '@/pages/OrderManagement/orderDetails/data';
import moment from 'moment';
import LOCAL from '@/utils/LocalStorageKeys';
import CrmUtil from '@/utils/UserInfoStorage';
import ColloquialismTemplate from '@/components/ColloquialismTemplate';
const { TabPane } = Tabs;

const { Option } = Select;

const { TextArea } = Input;

interface RntryFollowProps extends FormComponentProps {
    // showStyle == 0 是 客户 其他是有效单子
    showStyle?: number,
    customer: CustomerData,
    reqId: string;
    customerConfig: ConfigData;
    followData: FollowData,
    wechat: string;
    isFriend: boolean;
    contacts: [ContactUserData];
    getFollowList: Function;
    refreshFunction: Function;
    tab: string,
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

class RntryFollow extends Component<RntryFollowProps, CustomerInfoState>{

    state: CustomerInfoState = {
        moorId: '',
        showSendMessage: false,
        showChooseTelephoneChannels: false,
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
        selectTelephoneDict: undefined
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

                values['type'] = '5';
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
        let values = {}
        values['wechat'] = wechat;
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

        let values = {}
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

    renderHtmlCtrl = () => {
        const { form, wechat, isFriend, showStyle, followData: { showFollowProductAndCoupon, showDistributedCompany, distributedCompany } } = this.props;
        const { getFieldDecorator } = form;
        const { customer } = this.props;
        const { customerConfig: { leadsFollowStatus, weddingStyle, requirementFollowTag, contactWay, coupon } } = this.props;
        const { filedName, nextAccessTime, showContacts, contractSearchProductList } = this.state;
        const { Option } = Select;
        // console.log(wechat)
        console.log("contractSearchProductList ------ ", contractSearchProductList)

        let iconWidth = '22%'

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
                        <Button onClick={this.doShowChooseTelephoneChannelsAction} style={{ marginTop: '2.5px' }} type='default' icon='setting' />
                    </div >
                    <div className={styles.headerButtomViewStyle}>
                        <Button type='link' icon='phone' onClick={this.moorDialout} style={{ backgroundColor: '#85CD79', color: 'white', width: iconWidth }}>
                            呼出
                            </Button>
                        <Button type='link' icon='close-circle' onClick={this.moorHangup} style={{ backgroundColor: '#DE7A7A', color: 'white', width: iconWidth }}>
                            挂断
                            </Button>
                        <Button type='default' icon='message' onClick={this.showSendMessage} style={{ width: iconWidth }}>
                            短信
                            </Button>
                        {isFriend ? <Button type='link' icon='wechat' onClick={this.openWechat} style={{ width: iconWidth, backgroundColor: '#09bb07', color: 'white' }}>
                            微信
                            </Button> : <Button type='default' icon='wechat' onClick={this.addWechat} style={{ width: iconWidth }}>
                                添加好友
                            </Button>}


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
        
    };
}

const RntryFollowForm = Form.create({ name: 'form_in_modal' })(RntryFollow);

export default RntryFollowForm; 