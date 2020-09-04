import { Alert, Checkbox, Icon, message } from 'antd';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginComponents from './components/Login';
import styles from './style.less';
import { stringify } from 'querystring';
import LOCAL from '@/utils/LocalStorageKeys';
import { getPageQuery } from '@/utils/utils';
import { Redirect } from 'react-router';

import MyURL, { ENVIRONMENT } from '@/api/serverAPI.config';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;
interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
  autoLogin: boolean;
}

@connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  constructor(props: LoginProps) {
    super(props);
    let type = 'account'
    const version = MyURL.SERVER_VERSION
    if (version == '3.0.0') {
      type = "mobile";
    }
    this.state = {
      type: type,
      autoLogin: true,
    }
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : null;
    this.isLogin = !!currentUserInfoStr;
  }

  isLogin = false;

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: unknown, values: LoginParamsType) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values, type },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({
      type,
    });
  };

  /**
   * 获取验证码
   */
  onGetCaptcha = () =>
    new Promise<boolean>((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(
        ['mobile'],
        {},
        async (err: unknown, values: LoginParamsType) => {
          if (err) {
            reject(err);
          } else {
            const { dispatch } = this.props;
            try {
              const result = await ((dispatch({
                type: 'login/getCaptcha',
                payload: {
                  mobile: values.mobile,
                }
              }) as unknown) as Promise<unknown>);
              if (result && result.success) {
                resolve(!!(result.success));
                message.success(result.msg ?? "验证码已发送");
              }
            } catch (error) {
              reject(error);
            }
          }
        },
      );
    });

  renderMessage = (content: string) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {

    if (this.isLogin) {
      // const params = getPageQuery();
      // let { redirect } = params as { redirect: string };
      // const urlParams = new URL(window.location.href);
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
      // return <Redirect to={redirect || '/dashboardWorkplace'}></Redirect>;

      <Redirect to='/dashboardWorkplace'></Redirect>
    }

    const { userLogin, submitting } = this.props;
    const { resCode, type: loginType } = userLogin;

    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          {
            type == 'account' && (
              <Tab key="account" tab="账户密码登录">
                {resCode != 200 &&
                  loginType === 'account' &&
                  !submitting &&
                  this.renderMessage('账户或密码错误')}
                <UserName
                  name="userName"
                  placeholder={`${'用户名'}: `}
                  rules={[{
                    required: true,
                    message: '请输入用户名!',
                  },
                  ]}
                />
                <Password
                  name="passWord"
                  placeholder={`${'密码'}: `}
                  rules={[{
                    required: true,
                    message: '请输入密码！',
                  },
                  ]}
                  onPressEnter={e => {
                    // 监听键盘的Enter键点击事件
                    e.preventDefault();
                    if (this.loginForm) {
                      this.loginForm.validateFields(this.handleSubmit);
                    }
                  }}
                />
              </Tab>
            )
          }
          {
            type == 'mobile' && (
              <Tab key="mobile" tab="手机号登录">
                {status === 'error' &&
                  loginType === 'mobile' &&
                  !submitting &&
                  this.renderMessage('验证码错误')}
                <Mobile
                  name="mobile"
                  placeholder="手机号"
                  rules={[
                    {
                      required: true,
                      message: "请输入手机号！",
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <Captcha
                  name="verifyCode"
                  placeholder='验证码'
                  countDown={60}
                  onGetCaptcha={this.onGetCaptcha}
                  getCaptchaButtonText='获取验证码'
                  getCaptchaSecondText='秒'
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                />
              </Tab>
            )
          }

          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            {/* <a style={{ float: 'right' }} href="">
             <FormattedMessage id="user-login.login.forgot-password" />
            </a> */}
          </div>
          <Submit loading={submitting}>登录</Submit>
          {/* <div className={styles.other}>
           <FormattedMessage id="user-login.login.sign-in-with" />
           <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
           <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
           <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
           <Link className={styles.register} to="/user/register">
             <FormattedMessage id="user-login.login.signup" />
           </Link>
          </div> */}
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
