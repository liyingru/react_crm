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
import { CustomerData, ContractEntity, RequirementBean } from '@/pages/CustomerManagement/customerDetail/dxl/data';
import CustomerRepeatConfirmModal from '@/components/CustomerRepeatConfirmModal';
import { productInfo } from '../newContractNew/data';
import { ColumnProps } from 'antd/lib/table';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';
import PageLoadingSelect, { PaginationFake } from '../../../components/PageLoadingSelect';
import { SelectValue } from 'antd/lib/select';
import CrmUtil from '@/utils/UserInfoStorage';
import customerList from '@/pages/CustomerManagement/customerList';
import LOCAL from '@/utils/LocalStorageKeys';
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;

function disabledDate(current) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')));
}



/*删除数组中的某一个对象
_arr:数组
_obj:需删除的对象
*/
function removeAaary(_arr, _obj) {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    if (_arr[i] == _obj) {
      _arr.splice(i, 1); //删除下标为i的元素
      return _arr
      break
    }
  }
}

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

const fieldLabels = {
  channel: '客户来源',
  customerName: '客户姓名',
  gender: '性别',
  mobile: '手机号',
  wechat: '微信号',
  weddingDay: '婚期',
  weddingStyle: '婚礼风格',
  budget: '整体预算',
  city: '意向城市',
  district: '意向区域',
  category: '业务品类',
};


interface OrderTableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'newOrderAndOrderTableList/submitAdvancedForm'
      | 'newOrderAndOrderTableList/initDataCtrl'
      | 'newOrderAndOrderTableList/customerList'
      | 'newOrderAndOrderTableList/reqList'
      | 'newOrderAndOrderTableList/getRecommendMerchants'
      | 'newOrderAndOrderTableList/getRecommendCompanys'
      | 'newOrderAndOrderTableList/reset'
      | 'newOrderAndOrderTableList/newCustomer'
      | 'newOrderAndOrderTableList/search'
      | 'newOrderAndOrderTableList/customerDetailById'
      | 'newOrderAndOrderTableList/searchProduct'

    >
  >;
  loading: boolean;
  submitting: boolean;
  newOrderAndOrderTableList: StateType;
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
  searchType: 1 | 2 | 3 | 4;
}

const dateFormat = 'YYYY-MM-DD';
// @connect(({ newOrderAndOrderTableList, loading }: { newOrderAndOrderTableList: StateType, loading: { effects: { [key: string]: boolean } } }) => ({
//   submitting: loading.effects['newOrderAndOrderTableList/submitAdvancedForm'],
//   newOrderAndOrderTableList
// }))

@connect(
  ({
    newOrderAndOrderTableList,
    loading,
  }: {
    newOrderAndOrderTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newOrderAndOrderTableList,
    loading: loading.models.newOrderAndOrderTableList,
  }),
)

class OrderTableList extends Component<OrderTableListProps, pageState> {
  companyType = CrmUtil.getCompanyType();

