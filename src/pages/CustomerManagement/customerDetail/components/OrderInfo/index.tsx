import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch, Fragment } from 'react';
import { Form, Table, message } from 'antd';
import { StateType } from '../../dxl/model';
import { Action } from 'redux';
import { connect } from 'dva';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { OrderData } from '@/pages/LeadsManagement/leadsDetails/data';

interface OrderInfoProps extends FormComponentProps {
  loading: boolean;
  customerId: string;
  from?: string;
  onRef: (ref: any) => void;
  columns?: {
    title: string,
    dataIndex: string,
    key: string,
  }[];
}

interface OrderInfoState {
  orderList: OrderData[];
}

class OrderInfo extends Component<OrderInfoProps, OrderInfoState> {

  constructor(props: Readonly<OrderInfoProps>) {
    super(props)
    this.props.onRef(this)
  }

  state: OrderInfoState = {
    orderList: [],
  }

  componentDidMount() {
    this.requstData()
  }

  handleProductDetails = (record: any) => {

  }

  requstData = () => {
    const { customerId, from } = this.props;
    if (!customerId) {
      return;
    }
    const params = {
      customerId: customerId,
      page: 1,
      pageSize: '1000',
      from,
    };
    Axios.post(URL.orderList, params).then(
      res => {
        if (res.code == 200) {
          this.setState({
            orderList: res.data.result.rows
          })
        }
      }).catch(error => {
      }
      )
  }

  columns = [
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '订单编号',
      dataIndex: 'order_num',
      key: 'order_num',
    },
    {
      title: '订单状态',
      dataIndex: 'status_txt',
      key: 'status_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'category_txt',
      key: 'category_txt',
    },
    {
      title: '城市',
      dataIndex: 'merchant_city',
      key: 'merchant_city',
    },
    {
      title: '区域',
      dataIndex: 'merchant_district',
      key: 'merchant_district',
    },
    {
      title: '商家',
      dataIndex: 'merchant',
      key: 'merchant',
    },
    {
      title: '商家回执',
      dataIndex: 'receipt',
      key: 'receipt',
    },
    {
      title: '签单金额',
      dataIndex: 'amount',
      key: 'amount',
    },
  ]

  render() {
    const { loading, columns } = this.props;
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"small"}
        pagination={false}
        loading={loading}
        columns={columns ? columns : this.columns}
        dataSource={this.state.orderList}
      />

    );
  };
}
export default Form.create<OrderInfoProps>()(OrderInfo);
