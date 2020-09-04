// by xiaosong 2020.1.6
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, message,Spin } from 'antd';
import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { StateType } from './model';
import styles from './index.less';
import { connect } from 'dva';
const FormItem = Form.Item;
interface changePasswordProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  changePassword: StateType;
  loading: boolean;
}
interface currentState {
  loading: boolean;
  data: Object,
}

@connect(
  ({
    changePassword,
    loading,
  }: {
    changePassword: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    changePassword,
    loading: loading.models.changePassword,
  }),
)


class changePasswordTemplate extends Component<changePasswordProps, currentState>{
  state = {
    loading: false,
    data: {}
  }
  componentDidMount() { }
  changePasswordCtrl = (data: any) => {
    const self = this;
    if (data.code == 200) {
      message.success('密码修改成功');
      setTimeout(() => {
        self.linkToHome();
      }, 2000);

    } else {
      message.error(data.msg);
    }
    this.setState({
      loading: false,
    })
  }
  linkToHome = ()=>{
    this.props.dispatch(routerRedux.push({
      pathname: '/',
    }));
  }
  submitCtrl = ()=>{
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        for (let i in values) {
          if (values[i] == undefined) {
            values[i] = '';
          }
        }
        const valuesResult = {
          ...values
        }
        this.setState({
          loading: true,
        })
        dispatch({
          type: 'changePassword/updatePasswordCtrl',
          payload: valuesResult,
          callback: this.changePasswordCtrl
        });
       
      }
    });
  }
  renderForm() {
    const {  form} = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={12}>
              <FormItem label="旧密码">
                {getFieldDecorator('oldPassWord',
                  { rules: [{ required: true, message: "旧密码" }] })(<Input.Password placeholder="请输入旧密码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={12}>
              <FormItem label="新密码">
                {getFieldDecorator('newPassWord',
                  { rules: [{ required: true, message: "新密码" }] })(<Input.Password placeholder="请输入新密码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={12}>
              <FormItem label="确认新密码">
                {getFieldDecorator('repeatPassWord',
                  { rules: [{ required: true, message: "确认新密码" }] })(<Input.Password placeholder="请确认新密码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem style={{ paddingLeft: 12 }}>
                <Button type="primary" style={{ width: '80%' }} onClick={(e) => { this.submitCtrl()}}>
                  提交
              </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  render() {
    const {loading} = this.state;
    return (
      <PageHeaderWrapper className={styles.main} content="修改密码">
        <Card bordered={false}>
          {this.renderForm()}
        </Card>
        <Spin spinning={loading} size="large"></Spin>
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<changePasswordProps>()(changePasswordTemplate);
