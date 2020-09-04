import React, { Component } from 'react';
import { Card, Select, Checkbox, Row, Col, Divider, Empty } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { SalesPerformance } from '../../data.d';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;

interface SalesPerformanceWorkplaceState extends BaseWorkplaceState {

}
export interface SalesPerformanceWorkplaceProps extends BaseWorkplaceProps {
  data: SalesPerformance;
}

class SalesPerformanceWorkplace extends BaseWorkplace<SalesPerformanceWorkplaceProps, SalesPerformanceWorkplaceState> {

  constructor(props: SalesPerformanceWorkplaceState) {
    super(props);
    this.state = {
      bIndex: 3,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  userOnChange = (value: SelectValue) => {
    const { onChange } = this.props;
    onChange && onChange(3, value);
  }

  render() {
    const { userList, data, showOnlySelf, loading } = this.props;
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="销售业绩"
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
          {
            data ? <div><Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col span={8}>订单数</Col>
              <Col span={8}>签单总金额</Col>
              <Col span={8}>订单数</Col>
            </Row>
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={8}>{data.orderNum && data.orderNum}</Col>
                <Col span={8}>{data.orderAmount && data.orderAmount}</Col>
                <Col span={8}>{data.receivablesAmount && data.receivablesAmount}</Col>
              </Row>
              <Divider />
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col><span style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>线索统计</span></Col>
              </Row>
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={8}>电脑线索</Col>
                <Col span={8}>微信线索</Col>
                <Col span={8}>客户数</Col>
              </Row>
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={8}>{data.phoneLeadsNum && data.phoneLeadsNum}</Col>
                <Col span={8}>{data.wechatLeadsNum && data.wechatLeadsNum}</Col>
                <Col span={8}>{data.customerNum && data.customerNum}</Col>
              </Row></div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Card>
      </Card>
    );
  }
}

export default SalesPerformanceWorkplace;
