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
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination } from './data';
import styles from './style.less';
import AreaSelect from '@/components/AreaSelect';
import { RadioChangeEvent } from 'antd/lib/radio';
import CountDown from './components/CountDown';
import LOCAL from '@/utils/LocalStorageKeys';
import { ConfigItem } from '../leadsDetails/data';
import { SelectValue } from 'antd/lib/select';
import getUserInfo from '@/utils/UserInfoStorage';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import { ColumnProps } from 'antd/lib/table';
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';
import InfoChangeModal from '@/components/InfoChangeModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      // | 'leadManagementAndsearchAndLeadTableList/add'
      // | 'leadManagementAndsearchAndLeadTableList/fetch'
      // | 'leadManagementAndsearchAndLeadTableList/remove'
      // | 'leadManagementAndsearchAndLeadTableList/update'
      // | 'leadManagementAndsearchAndLeadTableList/newLeads'
      // | 'leadManagementAndsearchAndLeadTableList/details'
      // | 'leadManagementAndsearchAndLeadTableList/customerDetails'
      // | 'leadManagementAndsearchAndLeadTableList/getConfigInfo'
      // | 'leadManagementAndsearchAndLeadTableList/getLeadStatusConfigInfo'
      // | 'leadManagementAndsearchAndLeadTableList/getDistributeGroupConifgInfo'
      // | 'leadManagementAndsearchAndLeadTableList/getDistributePeopleConifgInfo'
      // | 'leadManagementAndsearchAndLeadTableList/leadsDistribute'
      any
    >
  >;
  loading: boolean;
  leadManagementAndsearchAndLeadTableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  areaRest: boolean,
  distributes: any[];
  distributeInputGroupNum: number,
  distributeInputPeopleNum: number,
  //0为组，1为人名，默认为0
  distributeType: number;
  distributeAll: boolean;
  distributeSelectGroup: ConfigItem[];
  distributeSelectPeople: ConfigItem[];
  distributeInputGroupMap: Map<string, number>;
  distributeInputPeopleMap: Map<string, number>;

  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    leadManagementAndsearchAndLeadTableList,
    loading,
  }: {
    leadManagementAndsearchAndLeadTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    leadManagementAndsearchAndLeadTableList,
    loading: loading.models.leadManagementAndsearchAndLeadTableList,
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
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    areaRest: false,
    distributes: [],
    distributeInputGroupNum: 0,
    distributeInputPeopleNum: 0,
    distributeType: 0,
    distributeAll: false,
    distributeSelectGroup: [],
    distributeSelectPeople: [],
    distributeInputGroupMap: new Map(),
    distributeInputPeopleMap: new Map(),

    originalFormValus: undefined,
  };

  infoChangeRef: any

  onInfoChangeRef = (ref: any) => {
    this.infoChangeRef = ref;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //拉取配置信息
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/getConfigInfo',
    });
    //拉取搜索组
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/getDistributeGroupConifgInfo',
    });
    //拉取搜索用户
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/getDistributePeopleConifgInfo',
    });
    //拉取状态配置信息
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/getLeadStatusConfigInfo',
      payload: {
        role: CrmUtil.getCompanyTag() == 'YNMT' ? '6' : '2',
      },
      callback: (response: any) => {
        if (response.code === 200) {
          const {
            leadManagementAndsearchAndLeadTableList: { leadStatusConfig }
          } = this.props;
          if (leadStatusConfig && leadStatusConfig.length > 0) {
            this.leadsStatus = leadStatusConfig[0].id;
            this.saveParams = { 'headerStatus': this.leadsStatus };
          }
          //拉取表单信息
          dispatch({
            type: 'leadManagementAndsearchAndLeadTableList/fetch',
            payload: {
              headerStatus: this.leadsStatus,
            },
          });
        }
      }
    });
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/getUserPermissionList',
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

  handlePaginationChanged = (
    page: number, pageSize: number
  ) => {

    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/fetch',
      payload: {
        ...formValues,
        headerStatus: this.leadsStatus,
        page,
        pageSize,
      },
    });
  };

  handleNewLeads = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/newLeads',
    })
  }

  handleLeadDetails = (record: any) => {
    if (record.customer_id == null) {
      message.error('跟进失败，客户id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/details',
      payload: {
        customerId: record.customer_id,
        leadId: record.id,
        categoryId: record.category_id,
        saveParams: this.saveParams,
        ownerId: record.owner_id,
      },
    })
  }

  handleCustomerDetails = (record: any) => {
    if (record.customer_id == null) {
      message.error('跟进失败，客户id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/customerDetails',
      payload: {
        customerId: record.customer_id,
      },
    })
  }

  areaSelectChange = (codes: string) => {
    const { form } = this.props
    form.setFieldsValue({
      'locationCityCode': codes + "",
    });
  }

  handleFormReset = () => {
    this.setState({
      selectedRows: [],
      originalFormValus: undefined,
    });

    const { form, dispatch } = this.props;
    //表单重置
    form.resetFields();
    const that = this;
    this.setState({
      areaRest: true,
    }, () => {
      that.state.areaRest = false
      //状态
      const values = {
        'headerStatus': this.leadsStatus,
      };
      //保存请求参数
      this.saveParams = {
        ...values,
      };
      //取出分页信息
      const { leadManagementAndsearchAndLeadTableList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        values['page'] = 1;
        values['pageSize'] = pagination.pageSize;
      }
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'leadManagementAndsearchAndLeadTableList/fetch',
        payload: values,
      });
      console.log(this.saveParams);
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

  handleLeadsStatus = (e: RadioChangeEvent) => {
    this.setState({
      selectedRows: [],
    });

    this.leadsStatus = e.target.value;
    const { dispatch, form, } = this.props;
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
    const { leadManagementAndsearchAndLeadTableList: { data } } = this.props;
    const { pagination } = data;
    if (pagination !== undefined) {
      values['page'] = 1;
      values['pageSize'] = pagination.pageSize;
    }

    this.setState({
      formValues: values,
    });

    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/fetch',
      payload: values,
    });
    console.log(this.saveParams);
  };

  handleSearch = () => {
    this.setState({
      selectedRows: [],
    });

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
      //跟进结果多选
      values['followStatus'] = values['followStatus']?.join(',')
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
      const { leadManagementAndsearchAndLeadTableList: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        // if (e == null) {
        //   values['page'] = pagination.current;
        //   values['pageSize'] = pagination.pageSize;
        // } else {
        values['page'] = 1;
        values['pageSize'] = pagination.pageSize;
        // }
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'leadManagementAndsearchAndLeadTableList/fetch',
        payload: values,
      });
      console.log(this.saveParams);
    });
  };

  handleAssign = (record: any) => {
    let distributes: any[] = [record];
    let data = {
      modalVisible: true,
      distributes: distributes,
    }
    this.restDistributeValues(data);
  }

  handleAssigns = () => {
    let distributes = this.state.selectedRows;
    let data = {
      modalVisible: true,
      distributes: distributes,
    }
    this.restDistributeValues(data);
  }

  handleAllAssigns = () => {
    let data = {
      modalVisible: true,
      distributeAll: true,
    }
    this.restDistributeValues(data);
  }

  handleDistributeOk = () => {
    const { leadManagementAndsearchAndLeadTableList: { data: { count } } } = this.props;
    let requestParams = {};
    if (this.state.distributeType == 0) {
      if (this.state.distributeInputGroupNum == 0) {
        message.error('请填写线索的分配数量');
        return
      }
      if (this.state.distributeInputGroupNum > (this.state.distributeAll ? count : this.state.distributes.length)) {
        message.error('填写的线索分配数量不能超过总线索数');
        return
      }
      //分配目标参数
      let groups: object[] = [];
      this.state.distributeInputGroupMap.forEach((value, key, map) => {
        if (value > 0) {
          const group = { id: key, num: value };
          groups.push(group);
        }
      });
      requestParams['groups'] = groups;
    } else {
      if (this.state.distributeInputPeopleNum == 0) {
        message.error('请填写线索的分配数量');
        return
      }
      if (this.state.distributeInputPeopleNum > (this.state.distributeAll ? count : this.state.distributes.length)) {
        message.error('填写的线索分配数量不能超过总线索数');
        return
      }
      //分配目标参数
      let owners: object[] = [];
      this.state.distributeInputPeopleMap.forEach((value, key, map) => {
        if (value > 0) {
          const owner = { id: key, num: value };
          owners.push(owner);
        }
      });
      requestParams['owners'] = owners;
    }
    //分配目标人
    if (this.state.distributeAll) {
      const { form } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
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
        requestParams = {
          ...requestParams,
          ...values,
        }
        this.requestDistribute(requestParams);
      });
    } else {
      let id: string = '';
      this.state.distributes.map((value, index) => {
        if (index == 0) {
          id = value.id;
        } else {
          id = id + ',' + value.id;
        }
      });
      requestParams['id'] = id;
      this.requestDistribute(requestParams);
    }
  }

  //分配线索
  requestDistribute = (params: any) => {
    const { dispatch, leadManagementAndsearchAndLeadTableList: { data: { count } } } = this.props;
    dispatch({
      type: 'leadManagementAndsearchAndLeadTableList/leadsDistribute',
      payload: {
        ...params,
        //线索分配列表
        searchSource: 2,
      },
      callback: (response: any) => {
        if (response.code === 200) {
          message.success('已成功分配' + (this.state.distributeAll ? count : this.state.distributeType == 0 ? this.state.distributeInputGroupNum : this.state.distributeInputPeopleNum) + '条线索');
          let data = {
            modalVisible: false,
            distributes: [],
            selectedRows: [],
            distributeAll: false,
          }
          this.restDistributeValues(data);
          document.getElementById('fsubmit')?.click();
        }
      }
    });
  }

  handleDistributeCancel = () => {
    let data = {
      modalVisible: false,
      distributes: [],
      distributeAll: false,
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
    let distributeSelectGroup: ConfigItem[] = [];
    let distributeInputGroupMap: Map<string, number> = new Map();
    let distributeInputGroupNum = 0;
    if (option && option.length > 0) {
      option.map(option => {
        const configItem: ConfigItem = { 'id': option.props.value, 'name': option.props.children }
        distributeSelectGroup.push(configItem)
        if (this.state.distributeInputGroupMap.has(option.props.value)) {
          distributeInputGroupMap.set(option.props.value, this.state.distributeInputGroupMap.get(option.props.value));
          distributeInputGroupNum = distributeInputGroupNum + this.state.distributeInputGroupMap.get(option.props.value);
        } else {
          distributeInputGroupMap.set(option.props.value, 0);
        }
      })
    }
    this.setState({
      distributeSelectGroup: distributeSelectGroup,
      distributeInputGroupMap: distributeInputGroupMap,
      distributeInputGroupNum: distributeInputGroupNum,
    });
  }

  handleDistributePeopleChange = (value: SelectValue[], option: React.ReactElement<any>[]) => {
    let distributeSelectPeople: ConfigItem[] = [];
    let distributeInputPeopleMap: Map<string, number> = new Map();
    let distributeInputPeopleNum = 0;
    if (option && option.length > 0) {
      option.map(option => {
        const configItem: ConfigItem = { 'id': option.props.value, 'name': option.props.children }
        distributeSelectPeople.push(configItem)
        if (this.state.distributeInputPeopleMap.has(option.props.value)) {
          distributeInputPeopleMap.set(option.props.value, this.state.distributeInputPeopleMap.get(option.props.value));
          distributeInputPeopleNum = distributeInputPeopleNum + this.state.distributeInputPeopleMap.get(option.props.value);
        } else {
          distributeInputPeopleMap.set(option.props.value, 0);
        }
      })
    }
    this.setState({
      distributeSelectPeople: distributeSelectPeople,
      distributeInputPeopleMap: distributeInputPeopleMap,
      distributeInputPeopleNum: distributeInputPeopleNum,
    });
  }

  createColums = (): CrmStandardTableColumnProps<TableListItem>[] => {
    const columns: CrmStandardTableColumnProps<TableListItem>[] = [];
    columns.push(this.createColum('集团客户ID', 'group_customer_id'));
    columns.push(this.createColum('线索ID', 'id'));
    columns.push(this.createColum('客户编号', 'customer_id'));
    columns.push(this.createColum('客户姓名', 'name', true));
    columns.push(this.createColum('客户电话', 'hide_phone', true));
    columns.push(this.createColum('业务类型', 'category'));
    columns.push(this.createColum('下次回访时间', 'follow_next'));
    columns.push(this.createColum('跟进历史', 'follow_status'));
    columns.push(this.createColum('最新服务时间', 'follow_newest'));
    if (CrmUtil.getCompanyType() == 1) {
      columns.push(this.createColum('关键词', 'utm_term'));
    }
    columns.push(this.createColum('负责客服', 'owner_name')); // 原“归属人”, 20200611改为“负责客服”-zhx
    if (CrmUtil.getCompanyType() == 1) {
      columns.push(this.createColum('推荐人', 'referrer_name'));
    } else if (CrmUtil.getCompanyType() == 2) {
      columns.push(this.createColum('提供人', 'record_user_name'));
    }
    columns.push(this.createColum('业务城市', 'location_city_info'));
    columns.push(this.createColum('客资来源', 'channel'));
    columns.push(this.createColum('划入时间', 'allot_time'));
    columns.push(this.createColum('线索状态', 'status'));
    columns.push(this.createColum('活动名称', 'activity_id'));
    if (CrmUtil.getCompanyType() == 2) {
      columns.push(this.createColum('到喜啦级别', 'level_txt'));
    }
    columns.push(this.createColum('客户微信', 'wechat'));
    columns.push(this.createColum('婚期', 'wedding_date'));
    columns.push(this.createColum('预算', 'budget'));
    columns.push(this.createColum('跟进人', 'follow_name'));
    columns.push(this.createColum('创建人', 'create_user'));
    columns.push(this.createColum('历史有效', 'valid_status'));
    columns.push(this.createColum('超时标识', 'timeout_status'));
    columns.push({
      title: '剩余时长',
      fixed: 'right',
      render: (text: any, record: TableListItem) => {
        return (
          <CountDown
            id={record.id}
            cdTime={record.follow_hour * 1000}
            statusNum={record.status_num}
          />
        )
      }
    });
    columns.push({
      title: '操作',
      fixed: 'right',
      render: (text: any, record: TableListItem) => {
        return (
          <Fragment>
            <a onClick={() => this.handleLeadDetails(record)}>跟进</a>
          </Fragment>
        )
      }
    })
    return columns;
  }

  createColum = (name: string, id: string, disable?: boolean) => {
    return {
      dataIndex: id,
      key: id,
      title: name,
      disableSelect: !!disable,
      render: id == 'id' ? (text: any, record: TableListItem) => {
        return (
          <Fragment>
            <a onClick={() => this.handleLeadDetails(record)}>{text}</a>
          </Fragment>
        )
      } : id == 'follow_status' ? (text: any, record: TableListItem) => {
        return (
          <div>
            {
              record.follow_num > 0 ? this.renderFollowHistoryNum(record.follow_num) : null
            }
            {text}
          </div>
        );
      } : id == 'location_city_info' ? (text: any, record: TableListItem) => {
        return (
          <div>
            {
              record.location_city_info.full
            }
          </div>
        )
      } : undefined
    }
  }

  // createColum = (title: string | React.ReactNode, dataIndex: string, fixed?: boolean | "right" | "left" | undefined): ColumnProps<TableListItem> => {
  //   const colum: ColumnProps<TableListItem> = {
  //     title,
  //     dataIndex,
  //     fixed,
  //   }
  //   if (dataIndex == 'id') {
  //     return {
  //       ...colum,
  //       render: (text: any, record: TableListItem) => {
  //         return (
  //           <Fragment>
  //             <a onClick={() => this.handleLeadDetails(record)}>{text}</a>
  //           </Fragment>
  //         )
  //       }
  //     }
  //   } else if (dataIndex == 'follow_status') {
  //     return {
  //       ...colum,
  //       render: (text: any, record: TableListItem) => {
  //         return (
  //           <div>
  //             {
  //               record.follow_num > 0 ? this.renderFollowHistoryNum(record.follow_num) : null
  //             }
  //             {text}
  //           </div>
  //         );
  //       }
  //     }
  //   } else if (dataIndex == 'location_city_info') {
  //     return {
  //       ...colum,
  //       render: (text: any, record: TableListItem) => {
  //         return (
  //           <div>
  //             {
  //               record.location_city_info.full
  //             }
  //           </div>
  //         )
  //       }
  //     }
  //   } else if (title == '剩余时长') {
  //     return {
  //       ...colum,
  //       render: (text: any, record: TableListItem) => {
  //         return (
  //           <CountDown
  //             id={record.id}
  //             cdTime={record.follow_hour * 1000}
  //             statusNum={record.status_num}
  //           />
  //         )
  //       }
  //     }
  //   } else if (title == '操作') {
  //     return {
  //       ...colum,
  //       render: (text: any, record: TableListItem) => {
  //         return (
  //           <Fragment>
  //             <a onClick={() => this.handleLeadDetails(record)}>跟进</a>
  //           </Fragment>
  //         )
  //       }
  //     }
  //   }
  //   return colum
  // }

  renderCity = (record: any) => {
    return (
      <div>
        {
          (record && record.city) ? record.city : null
        }
      </div>
    )
  }

  renderDistrict = (record: any) => {
    return (
      <div>
        {
          (record && record.district) ? '-' + record.district : null
        }
      </div>
    )
  }

  renderFollowHistoryNum = (followNum: number) => {
    return (
      <div>
        {
          '已服务（' + followNum + '）'
        }
        <br />
      </div>
    )
  }

  renderFilterForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { leadManagementAndsearchAndLeadTableList: { customerConfig, distributePeopleConifg, permission } } = this.props;
    const formItemList: JSX.Element[] = new Array();
    formItemList.push(
      <FormItem label="客户电话">
        {getFieldDecorator('mobile', {
          rules: [{ required: false, pattern: new RegExp(/^-?[0-9]*(\.[0-9]*)?$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
            return event.target.value.replace(/\D/g, '')
          },
          initialValue: this.state.originalFormValus?.mobile
        })(<Input maxLength={11} placeholder="请输入客户电话" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户微信">
        {getFieldDecorator('wechat', { initialValue: this.state.originalFormValus?.wechat })(<Input maxLength={20} placeholder="请输入客户微信" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户姓名">
        {getFieldDecorator('name', { initialValue: this.state.originalFormValus?.name })(<Input placeholder="请输入客户姓名" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="划入时间">
        {getFieldDecorator('transfer_range_time', { initialValue: this.state.originalFormValus?.transfer_range_time })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="最新服务时间">
        {getFieldDecorator('lastnew_service_range_time', { initialValue: this.state.originalFormValus?.lastnew_service_range_time })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客资来源">
        {getFieldDecorator('channel', { initialValue: this.state.originalFormValus?.channel })(
          <Cascader showSearch style={{ width: '100%', }} options={customerConfig.channel} changeOnSelect />
        )}
      </FormItem>
    );

    formItemList.push(
      <FormItem label="跟进结果">
        {getFieldDecorator('followStatus', { initialValue: this.state.originalFormValus?.followStatus })(
          <Select mode="multiple"
            showSearch
            optionFilterProp="children"
            placeholder="请选择"
            style={{ width: '100%' }}>
            {
              customerConfig.leadsFollowStatus ? customerConfig.leadsFollowStatus.map(leadsFollowStatus => (
                <Option value={leadsFollowStatus.id}>{leadsFollowStatus.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label={CrmUtil.getCompanyType() == 1 ? '呼叫结果' : '跟进标签'}>
        {getFieldDecorator('followTag', { initialValue: this.state.originalFormValus?.followTag })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              customerConfig.leadsFollowTag ? customerConfig.leadsFollowTag.map(followTag => (
                <Option value={followTag.id}>{followTag.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label='负责客服'>
        {getFieldDecorator('ownerIdStr', { initialValue: this.state.originalFormValus?.ownerIdStr })(
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="children"
            style={{ width: '100%' }}
            placeholder='请选择负责客服'>
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
    );
    formItemList.push(
      <FormItem label="业务城市">
        {getFieldDecorator('locationCityCode', { initialValue: this.state.originalFormValus?.locationCityCode })(<CityMultipleSelect citySelectChange={this.areaSelectChange} reset={this.state.areaRest} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="业务品类">
        {getFieldDecorator('category', { initialValue: this.state.originalFormValus?.category })(
          <Cascader showSearch style={{ width: '100%', }} options={customerConfig.category2} changeOnSelect />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="下次回访时间">
        {getFieldDecorator('next_service_range_time', { initialValue: this.state.originalFormValus?.next_service_range_time })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="活动名称">
        {getFieldDecorator('activityId', { initialValue: this.state.originalFormValus?.activityId })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              customerConfig.activity ? customerConfig.activity.map(activity => (
                <Option value={activity.id}>{activity.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );

    formItemList.push(
      <FormItem label="线索ID">
        {getFieldDecorator('id', { initialValue: this.state.originalFormValus?.id })(<Input placeholder="请输入线索ID" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="有效单编号">
        {getFieldDecorator('req_num', { initialValue: this.state.originalFormValus?.req_num })(<Input placeholder="请输入有效单编号" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户编号">
        {getFieldDecorator('customer_id', { initialValue: this.state.originalFormValus?.customer_id })(<Input maxLength={20} placeholder="请输入客户编号" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="婚期">
        {getFieldDecorator('wedding_date_time', { initialValue: this.state.originalFormValus?.wedding_date_time })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="婚期标识">
        {getFieldDecorator('weddingDateTag', { initialValue: this.state.originalFormValus?.weddingDateTag })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              customerConfig && customerConfig.weddingDateTag ? customerConfig.weddingDateTag.map(tag => (
                <Option value={tag.id}>{tag.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    if (CrmUtil.getCompanyType() == 2) {
      formItemList.push(
        <FormItem label='提供人'>
          {getFieldDecorator('recordUserId', { initialValue: this.state.originalFormValus?.recordUserId })(
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
              placeholder='请选择提供人'>
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
      );
      formItemList.push(
        <FormItem label="历史有效">
          {getFieldDecorator('validStatus', { initialValue: this.state.originalFormValus?.validStatus })(
            <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
              {
                customerConfig && customerConfig.validStatus ? customerConfig.validStatus.map(tag => (
                  <Option value={tag.id}>{tag.name}</Option>)) : null
              }
            </Select>,
          )}
        </FormItem>
      );
      formItemList.push(
        <FormItem label="超时状态">
          {getFieldDecorator('timeoutStatus', { initialValue: this.state.originalFormValus?.timeoutStatus })(
            <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
              {
                customerConfig && customerConfig.timeoutStatus ? customerConfig.timeoutStatus.map(tag => (
                  <Option value={tag.id}>{tag.name}</Option>)) : null
              }
            </Select>,
          )}
        </FormItem>
      );
      formItemList.push(
        <FormItem label="到喜啦级别">
          {getFieldDecorator('level', { initialValue: this.state.originalFormValus?.level })(
            <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
              {
                customerConfig && customerConfig.requirementLevel ? customerConfig.requirementLevel.map(tag => (
                  <Option value={tag.id}>{tag.name}</Option>)) : null
              }
            </Select>,
          )}
        </FormItem>
      );
    }
    return formItemList;
  }

  renderRadioGroup = () => {
    const {
      leadManagementAndsearchAndLeadTableList: { leadStatusConfig }
    } = this.props;
    return (
      <Radio.Group defaultValue={(leadStatusConfig && leadStatusConfig.length > 0) ? leadStatusConfig[0].id : undefined} buttonStyle="solid" onChange={this.handleLeadsStatus}>
        {
          (leadStatusConfig && leadStatusConfig.length > 0) ? leadStatusConfig.map(config => (
            <Radio.Button value={config.id}>{config.name}</Radio.Button>)) : null
        }
      </Radio.Group >
    );
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
      leadManagementAndsearchAndLeadTableList: { distributeGroupConifg, distributePeopleConifg },
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
              showSearch
              optionFilterProp="children"
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择组名"
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
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>组名</div>
                  }
                </Col>
                <Col span={12}>
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>设置数量</div>
                  }
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
              showSearch
              optionFilterProp="children"
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择人名"
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
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>人名</div>
                  }
                </Col>
                <Col span={12}>
                  {
                    <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>设置数量</div>
                  }
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

  renderDistributeGroupInput = () => {
    return (
      this.state.distributeSelectGroup.length > 0 ?
        this.state.distributeSelectGroup.map((group, index) => (
          <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>{group.name}</div>
              }
            </Col>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>
                  {this.renderDistributeGroupInputNumber(group)}
                </div>
              }
            </Col>
          </Row>
        ))
        :
        null
    );
  }

  renderDistributeGroupInputNumber = (configItem: ConfigItem) => {
    let defaultValue: number | undefined = undefined;
    if (this.state.distributeInputGroupMap.has(configItem.id)) {
      defaultValue = this.state.distributeInputGroupMap.get(configItem.id);
    }
    return (
      <InputNumber min={0} value={defaultValue} onChange={(value: number) => {
        if (this.state.distributeInputGroupMap.has(configItem.id)) {
          this.state.distributeInputGroupMap.set(configItem.id, value);
          let distributeInputGroupNum = 0;
          this.state.distributeInputGroupMap.forEach((value, key, map) => {
            distributeInputGroupNum = distributeInputGroupNum + value;
          });
          this.setState({
            distributeInputGroupNum: distributeInputGroupNum,
          })
        }
      }} />
    );
  }

  renderDistributePeopleInput = () => {
    return (
      this.state.distributeSelectPeople.length > 0 ?
        this.state.distributeSelectPeople.map(group => (
          <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>{group.name}</div>
              }
            </Col>
            <Col span={12}>
              {
                <div style={{ textAlign: 'center' }}>
                  {
                    this.renderDistributePeopleInputNumber(group)
                  }
                </div>
              }
            </Col>
          </Row>
        ))
        :
        null
    );
  }

  renderDistributePeopleInputNumber = (configItem: ConfigItem) => {
    let defaultValue: number | undefined = undefined;
    if (this.state.distributeInputPeopleMap.has(configItem.id)) {
      defaultValue = this.state.distributeInputPeopleMap.get(configItem.id);
    }
    return (
      <InputNumber min={0} value={defaultValue} onChange={(value: number) => {
        if (this.state.distributeInputPeopleMap.has(configItem.id)) {
          this.state.distributeInputPeopleMap.set(configItem.id, value);
          let distributeInputPeopleNum = 0;
          this.state.distributeInputPeopleMap.forEach((value, key, map) => {
            distributeInputPeopleNum = distributeInputPeopleNum + value;
          });
          this.setState({
            distributeInputPeopleNum: distributeInputPeopleNum,
          })
        }
      }} />
    );
  }

  rowClassName = (recoder: TableListItem, index: number) => {
    const {
      leadManagementAndsearchAndLeadTableList: { data }
    } = this.props;
    console.log(JSON.stringify(data))
    //1:未跟进、2:待回访、3:跟进中，4:已建需求单，5：退回公海，6：已建订单，7：已建合同，8：线索合并
    if (data && data.color_status == '1') {
      if (recoder.status_num == '1' && recoder.activity_id != '二次清洗') {
        return styles.lightRed
      }
      if (recoder.status_num == '4' && recoder.req_time_status) {
        return styles.lightGreen
      }
      if (recoder.status_num == '3' && recoder.follow_time_status) {
        return styles.lightGreen
      }
      if (recoder.status_num == '2' && recoder.callback_time_status) {
        return styles.lightYellow
      }
    }
    return '';
  }

  infoChangeCallBack = () => {
    const { dispatch } = this.props;
    this.setState({
      selectedRows: [],
    }, () => {
      dispatch({
        type: 'leadManagementAndsearchAndLeadTableList/fetch',
        payload: this.state.formValues,
      });
    })
  }


  // 信息变更 END
  render() {
    const {
      leadManagementAndsearchAndLeadTableList: { data, customerConfig, leadStatusConfig, permission },
      loading,
    } = this.props;
    const { count } = data;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className={styles.innerHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>

            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}

            <CrmFilterForm
              expandable={true}
              retainFilterNumber={3}
              formItemList={this.renderFilterForm()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={this.handleSearch}
            />

            <Divider />

            <MyTable
              rowKey="id"
              loading={loading}
              data={data}
              columns={this.createColums()}
              onPaginationChanged={this.handlePaginationChanged}
              columnsEditable={true}
              selecteMode="checkbox"
              selectedRows={selectedRows}
              onRowsSelectChanged={this.handleSelectRows}
              rowClassName={this.rowClassName}
              renderTopButtons={
                () => (
                  <div style={{ display: 'flex', width: '100%' }}>
                    {
                      (leadStatusConfig && leadStatusConfig.length > 0) ? this.renderRadioGroup() : null
                    }
                    <div style={{ flex: '1' }} />
                    {
                      selectedRows.length > 0 && permission && permission.leadsadapter_leadsinformationchange == true &&
                      <Button onClick={() => this.infoChangeRef?.setModalVisible(true)} style={{ marginLeft: '10px' }}>信息变更</Button>
                    }
                    {
                      selectedRows.length > 0 && permission && permission.pinliangfenpeixs == true &&
                      <Button onClick={this.handleAssigns} style={{ marginLeft: '10px' }}>批量分配</Button>
                    }
                    {
                      permission && permission.pinliangfenpeixs && data && data.list && data.list.length > 0 && <Button style={{ marginLeft: '10px' }} onClick={this.handleAllAssigns}>全部分配</Button>
                    }
                    <Button style={{ marginLeft: '10px' }} type="primary" icon='plus' onClick={this.handleNewLeads}>新建客资</Button>
                  </div>
                )
              }
            />

            <Modal
              title="线索分配"
              okText='确认分配'
              cancelText='取消分配'
              visible={this.state.modalVisible}
              onOk={this.handleDistributeOk}
              onCancel={this.handleDistributeCancel}
              destroyOnClose={true}>
              <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.handleDistribute}>
                <Radio.Button value="0">分配组</Radio.Button>
                <Radio.Button value="1">分组人</Radio.Button>
              </Radio.Group>

              <div style={{
                marginTop: '20px', display: 'flex',
              }} >
                <div>总线索数：{this.state.distributeAll ? count : this.state.distributes.length}条</div>
                <div style={{
                  marginLeft: '10px'
                }}>|</div>
                <div style={{
                  marginLeft: '10px'
                }}>设置已分配：{this.state.distributeType == 0 ? this.state.distributeInputGroupNum : this.state.distributeInputPeopleNum} 条</div>
              </div>
              {
                <div className={styles.distributeForm}>{this.renderDistribute()}</div>
              }
            </Modal>

            <InfoChangeModal type={1} onRef={this.onInfoChangeRef} selectedRows={selectedRows} configs={customerConfig?.leadsFollowStatus} callBackSuccess={() => this.infoChangeCallBack()} />

            {/* <StandardTable
              scroll={{ x: 'max-content' }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.createColums()}
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
