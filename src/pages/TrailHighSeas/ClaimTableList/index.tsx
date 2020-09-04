import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Radio,
  Row,
  Select,
  Modal,
  message,
  Pagination,
  Cascader,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
// import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data';
import FileUpload from '@/components/FileUpload';
import AreaSelect from '@/components/AreaSelect';
import styles from './style.less';
import { RadioChangeEvent } from 'antd/lib/radio';
import { string } from 'prop-types';
import ClaimSuccess from './ClaimSuccess';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';
import { KeepAlive } from 'umi';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'trailHighSeasTableList/leadsConfig'
      | 'trailHighSeasTableList/add'
      | 'trailHighSeasTableList/fetch'
      | 'trailHighSeasTableList/remove'
      | 'trailHighSeasTableList/update'
      | 'trailHighSeasTableList/leadsClaim'
      | 'trailHighSeasTableList/getGroupList'
      | 'trailHighSeasTableList/getListRole'
      | 'trailHighSeasTableList/leadsDistribute'
      | 'trailHighSeasTableList/getDistributeGroupConifgInfo'
      | 'trailHighSeasTableList/getDistributePeopleConifgInfo'
      | 'trailHighSeasTableList/getUserPermissionList'
    >
  >;
  loading: boolean;
  trailHighSeasTableList: StateType;
}
interface TableListState {
  modalVisible: boolean;
  claimModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: {
    [key: string]: string;
  };
  stepFormValues: Partial<TableListItem>;
  category: string;
  distrubuteId: string;
  distrubuteType: boolean;
  resetArea: boolean;
  company_tag: string;

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

  permission: {};
  // 原始数据展示
  originalFormValus: { [key: string]: string } | undefined;
}
/* eslint react/no-multi-comp:0 */

