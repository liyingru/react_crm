import { Form,  Modal,  } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { AddCompanyParams, TableListItem } from '../data';


export interface FormValueType extends Partial<AddCompanyParams> {
  // target?: string;
  // template?: string;
  // type?: string;
  // time?: string;
  // frequency?: string;
}

interface DeleteModalProps extends FormComponentProps {
  deleteModalVisible: boolean;
  handleDelete: (fieldsValue:FormValueType) => void;
  handleDeleteModalVisible: () => void;
  values: Partial<TableListItem>;
}
const DeleteModal: React.FC<DeleteModalProps> = props => {
  const { deleteModalVisible, form, handleDelete, handleDeleteModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleDelete(fieldsValue);
    });
  };

  return (
    <Modal
        title="提示"
        visible={deleteModalVisible}
        onOk={okHandle}
        // confirmLoading={confirmLoading}
        onCancel={() => handleDeleteModalVisible()}
    >
        <p>"确定删除该公司？"</p>
        <p>"该操作成功之后，将无法恢复。"</p>
    </Modal>
    );

  
};

export default Form.create<DeleteModalProps>()(DeleteModal);
