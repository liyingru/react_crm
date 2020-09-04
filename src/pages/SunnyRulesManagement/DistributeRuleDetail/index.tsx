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
interface DistributeRuleDetailProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  distributeRulesDetailModel: StateType;
  loading: boolean;
}
interface currentState {
}

@connect(
  ({
    distributeRulesDetailModel,
    loading,
  }: {
    distributeRulesDetailModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    distributeRulesDetailModel,
    loading: loading.models.distributeRulesDetailModel,
  }),
)


class DistributeRuleDetail extends Component<DistributeRuleDetailProps, currentState>{

  state = {
  }

  spanTitleStyle = { borderLeft: "2px solid black", paddingLeft: 5, fontWeight: 500, fontSize: 12 };


  componentDidMount() {
    const { dispatch, location: { query: { rulesId } } } = this.props;
    if (rulesId) {
      dispatch({
        type: 'distributeRulesDetailModel/getPublicRuleDetail',
        payload: { rulesId: rulesId },
      });
    }
  }

  handleEditRule = (ruleId: string) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/distributeruleslist/editdistributerules',
      state: {
        isAdd0orEdit1: 1,
        rulesId: ruleId
      }
    }))
  }

  handleToDataSheet = (ruleId: number) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/sunnyrules/distributeruleslist/distributeruledetail/datasheet',
      state: {
        rulesId: ruleId
      }
    }))
  }

  handleDeleteRule = (rulesId: string) => {
    if (rulesId) {
      const {dispatch} = this.props;
      dispatch({
        type: 'distributeRulesDetailModel/delPublicRules',
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

    const { distributeRulesDetailModel: { rulesDetail } } = this.props;
    return (
      <Descriptions style={{marginTop: 10, width: 400, }} size='default' bordered={false}  column={1}>
        <Descriptions.Item label="规则名称">{rulesDetail.name}<Button type="link" onClick={() => this.handleToDataSheet(rulesDetail.id)}>数据明细<RightOutlined /></Button></Descriptions.Item>
        <Descriptions.Item label="选择渠道">{rulesDetail.channel_name}</Descriptions.Item>
        <Descriptions.Item label={"数据分配系数" + (rulesDetail.is_copy==1?"（全部分配）":"（系数总计为1）")} >
          <Descriptions style={{marginLeft: 60, marginTop: 10, display: 'block', }} size="small" bordered={false}  column={2} >
            <Descriptions.Item label="喜铺">{rulesDetail.is_copy==1?"100":rulesDetail.percentage_xp}%</Descriptions.Item>
            <Descriptions.Item label="对应渠道">{rulesDetail.channel_xp_name}</Descriptions.Item>
            <Descriptions.Item label="蘭">{rulesDetail.is_copy==1?"100":rulesDetail.percentage_lan}%</Descriptions.Item>
            <Descriptions.Item label="对应渠道">{rulesDetail.channel_lan_name}</Descriptions.Item>
            <Descriptions.Item label="尼克">{rulesDetail.is_copy==1?"100":rulesDetail.percentage_nk}%</Descriptions.Item>
            <Descriptions.Item label="对应渠道">{rulesDetail.channel_nk_name}</Descriptions.Item>
          </Descriptions>
        </Descriptions.Item>
        <Descriptions.Item label="规则状态">{rulesDetail.status==1?"有效":"失效"}</Descriptions.Item>
        <Descriptions.Item label="描述说明">{rulesDetail.remark&&rulesDetail.remark.length>0?rulesDetail.remark:"未填写"}</Descriptions.Item>
        <Descriptions.Item label="创建人">{rulesDetail.create_by?rulesDetail.create_by:"未知"}</Descriptions.Item>
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
    const { distributeRulesDetailModel: { rulesDetail } } = this.props;
    return (
      <div style={this.buttonContainerStyle}>
          <Button type="danger" style={this.negButtonStyle} disabled={!rulesDetail.id} onClick={()=>this.handleDeleteRule(rulesDetail.id.toString())}>删除</Button>
          <Button type="primary" style={this.posButtonStyle} disabled={!rulesDetail.id} onClick={() => this.handleEditRule(rulesDetail.id.toString())}>编辑</Button>
          {/* <Button style={this.posButtonStyle} onClick={() => this.handleToDataSheet(rulesDetail.id)}>数据明细</Button> */}
      </div>
  );
  }

  render() {
    const { loading } = this.props;

    return (
      <PageHeaderWrapper title='规则详情'>

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
export default Form.create<DistributeRuleDetailProps>()(DistributeRuleDetail);
