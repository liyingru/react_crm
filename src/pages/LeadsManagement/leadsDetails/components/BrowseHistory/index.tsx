import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch } from 'react';
import { Form, Table } from 'antd';
import { StateType } from '../../model';
import { Action } from 'redux';
import { connect } from 'dva';

interface BrowseHistoryProps extends FormComponentProps {
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

class BrowseHistory extends Component<BrowseHistoryProps, ContactState> {
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

  columns = [
    {
      title: '需求类型',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '城市',
      dataIndex: 'identityText',
      key: 'identityText',
    },
    {
      title: '区域',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '商户',
      dataIndex: 'weChat',
      key: 'weChat',
    },
    {
      title: '职业',
      dataIndex: 'occupation',
      key: 'occupation',
    },
    {
      title: '产品',
      dataIndex: 'contactTimeText',
      key: 'contactTimeText',
    },
    {
      title: '价格',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '浏览日期',
      dataIndex: 'comment',
      key: 'comment',
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
export default Form.create<BrowseHistoryProps>()(BrowseHistory);
