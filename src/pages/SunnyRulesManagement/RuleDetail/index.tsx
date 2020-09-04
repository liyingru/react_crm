// by xiaosong 2020.1.6
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message, Modal, Table, Timeline, Icon, Divider, Spin, Descriptions } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
import { routerRedux } from 'dva/router';
import { Dispatch, Action, compose } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import AreaSelect from '@/components/AreaSelect';
import { StateType } from './model';
import styles from './index.less';
import { connect } from 'dva';
import CrmUtil from '@/utils/UserInfoStorage';
const FormItem = Form.Item;
const { confirm } = Modal;
interface TaskDetailProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  sunnyRulesDetailModel: StateType;
  loading: boolean;
}
interface currentState {
}

@connect(
  ({
    sunnyRulesDetailModel,
    loading,
  }: {
    sunnyRulesDetailModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sunnyRulesDetailModel,
    loading: loading.models.sunnyRulesDetailModel,
  }),
)


class TaskInfor extends Component<TaskDetailProps, currentState>{

  state = {
  }

  spanTitleStyle = { borderLeft: "2px solid black", paddingLeft: 5, fontWeight: 500, fontSize: 12 };


  componentDidMount() {
    const { dispatch, location: { query: { rulesId } } } = this.props;
    if (rulesId) {
      dispatch({
        type: 'sunnyRulesDetailModel/getRulesDetail',
        payload: { rulesId: rulesId },
      });
    }
  }


