import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Modal,
  message,
  Icon,
  Row,
  Col,
  Steps,
  Divider,
  Descriptions,
  Result,
  Spin
} from 'antd';
const { Step } = Steps;
import React, { Component } from 'react';
import moment from 'moment';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import styles from './style.less';
import IntentionalDemand from './components/IntentionalDemand';
import React from 'react';
import { Merchant, CustomerLisItem } from './data';
import { routerRedux } from 'dva/router';
import { CustomerData, ContractEntity, RequirementBean } from '@/pages/CustomerManagement/customerDetail/data';
import CustomerRepeatConfirmModal from '@/components/CustomerRepeatConfirmModal';
import { productInfo } from '../../OrderManagement/newContractNew/data';
import { ColumnProps } from 'antd/lib/table';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';
import PageLoadingSelect, { PaginationFake } from './components/PageLoadingSelect';
import { SelectValue } from 'antd/lib/select';
import CrmUtil from '@/utils/UserInfoStorage';
import customerList from '@/pages/CustomerManagement/customerList';
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;

export function concatArray(arr1, arr2) {
  let newArr = Array.prototype.concat.apply(arr1, arr2)//没有去重复的新数组
  return Array.from(new Set(newArr))
}

export function concatProductArray(arr1, arr2) {
  for (var i = 0; i < arr2.length; i++) {
    for (var j = 0; j < arr1.length; j++) {
      if (arr2[i].id == arr1[j].id) {
        arr1.splice(j, 1);
      }
    }
  }
  arr2 = arr2.concat(arr1);
  return arr2
}

interface OrderTableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'getOrderAndOrderList/reset'
      | 'getOrderAndOrderList/newCustomer'
      | 'getOrderAndOrderList/search'
      | 'getOrderAndOrderList/claimOrder'
      | 'getOrderAndOrderList/orderManagementPage'
    >
  >;
  loading: boolean;
  submitting: boolean;
  getOrderAndOrderList: StateType;
}
//构建state类型
interface pageState {
  province: string;
  city: string;
  cityCode: string;
  district: string;
  options: string;
  isChildData: boolean;
  bizContent: Object;
  getCustomerName: Object;
  currentStep: number;
  isStartTransfer: boolean;//是否有转让操作
  modalVisible: boolean;
  orderId: string;
  weddingDay: string;
  customerName: string;
  customerId: string | undefined;
  phone: string;
  reqId: string | undefined;
  category: string | undefined;
  selectedMerchants: Merchant[];
  selectedProductsList: productInfo[];
  selecteCompanys: { id: string, name: string }[];
  fieldsValidateResult: boolean;
  orderSuccessMsg: string | undefined;
  company_tag: string;
  company_id: string;
  customerList: CustomerLisItem[];
  selectingCustomer: any;
  targetSimilarCustomer: any;
  confirmVisible: boolean;
  bindedCustomerValue: string | undefined;
  merchantsList: Merchant[];
  setNoMoreCustomersData: boolean;
  setNoMoreMerchantsData: boolean;
  setNoMoreCompanysData: boolean;
  setNoMoreProductsData: boolean;
  customersNotFoundTips: string;
  merchantsNotFoundTips: string;
  companysNotFoundTips: string;
  productsList: productInfo[]
  productsNotFoundTips: string;
  productIds: string[];
  recommendType: 1 | 2;
  searchType: 1 | 2;
}

@connect(
  ({
    getOrderAndOrderList,
    loading,
  }: {
    getOrderAndOrderList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    getOrderAndOrderList,
    loading: loading.models.getOrderAndOrderList,
  }),
)

class GetOrder extends Component<OrderTableListProps, pageState> {
  companyType = CrmUtil.getCompanyType();
  currentCategory = ''
  componentDidMount() {

    if (window.location.href.indexOf("/hy/") > 0) {
      this.currentCategory = "1"
    } else if (window.location.href.indexOf("/hq/") > 0) {
      this.currentCategory = "2"
    } else if (window.location.href.indexOf("/other/") > 0) {
      this.currentCategory = "-1"
    }
    const company_tag = CrmUtil.getUserInfo()?.company_tag || "";
    const company_id = CrmUtil.getUserInfo()?.company_tag || "";
    this.setState({
      company_tag, company_id
    });
  }

