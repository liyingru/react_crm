import { Component, ChangeEventHandler } from "react";
import React from "react";
import Table, { ColumnProps } from "antd/lib/table";
import Divider from "antd/lib/divider";
import { Dropdown, Button, Menu, Form, Modal, Input, Select, message, DatePicker } from "antd";
import { FormComponentProps } from "antd/es/form";
import moment from "moment";
import { ImportReqBean, ReqListData, TableListPagination } from "./data";

export interface ReqModalPros {
  data: ReqListData;
  loading: boolean;
  handleStandardTableChange: (pagination: Partial<TableListPagination>) => void;
  onRef: (ref: any) => void;
}

export interface ReqModalState {
  modalVisible: boolean;
}


class RequireDialog extends Component<ReqModalPros, ReqModalState>{

  columns: ColumnProps<ImportReqBean>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_id',
    },
    {
      title: '婚期开始时间',
      dataIndex: 'wedding_date_from',
    },
    {
      title: '婚期结束时间',
      dataIndex: 'wedding_date_end',
    },
    {
      title: '档期类型',
      dataIndex: 'schedule_type_txt',
    },
    {
      title: '预定酒店',
      dataIndex: 'hotel',
    },
    {
      title: '宴会厅',
      dataIndex: 'hotel_hall',
    },
    {
      title: '最小桌数',
      dataIndex: 'hotel_tables_from',
    },
    {
      title: '最大桌数',
      dataIndex: 'hotel_tables_end',
    },
    {
      title: '最小预算',
      dataIndex: 'budget_from',
    },
    {
      title: '最大预算',
      dataIndex: 'budget_end',
    },
    {
      title: '新郎姓名',
      dataIndex: 'groom_name',
    },
    {
      title: '新郎联系',
      dataIndex: 'groom_phone',
    },
    {
      title: '新娘姓名',
      dataIndex: 'bride_name',
    },
    {
      title: '新娘联系',
      dataIndex: 'bride_phone',
    },
    {
      title: '负责策划',
      dataIndex: 'sale',
    },
    {
      title: '负责客服',
      dataIndex: 'kefu',
    },
    {
      title: '客户一级来源',
      dataIndex: 'top_channel_txt',
    },
    {
      title: '客户二级来源',
      dataIndex: 'final_channel_txt',
    },
    {
      title: '业务一级品类',
      dataIndex: 'top_category_txt',
    },
    {
      title: '业务子品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '有效单创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '策划跟进时间',
      dataIndex: 'cehua_time',
    },
    {
      title: '策划师跟进记录',
      dataIndex: 'cehua_log',
    },
    {
      title: '是否到店',
      dataIndex: 'is_arrival_txt',
    },	
    {
      title: '客户状态',
      dataIndex: 'customer_status_txt',
    },
    {
      title: '客服跟进时间',
      dataIndex: 'kefu_time',
    },
    {
      title: '客服跟进记录',
      dataIndex: 'kefu_log',
    },
    {
      title: '任务名称',
      dataIndex: 'leads_tag',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];


  constructor(props: Readonly<ReqModalPros>) {
    super(props)
    this.props.onRef(this)
  }

  state: ReqModalState = {
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
          <span>有效单列表</span>
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

export default RequireDialog
