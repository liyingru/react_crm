import Form, { FormComponentProps } from "antd/lib/form";
import React, { Component } from "react";
import { Tabs, Card, message, Upload, Button, Icon, Radio, Table, Modal, Row, Col, Spin } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { connect } from "dva";
import { StateType } from "./model";
import styles from './style.less';
import { Action, Dispatch } from 'redux';
import URL from "@/api/serverAPI.config";
import { ColumnProps } from "antd/lib/table";
import { ImportLog } from "./data";
import Axios from "axios";
import TextArea from "antd/lib/input/TextArea";

import { LeadsListData, TableListPagination, ReqListData } from "./data";
import RequireDialog from "./RequirementModal";
import LeadsDialog from "./LeadsModal";
import LOCAL from "@/utils/LocalStorageKeys";
import CrmUtil from "@/utils/UserInfoStorage";
import { DownloadOutlined } from "@ant-design/icons";
import eventEmitter from '@/utils/Evt';

const { TabPane } = Tabs;

interface PassengerImportProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<any>
  >;
  loading: boolean;
  passengerImport: StateType;
}

interface PassengerImportState {
  leadsData: LeadsListData;
  reqsData: ReqListData;
  activeKey: string;
  excelId: string;
  value: string;
  loading: boolean;
  uploadModalVisible: boolean;
}

@connect(
  ({
    passengerImport,
    loading,
  }: {
    passengerImport: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    passengerImport,
    loading: loading.models.passengerImport,
  }),
)

class PassengerImport extends Component<PassengerImportProps, PassengerImportState> {

  leadsModal: any;
  reqsModal: any;

  onRefLeads = (ref: any) => {
    this.leadsModal = ref
  }

  onRefReqs = (ref: any) => {
    this.reqsModal = ref
  }

  companyTag = CrmUtil.getCompanyTag()
  companyType = CrmUtil.getCompanyType()
  // noLeadsImport =  this.companyTag == 'XZ' || this.companyTag == 'SEW' || this.companyTag == 'AFE' || this.companyTag == 'BHJY'
  noLeadsImport = this.companyTag != 'DXL'
  noReqsImport = this.companyType == 1 || this.companyType == 2

  // initValue = (this.noLeadsImport && !this.noReqsImport) ? '2' : '1'

  initValue = '1'

  state: PassengerImportState = {
    activeKey: '1',
    leadsData: {
      list: [],
      pagination: {},
    },
    reqsData: {
      list: [],
      pagination: {},
    },
    excelId: '',
    value: this.initValue,
    loading: false,
    uploadModalVisible: false,
  }

  componentWillReceiveProps = (nextProps: any) => {
    const importTag = localStorage ? localStorage.getItem('importActiveKey')?.toString() : '';
    if (importTag && importTag.length > 0) {
      localStorage.setItem('importActiveKey', '')
      this.onTabClick('2')
    }
  }

  column: ColumnProps<ImportLog>[] = [
    {
      title: '导入文件名',
      dataIndex: 'name',
    },
    {
      title: '导入类型',
      dataIndex: 'type',
      render: (text, recoder) => {
        if (text == '1') {
          return <div>线索</div>
        } else if (text == '2') {
          return <div>有效单</div>
        } else {
          return ''
        }
      }
    },
    {
      title: '导入时间',
      dataIndex: 'create_time',
    },
    {
      title: '执行状态',
      dataIndex: 'status',
    },
    {
      title: '导入结果',
      dataIndex: 'status_num',
      render: (text, recoder) => {
        if (text == '1') {
          return <a onClick={() => this.toLeadsPage(recoder)}>查看明细</a>
        } else if (text == '2') {
          return <div style={{ color: 'red' }} onClick={() => this.showPartFailMessage(recoder, '失败原因')}>失败原因</div>
        } else if (text == '3') {
          return <div style={{ color: 'red' }} onClick={() => this.showPartFailMessage(recoder, '部分失败原因')}>部分失败原因</div>
        } else if (text == '4') {
          return <div>请等待...</div>
        } else if (text == '5') {
          return <div>请等待...</div>
        } else {
          return ''
        }
      }
    },
    {
      title: '明细',
      dataIndex: 'res_txt',
    },
    {
      title: '操作人',
      dataIndex: 'user_name',
    },
  ];

