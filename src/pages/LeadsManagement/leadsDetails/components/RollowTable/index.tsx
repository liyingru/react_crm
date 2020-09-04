import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Table } from 'antd';
import { FollowData } from '../../data'
import PicBrowser from '@/components/PicBrowser';


const columns = [
  {
    title: "婚礼日期",
    dataIndex: "weddingDate",
    key: "weddingDate",
  },
  {
    title: "婚礼风格",
    dataIndex: "weddingStyle",
    key: "weddingStyle"
  },
  {
    title: "预定酒店",
    dataIndex: "hotel",
    key: "hotel"
  },
  {
    title: "婚礼桌数",
    key: "deskNum",
    dataIndex: "deskNum",

  },
  {
    title: "预算",
    key: "budget",
    dataIndex: "budget",

  },
  {
    title: "跟进标签",
    key: "followTag",
    dataIndex: "followTag",

  },
  {
    title: "跟进时间",
    dataIndex: "followTime",
    key: "followTime",
  },
  {
    title: "通话时长",
    dataIndex: "callDuration",
    key: "callDuration"
  },
  {
    title: "单据类型",
    dataIndex: "followType",
    key: "followType"
  },
  {
    title: "跟进结果",
    key: "results",
    dataIndex: "results",

  }, {
    title: "沟通内容",
    key: "comment",
    dataIndex: "comment",

  }, {
    title: "下次跟进时间",
    key: "nextContactTime",
    dataIndex: "nextContactTime",

  },
  {
    title: "跟进人",
    key: "followUser",
    dataIndex: "followUser",
  },
  {
    title: "文件",
    key: "attachment",
    dataIndex: "attachment",
    render: (attachment: string) => {
      console.log(attachment);
      return (
        <div className={styles.pingzheng} hidden={!attachment}>
          <PicBrowser wt={50} ht={50} imgSrc={attachment} />
        </div>
      )
    },
  }
];

interface LeadRntryFollowProps extends FormComponentProps {
  getFollowList: Function;
  customerFollowInfo: FollowData;
}

class LeadRntryFollow extends Component<LeadRntryFollowProps>{

  onChengPage = (page, pageSize) => {
    const { getFollowList } = this.props;
    getFollowList(page);
  }

  render() {

    const { customerFollowInfo } = this.props;
    const { total, rows } = customerFollowInfo;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Table
          scroll={{ x: 'max-content' }}
          size={"middle"}
          title={() => '跟进记录'}
          columns={columns}
          dataSource={rows}
          pagination=
          {{
            total: total,
            onChange: this.onChengPage,
            pageSize: 10,
          }}

        />
      </div>
    );

  }
}


export default LeadRntryFollow;
