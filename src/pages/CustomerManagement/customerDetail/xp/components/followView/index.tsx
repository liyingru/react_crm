/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import styles from "./index.less";
import { Timeline, Icon, Card, Button, Tabs, Empty } from "antd";
import { FormComponentProps } from 'antd/es/form';
import { FollowListItem, CustomerData, FollowData } from '../../dxl/data';
import PicBrowser from '@/components/PicBrowser';
import CrmUtil from '@/utils/UserInfoStorage';
import { UserInfo } from '@/pages/user/login/data';
import { EditOutlined } from '@ant-design/icons';


interface FollowState {
  tabIndex: number;
  currentUserInfo: UserInfo | undefined;
}
interface FollowProps extends FormComponentProps {
  //  1：需求（线索），2：邀约（有效单），3：订单（订单）, 4：提供人（现在没有跟进面板）  10: 客户BI列表(现在没有跟进面板)
  showStyle?: number,
  followList: FollowListItem[],
  customerData: CustomerData,
  followData: FollowData,
  showAddNewDynamicFunction: Function,
  getFollowFounction: Function
}

class FollowView extends Component<FollowProps, FollowState> {

  constructor(props: FollowProps) {
    super(props);

    this.state = {
      tabIndex: 0,
      currentUserInfo: undefined,
    }
  }

  componentDidMount() {
    const currentUserInfo = CrmUtil.getUserInfo();
    this.setState({
      currentUserInfo,
    })
  }

  tabOnChange = (e: any) => {
    // showStyle == 0 是 客户 其他是有效单子
    const { getFollowFounction, showStyle } = this.props;
    getFollowFounction(e, showStyle, false)
  }

  // 动态点击
  autoTabOnChange = (e: any) => {

    const { getFollowFounction, showStyle, followData } = this.props;
    const item = followData.followTab[e]
    if (item) {
      getFollowFounction(item.key, showStyle, false)
    } else {
      getFollowFounction('1', showStyle, false)
    }
    this.setState({
      tabIndex: e
    })
  }

  // 返回跟进按钮
  getFollowButton = () => {
    const { showAddNewDynamicFunction, showStyle, followData: { showFollowButton } } = this.props;
    if (showStyle !== 10 && showStyle !== 4) {
      if (showFollowButton === 1) {
        return (<Button type="primary" onClick={showAddNewDynamicFunction}><EditOutlined />录跟进</Button>);
      }
    }
  }

  getFollowContentUI = (item: any) => {
    // 客户状态/ 客户邀约状态/ 客户销售状态 state
    // 品类： 
    // 需求级别/邀约级别/销售级别 followTag

    // 1：需求（线索），2：邀约（有效单），3：订单（订单）,
    let stateTitel = '跟进状态';
    let tagTitle = "跟进标签";

    if (item.type === 1) {
      stateTitel = '客户状态';
      tagTitle = '需求级别';
    };

    if (item.type === 2) {
      stateTitel = '客户邀约状态';
      tagTitle = '邀约级别';
    };

    if (item.type === 3) {
      stateTitel = '客户销售状态';
      tagTitle = '销售级别';
    };

    return (
      <div>
        {/* 跟进方式 */}
        {item.contactWay !== undefined && item.contactWay !== '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
          跟进方式：{item.contactWay}
        </div> : <div />}

        {/* 客户状态/ 客户邀约状态/ 客户销售状态 */}
        {item.state !== undefined && item.state !== '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
          {stateTitel}：{item.state}
        </div> : <div />}
        {/* 需求级别/邀约级别/销售级别 */}
        {item.followTag !== undefined && item.followTag !== '' ?
          <div style={{ marginTop: 15, marginLeft: 10 }}>
            {tagTitle}：{item.followTag}
          </div> : <div />}
        {/* 下次回访时间 */}
        {item.nextContactTime !== undefined && item.nextContactTime !== '' ? <div style={{ marginTop: 15, marginLeft: 10 }}>
          下次回访时间：{item.nextContactTime}
        </div> : <div />}
      </div>
    )

  }



  render() {
    const { followList, followData } = this.props;
    const { TabPane } = Tabs;
    return (
      <div >
        <div className={styles.headerViewStyle}>
          <div className={styles.titleFontStyle}>
            销售动态
       </div>
          <div className={styles.headerButtomStyle}>
            {this.getFollowButton()}
          </div>
        </div>
        <Tabs activeKey={this?.state?.tabIndex.toString()} type="card" onChange={this.autoTabOnChange}>
          {
            followData && followData?.followTab?.map((item: { val: React.ReactNode; }, index: { toString: () => string | undefined; }) => {
              return (
                <TabPane tab={item?.val} key={index.toString()} />
              );
            })
          }
        </Tabs>

        <div style={{ paddingTop: 20, padding: 10, maxHeight: 850, overflowY: 'auto' }} id="components-timeline-demo-custom">
          <Timeline>
            {followList && followList.length > 0 ? followList.map(item => (
              <Timeline.Item dot={<Icon type="clock-circle" />} >
                <div style={{ paddingBottom: 10 }}>{item.followTime}</div>
                <Card style={{ borderRadius: 5 }}>
                  <div className={styles.headerViewStyle}>
                    <div className={styles.headerViewStyle}>
                      <div style={{ paddingLeft: 10, fontSize: 15, fontWeight: 'bold' }}>{item.followUser}</div>
                      {item.results?.length > 0 ? <>
                        <div style={{ marginLeft: 10, fontSize: 15, fontWeight: 'bold' }}>·</div>
                        <div style={{ paddingLeft: 10, fontSize: 15, fontWeight: 'bold' }}>{item.results}</div>
                      </> : ''}
                    </div>
                  </div>
                  {this.getFollowContentUI(item)}
                  <div style={{ marginTop: 15, marginLeft: 10 }}>
                    {item.comment === '' ? '未填写' : item.comment}
                  </div>
                  <div>
                    {item && Object.prototype.toString.call(item?.attachment) === '[object Array]' && (item.attachment ?
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {
                          item?.attachment && item?.attachment?.map((img: any) => (
                            <div style={{ marginLeft: 10, marginTop: 10 }}><PicBrowser wt={25} ht={25} imgSrc={img} /></div>
                          ))
                        }
                      </div>
                      :
                      <span />)}
                  </div>

                </Card>
              </Timeline.Item>
            )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </Timeline>
        </div>
      </div >
    );
  }
}

export default FollowView;