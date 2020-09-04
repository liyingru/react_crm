import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { Form, Table, Button, Modal, Select, Input, message } from 'antd';
import { StateType } from '../../model';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import FormItem from "antd/lib/form/FormItem";
import { ConfigData, ContactInfoData } from '../../data';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { PlusOutlined } from '@ant-design/icons';

interface ContactInfoProps extends FormComponentProps {
  customerId: string;
  customerConfig: ConfigData;

  dispatch: Dispatch<
    Action<
      | 'leadManagementDetail/fetchContactInfo'
      | 'leadManagementDetail/addContactInfo'
    >
  >;
  loading: boolean;
  leadManagementDetail: StateType;
  isDistribute: boolean;
  isclaimFlag: boolean;
}

interface ContactState {
  modalVisible: boolean
  optionType: number,
  editData: ContactInfoData | undefined,
}

@connect(
  ({
    leadManagementDetail,
    loading,
  }: {
    leadManagementDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    leadManagementDetail,
    loading: loading.models.leadManagementDetail,
  }),
)

class ContactInfo extends Component<ContactInfoProps, ContactState> {
  state: ContactState = {
    modalVisible: false,
    optionType: 1,
    editData: undefined,
  }

  componentDidMount() {
    const { dispatch, customerId } = this.props;
    const params = {
      customerId: customerId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchContactInfo',
      payload: params,
    });
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'identityText',
      key: 'identityText',
    },
    {
      title: '联系号码',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '微信',
      dataIndex: 'weChat',
      key: 'weChat',
    },
    {
      title: '职业',
      dataIndex: 'occupation',
      key: 'occupation',
    },
    {
      title: '方便联系',
      dataIndex: 'contactTimeText',
      key: 'contactTimeText',
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '编辑',
      dataIndex: '',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => this.handleEditContact(record)}>编辑</a>
          </div>
        );
      }
    },
  ]

  handleAddContact = () => {
    this.setState({
      modalVisible: true,
      optionType: 1,
      editData: undefined,
    });
  }

  handleEditContact = (data: ContactInfoData) => {
    this.setState({
      modalVisible: true,
      optionType: 2,
      editData: data,
    });
  }

  handleAddContactModalOk = () => {
    const { dispatch, form, customerId } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const params = {
        ...values,
        customerId: customerId,
      };
      if (this.state.optionType == 2) {  //更新
        params['contactId'] = this.state.editData?.contactId
        Axios.post(URL.updateContactUser, params).then(
          res => {
            if (res.code == 200) {
              message.success('联系人更新成功');
              this.addContactCallBack();
            }
          }
        );
      } else {
        dispatch({
          type: 'leadManagementDetail/addContactInfo',
          payload: params,
          callback: (data: any, code: number, msg: string) => {
            if (code != 200) {
              return;
            }
            message.success('联系人添加成功');
            this.addContactCallBack();
          }
        });
      }
    });
  }

  handleAddContactModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  addContactCallBack() {
    this.setState({
      modalVisible: false,
      optionType: 1,
      editData: undefined,
    });
    const { dispatch, customerId } = this.props;
    const params = {
      customerId: customerId,
    };
    dispatch({
      type: 'leadManagementDetail/fetchContactInfo',
      payload: params,
    });
  }

  render() {
    const { loading, leadManagementDetail, form, customerConfig, isclaimFlag, isDistribute } = this.props;
    const { contacts } = leadManagementDetail;
    const { getFieldDecorator } = form;
    return (
      <div>
        {
          !isDistribute ?
            <div style={{
              marginTop: 8,
              marginBottom: 15,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div></div>
              <Modal
                title="新增联系人"
                visible={this.state.modalVisible}
                onOk={this.handleAddContactModalOk}
                onCancel={this.handleAddContactModalCancel}
                destroyOnClose={true}>
                <Form>
                  <FormItem label="姓名" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('userName', {
                      initialValue: this.state.editData ? this.state.editData.userName : '',
                      rules: [{ required: true, message: '请输入联系人姓名' }]
                    })(
                      <Input style={{ marginLeft: 5 }} />
                    )}
                  </FormItem>
                  <FormItem label="角色" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('identity', {
                      initialValue: this.state.editData && this.state.editData.identity != 0 ? this.state.editData.identity : undefined,
                    })(
                      <Select style={{ marginLeft: 5 }}>
                        {
                          customerConfig.identity.map(item => (
                            <Option value={item.id}>{item.name}</Option>))
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="手机号" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('phone', {
                      initialValue: this.state.editData ? this.state.editData.phone : '',
                      rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), min: 11, message: '请输入联系人手机号' }], getValueFromEvent: (event) => {
                        return event.target.value.replace(/\D/g, '')
                      }
                    })(
                      <Input allowClear maxLength={11} style={{ marginLeft: 5 }} />
                    )}
                  </FormItem>
                  <FormItem label="微信号" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('weChat', {
                      initialValue: this.state.editData ? this.state.editData.weChat : '',
                    })(
                      <Input style={{ marginLeft: 5 }} />
                    )}
                  </FormItem>
                  <FormItem label="职业" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('occupation', {
                      initialValue: this.state.editData ? this.state.editData.occupation : '',
                    })(
                      <Input style={{ marginLeft: 5 }} />
                    )}
                  </FormItem>
                  <FormItem label="方便联系" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('contactTime', {
                      initialValue: this.state.editData && this.state.editData.contactTime != 0 ? this.state.editData.contactTime : undefined,
                    })(
                      <Select style={{ marginLeft: 5 }}>
                        {
                          customerConfig.contactTime.map(item => (
                            <Option value={item.id}>{item.name}</Option>))
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="备注" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('comment', {
                      initialValue: this.state.editData ? this.state.editData.comment : '',
                    })(
                      <TextArea
                        style={{ marginLeft: 5 }}
                        maxLength={20}
                        autoSize={{ minRows: 2, maxRows: 2 }}
                      />
                    )}
                  </FormItem>
                </Form>
              </Modal>
              <Button hidden={isclaimFlag} type="primary" onClick={this.handleAddContact}><PlusOutlined />联系人</Button>
            </div> : null
        }
        <Table
          scroll={{ x: 'max-content' }}
          size={"middle"}
          pagination={false}
          loading={loading}
          columns={this.columns}
          dataSource={contacts}
        />
      </div>
    );
  };
}
export default Form.create<ContactInfoProps>()(ContactInfo);
