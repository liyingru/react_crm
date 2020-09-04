import React, { Component } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Form, Card, Button, Divider, Input, Select, DatePicker, Modal, message, Radio, Spin, Checkbox, Tabs } from 'antd';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import OutlinedUpload from '@/components/OutlinedUpload';
import ChooseTelephoneChannels from '@/components/ChooseTelephoneChannels';
import { CustomerData, ContactUserData, productItemData, FollowData } from '../../dxl/data';
import { ConfigData } from '@/pages/OrderManagement/orderDetails/data';
import moment from 'moment';
import CrmUtil from '@/utils/UserInfoStorage';
import { any } from 'prop-types';
import ColloquialismTemplate from '@/components/ColloquialismTemplate';
import { PhoneOutlined, CloseCircleOutlined, WechatOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const { TextArea } = Input;

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

interface RntryFollowProps extends FormComponentProps {
    customerId: string,
    //  1：需求（线索），2：邀约（有效单），3：订单（订单）, 4：提供人（现在没有跟进面板）  10: 客户BI列表(现在没有跟进面板)
    showStyle?: number,
    // 客户详情
    customer: CustomerData,
    // 配置信息
    customerConfig: ConfigData;
    // 动态配置信息
    followData: FollowData,
    // 微信是否是好友
    isFriend: boolean;
    // 联系人
    contacts: [ContactUserData];
    // 跟进成功刷新回调方法
    refreshFunction: Function;
    // 请求跟进记录的回调方法（带参数）
    getFollowList: Function;
    // 取消跟进面板展示
    hiddenFollowInfo: Function;
    // 当前跟进记录的选择的tab
    tab: string,
    // 是否展示状态选项(直对邀约起作用)
    isShowStatusBlock: boolean;
    // 绑定的id（3订单与需要）
    relationId?: string;
    // 订单详情
    orderDetail?: any;
}

interface CustomerInfoState {
    // 通话记录的标记id
    moorId: string;
    // 是否展示发送信息界面
    showSendMessage: boolean;
    // 发送短信内容
    sendMessageContent: string;
    // 展示呼叫面板
    showChooseTelephoneChannels: boolean;
    // 呼叫结果\跟进标签选择id
    tagId: string;
    // 跟进结果选择id
    resultsId: string;
    // 选择联系人Id
    contactId: string;
    // 展示联系人列表
    showContacts: [ContactUserData];
    // 意向产品列表
    contractSearchProductList: [productItemData];
    // 当前用户的信息
    currentUserInfo: undefined,
    // 说否开启下次回访时间限制逻辑
    nextContactTimeSelectMust: boolean,
    // 下次回访时间最大时间
    nextPortContactTime: string;
    // 上传文件数组
    filedPatchs: [],
    // 上传文件按钮的状态
    uploadDisabled: boolean,
    // 是否正在加载请求
    isRequetsFinish: boolean,
    // 呼叫结果默认值
    tagInitialValue: number,
    // 是否展示错误弹框
    isShowErrorModel: boolean;
    // 错误信息
    errorMassage: string;
    // 是否展示品类(只是需求详情需要)
    isShowCategoryBlock: boolean;
    // 呼叫面板的数据
    selectTelephoneDict: any,


    // -------------------- 订单页面上的操作 --------------- 

    // 默认订单销售状态
    defaultSalesStatus: number;
    // 点击订单销售状态
    selectSalesStatus: number;

    // 订单选择确认到店
    selectSalesConfirmToShopTag: number;

    // -------------------- 邀约页面上的操作 --------------- 
    // 选择邀约页面上的品类对象
    selectCategoryModel: any;

    // 选择邀约状态
    selelctInvitationStatus: number;

    // 订单选择确认到店
    selectInvitationConfirmToShopTag: number;

    // 是否是选中状态模式  0是选择品类 1是选择了状态
    isSelectInvitationStatusType: number;

}

class RntryFollow extends Component<RntryFollowProps, CustomerInfoState>{

    formRef: any;

    constructor(props: RntryFollowProps) {
        super(props);
        this.state = {
            moorId: '',
            showSendMessage: false,
            showChooseTelephoneChannels: false,
            sendMessageContent: '',
            tagId: '1',
            resultsId: '',
            contactId: '',
            showContacts: [any],
            contractSearchProductList: [any],
            currentUserInfo: {},
            nextContactTimeSelectMust: false,
            nextPortContactTime: '',
            filedPatchs: [],
            uploadDisabled: false,
            isRequetsFinish: true,
            tagInitialValue: 1,
            isShowErrorModel: false,
            errorMassage: '',
            isShowCategoryBlock: false,
            selectTelephoneDict: undefined,

            // -------------------- 订单页面上的操作 --------------- 
            selectSalesConfirmToShopTag: 0,
            // 默认订单销售状态
            defaultSalesStatus: 0,
            // 点击订单销售状态
            selectSalesStatus: 0,

            // -------------------- 邀约页面上的操作 --------------- 
            // 选择邀约页面上的品类对象
            selectCategoryModel: {},

            // 选择邀约状态
            selelctInvitationStatus: 0,

            // 订单选择确认到店
            selectInvitationConfirmToShopTag: 0,

            // 是否是选中状态模式  0是选择品类 1是选择了状态
            isSelectInvitationStatusType: 0
        };
    }

    componentDidMount() {
        const { customer, contacts, customerConfig, orderDetail } = this.props;
        const { showStyle } = this.props;

        const selfM: ContactUserData = {};
        selfM.contactId = '';
        selfM.userName = customer?.customerName;
        selfM.phone = customer?.phone;

        let tempArray = [];
        tempArray.push(selfM);
        tempArray = tempArray.concat(contacts);

        this.setState({
            showContacts: tempArray,
        });

        this.onSearchProduct('')

        const currentUserInfo = CrmUtil.getUserInfo();
        this.setState({
            currentUserInfo,
            defaultSalesStatus: orderDetail?.orderInfo?.phase,
            selectSalesStatus: orderDetail?.orderInfo?.phase
        });

        if (showStyle == 3) {
            if (orderDetail?.orderInfo?.phase == 310 || orderDetail?.orderInfo?.phase == 330) {
                this.setState({
                    nextContactTimeSelectMust: true
                })
            }
        }


        if (customerConfig?.requirementFollowTag?.length > 0) {
            const initialValue = customerConfig?.requirementFollowTag[0].id

            this.setNextContactTimeMust(Number(initialValue))
            this.props.form.setFieldsValue({
                "tag": initialValue,
            })

            const values = {}
            values.tag = initialValue;
            values.results = this.state.resultsId;
            this.getNextContactTimeRequets(values)
        }




    }

    componentWillReceiveProps(nextProps: any) {

        const { customer, contacts, customerConfig } = nextProps;

        const selfM: ContactUserData = {};
        selfM.contactId = '';
        selfM.userName = customer?.customerName;
        selfM.phone = customer?.phone;

        let tempArray = [];
        tempArray.push(selfM);
        tempArray = tempArray.concat(contacts);

        this.setState({
            showContacts: tempArray,
        });

        if (customerConfig?.requirementFollowTag?.length != this.props?.customerConfig?.requirementFollowTag?.length) {
            if (customerConfig?.requirementFollowTag?.length > 0) {

                const initialValue = customerConfig?.requirementFollowTag[0].id
                this.setNextContactTimeMust(Number(initialValue))
                this.props.form.setFieldsValue({
                    "tag": initialValue,
                })
                const values = {}
                values.tag = initialValue;
                values.results = this.state.resultsId;
                this.getNextContactTimeRequets(values)
            }
        }
    }

    // 选择联系人
    onChangeContacts = (e: any) => {
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

    range = (start: any, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    nextDisabledDate = (current: any) => {
        // Can not select days before today and today
        const { nextPortContactTime } = this.state;

        if (current) {
            if (nextPortContactTime !== '') {
                if (current > moment(nextPortContactTime, 'YYYY-MM-DD').endOf('day') || current < moment().startOf('day')) {
                    return true;
                }
            } else {
                return current && current < moment().startOf('day');
            }
        }

        return false;

    }

    disabledDate = (current: any) =>
        // Can not select days before today and today
        current && current < moment().startOf('day')


    disabledDateTime = (current: any) => {
        const currentTime = new Date(new Date().getTime())

        let Min = currentTime.getMinutes();
        if (Min < 60) {
            Min += 1
        }
        let temp = false
        if (current) {
            const c = current.format('YYYYMMDD');
            const m = moment().format('YYYYMMDD');
            temp = c === m;
        }

        if (temp) {
            return {
                disabledHours: () => this.range(0, 24).splice(0, currentTime.getHours()),
                disabledMinutes: () => this.range(0, 60).splice(0, Min),
            };
        }
        return {};


    }

    resetDone = (isGetNextContactTimer: boolean = true) => {
        const { form } = this.props;
        const { tagInitialValue } = this.state;
        form.resetFields();
        this.setState({
            moorId: '',
            tagId: tagInitialValue.toString(),
            resultsId: '',
            nextPortContactTime: '',
            filedPatchs: [],
            uploadDisabled: false,
            isShowErrorModel: false,
            isShowCategoryBlock: false,
            // -------------------- 订单页面上的操作 --------------- 
            selectSalesConfirmToShopTag: 0,
            // 点击订单销售状态
            selectSalesStatus: this.state?.defaultSalesStatus,
            // -------------------- 邀约页面上的操作 --------------- 
            // 选择邀约页面上的品类对象
            selectCategoryModel: {},

            // 选择邀约状态
            selelctInvitationStatus: 0,

            // 订单选择确认到店
            selectInvitationConfirmToShopTag: 0,
        })

        if (isGetNextContactTimer) {
            const values = {};
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

        const values = {};
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
                if (res.code === 200) {
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

        const values = {};
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
                if (res.code === 200) {
                    message.success('操作成功');

                }
            }
        );
    }

    onFollowRequest = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const { showStyle } = this.props;
        const that = this;

        this.props.form.validateFields(err => {
            if (!err) {
                if (showStyle === 1) {
                    if (this.state?.isShowCategoryBlock === true) {
                        // 提交要展示
                        Modal.confirm({
                            title: '请确认全部品类有效性，提交后无法修改及再次提交！',
                            okText: '确定',
                            cancelText: '取消',
                            centered: true,
                            onOk() {
                                that.doFollowRequest()
                            },
                            onCancel() {
                            },
                        });

                    } else {
                        this.doFollowRequest()
                    }
                } else {
                    this.doFollowRequest()
                }
            }
        });


    }

    doFollowRequest = () => {
        const { getFollowList, hiddenFollowInfo, refreshFunction, tab, showStyle, orderDetail } = this.props;
        const { customer: { customerId } } = this.props;
        const { moorId } = this.state;

        this.props.form.validateFields((err, values) => {
            if (!err) {

                const weedingDate = values['weedingDate'];
                if (weedingDate > 0 && weedingDate !== undefined) {
                    values['weedingDate'] = moment(values['weedingDate']).format('YYYY-MM-DD');
                }

                const tempNextContactTime = values['nextContactTime'];
                if (tempNextContactTime && tempNextContactTime != undefined) {
                    values['nextContactTime'] = moment(values['nextContactTime']).format('YYYY-MM-DD HH:mm');
                } else {
                    values['nextContactTime'] = '';
                }

                const valuesarrivalTime = values['arrivalTime'];
                if (valuesarrivalTime && valuesarrivalTime !== undefined) {
                    const arrivalTime = moment(valuesarrivalTime).format('YYYY-MM-DD HH:mm');
                    values['arrivalTime'] = arrivalTime
                }

                const valuesReserveTime = values['reserveTime'];
                if (valuesReserveTime && valuesReserveTime !== undefined) {
                    const reserveTime = moment(valuesReserveTime).format('YYYY-MM-DD HH:mm');
                    values['reserveTime'] = reserveTime
                }



                const valueOrderArrivalTime = values['orderArrivalTime'];
                if (valueOrderArrivalTime && valueOrderArrivalTime !== undefined) {
                    const orderArrivalTime = moment(valueOrderArrivalTime).format('YYYY-MM-DD HH:mm');
                    values['orderArrivalTime'] = orderArrivalTime
                }


                if (this.state?.filedPatchs?.length > 0) {

                    let tempS = ''
                    this.state?.filedPatchs?.map((item, index) => {
                        if (index == 0) {
                            tempS += item?.url
                        } else {
                            tempS = `${tempS},${item?.url}`
                        }
                    })

                    if (tempS.length > 0) {
                        values['attachment'] = tempS
                    }
                }

                values['type'] = this.props?.showStyle?.toString()
                values['relationId'] = this.props?.relationId ?? ''
                values['customerId'] = customerId;
                values['callDuration'] = moorId;

                const reqUserIdString = values['reqUserId'];
                if (reqUserIdString?.length > 0) {
                    const reqUserIdArray = reqUserIdString?.split(',')
                    if (reqUserIdArray?.length > 1) {
                        values['reqUserId'] = reqUserIdArray[1];
                    }
                }


                const comment = values['comment'];
                if (comment.length < 6) {
                    message.error('沟通内容不能小于6个字')
                    return;
                }

                if (showStyle === 3) {

                    // 订单需要
                    if (this.props?.orderDetail?.reserve_confirm_count) {
                        // 给其他方式进店 传id-99 和进店时间

                        const valueOrderArrivalStatus = values['orderArrivalStatus'];
                        if (valueOrderArrivalStatus > 0) {
                            values['reserveId'] = -99;
                        }

                    } else {
                        // 给id
                        const valueOrderArrivalStatus = values['orderArrivalStatus'];
                        if (valueOrderArrivalStatus > 0) {
                            if (orderDetail?.reserve?.length > 0) {
                                const item = orderDetail?.reserve[0];
                                values['reserveId'] = item.id;
                            }
                        }

                    }
                }

                this.setState({
                    isRequetsFinish: false,
                })

                Axios.post(URL.createFollow, values).then(
                    res => {
                        if (res.code === 200) {
                            message.success('操作成功');
                            this.resetDone()
                            getFollowList(tab, showStyle, true, customerId, this.props?.relationId ?? '')
                            localStorage?.setItem('demandListRefreshTag', 'list')
                            this.onSearchProduct('')
                            refreshFunction()
                            hiddenFollowInfo()
                            if (showStyle === 3) {
                                const status = values['status'];
                                if (status > 0) {
                                    this.setState({
                                        defaultSalesStatus: status,
                                        selectSalesStatus: status
                                    })
                                }
                            }

                        }
                        // else {
                        //     const { msg } = res;
                        //     this.showErrorMassage(msg);
                        // }

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

    onSendMessage = () => {
        const { customer: { encryptPhone } } = this.props;
        const { customer } = this.props;
        console.log(customer)

        const values = {}
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

    messageChange = (e: any) => {
        this.setState({
            sendMessageContent: e.target.value,
        })
    }

    openWechat = () => {

        const { customer: { encryptPhone, wechat } } = this.props;

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
                    message.success('操作成功');

                    window.open(res.data.result.url)
                }
            }
        );
    }

    addWechat = () => {

        const { customer: { encryptPhone, wechat } } = this.props;

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

    onChangeFollowUpResults = (e: any) => {
        this.setState({
            resultsId: e.target.value,
        })

        let values = {}
        values['tag'] = this.state.tagId;
        values['results'] = e.target.value;
        this.getNextContactTimeRequets(values)
    }

    onChangeFollowUpTag = (e: any) => {
        const { showStyle } = this.props;

        if (showStyle === 1) {
            // 处理品类选项不展示 (104是有效状态)
            if (e.target.value === 104) {
                this.setState({
                    isShowCategoryBlock: true
                })
            } else {
                this.setState({
                    isShowCategoryBlock: false
                })
            }
        }

        this.setState({
            tagId: e.target?.value?.toString(),
        })

        // this.setNextContactTimeMust(e.target.value)
        // 请求时间

        let values = {}
        values['tag'] = e.target.value;
        values['results'] = this.state.resultsId;
        this.getNextContactTimeRequets(values)

    }


    getNextContactTimeRequets = () => {
        // Axios.post(URL.getFollowNextContactTime, values).then(
        //     res => {
        //         if (res.code === 200) {
        //             const { result } = res.data
        //             if (result !== '') {
        //                 this.setState({
        //                     nextPortContactTime: result,
        //                 })
        //                 this.props.form.setFieldsValue({
        //                     "nextContactTime": moment(result, 'YYYY-MM-DD HH:mm'),
        //                 })
        //             } else {
        //                 this.setState({
        //                     nextPortContactTime: '',
        //                 })
        //             }
        //         }
        //     }
        // );
    }


    // 设置下次回访时间必填状态
    setNextContactTimeMust(tag: number) {
        if (CrmUtil.getCompanyType() === 1) {
            if (tag === 1) {
                this.setState({
                    tagId: tag.toString(),
                    nextContactTimeSelectMust: true,
                })
            } else {
                this.setState({
                    tagId: tag.toString(),
                    nextContactTimeSelectMust: false,
                })
            }
        } else {
            this.setState({
                tagId: tag.toString(),
            })
        }
    }

    onSearchProduct = (e: any) => {

        const values = {
            keyword: e
        }

        if (e.length > 0) {
            // 请求搜索
            Axios.post(URL.contractSearchProduct, values).then(
                res => {
                    if (res?.code === 200) {
                        const { result } = res.data
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
                    if (res?.code === 200) {
                        const { result } = res.data
                        this.setState({
                            contractSearchProductList: result.rows,
                        })
                    }
                }
            );
        }

    }

    // 展示错误弹框
    showErrorMassage = (msg: string) => {
        Modal.error({
            title: '错误信息',
            content: msg,
        });
    }


    // ------------ 订单页面上的方法 --------------
    // 点击确认到店
    onConfirmToShopChange = (e: any) => {
        const { showStyle } = this.props;

        this.setState({
            selectSalesConfirmToShopTag: e.target?.value
        })

        //  1：需求（线索），2：邀约（有效单），3：订单（订单）, 4：提供人（现在没有跟进面板）  10: 客户BI列表(现在没有跟进面板)
        if (showStyle == 3) {
            let nextContactTimeSelectMust = false
            if (e.target?.value == 1) {
                // 当选择是有效进店 下次回访必须填写
                nextContactTimeSelectMust = true
            }
            this.setState({
                nextContactTimeSelectMust: nextContactTimeSelectMust
            })
        }


    }

    // 订单页面点击销售状态界面
    onChangeSalesStatus = (e: any) => {
        const { form } = this.props;
        const { showStyle } = this.props;

        this.setState({
            selectSalesStatus: e.target?.value,
            selectSalesConfirmToShopTag: 0
        })

        //  1：需求（线索），2：邀约（有效单），3：订单（订单）, 4：提供人（现在没有跟进面板）  10: 客户BI列表(现在没有跟进面板)
        if (showStyle == 3) {
            let nextContactTimeSelectMust = false
            if (e.target?.value == 310 || e.target?.value == 330) {
                // 当选择是有销售待定/销售有效维护 下次回访必须填写
                nextContactTimeSelectMust = true
            }
            this.setState({
                nextContactTimeSelectMust: nextContactTimeSelectMust
            })
        }

        form.setFieldsValue({
            'orderArrivalStatus': 0,
        })

    }


    // ------------ 邀约页面上的方法 --------------
    // 点击邀约品类
    onChangeInvitationCategory = (e: any) => {
        const { form, followData } = this.props;
        const { showStyle } = this.props;

        let temp = {}

        for (let index = 0; index < followData?.reqCategory?.length; index++) {
            const itemA = followData?.reqCategory[index];
            if (itemA.reqId === e.target?.value) {
                temp = itemA
            }
        }

        if (temp?.reqId > 0) {
            this.setState({
                selectCategoryModel: temp,
                selelctInvitationStatus: temp?.phase,
                selectInvitationConfirmToShopTag: 0,
                isSelectInvitationStatusType: 0,
            })

            //  1：需求（线索），2：邀约（有效单），3：订单（订单）, 4：提供人（现在没有跟进面板）  10: 客户BI列表(现在没有跟进面板)
            if (showStyle == 2) {
                let nextContactTimeSelectMust = false
                if (temp?.phase == 220 || temp?.phase == 230) {
                    // 当选择是邀约有效维护 / 邀约待定 下次回访必须填写
                    nextContactTimeSelectMust = true
                }
                this.setState({
                    nextContactTimeSelectMust: nextContactTimeSelectMust
                })
            }

            form.setFieldsValue({
                'status': temp?.phase,
            })
        }

    }

    // 点击邀约状态
    onChangeInvitationStatue = (e: any) => {
        const { showStyle } = this.props;

        this.setState({
            selelctInvitationStatus: e.target?.value,
            selectInvitationConfirmToShopTag: 0,
            isSelectInvitationStatusType: 1
        })

        //  1：需求（线索），2：邀约（有效单），3：订单（订单）, 4：提供人（现在没有跟进面板）  10: 客户BI列表(现在没有跟进面板)
        if (showStyle == 2) {
            let nextContactTimeSelectMust = false
            if (e.target?.value == 220 || e.target?.value == 230) {
                // 当选择是邀约有效维护 / 邀约待定 下次回访必须填写
                nextContactTimeSelectMust = true
            }
            this.setState({
                nextContactTimeSelectMust: nextContactTimeSelectMust
            })
        }
    }

    // 点击预约到店
    onChangeInvitationConfirmToShopTag = (e: any) => {
        const { showStyle } = this.props;

        this.setState({
            selectInvitationConfirmToShopTag: e.target?.value,
        })

        //  1：需求（线索），2：邀约（有效单），3：订单（订单）, 4：提供人（现在没有跟进面板）  10: 客户BI列表(现在没有跟进面板)
        if (showStyle == 2) {
            let nextContactTimeSelectMust = false
            if (this.state?.selelctInvitationStatus == 230) {
                if (e.target?.value == 0) {
                    // 暂不 下次回访必须填写
                    nextContactTimeSelectMust = true
                }
            }
            this.setState({
                nextContactTimeSelectMust: nextContactTimeSelectMust
            })
        }

    }

    // --------------------------------------------- UI返回方法 -----------------

    getCategoryWithShowStyle = () => {
        const { showStyle, form, followData } = this.props;
        const { getFieldDecorator } = form;


        const categoryList = [];

        if (followData.category?.length > 0) {
            for (let index = 0; index < followData.category?.length; index++) {
                const temp = {}
                const item = followData?.category[index];
                temp.label = item.categoryName;
                temp.value = item.categoryId;
                categoryList.push(temp)
            }
        }


        if (categoryList.length <= 0) {
            return (<></>);
        }

        // 1：需求（线索），2：邀约（有效单），3：订单（订单）
        if (showStyle === 1 && this.state?.isShowCategoryBlock === true) {
            return (
                <Form.Item label="触发品类："  {...formItemLayout} >
                    {getFieldDecorator('category', {
                        initialValue: [],
                        rules: [{ required: true, message: '请选择触发品类' }]
                    })(
                        <Checkbox.Group
                            options={categoryList}
                        />
                    )}
                </Form.Item>
            );
        }

        // 1：需求（线索），2：邀约（有效单），3：订单（订单）
        if (showStyle === 2) {

            return (
                <Form.Item label="推荐品类："  {...formItemLayout} >
                    {getFieldDecorator('category', {
                        initialValue: [],
                        rules: [{ required: false, message: '请选择推荐品类' }]
                    })(
                        <Checkbox.Group
                            options={categoryList}
                        />
                    )}
                </Form.Item>
            );
        }

        if (showStyle === 3) {
            return (
                <Form.Item label="推荐品类："  {...formItemLayout} >
                    {getFieldDecorator('category', {
                        initialValue: [],
                        rules: [{ required: false, message: '请选择推荐品类' }]
                    })(
                        <Checkbox.Group
                            options={categoryList}
                        />
                    )}
                </Form.Item>
            );
        }
    }

    getTagUIWithShowStyle = () => {
        const { showStyle, form, customerConfig } = this.props;
        const { getFieldDecorator } = form;


        // 1：需求（线索），2：邀约（有效单），3：订单（订单）
        if (showStyle === 1) {
            return (
                <Form.Item label="需求级别："  {...formItemLayout} >
                    {getFieldDecorator('tag', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请选择需求级别' }]
                    })(
                        <Radio.Group buttonStyle="solid">
                            {customerConfig?.leadsFollowTag && customerConfig?.leadsFollowTag.map((item: { id: any; name: React.ReactNode; }) => (
                                <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                            ))}

                        </Radio.Group>
                    )}
                </Form.Item>
            );
        }
        if (showStyle === 2) {
            return (
                <Form.Item label="邀约级别："  {...formItemLayout} >
                    {getFieldDecorator('tag', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请选择邀约级' }]
                    })(
                        <Radio.Group buttonStyle="solid">
                            {customerConfig?.requirementFollowTag && customerConfig?.requirementFollowTag.map((item: { id: any; name: React.ReactNode; }) => (
                                <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                            ))}

                        </Radio.Group>
                    )}
                </Form.Item>
            );
        }

        if (showStyle === 3) {
            return (
                <Form.Item label="销售级别："  {...formItemLayout} >
                    {getFieldDecorator('tag', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请选择销售级别' }]
                    })(
                        <Radio.Group buttonStyle="solid">
                            {customerConfig?.orderFollowTag && customerConfig?.orderFollowTag.map((item: { id: any; name: React.ReactNode; }) => (
                                <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                            ))}

                        </Radio.Group>
                    )}
                </Form.Item>
            );
        }
    }

    // 根据showStyle返回对应状态UI
    getStatusUIWithShowStyle = () => {
        const { showStyle, form, customerConfig, followData } = this.props;
        const { getFieldDecorator } = form;


        // 1：需求（线索），2：邀约（有效单），3：订单（订单）, 5:质检
        if (showStyle === 1) {
            return (
                <div>
                    <Form.Item label="客户状态："  {...formItemLayout} >
                        {getFieldDecorator('status', {
                            rules: [{ required: true, message: '请选择客户状态' }]
                        })(
                            <Radio.Group onChange={this.onChangeFollowUpTag} buttonStyle="solid">
                                {followData?.status && followData?.status?.map((item: { id: any; name: React.ReactNode; }) => {
                                    return (
                                        <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                    );
                                })}

                            </Radio.Group>
                        )}
                    </Form.Item>
                    {this.getCategoryWithShowStyle()}
                    {this.getTagUIWithShowStyle()}
                </div>
            );
        }

        if (showStyle === 2) {

            return (

                <div>
                    {/* {followData?.showStatus === 1 ?
                        <div>
                            {this.props.isShowStatusBlock ?
                                <Form.Item label="客户邀约状态："  {...formItemLayout} >
                                    {getFieldDecorator('status', {
                                        rules: [{ required: false, message: '请选择客户邀约状态' }]
                                    })(
                                        <Radio.Group onChange={this.onChangeFollowUpTag} buttonStyle="solid">
                                            {followData?.status && followData?.status?.map((item: { id: any; name: React.ReactNode; }, index: number) => {
                                                return (
                                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                                );
                                            })}

                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                : ''}
                        </div>
                        : ''} */}
                    {this.getTagUIWithShowStyle()}
                    {this.getCategoryWithShowStyle()}
                    {this.getInvitationCategoryUIWidthShowStyle()}
                    {this.getInvitationStatusUIWitdhShowStyle()}
                    {this.getInvitationConfirmToShopUIWithShowStyle()}
                    {this.getInvitationConfirmToShopOtherUIWithShowStyle()}
                    {this.getInvalidReasonUIWithShowStyle()}
                </div>
            );
        }
        if (showStyle === 3) {

            return (
                <div>
                    {/* {followData?.showStatus === 1 ?
                        <Form.Item label="客户销售状态："  {...formItemLayout} >
                            {getFieldDecorator('status', {
                                rules: [{ required: false, message: '请选择客户销售状态' }]
                            })(
                                <Radio.Group onChange={this.onChangeFollowUpTag} buttonStyle="solid">
                                    {followData?.status && followData?.status?.map((item: { id: any; name: React.ReactNode; }, index: number) => {
                                        return (
                                            <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                        );
                                    })}

                                </Radio.Group>
                            )}
                        </Form.Item> : ''} */}
                    {this.getCategoryWithShowStyle()}
                    {this.getTwoStatusUIWithShowStyle()}
                    {this.getConfirmToShopShowStyle()}
                    {this.getTagUIWithShowStyle()}
                </div>
            );
        };

        if (showStyle === 5) {
            return (
                <Form.Item label="跟进标签："  {...formItemLayout} >
                    {getFieldDecorator('tag', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请选择跟进标签' }]
                    })(
                        <Radio.Group onChange={this.onChangeFollowUpTag} buttonStyle="solid">
                            {customerConfig?.requirementFollowTag && customerConfig?.requirementFollowTag?.map((item: { id: any; name: React.ReactNode; }) => {
                                return (
                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                );
                            })}

                        </Radio.Group>
                    )}
                </Form.Item>
            )
        }

    }

    // ------------- 邀约需要 ---------

    // 邀约品类
    getInvitationCategoryUIWidthShowStyle = () => {

        const { form, followData } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form.Item label="邀约品类："  {...formItemLayout} >
                {getFieldDecorator('reqId', {
                    initialValue: '',
                    rules: [{ required: false, message: '请选择邀约品类' }]
                })(
                    <Radio.Group onChange={this.onChangeInvitationCategory} buttonStyle="solid">
                        {followData?.reqCategory && followData?.reqCategory?.map((item: { id: any; name: React.ReactNode; }) => {
                            return (
                                <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item?.reqId}>{item?.categoryName}</Radio.Button>
                            );

                        })}

                    </Radio.Group>
                )}
            </Form.Item>
        );
    }

    // 更新邀约状态
    getInvitationStatusUIWitdhShowStyle = () => {

        const { form, followData } = this.props;
        const { getFieldDecorator } = form;
        if (
            this.state.selectCategoryModel?.showStatus === 1) {
            return (
                <Form.Item label="更新邀约状态："  {...formItemLayout} >
                    {getFieldDecorator('status', {
                        initialValue: this.state?.selectCategoryModel?.phase,
                        rules: [{ required: true, message: '请选择更新邀约状态' }]
                    })(
                        <Radio.Group onChange={this.onChangeInvitationStatue} buttonStyle="solid">
                            {followData?.status && followData?.status?.map((item: { id: any; name: React.ReactNode; }) => {
                                return (
                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                );
                            })}

                        </Radio.Group>
                    )}
                </Form.Item>
            );
        }


    }

    // 到店选项
    getInvitationConfirmToShopUIWithShowStyle = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        //  || this.state?.selelctInvitationStatus === 220
        if (this.state.selectCategoryModel?.showStatus === 1) {
            if (this.state?.selelctInvitationStatus === 230) {
                return (
                    <div>
                        <Form.Item label="预约进店："  {...formItemLayout} >
                            {getFieldDecorator('reserveStatus', {
                                initialValue: 0,
                                rules: [{ required: false, message: '请选择预约进店' }]
                            })(
                                <Radio.Group onChange={this.onChangeInvitationConfirmToShopTag} buttonStyle="solid">

                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={0}>{"暂不"}</Radio.Button>
                                    <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={1}>{"预约进店"}</Radio.Button>

                                </Radio.Group>
                            )}
                        </Form.Item>
                    </div>
                );
            }
        }


    }

    // 预约到店其他UI
    getInvitationConfirmToShopOtherUIWithShowStyle = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        if (this.state?.selectInvitationConfirmToShopTag === 1) {
            return (
                <div>
                    <Form.Item label="预约进店时间："  {...formItemLayout} >
                        {getFieldDecorator('reserveTime', {
                            rules: [{ required: true, message: '请选择预约进店时间' }]
                        })(
                            <DatePicker showTime placeholder='请请选择预约进店时间' />
                        )}
                    </Form.Item>
                </div>
            );
        }

    }


    // ------------- 门市需要  --------
    // 二次销售
    getTwoStatusUIWithShowStyle = () => {

        const { showStyle, form, followData } = this.props;
        const { getFieldDecorator } = form;

        if (showStyle === 3) {
            if (this.props?.orderDetail?.reserve_confirm_count > 0) {
                if (followData?.showStatus === 1) {
                    return (
                        <div>
                            <Form.Item label="二次销售状态："  {...formItemLayout} >
                                {getFieldDecorator('status', {
                                    initialValue: this.state?.defaultSalesStatus,
                                    rules: [{ required: true, message: '请选择二次销售状态' }]
                                })(
                                    <Radio.Group onChange={this.onChangeSalesStatus} buttonStyle="solid">
                                        {followData?.status && followData?.status?.map((item: { id: any; name: React.ReactNode; }) => {
                                            return (
                                                <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                            );
                                        })}
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </div>
                    );
                }
            }
        };

    }

    // 确认到店按钮
    getConfirmToShopShowStyle = () => {

        const { showStyle, followData } = this.props;

        let label = "首次确认到店";

        if (this.props?.orderDetail?.reserve_confirm_count > 0) {
            label = "再次确认到店";
            if (showStyle === 3 && (this.state?.selectSalesStatus === 330 || this.state?.selectSalesStatus === 310)) {
                if (followData.showStatus === 1) {
                    return (
                        this.getConfirmToShopUIShowStyle(label)
                    );
                }

            }

        } else {
            return (
                this.getConfirmToShopUIShowStyle(label)
            );
        }

        return (<div />);
    }

    getConfirmToShopUIShowStyle = (label: string) => {
        const { form, } = this.props;
        const { getFieldDecorator } = form;

        var countString = ''
        if (this.props?.orderDetail?.reserve_confirm_count) {
            countString = '(' + this.props?.orderDetail?.reserve_confirm_count?.toString() + ')'
        }

        return (
            <div>
                <Form.Item label={`${label}:`}  {...formItemLayout} >
                    {getFieldDecorator('orderArrivalStatus', {
                        initialValue: '',
                        rules: [{ required: false, message: `请选择${label}` }]
                    })(
                        <Radio.Group onChange={this.onConfirmToShopChange} buttonStyle="solid">
                            <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={1}>{'有效到店' + countString}</Radio.Button>
                            <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={2}>无效到店</Radio.Button>
                        </Radio.Group>
                    )}
                </Form.Item>
                {this.getConfirmToShopOtherUIShowStyle()}
            </div>
        );
    }

    // 返回确认到店其他选项
    getConfirmToShopOtherUIShowStyle = () => {
        const { showStyle, form, orderDetail } = this.props;
        const { getFieldDecorator } = form;
        const { selectSalesConfirmToShopTag } = this.state;

        if (showStyle === 3) {
            if (selectSalesConfirmToShopTag === 1) {

                if (this.props?.orderDetail?.reserve_confirm_count) {
                    // 再次进店
                    return (
                        <div>
                            <Form.Item label="到店时间："  {...formItemLayout} >
                                {getFieldDecorator('orderArrivalTime', {
                                    rules: [{ required: true, message: "请选择到店时间" }]
                                })(
                                    <DatePicker showTime placeholder='请选择到店时间' />
                                )}
                            </Form.Item>
                        </div>
                    );
                }

                if (orderDetail?.reserve?.length > 0) {
                    const item = orderDetail?.reserve[0];

                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px', marginBottom: '24px' }}>
                            <Card style={{ width: '70%' }} >
                                <div>创建时间：{item?.create_time}</div>
                                <div>预约时间：{item?.reserve_time}</div>
                                <div>预约人：{item?.user_name}</div>
                            </Card>
                        </div>
                    )
                }

            }

        };
    }

    // 无效原因
    getInvalidReasonUIWithShowStyle = () => {

        const { form } = this.props;
        const { getFieldDecorator } = form;

        if (this.state?.selelctInvitationStatus === 210 && this.state?.isSelectInvitationStatusType === 1) {
            return (
                <div>
                    <Form.Item label="无效原因："  {...formItemLayout} >
                        {getFieldDecorator('reqInvalidReason', {
                            rules: [{ required: true, message: '请输入无效原因' }]
                        })(
                            <TextArea />

                        )}
                    </Form.Item>
                </div>
            );
        }

    }

    // 获取指定邀约人
    getInvitationUIWithShowStyle = () => {
        const { showStyle, form, followData } = this.props;
        const { isShowCategoryBlock } = this.state;
        const { getFieldDecorator } = form;


        if (showStyle === 1 && followData?.reqUserList?.length > 0 && isShowCategoryBlock) {
            return (
                <div>
                    <Form.Item label="指定邀约人："  {...formItemLayout} >
                        {getFieldDecorator('reqUserId', {
                            initialValue: '',
                            rules: [{ required: false, message: '请选择指定邀约人' }]
                        })(
                            <Select placeholder="请选择指定邀约人" showSearch onChange={this.onChangeContacts}>
                                {followData?.reqUserList && followData?.reqUserList?.map(item => (
                                    <Option title={item?.name} value={`${item?.name},${item?.id}`}>{item?.name}</Option>
                                )
                                )}
                            </Select>
                        )}
                    </Form.Item>
                </div>
            );
        };
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
    renderHtmlCtrl = () => {
        const { form, isFriend } = this.props;
        const { getFieldDecorator } = form;
        const { customerConfig: { leadsFollowStatus, contactWay } } = this.props;
        const { showContacts } = this.state;

        const iconWidth = '22%'

        return (
            <div style={{ width: '100%', height: '100%', paddingTop: 20 }}>
                <Card>
                    {/* 头部选择联系人公共都有还有操作按钮 */}
                    <div style={{ display: "flex" }}>
                        <Form style={{ width: '90%' }} layout='horizontal'>
                            <div >
                                <Form.Item label="通话号码：" {...formItemLayout}>
                                    <Select defaultValue='' onChange={this.onChangeContacts}>
                                        {showContacts && showContacts.map(item => (
                                            <Option value={item?.contactId}>{item?.userName}  {item?.phone}</Option>
                                        )
                                        )}
                                    </Select>
                                </Form.Item>

                            </div>
                        </Form>
                        <Button onClick={this.doShowChooseTelephoneChannelsAction} style={{ marginTop: '2.5px' }} type='default'><SettingOutlined /></Button>
                    </div >
                    <div className={styles.headerButtomViewStyle}>
                        <Button type='link' onClick={this.moorDialout} style={{ backgroundColor: '#85CD79', color: 'white', width: iconWidth }}>
                            <PhoneOutlined />呼出
                            </Button>
                        <Button type='link' onClick={this.moorHangup} style={{ backgroundColor: '#DE7A7A', color: 'white', width: iconWidth }}>
                            <CloseCircleOutlined />挂断
                            </Button>
                        <Button type='default' onClick={this.showSendMessage} style={{ width: iconWidth }}>
                            <MessageOutlined />短信
                            </Button>
                        {isFriend ? <Button type='link' onClick={this.openWechat} style={{ width: iconWidth, backgroundColor: '#09bb07', color: 'white' }}>
                            <WechatOutlined />微信
                            </Button> : <Button type='default' onClick={this.addWechat} style={{ width: iconWidth }}>
                                <WechatOutlined />添加好友
                            </Button>}
                    </div>
                    <Divider />
                    <div style={{ fontSize: 20, fontWeight: 'bolder' }}>录跟进</div>
                    <div>
                        <Form layout='horizontal' onSubmit={this.onFollowRequest}>
                            <div >

                                {/* 公共 -- 跟进方式 */}
                                <Form.Item label="跟进方式："  {...formItemLayout} >
                                    {getFieldDecorator('contactWay', {
                                        initialValue: 1,
                                        rules: [{ required: true, message: '请选择跟进方式' }]
                                    })(
                                        <Radio.Group buttonStyle="solid">
                                            {contactWay && contactWay.map((item: { id: any; name: React.ReactNode; }) => (
                                                <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                            ))}

                                        </Radio.Group>
                                    )}
                                </Form.Item>

                                {/* 业务状态UI */}
                                {this.getStatusUIWithShowStyle()}

                                <Form.Item label="跟进结果：" {...formItemLayout}>
                                    {getFieldDecorator('results', {
                                        initialValue: '',
                                        rules: [{ required: false, message: '请选择跟进结果' }]
                                    })(

                                        <Radio.Group buttonStyle="solid" onChange={this.onChangeFollowUpResults}>
                                            {leadsFollowStatus && leadsFollowStatus.map((item: { id: any; name: React.ReactNode; }) => (
                                                <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={item.id}>{item.name}</Radio.Button>
                                            ))}

                                        </Radio.Group>
                                    )}
                                </Form.Item>


                                <Form.Item label="沟通内容：" {...formItemLayout}>
                                    {getFieldDecorator('comment', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请填写补充内容' }]
                                    })(
                                        <TextArea />
                                    )}
                                </Form.Item>
                                <Form.Item label="附件：" {...formItemLayout}>

                                    <OutlinedUpload
                                        text='上传文件'
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
                                        />
                                    )}
                                </Form.Item>

                                {this.getInvitationUIWithShowStyle()}


                                <Form.Item>
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        <Button onClick={() => {
                                            this.resetDone()
                                        }}>重置</Button>
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
                    <TextArea placeholder='请输入发送内容' value={this.state.sendMessageContent} onChange={this.messageChange} />

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

}

const RntryFollowForm = Form.create({ name: 'form_in_modal' })(RntryFollow);

export default RntryFollowForm; 