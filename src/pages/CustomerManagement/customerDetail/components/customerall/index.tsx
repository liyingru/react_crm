import styles from "./index.less";
import { Component } from "react";
import React from "react";
import { CustomerDetail, RequirementData, RequirementBean, CityInfo } from "../../dxl/data";
import { Descriptions, Switch, Form, Modal, Input, message } from "antd";
import Table from "antd/es/table";
import getCategoryColumn from '../../../commondata'
import { ColumnProps } from "antd/lib/table";
import { formatCity } from "@/utils/utils";
import Axios from "axios";
import URL from '@/api/serverAPI.config';



const { TextArea } = Input;

export interface CustomerAllPros {
  showStyle: number;
  customerDetail: CustomerDetail;
  onRecommClick: (data: RequirementBean) => void;
};

const title = (title: string) => (<div className={styles.homeRequTitle}>{title}</div>);
class CustomerAll extends Component<CustomerAllPros>{


  column = [
    {
      title: '姓名',
      dataIndex: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'identityText',
    },
    {
      title: '联系号码',
      dataIndex: 'phone',
    },
    {
      title: '微信',
      dataIndex: 'weChat',
    },
    {
      title: '职业',
      dataIndex: 'occupation',
    },
    {
      title: '方便联系',
      dataIndex: 'contactTimeText',
    },
    {
      title: '备注',
      dataIndex: 'comment',
    },
  ];

  closeDescribe = (desc: string) => {
    Modal.info({
      title: '关闭说明',
      content: (
        <TextArea
          value={desc}
          disabled={true}
          rows={6}>
        </TextArea>
      ),
      centered: true,
      onOk() { },
    });
  }

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
    const { customerData } = this.props.customerDetail;
    Axios.post(URL.showPhone, { customerId: customerData.customerId }).then(
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

  generateReqList = (type: number) => {
    const { requirementData } = this.props.customerDetail;
    const { onRecommClick, showStyle } = this.props;
    let list: RequirementData[] = []
    if (type == 0) {
      list = requirementData.my
    } else {
      list = requirementData.other
    }
    if (list == undefined || list == null || list.length == 0) {
      return ''
    }
    return (
      <div>
        <div style={{ fontSize: 20, fontWeight: 'bold' }}>{type == 0 ? '我的建单' : '同事建单'}</div>
        {
          list.map(categorydata => {
            let data = getCategoryColumn<RequirementBean>(categorydata.category_id);
            data.columns.some(element => {
              if (element.dataIndex == 'city') {
                element['render'] = (text, recoder) => recoder.city_info.full;
                return true;
              }
              return false;
            })
            if (showStyle != 0) {
              if (type == 0) {
                let operate: ColumnProps<RequirementBean> = {
                  title: '操作',
                  key: 'action',
                  dataIndex: 'action',
                  fixed: 'right',
                  width: 60,
                  render: (text, recoder) => (
                    <span>
                      {
                        recoder.status != '0' ?
                          <a onClick={() => onRecommClick(recoder)}>推荐</a> : <a onClick={() => this.closeDescribe(recoder.remark)}>关闭说明</a>
                      }
                    </span>
                  )
                };
                data.columns.push(operate);
              }
            }

            return <Table
              size="small"
              title={() => title(data.category)}
              columns={data.columns}
              dataSource={categorydata.data}
              scroll={{ x: 'max-content' }}
              pagination={false} />
          })
        }
      </div>
    )
  }

  render() {
    const { customerData, contactUserData, requirementData } = this.props.customerDetail;
    const { showStyle } = this.props;
    return (
      <div>
        <div className={styles.itemtitle}>客户信息</div>
        <Descriptions column={2} style={{ marginTop: 10 }}>
          <Descriptions.Item label="客户id">{customerData.customerId}</Descriptions.Item>
          <Descriptions.Item label="客资来源">{customerData.channel}</Descriptions.Item>
          <Descriptions.Item label="客户姓名">{customerData.customerName}</Descriptions.Item>
          <Descriptions.Item label="性别">{customerData.genderText}</Descriptions.Item>
          <Descriptions.Item label="客户身份">{customerData.identityText}</Descriptions.Item>
          <Descriptions.Item label="婚期">{customerData.weddingDate}</Descriptions.Item>
          <Descriptions.Item label="手机号码">{customerData.phone}
            {
              showStyle == 0 ? '' :
                <a onClick={() => this.showPhone()} style={{ marginLeft: 5 }}>查看电话</a>
            }
          </Descriptions.Item>
          <Descriptions.Item label="微信号">{customerData.weChat}</Descriptions.Item>
          <Descriptions.Item label="居住地址">{this.generateAddress(customerData.liveCityInfo, customerData.liveAddress)}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{customerData.createTime}</Descriptions.Item>
          <Descriptions.Item label="工作地址">{this.generateAddress(customerData.workCityInfo, customerData.workAddress)}</Descriptions.Item>
          <Descriptions.Item label="创建人">{customerData.createUser}</Descriptions.Item>
          <Descriptions.Item label="方便联系时间">{customerData.contactTime}</Descriptions.Item>
          <Descriptions.Item label="推荐方">{customerData.referrerName}</Descriptions.Item>
        </Descriptions>

        <div className={styles.itemtitle}>联系人</div>
        <Table
          size='small'
          columns={this.column}
          dataSource={contactUserData}
          pagination={false}
        />

        <div className={styles.itemtitle}>客户需求</div>
        <Descriptions column={2} style={{ marginTop: 10 }}>
          <Descriptions.Item label="意向区域">{customerData.likeCityInfo != undefined ? customerData.likeCityInfo.full : ''}</Descriptions.Item>
          <Descriptions.Item label="业务品类">{customerData.category}</Descriptions.Item>
          <Descriptions.Item label="婚礼风格">{customerData.weddingStyleText}</Descriptions.Item>
          <Descriptions.Item label="婚礼预算">{customerData.budget}</Descriptions.Item>
          <Descriptions.Item label="婚礼桌数">{customerData.deskNum}</Descriptions.Item>
          <Descriptions.Item label="预订酒店">{customerData.hotel}</Descriptions.Item>
        </Descriptions>

        <div className={styles.itemtitle}>意向需求</div>
        {
          this.generateReqList(0)
        }
        {
          this.generateReqList(1)
        }
      </div>
    )
  }
};


export default CustomerAll;
