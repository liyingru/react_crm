import React from "react";
import { Select, Modal, Form, Input } from 'antd';
import NumericInput from "@/components/NumericInput";
import { FormComponentProps } from "antd/lib/form";
import { StructureMonthlySalesTarget } from "../../salesTarget/data";
const { Option } = Select;


interface StructureMonthlyTargetInputProps extends FormComponentProps {
  companyId: string,
  structureValue: string,
  structureList: [],
  targetModel?: StructureMonthlySalesTarget,
  visible: boolean,
  onOk: ((fieldsValue: any, targetId?: string) => void),
  onCancel?: (() => void)
}

const StructureMonthlyTargetInput: React.FC<StructureMonthlyTargetInputProps> = props => {
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
        width={500}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        bodyStyle={{
          height: document.body.scrollHeight - 290, overflowY: 'auto'
        }}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} layout='horizontal' size='small'>
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
          <Form.Item label="一月目标">
            {
              form.getFieldDecorator('month1', { initialValue: targetModel?.month_1 ?? structureValue, rules: [{ required: true, message: '请输入一月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="二月目标">
            {
              form.getFieldDecorator('month2', { initialValue: targetModel?.month_2 ?? structureValue, rules: [{ required: true, message: '请输入二月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="三月目标">
            {
              form.getFieldDecorator('month3', { initialValue: targetModel?.month_3 ?? structureValue, rules: [{ required: true, message: '请输入三月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="四月目标">
            {
              form.getFieldDecorator('month4', { initialValue: targetModel?.month_4 ?? structureValue, rules: [{ required: true, message: '请输入四月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="五月目标">
            {
              form.getFieldDecorator('month5', { initialValue: targetModel?.month_5 ?? structureValue, rules: [{ required: true, message: '请输入五月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="六月目标">
            {
              form.getFieldDecorator('month6', { initialValue: targetModel?.month_6 ?? structureValue, rules: [{ required: true, message: '请输入六月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="七月目标">
            {
              form.getFieldDecorator('month7', { initialValue: targetModel?.month_7 ?? structureValue, rules: [{ required: true, message: '请输入七月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="八月目标">
            {
              form.getFieldDecorator('month8', { initialValue: targetModel?.month_8 ?? structureValue, rules: [{ required: true, message: '请输入八月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="九月目标">
            {
              form.getFieldDecorator('month9', { initialValue: targetModel?.month_9 ?? structureValue, rules: [{ required: true, message: '请输入九月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="十月目标">
            {
              form.getFieldDecorator('month10', { initialValue: targetModel?.month_10 ?? structureValue, rules: [{ required: true, message: '请输入十月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="十一月目标">
            {
              form.getFieldDecorator('month11', { initialValue: targetModel?.month_11 ?? structureValue, rules: [{ required: true, message: '请输入十一月目标' }], })(
                <NumericInput suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="十二月目标">
            {
              form.getFieldDecorator('month12', { initialValue: targetModel?.month_12 ?? structureValue, rules: [{ required: true, message: '请输入十二月目标' }], })(
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

export default Form.create<StructureMonthlyTargetInputProps>()(StructureMonthlyTargetInput);
