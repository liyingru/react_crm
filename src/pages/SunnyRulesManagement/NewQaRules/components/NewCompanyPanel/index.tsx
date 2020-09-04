import React, { Component, ReactNode } from 'react';
import Form from 'antd/es/form';
const FormItem = Form.Item;
import { ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { DeleteOutlined } from '@ant-design/icons';
import { Card, Select, Button, Radio,Input, message, Cascader } from 'antd';

import { WrappedFormUtils } from 'antd/lib/form/Form';

const { Option } = Select;

interface NewCompanyPanelProps {
  companyName: string,
  companyId: string,
  form: WrappedFormUtils<any>,
  channels: ConfigListItem[],
  categories: ConfigListItem[],
  editValue?: {
    company_id: string,
    channel: string,
    category: string
  },
  onDeleteCompany: (companyId:string)=>void;
  onChangeCategorys: (categoryIds: string[], companyId: string) => void;
  onChangeChannels: (categoryIds: string[], companyId: string) => void;
}

interface NewCompanyPanelState {
  isReadyForEdit: boolean,
  initialChannels: string[] | undefined,
  initialCategorys: string[] | undefined,
}

class NewCompanyPanel extends Component<NewCompanyPanelProps, NewCompanyPanelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isReadyForEdit: false,
      initialChannels: undefined,
      initialCategorys: undefined
    };
  }

  componentDidMount( ) {

  }

  componentWillMount() {
    const editValue = this.props.editValue;
    if(editValue) { 
      // 编辑-初始值回显-客资来源
      const initialChannels = editValue.channel?.split(',');
      const initialCategorys = editValue.category?.split(',');

      this.setState({
        initialChannels,
        initialCategorys
      }, () => {
        this.setState({
          isReadyForEdit: true,
        })
      })
    } else {
      this.setState({
        isReadyForEdit: true,
      })
    }
  }


  handleDeleteCompanyPanel = () => {
    const {onDeleteCompany, companyId} = this.props;
    onDeleteCompany(companyId);
  }

  handleChangeChannels = (value: string[]) => {
    const {onChangeChannels, companyId} = this.props;
    onChangeChannels(value, companyId);
  }

  handleChangeCategorys = (value: string[]) => {
    const {onChangeCategorys, companyId} = this.props;
    onChangeCategorys(value, companyId);
  }

  render() {

    const { channels, categories , companyName, companyId, form: {getFieldDecorator}, editValue} = this.props;
    return (
      <Card size="small" bordered={true} title={companyName} style={{ marginTop: 10 }}
        extra={
            <a  onClick={this.handleDeleteCompanyPanel}>
              <DeleteOutlined style={{ fontSize: 15 }} />
            </a>
        }>
        <FormItem label="选择渠道">
          {getFieldDecorator("channelId-"+companyId, { 
            rules: [{ required: true, message:'请选择渠道'}],
            initialValue: this.state.initialChannels,
          })(
            // <Cascader
            //   options={channels}
            //   style={{ width: '100%' }}
            //   // expandTrigger="hover"
            //   displayRender={(label)=>label[label.length - 1]}
            //   onChange={this.handleChangeChannels}
            // />,
            <Select
              mode="multiple"
              allowClear={true}
              optionFilterProp="children"
              style={{ width: '100%' }}
              placeholder="请选择客资来源"
              onChange={this.handleChangeChannels}
            >
              {
                channels.map(channel => (
                  <Option key={channel.value} value={channel.value+""}>{channel.label}</Option>
                ))
              }
            </Select>,
          )}
        </FormItem>
        <FormItem label="包含品类">
          {getFieldDecorator("categorys-"+companyId, { 
            rules: [{ required: true, message:'请选择'}],
            initialValue: this.state.initialCategorys,
          })(
            <Select
              mode="multiple"
              allowClear={true}
              optionFilterProp="children"
              style={{ width: '100%' }}
              placeholder="请选择品类"
              onChange={this.handleChangeCategorys}
            >
              {
                categories.map(category => (
                  <Option key={category.id} value={category.id+""}>{category.name}</Option>
                ))
              }
            </Select>,
          )}
        </FormItem>
      </Card>
    )
  }

}
export default NewCompanyPanel;