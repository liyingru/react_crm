import React, { Component } from 'react';
import { Table, Divider } from "antd";
import { ColumnProps } from 'antd/lib/table';
import { StructureQuarterlySalesTargetModel, EmployeeQuarterlySalesTargetModel, StructureMonthlySalesTargetModel, EmployeeMonthlySalesTargetModel } from '../../salesTarget/data';
import styles from './style.less';
interface TargetTableState {
  companyId: string;
}

interface TargetTableProps {
  structureQuarterlySalesTargetModel?: StructureQuarterlySalesTargetModel;
  employeeQuarterlySalesTargetModel?: EmployeeQuarterlySalesTargetModel;
  structureMonthlySalesTargetModel?: StructureMonthlySalesTargetModel;
  employeeMonthlySalesTargetModel?: EmployeeMonthlySalesTargetModel;
  targetEditClick: ((model: any) => void);
  targetDeleteClick: ((targetId: string) => void);
}

class TargetTable extends Component<TargetTableProps, TargetTableState> {
  state: TargetTableState = {
    companyId: ''
  }

  componentDidMount() {

  }

  // 部门季度表头
  getStructureQuarterlyTableColumns = (rowSpanCount: number): ColumnProps<any>[] => [
    {
      title: '公司',
      dataIndex: 'company_name',
      render: (value, _row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = rowSpanCount;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '部门',
      dataIndex: 'structure_name',
    },
    {
      title: '数据类型',
      render: () => {
        return (
          <ul className={styles.tableUl}>
            <li>目标金额（万元）</li>
            <li><Divider /></li>
            <li>实收金额（万元）</li>
            <li><Divider /></li>
            <li>达成率</li>
          </ul>
        )
      }
    },
    {
      title: '第一季度',
      dataIndex: 'quarter1',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.quarter1}</li>
            <li><Divider /></li>
            <li>{record.quarter1_actual}</li>
            <li><Divider /></li>
            <li>{record.quarter1_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '第二季度',
      dataIndex: 'quarter2',
      render(_text, record) {
        return (
          <ul className={styles.tableUl}>
            <li>{record.quarter2}</li>
            <li><Divider /></li>
            <li>{record.quarter2_actual}</li>
            <li><Divider /></li>
            <li>{record.quarter2_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '第三季度',
      dataIndex: 'quarter3',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.quarter3}</li>
            <li><Divider /></li>
            <li>{record.quarter3_actual}</li>
            <li><Divider /></li>
            <li>{record.quarter3_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '第四季度',
      dataIndex: 'quarter4',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.quarter4}</li>
            <li><Divider /></li>
            <li>{record.quarter4_actual}</li>
            <li><Divider /></li>
            <li>{record.quarter4_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, record) => (
        <div>
          <a onClick={() => this.editClick(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteClick(record.id)}>删除</a>
        </div>
      ),
    },
  ];

  // 部门月度度表头
  getStructureMonthlyTableColumns = (rowSpanCount: number): ColumnProps<any>[] => [
    {
      title: '公司',
      dataIndex: 'company_name',
      render: (value, _row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = rowSpanCount;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '部门',
      dataIndex: 'structure_name',
    },
    {
      title: '数据类型',
      render: () => {
        return (
          <ul className={styles.tableUl}>
            <li>目标金额（万元）</li>
            <li><Divider /></li>
            <li>实收金额（万元）</li>
            <li><Divider /></li>
            <li>达成率</li>
          </ul>
        )
      }
    },
    {
      title: '一月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_1}</li>
            <li><Divider /></li>
            <li>{record.month_1_actual}</li>
            <li><Divider /></li>
            <li>{record.month_1_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '二月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_2}</li>
            <li><Divider /></li>
            <li>{record.month_2_actual}</li>
            <li><Divider /></li>
            <li>{record.month_2_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '三月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_3}</li>
            <li><Divider /></li>
            <li>{record.month_3_actual}</li>
            <li><Divider /></li>
            <li>{record.month_3_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '四月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_4}</li>
            <li><Divider /></li>
            <li>{record.month_4_actual}</li>
            <li><Divider /></li>
            <li>{record.month_4_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '五月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_5}</li>
            <li><Divider /></li>
            <li>{record.month_5_actual}</li>
            <li><Divider /></li>
            <li>{record.month_5_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '六月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_6}</li>
            <li><Divider /></li>
            <li>{record.month_6_actual}</li>
            <li><Divider /></li>
            <li>{record.month_6_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '七月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_7}</li>
            <li><Divider /></li>
            <li>{record.month_7_actual}</li>
            <li><Divider /></li>
            <li>{record.month_7_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '八月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_8}</li>
            <li><Divider /></li>
            <li>{record.month_8_actual}</li>
            <li><Divider /></li>
            <li>{record.month_8_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '九月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_9}</li>
            <li><Divider /></li>
            <li>{record.month_9_actual}</li>
            <li><Divider /></li>
            <li>{record.month_9_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '十月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_10}</li>
            <li><Divider /></li>
            <li>{record.month_10_actual}</li>
            <li><Divider /></li>
            <li>{record.month_10_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '十一月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_11}</li>
            <li><Divider /></li>
            <li>{record.month_11_actual}</li>
            <li><Divider /></li>
            <li>{record.month_11_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '十二月',
      render: (_text, record) => {
        return (
          <ul className={styles.tableUl}>
            <li>{record.month_12}</li>
            <li><Divider /></li>
            <li>{record.month_12_actual}</li>
            <li><Divider /></li>
            <li>{record.month_12_achieving}</li>
          </ul>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_text, record) => {
        return (
          <div>
            <a onClick={() => this.editClick(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.deleteClick(record.id)}>删除</a>
          </div>
        )
      },
    },
  ];

  // 员工季度表头
  getEmployeeQuarterlyTableColumns = (rowSpanCount: number, companyName?: string): ColumnProps<any>[] => [
    {
      title: '公司',
      dataIndex: 'company_name',
      render: (_value, _row, index) => {
        const obj = {
          children: companyName,
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = rowSpanCount;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '部门',
      dataIndex: 'structure_name',
    },
    {
      title: '员工',
      dataIndex: 'name',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr><td><ul className={styles.tableUl}><li>&nbsp;</li><li>&nbsp;</li><li>{user.name}</li><li>&nbsp;</li><li>&nbsp;</li><li>{(index !== record.user_list.length - 1) && <Divider />}</li></ul></td></tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '数据类型',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((_user, index) => (
                <tr><td><ul className={styles.tableUl}><li>目标金额（万元）</li><li><Divider /></li><li>实收金额（万元）</li><li><Divider /></li><li>达成率</li><li><li>{(index !== record.user_list.length - 1) && <Divider />}</li></li></ul></td></tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '第一季度',
      dataIndex: 'quarter1',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.quarter1}</li>
                      <li><Divider /></li>
                      <li>{user.quarter1_actual}</li>
                      <li><Divider /></li>
                      <li>{user.quarter1_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '第二季度',
      dataIndex: 'quarter2',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.quarter2}</li>
                      <li><Divider /></li>
                      <li>{user.quarter2_actual}</li>
                      <li><Divider /></li>
                      <li>{user.quarter2_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '第三季度',
      dataIndex: 'quarter3',
      render(_text, record) {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.quarter3}</li>
                      <li><Divider /></li>
                      <li>{user.quarter3_actual}</li>
                      <li><Divider /></li>
                      <li>{user.quarter3_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '第四季度',
      dataIndex: 'quarter4',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.quarter4}</li>
                      <li><Divider /></li>
                      <li>{user.quarter4_actual}</li>
                      <li><Divider /></li>
                      <li>{user.quarter4_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>&nbsp;</li>
                      <li>&nbsp;</li>
                      <li>
                        <div>
                          <a onClick={() => this.editClick(user)}>编辑</a>
                          <Divider type="vertical" />
                          <a onClick={() => this.deleteClick(user.id)}>删除</a>
                        </div>
                      </li>
                      <li>&nbsp;</li>
                      <li>&nbsp;</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      },
    },
  ];

  // 员工月度度表头
  getEmployeeMonthlyTableColumns = (rowSpanCount: number, companyName?: string): ColumnProps<any>[] => [
    {
      title: '公司',
      dataIndex: 'company_name',
      render: (_value, _row, index) => {
        const obj = {
          children: companyName,
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = rowSpanCount;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '部门',
      dataIndex: 'structure_name',
    },
    {
      title: '员工',
      dataIndex: 'name',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr><td><ul className={styles.tableUl}><li>&nbsp;</li><li>&nbsp;</li><li>{user.name}</li><li>&nbsp;</li><li>&nbsp;</li><li>{(index !== record.user_list.length - 1) && <Divider />}</li></ul></td></tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '数据类型',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((_user, index) => (
                <tr><td><ul className={styles.tableUl}><li>目标金额（万元）</li><li><Divider /></li><li>实收金额（万元）</li><li><Divider /></li><li>达成率</li><li><li>{(index !== record.user_list.length - 1) && <Divider />}</li></li></ul></td></tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '一月',
      dataIndex: 'month_1',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_1}</li>
                      <li><Divider /></li>
                      <li>{user.month_1_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_1_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '二月',
      dataIndex: 'month_2',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_2}</li>
                      <li><Divider /></li>
                      <li>{user.month_2_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_2_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '三月',
      dataIndex: 'month_3',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_3}</li>
                      <li><Divider /></li>
                      <li>{user.month_3_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_3_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '四月',
      dataIndex: 'month_4',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_4}</li>
                      <li><Divider /></li>
                      <li>{user.month_4_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_4_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '五月',
      dataIndex: 'month_5',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_5}</li>
                      <li><Divider /></li>
                      <li>{user.month_5_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_5_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '六月',
      dataIndex: 'month_6',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_6}</li>
                      <li><Divider /></li>
                      <li>{user.month_6_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_6_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '七月',
      dataIndex: 'month_7',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_7}</li>
                      <li><Divider /></li>
                      <li>{user.month_7_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_7_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '八月',
      dataIndex: 'month_8',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_8}</li>
                      <li><Divider /></li>
                      <li>{user.month_8_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_8_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '九月',
      dataIndex: 'month_9',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_9}</li>
                      <li><Divider /></li>
                      <li>{user.month_9_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_9_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '十月',
      dataIndex: 'month_10',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_10}</li>
                      <li><Divider /></li>
                      <li>{user.month_10_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_10_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '十一月',
      dataIndex: 'month_11',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_11}</li>
                      <li><Divider /></li>
                      <li>{user.month_11_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_11_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '十二月',
      dataIndex: 'month_12',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>{user.month_12}</li>
                      <li><Divider /></li>
                      <li>{user.month_12_actual}</li>
                      <li><Divider /></li>
                      <li>{user.month_12_achieving}</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, record) => {
        return (
          <table style={{ width: '100%', height: '100%' }}>
            {
              record.user_list && record.user_list.map((user, index) => (
                <tr>
                  <td>
                    <ul className={styles.tableUl}>
                      <li>&nbsp;</li>
                      <li>&nbsp;</li>
                      <li>
                        <div>
                          <a onClick={() => this.editClick(user)}>编辑</a>
                          <Divider type="vertical" />
                          <a onClick={() => this.deleteClick(user.id)}>删除</a>
                        </div>
                      </li>
                      <li>&nbsp;</li>
                      <li>&nbsp;</li>
                      <li>{(index !== record.user_list.length - 1) && <Divider />}</li>
                    </ul>
                  </td>
                </tr>
              ))
            }
          </table>
        )
      },
    },
  ];

  editClick = (model: any) => {
    const { targetEditClick } = this.props;
    targetEditClick && targetEditClick(model);
  }

  deleteClick = (targetId: string) => {
    const { targetDeleteClick } = this.props;
    targetDeleteClick && targetDeleteClick(targetId);
  }

  render() {
    const { structureQuarterlySalesTargetModel, employeeQuarterlySalesTargetModel, structureMonthlySalesTargetModel, employeeMonthlySalesTargetModel } = this.props;
    let structureQuarterlyData = structureQuarterlySalesTargetModel?.structure_list ?? [];
    let employeeQuarterlyData = employeeQuarterlySalesTargetModel?.structure_list ?? [];

    let structureMonthlyData = structureMonthlySalesTargetModel?.structure_list ?? [];
    let employeeMonthlyData = employeeMonthlySalesTargetModel?.structure_list ?? [];

    if (structureQuarterlyData && structureQuarterlyData.length > 0) {
      return (
        <Table
          scroll={{ x: 'max-content' }}
          columns={this.getStructureQuarterlyTableColumns(structureQuarterlyData.length)}
          dataSource={structureQuarterlyData}
          bordered
          footer={undefined}
          pagination={false}
        />
      );
    } else if (employeeQuarterlyData && employeeQuarterlyData.length > 0) {
      return (
        <Table
          scroll={{ x: 'max-content' }}
          columns={this.getEmployeeQuarterlyTableColumns(employeeQuarterlyData.length, employeeQuarterlySalesTargetModel?.company_name)}
          dataSource={employeeQuarterlyData}
          bordered
          footer={undefined}
          pagination={false}
        />
      );
    } else if (structureMonthlyData && structureMonthlyData.length > 0) {
      return (
        <Table
          scroll={{ x: 'max-content' }}
          columns={this.getStructureMonthlyTableColumns(structureMonthlyData.length)}
          dataSource={structureMonthlyData}
          bordered
          footer={undefined}
          pagination={false}
        />
      );
    } else if (employeeMonthlyData && employeeMonthlyData.length > 0) {
      return (
        <Table
          scroll={{ x: 'max-content' }}
          columns={this.getEmployeeMonthlyTableColumns(employeeMonthlyData.length, employeeMonthlySalesTargetModel?.company_name)}
          dataSource={employeeMonthlyData}
          bordered
          footer={undefined}
          pagination={false}
        />
      );
    } else {
      return (
        <Table
          scroll={{ x: 'max-content' }}
          bordered
          footer={undefined}
          pagination={false}
        />
      );
    }
  }
}

export default TargetTable;
