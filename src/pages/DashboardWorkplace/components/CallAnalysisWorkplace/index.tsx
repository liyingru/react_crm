import React, { Component } from 'react';
import { Card, Select, Checkbox, Tabs } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { CallAnalysis } from '../../data.d';
import CrmBarChart from '../../components/CrmBarChart';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;
const { TabPane } = Tabs;
export interface CallAnalysisWorkplaceProps extends BaseWorkplaceProps {
  normalData: CallAnalysis;
  dialoutData: CallAnalysis;
  onTabChange?: (activeKey: any) => void;
}

interface CallAnalysisWorkplaceState extends BaseWorkplaceState {
  activeKey: ''
}
class CallAnalysisWorkplace extends BaseWorkplace<CallAnalysisWorkplaceProps, CallAnalysisWorkplaceState> {
  constructor(props: CallAnalysisWorkplaceProps) {
    super(props);
    this.state = {
      activeKey: 'normal',
      bIndex: 8,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  userOnChange = (value: SelectValue) => {
    const { onChange } = this.props;
    onChange && onChange(8, value);
    this.setState({
      userListSelectedValue: value
    })
  }

  onChange = (activeKey: any) => {
    const { onTabChange } = this.props;
    onTabChange && onTabChange(activeKey);
    this.setState({
      activeKey: activeKey
    });
  };

  render() {
    const { userList, normalData, showOnlySelf, dialoutData, loading } = this.props;
    const { activeKey } = this.state;
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="呼叫分析"
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
          <Tabs type="card" activeKey={activeKey} onChange={this.onChange}>
            <TabPane tab="400电话" key="normal">
              <CrmBarChart data={normalData} type={activeKey} />
            </TabPane>
            <TabPane tab="电话外呼" key="dialout">
              <CrmBarChart data={dialoutData} type={activeKey} />
            </TabPane>
          </Tabs>
        </Card>
      </Card>
    );
  }
}

export default CallAnalysisWorkplace;
