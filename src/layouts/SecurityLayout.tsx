import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import PageLoading from '@/components/PageLoading';
import LOCAL from '@/utils/LocalStorageKeys';
import { message } from 'antd';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  currentUser: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false
  };

  componentDidMount() {  // 该组件通过render()被挂载到DOM树上后，会执行此方法。
    this.setState({
      isReady: true
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    } else {
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : null;

    let isLogin = false;
    // const msg = localStorage ? localStorage.getItem(LOCAL.MESSAGE) : null;
    if (currentUserInfoStr) {
      try {
        const currentUserInfo = JSON.parse(currentUserInfoStr);

        if (currentUserInfo?.company_id !== undefined) {
          isLogin = true;
        }
      } catch { }
    }

    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    }

    // const authorized = localStorage ? localStorage.getItem(LOCAL.AUTHORIZED) : null;
    // if (authorized === '0') {
    //   message.error('您没有操作权限！');
    // }

    // if (msg !== undefined && msg !== null && msg.length > 0) {
    //   message.error(msg);
    // }

    return children;
  }
}

/**
 * connect方法作用是把model的state数据，变成props的数据
 */
export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
