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
import { RulesListItem } from '../SunnyRulesList/data';
import { ArrowRightOutlined, RightOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const { confirm } = Modal;
interface QaRuleDetailProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  qaRulesDetailModel: StateType;
  loading: boolean;
}

@connect(
  ({
    qaRulesDetailModel,
    loading,
  }: {
    qaRulesDetailModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    qaRulesDetailModel,
    loading: loading.models.qaRulesDetailModel,
  }),
)


class QaRuleDetail extends Component<QaRuleDetailProps>{

  spanTitleStyle = { borderLeft: "2px solid black", paddingLeft: 5, fontWeight: 500, fontSize: 12 };


  componentDidMount() {
    const { dispatch, location: { state: { rulesId } } } = this.props;
    if (rulesId) {
      dispatch({
        type: 'qaRulesDetailModel/getQaRuleDetail',
        payload: { rulesId: rulesId },
      });
    }
  }

  handleEditRule = (ruleId: string) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/qaruleslist/editqarules',
      state: {
        isAdd0orEdit1: 1,
        rulesId: ruleId
      }
    }))
  }

  handleDeleteRule = (rulesId: string) => {
    if (rulesId) {
      const {dispatch} = this.props;
      dispatch({
        type: 'qaRulesDetailModel/delPublicRules',
        payload: { rulesId },
        callback: (success: boolean , msg: string) => {
          if(success) {
            Modal.success({
              title: "删除成功",
              centered: true,
              onOk: () => {
                localStorage?.setItem('rulesListRefreshTag', 'list')
                this.props.dispatch(routerRedux.goBack());
              }
            })
          } else {
            Modal.error({
              title: msg,
              centered: true,
            });
          }
        }
      });
    }
  }


  renderDetailInfo = () => {

    /**
    * rulesInfo  （规则信息）
    * intoGroupData （录入人）
    * verifierData （需求确认人）
    * inviteData （邀约人）
    * orderData （门市）
    *  */
    const { qaRulesDetailModel: { rulesDetail } } = this.props;
    if(!rulesDetail) return null;
    return (
      <Descriptions style={{marginTop: 10, width: 400, }} size='default' bordered={false}  column={1}>
        <Descriptions.Item label="规则名称">{rulesDetail.name}</Descriptions.Item>
        <Descriptions.Item label="规则明细" >
          {
            rulesDetail.content.map(item=>(
              <Descriptions style={{marginLeft: 60, marginTop: 10, display: 'block', }} size="small" bordered={false}  column={1} >
                <Descriptions.Item label="公司">{item.company_id}</Descriptions.Item>
                <Descriptions.Item label="对应渠道">{item.channel}</Descriptions.Item>
                <Descriptions.Item label="对应品类">{item.category}</Descriptions.Item>
              </Descriptions>
            ))
          }
        </Descriptions.Item>
        <Descriptions.Item label="规则状态">{rulesDetail.status==1?"有效":"失效"}</Descriptions.Item>
        <Descriptions.Item label="描述说明">{rulesDetail.desc&&rulesDetail.desc.length>0?rulesDetail.desc:"未填写"}</Descriptions.Item>
        <Descriptions.Item label="创建人">{rulesDetail.create_by}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{rulesDetail.create_time}</Descriptions.Item>
      </Descriptions>
    )
  }

  buttonContainerStyle = {
    width: 400,
    marginTop: 20,
    marginBottom: 20
  }
  negButtonStyle = {
      width: "40%", 
      marginRight:"5%"
  }

  posButtonStyle = {
      width: "40%", 
      marginLeft:"3%"
  }

  renderActionButtons = () => {
    const { qaRulesDetailModel: { rulesDetail } } = this.props;
    if(!rulesDetail) return null;
    return (
      <div style={this.buttonContainerStyle}>
          <Button type="danger" style={this.negButtonStyle} disabled={!rulesDetail.id} onClick={()=>this.handleDeleteRule(rulesDetail.id.toString())}>删除</Button>
          <Button type="primary" style={this.posButtonStyle} disabled={!rulesDetail.id} onClick={() => this.handleEditRule(rulesDetail.id.toString())}>编辑</Button>
      </div>
  );
  }

  render() {
    const { loading } = this.props;

    return (
      <PageHeaderWrapper title='QA规则详情'>

      <Spin spinning={loading}>
        <Row
          gutter={24}
          style={{ display: 'flex' }}
        >
          <Col span={24}>
            <Card>
              <div className={styles.tableList}>
                {this.renderDetailInfo()}
                {this.renderActionButtons()}
              </div>
            </Card>
          </Col>

        </Row>
      </Spin>
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<QaRuleDetailProps>()(QaRuleDetail);
