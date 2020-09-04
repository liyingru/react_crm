import {
  Button,
  Card,
  Divider,
  Form,
  Icon,
  message,
  Select,
  Row,
  Col,
  Menu,
  Tabs,
  Collapse,
  Checkbox,
  Radio,
  Alert,
  Empty,
  Spin,
} from 'antd';
const { Option } = Select;
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import { RoleData, CompanyData, AddRoleParams, RoleTreeData, PermissionSubData } from './data';

import styles from './style.less';

import ConfirmDialog from '../../../components/ConfirmDialog';
import LOCAL from '@/utils/LocalStorageKeys';
import Title from 'antd/lib/typography/Title';
import { ClickParam } from 'antd/lib/menu';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import CrmUtil from '@/utils/UserInfoStorage';
import { PlusOutlined } from '@ant-design/icons';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


interface RoleManagementProps {
  dispatch: Dispatch<
    Action<
      | 'roleManagementModel/getCompanyList'
      | 'roleManagementModel/getRolesListByCompanyId'
      | 'roleManagementModel/addRole'
      | 'roleManagementModel/updateRole'
      | 'roleManagementModel/deleteRole'
      | 'roleManagementModel/getPermissionsConfig'
      | 'roleManagementModel/getRoleTreeList'
    >
  >;
  loading: boolean;
  roleManagementModel: StateType;

}

interface RoleManagementState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  dialogLoading: boolean;
  formValues: { [key: string]: string };
  updateValues: Partial<RoleData> | undefined;
  currentCompanyId: string | undefined;
  currentUserId: number | undefined;
  currentEditingRoleId: string | undefined;
  currentHoverMenuKey: string | undefined;
  selectedIds: string[];
  currentDataAuthority: 0 | 1 | 2 | 3 | 4;
  isAdmin: boolean;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    roleManagementModel,
    loading,
  }: {
    roleManagementModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    roleManagementModel,
    loading: loading.models.roleManagementModel,
  }),
)
class RoleManagement extends Component<RoleManagementProps, RoleManagementState> {

