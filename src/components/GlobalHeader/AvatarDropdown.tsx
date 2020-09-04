import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';

import { routerRedux } from 'dva/router';
import LOCAL from '@/utils/LocalStorageKeys';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { UserInfo } from '@/pages/user/login/data';
import SocketIO from '@/utils/socketIO';
export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: UserInfo;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      // 清除城市时间缓存
      localStorage.removeItem(LOCAL.CITY_AREA); // 清除海域列表
      localStorage.removeItem(LOCAL.SEA_LIST); // 清除海域ID
      localStorage.removeItem(LOCAL.SEA_ID);

      // 关闭Socket连接
      if (LOCAL.ENABLED_SOCKET_IO) {
        SocketIO.socketClose();
      }

      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
    } else if (key === 'changePassword') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch(
          routerRedux.push({
            pathname: '/changepassword',
          }),
        );
      }
    } else {
      router.push(`/account/${key}`);
    }
  };

  render(): React.ReactNode {
    const {
      currentUser = {
        avatar: '',
        name: '',
        company_name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
        <Menu.Item key="changePassword">
          <Icon type="key" />
          修改密码
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.name}</span>
          {
            currentUser.company_name && currentUser.company_name.length > 0 && (
              <span style={{ fontWeight: 500 }}>（{ currentUser.company_name}）</span>
            )
          }
        </span>
      </HeaderDropdown>
    ) : (
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
