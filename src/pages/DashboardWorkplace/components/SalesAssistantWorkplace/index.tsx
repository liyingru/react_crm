import React, { Component } from 'react';
import { Card, Select, Checkbox, Tabs, Row, Col, Empty } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { SalesAssistant } from '../../data.d';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;
const { TabPane } = Tabs;

interface SalesAssistantWorkplaceState extends BaseWorkplaceState {

}
export interface SalesAssistantWorkplaceProps extends BaseWorkplaceProps {
  data: SalesAssistant;
}

class SalesAssistantWorkplace extends BaseWorkplace<SalesAssistantWorkplaceProps, SalesAssistantWorkplaceState> {
  constructor(props: SalesAssistantWorkplaceProps) {
    super(props);
    this.state = {
      bIndex: 2,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  userOnChange = (value: SelectValue) => {
    const { onChange } = this.props;
    onChange && onChange(2, value);
  }

  render() {
    const { userList, data, showOnlySelf, loading } = this.props;
    const leads = "负责客服：";
    const sale = "负责销售：";
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24, height: data ? 414.5 : 300 }}
        title="销售助手"
        bordered={false}
        extra={
          showOnlySelf ? null :
            <div>
              <Select defaultValue="" value={this.state.userListSelectedValue} style={{ width: 120, marginRight: 10 }} onChange={this.userOnChange} disabled={this.state.userListDisabled}>
                <Option key="all" value="">全部组员</Option>
                {userList && userList.map((user, index) => (
                  <Option key={index} value={user.id} index={index}>{user.name}</Option>
                ))}
              </Select>
              <Checkbox onChange={this.onJustLookAtMeCheckboxChange}>只看自己</Checkbox>
            </div>
        }
        loading={loading}
        bodyStyle={{ padding: 0 }}
      >
        <Card className={styles.projectList} style={{ marginBottom: 24 }} bordered={false} loading={loading}>
          <Tabs type="card">
            <TabPane tab="提醒" key="1">
              {
                data ? <div style={{ overflowX: "hidden", overflowY: "auto", height: 240 }}>{data.reminder && data.reminder.length > 0 ? data.reminder.map((remind, index) => (
                  <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} key={index.toString()}>
                    <Col>
                      {remind.message && remind.message}，<span style={{ color: "red" }}>{remind.kefu && leads + remind.kefu} {remind.sale && sale + remind.sale}</span>
                    </Col>
                  </Row>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </TabPane>
            <TabPane tab="近7天回款订单" key="2">
              {
                data ? <div style={{ overflowX: "hidden", overflowY: "auto", height: 240 }}>{data.r7daysOrders && data.r7daysOrders.length > 0 ? data.r7daysOrders.map((order, index) => (
                  <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} key={index.toString()}>
                    <Col>
                      {order.order_time && order.order_time} 订单 【{order.customer_name && order.customer_name}】，计划回款时间{order.plan_receivables_time && order.plan_receivables_time}，<span style={{ color: "red" }}>负责销售：{order.sale && order.sale}</span>
                    </Col>
                  </Row>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </TabPane>
            <TabPane tab="近30天到期订单" key="3">
              {
                data ? <div style={{ overflowX: "hidden", overflowY: "auto", height: 240 }}>{data.r30daysOrders && data.r30daysOrders.length > 0 ? data.r30daysOrders.map((order, index) => (
                  <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} key={index.toString()}>
                    <Col>
                      {order.order_time && order.order_time} 订单 【{order.customer_name && order.customer_name}】，婚期【{order.wedding_day && order.wedding_day}】，未回款，{order.no_receivables_amount && order.no_receivables_amount}，<span style={{ color: "red" }}>负责销售：{order.sale && order.sale}</span>
                    </Col>
                  </Row>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </TabPane>
            <TabPane tab="超时线索" key="4">
              {
                data ? <div style={{ overflowX: "hidden", overflowY: "auto", height: 240 }}>{data.timeoutLeads && data.timeoutLeads.length > 0 ? data.timeoutLeads.map((timeoutLeads, index) => (
                  <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} key={index.toString()}>
                    <Col>
                      {timeoutLeads.time && timeoutLeads.time} 线索 【{timeoutLeads.customer_name && timeoutLeads.customer_name}】，{timeoutLeads.message && timeoutLeads.message}，<span style={{ color: "red" }}>{timeoutLeads.kefu && leads + timeoutLeads.kefu}</span>
                    </Col>
                  </Row>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </TabPane>
            <TabPane tab="超时订单" key="5">
              {
                data ? <div style={{ overflowX: "hidden", overflowY: "auto", height: 240 }}>{data.timeoutOrders && data.timeoutOrders.length > 0 ? data.timeoutOrders.map((timeoutOrders, index) => (
                  <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} key={index.toString()}>
                    <Col>
                      {timeoutOrders.order_time && timeoutOrders.order_time} 订单 【{timeoutOrders.customer_name && timeoutOrders.customer_name}】，{timeoutOrders.message && timeoutOrders.message}，<span style={{ color: "red" }}>{timeoutOrders.sale && sale + timeoutOrders.sale}</span>
                    </Col>
                  </Row>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </TabPane>
          </Tabs>
        </Card>
      </Card >
    );
  }
}

export default SalesAssistantWorkplace;
