
import { Form, Input, Modal, Row, Col, Select, DatePicker, Radio } from 'antd'

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { UserModelState } from '@/models/user';
import { Dispatch, Action } from 'redux';
import { connect } from 'dva'


const FormItem = Form.Item;
const { Option } = Select;


//id 	是 	int 	客户Id
//owner_id 
export interface TransferToUserParams {
  id: string;
  ownerId: string;
}


export interface FormValueType extends Partial<TransferToUserParams> {

}



interface CreateFormProps extends FormComponentProps {
  visible: boolean;
  handleTransfer: (fieldsValue: FormValueType) => void;
  handleModalVisible: () => void;
  handleCancelTransfer: () => void;
  defaultValue: string
  label: string
  user: UserModelState;
  dispatch: Dispatch<
    Action<
      | 'user/getGroupUserList'
    >
  >;
}


/* eslint react/no-multi-comp:0 */
@connect(
  ({
    user,
    loading,
  }: {
    user: UserModelState;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    user,
    loading: loading.models.user,
  }),
)
class CreateForm extends Component<CreateFormProps>  {

  static defaultProps = {
    visible: false,
    userGroupList: [],
    defaultValue: '',
    handleModalVisible: () => { },
    handleCancelTransfer: () => { },
    userModelState: {}
  };

  constructor(props: CreateFormProps) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getGroupUserList'
    });
  }


  okHandle = () => {
    const { form, handleTransfer } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleTransfer(fieldsValue);
    });
  };

  cancelHandle = () => {
    const { handleModalVisible, handleCancelTransfer } = this.props;
    handleModalVisible()
    handleCancelTransfer()
  };

  //获取用户组列表
  handleGetUserGroupList(this: any, fields: FormValueType) {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getGroupUserList',
      payload: fields,
    });
  }


  render() {
    const { visible, defaultValue, label, form, handleModalVisible, user } = this.props;
    const { userGroupList } = user;


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Modal
        destroyOnClose
        title="转给同事负责"
        visible={visible}
        centered={true}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
      >
        <Form hideRequiredMark>
          <FormItem {...formItemLayout} label={label}>
            {form.getFieldDecorator('ownerId', {
              rules: [{ required: true, message: '请选择要转的同事' }],
              initialValue: defaultValue ? defaultValue : ''
            })(<Select
              allowClear
              showSearch
              value='8,2'
              style={{ width: 300 }}
              placeholder="请选择"
              optionFilterProp="children"

            >
              {
                userGroupList && userGroupList.map(item => (
                  <Option value={item.user_id} key={item.user_id}>
                    {item.username}&nbsp;&nbsp;&nbsp;{item.group_name}
                  </Option>
                )
                )
              }
            </Select>)}
          </FormItem>

        </Form>
      </Modal>

    );
  }

}
export default Form.create<CreateFormProps>()(CreateForm);
