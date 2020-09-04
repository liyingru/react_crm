
import React, { Component, Fragment } from 'react';
import {
  Card,
  Button,
  Modal,
  Row,
  Col,
  Table,
  Divider,
  message,
} from 'antd';
import { Dispatch, Action } from 'redux';
import { ColumnProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { StateType } from './model';
import { TreeNode } from 'antd/lib/tree-select';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ActivityConfigHeader from './components/activityConfigHeaderForm'
import ActivityEditPageForm from './components/activityEditPageForm'
import { AnyARecord } from 'dns';
import moment from 'moment';
import { ActivityListItem } from './data';

interface ActivityConfigProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'activityConfig/activityList'
      | 'activityConfig/addActivity'
      | 'activityConfig/editActivity'
      | 'activityConfig/deleteActivity'
    >
  >;
  loading: boolean;
  activityConfig: StateType;

}


interface ActivityConfigState {
  isShowEditActivityFrom: boolean | undefined;
  isCreate: boolean
  showEditActivityModel: any;
  searchParams: {}
}

@connect(
  ({
    activityConfig,
    loading,
  }: {
    activityConfig: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    activityConfig,
    loading: loading.models.userManagementModel,
  }),
)

class ActivityConfig extends Component<ActivityConfigProps, ActivityConfigState> {
  state: ActivityConfigState = {
    // 展示新增或者编辑客资来源
    isShowEditActivityFrom: false,
    // 编辑客资来源对象
    showEditActivityModel: {},
    isCreate: false,
    searchParams: {},
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { dispatch } = this.props;
    const { searchParams } = this.state;
    dispatch({
      type: 'activityConfig/activityList',
      payload: searchParams,
    });
  }

  /// ------------ 编辑活动 ------------

  // 展示编辑活动方法
  showEditActivityFunction = (model: ActivityListItem) => {
    {
      console.log(model, '0000000')
    }
    if (model) {
      this.setState({
        isShowEditActivityFrom: true,
        showEditActivityModel: model
      })
    } else {
      this.setState({
        isShowEditActivityFrom: true,
      })
    }
  }

  // 取消编辑活动方法
  hiddenActivityFunction = () => {
    this.setState({
      isShowEditActivityFrom: false,
      isCreate: false,
      showEditActivityModel: undefined
    })
  }

  // 确定编辑活动方法
  editActivityRequetsFuntion = (values: any) => {

    const { dispatch } = this.props;
    // 取出起始和结束时间
    const { activityTime, cityCodes } = values
    if (activityTime !== undefined && activityTime != '') {
      delete values.createTime
      values.startTime = moment(activityTime[0]).format('YYYY-MM-DD');
      values.endTime = moment(activityTime[1]).format('YYYY-MM-DD');
    }

    if (cityCodes !== undefined && cityCodes != []) {
      values.cityCode = cityCodes.toString();
    }


    var status = values['status']
    if (status) {
      values['status'] = '1'
    } else {
      values['status'] = '0'
    }


    dispatch({
      type: 'activityConfig/editActivity',
      payload: values,
      callback: (result: boolean, msg: string) => {
        message.success('修改成功')
        this.setState({
          isShowEditActivityFrom: false,
          showEditActivityModel: undefined,
          isCreate: false
        })
        this.fetch();
      },
    })
  }

  //创建活动
  createActivityFunction = (values: any) => {

    const { dispatch } = this.props;
    // 取出起始和结束时间
    const { activityTime, cityCodes } = values
    if (activityTime !== undefined && activityTime != '') {
      delete values.createTime
      values.startTime = moment(activityTime[0]).format('YYYY-MM-DD');
      values.endTime = moment(activityTime[1]).format('YYYY-MM-DD');
    }

    if (cityCodes !== undefined && cityCodes != []) {
      values.cityCode = cityCodes.toString();
    }

    var status = values['status']
    if (status) {
      values['status'] = '1'
    } else {
      values['status'] = '0'
    }

    dispatch({
      type: 'activityConfig/addActivity',
      payload: values,
      callback: (result: boolean, msg: string) => {
        message.success('创建成功')
        this.setState({
          isShowEditActivityFrom: false,
          showEditActivityModel: undefined,
          isCreate: false
        })
        this.fetch();
      },
    })
  }

