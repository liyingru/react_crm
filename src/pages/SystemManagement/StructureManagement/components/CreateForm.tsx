import { Form, Input, Modal, Row, Col, Select, Switch } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { AddStructureParams, StructureData, CompanyData } from '../data';
import styles from '../style.less'
const FormItem = Form.Item;
const { Option } = Select;

export interface FormValueType extends Partial<AddStructureParams> {

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
  refreshStructuresByCompanyId: (company_id: string) => void;
  companys?: CompanyData[] | undefined;
  companyId?: string;
  structures: StructureData[];
  values?: Partial<StructureData> | undefined;
  companyName?: string | undefined;
}

class CreateForm extends Component<CreateFormProps> {

  hanldeChangeCompany = (value: any) => {
    const { form, refreshStructuresByCompanyId } = this.props
    console.log("on change = " + value);
    refreshStructuresByCompanyId(value);
    form.resetFields(["pid", "name", "status"]);
  }

  okHandle = () => {
    const { values, form, handleAdd, handleUpdate, } = this.props;
    let data = form.getFieldsValue;
    console.log("fields values = " + JSON.stringify(data));
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
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
      }

    });
  };

  onChangeStatus = (checked: boolean) => {
    //console.log("checked = " + checked);
  };

  render() {
    const { form, modalVisible, handleModalVisible, handleUpdateModalVisible, companys, companyId, values, companyName } = this.props;
    const { getFieldDecorator } = form;
    let { structures } = this.props;
    if (structures && structures.length > 0) {
      structures = [
        {
          id: '0',
          name: "无",
          pid: '',
          pname: '',
          status: 0,
          hasChild: 0,
          company_id: ''
        },
        ...structures
      ]
    }

    return (
      <Modal
        width="40%"
        destroyOnClose
        title={values ? "编辑部门" : "添加部门"}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => values ? handleUpdateModalVisible() : handleModalVisible()}
      >
        <div className={styles.tableListForm}>
          <Form >
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="所属公司">
                  {values ?
                    getFieldDecorator('companyId', { initialValue: values.company_id, })(
                      <Select placeholder='请选择所属公司' style={{ width: '100%' }} disabled={true}>
                        <Option value={values.company_id}>
                          {companyName}
                        </Option>
                      </Select>,
                    )
                    :
                    getFieldDecorator('companyId', {
                      rules: [{ required: true, message: '请选择所属公司！' }],
                      initialValue: companyId
                    })(<Select placeholder='请选择所属公司' style={{ width: '100%' }} onChange={this.hanldeChangeCompany} disabled={!(companys&&companys.length>0)} >
                      {companys ? companys.map(company => (
                        <Option value={company.id}>
                          {company.name}
                        </Option>
                      )) : (
                        <Option value={companyId}>
                          {companyName}
                        </Option>
                      )}
                    </Select>)
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="上级部门">
                  {values ?
                    getFieldDecorator('pid', { initialValue: values.pid ? values.pid : '0' })(
                      <Select style={{ width: '100%' }} >
                        {
                          structures && structures.filter((item) => {
                            return item.id != values.id
                          }).map(structure => (
                            <Option value={structure.id}>
                              {structure.name}
                            </Option>
                          ))
                        }
                      </Select>,
                    )
                    :
                    getFieldDecorator('pid')(<Select placeholder='无' style={{ width: '100%' }} >
                      {structures && structures.map(structure => (
                        <Option value={structure.id}>
                          {structure.name}
                        </Option>
                      ))}
                    </Select>)
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="部门名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '部门名称不能为空！' }],
                    initialValue: values ? values.name : "",
                  })(<Input placeholder="请输入部门名称" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="状态">
                  {getFieldDecorator('status')(
                    <Switch defaultChecked={values ? values.status == 1 : false} onChange={this.onChangeStatus} size='small' />
                  )}
                </FormItem>
              </Col>
            </Row>

          </Form>
        </div>
      </Modal>
    );
  }

}

export default Form.create<CreateFormProps>()(CreateForm);