import React, { Component } from "react";
import { Form, Select, AutoComplete, Icon, Col, Row, Spin, message, Checkbox, Input, DatePicker } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { FormComponentProps } from 'antd/es/form';
import { Action, Dispatch } from "redux";
import AreaSelect from "@/components/AreaSelect";
import { StateType } from "../../model";
import { connect } from "dva";
import styles from './style.less';
import SellerCategory from "@/pages/LeadsManagement/newLeads/components/AlreadyCategory/SellerCategory";
import NumericInput from "@/components/NumericInput";
import moment from "moment";
import CrmUtil from "@/utils/UserInfoStorage";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface CustomerInfoProps extends FormComponentProps {
    submitting: boolean;
    dispatch: Dispatch<
        Action<
            | 'leadManagementDetail/updateCustomerInfo'
        >
    >;
    loading: boolean;
    leadManagementDetail: StateType;
    isDistribute: boolean;
    isclaimFlag: boolean;
    leadsId: string;
}

interface CustomerInfoState {
    level_disabled: boolean,
    name_disabled: boolean,
    sex_disabled: boolean,
    identity_disabled: boolean,
    wechat_disabled: boolean,
    phone_disabled: boolean,
    liveAddress_disabled: boolean,
    workAddress_disabled: boolean,
    customer_loading: boolean,
    contactTime_disabled: boolean,
    remark_disabled: boolean,
    liveRest: boolean,
    workRest: boolean,

    budget_disabled: boolean,
    weddingDate_disabled: boolean,
    weddingStyle_disabled: boolean,
    deskNum_disabled: boolean,
    hotel_disabled: boolean,
    bookTag_disabled: boolean,
    options: [],
    bizContentDefault: {}
}

@connect(
    ({
        leadManagementDetail,
        loading,
    }: {
        leadManagementDetail: StateType;
        loading: {
            models: {
                [key: string]: boolean;
            };
        };
    }) => ({
        leadManagementDetail,
        loading: loading.models.leadManagementDetail,
    }),
)

class CustomerInfo extends Component<CustomerInfoProps, CustomerInfoState> {

    constructor(props: CustomerInfoProps) {
        super(props);
        this.initCheckCategoryInfo()
    }

    liveCityCode: string | undefined;
    workCityCode: string | undefined;


    initCheckCategoryInfo = () => {
        const { form, leadManagementDetail } = this.props;
        const { customer, customerConfig } = leadManagementDetail;
        var bookTagIntArr: number[] = [];//保存转换后的整型字符
        if (customer && customer.bookTag != undefined && customer.bookTag.category != undefined && customer.bookTag.category.length > 0) {
            const bookTagArray = customer.bookTag.category.split(",")
            bookTagIntArr = bookTagArray.map(function (data) {
                return +data;
            });
        } else {
            bookTagIntArr = []
        }

        var bizContentDefault

        if (customer && customer.bookTag && customer.bookTag.bizContent) {
            bizContentDefault = customer.bookTag.bizContent
        } else {
            bizContentDefault = {
                banquet: { "brand": "", "price": "" },
                wedding: { "brand": "", "price": "" },
                photography: { "brand": "", "price": "" },
                car: { "brand": "", "price": "" },
                celebration: { "brand": "", "price": "" },
                oneStop: { "brand": "", "price": "" }
            }
        }


        this.state = {
            options: bookTagIntArr,
            bizContentDefault: bizContentDefault,
            level_disabled: true,
            name_disabled: true,
            sex_disabled: true,
            identity_disabled: true,
            wechat_disabled: true,
            phone_disabled: true,
            liveAddress_disabled: true,
            workAddress_disabled: true,
            liveRest: false,
            workRest: false,
            customer_loading: false,
            contactTime_disabled: true,
            remark_disabled: true,
            budget_disabled: true,
            weddingStyle_disabled: true,
            deskNum_disabled: true,
            hotel_disabled: true,
            bookTag_disabled: true,
            weddingDate_disabled: true,
        }

    }

