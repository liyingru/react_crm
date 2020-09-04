import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model"

class HotelDefaultPreferential extends Component {
  // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /

  render() {
    const { data } = this.props;
    return (
      <div className={styles.contentViewStyle} style={{ width: '100%' }} >
        <div className={styles.detailCon}>
          <div className={styles.spanHeaderStyle}>
            <span className={styles.titleCon}>活动内容</span>
          </div>
          <section>
            <ul className={styles.sectionUl}>
              <li>
                <Row style={{ marginTop: '5px' }}>
                  {data?.coupon_type == '1' ? <Col span={12}><b>活动类型：</b>普通</Col> : <Col span={12}><b>活动类型：</b>到店礼</Col>}
                  <Col span={12}><b>活动标题：</b>{data?.name}</Col>
                </Row>
                <div style={{ wordBreak: 'break-all', marginTop: '5px' }}><b>活动时间：</b>{data?.valid_from} 到 {data?.valid_to}</div>
                <div style={{ wordBreak: 'break-all', marginTop: '5px' }}><b>活动详情：</b></div>
                <div style={{ wordBreak: 'break-all', marginTop: '5px' }} dangerouslySetInnerHTML={{ __html: data && data?.desc }} />
              </li>
            </ul>
          </section>
        </div>

      </div>
    );
  }
}

class DefaultPreferential extends Component {


  render() {
    const { data } = this.props;

    return (
      <div>

        <div className={styles.detailCon}>
          <div className={styles.spanHeaderStyle}>
            <span className={styles.titleCon}>活动信息</span>
          </div>
        </div>
        <ul className={styles.sectionUl}>
          <li>
            <div style={{ wordBreak: 'break-all', marginTop: '5px' }}><b>活动标题：</b>{data?.name}</div>
            <div style={{ wordBreak: 'break-all', marginTop: '5px' }}><b>活动时间：</b>{data?.valid_from} 到 {data?.valid_to}</div>

          </li>
        </ul>
      </div>
    );

  }
};



interface StoreDetailsPreferentialProps extends FormComponentProps {
  detailsId: string,
  // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /
  tab: number,

  dispatch: Dispatch<
    Action<
      | 'storeDetailList/storeCoupon'
    >
  >;
  loading: boolean;
  storeDetailList: StateType;
}

@connect(
  ({
    storeDetailList,
    loading,
  }: {
    storeDetailList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    storeDetailList,
    loading: loading.models.storeDetailList,
  }),
)

class StoreDetailsPreferential extends Component<StoreDetailsPreferentialProps>{

  constructor(props: StoreDetailsPreferentialProps) {
    super(props);
    this.state = {
      detailsId: 1,
    }
  }

  componentDidMount() {
    const { dispatch, detailsId, tab } = this.props;
    this.getDetailsRequest(tab, detailsId)
  }

  componentWillReceiveProps(nextProps) {
    const { detailsId } = this.state;
    if (detailsId !== nextProps.detailsId) {
      this.getDetailsRequest(nextProps.tab, nextProps.detailsId)
      this.setState({
        detailsId: nextProps.detailsId,
      })
    }

  }

  getDetailsRequest(tab: number, detailsId: string) {
    const { dispatch } = this.props;
    // if(detailsId == ''){ return }
    if (!detailsId) { return }
    let params = { "storeId": detailsId, "category": tab };
    dispatch({
      type: 'storeDetailList/storeCoupon',
      payload: params,
    });
  }

  render() {
    const { tab, storeDetailList: { storeCouponData } } = this.props;
    // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4: / 5:婚车 / 6:一站式 / 7:婚纱礼服 /

    if (tab == 1) {
      return (
        <HotelDefaultPreferential data={storeCouponData ? storeCouponData : {}} />

      );
    } else {
      return (
        <DefaultPreferential data={storeCouponData ? storeCouponData : {}} />

      );
    }

  }
}

export default StoreDetailsPreferential;
