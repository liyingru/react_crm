import LOCAL from '@/utils/LocalStorageKeys';
import URL from '@/api/serverAPI.config';
import io from 'socket.io-client';
import React from 'react';
import { notification, Button } from 'antd';
import messageAudio from '@/assets/crm_message.wav';
import eventEmitter from '@/utils/Evt';
import styles from './socketIO.less';
import { router } from 'umi';
import Axios from 'axios';

let socket: io.SocketIOClient;

// const messageCountIncrease = () => {
//   try {
//     let unreadCountStr = (localStorage && localStorage.getItem(LOCAL.UNREAD_MESSAGE_COUNT)) ?? '0';
//     let unreadCount = parseInt(unreadCountStr);
//     unreadCount += 1;
//     localStorage && localStorage.setItem(LOCAL.UNREAD_MESSAGE_COUNT, unreadCount.toString());
//   } catch {
//     console.log('messageCountIncrease error');
//   }
// }

// const messageCountDecrease = () => {
//   try {
//     let unreadCountStr = (localStorage && localStorage.getItem(LOCAL.UNREAD_MESSAGE_COUNT)) ?? '0';
//     let unreadCount = parseInt(unreadCountStr);
//     unreadCount -= 1;
//     if (unreadCount < 0) {
//       unreadCount = 0;
//     }
//     localStorage && localStorage.setItem(LOCAL.UNREAD_MESSAGE_COUNT, unreadCount.toString());
//   } catch {
//     console.log('messageCountDecrease error');
//   }
// }

const openNotificationWithIcon = (title: string, content: string, createTime: string, func?: () => void | undefined, notificationType?: string | undefined) => {
  const key = `open${Date.now()}`;
  const titleRander = (
    <div className={styles.msgTitle}>
      <span>{title ?? '新消息'}</span>
      <span className={styles.msgTime}>{createTime ?? ''}</span>
    </div>
  );

  let contentArray = [content];
  if (content.indexOf('_') >= 0) {
    contentArray = content.split('_');
  }

  const descriptionRander = (
    <div className={styles.msgContent}>
      {contentArray && contentArray.map((c, index) => (
        <div>{c ?? ''}</div>
      ))}
    </div>
  );

  const btn = (
    <div id={key} style={{ display: 'flex' }}>
      <audio src={messageAudio} autoPlay={true} />
      <Button type="primary" onClick={() => {
        func && func();
        notification.close(key);
      }}>立即查看</Button>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <Button type="danger" onClick={() => {
        // messageCountIncrease();
        notification.close(key);
      }}>暂不处理</Button>
    </div>
  );
  notification.open({
    type: notificationType ? notificationType : 'info',
    style: { width: 500, marginLeft: 385 - 500, },
    message: titleRander,
    description: descriptionRander,
    duration: 60,
    btn,
    key
  });
};

const socketStart = () => {
  try {
    console.log('Socket启动');
    socket = io(URL.notice);
    if (socket.disconnect) {
      const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : '{}';
      const currentUserInfo = JSON.parse(currentUserInfoStr);
      // socket连接后以uid登录
      socket.on('connect', function () {
        socket.emit('login', currentUserInfo.id);
        console.log('Socket登录');
      });
    }
    // 后端推送来消息时
    socket.on('new_msg', function (content) {
      console.log("新消息：", content);
      if (content) {
        try {
          const msgInfo = content;
          if (msgInfo) {
            eventEmitter.emit('noticeUnreadCount', false);
            openNotificationWithIcon(msgInfo.title ?? '新消息', msgInfo.content ?? '', msgInfo.create_time ?? '', () => {

              let newUrl = msgInfo.url;
              let newUrlArray = msgInfo.url.split('?');
              if (newUrlArray && newUrlArray.length > 0) {
                newUrl = newUrlArray[0];
              }

              Axios.post(URL.noticEditReadNotice, { noticeId: msgInfo.notice_id ?? '' }).then(
                res => {
                  if (res.code == 200) {
                    eventEmitter.emit('noticeUnreadCount', false);

                    var params = {};

                    if (msgInfo.customer_id && msgInfo.customer_id.toString().length > 0) {
                      params.customerId = msgInfo.customer_id;
                    }
                    if (msgInfo.leads_id && msgInfo.leads_id.toString().length > 0) {
                      params.leadsId = msgInfo.leads_id;
                    }
                    if (msgInfo.leads_id && msgInfo.leads_id.toString().length > 0) {
                      params.leadId = msgInfo.leads_id;
                    }
                    if (msgInfo.user_id && msgInfo.user_id.toString().length > 0) {
                      params.ownerId = model.user_id;
                    }
                    if (msgInfo.category_id && msgInfo.category_id.toString().length > 0) {
                      params.categoryId = msgInfo.category_id;
                    }
                    if (msgInfo.order_id && msgInfo.order_id.toString().length > 0) {
                      params.orderId = msgInfo.order_id;
                    }
                    if (msgInfo.audit_id && msgInfo.audit_id.toString().length > 0) {
                      params.auditId = msgInfo.audit_id;
                    }
                    if (msgInfo.req_id && msgInfo.req_id.toString().length > 0) {
                      params.reqId = msgInfo.req_id;
                    }
                    if (msgInfo.default_active_key && msgInfo.default_active_key.toString().length > 0) {
                      params.defaultActiveKey = msgInfo.default_active_key;
                    }
                    if (msgInfo.show_style && msgInfo.show_style.toString().length > 0) {
                      params.showStyle = msgInfo.show_style;
                    }
                    if (msgInfo.read_or_write && msgInfo.read_or_write.toString().length > 0) {
                      params.readOrWrite = msgInfo.read_or_write;
                    }
                    if (msgInfo.is_qa && msgInfo.is_qa.toString().length > 0) {
                      params.isQA = msgInfo.is_qa;
                    }

                    console.log('socketIO跳转传参:', params);

                    let currentRoter = window.location.pathname;
                    if (currentRoter == newUrl) {
                      router.go(0);
                      router.push({
                        pathname: newUrl,
                        state: params,
                        query: params
                      });
                    } else {
                      router.push({
                        pathname: newUrl,
                        state: params,
                        query: params
                      });
                    }
                  }
                }
              );
            });
          }
        }
        catch (error) {
          console.log('Socket错误', error);
        }
      }
    });
    // // 后端推送来在线数据时
    // socket.on('update_online_count', function (online_stat) {
    //   console.log(online_stat);
    //   openNotificationWithIcon('fuck', '卧槽，来了。', () => {
    //     window.location.href = 'targetManagement/salesTarget';
    //   });
    // });
    // socket.on('event', function (data) {
    //   console.log('socket event:', data);
    // });
    // socket.on('disconnect', function () {
    //   // console.log('SocketIO disconnect');
    // });
    // }

    socket.on('connect_error', function (msg) {
      console.log('SocketIO出错:', msg);
      // openNotificationWithIcon('出错了', '卧槽，Socket连接出错！', undefined, 'warning');
    });

  } catch {
    console.log('SocketIO出错');
    // openNotificationWithIcon('出错了', '消息服务器连接出错！', undefined, 'error');
  }
}

const socketClose = () => {
  try {
    socket?.close();
  } catch {
    console.log('关闭Socket出错');
  }
}

const SocketIO = {
  openNotificationWithIcon, socketStart, socketClose
}

export default SocketIO;
