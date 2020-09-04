import { Component, ChangeEventHandler } from "react";
import React from "react";
import Table, { ColumnProps } from "antd/lib/table";
import Divider from "antd/lib/divider";
import { Dropdown, Button, Menu, Form, Modal, Input, Select, message, DatePicker } from "antd";
import { FormComponentProps } from "antd/es/form";
import moment from "moment";
import { LeadsListItem, LeadsListData, TableListPagination } from "./data";


export interface LeadsModalPros {
  data: LeadsListData;
  loading: boolean;
  handleStandardTableChange: (pagination: Partial<TableListPagination>) => void;
  onRef: (ref: any) => void;
}

export interface LeadsModalState {
  modalVisible: boolean;
}


class LeadsDialog extends Component<LeadsModalPros, LeadsModalState>{

  columns: ColumnProps<LeadsListItem>[] = [
    {
      title: '线索id',
      dataIndex: 'id',
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
    },
    {
      title: '业务类型',
      dataIndex: 'category',
    },
    {
      title: '业务城市',
      dataIndex: 'location_city_info',
      render(location_city_info: any) {
        const { full } = location_city_info;
        return (
          <div>
            {
              full
            }
          </div>
        )
      },
    },
    {
      title: '客资来源',
      dataIndex: 'channel',
    },
    {
      title:'客户电话',
      dataIndex: 'hide_phone',
    },
    {
      title: '婚期',
      dataIndex: 'wedding_date',
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '线索状态',
      dataIndex: 'status',
    },
    {
      title: '活动名称',
      dataIndex: 'task_id',
    },
    {
      title: '线索创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '最新服务时间',
      dataIndex: 'follow_newest',
    },
    {
      title: '最新服务记录',
      dataIndex: 'follow_status',
    },
    {
      title: '当前归属人',
      dataIndex: 'owner_name',
    }
  ];


  constructor(props: Readonly<LeadsModalPros>) {
    super(props)
    this.props.onRef(this)
  }

  state: LeadsModalState = {
    modalVisible: false,
  }

  setModalVisible = (visible: boolean) => {
    this.setState({
      modalVisible: visible
    })
  }

  render() {
    const { loading, data, handleStandardTableChange } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = pagination
      ? {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      }
      : false;

    return (
      <Modal
        title={(<div>
          <span>线索列表</span>
          <span>共计{data.pagination.total}条</span>
        </div>)}
        visible={this.state.modalVisible}
        centered
        destroyOnClose={true}
        onCancel={() => this.setModalVisible(false)}
        width='900'
        footer={[
          <Button key="back" onClick={() => this.setModalVisible(false)}>关闭</Button>
        ]}>
        <Table
          size='small'
          scroll={{ x: 'max-content' }}
          loading={loading}
          dataSource={list}
          columns={this.columns}
          pagination={paginationProps}
          onChange={handleStandardTableChange}
        />
      </Modal>
    )
  }
}

export default LeadsDialog
