import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { ColumnProps } from 'antd/es/table'; // 引用table中的行参数
import { Spin, Form, Col, Row, DatePicker, Select, Button, Input, Radio, Card, Table, Divider, message, Cascader } from 'antd';
import moment from 'moment';
import { RadioChangeEvent } from 'antd/lib/radio';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import AreaSelect from '@/components/AreaSelect';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { StateType } from './model';
import styles from './index.less';
import { ConfigListItem } from './groupHome/data';
import { KeepAlive } from 'umi';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

interface GroupMangementProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'groupMangement/fetch'
      | 'groupMangement/changeStatusGroup'
      | 'newGroup/configCtrl'
    >
  >;
  loading: boolean;
  groupMangement: StateType;
}

interface GroupMangementState {
  resetArea: boolean;
  province: string;
  city: string;
  code: string;
  searchParams: Object,
  rangeValue: string;
  // formValues: {
  //   [key: string]: string;
  // };
  value: string;
  tableListData: Array<TableListDataItem>;
  originalFormValus: any;
}

interface TableListDataItem {
  id: string; // 自增id
  userType: number;  // 用户类型 1:医生, 2:用户, 3:患者
  userId: string;                 // 用户ID
  remark: string;                  // 备注
  status: number;                  // 状态 1:启用(默认), -1:禁用
  isDeleted: number;              // 删除标识 0:默认, 1:已删除
  createUser: string;             // 创建者
  updateUser: string;             // 更新者
  createTime: string;             // 创建时间
  updateTime: string;             // 更新时间
  cannelId: Array;
}

interface ConfigState {
  channel: ConfigListItem[];
  customerLevel: ConfigListItem[];
  identity: ConfigListItem[];
  gender: ConfigListItem[];
  weddingStyle: ConfigListItem[];
  category: ConfigListItem[];
  contactTime: ConfigListItem[];
  contactWay: ConfigListItem[];
  payType: ConfigListItem[];
  requirementStatus: ConfigListItem[];
  followTag: ConfigListItem[];
  leadsFollowStatus: ConfigListItem[];
  customerFollowStatus: ConfigListItem[];
  orderFollowStatus: ConfigListItem[];
  leadsStatus: ConfigListItem[];
  banquetType: ConfigListItem[];
  carBrand: ConfigListItem[];
  photoStyle: ConfigListItem[];
}

@connect(
  ({
    groupMangement,
    loading,
  }: {
    groupMangement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    groupMangement,
    loading: loading.models.groupMangement,
  }),
)

class GroupMangement extends Component<GroupMangementProps, GroupMangementState, ConfigState> {

  state = {
    tableListData: [],
    // formValues: {},
    searchParams: {},
    resetArea: false,
    province: '',
    city: '',
    code: '',
    value: '0',
    cannelId: [],
    rangeValue: '',
    originalFormValus: {}
  }

  configData: ConfigState = {
    channel: [],
    customerLevel: [],
    identity: [],
    gender: [],
    weddingStyle: [],
    category: [],
    contactTime: [],
    contactWay: [],
    payType: [],
    requirementStatus: [],
    followTag: [],
    leadsFollowStatus: [],
    customerFollowStatus: [],
    orderFollowStatus: [],
    leadsStatus: [],
    banquetType: [],
    carBrand: [],
    photoStyle: [],
  }


  componentDidMount() {
    const { dispatch } = this.props;
    Axios.post(URL.customerConfig)
      .then(
        res => {
          if (res.code == 200) {
            this.configData = res.data.result;
            // 拉取表单信息
            dispatch({
              type: 'groupMangement/fetch',
            });
          }
        }
      );

  }

  componentWillReceiveProps(nextProps: any) {
    const isRefresh = localStorage ? localStorage.getItem('isRefresh')?.toString() : '';
    if (isRefresh?.length > 0) {
      localStorage?.setItem('isRefresh', '')
      this.handleFormReset()
    }
  }


