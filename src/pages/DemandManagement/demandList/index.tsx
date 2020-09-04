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
import { TableListItem, TableListPagination } from './data';
import { StateType } from './model';
import getUserInfo from '@/utils/UserInfoStorage';
import { UserInfo } from '@/pages/user/login/data';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import NumberRangeInput from '@/components/NumberRangeInput';
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';
import InfoChangeModal from '@/components/InfoChangeModal';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    any
  >;
  loading: boolean;
  demandManagement: StateType;
}

interface TableListState {
  modalVisible: boolean;
  inforDiaglog: boolean;
  inforChangeNum: any;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  areaRest: boolean,
  budgetReset: boolean,
  tableReset: boolean,
  perReset: boolean,
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
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    demandManagement,
    loading,
  }: {
    demandManagement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    demandManagement,
    loading: loading.models.demandManagement,
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  reqStatus: any = '1';
  qtResult: any = '';
  /** 分配列表-分配状态 */
  isDistribute: 0 | 1 | undefined;

  saveParams: any;

  reqOwner: string = '1';

  qtCompany: string = '';

  companyId: string = '12' //有效单质检公司，默认到喜啦

  isDXLConfiged = false;

  currentUserInfo = CrmUtil.getUserInfo();
  /**  0我的有效单 1有效单质检 2全部有效单 */
  listType: 0 | 1 | 2 = window.location.href.indexOf("demandsQaList") >= 0 ? 1 : window.location.href.indexOf("demandListAll") >= 0 ? 2 : 0;

  constructor(props: TableListProps) {
    super(props);
  }

  infoChangeRef: any

  onInfoChangeRef = (ref: any) => {
    this.infoChangeRef = ref;
  }


  // getStandardTableColumnProps = (dataIndex?: string, title?: string): StandardTableColumnProps => {
  //   let columnProps: StandardTableColumnProps = {
  //     title: title,
  //     dataIndex: dataIndex,
  //   }
  //   if (dataIndex == 'req_num' || dataIndex == 'customer_name') {
  //     return {
  //       ...columnProps,
  //       render: (text, record) => (
  //         <Fragment>
  //           {
  //             record.status == '2' ? <div>{text}</div> :
  //               <a onClick={() => this.handleCustomerDetails(record)}>{text}</a>
  //           }
  //         </Fragment>
  //       )
  //     }
  //   } else if (dataIndex == 'city_info') {
  //     return {
  //       ...columnProps,
  //       render(location_city_info: any) {
  //         const { full } = location_city_info;
  //         return (
  //           <div>
  //             {full}
  //           </div>
  //         )
  //       }
  //     }
  //   } else if (dataIndex == 'follow_content') {
  //     return {
  //       ...columnProps,
  //       render: (text: any, recoder: TableListItem) => <div>
  //         {
  //           !recoder.follow_num ? '' : <div>{recoder.follow_num}次回访</div>
  //         }
  //         {
  //           !recoder.follow_content ? '' : <div>{recoder.follow_content}</div>
  //         }
  //       </div>
  //     }
  //   } else if (dataIndex == 'action') {
  //     return {
  //       ...columnProps,
  //       fixed: 'right',
  //       render: (text, record) => (
  //         <Fragment>
  //           <a onClick={() => this.handleCustomerDetails(record)}>{record.status == '2' ? '查看' : '跟进'}</a>
  //         </Fragment>
  //       )
  //     }
  //   }
  //   return columnProps
  // }

  getStandardTableColumnProps = (id: string, name: string, disable?: boolean) => {
    return {
      dataIndex: id,
      key: id,
      title: name,
      disableSelect: !!disable,
      render: id == 'req_num' || id == 'customer_name' ? (text: any, record: TableListItem) => {
        return (
          <Fragment>
            {
              record.status == '2' ? <div>{text}</div> :
                <a onClick={() => this.handleCustomerDetails(record)}>{text}</a>
            }
          </Fragment>
        )
      } : id == 'city_info' ? (text: any, record: TableListItem) => {
        return (
          <div>
            {
              text.full
            }
          </div>
        )
      } : id == 'follow_content' ? (text: any, record: TableListItem) => {
        return (
          <div>
            {
              !record.follow_num ? '' : <div>{record.follow_num}次回访</div>
            }
            {
              !record.follow_content ? '' : <div>{record.follow_content}</div>
            }
          </div>
        )
      } : undefined
    }
  }

  generateStandardTableColumnProps = (): CrmStandardTableColumnProps<TableListItem>[] => {
    let columns: CrmStandardTableColumnProps<TableListItem>[] = [];
    columns.push(this.getStandardTableColumnProps('group_customer_id', '集团客户ID'))
    columns.push(this.getStandardTableColumnProps('req_num', '有效单编号', true))
    columns.push(this.getStandardTableColumnProps('customer_name', '客户姓名', true))
    columns.push(this.getStandardTableColumnProps('qt_result_txt', '质检结果'))
    columns.push(this.getStandardTableColumnProps('qt_result_reason', '质检原因'))
    columns.push(this.getStandardTableColumnProps('qt_user_name', '质检人'))
    if (this.listType == 1) columns.push(this.getStandardTableColumnProps('bj_leads_follow_comment', '外部质检'))
    columns.push(this.getStandardTableColumnProps('phone', '客户电话', true))
    columns.push(this.getStandardTableColumnProps('wechat', '客户微信'))
    columns.push(this.getStandardTableColumnProps('customer_id', '客户编号'))
    columns.push(this.getStandardTableColumnProps('leads_id', '线索ID'))
    columns.push(this.getStandardTableColumnProps('follow_num', '客户来访次数'))
    columns.push(this.getStandardTableColumnProps('category_txt', '业务类型'))
    columns.push(this.getStandardTableColumnProps('level_txt', '有效单级别'))
    columns.push(this.getStandardTableColumnProps('city_info', '业务城市'))
    columns.push(this.getStandardTableColumnProps('is_arrival_txt', '是否到店'))
    columns.push(this.getStandardTableColumnProps('channel_txt', '客资来源'))
    columns.push(this.getStandardTableColumnProps('referrer_name', '推荐人'))
    columns.push(this.getStandardTableColumnProps('wedding_date', '婚期'))
    columns.push(this.getStandardTableColumnProps('wedding_date_tag', '婚期标识'))
    columns.push(this.getStandardTableColumnProps('per_budget', '餐标'))
    columns.push(this.getStandardTableColumnProps('budget', '预算'))
    columns.push(this.getStandardTableColumnProps('hotel', '酒店场地'))
    columns.push(this.getStandardTableColumnProps('hotel_tables', '桌数'))
    columns.push(this.getStandardTableColumnProps('phase_txt', '销售阶段'))
    columns.push(this.getStandardTableColumnProps('activity_name', '活动名称'))
    columns.push(this.getStandardTableColumnProps('user_name', '建单客服'))
    if (this.listType != 0) columns.push(this.getStandardTableColumnProps('create_time', '创建时间'))
    columns.push(this.getStandardTableColumnProps('allot_time', '划入时间'))
    columns.push(this.getStandardTableColumnProps('leads_owner_name', '负责客服'))
    columns.push(this.getStandardTableColumnProps('owner_name', '负责策划'))
    columns.push(this.getStandardTableColumnProps('next_contact_time', '下次回访时间'))
    columns.push(this.getStandardTableColumnProps('follow_time', '最新跟进时间'))
    columns.push(this.getStandardTableColumnProps('follow_tag_txt', CrmUtil.getCompanyType() == 1 ? '呼叫结果' : '跟进标签'))
    columns.push(this.getStandardTableColumnProps('follow_status_txt', '跟进结果'))
    columns.push(this.getStandardTableColumnProps('follow_content', '最新跟进记录'))
    columns.push(this.getStandardTableColumnProps('follow_user_name', '跟进人'))
    columns.push(this.getStandardTableColumnProps('remark', '备注'))
    if (this.listType != 1) {
      columns.push({
        title: '操作',
        fixed: 'right',
        render: (text: any, record: TableListItem) => {
          return (
            <Fragment>
              <a onClick={() => this.handleCustomerDetails(record)}>{record.status == '2' ? '查看' : '跟进'}</a>
            </Fragment>
          )
        }
      })
    }
    return columns;
  }

  columns: CrmStandardTableColumnProps<TableListItem>[] = this.generateStandardTableColumnProps();

  state: TableListState = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    areaRest: false,
    budgetReset: false,
    tableReset: false,
    perReset: false,
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
    phaseChoice: null
  };

  componentWillReceiveProps(nextProps: any) {
    var isRefresh = localStorage ? localStorage.getItem('demandListRefreshTag')?.toString() : '';
    if (isRefresh && isRefresh?.length > 0) {
      localStorage?.setItem('demandListRefreshTag', '')
      if (isRefresh == 'reset') {
        this.handleFormReset()
      } else if (isRefresh == 'list') {
        this.handleSearch(true)
      }
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    // 拉取配置信息
    dispatch({
      type: 'demandManagement/getConfigInfo',
    });
    // 拉取搜索组
    dispatch({
      type: 'demandManagement/getDistributeGroupConifgInfo',
    });
    // 拉取搜索用户
    dispatch({
      type: 'demandManagement/getDistributePeopleConifgInfo',
    });
    // 拉取状态配置信息
    dispatch({
      type: 'demandManagement/fetch',
      payload: {
        ...this.listTypeParams()
      }
    });
    dispatch({
      type: 'demandManagement/getUserPermissionList',
    });
  }

  handleStandardTableChange = (
    page: number, pageSize: number
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    // 状态
    const params = {
      ...formValues,
      ...this.listTypeParams(),
    };

    // 分页信息
    params.page = page;
    params.pageSize = pageSize;

    dispatch({
      type: 'demandManagement/fetch',
      payload: params,
    });
  };

  handleNewCustomer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demandManagement/newReq'
    });
  }

  handleLeadDetails = (record: any) => {
    if (record.customer_id == null) {
      message.error('跟进失败，客户id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'demandManagement/details',
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
    if (record.id == null) {
      message.error('跟进失败，有效单id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'demandManagement/customerDetails',
      payload: {
        listType: this.listType,
        reqId: record.id,
        customerId: record.customer_id,
        showStyle: 1,
        isQA: this.listType == 1,
        readOrWrite: this.listType == 1 ? 0 : 1,
        companyId: this.listType == 1 ? this.companyId : undefined,
      },
    })
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
    });

    const { form, dispatch } = this.props;
    // 表单重置
    form.resetFields();
    const that = this;
    this.setState({
      areaRest: true,
      budgetReset: true,
      tableReset: true,
      perReset: true,
    }, () => {
      that.state.areaRest = false
      that.state.budgetReset = false
      that.state.tableReset = false
      that.state.perReset = false
      // 状态
      const values = {
        ...this.listTypeParams(),
      };

      // 保存请求参数
      this.saveParams = {
        ...values,
      };
      // 取出分页信息
      const { demandManagement: { dataMy, dataQa, dataAll } } = this.props;
      let pagination = this.listType == 1 ? dataQa.pagination : this.listType == 2 ? dataAll.pagination : dataMy.pagination;
      if (pagination !== undefined) {
        values.page = 1;
        values.pageSize = pagination.pageSize;
      }
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'demandManagement/fetch',
        payload: values,
      });
    })
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleDistribute = (e: RadioChangeEvent) => {
    this.setState({
      distributeType: e.target.value,
    })
  }

  listTypeParams = () => {
    if (this.listType == 1) {  //有效单质检
      return {
        companyId: this.companyId,
        qtResult: this.qtResult,
        listType: this.listType,
      }
    } else if (this.listType == 2) {  //全部有效单
      return {
        isDistribute: this.isDistribute,
        listType: this.listType,
      }
    } else {  //我的有效单
      return {
        tab: this.reqOwner,
        phase: this.reqStatus,
        listType: this.listType,
      }
    }
  }

  handleLeadsStatus = (e: RadioChangeEvent) => {
    this.setState({
      selectedRows: [],
    });

    if (this.listType == 1) {
      this.qtResult = e.target.value
    } else if (this.listType == 2) {
      this.isDistribute = e.target.value;
    } else {
      this.reqStatus = e.target.value;
    }

    const { dispatch, form, } = this.props;
    const { formValues } = this.state;
    // 表单信息和状态
    const values = {
      ...formValues,
      ...this.listTypeParams()
    };

    // 保存请求参数
    this.saveParams = {
      ...values,
    };
    // 取出分页信息
    const { demandManagement: { dataQa, dataMy, dataAll } } = this.props;
    let pagination = this.listType == 1 ? dataQa.pagination : this.listType == 2 ? dataAll.pagination : dataMy.pagination;
    if (pagination !== undefined) {
      values.page = 1;
      values.pageSize = pagination.pageSize;
    }

    this.setState({
      formValues: values,
    });

    dispatch({
      type: 'demandManagement/fetch',
      payload: values,
    });
  };

  handleSearch = (refreshCurrentPage: boolean = false) => {
    this.setState({
      selectedRows: [],
    });

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        originValues: fieldsValue,
      })

      // 表单信息和状态
      const values = {
        ...fieldsValue,
        ...this.listTypeParams()
      };

      // 取出起始和结束时间
      const { transfer_range_time } = fieldsValue
      if (transfer_range_time !== undefined && transfer_range_time != '') {
        delete values.transfer_range_time
        values.createStartTime = moment(transfer_range_time[0]).format('YYYY-MM-DD');
        values.createEndTime = moment(transfer_range_time[1]).format('YYYY-MM-DD');
      }
      // 取出起始和结束时间
      const { lastnew_service_range_time } = fieldsValue
      if (lastnew_service_range_time !== undefined && lastnew_service_range_time != '') {
        delete values.lastnew_service_range_time
        values.followStartTime = moment(lastnew_service_range_time[0]).format('YYYY-MM-DD');
        values.followEndTime = moment(lastnew_service_range_time[1]).format('YYYY-MM-DD');
      }
      // 取出起始和结束时间
      const { follow_range_time } = fieldsValue
      if (follow_range_time !== undefined && follow_range_time != '') {
        delete values.follow_range_time
        values.nextContactStartTime = moment(follow_range_time[0]).format('YYYY-MM-DD');
        values.nextContactEndTime = moment(follow_range_time[1]).format('YYYY-MM-DD');
      }

      //取出起始和结束时间
      let date_range_time = fieldsValue['date_range_time']
      if (date_range_time !== undefined && date_range_time != '') {
        delete values['date_range_time']
        values['weddingStartTime'] = moment(date_range_time[0]).format('YYYY-MM-DD');
        values['weddingEndTime'] = moment(date_range_time[1]).format('YYYY-MM-DD');
      }

      //取出起始和结束时间
      let allot_range_time = fieldsValue['allot_range_time']
      if (allot_range_time !== undefined && allot_range_time != '') {
        delete values['allot_range_time']
        values['allotStartTime'] = moment(allot_range_time[0]).format('YYYY-MM-DD');
        values['allotEndTime'] = moment(allot_range_time[1]).format('YYYY-MM-DD');
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

      const reqUserId = fieldsValue['reqUserId']
      delete values['reqUserId']
      if (reqUserId !== undefined && reqUserId != '' && reqUserId.length > 0) {
        values['reqUserId'] = reqUserId + ''
      }

      const qtUserId = fieldsValue['qtUserId']
      delete values['qtUserId']
      if (qtUserId !== undefined && qtUserId != '' && qtUserId.length > 0) {
        values['qtUserId'] = qtUserId + ''
      }

      const ownerId = fieldsValue['ownerId']
      delete values['ownerId']
      if (ownerId !== undefined && ownerId != '' && ownerId.length > 0) {
        values['ownerId'] = ownerId + ''
      }

      const followStatus = fieldsValue['followStatus']
      delete values['followStatus']
      if (followStatus !== undefined && followStatus != '' && followStatus.length > 0) {
        values['followStatus'] = followStatus + ''
      }


      // 保存请求参数
      this.saveParams = {
        ...values,
      };
      // 取出分页信息
      const { demandManagement: { dataQa, dataMy, dataAll } } = this.props;
      let pagination = this.listType == 1 ? dataQa.pagination : this.listType == 2 ? dataAll.pagination : dataMy.pagination;
      if (pagination !== undefined) {
        if (refreshCurrentPage) {
          values.page = pagination.current;
          values.pageSize = pagination.pageSize;
        } else {
          values.pageSize = pagination.pageSize;
          values.page = 1;
        }
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'demandManagement/fetch',
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

  /** 批量分配 */
  handleAssigns = (dataList?: TableListItem[]) => {
    const distributes = dataList ?? this.state.selectedRows;
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
        type: 'demandManagement/leadsDistribute',
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
        type: 'demandManagement/leadsDistribute',
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

  //我的有效单显示颜色
  rowClassName = (recoder: TableListItem) => {
    if (this.listType != 0) return '';
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

  formCityCodes = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="业务城市">
      {getFieldDecorator('cityCode', {
        initialValue: this.state.originValues?.cityCode
      })(
        <CityMultipleSelect reset={this.state.areaRest} citySelectChange={this.areaSelectChange} />
      )}
    </FormItem>
  }

  formChannel = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="客资来源">
      {getFieldDecorator('channel', {
        initialValue: this.state.originValues?.channel
      })(
        <Cascader
          showSearch
          style={{ width: '100%', }}
          options={customerConfig.channel}
          changeOnSelect />
      )}
    </FormItem>
  }

  formCategory = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="业务品类">
      {getFieldDecorator('category', {
        initialValue: this.state.originValues?.category
      })(
        <Cascader
          placeholder="请选择"
          changeOnSelect
          style={{ width: '100%', }}
          options={customerConfig.category2} />
      )}
    </FormItem>
  }

  formCreateTime = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="创建时间">
      {getFieldDecorator('transfer_range_time', {
        initialValue: this.state.originValues?.transfer_range_time
      })(
        <RangePicker style={{ width: '100%' }} />
      )}
    </FormItem>
  }
  /**划入时间 */
  formAllotTime = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="划入时间">
      {getFieldDecorator('allot_range_time', {
        initialValue: this.state.originValues?.allot_range_time
      })(
        <RangePicker style={{ width: '100%' }} />
      )}
    </FormItem>
  }

  formLastServiceTime = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="最新服务时间">
      {getFieldDecorator('lastnew_service_range_time', {
        initialValue: this.state.originValues?.lastnew_service_range_time
      })(
        <RangePicker style={{ width: '100%' }} />
      )}
    </FormItem>
  }

  formTaskId = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="活动名称">
      {getFieldDecorator('activityId', {
        initialValue: this.state.originValues?.activityId
      })(
        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
          {
            customerConfig.activity ? customerConfig.activity.map(item => (
              <Option value={item.id}>{item.name}</Option>)) : null
          }
        </Select>,
      )}
    </FormItem>
  }

  formReqPhase = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    let reqPhase = customerConfig.requirementPhase ? customerConfig.requirementPhase.filter(value => value.id !== '') : []
    return <FormItem label="销售阶段">
      {getFieldDecorator('phase', {
        initialValue: this.state.originValues?.phase
      })(
        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
          {
            reqPhase.map(task => (
              <Option value={task.id}>{task.name}</Option>))
          }
        </Select>,
      )}
    </FormItem>
  }

  /** 质检结果 */
  formQtResult = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="质检结果">
      {getFieldDecorator('qtResult', {
        initialValue: this.state.originValues?.qtResult
      })(
        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
          {
            customerConfig.requirementQtResult ? customerConfig.requirementQtResult.map(task => (
              <Option value={task.id}>{task.name}</Option>)) : null
          }
        </Select>,
      )}
    </FormItem>
  }

  formFollowTag = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label={CrmUtil.getCompanyType() == 1 ? '呼叫结果' : '跟进标签'}>
      {getFieldDecorator('followTag', {
        initialValue: this.state.originValues?.followTag
      })(
        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
          {
            customerConfig.requirementFollowTag ? customerConfig.requirementFollowTag.map(followTag => (
              <Option value={followTag.id}>{followTag.name}</Option>)) : null
          }
        </Select>,
      )}
    </FormItem>
  }

  formFollowStatus = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="跟进结果">
      {getFieldDecorator('followStatus', {
        initialValue: this.state.originValues?.followStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            customerConfig.requirementFollowStatus ? customerConfig.requirementFollowStatus.map(status => (
              <Option value={status.id}>{status.name}</Option>)) : null
          }
        </Select>,
      )}
    </FormItem>
  }

  formCustomerName = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="客户姓名">
      {getFieldDecorator('customerName', {
        initialValue: this.state.originValues?.customerName
      })(<Input placeholder="请输入客户姓名" style={{ width: '100%' }} />)}
    </FormItem>
  }

  formCustomerWeChat = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="客户微信">
      {getFieldDecorator('customerWechat', {
        initialValue: this.state.originValues?.customerWechat
      })(<Input placeholder="请输入客户微信" style={{ width: '100%' }} />)}
    </FormItem>
  }

  formCustomerPhone = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="客户电话">
      {getFieldDecorator('customerPhone', {
        rules: [{ required: false, pattern: new RegExp(/^-?[0-9]*(\.[0-9]*)?$/, "g"), message: '请输入有效手机号码' }],
        getValueFromEvent: event => event.target.value.replace(/\D/g, ''),
        initialValue: this.state.originValues?.customerPhone
      })(<Input placeholder="请输入客户电话" maxLength={11} style={{ width: '100%' }} />)}
    </FormItem>
  }

  formCustomerId = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="客户编号">
      {getFieldDecorator('customerId', {
        initialValue: this.state.originValues?.customerId
      })(<Input placeholder="请输入客户编号" style={{ width: '100%' }} />)}
    </FormItem>
  }

  formWeddingDate = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="婚期">
      {getFieldDecorator('date_range_time', {
        initialValue: this.state.originValues?.date_range_time
      })(
        <RangePicker style={{ width: '100%' }} />
      )}
    </FormItem>
  }

  formWeddingDateTag = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="婚期标识">
      {getFieldDecorator('weddingDateTag', {
        initialValue: this.state.originValues?.weddingDateTag
      })(
        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
          {
            customerConfig.weddingDateTag && customerConfig.weddingDateTag.map(status => (
              <Option value={status.id}>{status.name}</Option>))
          }
        </Select>,
      )}
    </FormItem>
  }

  formFollowTime = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="回访时间">
      {getFieldDecorator('follow_range_time', {
        initialValue: this.state.originValues?.follow_range_time
      })(
        <RangePicker style={{ width: '100%' }} />
      )}
    </FormItem>
  }

  formLeadsId = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="线索ID">
      {getFieldDecorator('leadsId', {
        initialValue: this.state.originValues?.leadsId
      })(<Input placeholder="请输入线索ID" style={{ width: '100%' }} />)}
    </FormItem>
  }

  formReqNum = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="有效单编号">
      {getFieldDecorator('reqNum', {
        initialValue: this.state.originValues?.reqNum
      })(<Input placeholder="请输入有效单编号" style={{ width: '100%' }} />)}
    </FormItem>
  }

  formLevel = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="有效单级别">
      {getFieldDecorator('level', {
        initialValue: this.state.originValues?.level
      })(
        <Select placeholder="请选择" style={{ width: '100%' }}>
          {
            customerConfig.requirementLevel && customerConfig.requirementLevel.map(status => (
              <Option value={status.id}>{status.name}</Option>))
          }
        </Select>,
      )}
    </FormItem>
  }

  formOwnerId = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="负责策划">
      {getFieldDecorator('ownerId', { initialValue: this.state.originValues?.ownerId })(
        <Select
          mode="multiple"
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          placeholder="请选择策划"
          allowClear>
          {
            (distributePeopleConifg && distributePeopleConifg.length > 0) ?
              distributePeopleConifg.map(config => (
                <Option value={config.id}>{config.name}</Option>))
              :
              null
          }
        </Select>
      )}
    </FormItem>
  }

  formLeadsOwnerId = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="建单客服">
      {getFieldDecorator('reqUserId', { initialValue: this.state.originValues?.reqUserId, })(
        <Select
          mode="multiple"
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          placeholder="请选择建单客服"
          allowClear>
          {
            (distributePeopleConifg && distributePeopleConifg.length > 0) ?
              distributePeopleConifg.map(config => (
                <Option value={config.id}>{config.name}</Option>))
              :
              null
          }
        </Select>
      )}
    </FormItem>
  }

  formQaUserId = () => {
    const { getFieldDecorator } = this.props.form;
    const { customerConfig, distributePeopleConifg, permission } = this.props.demandManagement;
    return <FormItem label="质检人">
      {getFieldDecorator('qtUserId', { initialValue: this.state.originValues?.qtUserId, })(
        <Select
          mode="multiple"
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          placeholder="请选择质检人"
          allowClear>
          {
            (distributePeopleConifg && distributePeopleConifg.length > 0) ?
              distributePeopleConifg.map(config => (
                <Option value={config.id}>{config.name}</Option>))
              :
              null
          }
        </Select>
      )}
    </FormItem>
  }

  formOnceValid = () => {
    const { getFieldDecorator } = this.props.form;
    return <FormItem label="历史有效">
      {getFieldDecorator('onceValid', {
        initialValue: this.state.originValues?.onceValid
      })(
        <Select placeholder="请选择" style={{ width: '100%' }}>
          <Option value={1}>有效</Option>
        </Select>,
      )}
    </FormItem>
  }

  formBudget = () => {
    return <FormItem label='预算'>
      <NumberRangeInput style={{ width: '100%' }} myForm={this.props.form}
        minimumField={'budgetFrom'} maximumField={'budgetEnd'}
        minimumValue={this.state.originValues?.budgetFrom} maximumValue={this.state.originValues?.budgetEnd}
        reset={this.state.budgetReset} />
    </FormItem>
  }

  formTables = () => {
    return <FormItem label="桌数"  >
      <NumberRangeInput style={{ width: '100%' }} myForm={this.props.form}
        minimumField={'hotelTablesFrom'} maximumField={'hotelTablesEnd'}
        minimumValue={this.state.originValues?.hotelTablesFrom} maximumValue={this.state.originValues?.hotelTablesEnd}
        reset={this.state.tableReset} />
    </FormItem>
  }

  formNumberRangeInput = (title: string, formStartId: string, formEndId: string, stateReset: any) => {
    return <FormItem label={title}  >
      <NumberRangeInput style={{ width: '100%' }} myForm={this.props.form}
        minimumField={formStartId} maximumField={formEndId}
        minimumValue={this.state.originValues[formStartId]} maximumValue={this.state.originValues[formEndId]}
        reset={stateReset} />
    </FormItem>
  }

  formMultipleSelect = (title: string, formId: string, selectConfig: any) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originValues[formId]
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            selectConfig?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formInput = (title: string, formId: string) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originValues[formId]
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  renderFilterForm = () => {
    let list = [];
    list.push(this.formCustomerPhone())
    list.push(this.formCustomerWeChat())
    list.push(this.formCustomerName())
    list.push(this.formAllotTime())
    list.push(this.formLastServiceTime())
    list.push(this.formChannel())
    list.push(this.formInput('推荐人', 'referName'))
    list.push(this.formOwnerId())
    list.push(this.formLeadsOwnerId())
    list.push(this.formNumberRangeInput('餐标', 'perBudgetFrom', 'perBudgetEnd', this.state.perReset))
    list.push(this.formFollowStatus())
    list.push(this.formFollowTag()) // 跟进标签
    list.push(this.formCityCodes())
    list.push(this.formCategory())
    if (this.listType != 0) list.push(this.formCreateTime())
    list.push(this.formTaskId())
    list.push(this.formCustomerId())
    list.push(this.formWeddingDate())
    list.push(this.formWeddingDateTag())
    list.push(this.formFollowTime())
    list.push(this.formLeadsId())
    list.push(this.formReqNum())
    list.push(this.formLevel())
    if (CrmUtil.getCompanyType() == 2) list.push(this.formOnceValid());
    list.push(this.formBudget())
    list.push(this.formInput('酒店场地', 'hotel'))
    list.push(this.formTables())
    if (this.listType != 1) list.push(this.formQtResult())
    if (this.listType == 1 || this.listType == 2) list.push(this.formReqPhase())
    if (this.listType == 1 || this.listType == 2) list.push(this.formQaUserId())
    // list.push(this.formFilterButton())
    return list;
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
      demandManagement: { distributeGroupConifg, distributePeopleConifg },
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
    if (this.listType == 0) {
      this.reqOwner = e.target.value;
    } else if (this.listType == 1) {
      this.companyId = e.target.value;
    }
    this.handleFormReset();
  }
  // 信息变更
  informationChange = () => {
    this.setState({
      inforDiaglog: !this.state.inforDiaglog,
    });
  }
  inforDiaglogOk = () => {
    const { dispatch, demandManagement: { customerConfig } } = this.props;
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
        type: 'demandManagement/updateReqLiteCtrlReq',
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
                type: 'demandManagement/fetch',
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

  infoChangeCallBack = () => {
    const { dispatch } = this.props;
    this.setState({
      selectedRows: [],
    }, () => {
      dispatch({
        type: 'demandManagement/fetch',
        payload: {
          ...this.state.formValues,
          ...this.listTypeParams()
        }
      });
    })
  }

  render() {
    const {
      demandManagement: { dataQa, dataMy, dataAll, customerConfig, permission },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    let data = this.listType == 1 ? dataQa : this.listType == 2 ? dataAll : dataMy;
    var reqQtResult: any[] = []
    if (customerConfig.requirementQtResult && customerConfig.requirementQtResult.length > 0) {
      reqQtResult = [{ id: '', name: '全部' }, ...customerConfig.requirementQtResult]
    }
    return (
      <PageHeaderWrapper title={
        this.listType == 0 ? <Radio.Group buttonStyle="solid" defaultValue="1" onChange={this.reqOwnerClick}>
          <Radio.Button value="1">我的有效单</Radio.Button>
          <Radio.Button value="2">我协作的有效单</Radio.Button>
        </Radio.Group> :
          (this.listType == 1 && customerConfig.qtRequirementList) ? <Radio.Group buttonStyle="solid" defaultValue={12} onChange={this.reqOwnerClick}>
            {
              customerConfig.qtRequirementList?.map(item => <Radio.Button value={item.id}>{item.name}</Radio.Button>)
            }
          </Radio.Group> : ''
      } className={styles.innerHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderFilterForm()}</div> */}

            <CrmFilterForm
              expandable={true}
              retainFilterNumber={3}
              formItemList={this.renderFilterForm()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={() => this.handleSearch()}
            />

            <Divider />

            <MyTable
              rowKey="id"
              loading={loading}
              data={data}
              columns={this.columns}
              onPaginationChanged={this.handleStandardTableChange}
              columnsEditable={true}
              selecteMode={this.listType == 1 ? undefined : "checkbox"}
              selectedRows={selectedRows}
              onRowsSelectChanged={this.handleSelectRows}
              rowClassName={this.rowClassName}
              renderTopButtons={
                () => (
                  <div style={{ display: 'flex', width: '100%' }}>
                    {
                      this.listType == 2 && (
                        <Radio.Group style={{ flex: 1 }} defaultValue={undefined} buttonStyle="solid" onChange={this.handleLeadsStatus}>
                          <Radio.Button value={undefined} key={3}>全部</Radio.Button>
                          <Radio.Button value={0} key={0}>未分配</Radio.Button>
                          <Radio.Button value={1} key={1}>已分配</Radio.Button>
                        </Radio.Group >
                      )
                    }
                    {
                      this.listType == 1 && <Radio.Group defaultValue='' buttonStyle="solid" onChange={this.handleLeadsStatus}>
                        {
                          reqQtResult.map(item => (
                            <Radio.Button value={item.id}>{item.name}</Radio.Button>
                          ))
                        }
                      </Radio.Group >
                    }
                    {
                      this.listType == 0 && <Radio.Group defaultValue={1} buttonStyle="solid" onChange={this.handleLeadsStatus}>
                        {
                          customerConfig.requirementPhase?.map(item => (
                            <Radio.Button value={item.id}>{item.name}</Radio.Button>
                          ))
                        }
                      </Radio.Group >
                    }
                    <div style={{ flex: 1 }} />
                    {
                      this.listType != 1 && permission && permission.reqinformationchange == true && selectedRows.length > 0 &&
                      <Button style={{ marginLeft: '10px' }} onClick={() => this.infoChangeRef?.setModalVisible(true)}>信息变更</Button>
                    }
                    {
                      this.listType != 1 && permission && permission.piliangfenpeiyxd && selectedRows.length > 0 && (
                        <Button onClick={() => { this.handleAssigns() }} style={{ marginLeft: '10px' }}>批量分配</Button>
                      )
                    }
                    {this.listType == 2 && permission && permission.piliangfenpeiyxd &&
                      <Button style={{ marginLeft: 10 }} type="primary" onClick={() => this.handleAssigns(data.list)}>全部分配</Button>
                    }
                    <Button type="primary" style={{ marginLeft: '10px', display: "none" }} onClick={this.handleNewCustomer}><PlusOutlined />新建客资</Button>
                  </div>
                )
              }
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

            <InfoChangeModal type={2} onRef={this.onInfoChangeRef} selectedRows={selectedRows} configs={customerConfig?.requirementFollowStatus} callBackSuccess={() => this.infoChangeCallBack()} />

            {/* <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.state.columnsData}
              rowKey={(record, index) => index + ""}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowClassName={this.rowClassName}
            /> */}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

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
class MyTable extends CrmStandardTable<TableListItem>{ }
export default Form.create<TableListProps>()(TableList1);
