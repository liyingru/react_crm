import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';

import { loginRequest, accountLogout, getCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import LOCAL from '@/utils/LocalStorageKeys';

export interface StateType {
  status?: 'ok' | 'error';  // ok则执行登入操作， error则在页面UI提示错误
  resCode?: number;  // 根据业务逻辑添加的，取代status，若resCode == 200 表示接口成功。
  type?: string;  // 账号密码登录还是手机号登录。 目前只支持账号密码，所以现在type没什么用
  currentAuthority?: 'user' | 'guest' | 'admin';  // 用户身份权限的可能的值
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    // 用来保存数据
    status: undefined,
    resCode: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const type = payload.type ?? 'account';
      if (type == 'mobile') {
        payload = {
          ...payload,
          userName: payload.mobile
        }
      }
      const response = yield call(loginRequest, payload);

      if (response.code == 200 && !response.data.result.avatar) {
        response.data.result.avatar = "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";
      }

      yield put({
        type: 'changeLoginStatus', // 回调的方法 changeLoginStatus
        // payload: response.data.result,
        payload: {
          type,
          ...response
        }
      });
      // Login successfully
      if (response.status === 'ok' || response.code === 200) {
        localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(response.data.result));

        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params as { redirect: string };
        // // 登录接口成功后，不用在这里指定跳转路径，需要重新加载本页，执行getCurrentUser的逻辑，（自动登录）
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length); // 把相同的域名前缀截掉，只保留后面的相对路径
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = '/';
        //     return;
        //   }
        // }
        yield put(routerRedux.replace('/dashboardWorkplace'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      const params = {
        verifyType: 1,
        ...payload,
      }
      const response = yield call(getCaptcha, params);

      return {
        success: response.code == 200,
        msg: response.msg
      };
    },
    /**
     * 退出登录，除了退出到login页面，还需要清空本地的用户信息缓存
     * @param _
     * @param param1
     */
    *logout(_, { call, put }) {
      yield call(accountLogout);
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        localStorage.removeItem(LOCAL.USER_INFO);
        localStorage.setItem(LOCAL.LOGIN_RELOAD, '1');
        yield put(
          routerRedux.replace({
            pathname: '/user/login'
            // search: stringify({
            //   redirect: window.location.href,
            // }),
          }),
        );
      }
    },
  },

  reducers: {
    // 这里是回调
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      setAuthority(payload.data.result.account);  // 保存登录用户的身份权限标识  admin

      const testData = {
        ...state,
        status: payload.code,
        resCode: payload.code,
        type: payload.type,
      }
      return testData;
    },
  },
};

export default Model;