    updateCallBack = (data: any, type: number, value: string, value2?: string) => {
        this.setState({
            customer_loading: false,
        });
        const { leadManagementDetail } = this.props;
        const { customer } = leadManagementDetail;
        if (!customer) {
            message.error("客户信息未获取");
            return;
        }
        if (data == '1') {
            message.success("修改成功");
            //客户评级
            if (type == 1) {
                customer.customerLevel = value;
                this.setState({
                    level_disabled: true,
                });
            }
            //姓名
            if (type == 2) {
                customer.customerName = value;
                this.setState({
                    name_disabled: true,
                });
            }
            //性别
            if (type == 3) {
                customer.gender = value;
                this.setState({
                    sex_disabled: true,
                });
            }
            //客户身份
            if (type == 4) {
                customer.identity = value;
                this.setState({
                    identity_disabled: true,
                });
            }
            //微信号
            if (type == 5) {
                customer.weChat = value;
                this.setState({
                    wechat_disabled: true,
                });
            }
            //居住地址
            if (type == 6) {
                this.liveCityCode ? customer.liveCityInfo.city_code = this.liveCityCode : null;
                customer.liveAddress = value;
                this.setState({
                    liveAddress_disabled: true,
                });
            }
            //工作地址
            if (type == 7) {
                this.workCityCode ? customer.workCityInfo.city_code = this.workCityCode : null;
                customer.workAddress = value;
                this.setState({
                    workAddress_disabled: true,
                });
            }
            //婚礼预算
            if (type == 8) {
                customer.budget = value;
                this.setState({
                    budget_disabled: true,
                });
            }
            //婚礼风格
            if (type == 9) {
                customer.weddingStyle = value;
                this.setState({
                    weddingStyle_disabled: true,
                });
            }
            //婚礼桌数
            if (type == 10) {
                customer.deskNum = value;
                this.setState({
                    deskNum_disabled: true,
                });
            }
            //婚礼酒店
            if (type == 11) {
                customer.hotel = value;
                this.setState({
                    hotel_disabled: true,
                });
            }
            //婚期
            if (type == 12) {
                customer.wedding_date_from = value;
                customer.wedding_date_end = value2 ? value2 : '';
                this.setState({
                    weddingDate_disabled: true,
                });
            }
            //婚礼酒店
            if (type == 13) {
                customer.contact_time = value;
                this.setState({
                    contactTime_disabled: true,
                });
            }
            //手机号
            if (type == 14) {
                customer.phone = value;
                this.setState({
                    phone_disabled: true,
                });
            }
            //备注
            if (type == 15) {
                customer.remark = value;
                this.setState({
                    remark_disabled: true,
                });
            }
            localStorage?.setItem('leadsListRefreshTag', 'list')
        }
    }

    handleCancel = (type: number) => {
        const { form, leadManagementDetail } = this.props;
        const { customer } = leadManagementDetail;
        //姓名
        if (type == 2) {
            form.setFieldsValue({
                name: customer ? customer.customerName : undefined
            });
            this.setState({
                name_disabled: true,
            });
        }
        //性别
        if (type == 3) {
            form.setFieldsValue({
                sex: (customer && customer.gender != '0' && customer.gender != '' && customer.gender != null) ? customer.gender : undefined
            });
            this.setState({
                sex_disabled: true,
            });
        }
        //客户身份
        if (type == 4) {
            form.setFieldsValue({
                identity: (customer && customer.identity != '0' && customer.identity != '' && customer.identity != null) ? customer.identity : undefined
            });
            this.setState({
                identity_disabled: true,
            });
        }
        //微信号
        if (type == 5) {
            form.setFieldsValue({
                wechat: customer ? customer.weChat : undefined,
            });
            this.setState({
                wechat_disabled: true,
            });
        }
        //居住地址
        if (type == 6) {
            form.setFieldsValue({
                liveAddress: customer ? customer.liveAddress : undefined,
            })
            this.liveCityCode = undefined
            if (customer && customer.liveCityInfo && customer.liveCityInfo.city_code) {
                this.setState({
                    liveAddress_disabled: true,
                });
            } else {
                this.setState({
                    liveAddress_disabled: true,
                    liveRest: true,
                }, () => {
                    this.setState({
                        liveRest: false,
                    })
                });
            }
        }
        //工作地址
        if (type == 7) {
            form.setFieldsValue({
                workAddress: customer ? customer.workAddress : undefined,
            })
            this.workCityCode = undefined
            if (customer && customer.workCityInfo && customer.workCityInfo.city_code) {
                this.setState({
                    workAddress_disabled: true,
                });
            } else {
                this.setState({
                    workAddress_disabled: true,
                    workRest: true,
                }, () => {
                    this.setState({
                        workRest: false,
                    })
                });
            }
        }
        //手机号
        if (type == 14) {
            form.setFieldsValue({
                phone: (customer && customer.phone != '' && customer.phone != null) ? customer.phone : ""
            });
            this.setState({
                phone_disabled: true,
            });
        }
        //备注
        if (type == 15) {
            form.setFieldsValue({
                remark: customer ? customer.remark : undefined
            });
            this.setState({
                remark_disabled: true,
            });
        }
        //方便联系时间
        if (type == 100) {
            form.setFieldsValue({
                contactTime: (customer && customer.contact_time != '' && customer.contact_time != 'Invalid date' && customer.contact_time != 'Invalid da') ? moment(customer.contact_time, 'YYYY-MM-DD') : undefined
            });
            this.setState({
                contactTime_disabled: true,
            });
        }
        //婚期
        if (type == 101) {
            form.setFieldsValue({
                weddingDate: (customer && customer.wedding_date_from != undefined && customer.wedding_date_from != '' && customer.wedding_date_from != 'Invalid date' && customer.wedding_date_from != 'Invalid da' && customer.wedding_date_end != undefined && customer.wedding_date_end != '' && customer.wedding_date_end != 'Invalid date' && customer.wedding_date_end != 'Invalid da') ? [moment(customer.wedding_date_from, 'YYYY-MM-DD'), moment(customer.wedding_date_end, 'YYYY-MM-DD')] : undefined
            });
            this.setState({
                weddingDate_disabled: true,
            });
        }
    }

