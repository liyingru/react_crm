import { Badge, Icon, Spin, Tabs } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import NoticeList, { NoticeIconTabProps } from './NoticeList';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import LOCAL from '@/utils/LocalStorageKeys';
import eventEmitter from '@/utils/Evt';

const { TabPane } = Tabs;

export interface NoticeIconData {
  avatar?: string | React.ReactNode;
  title?: React.ReactNode;
  content?: React.ReactNode;
  create_time?: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  key?: string | number;
  read?: boolean;
}

export interface NoticeIconProps {
  count?: number;
  bell?: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClear?: (tabName: string, tabKey: string) => void;
  onItemClick?: (item: NoticeIconData, tabProps: NoticeIconTabProps) => void;
  onViewMore?: (tabProps: NoticeIconTabProps, e: MouseEvent) => void;
  onTabChange?: (tabTile: string) => void;
  style?: React.CSSProperties;
  onPopupVisibleChange?: (visible: boolean) => void;
  popupVisible?: boolean;
  clearText?: string;
  viewMoreText?: string;
  clearClose?: boolean;
  children: React.ReactElement<NoticeIconTabProps>[];
}

export default class NoticeIcon extends Component<NoticeIconProps> {
  public static Tab: typeof NoticeList = NoticeList;

  static defaultProps = {
    onItemClick: (): void => { },
    onPopupVisibleChange: (): void => { },
    onTabChange: (): void => { },
    onClear: (): void => { },
    onViewMore: (): void => { },
    loading: false,
    clearClose: false,
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };

  state = {
    unreadCount: 0,
    visible: false,
  };

  componentWillReceiveProps() {
    if (this.state.unreadCount != this.props.count) {
      this.setState({ unreadCount: this.props.count });
    }
  }

  eventNoticeUnreadChanged = (visible: boolean = false) => {
    try {
      const unreadMsgString = localStorage && localStorage.getItem(LOCAL.UNREAD_MESSAGE_COUNT);
      const unreadMsgNumber = Number(unreadMsgString) ?? 0;

      let tempNumber = unreadMsgNumber - 1;
      if (tempNumber < 0) {
        tempNumber = 0
      }
      localStorage.setItem(LOCAL.UNREAD_MESSAGE_COUNT, tempNumber.toString() ?? '0');

      this.setState({
        unreadCount: tempNumber,
        visible: visible
      });
    } catch { }
  }

  onItemClick = (item: NoticeIconData, tabProps: NoticeIconTabProps): void => {
    try {
      const { onItemClick } = this.props;
      const that = this;
      if (onItemClick) {
        Axios.post(URL.noticEditReadNotice, { noticeId: item.id }).then(
          res => {
            if (res.code == 200) {
              eventEmitter.emit('noticeUnreadCount', false);
              onItemClick(item, tabProps);
              that.setState({ visible: false });
            }
          }
        );
      }
    } catch {
      console.log('通知点击发送错误！');
    }
  };

  onClear = (name: string, key: string): void => {
    const { onClear } = this.props;
    if (onClear) {
      onClear(name, key);
    }
  };

  onTabChange = (tabType: string): void => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(tabType);
    }
  };

  onViewMore = (tabProps: NoticeIconTabProps, event: MouseEvent): void => {
    const { onViewMore } = this.props;
    if (onViewMore) {
      onViewMore(tabProps, event);
      this.setState({ visible: false });
    }
  };

  getNotificationBox(): React.ReactNode {
    const { children, loading, clearText, viewMoreText } = this.props;
    if (!children) {
      return null;
    }
    const panes = React.Children.map(
      children,
      (child: React.ReactElement<NoticeIconTabProps>): React.ReactNode => {
        if (!child) {
          return null;
        }
        const { list, title, count, tabKey, showViewMore } = child.props;
        const len = list && list.length ? list.length : 0;
        const msgCount = count || count === 0 ? count : len;
        // const tabTitle: string = msgCount > 0 ? `${title} (${msgCount})` : title;
        const tabTitle: string = msgCount > 0 ? `消息 (${msgCount})` : '消息';
        return (
          <TabPane tab={tabTitle} key={title}>
            <NoticeList
              clearText={clearText}
              viewMoreText={viewMoreText}
              data={list}
              onClear={(): void => this.onClear(title, tabKey)}
              onClick={(item): void => this.onItemClick(item, child.props)}
              onViewMore={(event): void => this.onViewMore(child.props, event)}
              showClear={false}
              showViewMore={showViewMore}
              title={title}
              {...child.props}
            />
          </TabPane>
        );
      },
    );
    return (
      <>
        <Spin spinning={loading} delay={300}>
          <Tabs className={styles.tabs} onChange={this.onTabChange}>
            {panes}
          </Tabs>
        </Spin>
      </>
    );
  }

  handleVisibleChange = (visible: boolean): void => {
    const { onPopupVisibleChange } = this.props;
    this.setState({ visible });
    if (onPopupVisibleChange) {
      onPopupVisibleChange(visible);
    }
    if (visible) {
      eventEmitter.emit('noticeUnreadCount', false);
    }
  };

  render(): React.ReactNode {
    const { className, count, popupVisible, bell } = this.props;
    const { unreadCount, visible } = this.state;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const NoticeBellIcon = bell || <Icon type="bell" className={styles.icon} />;
    const trigger = (
      <span className={classNames(noticeButtonClass, { opened: visible })}>
        <Badge id='fuck' count={unreadCount} style={{ boxShadow: 'none' }} className={styles.badge}>
          {NoticeBellIcon}
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps: {
      visible?: boolean;
    } = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = popupVisible;
    }

    return (
      <HeaderDropdown
        placement="bottomRight"
        overlay={notificationBox}
        overlayClassName={styles.popover}
        trigger={['click']}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </HeaderDropdown>
    );
  }
}
