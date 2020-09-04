import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Menu,
  Row,
  Select,
  message,
  Modal,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult, ColumnFilterItem } from 'antd/es/table';
import { connect } from 'dva';
import { OStateType } from './model';
import CreateForm, { FormValueType } from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams, OptionCompanyItem, ListStructureSubItem } from './data';

import styles from './style.less';
import QueryTree from './components/QueryTree';
import TransformForm from './components/TransformForm';
import LOCAL from '@/utils/LocalStorageKeys';
import { StructureOptionData } from '../StructureManagement/data';
import { PositionData } from '../PositionManagement/data';
import { RoleData } from '../RoleManagement/data';
import Search from 'antd/lib/input/Search';
import CrmUtil from '@/utils/UserInfoStorage';
import { PlusOutlined } from '@ant-design/icons';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 1 | 2 | 3;
const statusMap = ['success', 'error', 'default'];  //'success' | 'processing' | 'default' | 'error' | 'warning';
const status = ['正常', '锁定', '冻结'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'userManagementModel/queryListStructure'
      | 'userManagementModel/queryListPosition'
      | 'userManagementModel/add'
      | 'userManagementModel/fetch'
      | 'userManagementModel/remove'
      | 'userManagementModel/update'
      | 'userManagementModel/detail'
      | 'userManagementModel/getCompanyList'
      | 'userManagementModel/getRoleList'
      | 'userManagementModel/getUserPermissionList'
      | 'userManagementModel/checkOutUser'
      | 'userManagementModel/doLoginOut'
    >
  >;
  loading: boolean;
  userManagementModel: OStateType;
}

interface TableListState {
  roleFilters: any;
  positionFilters: any;
  currentCompanyId: string;
  currentStructureId: string;
  addModalVisible: boolean;
  transformModalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  updateValues: TableListItem | undefined;
  structureOptions: ListStructureSubItem[] | undefined;
  positionOptions: PositionData[] | undefined;
  roleOptions: RoleData[] | undefined;
  filteredInfo: Record<keyof TableListItem, string[]> | undefined;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    userManagementModel,
    loading,
  }: {
    userManagementModel: OStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userManagementModel,
    loading: loading.models.userManagementModel,
  }),
)
class TableList extends Component<TableListProps, TableListState> {

  state: TableListState = {
    roleFilters: null,
    positionFilters: null,
    currentCompanyId: '0',
    currentStructureId: '0',
    addModalVisible: false,
    transformModalVisible: false,
    updateModalVisible: false,
    expandForm: true,
    selectedRows: [],
    updateValues: undefined,
    structureOptions: undefined,
    positionOptions: undefined,
    roleOptions: undefined,
    filteredInfo: undefined,
  };


