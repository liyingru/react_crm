import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';

import { CustomerListItem } from '../../data.d';
import styles from './index.less';
import CrmUtil from '@/utils/UserInfoStorage';
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: CustomerListItem[];
    pagination: StandardTableProps<CustomerListItem>['pagination'];
  };
  selectedRows: CustomerListItem[];
  onSelectRow: (rows: any) => void;
  onItemClick?:(bean: CustomerListItem) => void;
}

export interface StandardTableColumnProps extends ColumnProps<CustomerListItem> {
  needTotal?: boolean;
  total?: number;
  weight?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<CustomerListItem>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<CustomerListItem>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<CustomerListItem>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }


  handleRowSelectChange: TableRowSelection<CustomerListItem>['onChange'] = (
    selectedRowKeys,
    selectedRows: CustomerListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys:currySelectedRowKeys , needTotalList });
  };


  handleTableChange: TableProps<CustomerListItem>['onChange'] = (
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

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { data, rowKey,onItemClick, ...rest} = this.props;
    const { list = [], pagination = false } = data || {};
    const { selectedRowKeys ,needTotalList} = this.state;

    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal:(total:number, range:[number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
          ...pagination,
        }
      : false;

    const rowSelection: TableRowSelection<CustomerListItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      // getCheckboxProps: (record: TableListItem) => ({
      //   disabled: record.disabled,
      // }),
    };
    const company_tag = JSON.parse(window.localStorage.getItem('gcrm-user-info')).company_tag
    const customeradapter_batchupdatecustomer = JSON.parse(window.localStorage.getItem('permission')).customeradapter_batchupdatecustomer
    return (
      <div>
        {
          CrmUtil.getCompanyType() == 2 && customeradapter_batchupdatecustomer == true ? 
          <div className={styles.standardTable}>
          <div className={styles.tableAlert}>
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
                        ? item.render(item.total, item as CustomerListItem, index)
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
        </div>
            <Table style={{ width: '100%', height: '100%' }}
              rowKey={rowKey || 'key'}
              rowSelection={rowSelection}
              dataSource={list}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              {...rest}
            />
          </div>
          : <Table style={{ width: '100%', height: '100%' }}
            rowKey={rowKey || 'key'}
            dataSource={list}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            {...rest}
          />
        }
      </div>
    );
  }
}

export default StandardTable;
