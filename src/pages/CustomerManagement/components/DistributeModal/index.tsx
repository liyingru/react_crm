import { Form, Modal, Spin, Select } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { CustomerListItem } from '../../sunnyList/data';
const FormItem = Form.Item;
const { Option } = Select;

export interface DistributeProps extends FormComponentProps {
  loading?: boolean;
  visibility: boolean;
  distributeRows: CustomerListItem[];
  distributeStuffsOptions: [{ name: string, id: string | number }]
  onDistributeExecute: (ownerId: string) => void;
  onDistributeCancel: () => void;
}

export interface DistributeState {

}

class DistributeModal extends Component<DistributeProps, DistributeState> {

  constructor(props: DistributeProps) {
    super(props);
    this.state = {
    }
  }

  handleAssignSubmit = () => {
    const { onDistributeExecute, form } = this.props;
    form.validateFields(['modal_assign_id'], (err, values) => {
      if (err) {
        return
      }
      if (onDistributeExecute) {
        onDistributeExecute(values['modal_assign_id']);
      }
    })
  }

  handleAssignCancel = () => {
    const { onDistributeCancel } = this.props;
    if (onDistributeCancel) {
      onDistributeCancel();
    }
  }

  render() {
    const { loading, visibility, distributeRows, form: { getFieldDecorator }, distributeStuffsOptions } = this.props;
    const { selfVisibility } = this.state;
    return (
      <Modal
        title="数据分配"
        okText='提交分配'
        cancelText='取消分配'
        okButtonProps={{ disabled: loading ?? false }}
        cancelButtonProps={{ disabled: loading ?? false }}
        visible={visibility}
        onOk={this.handleAssignSubmit}
        onCancel={this.handleAssignCancel}
        destroyOnClose={true}>
        <Spin spinning={loading ?? false}>
          <div>已选中：{distributeRows.length}条</div>
          <div className={styles.distributeForm} style={{ marginTop: '20px' }}>
            <Form >
              <FormItem
                label="人名"
                style={{ marginTop: '20px' }}
                labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('modal_assign_id')(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear showSearch optionFilterProp="children">
                    {
                      distributeStuffsOptions && distributeStuffsOptions.map((item) => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>))
                    }
                  </Select>,
                )}
              </FormItem>
            </Form>
          </div>
        </Spin>
      </Modal >
    )
  }
}

export default Form.create<DistributeProps>()(DistributeModal);
