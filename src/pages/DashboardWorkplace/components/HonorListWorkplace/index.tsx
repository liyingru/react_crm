import React, { Component } from 'react';
import { Card, Select, Checkbox, Tabs, Table } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { HonorUser, ReqrankingUser, OrderrankingUser } from '../../data.d';
import MedalsGoldSvg from '@/assets/medals_gold.svg';
import MedalsSilverSvg from '@/assets/medals_silver.svg';
import MedalsCopperSvg from '@/assets/medals_copper.svg';
import styles from '../../style.less';
import BaseWorkplace, { BaseWorkplaceProps, BaseWorkplaceState } from '../../components/BaseWorkplace'

const { Option } = Select;
const { TabPane } = Tabs;

interface HonorListWorkplaceState extends BaseWorkplaceState {
  activeKey: ''
}
export interface HonorListWorkplaceProps extends BaseWorkplaceProps {
  honorData?: HonorUser[];
  reqrankingData?: ReqrankingUser[];
  orderrankingData?: OrderrankingUser[];
  onTabChange?: (activeKey: any) => void;
}

const honorColumns = [
  {
    title: '',
    render: (_text: any, _record: any, index: number) => {
      const top = index + 1;
      if (top == 1) {
        return (<img src={MedalsGoldSvg}></img>);
      } else if (top == 2) {
        return (<img src={MedalsSilverSvg}></img>);
      } else if (top == 3) {
        return (<img src={MedalsCopperSvg} ></img >);
      } else {
        return (<span></span >);
      }
    }
  },
  {
    title: '排名',
    render: (_text: any, _record: any, index: number) => <span>{(index + 1).toString()}</span>
  },
  {
    title: '组员',
    dataIndex: 'user_name',
    key: 'user_name',
  },
  {
    title: '通话',
    dataIndex: 'top_duration',
    key: 'top_duration',
  }
]

const reqrankingColumns = [
  {
    title: '',
    render: (_text: any, _record: any, index: number) => {
      const top = index + 1;
      if (top == 1) {
        return (<img src={MedalsGoldSvg}></img>);
      } else if (top == 2) {
        return (<img src={MedalsSilverSvg}></img>);
      } else if (top == 3) {
        return (<img src={MedalsCopperSvg} ></img >);
      } else {
        return (<span></span >);
      }
    }
  },
  {
    title: '排名',
    render: (_text: any, _record: any, index: number) => <span>{(index + 1).toString()}</span>
  },
  {
    title: '组员',
    dataIndex: 'member',
    key: 'member',
  },
  {
    title: '建单量',
    dataIndex: 'req_num',
    key: 'req_num',
  },
  {
    title: '建单率',
    dataIndex: 'create_req_percent',
    key: 'create_req_percent',
  }
]

const orderrankingColumns = [
  {
    title: '',
    render: (_text: any, _record: any, index: number) => {
      const top = index + 1;
      if (top == 1) {
        return (<img src={MedalsGoldSvg}></img>);
      } else if (top == 2) {
        return (<img src={MedalsSilverSvg}></img>);
      } else if (top == 3) {
        return (<img src={MedalsCopperSvg} ></img >);
      } else {
        return (<span></span >);
      }
    }
  },
  {
    title: '排名',
    render: (_text: any, _record: any, index: number) => <span>{(index + 1).toString()}</span>
  },
  {
    title: '组员',
    dataIndex: 'member',
    key: 'member',
  },
  {
    title: '订单量',
    dataIndex: 'order_num',
    key: 'order_num',
  },
  {
    title: '签单率',
    dataIndex: 'sign_order_percent',
    key: 'sign_order_percent',
  }
]

class HonorListWorkplace extends BaseWorkplace<HonorListWorkplaceProps, HonorListWorkplaceState> {
  constructor(props: HonorListWorkplaceProps) {
    super(props);
    this.state = {
      activeKey: 'honor',
      bIndex: 5,
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  componentDidMount() {

  }

  tableTabChange = (activeKey: any) => {
    const { onTabChange } = this.props;
    onTabChange && onTabChange(activeKey);
    this.setState({
      activeKey: activeKey
    });
  };

  userOnChange = (value: SelectValue) => {
    const { onChange } = this.props;
    onChange && onChange(5, value);
  }

  render() {
    const { userList, honorData, showOnlySelf, reqrankingData, orderrankingData, loading } = this.props;
    const { activeKey } = this.state;
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="荣誉榜"
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
          <Tabs type="card" activeKey={activeKey} onChange={this.tableTabChange}>
            <TabPane tab="通话时长排行榜" key="honor">
              <Table columns={honorColumns} dataSource={honorData} pagination={false} style={{ maxHeight: 240, overflowY: 'auto' }} scroll={{ y: 180 }} />
            </TabPane>
            <TabPane tab="建单排行榜" key="reqranking">
              <Table columns={reqrankingColumns} dataSource={reqrankingData} pagination={false} style={{ maxHeight: 240, overflowY: 'auto' }} scroll={{ y: 180 }} />
            </TabPane>
            <TabPane tab="订单排行榜" key="orderranking">
              <Table columns={orderrankingColumns} dataSource={orderrankingData} pagination={false} style={{ maxHeight: 240, overflowY: 'auto' }} scroll={{ y: 180 }} />
            </TabPane>
          </Tabs>
        </Card>
      </Card>
    );
  }
}

export default HonorListWorkplace;
