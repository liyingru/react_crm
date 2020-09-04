import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
  Radio,
  Modal,
  InputNumber,
  Cascader,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import styles from './style.less';
import AreaSelect from '@/components/AreaSelect';
import { RadioChangeEvent } from 'antd/lib/radio';
import LOCAL from '@/utils/LocalStorageKeys';
import { SelectValue } from 'antd/lib/select';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';
import getUserInfo from '@/utils/UserInfoStorage';
import CrmUtil from '@/utils/UserInfoStorage';
import { ModalProps } from 'antd/lib/modal';
import { RequestEntity } from '@/pages/DemandManagement/demandCommonSea/data';
import { ConnectProps } from '@/models/connect';
import Axios from '@/utils/gcrmhttp';
import URL from '@/api/serverAPI.config';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface DistributeProps extends FormComponentProps, ModalProps {
  items: RequestEntity[];
  onDistributeSuccess: () => void;
  onDistributeCancel: () => void;
  extraParams?: any
}

interface DistributeState {
  distributeConfig: {
    groupConfig: ConfigItem[],
    stuffConfig: ConfigItem[]
  } | undefined;

  distributes: any[];
  distributeInputGroupNum: number,
  distributeInputPeopleNum: number,
  //0为组，1为人名，默认为0
  distributeType: number;
  distributeSelectGroup: ConfigItem[];
  distributeSelectPeople: ConfigItem[];
  distributeInputGroupMap: Map<string, number>;
  distributeInputPeopleMap: Map<string, number>;
}


/**
 * 重新分配（人名和组名，可多选和指定数量）
 */
class DistributeModalAdvanced extends Component<DistributeProps, DistributeState> {

  constructor(props: DistributeProps) {
    super(props);
  }

  componentDidMount() {
    const self = this;
    const param = {
      groupPayload: undefined,
      stuffPayload: undefined
    }
    Axios.post(URL.searchGroup, param.groupPayload).then(responseGroup => {
      if (responseGroup.code === 200) {
        const distributeConfig = {
          groupConfig: responseGroup.data.result,
          stuffConfig: self.state.distributeConfig?.stuffConfig,
        }
        this.setState({
          distributeConfig
        })
      } else {

      }
    });

    Axios.post(URL.searchUser, param.stuffPayload).then(responseStuff => {
      if (responseStuff.code === 200) {
        const distributeConfig = {
          groupConfig: self.state.distributeConfig?.groupConfig,
          stuffConfig: responseStuff.data.result,
        }
        this.setState({
          distributeConfig
        })
      } else {

      }
    });


  }

  componentWillReceiveProps(nextProps: any) {
    const that = this;

  }

  state: DistributeState = {
    distributeConfig: undefined,
    distributes: [],
    distributeInputGroupNum: 0,
    distributeInputPeopleNum: 0,
    distributeType: 0,
    distributeSelectGroup: [],
    distributeSelectPeople: [],
    distributeInputGroupMap: new Map(),
    distributeInputPeopleMap: new Map(),
  };

  restDistributeValues = () => {
    this.setState({
      distributes: [],
      distributeInputGroupNum: 0,
      distributeInputPeopleNum: 0,
      distributeType: 0,
      distributeSelectGroup: [],
      distributeSelectPeople: [],
      distributeInputGroupMap: new Map(),
      distributeInputPeopleMap: new Map(),
    });
  }




  handleDistributeTypeChange = (e: RadioChangeEvent) => {
    this.setState({
      distributeType: e.target.value,
    })
  }