    handleClickRemark = () => {
        if (this.state.remark_disabled == true) {
            this.setState({
                remark_disabled: false,
            });
        }
        if (this.state.remark_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            const feild = ['remark']
            form.validateFieldsAndScroll(feild, (err, values) => {
                if (err) {
                    message.error("请填写备注");
                    return;
                }
                if (!customer) {
                    message.error("客户信息未获取");
                    return;
                }
                const remark = values['remark'];
                this.setState({
                    customer_loading: true,
                });
                const params = {
                    customerId: customer.customerId,
                    leadsId: this.props.leadsId,
                    comment: remark,
                };
                dispatch({
                    type: 'leadManagementDetail/updateCustomerInfo',
                    payload: params,
                    callback: (data: any) => {
                        this.updateCallBack(data, 15, remark);
                    }
                });
            });
        }
    };

    handleClickLevel = () => {
        if (this.state.level_disabled == true) {
            this.setState({
                level_disabled: false,
            });
        }
        if (this.state.level_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            const feild = ['level']
            form.validateFieldsAndScroll(feild, (err, values) => {
                if (err) {
                    message.error("请选择客户评级");
                    return;
                }
                if (!customer) {
                    message.error("客户信息未获取");
                    return;
                }
                const level = values['level'];
                this.setState({
                    customer_loading: true,
                });
                const params = {
                    customerId: customer.customerId,
                    leadsId: this.props.leadsId,
                    customerLevel: level,
                };
                dispatch({
                    type: 'leadManagementDetail/updateCustomerInfo',
                    payload: params,
                    callback: (data: any) => {
                        this.updateCallBack(data, 1, level);
                    }
                });
            });
        }
    };

    handleClickName = () => {
        if (this.state.name_disabled == true) {
            this.setState({
                name_disabled: false,
            });
        }
        if (this.state.name_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            const feild = ['name']
            form.validateFieldsAndScroll(feild, (err, values) => {
                if (err) {
                    message.error("请填写姓名");
                    return;
                }
                if (!customer) {
                    message.error("客户信息未获取");
                    return;
                }
                const name = values['name'];
                this.setState({
                    customer_loading: true,
                });
                const params = {
                    customerId: customer.customerId,
                    leadsId: this.props.leadsId,
                    customerName: name,
                };
                dispatch({
                    type: 'leadManagementDetail/updateCustomerInfo',
                    payload: params,
                    callback: (data: any) => {
                        this.updateCallBack(data, 2, name);
                    }
                });
            });
        }
    };

