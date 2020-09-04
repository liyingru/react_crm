import { FormComponentProps } from 'antd/es/form';
import React, { Component, Fragment, Children } from 'react';
import { Form, Table, Select, Button, Modal, message, Divider, Menu, Dropdown, Input, DatePicker, Radio, Checkbox, Row, Icon, Col, Switch, Spin } from 'antd';
import { StateType } from '../../model';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { RequirementData, RequirementDataDetails, ConfigItem, CategoryConfigItem, ReqButton } from '../../data';
import { ColumnProps } from 'antd/lib/table/interface';
import AreaSelect from '@/components/AreaSelect';
import FormItem from 'antd/es/form/FormItem';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import TextArea from 'antd/lib/input/TextArea';
import styles from './style.less';
import NumericInput from '@/components/NumericInput';
import { stringify } from 'qs';
import NumberRangeInput from '@/components/NumberRangeInput';
import CrmUtil from '@/utils/UserInfoStorage';
import { ReceiveUser, DistributeCompany, XPFlowInfo } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';
import { Merchant } from '@/pages/OrderManagement/newOrder/data';
import PageLoadingSelect from '@/components/PageLoadingSelect';

const { Option } = Select;

interface IntentionalDemandProps extends FormComponentProps {

  dispatch: Dispatch<
    Action<
      | 'leadManagementDetail/fetchReqList'
      | 'leadManagementDetail/createReqList'
      | 'leadManagementDetail/updateReqList'
      | 'leadManagementDetail/closeReq'
      | 'leadManagementDetail/openReq'
      | 'leadManagementDetail/fetchCustomerInfo'
      | 'leadManagementDetail/getXPFlowInfo'
      | 'leadManagementDetail/updateReqLite'
      | 'leadManagementDetail/turnTrue'
      | 'leadManagementDetail/distributeCompany'
      | 'leadManagementDetail/getRecommendMerchants'
      | 'leadManagementDetail/submitAdvancedForm'
    >
  >;
  loading: boolean;
  leadManagementDetail: StateType;
  onRef: (ref: any) => void;
  customerId: string;
  leadId: string;
  isclaimFlag: boolean;
  isDistribute: boolean;
}

interface IntentionalDemandState {
  closeModalVisible: boolean,
  closeModalTitle: string,

  optionModalVisible: boolean,
  optionCategoryTitle: string,
  optionCategoryValue: number,
  optionCategoryType: number, //0为创建， 1为更新
  editReq: RequirementData | undefined, //编辑的有效单

  carBrandType: string[],
  carBrandNum: string[],

  buttonModalVisible: boolean,
  buttonTitle: string,
  buttonType: number,
  buttonCompanyIds: string[],
  inviteReceiveUser: ReceiveUser[],
  distributeCompany: DistributeCompany[],
  merchantsList: Merchant[],
  merchantsNotFoundTips: string;
  setNoMoreMerchantsData: boolean;
}

@connect(
  ({
    leadManagementDetail,
    loading,
  }: {
    leadManagementDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    leadManagementDetail,
    loading: loading.models.leadManagementDetail,
  }),
)

class IntentionalDemand extends Component<IntentionalDemandProps, IntentionalDemandState> {

  constructor(props: Readonly<IntentionalDemandProps>) {
    super(props)
    this.props.onRef(this)
  }

  state: IntentionalDemandState = {
    closeModalVisible: false,
    closeModalTitle: "",

    optionModalVisible: false,
    optionCategoryTitle: "",
    optionCategoryValue: 1,
    optionCategoryType: 0,
    editReq: undefined,
    carBrandType: ['null'],
    carBrandNum: ['null'],

    buttonModalVisible: false,
    buttonTitle: '',
    buttonType: 0,
    buttonCompanyIds: [],
    inviteReceiveUser: [],
    distributeCompany: [],
    merchantsList: [],
    merchantsNotFoundTips: '请输入关键字搜索商家',
    setNoMoreMerchantsData: false,
  }

  componentDidMount() {
    const { dispatch, customerId, leadId } = this.props;
    const params = {
      customerId,
      leadsId: leadId,
      aggregation: '1',
    };
    dispatch({
      type: 'leadManagementDetail/fetchReqList',
      payload: params,
    });
  }

  //刷新有效单
  refreshReq = () => {
    const { dispatch, customerId, leadId } = this.props;
    const params = {
      customerId,
      leadsId: leadId,
      aggregation: '1',
    };
    dispatch({
      type: 'leadManagementDetail/fetchReqList',
      payload: params,
    });
    //刷新客户信息（有有效单信息）
    dispatch({
      type: 'leadManagementDetail/fetchCustomerInfo',
      payload: {
        id: customerId,
        leadsId: leadId,
      },
    });
  }

