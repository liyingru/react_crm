import { Form, Input, Modal, Row, Col, Select, Switch } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { PositionData, CompanyData } from '../data';
import AddStructureParams from "../data";
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
  refreshPositionsByCompanyId: (company_id: string) => void;
  companys?: CompanyData[] | undefined;
  companyId?: string;
  positions: PositionData[] | undefined;
  values?: Partial<PositionData> | undefined;
  companyName?: string | undefined;
}

class CreateForm extends Component<CreateFormProps> {

  hanldeChangeCompany = (value: any) => {
    const { form, refreshPositionsByCompanyId } = this.props
    console.log("on change = " + value);
    refreshPositionsByCompanyId(value);
    form.resetFields(["pid", "name", "status"]);
  }

  okHandle = () => {
    const { values, form, handleAdd, handleUpdate, } = this.props;
    let data = form.getFieldsValue;
    console.log("fields values = " + JSON.stringify(data));
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      // fieldsValue = {
      //   ...fieldsValue,
      //   status: fieldsValue.status===true?1:fieldsValue.status===false?0:values?values.status:0
      // }
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
    let { positions } = this.props;
    console.log("posotions = before = " + JSON.stringify(positions));
    if (positions && positions.length > 0) {
      // positions = positions.map(item => {
      //   item.name=item.spacer+item.name
      //   return item;
      // })
      console.log("posotions = after = " + JSON.stringify(positions));
      positions = [
        {
          id: '0',
          name: "无",
          pid: '',
          pname: '',
          status: 0,
          haschild: 0,
          company_id: '',
          structure_id: '',
          spacer: '',
          childlist: []
        },
        ...positions
      ]
    }

    return (
      <Modal
        width="30%"
        destroyOnClose
        title={values ? "编辑职位" : "添加职位"}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => values ? handleUpdateModalVisible() : handleModalVisible()}
      >
        <div className={styles.tableListForm}>
          <Form >

          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="所属公司">
                  {values ?
                    getFieldDecorator('companyId', { initialValue: values.company_id, })(
                      <Select placeholder='请选择所属公司' style={{ width: '100%' }}  disabled={true}>
                        <Option value={values.company_id}>
                          {companyName}
                        </Option>
                      </Select>,
                    )
                    :
                    getFieldDecorator('companyId', {
                      rules: [{ required: true, message: '请选择所属公司！' }],
                      initialValue: companyId
                    })(<Select placeholder='请选择所属公司' style={{ width: '100%' }} onChange={this.hanldeChangeCompany} >
                      {companys && companys.map(company => (
                        <Option value={company.id}>
                          {company.name}
                        </Option>
                      ))}
                    </Select>)
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="上级职位">
                  {values ?
                    getFieldDecorator('pid', { initialValue: values.pid ? values.pid : '0' })(
                      <Select style={{ width: '100%' }} >
                        {
                          positions && positions.filter((item) => {
                            return item.id != values.id && item.pid != values.id
                          }).map(position => (
                            <Option value={position.id}>
                              {position.name}
                            </Option>
                          ))
                        }
                      </Select>,
                    )
                    :
                    getFieldDecorator('pid')(<Select placeholder='无' style={{ width: '100%' }} >
                      {positions && positions.map(position => (
                        <Option value={position.id}>
                          {position.name}
                        </Option>
                      ))}
                    </Select>)
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="职位名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '职位名称不能为空！' }],
                    initialValue: values ? values.name : "",
                  })(<Input placeholder="请输入职位名称" style={{ width: '100%' }}/>)}
                </FormItem>
              </Col>
            </Row>

            {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="状态">
                {getFieldDecorator('status')(
                  <Switch defaultChecked={values?values.status==1:false} onChange={this.onChangeStatus} size='small' />
                )}
              </FormItem>
            </Col>
          </Row> */}

          </Form>
        </div>
      </Modal>
    );
  }

}

export default Form.create<CreateFormProps>()(CreateForm);