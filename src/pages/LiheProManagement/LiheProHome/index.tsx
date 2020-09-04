import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  message,
  Modal,
  Radio,
  Input
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination } from './data';
import styles from './style.less';
import getUserInfo from '@/utils/UserInfoStorage';
import { RadioChangeEvent } from 'antd/lib/radio';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      any
    >
  >;
  loading: boolean;
  LiheProHome: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
  // 信息变更
  leadStatusConfig:any;
  radio:any;
  collaboratorVisible:boolean;  // 添加协作人
  transferVisible:boolean; // 转移
  customerVisible:boolean;
  messageVisible:boolean; // 发送短信
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    LiheProHome,
    loading,
  }: {
    LiheProHome: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LiheProHome,
    loading: loading.models.LiheProHome,
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  leadsStatus: any;
  saveParams: any;

  currentUserInfo = CrmUtil.getUserInfo();

  constructor(props: TableListProps) {
    super(props);
  }

  state: TableListState = {
    selectedRows: [],
    formValues: {},
    originalFormValus: undefined,
    // 信息变更
    collaboratorVisible:false,  // 添加协作人
    transferVisible:false, // 转移
    messageVisible:false, // 发送短信
    customerVisible:false,
    radio:1,
    leadStatusConfig:[{
      id:1,
      name:"全部客户"
    },{
      id:2,
      name:"我的客户"
    },{
      id:3,
      name:"我协作的客户"
    }]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    //拉取配置信息
    dispatch({
      type: 'LiheProHome/getConfigInfo',
    });
    //拉取搜索组
    dispatch({
      type: 'LiheProHome/getDistributeGroupConifgInfo',
    });
    //拉取搜索用户
    dispatch({
      type: 'LiheProHome/getDistributePeopleConifgInfo',
    });
    //拉取状态配置信息
    dispatch({
      type: 'LiheProHome/getLeadStatusConfigInfo',
      payload: {
        role: '2',
      },
      callback: (response: any) => {
        if (response.code === 200) {
          const {
            LiheProHome: { leadStatusConfig }
          } = this.props;
          if (leadStatusConfig && leadStatusConfig.length > 0) {
            this.leadsStatus = leadStatusConfig[0].id;
            this.saveParams = { 'headerStatus': this.leadsStatus };
          }
          //拉取表单信息
          dispatch({
            type: 'LiheProHome/fetch',
            payload: {
              headerStatus: this.leadsStatus,
            },
          });
        }
      }
    });
    dispatch({
      type: 'LiheProHome/getUserPermissionList',
    });
  }


  componentWillReceiveProps(nextProps: any) {
    var isRefresh = localStorage ? localStorage.getItem('leadsListRefreshTag')?.toString() : '';
    if (isRefresh && isRefresh?.length > 0) {
      localStorage?.setItem('leadsListRefreshTag', '')
      if (isRefresh == 'reset') {
        this.handleFormReset()
      } else if (isRefresh == 'list') {
        this.handleSearch(null)
      }
    }
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
  ) => {
    this.setState({
      selectedRows: [],
    });

    const { dispatch } = this.props;
    const { formValues } = this.state;

    //状态
    const params = {
      ...formValues,
      'headerStatus': this.leadsStatus,
    };

    //分页信息
    params['page'] = pagination.current;
    params['pageSize'] = pagination.pageSize;

    dispatch({
      type: 'LiheProHome/fetch',
      payload: params,
    });
  };

  handleNewLeads = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LiheProHome/newLeads',
    })
  }

  handleLeadDetails = (record: any) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/lihePro/Detail',
      query: {
        customerId: '232'
      }
    }));
    // if (record.customer_id == null) {
    //   message.error('跟进失败，客户id不能为空');
    //   return;
    // }
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'LiheProHome/details',
    //   payload: {
    //     customerId: record.customer_id,
    //     leadId: record.id,
    //     categoryId: record.category_id,
    //     saveParams: this.saveParams,
    //     ownerId: record.owner_id,
    //   },
    // })
  }


  handleFormReset = () => {
    this.setState({
      selectedRows: [],
      originalFormValus: undefined,
    });

    const { form, dispatch } = this.props;
    //表单重置
    form.resetFields();
    this.setState({
    }, () => {
      //状态
      const values = {
        'headerStatus': this.leadsStatus,
      };
      //保存请求参数
      this.saveParams = {
        ...values,
      };
      //取出分页信息
      const { LiheProHome: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        values['page'] = 1;
        values['pageSize'] = pagination.pageSize;
      }
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'LiheProHome/fetch',
        payload: values,
      });
    })
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleLeadsStatus = (e: RadioChangeEvent) => {
    this.setState({
      selectedRows: [],
      radio: e.target.value
    });

    this.leadsStatus = e.target.value;
    const { dispatch } = this.props;
    const { formValues } = this.state;
    //表单信息和状态
    const values = {
      ...formValues,
      'headerStatus': this.leadsStatus,
    };

    //保存请求参数
    this.saveParams = {
      ...values,
    };
    //取出分页信息
    const { LiheProHome: { data } } = this.props;
    const { pagination } = data;
    if (pagination !== undefined) {
      values['page'] = 1;
      values['pageSize'] = pagination.pageSize;
    }

    this.setState({
      formValues: values,
    });

    dispatch({
      type: 'LiheProHome/fetch',
      payload: values,
    });
    console.log(this.saveParams);
  };

  handleSearch = (e: React.FormEvent | null) => {
    this.setState({
      selectedRows: [],
    });

    e?.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        originalFormValus: fieldsValue,
      });
      //表单信息和状态
      const values = {
        ...fieldsValue,
        'headerStatus': this.leadsStatus,
      };
      if (values.category) {
        values.category = values.category[values.category.length - 1];
      }
      //取出起始和结束时间
      const transfer_range_time = fieldsValue['transfer_range_time']
      if (transfer_range_time != undefined && transfer_range_time != '') {
        delete values['transfer_range_time']
        values['acTime'] = moment(transfer_range_time[0]).format('YYYY-MM-DD');
        values['endTime'] = moment(transfer_range_time[1]).format('YYYY-MM-DD');
      }
      //取出起始和结束时间
      const lastnew_service_range_time = fieldsValue['lastnew_service_range_time']
      if (lastnew_service_range_time != undefined && lastnew_service_range_time != '') {
        delete values['lastnew_service_range_time']
        values['followNewestAction'] = moment(lastnew_service_range_time[0]).format('YYYY-MM-DD');
        values['followNewestEnd'] = moment(lastnew_service_range_time[1]).format('YYYY-MM-DD');
      }
      //取出起始和结束时间
      const next_service_range_time = fieldsValue['next_service_range_time']
      console.log("NextTime:" + next_service_range_time)
      if (next_service_range_time != undefined && next_service_range_time != '') {
        delete values['next_service_range_time']
        values['followNextAction'] = moment(next_service_range_time[0]).format('YYYY-MM-DD');
        values['followNextEnd'] = moment(next_service_range_time[1]).format('YYYY-MM-DD');
      }
      //婚期
      const wedding_date_time = fieldsValue['wedding_date_time']
      if (wedding_date_time != undefined && wedding_date_time != '') {
        delete values['wedding_date_time']
        values['weddingDateFrom'] = moment(wedding_date_time[0]).format('YYYY-MM-DD');
        values['weddingDateEnd'] = moment(wedding_date_time[1]).format('YYYY-MM-DD');
      }
      const channelArr = fieldsValue['channel']
      if (channelArr !== undefined) {
        delete values['channel']
        if (channelArr.length > 0) {
          values['channel'] = channelArr[channelArr.length - 1]
        }

      }


      //保存请求参数
      this.saveParams = {
        ...values,
      };
      //取出分页信息
      const { LiheProHome: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        if (e == null) {
          values['page'] = pagination.current;
          values['pageSize'] = pagination.pageSize;
        } else {
          values['page'] = 1;
          values['pageSize'] = pagination.pageSize;
        }
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'LiheProHome/fetch',
        payload: values,
      });
    });
  };

  columns: StandardTableColumnProps[] = [
    /**
     * id                 线索id
     * name               线索名
     * main_contact_name  客户联系人
     * category           业务类型
     * location_province  业务城市
     * channel            业务渠道
     * activity_id            活动名称
     * wedding_date       婚期
     * budget             预算
     * status             线索状态
     * follow_status      跟进结果
     * follow_newest      最新服务时间
     * follow_next        下次回访时间
     * encode_phone       加密手机号
     * show_icon          1：手机，2：微信
     * follow_hour        小时
     * customer_id: 5,    用户id
     * phone: 5,          用户手机
     * wechat: 5,         微信号
     * customer_name      客户姓名
     */
    {
      title: '客户姓名及联系方式',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleLeadDetails(record)}>{text}</a>
          </Fragment>
        )
      }
    },
    {
      title: '标签',
      dataIndex: 'customer_id',
    },
    {
      title: '客户阶段',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '最后跟进人',
      dataIndex: 'hide_phone',
      width: 130,
    },
    {
      title: '跟进状态',
      dataIndex: 'category',
    },
    {
      title: '最新跟进记录',
      dataIndex: 'follow_next',
    },
    {
      title: '实际跟进时间',
      dataIndex: 'follow_status',
      width: 150,
    },
    {
      title: '下次跟进时间',
      dataIndex: 'follow_newest',
      width: 150,
    },
    {
      title: '操作',
      fixed: 'right',
      render: (text, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleLeadDetails(record)}>跟进</a>
          </Fragment>
        )
      }
    },
  ];

  renderAdvancedForm() {
    /**
     * city           城市-否
     * channel        渠道-否
     * category       品类-否
     * ac_time        开始时间-否
     * end_time       结束时间-否
     * follow_status  跟进结果-否
     * name           客户姓名-否
     * id             客户id-否
     * status         线索状态-否
     * page           页码-否
     */
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { LiheProHome: { customerConfig ,permission } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={12}>
            <FormItem label="跟进状态">
              {getFieldDecorator('activityId', { initialValue: this.state.originalFormValus?.activityId })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear mode="multiple">
                  {
                    customerConfig.activity ? customerConfig.activity.map( (activity:any) => (
                      <Option value={activity.id}>{activity.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="客户阶段">
              {getFieldDecorator('followTag', { initialValue: this.state.originalFormValus?.followTag })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear mode="multiple">
                  {
                    customerConfig.leadsFollowTag ? customerConfig.leadsFollowTag.map((followTag:any) => (
                      <Option value={followTag.id}>{followTag.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: '-24px' }}>
        <Col span={8}>
            <FormItem label="所属部门">
              {getFieldDecorator('followStatus', { initialValue: this.state.originalFormValus?.followStatus })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    customerConfig.leadsFollowStatus ? customerConfig.leadsFollowStatus.map((leadsFollowStatus:any) => (
                      <Option value={leadsFollowStatus.id}>{leadsFollowStatus.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="负责人">
                {getFieldDecorator('followStatus', { initialValue: this.state.originalFormValus?.followStatus })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    {
                      customerConfig.leadsFollowStatus ? customerConfig.leadsFollowStatus.map((leadsFollowStatus:any) => (
                        <Option value={leadsFollowStatus.id}>{leadsFollowStatus.name}</Option>)) : null
                    }
                  </Select>,
                )}
            </FormItem>
          </Col>
          <Col span={8} offset={permission && permission.owneridfilter ? 8 : 0} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex' }}>
              <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
              <Button id="fsubmit" type="primary" htmlType="submit" style={{ marginLeft: '20px', flexGrow: 1 }}>筛选</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }


  renderAdvancedForm1() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { LiheProHome: { customerConfig, permission } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={12}>
            <FormItem label="跟进状态">
              {getFieldDecorator('activityId', { initialValue: this.state.originalFormValus?.activityId })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear mode="multiple">
                  {
                    customerConfig.activity ? customerConfig.activity.map((activity:any) => (
                      <Option value={activity.id}>{activity.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="客户阶段">
              {getFieldDecorator('followTag', { initialValue: this.state.originalFormValus?.followTag })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear mode="multiple">
                  {
                    customerConfig.leadsFollowTag ? customerConfig.leadsFollowTag.map((followTag:any) => (
                      <Option value={followTag.id}>{followTag.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: '-24px' }}>
          <Col span={8} offset={permission && permission.owneridfilter ? 8 : 0} style={{ marginBottom: '24px' }}></Col>
          <Col span={8} offset={permission && permission.owneridfilter ? 8 : 0} style={{ marginBottom: '24px' }}></Col>
          <Col span={8} offset={permission && permission.owneridfilter ? 8 : 0} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex' }}>
              <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
              <Button id="fsubmit" type="primary" htmlType="submit" style={{ marginLeft: '20px', flexGrow: 1 }}>筛选</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const {radio} = this.state;
    return radio == 1 || radio == 3 ? this.renderAdvancedForm() : this.renderAdvancedForm1()
  }

  renderRadioGroup = () => {
    const {
      // LiheProHome: { leadStatusConfig }
    } = this.props;
    const {leadStatusConfig} = this.state;
    return (
      <Radio.Group defaultValue={(leadStatusConfig && leadStatusConfig.length > 0) ? leadStatusConfig[0].id : undefined} buttonStyle="solid" onChange={this.handleLeadsStatus}>
        {
          (leadStatusConfig && leadStatusConfig.length > 0) ? leadStatusConfig.map(config => (
            <Radio.Button value={config.id}>{config.name}</Radio.Button>)) : null
        }
      </Radio.Group >
    );
  }

  // 添加协作人
  handleCollaboratorOk = (e:any) => {
    const {form} = this.props;

    let files:string[] = [];
    form.validateFields((err, fieldsValue)=>{
      if(err) {
        this.setState({
          collaboratorVisible: true,
        });
        return 
      }
      fieldsValue = {
        ...fieldsValue,
        file:files
      }
      form.resetFields();
      files = [];
    });
  };

  handleCollaboratorCancel = (e:any) => {
    this.setState({
      collaboratorVisible: false,
    });
  };

  // 转移
  handleTransferOk = (e:any) => {
    const {form} = this.props;

    let files:string[] = [];
    form.validateFields((err, fieldsValue)=>{
      if(err) {
        this.setState({
          transferVisible: true,
        });
        return 
      }

      fieldsValue = {
        ...fieldsValue,
        file:files
      }
      form.resetFields();
      files = [];
    });
  };

  handleTransferCancel = (e:any) => {
    this.setState({
      transferVisible: false,
    });
  };

  // 转移至客户公海
  handleCustomerOk = (e:any) => {
    const {form} = this.props;

    let files:string[] = [];
    form.validateFields((err, fieldsValue)=>{
      if(err) {
        this.setState({
          customerVisible: true,
        });
        return 
      }
      fieldsValue = {
        ...fieldsValue,
        file:files
      }
      form.resetFields();
      files = [];
    });
  }; 

  handleCustomerCancel = (e:any) => {
    this.setState({
      customerVisible: false,
    });
  };

  handleMessageOk = (e:any) => {
    const {form} = this.props;

    let files:string[] = [];
    form.validateFields((err, fieldsValue)=>{
      if(err) {
        this.setState({
          messageVisible: true,
        });
        return 
      }
      fieldsValue = {
        ...fieldsValue,
        file:files
      }
      form.resetFields();
      files = [];
    });
  }; 

  handleMessageCancel = (e:any) => {
    this.setState({
      messageVisible: false,
    });
  };


  // 信息变更 END
  render() {
    const {
      LiheProHome: { data, leadStatusConfig },
      loading,
      form
    } = this.props;
    let company_tag = this.currentUserInfo.company_tag;
    company_tag = CrmUtil.getCompanyType() == 2;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <Divider />

            <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: '16px' }}>
              <Col span={24}>
                <div style={{ display: 'flex' }}>
                  {
                    (leadStatusConfig && leadStatusConfig.length > 0) ? this.renderRadioGroup() : null
                  }
                  <div style={{ flex: '1' }} />
                  {/* {company_tag && permission && permission.leadsadapter_leadsinformationchange == true && selectedRows.length > 0 &&
                    <Button type="primary" onClick={this.informationChange} style={{marginLeft:'10px'}}>信息变更</Button>
                  } */}
                  <Button style={{ marginLeft: '10px' }} type="primary" icon='plus' onClick={()=>{this.setState({collaboratorVisible:true})}}>添加协作人</Button>
                  <Button style={{ marginLeft: '10px' }} type="primary" icon='plus' onClick={()=>{this.setState({transferVisible:true})}}>转移</Button>
                  <Button style={{ marginLeft: '10px' }} type="primary" icon='plus' onClick={()=>{this.setState({customerVisible:true})}}>转移至客户公海</Button>
                  <Button style={{ marginLeft: '10px' }} type="primary" icon='plus' onClick={()=>{this.setState({messageVisible:true})}}>发送短信</Button>
                </div>
              </Col>
            </Row>

            <Modal
              confirmLoading={loading}
              title="添加协作人"
              visible={this.state.collaboratorVisible}
              onOk={this.handleCollaboratorOk}
              onCancel={this.handleCollaboratorCancel}
            >
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="协作人部门">
                {
                  form.getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择协作人部门' }],
                  })(<Select style={{ width: "100%" }} placeholder="请选择协作人部门">
                    {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>)
                }
              </FormItem>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="协作人">
                {
                  form.getFieldDecorator('person', {
                    rules: [{ required: true, message: '请选择协作人' }],
                  })(<Select style={{ width: "100%" }} placeholder="请选择协作人">
                    {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                    <Option value="male">人</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>)
                }
              </FormItem>
            </Modal>


            <Modal
              confirmLoading={loading}
              title="客户负责人转移"
              visible={this.state.transferVisible}
              onOk={this.handleTransferOk}
              onCancel={this.handleTransferCancel}
            >
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新负责人">
                {
                  form.getFieldDecorator('transfer',{
                    rules: [{ required: true, message: '请选择新负责人' }],
                  })(<Select style={{ width: "100%" }} placeholder="请选择负责人">
                    {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>)
                }
              </FormItem>
            </Modal>


            <Modal
              confirmLoading={loading}
              title="转移至客户公海"
              visible={this.state.customerVisible}
              onOk={this.handleCustomerOk}
              onCancel={this.handleCustomerCancel}
            >
              <div className={styles.warn}>
                <div className={styles.wran_icon}><ExclamationCircleOutlined /></div>
                <div style={{marginLeft: 10}}>是否放弃当前更近客户？</div>
              </div>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="丢单原因">
                {
                  form.getFieldDecorator('reson', {
                    rules: [{ required: true, message: '请选择丢单原因' }],
                  })(<Select style={{ width: "100%" }} placeholder="请选择丢单原因">
                    {/* {
                      configDatas && configDatas.map(value => (
                        <Option value={value.id} key={value.id}>{value.name}</Option>
                      ))
                    } */}
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>)
                }
              </FormItem>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="备注原因">
                {
                  form.getFieldDecorator('remark', {
                    rules: [{ required: true, message: '请填写备注原因' }],
                  })(<TextArea rows={4} />)
                }
              </FormItem>
            </Modal>


            <Modal
              confirmLoading={loading}
              title="发送短信"
              visible={this.state.messageVisible}
              onOk={this.handleMessageOk}
              onCancel={this.handleMessageCancel}
            >
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="短信内容">
                {
                  form.getFieldDecorator('message',{
                    rules: [{ required: true, message: '请填写短信内容' }],
                  })(<TextArea rows={4} />)
                }
              </FormItem>
            </Modal>

            <StandardTable
              scroll={{ x: 'max-content' }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

class TableList1 extends Component<TableListProps, TableListState> {

  render() {
    return (
      <KeepAlive>
        <TableList {...this.props} />
      </KeepAlive>
    )
  }

}
export default Form.create<TableListProps>()(TableList1);
