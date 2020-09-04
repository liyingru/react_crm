import { Table, Button, Modal, Form, Checkbox, Alert, Tooltip, Divider } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';
import styles from './index.less';

import FormItem from 'antd/lib/form/FormItem';
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * 
 * @param id  dataIndex
 * @param name  title
 * @param extra  column其他属性 {fixed: "", render: ()=>void, width: 0, }...
 * @param disable  自定义列表的时候是否不允许修改该字段
 */
const getCrmTableColumn = <T,>(id: string, name: string, extra: ColumnProps<T> = {}, disable: boolean = false): CrmStandardTableColumnProps<T> => {
  return {
    ...extra,
    dataIndex: id,
    key: id,
    title: name,
    disableSelect: !!disable,
  }
}

export { getCrmTableColumn };

export interface CrmStandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: CrmStandardTableColumnProps<T>[];
  data: {
    list: T[];
    pagination: CrmStandardTableProps<T>['pagination'];
  };
  selectedRows?: T[];
  onSelectRow?: (rows: any) => void;
  /** 表格上方的操作按钮区域 */
  renderTopButtons?: () => React.ReactNode;
  /** 是否可以自定义表头显示项 */
  columnsEditable?: boolean;
  /** 表格中的行是否可选，如不指定，就是不可选 */
  selecteMode?: 'checkbox' | 'radio';
  /** 在可选模式下，某条row数据不允许选中的条件,返回true代表不可选中，返回false代表可选中  */
  disableSelectRow?: (record: T) => boolean;
  /** 选中表格中的行，变化时的回调 */
  onRowsSelectChanged?: (selectedRows: T[]) => void;
  /** 切换页/页大小 */
  onPaginationChanged?: (page: number, pageSize: number) => void;
}

export interface CrmStandardTableColumnProps<T> extends ColumnProps<T> {
  needTotal?: boolean;
  total?: number;
  weight?: number;
  /** 表头上是否显示该字段 */
  isShowing?: boolean;
  /** 该字段是否必显示（不可隐藏） */
  disableSelect?: boolean;
}

