import { CustomerInfoData, OrderData } from '@/pages/LeadsManagement/leadsDetails/data';
import { Form, Table } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

interface OrderInfoProps extends FormComponentProps {
  loading: boolean;
  customer: CustomerInfoData;
  orderList: OrderData[];
  fun_fetchOrderList: Function;
}

interface ContactState {

}

class OrderInfo extends Component<OrderInfoProps, ContactState> {
  state: ContactState = {

  }

  componentDidMount() {
    
  }

  handleProductDetails = (record: any) => {

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
    const { loading, orderList } = this.props;
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        loading={loading}
        columns={this.columns}
        dataSource={orderList}
      />
    );
  };
}
export default Form.create<OrderInfoProps>()(OrderInfo);
