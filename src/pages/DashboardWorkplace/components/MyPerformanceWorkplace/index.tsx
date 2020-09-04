import React, { Component } from 'react';
import { Card, Select, Checkbox } from 'antd';
import { SelectValue } from 'antd/lib/select';
import CrmChart from '../../components/CrmChart';
import { MyPerformance } from '../../data.d';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;

interface MyPerformanceWorkplaceState extends BaseWorkplaceState {

}
export interface MyPerformanceWorkplaceProps extends BaseWorkplaceProps {
  data: MyPerformance;
}

class MyPerformanceWorkplace extends BaseWorkplace<MyPerformanceWorkplaceProps, MyPerformanceWorkplaceState> {
  constructor(props: MyPerformanceWorkplaceProps) {
    super(props);
    this.state = {
      bIndex: 1,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  userOnChange = (value: SelectValue) => {
    const { onChange } = this.props;
    onChange && onChange(1, value);
  }

  render() {
    const { userList, data, showOnlySelf, loading } = this.props;
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24, minHeight: 100 }}
        title="我的业绩"
        bordered={false}
        extra={
          showOnlySelf ? null :
            < div >
              <Select defaultValue="" value={this.state.userListSelectedValue} style={{ width: 120, marginRight: 10 }} onChange={this.userOnChange} disabled={this.state.userListDisabled}>
                <Option key="all" value="">全部组员</Option>
                {userList && userList.map((user, index) => (
                  <Option key={index} value={user.id} index={index}>{user.name}</Option>
                ))}
              </Select>
              <Checkbox onChange={this.onJustLookAtMeCheckboxChange}>只看自己</Checkbox>
            </div >
        }
        loading={loading}
        bodyStyle={{ padding: 0 }}
      >
        <CrmChart data={data} />
      </Card >
    );
  }
}

export default MyPerformanceWorkplace;
