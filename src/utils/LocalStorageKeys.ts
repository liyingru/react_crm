/***
 *
 * 本地存储的key
 *
 **/
const LOCAL = {
  LOGIN_RELOAD: 'login_reload',// '0'|'1'  回到登录页重新加载页面标志
  USER_INFO: 'gcrm-user-info', // 登录用户的信息
  CUSTOMER_CONFIG: 'gcrm-customer-config', // 客户的配置信息
  AUTHORIZED: 'authorized', // '1' 是否有权限
  CITY_AREA: 'area',// 城市数据
  SEA_LIST: 'sea-list',// 海域列表
  SEA_ID: 'sea-id',// 海域ID（公司ID）
  MESSAGE: '',
  MESSAGE_CENTER_REFRESH: 'isMessageCenterRefresh',// 消息中心是否强刷
  UNREAD_MESSAGE_COUNT: 'unread_message_count',// '0'  未读消息数
  AUTO_REFRESH: 'list_auto_refresh', // '0'  列表自动刷新，保留页数和筛选项
  LIST_RESET_REFRESH: 'list_reset_refresh', // '0'|'1'  列表刷新，回到第一页，筛选项清空
  ENABLED_SOCKET_IO: false // 是否启用socketIO
};
export default LOCAL;
