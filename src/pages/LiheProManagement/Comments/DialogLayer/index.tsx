import React, { Component, Dispatch, Fragment } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Form, Affix, Tabs, Select, Modal, Input, Button,DatePicker } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from '../../LiheProDetail/model';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface DialogState {

}

interface CustomerConsultProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  liheDetail: StateType;
}
@connect(
  ({
    LiheProDetail,
    loading,
  }: {
    LiheProDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LiheProDetail,
    loading: loading.models.LiheProDetail,
  }),
)



class DialogLayer extends Component<CustomerConsultProps, DialogState> {
  constructor(props: any) {
    super(props);

  }
  state: DialogState = {

  }
  componentDidMount() {

  }
  // 添加协作人
  handleCollaboratorOk = (e: any) => {
    const { form } = this.props;

    let files: string[] = [];
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }


      console.log(fieldsValue)
    });
  };

  handleCollaboratorCancel = (e: any) => {
    this.props.closeDialogCtrl();
  };

  render() {
    const { form, tabDialog } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        {tabDialog === 1 &&
          <Modal
            title="分配策划师"
            visible={tabDialog == 1}
            onOk={() => this.handleCollaboratorOk(tabDialog)}
            onCancel={this.handleCollaboratorCancel}
          >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="选择分配人">
              {
                form.getFieldDecorator('transfer')(<Select style={{ width: "100%" }} placeholder="请选择负责人">
                  {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                  <Option value="male">male</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>)
              }
            </FormItem>
          </Modal>
        }
        {tabDialog === 2 &&
          <Modal
            title="添加协作人"
            visible={tabDialog == 2}
            onOk={() => this.handleCollaboratorOk(tabDialog)}
            onCancel={this.handleCollaboratorCancel}
          >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="协作人部门">
              {
                form.getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择协作人部门' }],
                })(<Select style={{ width: "100%" }} placeholder="请选择协作人部门">
                  {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                  <Option value="male">male</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>)
              }
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="协作人">
              {
                form.getFieldDecorator('person', {
                  rules: [{ required: true, message: '请选择协作人' }],
                })(<Select style={{ width: "100%" }} placeholder="请选择协作人">
                  {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                  <Option value="male">人</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>)
              }
            </FormItem>
          </Modal>
        }
        {tabDialog === 3 &&
          <Modal
            title="客户负责人转移"
            visible={tabDialog == 3}
            onOk={() => this.handleCollaboratorOk(tabDialog)}
            onCancel={this.handleCollaboratorCancel}
          >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新负责人">
              {
                form.getFieldDecorator('transfer', {
                  rules: [{ required: true, message: '请选择负责人' }]
                })(<Select style={{ width: "100%" }} placeholder="请选择负责人">
                  {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                  <Option value="male">male</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>)
              }
            </FormItem>
          </Modal>
        }
        {tabDialog === 4 &&
          <Modal
            title="转移至客户公海"
            visible={tabDialog == 4}
            onOk={() => this.handleCollaboratorOk(tabDialog)}
            onCancel={this.handleCollaboratorCancel}
          >
            <div className={styles.warn}>
              <div className={styles.wran_icon}><ExclamationCircleOutlined /></div>
              <div style={{ marginLeft: 10 }}>是否放弃当前更近客户？</div>
            </div>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="丢单原因">
              {
                form.getFieldDecorator('reson', {
                  rules: [{ required: true, message: '请选择丢单原因' }],
                })(<Select style={{ width: "100%" }} placeholder="请选择丢单原因">
                  {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                  <Option value="male">male</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>)
              }
            </FormItem>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="备注原因">
              {
                form.getFieldDecorator('remark', {
                  rules: [{ required: true, message: '请填写备注原因' }],
                })(<TextArea rows={4} />)
              }
            </FormItem>
          </Modal>
        }
        {tabDialog === 5 &&
          <Modal
            title="发送短信"
            visible={tabDialog == 5}
            onOk={() => this.handleCollaboratorOk(tabDialog)}
            onCancel={this.handleCollaboratorCancel}
          >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="短信内容">
              {
                form.getFieldDecorator('message', {
                  rules: [{ required: true, message: '请填写短信内容' }],
                })(<TextArea rows={4} style={{ resize: 'none' }} />)
              }
            </FormItem>
          </Modal>
        }
        {tabDialog === 6 &&
          <Modal
            title="填写收款金额"
            visible={tabDialog == 6}
            onOk={() => this.handleCollaboratorOk(tabDialog)}
            onCancel={this.handleCollaboratorCancel}
          >
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="交易流水号">
              {
                form.getFieldDecorator('reson', {
                  rules: [{ required: true, message: '交易流水号' }],
                })(<Input
                  maxLength={25}
                />)
              }
            </FormItem>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="付款方式">
              {
                form.getFieldDecorator('reson', {
                  rules: [{ required: true, message: '付款方式' }],
                })(<Select style={{ width: "100%" }} placeholder="付款方式">
                  <Option value="male">male</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>)
              }
            </FormItem>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="实际收款">
              {
                form.getFieldDecorator('reson', {
                  rules: [{ required: true, message: '请填写收款金额' }],
                })(<Input
                  maxLength={25}
                />)
              }
            </FormItem>
            <FormItem  labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="收款日期">
            {
                form.getFieldDecorator('reson', {
                  rules: [{ required: true, message: '请填写收款金额' }],
                })(<Input
                  maxLength={25}
                />)
              }
            </FormItem>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="备注原因">
              {
                form.getFieldDecorator('remark', {
                  rules: [{ required: true, message: '请填写备注原因' }],
                })(<TextArea rows={4} />)
              }
            </FormItem>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="附件">
              {
                form.getFieldDecorator('remark', {
                  rules: [{ required: false, message: '' }],
                })(<Button>选择文件</Button>)
              }
            </FormItem>
          </Modal>
        }
      </Fragment>
    );
  }
}
export default Form.create<CustomerConsultProps>()(DialogLayer);
