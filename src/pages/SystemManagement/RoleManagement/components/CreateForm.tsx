import { Form, Input, Modal, Row, Col, } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { RoleData } from '../data';

const FormItem = Form.Item;

export interface SimpleOption {
  value: string;
  text: string;
}

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue:any) => void;
  handleUpdate: (fieldsValue:any) => void;
  handleModalVisible: () => void;
  handleUpdateModalVisible: () => void;
  values?: Partial<RoleData>|undefined;
}

class CreateForm extends Component<CreateFormProps> {

  okHandle = () => {
    const { values, form, handleAdd, handleUpdate } = this.props;
    let data = form.getFieldsValue;
    console.log("fields values = " + JSON.stringify(data));
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if(values) {
        fieldsValue = {
          ...fieldsValue,
          id: values.id
        }
        handleUpdate(fieldsValue);
      } else {
        handleAdd(fieldsValue);
      }
      
    });
  };

  render() {
    const { form, modalVisible, handleModalVisible, handleUpdateModalVisible, values } = this.props;
    const {getFieldDecorator} = form;
    
    return (
      <Modal
        width="40%"
        destroyOnClose
        title= {values?"编辑角色":"新增角色"} 
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => values?handleUpdateModalVisible():handleModalVisible()}
      >
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="角色名称" style={{width:500}}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '角色名称不能为空！' }],
                  initialValue: values?values.name:"",
                })(<Input placeholder="角色名最长10个中文字符" style={{width:190}} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<CreateFormProps>()(CreateForm);