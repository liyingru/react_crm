import { Card, Select, Tabs, Button, Modal, Form, message, Row, Col, Radio, Drawer, Table, Divider, Menu, Dropdown, Icon, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import React from 'react';
import { StateType } from './model';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action } from 'redux';
import LOCAL from '@/utils/LocalStorageKeys';
import { OrderDetailsParams, contactsInfoItem, PlansItemList, PlansItem, SettlementInfoItem, SettlementInfo } from './data';
import styles from './index.less';
import OrderDetailsInfo from './components/OrderDetailsInfo';
import OrderDetailsLinkedRecord from './components/OrderDetailsLinkedRecord';
import OrderDetailsContactsInfo from './components/OrderDetailsContactsInfo';
import OrderDetailsSalesOfDynamic from './components/OrderDetailsSalesOfDynamic';
import { connect } from 'dva';
import OrderDetailsReceivableRecordList from './components/OrderDetailsReceivableRecordList';

import OrderDetailsCustomerInfo from "./components/OrderDetailsCustomerInfo"

/// 修改订单
import ShowOrderEditState from "./components/OrderShowEditState"

/// 联系人
import ShowEditAndAddContacsInfo from "./components/OrderDetailsShowEditAndAddContacsInfo"

/// 跟进
import OrderDetailsRntryFollow from "./components/OrderDetailsRntryFollow"

// 回款
import ShowEditAndAddReceivableRecord from "./components/OrderDetailsShowEditAndAddReceivableRecord"
import ShowDeleteReceivableRecord from "./components/OrderDetailsShowDeleteReceivableRecord"
import ShowEditReceivableRecordPlan from "./components/OrderDetailsShowEditReceivablePlan"

// 回款记录详情
import OrderReceivableRecordDetails from "./components/OrderReceivableRecordDetails"

import ContractTab from "./components/OrderDetailsContractInfo"
// 确认到店
import OrderDetailsConfirmShop from "./components/OrderDetailsConfirmShop"

import Item from 'antd/lib/list/Item';
import { routerRedux } from 'dva/router';
import { ConfigListItem } from '../orderHome/data';
import OrderDetailsInputPerCent from './components/OrderDetailsInputPerCent';
import CrmUtil from '@/utils/UserInfoStorage';
import MerchantRemark from '@/pages/DxlLeadsManagement/dxlLeadsList/components/MerchantRemark';
import ThirdRecord from '@/pages/DxlLeadsManagement/dxlLeadsList/components/ThirdRecord';
import OrderDetailsShowMerchantsSettlement from './components/OrderDetailsShowMerchantsSettlement';
const FormItem = Form.Item;
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import NumericInput from '@/components/NumericInput';


const { Option } = Select;
const { TabPane } = Tabs;

interface DetailsProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      'getDetailsModelType/getDetails' |
      'getDetailsModelType/getConfig' |
      'getDetailsModelType/getGroupUserList' |
      'getDetailsModelType/getUserPermissionList' |
      'getDetailsModelType/getMoneyonfig' |
      'getDetailsModelType/getContractList' |
      'getDetailsModelType/getIsFriend' |
      'getDetailsModelType/getFollowList'
      //商家备注
      | 'getDetailsModelType/fetchMerchantnotes'
      //三方录音
      | 'getDetailsModelType/fetchThirdrecards'
      | 'getDetailsModelType/getStoreSettlement'

    >
  >;
  loading: boolean;
  getDetailsModelType: StateType;

}

function handleChange(value: any) {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
}