  //创建有效单对话框确认
  handleCreateReqOk = () => {
    const { dispatch, form, leadManagementDetail, customerId, leadId } = this.props;
    const { customerConfig } = leadManagementDetail;
    if (this.state.optionCategoryValue == 0) {
      message.error("品类出错");
      return;
    }
    let formFeilds: string[] = [];
    if (this.state.optionCategoryValue == 1) {
      formFeilds = ['hotelTablesFrom', 'hotelTablesEnd', 'siteType', 'scheduleType', 'perBudgetFrom', 'perBudgetEnd', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 2) {
      formFeilds = ['weddingStyle', 'hotelTablesFrom', 'hotelTablesEnd', 'perBudgetFrom', 'perBudgetEnd', 'hotel', 'hotelHall', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 3) {
      formFeilds = ['photoStyle', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 4) {
      formFeilds = ['hotelTablesFrom', 'hotelTablesEnd', 'hotel', 'hotelHall', 'perBudgetFrom', 'perBudgetEnd', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 5) {
      formFeilds = ['carTime', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 6) {
      formFeilds = ['weddingStyle', 'hotelTablesFrom', 'hotelTablesEnd', 'perBudgetFrom', 'perBudgetEnd', 'hotel', 'hotelHall', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 7) {
      formFeilds = ['dressUseWay', 'dressType', 'dressModel', 'dressNum', 'budgetFrom', 'budgetEnd'];
    }
    const categorys = customerConfig && customerConfig.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
    if (categorys && categorys.length == 1 && categorys[0].children) {
      formFeilds.push('finalCategory');
    }
    formFeilds.push('cityCode');
    formFeilds.push('remark');
    if ((CrmUtil.getCompanyType() == 1)) {
      formFeilds.push('needAutoDistribute');
    }
    form.validateFieldsAndScroll(formFeilds, (err, values) => {
      if (err) {
        return;
      }
      if ((CrmUtil.getCompanyType() == 1)) {
        //组装数据
        values['needAutoDistribute'] = !!values['needAutoDistribute'] ? 1 : 0;
      }
      const carTimeForUtc = values['carTime']
      if (carTimeForUtc != undefined) {
        values['carTime'] = moment(carTimeForUtc).format('YYYY-MM-DD HH:mm')
      }
      const dressType: string[] = values['dressType']
      if (dressType != undefined) {
        let types: string = "";
        dressType.map((value, index) => {
          if (value != 'null') {
            types = types + value;
          }
          if (index + 1 < dressType.length) {
            types = types + ",";
          }
        })
        values['dressType'] = types;
      }
      const dressModel: string[] = values['dressModel']
      if (dressModel != undefined) {
        let types: string = "";
        dressModel.map((value, index) => {
          if (value != 'null') {
            types = types + value;
          }
          if (index + 1 < dressModel.length) {
            types = types + ",";
          }
        })
        values['dressModel'] = types;
      }
      const categoryChild = {
        ...values,
      }
      if (this.state.optionCategoryValue == 5) {
        const carJson: any = [];
        this.state.carBrandType.map((type, index) => {
          const num = this.state.carBrandNum[index];
          if (type != 'null' && num != 'null') {
            const child = {
              carBrand: type,
              carNum: num,
            }
            carJson.push(child)
          }
        })
        categoryChild['carJson'] = carJson;
      }
      const categoryReq = {

      }
      const categorys = customerConfig && customerConfig.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
      if (!categorys || categorys.length != 1 || !categorys[0].children) {
        categoryChild['finalCategory'] = this.state.optionCategoryValue
      }
      if (this.state.optionCategoryValue == 1) {
        categoryReq['banquet'] = categoryChild;
      } else if (this.state.optionCategoryValue == 2) {
        categoryReq['wedding'] = categoryChild;
      } else if (this.state.optionCategoryValue == 3) {
        categoryReq['photography'] = categoryChild;
      } else if (this.state.optionCategoryValue == 4) {
        categoryReq['celebration'] = categoryChild;
      } else if (this.state.optionCategoryValue == 5) {
        categoryReq['car'] = categoryChild;
      } else if (this.state.optionCategoryValue == 6) {
        categoryReq['oneStop'] = categoryChild;
      } else if (this.state.optionCategoryValue == 7) {
        categoryReq['dress'] = categoryChild;
      }

      if (this.state.optionCategoryType == 0) { //创建
        const params = {
          categoryReq: categoryReq,
          customerId,
          leadsId: leadId,
          category: this.state.optionCategoryValue,
        };
        console.log(params)
        dispatch({
          type: 'leadManagementDetail/createReqList',
          payload: params,
          callback: (code: number, msg: string) => {
            if (code != 200) {
              return;
            }

            //关闭弹窗和重制信息
            this.setState({
              optionModalVisible: false,
              optionCategoryTitle: "",
              optionCategoryValue: 1,
              optionCategoryType: 0,
              editReq: undefined,
              carBrandType: ['null'],
              carBrandNum: ['null'],
            })

            message.success('创建成功');
            localStorage?.setItem('leadsListRefreshTag', 'list')
            this.refreshReq();
          }
        });
      } else if (this.state.optionCategoryType == 1) { //更新
        if (!this.state.editReq) {
          message.error("出现未知错误");
          return;
        }
        const params = {
          categoryReq: categoryReq,
          reqId: this.state.editReq.id,
        };
        console.log(params)
        dispatch({
          type: 'leadManagementDetail/updateReqList',
          payload: params,
          callback: (code: number, msg: string) => {
            if (code != 200) {
              return;
            }

            //关闭弹窗和重制信息
            this.setState({
              optionModalVisible: false,
              optionCategoryTitle: "",
              optionCategoryValue: 1,
              optionCategoryType: 0,
              editReq: undefined,
              carBrandType: ['null'],
              carBrandNum: ['null'],
            })

            message.success('更新成功');
            localStorage?.setItem('leadsListRefreshTag', 'list')
            this.refreshReq();
          }
        });
      }
    });
  }

  //创建有效单对话框取消
  handleCreateReqCancel = () => {
    this.setState({
      optionModalVisible: false,
      optionCategoryTitle: "",
      optionCategoryValue: 1,
      optionCategoryType: 0,
      editReq: undefined,
    })
  }

  //增加品牌邀请
  handleAddCarBrand = () => {
    let carBrandType = this.state.carBrandType;
    let carBrandNum = this.state.carBrandNum;
    carBrandType.push('null');
    carBrandNum.push('null');
    this.setState({
      carBrandType: carBrandType,
      carBrandNum: carBrandNum,
    })
  }

  //创建选择有效单品类
  handleSelectCategory = (name: string, value: number) => {
    this.setState({
      optionModalVisible: true,
      optionCategoryTitle: name,
      optionCategoryValue: value,
      optionCategoryType: 0,
      editReq: undefined,
      carBrandType: ['null'],
      carBrandNum: ['null'],
    })

  }

  //编辑有效单
  handleEidtReq = (name: string, value: number, data: RequirementData) => {
    let carBrandType: string[] = [];
    let carBrandNum: string[] = [];
    console.log(JSON.stringify(data.car_info))
    if (data.car_info && data.car_info.length > 0) {
      data.car_info.map(info => {
        carBrandType.push(info.carBrand);
        carBrandNum.push(info.carNum);
      })
    }
    this.setState({
      optionModalVisible: true,
      optionCategoryTitle: name,
      optionCategoryValue: value,
      optionCategoryType: 1,
      editReq: data,
      carBrandType: carBrandType,
      carBrandNum: carBrandNum,
    })
  }

  //打开有效单
  handleOpenReq = (data: RequirementData) => {
    const { dispatch, customerId, leadId } = this.props;
    const params = {
      reqId: data.id,
    };
    dispatch({
      type: 'leadManagementDetail/openReq',
      payload: params,
      callback: (code: number, msg: string) => {
        if (code != 200) {
          return;
        }
        this.refreshReq();
      }
    });
  }

  //关闭有效单
  handleCloseReq = (data: RequirementData) => {
    this.setState({
      closeModalVisible: true,
      closeModalTitle: '关闭有效单',
      editReq: data,
    })
  }

  //关闭有效单确认
  handleCloseReqOk = () => {
    const { form, dispatch, customerId, leadId } = this.props;
    let formFeilds: string[] = ['closeReason'];
    form.validateFields(formFeilds, (err, values) => {
      if (err) {
        message.error('请填写关闭说明');
        return;
      }
      this.setState({
        closeModalVisible: false,
        closeModalTitle: '',
        editReq: undefined,
      })
      if (!this.state.editReq) {
        message.error("缺少有效单id");
        return;
      }
      const params = {
        ...values,
        reqId: this.state.editReq.id,
        status: '0',
      };
      dispatch({
        type: 'leadManagementDetail/closeReq',
        payload: params,
        callback: (code: number, msg: string) => {
          if (code != 200) {
            return;
          }
          this.refreshReq();
        }
      });
    });
  }

  //关闭有效单取消
  handleCloseReqCancel = () => {
    this.setState({
      closeModalVisible: false,
      closeModalTitle: '',
      editReq: undefined,
    })
  }

  //有效单关闭说明提示
  handleCloseReqAlert = (title: string, data: RequirementData) => {
    Modal.info({
      title: title,
      okText: '知道了',
      content: data.close_reason,
      centered: true,
      onOk() { },
    });
  }

  //推荐
  handleRecommend = (data: RequirementData) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/store/storeDetails',
      query: {
        customerId: data.customer_id,
        reqId: data.id,
        category: data.top_category,
        cityInfo: data.city_info.city_code
      }
    }));
    // console.log('leadsManagement=======demand', data)
    // let url = window.location.href;
    // let str = '';
    // if(url.indexOf('/customer/')!=-1){
    //   str = '/customer/';
    // }else{
    //   str = '/demand/';
    // }
    // url = url.split('/leads/')[0] + '/store/storeDetails?customerId=' + data.customer_id + '&reqId=' + data.id + '&category=' + data.top_category + '&cityInfo=' + data.city_info.city_code;
    // window.open(url);
  }

  //按钮操作
  handleButton = (record: RequirementData, button: ReqButton) => {
    const { dispatch } = this.props;
    if (button.type == 10 || button.type == 20 || button.type == 21) {
      this.setState({
        buttonModalVisible: true,
        buttonTitle: button.name,
        buttonType: button.type,
        buttonCompanyIds: button.assign_merchant_ids,
        editReq: record,
      })
      const params = {
        channelId: record.channel,
        type: '2',
        level: record.level,
      }
      dispatch({
        type: 'leadManagementDetail/getXPFlowInfo',
        payload: params,
        callback: (xpFlowInfo: XPFlowInfo) => {
          this.setState({
            inviteReceiveUser: xpFlowInfo.receive_user,
            distributeCompany: xpFlowInfo.distribute_company,
          })
        }
      });
    } else if (button.type == 30) {
      this.setState({
        buttonModalVisible: true,
        buttonTitle: button.name,
        buttonType: button.type,
        buttonCompanyIds: button.assign_merchant_ids,
        editReq: record,
      })
    }
  }

  //确定
  handleButtonOk = () => {
    const { form, dispatch } = this.props;
    if (this.state.buttonType == 10) {
      let formFeilds: string[] = ['ownerId'];
      form.validateFields(formFeilds, (err, values) => {
        if (err) {
          message.error('请选择邀约人');
          return;
        }
        const params = {
          ...values,
          reqId: this.state.editReq?.id,
        };
        dispatch({
          type: 'leadManagementDetail/turnTrue',
          payload: params,
          callback: (success: boolean) => {
            if (success) {
              //关闭弹窗和重制
              this.setState({
                buttonModalVisible: false,
                buttonTitle: '',
                buttonType: 0,
                buttonCompanyIds: [],
                editReq: undefined,
                inviteReceiveUser: [],
                distributeCompany: [],
              })
              message.success('邀约人指定成功');
              this.refreshReq();
            }
          }
        });
      });
    } else if (this.state.buttonType == 20) {
      let formFeilds: string[] = ['companyId'];
      form.validateFields(formFeilds, (err, values) => {
        if (err) {
          message.error('请选择派发公司');
          return;
        }
        const params = {
          companyId: values['companyId'] + "",
          reqId: this.state.editReq?.id,
        };
        dispatch({
          type: 'leadManagementDetail/distributeCompany',
          payload: params,
          callback: (success: boolean) => {
            if (success) {
              //关闭弹窗和重制
              this.setState({
                buttonModalVisible: false,
                buttonTitle: '',
                buttonType: 0,
                buttonCompanyIds: [],
                editReq: undefined,
                inviteReceiveUser: [],
                distributeCompany: [],
              })
              message.success('派发公司成功');
              this.refreshReq();
            }
          }
        });
      });
    } else if (this.state.buttonType == 30) {
      let formFeilds: string[] = ['merchant'];
      form.validateFields(formFeilds, (err, values) => {
        if (err) {
          message.error('请选择派发公司');
          return;
        }
        let merchantValues: any = []
        values['merchant'].map(value => {
          let datas: string[] = value.split(',|,')
          merchantValues.push({
            merchantId: datas[0],
            merchant: datas[1],
          })
        })
        const params = {
          customerId: this.state.editReq?.customer_id,
          reqId: this.state.editReq?.id,
          category: this.state.editReq?.category,
          merchant: merchantValues,
        };
        dispatch({
          type: 'leadManagementDetail/submitAdvancedForm',
          payload: params,
          callback: (success: boolean) => {
            if (success) {
              //关闭弹窗和重制
              this.setState({
                buttonModalVisible: false,
                buttonTitle: '',
                buttonType: 0,
                buttonCompanyIds: [],
                editReq: undefined,
                merchantsList: [],
              })
              message.success('派发公司成功');
              this.refreshReq();
            }
          }
        });
      });
    }
  }

  //取消
  handleButtonCancel = () => {
    this.setState({
      buttonModalVisible: false,
      buttonTitle: '',
      buttonType: 0,
      buttonCompanyIds: [],
      editReq: undefined,
      inviteReceiveUser: [],
      distributeCompany: [],
      merchantsList: [],
    })
  }
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
    if (!keyword) {
      this.setState({
        merchantsNotFoundTips: "请输入关键字搜索商家"
      })
    };
  }

  searchMerchants = (key: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'leadManagementDetail/getRecommendMerchants',
      payload: {
        page: this.merchantsPagination.page,
        pageSize: this.merchantsPagination.pageSize,
        keyword: key,
        category: this.state.editReq?.category,
      },
      callback: (success: boolean) => {
        if (success) {
          const { merchantsList } = this.state;
          const { leadManagementDetail: { merchantsListSinglePageData, merchantsTotal } } = this.props;
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
            merchantsNotFoundTips: '没有搜索到关键字为“' + key + '”的商家'
          })
        }
      },
    })
  };

  handleCityChange = (code: string, province: string, city: string, district: string) => {
    const { form } = this.props;
    form.setFieldsValue({
      cityCode: code
    });
  }

  renderTable = (details: RequirementDataDetails, isMy: boolean) => {
    console.log(details)
    if (details.category_id == 1) {
      return this.renderHYTable(details.category_name, details.data, isMy);
    } else if (details.category_id == 2) {
      return this.renderHQTable(details.category_name, details.data, isMy);
    } else if (details.category_id == 3) {
      return this.renderHSSYTable(details.category_name, details.data, isMy);
    } else if (details.category_id == 4) {
      return this.renderQDTable(details.category_name, details.data, isMy);
    } else if (details.category_id == 5) {
      return this.renderHCTable(details.category_name, details.data, isMy);
    } else if (details.category_id == 6) {
      return this.renderYZSTable(details.category_name, details.data, isMy);
    } else if (details.category_id == 7) {
      return this.renderHSLFTable(details.category_name, details.data, isMy);
    }
    return null;
  }

  renderGroup = (title: string, reqDataList: RequirementDataDetails[]) => {
    let maginTop: string = '0px'
    let isMy: boolean = true;
    if (title == '同事建单') {
      maginTop = '30px'
      isMy = false;
    }
    return (
      <div style={{ marginTop: maginTop }}>
        <div className={styles.headerMaxTitle}>{title}</div>
        {
          reqDataList.map(details => (
            this.renderTable(details, isMy)
          ))
        }
      </div>
    );
  }

  render() {
    const { loading, leadManagementDetail, form, isclaimFlag } = this.props;
    const { reqGroupData, customerConfig } = leadManagementDetail;
    const { getFieldDecorator } = form;


    const categoryMenu = (
      <Menu>
        {
          customerConfig.category.map(categ => (
            <Menu.Item>
              <a onClick={() => this.handleSelectCategory("新建" + categ.name + "有效单", Number(categ.id))}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );

    // const categoryMenu = (
    //   <Menu>
    //     <Menu.Item>
    //       <a onClick={() => this.handleSelectCategory('新建婚宴有效单', 1)}>婚宴</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={() => this.handleSelectCategory('新建婚礼有效单', 2)}>婚庆</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={() => this.handleSelectCategory('新建婚纱摄影有效单', 3)}>婚纱摄影</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={() => this.handleSelectCategory(`新建${React.$celebrationOrWeddingBanquet()}有效单`, 4)}>{React.$celebrationOrWeddingBanquet()}</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={() => this.handleSelectCategory('新建婚车有效单', 5)}>婚车</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={() => this.handleSelectCategory('新建一站式有效单', 6)}>一站式</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={() => this.handleSelectCategory('新建婚纱礼服有效单', 7)}>婚纱礼服</a>
    //     </Menu.Item>
    //   </Menu>
    // );

    const category2 = customerConfig.category2

    return (
      <div>
        <div style={{
          marginTop: 8,
          marginBottom: 15,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div />
          <Modal
            title={this.state.buttonTitle}
            visible={this.state.buttonModalVisible}
            onOk={this.handleButtonOk}
            destroyOnClose={true}
            okButtonProps={{ disabled: (this.props.loading || this.state.buttonType == 21) }}
            cancelButtonProps={{ disabled: this.props.loading }}
            onCancel={this.handleButtonCancel}>
            <Spin spinning={this.props.loading}>
              <Form>
                {
                  this.state.buttonType == 10 ? getFieldDecorator('ownerId', {
                    rules: [{ required: true, message: '请选择' + this.state.buttonTitle }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder={"请选择" + this.state.buttonTitle}
                      optionFilterProp="children">
                      {
                        this.state.inviteReceiveUser && this.state.inviteReceiveUser.map(item => (
                          <Option value={item.id}>
                            {item.name}
                          </Option>
                        )
                        )
                      }
                    </Select>
                  ) : null
                }
                {
                  (this.state.buttonType == 20 || this.state.buttonType == 21) ? getFieldDecorator('companyId', {
                    rules: [{ required: true, message: '请选择' + this.state.buttonTitle }],
                    initialValue: this.state.buttonCompanyIds == null ? undefined : this.state.buttonCompanyIds
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder={"请选择" + this.state.buttonTitle}
                      disabled={this.state.buttonType == 21 ? true : false}
                      optionFilterProp="children">
                      {
                        this.state.distributeCompany && this.state.distributeCompany.map(item => (
                          <Option value={item.id}>
                            {item.name}
                          </Option>
                        )
                        )
                      }
                    </Select>
                  ) : null
                }
                {
                  this.state.buttonType == 30 ? getFieldDecorator('merchant', {
                    rules: [{ required: true, message: '请添加派发公司' }],
                  })(
                    <PageLoadingSelect
                      mode="multiple"
                      placeholder="请添加派发公司"
                      notFoundContent={this.state.merchantsNotFoundTips}
                      onKeywordChanged={this.onMerchantKeywordChanged}
                      doSearch={this.searchMerchants}
                      noMoreData={this.state.setNoMoreMerchantsData}
                    >
                      {
                        this.state.merchantsList && this.state.merchantsList.map(item => (
                          <Option value={item.id + ",|," + item.name} disabled={this.state.buttonCompanyIds && this.state.buttonCompanyIds.indexOf(item.id) >= 0}>
                            <div>
                              {'商家名称：' + item.name}
                              <br />
                              {'类型：' + item.category_name}
                              <br />
                              {'负责销售：' + item.sale_name}
                            </div>
                          </Option>
                        ))
                      }
                    </PageLoadingSelect>
                  ) : null
                }
              </Form>
            </Spin>
          </Modal>
          <Modal
            title={this.state.closeModalTitle}
            visible={this.state.closeModalVisible}
            onOk={this.handleCloseReqOk}
            destroyOnClose={true}
            okButtonProps={{ disabled: this.props.loading }}
            cancelButtonProps={{ disabled: this.props.loading }}
            onCancel={this.handleCloseReqCancel}>
            <Spin spinning={this.props.loading}>
              <Form>
                {getFieldDecorator('closeReason', {
                  rules: [{ required: true, message: '请输入关闭原因' }],
                })(
                  <TextArea autoSize={{ minRows: 10, maxRows: 10 }} placeholder="请输入关闭原因" />
                )}
              </Form>
            </Spin>
          </Modal>
          <Modal
            title={this.state.optionCategoryTitle}
            visible={this.state.optionModalVisible}
            onOk={this.handleCreateReqOk}
            destroyOnClose={true}
            width={600}
            okButtonProps={{ disabled: this.props.loading }}
            cancelButtonProps={{ disabled: this.props.loading }}
            onCancel={this.handleCreateReqCancel}>
            <Spin spinning={this.props.loading}>
              <Form>
                {
                  this.renderHaveCategory2()
                }
                <FormItem label="意向区域" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                  <div style={{ marginLeft: 5 }} >
                    {getFieldDecorator('cityCode', {
                      rules: [{ required: true, message: "请选择意向区域", }],
                      initialValue: ''
                    })(
                      <AreaSelect areaSelectChange={this.handleCityChange} level3={true} selectedCode={this.state.editReq ? this.state.editReq.city_code : undefined} />
                    )}
                  </div>
                </FormItem>

                {
                  (this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6) ? <FormItem label="婚礼风格" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('weddingStyle', {
                      initialValue: this.state.editReq ? this.state.editReq.wedding_style : undefined,
                    })(
                      <Radio.Group style={{ marginLeft: 5 }} >
                        {
                          (customerConfig && customerConfig.weddingStyle) ? customerConfig.weddingStyle.map(style => (
                            <Radio value={style.id}>{style.name}</Radio>)) : null
                        }
                      </Radio.Group>
                    )}
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 3) ? <FormItem label="拍照风格" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('photoStyle', {
                      initialValue: this.state.editReq ? this.state.editReq.photo_style : undefined,
                    })(
                      <Radio.Group style={{ marginLeft: 5 }} >
                        {
                          (customerConfig && customerConfig.photoStyle) ? customerConfig.photoStyle.map(style => (
                            <Radio value={style.id}>{style.name}</Radio>)) : null
                        }
                      </Radio.Group>
                    )}
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6 || this.state.optionCategoryValue == 4) ? <FormItem label={(this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6) ? "婚礼桌数" : "举办桌数"} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'hotelTablesFrom'} maximumField={'hotelTablesEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.hotel_tables_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.hotel_tables_end) : undefined} />
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 1) ? <FormItem label="场地类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('siteType', {
                      initialValue: this.state.editReq ? this.state.editReq.site_type : undefined,
                    })(
                      <Radio.Group style={{ marginLeft: 5 }} >
                        {
                          (customerConfig && customerConfig.siteType) ? customerConfig.siteType.map(style => (
                            <Radio value={style.id}>{style.name}</Radio>)) : null
                        }
                      </Radio.Group>
                    )}
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 1) ? <FormItem label="档期类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('scheduleType', {
                      initialValue: this.state.editReq ? this.state.editReq.schedule_type : undefined,
                    })(
                      <Radio.Group style={{ marginLeft: 5 }} >
                        {
                          (customerConfig && customerConfig.scheduleType) ? customerConfig.scheduleType.map(style => (
                            <Radio value={style.id}>{style.name}</Radio>)) : null
                        }
                      </Radio.Group>
                    )}
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ?
                    <FormItem label="预定酒店" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('hotel', {
                        initialValue: this.state.editReq ? this.state.editReq.hotel : '',
                      })(
                        <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                      )}
                    </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ?
                    <FormItem label="宴会厅" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('hotelHall', {
                        initialValue: this.state.editReq ? this.state.editReq.hotel_hall : '',
                      })(
                        <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                      )}
                    </FormItem> : null
                }
                {
                  this.state.optionCategoryValue == 5 ? <FormItem label="用车时间" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('carTime', {
                      initialValue: (this.state.editReq && this.state.editReq.car_time != '') ? moment(this.state.editReq.car_time, 'YYYY-MM-DD HH:mm') : undefined,
                    })(
                      <DatePicker style={{ marginLeft: 5 }}
                        format="YYYY-MM-DD HH:mm"
                        showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                        placeholder='请选择用车时间' />
                    )}
                  </FormItem> : null
                }
                {
                  this.state.optionCategoryValue == 5 ? <FormItem label="品牌要求" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {
                      this.renderCarBrand()
                    }
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 7) ? <FormItem label="使用方式" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('dressUseWay', {
                      initialValue: this.state.editReq ? this.state.editReq.dress_use_way : undefined,
                    })(
                      <Radio.Group style={{ marginLeft: 5 }} >
                        {
                          (customerConfig && customerConfig.dressUseWay) ? customerConfig.dressUseWay.map(style => (
                            <Radio value={style.id}>{style.name}</Radio>)) : null
                        }
                      </Radio.Group>
                    )}
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 7) ? <FormItem label="服饰类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('dressType', {
                      initialValue: this.state.editReq ? this.state.editReq.dress_type?.split(',').map(Number) : undefined,
                    })(
                      <Checkbox.Group style={{ marginLeft: 5 }} >
                        {
                          (customerConfig && customerConfig.dressType) ? customerConfig.dressType.map(style => (
                            <Checkbox value={style.id}>{style.name}</Checkbox>)) : null
                        }
                      </Checkbox.Group>
                    )}
                  </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 7) ? <FormItem label="礼服款式" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('dressModel', {
                      initialValue: this.state.editReq ? this.state.editReq.dress_model?.split(',').map(Number) : undefined,
                    })(
                      <Checkbox.Group style={{ marginLeft: 5 }} >
                        {
                          (customerConfig && customerConfig.dressModel) ? customerConfig.dressModel.map(style => (
                            <Checkbox value={style.id}>{style.name}</Checkbox>)) : null
                        }
                      </Checkbox.Group>
                    )}
                  </FormItem> : null
                }
                {(this.state.optionCategoryValue == 7) ? <FormItem label="礼服数量" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                  {getFieldDecorator('dressNum', {
                    initialValue: this.state.editReq ? this.state.editReq.dress_num : '',
                  })(
                    <NumericInput autoComplete="off" maxLength={5} style={{ width: '100%', marginLeft: 5 }} suffix="套" placeholder="请输入" />
                  )}
                </FormItem> : null
                }
                {
                  (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ? <FormItem label="每桌预算" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'perBudgetFrom'} maximumField={'perBudgetEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.per_budget_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.per_budget_end) : undefined} />
                  </FormItem> : null
                }
                {
                  <FormItem label={this.state.optionCategoryValue == 1 ? "婚宴预算" : this.state.optionCategoryValue == 2 ? "婚庆预算" : this.state.optionCategoryValue == 3 ? "婚纱摄影预算" : this.state.optionCategoryValue == 4 ? `${React.$celebrationOrWeddingBanquet()}预算` : this.state.optionCategoryValue == 5 ? "婚车预算" : this.state.optionCategoryValue == 6 ? "整体预算" : this.state.optionCategoryValue == 7 ? "婚服预算" : ""} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'budgetFrom'} maximumField={'budgetEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.budget_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.budget_end) : undefined} />
                  </FormItem>
                }
                <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                  {getFieldDecorator('remark', {
                    initialValue: this.state.editReq ? this.state.editReq.remark : '',
                  })(
                    <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                  )}
                </FormItem>
                {
                  CrmUtil.getCompanyType() == 1 && <FormItem label="是否自动分配" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('needAutoDistribute', {
                      rules: [{ required: false }],
                      valuePropName: "checked",
                      initialValue: this.state.editReq?.need_auto_distribute == 0 ? false : true
                    })(
                      <Switch style={{ marginLeft: 5 }} size="default" />
                    )}
                  </FormItem>
                }
              </Form>
            </Spin>
          </Modal>
        </div>
        {
          (reqGroupData.my && reqGroupData.my.length > 0) ?
            this.renderGroup("我的建单", reqGroupData.my) : null
        }
        {
          (reqGroupData.other && reqGroupData.other.length > 0) ?
            this.renderGroup("同事建单", reqGroupData.other) : null
        }
      </div >
    );
  };

  renderHaveCategory2() {
    const { leadManagementDetail: { customerConfig } } = this.props;
    const categorys = customerConfig && customerConfig.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
    return (
      categorys && categorys.length == 1 && categorys[0].children ? this.renderCategory2(categorys[0].children) : null
    );
  }

  renderCategory2(category2: CategoryConfigItem[]) {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    console.log(category2);
    return (
      category2 ? <FormItem label="二级品类" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
        {getFieldDecorator('finalCategory', {
          initialValue: this.state.editReq ? this.state.editReq.final_category : undefined,
          rules: [{ required: true, message: '请选择二级品类' }],
        })(
          <Radio.Group style={{ marginLeft: 5 }} disabled={this.state.optionCategoryType == 0 ? false : true}>
            {
              category2.map(style => (<Radio value={style.value}>{style.label}</Radio>))
            }
          </Radio.Group>
        )}
      </FormItem> : null
    );
  }

  renderCarBrand() {
    return (
      <div>
        {
          this.state.carBrandType.map((title, index) =>
            this.renderCarBrandItem(index, this.state.carBrandType.length)
          )
        }
        <a onClick={this.handleAddCarBrand} style={{ marginBottom: '0px', marginTop: '0px' }}> <Icon type="plus" />添加</a>
      </div>
    );
  }
  renderCarBrandItem(index: number, length: number) {
    const { leadManagementDetail } = this.props;
    const { customerConfig } = leadManagementDetail;

    let defaultTypeValue: string | undefined;
    let defaultNumValue: string | undefined;
    console.log(this.state.carBrandType);
    console.log(this.state.carBrandNum);
    if (this.state.carBrandType && this.state.carBrandType.length > index && this.state.carBrandType[index] != 'null') {
      defaultTypeValue = this.state.carBrandType[index]
    }
    if (this.state.carBrandNum && this.state.carBrandNum.length > index && this.state.carBrandNum[index] != 'null') {
      defaultNumValue = this.state.carBrandNum[index]
    }
    console.log("defaultTypeValue:" + defaultTypeValue + "---defaultNumValue:" + defaultNumValue)
    return (
      <div>
        {
          <FormItem label="用车品牌" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ marginBottom: '5px' }}>
            <Select placeholder="请选择" style={{ marginLeft: 5 }} defaultValue={defaultTypeValue} onChange={(value: string) => {
              let carBrandType = this.state.carBrandType;
              carBrandType.splice(index, 1, value)
              this.setState({
                carBrandType: carBrandType,
              })
            }}>
              {
                (customerConfig && customerConfig.carBrand) ? customerConfig.carBrand.map(style => (
                  <Option value={style.id}>{style.name}</Option>)) : null
              }
            </Select>
          </FormItem>
        }
        {
          <FormItem label="用车数量" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ marginBottom: '5px' }}>
            <NumericInput placeholder="请输入" style={{ marginLeft: 5 }} value={defaultNumValue} onChange={(e) => {
              const { value } = e.target;
              let carBrandNum = this.state.carBrandNum;
              carBrandNum.splice(index, 1, value)
              this.setState({
                carBrandNum: carBrandNum,
              })
            }} />
          </FormItem>
        }
        {
          index < length - 1 ? <Divider style={{ marginBottom: '15px', marginTop: '15px' }} /> : null
        }
      </div>
    );
  }

  //婚宴columns
  hyMyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => {
        console.log(record)
        return (<div>{record.full}</div>)
      },
    },
    {
      title: '婚礼桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '场地类型',
      dataIndex: 'site_type_txt',
    },
    {
      title: '档期类型',
      dataIndex: 'schedule_type_txt',
    },
    {
      title: '每桌预算',
      dataIndex: 'per_budget',
    },
    {
      title: '婚宴预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚宴有效单', 1, record, true)
          }
        </div>
      ),
    }
  ];

  //婚宴columns
  hyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => {
        console.log(record)
        return (<div>{record.full}</div>)
      },
    },
    {
      title: '婚礼桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '场地类型',
      dataIndex: 'site_type_txt',
    },
    {
      title: '档期类型',
      dataIndex: 'schedule_type_txt',
    },
    {
      title: '每桌预算',
      dataIndex: 'per_budget',
    },
    {
      title: '婚宴预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚宴有效单', 1, record, false)
          }
        </div>
      ),
    }
  ];

  //婚宴
  renderHYTable = (name: string, datas: RequirementData[], isMy: boolean) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => name}
        columns={isMy ? this.hyMyColumns : this.hyColumns}
        dataSource={datas} />
    );
  }

  //婚庆columns
  hqMyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
      width: '120',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '婚礼风格',
      dataIndex: 'wedding_style_txt',
    },
    {
      title: '婚礼桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '预定酒店',
      dataIndex: 'hotel',
    },
    {
      title: '宴会厅',
      dataIndex: 'hotel_hall',
    },
    {
      title: '婚礼预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚庆有效单', 2, record, true)
          }
        </div>
      ),
    }
  ];

  //婚庆columns
  hqColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
      width: '120',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '婚礼风格',
      dataIndex: 'wedding_style_txt',
    },
    {
      title: '婚礼桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '预定酒店',
      dataIndex: 'hotel',
    },
    {
      title: '宴会厅',
      dataIndex: 'hotel_hall',
    },
    {
      title: '婚礼预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚庆有效单', 2, record, false)
          }
        </div>
      ),
    }
  ];

  //婚庆
  renderHQTable = (name: string, datas: RequirementData[], isMy: boolean) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => name}
        columns={isMy ? this.hqMyColumns : this.hqColumns}
        dataSource={datas} />
    );
  }

  //婚纱摄影columns
  hssyMyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '拍照风格',
      dataIndex: 'photo_style_txt',
    },
    {
      title: '婚摄预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚纱摄影有效单', 3, record, true)
          }
        </div>
      ),
    }
  ];

  //婚纱摄影columns
  hssyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '拍照风格',
      dataIndex: 'photo_style_txt',
    },
    {
      title: '婚摄预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚纱摄影有效单', 3, record, false)
          }
        </div>
      ),
    }
  ];

  //婚纱摄影
  renderHSSYTable = (name: string, datas: RequirementData[], isMy: boolean) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => name}
        columns={isMy ? this.hssyMyColumns : this.hssyColumns}
        dataSource={datas} />
    );
  }

  //庆典or喜宴columns
  qdMyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '举办桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '预定酒店',
      dataIndex: 'hotel',
    },
    {
      title: '宴会厅',
      dataIndex: 'hotel_hall',
    },
    {
      title: '每桌预算',
      dataIndex: 'per_budget',
    },
    {
      title: `${React.$celebrationOrWeddingBanquet()}预算`,
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption(`编辑${React.$celebrationOrWeddingBanquet()}有效单`, 4, record, true)
          }
        </div>
      ),
    }
  ];

  //庆典or喜宴columns
  qdColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '举办桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '预定酒店',
      dataIndex: 'hotel',
    },
    {
      title: '宴会厅',
      dataIndex: 'hotel_hall',
    },
    {
      title: '每桌预算',
      dataIndex: 'per_budget',
    },
    {
      title: `${React.$celebrationOrWeddingBanquet()}预算`,
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption(`编辑${React.$celebrationOrWeddingBanquet()}有效单`, 4, record, false)
          }
        </div>
      ),
    }
  ];

  //庆典or喜宴
  renderQDTable = (name: string, datas: RequirementData[], isMy: boolean) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => name}
        columns={isMy ? this.qdMyColumns : this.qdColumns}
        dataSource={datas} />
    );
  }

  //婚车colums
  hcMyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '用车时间',
      dataIndex: 'car_time',
    },
    {
      title: '选择品牌',
      dataIndex: 'car_brand',
    },
    {
      title: '用车数量',
      dataIndex: 'car_num',
    },
    {
      title: '婚车预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚车有效单', 5, record, true)
          }
        </div>
      ),
    }
  ];

  //婚车colums
  hcColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '用车时间',
      dataIndex: 'car_time',
    },
    {
      title: '选择品牌',
      dataIndex: 'car_brand',
    },
    {
      title: '用车数量',
      dataIndex: 'car_num',
    },
    {
      title: '婚车预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚车有效单', 5, record, false)
          }
        </div>
      ),
    }
  ];

  //婚车
  renderHCTable = (name: string, datas: RequirementData[], isMy: boolean) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        title={() => name}
        columns={isMy ? this.hcMyColumns : this.hcColumns}
        pagination={false}
        dataSource={datas} />
    );
  }

  //一站式colums
  yzsMyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '婚礼风格',
      dataIndex: 'wedding_style_txt',
    },
    {
      title: '每桌预算',
      dataIndex: 'per_budget',
    },
    {
      title: '特定酒店',
      dataIndex: 'hotel',
    },
    {
      title: '宴会厅',
      dataIndex: 'hotel_hall',
    },
    {
      title: '整体预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑一站式有效单', 6, record, true)
          }
        </div>
      ),
    }
  ];

  //一站式colums
  yzsColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '婚礼风格',
      dataIndex: 'wedding_style_txt',
    },
    {
      title: '每桌预算',
      dataIndex: 'per_budget',
    },
    {
      title: '特定酒店',
      dataIndex: 'hotel',
    },
    {
      title: '宴会厅',
      dataIndex: 'hotel_hall',
    },
    {
      title: '整体预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑一站式有效单', 6, record, false)
          }
        </div>
      ),
    }
  ];

  //一站式
  renderYZSTable = (name: string, datas: RequirementData[], isMy: boolean) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => name}
        columns={isMy ? this.yzsMyColumns : this.yzsColumns}
        dataSource={datas} />
    );
  }

  //婚纱礼服colums
  hslfMyColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '使用方式',
      dataIndex: 'dress_use_way_txt',
    },
    {
      title: '服饰类型',
      dataIndex: 'dress_type_txt',
    },
    {
      title: '礼服款式',
      dataIndex: 'dress_model_txt',
    },
    {
      title: '婚服预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚纱礼服有效单', 7, record, true)
          }
        </div>
      ),
    }
  ];

  //婚纱礼服colums
  hslfColumns: ColumnProps<RequirementData>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '有效单级别',
      dataIndex: 'level_txt',
    },
    {
      title: '业务品类',
      dataIndex: 'final_category_txt',
    },
    {
      title: '意向区域',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '使用方式',
      dataIndex: 'dress_use_way_txt',
    },
    {
      title: '服饰类型',
      dataIndex: 'dress_type_txt',
    },
    {
      title: '礼服款式',
      dataIndex: 'dress_model_txt',
    },
    {
      title: '婚服预算',
      dataIndex: 'budget',
    },
    {
      title: '销售阶段',
      dataIndex: 'phase_txt',
    },
    {
      title: '意向产品',
      dataIndex: 'product_txt',
    },
    {
      title: '意向活动',
      dataIndex: 'activity_txt',
    },
    {
      title: '归属人',
      dataIndex: 'owner_name',
    },
    {
      title: '协作人',
      dataIndex: 'co_owner_name',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <div hidden={this.props.isclaimFlag}>
          {
            this.renderOption('编辑婚纱礼服有效单', 7, record, false)
          }
        </div>
      ),
    }
  ];

  //婚纱礼服
  renderHSLFTable = (name: string, datas: RequirementData[], isMy: boolean) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => name}
        columns={isMy ? this.hslfMyColumns : this.hslfColumns}
        dataSource={datas} />
    );
  }

  renderOption = (name: string, type: number, record: RequirementData, isMy: boolean) => {
    let options: any[] = [];
    this.renderEdit(name, type, record, isMy, options)
    this.renderOpen(record, isMy, options)
    this.renderClose(record, isMy, options)
    this.renderRecommend(record, isMy, options)
    this.renderButtons(record, options)
    this.renderCloseAlert(record, isMy, options)
    return (
      <Fragment>
        {
          options.map((value, index) => {
            if (index == 0) {
              return value
            } else {
              return (
                <Fragment>
                  <Divider type="vertical" />
                  {
                    value
                  }
                </Fragment>
              )
            }
          })
        }
      </Fragment>
    )
  }

  renderEdit = (name: string, type: number, record: RequirementData, isMy: boolean, options: any[]) => {
    const { leadManagementDetail, isDistribute } = this.props
    const { permission: { editotherreq } } = leadManagementDetail;
    if ((record.phase == '1' || record.phase == '2' || record.phase == '6') && !isDistribute && (isMy || editotherreq) && (record.req_num != undefined && record.req_num != null && record.req_num != '')) {
      options.push(<a onClick={() => this.handleEidtReq(name, type, record)}>编辑</a>);
    }
  }

  renderOpen = (record: RequirementData, isMy: boolean, options: any[]) => {
    const { leadManagementDetail, isDistribute } = this.props;
    const { permission: { openotherreq, requirementadapter_openreq } } = leadManagementDetail;
    if (((record.phase == '0' || record.phase == '5') && !isDistribute && ((isMy && requirementadapter_openreq) || (!isMy && openotherreq)))) {
      options.push(<a onClick={() => this.handleOpenReq(record)}>开启</a>);
    }
  }

  renderClose = (record: RequirementData, isMy: boolean, options: any[]) => {
    const { leadManagementDetail, isDistribute } = this.props;
    const { permission: { closeotherreq, requirementadapter_closereq } } = leadManagementDetail;
    if (((record.phase == '1' || record.phase == '2' || record.phase == '6') && !isDistribute && ((isMy && requirementadapter_closereq) || (!isMy && closeotherreq)))) {
      options.push(<a onClick={() => this.handleCloseReq(record)}>{CrmUtil.getCompanyType() == 1 ? '跟进失败' : '关单'}</a>);
    }
  }

  renderRecommend = (record: RequirementData, isMy: boolean, options: any[]) => {
    const { leadManagementDetail, isDistribute } = this.props
    const { permission: { recommendotherreq, recommendreq } } = leadManagementDetail
    if ((record.phase == '1' || record.phase == '2' || record.phase == '6') && !isDistribute && ((isMy && recommendreq) || (!isMy && recommendotherreq))) {
      options.push(<a onClick={() => this.handleRecommend(record)}>推荐</a>);
    }
  }

  renderButtons = (record: RequirementData, options: any[]) => {
    if (record.buttons && record.buttons.length > 0) {
      record.buttons.map((value, index) => {
        value.echo != undefined && value.echo ?
          options.push(<a style={{ color: 'grey' }} onClick={() => this.handleButton(record, value)}>{value.name}</a>)
          :
          options.push(<a onClick={() => this.handleButton(record, value)}>{value.name}</a>)
      })
    }
  }

  renderCloseAlert = (record: RequirementData, isMy: boolean, options: any[]) => {
    const { leadManagementDetail, isDistribute } = this.props
    const { permission: { viewotherreq } } = leadManagementDetail;
    if (record.phase == '0' && (isMy || viewotherreq) && !isDistribute) {
      options.push(<a style={{ color: 'grey' }} onClick={() => this.handleCloseReqAlert("关闭原因", record)}>关闭原因</a>);
    } else if (record.phase == '5' && (isMy || viewotherreq) && !isDistribute) {
      options.push(<a style={{ color: 'grey' }} onClick={() => this.handleCloseReqAlert("有效单合并", record)}>有效单合并</a>);
    }
  }
}
export default Form.create<IntentionalDemandProps>()(IntentionalDemand);
