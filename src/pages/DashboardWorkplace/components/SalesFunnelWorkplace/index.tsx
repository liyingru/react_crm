import React from 'react';
import { Card, Select, Checkbox } from 'antd';
import { SalesFunnel } from '../../data.d';
import CrmFunnel from '../../components/CrmFunnel';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;

interface SalesFunnelWorkplaceState extends BaseWorkplaceState {

}
export interface SalesFunnelWorkplaceProps extends BaseWorkplaceProps {
  data: SalesFunnel;
}

class SalesFunnelWorkplace extends BaseWorkplace<SalesFunnelWorkplaceProps, SalesFunnelWorkplaceState> {
  constructor(props: SalesFunnelWorkplaceProps) {
    super(props);
    this.state = {
      bIndex: 6,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  userOnChange = (value: string) => {
    const { onChange } = this.props;
    onChange && onChange(6, value);
  }

  render() {
    const { userList, data, showOnlySelf, loading } = this.props;

    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="销售漏斗"
        bordered={false}
        extra={
          showOnlySelf ? null :
            <div>
              <Select defaultValue="" value={this.state.userListSelectedValue} style={{ width: 120, marginRight: 10 }} onChange={this.userOnChange} disabled={this.state.userListDisabled}>
                <Option key="all" value="">全部组员</Option>
                {userList && userList.map((user, index) => (
                  <Option key={index} value={user.id}>{user.name}</Option>
                ))}
              </Select>
              <Checkbox onChange={this.onJustLookAtMeCheckboxChange}>只看自己</Checkbox>
            </div>
        }
        loading={loading}
        bodyStyle={{ padding: 0 }}
      >
        <CrmFunnel data={data} />
      </Card>
    );
  }
}

export default SalesFunnelWorkplace;
