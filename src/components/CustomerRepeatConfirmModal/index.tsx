import { Form,  Modal,  } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { CustomerDataSimple } from '@/pages/ReviewManagement/repeatDetail/data';

interface CustomerRepeatConfirmModalProps extends FormComponentProps {
    title?: string;
    goText?: string;
    visible: boolean;
    currentCustomer: CustomerDataSimple;
    targetSimilarCustomer: CustomerDataSimple;
    onOk: () => void;
    onCancel: ()=>void;
}

const CustomerRepeatConfirmModal: React.FC<CustomerRepeatConfirmModalProps> = props => {
  const { title, goText, visible, onOk, onCancel } = props;
  const {currentCustomer, targetSimilarCustomer} = props;

  const checkCustomerDetail = (customer_id: string) => {
      const currentUrl = window.location.href;
      const index = currentUrl.indexOf("/customer/");
      const targetUrl = currentUrl.substring(0, index)+"/customer/customerManagement/customerDetail";
      window.open(targetUrl+"?customerId="+customer_id);
  };

  const okHandle = () => {
    onOk();
  };

  const cancelHandle = () => {
    onCancel();
  };

  return (
    <Modal
        destroyOnClose={true}
        title={title}
        visible={visible}
        onOk={okHandle}
        onCancel={cancelHandle}
        okText="确定"
        okType='primary'
        cancelText="取消"
        >
        <span>客户 <span style={{fontWeight:500, color:"gray"}}>{currentCustomer.customer_name + " " + currentCustomer.phone}</span> 已存在父客户 <a onClick={()=>{checkCustomerDetail(targetSimilarCustomer.customer_id)}} style={{fontWeight:500}}>{targetSimilarCustomer.customer_name + " " + targetSimilarCustomer.phone}</a>。{goText?goText:"请发起父客户的重单申请。"}</span>
    </Modal>
    );

  
};

export default Form.create<CustomerRepeatConfirmModalProps>()(CustomerRepeatConfirmModal);
