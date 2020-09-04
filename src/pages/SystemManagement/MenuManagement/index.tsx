import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Icon,
  message,
  Select,
} from 'antd';
const { Option } = Select;
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm, { FormValueType } from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { MenuData, TableListParams, DeleteMenuParams, TableListPagination } from './data';

import styles from './style.less';

import ConfirmDialog from '../../../components/ConfirmDialog';
import LOCAL from '@/utils/LocalStorageKeys';
import { PlusOutlined } from '@ant-design/icons';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 0 | 1;
const statusMap = ['error', 'success'];  //'success' | 'processing' | 'default' | 'error' | 'warning';
const status = ['锁定', '正常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'menuManagementModel/getMenuList'
      | 'menuManagementModel/addMenu'
      | 'menuManagementModel/editMenu'
      | 'menuManagementModel/deleteMenu'
      | 'menuManagementModel/listAct'
      | 'menuManagementModel/planList'
    >
  >;
  loading: boolean;
  menuManagementModel: StateType;

}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  dialogLoading: boolean;
  selectedRows: MenuData[];
  expandedKeys: string[] | number[];
  formValues: { [key: string]: string };
  updateValues: Partial<MenuData> | undefined;
  initialActions: string[] | undefined;
  menuOptions: MenuData[];
  icons: [];
  currentCompanyId: string | undefined;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    menuManagementModel,
    loading,
  }: {
    menuManagementModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    menuManagementModel,
    loading: loading.models.menuManagementModel,
  }),
)
class TableList extends Component<TableListProps, TableListState> {

