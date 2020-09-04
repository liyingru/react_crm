import { Form, Input, Modal, Row, Col, Select, DatePicker, Radio, message } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { TableListItem, OptionRoleItem, OptionCompanyItem, ListStructureSubItem } from '../data.d';
import moment from 'moment';
import styles from '../style.less'
import AreaSelect from '@/components/AreaSelect';
const FormItem = Form.Item;
const { Option } = Select;

export interface FormValueType extends Partial<TableListItem> {

}

export interface CreateFormState {
  resetArea: boolean;
  province: string;
  city: string;
  code: string;
}

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  listCompany: OptionCompanyItem[];
  listStructure: ListStructureSubItem[];
  listPosition: PositionItem[];
  roles: OptionRoleItem[];
  hanldeCompanyChange: (companyId: string) => void;
  handleAdd: (fieldsValue: FormValueType) => void;
  handleUpdate: (fieldsValue: FormValueType) => void;
  handleModalVisible: () => void;
  companyId?: string;
  value?: TableListItem;
  
}

class CreateForm extends Component<CreateFormProps, CreateFormState>  {

  static defaultProps = {
    modalVisible: false,
    listCompany: [],
    listStructure: [],
    listPosition: [],
    roles: [],
    hanldeCompanyChange: () => { },
    handleAdd: () => { },
    handleUpdate: () => { },
    handleModalVisible: () => { }
  };

  constructor(props: CreateFormProps) {
    super(props);

    this.state = {
      resetArea: false,
      province: '',
      city: '',
      code: '',
    };
  }


  onPickEntrydDate = (date, dateString) => {

  };
  onPickCorrectionDate = (date, dateString) => {

  };

