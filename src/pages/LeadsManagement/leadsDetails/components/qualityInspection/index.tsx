import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Table, notification } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model";
// 下载需要
import Downloader from 'js-file-downloader';
import { downloadText } from 'download.js';


interface LeadRntryFollowProps extends FormComponentProps {

  leadId: string;
  listenrecorder: boolean;
  isclaimFlag: boolean;
  dispatch: Dispatch<
    Action<
      | 'leadManagementDetail/getRecordList'
    >
  >;
  loading: boolean;
  leadManagementDetail: StateType;
}

@connect(
  ({
    leadManagementDetail,
    loading,
  }: {
    leadManagementDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    leadManagementDetail,
    loading: loading.models.leadManagementDetail,
  }),
)

class LeadRntryFollow extends Component<LeadRntryFollowProps>{

  constructor(props: LeadRntryFollowProps) {
    super(props);
    this.state = {
      showPlayer: false,
      showPlayerFile: '',
      showColumns: [],
      isFirstListenrecorder: true,
    }
  }


  columns = [
    {
      title: "质检编号",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "联系方式",
      dataIndex: "call_type",
      key: "call_type"
    },
    {
      title: "主叫号码",
      dataIndex: "caller",
      key: "caller"
    },
    {
      title: "联系时间",
      key: "contact_time",
      dataIndex: "contact_time",

    }, {
      title: "是否接通/有回复",
      key: "is_connect",
      dataIndex: "is_connect",
      render: (is_connect: any) => {
        if (is_connect === '1' || is_connect === 1) {
          return (
            <div>是</div>
          );
        } else {
          return (
            <div>否</div>
          );
        }
      },

    }, {
      title: "通话时长（秒）",
      key: "duration",
      dataIndex: "duration",
    },
    {
      title: "服务客服",
      key: "user_name",
      dataIndex: "user_name",
      render: (user_name: string, record: any) => (
        <div>{record?.user_name}-{record?.company_txt}</div>
      )
    },
    {
      title: "操作",
      key: "record_file",
      dataIndex: "record_file",
      fixed: 'right',
      render: (record_file: any, record: any) => {
        if (record?.is_connect === '1' || record?.is_connect === 1) {
          if (record.call_type === '七鱼' || record.call_type === '微信') {

            return (
              <a onClick={() => { this.openDownload(record) }} >聊天记录</a>
            );
          }
          return (
            <a hidden={this.props.isclaimFlag} onClick={() => { this.openAndPlayMP3(record_file, record) }} >播放</a>
          );

        }
        return (
          <div />
        );
      },
      width: 70,
    }
  ];


  componentDidMount() {
    console.log(this.props)
    const { dispatch, listenrecorder, isclaimFlag } = this.props;
    var values = {}
    values['id'] = this.props.leadId
    values['type'] = 'leads'
    dispatch({
      type: 'leadManagementDetail/getRecordList',
      payload: values,
    });


    if (listenrecorder && listenrecorder && isclaimFlag == false) {
      this.setState({
        showColumns: this.columns,
        isFirstListenrecorder: false,
      })
    } else {
      var tempColums = [...this.columns];
      tempColums.pop()
      this.setState({
        showColumns: tempColums,
        isFirstListenrecorder: false,
      })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { listenrecorder, isclaimFlag } = nextProps;
    const { isFirstListenrecorder } = this.state;
    if (isFirstListenrecorder) {
      if (listenrecorder && listenrecorder && isclaimFlag == false) {
        this.setState({
          showColumns: this.columns,
          isFirstListenrecorder: false,
        })
      } else {
        var tempColums = [...this.columns];
        tempColums.pop()
        this.setState({
          showColumns: tempColums,
          isFirstListenrecorder: false,
        })
      }
    }
  }

  openAndPlayMP3 = (recordFile: any, record: any) => {
    const key = `open${Date.now()}`;
    const description = (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <audio src={recordFile} autoPlay={true} controls style={{ width: '100%' }} />
      </div>
    );

    let title = record?.id?.toString() ?? undefined;
    if (title && title.length > 0) {
      title = '质检编号：' + title;
    }

    const message = (
      <div style={{ width: '100%' }}>
        <ul>
          <li style={{ fontSize: 16 }}>通话记录</li>
          <li>{title ?? ''}</li>
          <li>{'服务客服：' + (record?.user_name ?? '') + '-' + (record?.company_txt ?? '')}</li>
          <li>{'联系时间：' + record?.contact_time ?? ''}</li>
        </ul>
      </div>
    );

    notification.open({
      type: undefined,
      style: { width: 500, marginLeft: 385 - 500, },
      message: message,
      description: description,
      duration: 0,
      key
    });
  }

  openDownload = (record: any) => {

    // 测试路径
    // http://121.43.153.58/monitor/sh.ali.7.3/20200610/20200610-172912_N00000008664__918910696923_cc-ali-0-1591781352.130445.mp3
    // http://ck-1255482171.file.myqcloud.com/dxl-1255482171/Guest114419_202006102001.txt

    if (record.call_type === '七鱼' || record.call_type === '微信') {
      // 文本下载 （使用组件下载）
      // 第一个参数是文件名称 第二个参数是文字内容
      const timer = (record?.create_time ?? '聊天记录') + ''
      const recoard_json = record?.recoard_json ?? ''
      const tempS = unescape(recoard_json.replace(/\\/g, "%"));
      let txt = tempS.replace(/%\/\%%n/g, '\r\n')
      if (txt?.length > 3) {
        txt = txt.substr(1,txt.length - 2)
      }
      downloadText(`${timer}.txt`, txt)
    }

    // 音频下载
    //  new Downloader({
    //     url:url
    //   })
  }

  render() {

    const { leadManagementDetail: { qualityInspection } } = this.props;
    console.log(qualityInspection)
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Table
          scroll={{ x: 'max-content' }}
          size={"middle"}
          columns={this.state?.showColumns}
          dataSource={qualityInspection}
          pagination={false} />
      </div>
    );

  }
}


export default LeadRntryFollow;
