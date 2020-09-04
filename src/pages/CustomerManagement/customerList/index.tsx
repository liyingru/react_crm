import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Radio,
  Modal,
  Divider,
  Popover,
  Cascader,
  message,
} from 'antd';
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import { CustomerListItem, CustomerField, RequirementEntity } from './data.d';
import styles from './style.less';

import { RadioChangeEvent } from 'antd/lib/radio';
import { KeepAlive } from 'umi';
import CrmUtil from '@/utils/UserInfoStorage';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import LOCAL from '@/utils/LocalStorageKeys';
import { routerRedux } from 'dva/router';
import Search from 'antd/lib/input/Search';
import CrmFilterForm from '@/components/CrmFilterForm';
import CrmStandardTable, { CrmStandardTableColumnProps, getCrmTableColumn } from '@/components/CrmStandardTable';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;

const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customerManagementMode/fetch'
      | 'customerManagementMode/config'
      | 'customerManagementMode/fields'
      | 'customerManagementMode/getMessageConfigHandel'
      | 'customerManagementMode/getUserPermissionList'
      | 'customerManagementMode/batchUpdateCustomer'
      | 'customerManagementMode/router'
      | 'customerManagementMode/startDuplicateCustomer'
      | 'customerManagementMode/fetchRole'
      | 'customerManagementMode/getDistributePeopleConifgInfo'
    >
  >;
  loading: boolean;
  customerManagementMode: StateType;
}

interface TableListState {
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: CustomerListItem[];
  formValues: { [key: string]: string };
  resetArea: boolean;
  fieldsState: any;
  originValues: { [key: string]: string };
  isShowFilter: boolean;
  messageVisible: boolean;
  channelMessage: any;
  referrerName: string;
  reqName: string;
  customerIds: any;
  myCreatedTag: string;
  radio: any;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    customerManagementMode,
    loading,
  }: {
    customerManagementMode: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerManagementMode,
    loading: loading.models.customerManagementMode,
  }),
)

class TableList extends Component<TableListProps, TableListState> {

  currentUserInfo: any = CrmUtil.getUserInfo() || {};

  searchType = 'reqNum';
  searchNumValue = '';

  requireRender = (requirement: RequirementEntity) => (
    <span>
      {
        requirement && !requirement['reqNormalNum'] ? '' : <div>有效单({requirement['reqNormalNum']}条)</div>
      }
      {
        requirement && !requirement['reqCloseNum'] ? '' : <div>无效单({requirement['reqCloseNum']}条)</div>
      }
    </span>
  );

  generateStandardTableColumnProps = (): CrmStandardTableColumnProps<CustomerListItem>[] => {
    const columns: CrmStandardTableColumnProps<CustomerListItem>[] = [];
    const get = getCrmTableColumn;
    columns.push(get('group_customer_id', '集团客户ID'));
    columns.push(get('id', '客户编号', {
      render: (text, record) => <a onClick={() => this.onItemClick(record)}>{text}</a>
    }))
    columns.push(get('name', '客户姓名', {}, true))
    columns.push(get('phone', '客户电话', {}, true))
    columns.push(get('wechat', '客户微信'))
    columns.push(get('channel', '客户来源'))
    columns.push(get('level', '客户级别'))
    columns.push(get('status', '客户状态'))
    if (CrmUtil.getCompanyType() != 2) {
      columns.push(get('category', '业务品类', {
        render: (text) => <div style={{ clear: 'both', }}>
          <Popover content={text} placement='left' trigger="hover">
            <div className={styles.textellipsis}>{text}</div>
          </Popover>
        </div>
      }))
    }
    columns.push(get('live_city_info', '客户城市'))
    columns.push(get('wedding_date', '婚期'))
    columns.push(get('create_user', '创建人'))
    columns.push(get('create_time', '创建时间'))
    columns.push(get('referrer_name', '提供人'))
    columns.push(get('sign_date', '签单时间'))
    columns.push(get('sign_amount', '合同签单总金额'))
    columns.push(get('receivables_amount', '回款总金额'))
    columns.push(get('requirement', '有效单合计', {
      render: (text: any, record) => this.requireRender(text)
    }))
    columns.push(get('follow_time', '最新跟进时间'))
    columns.push(get('follow_status', '最新跟进结果'))
    columns.push(get('follow_tag', CrmUtil.getCompanyType() == 1 ? '最新呼叫结果' : '最新跟进标签'))
    columns.push(get('follow_content', '最新跟进内容'))
    columns.push(get('repeat_status', '合并标识'))
    columns.push(get('action', '操作', {
      fixed: "right",
      render: (text: any, record) => <a onClick={() => this.onItemClick(record)}>查看</a>
    }))
    return columns;
  }

