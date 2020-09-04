import React, { Component } from 'react';
import { Tag, message } from 'antd';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { NoticeItem, GlobalModelState } from '@/models/global';
import { CurrentUser } from '@/models/user';
import { ConnectProps, ConnectState } from '@/models/connect';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
// import { routerRedux } from 'dva/router';
import { router } from 'umi';
import LOCAL from '@/utils/LocalStorageKeys';
import { globalContext } from '@/utils/context';
import eventEmitter from '@/utils/Evt';
import { routerRedux } from 'dva/router';
// import Axios from 'axios';
// import URL from '@/api/serverAPI.config';


export interface GlobalHeaderRightProps extends ConnectProps {
  notices?: NoticeItem[];
  totalCount?: number;
  currentUser?: CurrentUser;
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
}
class NoticeIconView extends Component<GlobalHeaderRightProps, GlobalModelState> {
  constructor(props: GlobalHeaderRightProps) {
    super(props);
    this.state = {
      collapsed: false,
      notices: [],
      totalCount: 0
    };
  }

  componentDidMount() {
    eventEmitter.addListener('noticeUnreadCount', this.eventFetchNotices)
    this.eventFetchNotices();
  }

  componentWillUnmount() {
    eventEmitter.removeListener('noticeUnreadCount', this.eventFetchNotices)
  }

  // componentWillReceiveProps() {
  //   try {
  //     const unreadMsgString = localStorage && localStorage.getItem(LOCAL.UNREAD_MESSAGE_COUNT);
  //     console.log('获取通知未读数字符串：', unreadMsgString);
  //     if (unreadMsgString && unreadMsgString.length > 0) {
  //       let unreadCount = Number(unreadMsgString);
  //       console.log('获取通知未读数：', unreadCount);
  //       this.setState({
  //         totalCount: unreadCount
  //       })
  //     }
  //   }
  //   catch {
  //     console.log('获取通知未读数出错');
  //   }
  // }

  eventFetchNotices = () => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
        payload: {
          status: '0',
          page: '1',
          pageSize: '3',
        }
      });
    };
  }

  getProviderValue = () => {
    const { notices, totalCount, fetchingNotices, onNoticeVisibleChange } = this.props;
    // const noticeData = this.getNoticeData();
    // const unreadMsg = this.getUnreadData(noticeData);
    // let unreadCount = 0;
    // if (totalCount && totalCount > 0) {
    //   unreadCount = totalCount;
    //   localStorage && localStorage.setItem(LOCAL.UNREAD_MESSAGE_COUNT, totalCount.toString());
    // } else {
    //   const unreadMsgString = localStorage && localStorage.getItem(LOCAL.UNREAD_MESSAGE_COUNT);

    //   if (unreadMsgString && unreadMsgString.length > 0) {
    //     unreadCount = parseInt(unreadMsgString);
    //   }
    // }
    return <globalContext.Consumer>{value =>
      <NoticeIcon
        className={styles.action}
        count={totalCount}
        onItemClick={item => {
          this.changeReadState(item as NoticeItem);
        }}
        loading={fetchingNotices}
        clearText="清空"
        viewMoreText="查看更多"
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => {
          localStorage && localStorage.setItem(LOCAL.MESSAGE_CENTER_REFRESH, '1');
          router.push({
            pathname: '/messageCenter/messageCenterList',
            state: { unread: '0' }
          })
        }}
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={totalCount}
          list={notices}
          title="线索"
          emptyText="您已查看所有通知"
          showViewMore
        />
        {/* <NoticeIcon.Tab
          tabKey="message"
          count={0}
          list={undefined}
          title="消息"
          emptyText="您已查看所有通知"
          showViewMore
        /> */}
        {/* <NoticeIcon.Tab
        tabKey="event"
        title="待办"
        emptyText="你已完成所有待办"
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
      /> */}
      </NoticeIcon >}</globalContext.Consumer>
  }

  changeReadState = (clickedItem: NoticeItem): void => {
    // const { id } = clickedItem;
    // const { dispatch } = this.props;

    // if (dispatch) {
    //   dispatch({
    //     type: 'global/changeNoticeReadState',
    //     payload: id,
    //   });
    // }

    console.log('clickedItem: ', clickedItem);
    if (clickedItem) {
      var params = {};

      if (clickedItem.customer_id && clickedItem.customer_id.toString().length > 0) {
        params.customerId = clickedItem.customer_id;
      }
      if (clickedItem.leads_id && clickedItem.leads_id.toString().length > 0) {
        params.leadsId = clickedItem.leads_id;
      }
      if (clickedItem.leads_id && clickedItem.leads_id.toString().length > 0) {
        params.leadId = clickedItem.leads_id;
      }
      if (clickedItem.user_id && clickedItem.user_id.toString().length > 0) {
        params.ownerId = clickedItem.user_id;
      }
      if (clickedItem.category_id && clickedItem.category_id.toString().length > 0) {
        params.categoryId = clickedItem.category_id;
      }
      if (clickedItem.order_id && clickedItem.order_id.toString().length > 0) {
        params.orderId = clickedItem.order_id;
      }
      if (clickedItem.audit_id && clickedItem.audit_id.toString().length > 0) {
        params.auditId = clickedItem.audit_id;
      }
      if (clickedItem.req_id && clickedItem.req_id.toString().length > 0) {
        params.reqId = clickedItem.req_id;
      }
      if (clickedItem.default_active_key && clickedItem.default_active_key.toString().length > 0) {
        params.defaultActiveKey = clickedItem.default_active_key;
      }
      if (clickedItem.default_active_key && clickedItem.default_active_key.toString().length > 0) {
        params.defaultActiveKey = clickedItem.default_active_key;
      }
      if (clickedItem.show_style && clickedItem.show_style.toString().length > 0) {
        params.showStyle = clickedItem.show_style;
      }
      if (clickedItem.read_or_write && clickedItem.read_or_write.toString().length > 0) {
        params.readOrWrite = clickedItem.read_or_write;
      }
      if (clickedItem.is_qa && clickedItem.is_qa.toString().length > 0) {
        params.isQA = clickedItem.is_qa;
      }

      this.props.dispatch(routerRedux.push({
        pathname: clickedItem.url,
        state: params,
        query: params
      }));
    }
  };

  handleNoticeClear = (title: string, key: string) => {
    const { dispatch } = this.props;
    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = (): {
    [key: string]: NoticeItem[];
  } => {
    const { notices = [] } = this.props;
    console.log('通知数: ', notices.length);
    if (notices === undefined || notices.length === 0) {
      return {};
    }

    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };

      if (newNotice.create_time) {
        newNotice.create_time = moment(notice.create_time as string).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  getUnreadData = (noticeData: { [key: string]: NoticeItem[] }) => {
    const unreadMsg: {
      [key: string]: number;
    } = {};
    Object.keys(noticeData).forEach(key => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    return (
      this.getProviderValue()
    );
  }
}

export default connect(({ user, global, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  totalCount: global.totalCount,
}))(NoticeIconView);
