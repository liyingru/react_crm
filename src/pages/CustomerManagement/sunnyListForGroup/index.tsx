import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Divider,
  TreeSelect,
} from 'antd';
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import styles from './style.less';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import LOCAL from '@/utils/LocalStorageKeys';
import { routerRedux } from 'dva/router';
import CrmStandardTable, { CrmStandardTableColumnProps, getCrmTableColumn } from '@/components/CrmStandardTable';
import CrmFilterForm from '@/components/CrmFilterForm';
import { PlusOutlined } from '@ant-design/icons';
import { ConfigListItem } from '../commondata';
import { CustomerListItem } from '../sunnyList/data';

const FormItem = Form.Item;
const { Option } = Select;

const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<any>>;
  loading: boolean;
  sunnyListGroupModel: StateType;
}

interface TableListState {
  formValues: { [key: string]: string | number };
  originValues: { [key: string]: string };
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    sunnyListGroupModel,
    loading,
  }: {
    sunnyListGroupModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sunnyListGroupModel,
    loading: loading.models.sunnyListGroupModel,
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  columns: CrmStandardTableColumnProps<CustomerListItem>[] = [];

  initColumnsData = () => {
    let columns: CrmStandardTableColumnProps<CustomerListItem>[] = [];
    const get = getCrmTableColumn;
    columns.push(get('group_customer_id', '集团客户id', {}, true))
    columns.push(get('customer_id', '客户编号', {
      render: (text, recoder) => <a onClick={() => this.onItemClick(recoder.customer_id + "")}>{text}</a>
    }))
    columns.push(get('company_name', '所在公司', {}, true))
    columns.push(get('channel', '渠道来源', {}, true))
    columns.push(get('category', '业务品类'))
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
    if (CrmUtil.getCompanyTag() == 'LMHS') {
      columns.push(get('order_dress_owner_name', '礼服销售'))
    } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
      columns.push(get('order_photo_owner_name', '摄影销售'))
    } else {
      columns.push(get('order_wedding_owner_name', '婚庆销售'))
      columns.push(get('order_banquet_owner_name', '婚宴销售'))
    }
    columns.push(get('customer_status', '客户实时状态'))
    columns.push(get('allot_time', '入库时间'))
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
      columns.push(get('req_dress_once_valid', '礼服历史有效'))
    } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
      columns.push(get('req_photo_once_valid', '摄影历史有效'))
    } else {
      columns.push(get('req_wedding_once_valid', '婚庆历史有效'))
      columns.push(get('req_banquet_once_valid', '婚宴历史有效'))
    }
    this.columns = columns;
  }

  state: TableListState = {
    formValues: {},
    originValues: {},
  };


  constructor(props: TableListProps) {
    super(props);
    this.initColumnsData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sunnyListGroupModel/fetch',
      payload: {
      }
    });
    dispatch({
      type: 'sunnyListGroupModel/config',
    });

    dispatch({
      type: 'sunnyListGroupModel/getUserPermissionList',
    });

    localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
  };

  componentWillReceiveProps(nextProps: any) {
    const isRefresh = localStorage ? localStorage.getItem('demandListRefreshTag')?.toString() : '';
    const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';
    if (isRefresh && isRefresh?.length > 0) {
      localStorage?.setItem('demandListRefreshTag', '')
      if (isRefresh == 'reset') {
        this.handleFormReset()
      } else if (isRefresh == "list") {
        this.requestListData();
      }
    } else if (autoRefresh === '1') {
      this.requestListData();
      localStorage?.setItem(LOCAL.AUTO_REFRESH, '0');
    }
  }

  /** 客户详情 */
  onItemClick = (customerId: string) => {
    const { dispatch } = this.props;
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');

    let pathname = window.location.href.substring(window.location.href.lastIndexOf('/') + 1) + '/detail_xp';
    dispatch(routerRedux.push({
      pathname,
      state: {
        customerId,
        showStyle: 4,
      }
    }));
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    const that = this;
    this.setState({
      formValues: {},
      originValues: {},
    }, () => {
      that.requestListData();
    });
  };


  requestListData = () => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'sunnyListGroupModel/fetch',
      payload: formValues,
    });
  }

  /** 切换翻页时 */
  handlePageChange = (
    page: number, pageSize: number
  ) => {
    const { formValues } = this.state;
    //状态
    const params = {
      ...formValues,
      page,
      pageSize
    };
    this.setState({
      formValues: params
    }, () => {
      this.requestListData();
    })
  };

  handleSearch = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      delete fieldsValue['customize_columns']
      this.setState({
        originValues: fieldsValue,
      })

      //表单信息和状态
      const params = {
        ...fieldsValue,
      };

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
      this.mulitSelectFormat('reqWeddingStatus', params, fieldsValue)
      this.mulitSelectFormat('customerStatus', params, fieldsValue)

      const autoRefresh = localStorage ? localStorage.getItem(LOCAL.AUTO_REFRESH) : '';

      //取出分页信息
      const { sunnyListGroupModel: { data } } = this.props;
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
      }, () => {
        this.requestListData();
      });

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
    let { config: configData } = this.props.sunnyListGroupModel;
    return <FormItem label="客户级别">
      {getFieldDecorator('customerLevel', {
        initialValue: this.state.originValues?.customerLevel
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData?.customerLevel?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formBanquetValid = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚宴历史有效">
      {getFieldDecorator('reqBanquetOnceValid', {
        initialValue: this.state.originValues?.reqBanquetOnceValid
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1} key={1}>历史有效</Option>
        </Select>
      )}
    </FormItem>
  }

  formWeddingValid = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚庆历史有效">
      {getFieldDecorator('reqWeddingOnceValid', {
        initialValue: this.state.originValues?.reqWeddingOnceValid
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1} key={1}>历史有效</Option>
        </Select>
      )}
    </FormItem>
  }

  formCustomerStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListGroupModel;
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
            configData?.customerStatus?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formChannel = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData, } = this.props.sunnyListGroupModel;
    if (configData && configData.bjRolechannel && configData.bjRolechannel.length > 0) {
      configData.bjRolechannel.forEach(item => {
        item['key'] = item.value
      })
    }
    return <FormItem label="渠道来源">
      {getFieldDecorator('channel', {
        initialValue: this.state.originValues?.channel
      })(
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={configData?.bjRolechannel}
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
    let { config: configData } = this.props.sunnyListGroupModel;
    if (configData && configData.category2.length > 0) {
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
          treeData={configData ? configData.category2 : undefined}
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

  /**
   * 集团客户id-筛选项
   */
  formGroupCustomerId = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="集团客户id">
      {getFieldDecorator('groupCustomerId', {
        initialValue: this.state.originValues?.groupCustomerId
      })(<Input placeholder="请输入集团客户id" />)}
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
    let { config: configData } = this.props.sunnyListGroupModel;
    return <FormItem label="跟进结果">
      {getFieldDecorator('followResult', {
        initialValue: this.state.originValues?.followResult
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData && configData.leadsFollowStatus?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formReqFollowResult = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListGroupModel;
    return <FormItem label="跟进结果">
      {getFieldDecorator('followResult', {
        initialValue: this.state.originValues?.followResult
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData && configData.requirementFollowStatus?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formLeadsFollowTag = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListGroupModel;
    return <FormItem label="客服级别">
      {getFieldDecorator('followTag', {
        initialValue: this.state.originValues?.followTag
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData && configData.leadsFollowTag?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formReqFollowTag = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListGroupModel;
    return <FormItem label="邀约级别">
      {getFieldDecorator('followTag', {
        initialValue: this.state.originValues?.followTag
      })(
        <Select placeholder="请选择" allowClear>
          {
            configData && configData.requirementFollowTag?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
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
    let { config: configData } = this.props.sunnyListGroupModel;
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
            configData && configData.leadsStatus?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formBanquetStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListGroupModel;
    return <FormItem label="婚宴邀约状态">
      {getFieldDecorator('reqBanquetStatus', {
        initialValue: this.state.originValues?.banquetStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            configData && configData.requirementPhase?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formWeddingStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config: configData } = this.props.sunnyListGroupModel;
    return <FormItem label="婚庆邀约状态">
      {getFieldDecorator('reqWeddingStatus', {
        initialValue: this.state.originValues?.weddingStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            configData && configData.requirementPhase?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  formReqBanquetOnceValid = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚宴历史有效">
      {getFieldDecorator('reqBanquetOnceValid', {
        initialValue: this.state.originValues?.reqBanquetOnceValid
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1}>历史有效</Option>
        </Select>,
      )}
    </FormItem>
  }

  formReqWeddingOnceValid = () => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label="婚庆历史有效">
      {getFieldDecorator('reqWeddingOnceValid', {
        initialValue: this.state.originValues?.reqWeddingOnceValid
      })(
        <Select placeholder="请选择" allowClear>
          <Option value={1}>历史有效</Option>
        </Select>,
      )}
    </FormItem>
  }

  /**
   * 所在公司-筛选项
   */
  formCompany = () => {
    let { getFieldDecorator } = this.props.form;
    let { config } = this.props.sunnyListGroupModel;
    return <FormItem label="所在公司">
      {
        getFieldDecorator('companyId', {
          initialValue: this.state.originValues?.companyId
        })(
          <Select placeholder="请选择" allowClear>
            {
              config && config.nbCompany && config.nbCompany.map(company => (
                <Option value={company.id}>{company.name}</Option>
              ))
            }
          </Select>
        )
      }
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

  formInput = (title: string, formId: string) => {
    let { getFieldDecorator } = this.props.form;
    return <FormItem label={title}>
      {getFieldDecorator(formId, {
        initialValue: this.state.originValues[formId]
      })(<Input placeholder="请输入" />)}
    </FormItem>
  }

  /**
   * 实时状态（多选）
   */
  formActualStatus = (name: string, id: string, options: ConfigListItem[] | undefined) => {
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
              <Option value={value.id}>{value.name}</Option>))
          }
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
          <Option value={1} key={1}>历史有效</Option>
        </Select>
      )}
    </FormItem>
  }

  /**
   * 婚庆实时状态（多选）
   */
  formWeddingActualStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config } = this.props.sunnyListGroupModel;
    return <FormItem label="婚庆实时状态">
      {getFieldDecorator('weddingStatus', {
        initialValue: this.state.originValues?.weddingStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            config?.customerStatus?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  /**
   * 婚宴实时状态（多选）
   */
  formBanquetActualStatus = () => {
    let { getFieldDecorator } = this.props.form;
    let { config } = this.props.sunnyListGroupModel;
    return <FormItem label="婚宴实时状态">
      {getFieldDecorator('banquetStatus', {
        initialValue: this.state.originValues?.banquetStatus
      })(
        <Select
          placeholder="请选择(多选)"
          mode="multiple"
          showSearch
          allowClear
          optionFilterProp="children" >
          {
            config?.customerStatus?.map(value => (
              <Option value={value.id}>{value.name}</Option>))
          }
        </Select>
      )}
    </FormItem>
  }

  renderFilterFormList = () => {
    const { sunnyListGroupModel: { config: configData } } = this.props;
    let list = [
      this.formCustomerName()
    ];

    if (CrmUtil.getCompanyTag() == 'LMHS') {
      list.push(this.formInput('礼服返佣', 'dressCommission'))
    } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
      list.push(this.formInput('摄影返佣', 'photoCommission'))
    } else {
      list.push(this.formInput('婚宴返佣', 'banquetCommission'))
      list.push(this.formInput('婚庆返佣', 'weddingCommission'))
    }

    list.push(...[
      this.formCustomerStatus(),
      this.formGroupCustomerId(),
      this.formCustomerId(),
      this.formCustomerPhone(),
      this.formChannel(),
      this.formCategory(),
      this.formAllotTime(),
      this.formCompany(),
      this.formRecordeUserName(),
    ])

    if (CrmUtil.getCompanyTag() == 'LMHS') {
      list.push(this.formActualStatus('礼服实时状态', 'dressStatus', configData?.customerStatus))
      list.push(this.formOnceValid('礼服历史有效', 'reqDressOnceValid'))
    } else if (CrmUtil.getCompanyTag() == 'BJHSSY') {
      list.push(this.formActualStatus('摄影实时状态', 'photoStatus', configData?.customerStatus))
      list.push(this.formOnceValid('摄影历史有效', 'reqPhotoOnceValid'))
    } else {
      list.push(this.formActualStatus('婚庆实时状态', 'weddingStatus', configData?.customerStatus))
      list.push(this.formActualStatus('婚宴实时状态', 'banquetStatus', configData?.customerStatus))
      list.push(this.formOnceValid('婚庆历史有效', 'reqWeddingOnceValid'))
      list.push(this.formOnceValid('婚宴历史有效', 'reqBanquetOnceValid'))
    }
    return list;
  }

  /**
   * 跳转到-新建客资
   */
  handleNewCustomer = () => {
    localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
    const pathName = window.location.pathname + '/newCustomer';
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: pathName,
    }))
  }


  render() {
    const {
      sunnyListGroupModel: { config: configData, data },
      loading,
    } = this.props;

    var configLeadsStatus: any[] = []
    var configReqStatus: any[] = []
    if (configData && configData.leadsStatus.length > 0) {
      configLeadsStatus = [...configData.leadsStatus]
      configLeadsStatus.unshift({ id: '', name: '全部', value: '', label: '', pid: '', children: [] })
    }
    if (configData && configData.requirementPhase.length > 0) {
      configReqStatus = [...configData.requirementPhase]
      configReqStatus.unshift({ id: '', name: '全部', value: '', label: '', pid: '', children: [] })
    }

    return (
      <PageHeaderWrapper className={styles.innerHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>

            <CrmFilterForm
              formItemList={this.renderFilterFormList()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={this.handleSearch}
            />

            <Divider style={{ marginBottom: 15 }} />

            {
              data && (
                <MyTable
                  loading={loading}
                  data={data}
                  columns={this.columns}
                  onPaginationChanged={this.handlePageChange}
                  columnsEditable={true}
                  renderTopButtons={
                    () => (
                      <>
                        <Button type="primary" onClick={this.handleNewCustomer}><PlusOutlined />新建客资</Button>
                      </>
                    )
                  }
                />
              )
            }
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