@connect(
  ({
    trailHighSeasTableList,
    loading,
  }: {
    trailHighSeasTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    trailHighSeasTableList,
    loading: loading.models.trailHighSeasTableList,
  })
)
class TableList extends Component<TableListProps, TableListState> {
  areaData = [];
  state: TableListState = {
    modalVisible: false,
    claimModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    category: '0',
    distrubuteType: false,
    resetArea: false,
    company_tag: '',

    distributes: [],
    distributeInputGroupNum: 0,
    distributeInputPeopleNum: 0,
    distributeType: 0,
    distributeAll: false,
    distributeSelectGroup: [],
    distributeSelectPeople: [],
    distributeInputGroupMap: new Map(),
    distributeInputPeopleMap: new Map(),
    permission: {},
  };
  columns: CrmStandardTableColumnProps<TableListItem>[] = [
    /*
  city	否	string	城市 多个逗号分割
  channel	否	string	渠道
  category	否	string	品类
  ac_time	否	string	开始时间
  end_time	否	string	结束时间
  follow_status	否	string	跟进结果 0:全部，1:未接/拒接、2:已订竞品、3:需求未明确、4:重点跟进、5:不接受服务、6:第三方待找，7:诈单
  name	否	string	名称
  id	否	string	id
  status	否	string	线索状态 全部、1:未跟进、2:待回访、3:跟进中，4:已签约
  page	否	string	页码 默认1
    id	int	id
  name	string	姓名
  main_contact_name	string	客户联系人
  category	string	业务类型
  location_province	string	业务城市
  channel	string	业务渠道
  task_id	string	活动名称
  wedding_date	string	婚期
  budget	string	预算
  status	string	线索状态
  follow_status	string	跟进结果
  follow_newest	date	最新服务时间
  follow_next	date	下次回访时间
  */
    {
      title: '线索ID',
      dataIndex: 'id',
      sorter: false,
      width: 80,
      render: (text, record) => (
        <a onClick={() => this.pushToDetail(record.id, record.customer_id, record.category_id)}>{record.id}</a>
      ),
    },
    {
      title: '客户编号',
      dataIndex: 'customer_id',
      width: 100,
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      sorter: false,
      width: 120,
      disableSelect: true,
    },
    {
      title: '客户电话',
      dataIndex: 'hide_phone',
      sorter: false,
      width: 130,
      disableSelect: true
    },
    {
      title: '客户微信',
      dataIndex: 'wechat',
      sorter: false,
      width: 130,
    },

    {
      title: '业务品类',
      dataIndex: 'category',
      sorter: false,
      width: 100,
    },
    {
      title: '业务城市',
      dataIndex: 'location_city_info',
      width: 100,
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
      sorter: false,
    },
    {
      title: '客资来源',
      dataIndex: 'channel',
      sorter: false,
      width: 130,
    },
    {
      title: '婚期',
      dataIndex: 'wedding_date',
      sorter: false,
      width: 180,
    },
    {
      title: '预算',
      dataIndex: 'budget',
      sorter: false,
      width: 100,
    },
    {
      title: '线索状态',
      dataIndex: 'status',
      sorter: false,
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'activity_id',
      sorter: false,
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'create_user',
      sorter: true,
      width: 100,
    },
    {
      title: '线索划入时间',
      dataIndex: 'allot_time',
      sorter: true,
      width: 150,
    },
    {
      title: '最新服务时间',
      dataIndex: 'follow_newest',
      sorter: true,
      width: 150,
    },
    {
      title: '最新服务记录',
      dataIndex: 'follow_num',
      width: 150,
      render(follow_num, item) {
        return (
          <div>
            <div>已服务（{follow_num}次）</div>
            <div>{item.follow_status}</div>
          </div>
        )
      },
      sorter: true,
    },
    {
      title: '退回原因',
      dataIndex: 'return_reason',
      sorter: false,
      width: 150,
    },
    {
      title: '上次归属人',
      dataIndex: 'last_owner_user',
      sorter: true,
      width: 130,
    },
    {
      title: '操作',
      sorter: false,
      fixed: 'right',
      render: (text, record) => (
        // <Fragment>

        //   <div>
        //     <a style={{visibility:(this.state.company_tag == 'XZ' || this.state.company_tag == 'SEW') ? 'hidden' : 'visible'}} onClick={() => this.handleClaim(record.id)}>认领</a>
        //     <Divider style={{visibility:(this.state.company_tag == 'XZ' || this.state.company_tag == 'SEW') ? 'hidden' : 'visible'}} type="vertical" />
        //     <a onClick={() => this.handleAssign(record)}>分配</a>
        //   </div>

        // </Fragment>
        < Fragment >
          {((this.state.company_tag == 'XZ') || (this.state.company_tag == 'SEW')) ?
            (
              this.state.permission.leadsadapter_leaderassign == true ?
                (<div>
                  <a onClick={() => this.handleAssign(record)}>分配</a>
                </div>)
                : (<div></div>)
            ) :
            <div>
              {/* <a onClick={() => this.handleClaim(record.id)}>认领</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleAssign(record)}>分配</a> */}

              {
                (
                  this.state.permission.leadsadapter_leaderassign == true ?
                    (<div>
                      <a onClick={() => this.handleClaim(record.id)}>认领</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.handleAssign(record)}>分配</a>
                    </div>)
                    : (<div><a onClick={() => this.handleClaim(record.id)}>认领</a></div>)
                )
              }
            </div>

          }
        </Fragment >
      ),


    },
  ];

  componentDidMount() {
    let StoreName = JSON.parse(window.localStorage.getItem('gcrm-user-info'));


    this.setState({
      company_tag: StoreName.company_tag

    });
    const { dispatch } = this.props;
    const { formValues, category } = this.state;
    const params = {
      category: category,
      ...formValues,
    };


    dispatch({
      type: 'trailHighSeasTableList/leadsConfig',
    });
    dispatch({
      type: 'trailHighSeasTableList/fetch',
      payload: params
    });
    dispatch({
      type: 'trailHighSeasTableList/getListRole',
      payload: { 'keywords': '' },
    });
    dispatch({
      type: 'trailHighSeasTableList/getGroupList',
    });
    //拉取搜索组
    dispatch({
      type: 'trailHighSeasTableList/getDistributeGroupConifgInfo',
    });
    //拉取搜索用户
    dispatch({
      type: 'trailHighSeasTableList/getDistributePeopleConifgInfo',
    });
    //获取配置
    dispatch({
      type: 'trailHighSeasTableList/getUserPermissionList',
      callback: this.userPermissAction
    });
  }

  userPermissAction = (data: any) => {
    if (data.code == 200) {

      this.setState({
        permission: data.data.result
      })
    }
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>
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
      category: this.state.category,
    }; // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    this.setState({
      selectedRows: []
    })

    dispatch({
      type: 'trailHighSeasTableList/fetch',
      payload: params,
    });
  };
  handleFormReset = () => {
    this.setState({
      selectedRows: [],
    });

    const { form, dispatch } = this.props;
    form.resetFields();
    const that = this;
    this.setState({
      formValues: {},
      resetArea: true,
      originalFormValus: undefined,
    }, () => {
      that.state.resetArea = false;
    });
    dispatch({
      type: 'trailHighSeasTableList/fetch',
      payload: {},
    });
  };
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
      case 'remove':
        dispatch({
          type: 'trailHighSeasTableList/remove',
          payload: {
            key: selectedRows.map(row => row.id),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;

      default:
        break;
    }
  };

  handleSearch = () => {
    this.setState({
      selectedRows: [],
    });

    const { dispatch, form } = this.props;
    const { category } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue, '------xiansuo')

      this.setState({
        originalFormValus: fieldsValue,
      })

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      const params: Partial<TableListParams> = {
        ...values,
        category: category,
      };

      //创建时间  取出起始和结束时间
      const creationTimeArray = fieldsValue['creationTime']
      if (creationTimeArray !== undefined && creationTimeArray.length > 0) {
        delete params['creationTime']
        params['acTime'] = moment(creationTimeArray[0]).format('YYYY-MM-DD');
        params['endTime'] = moment(creationTimeArray[1]).format('YYYY-MM-DD');
      } else {
        delete params['acTime']
        delete params['endTime']
      }

      //最新服务时间  取出起始和结束时间
      const followNewestTimeArray = fieldsValue['followNewestTime']
      if (followNewestTimeArray !== undefined && followNewestTimeArray.length > 0) {
        delete params['followNewestTime']
        params['followNewestAction'] = moment(followNewestTimeArray[0]).format('YYYY-MM-DD');
        params['followNewestEnd'] = moment(followNewestTimeArray[1]).format('YYYY-MM-DD');
      } else {
        delete params['followNewestAction']
        delete params['followNewestEnd']
      }

      //婚期  取出起始和结束时间
      const weddingDateArray = fieldsValue['weddingDate']
      if (weddingDateArray !== undefined && weddingDateArray.length > 0) {
        delete params['weddingDate']
        params['weddingDateAction'] = moment(weddingDateArray[0]).format('YYYY-MM-DD');
        params['weddingDateEnd'] = moment(weddingDateArray[1]).format('YYYY-MM-DD');
      } else {
        delete params['weddingDateAction']
        delete params['weddingDateEnd']
      }

      const channelArr = fieldsValue['channel']
      if (channelArr !== undefined) {
        delete params['channel']
        if (channelArr.length > 0) {
          params['channel'] = channelArr[channelArr.length - 1]
        }
      }
      if (params.page) {
        params.page = 1
      }

      console.log(params, '------params')


      this.setState({
        formValues: params,
      });

      dispatch({
        type: 'trailHighSeasTableList/fetch',
        payload: params,
      });
    });
  };

  //认领
  handleClaim = (id: string) => {
    Axios.post(URL.leadsClaim, { "id": id }).then(
      res => {
        if (res.code == 200) {
          if (res.data.result == "1") {
            this.claimSucess()
          }
        } else {
          this.claimFaile(res.msg)
        }
      }
    );
  }

  //批量认领
  handleClaimMore = (rows: TableListItem[]) => {
    let idString: string = '';
    for (let index = 0; index < rows.length; index++) {
      const element = rows[index];
      idString = idString + ',' + element.id;
    }
    if (idString.length > 0) {
      idString = idString.slice(1, idString.length);
    }
    Axios.post(URL.leadsClaim, { "id": idString }).then(
      res => {
        if (res.code == 200) {
          if (res.data.result == "1") {
            this.claimSucess()
          }
        } else {
          this.claimFaile(res.msg)
        }
      }
    );
  }

  claimSucess = () => {
    const { dispatch } = this.props;
    this.setState({
      claimModalVisible: false,
      selectedRows: [],
    });
    message.success('认领成功')
    dispatch({
      type: 'trailHighSeasTableList/fetch',
    });
  }


  claimFaile = (reson: string) => {
    this.setState({
      claimModalVisible: false,
      selectedRows: [],
    });
    Modal.error({
      title: '出错了',
      content: `${reson}`,
    })
  }

  handleButtonTypeChange = (e: RadioChangeEvent) => {
    this.setState({
      selectedRows: [],
    });

    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.setState({
      category: e.target.value,
    });
    const params = {
      ...formValues,
    };
    params.category = e.target.value;
    // console.log(e.target.value)

    dispatch({
      type: 'trailHighSeasTableList/fetch',
      payload: params,
    });
  };
  // handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
  //   this.setState({
  //     updateModalVisible: !!flag,
  //     stepFormValues: record || {},
  //   });
  // }
  areaSelectChange = (codes: string) => {
    const { form } = this.props
    form.setFieldsValue({
      'locationCityCode': codes + "",
    });
  }

  pushToDetail = (id: string, phone: string,category_id: string) => {
    const idValue = id;
    const phoneValue = phone;
    this.props.dispatch(routerRedux.push({
      pathname: '/claimTableList/leadsDetails',
      state: {
        customerId: phoneValue ? phoneValue : '',
        leadId: idValue ? idValue : '',
        categoryId: category_id,
        hiddenNextButton: true,
        claimTableListFlag: true
      },
    }));

    // yield put(routerRedux.push({
    //   pathname: '/LeadManagement/details',
    //   state: {
    //     id: idValue,
    //     phone: phoneValue,
    //   },
    // }));
  }


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
    const { trailHighSeasTableList: { data } } = this.props;
    const { count } = data;
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
      const { category } = this.state;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const values = {
          ...fieldsValue,
          updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        };
        const params: Partial<TableListParams> = {
          ...values,
          category: category,
        };
        //创建时间  取出起始和结束时间
        const creationTimeArray = fieldsValue['creationTime']
        if (creationTimeArray !== undefined) {
          delete params['creationTime']
          params['acTime'] = moment(creationTimeArray[0]).format('YYYY-MM-DD');
          params['endTime'] = moment(creationTimeArray[1]).format('YYYY-MM-DD');
        }
        //最新服务时间  取出起始和结束时间
        const followNewestTimeArray = fieldsValue['followNewestTime']
        if (followNewestTimeArray !== undefined) {
          delete params['followNewestTime']
          params['followNewestAction'] = moment(followNewestTimeArray[0]).format('YYYY-MM-DD');
          params['followNewestEnd'] = moment(followNewestTimeArray[1]).format('YYYY-MM-DD');
        }
        //婚期  取出起始和结束时间
        const weddingDateArray = fieldsValue['weddingDate']
        if (weddingDateArray !== undefined) {
          delete params['weddingDate']
          params['weddingDateAction'] = moment(weddingDateArray[0]).format('YYYY-MM-DD');
          params['weddingDateEnd'] = moment(weddingDateArray[1]).format('YYYY-MM-DD');
        }
        const channelArr = fieldsValue['channel']
        if (channelArr !== undefined) {
          delete params['channel']
          if (channelArr.length > 0) {
            params['channel'] = channelArr[channelArr.length - 1]
          }
        }
        requestParams = {
          ...requestParams,
          ...params,
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
    const { dispatch, trailHighSeasTableList: { data: { count } } } = this.props;
    dispatch({
      type: 'trailHighSeasTableList/leadsDistribute',
      payload: {
        ...params,
        //公海
        searchSource: 1,
      },
      callback: (response: any) => {
        if (response.code === 200) {
          // message.success('已成功分配' + (this.state.distributeAll ? count : this.state.distributeType == 0 ? this.state.distributeInputGroupNum : this.state.distributeInputPeopleNum) + '条线索');
          message.success(response.msg);
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

  renderFilterForm() {
    const {
      form,
      trailHighSeasTableList: { configData },
    } = this.props;
    const { getFieldDecorator } = form;

    const formItemList: JSX.Element[] = new Array();
    formItemList.push(
      <FormItem label="客户电话">
        {getFieldDecorator('mobile', {
          initialValue: this.state.originalFormValus?.mobile,
          rules: [{ required: false, pattern: new RegExp(/^-?[0-9]*(\.[0-9]*)?$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
            return event.target.value.replace(/\D/g, '')
          },
          initialValue: ''
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
        {getFieldDecorator('name', { initialValue: this.state.originalFormValus?.name })(<Input maxLength={20} placeholder="请输入客户姓名" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="划入时间">
        {getFieldDecorator('creationTime', {
          initialValue: this.state.originalFormValus?.creationTime
        })(
          <RangePicker
            ranges={{
              '本周': [moment().startOf('week'), moment().endOf('week')],
            }}
            placeholder={['开始日期', '结束日期']}
            style={{
              width: '100%',
            }}
          />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="最新服务时间">
        {getFieldDecorator('followNewestTime', {
          initialValue: this.state.originalFormValus?.followNewestTime
        })(
          <RangePicker
            ranges={{
              '本周': [moment().startOf('week'), moment().endOf('week')],
            }}
            placeholder={['开始日期', '结束日期']}
            style={{
              width: '100%',
            }}
          />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客资来源">
        {getFieldDecorator('channel', { initialValue: this.state.originalFormValus?.channel })(
          <Cascader showSearch style={{ width: '100%', }} options={configData.channel} changeOnSelect />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="业务城市">
        {getFieldDecorator('locationCityCode', { initialValue: this.state.originalFormValus?.locationCityCode })(<CityMultipleSelect citySelectChange={this.areaSelectChange} reset={this.state.resetArea} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="婚期">
        {getFieldDecorator('weddingDate', {
          initialValue: this.state.originalFormValus?.weddingDate
        })(
          <RangePicker
            ranges={{
              '本周': [moment().startOf('week'), moment().endOf('week')],
            }}
            placeholder={['开始日期', '结束日期']}
            style={{
              width: '100%',
            }}
          />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="活动名称">
        {getFieldDecorator('activityId', { initialValue: this.state.originalFormValus?.taskId })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData.activity ? configData.activity.map(activity => (
                <Option value={activity.id}>{activity.name}</Option>)) : null
            }
          </Select>,
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="线索ID">
        {getFieldDecorator('id', {
          initialValue: this.state.originalFormValus?.id,
          rules: [{
            required: false,
            pattern: new RegExp(/^[1-9]\d*$/, "g"),
            message: '请输入正确的id号'
          }]
        })(<Input maxLength={20} placeholder="请输入线索ID" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户编号">
        {getFieldDecorator('customer_id', { initialValue: this.state.originalFormValus?.customer_id })(<Input maxLength={20} placeholder="请输入客户编号" />)}
      </FormItem>
    );
    return formItemList;
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name', { initialValue: this.state.originalFormValus?.name })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status', { initialValue: this.state.originalFormValus?.status })(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                  allowClear
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number', { initialValue: this.state.originalFormValus?.number })(
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date', { initialValue: this.state.originalFormValus?.date })(
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入更新日期"
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3', { initialValue: this.state.originalFormValus?.status3 })(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                  allowClear
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4', { initialValue: this.state.originalFormValus?.status4 })(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                  allowClear
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              float: 'right',
              marginBottom: 24,
            }}
          >
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
              onClick={this.handleFormReset}
            >
              重置
            </Button>
            <a
              style={{
                marginLeft: 8,
              }}
              onClick={this.toggleForm}
            >
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      trailHighSeasTableList: { data },
      trailHighSeasTableList: { groupData, roleData },
      loading,
    } = this.props;
    const { list = [], pagination = false, count } = data || {};

    const paginationProps = pagination
      ? {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      }
      : false;

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
              scroll={{ x: 'max-content' }}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              columnsEditable={true}
              selecteMode="checkbox"
              selectedRows={selectedRows}
              onRowsSelectChanged={this.handleSelectRows}
              renderTopButtons={
                  () => (
                    <div style={{ display: 'flex', width: '100%' }}>
                      <Radio.Group
                        defaultValue="0"
                        buttonStyle="solid"
                        onChange={this.handleButtonTypeChange}
                        value={this.state.category}>{
                          data.header.map(header => (
                            <Radio.Button value={'' + header.id + ''} >
                              {header.name + "（" + header.num + "）"}
                            </Radio.Button>
                          ))}
                      </Radio.Group>
                      <div style={{ flex: '1' }} />
                      {selectedRows.length > 0 && (
                        <span>
                          <Button onClick={() => this.handleAssigns()}>批量分配</Button>
                          <Button style={{ marginLeft: 10, }} onClick={() => this.handleClaimMore(selectedRows)}>批量认领</Button>
                        </span>
                      )}
                      {
                        data && data.list && data.list.length > 0 && (
                          <Button style={{ marginLeft: 10, }} onClick={() => this.handleAllAssigns()}>全部分配</Button>
                        )
                      }
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

            {/* <StandardTable
              scroll={{ x: 'max-content' }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /> */}
          </div>
        </Card>
      </PageHeaderWrapper>
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
      trailHighSeasTableList: { distributeGroupConifg, distributePeopleConifg },
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
              optionFilterProp='title'
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择组名"
              onChange={this.handleDistributeGroupChange}>
              {
                (distributeGroupConifg && distributeGroupConifg.length > 0) ?
                  distributeGroupConifg.map(config => (
                    <Option title={config.name} value={config.id}>{config.name}</Option>))
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
              optionFilterProp='title'
              onChange={this.handleDistributePeopleChange}>
              {
                (distributePeopleConifg && distributePeopleConifg.length > 0) ?
                  distributePeopleConifg.map(config => (
                    <Option title={config.name} value={config.id}>{config.name}</Option>))
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