  columns: CrmStandardTableColumnProps<CustomerListItem>[] = this.generateStandardTableColumnProps();

  followTag = '';

  getCategoryColumn = () => {
    let columnString = localStorage.getItem('categoryColumn')
    if (columnString) {
      let collocal = JSON.parse(columnString) as CustomerField[]
      if (collocal) {
        let data = collocal.flatMap(value => value.data).filter(item => (item.isSelected == 1))
        return data.map(item => this.getStandardTableColumnProps(item.id, item.name))
      }
    }
  }

  getCategoryFields = () => {
    let columnString = localStorage.getItem('categoryColumn')
    if (columnString) {
      let collocal = JSON.parse(columnString) as CustomerField[]
      if (collocal) {
        return collocal
      }
    }
  }

  getFieldState = () => {
    const { fields } = this.props.customerManagementMode
    const localList = this.getCategoryFields()

    return fields.map(item => {
      let checkedlist = this.getCheckedList(item, localList);
      let plainOptions = item.data.map(v => v.id)
      return {
        id: item.id,
        checkedList: checkedlist,
        indeterminate: !!checkedlist.length && checkedlist.length < plainOptions.length,
        checkAll: checkedlist.length === plainOptions.length,
      }
    })
  }

  state: TableListState = {
    updateModalVisible: false,
    expandForm: true,
    selectedRows: [],
    formValues: {},
    resetArea: false,
    fieldsState: this.getFieldState(),
    originValues: {},
    isShowFilter: true,
    messageVisible: false,
    channelMessage: '',
    referrerName: '', // 提供人
    reqName: '',  // 邀约人
    customerIds: [],
    myCreatedTag: '1',
    radio: 1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagementMode/fetch',
      payload: {
        followTag: this.followTag,
        isRecord: this.state.myCreatedTag,
      }
    });
    dispatch({
      type: 'customerManagementMode/config',
    });
    dispatch({
      type: 'customerManagementMode/fields'
    });
    dispatch({
      type: 'customerManagementMode/getUserPermissionList',
    });
    // 拉取搜索用户
    dispatch({
      type: 'customerManagementMode/getDistributePeopleConifgInfo',
    });
  };


  componentWillReceiveProps(nextProps: any) {
    var isRefresh = localStorage ? localStorage.getItem('demandListRefreshTag')?.toString() : '';
    if (isRefresh && isRefresh?.length > 0) {
      localStorage?.setItem('demandListRefreshTag', '')
      if (isRefresh == 'reset') {
        this.handleFormReset()
      }
    }
  }

  getCheckedList(item: CustomerField, localList: CustomerField[] | undefined) {
    let arr: string[] = [];
    if (localList) {
      let checkItem = localList.find(value => {
        return item.id == value.id
      })
      if (checkItem) {
        arr = checkItem.data.filter(f => f.isSelected).map(v => v.id)
        if (arr) {
          return arr
        }
      }
    }
    return arr
  }

  areaSelectChange = (codes: string[]) => {
    this.props.form.setFieldsValue({
      city: codes + ""
    })
  }

  onItemClick = (bean: CustomerListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagementMode/router',
      payload: {
        pathname: '/customer/customerManagement/customerDetail',
        params: {
          customerId: bean.id
        }
      }
    })
  }

  handleSimpleSearch = (value) => {
    const { form, dispatch } = this.props;
    form.resetFields();
    let params = {
      followTag: this.followTag,
    };
    const that = this;
    this.setState({
      formValues: params,
      resetArea: true,
      originValues: {},
    }, () => {
      that.state.resetArea = false;
    });
    // if (this.searchNumValue != '') {
    //   params[this.searchType] = this.searchNumValue
    // }
    params[this.searchType] = value
    dispatch({
      type: 'customerManagementMode/fetch',
      payload: params,
    });
  }

  onNumChanged = (e: any) => {
    this.searchNumValue = e.target.value.trim()
  }

  searchTypeSelected = (value: any) => {
    this.searchType = value
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    let params = {
      followTag: this.followTag,
      isRecord: this.state.myCreatedTag,
    };
    const that = this;
    this.setState({
      formValues: params,
      resetArea: true,
      originValues: {},
    }, () => {
      that.state.resetArea = false;
    });
    dispatch({
      type: 'customerManagementMode/fetch',
      payload: params,
    });
  };

  handleSelectRows = (rows: CustomerListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  requestListData = () => {
    let { dispatch, form, customerManagementMode: { data } } = this.props;
    const { formValues } = this.state;
    let params = {
      ...formValues,
      followTag: this.followTag,
      isRecord: this.state.myCreatedTag,
    };

    dispatch({
      type: 'customerManagementMode/fetch',
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
      followTag: this.followTag,
      isRecord: this.state.myCreatedTag,
    };

    //分页信息
    params['page'] = page;
    params['pageSize'] = pageSize;

    dispatch({
      type: 'customerManagementMode/fetch',
      payload: params,
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        originValues: fieldsValue,
      })

      //表单信息和状态
      const params = {
        ...fieldsValue,
        followTag: this.followTag,
        isRecord: this.state.myCreatedTag,
      };
      //取出起始和结束时间
      let transfer_range_time = fieldsValue['create_range_time']
      if (transfer_range_time !== undefined && transfer_range_time != '') {
        delete params['create_range_time']
        params['createStartTime'] = moment(transfer_range_time[0]).format('YYYY-MM-DD');
        params['createEndTime'] = moment(transfer_range_time[1]).format('YYYY-MM-DD');
      }

      //取出起始和结束时间
      let date_range_time = fieldsValue['date_range_time']
      if (date_range_time !== undefined && date_range_time != '') {
        delete params['date_range_time']
        params['weddingStartTime'] = moment(date_range_time[0]).format('YYYY-MM-DD');
        params['weddingEndTime'] = moment(date_range_time[1]).format('YYYY-MM-DD');
      }

      const channelArr = fieldsValue['channel']
      if (channelArr !== undefined && channelArr.length > 0) {
        delete params['channel']
        if (channelArr.length > 0) {
          params['channel'] = channelArr[channelArr.length - 1]
        }
      }

      const categoryArr = fieldsValue['category']
      if (categoryArr !== undefined && categoryArr.length > 0) {
        delete params['category']
        if (categoryArr.length > 0) {
          params['category'] = categoryArr[categoryArr.length - 1]
        }
      }

      this.mulitSelectFormat('leadsOwnerIds', params, fieldsValue)
      this.mulitSelectFormat('reqOwnerIds', params, fieldsValue)
      this.mulitSelectFormat('orderOwnerIds', params, fieldsValue)
      this.mulitSelectFormat('createByIds', params, fieldsValue)
      this.mulitSelectFormat('recordUserIds', params, fieldsValue)

      //取出分页信息
      const { customerManagementMode: { data } } = this.props;
      const { pagination } = data;
      if (pagination !== undefined) {
        // params['page'] = pagination.current;
        params['page'] = 1;
        params['pageSize'] = pagination.pageSize;
      }

      this.setState({
        formValues: params
      });

      dispatch({
        type: 'customerManagementMode/fetch',
        payload: params,
      });
    });
  };

  mulitSelectFormat = (prop: string, values: any, fieldsValue: any) => {
    const formValue = fieldsValue[prop]
    delete values[prop]
    if (formValue !== undefined && formValue != '' && formValue.length > 0) {
      values[prop] = formValue + ''
    }
  }

  handleFollowTag = (event: RadioChangeEvent) => {
    this.followTag = event.target.value
    this.requestListData()
  }

  renderFilterForm() {
    let { getFieldDecorator } = this.props.form;
    let { config: configData, distributePeopleConifg } = this.props.customerManagementMode;
    const formItemList: JSX.Element[] = new Array();
    formItemList.push(
      <FormItem label="业务城市">
        {getFieldDecorator('city', {
          initialValue: this.state.originValues?.city
        })(
          <CityMultipleSelect reset={this.state.resetArea} citySelectChange={this.areaSelectChange} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客资来源">
        {getFieldDecorator('channel', {
          initialValue: this.state.originValues?.channel
        })(
          <Cascader showSearch style={{ width: '100%', }} options={configData.channel} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="创建时间">
        {getFieldDecorator('create_range_time', {
          initialValue: this.state.originValues?.create_range_time
        })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户姓名">
        {getFieldDecorator('customerName', {
          initialValue: this.state.originValues?.customerName
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户编号">
        {getFieldDecorator('customerId', {
          initialValue: this.state.originValues?.customerId
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="业务品类">
        {getFieldDecorator('category', {
          initialValue: this.state.originValues?.category
        })(
          <Cascader
            placeholder="请选择"
            changeOnSelect
            style={{ width: '100%', }}
            options={configData.category2} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="婚期">
        {getFieldDecorator('date_range_time', {
          initialValue: this.state.originValues?.date_range_time
        })(
          <RangePicker style={{ width: '100%' }} />
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户电话">
        {getFieldDecorator('phone', {
          rules: [{ required: false, pattern: new RegExp(/^-?[0-9]*(\.[0-9]*)?$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
            return event.target.value.replace(/\D/g, '')
          },
          initialValue: this.state.originValues?.phone
        })(<Input placeholder="请输入" maxLength={11} />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="客户微信">
        {getFieldDecorator('weChat', {
          initialValue: this.state.originValues?.weChat
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="合并标识">
        {getFieldDecorator('repeatStatus', {
          initialValue: this.state.originValues?.repeatStatus
        })(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {
              configData.customerRepeatStatus?.map(value => (
                <Option value={value.id}>{value.name}</Option>))
            }
          </Select>
        )}
      </FormItem>
    );
    formItemList.push(
      <FormItem label="负责客服">
        {getFieldDecorator('leadsOwnerIds', { initialValue: this.state.originValues?.leadsOwnerIds, })(
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="children"
            style={{ width: '100%', marginLeft: '5px' }}
            placeholder="请选择负责客服">
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
      <FormItem label="负责邀约">
        {getFieldDecorator('reqOwnerIds', { initialValue: this.state.originValues?.reqOwnerIds })(
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="children"
            style={{ width: '100%', marginLeft: '5px' }}
            placeholder="请选择邀约人">
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
      <FormItem label="负责销售">
        {getFieldDecorator('orderOwnerIds', { initialValue: this.state.originValues?.orderOwnerIds })(
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="children"
            style={{ width: '100%', marginLeft: '5px' }}
            placeholder="请选择销售">
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
      <FormItem label="创建人">
        {getFieldDecorator('createByIds', { initialValue: this.state.originValues?.createByIds })(
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="children"
            style={{ width: '100%', marginLeft: '5px' }}
            placeholder="请选择创建人">
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
    if (CrmUtil.getCompanyType() == 2) {
      formItemList.push(
        <FormItem label="提供人">
          {getFieldDecorator('recordUserIds', { initialValue: this.state.originValues?.recordUserIds })(
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              style={{ width: '100%', marginLeft: '5px' }}
              placeholder="请选择提供人">
              {
                distributePeopleConifg && distributePeopleConifg.map(config => (
                  <Option value={config.id}>{config.name}</Option>))
              }
            </Select>
          )}
        </FormItem>
      );
    }
    return formItemList;
  }

  /**
   * 进入客户重单发起页
   */
  handleDuplicate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagementMode/startDuplicateCustomer'
    });
  };

  showMessage = () => {
    const { dispatch } = this.props;
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    let currentUserInfo;
    try {
      if (currentUserInfoStr) {
        currentUserInfo = JSON.parse(currentUserInfoStr);
      }
    } catch (e) {
      currentUserInfo = currentUserInfoStr;
    }
    const currentCompanyId = currentUserInfo && currentUserInfo.company_id;
    const filter = {
      company_id: currentCompanyId
    }
    const op = {};
    for (let key in filter) {
      if (key == 'company_id') {
        op[key] = '=';
      } else {
        op[key] = 'IN';
      }
    }

    dispatch({
      type: 'customerManagementMode/fetchRole',
      payload: {
        page: 1,
        pageSize: 1000,
        filter,
        op,
      }
    });

    dispatch({
      type: 'customerManagementMode/getMessageConfigHandel',
      payload: {
        isAll: 1
      }
    })
    this.setState({
      messageVisible: true,
    }, () => {
      this.state.channelMessage = ''
      this.state.referrerName = ''
      this.state.reqName = ''
    });
  };

  handleMessageOk = (e: any) => {
    const { dispatch } = this.props;
    const { channelMessage, referrerName, selectedRows, customerIds, reqName, radio } = this.state;
    selectedRows && selectedRows.map(item => {
      this.setState({
        customerIds: this.state.customerIds.push(item.id)
      })
    })
    const self = this;
    dispatch({
      type: 'customerManagementMode/batchUpdateCustomer',
      payload: {
        customerIds,
        channel: channelMessage ? channelMessage.pop() : '',
        recordUserId: referrerName,
        reqOwnerId: reqName,
        followStatus: radio
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success('操作成功');
          self.setState({
            selectedRows: [],
            customerIds: [],
            channelMessage: null,
            referrerName: null,
            reqName: null
          })
          self.requestListData()
        }
      }
    });
    this.setState({
      messageVisible: false,
    })
  };

  handleMessageCancel = (e: any) => {
    this.setState({
      messageVisible: false,
    });
  };

  //更改来源
  onChannelChange = (value: any) => {
    this.setState({
      channelMessage: value
    })
  }

  onChangeName = (roleId: any) => {
    this.setState({ referrerName: roleId })
  }

  onChangeReq = (reqId: any) => {
    this.setState({ reqName: reqId })
  }

  onRadioChange = (e: any) => {
    console.log('radio checked', e.target.value);
    this.setState({
      radio: e.target.value,
    });
  };

  clientClick = (e: RadioChangeEvent) => {
    this.setState({
      myCreatedTag: e.target.value,
      isShowFilter: true,
      selectedRows: [],
    }, () => {
      this.handleFormReset();
    })
  }

  handleNewLeads = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/customer/customerManagement/newCustomer',
    }))
  }

  render() {
    const {
      customerManagementMode: { config: configData, data, fields, messageConfig, permission, roleData },
      loading,
    } = this.props;
    const { selectedRows, fieldsState, referrerName, channelMessage, reqName } = this.state;

    let company_tag = this.currentUserInfo.company_tag
    company_tag = CrmUtil.getCompanyType() == 2;

    window.localStorage.setItem('permission', JSON.stringify(permission))

    if (fields.length != 0 && fieldsState.length == 0) {
      this.setState({
        fieldsState: this.getFieldState()
      })
    }
    const selectBefore = (
      <Select defaultValue="reqNum" onSelect={this.searchTypeSelected} style={{ width: 100 }}>
        <Option value="reqNum">有效单编号</Option>
        <Option value="orderNum">订单编号</Option>
        <Option value="leadsNum">线索编号</Option>
      </Select>
    );
    const { myCreatedTag } = this.state;
    return (
      <PageHeaderWrapper title={
        <Radio.Group buttonStyle="solid" defaultValue="1" onChange={this.clientClick}>
          <Radio.Button value="1">我提供的客户</Radio.Button>
          {
            permission.allcustomer && <Radio.Button value="">全部客户</Radio.Button>
          }
        </Radio.Group>
      } className={styles.innerHeader}>
        <Card bordered={false}>

          <div >
            <CrmFilterForm
              expandable={true}
              retainFilterNumber={3}
              formItemList={this.renderFilterForm()}
              onFilterReset={this.handleFormReset}
              onFilterSearch={this.handleSearch}
              renderFilterTop={
                () => (
                  !(myCreatedTag == '1') && <Search addonBefore={selectBefore} onSearch={this.handleSimpleSearch} style={{ marginLeft: 10, width: 300 }} placeholder="请输入编号" onChange={this.onNumChanged} />
                )
              }
            />

            <Divider style={{ marginBottom: 15 }} />

            <MyTable
              rowKey="id"
              loading={loading}
              data={data}
              columns={this.columns}
              onPaginationChanged={this.handleStandardTableChange}
              columnsEditable={true}
              // selecteMode="checkbox"
              // selectedRows={selectedRows}
              // onRowsSelectChanged={this.handleSelectRows}
              renderTopButtons={
                () => (
                  <div style={{ display: 'flex', width: '100%' }}>
                    <Radio.Group defaultValue='' buttonStyle="solid" onChange={this.handleFollowTag}>
                      {
                        configData.requirementFollowTag.map(value => (
                          <Radio.Button value={value.id}>{value.name}</Radio.Button>))
                      }
                    </Radio.Group>
                    <div style={{ flex: 1 }} />
                    <Button type="primary" onClick={this.handleNewLeads}><PlusOutlined />新建客资</Button>
                    {/* {selectedRows.length > 0 && company_tag && permission && permission.customeradapter_batchupdatecustomer && <Button style={{ marginLeft: 10 }} onClick={this.showMessage}>信息变更</Button>} */}
                    <Button style={{ marginLeft: 10 }} onClick={this.handleDuplicate}>客户重复</Button>
                  </div>
                )
              }
            />
          </div>
        </Card>
        {
          <Modal
            title="变更客户信息"
            visible={this.state.messageVisible}
            onOk={this.handleMessageOk}
            onCancel={this.handleMessageCancel}
          >
            <p>本次已选择：{selectedRows.length}位客户</p>
            <div className={styles.sucessStyle}>
              <span>更改来源:</span>
              <Cascader
                onChange={this.onChannelChange}
                placeholder="请选择客资来源"
                value={channelMessage}
                showSearch
                style={{
                  width: 200
                }}
                options={messageConfig}
              />
            </div>
            <div className={styles.sucessStyle} style={{ marginTop: 20 }}>
              <span>更改提供人:</span>
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder="请选择提供人"
                allowClear
                optionLabelProp="label"
                onChange={this.onChangeName}
                value={referrerName}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {roleData && roleData.map((item: any) =>
                  <Option value={item.id} label={item.name}>{item.name}</Option>)}
              </Select>
            </div>
            <div className={styles.sucessStyle} style={{ marginTop: 20 }}>
              <span>更改邀约人:</span>
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder="请选择邀约人"
                allowClear
                optionLabelProp="label"
                onChange={this.onChangeReq}
                value={reqName}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {roleData && roleData.map((item: any) =>
                  <Option value={item.id} label={item.name}>{item.name}</Option>)}
              </Select>
            </div>
            <div style={{ marginTop: 20 }}>
              <span style={{ marginRight: 20 }}>历史跟进记录:</span>
              <Radio.Group onChange={this.onRadioChange} value={this.state.radio}>
                <Radio value={1}>保留</Radio>
                <Radio value={0}>不保留</Radio>
              </Radio.Group>
            </div>
          </Modal>
        }
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
