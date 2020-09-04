import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import URL from '@/api/serverAPI.config';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm, { FormValueType } from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams, DeleteCompanyParams } from './data';

import styles from './style.less';

import ConfirmDialog from '../../../components/ConfirmDialog';
import Search from 'antd/lib/input/Search';
import Axios from 'axios';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
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
      | 'companyManagementModel/getCompanyList'
      | 'companyManagementModel/addCompany'
      | 'companyManagementModel/deleteCompany'
      | 'companyManagementModel/updateCompany'
    >
  >;
  loading: boolean;
  companyManagementModel: StateType;

}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  dialogLoading: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  updateValues: Partial<TableListItem> | undefined;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    companyManagementModel,
    loading,
  }: {
    companyManagementModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    companyManagementModel,
    loading: loading.models.companyManagementModel,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    dialogLoading: false,
    expandForm: true,
    selectedRows: [],
    formValues: {},
    updateValues: undefined,
  };

  downloadAsJSON = () => {
    Axios.post(URL.getCompanyList, {
      params: null,
      responseType: 'blob'
    }).then(res => {
      let blob = new Blob([JSON.stringify(res.data.result.rows)], {
        type: "application/vnd.ms-excel;charset=utf8"
      });
      let objectUrl = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = objectUrl;
      a.download = "公司表格";
      document.body.appendChild(a);
      //a.click();
      //下面这个写法兼容火狐
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    })
  }

  downloadMenu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" onClick={this.downloadAsJSON}>
          JSON
      </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          XML
      </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          MS-Excel
      </a>
      </Menu.Item>
    </Menu>
  )

  columns: StandardTableColumnProps[] = [
    {
      title: '公司ID',
      dataIndex: 'id',

    },
    {
      title: '公司名称',
      dataIndex: 'name',

    },
    {
      title: '状态',
      dataIndex: 'status',

      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      //   {
      //     text: status[2],
      //     value: 2,
      //   },
      // ],
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

  componentDidMount() {
    const { dispatch, companyManagementModel: { data } } = this.props;
    const { pagination: { current, pageSize } } = data;
    dispatch({
      type: 'companyManagementModel/getCompanyList',
      payload: {
        page: current,
        pageSize: pageSize,
      }
    })
  }



  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    // 排序字段
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'companyManagementModel/getCompanyList',
      payload: params,
    });
  };

  /**
   * 重置查询条件
   */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}, // 清空数据
    });
    // 重新查询
    dispatch({
      type: 'companyManagementModel/getCompanyList',
      payload: {},
    });
  };

  /**
   * 收起/展开 查询表单
   */
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'detail':
        // dispatch({
        //   type: 'companyManagementModel/detail',
        //   payload: {
        //     key: selectedRows.map(row => row.key),
        //   },
        //   callback: () => {
        //     this.setState({
        //       selectedRows: [],
        //     });
        //   },
        // });
        break;
      default:
        break;
    }
  };

  handleSearchByName = (value: string) => {
    const { dispatch, companyManagementModel: { data } } = this.props;
    const { pagination: { pageSize } } = data;
    dispatch({
      type: 'companyManagementModel/getCompanyList',
      payload: {
        page: 1,
        pageSize: pageSize,
        filter: {
          name: value,
        },
        op: {
          name: "LIKE",
        }
      }
    })
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'companyManagementModel/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,  // !!可以把undefined转成false
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: TableListItem) => {
    console.log("record = " + JSON.stringify(record));
    this.setState({
      updateModalVisible: !!flag,
      updateValues: record || undefined,
    });
  };

  handleDeleteModalVisible = (flag?: boolean, record?: TableListItem) => {
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

  onAddCompanyCallback = (result: boolean) => {
    if (result) {
      message.success('添加成功');
      this.handleModalVisible();
      const { dispatch } = this.props;
      // 重新查询
      dispatch({
        type: 'companyManagementModel/getCompanyList',
        payload: {},
      });
    } else {
      message.success('添加失败');
      this.handleModalVisible();
    }
  };

  onDeleteCompanyCallback = (result: boolean) => {
    if (result) {
      message.success('删除成功');
      this.handleDeleteModalVisible();
      const { dispatch } = this.props;
      // 重新查询
      dispatch({
        type: 'companyManagementModel/getCompanyList',
        payload: {},
      });
    } else {
      message.success('删除失败');
      this.handleDeleteModalVisible();
    }
  };

  onUpdateCompanyCallback = (result: boolean) => {
    if (result) {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      const { dispatch } = this.props;
      // 重新查询
      dispatch({
        type: 'companyManagementModel/getCompanyList',
        payload: {},
      });
    } else {
      message.success('更新失败');
      this.handleUpdateModalVisible();
    }
  };

  handleAdd = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManagementModel/addCompany',
      payload: fields,
      callback: this.onAddCompanyCallback,
    });

  };

  handleDelete = (values: any) => {
    console.log(JSON.stringify(values))
    const param: DeleteCompanyParams = {
      id: values.id,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManagementModel/deleteCompany',
      payload: param,
      callback: this.onDeleteCompanyCallback,
    });
  };

  handleUpdate = (fields: FormValueType) => {
    console.log(JSON.stringify(fields))
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManagementModel/updateCompany',
      payload: fields,
      callback: this.onUpdateCompanyCallback,
    });
  };

  render() {
    const {
      companyManagementModel: { data },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, deleteModalVisible, dialogLoading, updateValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="detail">详情</Menu.Item>
        <Menu.Item key="approval">快速登录</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    // const updateMethods = {
    //   handleUpdateModalVisible: this.handleUpdateModalVisible,

    // };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator} style={{ display: "flex" }}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                <PlusOutlined />添加公司
              </Button>
              <div style={{ flex: 1 }} />
              <Search
                placeholder="请输入公司名称搜索"
                onSearch={value => this.handleSearchByName(value)}
                style={{ width: 200 }}
              />
              <Dropdown overlay={this.downloadMenu} placement="bottomRight" trigger={['click']} >
                <Button type="primary" style={{ marginLeft: 10 }} hidden={true} ><DownloadOutlined />导出</Button>
              </Dropdown>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateForm {...parentMethods} modalVisible={updateModalVisible} values={updateValues} />
        <ConfirmDialog
          modalTitle="提示"
          modalText="确定删除该公司？该操作成功之后将无法恢复。"
          dialogVisible={deleteModalVisible}
          dialogLoading={dialogLoading}
          handleConfirmOk={this.handleDelete}
          handleConfirmCancel={this.handleDeleteModalVisible}
          values={updateValues}
        />
        {/* {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null} */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
