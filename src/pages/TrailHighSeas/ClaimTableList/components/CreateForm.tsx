import { Form, Input, Modal, Tabs, Select, Button, Table } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { Component, Fragment } from 'react';
import { string } from 'prop-types';

const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;
let idString = '';
interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  areaData: [];
  roleData: [];
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleModalVisible: () => void;
  groupOnSearch: (value: string) => void;
  personOnSearch: (value: string) => void;
  groupDistrubuteButtonClick: (value: string) => void;
  personDistrubuteButtonClick: (value: string) => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    areaData,
    roleData,
    groupOnSearch,
    personOnSearch,
    groupDistrubuteButtonClick,
    personDistrubuteButtonClick, } = props;
    
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
      dataIndex: 'city',
      render: text => <a>{text}</a>,
    },
    {
      title: '组名',
      dataIndex: 'name',
    },
  ];
  const groupColumns = [
    {
      title: '工号',
      dataIndex: 'job_number',
      render: text => <a>{text}</a>,
    },
    {
      title: '人名',
      dataIndex: 'name',
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let ids = '';
      for (let index = 0; index < selectedRows.length; index++) {
        const element = selectedRows[index];
        ids = ids + ',' + element.id;
      }
      if (ids.length > 0) {
        ids = ids.slice(1, ids.length);
      }
      idString = ids;
    },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const { Search } = Input;

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
              // rules: [{ required: true, message: '123', min: 5 }],
            })(<div>
              <Search
                style={{ width: 200 }}
                placeholder="请输入组名"
                enterButton="搜索"
                size="default"
                onSearch={groupOnSearch}
              />
              <Button type="primary" style={{ marginLeft: 8 }} onClick={() => groupDistrubuteButtonClick(idString)}>分配</Button>
            </div>)}
          </FormItem>
          <Table rowSelection={rowSelection}
            columns={areaColumns}
            dataSource={areaData} />
        </TabPane>
        <TabPane tab="分配人" key="2">
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="人名">
            {form.getFieldDecorator('desc', {
              // rules: [{ required: true, message: '456', min: 5 }],
            })(<div>
              <Search
                style={{ width: 200 }}
                placeholder="请输入人名"
                enterButton="搜索"
                size="default"
                onSearch={personOnSearch}
              />
              <Button type="primary" style={{ marginLeft: 8 }} onClick={() => personDistrubuteButtonClick(idString)}>分配</Button>
            </div>)}
          </FormItem>
          <Table rowSelection={rowSelection}
            columns={groupColumns}
            dataSource={roleData} />
        </TabPane>
      </Tabs>
    </Modal >
  );

};

export default Form.create<CreateFormProps>()(CreateForm);