  renderForm = () => {

    /**
    * rulesInfo  （规则信息）
    * intoGroupData （录入人）
    * verifierData （需求确认人）
    * inviteData （邀约人）
    * orderData （门市）
    *  */

    const { sunnyRulesDetailModel: { rulesDetail } } = this.props;
    const { rulesInfo, intoGroupData, verifierData, inviteData, orderData } = rulesDetail;
    return (
      <div className={styles.tableListForm}>
        <div style={{ fontSize: '15px', marginBottom: '10px' }}>规则名称：{rulesInfo && rulesInfo.name}</div>
        <div style={{ fontSize: '15px', marginBottom: '10px' }}>所属公司：{rulesInfo && rulesInfo.company_name}</div>
        <div style={{ fontSize: '15px', marginBottom: '10px' }}>规则描述： {rulesInfo && rulesInfo.activity_name ? rulesInfo.activity_name : "无"}</div>
        <div style={{ fontSize: '15px', marginBottom: '10px' }}>流转规则：</div>
        <div style={{ marginLeft: 20}}>
          {/* 录入人 */}
          {intoGroupData && intoGroupData.length > 0 &&
            <div>
              {intoGroupData?.map((item, index) => {
                return (
                  <Descriptions style={{marginTop: 10}} size="small" bordered={false} title={<b style={this.spanTitleStyle}>录入人{index + 1}组</b>} column={1}>
                    <Descriptions.Item label="客资来源">{item.channel_name_txt}</Descriptions.Item>
                    <Descriptions.Item label="录入可见">{item.is_show == 1 ? '开启' : '关闭'}</Descriptions.Item>
                    <Descriptions.Item label="常规接收人">{item.routine_receive_user_txt && item.routine_receive_user_txt.length > 0 && item.routine_receive_user_txt != ";" ? item.routine_receive_user_txt : "无"}</Descriptions.Item>
                    <Descriptions.Item label="指定邀约人">{item.is_invite == 1 ? '指定' : '不指定'}</Descriptions.Item>
                  </Descriptions>
                )
              })}
            </div> }

          {/* 需求确认人 */}
          { verifierData && (
            <Descriptions style={{marginTop: 10}} size="small" bordered={false} title={<b style={this.spanTitleStyle}>需求确认人</b>} column={1}>
              <Descriptions.Item label="跳过需求">{verifierData.is_skip == 1 ? '跳过' : '不跳过'}</Descriptions.Item>
              <Descriptions.Item label="常规接收人">{verifierData.routine_receive_user_txt && verifierData.routine_receive_user_txt.length > 0 && verifierData.routine_receive_user_txt != ";" ? verifierData.routine_receive_user_txt : "无"}</Descriptions.Item>
              <Descriptions.Item label="指定邀约">{verifierData.is_invite == 1 ? '指定' : '不指定'}</Descriptions.Item>
              <Descriptions.Item label="派发公司">{verifierData.distribute_company_txt && verifierData.distribute_company_txt.length > 0 && verifierData.distribute_company_txt != ";" ? verifierData.distribute_company_txt : "无"}</Descriptions.Item>
              <Descriptions.Item label="派发公司渠道">{verifierData.distribute_channel_txt && verifierData.distribute_channel_txt.length > 0 && verifierData.distribute_channel_txt != ";" ? verifierData.distribute_channel_txt : "未指定"}</Descriptions.Item>
            </Descriptions>
          )}

          {/* 邀约人 */}
          {inviteData && (
            <Descriptions style={{marginTop: 10}} size="small" bordered={false} title={<b style={this.spanTitleStyle}>邀约人</b>} column={1}>
              <Descriptions.Item label="常规接收人">{inviteData.routine_receive_user_txt && inviteData.routine_receive_user_txt.length > 0 && inviteData.routine_receive_user_txt!=";" ? inviteData.routine_receive_user_txt : "无"}</Descriptions.Item>
              <Descriptions.Item label="客户级别">{inviteData.is_customer_grade == 1 ? '设置' : '不设置'}</Descriptions.Item>
              {
                inviteData.is_customer_grade == 1 && (
                  <>
                    <Descriptions.Item label="A">{inviteData.grade_a_txt && inviteData.grade_a_txt.length > 0 && inviteData.grade_a_txt!=";" ? inviteData.grade_a_txt : '无'}</Descriptions.Item>
                    <Descriptions.Item label="B">{inviteData.grade_b_txt && inviteData.grade_b_txt.length > 0 && inviteData.grade_b_txt!=";" ? inviteData.grade_b_txt : '无'}</Descriptions.Item>
                    <Descriptions.Item label="C">{inviteData.grade_c_txt && inviteData.grade_c_txt.length > 0 && inviteData.grade_c_txt!=";" ? inviteData.grade_c_txt : '无'}</Descriptions.Item>
                    <Descriptions.Item label="D">{inviteData.grade_d_txt && inviteData.grade_d_txt.length > 0 && inviteData.grade_d_txt!=";" ? inviteData.grade_d_txt : '无'}</Descriptions.Item>
                  </>
                )
              }
              <Descriptions.Item label="派发公司">{inviteData.distribute_company_txt && inviteData.distribute_company_txt != ";" ? inviteData.distribute_company_txt : "无"}</Descriptions.Item>
            </Descriptions>
          )}

          {/* 门市 */}
          {orderData && (
            <Descriptions style={{marginTop: 10}} size="small" bordered={false} title={<b style={this.spanTitleStyle}>门市</b>} column={1}>
              <Descriptions.Item label="常规接收人">{orderData.routine_receive_user_txt && orderData.routine_receive_user_txt.length>0 ? orderData.routine_receive_user_txt : "无"}</Descriptions.Item>
            </Descriptions>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { loading, sunnyRulesDetailModel } = this.props;
    const { rulesDetail:{logRules} } = sunnyRulesDetailModel;

    return (
      <PageHeaderWrapper title='客资来源详情'>

      <Spin spinning={loading}>
        <Row
          gutter={24}
          style={{ display: 'flex' }}
        >
          <Col span={16}>
            <Card>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
              </div>
            </Card>
          </Col>
          
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                历史操作日志
              </div>
              <div style={{ maxHeight: 700, overflowY: 'auto', paddingTop: 10 }}>
                <Timeline >
                  {logRules && logRules?.map((item) => {
                    return (
                      <Timeline.Item color={'green'} >
                        <div>
                          <div>操作时间：{item && item?.create_time}</div>
                          <div>操作内容：{item && item?.content}</div>
                          <div>操作人：{item && item?.name}</div>
                        </div>
                      </Timeline.Item>
                    )
                  })}
                </Timeline>

              </div>
            </Card>

          </Col>

        </Row>
      </Spin>
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<TaskDetailProps>()(TaskInfor);
