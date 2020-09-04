import { Form, Input, Modal, Row, Col, Select, DatePicker, Radio, message, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import moment from 'moment';
import styles from '../LiheProHome/style.less'
import TextArea from 'antd/lib/input/TextArea';
import FileUpload from '@/components/FileUpload';
import MultiFilesUpload from '@/components/MultiFilesUpload';
const FormItem = Form.Item;
const { Option } = Select;


export interface BenefitAmountState {
  uploadedFileList: FileUp[];
}

interface BenefitAmountProps extends FormComponentProps {
  modalVisible: boolean;

  handleSubmit: () => void;
  handleCancel: () => void;

}

class BenefitAmount extends Component<BenefitAmountProps, BenefitAmountState>  {

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

  constructor(props: BenefitAmountProps) {
    super(props);

    this.state = {
      uploadedFileList: []
    };
  }



  okHandle = () => {
    const { form, handleSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        
        if(fieldsValue.benefitDate ) {
          fieldsValue = {
            ...fieldsValue,
            benefitDate: fieldsValue.benefitDate.format('YYYY-MM-DD'),
            file: this.files,
          }
        }
        handleSubmit(fieldsValue);
        form.resetFields();
      });
  };

  files:string[] = [];

  onUploadFileDone = (full_paths: string[]) => {
    console.log("上传文件： " + JSON.stringify(full_paths));
    this.files = full_paths;
  }

  render() {
    const { form: {getFieldDecorator}, modalVisible, handleCancel } = this.props;

    return (
      <Modal
        width="50%"
        destroyOnClose
        title={"填写收款金额"}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleCancel()}
      >
        <div className={styles.tableListForm}>
          <Form >
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="交易流水号" style={{ width: '100%' }} >
                  {
                    getFieldDecorator('tradeNumber', {
                      rules: [{ required: true, message: '请填写交易流水号！' }],
                    })(
                      <Input />
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={24}>
                <FormItem label="付款方式" style={{ width: '100%' }} >
                  {getFieldDecorator('payType', {
                    rules: [{ required: true, message: '请选择付款方式' }]
                  })(
                    <Select placeholder="请选择付款方式">
                      <Option key={1} value={1}>微信支付</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="实际收款" style={{ width: '100%' }}>
                  {getFieldDecorator('actualBenefitAmount', {
                    rules: [{ required: true, message: '请填写具体金额' }]
                  })(
                    <Input  min={0} step={0.01} prefix="￥" suffix="元"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="收款日期" >
                  {getFieldDecorator('benefitDate', {
                    rules: [{ required: true, message: '请选择收款日期' }],
                  })(
                    <DatePicker onChange={this.onPickEntrydDate} format='YYYY-MM-DD' style={{ width: '100%' }}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="备注" style={{ width: '100%' }} >
                  {getFieldDecorator('note', {
                    rules: [{ required: true, message: '备注为必填' }]
                  })(
                    <TextArea />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <FormItem label="附件" style={{ width: '100%' }}>
                  {
                    getFieldDecorator('file', {
                      rules: [{ required: false }]
                    })(
                      <div>
                        <MultiFilesUpload onUploadDone={this.onUploadFileDone} text="选择文件"/>
                        <span style={{marginTop: 2 }}>单个文件最大支持80MB，上传请耐心等待</span>
                      </div>
                    )
                  }
                </FormItem>
              </Col>
            </Row>

          </Form>
        </div>
      </Modal>
    );
  }

}

export default Form.create<BenefitAmountProps>()(BenefitAmount);
