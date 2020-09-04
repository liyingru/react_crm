import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps, Alert } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data';

import {FormValueType } from './CreateForm';

export interface TransformFormProps extends FormComponentProps {
  handleTransformModalVisible: (flag?: boolean, record?: TableListItem) => void;
  handleTransform: (values: FormValueType) => void;
  visible: boolean;
  values: TableListItem;
  options: TableListItem[];
}

const FormItem = Form.Item;
const { Option } = Select;

export interface TransformFormState {
}

class TransformForm extends Component<TransformFormProps, TransformFormState> {
  static defaultProps = {
    handleTransform: () => {},
    handleTransformModalVisible: () => {},
    values: {},
    options:[],
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: TransformFormProps) {
    super(props);

    this.state = {
      
    };
  }

  handleOk = () => {
    const {form, handleTransform } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleTransform(fieldsValue);
      
    });
  };

  render() {
    const { form, visible, handleTransformModalVisible, values, options } = this.props;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="员工数据交接"
        visible={visible}
        onCancel={() => handleTransformModalVisible(false, values)}
        afterClose={() => handleTransformModalVisible()}
        onOk={() => this.handleOk()}
      >

        <Alert
          message="重要提示："
          description={values.name + "负责和协作的所有线索/客户/商机/合同将被转移给新用户，其他数据（工作报告等）不会被转移。"}
          type="warning"
          showIcon
          />
        
        <FormItem key="toId" {...this.formLayout} label="负责的数据交接给">
          {form.getFieldDecorator('toId')(
            <Select style={{ width: '100%' }} placeholder="请选择用户">
              {
                options.filter(item=> {
                  return item.id != values.id
                }).map(item => <Option value={item.id}>{item.name}</Option>)
              }
            </Select>,
          )}
        </FormItem>
        <FormItem key="toId2" {...this.formLayout} label="协作的数据交接给">
          {form.getFieldDecorator('toId2')(
            <Select style={{ width: '100%' }} placeholder="请选择用户">
              {
                options.filter(item=> {
                  return item.id != values.id
                }).map(item => <Option value={item.id}>{item.name}</Option>)
              }
            </Select>,
          )}
        </FormItem>


      </Modal>
    );
  }

}

export default Form.create<TransformFormProps>()(TransformForm);
// export default Form.create<>()();