  constructor(props: TableListProps) {
    super(props);
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      deleteModalVisible: false,
      dialogLoading: false,
      selectedRows: [],
      expandedKeys: [],
      formValues: {},
      updateValues: undefined,
      initialActions: undefined,
      currentCompanyId: undefined,
      menuOptions: [],
      icons: []
    };

    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    let currentUserInfo;
    try {
      if (currentUserInfoStr) {
        currentUserInfo = JSON.parse(currentUserInfoStr);
      }
    } catch (e) {
      currentUserInfo = currentUserInfoStr;
    }
    if (currentUserInfo && currentUserInfo.company_id) {
      this.setState({
        currentCompanyId: currentUserInfo.company_id
      })
    }
  }

  columns: StandardTableColumnProps[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 60,
      render(val: string) {
        return <Icon type={val} />
      }
    },
    {
      title: '权限码',
      dataIndex: 'code',
      width: 280,
      ellipsis: true,
    },
    {
      title: '权重',
      dataIndex: 'weight',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: "正常",
          value: "1"
        },
        {
          text: "关闭",
          value: "0"
        },
      ],
      onFilter: (value, record) => record.status === parseInt(value),
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '是否菜单',
      dataIndex: 'is_menu',
      filters: [
        {
          text: "是",
          value: "1"
        },
        {
          text: "否",
          value: "2"
        },
      ],
      onFilter: (value, record) => record.is_menu === parseInt(value),
      render(val) {
        return val == 1 ? "是" : "否"
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}><Icon type="edit" title='编辑' /></a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDeleteModalVisible(true, record)}><Icon type="delete" title='删除' /></a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManagementModel/getMenuList',
      payload: {
        order: 'desc'
      }
    })

    dispatch({
      type: 'menuManagementModel/planList',
      callback: this.onGetPlanList
    })
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof MenuData, string[]>,
    sorter: SorterResult<MenuData>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      // page: pagination.current,
      // pageSize: pagination.pageSize,
      companyId: this.state.currentCompanyId,
      ...formValues,
      ...filters,
    };

    // 排序字段
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'menuManagementModel/getMenuList',
      payload: params,
    });
  };

  handleSelectRows = (rows: MenuData[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,  // !!可以把undefined转成false
    });
    if (!!flag && this.state.currentCompanyId) {
      // this.handleChangeCompanyInModal(this.state.currentCompanyId);
    }
  };

  getListAct = (ctrlId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManagementModel/listAct',
      payload: {
        ctrlId
      }
    });
  }

  handleUpdateModalVisible = (flag?: boolean, record?: MenuData) => {
    console.log("record = " + JSON.stringify(record));
    const flagg = !!flag;
    if (flagg && record && record.code && record.code.length > 0) {
      const { dispatch } = this.props;
      dispatch({
        type: 'menuManagementModel/listAct',
        payload: {
          ctrlId: record.code.split('@')[0]
        },
        callback: (result: boolean) => {
          this.setState({
            updateModalVisible: flagg,
            updateValues: record || undefined,
          })
        }
      });
    } else {
      this.setState({
        updateModalVisible: flagg,
        updateValues: record || undefined,
        initialActions: undefined
      });
    }

    if (flagg && this.state.currentCompanyId) {
      // this.handleChangeCompanyInModal(this.state.currentCompanyId);
    }
  };

  handleDeleteModalVisible = (flag?: boolean, record?: MenuData) => {
    this.setState({
      deleteModalVisible: !!flag,
      updateValues: record || undefined,
    });
    if (!flag) {
      this.setState({
        dialogLoading: false,
      });
    }
  };

  onGetPlanList = (result: boolean) => {
    if (result) {

    }
  }

  onAddMenuCallback = (result: boolean) => {
    if (result) {
      message.success('添加成功');
      this.handleModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'menuManagementModel/getMenuList',
      })
    } else {
      message.success('添加失败');
      this.handleModalVisible();
    }
  };

  onDeleteMenuCallback = (result: boolean) => {
    if (result) {
      message.success('删除成功');
      this.handleDeleteModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'menuManagementModel/getMenuList',
      })
    } else {
      message.success('删除失败');
      this.handleDeleteModalVisible();
    }
  };

  onUpdateMenuCallback = (result: boolean) => {
    if (result) {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'menuManagementModel/getMenuList',
      })
    } else {
      message.success('更新失败');
      this.handleUpdateModalVisible();
    }
  };

  handleAdd = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManagementModel/addMenu',
      payload: fields,
      callback: this.onAddMenuCallback,
    });

  };


  allKyes: string[] = [];
  collectAllKeys = (menu: MenuData) => {
    if (menu.child && menu.child.length > 0) {
      this.allKyes = [
        ...this.allKyes,
        menu.id
      ]
      menu.child.map(item => {
        this.collectAllKeys(item);
      })
    }
  }

  toggalExpandMenus = (flag: boolean) => {
    if (flag) {
      const { menuManagementModel: { data } } = this.props;
      this.allKyes = [];
      data.menus.map(menu => {
        this.collectAllKeys(menu);
      })
      this.setState({
        expandedKeys: this.allKyes
      })
    } else {
      this.setState({
        expandedKeys: []
      })
    }
  }

  onExpandedRowsChange = (expandedRows: string[] | number[]) => {
    console.log("expandedRows   " + expandedRows);
    this.setState({
      expandedKeys: expandedRows
    })
  }

  handleDelete = (values: any) => {
    console.log(JSON.stringify(values))
    const param: DeleteMenuParams = {
      id: values.id,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManagementModel/deleteMenu',
      payload: param,
      callback: this.onDeleteMenuCallback,
    });
  };

  handleUpdate = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManagementModel/editMenu',
      payload: fields,
      callback: this.onUpdateMenuCallback,
    });
  };

  render() {
    const {
      menuManagementModel: { data, planList, actions },
      loading,
    } = this.props;

    const { selectedRows, expandedKeys, modalVisible, updateModalVisible, deleteModalVisible, dialogLoading, menuOptions, icons, updateValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator} style={{ display: "flex" }}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                <PlusOutlined />添加菜单
              </Button>
              <Button type="primary" onClick={() => this.toggalExpandMenus(expandedKeys.length == 0)}>
                <PlusOutlined />展开全部
              </Button>
              <div style={{ flex: 1 }} />
            </div>

            <StandardTable
              scroll={{ x: "max-content", y: 500, scrollToFirstRowOnChange: true }}
              rowKey='id'
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              childrenColumnName='child'
              expandedRowKeys={expandedKeys}
              onExpandedRowsChange={this.onExpandedRowsChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} codeOptions={planList ? planList : []} menus={data.menus} getListAct={this.getListAct} initialActions={actions} />
        <CreateForm {...parentMethods} modalVisible={updateModalVisible} codeOptions={planList ? planList : []} menus={data.menus} values={updateValues} initialActions={actions} getListAct={this.getListAct} />
        <ConfirmDialog
          modalTitle="提示"
          modalText="确定删除该菜单？该操作成功之后将无法恢复。"
          dialogVisible={deleteModalVisible}
          dialogLoading={dialogLoading}
          handleConfirmOk={this.handleDelete}
          handleConfirmCancel={this.handleDeleteModalVisible}
          values={updateValues}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