  showFailMessage = (bean: ImportLog) => {
    Modal.error({
      title: '失败原因',
      content: (
        <div style={{ minHeight: 20 }}>{bean.reason}</div>
      ),
      centered: true,
      onOk() { },
    });
  }

  showPartFailMessage = (bean: ImportLog, name: string) => {
    let jsondata = bean.json_data
    let colums = [{
      title: '错误定位',
      dataIndex: 'row',
      width: 120,
    }, {
      title: '电话',
      dataIndex: 'phone',
      width: 120,
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (text) => {
        return (
          <div>
            {
              text == 200 ? '成功' : '失败'
            }
          </div>
        )
      }
    }, {
      title: '原因',
      dataIndex: 'msg',
    }]
    Modal.error({
      title: <div>导入文件：{bean.name}</div>,
      width: 700,
      content: (
        <div>
          <div>导入结果：{bean.res_txt}</div>,
          <Table
            scroll={{ x: 'max-content', y: 'max-content' }}
            size="small"
            columns={colums}
            dataSource={jsondata} />
        </div>
      ),
      centered: true,
      onOk() { },
    });
  }

  toLeadsPage = (bean: ImportLog) => {
    if (bean.type == '1') {
      this.state.excelId = bean.id
      this.leadsModal.setModalVisible(true)
      this.requestLeads({ page: 1, pageSize: 10, excelId: this.state.excelId })
    } else if (bean.type == '2') {
      this.state.excelId = bean.id
      this.reqsModal.setModalVisible(true)
      this.requestReqs({ excelLogId: this.state.excelId })
    }
  }

  onTabClick = (activeKey: string) => {
    if (activeKey == '2') {
      this.requestData()
    }
    this.setState({
      activeKey: activeKey
    })
  }

