import React, { Component } from 'react';
import styles from './index.less';
import { Descriptions, message, Modal } from "antd";
import { CustomerData, CityInfo, configData } from '../../data';
import URL from '@/api/serverAPI.config';
import CrmUtil from '@/utils/UserInfoStorage';
import Axios from "axios";
import CrmInfos, { InfoItemType } from '@/components/CrmInfosTabPanel';


interface orderCustomerInfoProps {
    config: configData,
    customerData: CustomerData
}

class OrderDetailsCustomerInfo extends Component<orderCustomerInfoProps>{
    // {/* <Descriptions.Item label="客户编号">{customerData && customerData.customer_id}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && customerData.customer_name}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && customerData.gender_text}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && customerData.}</Descriptions.Item>
    //     <Descriptions.Item label="">{channelTxt}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && customerData.phone}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && customerData.}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && this.generateAddress(customerData.live_city_info, customerData.live_address)}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && this.generateAddress(customerData.work_city_info, customerData.work_address)}</Descriptions.Item>
    //     <Descriptions.Item label="">{customerData && customerData.contact_time}</Descriptions.Item> */}
    infoItems: InfoItemType<CustomerData>[] = [
        {
            name: '客户编号',
            index: 'customer_id',
        }, {
            name: '客户姓名',
            index: 'customer_name'
        }, {
            name: '性别',
            index: 'gender_text'
        }, {
            name: '客户身份',
            index: 'identity_text'
        }, {
            name: '客资来源',
            renderText: record => {
                const { config } = this.props;
                let channelTxt = '';
                if (config.channel && config.channel.length > 0) {
                    this.channelsConfig = [];
                    for (let i = 0; i < config.channel.length; i++) {
                        const c = config.channel[i];
                        this.channelsConfig.push(config.channel[i])
                        if (c.children && c.children.length > 0) {
                            c.children.map(child => this.channelsConfig.push(child));
                        }
                    }

                    if (record && record.channel) {
                        const channelIds: string[] = record.channel.split(',');
                        channelIds.map(id => {
                            const channelArr = this.channelsConfig.filter(item => item.value + "" == id + "");
                            if (channelArr && channelArr.length > 0) {
                                channelTxt = `${channelTxt},${channelArr[0].label}`;
                            }
                        })
                        if (channelTxt.length > 0) {
                            channelTxt = channelTxt.substr(1);
                        }
                    }
                }
                return channelTxt;
            },
            index: 'channel'
        }, {
            name: '手机号码',
            index: 'phone'
        }, {
            name: '微信号',
            index: 'wechat'
        }, {
            name: '居住地址',
            index: 'identity_text',
            renderText: record => this.generateAddress(record.live_city_info, record.live_address)
        }, {
            name: '工作地址',
            index: 'identity_text',
            renderText: record => this.generateAddress(record.work_city_info, record.work_address)
        }, {
            name: '方便联系',
            index: 'contact_time'
        }, {
            name: "创建人",
            index: "create_user"
        }
    ]

    generateAddress = (cityInfo?: CityInfo, address: string = '') => {
        if (cityInfo) {
            if (cityInfo.full) {
                return cityInfo.full + address
            }
            return address
        }
        return ''
    }

    showPhone = () => {
        const { customerData } = this.props;
        Axios.post(URL.showPhone, { customerId: customerData.customer_id }).then(
            res => {
                if (res.code == 200) {
                    this.showPhoneDialog(res.data.result.phone)
                }
            }
        );
    }

    showPhoneDialog = (message: string) => {
        Modal.info({
            title: '电话号码',
            centered: true,
            content: (
                <div>{message}</div>
            ),
            onOk() { },
        });
    }

    channelsConfig: any[] = [];

    render() {
        const actualInfos = [
            ...this.infoItems
        ]
        if (CrmUtil.getCompanyType()) {
            actualInfos.push({ name: "推荐人", index: "referrer_name" });
            actualInfos.push({ name: "推荐人手机", index: "referrer_phone" });
        } else if (CrmUtil.getCompanyType() == 2) {
            actualInfos.push({ name: "提供人", index: "record_user_name" });
        }

        return <MyInfos
            data={this.props.customerData}
            infoItems={actualInfos}
            requestUpdateInfo={() => { }}
        />

        const { config, customerData } = this.props;

        let channelTxt = '';
        if (config.channel && config.channel.length > 0) {
            this.channelsConfig = [];
            for (let i = 0; i < config.channel.length; i++) {
                const c = config.channel[i];
                this.channelsConfig.push(config.channel[i])
                if (c.children && c.children.length > 0) {
                    c.children.map(child => this.channelsConfig.push(child));
                }
            }

            if (customerData && customerData.channel) {
                const channelIds: string[] = customerData.channel.split(',');
                channelIds.map(id => {
                    const channelArr = this.channelsConfig.filter(item => item.value + "" == id + "");
                    if (channelArr && channelArr.length > 0) {
                        channelTxt = `${channelTxt},${channelArr[0].label}`;
                    }
                })
                if (channelTxt.length > 0) {
                    channelTxt = channelTxt.substr(1);
                }
            }
        }

        return (
            <div>
                <Descriptions column={1} style={{ marginTop: 10 }}>
                    <Descriptions.Item label="客户编号">{customerData && customerData.customer_id}</Descriptions.Item>
                    <Descriptions.Item label="客户姓名">{customerData && customerData.customer_name}</Descriptions.Item>
                    <Descriptions.Item label="性别">{customerData && customerData.gender_text}</Descriptions.Item>
                    <Descriptions.Item label="客户身份">{customerData && customerData.identity_text}</Descriptions.Item>
                    <Descriptions.Item label="客资来源">{channelTxt}</Descriptions.Item>
                    <Descriptions.Item label="手机号码">{customerData && customerData.phone}</Descriptions.Item>
                    <Descriptions.Item label="微信号">{customerData && customerData.wechat}</Descriptions.Item>
                    <Descriptions.Item label="居住地址">{customerData && this.generateAddress(customerData.live_city_info, customerData.live_address)}</Descriptions.Item>
                    <Descriptions.Item label="工作地址">{customerData && this.generateAddress(customerData.work_city_info, customerData.work_address)}</Descriptions.Item>
                    <Descriptions.Item label="方便联系">{customerData && customerData.contact_time}</Descriptions.Item>
                    <Descriptions.Item label="创建人">{customerData && customerData.create_user}</Descriptions.Item>
                    {
                        //到喜啦显示提供人（字段不一样）
                        CrmUtil.getCompanyType() == 1 ?
                            <div>
                                <Descriptions.Item label="推荐人">{customerData && customerData.referrer_name}</Descriptions.Item>
                                <Descriptions.Item label="推荐人手机">{customerData && customerData.referrer_phone}</Descriptions.Item>
                            </div>
                            //北京显示提供人（字段不一样）
                            : CrmUtil.getCompanyType() == 2 ?
                                <Descriptions.Item label="提供人">{customerData && customerData.record_user_name}</Descriptions.Item>
                                : null
                    }
                </Descriptions>

            </div>

        );
    };
}

class MyInfos extends CrmInfos<CustomerData> { };
export default OrderDetailsCustomerInfo;