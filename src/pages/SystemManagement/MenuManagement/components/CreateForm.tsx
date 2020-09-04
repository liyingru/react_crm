import { Form, Input, Modal, Row, Col, Select, Switch, Radio, Button, Icon, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { MenuData } from '../data';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import Search from 'antd/lib/input/Search';
import styles from '../style.less'
import menusConfig from '../../../../../config/menu.config'

const FormItem = Form.Item;
const { Option } = Select;

export interface FormValueType extends Partial<AddMenuParams> {

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
  menus: MenuData[];
  codeOptions: string[];
  values?: Partial<MenuData> | undefined;
  initialActions?: string[] | undefined;
  getListAct?: (ctrlId: string) => void;
}

interface State {
  isMenu: boolean;
  visible: boolean;
  selectedIcon: string | undefined;
}

class CreateForm extends Component<CreateFormProps, State> {
  constructor(props: CreateFormProps) {
    super(props);
    const { values } = props;
    this.state = {
      isMenu: values ? values.is_menu == 1 : false,
      visible: false,
      selectedIcon: values ? values.icon : ''
    };
  }


  hanldeChangeIsMenu = (e: any) => {

    console.log("on change = " + JSON.stringify(e));
    const value = e.target.value;
    if (value == 1) {
      this.setState({
        isMenu: true
      })
    } else {
      this.setState({
        isMenu: false
      })
    }

  }

  okHandle = () => {
    const { values, form, handleAdd, handleUpdate, } = this.props;
    let data = form.getFieldsValue;
    console.log("fields values = " + JSON.stringify(data));
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!values) form.resetFields();
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

  container: MenuData[] = [];
  expandMenus = (child: MenuData) => {
    this.container = [
      ...this.container,
      child
    ]
    if (child.childlist.length > 0) {
      child.childlist.map(val => this.expandMenus(val))
    }

  }

  handleFirstCodeChange = (param: string) => {
    const { form, getListAct } = this.props;
    form.resetFields(['action']);
    console.log("handleFirstCodeChange    " + param)
    getListAct(param);
  }

  handleSecondCodeChange = (param) => {
    console.log("handleSecondCodeChange    " + param)
  }

  onClick = () => {
    this.setState({
      visible: true
    })
  }
  isMenuOptions = [
    {
      name: '菜单',
      value: 1
    },
    {
      name: '功能',
      value: 2
    },
  ]

  menuTypeOptions = [
    {
      name: '普通类型',
      value: 0
    },
    {
      name: '基础菜单',
      value: 1
    },
    {
      name: '系统菜单',
      value: 2
    }
  ]

  icons = [
    "account-book", "alert", "api", "appstore", "audio", "bank", "bell", "book", "bug", "bulb", "calculator", "build", "calendar", "camera", "car", "carry-out", "cloud", "code", "compass", "contacts", "container", "control", "credit-card", "crown", "customer-service", "dashboard", "database", "dislike", "environment", "experiment", "eye-invisible", "eye", "file-add", "file-excel", "file-exclamation", "file-image", "file-markdown", "file-pdf", "file-ppt", "file-text", "file-unknown", "file-word", "file-zip", "file", "filter", "fire", "flag", "funnel-plot", "hdd", "heart", "home", "hourglass", "interaction", "pay-circle", "notification", "phone", "picture", "play-square", "printer", "profile", "project", "pushpin", "pie-chart", "apartment", "team", "switcher", "shop", "solution", "setting", "interaction", "idcard", "rocket", "schedule", "tags", "coffee", "deployment-unit", "file-done", "global", "laptop"
  ]
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  }

  reRenderOption = (item: MenuData) => {
    if (item.tier > 1) {
      const arr: any[] = new Array(item.tier - 1);
      for (let i = 0; i < item.tier - 1; i++) {
        arr[i] = "fake";
      }
      return (
        <div>
          {
            arr.map((a, index) => (
              <span>&nbsp;&nbsp;</span>
            ))
          }
          <span>{item.name + " - " + (item.is_menu == 1 ? "菜单" : "功能")}</span>
        </div>
      )
    } else {
      return (
        <span>{item.name + " - " + (item.is_menu == 1 ? "菜单" : "功能")}</span>
      )
    }

  }

  render() {
    const { form, modalVisible, handleModalVisible, handleUpdateModalVisible, values, initialActions } = this.props;
    const { getFieldDecorator } = form;
    let { menus, codeOptions } = this.props;
    console.log("menus = " + JSON.stringify(menus))
    this.container = [];
    menus.map(val => this.expandMenus(val));

    //this.container = this.container.filter(val => val.pid == '0');
    if (this.container && this.container.length > 0) {
      this.container = [
        {
          id: '0',
          name: "无",
          pid: '',
          status: 0,
          hasChild: 0,
          is_menu: 0,
          icon: '',
          childlist: [],
          code: '',
          path: '',
          weight: 0,
          spacer: '',
          remark: '',
          menu_type: 0,
        },
        ...this.container
      ]
    }

    const InputGroup = Input.Group;

    return (
      <Modal
        width="50%"
        destroyOnClose
        title={values ? "编辑菜单" : "添加菜单"}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => values ? handleUpdateModalVisible() : handleModalVisible()}
      >
        <div className={styles.tableListForm}>
          <Form >

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="是否菜单" style={{ width: '100%' }} {...this.formItemLayout}>
                  {
                    getFieldDecorator('isMenu', { initialValue: values ? values.is_menu : undefined, })(
                      <Radio.Group onChange={this.hanldeChangeIsMenu} style={{ width: '100%' }}>
                        {this.isMenuOptions && this.isMenuOptions.map(item => (
                          <Radio value={item.value} key='value'>
                            {item.name}
                          </Radio>
                        ))}
                      </Radio.Group>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="父级菜单" style={{ width: '100%' }} {...this.formItemLayout}>
                  {
                    getFieldDecorator('pid', { initialValue: values && values.pid ? values.pid : '0' })(
                      <Select style={{ width: '100%' }} showSearch={true} optionFilterProp="title">
                        {
                          values ? this.container && this.container.filter((item) => {
                            return item.id != values.id && item.pid != values.id
                          }).map(menu => (
                            <Option value={menu.id} key={menu.name} title={menu.name}>
                              {this.reRenderOption(menu)}
                            </Option>
                          )) : this.container && this.container.map(menu => (
                            <Option value={menu.id} key={menu.name} title={menu.name}>
                              {this.reRenderOption(menu)}
                            </Option>
                          ))
                        }
                      </Select>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={22}>
                <FormItem label="权限码" style={{ width: '100%' }} {...this.formItemLayout}>
                  <InputGroup compact>
                    {
                      getFieldDecorator('ctrl', { initialValue: values && values.code && values.code.length > 0 ? values.code.split('@')[0] : undefined })(
                        <Select
                          allowClear={true}
                          placeholder="请选择，支持搜索"
                          showSearch={true}
                          optionFilterProp="children"
                          style={{ width: '30%' }}
                          onChange={this.handleFirstCodeChange}
                        >
                          {
                            codeOptions && codeOptions.map(firstCode => (
                              <Option key={firstCode}>{firstCode}</Option>
                            ))
                          }
                        </Select>
                      )
                    }
                    {
                      getFieldDecorator('action', { initialValue: values && values.code && values.code.length > 0 && values.code.split('@').length > 1 ? values.code.split('@')[1] : undefined })(
                        <Select
                          allowClear={true}
                          placeholder="请选择，支持搜索"
                          showSearch={true}
                          optionFilterProp="children"
                          style={{ width: '30%' }}
                          onChange={this.handleSecondCodeChange}
                        >
                          {initialActions && initialActions.map(secondCode => (
                            <Option key={secondCode}>{secondCode}</Option>
                          ))}
                        </Select>
                      )
                    }
                    {
                      getFieldDecorator('customCode')(
                        <Input
                          placeholder="自定义，如System@login"
                          style={{ width: '40%' }}
                          onChange={this.handleSecondCodeChange}
                        />
                      )
                    }
                  </InputGroup>
                </FormItem>
              </Col>
            </Row>
            {
              this.state.isMenu || values?.is_menu == 1 ?
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={16}>
                    <FormItem label="页面路由" style={{ width: '100%' }} {...this.formItemLayout}>
                      {
                        getFieldDecorator('path', { initialValue: values && values.path ? values.path : undefined })(
                          <Select allowClear={true} placeholder="如果没找到，请联系开发人员添加" style={{ width: '100%' }} showSearch={true} optionFilterProp="children">
                            {
                              menusConfig.map(option => (
                                <Option value={option.path} key={option.name}>
                                  {option.name}
                                </Option>
                              ))
                            }
                          </Select>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                : null
            }


            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="标题" style={{ width: '100%' }} {...this.formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '标题不能为空！' }],
                    initialValue: values ? values.name : "",
                  })(<Input placeholder="请输入标题" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            {
              this.state.isMenu || values?.is_menu == 1 ?
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={16}>
                    <FormItem label="图标" style={{ width: '100%' }} {...this.formItemLayout}>
                      {
                        getFieldDecorator('icon', {
                          initialValue: values ? values.icon : '',
                        })(
                          <Search
                            placeholder="点击按钮选择菜单图标"
                            enterButton="选择图标"
                            size="default"
                            onSearch={this.onClick}
                            style={{ width: '100%' }}
                          />
                        )}
                    </FormItem>
                  </Col>
                </Row>
                :
                null
            }

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="权重" style={{ width: '100%' }} {...this.formItemLayout}>
                  {getFieldDecorator('weight', {
                    rules: [{ required: true, message: '权重不能为空！' }],
                    initialValue: values ? values.weight : "",
                  })(<InputNumber placeholder="请输入权重值" min={1} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="备注" style={{ width: '100%' }} {...this.formItemLayout}>
                  {getFieldDecorator('remark', {
                    initialValue: values ? values.remark : "",
                  })(<Input placeholder="请输入备注" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="菜单类型：" style={{ width: '100%' }} {...this.formItemLayout}>
                  {
                    getFieldDecorator('menuType', { initialValue: values && values.menu_type ? values.menu_type : undefined })(
                      <Radio.Group style={{ width: '100%' }}>
                        {this.menuTypeOptions && this.menuTypeOptions.map(item => (
                          <Radio value={item.value} key={item.value}>
                            {item.name}
                          </Radio>
                        ))}
                      </Radio.Group>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={16}>
                <FormItem label="状态" style={{ width: '100%' }} {...this.formItemLayout}>
                  {getFieldDecorator('status')(
                    <Switch defaultChecked={values ? values.status == 1 : false} onChange={this.onChangeStatus} size='small' />
                  )}
                </FormItem>
              </Col>
            </Row>

          </Form>
        </div>
        <Modal
          title="菜单图标"
          visible={this.state.visible}
          footer={null}
          onCancel={() => this.setState({ visible: false })}
        >
          {
            this.icons.map(icon => (<Icon type={icon} style={{ margin: 10, fontSize: 20 }} onClick={() => { this.setState({ visible: false, selectedIcon: icon }); form.setFieldsValue({ icon }) }} />))
          }
        </Modal>

      </Modal>
    );
  }

}

export default Form.create<CreateFormProps>()(CreateForm);