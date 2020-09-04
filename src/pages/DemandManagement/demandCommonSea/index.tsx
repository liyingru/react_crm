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
import { TableListPagination, RequestEntity } from './data';
import styles from './style.less';
import AreaSelect from '@/components/AreaSelect';
import { RadioChangeEvent } from 'antd/lib/radio';
import LOCAL from '@/utils/LocalStorageKeys';
import { SelectValue } from 'antd/lib/select';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';
import getUserInfo from '@/utils/UserInfoStorage';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';
import NumberRangeInput from '@/components/NumberRangeInput';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface DemandCommonSeaProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'demandCommonSeaModel/fetchList'
      | 'demandCommonSeaModel/customerDetails'
      | 'demandCommonSeaModel/getConfigInfo'
      | 'demandCommonSeaModel/getDistributeConifgInfos'
      | 'demandCommonSeaModel/doDistribute'
      | 'demandCommonSeaModel/getUserPermissionList'
      | 'demandCommonSeaModel/doClaim'
    >
  >;
  loading: boolean;
  demandCommonSeaModel: StateType;
}

interface DemandCommonSeaState {
  listType: 1 | 2 | 3; // 1：公海列表  2：死海列表  3：分配列表
  distributeModalVisible: boolean;
  selectedRows: RequestEntity[];
  formValues: { [key: string]: string };
  areaRest: boolean,
  distributes: any[];
  distributeInputGroupNum: number,
  distributeInputPeopleNum: number,
  //0为组，1为人名，默认为0
  distributeType: number;
  distributeSelectGroup: ConfigItem[];
  distributeSelectPeople: ConfigItem[];
  distributeInputGroupMap: Map<string, number>;
  distributeInputPeopleMap: Map<string, number>;
  // 原始数据展示
  originalFormValus: { [key: string]: string };

  budgetReset: boolean,
  tableReset: boolean,
  perReset:boolean,
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    demandCommonSeaModel,
    loading,
  }: {
    demandCommonSeaModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    demandCommonSeaModel,
    loading: loading.models.demandCommonSeaModel,
  }),
)

class DemandCommonSea extends Component<DemandCommonSeaProps, DemandCommonSeaState> {
  listType: 1 | 2 | 3 = 1;
  currentCategoryTabId: number = 0;
  isDistribute: 0 | 1 | undefined;
  currentUserInfo = CrmUtil.getUserInfo();
  companyType = CrmUtil.getCompanyType();

  saveParams: any;

  constructor(props: DemandCommonSeaProps) {
    super(props);
    this.listType = window.location.href.indexOf("DeadSea") >= 0 ? 2 : window.location.href.indexOf("Distribute") >= 0 ? 3 : 1;
  }

  state: DemandCommonSeaState = {
    listType: 1,
    distributeModalVisible: false,
    selectedRows: [],
    formValues: {},
    areaRest: false,
    distributes: [],
    distributeInputGroupNum: 0,
    distributeInputPeopleNum: 0,
    distributeType: 0,
    distributeSelectGroup: [],
    distributeSelectPeople: [],
    distributeInputGroupMap: new Map(),
    distributeInputPeopleMap: new Map(),
    originalFormValus: {},

    budgetReset: false,
    tableReset: false,
    perReset:false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.state.listType = this.listType;  // 无延迟
    //拉取配置信息
    dispatch({
      type: 'demandCommonSeaModel/getConfigInfo',
    });
    // 获取当前登录用户的各种权限
    dispatch({
      type: 'demandCommonSeaModel/getUserPermissionList',
    });
    //拉取有效单列表
    dispatch({
      type: 'demandCommonSeaModel/fetchList',
      payload: {
        page: 1,
        pageSize: 10,
        listType: this.listType
      }
    });
   
  }