function initTotalList<T>(columns: CrmStandardTableColumnProps<T>[]) {
  if (!columns) {
    return [];
  }
  const totalList: CrmStandardTableColumnProps<T>[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

function initSelectedColumns<T>(columns: CrmStandardTableColumnProps<T>[]) {
  if (!columns) {
    return [];
  }
  const selectedColumns: CrmStandardTableColumnProps<T>[] = [];
  let columnString = localStorage.getItem('crm_table_list_columns_selected_for_' + window.location.pathname)
  if (columnString) {
    let selectedColumnKeys = JSON.parse(columnString) as string[]
    if (selectedColumnKeys) {
      columns.forEach(column => {
        if (!!column.disableSelect || selectedColumnKeys.indexOf(column.dataIndex ? column.dataIndex : "") >= 0) {
          selectedColumns.push(column);
        }
      });
    }
  } else {
    return columns;
  }

  return selectedColumns;
}

interface CrmStandardTableState<T> {
  selectedRowKeys: string[];
  needTotalList: CrmStandardTableColumnProps<T>[];
  editModalVisible: boolean;
  selectedColumns: CrmStandardTableColumnProps<T>[];
  tmpSaveCheckedKeys: string[];
  selectedRowsContainer: T[];
}


class CrmStandardTable<T> extends Component<CrmStandardTableProps<T>, CrmStandardTableState<T>> {

  static getDerivedStateFromProps<T>(nextProps: CrmStandardTableProps<T>) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: CrmStandardTableProps<T>) {
    super(props);
    const { columns, columnsEditable } = props;
    const needTotalList = initTotalList(columns);
    const selectedColumns = columnsEditable ? initSelectedColumns(columns) : columns;

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      editModalVisible: false,
      selectedColumns,
      tmpSaveCheckedKeys: [],
      selectedRowsContainer: [],
    };
  }

  /**
   * 选中/取消选中表格中某一行的回调
   */
  handleRowSelectChange: TableRowSelection<T>['onChange'] = (
    selectedRowKeys,
    selectedRows: T[],
  ) => {

    let { selectedRowsContainer } = this.state;

    const { rowKey } = this.props;
    let rowKeyStr = "";
    if (typeof (rowKey) == "string") {
      rowKeyStr = rowKey;
    }
    /** 把之前几页选中的 rowKey拿出来 */
    const lastRowKeys: string[] = selectedRowsContainer.map(row => row[rowKey]);
    /** 如果当前选中的，是新的，就也加进去container里 */
    selectedRows.map(selectedRow => {
      if (lastRowKeys.indexOf(selectedRow[rowKey]) < 0) {
        selectedRowsContainer.push(selectedRow);
      }
    })

    selectedRowsContainer = selectedRowsContainer.filter(row => selectedRowKeys.indexOf(row[rowKey]) >= 0);

    this.setState({ selectedRowsContainer })

    const { onRowsSelectChanged } = this.props;
    if (onRowsSelectChanged) {
      onRowsSelectChanged(selectedRowsContainer);
    }

    const currySelectedRowKeys = selectedRowKeys as string[];

    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));

    this.setState({
      selectedRowKeys: currySelectedRowKeys,
      needTotalList
    });
  };


  handleTableChange: TableProps<T>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange, onPaginationChanged } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
    if (onPaginationChanged) {
      onPaginationChanged(pagination.current ? pagination.current : 1, pagination.pageSize ? pagination.pageSize : 20);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  handleChangeCheckGroup = (checkedValue: string[]) => {
    this.setState({
      tmpSaveCheckedKeys: checkedValue,
    })
  }

  /**
   * 保存编辑好的要显示的表头column字段
   */
  handleSubmitCustomizeTableColumns = () => {
    const { tmpSaveCheckedKeys } = this.state;

    const { columns } = this.props;
    const selectedColumns = columns.filter(column => tmpSaveCheckedKeys.indexOf(column.dataIndex ? column.dataIndex : "") >= 0);
    this.setState({
      selectedColumns,
    })

    localStorage.setItem('crm_table_list_columns_selected_for_' + window.location.pathname, JSON.stringify(tmpSaveCheckedKeys));

    this.handleTableCustomizeModalVisible(false)
  }

  handleTableCustomizeModalVisible = (visible?: boolean) => {
    const editModalVisible = !!visible
    this.setState({ editModalVisible });
  }

  render() {
    const { data, selecteMode, rowKey, columns, columnsEditable, disableSelectRow, renderTopButtons, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const { selectedRowKeys, needTotalList, selectedColumns } = this.state;

    const selectedColumnKeys: string[] | undefined = this.props.columnsEditable ? selectedColumns.map((item) => {
      return item.dataIndex ? item.dataIndex : ""
    }) : undefined;

    const paginationProps = pagination
      ? {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total: number, range: [number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
        ...pagination,
      } : false;

    /** 是表格可选中的属性 */
    const rowSelection: TableRowSelection<T> | undefined = selecteMode ? {
      type: selecteMode,
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: T) => ({
        disabled: disableSelectRow ? disableSelectRow(record) : false, // 自己填写不允许选中某一条数据的条件
      }),
    } : undefined;

    if (selecteMode && !rowKey) {
      throw new Error("当selecteMode不为空时，必须给CrmStandardTable指定rowKey属性！");
    }

    return (
      <div className={styles.tableList}>
        <div style={{ display: renderTopButtons || columnsEditable ? 'flex' : 'none' }} className={styles.tableTopButtonsContainer}>
          <span style={{ flex: 1 }}></span>
          {
            renderTopButtons && renderTopButtons()
          }
          {/* <Divider type="vertical" style={{margin: "auto 10px", height: 25}} /> */}
          {
            columnsEditable && (
              <Button type="default" style={{ width: 100, marginLeft: 10, borderColor: '#1791FF', color: '#1791FF', }} onClick={() => this.handleTableCustomizeModalVisible(true)}>自定义列表</Button>
              // <Tooltip placement="top" title={"自定义列表"}>
              //  <SettingOutlined style={{fontSize: 19, margin: "auto"}}  onClick={()=>this.handleTableCustomizeModalVisible(true)}></SettingOutlined>
              // </Tooltip>
            )
          }
        </div>
        {
          selecteMode && (
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
                          ? item.render(item.total, item as T, index)
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
          )
        }

        <Table style={{ width: '100%', height: '100%' }}
          scroll={{ x: 'max-content' }}
          rowKey={rowKey}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          columns={this.state.selectedColumns}
          {...rest}
          onChange={this.handleTableChange}
        />

        <Modal
          title="自定义显示列" okText='保存' cancelText='取消'
          centered
          visible={this.state.editModalVisible}
          onOk={this.handleSubmitCustomizeTableColumns}
          onCancel={() => this.handleTableCustomizeModalVisible(false)}
          destroyOnClose={true}
        >
          <Form>
            <FormItem>
              <Checkbox.Group
                defaultValue={selectedColumnKeys ? selectedColumnKeys : undefined}
                onChange={this.handleChangeCheckGroup}
              >
                {
                  this.props.columns?.map(column => (
                    <Checkbox value={column.dataIndex ? column.dataIndex : ""} key={column.dataIndex ? column.dataIndex : ""} disabled={!!column.disableSelect}>{column.title}</Checkbox>))
                }
              </Checkbox.Group>
            </FormItem>

          </Form>
        </Modal>
      </div>
    );
  }
}

export default (CrmStandardTable);