  constructor(props: RoleManagementProps) {
    super(props);
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      deleteModalVisible: false,
      dialogLoading: false,
      formValues: {},
      updateValues: undefined,
      currentCompanyId: undefined,
      currentUserId: undefined,
      currentEditingRoleId: undefined,
      currentHoverMenuKey: undefined,
      selectedIds: [],
      currentDataAuthority: 0,
      isAdmin: false,
    };
  }

  /**
   * 初始化先从公司开始判断，如果是超级管理员，就拉取公司列表，管理全部公司，
   * 如果不是超级管理员，就取当前用户所属的公司。
   */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManagementModel/getPermissionsConfig',
    })

    const userCompanyId = CrmUtil.getUserInfo()?.company_id;
    const currentUserId = CrmUtil.getUserInfo()?.user_id;
    this.setState({

    })

    this.setState({
      currentCompanyId: userCompanyId,
      currentUserId,
      isAdmin: !(userCompanyId && userCompanyId != '0')
    }, () => {
      // 公司列表
      dispatch({
        type: 'roleManagementModel/getCompanyList',
        payload: {
          isAdmin: this.state.isAdmin || currentUserId == 771,
          userCompanyId
        },
        callback: this.handleCompanysCallback
      })
    })

    // const { dispatch } = this.props;
    // if(currentCompanyId && currentCompanyId != '0') {
    //   // 如果company_id 不是0  说明是普通用户，直接管理当前公司的角色即可
    //   dispatch({
    //     type: 'roleManagementModel/getRolesListByCompanyId',
    //     payload: {
    //       companyId:currentCompanyId,
    //     },
    //     callback: this.onGetRolesListCallBack
    //   })
    // } else {
    //   // 如果是超级管理员（company_id=0），需要先获取公司列表
    //   dispatch({
    //     type: 'roleManagementModel/getCompanyList',
    //     callback: this.handleCompanysCallback
    //   })
    // }


  }

  /**
   * 拿到公司列表后，请求第一个公司对应的角色列表
   */
  handleCompanysCallback = (companys: CompanyData[] | false) => {
    const { dispatch } = this.props;
    if (companys && companys.length > 0) {
      const currentCompanyId = companys[0].id;
      this.setState({
        currentCompanyId,
      })
      dispatch({
        type: 'roleManagementModel/getRolesListByCompanyId',
        payload: {
          companyId: currentCompanyId,
        },
        callback: this.onGetRolesListCallBack
      })
    }
  }

  /**
   * 拿到角色列表后，根据第一个角色，拉取该角色对应的权限树
   */
  onGetRolesListCallBack = (roles: RoleData[]) => {
    if (roles && roles.length > 0) {
      const currentEditingRoleId = roles[0].id;
      this.setState({
        currentEditingRoleId,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'roleManagementModel/getRoleTreeList',
        payload: {
          id: currentEditingRoleId,
        },
        callback: (success: boolean) => {
          const { roleManagementModel: { roleTreeList } } = this.props;
          const selectedItems = roleTreeList?.filter(value => value.state.selected == true);
          let selectedIds = selectedItems ? selectedItems.map(value => value.id) : [];
          const currentDataAuthority = roles[0].data_authority;
          this.setState({
            selectedIds,
            currentDataAuthority
          })
        }
      });
    }
  }

  /**
   * 切换公司后，重新请求角色列表
   */
  handleChangeCompany = (value: string) => {
    const currentCompanyId = value;
    const { dispatch } = this.props;
    this.setState({
      currentCompanyId,
    });
    dispatch({
      type: 'roleManagementModel/getRolesListByCompanyId',
      payload: {
        companyId: currentCompanyId,
      },
      callback: this.onGetRolesListCallBack
    })
  }

  /**
   * 弹出/隐藏 新增角色框
   */
  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,  // !!可以把undefined转成false
    });
  };

  /**
   * 弹出/隐藏 编辑角色框
   */
  handleUpdateModalVisible = (flag?: boolean, record?: RoleData) => {

    this.setState({
      updateModalVisible: !!flag,
      updateValues: record || undefined,
    });
  };

  /**
   * 弹出/隐藏 删除角色框
   */
  handleDeleteModalVisible = (flag?: boolean, record?: RoleData) => {
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

  onAddRoleCallback = (result: boolean) => {
    if (result) {
      message.success('添加角色成功');
      this.handleModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'roleManagementModel/getRolesListByCompanyId',
        payload: {
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      this.handleModalVisible();
    }
  };

  onDeleteRoleCallback = (result: boolean) => {
    if (result) {
      message.success('删除角色成功');
      this.handleDeleteModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'roleManagementModel/getRolesListByCompanyId',
        payload: {
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      this.handleDeleteModalVisible();
    }
  };

  onUpdateRoleCallback = (result: boolean) => {
    if (result) {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'roleManagementModel/getRolesListByCompanyId',
        payload: {
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      this.handleUpdateModalVisible();
    }
  };

  handleAdd = (fields: AddRoleParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManagementModel/addRole',
      payload: {
        ...fields,
        companyId: this.state.currentCompanyId
      },
      callback: this.onAddRoleCallback,
    });

  };

  handleDelete = (values: any) => {

    const param = {
      id: values.id,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManagementModel/deleteRole',
      payload: param,
      callback: this.onDeleteRoleCallback,
    });
  };

  handleUpdate = (fields: AddRoleParams) => {

    const { dispatch, roleManagementModel: { data } } = this.props;
    dispatch({
      type: 'roleManagementModel/updateRole',
      payload: {
        ...fields,
        companyId: this.state.currentCompanyId
      },
      role: data.rolesList.filter(value => value.id == this.state.currentEditingRoleId)[0],
      callback: this.onUpdateRoleCallback,
    });
  };

  onClickMenu = (param: ClickParam) => {

    const currentEditingRoleId = param.key;
    const { roleManagementModel: { data: { rolesList } } } = this.props;

    const currentDataAuthority = rolesList.filter(item => item.id == currentEditingRoleId)[0].data_authority;
    this.setState({
      currentEditingRoleId,
      currentDataAuthority,
    }, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'roleManagementModel/getRoleTreeList',
        payload: {
          id: this.state.currentEditingRoleId,
        },
        callback: (success: boolean) => {
          if (success) {
            const { roleManagementModel: { roleTreeList } } = this.props;
            const selectedItems = roleTreeList?.filter(value => value.state.selected == true);
            let selectedIds = selectedItems?.map(value => value.id) || [];
            this.setState({
              selectedIds
            })
          }
        }
      })
    })
  }

  onCheckGroupChange = (e: CheckboxChangeEvent, groupIndex: number) => {
    const { roleManagementModel: { permissions } } = this.props;
    if (permissions) {
      const groupRights = permissions[groupIndex].options;
      const groupRightIds = groupRights.flatMap(item => item.id);
      let alreadySelectedIds = this.state.selectedIds;
      let finalSelectedIds = [];
      if (e.target.checked) {
        // 把新选中的，且不在原来选中列表中的 筛选出来，就是新添加的。
        const newSelectedIds = groupRightIds.filter(newId => alreadySelectedIds.indexOf(newId) < 0);
        finalSelectedIds = [
          ...alreadySelectedIds,
          ...newSelectedIds
        ]
      } else {
        // 从原来选中列表中，筛选出去存在于取消列表中的，剩下的 就是还没有被取消的。
        const leftSelectedIds = alreadySelectedIds.filter(selectedId => groupRightIds.indexOf(selectedId) < 0)
        finalSelectedIds = leftSelectedIds;
      }

      this.setState({
        selectedIds: finalSelectedIds,
      });

      const { dispatch, roleManagementModel: { data } } = this.props;
      dispatch({
        type: 'roleManagementModel/updateRole',
        payload: {
          id: this.state.currentEditingRoleId,
          rights: finalSelectedIds?.join(','),
        },
        role: data.rolesList.filter(value => value.id == this.state.currentEditingRoleId)[0],
        callback: (flag: boolean) => {
          if (flag) {
            message.success('更新成功')
          }
        }
      })

    }

  };

  /**
   * 编辑某一项权限
   */
  checkedChanged = (e: any) => {
    let selectedIds = this.state.selectedIds;

    if (e.target.checked) {
      if (selectedIds) {
        selectedIds = [
          ...selectedIds, e.target.value
        ]
      } else {
        selectedIds = [e.target.value];
      }
    } else {
      selectedIds = selectedIds?.filter(value => value != e.target.value);
    }
    this.setState({
      selectedIds
    })


    const { dispatch, roleManagementModel: { data } } = this.props;
    dispatch({
      type: 'roleManagementModel/updateRole',
      payload: {
        id: this.state.currentEditingRoleId,
        rights: selectedIds?.join(','),
      },
      role: data.rolesList.filter(value => value.id == this.state.currentEditingRoleId)[0],
      callback: (flag: boolean) => {
        if (flag) {
          message.success('更新成功')
        }
      }
    })

  }

  onRadioChanged = (e: any) => {

    const { roleManagementModel: { data } } = this.props;
    const { dispatch } = this.props;
    const dataAuthority = e.target.value;
    dispatch({
      type: 'roleManagementModel/updateRole',
      payload: {
        id: this.state.currentEditingRoleId,
        dataAuthority
      },
      role: data.rolesList.filter(value => value.id == this.state.currentEditingRoleId)[0],
      callback: (flag: boolean) => {
        if (flag) {
          message.success('更新成功')
          this.setState({
            currentDataAuthority: dataAuthority
          })
          // 更新成功后，需要更新角色列表中的data_authority。 不然仍然是老数据
          // 重新查询
          dispatch({
            type: 'roleManagementModel/getRolesListByCompanyId',
            payload: {
              companyId: this.state.currentCompanyId,
            }
          })
        }
      }
    })

  }

  onHoverMenuItem = (event: any) => {
    this.setState({
      currentHoverMenuKey: event.key
    })
  }

  onLeaveMenuItem = (event: any) => {
    this.setState({
      currentHoverMenuKey: undefined
    })
  }

  isChecked = (id: string): boolean => {
    const { roleManagementModel: { roleTreeList } } = this.props
    const targetRoleTreeList: RoleTreeData[] | undefined = roleTreeList?.filter(value => {
      return value.id == id
    });

    if (targetRoleTreeList && targetRoleTreeList.length > 0 && targetRoleTreeList[0].state) {
      return targetRoleTreeList[0].state.selected;
    } else {
      return false;
    }
  }

  render() {
    const { roleManagementModel: { data, companyList, permissions, roleTreeList }, loading } = this.props;
    const { TabPane } = Tabs;
    const { Panel } = Collapse;

    const { selectedIds, modalVisible, updateModalVisible, deleteModalVisible, dialogLoading, updateValues } = this.state;

    let groupChecked: boolean[] = [];
    permissions?.map((group, index) => {
      const filteredUnselectedIds: PermissionSubData[] = group.options.filter(item => {
        return selectedIds.indexOf(item.id) < 0;
      });
      if (filteredUnselectedIds && filteredUnselectedIds.length > 0) {
        groupChecked[index] = false;
      } else {
        groupChecked[index] = true;
      }
    })

    let groupIndeterminated: boolean[] = [];
    permissions?.map((group, index) => {
      const filteredUnselectedIds: PermissionSubData[] = group.options.filter(item => {
        return selectedIds.indexOf(item.id) < 0;
      });
      if (filteredUnselectedIds && filteredUnselectedIds.length > 0 && filteredUnselectedIds.length < group.options.length) {
        groupIndeterminated[index] = true;
      } else {
        groupIndeterminated[index] = false;
      }
    })

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 14,
      border: 0,
      overflow: 'hidden',
    };

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const radioIntroStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      fontSize: '10px',
    };

    return (
      <PageHeaderWrapper>
        <Spin spinning={loading}>
          {
            <Card bordered={false}>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                  <Title level={4}>公司角色</Title>
                  {
                    data && data.rolesList && data.rolesList.length > 0 ?
                      <Menu
                        onClick={this.onClickMenu}
                        style={{ width: '100%', padding: 0 }}
                        // selectedKeys={[''+data.rolesList[0].id]}
                        selectedKeys={['' + this.state.currentEditingRoleId]}
                        mode="inline"
                      >
                        {
                          data.rolesList.map(role => {
                            return (
                              <Menu.Item key={role.id} onMouseEnter={this.onHoverMenuItem} onMouseLeave={this.onLeaveMenuItem} style={{ position: 'relative', display: 'flex', padding: 0 }}>
                                <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ width: '100%', margin: '0' }} >
                                  <Col md={13} sm={24}>{role.name}</Col>
                                  <Col md={2} sm={24} style={{ fontSize: '10px', visibility: (this.state.currentEditingRoleId == role.id && role.is_sys == 1) ? 'visible' : 'hidden' }}>系统默认</Col>
                                </Row>
                                <div style={{ position: 'absolute', right: 0, background: 'white', paddingRight: '8px', paddingLeft: '8px', visibility: (this.state.currentHoverMenuKey && this.state.currentHoverMenuKey == role.id) ? 'visible' : 'hidden' }}>
                                  <a onClick={() => this.handleUpdateModalVisible(true, role)}><Icon type="edit" title='编辑' style={{ fontSize: '10px', margin: '0' }} /></a>
                                  <Divider type="vertical" style={{ margin: '2px' }} />
                                  <a onClick={() => this.handleDeleteModalVisible(true, role)}><Icon type="delete" title='删除' style={{ fontSize: '10px', margin: '0' }} /></a>
                                </div>
                              </Menu.Item>)
                          })
                        }
                      </Menu>
                      :
                      <Alert message="该公司下暂无角色" type="info" />
                  }

                </Col>
                <Col md={18} sm={24}>
                  <div className={styles.tableList}>
                    <div className={styles.tableListOperator} style={{ display: "flex" }}>
                      <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                        <PlusOutlined />添加角色
                      </Button>
                      <div style={{ flex: 1 }} />
                      {
                        (this.state.isAdmin || this.state.currentUserId == 771) && companyList && companyList.length > 1 && (
                          <Select defaultValue={companyList[0].id} style={{ width: 240 }} onChange={this.handleChangeCompany}>
                            {companyList && companyList.map(company => (
                              <Option value={company.id}>
                                {company.name}
                              </Option>
                            ))}
                          </Select>
                        )
                      }
                    </div>
                    {
                      data && data.rolesList && data.rolesList.length > 0 && this.state.currentEditingRoleId ?
                        <Tabs type="card">
                          <TabPane tab="操作权限" key="1">
                            <Collapse bordered={false} defaultActiveKey={['0']} >
                              {
                                permissions && permissions.map((permission, index) => (
                                  <Panel header={permission.title} key={index + ''} style={customPanelStyle}>
                                    <div>
                                      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                        <Checkbox
                                          key={"checkall" + index}
                                          onChange={e => this.onCheckGroupChange(e, index)}
                                          indeterminate={groupIndeterminated[index]}
                                          checked={groupChecked[index]}
                                        >
                                          全选
                                      </Checkbox>
                                      </div>
                                      <br />
                                      <Checkbox.Group value={this.state.selectedIds} >
                                        {
                                          permission.options.map((option, subindex) => (
                                            <Checkbox key={option.id} value={option.id} onChange={this.checkedChanged} style={subindex == 0 ? { color: "gray" } : {}} >{option.name}</Checkbox>
                                          ))
                                        }
                                      </Checkbox.Group>
                                    </div>
                                  </Panel>
                                ))
                              }
                            </Collapse>
                          </TabPane>
                          <TabPane tab="数据权限" key="2">
                            <Collapse bordered={false} defaultActiveKey={['0']} >
                              <Panel header="数据权限（设置该角色的用户可以操作的数据的范围）" key='0' style={customPanelStyle}>
                                <div>
                                  <Radio.Group onChange={this.onRadioChanged} value={this.state.currentDataAuthority} style={{ width: 600 }}>
                                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                                      <Col md={10} sm={24}>
                                        <Radio style={radioStyle} value={1}>
                                          个人
                                      </Radio>
                                      </Col>
                                      <Col md={14} sm={24}>
                                        <p style={radioIntroStyle}>
                                          只能操作自己和下属的数据
                                      </p>
                                      </Col>
                                    </Row>

                                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                                      <Col md={10} sm={24}>
                                        <Radio style={radioStyle} value={2}>
                                          所属部门
                                      </Radio>
                                      </Col>
                                      <Col md={14} sm={24}>
                                        <p style={radioIntroStyle}>
                                          能操作自己、下属、和自己所属部门的数据
                                      </p>
                                      </Col>
                                    </Row>

                                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                                      <Col md={10} sm={24}>
                                        <Radio style={radioStyle} value={3}>
                                          所属部门和下属部门
                                      </Radio>
                                      </Col>
                                      <Col md={14} sm={24}>
                                        <p style={radioIntroStyle}>
                                          能操作自己、下属和自己所属部门及其下属部门的数据
                                      </p>
                                      </Col>
                                    </Row>

                                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                                      <Col md={10} sm={24}>
                                        <Radio style={radioStyle} value={4}>
                                          全公司
                                      </Radio>
                                      </Col>
                                      <Col md={14} sm={24}>
                                        <p style={radioIntroStyle}>
                                          能操作全公司的数据
                                      </p>
                                      </Col>
                                    </Row>

                                  </Radio.Group>
                                </div>
                              </Panel>
                            </Collapse>
                          </TabPane>
                        </Tabs>
                        :
                        <Empty style={{ marginTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>请先添加角色</span>} />
                    }
                  </div>
                </Col>
              </Row>
            </Card>
          }
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
          <CreateForm {...parentMethods} modalVisible={updateModalVisible} values={this.state.updateValues} />
          <ConfirmDialog
            modalTitle="提示"
            modalText="确定删除该角色？该操作成功之后将无法恢复。"
            dialogVisible={deleteModalVisible}
            dialogLoading={dialogLoading}
            handleConfirmOk={this.handleDelete}
            handleConfirmCancel={this.handleDeleteModalVisible}
            values={updateValues}
          />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default RoleManagement;


