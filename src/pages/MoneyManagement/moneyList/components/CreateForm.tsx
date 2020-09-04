import { Form, Input, Modal, Tabs, Select, Button, Table } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleModalVisible: () => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const areaColumns = [
    {
      title: '区域',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '组名',
      dataIndex: 'age',
    },
  ];
  const groupColumns = [
    {
      title: '工号',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '人名',
      dataIndex: 'age',
    },
  ];
  const areaData = [
    {
      key: '1',
      name: '北京',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: '北京',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: '北京',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: '上海',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  const groupData = [
    {
      key: '1',
      name: '北京',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: '北京',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: '北京',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: '上海',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Modal
      destroyOnClose
      title=""
      visible={modalVisible}
      footer={null}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Tabs type="card">
        <TabPane tab="分配组" key="1">
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组名">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '请选择分配组名', min: 5 }],
            })(<div>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="请选择分配组名"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
              <Button type="primary" style={{ marginLeft: 8 }}>分配</Button>
            </div>)}
          </FormItem>
          <Table rowSelection={rowSelection} columns={areaColumns} dataSource={areaData} />
        </TabPane>
        <TabPane tab="分配人" key="2">
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="人名">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '请选择分配人名', min: 5 }],
            })(<div>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="请选择分配人名"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
              <Button type="primary" style={{ marginLeft: 8 }}>分配</Button>
            </div>)}
          </FormItem>
          <Table rowSelection={rowSelection} columns={groupColumns} dataSource={groupData} />
        </TabPane>
      </Tabs>
    </Modal >
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