  //-----头部form-----
  headerFormSaveFuntion = (values: any, form: any) => {
    this.setState({
      searchParams: values,
    })
    const { dispatch } = this.props;

    // 取出起始和结束时间
    const { createTime } = values
    if (createTime !== undefined && createTime != '') {
      delete values.createTime
      values.startTime = moment(createTime[0]).format('YYYY-MM-DD');
      values.endTime = moment(createTime[1]).format('YYYY-MM-DD');
    }

    dispatch({
      type: 'activityConfig/activityList',
      payload: values,
    })
  }


  onDeleteClick = (record: any) => {
    const { confirm } = Modal;
    const { dispatch } = this.props;
    let param = { 'activityId': record };
    let that = this;
    confirm({
      title: '您确定删除此活动吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'activityConfig/deleteActivity',
          payload: param,
          callback: (result: boolean, msg: string) => {
            that.fetch();
          },
        })
      },
      onCancel() {

      },
    });

  }

  createActivity = () => {
    this.setState({
      isShowEditActivityFrom: true,
      isCreate: true,
    })
  }

  getTableColumns = (): ColumnProps<any>[] => [
    {
      width: 150,
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      width: 150,
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      width: 150,
      title: '活动城市',
      dataIndex: 'city',
    },
    {
      width: 100,
      title: '活动描述',
      dataIndex: 'remark',
    },
    {
      width: 150,
      title: '活动开始时间',
      dataIndex: 'start_time',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 150,
      title: '活动结束时间',
      dataIndex: 'end_time',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 100,
      title: '活动状态',
      dataIndex: 'status_txt',
    },
    {
      width: 100,
      title: '创建人',
      dataIndex: 'create_user',
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'btns',
      key: 'action',
      render: (text, record) => (
        < Fragment >
          {
            <div>

              <a onClick={() => this.showEditActivityFunction(record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.onDeleteClick(record.id)}>删除</a>
            </div>
          }
        </Fragment >
      ),
    },
  ];

  // 分页
  handleChangePage = (page: any) => {
    console.log(page, '------hdfbvdgfvdgfvghbs');
    const { form, dispatch } = this.props;
    const valuesResult = {
      ...this.state.searchParams,
      page: page.current,
      pageSize: 10,
    }
    dispatch({
      type: 'activityConfig/activityList',
      payload: valuesResult,
    });
  }

  render() {
    const {

      activityConfig: { data: { pagination, list } }, loading,
    } = this.props;
    const { showEditActivityModel, isCreate } = this.state;
    const columns = this.getTableColumns();
    return (
      <PageHeaderWrapper>

        <Card bordered={false}>

          <Row>
            <Col span={24}>
              <ActivityConfigHeader saveFunction={this.headerFormSaveFuntion} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Button type='primary' onClick={this.createActivity}>创建活动</Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                style={{ marginTop: 30 }}
                scroll={{ x: 'max-content' }}
                onChange={this.handleChangePage}
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={{
                  ...pagination,
                  onChange: page => this.handleChangePage
                }}
              />
            </Col>
          </Row>
        </Card>
        {
          this.state?.isShowEditActivityFrom ?
            <Modal
              visible={this.state?.isShowEditActivityFrom}
              onCancel={this.hiddenActivityFunction}
              footer={false}
            >
              <ActivityEditPageForm
                isCreate={isCreate}
                model={showEditActivityModel === undefined ? {} : showEditActivityModel}
                saveFunction={this.editActivityRequetsFuntion}
                createFunction={this.createActivityFunction}
                onCancel={this.hiddenActivityFunction}
              />
            </Modal> :
            <div></div>
        }
      </PageHeaderWrapper>
    );
  }

}

export default (ActivityConfig);
