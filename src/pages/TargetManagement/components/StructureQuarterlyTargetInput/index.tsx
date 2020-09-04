import React from "react";
import { Select, Modal, Form, Input } from 'antd';
import NumericInput from "@/components/NumericInput";
import { FormComponentProps } from "antd/lib/form";
import { StructureQuarterlySalesTarget } from "../../salesTarget/data";
const { Option } = Select;

interface StructureQuarterlyTargetInputProps extends FormComponentProps {
  companyId: string,
  structureValue: string,
  structureList: [],
  targetModel?: StructureQuarterlySalesTarget,
  visible: boolean,
  onOk: ((fieldsValue: any, targetId?: string) => void),
  onCancel?: (() => void)
}

const StructureQuarterlyTargetInput: React.FC<StructureQuarterlyTargetInputProps> = props => {
  const { companyId, structureValue, structureList, targetModel, visible, onOk, onCancel, form } = props;
  if (companyId !== undefined && structureList !== undefined) {
    const handleOk = () => {
      form.validateFields((err, fieldsValue) => {
        console.log(fieldsValue);
        if (err) return;
        fieldsValue = {
          companyId: companyId,
          ...fieldsValue
        }
        onOk(fieldsValue, targetModel?.id);
        form.resetFields();
      });
    }

    const handleCancel = () => {
      form.resetFields();
      onCancel();
    }

    return (
      <Modal
        title="请填写部门业绩"
        centered
        width={600}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} layout="horizontal">
          <Form.Item label="年份">
            {
              form.getFieldDecorator('year', { initialValue: targetModel?.year ?? '2020', rules: [{ required: true, message: '请选择年份' }], })(
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="请选择年份"
                  disabled={targetModel ? true : false}
                  filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                  <Option value={'2020'} key={'2020'}>{'2020年'}</Option>
                  <Option value={'2021'} key={'2021'}>{'2021年'}</Option>
                  <Option value={'2022'} key={'2022'}>{'2022年'}</Option>
                  <Option value={'2023'} key={'2023'}>{'2023年'}</Option>
                  <Option value={'2024'} key={'2024'}>{'2024年'}</Option>
                  <Option value={'2025'} key={'2025'}>{'2025年'}</Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="目标部门">
            {
              form.getFieldDecorator('structureId', { initialValue: targetModel?.structure_id ?? structureValue, rules: [{ required: true, message: '请选择部门' }], })(
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="请选择部门"
                  disabled={targetModel ? true : false}
                  filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                  {structureList && structureList.map((structure, index) => (
                    <Option value={structure.id} key={structure.name} index={index}>{structure.name}</Option>
                  ))}
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="一季度目标：">
            {
              form.getFieldDecorator('quarter1', { initialValue: targetModel?.quarter1 ?? '', rules: [{ required: true, message: '请输入一季度目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="二季度目标：">
            {
              form.getFieldDecorator('quarter2', { initialValue: targetModel?.quarter2 ?? '', rules: [{ required: true, message: '请输入二季度目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="三季度目标：">
            {
              form.getFieldDecorator('quarter3', { initialValue: targetModel?.quarter3 ?? '', rules: [{ required: true, message: '请输入三季度目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="四季度目标：">
            {
              form.getFieldDecorator('quarter4', { initialValue: targetModel?.quarter4 ?? '', rules: [{ required: true, message: '请输入四季度目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
        </Form>
      </Modal >
    );
  } else {
    return (<div></div>);
  }
}

export default Form.create<StructureQuarterlyTargetInputProps>()(StructureQuarterlyTargetInput);
