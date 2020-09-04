import { Form, Input, Modal, Row, Col, Select, Button, DatePicker, Switch } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { AddCompanyParams, TableListItem } from '../data';
import styles from '../style.less'
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const { Option } = Select;

export interface FormValueType extends Partial<AddCompanyParams> {

}

export interface SimpleOption {
  value: string;
  text: string;
}

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: FormValueType) => void;
  handleUpdate: (fieldsValue: FormValueType) => void;
  handleModalVisible: () => void;
  handleUpdateModalVisible: () => void;
  values?: Partial<TableListItem> | undefined;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleUpdate, handleModalVisible, handleUpdateModalVisible, values } = props;
  const { getFieldDecorator } = form;

  const okHandle = () => {
    let data = form.getFieldsValue;
    console.log("fields values = " + JSON.stringify(data));
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue = {
        ...fieldsValue,
        status: fieldsValue.status === true ? 1 : fieldsValue.status === false ? 0 : values ? values.status : 0
      }
      if (values) {
        fieldsValue = {
          ...fieldsValue,
          id: values.id
        }
        handleUpdate(fieldsValue);
      } else {
        handleAdd(fieldsValue);
        form.resetFields();
      }

    });
  };

  const onChangeStatus = (checked: boolean) => {
    //console.log("checked = " + checked);
  };

  const scaleOptions: SimpleOption[] = [
    {
      value: '1',
      text: '特大型'
    },
    {
      value: '2',
      text: '大型'
    },
    {
      value: '3',
      text: '中型'
    },
    {
      value: '4',
      text: '小型'
    },

  ];




  return (
    <Modal
      width="40%"
      destroyOnClose
      title={values ? "编辑公司" : "添加公司"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => values ? handleUpdateModalVisible() : handleModalVisible()}
    >
      <div className={styles.tableListForm}>
        <Form >


          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={18}>
              <FormItem label="公司名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入公司名称！' }],
                  initialValue: values ? values.name : "",
                })(<Input placeholder="公司名称" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>


          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={18}>
              <FormItem label="公司简介">
                {getFieldDecorator('intro', {
                  rules: [{ required: true, message: '请输入公司简介！' }],
                  initialValue: values ? values.intro : "",
                })(<TextArea rows={3} placeholder="" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>


          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={18}>
              <FormItem label="公司地址">
                {getFieldDecorator('address', {
                  rules: [{ required: true, message: '请输入公司地址！' }],
                  initialValue: values ? values.address : "",
                })(<Input placeholder="" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>


          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={18}>
              <FormItem label="公司规模">
                {getFieldDecorator('scale', values&&values.scale&&values.scale!=0 ? {
                  initialValue: scaleOptions.filter((item) => {
                    return item.value == values.scale
                  })[0].value,
                } : undefined)(
                  <Select placeholder='请选择公司规模' style={{ width: '100%' }}>
                    {scaleOptions.map(simpleOption => (
                      <Option value={simpleOption.value}>
                        {simpleOption.text}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={18}>
              <FormItem label="状态">
                {getFieldDecorator('status')(
                  <Switch defaultChecked={values ? values.status == 1 : false} onChange={onChangeStatus} size='small' />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={18}>
              <FormItem label="标识缩写">
                {getFieldDecorator('tag', {
                  rules: [{ required: true, message: '请输入标识缩写！' }],
                  initialValue: values ? values.tag : "",
                })(<Input placeholder="" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={18}>
              <FormItem label="明文手机号">
                {getFieldDecorator('showPhone')(
                  <Switch defaultChecked={values ? values.show_phone == 1 : false} onChange={onChangeStatus} size='small' />
                )}
              </FormItem>
            </Col>
          </Row>


        </Form>
      </div>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
