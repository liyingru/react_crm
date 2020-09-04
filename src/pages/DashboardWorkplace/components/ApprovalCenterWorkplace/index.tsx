import React, { Component } from 'react';
import { Card, Select, Checkbox, Table } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { ApprovalCenterOrder } from '../../data.d';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;

interface ApprovalCenterWorkplaceState extends BaseWorkplaceState {

}
export interface ApprovalCenterWorkplaceProps extends BaseWorkplaceProps {
  data: ApprovalCenterOrder[];
}

const columns = [
  {
    title: '订单编号',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '品类',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '商家',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '申请人',
    dataIndex: 'address',
    key: 'address1',
  },
  {
    title: '操作',
    dataIndex: 'address',
    key: 'address2',
  }
]
class ApprovalCenterWorkplace extends BaseWorkplace<ApprovalCenterWorkplaceProps, ApprovalCenterWorkplaceState> {

  constructor(props: ApprovalCenterWorkplaceState) {
    super(props);
    this.state = {
      bIndex: 7,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  userOnChange = (value: SelectValue) => {
    const { onChange } = this.props;
    onChange && onChange(7, value);
    this.setState({
      userListSelectedValue: value
    })
  }

  render() {
    const { userList, data, showOnlySelf, loading } = this.props;
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="审批中心"
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
          <Table columns={columns} dataSource={data} pagination={false} />
        </Card>
      </Card>
    );
  }
}

export default ApprovalCenterWorkplace;
