import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
  Radio,
  Modal,
  InputNumber,
  Cascader,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import AreaSelect from '@/components/AreaSelect';
import { RadioChangeEvent } from 'antd/lib/radio';
import LOCAL from '@/utils/LocalStorageKeys';
import { SelectValue } from 'antd/lib/select';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';
import CountDown from '@/pages/LeadsManagement/leadsList/components/CountDown';
import styles from './style.less';
import { TableListItem, TableListPagination, ReqConfigItem } from './data';
import { StateType } from './model';
import getUserInfo from '@/utils/UserInfoStorage';
import { UserInfo } from '@/pages/user/login/data';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import { routerRedux } from 'dva/router';
import CrmStandardTable, { getCrmTableColumn, CrmStandardTableColumnProps } from '@/components/CrmStandardTable';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    any
  >;
  loading: boolean;
  qaManagementList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  inforDiaglog: boolean;
  inforChangeNum: any;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  areaRest: boolean,
  distributes: any[];
  distributeInputGroupNum: number,
  distributeInputPeopleNum: number,
  // 0为组，1为人名，默认为0
  distributeType: number;
  distributeSelectGroup: ConfigItem[];
  distributeSelectPeople: ConfigItem[];
  distributeInputGroupMap: Map<string, number>;
  distributeInputPeopleMap: Map<string, number>;

  columnsData: CrmStandardTableColumnProps<TableListItem>[];

  originValues: { [key: string]: string };
  phaseChoice: any;

  channelByCompany: ReqConfigItem[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    qaManagementList,
    loading,
  }: {
    qaManagementList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    qaManagementList,
    loading: loading.models.qaManagementList,
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  reqStatus: any = '1';

  saveParams: any;

  reqOwner: string = '1';

  isDXLConfiged = false;

  currentUserInfo = CrmUtil.getUserInfo();

  constructor(props: TableListProps) {
    super(props);
  }

  generateStandardTableColumnProps = (reqstatus: number): CrmStandardTableColumnProps<TableListItem>[] => {
    const columns: CrmStandardTableColumnProps<TableListItem>[] = [];
    const get = getCrmTableColumn;
    columns.push(get('req_qa_id', '有效单id', {
      render: (text, record) => <a onClick={() => this.handleCustomerDetails(record)}>{text}</a>
    }))
    columns.push(get('group_customer_id', '集团id'))
    columns.push(get('customer_id', '客户id'))
    columns.push(get('source_company_name', '公司来源'))
    columns.push(get('channel_name', '客资来源'))
    columns.push(get('customer_name', '客户姓名'))
    columns.push(get('category_name', '业务品类'))
    if (reqstatus == 1) {  //待跟进
      columns.push(get('invalid_reason', '无效原因'))
      columns.push(get('req_follow_time', '最新跟进时间'))
      columns.push(get('req_follow_status', '跟进结果'))
      columns.push(get('req_follow_content', '最新跟进记录', {
        width: 130,
        render: (text: any, recoder: TableListItem) => <div>
          {
            !recoder.req_follow_num ? '' : <div>{recoder.req_follow_num}次回访</div>
          }
          {
            !recoder.req_follow_content ? '' : <div>{recoder.req_follow_content}</div>
          }
        </div>
      }))
      columns.push(get('delimit_time', '划入时间'))
    } else if (reqstatus == 2) {　　//跟进中
      columns.push(get('qa_follow_time', '最新跟进时间'))
      columns.push(get('qa_follow_status', '跟进结果'))
      columns.push(get('qa_follow_content', '最新跟进记录', {
        width: 130,
        render: (text: any, recoder: TableListItem) => <div>
          {
            recoder.qa_follow_num && <div>{recoder.qa_follow_num}次回访</div>
          }
          {
            recoder.qa_follow_content && <div>{recoder.qa_follow_content}</div>
          }
        </div>
      }))
      columns.push(get('qa_follow_user', '跟进人'))
      columns.push(get('delimit_time', '划入时间'))
    } else if (reqstatus == 3 || reqstatus == 4) {　　//3有效　４待定数据
      columns.push(get('qa_follow_time', '最新跟进时间'))
      columns.push(get('qa_follow_status', '跟进结果'))
      columns.push(get('qa_follow_content', '最新跟进记录', {
        width: 130,
        render: (text: any, recoder: TableListItem) => <div>
          {
            recoder.qa_follow_num && <div>{recoder.qa_follow_num}次回访</div>
          }
          {
            recoder.qa_follow_content && <div>{recoder.qa_follow_content}</div>
          }
        </div>
      }))
      columns.push(get('qa_follow_user', '跟进人'))
      columns.push(get('delimit_time', '划入时间'))
    } else if (reqstatus == 5) {　　　//无效数据
      columns.push(get('qa_follow_time', '最新跟进时间'))
      columns.push(get('qa_follow_status', '跟进结果'))
      columns.push(get('qa_follow_content', '最新跟进记录', {
        width: 130,
        render: (text: any, recoder: TableListItem) => <div>
          {
            recoder.qa_follow_num && <div>{recoder.qa_follow_num}次回访</div>
          }
          {
            recoder.qa_follow_content && <div>{recoder.qa_follow_content}</div>
          }
        </div>
      }))
      columns.push(get('invalid_reason', '无效原因'))
      columns.push(get('qa_follow_user', '跟进人'))
      columns.push(get('delimit_time', '划入时间'))
    } else if (reqstatus == 6) {　　　//激活数据
      columns.push(get('allot_company', '派发公司'))
      columns.push(get('allot_time', '派发时间'))
      columns.push(get('qa_follow_time', '最新跟进时间'))
      columns.push(get('qa_follow_status', '跟进结果'))
      columns.push(get('qa_follow_content', '最新跟进记录', {
        width: 130,
        render: (text: any, recoder: TableListItem) => <div>
          {
            recoder.qa_follow_num && <div>{recoder.qa_follow_num}次回访</div>
          }
          {
            recoder.qa_follow_content && <div>{recoder.qa_follow_content}</div>
          }
        </div>
      }))
      columns.push(get('qa_follow_user', '跟进人'))
      columns.push(get('delimit_time', '划入时间'))
    } else if (reqstatus == 7) {　　//退回死海
      columns.push(get('qa_follow_time', '最新跟进时间'))
      columns.push(get('qa_follow_status', '跟进结果'))
      columns.push(get('qa_follow_content', '最新跟进记录', {
        width: 130,
        render: (text: any, recoder: TableListItem) => <div>
          {
            recoder.qa_follow_num && <div>{recoder.qa_follow_num}次回访</div>
          }
          {
            recoder.qa_follow_content && <div>{recoder.qa_follow_content}</div>
          }
        </div>
      }))
      columns.push(get('qa_follow_user', '跟进人'))
      columns.push(get('allot_dead_time', '退回时间'))
    }
    columns.push(get('action', '操作', {
      fixed: 'right',
      render: (text, record) => <a onClick={() => this.handleCustomerDetails(record)}>{'处理'}</a>
    }))
    return columns;
  }

  columns: CrmStandardTableColumnProps<TableListItem>[] = this.generateStandardTableColumnProps(1)

  state: TableListState = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    areaRest: false,
    distributes: [],
    distributeInputGroupNum: 0,
    distributeInputPeopleNum: 0,
    distributeType: 0,
    distributeSelectGroup: [],
    distributeSelectPeople: [],
    distributeInputGroupMap: new Map(),
    distributeInputPeopleMap: new Map(),
    columnsData: this.columns,
    originValues: {},
    inforDiaglog: false,
    inforChangeNum: [],
    phaseChoice: null,
    channelByCompany: [],
  };

  componentWillReceiveProps(nextProps: any) {
    const isRefresh = localStorage ? localStorage.getItem('qaListRefreshTag')?.toString() : '';
    const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';
    if (isRefresh && isRefresh?.length > 0) {
      localStorage?.setItem('qaListRefreshTag', '')
      if (isRefresh == 'reset') {
        this.handleFormReset()
      } else if (isRefresh == 'list') {
        this.handleSearch(null)
      }
    } else if (autoRefresh === '1') {
      this.handleSearch();
      localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
      console.log('autoRefresh');
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 拉取配置信息
    dispatch({
      type: 'qaManagementList/getConfigInfo',
    });
    // // 拉取搜索组
    // dispatch({
    //   type: 'qaManagementList/getDistributeGroupConifgInfo',
    // });
    // // 拉取搜索用户
    // dispatch({
    //   type: 'qaManagementList/getDistributePeopleConifgInfo',
    // });
    // 拉取状态配置信息
    dispatch({
      type: 'qaManagementList/fetch',
      payload: {
        // tab: '1',
        phase: '1'
      }
    });
    // dispatch({
    //   type: 'qaManagementList/getUserPermissionList',
    // });
    dispatch({
      type: 'qaManagementList/fetchReqConfig',
    });

    localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
  }

  companyChange = (value: any) => {
    const { reqConfig: { company_channel } } = this.props.qaManagementList
    if (company_channel && company_channel.length > 0) {
      let bean = company_channel.find(item => item.company_id == value)
      if (bean) {
        this.setState({
          channelByCompany: bean.channel,
        })
      } else {
        this.setState({
          channelByCompany: [],
        })
      }
      this.props.form.setFieldsValue({
        channel: ''
      })
    }
  }

  handleStandardTableChange = (
    page: number, pageSize: number
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'qaManagementList/fetch',
      payload: {
        ...formValues,
        phase: this.reqStatus,
        page,
        pageSize
      },
    });
  };

  handleNewCustomer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'qaManagementList/newReq'
    });
  }

  handleLeadDetails = (record: any) => {
    if (record.customer_id == null) {
      message.error('跟进失败，客户id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'qaManagementList/details',
      payload: {
        customerId: record.customer_id,
        leadId: record.id,
        saveParams: this.saveParams,
      },
    })
  }

  handleCustomerDetails = (record: any) => {
    if (record.customer_id == null) {
      message.error('跟进失败，客户id不能为空');
      return;
    }
    if (record.req_qa_id == null) {
      message.error('跟进失败，有效单id不能为空');
      return;
    }

    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');

    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/qualityAssuranceList/qualityAssuranceDetail',
      state: {
        reqId: record.req_qa_id,
        customerId: record.customer_id,
        showStyle: 1,
      },
    }))
  }

  areaSelectChange = (codes: string[]) => {
    this.props.form.setFieldsValue({
      cityCode: codes + ""
    })
  }

  handleFormReset = () => {
    this.setState({
      selectedRows: [],
      originValues: {},
      channelByCompany: [],
    });

    const { form, dispatch } = this.props;
    // 表单重置
    form.resetFields();
    const that = this;
    this.setState({
      areaRest: true,
    }, () => {
      that.state.areaRest = false
      // 状态
      const values = {
        phase: this.reqStatus,
        // tab: this.reqOwner,
      };

      // 保存请求参数
      this.saveParams = {
        ...values,
      };
      // 取出分页信息
      const { qaManagementList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        values.page = 1;
        values.pageSize = pagination.pageSize;
      }
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'qaManagementList/fetch',
        payload: values,
      });
    })
  };

  handleDistribute = (e: RadioChangeEvent) => {
    this.setState({
      distributeType: e.target.value,
    })
  }

  handleLeadsStatus = (e: RadioChangeEvent) => {
    this.setState({
      selectedRows: [],
    });

    this.reqStatus = e.target.value;
    const { dispatch, form, } = this.props;
    const { formValues } = this.state;
    // 表单信息和状态
    const values = {
      ...formValues,
      phase: this.reqStatus,
      // tab: this.reqOwner,
    };

    // 保存请求参数
    this.saveParams = {
      ...values,
    };
    // 取出分页信息
    const { qaManagementList: { data } } = this.props;
    const { pagination } = data;
    if (pagination !== undefined) {
      values.page = 1;
      values.pageSize = pagination.pageSize;
    }

    this.setState({
      formValues: values,
    });

    this.setState({
      columnsData: this.generateStandardTableColumnProps(this.reqStatus)
    })

    dispatch({
      type: 'qaManagementList/fetch',
      payload: values,
    });
  };

  handleSearch = (e?: React.FormEvent | null) => {
    this.setState({
      selectedRows: [],
    });

    e?.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        originValues: fieldsValue,
      })

      // 表单信息和状态
      const values = {
        ...fieldsValue,
        phase: this.reqStatus,
        // tab: this.reqOwner,
      };

      // 取出起始和结束时间
      const { transfer_range_time } = fieldsValue
      if (transfer_range_time !== undefined && transfer_range_time != '') {
        delete values.transfer_range_time
        values.delimitStartTime = moment(transfer_range_time[0]).format('YYYY-MM-DD');
        values.delimitEndTime = moment(transfer_range_time[1]).format('YYYY-MM-DD');
      }
      // 取出起始和结束时间
      const { lastnew_service_range_time } = fieldsValue
      if (lastnew_service_range_time !== undefined && lastnew_service_range_time != '') {
        delete values.lastnew_service_range_time
        values.followStartTime = moment(lastnew_service_range_time[0]).format('YYYY-MM-DD');
        values.followEndTime = moment(lastnew_service_range_time[1]).format('YYYY-MM-DD');
      }
      // 取出起始和结束时间
      const { allot_range_time } = fieldsValue
      if (allot_range_time !== undefined && allot_range_time != '') {
        delete values.allot_range_time
        values.allotStartTime = moment(allot_range_time[0]).format('YYYY-MM-DD');
        values.allotEndTime = moment(allot_range_time[1]).format('YYYY-MM-DD');
      }

      const channelArr = fieldsValue.channel
      if (channelArr !== undefined && channelArr.length > 0) {
        delete values.channel
        if (channelArr.length > 0) {
          values.channel = channelArr[channelArr.length - 1]
        }
      }

      const categoryArr = fieldsValue.category
      if (categoryArr !== undefined && categoryArr.length > 0) {
        delete values.category
        if (categoryArr.length > 0) {
          values.category = categoryArr[categoryArr.length - 1]
        }
      }

      // 保存请求参数
      this.saveParams = {
        ...values,
      };

      const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';

      // 取出分页信息
      const { qaManagementList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined && autoRefresh !== '1') {
        values.page = 1;
      } else {
        values.page = pagination?.current ?? 1;
      }

      values.pageSize = pagination?.pageSize ?? 20;

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'qaManagementList/fetch',
        payload: values,
      });
    });
  };

  handleAssign = (record: any) => {
    const distributes: any[] = [record];
    const data = {
      modalVisible: true,
      distributes,
    }
    this.restDistributeValues(data);
  }

  handleAssigns = () => {
    const distributes = this.state.selectedRows;
    const data = {
      modalVisible: true,
      distributes,
    }
    this.restDistributeValues(data);
  }

  handleDistributeOk = () => {
    const { dispatch } = this.props;
    if (this.state.distributeType == 0) {
      if (this.state.distributeInputGroupNum == 0) {
        message.error('请填写有效单的分配数量');
        return
      }
      if (this.state.distributeInputGroupNum > this.state.distributes.length) {
        message.error('填写的有效单分配数量不能超过总有效单数');
        return
      }
      if (this.state.distributeInputGroupMap.size == 0) {
        message.error('出现未知异常');
        return
      }
      let id: string = '';
      this.state.distributes.map((value, index) => {
        if (index == 0) {
          id = value.id;
        } else {
          id = `${id},${value.id}`;
        }
      });
      const groups: object[] = [];
      this.state.distributeInputGroupMap.forEach((value, key, map) => {
        if (value > 0) {
          const group = { id: key, num: value };
          groups.push(group);
        }
      });
      // 分配有效单
      dispatch({
        type: 'qaManagementList/leadsDistribute',
        payload: {
          reqId: id,
          groups,
        },
        callback: (response: any) => {
          if (response.code === 200) {
            message.success(`已成功分配${this.state.distributeInputGroupNum}条有效单`);
            const data = {
              modalVisible: false,
              distributes: [],
              selectedRows: []
            }
            this.restDistributeValues(data);
            document.getElementById('fsubmit')?.click();
          }
        }
      });
    } else {
      if (this.state.distributeInputPeopleNum == 0) {
        message.error('请填写有效单的分配数量');
        return
      }
      if (this.state.distributeInputPeopleNum > this.state.distributes.length) {
        message.error('填写的有效单分配数量不能超过总有效单数');
        return
      }
      if (this.state.distributeInputPeopleMap.size == 0) {
        message.error('出现未知异常');
        return
      }
      let id: string = '';
      this.state.distributes.map((value, index) => {
        if (index == 0) {
          id = value.id;
        } else {
          id = `${id},${value.id}`;
        }
      });
      const owners: object[] = [];
      this.state.distributeInputPeopleMap.forEach((value, key, map) => {
        if (value > 0) {
          const owner = { id: key, num: value };
          owners.push(owner);
        }
      });
      // 分配有效单
      dispatch({
        type: 'qaManagementList/leadsDistribute',
        payload: {
          reqId: id,
          owners,
        },
        callback: (response: any) => {
          if (response.code === 200) {
            message.success(`已成功分配${this.state.distributeInputPeopleNum}条有效单`);
            const data = {
              modalVisible: false,
              distributes: [],
              selectedRows: []
            }
            this.restDistributeValues(data);
            document.getElementById('fsubmit')?.click();
          }
        }
      });
    }
  }

  rowClassName = (recoder: TableListItem) => {
    try {
      if (recoder.phase == '6') {   //待回访
        return styles.lightYellow
      } else if (recoder.phase == '1') {   //待跟进
        return styles.lightRed
      } else if (recoder.follow_time && moment().format('YYYY-MM-DD') == recoder.follow_time.split(' ')[0]) {  //已跟进
        return styles.lightGreen
      }
    } catch (e) { }
    return ''
  }

  handleDistributeCancel = () => {
    const data = {
      modalVisible: false,
      distributes: [],
    }
    this.restDistributeValues(data);
  }

  restDistributeValues = (values: object) => {
    this.setState({
      ...values,
      distributeInputGroupNum: 0,
      distributeInputPeopleNum: 0,
      distributeType: 0,
      distributeSelectGroup: [],
      distributeSelectPeople: [],
      distributeInputGroupMap: new Map(),
      distributeInputPeopleMap: new Map(),
    });
  }

  handleDistributeGroupChange = (value: SelectValue[], option: React.ReactElement<any>[]) => {
    const distributeSelectGroup: ConfigItem[] = [];
    const distributeInputGroupMap: Map<string, number> = new Map();
    let distributeInputGroupNum = 0;
    if (option && option.length > 0) {
      option.map(option => {
        const configItem: ConfigItem = { 'id': option.props.value, 'name': option.props.children }
        distributeSelectGroup.push(configItem)
        if (this.state.distributeInputGroupMap.has(option.props.value)) {
          distributeInputGroupMap.set(option.props.value, this.state.distributeInputGroupMap.get(option.props.value));
          distributeInputGroupNum += this.state.distributeInputGroupMap.get(option.props.value);
        } else {
          distributeInputGroupMap.set(option.props.value, 0);
        }
      })
    }
    this.setState({
      distributeSelectGroup,
      distributeInputGroupMap,
      distributeInputGroupNum,
    });
  }

  handleDistributePeopleChange = (value: SelectValue[], option: React.ReactElement<any>[]) => {
    const distributeSelectPeople: ConfigItem[] = [];
    const distributeInputPeopleMap: Map<string, number> = new Map();
    let distributeInputPeopleNum = 0;
    if (option && option.length > 0) {
      option.map(option => {
        const configItem: ConfigItem = { 'id': option.props.value, 'name': option.props.children }
        distributeSelectPeople.push(configItem)
        if (this.state.distributeInputPeopleMap.has(option.props.value)) {
          distributeInputPeopleMap.set(option.props.value, this.state.distributeInputPeopleMap.get(option.props.value));
          distributeInputPeopleNum += this.state.distributeInputPeopleMap.get(option.props.value);
        } else {
          distributeInputPeopleMap.set(option.props.value, 0);
        }
      })
    }
    this.setState({
      distributeSelectPeople,
      distributeInputPeopleMap,
      distributeInputPeopleNum,
    });
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { qaManagementList: { customerConfig, distributePeopleConifg, permission, reqConfig } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="有效单id">
              {getFieldDecorator('reqId', {
                initialValue: this.state.originValues?.reqId
              })(<Input placeholder="请输入有效单id" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="公司来源">
              {getFieldDecorator('sourceCompanyId', {
                initialValue: this.state.originValues?.sourceCompanyId
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear
                  onChange={this.companyChange}>
                  {
                    reqConfig.company ? reqConfig.company.map(item => (
                      <Option value={item.id}>{item.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="渠道">
              {getFieldDecorator('channel', {
                initialValue: this.state.originValues?.channel
              })(
                <Cascader
                  showSearch
                  style={{ width: '100%', }}
                  options={this.state.channelByCompany}
                  placeholder="请先选择公司"
                  changeOnSelect />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="划入时间">
              {getFieldDecorator('transfer_range_time', {
                initialValue: this.state.originValues?.transfer_range_time
              })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="最新服务时间">
              {getFieldDecorator('lastnew_service_range_time', {
                initialValue: this.state.originValues?.lastnew_service_range_time
              })(
                <RangePicker style={{ width: '100%' }} />
              )}

            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="跟进结果">
              {getFieldDecorator('followStatus', {
                initialValue: this.state.originValues?.followStatus
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    customerConfig.requirementFollowStatus ? customerConfig.requirementFollowStatus.map(status => (
                      <Option value={status.id}>{status.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8}>
            <FormItem label="客户姓名">
              {getFieldDecorator('customerName', {
                initialValue: this.state.originValues?.customerName
              })(<Input placeholder="请输入客户姓名" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="派发公司">
              {getFieldDecorator('allotCompanyId', {
                initialValue: this.state.originValues?.allotCompanyId
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {
                    reqConfig.company ? reqConfig.company.map(item => (
                      <Option value={item.id}>{item.name}</Option>)) : null
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="派发时间">
              {getFieldDecorator('allot_range_time', {
                initialValue: this.state.originValues?.allot_range_time
              })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={8} offset={16}>
            <div style={{ display: 'flex' }}>
              <Button style={{ marginLeft: 100, flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
              <Button id="fsubmit" type="primary" htmlType="submit" style={{ marginLeft: 20, flexGrow: 1 }}>筛选</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  renderDistribute = () => {
    let groupDisplay;
    let peopleDisplay;
    if (this.state.distributeType == 0) {
      groupDisplay = 'inline'
      peopleDisplay = 'none'
    } else {
      groupDisplay = 'none'
      peopleDisplay = 'inline'
    }
    const {
      qaManagementList: { distributeGroupConifg, distributePeopleConifg },
    } = this.props;
    return (
      <div>
        <div style={{ display: groupDisplay }}>
          <FormItem
            style={{ marginTop: '20px' }}
            label="组名"
            labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
            <Select
              mode="multiple"
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择组名"
              showSearch
              optionFilterProp="children"
              allowClear
              onChange={this.handleDistributeGroupChange}>
              {
                (distributeGroupConifg && distributeGroupConifg.length > 0) ?
                  distributeGroupConifg.map(config => (
                    <Option value={config.id}>{config.name}</Option>))
                  :
                  null
              }
            </Select>
          </FormItem>
          {
            this.state.distributeSelectGroup.length > 0 ?
              <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
                <Col span={12}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>组名</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>设置数量</div>
                </Col>
              </Row>
              :
              null
          }
          {
            this.renderDistributeGroupInput()
          }
        </div>
        <div style={{ display: peopleDisplay }}>
          <FormItem
            style={{ marginTop: '20px' }}
            label="人名"
            labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
            <Select
              mode="multiple"
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择人名"
              showSearch
              optionFilterProp="children"
              allowClear
              onChange={this.handleDistributePeopleChange}>
              {
                (distributePeopleConifg && distributePeopleConifg.length > 0) ?
                  distributePeopleConifg.map(config => (
                    <Option value={config.id}>{config.name}</Option>))
                  :
                  null
              }
            </Select>
          </FormItem>
          {
            this.state.distributeSelectPeople.length > 0 ?
              <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
                <Col span={12}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>人名</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>设置数量</div>
                </Col>
              </Row>
              :
              null
          }
          {
            this.renderDistributePeopleInput()
          }
        </div>
      </div>
    );
  }

  renderDistributeGroupInput = () => (
    this.state.distributeSelectGroup.length > 0 ?
      this.state.distributeSelectGroup.map((group, index) => (
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>{group.name}</div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              {this.renderDistributeGroupInputNumber(group)}
            </div>
          </Col>
        </Row>
      ))
      :
      null
  )

  renderDistributeGroupInputNumber = (configItem: ConfigItem) => {
    let defaultValue: number | undefined;
    if (this.state.distributeInputGroupMap.has(configItem.id)) {
      defaultValue = this.state.distributeInputGroupMap.get(configItem.id);
    }
    return (
      <InputNumber min={0} value={defaultValue} onChange={(value: number) => {
        if (this.state.distributeInputGroupMap.has(configItem.id)) {
          this.state.distributeInputGroupMap.set(configItem.id, value);
          let distributeInputGroupNum = 0;
          this.state.distributeInputGroupMap.forEach((value, key, map) => {
            distributeInputGroupNum += value;
          });
          this.setState({
            distributeInputGroupNum,
          })
        }
      }} />
    );
  }

  renderDistributePeopleInput = () => (
    this.state.distributeSelectPeople.length > 0 ?
      this.state.distributeSelectPeople.map(group => (
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>{group.name}</div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              {
                this.renderDistributePeopleInputNumber(group)
              }
            </div>
          </Col>
        </Row>
      ))
      :
      null
  )

  renderDistributePeopleInputNumber = (configItem: ConfigItem) => {
    let defaultValue: number | undefined;
    if (this.state.distributeInputPeopleMap.has(configItem.id)) {
      defaultValue = this.state.distributeInputPeopleMap.get(configItem.id);
    }
    return (
      <InputNumber min={0} value={defaultValue} onChange={(value: number) => {
        if (this.state.distributeInputPeopleMap.has(configItem.id)) {
          this.state.distributeInputPeopleMap.set(configItem.id, value);
          let distributeInputPeopleNum = 0;
          this.state.distributeInputPeopleMap.forEach((value, key, map) => {
            distributeInputPeopleNum += value;
          });
          this.setState({
            distributeInputPeopleNum,
          })
        }
      }} />
    );
  }

  reqOwnerClick = (e: RadioChangeEvent) => {
    this.reqOwner = e.target.value,
      this.handleFormReset();
  }
  // 信息变更
  informationChange = () => {
    this.setState({
      inforDiaglog: !this.state.inforDiaglog,
    });
  }
  inforDiaglogOk = () => {
    const { dispatch, qaManagementList: { customerConfig } } = this.props;
    const self = this;
    let inforChangeNum = [];
    if (this.state.selectedRows.length > 0) {
      inforChangeNum = this.state.selectedRows.map((item) => {
        return item.id
      });
      this.setState({
        inforChangeNum,
        inforDiaglog: !this.state.inforDiaglog,
      })
      inforChangeNum = inforChangeNum.join();
      let phase = !this.state.phaseChoice ? customerConfig.requirementPhase[0].id : this.state.phaseChoice;
      dispatch({
        type: 'qaManagementList/updateReqLiteCtrlReq',
        payload: { phase: phase, reqId: inforChangeNum },
        callback: function (data: any) {
          // console.log(data)
          if (data.code == 200) {
            message.success('变更成功');
            self.setState({
              selectedRows: [],
              phaseChoice: customerConfig.requirementPhase.length > 0 ? customerConfig.requirementPhase[0].id : this.state.phaseChoice
            }, () => {
              dispatch({
                type: 'qaManagementList/fetch',
                payload: self.state.formValues,
              });
            })
          }
        }
      });
    }
  }
  inforDiaglogCancel = () => {
    this.setState({
      inforDiaglog: !this.state.inforDiaglog
    })
  }

  inforRadioChange = (e) => {
    this.setState({
      phaseChoice: e.target.value
    })
  }

  render() {
    const {
      qaManagementList: { data, customerConfig, permission, statist, reqConfig },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper
        title={
          <div className={styles.titleWrapper}>
            <span className={styles.titleInfo}>今日待处理:{statist.all_invalid_total}</span>
            <span className={styles.titleInfo}>今日接收:{statist.today_receive_total}</span>
            <span className={styles.titleInfo}>今日已跟进:{statist.today_follow_total}</span>
            <span className={styles.titleInfo}>今日待定:{statist.today_undetermined_total}</span>
            <span className={styles.titleInfo}>今日无效数据:{statist.today_invalid_total}</span>
            <span className={styles.titleInfo}>今日激活数据:{statist.today_activation_total}</span>
          </div>
        }
        className={styles.innerHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <Divider />

            <MyTable
              loading={loading}
              rowKey='customer_id'
              data={data}
              columns={this.state.columnsData}
              onPaginationChanged={this.handleStandardTableChange}
              renderTopButtons={() => (
                <div style={{ display: 'flex', width: '100%' }}>
                  <Radio.Group defaultValue={1} buttonStyle="solid" onChange={this.handleLeadsStatus}>
                    {
                      reqConfig.phase && reqConfig.phase.map(item => (
                        <Radio.Button value={item.id}>{item.name}</Radio.Button>
                      ))
                    }
                  </Radio.Group >
                </div>
              )}
            />

            <Modal
              title="有效单分配"
              okText='确认分配'
              cancelText='取消分配'
              visible={this.state.modalVisible}
              onOk={this.handleDistributeOk}
              onCancel={this.handleDistributeCancel}
              destroyOnClose>
              <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.handleDistribute}>
                <Radio.Button value="0">分配组</Radio.Button>
                <Radio.Button value="1">分组人</Radio.Button>
              </Radio.Group>

              <div style={{
                marginTop: '20px', display: 'flex',
              }} >
                <div>总有效单数：{this.state.distributes.length}条</div>
                <div style={{
                  marginLeft: '10px'
                }}>|</div>
                <div style={{
                  marginLeft: '10px'
                }}>设置已分配：{this.state.distributeType == 0 ? this.state.distributeInputGroupNum : this.state.distributeInputPeopleNum} 条</div>
              </div>
              <div className={styles.distributeForm}>{this.renderDistribute()}</div>
            </Modal>
            <Modal
              title="变更有效单信息"
              okText='确定'
              cancelText='取消'
              visible={this.state.inforDiaglog}
              onOk={this.inforDiaglogOk}
              onCancel={this.inforDiaglogCancel}
              destroyOnClose>
              <div style={{ display: 'block' }}>
                <section style={{ display: 'flex' }}><div style={{ width: '80px' }}>本次已选择：</div><div>{this.state.selectedRows.length}</div>条有效单  </section>
                <section style={{ display: 'flex', marginTop: '10px' }}>
                  <div style={{ width: '80px' }}>更改状态：</div>
                  {customerConfig && customerConfig.requirementPhase && customerConfig.requirementPhase.length > 0 &&
                    <div>
                      <Radio.Group style={{ width: '100%' }} defaultValue={customerConfig?.requirementPhase[0]?.id} onChange={this.inforRadioChange}>
                        {
                          customerConfig?.requirementPhase.map(item => {

                            if (item.name == '全部') {
                              return ''
                            }
                            return <Radio value={item.id}>{item.name}</Radio>

                          })
                        }
                      </Radio.Group>
                    </div>
                  }
                </section>
              </div>
            </Modal>

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

class MyTable extends CrmStandardTable<TableListItem>{ }

class TableList1 extends Component<TableListProps, TableListState> {

  render() {
    return (
      <PageHeaderWrapper className={styles.outerHeader}>
        <KeepAlive>
          <TableList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}
export default Form.create<TableListProps>()(TableList1);
