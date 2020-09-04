import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch, Fragment } from 'react';
import { Form, Table, message, List, Modal, Spin, Dropdown, Empty, Button } from 'antd';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import styles from './style.less'
import { DownloadOutlined } from '@ant-design/icons';
import HeaderDropdown from '../HeaderDropdown';
import classNames from 'classnames';
import { router } from 'umi';
import eventEmitter from '@/utils/Evt';

interface ImportData {
  id: number;
  name: string;
  start_time: string;
  status: string;
  count: number;
  status_show: string;
}

interface CustomerImportProps extends FormComponentProps {

}

interface CustomerImportState {
  importList: ImportData[];
  loading: boolean;
  modalVisible: boolean;
}

class ImportListModal extends Component<CustomerImportProps, CustomerImportState> {

  cancel:any

  constructor(props: Readonly<CustomerImportProps>) {
    super(props)
  }

  state: CustomerImportState = {
    importList: [],
    loading: false,
    modalVisible: false,
  }

  eventModalVisible = () => {
    this.setModalVisible(true)
  }

  componentDidMount(){
    eventEmitter.addListener('importList',this.eventModalVisible)
  }
  componentWillUnmount(){
    eventEmitter.removeListener('importList',this.eventModalVisible)
  }

  requstData = () => {
    this.setState({
      loading: true
    })
    Axios.post(URL.importListToday).then(
      res => {
        if (res.code == 200) {
          this.setState({
            importList: res.data.result.list
          })
        }
        this.setState({
          loading: false
        })
      }).catch(error => {
        this.setState({
          loading: false
        })
      })
  }

  setModalVisible = (visible: boolean) => {
    if(visible == true){
      this.state.importList = []
      this.requstData()
    }
    this.setState({ modalVisible: visible })
  }
  modalClickOk = () => {
    this.setModalVisible(false)
    localStorage.setItem('importActiveKey','refresh')
    router.push({
      pathname: '/passengerImport',
    })
  }

  render() {
    const { importList } = this.state;

    const overlayView = (<div>
      <Spin spinning={this.state.loading} delay={300}>
        <div style={{ padding: 10 }}>
          <div style={{ fontWeight: 'bold' }}>今日导入列表</div>
          <div style={{ marginTop: 10 }}>
            {
              (importList && importList.length > 0) ?
                importList.map(item => (
                  <div style={{ width: 300, paddingTop: 5, paddingBottom: 5, display: 'flex' }}>
                    <div style={{ flexGrow: 1 }}>{item.start_time}</div>
                    <div style={{ flexGrow: 1 }}>{item.name}</div>
                    <div style={{ flexGrow: 1 }}>{item.status_show}</div>
                  </div>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
          </div>
          {
            (importList && importList.length > 0) ?
              <div className={styles.popBottomWrapper}>
                <Button onClick={() => this.setModalVisible(false)}>关闭</Button>
                <Button type='primary' onClick={() => this.modalClickOk()} style={{marginLeft:15}}>查看详情</Button>
              </div> :
              <div className={styles.popBottomWrapper}>
                <Button onClick={() => this.setModalVisible(false)}>关闭</Button>
              </div>
          }
        </div>
      </Spin>
    </div>)
    return (
      <HeaderDropdown
        placement="bottomRight"
        overlay={overlayView}
        overlayClassName={styles.popover}
        trigger={['click']}
        visible={this.state.modalVisible}
        onVisibleChange={this.setModalVisible}>
        <div  className={classNames(`${styles.action}`, { opened: this.state.modalVisible })}>
          <span><DownloadOutlined /></span>         
          <span style={{marginLeft:5}}>导入</span>
        </div>
      </HeaderDropdown>
    );
  };
}
export default Form.create<CustomerImportProps>()(ImportListModal);
