import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Select, Button, Collapse, Timeline } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from '../../LiheProDetail/model';

const { Panel } = Collapse;

interface ConsultState {
  activeKeys: string[],
}

interface CustomerConsultProps {
  onAddNewTask: ()=>void;
  setTaskDone: () => void;
  uploadFile: () => void;
  downloadFile: () => void;
  modifyBenefitAmount: () => void;
}
@connect(
  ({
    LiheProDetail,
    loading,
  }: {
    LiheProDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LiheProDetail,
    loading: loading.models.LiheProDetail,
  }),
)

class CustomerConsult extends Component<CustomerConsultProps, ConsultState > {
    constructor(props: CustomerConsultProps) {
      super(props);
      this.state = {
        activeKeys:['1', '2']
      }
    }

    componentDidMount() {

    }

    onOpenAll = () => {
      const allKeys = ['1', '2'];
      this.setState({
        activeKeys: allKeys
      })
    }

    onCloseAll = () => {
      this.setState({
        activeKeys: []
      })
    }

    onCloseDoneItems = () => {
      const doneItemKeys = ['2'];
      this.setState({
        activeKeys: doneItemKeys
      })
    }

    onChangeCollapse = (keys: string | string[]) => {
      this.setState({
        activeKeys: keys
      })
    }
  
    render() {
      const {setTaskDone, uploadFile, downloadFile, modifyBenefitAmount} = this.props;
      
        return (
            // <Card style={{ width: '100%' }} bordered={false}>
            <div>
              <div style={{display: 'flex'}}>
                <Button type='primary' icon='plus'>新增任务</Button>
                <span style={{flex:1}}/>
                <Button style={{marginLeft:5}} onClick={this.onOpenAll}>展开所有科目</Button>
                <Button style={{marginLeft:5}} onClick={this.onCloseAll}>收起所有科目</Button>
                <Button style={{marginLeft:5}} onClick={this.onCloseDoneItems}>收起已完成科目</Button>
              </div>

              <Collapse defaultActiveKey={['1']} activeKey={this.state.activeKeys} expandIconPosition='right' onChange={this.onChangeCollapse} style={{marginTop:20}}>
                <Panel header="电话邀约（未完成）" key="1">
                  <Timeline mode='left'>
                    <Timeline.Item>
                      <b>2019-05-01</b>
                      <div style={{display:'flex'}} >
                        <b style={{flex:1,lineHeight:'24px',}}>了解用户需求（已完成）</b>
                        <Button size='small' onClick={setTaskDone}>设为已完成</Button>
                        <Button size='small' onClick={modifyBenefitAmount}>填写收款金额</Button>
                        
                      </div>
                      <div style={{background:'#fef6fa', borderColor:'black', borderWidth: '1px', padding:15, marginTop:10}}>打电话给客户，沟通客户需求</div>
                    </Timeline.Item>
                    <Timeline.Item>
                      <b>2019-05-01</b>
                      <div style={{display:'flex'}} >
                        <b style={{flex:1}}>发送初步解决基本需求的《解决方案-筹备步骤》</b>
                        <Button size='small' onClick={uploadFile}>重新上传</Button>
                        <Button size='small' onClick={uploadFile}>上传文件</Button>
                      </div>
                      <div style={{background:'#fef6fa', borderColor:'black', borderWidth: '1px', padding:15, marginTop:10}}>
                        <a onClick={downloadFile}>点击下载《{"这里显示文件名"}》</a>
                      </div>
                    </Timeline.Item>
                  </Timeline>
                </Panel>
                <Panel header="客户咨询（未完成）" key="2">
                  <p></p>
                </Panel>

              </Collapse>
                       
            {/* </Card> */}
            </div>

        );
    }
}
export default CustomerConsult;