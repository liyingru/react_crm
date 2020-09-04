import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Button, message } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model"


interface StoreDetailsContactListProps extends FormComponentProps {
  detailsId: string,
  // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /
  tab: number,

  dispatch: Dispatch<
    // Action<
    //   | 'storeDetailList/storeContact'
    //   | 'storeDetailList/moorPhoneDialoutCtrl'
    // >
    Action<any>

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
class StoreDetailsContactList extends Component<StoreDetailsContactListProps>{

  constructor(props: StoreDetailsContactListProps) {
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
    // console.log(detailsId)
    // console.log(nextProps.detailsId)
    if (detailsId !== nextProps.detailsId) {
      this.getDetailsRequest(nextProps.tab, nextProps.detailsId)
      this.setState({
        detailsId: nextProps.detailsId,
      })
    }
  }
  callPhoneCtrl = (tel: any, id: any) => {
    const { detailsId } = this.state;
    const { dispatch,tab } = this.props;
    if (!detailsId) { return }
    let params = { phone: tel, id: id, type: 'merchant',categoryId:tab };
    dispatch({
      type: 'storeDetailList/moorPhoneDialoutCtrl',
      payload: params,
      callback: (data: any) => {
        if (data.code == 200) {
          message.success('外呼成功')
        }
      }
    })
  }

  getDetailsRequest(tab: number, detailsId: string) {
    const { dispatch } = this.props;
    // if(detailsId == ''){ return }
    if (!detailsId) { return }
    let params = { "storeId": detailsId, "category": tab };
    dispatch({
      type: 'storeDetailList/storeContact',
      payload: params
    })
  }

  render() {
    const { tab, storeDetailList: { newCategoryDetailContactListData } } = this.props;
    // console.log(newCategoryDetailContactListData)
    // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /
    // const { temp } = this.state;
    return (
      <div className={styles.contentViewStyle}>

        <div className={styles.detailCon}>
          <div className={styles.spanHeaderStyle}>
            <span className={styles.titleCon}>联系人信息</span>
          </div>

          {newCategoryDetailContactListData && newCategoryDetailContactListData.map((item) => {
            if (tab == 1) {
              // 婚宴
              return (
                <div>
                  <div style={{ width: "100%", height: '40px', fontSize: '20px', fontWeight: 'bolder', marginTop: '10px' }}>
                    {item?.name}
                  </div>
                  <section>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>角色：</b>{item?.role}</Col>
                          <Col span={12}><b>财务角色：</b>{item?.role_finance}</Col>
                        </Row>
                        <Row style={{ marginRight: '5px' }}>
                          <Col span={12}><b>部门：</b>{item?.dept}</Col>
                          <Col span={12}><b>职位：</b>{item?.title}</Col>
                        </Row>
                        <Row style={{ marginRight: '5px' }}>
                          <Col span={12}>
                            <b>常用手机：</b><a onClick={() => { this.callPhoneCtrl(item?.encrypt_mobile, item?.id) }}>{item?.mobile}</a>
                          </Col>
                          {
                            item.tels && item.tels.length > 0 && item.tels.map((item:any,index:number) => (
                              <Col span={12} >
                                <b>座机{index+1}：</b>
                                <a style={{ wordWrap: 'break-word' }} onClick={() => { this.callPhoneCtrl(item.encrypt_tel, item?.id) }}>{item.tel}</a>
                              </Col>
                            ))
                          }

                        </Row>

                      </li>
                    </ul>
                  </section>
                  <Divider />
                </div>
              );
            } else {
              return (
                <div>

                  <div style={{ display: 'flex', width: "100%", height: '40px', marginTop: '10px', verticalAlign: 'bottom', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                      {item?.name}
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                      {item?.role}
                    </div>
                  </div>

                  <section>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}>
                            <b>手机：</b><a onClick={() => { this.callPhoneCtrl(item?.encrypt_mobile, item?.id) }}>{item?.mobile}</a>
                          </Col>
                          <Col span={12}>
                            <b>备用手机：</b><a onClick={() => { this.callPhoneCtrl(item?.encrypt_mobile2, item?.id) }}>{item?.mobile2}</a>
                          </Col>
                        </Row>
                        <Row style={{ marginRight: '5px' }}>
                          <Col span={12}>
                            <b>电话：</b><a onClick={() => { this.callPhoneCtrl(item?.encrypt_tel1, item?.id) }}>{item?.tel1}</a>

                          </Col>
                          <Col span={12}>
                            <b>备用电话：</b><a onClick={() => { this.callPhoneCtrl(item?.encrypt_tel2, item?.id) }}>{item?.tel2}</a>
                          </Col>
                        </Row>
                        <Row style={{ marginRight: '5px' }}>
                          <Col span={12}><b>邮箱：</b>{item?.email ? item?.email : ''}</Col>
                        </Row>
                        <Row style={{ marginRight: '5px' }}>
                          <Col span={12}><b>备注：</b>{item?.comment}</Col>
                        </Row>

                      </li>
                    </ul>
                  </section>
                  <Divider />
                </div>
              );
            }

          })}

        </div>
      </div>
    );
  }
}

export default StoreDetailsContactList;
