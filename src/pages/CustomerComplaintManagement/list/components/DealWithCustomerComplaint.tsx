import { Form, Modal, Radio, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import TextArea from 'antd/lib/input/TextArea';
import MultiFilesUpload from '@/components/MultiFilesUpload';

const FormItem = Form.Item;

interface DetailWithCustomerPlaintProps extends FormComponentProps {
  loading: boolean;
  modalVisible: boolean;
  handleSubmitDealWith: (fieldsValue: any) => void;
  handleModalVisible: () => void;
}

let uploadedFiles: string[] = [];

const DetailWithCustomerPlaint: React.FC<DetailWithCustomerPlaintProps> = props => {
  
  const { loading, modalVisible, form, handleSubmitDealWith, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if(uploadedFiles&&uploadedFiles.length>0) {
        fieldsValue = {
          ...fieldsValue,
          file: uploadedFiles,
        }
      }
      if(fieldsValue.followNext ) {
        fieldsValue = {
          ...fieldsValue,
          followNext: fieldsValue.followNext.format('YYYY-MM-DD'),
        }
      }
      handleSubmitDealWith(fieldsValue);
      form.resetFields();
    });
  };
  
  const onUploadDone = (full_paths: string[]) => {
    uploadedFiles = full_paths;
  }

  return (
    <Modal
      confirmLoading={loading}
      destroyOnClose
      title="写处理单"
      okText="提交"
      cancelText="取消"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
        {
          form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择联系方式' }],
          })(<Radio.Group>
              <Radio value={1}>电话</Radio>
              <Radio value={2}>微信</Radio>
            </Radio.Group>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="处理结果">
        {
          form.getFieldDecorator('status', {
            rules: [{ required: true, message: '请选择处理结果' }],
          })(<Radio.Group>
              <Radio value={2}>持续跟进</Radio>
              <Radio value={3}>投诉升级</Radio>
              <Radio value={4}>已办结</Radio>
            </Radio.Group>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="处理内容">
        {
          form.getFieldDecorator('content', {
            rules: [{ required: true, message: '请录入处理内容'}],
          })(<TextArea placeholder="请录入处理内容" />)
        }
      </FormItem>
  
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上传附件">
        {
          form.getFieldDecorator('file', {
            rules: [{ required: false }],
          })(<MultiFilesUpload onUploadDone={onUploadDone}/>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="下次回访时间">
        {   
          form.getFieldDecorator('followNext', {rules: [{ required: false, message: '请选择下次回访时间' }]})(
            <DatePicker format='YYYY-MM-DD' style={{ width: '100%' }} placeholder="请选择下次回访时间" />
          )
        }
      </FormItem>
      
    </Modal>
  );
};

export default Form.create<DetailWithCustomerPlaintProps>()(DetailWithCustomerPlaint);
