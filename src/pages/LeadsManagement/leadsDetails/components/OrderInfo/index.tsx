import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch, Fragment } from 'react';
import { Form, Table } from 'antd';
import { StateType } from '../../model';
import { Action } from 'redux';
import { connect } from 'dva';

interface OrderInfoProps extends FormComponentProps {
  customerId: string;

  dispatch: Dispatch<
    Action<
      | 'leadManagementDetail/fetchOrderList'
    >
  >;
  loading: boolean;
  leadManagementDetail: StateType;
}

interface ContactState {

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

class OrderInfo extends Component<OrderInfoProps, ContactState> {
  state: ContactState = {

  }

  componentDidMount() {
    const { dispatch, customerId } = this.props;
    const params = {
      customerId: customerId,
      pageSize:'1000',
    };
    dispatch({
      type: 'leadManagementDetail/fetchOrderList',
      payload: params,
    });
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
    const { loading, leadManagementDetail } = this.props;
    // const { orderList } = leadManagementDetail;
    console.log(leadManagementDetail)
    return (

      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        // loading={loading}
        columns={this.columns}
        dataSource={leadManagementDetail?.orderList}
      />

    );
  };
}
export default Form.create<OrderInfoProps>()(OrderInfo);
