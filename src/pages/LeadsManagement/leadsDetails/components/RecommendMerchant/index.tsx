import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch, Fragment } from 'react';
import { Form, Table, Spin } from 'antd';
import { StateType } from '../../model';
import { Action } from 'redux';
import { connect } from 'dva';
import styles from "./style.less";
import { RecommendMerchantData, MerchantData } from '../../data';

interface RecommendMerchantProps extends FormComponentProps {
  customerId: string;
  dispatch: Dispatch<
    Action<
      | 'leadManagementDetail/fetchRecommendMerchant'
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

class RecommendMerchant extends Component<RecommendMerchantProps, ContactState> {

  constructor(props: RecommendMerchantProps) {
    super(props);
  }
  // state: ContactState = {

  // }

  componentDidMount() {
    const { dispatch, customerId } = this.props;
    const params = {
      customerId: customerId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchRecommendMerchant',
      payload: params,
    });
  }

  columns = [
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '区域',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: '商家名称',
      dataIndex: 'merchant',
      key: 'merchant',
    },
    {
      title: '推荐等级',
      dataIndex: 'recommend_level',
      key: 'recommend_level',
    },
    {
      title: '商家特色',
      dataIndex: 'features',
      key: 'features',
    },
    {
      title: '价格范围',
      dataIndex: 'price_range',
      key: 'price_range',
    },
    {
      title: '推荐人',
      dataIndex: 'recommend_name',
      key: 'recommend_name',
    },
    {
      title: '推荐时间',
      dataIndex: 'recommend_time',
      key: 'recommend_time',
    },
  ]


  renderTables(name: string, datas: MerchantData[]) {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => name}
        columns={this.columns}
        dataSource={datas} />
    );
  }

  renderCategory(data: RecommendMerchantData) {
    return (
      <div>
        {this.renderTables(data.category_name, data.data)}
      </div>
    );
  }

  render() {
    const { loading, leadManagementDetail } = this.props;
    const { recommendMerchant } = leadManagementDetail;
    return (
      <div>
        <Spin spinning={loading}>
          {
            recommendMerchant ? recommendMerchant.map(data => (
              this.renderCategory(data)
            )) : null
          }
        </Spin>
      </div>
    );
  };
}
export default Form.create<RecommendMerchantProps>()(RecommendMerchant);