  componentDidMount() {
    const { dispatch } = this.props;
    // 初始化
    // 读取配置项
    dispatch({
      type: 'newOrderAndOrderTableList/initDataCtrl',
    });
    // // 获取客户列表
    // dispatch({
    //   type: 'newOrderAndOrderTableList/customerList',
    // });

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
      setNoMoreMerchantsData: false,
      setNoMoreCompanysData: false,
      setNoMoreProductsData: false,
      customersNotFoundTips: "请输入关键字搜索客户",
      merchantsNotFoundTips: "请输入关键字搜索商家",
      companysNotFoundTips: "请输入关键字搜索商家",
      productsNotFoundTips: "请输入关键字搜索产品",
      productsList: [],
      productIds: [],
      recommendType: 1,
      searchType: 1,
    }
  }
  //婚期监听
  dateChange = (e, name: string) => {
    let dateStr = e.format('YYYY-MM-DD');
    if (name == 'weddingDay') {//婚期
      this.setState({
        weddingDay: dateStr
      });
    }
  }

  //  生成订单
  validate = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let merchantArray: { merchantId: string, merchant: string, }[] = [];
      if (this.companyType == 1 || this.companyType == 2 || this.companyType == 4) { // 如果是到喜啦1、喜铺2、非凡4
        if (this.state.recommendType == 1) { //推荐商家
          for (let i = 0; i < this.state.selectedMerchants.length; i++) {
            const merchantId = this.state.selectedMerchants[i].id;
            const merchant = this.state.selectedMerchants[i].name;
            merchantArray[i] = {
              merchantId,
              merchant
            }
          }
        } else if (this.state.recommendType == 2) { // 派发公司
          for (let i = 0; i < this.state.selecteCompanys.length; i++) {
            const merchantId = this.state.selecteCompanys[i].id;
            const merchant = this.state.selecteCompanys[i].name;
            merchantArray[i] = {
              merchantId,
              merchant
            }
          }
        }

      } else { // 如果不是到喜啦  商家就传自己公司
        merchantArray[0] = {
          merchantId: this.state.company_id,
          merchant: this.state.company_tag,
        }
      }

      const params = {
        customerId: this.state.customerId,
        reqId: this.state.reqId,
        category: this.state.category,
        merchant: merchantArray,
        productIds: this.state.productIds.join(',')
      }

      // 创建订单
      dispatch({
        type: 'newOrderAndOrderTableList/submitAdvancedForm',
        payload: params,
        callback: (success: boolean, msg: string) => {
          if (success) {
            this.setState({
              orderSuccessMsg: msg,
              productsList: [],
              productIds: [],
            });
            localStorage.setItem(LOCAL.LIST_RESET_REFRESH, "orderList");
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
      type: this.state.searchType,
      multiple: 1,
    }
    if (this.state.searchType == 1) {
      payload = {
        ...payload,
        phone: key,
      }
    } else if (this.state.searchType == 2) {
      payload = {
        ...payload,
        weChat: key,
      }
    } else if (this.state.searchType == 3) {
      payload = {
        ...payload,
        name: key,
      }
    } else if (this.state.searchType == 4) {
      payload = {
        ...payload,
        customerId: key,
      }
    }

    dispatch({
      type: 'newOrderAndOrderTableList/search',
      payload,
      callback: (success: boolean) => {
        if (success) {
          const { newOrderAndOrderTableList: { customerListSinglePageData, customersTotal } } = this.props;
          if (customerListSinglePageData) {
            let customerList = this.customersPagination.page == 1 ? [] : this.state.customerList;
            customerList.push(...customerListSinglePageData);
            this.setState({
              customerList
            })
            this.customersPagination = {
              page: this.customersPagination.page + 1,
              pageSize: this.customersPagination.pageSize,
              total: customersTotal
            }
            if (customersTotal <= customerList.length) {
              this.setState({
                setNoMoreCustomersData: true
              })
            }

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

  /**
   * 获取指定客户的有效单列表
   */
  requestList = (customerId: string) => {
    const { dispatch, form } = this.props;
    form.resetFields(['reqId', 'merchant']);
    // 获取有效单列表
    dispatch({
      type: 'newOrderAndOrderTableList/reqList',
      payload: {
        customerId,
        phase: CrmUtil.getCompanyType() == 2 ? 25 : undefined,
      },
      callback: function (data: any) {
      }
    });
  }

  onChangeCustomer = (value: string) => {
    console.log(" change customer = " + value);

    if (value) {
      this.props.form.setFieldsValue({
        "customerId": value,
      })

      this.setState({ bindedCustomerValue: value, customerId: value, reqId: undefined, selectedMerchants: [], selecteCompanys: [], selectedProductsList: [] }, () => {
        const fieldsValidateResult = !!this.state.customerId && !!this.state.reqId;
        this.setState({ fieldsValidateResult });
      })
    } else {
      // 清空选项
      const { form } = this.props;
      form.resetFields(['reqId', 'merchant', 'productIds']);
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
    const customerId = value;
    // 通过选中的customerId，查看该客户的similarId是否存在且不为0
    const selectedCustomer = customerList.filter(item => {
      return customerId == item.customer_id;
    })[0];
    // 如果存在有效的similarId，说明不能选中该客户  // 要弹出窗口提示用户
    if (selectedCustomer && selectedCustomer.similar_id != 0) {
      this.setState({
        selectingCustomer: selectedCustomer
      })
      // 但是弹出窗口中要展示similarId客户的信息，要先获取到才行。
      // 先从已有的选项中看有没有这个客户，有的话就不用去请求接口了
      const similarCustomer = customerList.filter(item => {
        return item.customer_id == selectedCustomer.similar_id;
      });
      if (similarCustomer && similarCustomer.length > 0) {
        // 说明列表中已经有该父节点了
        const targetSimilarCustomer = similarCustomer[0];
        this.setState({
          targetSimilarCustomer,
          confirmVisible: true
        })
      } else {
        const valuesResult =
        {
          'type': '4',
          'customerId': selectedCustomer.similar_id
        }
        //获取客户信息
        Axios.post(URL.getCustomerInfo, valuesResult)
          .then(
            res => {
              if (res.code == 200) {
                if (res.data.result.customer_id) {
                  this.setState({
                    confirmVisible: true,
                    targetSimilarCustomer: res.data.result
                  })
                }
              }
            }
          );
      }
    } else {
      // 如果是有效客户，就直接请求有效单列表
      this.requestList(value);
    }
  }

  handleAutoSwitchRepeatCustomer = () => {
    const { customerList, targetSimilarCustomer } = this.state;
    // 为了能自动选中选项，对于本来不在选项中的数据，要先把数据加入到选项列表。
    if (customerList.indexOf(targetSimilarCustomer) < 0) {
      customerList.push(targetSimilarCustomer);
    }
    // 点击确定按钮，要把原来选中的客户清除掉，然后替换成similarId客户的id。
    const bindedCustomerValue = targetSimilarCustomer.customer_id;
    // 更改完选中的数据后，刷新界面
    this.props.form.setFieldsValue({
      "customerId": bindedCustomerValue,
    })
    this.setState({
      customerList,
      bindedCustomerValue: bindedCustomerValue
    });
    console.log("自动切换到： " + bindedCustomerValue)
    this.requestList(bindedCustomerValue);
  }

  handleCancelSwitchRepeatCustomer = () => {
    // 如果取消了，就把用户之前选中的那条非法数据，从选中项里清掉。
    this.props.form.setFieldsValue({
      "customerId": undefined,
    })
    this.setState({
      bindedCustomerValue: undefined,
    });
  }

  /**
   * 选择了需求单，要将需求单的品类储存起来。 推荐商家要用到。
   * 更换了需求单，就要
   * 
   * 选择有效单后，如果公司是喜铺和星享非凡，就根据有效单的channel和level 去查找可派发的公司列表
   */
  onChangeReqType = (val: string) => {
    // 更换有效单后，保存新的数据，清空原来的数据
    const category = val.split(',')[0];
    const reqId = val.split(',')[1];
    this.setState({
      reqId,
      category,
      selectedMerchants: [],
      selecteCompanys: [],
      productIds: [],
      selectedProductsList: [],
    }, () => {
      const fieldsValidateResult = !!this.state.customerId && !!this.state.reqId;
      this.setState({ fieldsValidateResult });

      // 先以空关键字搜索一批商家列表。
      this.merchantsPagination = {
        page: 1,
        pageSize: 10,
        total: 0
      }
      this.searchMerchants();

      // 如果公司是喜铺和星享非凡，就根据有效单的channel和level 去查找可派发的公司列表
      if (this.companyType == 2 || this.companyType == 4) {
        const { newOrderAndOrderTableList: { reqList } } = this.props;
        const selectedReq = reqList?.filter(item => item.id + "" == reqId)[0];
        const channelId = selectedReq?.channel;
        const level = selectedReq?.level;

        const { dispatch } = this.props;
        dispatch({
          type: 'newOrderAndOrderTableList/getRecommendCompanys',
          payload: {
            channelId,
            type: 3,
            level
          },
          callback: () => {
          }
        });
      } else if (this.companyType != 1) {
        // 先搜索一批产品列表。
        this.productsPagination = {
          page: 1,
          pageSize: 10,
          total: 0
        }
        this.searchProducts();
      }

    });

    const { form } = this.props;
    form.resetFields(['merchant']);  // 如果表单里已经选过了商家，就清空
    form.resetFields(['productIdList']);  // 如果表单里已经选过了产品，就清空
    this.setState({
      merchantsList: [],
      productsList: [],
      setNoMoreMerchantsData: false,
      setNoMoreProductsData: false,
      merchantsNotFoundTips: "请输入关键字搜索商家",
      productsNotFoundTips: "请输入关键字搜索产品",
    })

  };

  merchantsPagination: PaginationFake = {
    page: 1,
    pageSize: 10,
    total: 0
  }

  onMerchantKeywordChanged = (keyword: string | undefined) => {
    this.merchantsPagination = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    this.setState({
      merchantsList: new Array(),
      setNoMoreMerchantsData: false,
    })
  }

  searchMerchants = (key?: string) => {
    const { dispatch } = this.props;
    let payload = {
      page: this.merchantsPagination.page,
      pageSize: this.merchantsPagination.pageSize,
      category: this.state.category,
    }
    if (this.companyType == 1) {
      payload = {
        ...payload,
        filter: { name: key },
      }
    } else {
      payload = {
        ...payload,
        name: key,
      }
    }
    dispatch({
      type: 'newOrderAndOrderTableList/getRecommendMerchants',
      payload,
      callback: (success: boolean) => {
        if (success) {
          const { merchantsList } = this.state;
          const { newOrderAndOrderTableList: { merchantsListSinglePageData, merchantsTotal } } = this.props;
          if (merchantsListSinglePageData) {
            if (this.merchantsPagination.page == 1) {
              this.setState({
                merchantsList: merchantsListSinglePageData
              });
            } else {
              merchantsList.push(...merchantsListSinglePageData);
              this.setState({
                merchantsList,
              });
            }

          }
          this.merchantsPagination = {
            page: this.merchantsPagination.page + 1,
            pageSize: this.merchantsPagination.pageSize,
            total: merchantsTotal
          }
          if (merchantsTotal <= merchantsList.length) {
            this.setState({
              setNoMoreMerchantsData: true
            })
          }
        }
        if (this.state.merchantsList.length == 0) {
          this.setState({
            merchantsNotFoundTips: key ? '没有搜索到关键字为“' + key + '”的商家' : "没有搜索到商家"
          })
        }
      },
    })
  };

  onClearInputKeys = () => {
    this.setState({
      merchantsNotFoundTips: "请输入关键字搜索商家"
    })
    // 以空关键字搜索一批商家列表。
    this.merchantsPagination = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    this.searchMerchants();
  }

  onChangeRecomendMerchants = (merchant: string[]) => {
    let selectedMerchants: Merchant[] = [];
    if (merchant && merchant.length > 0) {
      merchant.map(merchantId => {
        for (let i = 0; i < this.state.merchantsList.length; i++) {
          if (this.state.merchantsList[i].id == merchantId) {
            selectedMerchants.push(this.state.merchantsList[i]);
          }
        }
      });
    }

    this.setState({
      selectedMerchants
    }, () => {
      const fieldsValidateResult = !!this.state.customerId && !!this.state.reqId;
      this.setState({ fieldsValidateResult });
    })
  };

  onChangeRecomendCompanys = (company: string[]) => {
    const { newOrderAndOrderTableList: { companysList } } = this.props;
    let selecteCompanys: any[] = [];
    if (company && company.length > 0) {
      company.map(companyId => {
        for (let i = 0; i < companysList.length; i++) {
          if (companysList[i].id == companyId) {
            selecteCompanys.push(companysList[i]);
          }
        }
      });
    }

    this.setState({
      selecteCompanys
    }, () => {
      const fieldsValidateResult = !!this.state.customerId && !!this.state.reqId;
      this.setState({ fieldsValidateResult });
    })
  };

  addCustomer = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/order/newOrder/newCustomer',
      query: {
        fromTag: 'order',
      }
    }))
    // const currentUrl = window.location.href;
    // const targetUrl = currentUrl + "/newCustomer";
    // window.open(targetUrl+"?fromTag=order");
  };

  addProduct = () => {
    // const { dispatch } = this.props;
    // dispatch(routerRedux.push({
    //   pathname: '/product/newProduct',
    // }))
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("/order  /");
    const targetUrl = currentUrl.substring(0, index) + "/product/newProduct";
    window.open(targetUrl);
  };

  productsPagination: PaginationFake = {
    page: 1,
    pageSize: 10,
    total: 0
  }

  onProductKeywordChanged = (keyword: string | undefined) => {
    this.productsPagination = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    this.setState({
      productsList: new Array(),
      setNoMoreProductsData: false,
    })
    if (!keyword) {
      this.setState({
        productIds: [],
        selectedProductsList: [],
        productsNotFoundTips: "请输入关键字搜索产品"
      })
    };
  }

  searchProducts = (key?: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newOrderAndOrderTableList/searchProduct',
      payload: {
        page: this.productsPagination.page,
        pageSize: this.productsPagination.pageSize,
        name: key,
        category: this.state.category,
      },
      callback: (success: boolean) => {
        if (success) {
          const { productsList } = this.state;
          const { newOrderAndOrderTableList: { productsListSinglePageData, productsTotal } } = this.props;
          if (productsListSinglePageData) {
            if (this.productsPagination.page == 1) {
              this.setState({
                productsList: productsListSinglePageData
              });
            } else {
              productsList.push(...productsListSinglePageData);
              this.setState({
                productsList,
              });
            }
          }
          this.productsPagination = {
            page: this.productsPagination.page + 1,
            pageSize: this.productsPagination.pageSize,
            total: productsTotal
          }
          if (productsTotal <= productsList.length) {
            this.setState({
              setNoMoreProductsData: true
            })
          }
        }
        if (this.state.productsList.length == 0) {
          this.setState({
            productsNotFoundTips: key ? '没有搜索到关键字为“' + key + '”的产品' : "没有搜索到产品"
          })
        }
      },
    })
  };

  onChangeProduct = (value: string[]) => {
    const { form } = this.props;
    var selectProductList: productInfo[] = [];
    var selectProductIds = []
    if (value.length > 0) {
      selectProductIds.push(...value)
      this.state.productsList.forEach((product, index) => {
        value.forEach(id => {
          if (product.id == id) {
            selectProductList.push(product)
          }
        });
      })

      const newArr = concatProductArray(this.state.productsList, selectProductList)
      const newIdsArr = concatArray(this.state.productIds, selectProductIds)
      this.setState({
        productsList: newArr,
        productIds: newIdsArr,
        selectProductList,
      })
    } else {
      this.setState({
        productsList: [],
        selectProductList,
        productsNotFoundTips: "请输入关键字搜索产品",
      })
    }

    form.setFieldsValue({
      'productIdList': []
    })
  };

  //删除产品信息
  deleteProduct = (e: React.FormEvent, item: any) => {
    const { form } = this.props;
    var productArray = removeAaary(this.state.productsList, item)
    this.setState({
      productsList: productArray,
    })

    var productIdsArray = removeAaary(this.state.productIds, item.id)
    form.setFieldsValue({
      productIdList: productIdsArray
    })

    if (this.state.productsList.length == 0) {
      this.setState({
        productsList: [],
        productsNotFoundTips: "请输入关键字搜索产品",
      })
    }
  }


  reqColumns = [
    {
      title: 'req_num',
      text: '有效单编号'
    },
    {
      title: 'category_txt',
      text: '业务品类',
    },

    {
      title: 'city_info',
      text: '业务区域'
    },
    {
      title: 'budget',
      text: '预算'
    },

    {
      title: 'wedding_style_txt',
      text: '婚礼风格',
      category: [2, 6]
    },

    {
      title: 'hotel',
      text: '酒店名称',
      category: [2, 4, 6]
    },
    {
      title: 'hotel_hall',
      text: '厅名',
      category: [2, 4, 6]
    },
    {
      title: 'hotel_tables',
      text: '桌数',
      category: [1, 2, 4, 6]
    },
    {
      title: 'per_budget',
      text: '每桌预算',
      category: [1, 2, 4, 6]
    },

    {
      title: 'site_type_txt',
      text: '场地类型',
      category: [1]
    },
    {
      title: 'schedule_type_txt',
      text: '档期类型',
      category: [1]
    },

    {
      title: 'photo_style_txt',
      text: '婚照风格',
      category: [3]
    },

    {
      title: 'car_time',
      text: '用车时间',
      category: [5]
    },

    {
      title: 'car_brand',
      text: '用车品牌',
      category: [5]
    },

    {
      title: 'dress_use_way_txt',
      text: '使用方式',
      category: [7],
    },
    {
      title: 'dress_type_txt',
      text: '服饰类型',
      category: [7],
    },
    {
      title: 'dress_model_txt',
      text: '礼服款式',
      category: [7]
    },
    {
      title: 'status_txt',
      text: '状态'
    },
    {
      title: 'user_name',
      text: '创建人'
    },
    {
      title: 'create_time',
      text: '创建时间'
    },
  ]

  radioStyle = {
    width: 80,
    textAlign: 'center',
  };

  resetAllDara = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'newOrderAndOrderTableList/reset'
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

  handleChangeRecommendType = (e: any) => {
    const value = e.target.value;
    this.setState({
      recommendType: value
    })
  }

  handleChangeSearchType = (value: 1 | 2 | 3) => {
    this.setState({
      searchType: value
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      loading,
      newOrderAndOrderTableList: { reqList, companysList, orderNum }
    } = this.props;

    const {
      fieldsValidateResult,
      customerList
    } = this.state;
    console.log("this.companyType = " + this.companyType);
    return (
      <>
        {/* <Spin spinning={loading} size="large" > */}
        <PageHeaderWrapper >

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
                          <Option value={2}>微信</Option>
                          <Option value={3}>客户名</Option>
                          <Option value={4}>客户编号</Option>
                        </Select>
                        {
                          getFieldDecorator('customerId', {
                            rules: [{ required: true, message: '请选择客户' }],
                          })(
                            <PageLoadingSelect
                              style={{ width: '65%' }}
                              placeholder={'请输入 ' + (this.state.searchType == 1 ? '手机号' : this.state.searchType == 2 ? '微信号' : this.state.searchType == 3 ? '客户名' : '客户编号') + ' 搜索客户'}
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
                                  <Option disabled={customer.repeat_audit_status == 1 || customer.repeat_audit_status == 3} title={customer.customer_name} value={customer.customer_id} key={customer.customer_id} ><div>客户id：{customer.customer_id} | {customer.customer_name} {customer.repeat_audit_status == 1 || customer.repeat_audit_status == 3 ? "(客户重单执行中)" : ""} <br />手机号：{customer.phone}</div></Option>
                                ))

                              }
                            </PageLoadingSelect>,
                          )}
                      </InputGroup>
                    </Form.Item>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={24}>
                        {
                          this.state.bindedCustomerValue && reqList ?
                            (
                              <div>
                                <Form.Item label='关联有效单'>
                                  {getFieldDecorator('reqId', {
                                    rules: [{ required: true, message: '请关联有效单' }],
                                  })(
                                    <Select
                                      optionLabelProp='title'
                                      placeholder='请关联有效单'
                                      style={{ width: '100%' }}
                                      onChange={this.onChangeReqType}
                                    // dropdownRender={menu => (
                                    //   <div>
                                    //     {menu}
                                    //     <Divider style={{ margin: '4px 0' }} />
                                    //     <div
                                    //       style={{ padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                                    //       onMouseDown={e => e.preventDefault()}
                                    //       onClick={this.addCustomer}
                                    //     >
                                    //       <Icon type="plus" /> 没有合适的有效单？请前往<a onClick={() => this.addCustomer}>新建有效单</a>
                                    //     </div>
                                    //   </div>
                                    // )}
                                    >
                                      {
                                        reqList?.map(myReq =>
                                          (<Option title={myReq.req_num + '  ' + myReq.category_txt} value={myReq.category + ',' + myReq.id} key={myReq.category} >{myReq.req_num + '  ' + myReq.category_txt}</Option>)
                                        )
                                      }
                                    </Select>,
                                  )}
                                </Form.Item>

                                {
                                  this.state.reqId ?
                                    (
                                      <Descriptions column={2} bordered size='small' style={{ width: '100%', marginBottom: 20 }}>
                                        {
                                          this.reqColumns.map(item => {
                                            const key = item.title;
                                            return key == 'city_info' ?
                                              (<Descriptions.Item label={item.text}>{reqList.filter(myReq => myReq.category + '' == this.state.category)[0][key].full}</Descriptions.Item>)
                                              : (!(item.category) || (item.category && item.category.indexOf(parseInt(reqList.filter(myReq => myReq.category + '' == this.state.category)[0].category)) >= 0))
                                                ? (<Descriptions.Item label={item.text}>{reqList.filter(myReq => myReq.category + '' == this.state.category)[0][key]}</Descriptions.Item>)
                                                : null
                                          })
                                        }
                                      </Descriptions>
                                    )
                                    : undefined
                                }
                              </div>
                            )
                            : undefined
                        }
                      </Col>
                    </Row>
                    {
                      this.state.reqId && (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                          <Col span={24}>
                            {
                              this.companyType == 1 ? (  // 到喜啦  推荐商家分页加载且关键字搜索
                                <Form.Item label='推荐商家'>
                                  {getFieldDecorator('merchant', {
                                    rules: [{ required: true, message: '请添加推荐商家' }],
                                  })(
                                    <PageLoadingSelect
                                      style={{ width: '100%' }}
                                      mode="multiple"
                                      placeholder="请选择推荐商家"
                                      loading={loading}
                                      onChange={this.onChangeRecomendMerchants}
                                      onClearInputKeys={this.onClearInputKeys}
                                      notFoundContent={this.state.merchantsNotFoundTips}
                                      onKeywordChanged={this.onMerchantKeywordChanged}
                                      doSearch={this.searchMerchants}
                                      noMoreData={this.state.setNoMoreMerchantsData}
                                    >
                                      {
                                        this.state.merchantsList && this.state.merchantsList.map(merchant =>
                                          <Option title={merchant.name} value={merchant.id} key={merchant.name} >{merchant.name}</Option>
                                        )
                                      }
                                    </PageLoadingSelect>
                                  )}
                                </Form.Item>
                              ) : (this.companyType == 2 || this.companyType == 4) ? (
                                <div>
                                  <Form.Item label='推荐类别'>
                                    <Radio.Group defaultValue={1} buttonStyle="solid" style={{ width: '100%' }} onChange={this.handleChangeRecommendType}>
                                      <Radio.Button style={this.radioStyle} value={1}>推荐商家</Radio.Button>
                                      <Radio.Button style={this.radioStyle} value={2}>派发公司</Radio.Button>
                                    </Radio.Group>
                                  </Form.Item>
                                  {
                                    this.state.recommendType == 1 && (
                                      <Form.Item label='推荐商家'>
                                        {getFieldDecorator('merchant', {
                                          rules: [{ required: true, message: '请添加推荐商家' }],
                                        })(
                                          <PageLoadingSelect
                                            style={{ width: '100%' }}
                                            mode="multiple"
                                            placeholder="请选择推荐商家"
                                            loading={loading}
                                            onChange={this.onChangeRecomendMerchants}
                                            onClearInputKeys={this.onClearInputKeys}
                                            notFoundContent={this.state.merchantsNotFoundTips}
                                            onKeywordChanged={this.onMerchantKeywordChanged}
                                            doSearch={this.searchMerchants}
                                            noMoreData={this.state.setNoMoreMerchantsData}
                                          >
                                            {
                                              this.state.merchantsList && this.state.merchantsList.map(merchant =>
                                                <Option title={merchant.name} value={merchant.id} key={merchant.name} >{merchant.name}</Option>
                                              )
                                            }
                                          </PageLoadingSelect>
                                        )}
                                      </Form.Item>
                                    )
                                  }
                                  {
                                    this.state.recommendType == 2 && (
                                      <Form.Item label='派发公司'>
                                        {getFieldDecorator('company', {
                                          rules: [{ required: true, message: '请添加派发公司' }],
                                        })(
                                          <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="请选择派发公司"
                                            onChange={this.onChangeRecomendCompanys}
                                          >
                                            {
                                              companysList && companysList.map(company =>
                                                <Option value={company.id} key={company.id} >{company.name}</Option>
                                              )
                                            }
                                          </Select>
                                        )}
                                      </Form.Item>
                                    )
                                  }
                                </div>
                              ) : (
                                    <Form.Item label='推荐产品'>
                                      {
                                        getFieldDecorator('productIdList', {
                                          rules: [{ required: true, message: '请搜索产品' }],
                                          initialValue: this.state.productIds
                                        })(
                                          <PageLoadingSelect
                                            style={{ width: '100%' }}
                                            mode="multiple"
                                            placeholder='输入产品名称、商家名称、产品品类'
                                            loading={loading}
                                            onChange={this.onChangeProduct}
                                            onFocus={() => {
                                              if (this.state.productsList.length == 0) {
                                                this.searchProducts();
                                              }
                                            }}
                                            notFoundContent={this.state.productsNotFoundTips}
                                            onKeywordChanged={this.onProductKeywordChanged}
                                            doSearch={this.searchProducts}
                                            noMoreData={this.state.setNoMoreProductsData}
                                            dropdownRender={menu => (
                                              <div>
                                                {menu}
                                                <Divider style={{ margin: '4px 0' }} />
                                                <div
                                                  style={{ padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                                                  onMouseDown={e => e.preventDefault()}
                                                >
                                                  未找到产品？如需添加请前往<a onClick={this.addProduct}>新建产品</a>
                                                </div>
                                              </div>
                                            )}>
                                            {
                                              this.state.productsList?.map((product, index) => (
                                                <Option title={product.name} value={product.id} key={product.name} >
                                                  <div>
                                                    {product.name} <br />
                                                品类：{product.category_name} <br />
                                                价格：{product.price_min}～{product.price_max} <br />
                                                商家：{product.merchant_name}<br />
                                                  </div>
                                                </Option>
                                              ))
                                            }
                                          </PageLoadingSelect>

                                        )}
                                    </Form.Item>
                                  )}
                          </Col>
                        </Row>
                      )}

                    {
                      this.companyType != 1 && this.companyType != 2 && this.companyType != 4 && this.state.bindedCustomerValue && reqList && this.state.selectedProductsList.length > 0 ?
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={24}>
                            <div style={{ width: '100%' }}>
                              {
                                this.state.selectedProductsList.map((item, index) => (
                                  <Card style={{ width: '100%', marginLeft: 17 }}>
                                    <div className={styles.productWrap}>
                                      <span style={{ width: '100%' }}>
                                        产品名称：{item.name}<br />
                                          品类：{item.category_name}<br />
                                          产品价格：{(item.price_min && item.price_max) ? item.price_min + "~" + item.price_max : "无"}<br />
                                          商家：{item.merchant_name}<br /><br />
                                      </span>
                                      <Button className={styles.deleteBt} style={{ width: 100 }} onClick={(e) => { this.deleteProduct(e, item) }} >删除</Button>

                                    </div>
                                  </Card>
                                )
                                )
                              }
                            </div>
                          </Col>
                        </Row>
                        : undefined
                    }

                    <Form.Item wrapperCol={{ span: 20, offset: 5 }}>
                      <Button disabled={!fieldsValidateResult} onClick={this.validate} style={{ width: 100, marginTop: 30 }} type="primary" >生成订单</Button>
                    </Form.Item>


                    {/* <IntentionalDemand contentArr={getCustomerName} validate={this.validate} phone={this.state.phone}/> */}

                  </Form>
              }

            </div>
          </Card>

          <CustomerRepeatConfirmModal
            title="重复客户"
            visible={this.state.confirmVisible}
            currentCustomer={this.state.selectingCustomer}
            targetSimilarCustomer={this.state.targetSimilarCustomer}
            onOk={() => {
              this.handleAutoSwitchRepeatCustomer();
              this.setState({
                confirmVisible: false
              })
            }}
            onCancel={() => {
              this.handleCancelSwitchRepeatCustomer();
              this.setState({
                confirmVisible: false
              })
            }}
          />

        </PageHeaderWrapper>
        {/* </Spin> */}
      </>
    );
  }
}
export default Form.create<OrderTableListProps>()(OrderTableList);