  /**
   * 确定分配按钮
   */
  handleDistributeOk = () => {

    const { items, onDistributeSuccess, extraParams } = this.props;
    if (this.state.distributeType == 0) { // 如果选择的是按组分配
      if (this.state.distributeInputGroupNum == 0) {
        message.error('请填写有效单的分配数量');
        return
      }
      if (this.state.distributeInputGroupNum > items.length) {
        message.error('填写的有效单分配数量不能超过总有效单数');
        return
      }
      if (this.state.distributeInputGroupMap.size == 0) {
        message.error('出现未知异常');
        return
      }
      let id: string = '';
      items.map((value, index) => {
        if (index == 0) {
          id = value.id;
        } else {
          id = id + ',' + value.id;
        }
      });
      let groups: object[] = [];
      this.state.distributeInputGroupMap.forEach((value, key, map) => {
        if (value > 0) {
          const group = { id: key, num: value };
          groups.push(group);
        }
      });
      //分配有效单
      let params = {};
      if (extraParams) {
        params = {
          ...extraParams
        }
      };
      params = {
        ...params,
        reqId: id,
        groups: groups,
      };
      Axios.post(URL.distribute, params).then(res => {
        if (res.code === 200) {
          message.success('已成功分配' + this.state.distributeInputGroupNum + '条有效单');
          this.restDistributeValues(data);
          onDistributeSuccess();
        } else {

        }
      });

    } else {
      if (this.state.distributeInputPeopleNum == 0) {
        message.error('请填写有效单的分配数量');
        return
      }
      if (this.state.distributeInputPeopleNum > items.length) {
        message.error('填写的有效单分配数量不能超过总有效单数');
        return
      }
      if (this.state.distributeInputPeopleMap.size == 0) {
        message.error('出现未知异常');
        return
      }
      let id: string = '';
      items.map((value, index) => {
        if (index == 0) {
          id = value.id;
        } else {
          id = id + ',' + value.id;
        }
      });
      let owners: object[] = [];
      this.state.distributeInputPeopleMap.forEach((value, key, map) => {
        if (value > 0) {
          const owner = { id: key, num: value };
          owners.push(owner);
        }
      });
      //分配有效单
      let params = {};
      if (extraParams) {
        params = {
          ...extraParams
        }
      };
      params = {
        ...params,
        reqId: id,
        owners: owners,
      };
      Axios.post(URL.distribute, params).then(res => {
        if (res.code === 200) {
          message.success('已成功分配' + this.state.distributeInputPeopleNum + '条有效单');
          this.restDistributeValues();
          onDistributeSuccess();
        } else {

        }
      });
    }
  }


  handleDistributeGroupChange = (value: SelectValue[], option: React.ReactElement<any>[]) => {
    let distributeSelectGroup: ConfigItem[] = [];
    let distributeInputGroupMap: Map<string, number> = new Map();
    let distributeInputGroupNum = 0;
    if (option && option.length > 0) {
      option.map(option => {
        const configItem: ConfigItem = { 'id': option.props.value, 'name': option.props.children }
        distributeSelectGroup.push(configItem)
        if (this.state.distributeInputGroupMap.has(option.props.value)) {
          distributeInputGroupMap.set(option.props.value, this.state.distributeInputGroupMap.get(option.props.value));
          distributeInputGroupNum = distributeInputGroupNum + this.state.distributeInputGroupMap.get(option.props.value);
        } else {
          distributeInputGroupMap.set(option.props.value, 0);
        }
      })
    }
    this.setState({
      distributeSelectGroup: distributeSelectGroup,
      distributeInputGroupMap: distributeInputGroupMap,
      distributeInputGroupNum: distributeInputGroupNum,
    });
  }

  handleDistributePeopleChange = (value: SelectValue[], option: React.ReactElement<any>[]) => {
    let distributeSelectPeople: ConfigItem[] = [];
    let distributeInputPeopleMap: Map<string, number> = new Map();
    let distributeInputPeopleNum = 0;
    if (option && option.length > 0) {
      option.map(option => {
        const configItem: ConfigItem = { 'id': option.props.value, 'name': option.props.children }
        distributeSelectPeople.push(configItem)
        if (this.state.distributeInputPeopleMap.has(option.props.value)) {
          distributeInputPeopleMap.set(option.props.value, this.state.distributeInputPeopleMap.get(option.props.value));
          distributeInputPeopleNum = distributeInputPeopleNum + this.state.distributeInputPeopleMap.get(option.props.value);
        } else {
          distributeInputPeopleMap.set(option.props.value, 0);
        }
      })
    }
    this.setState({
      distributeSelectPeople: distributeSelectPeople,
      distributeInputPeopleMap: distributeInputPeopleMap,
      distributeInputPeopleNum: distributeInputPeopleNum,
    });
  }

  render() {
    return this.renderContent();
  }

