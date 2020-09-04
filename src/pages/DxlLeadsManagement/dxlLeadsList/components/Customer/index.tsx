import AreaSelect from "@/components/AreaSelect";
import SellerCategory from "@/pages/LeadsManagement/newLeads/components/AlreadyCategory/SellerCategory";
import { AutoComplete, Checkbox, Col, DatePicker, Form, Icon, Input, message, Row, Select, Spin } from "antd";
import { FormComponentProps } from 'antd/es/form';
import FormItem from "antd/lib/form/FormItem";
import moment from "moment";
import React, { Component } from "react";
import styles from '../../style.less';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { CustomerInfoData, ConfigData } from "@/pages/LeadsManagement/leadsDetails/data";
import { Permission } from "../../data";
import CrmUtil from "@/utils/UserInfoStorage";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface CustomerInfoProps extends FormComponentProps {
    onCustomerRef: (ref: any) => void;
    loading: boolean;
    leadsId: string;
    customer: CustomerInfoData;
    config: ConfigData;
    isDistribute: boolean;
    isclaimFlag: boolean;
    permission: Permission;
    //刷新当前线索列表
    fun_refreshLeadsList: Function;
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
    referrerName_disabled: boolean,
    referrerPhone_disabled: boolean,
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

class CustomerInfo extends Component<CustomerInfoProps, CustomerInfoState> {

    constructor(props: CustomerInfoProps) {
        super(props);
        this.props.onCustomerRef(this)
        this.initCheckCategoryInfo()
    }

    liveCityCode: string | undefined;
    workCityCode: string | undefined;


    initCheckCategoryInfo = () => {
        const { customer } = this.props;
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
            referrerName_disabled: true,
            referrerPhone_disabled: true,
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


    //更新用户表单信息(切换线索需要手动给form里的值赋值，render里无法刷新)
    updateCustomerForm() {
        const { form, customer } = this.props;
        form.setFieldsValue({
            'name': customer ? customer.customerName : undefined,
            'sex': (customer && customer.gender != '0' && customer.gender != '' && customer.gender != null) ? customer.gender : undefined,
            'identity': (customer && customer.identity != '0' && customer.identity != '' && customer.identity != null) ? customer.identity : undefined,
            'phone': (customer && customer.phone != '' && customer.phone != null) ? customer.phone : "",
            'wechat': customer ? customer.weChat : undefined,
            'contactTime': (customer && customer.contact_time != '' && customer.contact_time != 'Invalid date' && customer.contact_time != 'Invalid da') ? moment(customer.contact_time, 'YYYY-MM-DD') : undefined,
            'remark': customer ? customer.remark : undefined,
        })
    }

    //更新用户信息
    updateCustomer(params: any, type: number, value: string, value2?: string) {
        const { leadsId } = this.props
        const newParams = {
            ...params,
            leadsId: leadsId,
        }
        Axios.post(URL.updateCustomer, newParams).then(
            res => {
                this.setState({
                    customer_loading: false,
                });
                if (res.code == 200) {
                    if (res.data.result == '1') {
                        message.success("修改成功");
                        this.updateCallBack(type, value, value2);
                    } else {
                        message.success("修改失败");
                    }
                }
            }
        );
    }

    //更新用户信息
    updateCustomerTag(params: any) {
        const { leadsId } = this.props
        const newParams = {
            ...params,
            leadsId: leadsId,
        }
        Axios.post(URL.leadsUpdateCustomer, newParams).then(
            res => {
                if (res.code == 200) {
                    if (res.data.result == '1') {
                        message.success("修改成功");
                    } else {
                        message.success("修改失败");
                    }
                }
            }
        );
    }

    handleCancel = (type: number) => {
        const { form, customer } = this.props;
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

    updateCallBack = (type: number, value: string, value2?: string) => {
        const { fun_refreshLeadsList } = this.props
        //刷新列表数据
        fun_refreshLeadsList();
        const { customer } = this.props;
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
        //婚礼酒店
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
        //手机号
        if (type == 15) {
            customer.remark = value;
            this.setState({
                remark_disabled: true,
            });
        }
        //推荐人
        if (type == 16) {
            customer.referrer_name = value;
            this.setState({
                referrerName_disabled: true,
            });
        }
        //推荐人手机号
        if (type == 17) {
            customer.referrer_phone = value;
            this.setState({
                referrerPhone_disabled: true,
            });
        }
    }

    handleClickLevel = () => {
        if (this.state.level_disabled == true) {
            this.setState({
                level_disabled: false,
            });
        }
        if (this.state.level_disabled == false) {
            const { form, customer } = this.props;
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
                    customerLevel: level,
                };
                this.updateCustomer(params, 1, level);
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
            const { form, customer } = this.props;
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
                    customerName: name,
                };
                this.updateCustomer(params, 2, name);
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
            const { form, customer } = this.props;
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
                    gender: sex,
                };
                this.updateCustomer(params, 3, sex);
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
            const { form, customer } = this.props;
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
                identity: !identity ? '' : identity,
            };
            this.updateCustomer(params, 4, !identity ? '' : identity);
        }
    };

    handleClickPhone = () => {
        if (this.state.phone_disabled == true) {
            this.setState({
                phone_disabled: false,
            });
        }
        if (this.state.phone_disabled == false) {
            const { form, customer } = this.props;
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
                    customerId: customer.customerId,
                    phone: !phone ? '' : phone,
                };
                this.updateCustomer(params, 14, !phone ? '' : phone);
            })
        }
    };

    handleClickRemark = () => {
        if (this.state.remark_disabled == true) {
            this.setState({
                remark_disabled: false,
            });
        }
        if (this.state.remark_disabled == false) {
            const { form, customer } = this.props;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const remark = form.getFieldValue('remark');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                comment: !remark ? '' : remark,
            };
            this.updateCustomer(params, 15, !remark ? '' : remark);
        }
    };

    handleClickWeChat = () => {
        if (this.state.wechat_disabled == true) {
            this.setState({
                wechat_disabled: false,
            });
        }
        if (this.state.wechat_disabled == false) {
            const { form, customer } = this.props;
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
                weChat: !wechat ? '' : wechat,
            };
            this.updateCustomer(params, 5, !wechat ? '' : wechat);
        }
    };

    handleClickReferrerName = () => {
        if (this.state.referrerName_disabled == true) {
            this.setState({
                referrerName_disabled: false,
            });
        }
        if (this.state.referrerName_disabled == false) {
            const { form, customer } = this.props;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const referrerName = form.getFieldValue('referrerName');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                referrerName: !referrerName ? '' : referrerName,
            };
            this.updateCustomer(params, 16, !referrerName ? '' : referrerName);
        }
    };

    handleClickReferrerPhone = () => {
        if (this.state.referrerPhone_disabled == true) {
            this.setState({
                referrerPhone_disabled: false,
            });
        }
        if (this.state.referrerPhone_disabled == false) {
            const { form, customer } = this.props;
            if (!customer) {
                message.error("客户信息未获取");
                return;
            }
            const referrerPhone = form.getFieldValue('referrerPhone');
            this.setState({
                customer_loading: true,
            });
            const params = {
                customerId: customer.customerId,
                referrerPhone: !referrerPhone ? '' : referrerPhone,
            };
            this.updateCustomer(params, 17, !referrerPhone ? '' : referrerPhone);
        }
    };

    handleClickBudget = () => {
        if (this.state.budget_disabled == true) {
            this.setState({
                budget_disabled: false,
            });
        }
        if (this.state.budget_disabled == false) {
            const { form, customer } = this.props;
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
                budget: !budget ? '' : budget,
            };
            this.updateCustomer(params, 8, !budget ? '' : budget);
        }
    };

    handleClickWeddingDate = () => {
        if (this.state.weddingDate_disabled == true) {
            this.setState({
                weddingDate_disabled: false,
            });
        }
        if (this.state.weddingDate_disabled == false) {
            const { form, customer } = this.props;
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
                    weddingDateFrom,
                    weddingDateEnd,
                };
                this.updateCustomer(params, 12, weddingDateFrom, weddingDateEnd);
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
            const { form, customer } = this.props;
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
                contactTime: date,
            };
            this.updateCustomer(params, 13, !contactTime ? '' : contactTime);
        }
    };

    handleClickWeddingStyle = () => {
        if (this.state.weddingStyle_disabled == true) {
            this.setState({
                weddingStyle_disabled: false,
            });
        }
        if (this.state.weddingStyle_disabled == false) {
            const { form, customer } = this.props;
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
                wedding_style: !weddingStyle ? '' : weddingStyle,
            };
            this.updateCustomer(params, 9, !weddingStyle ? '' : weddingStyle);
        }
    };

    handleClickDeskNum = () => {
        if (this.state.deskNum_disabled == true) {
            this.setState({
                deskNum_disabled: false,
            });
        }
        if (this.state.deskNum_disabled == false) {
            const { form, customer } = this.props;
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
                table_num: !deskNum ? '' : deskNum,
            };
            this.updateCustomer(params, 10, !deskNum ? '' : deskNum);
        }
    };

    handleClickHotel = () => {
        if (this.state.hotel_disabled == true) {
            this.setState({
                hotel_disabled: false,
            });
        }
        if (this.state.hotel_disabled == false) {
            const { form, customer } = this.props;
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
                hotel: !hotel ? '' : hotel,
            };
            this.updateCustomer(params, 11, !hotel ? '' : hotel);
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
        const { form, customer } = this.props;

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
                        id: customer.customerId,
                        'bookTag': bookTagResult,
                    }
                    this.updateCustomerTag(valuesResult);

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
            const { customer } = this.props;
            this.liveCityCode = (customer && customer.liveCityInfo) ? customer.liveCityInfo.city_code : undefined;
            this.setState({
                liveAddress_disabled: false,
            });
        }
        if (this.state.liveAddress_disabled == false) {
            const { form, customer } = this.props;
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
                liveCityCode: this.liveCityCode,
                liveAddress: !liveAddress ? '' : liveAddress,
            };
            this.updateCustomer(params, 6, !liveAddress ? '' : liveAddress);
        }
    };

    workAreaSelectChange = (code: string, province: string, city: string, district: string) => {
        this.workCityCode = code;
    }

    handleClickWorkAddress = () => {
        if (this.state.workAddress_disabled == true) {
            const { customer } = this.props;
            this.workCityCode = (customer && customer.workCityInfo) ? customer.workCityInfo.city_code : undefined;
            this.setState({
                workAddress_disabled: false,
            });
        }
        if (this.state.workAddress_disabled == false) {
            const { form, customer } = this.props;
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
                workCityCode: this.workCityCode,
                workAddress: !workAddress ? '' : workAddress,
            };
            this.updateCustomer(params, 7, !workAddress ? '' : workAddress);
        }
    };

    //品类选择监听
    onCategoryChange = (checkedValues: any) => {
        this.setState({
            options: checkedValues
        })
    }


    render() {
        const { form, customer, isclaimFlag, isDistribute, config, permission } = this.props;
        const { customeradapter_updatecustomer } = permission;
        const { getFieldDecorator } = form;
        const { options } = this.state;
        console.log(JSON.stringify(customer))
        return (
            <div>
                <Spin spinning={this.state.customer_loading}>
                    <Form style={{ marginLeft: 0 }}>
                        {/* <div className={styles.headerMaxTitle}>基础信息</div> */}
                        <Row gutter={{ md: 3, lg: 12, xl: 24 }}>
                            <Col span={12}>
                                <FormItem style={{ float: "left", width: '80%' }} label="客户编号" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                    {getFieldDecorator('id', {
                                        initialValue: (customer && customer.customerId != '' && customer.customerId != null) ? customer.customerId : ""
                                    })(
                                        <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem style={{ float: "left", width: '80%' }} label="客户来源" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                    {getFieldDecorator('channel', {
                                        initialValue: (customer && customer.channel_text != '' && customer.channel_text != null) ? customer.channel_text : "-"
                                    })(
                                        <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="客户姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                                        {getFieldDecorator('name', {
                                            initialValue: customer ? customer.customerName : undefined,
                                            rules: [{ required: true, message: '请填写姓名' }],
                                        })(
                                            <AutoComplete placeholder="请输入" disabled={this.state.name_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer} >
                                        <Icon style={{ fontSize: 20, marginTop: 9 }} type={this.state.name_disabled == true ? 'edit' : 'check'} onClick={this.handleClickName} />
                                        {
                                            !this.state.name_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(2)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12}>
                                <FormItem style={{ float: "left", width: '80%' }} label="客户级别" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                    {getFieldDecorator('level', {
                                        initialValue: (customer && customer.level_text != '' && customer.level_text != null) ? customer.level_text : ""
                                    })(
                                        <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="性别" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        {getFieldDecorator('sex', {
                                            initialValue: (customer && customer.gender != '0' && customer.gender != '' && customer.gender != null) ? customer.gender : undefined,
                                            rules: [{ required: true, message: '请选择性别' }],
                                        })(
                                            <Select placeholder="请选择" style={{ marginLeft: 8 }} disabled={this.state.sex_disabled} >
                                                {
                                                    (config && config.gender) ? config.gender.map(gender => (
                                                        <Option value={gender.id}>{gender.name}</Option>)) : null
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.sex_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickSex} />
                                        {
                                            !this.state.sex_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(3)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <FormItem style={{ float: "left", width: '80%' }} label="客户状态" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                    {getFieldDecorator('status', {
                                        initialValue: (customer && customer.status_text != '' && customer.status_text != null) ? customer.status_text : ""
                                    })(
                                        <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="客户身份" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        {getFieldDecorator('identity', {
                                            initialValue: (customer && customer.identity != '0' && customer.identity != '' && customer.identity != null) ? customer.identity : undefined
                                        })(
                                            <Select placeholder="请选择" style={{ marginLeft: 8 }} disabled={this.state.identity_disabled} >
                                                {
                                                    (config && config.identity) ? config.identity.map(identity => (
                                                        <Option value={identity.id}>{identity.name}</Option>)) : null
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.identity_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickIdentity} />
                                        {
                                            !this.state.identity_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(4)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="手机号" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        {getFieldDecorator('phone', {
                                            rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                                                return event.target.value.replace(/\D/g, '')
                                            },
                                            initialValue: (customer && customer.phone != '' && customer.phone != null) ? customer.phone : ""
                                        })(
                                            <Input placeholder="" disabled={this.state.phone_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.phone_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickPhone} />
                                        {
                                            !this.state.phone_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(14)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="微信号" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
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
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.wechat_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickWeChat} />
                                        {
                                            !this.state.wechat_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(5)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="方便联系时间" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        {getFieldDecorator('contactTime', {
                                            initialValue: (customer && customer.contact_time != '' && customer.contact_time != 'Invalid date' && customer.contact_time != 'Invalid da') ? moment(customer.contact_time, 'YYYY-MM-DD') : undefined
                                        })(
                                            <DatePicker style={{ marginLeft: 8, width: '100%' }} disabled={this.state.contactTime_disabled} format={'YYYY-MM-DD'} />
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.contactTime_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickContactTime} />
                                        {
                                            !this.state.contactTime_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(100)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12}>
                                <FormItem style={{ float: "left", width: '80%' }} label="创建时间" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                    {getFieldDecorator('createTime', {
                                        initialValue: (customer && customer.create_time != '' && customer.create_time != 'Invalid date' && customer.create_time != 'Invalid da') ? moment(customer.create_time, 'YYYY-MM-DD') : undefined
                                    })(
                                        <DatePicker style={{ marginLeft: 8, width: '100%' }} disabled={true} format={'YYYY-MM-DD'} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem style={{ float: "left", width: '80%' }} label="创建人" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                    {getFieldDecorator('createUser', {
                                        initialValue: (customer && customer.create_user != '' && customer.create_user != null) ? customer.create_user : ""
                                    })(
                                        <AutoComplete placeholder="" disabled={true} style={{ marginLeft: 8 }} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="推荐人" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        {getFieldDecorator('referrerName', {
                                            initialValue: (customer && customer.referrer_name != '' && customer.referrer_name != null) ? customer.referrer_name : ""
                                        })(
                                            <AutoComplete placeholder="" disabled={this.state.referrerName_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.referrerName_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickReferrerName} />
                                        {
                                            !this.state.referrerName_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(100)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="推荐人手机" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        {getFieldDecorator('referrerPhone', {
                                            // rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                                            //     return event.target.value.replace(/\D/g, '')
                                            // },
                                            initialValue: (customer && customer.referrer_phone != '' && customer.referrer_phone != null) ? customer.referrer_phone : ""
                                        })(
                                            <Input placeholder="" disabled={this.state.referrerPhone_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.referrerPhone_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickReferrerPhone} />
                                        {
                                            !this.state.referrerPhone_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(100)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12} style={{ display: 'none' }}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="居住地址" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        <div style={{ marginLeft: 10 }}>
                                            {
                                                customer ? <AreaSelect
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
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.liveAddress_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 49 }} onClick={this.handleClickLiveAddress} />
                                        {
                                            !this.state.liveAddress_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 49 }} onClick={() => {
                                                this.handleCancel(6)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={12} style={{ display: 'none' }}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '80%' }} label="工作地址" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
                                        <div style={{ marginLeft: 10 }}>
                                            {
                                                customer ? <AreaSelect
                                                    reset={this.state.workRest}
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
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.workAddress_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 49 }} onClick={this.handleClickWorkAddress} />
                                        {
                                            !this.state.workAddress_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 49 }} onClick={() => {
                                                this.handleCancel(7)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col span={23}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '92%' }} label="婚期" labelCol={{ span: 2 }} wrapperCol={{ span: 21 }} >
                                        {getFieldDecorator('weddingDate', {
                                            initialValue: (customer && customer.wedding_date_from != undefined && customer.wedding_date_from != '' && customer.wedding_date_from != 'Invalid date' && customer.wedding_date_from != 'Invalid da' && customer.wedding_date_end != undefined && customer.wedding_date_end != '' && customer.wedding_date_end != 'Invalid date' && customer.wedding_date_end != 'Invalid da') ? [moment(customer.wedding_date_from, 'YYYY-MM-DD'), moment(customer.wedding_date_end, 'YYYY-MM-DD')] : undefined
                                        })(
                                            <RangePicker style={{ marginLeft: 8, width: '100%' }} disabled={this.state.weddingDate_disabled} format={'YYYY-MM-DD'} />
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer}>
                                        <Icon type={this.state.weddingDate_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginTop: 9 }} onClick={this.handleClickWeddingDate} />
                                        {
                                            !this.state.weddingDate_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(101)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col span={23}>
                                <div style={{ display: 'flex' }}>
                                    <FormItem style={{ float: "left", width: '92%' }} label="备注" labelCol={{ span: 2 }} wrapperCol={{ span: 21 }}>
                                        {getFieldDecorator('remark', {
                                            initialValue: customer ? customer.remark : undefined,
                                            rules: [{ required: true, message: '请填写备注' }],
                                        })(
                                            <AutoComplete placeholder="请输入" disabled={this.state.remark_disabled} style={{ marginLeft: 8 }} />
                                        )}
                                    </FormItem>
                                    <div hidden={isclaimFlag || isDistribute || !customeradapter_updatecustomer} >
                                        <Icon style={{ fontSize: 20, marginTop: 9 }} type={this.state.remark_disabled == true ? 'edit' : 'check'} onClick={this.handleClickRemark} />
                                        {
                                            !this.state.remark_disabled ? <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20, marginTop: 9 }} onClick={() => {
                                                this.handleCancel(15)
                                            }} /> : undefined
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div style={{ display: "none" }}>
                            <div className={styles.headerMaxTitle}>重点信息</div>
                            <Row>
                                <Col span={8}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="意向区域" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
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
                                <Col span={8}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="业务品类" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
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
                                <Col span={8}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="婚礼预算" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('budget', {
                                                initialValue: customer ? customer.budget : undefined
                                            })(
                                                <Input placeholder="请输入" autoComplete="off" style={{ marginLeft: 8 }} prefix="￥" disabled={this.state.budget_disabled} />
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.budget_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 30, marginTop: 9 }} onClick={this.handleClickBudget} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="婚礼风格" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('weddingStyle', {
                                                initialValue: customer ? customer.weddingStyle : undefined
                                            })(
                                                <Select placeholder="请选择" style={{ marginLeft: 8 }} disabled={this.state.weddingStyle_disabled} >
                                                    {
                                                        (config && config.weddingStyle) ? config.weddingStyle.map(style => (
                                                            <Option value={style.id}>{style.name}</Option>)) : null
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.weddingStyle_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 30, marginTop: 9 }} onClick={this.handleClickWeddingStyle} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="婚礼桌数" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
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
                                    <Icon type={this.state.deskNum_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 30, marginTop: 9 }} onClick={this.handleClickDeskNum} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="预定酒店" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                                            {getFieldDecorator('hotel', {
                                                initialValue: customer ? customer.hotel : undefined
                                            })(
                                                <AutoComplete placeholder="请输入" disabled={this.state.hotel_disabled} style={{ marginLeft: 8 }} />
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.hotel_disabled == true ? 'edit' : 'check'} style={{ fontSize: 20, marginLeft: 30, marginTop: 9 }} onClick={this.handleClickHotel} />
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <div style={{ float: "left", width: '100%' }}>
                                        <FormItem label="已定竞品" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                            {getFieldDecorator('bookTag', {
                                                rules: [{ required: false }],
                                                initialValue: options

                                            })(
                                                <Checkbox.Group style={{ marginLeft: 8 }} disabled={this.state.bookTag_disabled} onChange={this.onCategoryChange}>
                                                    {
                                                        config.category.map(category => (
                                                            <Checkbox value={category.id} >{category.name}</Checkbox>))
                                                    }
                                                </Checkbox.Group>,
                                            )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col span={2} hidden={isclaimFlag || isDistribute}>
                                    <Icon type={this.state.bookTag_disabled == true ? 'edit' : 'close'} style={{ fontSize: 20, marginLeft: 30, marginTop: 9 }} onClick={this.handleVisibleBookTagView} />
                                </Col>
                            </Row>
                            <SellerCategory
                                visible={!this.state.bookTag_disabled}
                                validate={this.handleClickBookTag}
                                checkCategorys={this.state.options}
                                bizContent={this.state.bizContentDefault} />
                        </div>
                    </Form>
                </Spin>
            </div >
        );
    };
}
export default Form.create<CustomerInfoProps>()(CustomerInfo);