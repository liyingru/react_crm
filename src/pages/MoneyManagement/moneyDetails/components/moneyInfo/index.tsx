import React, { Component } from "react";

import { Form,Table,Divider } from "antd";
import { FormComponentProps } from "antd/es/form";
import ReactZmage from 'react-zmage';
import styles from "./index.less"
import { receivablesInfo } from "../../data";

export interface MoneyInfoPros extends FormComponentProps {
  receivablesInfo: Partial<receivablesInfo>;
}

export interface MoneyInfoState {
}

class MoneyInfo extends Component<MoneyInfoPros, MoneyInfoState>{

  state: MoneyInfoState = {
  }
  render() {
    const defaultConfig = {
      backdrop: 'rgba(95, 95, 95, .48)',
    };
    const columns = [
      {
          title: '回款日期',
          dataIndex: 'receivables_date',
          key: 'receivables_date',
      },
      {
          title: '回款金额',
          dataIndex: 'money_txt',
          key: 'money_txt',
      },
      {
          title: '付款方式',
          dataIndex: 'payment_mode_txt',
          key: 'payment_mode_txt',
      },
      {
          title: '回款类型',
          dataIndex: 'receivables_type_txt',
          key: 'receivables_type_txt',
      },
      {
          title: '回款销售',
          dataIndex: 'payee_txt',
          key: 'payee_txt',
      },
      {
          title: '支付凭证',
          dataIndex: 'payment_voucher',
          key: 'payment_voucher',
          render:(text,record) => (
            <div className={styles.pic}>
              <ReactZmage src={record.payment_voucher} {...defaultConfig} />
            </div>
          )
      },
      {
          title: '状态',
          dataIndex: 'check_status_txt',
          key: 'check_status_txt',
      },{
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
      }
    ];
    const { receivablesInfo } = this.props;
    // const attrs = [{
    //   name: '回款时间：',
    //   value: receivablesInfo.receivables_date
    // }, {
    //   name: '回款状态：',
    //   value: receivablesInfo.receivables_status
    // }, {
    //   name: '回款计划：',
    //   value: receivablesInfo.number
    // }, {
    //   name: '回款金额：',
    //   value: receivablesInfo.money
    // }, {
    //   name: '订单金额：',
    //   value: receivablesInfo.order_amount
    // }, {
    //   name: '合同金额：',
    //   value: receivablesInfo.contract_amount
    // }, {
    //   name: '付款方式：',
    //   value: receivablesInfo.payment_mode
    // }, {
    //   name: '汇款名称：',
    //   value: receivablesInfo.payment_user
    // }, {
    //   name: '汇款账户号：',
    //   value: receivablesInfo.payment_account
    // }, {
    //   name: '汇款凭证：',
    //   value: receivablesInfo.payment_voucher
    // }, {
    //   name: '回款说明：',
    //   value: receivablesInfo.remark
    // }]
    console.log(receivablesInfo.plans,'---receivablesInfo')
    return (
      <div className={styles.container}>
        <h4>合同编号: {receivablesInfo.title}</h4>
        {
          receivablesInfo && receivablesInfo.plans && receivablesInfo.plans.map((item,index)=>{
            return <>
              <div className={styles.content} key={index}>
                <div className={styles.header_top}>
                  <div>{item.title}</div>
                  <div>计划回款日期：{item.plan_receivables_date}</div>
                  <div>计划回款金额：{item.plan_receivables_money}</div>
                  <div>已回款金额：{item.already_receivables_money}</div>
                  <div>未回款金额：{item.overdue_no_receivables_money}</div>
                  <div style={{color:"red"}}>逾期未回款金额：{item.no_receivables_money}</div>
                </div>
                <Table dataSource={item && item.list} columns={columns}/>
              </div>
              <Divider />
              </>
          })
        }
        {/* <Table dataSource={receivablesInfo.plans} columns={columns} />; */}
        {/* <ul className={styles.ullist}>
          {
            attrs.map(item => {
              if (item.name == '汇款凭证：') {
                return <li>
                  <span>{item.name}</span>
                  <div className={styles.pic}>
                    {item.value && item.value.map(pic => <ReactZmage src={pic} {...defaultConfig} />)}
                  </div>
                </li>
              }
              return <li><span>{item.name}</span><span>{item.value}</span></li>
            })
          }
        </ul> */}
      </div>
    )
  }
}

export default Form.create<MoneyInfoPros>()(MoneyInfo)
