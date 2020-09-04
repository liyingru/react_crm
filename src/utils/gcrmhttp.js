import Axios from 'axios';
import { Component } from 'react';
import { Modal } from 'antd';
Component.prototype.$axios = Axios;

import qs from 'qs';
import parseJson from 'parse-json';
import LOCAL from '@/utils/LocalStorageKeys';
import URL, { ENVIRONMENT } from '../api/serverAPI.config';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { stringify } from 'querystring';

// const init=function(){
//   axios.defaults.headers.common['user'] = '111';
// }
// export default {init}


Axios.defaults.withCredentials = true;
Axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// Axios.defaults.timeout = 10000;
// Axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8';

Axios.interceptors.request.use(
  config => {
    // console.log('request拦截器：', config);
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    let currentUserInfo;
    try {
      if (currentUserInfoStr) {
        currentUserInfo = JSON.parse(currentUserInfoStr);
      } else {

      }
    } catch (e) {
      currentUserInfo = currentUserInfoStr;
    }
    const apver = URL.SERVER_VERSION;
    const appId = '666';
    if (config.method == 'post') {
      if (config.headers['Content-Type'] == 'multipart/form-data') {
        let other = {};
        let keys = config.data.keys();
        let next = keys.next();
        let key = next.value;
        while (key) {
          if (key != 'file') {
            let value = config.data.get(key);
            other[key] = value;
            config.data.delete(key);
          }
          key = keys.next().value;
        }
        config.data.append('params', JSON.stringify({
          ...other,
          userId: currentUserInfo ? currentUserInfo.id : '',
          apver,
          appId,
        }));

      } else {
        config.data = {
          ...config.data,
          userId: currentUserInfo ? currentUserInfo.id : '',
          apver,
          appId,
        };
        const params = new URLSearchParams();
        params.set('params', JSON.stringify(config.data));
        config.data = params;
      }
    } else if (config.method == 'get') {
      config.params = {
        apver,
        appId,
        ...config.params,
      };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// respone拦截器
Axios.interceptors.response.use(
  response => {
    const res = response.data;

    //这里根据后台返回来设置
    if ((response.config?.url?.indexOf('owner/customer/externalFlowCustomer') ?? -1) != -1 || (response.config?.url?.indexOf('owner/customer/internalFlowCustomer') ?? -1) != -1) {
      console.log('BI批量导入respone拦截器：', response);
      return res;
    } else if (res.code === 100) {
      Modal.error({
        title: '发生错误',
        content: res.msg ?? '未知错误，请联系管理员！',
      });
      return res;
    } else if (res.code === 200) {
      localStorage.setItem(LOCAL.AUTHORIZED, '1');
      return res;
    } else if (res.code === 1005) {
      if (window.location.pathname == '/user/login') {
        // 防止多个接口同时返回1005，重复执行
      } else {
        localStorage.removeItem(LOCAL.USER_INFO);
        localStorage.setItem(LOCAL.LOGIN_RELOAD, '1');
        const queryString = stringify({
          redirect: window.location.href,
        });
        router.push({
          pathname: '/user/login',
          search: queryString
        })
      }
      return Promise.reject(res);
    } else if (res.code === 505) {
      localStorage.setItem(LOCAL.AUTHORIZED, '0');
      return res;
    } else {
      message.error(res.msg);
      return res;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

export default Axios;