  okHandle = () => {
    const { form, value, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        
        if(fieldsValue.entryDate ) {
          fieldsValue = {
            ...fieldsValue,
            entryDate: fieldsValue.entryDate.format('YYYY-MM-DD'),
          }
        }
        if(fieldsValue.correctionDate) {
          fieldsValue = {
            ...fieldsValue,
            correctionDate: fieldsValue.correctionDate.format('YYYY-MM-DD'),
          }
        }
        if(fieldsValue.birthday && fieldsValue.birthday) {
          fieldsValue = {
            ...fieldsValue,
            birthday: fieldsValue.birthday.format('YYYY-MM-DD'),
          }
        }

        const { code } = this.state;
        if(code) {
          fieldsValue = {
            ...fieldsValue,
            cityCode: code,
          }
        }
        
        if (value) {
          fieldsValue = {
            ...fieldsValue,
            id: value.id,
          }
          handleUpdate(fieldsValue);
        } else {
          handleAdd(fieldsValue);
          form.resetFields();
        }
      });
  };

  areaSelectChange = (code: string, province: string, city: string, district: string) => {

    this.setState({
      province: province,
      city: city,
      code: code,
    });

  };

  handleChangeCompany = (company_id: string) => {
    this.resetOptions();
    const { hanldeCompanyChange } = this.props;
    hanldeCompanyChange(company_id);
  }

  resetOptions = () => {
    const { form } = this.props;
    form.setFieldsValue({structureId: undefined, positionId: undefined, roleId: undefined});
  };

  formatDefaultTime = (propName: string | undefined, format: string) => {
    if (propName != undefined && propName != null && propName != "") {
      return moment(propName, format)
    }
    return null
  }

  expandedStructures : ListStructureSubItem[] = new Array();
  expandStructures = (structures: ListStructureSubItem[]) => {
    structures.map(struc => {
      this.expandedStructures.push(struc);
      if(struc.childlist&&struc.childlist.length>0) {
        this.expandStructures(struc.childlist);
      }
    })
  }

  reRenderOption = (item : ListStructureSubItem) => {
    if(item.tier > 1) {
      const arr : any[] = new Array(item.tier-1);
      for(let i = 0; i < item.tier-1; i++) {
        arr[i] = "fake";
      }
      return (
        <div>
          {
            arr.map((a,index) => (
              <span>&nbsp;&nbsp;</span>
            ))
          }
          <span>{item.name}</span>
        </div>
      )
    } else {
      return (
        <span>{item.name}</span>
      )
    }
  }

  render() {
    const { roles, listCompany, listStructure, listPosition, form, modalVisible, handleModalVisible, companyId, value } = this.props;
    const { getFieldDecorator } = form;
    console.log("处理前的部门： " + JSON.stringify(listStructure));
    if(this.expandedStructures) {
      this.expandedStructures = new Array();
      this.expandStructures(listStructure);
    }
    console.log("处理后的部门： " + JSON.stringify(this.expandedStructures));

    return (
      <Modal
        width="50%"
        destroyOnClose
        title={value ? "编辑用户" : "添加用户"}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className={styles.tableListForm}>
          <Form >
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="所属公司" style={{ width: '100%' }} >
                  {
                    getFieldDecorator('companyId', {
                      rules: [{ required: true, message: '请选择所属公司！' }],
                      initialValue: value ? value.company_id + "" : companyId ? companyId+'' : undefined,
                    })(
                      <Select placeholder="请选择" onChange={this.handleChangeCompany} >
                        {
                          listCompany.map(item => (
                            <Option value={"" + item.id}>
                              {item.name}
                            </Option>
                          )
                          )
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="所在城市" style={{ width: '100%' }}>
                  {
                    getFieldDecorator('city')(<AreaSelect selectedCode={value?.city_code} reset={this.state.resetArea} areaSelectChange={this.areaSelectChange} />)
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={12}>
                <FormItem label="员工工号" style={{ width: '100%' }} >
                  {getFieldDecorator('jobNumber', {
                    rules: [{ required: false, message: '员工工号不能为空！' }],
                    initialValue: value ? value.job_number : "",
                  })(<Input placeholder="员工工号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="员工姓名" style={{ width: '100%' }} >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '员工姓名不能为空！' }],
                    initialValue: value ? value.name : "",
                  })(<Input placeholder="员工姓名" />)}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="员工性别" style={{ width: '100%' }}>
                  {getFieldDecorator('sex', {
                    rules: [{ required: false, message: '请选择员工性别' }],
                    initialValue: value ? value.sex : undefined,
                  })(
                    <Radio.Group>
                      <Radio value={1}>男</Radio>
                      <Radio value={0}>女</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="手机号" style={{ width: '100%' }}>
                  {getFieldDecorator('account', {
                      rules: [{ required: true, pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                        return event.target.value.replace(/\D/g, '')
                      },
                    initialValue: value ? value.account : "",
                  
                  })(<Input placeholder="请输入有效的手机号" maxLength={11}/>)}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="登录密码" style={{ width: '100%' }} >
                  {getFieldDecorator('password', {
                    rules: [{ required: false, message: '请输入登录密码' }],
                    // initialValue: value ? value.password : "",
                  })(<Input placeholder="请输入登录密码" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="七陌分机号" style={{ width: '100%' }} >
                  {getFieldDecorator('moorNumber', {
                    rules: [{ required: false, message: '请输入分机号' }],
                    initialValue: value ? value.moor_number : "",
                  })(<Input placeholder="请输入有效的七陌分机号" />)}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="接听方式" style={{ width: '100%' }} >
                  {getFieldDecorator('moorType', {
                    rules: [{ required: false, message: '请选择外显类型' }],
                    initialValue: value ? value.moor_type : undefined,
                  })(
                    <Radio.Group>
                      <Radio value='xiaohao'>手机</Radio>
                      <Radio value='zuoji'>座机</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="所属部门" style={{ width: '100%' }} >
                  {
                    getFieldDecorator('structureId', {
                      rules: [{ required: false, message: '请选择部门' }],
                      initialValue: value&&value.structure_id!='0' ? value.structure_id : undefined,
                    })(
                      <Select placeholder="请选择部门"  optionLabelProp="title" >
                        {
                          this.expandedStructures.map(item => (
                            <Option value={item.id} title={item.name} >
                              {
                                this.reRenderOption(item)
                                // item.name
                              }
                            </Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="请选择职位" style={{ width: '100%' }}>
                  {
                    getFieldDecorator('positionId', {
                      rules: [{ required: false, message: '请选择职位' }],
                      initialValue: value ? value.position_id : undefined,
                    })(
                      <Select placeholder="请选择职位"  >
                        {
                          listPosition.map(positionItem => (
                            <Option value={"" + positionItem.id}>
                              {positionItem.name}
                            </Option>
                          )
                          )
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="系统角色" style={{ width: '100%' }} >
                  {getFieldDecorator('roleId', {
                    rules: [{ required: true, message: '请选择用户角色' }],
                    initialValue: value && value.role_id ? value.role_id.split(",") : undefined,
                  })(
                    <Select
                      mode='multiple'
                  
                      placeholder="请选择用户角色">
                      {
                        roles.map(roleItem => (
                          <Option value={"" + roleItem.id}>
                            {roleItem.name}
                          </Option>
                        )
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="用户级别" style={{ width: '100%' }} >
                  {getFieldDecorator('rank', {
                    rules: [{ required: false, message: '请选择用户级别' }],
                    initialValue: value&&value.rank>0 ? value.rank : undefined,
                  })(
                    <Select placeholder="请选择" >
                      <Option value={1}>资深策划师</Option>
                      <Option value={2}>金牌策划师</Option>
                      <Option value={3}>宴会设计师</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="入职时间" >
                  {getFieldDecorator('entryDate', {
                    rules: [{ required: false, message: '请选择入职时间' }],
                    initialValue: this.formatDefaultTime(value&&value.entry_date!=null ? value.entry_date : undefined, 'YYYY-MM-DD'),
                  })(
                    <DatePicker onChange={this.onPickEntrydDate} format='YYYY-MM-DD' style={{ width: '100%' }}/>
                  )}
                </FormItem>
              </Col>
              
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="转正时间" >
                  {getFieldDecorator('correctionDate', {
                    rules: [{ required: false, message: '请选择转正时间' }],
                    initialValue: value&&value.correction_date!= null ? moment(value.correction_date, 'YYYY-MM-DD') : undefined,
                  })(
                    <DatePicker onChange={this.onPickCorrectionDate} format='YYYY-MM-DD' style={{ width: '100%' }}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="状态" style={{ width: '100%' }} >
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择用户状态' }],
                    initialValue: value ? value.status : undefined,
                  })(
                    <Radio.Group style={{ width: '100%' }}>
                      <Radio value={1}>正常</Radio>
                      <Radio value={2}>锁定</Radio>
                      <Radio value={3}>冻结</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
                <FormItem label="奥创服务号" style={{ width: '100%' }} >
                  {getFieldDecorator('acAccount', {
                    rules: [{ required: false, message: '请输入服务号' }],
                    initialValue: value ? value.ac_account : "",
                  })(<Input placeholder="请输入有效的奥创服务号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="天润分机号" style={{ width: '100%' }} >
                  {getFieldDecorator('trunNumber', {
                    rules: [{ required: false, message: '请输入分机号' }],
                    initialValue: value ? value.trun_number : "",
                  })(<Input placeholder="请输入有效的天润服务号" />)}
                </FormItem>
              </Col>
              
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={12}>
              <FormItem label="生日" >
                  {getFieldDecorator('birthday', {
                    rules: [{ required: false, message: '请选择生日' }],
                    initialValue: this.formatDefaultTime(value ? value.birthday : undefined, 'YYYY-MM-DD'),
                  })(
                    <DatePicker format='YYYY-MM-DD' style={{ width: '100%' }} placeholder="请选择出生日期" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="是否是礼合用户" style={{ width: '100%' }} >
                  {getFieldDecorator('isLiheuser', {
                    rules: [{ required: false, message: '请选择是否是礼合用户' }],
                    initialValue: value ? value.is_liheuser : 0,
                  })(
                    <Radio.Group style={{ width: '100%' }}>
                      <Radio value={0}>否</Radio>
                      <Radio value={1}>是</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
             <Col span={12}>
                <FormItem label="住址" style={{ width: '100%' }} >
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请输入住址' }],
                    initialValue: value ? value.address : "",
                  })(<Input placeholder="请输入住址" />)}
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