  constructor(props: OrderTableListProps) {
    super(props);
    //初始化
    this.state = {
      province: '',
      city: '',
      district: '',
      cityCode: '',
      options: '',
      isChildData: false,
      bizContent: {},
      getCustomerName: [],
      currentStep: 0,
      isStartTransfer: false,
      modalVisible: false,
      orderId: '',
      weddingDay: '',
      customerName: '',
      customerId: undefined,
      phone: '',
      reqId: undefined,
      category: undefined,
      selectedMerchants: [],
      selectedProductsList: [],
      selecteCompanys: [],
      fieldsValidateResult: false,
      orderSuccessMsg: undefined,
      company_tag: '',
      company_id: "",
      customerList: [],
      selectingCustomer: {},
      targetSimilarCustomer: {},
      confirmVisible: false,
      bindedCustomerValue: undefined,
      merchantsList: [],
      setNoMoreCustomersData: false,

      customersNotFoundTips: "请输入关键字搜索客户",

      productsList: [],
      productIds: [],
      recommendType: 1,
      searchType: 1,
    }
  }

  //  生成订单
  validate = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        fieldsValidateResult: true
      })

      const params = {
        orderId: this.state.selectingCustomer.id,
      }

      // 创建订单
      dispatch({
        type: 'getOrderAndOrderList/claimOrder',
        payload: params,
        callback: (result: boolean, msg: string) => {
          if (result) {
            this.setState({
              orderSuccessMsg: msg,
              productsList: [],
              productIds: [],
            })

            localStorage?.setItem('orderListentryFollowIsRefresh', 'reset');
            history.back()
          }
        }
      });
    });
  };

  customersPagination: PaginationFake = {
    page: 1,
    pageSize: 100,
    total: 0
  }

  onCustomerKeywordChanged = (keyword: string | undefined) => {
    this.customersPagination = {
      page: 1,
      pageSize: 100,
      total: 0
    }
    this.setState({
      customerList: new Array(),
      setNoMoreCustomersData: false,
    })
    if (!keyword) {
      this.setState({
        bindedCustomerValue: undefined,
        customersNotFoundTips: "请输入关键字搜索客户"
      })
    };
  }

  searchCustomers = (key: string) => {
    const { dispatch } = this.props;
    let payload = {
      page: this.customersPagination.page,
      pageSize: this.customersPagination.pageSize,
      claim: 1,
      category: this.currentCategory
    }
    if (this.state.searchType == 1) {
      payload = {
        ...payload,
        customerPhone: key,
      }
    } else if (this.state.searchType == 2) {
      payload = {
        ...payload,
        groupCustomerId: key,
      }
    }



    dispatch({
      type: 'getOrderAndOrderList/search',
      payload,
      callback: (success: boolean) => {
        if (success) {
          const { getOrderAndOrderList: { customerListSinglePageData, customersTotal } } = this.props;
          if (customerListSinglePageData) {
            let customerList = this.customersPagination.page == 1 ? [] : this.state.customerList;
            customerList.push(...customerListSinglePageData);
            this.setState({
              customerList
            })
            // this.customersPagination = {
            //   page: this.customersPagination.page+1,
            //   pageSize: this.customersPagination.pageSize,
            //   total: customersTotal
            // }
            // if (customersTotal <= customerList.length) {
            //   this.setState({
            //     setNoMoreCustomersData: true
            //   })
            // }

          }
        }
        if (this.state.customerList.length == 0) {
          this.setState({
            customersNotFoundTips: '没有搜索到关键字为“' + key + '”的客户'
          })
        }
      },
    })
  };


  onChangeCustomer = (value: string) => {
    console.log(" change customer = " + value);

    if (value) {
      this.props.form.setFieldsValue({
        "customerId": value,
      })

      this.setState({ bindedCustomerValue: value, customerId: value }, () => {
        const fieldsValidateResult = !!this.state.customerId;
        this.setState({ fieldsValidateResult });
      })
    } else {
      // 清空选项
      const { form } = this.props;
      this.setState({
        customerId: undefined,
        customerList: new Array(),
        bindedCustomerValue: undefined,
        reqId: undefined,
        customersNotFoundTips: "请输入关键字搜索客户",
        fieldsValidateResult: false
      })
    }
  };

  /**
   * 选择客户时，去校验重单状态
   */
  handleSelectOption = (value: string) => {
    console.log("  on  select " + value);
    const { customerList } = this.state;
    const { dispatch } = this.props;
    const orderId = value;
    // 通过选中的customerId，查看该客户的similarId是否存在且不为0
    const selectedCustomer = customerList.filter(item => {
      return orderId == item.id;
    })[0];
    this.setState({
      selectingCustomer: selectedCustomer
    })
  }

  addCustomer = () => {
    const { dispatch } = this.props;
    var pathName = window.location.href.substr(window.location.href.indexOf(window.location.pathname)) + "/newCustomer"
    dispatch(routerRedux.push({
      pathname: pathName,
      query: {
        fromTag: 'order',
      }
    }))
  };

  radioStyle = {
    width: 80,
    textAlign: 'center',
  };

  resetAllDara = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'getOrderAndOrderList/reset'
    });
    this.setState({
      reqId: undefined,
      category: undefined,
      selectedMerchants: [],
      selecteCompanys: [],
      selectedProductsList: [],
      fieldsValidateResult: false,
      orderSuccessMsg: undefined,
      bindedCustomerValue: undefined,
      customerList: new Array(),
    });
  }


  handleChangeSearchType = (value: 1 | 2) => {
    this.setState({
      searchType: value
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      getOrderAndOrderList: { reqList, companysList, orderNum }
    } = this.props;

    const {
      fieldsValidateResult,
      customerList
    } = this.state;
    console.log("this.companyType = " + this.companyType);
    return (
      <>
        {/* <Spin spinning={loading} size="large" > */}
        <PageHeaderWrapper title="领取订单">

          <Card bordered={false}>
            <div className={styles.tableListForm}>
              {
                orderNum ?
                  <Result
                    status="success"
                    title="订单创建成功!"
                    subTitle={this.state.orderSuccessMsg}
                    extra={[
                      <Button type="primary" key="console" onClick={this.resetAllDara}>
                        关闭
                    </Button>
                    ]}
                  />
                  :
                  <Form onSubmit={this.validate} style={{ minWidth: 400, width: "50%" }}>
                    <Form.Item label='绑定客户'>
                      <InputGroup compact>
                        <Select defaultValue={1} style={{ width: '35%' }} onChange={this.handleChangeSearchType}>
                          <Option value={1}>手机号</Option>
                          <Option value={2}>集团ID</Option>
                        </Select>
                        {
                          getFieldDecorator('customerId', {
                            rules: [{ required: true, message: '请选择客户' }],
                          })(
                            <PageLoadingSelect
                              style={{ width: '65%' }}
                              placeholder={'请输入 ' + (this.state.searchType == 1 ? '手机号' : '集团ID')}
                              loading={loading}
                              onChange={this.onChangeCustomer}
                              onSelect={(value, option) => this.handleSelectOption(value + "")}
                              notFoundContent={this.state.customersNotFoundTips}
                              onKeywordChanged={this.onCustomerKeywordChanged}
                              doSearch={this.searchCustomers}
                              noMoreData={this.state.setNoMoreCustomersData}
                              optionLabelProp='title'
                              dropdownRender={(menu: React.ReactNode) => (
                                <div>
                                  {menu}
                                  <Divider style={{ margin: '4px 0' }} />
                                  <div
                                    style={{ padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                                    onMouseDown={e => e.preventDefault()}
                                  >
                                    未找到客户？如需添加请前往<a onClick={this.addCustomer}>新建客资</a>
                                  </div>
                                </div>
                              )}>
                              {
                                customerList?.map((customer, index) => (
                                  <Option disabled={customer.repeat_audit_status == 1 || customer.repeat_audit_status == 3} title={customer.customer_name} value={customer.id} key={customer.customer_id} >
                                    <div>
                                      集团ID：{customer.group_customer_id}
                                      <br />
                                      客户ID：{customer.customer_id} | {customer.customer_name} {customer.repeat_audit_status == 1 || customer.repeat_audit_status == 3 ? "(客户重单执行中)" : ""}
                                      <br />
                                      手机号：{customer.customer_phone} <span style={{ fontWeight: 500, color: "red" }}>【{customer.category_txt}】</span>
                                    </div>
                                  </Option>
                                ))

                              }
                            </PageLoadingSelect>,
                          )}
                      </InputGroup>
                    </Form.Item>


                    <Form.Item wrapperCol={{ span: 20, offset: 7 }}>
                      <Button disabled={!fieldsValidateResult} onClick={this.validate} style={{ width: 150, marginTop: 30 }} type="primary" >领取订单</Button>
                    </Form.Item>


                  </Form>
              }

            </div>
          </Card>

        </PageHeaderWrapper>
        {/* </Spin> */}
      </>
    );
  }
}
export default Form.create<OrderTableListProps>()(GetOrder);