    handleClickSex = () => {
        if (this.state.sex_disabled == true) {
            this.setState({
                sex_disabled: false,
            });
        }
        if (this.state.sex_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            const feild = ['sex']
            form.validateFieldsAndScroll(feild, (err, values) => {
                if (err) {
                    message.error("请选择性别");
                    return;
                }
                if (!customer) {
                    message.error("客户信息未获取");
                    return;
                }
                const sex = values['sex'];
                this.setState({
                    customer_loading: true,
                });
                const params = {
                    customerId: customer.customerId,
                    leadsId: this.props.leadsId,
                    gender: sex,
                };
                dispatch({
                    type: 'leadManagementDetail/updateCustomerInfo',
                    payload: params,
                    callback: (data: any) => {
                        this.updateCallBack(data, 3, sex);
                    }
                });
            });
        }
    };

    handleClickIdentity = () => {
        if (this.state.identity_disabled == true) {
            this.setState({
                identity_disabled: false,
            });
        }
        if (this.state.identity_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const identity = form.getFieldValue('identity');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                identity: !identity ? '' : identity,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 4, !identity ? '' : identity);
                }
            });
        }
    };

    handleClickPhone = () => {
        if (this.state.phone_disabled == true) {
            this.setState({
                phone_disabled: false,
            });
        }
        if (this.state.phone_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }

            let formFeilds: string[] = [];
            formFeilds.push('phone')
            form.validateFieldsAndScroll(formFeilds, (err, values) => {
                if (err) {
                    return;
                }
                const phone = values['phone']
                this.setState({
                    customer_loading: true,
                });
                const params = {
                    ...values,
                    customerId: customer.customerId,
                    leadsId: this.props.leadsId,
                };
                dispatch({
                    type: 'leadManagementDetail/updateCustomerInfo',
                    payload: params,
                    callback: (data: any) => {
                        this.updateCallBack(data, 14, !phone ? '' : phone);
                    }
                });
            })
        }
    };

    handleClickWeChat = () => {
        if (this.state.wechat_disabled == true) {
            this.setState({
                wechat_disabled: false,
            });
        }
        if (this.state.wechat_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const wechat = form.getFieldValue('wechat');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                weChat: !wechat ? '' : wechat,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 5, !wechat ? '' : wechat);
                }
            });
        }
    };

    handleClickBudget = () => {
        if (this.state.budget_disabled == true) {
            this.setState({
                budget_disabled: false,
            });
        }
        if (this.state.budget_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const budget = form.getFieldValue('budget');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                budget: !budget ? '' : budget,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 8, !budget ? '' : budget);
                }
            });
        }
    };

    handleClickWeddingDate = () => {
        if (this.state.weddingDate_disabled == true) {
            this.setState({
                weddingDate_disabled: false,
            });
        }
        if (this.state.weddingDate_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }

            const weddingDate = form.getFieldValue('weddingDate')
            if (weddingDate != undefined && weddingDate != '') {
                const weddingDateFrom = moment(weddingDate[0]).format('YYYY-MM-DD');
                const weddingDateEnd = moment(weddingDate[1]).format('YYYY-MM-DD');
                this.setState({
                    customer_loading: true,
                });
                const params = {
                    customerId: customer.customerId,
                    leadsId: this.props.leadsId,
                    weddingDateFrom,
                    weddingDateEnd,
                };
                dispatch({
                    type: 'leadManagementDetail/updateCustomerInfo',
                    payload: params,
                    callback: (data: any) => {
                        this.updateCallBack(data, 12, weddingDateFrom, weddingDateEnd);
                    }
                });
            } else {
                message.error("请选择婚期");
            }
        }
    };

    handleClickContactTime = () => {
        if (this.state.contactTime_disabled == true) {
            this.setState({
                contactTime_disabled: false,
            });
        }
        if (this.state.contactTime_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const contactTime = form.getFieldValue('contactTime');
            if (contactTime == undefined || contactTime == '' || contactTime == null || contactTime == 'Invalid date') {
                message.info("请选择方便联系时间")
                return
            }
            let date = moment(contactTime).format('YYYY-MM-DD');
            if (date == 'Invalid date' || date == '' || date == null) {
                message.info("请选择方便联系时间")
                return
            }
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                contactTime: date,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 13, !contactTime ? '' : contactTime);
                }
            });
        }
    };

    handleClickWeddingStyle = () => {
        if (this.state.weddingStyle_disabled == true) {
            this.setState({
                weddingStyle_disabled: false,
            });
        }
        if (this.state.weddingStyle_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const weddingStyle = form.getFieldValue('weddingStyle');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                wedding_style: !weddingStyle ? '' : weddingStyle,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 9, !weddingStyle ? '' : weddingStyle);
                }
            });
        }
    };

    handleClickDeskNum = () => {
        if (this.state.deskNum_disabled == true) {
            this.setState({
                deskNum_disabled: false,
            });
        }
        if (this.state.deskNum_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const deskNum = form.getFieldValue('deskNum');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                table_num: !deskNum ? '' : deskNum,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 10, !deskNum ? '' : deskNum);
                }
            });
        }
    };

    handleClickHotel = () => {
        if (this.state.hotel_disabled == true) {
            this.setState({
                hotel_disabled: false,
            });
        }
        if (this.state.hotel_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const hotel = form.getFieldValue('hotel');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                hotel: !hotel ? '' : hotel,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 11, !hotel ? '' : hotel);
                }
            });
        }
    };

    handleVisibleBookTagView = (data: Object) => {
        if (this.state.bookTag_disabled == true) {
            this.setState({
                bookTag_disabled: false
            }, () => {
                console.log(this.state.bookTag_disabled)
            });
        } else {
            this.setState({
                bookTag_disabled: true
            });
        }
    }

    handleClickBookTag = (data: Object) => {
        const { dispatch, form, leadManagementDetail } = this.props;
        const { customer } = leadManagementDetail;

        if (this.state.bookTag_disabled == false) {
            form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    var booktagArray = values["bookTag"]
                    var booktagStr = ""
                    if (booktagArray != undefined) {
                        if (booktagArray.length > 0) {
                            booktagStr = booktagArray.join()
                        } else {
                            booktagStr = ""
                        }
                    } else {
                        booktagStr = ""
                    }

                    const bookTagResult =
                    {
                        'category': booktagStr,
                        'bizContent': data,
                    }

                    const valuesResult = {
                        customerId: customer.customerId,
                        leadsId: this.props.leadsId,
                        'bookTag': bookTagResult,
                    }
                    dispatch({
                        type: 'leadManagementDetail/updateCustomerInfo',
                        payload: valuesResult,
                    });

                    this.setState({
                        bookTag_disabled: true,
                        bizContentDefault: data
                    });
                }
            });
        }
    }

    liveAreaSelectChange = (code: string, province: string, city: string, district: string) => {
        this.liveCityCode = code;
    }

    handleClickLiveAddress = () => {
        if (this.state.liveAddress_disabled == true) {
            const { leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            this.liveCityCode = (customer && customer.liveCityInfo) ? customer.liveCityInfo.city_code : undefined;
            this.setState({
                liveAddress_disabled: false,
            });
        }
        if (this.state.liveAddress_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            const liveAddress = form.getFieldValue('liveAddress');
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                liveCityCode: this.liveCityCode,
                liveAddress: !liveAddress ? '' : liveAddress,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 6, !liveAddress ? '' : liveAddress);
                }
            });
        }
    };

    workAreaSelectChange = (code: string, province: string, city: string, district: string) => {
        this.workCityCode = code;
    }

    handleClickWorkAddress = () => {
        if (this.state.workAddress_disabled == true) {
            const { leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            this.workCityCode = (customer && customer.workCityInfo) ? customer.workCityInfo.city_code : undefined;
            this.setState({
                workAddress_disabled: false,
            });
        }
        if (this.state.workAddress_disabled == false) {
            const { dispatch, form, leadManagementDetail } = this.props;
            const { customer } = leadManagementDetail;
            const workAddress = form.getFieldValue('workAddress');
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                leadsId: this.props.leadsId,
                workCityCode: this.workCityCode,
                workAddress: !workAddress ? '' : workAddress,
            };
            dispatch({
                type: 'leadManagementDetail/updateCustomerInfo',
                payload: params,
                callback: (data: any) => {
                    this.updateCallBack(data, 7, !workAddress ? '' : workAddress);
                }
            });
        }
    };

    //品类选择监听
    onCategoryChange = (checkedValues: any) => {
        this.setState({
            options: checkedValues
        })
    }


    render() {
        const { form, leadManagementDetail, isclaimFlag, isDistribute } = this.props;
        const { customer, customerConfig, permission } = leadManagementDetail;
        const { customeradapter_updatecustomer } = permission;
        const { getFieldDecorator } = form; 1
        const { submitting } = this.props;
        const { options } = this.state;
        console.log(customer)
        return (
            <div>
                <Spin spinning={this.state.customer_loading}>
                    <Form style={{ marginTop: 20, marginLeft: 0 }}>
                        <div className={styles.headerMaxTitle}>基础信息</div>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="客户编号" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('id', {
                                            initialValue: (customer && customer.customerId != '' && customer.customerId != null) ? customer.customerId : ""
                                        })(
                                            <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="客户姓名" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('name', {
                                            initialValue: customer ? customer.customerName : undefined,
                                            rules: [{ required: true, message: '请填写姓名' }],
                                        })(
                                            <AutoComplete placeholder="请输入" disabled={this.state.name_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.name_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickName} />
                                    {
                                        !this.state.name_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(2)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="性别" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('sex', {
                                            initialValue: (customer && customer.gender != '0' && customer.gender != '' && customer.gender != null) ? customer.gender : undefined,
                                            rules: [{ required: true, message: '请选择性别' }],
                                        })(
                                            <Select placeholder="请选择" style={{ marginLeft: 8 }} disabled={this.state.sex_disabled} >
                                                {
                                                    (customerConfig && customerConfig.gender) ? customerConfig.gender.map(gender => (
                                                        <Option value={gender.id}>{gender.name}</Option>)) : null
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.sex_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickSex} />
                                    {
                                        !this.state.sex_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(3)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="客户身份" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('identity', {
                                            initialValue: (customer && customer.identity != '0' && customer.identity != '' && customer.identity != null) ? customer.identity : undefined
                                        })(
                                            <Select placeholder="请选择" style={{ marginLeft: 8 }} disabled={this.state.identity_disabled} >
                                                {
                                                    (customerConfig && customerConfig.identity) ? customerConfig.identity.map(identity => (
                                                        <Option value={identity.id}>{identity.name}</Option>)) : null
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.identity_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickIdentity} />
                                    {
                                        !this.state.identity_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(4)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="客户来源" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('channel', {
                                            initialValue: (customer && customer.channel_text != '' && customer.channel_text != null) ? customer.channel_text : "-"
                                        })(
                                            <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="客户级别" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('level', {
                                            initialValue: (customer && customer.level_text != '' && customer.level_text != null) ? customer.level_text : ""
                                        })(
                                            <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="客户状态" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('channel', {
                                            initialValue: (customer && customer.status_text != '' && customer.status_text != null) ? customer.status_text : ""
                                        })(
                                            <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="手机号" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('phone', {
                                            rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                                                return event.target.value.replace(/\D/g, '')
                                            },
                                            initialValue: (customer && customer.phone != '' && customer.phone != null) ? customer.phone : ""
                                        })(
                                            <Input placeholder="" disabled={this.state.phone_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.phone_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickPhone} />
                                    {
                                        !this.state.phone_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(14)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="微信号" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('wechat', {
                                            initialValue: customer ? customer.weChat : undefined,
                                            rules: [{
                                                pattern: new RegExp(/^\w{1,20}$/g, "g"), message: '请输入有效微信号'
                                            }],
                                            getValueFromEvent: (event) => {
                                                return event.target.value.replace(/[\u4e00-\u9fa5]/g, '')
                                            },
                                        })(
                                            <Input placeholder="" disabled={this.state.wechat_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.wechat_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickWeChat} />
                                    {
                                        !this.state.wechat_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(5)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="婚期" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('weddingDate', {
                                            initialValue: (customer && customer.wedding_date_from != undefined && customer.wedding_date_from != '' && customer.wedding_date_from != 'Invalid date' && customer.wedding_date_from != 'Invalid da' && customer.wedding_date_end != undefined && customer.wedding_date_end != '' && customer.wedding_date_end != 'Invalid date' && customer.wedding_date_end != 'Invalid da') ? [moment(customer.wedding_date_from, 'YYYY-MM-DD'), moment(customer.wedding_date_end, 'YYYY-MM-DD')] : undefined
                                        })(
                                            <RangePicker style={{ marginLeft: 8, width: '100%' }} disabled={this.state.weddingDate_disabled} format={'YYYY-MM-DD'} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.weddingDate_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickWeddingDate} />
                                    {
                                        !this.state.weddingDate_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(101)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="居住地址" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        <div style={{ marginLeft: 10 }}>
                                            {
                                                customer ? <AreaSelect
                                                    level3={true}
                                                    reset={this.state.liveRest}
                                                    disabled={this.state.liveAddress_disabled}
                                                    selectedCode={this.liveCityCode != undefined ? this.liveCityCode : (customer && customer.liveCityInfo && customer.liveCityInfo.city_code ? customer.liveCityInfo.city_code : undefined)}
                                                    areaSelectChange={this.liveAreaSelectChange} /> : null
                                            }
                                        </div>
                                        {getFieldDecorator('liveAddress', {
                                            initialValue: customer ? customer.liveAddress : undefined
                                        })(
                                            <AutoComplete placeholder="请输入" disabled={this.state.liveAddress_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.liveAddress_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 49 }} onClick={this.handleClickLiveAddress} />
                                    {
                                        !this.state.liveAddress_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 49 }} onClick={() => {
                                            this.handleCancel(6)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="工作地址" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        <div style={{ marginLeft: 10 }}>
                                            {
                                                customer ? <AreaSelect
                                                    reset={this.state.workRest}
                                                    level3={true}
                                                    disabled={this.state.workAddress_disabled}
                                                    selectedCode={this.workCityCode != undefined ? this.workCityCode : (customer && customer.workCityInfo && customer.workCityInfo.city_code ? customer.workCityInfo.city_code : undefined)}
                                                    areaSelectChange={this.workAreaSelectChange} /> : null
                                            }
                                        </div>
                                        {getFieldDecorator('workAddress', {
                                            initialValue: customer ? customer.workAddress : undefined
                                        })(
                                            <AutoComplete placeholder="请输入" disabled={this.state.workAddress_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.workAddress_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 49 }} onClick={this.handleClickWorkAddress} />
                                    {
                                        !this.state.workAddress_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 49 }} onClick={() => {
                                            this.handleCancel(7)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="方便联系时间" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('contactTime', {
                                            initialValue: (customer && customer.contact_time != '' && customer.contact_time != 'Invalid date' && customer.contact_time != 'Invalid da') ? moment(customer.contact_time, 'YYYY-MM-DD') : undefined
                                        })(
                                            <DatePicker style={{ marginLeft: 8, width: '100%' }} disabled={this.state.contactTime_disabled} format={'YYYY-MM-DD'} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.contactTime_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickContactTime} />
                                    {
                                        !this.state.contactTime_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(100)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>

                        {/* {
                            CrmUtil.getCompanyType() == 1 ?
                                <Row>
                                    <Col span={20}>
                                        <div style={{ float: "left", width: '100%' }}>
                                            <FormItem label="创建时间" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                                {getFieldDecorator('createTime', {
                                                    initialValue: (customer && customer.create_time != '' && customer.create_time != 'Invalid date' && customer.create_time != 'Invalid da') ? moment(customer.create_time, 'YYYY-MM-DD') : undefined
                                                })(
                                                    <DatePicker style={{ marginLeft: 8, width: '100%' }} disabled={true} format={'YYYY-MM-DD'} />
                                                )}
                                            </FormItem>
                                        </div>
                                    </Col>
                                </Row>
                                :
                                null
                        }

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="创建人" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('createUser', {
                                            initialValue: (customer && customer.create_user != '' && customer.create_user != null) ? customer.create_user : ""
                                        })(
                                            <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                        </Row> */}
                        {
                            //到喜啦显示提供人（字段不一样）
                            CrmUtil.getCompanyType() == 1 ?
                                <Row>
                                    <Col span={20}>
                                        <div style={{ float: "left", width: '100%' }}>
                                            <FormItem label="推荐人" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                                {getFieldDecorator('referrerName', {
                                                    initialValue: (customer && customer.referrer_name != '' && customer.referrer_name != null) ? customer.referrer_name : ""
                                                })(
                                                    <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                                )}
                                            </FormItem>
                                        </div>
                                    </Col>
                                </Row>
                                //北京显示提供人（字段不一样）
                                : CrmUtil.getCompanyType() == 2 ?
                                    <Row>
                                        <Col span={20}>
                                            <div style={{ float: "left", width: '100%' }}>
                                                <FormItem label="提供人" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                                    {getFieldDecorator('referrerName', {
                                                        initialValue: (customer && customer.record_user_name != '' && customer.record_user_name != null) ? customer.record_user_name : ""
                                                    })(
                                                        <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                                    )}
                                                </FormItem>
                                            </div>
                                        </Col>
                                    </Row>
                                    : null
                        }
                        {
                            //到喜啦显示提供人手机
                            CrmUtil.getCompanyType() == 1 ?
                                <Row>
                                    <Col span={20}>
                                        <div style={{ float: "left", width: '100%' }}>
                                            <FormItem label="推荐人手机" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                                {getFieldDecorator('referrerPhone', {
                                                    initialValue: (customer && customer.referrer_phone != '' && customer.referrer_phone != null) ? customer.referrer_phone : ""
                                                })(
                                                    <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                                )}
                                            </FormItem>
                                        </div>
                                    </Col>
                                </Row>
                                : null
                        }

                        <Row>
                            <Col span={20}>
                                <div style={{ float: "left", width: '100%' }}>
                                    <FormItem label="备注" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                        {getFieldDecorator('remark', {
                                            initialValue: customer ? customer.remark : undefined
                                        })(
                                            <AutoComplete placeholder="" disabled={this.state.remark_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            {/* <Col span={2} hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                <div style={{ display: 'flex' }}>
                                    <Icon type={this.state.remark_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickRemark} />
                                    {
                                        !this.state.remark_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                            this.handleCancel(15)
                                        }} /> : undefined
                                    }
                                </div>
                            </Col> */}
                        </Row>


                        <div style={{ display: "none" }}>
                            <div className={styles.headerMaxTitle}>重点信息</div>
                            <Row>
                                <Col span={20}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="意向区域" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('likeCityInfo', {
                                                initialValue: (customer && customer.likeCityInfo) ? (customer.likeCityInfo.full) : "-"
                                            })(
                                                <AutoComplete placeholder="请输入" disabled={true} style={{ marginLeft: 8 }} />
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={20}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="业务品类" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('category', {
                                                initialValue: (customer && customer.category != '' && customer.category != null) ? customer.category : "-"
                                            })(
                                                <AutoComplete placeholder="请输入" disabled={true} style={{ marginLeft: 8 }} />
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={20}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="婚礼预算" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('budget', {
                                                initialValue: customer ? customer.budget : undefined
                                            })(
                                                <NumericInput placeholder="请输入" autoComplete="off" style={{ marginLeft: 8 }} prefix="￥" disabled={this.state.budget_disabled} />
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.budget_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickBudget} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={20}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="婚礼风格" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('weddingStyle', {
                                                initialValue: customer ? customer.weddingStyle : undefined
                                            })(
                                                <Select placeholder="请选择" style={{ marginLeft: 8 }} disabled={this.state.weddingStyle_disabled} >
                                                    {
                                                        (customerConfig && customerConfig.weddingStyle) ? customerConfig.weddingStyle.map(style => (
                                                            <Option value={style.id}>{style.name}</Option>)) : null
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.weddingStyle_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickWeddingStyle} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={20}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="婚礼桌数" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('deskNum', {
                                                initialValue: customer ? customer.deskNum : undefined,
                                                rules: [{ required: false, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '桌数只能为数字' }],
                                            })(
                                                <Input autoComplete="off" maxLength={5} style={{ marginLeft: 8 }} suffix="桌" placeholder="请输入" disabled={this.state.deskNum_disabled} />
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.deskNum_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickDeskNum} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={20}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="预定酒店" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('hotel', {
                                                initialValue: customer ? customer.hotel : undefined
                                            })(
                                                <AutoComplete placeholder="请输入" disabled={this.state.hotel_disabled} style={{ marginLeft: 8 }} />
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.hotel_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleClickHotel} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={20}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="已定竞品" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                            {getFieldDecorator('bookTag', {
                                                rules: [{ required: false }],
                                                initialValue: options

                                            })(
                                                <Checkbox.Group style={{ marginLeft: 8 }} disabled={this.state.bookTag_disabled} onChange={this.onCategoryChange}>
                                                    {
                                                        customerConfig.category.map(category => (
                                                            <Checkbox value={category.id} >{category.name}</Checkbox>))
                                                    }
                                                </Checkbox.Group>,
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.bookTag_disabled == true ? 'edit' : 'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={this.handleVisibleBookTagView} />
                                </Col>
                            </Row>
                            <SellerCategory
                                visible={!this.state.bookTag_disabled}
                                validate={this.handleClickBookTag}
                                submitting={submitting} checkCategorys={this.state.options}
                                bizContent={this.state.bizContentDefault} />
                        </div>
                    </Form>
                </Spin>
            </div >
        );
    };
}
export default Form.create<CustomerInfoProps>()(CustomerInfo);