  renderContent() {
    const { items, visible, onDistributeCancel } = this.props;
    if (items && items.length > 0) {
      return (
        <Modal
          title="有效单分配"
          okText='确认分配'
          cancelText='取消分配'
          visible={visible}
          onOk={this.handleDistributeOk}
          onCancel={() => {
            this.restDistributeValues();
            onDistributeCancel();
          }}
          destroyOnClose={true}>
          <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.handleDistributeTypeChange}>
            <Radio.Button value="0">分配组</Radio.Button>
            <Radio.Button value="1">分组人</Radio.Button>
          </Radio.Group>

          <div style={{
            marginTop: '20px', display: 'flex',
          }} >
            <div>总有效单数：{items.length}条</div>
            <div style={{
              marginLeft: '10px'
            }}>|</div>
            <div style={{
              marginLeft: '10px'
            }}>设置已分配：{this.state.distributeType == 0 ? this.state.distributeInputGroupNum : this.state.distributeInputPeopleNum} 条</div>
          </div>
          {
            <div className={styles.distributeForm}>{this.renderDistribute()}</div>
          }
        </Modal>
      );
    } else {
      return null;
    }

  }

  renderDistribute = () => {
    let groupDisplay;
    let peopleDisplay;
    if (this.state.distributeType == 0) {
      groupDisplay = 'inline'
      peopleDisplay = 'none'
    } else {
      groupDisplay = 'none'
      peopleDisplay = 'inline'
    }
    const {
      distributeConfig,
    } = this.state;
    return (
      <div>
        <div style={{ display: groupDisplay }}>
          <FormItem
            style={{ marginTop: '20px' }}
            label="组名"
            labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
            <Select
              mode="multiple"
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择组名"
              showSearch
              optionFilterProp="children"
              allowClear
              onChange={this.handleDistributeGroupChange}>
              {
                (distributeConfig && distributeConfig.groupConfig && distributeConfig.groupConfig.length > 0) ?
                  distributeConfig.groupConfig.map(config => (
                    <Option value={config.id}>{config.name}</Option>))
                  :
                  null
              }
            </Select>
          </FormItem>
          {
            this.state.distributeSelectGroup.length > 0 ?
              <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
                <Col span={12}>
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>组名</div>
                  }
                </Col>
                <Col span={12}>
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>设置数量</div>
                  }
                </Col>
              </Row>
              :
              null
          }
          {
            this.renderDistributeGroupInput()
          }
        </div>
        <div style={{ display: peopleDisplay }}>
          <FormItem
            style={{ marginTop: '20px' }}
            label="人名"
            labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
            <Select
              mode="multiple"
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择人名"
              showSearch
              optionFilterProp="children"
              allowClear
              onChange={this.handleDistributePeopleChange}>
              {
                (distributeConfig && distributeConfig.stuffConfig && distributeConfig.stuffConfig.length > 0) ?
                  distributeConfig.stuffConfig.map(config => (
                    <Option value={config.id}>{config.name}</Option>))
                  :
                  null
              }
            </Select>
          </FormItem>
          {
            this.state.distributeSelectPeople.length > 0 ?
              <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
                <Col span={12}>
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>人名</div>
                  }
                </Col>
                <Col span={12}>
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>设置数量</div>
                  }
                </Col>
              </Row>
              :
              null
          }
          {
            this.renderDistributePeopleInput()
          }
        </div>
      </div>
    );
  }


  renderDistributeGroupInput = () => {
    return (
      this.state.distributeSelectGroup.length > 0 ?
        this.state.distributeSelectGroup.map((group, index) => (
          <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>{group.name}</div>
              }
            </Col>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>
                  {this.renderDistributeGroupInputNumber(group)}
                </div>
              }
            </Col>
          </Row>
        ))
        :
        null
    );
  }

  renderDistributeGroupInputNumber = (configItem: ConfigItem) => {
    let defaultValue: number | undefined = undefined;
    if (this.state.distributeInputGroupMap.has(configItem.id)) {
      defaultValue = this.state.distributeInputGroupMap.get(configItem.id);
    }
    return (
      <InputNumber min={0} value={defaultValue} onChange={(value: number) => {
        if (this.state.distributeInputGroupMap.has(configItem.id)) {
          this.state.distributeInputGroupMap.set(configItem.id, value);
          let distributeInputGroupNum = 0;
          this.state.distributeInputGroupMap.forEach((value, key, map) => {
            distributeInputGroupNum = distributeInputGroupNum + value;
          });
          this.setState({
            distributeInputGroupNum: distributeInputGroupNum,
          })
        }
      }} />
    );
  }

  renderDistributePeopleInput = () => {
    return (
      this.state.distributeSelectPeople.length > 0 ?
        this.state.distributeSelectPeople.map(group => (
          <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>{group.name}</div>
              }
            </Col>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>
                  {
                    this.renderDistributePeopleInputNumber(group)
                  }
                </div>
              }
            </Col>
          </Row>
        ))
        :
        null
    );
  }

  renderDistributePeopleInputNumber = (configItem: ConfigItem) => {
    let defaultValue: number | undefined = undefined;
    if (this.state.distributeInputPeopleMap.has(configItem.id)) {
      defaultValue = this.state.distributeInputPeopleMap.get(configItem.id);
    }
    return (
      <InputNumber min={0} value={defaultValue} onChange={(value: number) => {
        if (this.state.distributeInputPeopleMap.has(configItem.id)) {
          this.state.distributeInputPeopleMap.set(configItem.id, value);
          let distributeInputPeopleNum = 0;
          this.state.distributeInputPeopleMap.forEach((value, key, map) => {
            distributeInputPeopleNum = distributeInputPeopleNum + value;
          });
          this.setState({
            distributeInputPeopleNum: distributeInputPeopleNum,
          })
        }
      }} />
    );
  }
}

export default Form.create<DistributeProps>()(DistributeModalAdvanced);
