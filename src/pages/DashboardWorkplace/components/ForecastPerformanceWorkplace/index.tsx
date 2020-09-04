import React, { Component } from 'react';
import { Card, Select, Checkbox, Row, Col, Divider, Empty } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { ForecastPerformance } from '../../data.d';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;
interface ForecastPerformanceWorkplaceState extends BaseWorkplaceState {

}
export interface ForecastPerformanceWorkplaceProps extends BaseWorkplaceProps {
  data: ForecastPerformance;
}

class ForecastPerformanceWorkplace extends BaseWorkplace<ForecastPerformanceWorkplaceProps, ForecastPerformanceWorkplaceState> {
  constructor(props: ForecastPerformanceWorkplaceProps) {
    super(props);
    this.state = {
      bIndex: 4,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  userOnChange = (value: SelectValue) => {
    const { onChange } = this.props;
    onChange && onChange(4, value);
  }

  render() {
    const { userList, data, showOnlySelf, loading } = this.props;
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="预测业绩"
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
              <Col span={8}>预测签单数</Col>
              <Col span={8}>预测签单金额</Col>
              <Col span={8}>计划回款金额</Col>
            </Row>
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={8}>{data.salesTarget && data.salesTarget}</Col>
                <Col span={8}>{data.planReceivablesAmount && data.planReceivablesAmount}</Col>
                <Col span={8}>{data.actualReceivablesAmount && data.actualReceivablesAmount}</Col>
              </Row>
              <Divider />
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col><span style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>跟进进度</span></Col>
              </Row>
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={8}>联系次数</Col>
                <Col span={8}>联系时长</Col>
                <Col span={8}>跟进时长</Col>
              </Row>
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={8}>{data.contactCount && data.contactCount}</Col>
                <Col span={8}>{data.contactDuration && data.contactDuration}</Col>
                <Col span={8}>{data.followCount && data.followCount}</Col>
              </Row></div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Card>
      </Card >
    );
  }
}

export default ForecastPerformanceWorkplace;
