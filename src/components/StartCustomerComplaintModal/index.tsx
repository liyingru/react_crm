import { Form,  Modal, Select,  } from 'antd';
const {Option} = Select;
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import MultiFilesUpload from '../MultiFilesUpload';
import TextArea from 'antd/lib/input/TextArea';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';

interface StartCustomerComplaintModalProps extends FormComponentProps {
    visible: boolean;
    loading: boolean;
    configDatas: ConfigItem[];
    onOk: (fieldsValue:any) => void;
    onCancel: ()=>void;
}

const StartCustomerComplaintModal: React.FC<StartCustomerComplaintModalProps> = props => {
  const { visible, configDatas, onOk, onCancel, loading ,form} = props;

  let files:string[] = [];

  const okHandle = () => {
    form.validateFields((err, fieldsValue)=>{
      if(err) return;
      fieldsValue = {
        ...fieldsValue,
        file:files
      }
      onOk(fieldsValue);
      form.resetFields();
      files = [];
    });
  };

  const cancelHandle = () => {
    onCancel();
  };

  const onUploadDone = (full_paths: string[]) => {
    files = full_paths;
  }

  return (
    <Modal
          confirmLoading={loading}
          destroyOnClose
          title="客诉单"
          okText="提交工单"
          cancelText="取消"
          visible={visible}
          onOk={okHandle}
          onCancel={cancelHandle}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="客诉类型">
            {
              form.getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择客诉类型' }],
              })(<Select style={{ width: "100%" }} placeholder="请选择客诉类型">
                {
                  configDatas && configDatas.map(value => (
                    <Option value={value.id} key={value.id}>{value.name}</Option>
                  ))
                }
              </Select>)
            }
          </FormItem>

          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="沟通内容">
            {
              form.getFieldDecorator('content', {
                rules: [{ required: true, message: '请填写沟通内容' }],
              })(<TextArea placeholder="填写沟通内容（必填）" />)
            }
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上传附件">
            {
              form.getFieldDecorator('file', {
                rules: [{ required: false }],
              })(<MultiFilesUpload onUploadDone={onUploadDone} />)
            }
          </FormItem>
        </Modal>
    );

};

export default Form.create<StartCustomerComplaintModalProps>()(StartCustomerComplaintModal);
