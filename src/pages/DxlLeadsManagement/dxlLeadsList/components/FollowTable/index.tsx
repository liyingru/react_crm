import PicBrowser from '@/components/PicBrowser';
import { CustomerInfoData, FollowData, FollowTime } from '@/pages/LeadsManagement/leadsDetails/data';
import { Form, Table, Tabs } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import styles from './index.less';

const columns = [
  {
    title: "联系时间",
    key: "followTime",
    dataIndex: "followTime",

  },
  {
    title: "联系方式",
    key: "contactWay",
    dataIndex: "contactWay",

  },
  {
    title: "呼叫结果",
    key: "followTag",
    dataIndex: "followTag",

  },
  {
    title: "跟进结果",
    key: "results",
    dataIndex: "results",

  },
  {
    title: "沟通内容",
    key: "comment",
    dataIndex: "comment",

  },
  {
    title: "文件",
    key: "attachment",
    dataIndex: "attachment",
    render: (attachment: string) => {
      console.log(attachment);
      return (
        <div className={styles.pingzheng} hidden={!attachment}>
          {attachment && Object.prototype.toString.call(attachment) === '[object Array]' && (attachment ?
            <div style={{ display: 'flex' }}>
              {
                attachment && attachment?.map((img) => {
                  return (<div style={{ marginLeft: 10, marginTop: 10 }}><PicBrowser wt={25} ht={25} imgSrc={img} /></div>
                  );
                })
              }
            </div>
            :
            <span />)}
        </div>
      )
    },
  },
  {
    title: "下次回访时间",
    key: "nextContactTime",
    dataIndex: "nextContactTime",

  },
  {
    title: "跟进人",
    key: "followUser",
    dataIndex: "followUser",
  },

];

interface FollowTableProps extends FormComponentProps {
  loading: boolean;
  leadsId: string;
  customer: CustomerInfoData;
  followListData: FollowTime[] | undefined;
  //获取跟进列表
  fun_fetchfFollowList: Function;
}

class FollowTable extends Component<FollowTableProps>{


  constructor(props: any) {
    super(props);
    // 初始化
    this.state = {
      tabIndex: 0,
    }
  }


  componentWillReceiveProps(nextProps: any) {
    const { leadsId, customer } = nextProps;
    if (leadsId != this.props?.leadsId && customer.customerId != this.state?.customer?.customerId) {
      this.setState({
        tabIndex: 0
      })
    }

  }



  tabOnChange = (e: string) => {
    const { fun_fetchfFollowList, leadsId, customer } = this.props;

    console.log(e)
    let item = customer?.followData.followTab[e]
    if (item) {
      fun_fetchfFollowList(customer?.customerId, leadsId, item.key)
    } else {
      fun_fetchfFollowList(customer?.customerId, leadsId, '1')
    }
    this.setState({
      tabIndex: e
    })
  }



  render() {
    const { followListData, loading, customer } = this.props;
    const { TabPane } = Tabs;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Tabs activeKey={this?.state?.tabIndex.toString()} type="card" onChange={this.tabOnChange}>
          {customer && customer?.followData?.followTab?.map((item, index) => {
            return (<TabPane tab={item?.val} key={index.toString()}></TabPane>);
          })}
        </Tabs>
        <Table
          scroll={{ x: 'max-content' }}
          size={"middle"}
          columns={columns}
          dataSource={followListData ? followListData : []}
          pagination={false}
          loading={loading}
        />
      </div>
    );

  }
}
export default Form.create<FollowTableProps>()(FollowTable);
