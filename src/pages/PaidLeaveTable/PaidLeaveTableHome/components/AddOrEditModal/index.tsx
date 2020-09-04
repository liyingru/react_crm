import { Form, Modal, Select, DatePicker, } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { DayOffListItem } from '../../data';
import moment from 'moment';
import { UserInfo } from '@/pages/user/login/data';
const FormItem = Form.Item;
const { Option } = Select;


export interface AddOrEditState {
}

interface AddOrEditProps extends FormComponentProps {
  modalVisible: boolean;
  userList: UserInfo[]|undefined;
  onSubmitAdd?: (params: {dateTime: string, userIdList: string}) => void;
  onSubmitEdit?: (params: {id: number, dateTime: string, userIdList: string}) => void;
  onCancel: () => void;
  editValue?: DayOffListItem;
}

class AddOrEditModal extends Component<AddOrEditProps, AddOrEditState>  {

  constructor(props: AddOrEditProps) {
    super(props);

    this.state = {
     
    };
  }

  okHandle = () => {
    const { form, editValue, onSubmitAdd, onSubmitEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        
        if(fieldsValue.dateTime) {
            fieldsValue = {
              ...fieldsValue,
              dateTime: fieldsValue.dateTime.format('YYYY-MM-DD'),
              userIdList: fieldsValue.userIdList.join(',')
            }
          }
        
        if (editValue) {
          fieldsValue = {
            ...fieldsValue,
            id: editValue.id,
          }
          if(onSubmitEdit) {
            onSubmitEdit(fieldsValue);
          }
        } else {
            if(onSubmitAdd) {
                onSubmitAdd(fieldsValue);
            }
            form.resetFields();
        }
      });
  };
  
  formatDefaultTime = (propName: string | undefined, format: string) => {
    if (propName != undefined && propName != null && propName != "") {
      return moment(propName, format)
    }
    return null
  }

  render() {
    const { userList,editValue, form, modalVisible, onCancel } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        width="500px"
        destroyOnClose
        title={editValue ? "编辑" : "添加"}
        visible={modalVisible}
        okText="保存"
        onOk={this.okHandle}
        onCancel={onCancel}
      >
        <div >
            <Form >
                <FormItem label="选择日期" style={{ width: '100%' }} >
                    {
                        getFieldDecorator('dateTime', {
                            rules: [{ required: true, message: '请选择日期' }],
                            initialValue: this.formatDefaultTime(editValue ? editValue.date_time : undefined, 'YYYY-MM-DD'),
                        })(
                            <DatePicker 
                                disabled={!!editValue}
                                format='YYYY-MM-DD' 
                                style={{ width: '100%' }} 
                                placeholder="请选择日期" 
                                disabledDate={(current)=>{
                                    return (current && current!=null) ? current < moment().startOf('day') : false;
                                }}
                                />
                        )
                    }
                </FormItem>
                <FormItem label="选择人员" style={{ width: '100%' }} >
                    {
                    getFieldDecorator('userIdList', {
                        rules: [{ required: true, message: '请添加成员' }],
                        initialValue: editValue && editValue.user_id_list ? editValue.user_id_list.split(',') as string[] : undefined,
                    })(
                        <Select placeholder="请选择成员" mode="multiple" allowClear optionFilterProp="children" >
                        {
                            userList && userList.map(item => (
                                <Option value={item.id+""} key={item.id}>
                                    {item.name}
                                </Option>
                                )
                            )
                        }
                        </Select>
                    )
                    }
                </FormItem>
            </Form>
        </div>
      </Modal>
    );
  }

}

export default Form.create<AddOrEditProps>()(AddOrEditModal);