  requestData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'passengerImport/importLog'
    })
  }

  customRequest = (info: any) => {
    const param = new FormData();
    param.append('type', this.state.value)
    param.append("file", info.file);
    const config = {
      headers: { "Content-Type": "multipart/form-data" }
    };
    let url = URL.importExcel;
    this.setState({
      loading: true
    });
    Axios.post(url, param, config).then(res => {
      if (res.code == 200) {
        this.setState({ uploadModalVisible: true })
        this.requestData()
      }
      this.setState({
        loading: false
      })
    });
  };

  handleStandardTableChange = (pagination: Partial<TableListPagination>) => {
    const params = {}
    params['page'] = pagination.current;
    params['pageSize'] = pagination.pageSize;
    params['excelId'] = this.state.excelId;
    this.requestLeads(params)
  }

  requestLeads = (params: any) => {
    this.setState({
      loading: true
    });
    Axios.post(URL.leadsList, params).then(response => {
      if (response.code == 200) {
        let pagination = {
          total: response.data.result.count,
          pageSize: response.data.result.page_size,
          current: params ? params.page : 1,
        }
        let fetchData = {
          'list': response.data.result.data,
          'pagination': pagination,
        };
        this.setState({
          loading: false,
          leadsData: fetchData
        })
      }
    });
  }

  handleRequireTabChange = (pagination: Partial<TableListPagination>) => {
    // const params = {}
    // params['excelLogId'] = this.state.excelId;
    // this.requestReqs(params)
  }

  requestReqs = (params: any) => {
    this.setState({
      loading: true
    });
    Axios.post(URL.reqImportList, params).then(response => {
      if (response.code == 200) {
        let list = response.data.result
        let pagination = {
          total: list?.length,
          pageSize: 10,
          current: 1,
        }
        let reqData = {
          'list': list,
          'pagination': pagination,
        };
        this.setState({
          loading: false,
          reqsData: reqData
        })
      }
    });
  }

  downloadFile = (type: number) => {
    Axios.post(URL.downloadUrl, { type: type }).then(response => {
      if (response.code == 200) {
        let urlEnd: string = response.data.result
        console.log('urlEnd', urlEnd)
        if (urlEnd) {
          let name = urlEnd.substring(urlEnd.lastIndexOf('/'))
          this.openDownload('http://gcrmapi.hunli.baihe.com' + urlEnd, name)
        }
      }
    });
  }

  openDownload = (url: string, saveName: string) => {
    var a = document.createElement('a');
    a.setAttribute("href", url);
    a.setAttribute("download", saveName);
    a.click();
  }


  onImportChange = (e: any) => {
    this.setState({
      value: e.target.value,
    });
  }

  onUploadModeSure = () => {
    this.setUploadVisible(false)
    eventEmitter.emit('importList')
  }
  setUploadVisible = (visible: boolean) => {
    this.setState({ uploadModalVisible: visible })
  }

  /**
   * 业务线        上传线索   上传需求单  上传客资
   * 北京                                 yes
   * 道喜啦          yes
   * 喜庄+塞尔维                yes
   * 蜜糖            yes        yes
   * 埃菲尔                     yes
   * 百合佳宴                   yes
   */
  render() {
    const { importLog } = this.props.passengerImport;
    const { loading } = this.props;
    const { leadsData, reqsData } = this.state;

    return (
      <PageHeaderWrapper>
        <Spin spinning={this.state.loading}>
          <Card bordered={false} style={{ minHeight: 550 }}>
            <Tabs defaultActiveKey="1" activeKey={this.state.activeKey} onChange={this.onTabClick} animated={false}>
              <TabPane tab="上传导入数据" key="1">
                <div className={styles.alertTextTitle}>注意事项：</div>
                <div className={styles.alertTextContent}>1）模版中的表头不可更改，表头行不可删除</div>
                <div className={styles.alertTextContent}>2）除必填的列以外，不需要的列可以删除</div>
                <div className={styles.alertTextContent}>3）单次导入的数据不超过1000条</div>
                <div style={{ display: 'flex', marginTop: 40 }}>
                  <div style={{ fontWeight: 'bold' }}>下载数据模板</div>

                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                    <Radio.Group onChange={this.onImportChange} value={this.state.value}>
                      <Radio value='1'>导入线索</Radio>
                    </Radio.Group>
                    <a onClick={() => this.downloadFile(1)} style={{ marginTop: 10 }}>下载线索数据模板</a>
                  </div>

                  {/* {
                    this.noLeadsImport ? '' :
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                        <Radio.Group onChange={this.onImportChange} value={this.state.value}>
                          <Radio value='1'>导入线索</Radio>
                        </Radio.Group>
                        <a onClick={() => this.downloadFile(1)} style={{ marginTop: 10 }}>下载线索数据模板</a>
                      </div>
                  }
                  {
                    this.noReqsImport ? '' :
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                        <Radio.Group onChange={this.onImportChange} value={this.state.value}>
                          <Radio value='2'>导入需求单</Radio>
                        </Radio.Group>
                        <a onClick={() => this.downloadFile(2)} style={{ marginTop: 10 }}>下载需求单数据模板</a>
                      </div>
                  } */}
                </div>
                <div style={{ display: 'flex', marginTop: 40 }}>
                  <div style={{ fontWeight: 'bold' }}>导入文件</div>
                  <Upload customRequest={this.customRequest} showUploadList={false}>
                    <Button style={{ marginLeft: 20 }}><Icon type="upload" />上传文件</Button>
                  </Upload>
                </div>
              </TabPane>
              <TabPane tab="查看导入数据" key="2">
                <Table style={{ marginTop: 10 }}
                  size='small'
                  columns={this.column}
                  dataSource={importLog}
                  pagination={false}
                />
              </TabPane>
            </Tabs>
            <LeadsDialog onRef={this.onRefLeads} loading={loading} data={leadsData} handleStandardTableChange={this.handleStandardTableChange}></LeadsDialog>
            <RequireDialog onRef={this.onRefReqs} loading={loading} data={reqsData} handleStandardTableChange={this.handleRequireTabChange}></RequireDialog>

            <Modal
              title='系统提示'
              visible={this.state.uploadModalVisible}
              centered
              destroyOnClose={true}
              okText='立即查看'
              cancelText='暂不查看'
              onOk={this.onUploadModeSure}
              onCancel={() => this.setUploadVisible(false)}>
              <div>上传成功，导入结果可以在右上方<DownloadOutlined />查看本次导入进度</div>
            </Modal>
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<PassengerImportProps>()(PassengerImport);
