import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch, Fragment } from 'react';
import { Form, Table } from 'antd';
import { StateType } from '../../model';
import { Action } from 'redux';
import { connect } from 'dva';

interface FavoriteMerchantProps extends FormComponentProps {
  customerId: string;

  dispatch: Dispatch<
    Action<
      | 'leadManagementDetail/fetchContactInfo'
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

class FavoriteMerchant extends Component<FavoriteMerchantProps, ContactState> {
  state: ContactState = {
    modalVisible: false,
  }

  componentDidMount() {
    const { dispatch, customerId } = this.props;
    const params = {
      id: customerId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchContactInfo',
      payload: params,
    });
  }

  handleProductDetails = (record: any) => {

  }

  columns = [
    {
      title: '城市',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '区域',
      dataIndex: 'identityText',
      key: 'identityText',
    },
    {
      title: '收藏时间',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '业务品类',
      dataIndex: 'weChat',
      key: 'weChat',
    },
    {
      title: '收藏商家',
      dataIndex: 'occupation',
      key: 'occupation',
    },
    {
      title: '收藏产品',
      dataIndex: 'contactTimeText',
      key: 'contactTimeText',
    },
    {
      title: '产品价格',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '',
      dataIndex: 'comment',
      key: 'comment',
      render: (record: any) => {
        return (
          <Fragment>
            <a onClick={() => this.handleProductDetails(record)}>产品详情</a>
          </Fragment>
        )
      }
    },
  ]

  render() {
    const { loading, leadManagementDetail } = this.props;
    const { contacts } = leadManagementDetail;
    return (

      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        loading={loading}
        columns={this.columns}
        dataSource={contacts}
      />

    );
  };
}
export default Form.create<FavoriteMerchantProps>()(FavoriteMerchant);
