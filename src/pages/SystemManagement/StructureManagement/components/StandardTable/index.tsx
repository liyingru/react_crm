import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';

import styles from './index.less';
import { StructureData } from '../../data';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<StructureData> extends Omit<TableProps<StructureData>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: StructureData[];
    pagination: StandardTableProps<StructureData>['pagination'];
  };
  selectedRows: StructureData[];
  onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<StructureData> {
  needTotal?: boolean;
  total?: number;
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

class StandardTable extends Component<StandardTableProps<StructureData>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<StructureData>) {
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

  constructor(props: StandardTableProps<StructureData>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<StructureData>['onChange'] = (
    selectedRowKeys,
    selectedRows: StructureData[],
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

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<StructureData>['onChange'] = (
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
    const { selectedRowKeys, needTotalList } = this.state;
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    // const paginationProps = pagination
    //   ? {
    //       showSizeChanger: true,
    //       showQuickJumper: true,
    //       ...pagination,
    //     }
    //   : false;

    // const rowSelection: TableRowSelection<TableListItem> = {
    //   selectedRowKeys,
    //   onChange: this.handleRowSelectChange,
    //   getCheckboxProps: (record: TableListItem) => ({
    //     disabled: record.disabled,
    //   }),
    // };

    return (
      <div className={styles.standardTable}>
        
        {/* <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                {JSON.stringify(pagination)}
                
                正在显示第{pagination&&pagination.current&&pagination.pageSize?(pagination.current-1)*pagination.pageSize+1:0}到第{pagination&&pagination.current&&pagination.pageSize&&pagination.total?Math.min((pagination.current)*pagination.pageSize, pagination.total):0}条记录，总共{pagination&&pagination.total?pagination.total:0}条记录
                
              </Fragment>
            } 
            type="success"
          />
        </div> */}
        <Table
          rowKey={rowKey || 'key'}
          // rowSelection={rowSelection}
          dataSource={list}
          pagination={false}
          // pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
          // scroll={{y:260}}
        />
      </div>
    );
  }
}

export default StandardTable;
