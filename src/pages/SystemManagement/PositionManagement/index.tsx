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
import { PositionData, TableListParams, DeletePositionParams, CompanyData } from './data';

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
      | 'positionManagementModel/getCompanyList'
      | 'positionManagementModel/getPositionList'
      | 'positionManagementModel/getPositionOptions'
      | 'positionManagementModel/addPosition'
      | 'positionManagementModel/deletePosition'
      | 'positionManagementModel/updatePosition'

    >
  >;
  loading: boolean;
  positionManagementModel: StateType;

}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  dialogLoading: boolean;
  selectedRows: PositionData[];
  formValues: { [key: string]: string };
  updateValues: Partial<PositionData> | undefined;
  currentCompanyId: string | undefined;
  currentCompanyName: string | undefined;
  isAdmin: boolean;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    positionManagementModel,
    loading,
  }: {
    positionManagementModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    positionManagementModel,
    loading: loading.models.positionManagementModel,
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
      currentCompanyName: undefined,
      isAdmin: false,
    };

  }

  componentDidMount() {
    const userCompanyId = CrmUtil.getUserInfo()?.company_id;
    this.setState({
      currentCompanyId: userCompanyId
    })
    this.setState({
      isAdmin: !(userCompanyId && userCompanyId != '0')
    }, () => {
      // 公司列表
      const { dispatch } = this.props;
      dispatch({
        type: 'positionManagementModel/getCompanyList',
        payload: {
          isAdmin: this.state.isAdmin,
          userCompanyId
        },
        callback: this.handleCompanysCallback
      })
    })
  }

  columns: StandardTableColumnProps[] = [
    {
      title: 'ID',
      dataIndex: 'id',

    },
    {
      title: '上级',
      dataIndex: 'pname',

    },
    {
      title: '名称',
      dataIndex: 'name',

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
    if (companys && companys.length > 0) {
      this.setState({
        currentCompanyId: companys[0].id,
      }, () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'positionManagementModel/getPositionList',
          payload: {
            companyId: this.state.currentCompanyId,
          }
        })
      })
    }
  }

  handleChangeCompany = (value: string) => {
    const { dispatch } = this.props;
    this.setState({
      currentCompanyId: value,
    }, () => {
      console.log("handleChangeCompany:  " + value)
      dispatch({
        type: 'positionManagementModel/getPositionList',
        payload: {
          companyId: this.state.currentCompanyId,
        }
      })
    })
  }

  handleChangeCompanyInModal = (companyId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionManagementModel/getPositionOptions',
      payload: {
        companyId,
      }
    })
  }

  handleStandardTableChange = (
    pagination: Partial<any>,
    filtersArg: Record<keyof PositionData, string[]>,
    sorter: SorterResult<PositionData>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      companyId: this.state.currentCompanyId,
      ...formValues,
      ...filters,
    };

    // 排序字段
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'positionManagementModel/getPositionList',
      payload: params,
    });
  };

  handleSelectRows = (rows: PositionData[]) => {
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

  handleUpdateModalVisible = (flag?: boolean, record?: PositionData) => {
    console.log("record = " + JSON.stringify(record));
    this.setState({
      updateModalVisible: !!flag,
      updateValues: record || undefined,
    });
    if (!!flag && this.state.currentCompanyId) {
      this.handleChangeCompanyInModal(this.state.currentCompanyId);
    }
  };

  handleDeleteModalVisible = (flag?: boolean, record?: PositionData) => {
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
      const { dispatch } = this.props;
      dispatch({
        type: 'positionManagementModel/getPositionList',
        payload: {
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      this.handleModalVisible();
    }
  };

  onDeleteStructureCallback = (result: boolean) => {
    if (result) {
      message.success('删除成功');
      this.handleDeleteModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'positionManagementModel/getPositionList',
        payload: {
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      this.handleDeleteModalVisible();
    }
  };

  onUpdatePositionCallback = (result: boolean) => {
    if (result) {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      // 重新查询
      const { dispatch } = this.props;
      dispatch({
        type: 'positionManagementModel/getPositionList',
        payload: {
          companyId: this.state.currentCompanyId,
        }
      })
    } else {
      this.handleUpdateModalVisible();
    }
  };

  handleAdd = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'positionManagementModel/addPosition',
      payload: fields,
      callback: this.onAddStructureCallback,
    });

  };

  handleDelete = (values: any) => {
    console.log(JSON.stringify(values))
    const param: DeletePositionParams = {
      id: values.id,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'positionManagementModel/deletePosition',
      payload: param,
      callback: this.onDeleteStructureCallback,
    });
  };

  handleUpdate = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'positionManagementModel/updatePosition',
      payload: fields,
      callback: this.onUpdatePositionCallback,
    });
  };

  render() {
    const {
      positionManagementModel: { data, companyList, positionOptions },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, deleteModalVisible, dialogLoading, updateValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    console.log("this.state.currentCompanyId = " + this.state.currentCompanyId);
    console.log("companyList = " + JSON.stringify(companyList));

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator} style={{ display: "flex" }}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                <PlusOutlined />添加职位
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} refreshPositionsByCompanyId={this.handleChangeCompanyInModal} positions={positionOptions} companys={companyList} companyId={this.state.currentCompanyId} />
        <CreateForm {...parentMethods} modalVisible={updateModalVisible} refreshPositionsByCompanyId={this.handleChangeCompanyInModal} positions={positionOptions} values={updateValues} companyName={companyList?.filter((value, index) => value.id == this.state.currentCompanyId)[0]?.name} />
        <ConfirmDialog
          modalTitle="提示"
          modalText="确定删除该职位？该操作成功之后将无法恢复。"
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