  componentDidMount() {
    const { dispatch } = this.props;
    // const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    // let currentUserInfo;
    // try {
    //   if (currentUserInfoStr) {
    //     currentUserInfo = JSON.parse(currentUserInfoStr);
    //   }
    // } catch (e) {
    //   currentUserInfo = currentUserInfoStr;
    // }
    const currentUserInfo = CrmUtil.getUserInfo();
    const currentUserId = currentUserInfo?.user_id;
    const currentCompanyId = currentUserInfo && currentUserInfo.company_id;
    this.setState({
      currentCompanyId: currentUserInfo?.company_id
    })
    // 权限
    dispatch({
      type: 'userManagementModel/getUserPermissionList'
    });
    if (currentCompanyId && currentCompanyId != '0' && currentUserId != 771) {
      // 如果company_id!=0  说明是普通用户，直接管理当前公司的用户即可，此时获取当前公司的部门列表
      dispatch({
        type: 'userManagementModel/queryListStructure',
        payload: {
          companyId: currentCompanyId
        },
        callback: (success: boolean) => {
          const { userManagementModel: { listStructure } } = this.props;
          const structureArray = listStructure.filter(item => item.company_id == currentCompanyId);
          const structureOptions = structureArray.length > 0 ? structureArray[0].structureList : undefined;
          this.setState({
            structureOptions
          })
        }
      });
      dispatch({
        type: 'userManagementModel/queryListPosition',
        payload: {
          companyId: currentCompanyId
        },
        callback: this.onGetPositionsBack,
      });
      dispatch({
        type: 'userManagementModel/getRoleList',
        payload: {
          companyId: currentCompanyId,
          isRoleAuthority: 1
        },
        callback: this.onGetRolesBack,
      });
      // 获取自己所在公司的用户列表
      const filter = {
        company_id: currentCompanyId
      }
      const op = {};
      for (let key in filter) {
        if (key == 'company_id') {
          op[key] = '=';
        } else {
          op[key] = 'IN';
        }
      }
      dispatch({
        type: 'userManagementModel/fetch',
        payload: {
          page: 1,
          pageSize: 10,
          filter,
          op,
        }
      });
    } else {
      // 如果是超级管理员（company_id=0），需要先获取公司-部门树
      dispatch({
        type: 'userManagementModel/queryListStructure',
      });
      dispatch({
        type: 'userManagementModel/queryListPosition',
        callback: this.onGetPositionsBack,
      });
      dispatch({
        type: 'userManagementModel/getRoleList',
        callback: this.onGetRolesBack,
      })
      // 获取所有公司的全部用户列表
      dispatch({
        type: 'userManagementModel/fetch',
        payload: {
          page: 1,
          pageSize: 10
        }
      });
    }

  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    this.setState({
      filteredInfo: filtersArg,
    });
    const { dispatch } = this.props;

    let filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      console.log("pre   " + JSON.stringify(newObj));
      let idKey = key;
      switch (key) {
        case 'position_name':
          idKey = "position_id";
          break;
        case 'role_name':
          idKey = 'role_id';
          break;
      }
      if (idKey && filtersArg[key]) {
        const value = getValue(filtersArg[key]);
        if (value && value.length > 0) {
          newObj[idKey] = value;
          return newObj;
        } else {
          return newObj;
        }
      } else {
        return newObj;
      }
    }, {});

    filters = {
      ...filters,
      company_id: this.state.currentCompanyId == '0' ? undefined : this.state.currentCompanyId
    }

    const ops = {};
    for (let key in filters) {
      if (key == 'company_id') {
        ops[key] = '=';
      } else {
        ops[key] = 'IN';
      }
    }

    const params: Partial<TableListParams> = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      filter: filters,
      op: ops
    };
    // 暂不实现排序
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    dispatch({
      type: 'userManagementModel/fetch',
      payload: params,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'detail':
        dispatch({
          type: 'userManagementModel/detail',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };


  handleAddModalVisible = (flag?: boolean) => {
    this.setState({
      addModalVisible: !!flag,
    });
  };
  /** 使签到状态变为：离线 */
  handleCheckOutStaff = (record: TableListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagementModel/checkOutUser',
      payload: {
        checkId: record.id,
        checkInOrOut: 2
      },
      onSuccess: this.updateUserList,
    });
  }

  /** 使登录状态变为：登出 */
  handleLogOutStaff = (record: TableListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagementModel/doLoginOut',
      payload: {
        loginOutUser: record.id,
      },
      onSuccess: () => {
        this.updateUserList();
        Modal.success({
          okText: '好的',
          content: '操作成功，账户已登出。'
        })
      }
    });
  }

  handleUpdateModalVisible = (flag?: boolean, record?: TableListItem) => {
    this.setState({
      updateModalVisible: !!flag,
      updateValues: record,
    });

    // 弹出编辑框前，先更新部门列表和职位列表、角色列表
    if (flag) {
      const { dispatch } = this.props;
      // 更新职位选项
      dispatch({
        type: 'userManagementModel/queryListPosition',
        payload: {
          companyId: record?.company_id
        },
        callback: (result: any) => {
          if (result) {
            const { userManagementModel: { listPosition } } = this.props;
            const positionOptions = listPosition.filter(item => item.company_id == record?.company_id);
            this.setState({
              positionOptions
            })
          }
        }
      });
      // 更新角色选项
      dispatch({
        type: 'userManagementModel/getRoleList',
        payload: {
          companyId: record?.company_id,
          isRoleAuthority: 1
        },
        callback: (result: any) => {
          if (result) {
            const { userManagementModel: { roles } } = this.props;
            const roleOptions = roles.filter(item => item.company_id == record?.company_id);
            this.setState({
              roleOptions
            })
          }
        }
      });
      // 更新部门选项
      const { userManagementModel: { listStructure } } = this.props;
      const structureArray = listStructure.filter(item => item.company_id == record?.company_id);
      const structureOptions = structureArray.length > 0 ? structureArray[0].structureList : undefined;
      this.setState({
        structureOptions
      })
    }
  };

  handleTransformModalVisible = (flag?: boolean, record?: TableListItem) => {
    this.setState({
      transformModalVisible: !!flag,
      updateValues: record,
    });
  };

  onAddUserCallback = (result: boolean) => {
    if (result) {
      message.success('添加成功');
      this.handleAddModalVisible();
      this.handleChangeStructure(this.state.currentCompanyId, this.state.currentStructureId);
    } else {
    }
  };

  handleAdd = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagementModel/add',
      payload: fields,
      callback: this.onAddUserCallback,
    });
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagementModel/update',
      payload: fields,
      callback: this.onUpdateBack
    });
  };

  onUpdateBack = (result: boolean) => {
    if (result) {
      message.success('编辑成功');
      this.handleUpdateModalVisible();
      this.handleChangeStructure(this.state.currentCompanyId, this.state.currentStructureId);
    } else {
    }
  }

  handleTransform = (fields: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagementModel/',
      payload: fields
    });

    message.success('编辑成功');
    this.handleUpdateModalVisible();
  }

  handleChangeCompanyInModal = (companyId: string) => {
    const { dispatch } = this.props;
    // 更新职位选项
    dispatch({
      type: 'userManagementModel/queryListPosition',
      payload: {
        companyId
      },
      callback: (flag: any) => {
        if (flag) {
          const { userManagementModel: { listPosition } } = this.props;
          const positionOptions = listPosition.filter(item => item.company_id == companyId);
          this.setState({
            positionOptions
          })
        }
      }
    });
    // 更新角色选项
    dispatch({
      type: 'userManagementModel/getRoleList',
      payload: {
        companyId,
        isRoleAuthority: 1
      },
      callback: (result: any) => {
        if (result) {
          const { userManagementModel: { roles } } = this.props;
          const roleOptions = roles.filter(item => item.company_id == companyId);
          this.setState({
            roleOptions
          })
        }
      }
    });
    // 更新部门选项
    const { userManagementModel: { listStructure } } = this.props;
    const structureArray = listStructure.filter(item => item.company_id == companyId);
    const structureOptions = structureArray.length > 0 ? structureArray[0].structureList : undefined;
    this.setState({
      structureOptions,
    })
  }

  handleSearchByNameOrMobile = (value: string) => {
    const { dispatch, userManagementModel: { data } } = this.props;
    const { pagination: { pageSize } } = data;

    const company_id = this.state.currentCompanyId && this.state.currentCompanyId != '0' ? this.state.currentCompanyId : undefined
    const structure_id = this.state.currentStructureId && this.state.currentStructureId != '0' ? this.state.currentStructureId : undefined
    const numberPattern = new RegExp("[0-9]+");
    if (numberPattern.test(value)) {
      dispatch({
        type: 'userManagementModel/fetch',
        payload: {
          page: 1,
          pageSize: pageSize,
          filter: {
            account: value,
            company_id,
            structure_id
          },
          op: {
            account: "LIKE",
            company_id: company_id ? '=' : undefined,
            structure_id: structure_id ? '=' : undefined
          }
        }
      })
    } else {
      dispatch({
        type: 'userManagementModel/fetch',
        payload: {
          page: 1,
          pageSize: pageSize,
          filter: {
            name: value,
            company_id,
            structure_id
          },
          op: {
            name: "LIKE",
            company_id: company_id ? '=' : undefined,
            structure_id: structure_id ? '=' : undefined
          }
        }
      })
    }
  };

  /**
   * 切换左侧的树形结构，公司或部门
   */
  handleChangeStructure = (company_id?: string, structure_id?: string) => {
    this.setState({ filteredInfo: undefined });
    console.log("company_id = " + company_id + ";  structure_id = " + structure_id);
    const { dispatch } = this.props;
    if (company_id && company_id != this.state.currentCompanyId) {
      this.setState({
        currentCompanyId: company_id || '0',
        currentStructureId: structure_id || '0'
      })
      // 说明切换公司了，这时候需要重新获取新公司的职位列表
      dispatch({
        type: 'userManagementModel/queryListPosition',
        payload: {
          companyId: company_id
        },
        callback: this.onGetPositionsBack,
      });
      // 说明切换公司了，这时候需要重新获取新公司的角色列表
      dispatch({
        type: 'userManagementModel/getRoleList',
        payload: {
          companyId: company_id,
          isRoleAuthority: 1
        },
        callback: this.onGetRolesBack,
      });

      // 根据新的公司，更新部门列表
      const { userManagementModel: { listStructure } } = this.props;
      const structureArray = listStructure.filter(item => item.company_id == company_id);
      const structureOptions = structureArray.length > 0 ? structureArray[0].structureList : undefined;
      this.setState({
        structureOptions
      })

    } else {
      // 如果只是切换了部门，就不需要更新职位。因为职位只跟公司相关联
      this.setState({
        currentStructureId: structure_id || '0'
      })
    }

    // 更新参数，请求用户列表
    const filter = {
      company_id: company_id,
      structure_id: structure_id && structure_id != '0' ? structure_id : undefined
    }
    const op = {
      company_id: company_id ? '=' : undefined,
      structure_id: structure_id ? '=' : undefined
    }
    const { userManagementModel: { data } } = this.props;
    const { pagination: { pageSize } } = data;
    const params: Partial<TableListParams> = {
      page: 1,
      pageSize,
      filter: company_id == '0' ? undefined : filter,
      op: company_id == '0' ? undefined : op
    };
    dispatch({
      type: 'userManagementModel/fetch',
      payload: params,
    });
  };

  /**
   * 职位更新后，更新职位筛选项
   */
  onGetPositionsBack = (result: boolean) => {
    const { userManagementModel: { listPosition } } = this.props;
    const positionFilters: ColumnFilterItem[] = []
    listPosition.map((position, index) => {
      positionFilters[index] = {
        text: position.name,
        value: position.id
      }
    })
    this.setState({
      positionOptions: listPosition,
      positionFilters
    })
  }


  /**
   * 角色更新后，更新角色筛选项
   */
  onGetRolesBack = (result: boolean) => {
    const { userManagementModel: { roles } } = this.props;
    const roleFilters: ColumnFilterItem[] = []
    roles.map((role, index) => {
      roleFilters[index] = {
        text: role.name,
        value: role.id
      }
    })
    this.setState({
      roleOptions: roles,
      roleFilters
    })
  }

  updateUserList = () => {

    const { dispatch } = this.props;
    const filtersArg = this.state.filteredInfo || {};

    let filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      let idKey = key;
      switch (key) {
        case 'position_name':
          idKey = "position_id";
          break;
        case 'role_name':
          idKey = 'role_id';
          break;
      }
      if (idKey && filtersArg[key]) {
        const value = getValue(filtersArg[key]);
        if (value && value.length > 0) {
          newObj[idKey] = value;
          return newObj;
        } else {
          return newObj;
        }
      } else {
        return newObj;
      }
    }, {});

    filters = {
      ...filters,
      company_id: this.state.currentCompanyId == '0' ? undefined : this.state.currentCompanyId,
      structure_id: this.state.currentStructureId && this.state.currentStructureId != '0' ? this.state.currentStructureId : undefined
    }

    const ops = {};
    for (let key in filters) {
      if (key == 'company_id' || key == 'structure_id') {
        ops[key] = '=';
      } else {
        ops[key] = 'IN';
      }
    }

    const { userManagementModel: { data: { pagination } } } = this.props;

    const params: Partial<TableListParams> = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      filter: filters,
      op: ops
    };

    dispatch({
      type: 'userManagementModel/fetch',
      payload: params,
    });
  }

  render() {
    const {
      userManagementModel: { listStructure, listPosition, data, roles },
      loading,
    } = this.props;

    const { roleFilters, positionFilters, selectedRows, addModalVisible, updateModalVisible, transformModalVisible, updateValues } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};
    const columns: StandardTableColumnProps[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 50
      },
      {
        title: '姓名',
        dataIndex: 'name',
        render: (val: string, record) => {
          const { userManagementModel: { permission } } = this.props;
          return (
            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <a target="_blank" rel="noopener noreferrer" onClick={() => this.handleUpdateModalVisible(true, record)} >
                    编辑
                  </a>
                </Menu.Item>
                {
                  permission && permission.amindcheckinorout && record.check_in_or_out == 1 && (
                    <Menu.Item>
                      <a target="_blank" rel="noopener noreferrer" onClick={() => this.handleCheckOutStaff(record)} >
                        离线
                    </a>
                    </Menu.Item>
                  )
                }
                {
                  record.loginStatus == 1 && (
                    <Menu.Item>
                      <a target="_blank" rel="noopener noreferrer" onClick={() => this.handleLogOutStaff(record)} >
                        登出
                    </a>
                    </Menu.Item>
                  )
                }
              </Menu>
            }>
              <a className="ant-dropdown-link" >
                {val}
              </a>
            </Dropdown>
          )
        }
      },
      {
        title: '签到状态',
        dataIndex: 'check_in_or_out',
        filters: [
          {
            text: '上线',
            value: '1',
          },
          {
            text: '离线',
            value: '2',
          },
        ],
        filteredValue: filteredInfo?.check_in_or_out || null,
        width: 100,
        render(val) {
          return val == 1 ? "上线" : "离线";
        },
      },
      {
        title: '登录状态',
        dataIndex: 'loginStatus',
        // filters: [
        //   {
        //     text: '登入',
        //     value: '1',
        //   },
        //   {
        //     text: '登出',
        //     value: '0',
        //   },
        // ],
        // filteredValue: filteredInfo?.loginStatus || null,
        width: 100,
        render(val) {
          return val == 1 ? "登入" : "登出";
        },
      },
      {
        title: '公司',
        dataIndex: 'company_name',
      },
      {
        title: '手机号',
        dataIndex: 'account',
      },
      {
        title: '部门',
        dataIndex: 'structure_name',
        width: 100,
      },
      {
        title: '职位',
        dataIndex: 'position_name',
        filters: positionFilters,
        filteredValue: filteredInfo?.position_name || null,
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        filters: roleFilters,
        filteredValue: filteredInfo?.role_name || null,
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        filteredValue: filteredInfo?.status || null,
        filters: [
          {
            text: '正常',
            value: '1',
          },
          {
            text: '锁定',
            value: '2',
          },
          {
            text: '冻结',
            value: '3',
          },
        ],
        width: 100,
        render(val: IStatusMapType) {
          return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
        },
      },
      {
        title: '入职时间',
        dataIndex: 'correction_date',
      },
      {
        title: '最后登录时间',
        dataIndex: 'last_login_time',
      },

    ];
    const addMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleAddModalVisible,
      hanldeCompanyChange: this.handleChangeCompanyInModal,
    };

    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
      hanldeCompanyChange: this.handleChangeCompanyInModal,
    };

    const transformMethods = {
      handleTransformModalVisible: this.handleTransformModalVisible,
      handleTransform: this.handleTransform,
    };
    let companys: OptionCompanyItem[] = []
    listStructure.map((item, index) => {
      companys[index] = {
        id: item.company_id,
        name: item.company_name
      }
    })

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={7} sm={24} style={{ minWidth: 280 }}>
              <QueryTree
                handleChangeStructure={this.handleChangeStructure}
                data={listStructure}
              />
            </Col>
            <Col md={17} sm={24}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator} style={{ display: "flex" }}>
                  <Button type="primary" onClick={() => this.handleAddModalVisible(true)}>
                    <PlusOutlined />添加用户
                  </Button>
                  <div style={{ flex: 1 }} />
                  <Search
                    placeholder="请输入姓名或手机号搜索"
                    onSearch={value => this.handleSearchByNameOrMobile(value)}
                    style={{ width: 200 }}
                  />
                </div>
                <StandardTable
                  size="middle"
                  scroll={{ x: 1400 }}
                  // selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {listStructure && listStructure.length > 0 ? (
          <CreateForm {...addMethods} modalVisible={addModalVisible} listCompany={companys} roles={this.state.roleOptions}
            listStructure={this.state.structureOptions} listPosition={this.state.positionOptions}
            companyId={this.state.currentCompanyId == '0' ? undefined : this.state.currentCompanyId} />
        ) : null}

        {listStructure && listStructure.length > 0 ? (
          <CreateForm {...updateMethods} modalVisible={updateModalVisible} listCompany={companys} roles={this.state.roleOptions}
            listStructure={this.state.structureOptions} listPosition={this.state.positionOptions}
            value={updateValues} />
        ) : null}

        {/* <TransformForm
            {...transformMethods}
            visible={transformModalVisible}
            values={updateValues}
            options={data.list}
          /> */}

      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