  // 获取列表 表头
  getTableColumns = (): ColumnProps<any>[] => [
    {
      title: '客服组',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      width: 150,
      title: '负责区域',
      dataIndex: 'area',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 200,
      title: '客资来源',
      dataIndex: 'channel',
    },
    // {
    //   width: 150,
    //   title: '负责人',
    //   dataIndex: 'leader',
    //   render(text) {
    //     return <>{text?text:'-'}</>
    //   }
    // },
    {
      width: 100,
      title: '组状态',
      dataIndex: 'status',
    },
    {
      width: 150,
      title: '创建人',
      dataIndex: 'create_by',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 150,
      title: '创建时间',
      dataIndex: 'create_time',
    },
    // {
    //   width: 250,
    //   title: '备注',
    //   dataIndex: 'remark',
    // },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'isCanFreeze',
      width: 150,
      render: (text, record) => (
        <>
          <a onClick={() => this.handleDetaill(text, record)}>
            详情
            </a>
          <Divider type="vertical" />
          <a onClick={() => this.handleClickEdit(text, record)}>
            {text == '1' ? '冻结' : text == '0' ? '重新开启' : '冻结'}
          </a>
        </>
      ),
    },
  ];


  handleClickEdit = (text: any, record: any) => {
    const { dispatch } = this.props;
    if (text === 1) { // 冻结
      dispatch({
        type: 'groupMangement/changeStatusGroup',
        payload: {
          groupId: record.id,
          status: 2
        },
        callback: this.distributeUserCallback
      });
    } else if (text === 0) {  // 重新开启按钮
      dispatch({
        type: 'groupMangement/changeStatusGroup',
        payload: {
          groupId: record.id,
          status: 1
        },
        callback: this.distributeUserCallback
      });
    }
  }

  handleDetaill = (text: any, record: any) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/groupdetail/${record.id}`,
    }))
    localStorage.setItem('isRefresh', '')
  }

  distributeUserCallback = (data: any) => {
    const { dispatch } = this.props
    if (data.code == 200) {
      message.success(data.msg)
    }
    dispatch({
      type: 'groupMangement/fetch',
    });
  }


  handleNewGroup = () => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'groupMangement/newGroup'
    // });
    dispatch(routerRedux.push({
      pathname: '/group/groupnew',
    }))
  };

  areaSelectChange = (code: string) => {
    this.setState({
      code,
    });
  };

  // 切换
  handleButtonTypeChange = (e: RadioChangeEvent) => {
    this.requestListData(e)
  };


  requestListData = (e: any) => {
    const { dispatch } = this.props;
    const { code, searchParams } = this.state;
    this.setState({
      value: e.target.value,
    });

    const valuesResult = {
      status: e.target.value,
      areaCode: code,
      ...searchParams
    };
    dispatch({
      type: 'groupMangement/fetch',
      payload: valuesResult,
    });
  }

  // 筛选
  handleSearch = (e: React.FormEvent) => {
    const {
      form: { validateFieldsAndScroll },
      groupMangement: { data },
      dispatch,
    } = this.props;

    const { pagination } = data;
    const { code, cannelId } = this.state;

    validateFieldsAndScroll((error, values) => {
      e.preventDefault();
      if (!error) {
        // submit the values
        const { timeArray } = values;
        if (values.timeArray !== undefined && values.timeArray.length > 0) {
          values.startCreateTime = moment(values.timeArray[0]).format('YYYY-MM-DD');
          values.endCreateTime = moment(values.timeArray[1]).format('YYYY-MM-DD');
          delete values.timeArray
        }

        if (pagination !== undefined) {
          // values['page'] = pagination.current;
          values.pageSize = pagination.pageSize;
          values.page = 1;
        }

        const channelArr = values.channelId
        if (channelArr !== undefined) {
          delete values.channelId
          if (channelArr.length > 0) {
            values.channelId = channelArr[channelArr.length - 1]
          }

        }

        const valuesResult = {
          ...values,
          areaCode: code,
        }
        for (const i in valuesResult) {
          if (valuesResult[i] == undefined) {
            valuesResult[i] = '';
          }
        }

        // this.setState({
        //   searchParams: valuesResult
        // })

        this.setState({
          searchParams: valuesResult,
          originalFormValus: valuesResult,
        }, () => {
          this.state.originalFormValus.timeArray = timeArray
          this.state.originalFormValus.channelId = channelArr
        })

        dispatch({
          type: 'groupMangement/fetch',
          payload: valuesResult,
        });
      }
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { rangeValue } = this.state;
    // 表单重置
    form.resetFields();

    const obj = { name: "", areaCode: "", startCreateTime: "", endCreateTime: "", memberName: '', channelId: '', rangeValue: '' }
    this.setState({
      searchParams: obj,
      resetArea: true,
      originalFormValus: null,
    })

    dispatch({
      type: 'groupMangement/fetch',
      payload: obj
    });

  };

  // 分页
  handleChangePage = (page: any) => {
    const { dispatch } = this.props;
    const { searchParams } = this.state;
    const valuesResult = {
      ...searchParams,
      pageSize: page.pageSize,
      page: page.current
    };

    dispatch({
      type: 'groupMangement/fetch',
      payload: valuesResult,
    });
  }

  handleCannel = (e: any) => {
    this.setState({
      cannelId: e
    })
  }

  dateChange = (e: any) => {
    const dateObj = {}
    console.log(e)
    if (JSON.stringify(e) != '[]') {
      dateObj.startCreateTime = moment(e[0]).format('YYYY-MM-DD');
      dateObj.endCreateTime = moment(e[1]).format('YYYY-MM-DD');
    } else {
      dateObj.startCreateTime = undefined;
      dateObj.endCreateTime = undefined;
    }
    console.log(dateObj)
  }

  renderForm() {
    const {
      form
    } = this.props;
    const { getFieldDecorator } = form;
    const { rangeValue } = this.state;
    return (
      <div className={styles.tableListForm}>
        <Form >
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="负责区域：">
                {getFieldDecorator('areaCode', { initialValue: this.state.originalFormValus?.areaCode })(
                  <AreaSelect
                    reset={this.state.resetArea}
                    areaSelectChange={this.areaSelectChange} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="创建日期">
                {getFieldDecorator('timeArray', { initialValue: this.state.originalFormValus?.timeArray })(
                  <RangePicker
                    value={rangeValue}
                    onChange={this.dateChange}
                    placeholder={['开始日期', '结束日期']}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="组名">
                {getFieldDecorator('name', { initialValue: this.state.originalFormValus?.name })(
                  <Input maxLength={5} placeholder="请输入组名" />
                )}
              </FormItem>
            </Col>

          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

            <Col span={8}>
              <FormItem label="成员">
                {getFieldDecorator('memberName', { initialValue: this.state.originalFormValus?.memberName })(
                  <Input maxLength={5} placeholder="请输入成员" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客资来源">
                {getFieldDecorator('channelId', { initialValue: this.state.originalFormValus?.channelId })(
                  <Cascader showSearch style={{ width: '100%', }}
                    options={this.configData.channel}

                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex' }}>
                <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
                <Button id="fsubmit" type="primary" onClick={this.handleSearch} style={{ marginLeft: '20px', flexGrow: 1 }}>筛选</Button>
              </div>

            </Col>
          </Row>
          <Divider />
        </Form>
      </div>
    )
  }

  render() {
    const {
      groupMangement: { data },
      loading
    } = this.props;
    const { pagination } = data;
    const columns = this.getTableColumns()
    return (
      <>

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Radio.Group
                defaultValue="0"
                buttonStyle="solid"
                style={{ flexGrow: 1 }}
                onChange={this.handleButtonTypeChange}
                value={this.state.value}
              >
                <Radio.Button value="0">全部</Radio.Button>
                <Radio.Button value="1">有效</Radio.Button>
                <Radio.Button value="2">冻结</Radio.Button>
              </Radio.Group>

              <Button type="primary" onClick={this.handleNewGroup}><PlusOutlined />新建分组</Button>
            </div>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={data.list}
              pagination={{
                ...pagination,
                showTotal: (total: number, range: [number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
                onChange: page => this.handleChangePage
              }}
              onChange={this.handleChangePage}
              columns={columns}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Card>
      </>
    )
  }
}

class GroupMangement1 extends Component<GroupMangementProps, GroupMangementState, ConfigState> {
  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <GroupMangement {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<GroupMangementProps>()(GroupMangement1);