  fetchListWithParams = (params: any, pagination?) => {
    const { dispatch } = this.props;
    if (this.state.listType == 1 || this.state.listType == 2) {
      // 品类tab
      params = {
        ...params,
        category: this.currentCategoryTabId
      }
    } else if (this.state.listType == 3) {
      // 品类tab
      params = {
        ...params,
        isDistribute: this.isDistribute
      }
    }

    //取出分页信息
    if (pagination) {
      params = {
        ...params,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
    } else {
      params = {
        ...params,
        page: 1,
        pageSize: 10
      }
    }

    dispatch({
      type: 'demandCommonSeaModel/fetchList',
      payload: {
        ...params,
        listType: this.listType
      },
    });

  }

  //  下一页，不需要重新处理form的参数
  handleStandardTableChange = (
    page: number, pageSize: number
  ) => {
    this.fetchListWithParams(this.state.formValues, {
      current: page, 
      pageSize
    });
  };

  handleSelectRows = (rows: RequestEntity[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleDemandDetails = (record: RequestEntity) => this.handleCustomerDetails(record, 1);

  handleCustomerDetails = (record: RequestEntity, isDemandDetail?: 0 | 1) => {
    if (record.customer_id == null) {
      message.error('客户id不能为空');
      return;
    }
    if (record.id == null) {
      message.error('有效单id不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'demandCommonSeaModel/customerDetails',
      payload: {
        reqId: record.id,
        customerId: record.customer_id,
        showStyle: isDemandDetail ? isDemandDetail : 0,
        listType: this.state.listType,
        readOrWrite: 0,
      },
    })
  }

  areaSelectChange = (codes: string[]) => {
    this.props.form.setFieldsValue({
      cityCode: codes + ""
    })
  }

  //  清空form参数
  handleFormReset = () => {
    this.setState({
      selectedRows: [],
    });

    const { form } = this.props;
    //表单重置
    form.resetFields();
    this.setState({
      areaRest: true,
      budgetReset: true,
      tableReset: true,
      perReset:true,
    }, () => {
      this.state.areaRest = false
      this.state.budgetReset = false
      this.state.tableReset = false
      this.state.perReset = false
      //保存form表单的参数
      this.saveParams = {};
      this.setState({
        formValues: {},
        originalFormValus: {},
      });

      this.fetchListWithParams(this.saveParams);
    })
  };

  handleChangeTab = (e: RadioChangeEvent) => {
    // 清空选中项
    this.setState({
      selectedRows: [],
    });
    if (this.state.listType == 1 || this.state.listType == 2) {
      // tab参数-公海、死海列表
      this.currentCategoryTabId = e.target.value;
    } else if (this.state.listType == 3) {
      // tab 参数-分配列表
      this.isDistribute = e.target.value;
    }
    this.fetchListWithParams(this.state.formValues);
  };

  handleFilter = () => {

    this.setState({
      selectedRows: [],
    });
    const { form } = this.props;
    // 处理form表单中的不规则参数
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        originalFormValus: fieldsValue,
      })

      //表单信息和状态
      let params = {
        ...fieldsValue,
      };

      //取出起始和结束时间
      const create_range_time = fieldsValue['create_range_time']
      if (create_range_time !== undefined && create_range_time != '') {
        delete params['create_range_time'];
        params = {
          ...params,
          createStartTime: moment(create_range_time[0]).format('YYYY-MM-DD'),
          createEndTime: moment(create_range_time[1]).format('YYYY-MM-DD')
        }
      }
      //取出起始和结束时间
      const follow_range_time = fieldsValue['follow_range_time']
      if (follow_range_time !== undefined && follow_range_time != '') {
        delete params['follow_range_time'];
        params = {
          ...params,
          followStartTime: moment(follow_range_time[0]).format('YYYY-MM-DD'),
          followEndTime: moment(follow_range_time[1]).format('YYYY-MM-DD')
        }
      }

      //取出起始和结束时间
      const wedding_range_time = fieldsValue['wedding_range_time']
      if (wedding_range_time !== undefined && wedding_range_time != '') {
        delete params['wedding_range_time'];
        params = {
          ...params,
          weddingStartTime: moment(wedding_range_time[0]).format('YYYY-MM-DD'),
          weddingEndTime: moment(wedding_range_time[1]).format('YYYY-MM-DD')
        }
      }

      // 处理多级渠道来源
      const channelArr = fieldsValue['channel']
      if (channelArr) {
        delete params['channel'];
        if (channelArr.length > 0) {
          params = {
            ...params,
            channel: channelArr[channelArr.length - 1],
          }
        }
      }
      //  处理多级业务品类
      const categoryArr = fieldsValue['category']
      if (categoryArr) {
        delete params['category']
        if (categoryArr.length > 0) {
          params = {
            ...params,
            category: categoryArr[categoryArr.length - 1],
          }
        }
      }

      const followStatus = fieldsValue['followStatus']
      delete params['followStatus']
      if (followStatus !== undefined && followStatus != '' && followStatus.length > 0) {
        params['followStatus'] = followStatus + ''
      }

      //保存form里的参数
      this.saveParams = params;
      const formValues = params;
      this.setState({
        formValues,
      });


      // 请求
      this.fetchListWithParams(formValues);
    });
  };

  //认领
  handleClaim = (records: RequestEntity[]) => {
    let ids = "";
    if(records.length > 1) {
      const idArray = records.flatMap(item=>item.id);
      ids = idArray.join(',');
    } else {
      ids = records[0].id;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'demandCommonSeaModel/doClaim',
      payload: {
        id: ids
      },
      callback: (success:boolean) => {
        if(success) {
          message.success("成功认领有效单");
          //  重新刷新列表
          document.getElementById('fsubmit')?.click();
        }
      }
    })
  }

  // 分配
  handleDistribute = (e: RadioChangeEvent) => {
    this.setState({
      distributeType: e.target.value,
    })
  }


  /**
   * 弹出分配窗口前，先检查分配的配置项
   */
  preAssign = (assignFunction: (records: any[]) => void, records: any[]) => {
    const { demandCommonSeaModel: { distributeConfig } } = this.props;
    if (distributeConfig && distributeConfig.groupConfig && distributeConfig.stuffConfig) {
      assignFunction(records);
    } else {
      const { dispatch } = this.props;
      //拉取分配有效单配置项
      dispatch({
        type: 'demandCommonSeaModel/getDistributeConifgInfos',
        payload: {
          groupPayload: undefined,
          stuffPayload: undefined
        },
        callback: (success: boolean, distributeConfig: { groupConfig: ConfigItem[], stuffConfig: ConfigItem[] }) => {
          if (success) {
            assignFunction(records);
          }
        }
      });
    }

  }

  handleAssignDemands = (items: RequestEntity[]) => {
    //let distributes = this.state.selectedRows;
    let data = {
      distributeModalVisible: true,
      distributes: items,
    }
    this.restDistributeValues(data);
  }

  /**
   * 确定分配按钮
   */
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
          id = id + ',' + value.id;
        }
      });
      let groups: object[] = [];
      this.state.distributeInputGroupMap.forEach((value, key, map) => {
        if (value > 0) {
          const group = { id: key, num: value };
          groups.push(group);
        }
      });
      //分配有效单
      dispatch({
        type: 'demandCommonSeaModel/doDistribute',
        payload: {
          reqId: id,
          groups: groups,
        },
        callback: (success: boolean, msg: string) => {
          if (success) {
            message.success('已成功分配' + this.state.distributeInputGroupNum + '条有效单');
            let data = {
              distributeModalVisible: false,
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
          id = id + ',' + value.id;
        }
      });
      let owners: object[] = [];
      this.state.distributeInputPeopleMap.forEach((value, key, map) => {
        if (value > 0) {
          const owner = { id: key, num: value };
          owners.push(owner);
        }
      });
      //分配有效单
      dispatch({
        type: 'demandCommonSeaModel/doDistribute',
        payload: {
          reqId: id,
          owners: owners,
        },
        callback: (success: boolean, msg: string) => {
          if (success) {
            message.success('已成功分配' + this.state.distributeInputPeopleNum + '条有效单');
            let data = {
              distributeModalVisible: false,
              distributes: [],
              selectedRows: []
            }
            this.restDistributeValues(data);
            //  重新刷新列表
            document.getElementById('fsubmit')?.click();
          }
        }
      });
    }
  }

  handleDistributeCancel = () => {
    let data = {
      distributeModalVisible: false,
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

  columns: CrmStandardTableColumnProps<RequestEntity>[] = [
    {
      title: '集团客户ID',
      dataIndex: 'group_customer_id',
    },
    {
      title: '有效单编号',
      dataIndex: 'req_num',
      disableSelect: true,
      render: (text: string, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleDemandDetails(record)}>{text}</a>
          </Fragment>
        )
      }
    },
    {
      title: '客户姓名',
      disableSelect: true,
      dataIndex: 'customer_name',
      render: (text: string, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleCustomerDetails(record, 0)}>{text}</a>
          </Fragment>
        )
      }
    },
    {
      title: '客户电话',
      dataIndex: 'phone',
      disableSelect: true,
    },
    {
      title: '客户微信',
      dataIndex: 'wechat',
    },
    {
      title: '客户编号',
      dataIndex: 'customer_id',
    },
    {
      title: '客户来访次数',
      dataIndex: 'visit_count',
    },
    {
      title: '业务类型',
      dataIndex: 'category_txt',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      render(location_city_info: any) {
        const { full } = location_city_info;
        return (
          <div>
            {
              full
            }
          </div>
        )
      },
    },
    {
      title: '客资来源',
      dataIndex: 'customer_channel_txt',
    },
    {
      title: '推荐人',
      dataIndex: 'referrer_name',
    },
    {
      title: '婚期',
      dataIndex: 'wedding_date',
    },
    {
      title: '婚期标识',
      dataIndex: 'wedding_date_tag',
    },
    {
      title: '餐标',
      dataIndex: 'per_budget',
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '酒店场地',
      dataIndex: 'hotel',
    },
    {
      title: '桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '有效单状态',
      dataIndex: 'status_txt',
    },
    {
      title: '活动名称',
      dataIndex: 'activity_name',
    },
    {
      title: '建单客服',
      dataIndex: 'user_name',
    },
    {
      title: '划入时间',
      dataIndex: 'allot_time',
    },
    {
      title: '最新跟进时间',
      dataIndex: 'follow_time',
    },
    {
      title: CrmUtil.getCompanyType() == 1 ? '呼叫结果' : '跟进标签',
      dataIndex: 'follow_tag_txt'
    },
    {
      title: '跟进结果',
      dataIndex: 'follow_status_txt',
    },
    {
      title: '最新跟进记录',
      dataIndex: 'follow_content',
      render: (text: any, recoder: RequestEntity) => {
        return <div>
          {
            !recoder.follow_num ? '' : <div>{recoder.follow_num}次回访</div>
          }
          {
            !recoder.follow_content ? '' : <div>{recoder.follow_content}</div>
          }
        </div>
      }
    },
    {
      title: '跟进次数',
      dataIndex: 'follow_num',
    },
    {
      title: '上次归属人',
      dataIndex: 'once_owner_name',
    },
    {
      title: '操作',
      fixed: 'right',
      render: (text, record) => {
        // 是否有分配有效单的权限
        const { permission } = this.props.demandCommonSeaModel;
        const requirementadapter_distribute = permission ? permission.requirementadapter_distribute : false;
        return (
          <div>
            {
              this.companyType == 3 || this.companyType == 5  && (
                <Fragment>
                  <a onClick={() => this.handleClaim([record])}>认领</a>
                </Fragment>
            )}
            {
              this.companyType == 3 || this.companyType == 5 && requirementadapter_distribute && (
                <Divider type="vertical"></Divider>
            )}
            {
              requirementadapter_distribute && (
              <Fragment>
                <a onClick={() => this.preAssign(this.handleAssignDemands, [record])}>{this.state.listType == 2 || record.allot_time ? "重新" : ""}分配</a>
              </Fragment>
            )}
          </div>
        );
      }
    },
  ];

  formNumberRangeInput = (title:string,formStartId:string,formEndId:string,stateReset:any) => {
    return <FormItem label={title}  >
      <NumberRangeInput style={{ width: '100%' }} myForm={this.props.form}
        minimumField={formStartId} maximumField={formEndId}
        minimumValue={this.state.originalFormValus[formStartId]} maximumValue={this.state.originalFormValus[formEndId]}
        reset={stateReset} />
    </FormItem>
  }

  formMultipleSelect = (title:string,formId:string,selectConfig:any) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originalFormValus[formId]
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

  formInput = (title:string,formId:string) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originalFormValus[formId]
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  /**
   * 筛选条件区域
   */
  renderFilterForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { demandCommonSeaModel: { commonConfig } } = this.props;
    const formItemList: JSX.Element[] = new Array();
    formItemList.push(
      <FormItem label="客户电话">
        {getFieldDecorator('customerPhone', {
          initialValue: this.state.originalFormValus?.customerPhone,
          rules: [{ required: false, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
            return event.target.value.replace(/\D/g, '')
          },
        })(<Input placeholder="请输入客户电话" maxLength={11} style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户微信">
        {getFieldDecorator('customerWechat', { initialValue: this.state.originalFormValus?.customerWechat })(<Input placeholder="请输入客户微信" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户姓名">
        {getFieldDecorator('customerName', { initialValue: this.state.originalFormValus?.customerName })(<Input placeholder="请输入客户姓名" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="创建时间">
        {getFieldDecorator('create_range_time', { initialValue: this.state.originalFormValus?.create_range_time })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="最新服务时间">
        {getFieldDecorator('follow_range_time', { initialValue: this.state.originalFormValus?.follow_range_time })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客资来源">
        {getFieldDecorator('channel', { initialValue: this.state.originalFormValus?.channel })(
          <Cascader showSearch style={{ width: '100%', }} options={commonConfig?.channel} changeOnSelect/>
        )}
      </FormItem>
    );
    formItemList.push(this.formInput('推荐人','referName'))
    formItemList.push(
      <FormItem label="跟进结果">
        {getFieldDecorator('followStatus', { initialValue: this.state.originalFormValus?.followStatus })(
          <Select 
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
            {
              commonConfig?.requirementFollowStatus ? commonConfig?.requirementFollowStatus.map(status => (
                <Option value={status.id} key={status.id} >{status.name}</Option>)) : null
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
              commonConfig?.requirementFollowTag ? commonConfig?.requirementFollowTag.map(followTag => (
                <Option value={followTag.id} key={followTag.id}>{followTag.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="业务城市">
        {getFieldDecorator('cityCode', { initialValue: this.state.originalFormValus?.cityCode })(
            <CityMultipleSelect reset={this.state.areaRest} citySelectChange={this.areaSelectChange} />
          )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="业务品类">
        {getFieldDecorator('category', { initialValue: this.state.originalFormValus?.category })(
          <Cascader
            placeholder="请选择"
            changeOnSelect
            style={{ width: '100%', }}
            options={commonConfig?.category2}
          />
        )}
      </FormItem>
    ); 
    formItemList.push(
      <FormItem label="销售阶段">
        {getFieldDecorator('phase', { initialValue: this.state.originalFormValus?.phase })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              commonConfig?.requirementPhase ? commonConfig?.requirementPhase.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="活动名称">
        {getFieldDecorator('activityId', { initialValue: this.state.originalFormValus?.activityId })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              commonConfig?.activity ? commonConfig?.activity.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="有效单编号">
        {getFieldDecorator('reqNum', { initialValue: this.state.originalFormValus?.reqId })(<Input placeholder="请输入有效单编号" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="线索id">
        {getFieldDecorator('leadsId', { initialValue: this.state.originalFormValus?.leadsId })(<Input placeholder="请输入线索id" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户编号">
        {getFieldDecorator('customerId', { initialValue: this.state.originalFormValus?.customerId })(<Input placeholder="请输入客户编号" style={{ width: '100%' }} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="婚期">
        {getFieldDecorator('wedding_range_time', { initialValue: this.state.originalFormValus?.wedding_range_time })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="婚期标识">
        {getFieldDecorator('weddingDateTag', { initialValue: this.state.originalFormValus?.weddingDateTag })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              commonConfig?.weddingDateTag ? commonConfig?.weddingDateTag.map(status => (
                <Option value={status.id} key={status.id} >{status.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="有效单级别">
        {getFieldDecorator('level', {
          initialValue: this.state.originalFormValus?.level
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {
              commonConfig?.requirementLevel && commonConfig.requirementLevel.map(status => (
                <Option value={status.id} key={status.id} >{status.name}</Option>))
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(this.formNumberRangeInput('桌数','hotelTablesFrom','hotelTablesEnd',this.state.tableReset))
    formItemList.push(this.formInput('酒店场地','hotel'))
    formItemList.push(this.formNumberRangeInput('餐标','perBudgetFrom','perBudgetEnd',this.state.perReset))
    formItemList.push(this.formNumberRangeInput('预算','budgetFrom','budgetEnd',this.state.budgetReset))
    return formItemList;
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
      demandCommonSeaModel: { distributeConfig },
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
                (distributeConfig && distributeConfig.groupConfig && distributeConfig.groupConfig.length > 0) ?
                  distributeConfig.groupConfig.map(config => (
                    <Option value={config.id} key={config.id}>{config.name}</Option>))
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
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择人名"
              showSearch
              optionFilterProp="children"
              allowClear
              onChange={this.handleDistributePeopleChange}>
              {
                (distributeConfig && distributeConfig.stuffConfig && distributeConfig.stuffConfig.length > 0) ?
                  distributeConfig.stuffConfig.map(config => (
                    <Option value={config.id} key={config.id}>{config.name}</Option>))
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
      this.state.distributeSelectPeople.length > 0 &&
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

  render() {
    const { listType } = this.state;
    return listType == 1 ? this.renderContent() : listType == 2 ? this.renderContent() : this.renderContent();
  }

  renderContent() {
    const { listType } = this.state;
    const data = listType == 1 ? this.props.demandCommonSeaModel.data1 : listType == 2 ? this.props.demandCommonSeaModel.data2 : this.props.demandCommonSeaModel.data3;
    const head = listType == 1 ? this.props.demandCommonSeaModel.head1 : listType == 2 ? this.props.demandCommonSeaModel.head2 : this.props.demandCommonSeaModel.head3;
    const { selectedRows } = this.state;
    const {
      loading,
    } = this.props;
    // 查找是否有分配权限
    const { permission } = this.props.demandCommonSeaModel;
    const requirementadapter_distribute = permission ? permission.requirementadapter_distribute : false;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>

            <CrmFilterForm 
              expandable={true}
              retainFilterNumber={3}
              formItemList={this.renderFilterForm()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={this.handleFilter}
              />
            <Divider />

            <MyTable
              rowKey="id"
              loading={loading}
              data={data}
              columns={this.columns}
              onPaginationChanged={this.handleStandardTableChange}
              columnsEditable={true}
              selecteMode={this.companyType==3 || requirementadapter_distribute ? 'checkbox' : undefined}
              selectedRows={selectedRows}
              onRowsSelectChanged={this.handleSelectRows}
              renderTopButtons={
                  () => (
                    <div style={{ display: 'flex', width: '100%' }}>
                      {
                        (listType == 1 || listType == 2) && head && head.length > 0 && (
                          <Radio.Group style={{ flex: 1 }} defaultValue={head[0].id} buttonStyle="solid" onChange={this.handleChangeTab}>
                            {
                              head.map(item => (<Radio.Button value={item.id} key={item.id}>{item.name}（{item.num}）</Radio.Button>))
                            }
                          </Radio.Group >
                        )
                      }
                      {
                        listType == 3 && (
                          <Radio.Group style={{ flex: 1 }} defaultValue={undefined} buttonStyle="solid" onChange={this.handleChangeTab}>
                            <Radio.Button value={undefined} key={3}>全部</Radio.Button>
                            <Radio.Button value={0} key={0}>未分配</Radio.Button>
                            <Radio.Button value={1} key={1}>已分配</Radio.Button>
                          </Radio.Group >
                        )
                      }
                      { this.companyType == 3 || this.companyType == 5 && selectedRows.length > 0 ?
                        <Button onClick={() => this.handleClaim(this.state.selectedRows)}>批量认领</Button>
                        :
                        null}
                      { requirementadapter_distribute && selectedRows.length > 0 ?
                        <Button onClick={() => this.preAssign(this.handleAssignDemands, this.state.selectedRows)} style={{marginLeft:10}}>批量分配</Button>
                        :
                        null}
                      {listType == 3 &&
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={() => this.preAssign(this.handleAssignDemands, data.list)}>全部分配</Button>
                      }
                    </div>
                  )
                }
              />

            {/* <StandardTable
              checkable={this.companyType==3 || requirementadapter_distribute}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              rowKey={(record,index) => index+""}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /> */}
          </div>
        </Card>
        <Modal
          title="有效单分配"
          okText='确认分配'
          cancelText='取消分配'
          visible={this.state.distributeModalVisible}
          onOk={this.handleDistributeOk}
          onCancel={this.handleDistributeCancel}
          destroyOnClose={true}>
          <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.handleDistribute}>
            <Radio.Button value="0" key={0}>分配组</Radio.Button>
            <Radio.Button value="1" key={1}>分组人</Radio.Button>
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
          {
            <div className={styles.distributeForm}>{this.renderDistribute()}</div>
          }
        </Modal>
      </div>
    );
  }
}



class TableList1 extends Component<DemandCommonSeaProps, DemandCommonSeaState> {

  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <DemandCommonSea {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }
}
class MyTable extends CrmStandardTable<RequestEntity>{ }
export default Form.create<DemandCommonSeaProps>()(TableList1);

// export default Form.create<DemandCommonSeaProps>()(DemandCommonSea);
