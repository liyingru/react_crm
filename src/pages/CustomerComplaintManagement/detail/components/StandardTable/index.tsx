import { Alert, Table, Icon } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';
import { FileImageOutlined } from '@ant-design/icons';

import { CustomerComplaintFollowData } from '../../../data';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  data: {
    list: CustomerComplaintFollowData[];
    pagination: StandardTableProps<CustomerComplaintFollowData>['pagination'];
  };
}

export interface StandardTableColumnProps extends ColumnProps<CustomerComplaintFollowData> {
  needTotal?: boolean;
  total?: number;
}

// function initTotalList(columns: StandardTableColumnProps[]) {
//   if (!columns) {
//     return [];
//   }
//   const totalList: StandardTableColumnProps[] = [];
//   columns.forEach(column => {
//     if (column.needTotal) {
//       totalList.push({ ...column, total: 0 });
//     }
//   });
//   return totalList;
// }

interface StandardTableState {
  // selectedRowKeys: string[];
  // needTotalList: StandardTableColumnProps[];
}

class FollowTable extends Component<StandardTableProps<CustomerComplaintFollowData>, StandardTableState> {
  // static getDerivedStateFromProps(nextProps: StandardTableProps<CustomerComplaintDetail>) {
  //   // clean state
  //   if (nextProps.selectedRows.length === 0) {
  //     const needTotalList = initTotalList(nextProps.columns);
  //     return {
  //       selectedRowKeys: [],
  //       needTotalList,
  //     };
  //   }
  //   return null;
  // }

  constructor(props: StandardTableProps<CustomerComplaintFollowData>) {
    super(props);
    // const { columns } = props;
    // const needTotalList = initTotalList(columns);

    // this.state = {
    //   selectedRowKeys: [],
    //   needTotalList,
    // };
  }

  columns: StandardTableColumnProps[] = [
    {
      title: '跟进时间',
      dataIndex: 'follow_time',
    },
    {
      title: '客诉类型',
      dataIndex: 'type',
    },
    {
      title: '沟通内容',
      dataIndex: 'content',
      width: 300,
      ellipsis: true,
    },
    {
      title: '附件',
      dataIndex: 'file',
      render: (text: string[], record: CustomerComplaintFollowData, index: number) => {
        const files = text;
        if (files && files.length > 0) {
          return (
            <div>
              {
                files.map(file => (<a style={{ margin: 5 }} href={file} target="_blank"><FileImageOutlined /></a>))
              }
            </div>
          )
        } else {
          return <span style={{ margin: 5, color: "gray" }}>未上传附件</span>
        }
      }
    },
    {
      title: '下次回访时间',
      dataIndex: 'follow_next',
    },
    {
      title: '提交人',
      dataIndex: 'user_name',
      width: 80,
    },
    // {
    //   title: '操作',
    //   fixed: 'right',
    //   render: (text, record, index) => {
    //     return record.user_name=="大力程"?<a>编辑</a>:<span style={{margin:5, color:"gray"}}>无权限</span>;
    //   }
    // },

  ];

  // handleRowSelectChange: TableRowSelection<CustomerComplaintDetail>['onChange'] = (
  //   selectedRowKeys,
  //   selectedRows: CustomerComplaintDetail[],
  // ) => {
  //   const currySelectedRowKeys = selectedRowKeys as string[];
  //   let { needTotalList } = this.state;
  //   needTotalList = needTotalList.map(item => ({
  //     ...item,
  //     total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
  //   }));
  //   const { onSelectRow } = this.props;
  //   if (onSelectRow) {
  //     onSelectRow(selectedRows);
  //   }

  //   this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  // };

  handleTableChange: TableProps<CustomerComplaintFollowData>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  // cleanSelectedKeys = () => {
  //   if (this.handleRowSelectChange) {
  //     this.handleRowSelectChange([], []);
  //   }
  // };

  render() {
    // const { selectedRowKeys, needTotalList } = this.state;
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    const paginationProps = pagination
      ? {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      }
      : false;

    // const rowSelection: TableRowSelection<CustomerComplaintDetail> = {
    //   selectedRowKeys,
    //   onChange: this.handleRowSelectChange,
    //   getCheckboxProps: (record: CustomerComplaintDetail) => ({
    //     disabled: record.disabled,
    //   }),
    // };

    return (
      <div className={styles.standardTable}>
        {/* <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {needTotalList.map((item, index) => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}
                    总计&nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render
                        ? item.render(item.total, item as CustomerComplaintDetail, index)
                        : item.total}
                    </span>
                  </span>
                ))}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div> */}
        <Table
          size="small"
          scroll={{ x: 'max-content' }}
          rowKey={rowKey || 'key'}
          // rowSelection={rowSelection}
          dataSource={list}
          columns={this.columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default FollowTable;