function callback(key: any) {
  console.log(key);
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

interface TableListState {
  currentUserId: string;
  currentUserName: string;
  orderId: string;
  customerId: string;
  categoryId: string
  categoryName: string
  // 修改订单状态
  showEditOrderState: boolean;

  // 联系人
  isCreateContacs: boolean;
  showEditAndAddContacsInfo: boolean;
  editContacsInfo: contactsInfoItem;

  // 添加跟进
  showAddNewDynamicInfo: boolean;

  // -----------------  回款记录 -------------------
  //  展示修改和添加新的回款记录
  showEditAndAddReceivableRecordInfo: boolean
  // 展示删除提示回款记录框
  showDeleteReceivableRecordInfoItem: boolean;
  // 修改的回款记录的计划对象  
  editReceivableRecordInfoItem: PlansItemList;
  // 修改回款记录的合同对象
  editReceivableRecordConstomerInfo: any;
  // 修改回款记录的对象id
  plansItemModel: any;
  // 修改回款记录样式
  receivableRecordType: number,

  // -----------------  回款记录详情 -------------------
  showReceivableRecordDetails: boolean,
  showReceivableRecordDetailsItem: PlansItemList,

  // -----------------  回款计划 -------------------
  showEditReceivableRecordPlan: boolean;
  editReceivabRecordPlanItemModel: any;

  // 转给同事
  showColleagueChange: boolean;
  colleagueChangeId: string;

  isFinshRequestWeChat: boolean;
  // 录占比
  showInputPercent: boolean;

  // 跟进记录配置项请求是否过
  isFirstFollowRequets: boolean;

  // 跟进记录标签
  tabActiveKey: string

  // ------------- 预约到店 --------------
  isShowConfirmShop: boolean;

  // 确认到店
  reserveData: any[];
  showSettlementInfoVisible: boolean;
  settlementInfoList: SettlementInfoItem[],
}

/* eslint react/no-multi-comp:0 */

@connect(
  ({
    getDetailsModelType,
    loading,
  }: {
    getDetailsModelType: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    getDetailsModelType,
    loading: loading.models.getDetailsModelType,
  })
)
class OrderDetails extends React.Component<DetailsProps, TableListState> {
  child: any;
  state: TableListState = {
    currentUserId: '',
    currentUserName: '',
    orderId: '',
    customerId: '',
    categoryId: '',
    categoryName: '',
    // 修改订单状态
    showEditOrderState: false,

    // 联系人
    isCreateContacs: false,
    showEditAndAddContacsInfo: false,
    editContacsInfo: {},
    // 跟进
    showAddNewDynamicInfo: false,



    // -----------------  回款记录 -------------------
    // 展示修改和添加新的回款记录
    showEditAndAddReceivableRecordInfo: false,
    // 展示删除提示回款记录框
    showDeleteReceivableRecordInfoItem: false,
    // 修改的回款记录的计划对象
    editReceivableRecordInfoItem: {},
    // 修改回款记录的合同对象
    editReceivableRecordConstomerInfo: {},
    // 修改回款记录的对象id
    plansItemModel: {},
    // 修改回款记录样式
    receivableRecordType: 0,

    // -----------------  回款记录详情 -------------------
    showReceivableRecordDetails: false,
    showReceivableRecordDetailsItem: {},

    // -----------------  回款计划 -------------------
    // 修改和新增回款计划
    showEditReceivableRecordPlan: false,
    // 修改计划的模型
    editReceivabRecordPlanItemModel: {},

    // ----------------- 转给同事 -----------
    // 转给同事
    showColleagueChange: false,
    colleagueChangeId: '',

    isFinshRequestWeChat: false,

    //录占比
    showInputPercent: false,

    // 跟进记录配置项请求是否过
    isFirstFollowRequets: true,

    // 确认到店
    reserveData: [],



    //----------商家结算---------------
    showSettlementInfoVisible: false,
    settlementInfoList: [],
  };
  componentDidMount() {
    const {
      location: {
        query: { orderId, customerId },
      },
    } = this.props;

    const { dispatch } = this.props;
    const params: Partial<OrderDetailsParams> = {
      orderId: orderId,
    };

    this.setState({
      isFinshRequestWeChat: false
    })

    //订单信息
    dispatch({
      type: 'getDetailsModelType/getDetails',
      payload: params,
      callback: (data: any) => {
        if (this.state?.isFirstFollowRequets) {
          this.setState({
            isFirstFollowRequets: false,
          }, () => {
            if (data?.followData?.followTab?.length > 0) {
              let item = data?.followData?.followTab[0]
              this.getFollowListFuntion(item.key);
            } else {
              this.getFollowListFuntion("1");
            }
          })
        }
      },
    });


    let values = {};
    values['followType'] = '3';

    // 配置信息
    dispatch({
      type: 'getDetailsModelType/getConfig',
      payload: values,
    });

    // 用户列表
    const userListParams = { 'keywords': '' }
    dispatch({
      type: 'getDetailsModelType/getGroupUserList',
      payload: userListParams,
    });

    // 用户权限
    dispatch({
      type: 'getDetailsModelType/getUserPermissionList',
    });

    // 获取回款配置项
    // 用户权限
    dispatch({
      type: 'getDetailsModelType/getMoneyonfig',
    });

    // 获取用户
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    try {
      if (currentUserInfoStr) {
        const currentUserInfo = JSON.parse(currentUserInfoStr);
        this.setState({
          currentUserId: currentUserInfo.id,
          currentUserName: currentUserInfo.name,
        })

      }
    } catch (e) {
      // console.log(e);
    }

    // 合同列表
    const contractListParams = { orderId: orderId, }
    dispatch({
      type: 'getDetailsModelType/getContractList',
      payload: contractListParams,
    });

    // 商家结算
    const settlementListParams = { orderId: orderId, }
    dispatch({
      type: 'getDetailsModelType/getStoreSettlement',
      payload: settlementListParams,
    });

    this.setState({
      orderId: orderId,
      customerId: customerId,
    })
  };

  componentWillReceiveProps = (nextProps: any) => {
    const { getDetailsModelType: { data: { customerInfo, orderInfo } } } = nextProps;
    const { isFinshRequestWeChat, orderId } = this.state;
    const { dispatch } = this.props;

    if ((customerInfo?.wechat?.length > 0 || customerInfo?.encrypt_phone?.length > 0) && orderId == orderInfo.id) {
      const wechat = customerInfo?.weChat;
      const encryptPhone = customerInfo?.encrypt_phone;
      const values = {};
      if (wechat?.length > 0) {
        values['wechat'] = wechat;
      } else {
        values['wechat'] = '';
      };

      if (encryptPhone?.length > 0) {
        values['encryptPhone'] = encryptPhone;
      } else {
        values['encryptPhone'] = '';
      };
      if (!isFinshRequestWeChat) {
        dispatch({
          type: 'getDetailsModelType/getIsFriend',
          payload: values,
        });
        this.setState({
          isFinshRequestWeChat: true
        });
      };

    }
  }


  // 请求详情页面
  getOrderDetailsFunction = () => {
    const { orderId } = this.state;
    const { dispatch } = this.props;
    const params: Partial<OrderDetailsParams> = {
      orderId: orderId,
    };
    dispatch({
      type: 'getDetailsModelType/getDetails',
      payload: params,
    });
  }

  // 请求跟进记录
  getFollowListFuntion = (tab: string) => {
    this.setState({
      tabActiveKey: tab,
    })
    const { dispatch } = this.props;
    const { orderId, customerId } = this.state;
    var followListParames = {};
    followListParames['type'] = '3';
    followListParames['tab'] = tab;
    followListParames['relationId'] = orderId;
    followListParames['customerId'] = customerId;


    dispatch({
      type: 'getDetailsModelType/getFollowList',
      payload: followListParames,
    });
  }

  // -------------------------------------------- 订单修改 --------------------------------------------
  editOrderStateFunction = (e: any) => {

    const { orderId } = this.state;

    var value = {}
    value['status'] = e
    value["orderId"] = orderId

    Axios.post(URL.updateOrder, value).then(
      res => {
        if (res.code == 200) {
          if (res.data.result) {
            message.success('修改成功');

            this.getOrderDetailsFunction()

            this.setState({
              showEditOrderState: false,
            })
          }

        }
      }
    );

  }

  //  --------------------------------------------- 联系人 ---------------------------------------------
  //  ----- 修改
  editContactsInfoFunction = (value?: any) => {
    const { getDetailsModelType: { data: { contacts } } } = this.props;
    contacts.map((item) => {
      if (item.contactId == value) {
        this.setState({
          editContacsInfo: item,
        })
      }
    })
    this.setState({
      isCreateContacs: false,
      showEditAndAddContacsInfo: true,
    })
  }

  //  ----- 创建
  createContasInfoFunction = () => {
    this.setState({
      isCreateContacs: true,
      showEditAndAddContacsInfo: true,
    })
  }

  //  ----- 联系人弹框点击
  // 取消
  editContactsInfoCancelFunction = (objc: any) => {
    this.setState({
      showEditAndAddContacsInfo: false,
      editContacsInfo: {},
    })
    objc?.props?.form?.resetFields();
  }
  // 确定
  createSaveContactsInfo = (value: any, objc: any) => {
    const { orderId } = this.state;
    const { getDetailsModelType: { data: { orderInfo } } } = this.props;

    const { dispatch } = this.props;
    const params: Partial<OrderDetailsParams> = {
      orderId: orderId,
    };

    value['customerId'] = orderInfo.customer_id

    if (this.state.isCreateContacs) {

      Axios.post(URL.createContactUser, value).then(
        res => {
          if (res.code == 200) {

            if (res.data.result) {
              message.success('修改成功');

              dispatch({
                type: 'getDetailsModelType/getDetails',
                payload: params,
              });
              this.setState({
                showEditAndAddContacsInfo: false,
                editContacsInfo: {},
              });

              objc?.props?.form?.resetFields();
            }

          }
        }
      );
    } else {

      value["contactId"] = this.state.editContacsInfo.contactId

      Axios.post(URL.updateContactUser, value).then(
        res => {
          if (res.code == 200) {

            if (res.data.result) {
              let msg = res.msg;
              message.success('添加成功');

              dispatch({
                type: 'getDetailsModelType/getDetails',
                payload: params,
              });
              this.setState({
                showEditAndAddContacsInfo: false,
                editContacsInfo: {},
              });

              objc?.props?.form?.resetFields();
            }

          }
        }
      );
    }
  };

  fetchMerchantRemarkList = (leadsId: string, page: number, pageSize: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'getDetailsModelType/fetchMerchantnotes',
      payload: {
        leadId: leadsId,
        index: page,
        size: pageSize,
      }
    });
  }

  fetchThirdRecordList = (leadsId: string, page: number, pageSize: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'getDetailsModelType/fetchThirdrecards',
      payload: {
        leadId: leadsId,
        index: page,
        size: pageSize,
      }
    });
  }

  // -------------------------------------------- 跟进 ---------------------------------------------
  // ----- 录跟进
  // 展示录入跟进请求
  addSalesOfDynamicFunction = () => {
    this.setState({
      showAddNewDynamicInfo: true,
    })
  }
  // 取消
  canceladdSalesOfDynamicFunction = () => {
    this.setState({
      showAddNewDynamicInfo: false,
    })
  }
  // 录入跟进请求
  // addSalesOfDynamicRequetsFunction = (value: any) => {
  //   const { orderId } = this.state;
  //   const { getDetailsModelType: { data: { orderInfo } } } = this.props;

  //   value["type"] = '3'
  //   value["customerId"] = orderInfo.customer_id
  //   value["relationId"] = orderId

  //   Axios.post(URL.createFollow, value).then(
  //     res => {
  //       if (res.code == 200) {
  //         message.success('添加跟进成功');

  //         this.getOrderDetailsFunction()
  //         this.setState({
  //           showAddNewDynamicInfo: false,
  //         })

  //       }
  //     }
  //   );
  // }

  // 录入跟进请求成功回调
  saveFollowListFunction = (tab: string) => {
    this.getOrderDetailsFunction()
    this.getFollowListFuntion(tab)
  }

  /// --------------------------------------------  修改回款记录 ---------------------------------------------

  // ----- 编辑单条
  editReceivableRecordItemFunction = (contactsInfoModel: any, plansModel: any, plansItemModel: PlansItemList) => {

    var typeNumber = 0
    if (contactsInfoModel?.id && plansModel?.plan_id && plansItemModel?.id) {
      // 定合同和定计划模式修改模式
      typeNumber = 3

      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        editReceivableRecordConstomerInfo: contactsInfoModel,
        editReceivableRecordInfoItem: plansModel,
        plansItemModel: plansItemModel,
        receivableRecordType: typeNumber,
      })

    } else if (contactsInfoModel?.id && plansModel?.plan_id) {

      // 定合同和定计划模式
      typeNumber = 2
      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        editReceivableRecordConstomerInfo: contactsInfoModel,
        editReceivableRecordInfoItem: plansModel,
        receivableRecordType: typeNumber,
      })

    } else if (contactsInfoModel?.id) {

      // 定合同和定计划模式
      typeNumber = 1
      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        editReceivableRecordConstomerInfo: contactsInfoModel,
        receivableRecordType: typeNumber,
      })

    } else {
      // 自选模式
      this.setState({
        showEditAndAddReceivableRecordInfo: true,
        receivableRecordType: typeNumber,
      })
    }
  }
  // 取消
  cancelAddReceivableRecordItemFunction = (value: any) => {
    this.setState({
      showEditAndAddReceivableRecordInfo: false,
      editReceivableRecordInfoItem: {},
      editReceivableRecordConstomerInfo: {},
      plansItemModel: {},
    })
  }
  // 确定
  addReceivableRecordItemRequetsFunction = (isEdit: boolean, value: any, objc: any) => {

    if (!isEdit) {

      Axios.post(URL.addReceivablesRecord, value).then(
        res => {
          if (res.code == 200) {

            let msg = res.msg;
            message.success('修改成功');

            this.getOrderDetailsFunction()

            this.setState({
              showEditAndAddReceivableRecordInfo: false,
              editReceivableRecordInfoItem: {},
            })
            const { form } = objc.formRef.props;
            form.resetFields();
          }
        }
      );


    } else {
      Axios.post(URL.editReceivablesRecord, value).then(
        res => {
          if (res.code == 200) {

            let msg = res.msg;
            message.success('新建成功');

            this.getOrderDetailsFunction()

            this.setState({
              showEditAndAddReceivableRecordInfo: false,
            })
            const { form } = objc.formRef.props;
            form.resetFields();
          }
        }
      );
    }

  }

  // ----- 删除单条
  deleteReceivableRecordItemFunction = (value: any, model: PlansItemList) => {

    this.setState({
      showDeleteReceivableRecordInfoItem: true,
      isCreateReceivableRecord: false,
      editReceivableRecordInfoItem: model,
      planId: value,
    })
  }

  // 删除请求
  deleteReceivableRecordItemRequetsFunction = (value: any) => {

    Axios.post(URL.deleteReceivablesRecord, value).then(
      res => {
        if (res.code == 200) {

          let msg = res.msg;
          message.success('删除成功');

          this.getOrderDetailsFunction()

          this.setState({
            showDeleteReceivableRecordInfoItem: false,
            isCreateReceivableRecord: false,
            planId: value,
          })

        }
      }
    );

  }
  // 取消删除
  cancelDeleteReceivableRecordItemFunction = () => {
    this.setState({
      showDeleteReceivableRecordInfoItem: false,
      isCreateReceivableRecord: false,
      editReceivableRecordInfoItem: {},
    })
  }
  // 展示删除记录弹框
  addReceivableRecordItemFunction = (value: any) => {
    this.setState({
      showEditAndAddReceivableRecordInfo: true,
      isCreateReceivableRecord: true,
      planId: {},
    })
  }

  /// --------------------------------------------  查看回款记录详情 ---------------------------------------------
  showReceivableRecordDetailsFunction = (model: any) => {
    // console.log("model", model)
    this.setState({
      showReceivableRecordDetails: true,
      showReceivableRecordDetailsItem: model
    })
  }

  cancelReceivableRecordDetailsFunction = () => {
    this.setState({
      showReceivableRecordDetails: false,
      showReceivableRecordDetailsItem: {}
    })
  }


  /// --------------------------------------------  修改回款计划 ---------------------------------------------
  // 回款计划调整
  editReceivableRecordPlanFunction = (value: any) => {
    this.setState({
      showEditReceivableRecordPlan: true,
      editReceivabRecordPlanItemModel: value,
    })
  }

  // 关闭调整回款计划
  cancelReceivableRecordPlanFunction = () => {
    this.setState({
      showEditReceivableRecordPlan: false,
      editReceivabRecordPlanItemModel: {},
    })
  }

  // 调整回款计划请求
  editReceivableRecordPlanRequetsFunction = (value: any, objc: any) => {
    console.log(value)

    const { orderId } = this.state;
    const { getDetailsModelType: { data: { orderInfo } } } = this.props;

    value["orderId"] = orderId;
    value["customerId"] = orderInfo.customer_id;

    Axios.post(URL.adjustReceivablesPlan, value).then(
      res => {
        if (res.code == 200) {

          let msg = res.msg;
          message.success('调整成功');

          this.getOrderDetailsFunction()

          this.setState({
            showEditReceivableRecordPlan: false,
          })
          const { form } = objc.formRef.props;
          form.resetFields();
        }
      }
    );

  }




  /// ------------------ 转给同事 --------------
  // 转给同事
  colleagueChange = () => {
    this.setState({
      showColleagueChange: true,
    });
  }

  cancaleColleagueChange = () => {
    this.setState({
      showColleagueChange: false,
      colleagueChangeId: '',
    });
  }

  colleagueChangeRequest = () => {
    const { colleagueChangeId } = this.state;
    // console.log(colleagueChangeId)

    let value = {};
    const { orderId } = this.state;
    value["orderId"] = orderId;
    value["ownerId"] = colleagueChangeId;

    Axios.post(URL.updateOrder, value).then(
      res => {
        if (res.code == 200) {

          let msg = res.msg;
          message.success('操作成功');

          this.getOrderDetailsFunction()

          this.setState({
            showColleagueChange: false,
            colleagueChangeId: '',
          })

          window.history.back();

        }
      }
    );

  }

  colleagueSelectChange = (value: any) => {
    console.log(value)
    this.setState({
      colleagueChangeId: value,
    })
  }

  onSearchPeople = (value: any) => {
    // 用户列表
    const { dispatch } = this.props;
    // console.log(value)

    const userListParams = { 'keywords': value }
    dispatch({
      type: 'getDetailsModelType/getGroupUserList',
      payload: userListParams,
    });
  }

  /// 签订合同
  categoryClick = () => {
    const { getDetailsModelType: { data: { orderInfo } } } = this.props;
    const { dispatch } = this.props;
    this.props.dispatch(routerRedux.push({
      pathname: '/order/orderManagement/newContract',
      query: {
        orderId: this.state.orderId,
        categoryId: orderInfo.category,
        categoryName: orderInfo.category_txt,
        customerId: this.state.customerId
      }
    }))
  }
  /// ------------------- 录占比 ---------------
  // 录占比
  inputPercentFunction = () => {
    this.setState({
      showInputPercent: true,
    })
  }

  cancelInputPercentFunction = () => {
    this.setState({
      showInputPercent: false,
    })
  }

  /// ------------------ 公共功能 --------------
  // -----用户搜索
  receivablesUserIdSearch = (value: any) => {
    const { dispatch } = this.props;

    const userListParams = { 'keywords': value }
    dispatch({
      type: 'getDetailsModelType/getGroupUserList',
      payload: userListParams,
    });
  }

  // ------------ 确认到店 ----------------

  showConfirmShopFunction = () => {
    const { getDetailsModelType: { data: { reserve } } } = this.props;

    var tempArr = []
    var other = {}
    other.id = 99
    other.name = '其他方式进店'

    if (reserve?.length > 0) {
      tempArr = [...reserve]
      tempArr.push(other)

      this.setState({
        isShowConfirmShop: true,
        reserveData: tempArr
      })
    } else {

      tempArr.push(other)

      this.setState({
        isShowConfirmShop: true,
        reserveData: tempArr
      })
    }
  }


  // 确认到店 请求
  confirmShopRequetsFunction = (value: any, objc: any) => {
    this.setState({
      isShowConfirmShop: false,
    })

    value['orderId'] = this.state?.orderId

    Axios.post(URL.confirmArrival, value).then(
      res => {
        if (res.code == 200) {

          message.success('确认成功');

          this.getOrderDetailsFunction()

          this.setState({
            showEditReceivableRecordPlan: false,
          })

        }
      }
    );

  }
  // 取消 确认到店 
  cancelShowConfirmShopFunction = () => {
    this.setState({
      isShowConfirmShop: false,
    })
  }


  // 显示商家结算弹框
  showSettlementInfoFunction = (visible: boolean) => {
    const { getDetailsModelType: { settlementInfoList } } = this.props;
    this.setState({
      showSettlementInfoVisible: visible
    })
    if (visible) {
      if (settlementInfoList.length > 0) {
        this.setState({
          settlementInfoList: settlementInfoList
        })
      }

      if (this.state.settlementInfoList && this.state.settlementInfoList.length == 0) {
        this.state.settlementInfoList.push({ id: "", service_type: "", store_name: "", contact_user: "", settlement_amount: "" })
      }
    }
  }

  // 添加结算
  addSettlement = (e: React.FormEvent) => {
    this.state.settlementInfoList.push({ id: "", service_type: "", store_name: "", contact_user: "", settlement_amount: "" })
    this.setState((prevState) => {
      const settlementInfoList = [...prevState.settlementInfoList];
      return { settlementInfoList: settlementInfoList }
    })
  }

  //删除结算信息
  deleteSettlement = (e: React.FormEvent, item: any) => {
    var settlementArray = removeAaary(this.state.settlementInfoList, item)
    this.setState({
      settlementInfoList: settlementArray,
    })
  }

  // 结算取消
  handleCancelSettlement = (e: React.FormEvent) => {
    this.setState({
      showSettlementInfoVisible: false,
      settlementInfoList: []
    })
  }


  // 结算确认
  handleOkSettlement = (e: React.FormEvent) => {
    const { form, dispatch } = this.props;
    const { settlementInfoList } = this.state
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {

        if (settlementInfoList.length == 0) {
          message.info("结算不能为空");
          return
        }

        var settlementList = []
        if (settlementInfoList && settlementInfoList.length > 0) {
          settlementInfoList.forEach((item, index) => {
            var settlement = { id: item.id, serviceType: item.service_type, storeName: item.store_name, contactUser: item.contact_user, settlementAmount: item.settlement_amount }
            settlementList.push(settlement)
          })
        }

        const valuesResult =
        {
          'orderId': this.state.orderId,
          'settlementInfo': settlementList,
        }
        Axios.post(URL.saveStoreSettlement, valuesResult).then(
          res => {
            if (res.code == 200) {
              message.info("保存成功");
              // 商家结算
              const settlementListParams = { orderId: this.state.orderId, }
              dispatch({
                type: 'getDetailsModelType/getStoreSettlement',
                payload: settlementListParams,
              });
            }

          }
        );

        this.setState({
          showSettlementInfoVisible: false,
        })
      }
    })
  }


  //服务类型监听
  serviceTypeChange = (e, index) => {
    this.state.settlementInfoList[index].service_type = e;
  }

  //商家名称监听
  merchantNameChange = (e, index) => {
    this.state.settlementInfoList[index].store_name = e.target.value;
  }

  //联系人监听
  contactChange = (e, index) => {
    this.state.settlementInfoList[index].contact_user = e.target.value;
  }

  //结算金额监听
  amountChange = (e, index) => {
    this.state.settlementInfoList[index].settlement_amount = e.target.value;
  }

  getSettlementTodoItem(obj: any) {
    const { getDetailsModelType: { configData } } = this.props;
    const { storeServiceType } = configData;
    const { form: { getFieldDecorator, getFieldValue }, } = this.props;

    return (
      obj && obj.length > 0 ? obj.map((item, index) => {
        return (
          <div className={styles.tableListForm}>
            <div key={index} style={{ marginBottom: 10, }}>
              <Card style={{ width: '95%' }}>
                <div className={styles.picWrap}>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                    <Col span={24}>
                      <FormItem label="服务类型" style={{ marginTop: 20 }}>
                        {getFieldDecorator('type' + index, {
                          rules: [{ required: true, message: '请选择服务类型', }],
                          initialValue: item && item.service_type ? item.service_type : undefined
                        })(
                          <Select placeholder="请选择服务类型" style={{ width: '100%', }} onChange={(e) => this.serviceTypeChange(e, index)}>
                            {
                              storeServiceType && storeServiceType.map(serviceType => (
                                <Option value={serviceType.id}>{serviceType.name}</Option>))

                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <FormItem label="商家名称" style={{ marginTop: 20 }}>
                        {getFieldDecorator('name' + index, { rules: [{ required: true, message: '请输入商家名称', }], initialValue: item && item.store_name ? item.store_name : '' })(
                          <Input autoComplete="off" style={{ width: '100%' }} placeholder="请输入商家名称" onChange={(e) => this.merchantNameChange(e, index)} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <FormItem label="联系人" style={{ marginTop: 20 }}>
                        {getFieldDecorator('contact' + index, { rules: [{ required: true, message: '请输入商家联系人', }], initialValue: item && item.contact_user ? item.contact_user : '' })(
                          <Input autoComplete="off" style={{ width: '100%' }} placeholder="请输入商家联系人" onChange={(e) => this.contactChange(e, index)} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <FormItem label="结算金额" style={{ marginTop: 20 }}>
                        {getFieldDecorator('amount' + index, { rules: [{ required: true, message: '请输入结算金额', }], initialValue: item && item.settlement_amount ? item.settlement_amount : '' })(
                          <NumericInput autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请输入结算金额" onChange={(e) => this.amountChange(e, index)} />

                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <CloseOutlined className={styles.deleteBt} onClick={(e) => { this.deleteSettlement(e, item) }} />
                </div>
              </Card>
            </div>
          </div>
        )
      }) : null
    )
  }

  render() {
    const { getDetailsModelType: { configData, isFriend, followList, moneyonfig, permission, data, userList, contractList, merchantRemarkData, thirdRecordData, settlementInfoList } } = this.props;
    const { callcenteradapter_getrecordlist, listenrecorder } = permission;
    const { identity, contactTime, contactWay, orderFollowStatus, followTag, category } = configData;
    const { orderInfo, contacts, callRecord, receivablesRecord, customerInfo, followData, reserve_confirm_count } = data;
    const { defaultActiveKey } = this.props.location.query;

    let isDisabledButton = true;

    if (CrmUtil.getCompanyType() == 2) {
      isDisabledButton = reserve_confirm_count > 0 ? false : true;
    } else {
      isDisabledButton = false;
    }

    // 状态修改
    const statusType = (
      <Menu>
        {configData && configData?.orderStatus?.map((item: { id: string | number | undefined; name: {} | null | undefined; }) => {
          if (item.id == orderInfo.status) {
            return (
              <Menu.Item key={item.id}>
                <div>
                  <a onClick={() => this.editOrderStateFunction(item.id)}>{item.name}</a>
                </div>
              </Menu.Item>
            );
          } else {
            return (
              <Menu.Item key={item.id}>
                <a onClick={() => this.editOrderStateFunction(item.id)}>{item.name}</a>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );

    const btnContractReq = (
      <Menu.Item key={this.state.categoryId}>
        <a onClick={() => this.categoryClick()}>{this.state.categoryName}</a>
      </Menu.Item>
    )

    return (
      <PageHeaderWrapper title={
        <div>
          <span>订单详情</span>
          <span style={{ marginLeft: 20, fontWeight: 'normal', color: 'grey' }}>{orderInfo?.order_num}</span>
        </div>}>

        <Row gutter={24}>
          <Col span={16}>
            <Card style={{ height: 900, overflowY: 'auto' }}>
              {isDisabledButton && <div style={{ paddingLeft: 20, color: 'red' }} >提示：以下置灰按钮，需客户到店后，才允许操作</div>}
              <div className={styles.boxInline}>
                {
                  orderInfo && orderInfo.customer_name && <div className={styles.headerMaxTitle}>{orderInfo.customer_name}</div>
                }
                <div className={styles.headerMinTitle} style={{ paddingTop: 10 }}>
                  <span style={{ marginRight: 20 }}>负责客服：{orderInfo && orderInfo.leads_owner_name}</span>
                  <span style={{ marginRight: 20 }}>负责顾问：{orderInfo && orderInfo.req_owner_name}</span>
                  <span style={{ marginRight: 20 }}>负责销售：{orderInfo && orderInfo.order_owner_name}</span>
                  <div style={{ fontWeight: 'bold', marginRight: 20, display: 'inline-block' }}>订单状态：
                    <Select size="small" style={{ minWidth: 80, width: 100 }} placeholder="" value={orderInfo.status} onChange={this.editOrderStateFunction} >
                      {configData && configData?.orderStatus?.map((item: { id: string | number | undefined; name: {} | null | undefined; }) => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))}
                    </Select></div>
                </div>
              </div>

              {
                orderInfo && orderInfo.phase != 7 && CrmUtil.getCompanyType() != 2 && <div style={{ marginTop: 10 }}>
                  <Button type='primary' disabled={isDisabledButton} style={{ marginRight: 10, marginTop: 10 }} onClick={this.categoryClick}><PlusOutlined />签订单合同</Button>
                  <Button type='primary' disabled={isDisabledButton} style={{ marginRight: 10, marginTop: 10 }} onClick={this.editReceivableRecordPlanFunction}><PlusOutlined />回款计划</Button>
                  <Button type='primary' disabled={isDisabledButton} style={{ marginRight: 10, marginTop: 10 }} onClick={() => {
                    this.editReceivableRecordItemFunction(undefined, undefined, undefined)
                  }}><PlusOutlined />回款记录</Button>
                  <Button type='primary' style={{ marginRight: 10, marginTop: 10 }} onClick={this.showConfirmShopFunction}>确认到店</Button>
                  <Button type='primary' disabled={isDisabledButton} style={{ marginRight: 10, marginTop: 10 }} onClick={() => { this.showSettlementInfoFunction(true) }}>商家结算</Button>
                  <Button type='primary' style={{ display: 'none', marginTop: 10 }} onClick={this.inputPercentFunction}>录占比</Button>
                </div>
              }

              <Tabs
                defaultActiveKey={defaultActiveKey}
                onChange={callback}
                type="card"
                style={{ marginTop: 20 }}
              >
                <TabPane tab="订单信息" key="1">
                  {
                    JSON.stringify(data) != "{}" && <OrderDetailsInfo product={data?.product} orderInfo={data?.orderInfo} config={configData} />
                  }
                </TabPane>
                {
                  permission.thirdnotebutton && orderInfo.leads_id && <TabPane tab="商家备注" key="10">
                    <MerchantRemark reqId={orderInfo.leads_id} data={merchantRemarkData} fun_fetchMerchantRemarkList={this.fetchMerchantRemarkList} />
                  </TabPane>
                }
                {
                  permission.thirdnotebutton && orderInfo.leads_id && <TabPane tab="三方录音" key="11">
                    <ThirdRecord reqId={orderInfo.leads_id} data={thirdRecordData} fun_fetchThirdRecordDataList={this.fetchThirdRecordList} />
                  </TabPane>
                }
                <TabPane tab="客户信息" key="2">
                  <OrderDetailsCustomerInfo config={configData} customerData={customerInfo} />
                </TabPane>
                <TabPane tab="联系人" key="3">
                  <OrderDetailsContactsInfo
                    contactsInfo={contacts}
                    editFunction={this.editContactsInfoFunction}
                    createFunction={this.createContasInfoFunction}
                  />
                </TabPane>
                {callcenteradapter_getrecordlist == true ? <TabPane tab="通话记录" key="4">
                  <OrderDetailsLinkedRecord callInfo={callRecord} listenrecorder={listenrecorder} />
                </TabPane> : ''}
                <TabPane tab="合同信息" key="5">
                  <ContractTab contractList={contractList} orderId={this.state.orderId}></ContractTab>
                </TabPane>
                <TabPane tab="回款记录" key="6">
                  <OrderDetailsReceivableRecordList
                    refunRecordModels={receivablesRecord ? receivablesRecord : {}}
                    showAddModal={this.addReceivableRecordItemFunction}
                    editModal={this.editReceivableRecordItemFunction}
                    deleteModal={this.deleteReceivableRecordItemFunction}
                    editPlanModel={this.editReceivableRecordPlanFunction}
                    showItemDetails={this.showReceivableRecordDetailsFunction}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ height: 900, overflowY: 'auto' }} >
              <OrderDetailsSalesOfDynamic
                followList={followList}
                followData={followData}
                showAddNewDynamicFunction={this.addSalesOfDynamicFunction}
                getFollowFounction={this.getFollowListFuntion} />
            </Card>
          </Col>
        </Row>


        <ShowOrderEditState
          saveFunction={this.editOrderStateFunction}
          onCancel={this.cancelEditOrderStateFunction}
          visible={this.state.showEditOrderState}
          data={orderInfo}
        />

        {/* 添加 联系人 */}
        <ShowEditAndAddContacsInfo
          saveFunction={this.createSaveContactsInfo}
          onCancel={this.editContactsInfoCancelFunction}
          visible={this.state.showEditAndAddContacsInfo && this.state.isCreateContacs}
          identity={identity}
          contactTimeList={contactTime}
        />
        {/* 编辑 联系人*/}
        <ShowEditAndAddContacsInfo
          saveFunction={this.createSaveContactsInfo}
          onCancel={this.editContactsInfoCancelFunction}
          visible={this.state.showEditAndAddContacsInfo && !(this.state.isCreateContacs)}
          data={this.state.editContacsInfo}
          identity={identity}
          contactTimeList={contactTime}
        />

        <Drawer
          width={590}
          visible={this.state.showAddNewDynamicInfo}
          closable={true}
          onClose={this.canceladdSalesOfDynamicFunction}>
          <div>
            <OrderDetailsRntryFollow
              customerId={customerInfo?.customer_id}
              customer_mobile={data?.customerInfo?.phone}
              customerName={customerInfo?.customer_name}
              orderId={data?.orderInfo?.id}
              customerConfig={configData}
              wechat={customerInfo?.wechat}
              encryptPhone={customerInfo?.encrypt_phone}
              isFriend={isFriend}
              getFollowList={this.saveFollowListFunction}
              hiddenFollowInfo={this.canceladdSalesOfDynamicFunction}
              contacts={contacts}
              tabActiveKey={this.state?.tabActiveKey}
              phase={data?.orderInfo?.phase}
            />
          </div>
        </Drawer>

        {/***编辑添加回款记录 */}
        <ShowEditAndAddReceivableRecord
          saveFunction={this.addReceivableRecordItemRequetsFunction}
          onCancel={this.cancelAddReceivableRecordItemFunction}
          receivablesUserIdSearch={this.receivablesUserIdSearch}
          visible={this.state.showEditAndAddReceivableRecordInfo}
          orderInfo={data?.orderInfo}
          moneyonfig={moneyonfig}
          userList={userList}
          currentUserId={this.state.currentUserId}
          currentUserName={this.state.currentUserName}
          type={this.state.receivableRecordType}
          contactsInfo={this.state.editReceivableRecordConstomerInfo}
          planInfo={this.state.editReceivableRecordInfoItem}
          plansItemModel={this.state?.plansItemModel}
        />

        {/**删除单条回款计划 */}
        <ShowDeleteReceivableRecord
          saveFunction={this.deleteReceivableRecordItemRequetsFunction}
          onCancel={this.cancelDeleteReceivableRecordItemFunction}
          visible={this.state.showDeleteReceivableRecordInfoItem}
          data={this.state.editReceivableRecordInfoItem}
          planId={this.state.planId}
        />

        {/** 回款计划调整和新增*/}
        <ShowEditReceivableRecordPlan
          saveFunction={this.editReceivableRecordPlanRequetsFunction}
          onCancel={this.cancelReceivableRecordPlanFunction}
          visible={this.state.showEditReceivableRecordPlan}
          data={receivablesRecord}
          orderInfo={data?.orderInfo}
          contractInfo={this.state?.editReceivabRecordPlanItemModel}
          planId={this.state.planId}
        />

        {/**回款记录详情 */}
        <OrderReceivableRecordDetails
          isVisble={this.state?.showReceivableRecordDetails}
          cancelFunction={this.cancelReceivableRecordDetailsFunction}
          model={this.state?.showReceivableRecordDetailsItem}
        />

        {/* 确认到店 */}
        <OrderDetailsConfirmShop
          visible={this.state?.isShowConfirmShop}
          saveFunction={this.confirmShopRequetsFunction}
          onCancel={this.cancelShowConfirmShopFunction}
          data={this.state?.reserveData}
        />

        {/* **商家结算
        <OrderDetailsShowMerchantsSettlement
          visible={this.state.showSettlementInfoVisible}
          showSettlementInfoView={this.showSettlementInfoFunction}
          orderId={this.state.orderId}
          settlementInfoList={settlementInfoList}
        /> */}

        <Modal
          visible={this.state.showColleagueChange}
          onCancel={this.cancaleColleagueChange}
          onOk={this.colleagueChangeRequest}
          style={{ marginTop: 250 }}
          title="转给同事"
        >
          <div>
            <Form>
              <Form.Item label='请选择转派人'>
                <Select
                  placeholder='请选择转派人'
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  onSearch={this.onSearchPeople}
                  onChange={this.colleagueSelectChange}
                >
                  {userList && userList.map((item) => {
                    return (
                      <Option value={item.user_id}>{item.username} {item.group_name}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <OrderDetailsInputPerCent
          visible={this.state.showInputPercent}
          onCancel={this.cancelInputPercentFunction}
        />

        <Modal
          title="填写商家结算"
          visible={this.state.showSettlementInfoVisible}
          onOk={this.handleOkSettlement}
          onCancel={this.handleCancelSettlement}
        >
          <div >
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <div style={{ marginTop: 20, height: 350, overflowY: 'auto', overflowX: 'hidden', marginBottom: 30 }}>
                  {this.getSettlementTodoItem(this.state.settlementInfoList)}
                  <a style={{ width: 100, marginBottom: 30, marginLeft: 200 }} type="primary" onClick={(e) => { this.addSettlement(e) }}>+添加结算信息 </a>

                </div>
              </Col>
            </Row>

          </div>
        </Modal>
      </PageHeaderWrapper >

    );
  }
}
export default Form.create<DetailsProps>()(OrderDetails);
// export default OrderDetails;
