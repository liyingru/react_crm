import React, { Component } from 'react';
import { Timeline, Icon, Divider, Card, Avatar, Button, Tabs } from "antd";
import { FormComponentProps } from 'antd/es/form';
import PicBrowser from '@/components/PicBrowser';
import styles from "./index.less";
import ShowAddNewDynamic from "../OrderDetailsShowAddNewDynamic"
import { FollowListItem, followDataModel } from '../../data';
import LOCAL from '@/utils/LocalStorageKeys';
import CrmUtil from '@/utils/UserInfoStorage';
import { EditOutlined } from '@ant-design/icons';


interface followProps extends FormComponentProps {
  followList: FollowListItem[],
  followData: FollowDataModel,
  showAddNewDynamicFunction: Function,
  getFollowFounction: Function
}

class followView extends Component<followProps> {
  constructor(props: any) {
    super(props);
    // 初始化
    this.state = {
      tabIndex: 0,
      currentUserInfo: undefined,

    }
  }

  componentDidMount() {
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    if (currentUserInfoStr) {
      var tempCurrentUserInfo = JSON.parse(currentUserInfoStr);
      this.setState({
        currentUserInfo: tempCurrentUserInfo,
      })
    }
  }

  // 动态点击
  autoTabOnChange = (e) => {
    // showStyle == 0 是 客户 其他是有效单子
    console.log(e)
    const { getFollowFounction, followData } = this.props;
    let item = followData.followTab[e]
    if (item) {
      getFollowFounction(item.key)
    } else {
      getFollowFounction('1')
    }
    this.setState({
      tabIndex: e
    })
  }


  render() {
    const { followList, showAddNewDynamicFunction, followData } = this.props;
    const { TabPane } = Tabs;
    return (
      <div style={{ backgroundColor: 'white' }}>
        <div className={styles.headerViewStyle}>
          <div className={styles.titleFontStyle}>
            销售动态
      </div>
          <div className={styles.headerButtomStyle}>
            {followData && followData?.showFollowButton == 1 && CrmUtil.getCompanyType() != 2 && <Button type="primary" onClick={showAddNewDynamicFunction}><EditOutlined />录跟进</Button>}
          </div>
        </div>
        <Tabs activeKey={this?.state?.tabIndex.toString()} type="card" onChange={this.autoTabOnChange}>
          {followData && followData?.followTab?.map((item, index) => {
            return (<TabPane tab={item?.val} key={index.toString()}></TabPane>);
          })}
        </Tabs>
        <div style={{ paddingTop: 20, padding: 10, maxHeight: 700, overflowY: 'auto' }} id="components-timeline-demo-custom">
          <Timeline>
            {followList && followList.map(item => (
              <Timeline.Item dot={<Icon type="clock-circle" />} >
                <div style={{ paddingBottom: 10 }}>{item.followTime}</div>
                <Card style={{ borderRadius: 5 }}>
                  <div className={styles.headerViewStyle}>
                    <div className={styles.headerViewStyle}>
                      <div style={{ paddingLeft: 10, fontSize: 15, fontWeight: 'bold' }}>{item.followUser}</div>
                      <div style={{ marginLeft: 10, fontSize: 15, fontWeight: 'bold' }}>·</div>
                      <div style={{ paddingLeft: 10, fontSize: 15, fontWeight: 'bold' }}>{item.results}</div>
                    </div>
                  </div>
                  {item.contactWay != undefined && item.contactWay != '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
                    {CrmUtil.getCompanyType() == 1 ? '联系方式：' : '跟进方式：'}{item.contactWay}
                  </div> : <div />}
                  {item.followTag != undefined && item.followTag != '' ?
                    <div style={{ marginTop: 15, marginLeft: 10 }}>
                      {CrmUtil.getCompanyType() == 1 ? '呼叫结果：' : '跟进标签：'}{item.followTag}
                    </div> : <div />}
                  {item.state != undefined && item.state != '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
                    跟进状态：{item.state}
                  </div> : <div />}
                  {item.productName != undefined && item.productName != '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
                    有效意向产品：{item.productName}
                  </div> : <div />}
                  {item.couponName != undefined && item.couponName != '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
                    有效优惠活动：{item.couponName}
                  </div> : <div />}
                  {item.arrivalTime != undefined && item.arrivalTime != '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
                    预约时间：{item.arrivalTime}
                  </div> : <div />}
                  {item.nextContactTime != undefined && item.nextContactTime != '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
                    下次回访时间：{item.nextContactTime}
                  </div> : <div />}
                  <div style={{ marginTop: 15, marginLeft: 10 }}>
                    {item.comment == '' ? '未填写' : item.comment}
                  </div>
                  <div>
                    {item && Object.prototype.toString.call(item?.attachment) === '[object Array]' && (item.attachment ?
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {
                          item?.attachment && item?.attachment?.map((img) => {
                            return (<div style={{ marginLeft: 10, marginTop: 10 }}><PicBrowser wt={25} ht={25} imgSrc={img} /></div>
                            );
                          })
                        }
                      </div>
                      :
                      <span />)}
                  </div>
                  <div />
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    );
  }
}

export default followView;