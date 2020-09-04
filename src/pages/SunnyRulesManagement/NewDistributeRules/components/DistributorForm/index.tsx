import React, { Component } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Icon, Popconfirm } from 'antd';
const { Option } = Select;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import Distribution from '../Distribution';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action, compose } from 'redux';
import { StateType, ReceiverUserData, ReceiverGroupData, Channel3Company } from '../../model';
import { connect } from 'dva';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Data } from '@/pages/SunnyRulesManagement/RuleDetail/data';
import { ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { RulesDetail } from '@/pages/SunnyRulesManagement/DistributeRuleDetail/data';

interface DistributorFormProps extends FormComponentProps {
  form:WrappedFormUtils<any>;
  channels: Channel3Company;
  editValue?: RulesDetail;
  disabled?: boolean;
}

interface DistributorFormState {
  isReadyForEdit: boolean;
  xpPercent: number;
  lanPercent: number;
  ncPercent: number;
  xpAvaliblePercent: number;
  lanAvaliblePercent: number;
  ncAvaliblePercent: number;
}

@connect(
  ({
    newRuleModel,
    loading,
  }: {
    newRuleModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newRuleModel,
    loading: loading.models.newRuleModel,
  }),
)
class DistributorForm extends Component<DistributorFormProps, DistributorFormState>{
  constructor(props: any) {
    super(props);
    this.state = {
      isReadyForEdit: false,
      xpPercent: 40,
      lanPercent: 30,
      ncPercent: 30,
      xpAvaliblePercent: 40,
      lanAvaliblePercent: 30,
      ncAvaliblePercent: 30,
    };
  }

  componentDidMount() {
    const editValue = this.props.editValue;
    if(editValue) {
      // 编辑-初始值回显-是否设置本流程
      const xpPercent = editValue.percentage_xp;
      const lanPercent = editValue.percentage_lan;
      const ncPercent = editValue.percentage_nk;

      

      this.setState({
        xpPercent,
        lanPercent,
        ncPercent,
        xpAvaliblePercent: xpPercent,
        lanAvaliblePercent: lanPercent,
        ncAvaliblePercent: ncPercent,
      }, ()=> {
        this.setState({
          isReadyForEdit:true,
        })
      });
    } else {
      this.setState({
        isReadyForEdit: true,
      })
    }
  }

  handleChangeXPpercent = (value: number | undefined) => {
    const {lanPercent, ncPercent} = this.state;
    const xpAvaliblePercent = 100 - lanPercent - ncPercent;
    this.setState({
      xpAvaliblePercent,
      xpPercent: value||0,
    })
  }
  handleChangeLANpercent = (value: number | undefined) => {
    const {xpPercent, ncPercent} = this.state;
    const lanAvaliblePercent = 100 - ncPercent - xpPercent;
    this.setState({
      lanAvaliblePercent,
      lanPercent: value||0,
    })
  }
  handleChangeNCpercent = (value: number | undefined) => {
    const {xpPercent, lanPercent} = this.state;
    const ncAvaliblePercent = 100 - lanPercent - xpPercent;
    this.setState({
      ncAvaliblePercent,
      ncPercent: value||0,
    })
  }


  renderForm = () => {
    const { disabled, form:{getFieldDecorator}, channels, editValue } = this.props;

    return (
      <div className={styles.tableListForm} style={{marginLeft: -40}}>
       
        <Form.Item label="喜铺" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{ display: 'inline-block', width: 70 }}
          >
            {disabled ? (
              <InputNumber
                style={{width:70}}
                formatter={value => `${value}%`}
                disabled={true}
                value={100}
              />
            ) : getFieldDecorator('percentageXp',
              { 
                rules: [{ required: true }],
                initialValue: this.state.xpPercent
              })(
                <InputNumber
                  style={{width:70}}
                  min={0}
                  step={10}
                  max={this.state.xpAvaliblePercent}
                  formatter={value => `${value}%`}
                  parser={value => value ? value.replace('%', '') : ''}
                  onChange={this.handleChangeXPpercent}
                />
              )}
          </Form.Item>
          <span className='sub-label-span'>对应渠道：</span>
          <Form.Item
            style={{ display: 'inline-block' }}
          >
            {getFieldDecorator('channelXp',
              { 
                rules: [{ required: true, message: "请选择对应渠道" }],
                initialValue: editValue?editValue.channel_xp.toString():undefined,
              })(
                <Select
                  style={{width:200}}
                  placeholder="请选择对应渠道"
                  showSearch
                  optionFilterProp="children"
                >
                  {
                    channels.xp?.map(channel => (
                    <Option value={channel.value.toString()} key={channel.value}>{channel.label}</Option>
                    ))
                  }
                </Select>
              )}
          </Form.Item>
        </Form.Item>

        <Form.Item label="蘭" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{ display: 'inline-block', width: 70 }}
          >
            {disabled ? (
              <InputNumber
                style={{width:70}}
                formatter={value => `${value}%`}
                disabled={true}
                value={100}
              />
            ) : getFieldDecorator('percentageLan',
              { 
                rules: [{ required: true }],
                initialValue: this.state.lanPercent
              })(
                <InputNumber
                  style={{width:70}}
                  min={0}
                  step={10}
                  max={this.state.lanAvaliblePercent}
                  formatter={value => `${value}%`}
                  parser={value => value ? value.replace('%', '') : ''}
                  onChange={this.handleChangeLANpercent}
                />
              )}
          </Form.Item>
          <span className='sub-label-span'>对应渠道：</span>
          <Form.Item
            style={{ display: 'inline-block'}}
          >
            {getFieldDecorator('channelLan',
              { 
                rules: [{ required: true, message: "请选择对应渠道" }],
                initialValue: editValue?editValue.channel_lan.toString():undefined,
              })(
                <Select
                  style={{width:200}}
                  placeholder="请选择对应渠道"
                  showSearch
                  optionFilterProp="children"
                >
                  {
                    channels.lan?.map(channel => (
                    <Option value={channel.value.toString()} key={channel.value}>{channel.label}</Option>
                    ))
                  }
                </Select>
              )}
          </Form.Item>
        </Form.Item>

        <Form.Item label="尼克" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{ display: 'inline-block', width: 70 }}
          >
            { disabled ? (
              <InputNumber
                style={{width:70}}
                formatter={value => `${value}%`}
                disabled={true}
                value={100}
              />
            ) : getFieldDecorator('percentageNk',
              { 
                rules: [{ required: true }],
                initialValue: this.state.ncPercent
              })(
                <InputNumber
                  style={{width:70}}
                  min={0}
                  step={10}
                  max={this.state.ncAvaliblePercent}
                  formatter={value => `${value}%`}
                  parser={value => value ? value.replace('%', '') : ''}
                  onChange={this.handleChangeNCpercent}
                />
              )}
          </Form.Item>
          <span className='sub-label-span'>对应渠道：</span>
          <Form.Item
            style={{ display: 'inline-block' }}
          >
            {getFieldDecorator('channelNk',
              { 
                rules: [{ required: true, message: "请选择对应渠道" }],
                initialValue: editValue?editValue.channel_nk.toString():undefined,
              })(
                <Select
                  style={{width:200}}
                  placeholder="请选择对应渠道"
                  showSearch
                  optionFilterProp="children"
                >
                  {
                    channels.nk?.map(channel => (
                    <Option value={channel.value.toString()} key={channel.value}>{channel.label}</Option>
                    ))
                  }
                </Select>
              )}
          </Form.Item>
        </Form.Item>
        

      </div>
    )
  }


  render() {
    const {isReadyForEdit} = this.state;
    if(!isReadyForEdit) {
      return null;
    }
    return this.renderForm();
  }
}
export default Form.create<DistributorFormProps>()(DistributorForm);