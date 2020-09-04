import { Table, notification, Descriptions, Input, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from "dva";
import React, { Component, Dispatch } from 'react';
import { Action } from "redux";
// import { StateType } from "../../model";
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { StateType } from "../../dxl/model";

// 下载需要
import Downloader from 'js-file-downloader';
import { downloadText } from 'download.js';


const { TextArea } = Input;


interface LeadRntryFollowProps extends FormComponentProps {
  // showStyle == 0 是 客户 其他是有效单子
  reqId: string,
  showStyle: string,
  customerId: string,
  listenrecorder: boolean,
  showqtbutton: boolean,
  reqLiteData: any,

  dispatch: Dispatch<
    Action<
      | 'customerDetailMode/getRecordList'
    >
  >;
  loading: boolean;
  customerDetailMode: StateType;
}

@connect(
  ({
    customerDetailMode,
    loading,
  }: {
    customerDetailMode: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerDetailMode,
    loading: loading.models.customerDetailMode,
  }),
)

class LeadRntryFollow extends Component<LeadRntryFollowProps>{

  constructor(props: LeadRntryFollowProps) {
    super(props);
    this.state = {
      showPlayer: false,
      showPlayerFile: '',
      isFirstListenrecorder: true,
      isEdit: false,
      qaMark: '',
      beforeQaMark: '',

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
        if (is_connect == '1' || is_connect == 1) {
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
            <a onClick={() => { this.openAndPlayMP3(record_file, record) }} >播放</a>
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
    const { dispatch, customerId, listenrecorder, reqLiteData } = this.props;
    var values = {}
    values['id'] = customerId
    values['type'] = 'customer'
    // values['phone'] = phone;
    // values['phone'] = '2/XPtKxkhIOIZ30IS93F/g=='
    dispatch({
      type: 'customerDetailMode/getRecordList',
      payload: values,
    });


    // var tempColums = [...this.columns];
    // tempColums.pop()
    // this.setState({
    //   showColumns: tempColums,
    // })

    if (listenrecorder && listenrecorder) {
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

    this.setState({
      qaMark: this.props?.reqLiteData?.remark ?? '',
      beforeQaMark: this.props?.reqLiteData?.remark ?? ''
    })
  }

  componentWillReceiveProps(nextProps: any) {
    const { listenrecorder, reqLiteData } = nextProps;
    const { isFirstListenrecorder } = this.state;
    if (isFirstListenrecorder) {
      if (listenrecorder && listenrecorder) {
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

    if (reqLiteData?.remark !== this.props.reqLiteData?.remark) {
      this.setState({
        qaMark: reqLiteData?.remark ?? ''
      })
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

  // 开始编辑备注
  editMark = () => {
    this.setState({
      isEdit: true,
    })
  }
  // 取消编辑备注
  editCancle = () => {
    this.setState({
      isEdit: false
    });

    this.setState({
      qaMark: this.state?.beforeQaMark
    })
  }
  // 确定保存备注
  saveMark = () => {
    const text = this.state?.qaMark;
    const reqId = this.props?.reqId?.toString();

    if (reqId?.length > 0) {
      const value = { 'remark': text, 'reqId': reqId };
      Axios.post(URL.updateReqLite, value).then(
        res => {
          if (res.code == 200) {
            message.success('操作成功');
            this.setState({
              isEdit: false,
              qaMark: text,
              beforeQaMark: text
            });
          }
        }
      );
    };
  }
  // 备注变更
  changeMark = (e) => {
    const changeText = e.target.value;
    // console.log(e.target.value);
    this.setState({
      qaMark: changeText
    });
  }

  render() {
    const { customerDetailMode: { qualityInspection, data: { reqLiteData } } } = this.props;
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Table
          scroll={{ x: 'max-content' }}
          size={"middle"}
          columns={this.state?.showColumns}
          dataSource={qualityInspection}
          pagination={false} />


        {this.props?.showStyle === 1 ?
          <div>
            {this.props?.reqLiteData?.qt_result != 0 ? <div>
              {this.props?.showqtbutton == true ?
                <div style={{ marginTop: '20px', width: '100%' }}>
                  <Descriptions>
                    <Descriptions.Item label='质检时间'>{this.props?.reqLiteData?.qt_datetime}</Descriptions.Item>
                    <Descriptions.Item label='质检人'>{this.props?.reqLiteData?.qt_user_name}</Descriptions.Item>
                  </Descriptions>
                  <Descriptions>
                    <Descriptions.Item label='质检结果'> {this.props?.reqLiteData?.qt_result == 2 ? <span style={{ color: 'red' }}>{this.props?.reqLiteData?.qt_result_txt}</span> : <span style={{ color: 'green' }}>{this.props?.reqLiteData?.qt_result_txt}</span>}  </Descriptions.Item>
                  </Descriptions>
                  {this.props?.reqLiteData?.qt_result == 2 ?
                    <Descriptions>
                      <Descriptions.Item label='无效原因'> {this.props?.reqLiteData?.qt_result_reason ?? ''}</Descriptions.Item>
                    </Descriptions> : ''}
                  <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '10px' }}>
                    <div>备注：</div>
                    {this.state?.isEdit === true ?
                      <div>
                        <CheckOutlined style={{ fontSize: '20px' }} onClick={() => {
                          this.saveMark()
                        }} />
                        <CloseOutlined style={{ fontSize: '20px', marginLeft: '10px' }} onClick={() => {
                          this.editCancle()
                        }} />
                      </div>
                      :
                      <EditOutlined style={{ fontSize: '20px' }} onClick={() => { this.editMark() }} />}
                  </div>
                  <TextArea
                    defaultValue={this.props?.reqLiteData?.remark ?? ''}
                    value={this.state?.qaMark}
                    disabled={!this.state?.isEdit}
                    style={{ width: '100%' }}
                    onChange={this.changeMark}
                    placeholder='' />

                  <div style={{ fontWeight: 'bold', marginTop: 10 }}>质检记录：</div>
                  {
                    reqLiteData?.qt_record?.map(item => (
                      <div style={{ marginTop: 10 }}>{item}</div>
                    ))
                  }
                </div>
                : ''}
            </div> : ''}

          </div>
          : ''}

      </div>
    );
  }
}


export default LeadRntryFollow;
