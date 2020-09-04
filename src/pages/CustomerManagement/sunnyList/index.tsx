import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Divider,
  TreeSelect,
  Modal,
  Spin,
  message,
  Cascader,
  Radio,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import { CustomerListItem } from './data';
import styles from './style.less';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import LOCAL from '@/utils/LocalStorageKeys';
import { routerRedux } from 'dva/router';
import CrmStandardTable, { CrmStandardTableColumnProps, getCrmTableColumn } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';
import { PlusOutlined } from '@ant-design/icons';
import { ConfigListItem } from '../commondata';
import DistributeModal from '../components/DistributeModal';
import { CategoryConfigItem } from '@/pages/BeiJingBI/list/data';
import { RadioChangeEvent } from 'antd/lib/radio';

const FormItem = Form.Item;
const { Option } = Select;

const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<any>>;
  loading: boolean;
  sunnyListMode: StateType;
}

interface TableListState {
  formValues: { [key: string]: string | number };
  originValues: { [key: string]: string };

  selectedRows: CustomerListItem[];
  assigningRows: CustomerListItem[];
  assignsModal: boolean;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    sunnyListMode,
    loading,
  }: {
    sunnyListMode: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sunnyListMode,
    loading: loading.models.sunnyListMode,
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  /** 4 提供人列表；(分公司客户列表) 1　需求列表；（客服列表）　2　邀约列表 */
  roleType = window.location.href.indexOf("bjRecoderList") > 0 ? 4 : (window.location.href.indexOf("bjLeadsList") > 0 ? 1 : 2)


  generateStandardTableColumnProps = (): CrmStandardTableColumnProps<CustomerListItem>[] => {
    const columns: CrmStandardTableColumnProps<CustomerListItem>[] = [];
    const get = getCrmTableColumn;
    columns.push(get('group_customer_id', '集团客户ID', {}, true));
    columns.push(get('customer_id', '客户编号', {
      render: (text: string, recoder: CustomerListItem) => <a onClick={() => this.onItemClick(recoder.customer_id.toString())}>{text}</a>
    }))
    columns.push(get('channel', '渠道来源', {}, true))
    if (this.roleType == 4) {
      columns.push(get('category', '业务品类'))
      columns.push(get('allot_time', '入库时间'))
      columns.push(get('customer_name', '客户姓名', {}, true))
      columns.push(get('record_user_name', '提供人'))
      columns.push(get('leads_owner_name', '客服'))
      columns.push(get('req_owner_name', '邀约人'))
      if (CrmUtil.getCompanyTag() == 'LMHS') {
        columns.push(get('dress_commission', '礼服返佣'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        columns.push(get('photo_commission', '摄影返佣'))
      } else {
        columns.push(get('wedding_commission', '婚庆返佣'))
        columns.push(get('banquet_commission', '婚宴返佣'))
      }
      columns.push(get('customer_status', '客户实时状态'))

      if (CrmUtil.getCompanyTag() == 'LMHS') {
        columns.push(get('order_dress_owner_name', '礼服销售'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        columns.push(get('order_photo_owner_name', '摄影销售'))
      } else {
        columns.push(get('order_wedding_owner_name', '婚庆销售'))
        columns.push(get('order_banquet_owner_name', '婚宴销售'))
      }
      columns.push(get('customer_follow_time', '最新沟通时间'))
      columns.push(get('customer_follow_content', '最新沟通记录', { width: 300 }))
      if (CrmUtil.getCompanyTag() == 'LMHS') {
        columns.push(get('dress_status', '礼服实时状态'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        columns.push(get('photo_status', '摄影实时状态'))
      } else {
        columns.push(get('wedding_status', '婚庆实时状态'))
        columns.push(get('banquet_status', '婚宴实时状态'))
      }
      if (CrmUtil.getCompanyTag() == 'LMHS') {
        columns.push(get('req_dress_once_valid', '礼服首次有效'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        columns.push(get('req_photo_once_valid', '摄影首次有效'))
      } else {
        columns.push(get('req_wedding_once_valid', '婚庆首次有效'))
        columns.push(get('req_banquet_once_valid', '婚宴首次有效'))
      }
    } else if (this.roleType == 1) {

      columns.push(get('category', '主营品类'))
      columns.push(get('other_category', '其他品类'))
      columns.push(get('hotel', '酒店名称', { width: 160 }))
      columns.push(get('allot_time', '入库时间'))
      columns.push(get('customer_name', '客户姓名', {}, true))
      columns.push(get('record_user_name', '提供人'))
      columns.push(get('req_owner_name', '邀约人'))
      columns.push(get('leads_owner_name', '客服'))
      columns.push(get('team_user', '项目协作成员'))
      columns.push(get('customer_level', '客户级别'))
      columns.push(get('call_status', '通话状态'))
      columns.push(get('leads_follow_status', '跟进结果'))
      columns.push(get('leads_follow_tag', '客服级别'))
      columns.push(get('customer_status', '客户实时状态'))
      if (CrmUtil.getCompanyTag() == 'LMHS') {
        columns.push(get('leads_dress_status', '礼服'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        columns.push(get('leads_photo_status', '摄影'))
      } else {
        columns.push(get('leads_wedding_status', '婚庆'))
        columns.push(get('leads_banquet_status', '婚宴'))
      }
      columns.push(get('leads_follow_time', '最新沟通时间'))
      columns.push(get('leads_follow_content', '最新沟通记录', { width: 300 }))
      columns.push(get('leads_next_contact_time', '下次回访时间'))
      columns.push(get('follow_num', '跟进次数'))
      columns.push(get('leads_status', '客服状态'))

    } else if (this.roleType == 2) {

      columns.push(get('category', '主营品类'))
      columns.push(get('other_category', '其他品类'))
      columns.push(get('hotel', '酒店名称', { width: 160 }))
      columns.push(get('allot_time', '入库时间'))
      columns.push(get('customer_name', '客户姓名', {}, true))
      // columns.push(this.creatColumnsDataItem('wechat', '客户微信'))
      columns.push(get('record_user_name', '提供人'))
      columns.push(get('leads_owner_name', '客服'))
      columns.push(get('req_owner_name', '邀约人'))
      columns.push(get('team_user', '项目协作成员'))
      columns.push(get('customer_level', '客户级别'))
      columns.push(get('req_follow_tag', '邀约级别'))
      columns.push(get('req_follow_time', '最新沟通时间'))
      columns.push(get('req_follow_content', '最新沟通记录', { width: 300 }))
      columns.push(get('req_next_contact_time', '下次回访时间'))
      columns.push(get('follow_num', '跟进次数'))
      if (CrmUtil.getCompanyTag() == 'LMHS') {
        columns.push(get('req_dress_status', '礼服邀约状态'))
        columns.push(get('req_dress_once_valid', '礼服首次有效'))
        columns.push(get('req_first_valid_dress_time', '礼服首次有效时间'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        columns.push(get('req_photo_status', '摄影邀约状态'))
        columns.push(get('req_photo_once_valid', '摄影首次有效'))
        columns.push(get('req_first_valid_photo_time', '摄影首次有效时间'))
      } else {
        columns.push(get('req_wedding_status', '婚庆邀约状态'))
        columns.push(get('req_wedding_once_valid', '婚庆首次有效'))
        columns.push(get('req_first_valid_wedding_time', '婚庆首次有效时间'))
        columns.push(get('req_banquet_status', '婚宴邀约状态'))
        columns.push(get('other_status', '其他品类实时状态'))
        columns.push(get('req_banquet_once_valid', '婚宴首次有效'))
        columns.push(get('req_first_valid_banquet_time', '婚宴首次有效时间'))
      }
      columns.push(get('req_follow_status', '跟进结果'))
    }
    return columns;
  }

  columns: CrmStandardTableColumnProps<CustomerListItem>[] = this.generateStandardTableColumnProps();

  handleSelectRows = (rows: CustomerListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  state: TableListState = {
    originValues: {},
    formValues: {},
    selectedRows: [],
    assigningRows: [],
    assignsModal: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sunnyListMode/fetch',
      payload: {
        type: this.roleType,
        isMy: this.isMy
      }
    });
    dispatch({
      type: 'sunnyListMode/config',
      payload: {
        // companyId: CrmUtil.getUserInfo()?.company_id
      }
    });
    dispatch({
      type: 'sunnyListMode/getUserPermissionList',
    });

    dispatch({
      type: 'sunnyListMode/getSearchUserData',
    });
  };


  componentWillReceiveProps(nextProps: any) {
    const isRefresh = localStorage ? localStorage.getItem('demandListRefreshTag')?.toString() : '';
    const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';
    if (isRefresh && isRefresh?.length > 0) {
      localStorage?.setItem('demandListRefreshTag', '')
      if (isRefresh == 'reset') {
        this.handleFormReset();
      } else if (isRefresh == "list") {
        this.requestListData();
      }
    } else if (autoRefresh === '1') {
      this.requestListData();
      localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
    }
  }

  /** 跳转到详情 */
  onItemClick = (customerId: string) => {
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    let pathname = window.location.href.substring(window.location.href.lastIndexOf('/') + 1) + '/detail_xp';
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: pathname,
      state: {
        customerId,
        showStyle: this.roleType,
      }
    }));
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    let params = {
      type: this.roleType.toString(),
      isMy: this.isMy
    };
    this.setState({
      formValues: params,
      originValues: {},
      selectedRows: [],
    });
    dispatch({
      type: 'sunnyListMode/fetch',
      payload: params,
    });
  };

  requestListData = () => {
    let { dispatch } = this.props;
    const { formValues } = this.state;
    let params = {
      ...formValues,
      type: this.roleType.toString(),
      isMy: this.isMy
    };

    dispatch({
      type: 'sunnyListMode/fetch',
      payload: params,
    });

  }

  handleStandardTableChange = (
    page: number, pageSize: number
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    //状态
    const params = {
      ...formValues,
      type: this.roleType.toString(),
      isMy: this.isMy,
      page,
      pageSize
    };

    this.setState({
      formValues: params,
    })

    dispatch({
      type: 'sunnyListMode/fetch',
      payload: params,
    });
  };

  /** 1：我的邀约/客服单  0：我的协作单  默认是1 */
  isMy = 1;

  handleSearch = () => {
    const { dispatch, form } = this.props;
    //重置选中数据
    this.setState({
      selectedRows: [],
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      delete fieldsValue['customize_columns']
      this.setState({
        originValues: fieldsValue,
      })

      //表单信息和状态
      const params = {
        ...fieldsValue,
        type: this.roleType,
      };

      // 处理二级品类
      const otherCategory = fieldsValue['otherCategory']
      if (otherCategory !== undefined) {
        delete params['otherCategory']
        if (otherCategory.length > 0) {
          params['otherCategory'] = otherCategory[otherCategory.length - 1]
        }
      }

      //取出起始和结束时间
      let allot_range_time = fieldsValue['allot_range_time']
      if (allot_range_time !== undefined && allot_range_time != '') {
        delete params['allot_range_time']
        params['allotStartTime'] = moment(allot_range_time[0]).format('YYYY-MM-DD');
        params['allotEndTime'] = moment(allot_range_time[1]).format('YYYY-MM-DD');
      }

      this.mulitSelectFormat('category', params, fieldsValue)
      this.mulitSelectFormat('channel', params, fieldsValue)
      this.mulitSelectFormat('leadsStatus', params, fieldsValue)
      this.mulitSelectFormat('reqBanquetStatus', params, fieldsValue)
      this.mulitSelectFormat('reqStatus', params, fieldsValue)
      this.mulitSelectFormat('reqWeddingStatus', params, fieldsValue)
      this.mulitSelectFormat('reqDressStatus', params, fieldsValue)
      this.mulitSelectFormat('reqPhotoStatus', params, fieldsValue)
      this.mulitSelectFormat('banquetTeamUserIds', params, fieldsValue)
      this.mulitSelectFormat('weddingTeamUserIds', params, fieldsValue)
      this.mulitSelectFormat('dressTeamUserIds', params, fieldsValue)
      this.mulitSelectFormat('photoTeamUserIds', params, fieldsValue)
      if (this.roleType == 4) {
        this.mulitSelectFormat('customerStatus', params, fieldsValue)
        this.mulitSelectFormat('weddingStatus', params, fieldsValue)
        this.mulitSelectFormat('banquetStatus', params, fieldsValue)
      }

      if (this.roleType == 1 || this.roleType == 2) {
        //时间处理
        //下次回访时间
        const nextContactTime = fieldsValue['nextContactTime']
        if (nextContactTime != undefined && nextContactTime != '') {
          delete params['nextContactTime']
          params['nextContactStartTime'] = moment(nextContactTime[0]).format('YYYY-MM-DD');
          params['nextContactEndTime'] = moment(nextContactTime[1]).format('YYYY-MM-DD');
        }

        const followTime = fieldsValue['followTime']
        if (followTime != undefined && followTime != '') {
          delete params['followTime']
          params['followStartTime'] = moment(followTime[0]).format('YYYY-MM-DD');
          params['followEndTime'] = moment(followTime[1]).format('YYYY-MM-DD');
        }
      }

      if (this.roleType == 2) {
        //首次有效时间
        const firstValidTime = fieldsValue['firstValidTime']
        if (firstValidTime != undefined && firstValidTime != '') {
          delete params['firstValidTime']
          params['firstValidStartTime'] = moment(firstValidTime[0]).format('YYYY-MM-DD');
          params['firstValidEndTime'] = moment(firstValidTime[1]).format('YYYY-MM-DD');
        }
      }

      const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';

      //取出分页信息
      const { sunnyListMode: { dataLeads, dataReqs, dataRecorder } } = this.props;
      const data = this.roleType == 1 ? dataLeads : this.roleType == 2 ? dataReqs : this.roleType == 4 ? dataRecorder : undefined;
      if (!data) return;
      const { pagination } = data;
      if (pagination !== undefined && autoRefresh !== '1') {
        params['page'] = 1;
      } else {
        params['page'] = pagination?.current ?? 1;
      }

      params['pageSize'] = pagination?.pageSize ?? 20;

      this.setState({
        formValues: params
      });

      params['isMy'] = this.isMy;

      dispatch({
        type: 'sunnyListMode/fetch',
        payload: params,
      });
    });
  };

  handleChangeListTab = (e: RadioChangeEvent) => {
    this.setState({
      selectedRows: [],
    });

    this.isMy = e.target.value

    const { dispatch } = this.props;
    const { formValues } = this.state;
    // 表单信息和状态
    const params = {
      ...formValues,
    };

    const { sunnyListMode: { dataLeads, dataReqs, dataRecorder } } = this.props;
    const data = this.roleType == 1 ? dataLeads : this.roleType == 2 ? dataReqs : this.roleType == 4 ? dataRecorder : undefined;
    if (!data) return;
    const { pagination } = data;
    params['page'] = 1;
    params['pageSize'] = pagination?.pageSize ?? 20;

    this.setState({
      formValues: params
    });

    params["isMy"] = this.isMy;
    params["type"] = this.roleType.toString();

    dispatch({
      type: 'sunnyListMode/fetch',
      payload: params,
    });
  };

  mulitSelectFormat = (prop: string, values: any, fieldsValue: any) => {
    const formValue = fieldsValue[prop]
    delete values[prop]
    if (formValue && formValue != '' && formValue.length > 0) {
      values[prop] = formValue + ''
    }
  }

  /**=================== formCreate ============================== */

  formGroupCustomerId = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="集团客户ID">
      {getFieldDecorator('groupCustomerId', {
        initialValue: this.state.originValues?.groupCustomId
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formCustomerId = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="客户编号">
      {getFieldDecorator('customerId', {
        initialValue: this.state.originValues?.customerId
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formCustomerName = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="客户姓名">
      {getFieldDecorator('customerName', {
        initialValue: this.state.originValues?.customerName
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formCustomerWeChat = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="客户微信">
      {getFieldDecorator('weChat', {
        initialValue: this.state.originValues?.weChat
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formCustomerPhone = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="客户电话">
      {getFieldDecorator('phone', {
        rules: [{ required: false, pattern: new RegExp(/^-?[0-9]*(\.[0-9]*)?$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
          return event.target.value.replace(/\D/g, '')
        },
        initialValue: this.state.originValues?.phone
      })(<Input placeholder="请输入" maxLength={11} />)}
    </FormItem>
  }

  formCustomerLevel = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="客户级别">
      {getFieldDecorator('customerLevel', {
        initialValue: this.state.originValues?.customerLevel
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData.customerLevel?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formCustomerStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="客户实时状态">
      {getFieldDecorator('customerStatus', {
        initialValue: this.state.originValues?.customerStatus
      })(
        <Select
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children"
          placeholder="请选择">
          {
            configData.customerStatus?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formChannel = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData, } = this.props.sunnyListMode;
    if (configData.allchannel && configData.allchannel.length > 0) {
      configData.allchannel.forEach(item => {
        item['key'] = item.value
      })
    }
    return <FormItem label="客资来源">
      {getFieldDecorator('channel', {
        initialValue: this.state.originValues?.channel
      })(
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={configData.allchannel}
          placeholder="请选择(多选)"
          filterTreeNode={(inputValue: string, treeNode: any) => {
            return treeNode.props.label.indexOf(inputValue) >= 0;
          }}
          treeNodeLabelProp="label"
          treeCheckable={true}
          allowClear
          showCheckedStrategy={TreeSelect.SHOW_CHILD} />
      )}
    </FormItem>
  }

  formCategory = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    if (configData.category2 && configData.category2.length > 0) {
      configData.category2.forEach(item => {
        item['key'] = item.value
      })
    }
    return <FormItem label="业务品类">
      {getFieldDecorator('category', {
        initialValue: this.state.originValues?.category
      })(
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={configData.category2}
          filterTreeNode={(inputValue: string, treeNode: any) => {
            return treeNode.props.label.indexOf(inputValue) >= 0;
          }}
          placeholder="请选择(多选)"
          treeNodeLabelProp="label"
          treeCheckable={true}
          allowClear
          showCheckedStrategy={TreeSelect.SHOW_CHILD} />
      )}
    </FormItem>
  }

  formBanquetValid = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚宴首次有效">
      {getFieldDecorator('reqBanquetOnceValid', {
        initialValue: this.state.originValues?.reqBanquetOnceValid
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1} key={1}>首次有效</Option>
        </Select>
      )}
    </FormItem>
  }

  formOnceValid = (name: string, id: string) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={name}>
      {getFieldDecorator(id, {
        initialValue: this.state.originValues[id]
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1} key={1}>首次有效</Option>
        </Select>
      )}
    </FormItem>
  }

  formBanquetCommission = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚宴返佣">
      {getFieldDecorator('banquetCommission', {
        initialValue: this.state.originValues?.banquetCommission
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formWeddingCommission = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚庆返佣">
      {getFieldDecorator('weddingCommission', {
        initialValue: this.state.originValues?.weddingCommission
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formAllotTime = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label='入库时间'>
      {getFieldDecorator('allot_range_time', {
        initialValue: this.state.originValues?.allot_range_time
      })(
        <RangePicker />
      )}
    </FormItem>
  }

  formLeadsFollowResult = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="跟进结果">
      {getFieldDecorator('followResult', {
        initialValue: this.state.originValues?.followResult
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData.leadsFollowStatus?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formReqFollowResult = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="跟进结果">
      {getFieldDecorator('followResult', {
        initialValue: this.state.originValues?.followResult
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData.requirementFollowStatus?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formLeadsFollowTag = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="客服级别">
      {getFieldDecorator('followTag', {
        initialValue: this.state.originValues?.followTag
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData.leadsFollowTag?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formReqFollowTag = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="邀约级别">
      {getFieldDecorator('followTag', {
        initialValue: this.state.originValues?.followTag
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData.requirementFollowTag?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formRecordUserName = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="提供人">
      {getFieldDecorator('recordUserName', {
        initialValue: this.state.originValues?.recordUserName
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formLeadsOwnerName = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="客服">
      {getFieldDecorator('leadsOwnerName', {
        initialValue: this.state.originValues?.leadsOwnerName
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formReqOwnerName = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="邀约人">
      {getFieldDecorator('reqOwnerName', {
        initialValue: this.state.originValues?.reqOwnerName
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  formCallStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="通话状态">
      {getFieldDecorator('callStatus', {
        initialValue: this.state.originValues?.callStatus
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1}>有效</Option>
          <Option value={0}>无效</Option>
        </Select>
      )}
    </FormItem>
  }

  formLeadsStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="客服状态">
      {getFieldDecorator('leadsStatus', {
        initialValue: this.state.originValues?.leadsStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            configData.leadsStatus?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formBanquetStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="婚宴邀约状态">
      {getFieldDecorator('reqBanquetStatus', {
        initialValue: this.state.originValues?.reqBanquetStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            configData.requirementPhase?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formWeddingStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListMode;
    return <FormItem label="婚庆邀约状态">
      {getFieldDecorator('reqWeddingStatus', {
        initialValue: this.state.originValues?.reqWeddingStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            configData.requirementPhase?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  /**
   * 提供人（输入名字查询）
   */
  formRecordeUserName = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="提供人">
      {getFieldDecorator('recordUserName', {
        initialValue: this.state.originValues?.recordUserName
      })(
        <Input placeholder="请输入" />
      )}
    </FormItem>
  }

  /**
   * 实时状态（多选）
   */
  formActualStatus = (name: string, id: string, options: ConfigListItem[]) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={name}>
      {getFieldDecorator(id, {
        initialValue: this.state.originValues[id]
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            options?.map(value => (
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }


  formReqBanquetOnceValid = (name: string, id: string,) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={name}>
      {getFieldDecorator(id, {
        initialValue: this.state.originValues[id]
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1}>首次有效</Option>
        </Select>,
      )}
    </FormItem>
  }

  formReqWeddingOnceValid = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚庆首次有效">
      {getFieldDecorator('reqWeddingOnceValid', {
        initialValue: this.state.originValues?.reqWeddingOnceValid
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1}>首次有效</Option>
        </Select>,
      )}
    </FormItem>
  }

  /**
   * 项目协作成员
   */
  formTeamName = (title: string, prop: string) => {
    let { getFieldDecorator } = this.props.form;
    const { searchUserData } = this.props.sunnyListMode
    return <FormItem label={title}>
      {getFieldDecorator(prop, {
        initialValue: this.state.originValues[prop]
      })(
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          placeholder="请选择"
          optionFilterProp="children"
          showSearch
          allowClear
        >
          {searchUserData && searchUserData.map((item: any) =>
            <Option key={item.id} value={item.id} >{item.name}</Option>)}
        </Select>
      )}
    </FormItem>
  }

  /**
   * Select多选
   */
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
              <Option key={value.id} value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  /**
   * 树型多选 Select 
   */
  formMultipleTreeSelect = (title: string, formId: string, selectTreeConfig: any) => {
    let { getFieldDecorator } = this.props.form;
    if (selectTreeConfig && selectTreeConfig.length > 0) {
      selectTreeConfig.forEach(item => {
        item['key'] = item.value
      })
    }
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originValues[formId]
      })(
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={selectTreeConfig}
          filterTreeNode={(inputValue: string, treeNode: any) => {
            return treeNode.props.label.indexOf(inputValue) >= 0;
          }}
          placeholder="请选择(多选)"
          treeNodeLabelProp="label"
          treeCheckable={true}
          allowClear
          showCheckedStrategy={TreeSelect.SHOW_CHILD} />
      )}
    </FormItem>
  }

  renderFormCascader = (label: string, id: string, initialValue?: any, options?: CategoryConfigItem[]) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <Cascader showSearch style={{ width: '100%', }} options={options} allowClear={true} />
      )}
    </FormItem>
  }

  /**
  * 树型单选 Select 
  */
  formTreeSelect = (title: string, formId: string, selectTreeConfig: any) => {
    let { getFieldDecorator } = this.props.form;
    if (selectTreeConfig && selectTreeConfig.length > 0) {
      selectTreeConfig.forEach(item => {
        item['key'] = item.value
      })
    }
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originValues[formId]
      })(
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={selectTreeConfig}
          filterTreeNode={(inputValue: string, treeNode: any) => {
            return treeNode.props.label.indexOf(inputValue) >= 0;
          }}
          placeholder="请选择"
          treeNodeLabelProp="label"
          allowClear
          showCheckedStrategy={TreeSelect.SHOW_CHILD} />
      )}
    </FormItem>
  }


  // 区间时间筛选
  renderFormRange = (id: string, label: string, initialValue?: any) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <RangePicker style={{ width: '100%' }} />)}
    </FormItem>
  }

  // 输入框筛选
  formInput = (title: string, formId: string) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originValues[formId]
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  /**=================== formCreate ============================== */

  renderFilterFormList = () => {
    let { config: configData } = this.props.sunnyListMode;
    let list = [];
    if (this.roleType == 4) {  // 提供人列表
      list.push(this.formGroupCustomerId())
      list.push(this.formCustomerName())
      if (CrmUtil.getCompanyTag() == 'LMHS') {
        list.push(this.formInput('礼服返佣', 'dressCommission'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        list.push(this.formInput('摄影返佣', 'photoCommission'))
      } else {
        list.push(this.formInput('婚宴返佣', 'banquetCommission'))
        list.push(this.formInput('婚庆返佣', 'weddingCommission'))
      }
      list.push(this.formCustomerStatus())
      list.push(this.formCustomerId())
      list.push(this.formCustomerPhone())
      list.push(this.formChannel())
      list.push(this.formCategory())
      list.push(this.formAllotTime())
      list.push(this.formRecordeUserName())
      if (CrmUtil.getCompanyTag() == 'LMHS') {
        list.push(this.formActualStatus('礼服实时状态', 'dressStatus', configData.customerStatus))
        list.push(this.formOnceValid('礼服首次有效', 'reqDressOnceValid'))
      } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
        list.push(this.formActualStatus('摄影实时状态', 'photoStatus', configData.customerStatus))
        list.push(this.formOnceValid('摄影首次有效', 'reqPhotoOnceValid'))
      } else {
        list.push(this.formActualStatus('婚庆实时状态', 'weddingStatus', configData.customerStatus))
        list.push(this.formActualStatus('婚宴实时状态', 'banquetStatus', configData.customerStatus))
        list.push(this.formOnceValid('婚庆首次有效', 'reqWeddingOnceValid'))
        list.push(this.formOnceValid('婚宴首次有效', 'reqBanquetOnceValid'))
      }
    } else if (this.roleType == 1) {  // 需求列表
      list.push(this.formGroupCustomerId()) // 集团客户id
      list.push(this.formCustomerId())      // 客户编号
      list.push(this.formChannel())         // 客资来源
      list.push(this.formCustomerName())    // 客户姓名
      list.push(this.formCustomerPhone())   // 客资电话
      list.push(this.formCustomerWeChat())  // 客户微信
      list.push(this.formAllotTime())       // 入库时间
      list.push(this.formMultipleSelect('主营品类', 'category', configData.mainCategory))// 主营品类
      list.push(this.renderFormCascader("其他品类", "otherCategory", this.state.originValues?.otherCategory, configData?.otherCategory))// 其他品类
      list.push(this.formLeadsStatus())     // 客服状态
      list.push(this.renderFormRange("nextContactTime", "下次回访时间", this.state.originValues?.nextContactTime))// 下次回访时间
      list.push(this.formLeadsOwnerName())  // 客服
      list.push(this.formCustomerLevel())   // 客户级别
      list.push(this.formTeamName('项目协作成员', 'teamUserIds'))// 项目协作成员
      list.push(this.formCallStatus())      // 通话状态
      list.push(this.formLeadsFollowResult()) // 跟进结果
      list.push(this.formLeadsFollowTag())    // 客服级别
      list.push(this.renderFormRange("followTime", "最新沟通时间", this.state.originValues?.followTime))// 最新沟通时间
      list.push(this.formInput('最新沟通记录', 'followContent'))// 最新沟通记录
      list.push(this.formInput('预订酒店', 'hotel'))// 预订酒店
    } else if (this.roleType == 2) { // 邀约列表
      list.push(this.formGroupCustomerId()) // 集团客户id
      list.push(this.formCustomerId())      // 客户编号
      list.push(this.formChannel())         // 客资来源
      list.push(this.formCustomerName())    // 客户姓名
      list.push(this.formCustomerPhone())   // 客户电话
      list.push(this.formCustomerWeChat())  // 客户微信
      list.push(this.formAllotTime())       // 入库时间
      list.push(this.formMultipleSelect('主营品类', 'category', configData.mainCategory))// 主营品类
      list.push(this.renderFormCascader("其他品类", "otherCategory", this.state.originValues?.otherCategory, configData?.otherCategory))// 其他品类
      list.push(this.formMultipleSelect("其他品类实时状态", "otherCategoryStatus", configData.customerStatus))
      list.push(this.formMultipleSelect('邀约状态', 'reqStatus', configData.requirementPhase))// 邀约状态
      list.push(this.formRange('nextContactTime', '下次回访时间', this.state.originValues?.nextContactTime)) // 下次回访时间
      list.push(this.formReqOwnerName())    // 邀约人
      list.push(this.formCustomerLevel())   // 客户级别
      list.push(this.formTeamName('项目协作成员', 'teamUserIds'))// 项目协作成员
      list.push(this.formOnceValid('首次有效', 'reqOnceValid'))// 首次有效
      list.push(this.renderFormRange("firstValidTime", "首次有效时间", this.state.originValues?.firstValidTime))// 首次有效时间
      list.push(this.formRecordUserName())  // 提供人
      list.push(this.formReqFollowTag())    // 邀约级别
      list.push(this.formRange('followTime', '最新沟通时间', this.state.originValues?.followTime)) // 最新沟通时间
      list.push(this.formInput('最新沟通结果', 'followContent'))// 最新沟通结果
      list.push(this.formReqFollowResult()) // 跟进结果
      list.push(this.formInput('预订酒店', 'hotel'))// 预订酒店

    }
    return list;
  }

  formRange = (id: string, label: string, initialValue?: any) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue: initialValue })(
        <RangePicker style={{ width: '100%' }} />)}
    </FormItem>
  }

  handleNewCustomer = () => {
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    var pathName = ''
    if (this.roleType == 4) {//提供人列表
      pathName = '/bjRecoderList/newCustomer'
    } else if (this.roleType == 1) {//需求人列表
      pathName = '/bjLeadsList/newCustomer'
    } else if (this.roleType == 2) {//邀约列表
      pathName = '/bjReqList/newCustomer'
    }
    this.props.dispatch(routerRedux.push({
      pathname: pathName,
    }))
  }

  getRowClassName = (bean: CustomerListItem) => {
    try {
      if (this.roleType == 1 && bean.customer_status_id == 101) {
        return styles.lightRed   //客服未联系
      } else if (this.roleType == 2 && bean.customer_status_id == 200) {
        return styles.lightRed   //邀约未联系
      }
    } catch (e) { }
    return ''
  }

  /**
   * 单个分配
   * @param record 
   */
  handleAssignSingle = (record: CustomerListItem) => {
    this.setState({
      assignsModal: true,
      assigningRows: [record],
    })
  }

  /**
   * 批量分配
   */
  handleAssigns = () => {
    const limitCount = 100;
    const { selectedRows } = this.state;
    if (selectedRows.length > limitCount) {
      message.error({
        content: "分配数量最大不能超过" + limitCount + "条，当前已选" + selectedRows.length + "条。"
      })
      // Modal.warning({
      //   content: "分配数量最大不能超过" + limitCount + "条，当前已选" + selectedRows.length + "条。"
      // })
    } else {
      this.setState({
        assignsModal: true,
        assigningRows: this.state.selectedRows,
      })
    }
  }

  /**
   * 分配或批量分配，请求接口
   * @param ownerId 新的归属人
   */
  handleAssignSubmit = (ownerId: string) => {
    const { dispatch, sunnyListMode: { dataLeads, dataReqs } } = this.props;
    const pagination = this.roleType == 1 ? dataLeads?.pagination : this.roleType == 2 ? dataReqs?.pagination : undefined;
    const customerIds = this.state.assigningRows.map((item) => {
      return item.customer_id
    });

    dispatch({
      type: this.roleType == 1 ? 'sunnyListMode/transferCustomerLeads' : this.roleType == 2 ? "sunnyListMode/transferCustomerReq" : "",
      payload: {
        customerIds,
        ownerId,
      },
      success: () => {
        message.success("分配成功！");
        this.setState({
          assignsModal: false,
          assigningRows: [],
          selectedRows: [],
        })
        //刷新列表
        const page = pagination ? pagination.current : 1
        const pageSize = pagination ? pagination.pageSize : 20
        let params = {
          ...this.state.formValues,
          page,
          pageSize,
          type: this.roleType.toString(),
          isMy: this.isMy
        }
        dispatch({
          type: 'sunnyListMode/fetch',
          payload: params,
        });
      }
    });
  }

  render() {
    const {
      sunnyListMode: { dataRecorder, dataLeads, dataReqs, permission: { transfercustomerleads, transfercustomerreq } },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const data = this.roleType == 1 ? dataLeads : this.roleType == 2 ? dataReqs : this.roleType == 4 ? dataRecorder : undefined;
    let realColumns: CrmStandardTableColumnProps<CustomerListItem>[] = [
      ...this.columns
    ]
    if ((this.roleType == 1 && transfercustomerleads) || (this.roleType == 2 && transfercustomerreq)) {
      realColumns.push({
        title: "操作",
        fixed: 'right',
        disableSelect: true,
        render: (text: any, record: CustomerListItem) => <Fragment>
          {
            <a onClick={() => this.handleAssignSingle(record)}>分配</a>
          }
        </Fragment>
      })
    }

    return (
      <PageHeaderWrapper className={styles.innerHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>

            <CrmFilterForm
              expandable={true}
              retainFilterNumber={5}
              formItemList={this.renderFilterFormList()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={this.handleSearch}
            />
            <Divider style={{ marginBottom: 15 }} />
            {
              data && (
                <MyTable
                  loading={loading}
                  selectedRows={selectedRows}
                  selecteMode={((this.roleType == 1 && transfercustomerleads) || (this.roleType == 2 && transfercustomerreq)) ? 'checkbox' : undefined}
                  onRowsSelectChanged={this.handleSelectRows}
                  rowKey='customer_id'
                  data={data}
                  columns={realColumns}
                  onPaginationChanged={this.handleStandardTableChange}
                  columnsEditable={true}
                  rowClassName={this.getRowClassName}
                  renderTopButtons={
                    () => (
                      <div style={{ display: 'flex', width: '100%' }}>
                        {
                          (this.roleType == 1 || this.roleType == 2) && (
                            <Radio.Group style={{ flex: 1 }} defaultValue={1} buttonStyle="solid" onChange={this.handleChangeListTab}>
                              <Radio.Button value={1} key={1}>{"我的" + (this.roleType == 1 ? "客服" : "邀约") + "单"}</Radio.Button>
                              <Radio.Button value={0} key={0}>我的协作单</Radio.Button>
                            </Radio.Group >
                          )
                        }
                        <div style={{ flex: 1 }} />
                        {selectedRows.length > 0 &&
                          <Button style={{ marginRight: '10px' }} onClick={this.handleAssigns}>批量分配</Button>
                        }
                        <Button type="primary" onClick={this.handleNewCustomer}><PlusOutlined />新建客资</Button>
                      </div>
                    )
                  }
                />
              )
            }
            {
              this.state.assigningRows.length > 0 && <DistributeModal
                loading={loading}
                visibility={this.state.assignsModal}
                distributeRows={this.state.assigningRows}
                distributeStuffsOptions={this.props.sunnyListMode.searchUserData}
                onDistributeExecute={this.handleAssignSubmit}
                onDistributeCancel={() => {
                  this.setState({
                    assignsModal: false,
                    assigningRows: [],
                  })
                }}
              />
            }

            {/* {this.state.assignsModal && this.renderAssignModal()} */}
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

class MyTable extends CrmStandardTable<CustomerListItem>{ }
export default Form.create<TableListProps>()(TableList1);