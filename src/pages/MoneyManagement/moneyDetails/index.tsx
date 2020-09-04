import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { Spin, Form, Col, Row,Tabs, Card, message } from 'antd';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { connect } from 'dva';
import MoneyInfo from './components/moneyInfo'
import CustomerInfo from './components/customerinfo';
import OrderInfo from './components/OrderInfo';
import SummaryInfo from './components/summaryInfo';
import ContractInfo from './components/contractInfo';
import { StateType } from './model';
import styles from './index.less';
import {SummaryData} from './data'

const { TabPane } = Tabs;

interface DetailsProps extends FormComponentProps {
  dispatch: Dispatch<
  Action<
    | 'moneydetailMangement/config'
    | 'moneydetailMangement/getMoneyDetail'
    >
  >;
  loading: boolean;
  moneydetailMangement: StateType;
}

interface DetailsState {
  id:string
}

@connect(
  ({
    moneydetailMangement,
    loading,
  }: {
    moneydetailMangement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    moneydetailMangement,
    loading: loading.models.moneydetailMangement,
  }),
)

class MoneyDetails extends Component<DetailsProps,DetailsState> {
  state = {
    id:''
  }

  componentDidMount() {
    this.getOrderDetailsFunction()
  }

  getOrderDetailsFunction = () => {
    const { dispatch } = this.props;
    let id;
    if (this.props.location.state) {
      id = this.props.location.state.id;
    }

    this.setState({
      id
    })

    dispatch({
      type: 'moneydetailMangement/config'
    })

    if (!id) {
      const currentUrl = window.location.href;
      if (currentUrl.indexOf("id=") > 0) {
        id = currentUrl.substr(currentUrl.lastIndexOf("=") + 1);
      }
    }
    if(id){
      dispatch({
        type: 'moneydetailMangement/getMoneyDetail',
        payload: {
          orderId:id,
          // isSummary:1
        }
      })
    }
  }

  
  updateSummaryInfo = (params: SummaryData, callback: () => void) => {
    Axios.post(URL.editReceivablesRecord, {
      receiptNum:params.receipt_num,
      id:this.state.id
    }).then(
      res => {
        if (res.code == 200) {
          callback();
          message.success('操作成功');
          this.fetchSummaryDetail();
        }
      })
  }

  fetchSummaryDetail = () => {
    const { dispatch } = this.props;
    const params = {
      orderId: this.state.id,
      // isSummary:1
    }
    dispatch({
      type: 'moneydetailMangement/getMoneyDetail',
      payload: params
    });
  }


  render() {
    const {
      moneydetailMangement: { moneyDetail:{receivablesInfo,orderInfo,customerInfo,summaryInfo,contractInfo},configData},
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper title={'结算详情       '+orderInfo.order_num}>
        <Spin spinning={!!loading}>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
              <Card bordered={false}>
                <div className={styles.toolbarwrapper}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                      <span style={{ fontWeight: "bold", fontSize: 20 }}>{customerInfo.customer_name}</span>
                      <span>
                            <span style={{ marginLeft: 30, marginRight: 10 }}>负责客服 :</span>
                            <span>{orderInfo.kefu}</span>
                            <span style={{ marginLeft: 50, marginRight: 10 }}>负责销售 :</span>
                            <span>{orderInfo.order_owner_name}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 24 }} style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card bordered={false}>
                <Tabs type="card" style={{ marginTop: 15 }}>
                  <TabPane tab="回款信息" key="1">
                    <MoneyInfo  receivablesInfo={receivablesInfo} />
                  </TabPane>
                  <TabPane tab="客户信息" key="2">
                    <CustomerInfo customerData={customerInfo} config={configData}/>
                  </TabPane>
                  <TabPane tab="订单信息" key="3">
                    <OrderInfo orderInfo={orderInfo} loading={this.props.loading} />
                  </TabPane>
                  <TabPane tab="合同信息" key="4">
                    <ContractInfo contractInfo={contractInfo} />
                  </TabPane>
                  <TabPane tab="结算信息" key="5">
                    <SummaryInfo summaryInfo={summaryInfo} onChange={this.updateSummaryInfo}/>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Spin>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<DetailsProps>()(MoneyDetails);

