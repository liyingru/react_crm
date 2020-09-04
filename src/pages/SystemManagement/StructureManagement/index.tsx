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
import getUserInfo from '@/utils/UserInfoStorage'
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm, { FormValueType } from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { StructureData, TableListPagination, TableListParams, DeleteStructureParams, CompanyData } from './data';

import styles from './style.less';

import ConfirmDialog from '../../../components/ConfirmDialog';
import LOCAL from '@/utils/LocalStorageKeys';
import CrmUtil from '@/utils/UserInfoStorage';
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
      | 'structureManagementModel/getCompanyList'
      | 'structureManagementModel/getStructureList'
      | 'structureManagementModel/getStructuresByCompanyId'
      | 'structureManagementModel/addStructure'
      | 'structureManagementModel/deleteStructure'
      | 'structureManagementModel/updateStructure'

    >
  >;
  loading: boolean;
  structureManagementModel: StateType;

}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  dialogLoading: boolean;
  selectedRows: StructureData[];
  formValues: { [key: string]: string };
  updateValues: Partial<StructureData> | undefined;
  currentCompanyId: string | undefined;
  isAdmin: boolean;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    structureManagementModel,
    loading,
  }: {
    structureManagementModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    structureManagementModel,
    loading: loading.models.structureManagementModel,
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
      formValues: {},
      updateValues: undefined,
      currentCompanyId: undefined,
      isAdmin: false,
    };
  }

  componentDidMount() {
    const userCompanyId = CrmUtil.getUserInfo()?.company_id;
    this.setState({
      currentCompanyId: userCompanyId
    })
    const userId = CrmUtil.getUserInfo()?.user_id;
    const isAdmin = (!(userCompanyId && userCompanyId != '0')) || userId == 771
    this.setState({
      isAdmin,
    }, () => {
      // 公司列表
      const { dispatch } = this.props;
      dispatch({
        type: 'structureManagementModel/getCompanyList',
        payload: {
          isAdmin: this.state.isAdmin,
          userCompanyId
        },
        callback: this.handleCompanysCallback
      })
    });

    // const { dispatch} = this.props;
    // if (currentUserInfo && currentUserInfo.company_id != '0') {
    //   // 如果company_id 不是0  说明是普通用户，直接管理当前公司的部门即可
    //   // const {pagination:{current, pageSize}} = data;
    //   dispatch({
    //     type: 'structureManagementModel/getStructureList',
    //     payload: {
    //       // page: current,
    //       // pageSize: pageSize,
    //       companyId: currentUserInfo.company_id,
    //     }
    //   })
    // } else {
    //   // 如果是超级管理员（company_id=0），需要先获取公司列表
    //   dispatch({
    //     type: 'structureManagementModel/getCompanyList',
    //     callback: this.handleCompanysCallback
    //   })
    // }
  }

  columns: StandardTableColumnProps[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '上级部门',
      dataIndex: 'pname',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
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

  handleCompanysCallback = (companys: CompanyData[] | false) => {
    const { dispatch, structureManagementModel: { data } } = this.props;
    // const {pagination:{current, pageSize}} = data;
    if (companys && companys.length > 0) {
      this.setState({
        currentCompanyId: companys[0].id,
      }, () => {
        dispatch({
          type: 'structureManagementModel/getStructureList',
          payload: {
            // page: current,
            // pageSize: pageSize,
            companyId: this.state.currentCompanyId,
          }
        })
      })
    }
  }

  handleChangeCompany = (value: string) => {
    const { dispatch, structureManagementModel: { data } } = this.props;
    // const {pagination:{current, pageSize}} = data;
    this.setState({
      currentCompanyId: value,
    }, () => {
      dispatch({
        type: 'structureManagementModel/getStructureList',
        payload: {
          // page: current,
          // pageSize: pageSize,
          companyId: this.state.currentCompanyId,
        }
      })
    })
  }

  handleChangeCompanyInModal = (companyId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'structureManagementModel/getStructuresByCompanyId',
      payload: {
        companyId,
      }
    })
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof StructureData, string[]>,
    sorter: SorterResult<StructureData>,
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
      type: 'structureManagementModel/getStructureList',
      payload: params,
    });
  };

  handleSearchByName = (value: string) => {
    const { dispatch, structureManagementModel: { data } } = this.props;
    // const {pagination:{ pageSize }} = data;
    dispatch({
      type: 'structureManagementModel/getCompanyList',
      payload: {
        // page: 1,
        // pageSize: pageSize,
        filter: JSON.stringify({
          name: value,
        }),
        op: JSON.stringify({
          name: "LIKE",
        })
      }
    })
  };

  handleSelectRows = (rows: StructureData[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,  // !!可以把undefined转成false
    });
    if (!!flag && this.state.currentCompanyId) {
      this.handleChangeCompanyInModal(this.state.currentCompanyId);
    }
  };

  handleUpdateModalVisible = (flag?: boolean, record?: StructureData) => {
    this.setState({
      updateModalVisible: !!flag,
      updateValues: record || undefined,
    });
    if (!!flag && this.state.currentCompanyId) {
      this.handleChangeCompanyInModal(this.state.currentCompanyId);
    }
  };

  handleDeleteModalVisible = (flag?: boolean, record?: StructureData) => {
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

  onAddStructureCallback = (result: boolean) => {
    if (result) {
      message.success('添加成功');
      this.handleModalVisible();
      // 重新查询
      const { dispatch, structureManagementModel: { data } } = this.props;
      // const {pagination:{current, pageSize}} = data;
      dispatch({
        type: 'structureManagementModel/getStructureList',
        payload: {
          // page: current,
          // pageSize: pageSize,
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      message.success('添加失败');
      this.handleModalVisible();
    }
  };

  onDeleteStructureCallback = (result: boolean) => {
    if (result) {
      message.success('删除成功');
      this.handleDeleteModalVisible();
      // 重新查询
      const { dispatch, structureManagementModel: { data } } = this.props;
      // const {pagination:{current, pageSize}} = data;
      dispatch({
        type: 'structureManagementModel/getStructureList',
        payload: {
          // page: current,
          // pageSize: pageSize,
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      message.success('删除失败');
      this.handleDeleteModalVisible();
    }
  };

  onUpdateStructureCallback = (result: boolean) => {
    if (result) {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      // 重新查询
      const { dispatch, structureManagementModel: { data } } = this.props;
      // const {pagination:{current, pageSize}} = data;
      dispatch({
        type: 'structureManagementModel/getStructureList',
        payload: {
          // page: current,
          // pageSize: pageSize,
          companyId: this.state.currentCompanyId,
        }
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
      type: 'structureManagementModel/addStructure',
      payload: fields,
      callback: this.onAddStructureCallback,
    });

  };

  handleDelete = (values: any) => {
    console.log(JSON.stringify(values))
    const param: DeleteCompanyParams = {
      id: values.id,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'structureManagementModel/deleteStructure',
      payload: param,
      callback: this.onDeleteStructureCallback,
    });
  };

  handleUpdate = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'structureManagementModel/updateStructure',
      payload: fields,
      callback: this.onUpdateStructureCallback,
    });
  };

  render() {
    const {
      structureManagementModel: { data, companyList, structureOptions },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, deleteModalVisible, dialogLoading, updateValues } = this.state;

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
                <PlusOutlined />添加部门
              </Button>
              <div style={{ flex: 1 }} />
              {
                this.state.isAdmin && companyList && companyList.length > 1 && (
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

            <StandardTable
              scroll={{ x: 'max-content' }}
              rowKey='id'
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} refreshStructuresByCompanyId={this.handleChangeCompanyInModal} structures={structureOptions ?? []} companys={companyList} companyName={data.company.name} companyId={this.state.currentCompanyId} />
        <CreateForm {...parentMethods} modalVisible={updateModalVisible} refreshStructuresByCompanyId={this.handleChangeCompanyInModal} structures={structureOptions} values={updateValues} companyName={data.company.name} />
        <ConfirmDialog
          modalTitle="提示"
          modalText="确定删除该部门？该操作成功之后将无法恢复。"
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
