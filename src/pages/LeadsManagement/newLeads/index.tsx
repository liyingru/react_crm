import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  Checkbox,
  Row,
  Col,
  message,
  Modal,
  Cascader,
  Spin,
} from 'antd';
import React, { Component, ChangeEvent } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import AreaSelect from '@/components/AreaSelect';
import moment from 'moment';
import { StateType } from './model';
import TransferToUserForm, { FormValueType } from '@/components/TransferToUserForm';
import { ExclamationCircleOutline, ExclamationCircleOutlined, DownCircleTwoTone, DownOutlined, UpOutlined } from '@ant-design/icons';
import { ConfigListItem, customerParams, bookTagContent, bookTagResult, cityInfo, reqState, competitionCategoryReqState, CustomerInfoState, CarJsonInfoState } from './data';
import Axios from 'axios';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import URL from '@/api/serverAPI.config';

import { type } from 'os';
import { required } from 'yargs';
import check from '@/components/Authorized/CheckPermissions';
import NumericInput from '@/components/NumericInput';
import SellerCategory from './components/AlreadyCategory/SellerCategory';
import SelectCategory from './components/SelectCategory/SelectCategory';
import CustomerRepeatConfirmModal from '@/components/CustomerRepeatConfirmModal';
import LOCAL from '@/utils/LocalStorageKeys';
import getUserInfo from '@/utils/UserInfoStorage';
import CrmUtil from '@/utils/UserInfoStorage';
import { CustomerData } from '@/pages/CustomerManagement/customerDetail/xp/data';
import { range } from 'lodash';
import { ConfigCommon } from '@/commondata';
import { CarBrandInfo } from '@/components/WeddingCarSelector';

const { confirm } = Modal;
function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')))
}


function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

interface FormBasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<
    Action<
      | 'leadsManagement/addLeads'
      | 'leadsManagement/transferLeads'
      | 'leadsManagement/leadsManagementPage'
      | 'leadsManagement/dxlLeadsManagementPage'
      | 'leadsManagement/customerManagementPage'
      | 'leadsManagement/getDistributePeopleConifgInfo'
    >
  >;
  leadsManagement: StateType;
}

//构建state类型
interface pageState {
  likeCityCode?: string;
  liveCityCode?: string;
  workCityCode?: string
  disabled?: boolean
  modalVisible?: boolean;
  leadsId?: string
  options?: []
  businessCategory: string
  customerInfoState: CustomerInfoState
  customerParams?: customerParams
  categoryParams?: {}
  phoneStatus?: boolean
  wechatStatus?: boolean
  banquetCityCode?: string
  weddingCityCode?: string
  photographyCityCode?: string
  carCityCode?: string
  celebrationCityCode?: string
  oneStopCityCode?: string
  dressCityCode?: string
  categoryReq: reqState
  competitionCategoryReq: bookTagContent
  buttonDisabled: boolean
  configData: ConfigCommon | undefined
  confirmVisible: boolean;
  selectingCustomer: any;
  targetSimilarCustomer: any;
  type: string
  spinning: boolean
  receive_user: [],
  carBrandList: CarJsonInfoState[],
  is_skip: string
  is_invite: string
  fromTag: string;
  customerData: CustomerData | undefined;
  into_user_list: [],
  isOpenAllform: boolean
}

@connect(
  ({
    leadsManagement,
    loading,
  }: {
    leadsManagement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    leadsManagement,
    loading: loading.models.leadsManagement,
  }),
)

class NewLeadsForm extends Component<FormBasicFormProps, pageState, ConfigState> {

  constructor(props: Readonly<FormBasicFormProps>) {
    super(props);
  }

  state: pageState = {
    likeCityCode: '',
    liveCityCode: '',
    workCityCode: '',
    disabled: false,
    modalVisible: false,
    leadsId: '',
    options: [],
    businessCategory: '',
    //返回的客户信息
    customerInfoState: {
    },
    customerParams: {
      phone: ''
    },
    categoryParams: {},
    phoneStatus: true,
    wechatStatus: true,
    categoryReq: {
      banquet: {},
      wedding: {},
      photography: {},
      car: {},
      celebration: {},
      oneStop: {},
      dress: {},
    },
    competitionCategoryReq: {
      banquet: {},
      wedding: {},
      photography: {},
      car: {},
      celebration: {},
      oneStop: {},
      dress: {},
    },
    buttonDisabled: false,
    configData: undefined,
    confirmVisible: false,
    selectingCustomer: {},
    targetSimilarCustomer: {},
    type: '',
    spinning: false,
    receive_user: [],
    carBrandList: [],
    is_skip: '',
    is_invite: '',
    fromTag: '',
    customerData: undefined,
    into_user_list: [],
    isOpenAllform: false
  }

  componentDidMount() {
    const { query, state } = this.props.location;
    this.setState({
      fromTag: query.fromTag
    })
    this.state.customerData = state ? state.customerData : undefined;
    //配置信息
    Axios.post(URL.customerConfig)
      .then(
        res => {
          if (res.code == 200) {
            this.setState({
              configData: res.data.result
            })
          }
        }
      );

    //拉取搜索用户
    this.props.dispatch({
      type: 'leadsManagement/getDistributePeopleConifgInfo',
    });
  }

  //渠道来源选择监听
  onChannelChange = (value) => {
    const { form } = this.props;
    form.setFieldsValue({
      'recordUserId': undefined
    })
    const valuesResult =
    {
      'type': '1',
      'channelId': value[value.length - 1]
    }
    //配置信息
    Axios.post(URL.getXPFlowInfo, valuesResult)
      .then(
        res => {
          if (res.code == 200) {
            this.setState({
              receive_user: res.data.result.receive_user,
              is_skip: res.data.result.is_skip,
              is_invite: res.data.result.is_invite,
              into_user_list: res.data.result.into_user_list,
            })
          }
        }
      );
  }


  //取消转让按钮调用方法
  handleCancelTransfer = () => {
    //取消转让后依然跳转到线索管理主页
    this.handleBack();
  }

  // 返回上一页，哪里来的回哪儿去
  handleBack = () => {
    const { dispatch } = this.props;
    if (this.state.fromTag == 'demand') {
      localStorage?.setItem('demandListRefreshTag', 'reset');
      history.back();
    } else if (this.state.fromTag == 'leads') {
      localStorage?.setItem('leadsListRefreshTag', 'reset');
      history.back();
    } else if (this.state.fromTag == 'dxlLeads') {
      localStorage?.setItem('leadsListRefreshTag', 'reset');
      history.back();
    } else if (this.state.fromTag == 'order') {
      history.back();
    } else if (this.state.fromTag == 'customer') {
      localStorage?.setItem('demandListRefreshTag', 'reset');
      history.back();
    } else {
      localStorage?.setItem('demandListRefreshTag', 'reset');
      history.back();
    }
  }


  //婚宴意向区域
  banquetCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.banquetCityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'banquet_cityCode': code
      })
    }
  };

  //婚庆意向区域
  weddingCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.weddingCityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'wedding_cityCode': code
      })
    }
  };

  //婚照意向区域
  photographyCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.photographyCityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'photography_cityCode': code
      })
    }
  };

  //婚车意向区域
  carCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.carCityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'car_cityCode': code
      })
    }
  };

  //庆典or喜宴意向区域
  celebrationCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.celebrationCityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'celebration_cityCode': code
      })
    }
  };

  //一站式意向区域
  oneStopCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.oneStopCityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'oneStop_cityCode': code
      })
    }
  };

  //婚纱礼服意向区域
  dressCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.dressCityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'dress_cityCode': code
      })
    }
  };

  setCarBrandList = (list: CarBrandInfo[]) => {
    this.setState({
      carBrandList: list
    })
  }


  handleSubmit = (e: any) => {
    const { dispatch, form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          buttonDisabled: true,
          spinning: true
        })

        var phone = values["phone"]
        if (phone && phone.indexOf('*') != -1) {
          values["phone"] = this.state.customerInfoState.encrypt_phone ? this.state.customerInfoState.encrypt_phone : undefined
        }

        //业务品类
        if (this.state.businessCategory == '1') {
          //婚宴
          var banquet_site_type = values["banquet_site_type"]
          var banquet_commission = values["banquet_commission"]
          var banquet_schedule_type = values["banquet_schedule_type"]
          var banquet_hotel_feature = values["banquet_hotel_feature"]
          var banquet_hotelTablesFrom = values["banquet_hotelTablesFrom"]
          var banquet_hotelTablesEnd = values["banquet_hotelTablesEnd"]
          var banquet_perBudgetFrom = values["banquet_perBudgetFrom"]
          var banquet_perBudgetEnd = values["banquet_perBudgetEnd"]
          var banquet_budgetFrom = values["banquet_budgetFrom"]
          var banquet_budgetEnd = values["banquet_budgetEnd"]
          var hotel = values["hotel"]
          var banquet_remark = values["banquet_remark"]
          var banquet_needAutoDistribute = values["banquet_needAutoDistribute"]
          var banquet_reqOwnerId = values["banquet_reqOwnerId"]
          //婚宴
          if (this.state.banquetCityCode) {
            this.state.categoryReq.banquet.cityCode = this.state.banquetCityCode
            this.state.categoryReq.banquet.commission = banquet_commission
            this.state.categoryReq.banquet.budgetFrom = banquet_budgetFrom
            this.state.categoryReq.banquet.budgetEnd = banquet_budgetEnd
            this.state.categoryReq.banquet.perBudgetFrom = banquet_perBudgetFrom
            this.state.categoryReq.banquet.perBudgetEnd = banquet_perBudgetEnd
            this.state.categoryReq.banquet.hotelTablesFrom = banquet_hotelTablesFrom
            this.state.categoryReq.banquet.hotelTablesEnd = banquet_hotelTablesEnd
            this.state.categoryReq.banquet.scheduleType = banquet_schedule_type
            this.state.categoryReq.banquet.hotel = hotel
            if (banquet_hotel_feature && banquet_hotel_feature.length > 0) {
              this.state.categoryReq.banquet.hotelFeature = banquet_hotel_feature.join()
            }
            this.state.categoryReq.banquet.siteType = banquet_site_type
            this.state.categoryReq.banquet.finalCategory = '1'
            this.state.categoryReq.banquet.remark = banquet_remark
            if (banquet_needAutoDistribute) {
              this.state.categoryReq.banquet.needAutoDistribute = banquet_needAutoDistribute ? "1" : '0'
            }
            if (banquet_reqOwnerId) {
              this.state.categoryReq.banquet.reqOwnerId = banquet_reqOwnerId
            }
          }
          //婚宴
          delete values["banquet_cityCode"]
          delete values["banquet_commission"]
          delete values["banquet_site_type"]
          delete values["banquet_schedule_type"]
          delete values["banquet_hotel_feature"]
          delete values["banquet_hotelTablesFrom"]
          delete values["banquet_hotelTablesEnd"]
          delete values["banquet_perBudgetFrom"]
          delete values["banquet_perBudgetEnd"]
          delete values["banquet_budgetFrom"]
          delete values["banquet_budgetEnd"]
          delete values["banquet_remark"]
          delete values["banquet_needAutoDistribute"]
          delete values["banquet_reqOwnerId"]
        } else if (this.state.businessCategory == '2') {
          //婚庆
          var wedding_style = values["wedding_style"]
          var wedding_commission = values["wedding_commission"]
          var wedding_category_type = values["wedding_category_type"]
          var hotel = values["hotel"]
          var wedding_banquet_hall = values["wedding_banquet_hall"]
          var wedding_hotelTablesFrom = values["wedding_hotelTablesFrom"]
          var wedding_hotelTablesEnd = values["wedding_hotelTablesEnd"]
          var wedding_perBudgetFrom = values["wedding_perBudgetFrom"]
          var wedding_perBudgetEnd = values["wedding_perBudgetEnd"]
          var wedding_budgetFrom = values["wedding_budgetFrom"]
          var wedding_budgetEnd = values["wedding_budgetEnd"]
          var wedding_remark = values["wedding_remark"]
          var wedding_needAutoDistribute = values["wedding_needAutoDistribute"]
          var wedding_reqOwnerId = values["wedding_reqOwnerId"]
          //婚庆
          if (this.state.weddingCityCode) {
            this.state.categoryReq.wedding.cityCode = this.state.weddingCityCode
            this.state.categoryReq.wedding.commission = wedding_commission
            this.state.categoryReq.wedding.budgetFrom = wedding_budgetFrom
            this.state.categoryReq.wedding.budgetEnd = wedding_budgetEnd
            this.state.categoryReq.wedding.perBudgetFrom = wedding_perBudgetFrom
            this.state.categoryReq.wedding.perBudgetEnd = wedding_perBudgetEnd
            this.state.categoryReq.wedding.hotelTablesFrom = wedding_hotelTablesFrom
            this.state.categoryReq.wedding.hotelTablesEnd = wedding_hotelTablesEnd
            this.state.categoryReq.wedding.hotel = hotel
            this.state.categoryReq.wedding.hotelHall = wedding_banquet_hall
            this.state.categoryReq.wedding.weddingStyle = wedding_style
            if (wedding_category_type) {
              this.state.categoryReq.wedding.finalCategory = wedding_category_type
            } else {
              this.state.categoryReq.wedding.finalCategory = '2'
            }
            this.state.categoryReq.wedding.remark = wedding_remark
            if (wedding_needAutoDistribute) {
              this.state.categoryReq.wedding.needAutoDistribute = wedding_needAutoDistribute ? "1" : '0'
            }
            if (wedding_reqOwnerId) {
              this.state.categoryReq.wedding.reqOwnerId = wedding_reqOwnerId
            }
          }
          //婚庆
          delete values["wedding_cityCode"]
          delete values["wedding_commission"]
          delete values["wedding_style"]
          delete values["wedding_category_type"]
          delete values["hotel"]
          delete values["wedding_banquet_hall"]
          delete values["wedding_hotelTablesFrom"]
          delete values["wedding_hotelTablesEnd"]
          delete values["wedding_perBudgetFrom"]
          delete values["wedding_perBudgetEnd"]
          delete values["wedding_budgetFrom"]
          delete values["wedding_budgetEnd"]
          delete values["wedding_remark"]
          delete values["wedding_needAutoDistribute"]
          delete values["wedding_reqOwnerId"]
        } else if (this.state.businessCategory == '3') {
          //婚纱摄影

          var photography_commission = values["photography_commission"]
          var photography_style = values["photography_style"]
          var photography_category_type = values["photography_category_type"]
          var photography_budgetFrom = values["photography_budgetFrom"]
          var photography_budgetEnd = values["photography_budgetEnd"]
          var photography_remark = values["photography_remark"]
          var photography_needAutoDistribute = values["photography_needAutoDistribute"]
          var photography_reqOwnerId = values["photography_reqOwnerId"]
          //婚纱摄影
          if (this.state.photographyCityCode) {
            this.state.categoryReq.photography.cityCode = this.state.photographyCityCode
            this.state.categoryReq.photography.commission = photography_commission
            this.state.categoryReq.photography.photoStyle = photography_style
            this.state.categoryReq.photography.budgetFrom = photography_budgetFrom
            this.state.categoryReq.photography.budgetEnd = photography_budgetEnd
            if (photography_category_type) {
              this.state.categoryReq.photography.finalCategory = photography_category_type
            } else {
              this.state.categoryReq.photography.finalCategory = '3'
            }
            this.state.categoryReq.photography.remark = photography_remark
            if (photography_needAutoDistribute) {
              this.state.categoryReq.photography.needAutoDistribute = photography_needAutoDistribute ? "1" : '0'
            }
            if (photography_reqOwnerId) {
              this.state.categoryReq.photography.reqOwnerId = photography_reqOwnerId
            }
          }
          //婚纱摄影
          delete values["photography_cityCode"]
          delete values["photography_commission"]
          delete values["photography_style"]
          delete values["photography_category_type"]
          delete values["photography_budgetFrom"]
          delete values["photography_budgetEnd"]
          delete values["photography_remark"]
          delete values["photography_needAutoDistribute"]
          delete values["photography_reqOwnerId"]
        } else if (this.state.businessCategory == '4') {
          //庆典or喜宴
          var celebration_category_type = values["celebration_category_type"]
          var celebration_commission = values["celebration_commission"]
          var celebration_hotel = values["celebration_hotel"]
          var hotel = values['hotel']
          var celebration_banquet_hall = values["celebration_banquet_hall"]
          var celebration_hotelTablesFrom = values["celebration_hotelTablesFrom"]
          var celebration_hotelTablesEnd = values["celebration_hotelTablesEnd"]
          var celebration_perBudgetFrom = values["celebration_perBudgetFrom"]
          var celebration_perBudgetEnd = values["celebration_perBudgetEnd"]
          var celebration_budgetFrom = values["celebration_budgetFrom"]
          var celebration_budgetEnd = values["celebration_budgetEnd"]
          var celebration_remark = values["celebration_remark"]
          var celebration_needAutoDistribute = values["celebration_needAutoDistribute"]
          var celebration_reqOwnerId = values["celebration_reqOwnerId"]
          //庆典or喜宴
          if (this.state.celebrationCityCode) {
            this.state.categoryReq.celebration.cityCode = this.state.celebrationCityCode
            this.state.categoryReq.celebration.commission = celebration_commission
            this.state.categoryReq.celebration.budgetFrom = celebration_budgetFrom
            this.state.categoryReq.celebration.budgetEnd = celebration_budgetEnd
            this.state.categoryReq.celebration.perBudgetFrom = celebration_perBudgetFrom
            this.state.categoryReq.celebration.perBudgetEnd = celebration_perBudgetEnd
            this.state.categoryReq.celebration.hotelTablesFrom = celebration_hotelTablesFrom
            this.state.categoryReq.celebration.hotelTablesEnd = celebration_hotelTablesEnd
            this.state.categoryReq.celebration.celebration_hotel = celebration_hotel
            this.state.categoryReq.celebration.hotel = hotel
            this.state.categoryReq.celebration.hotelHall = celebration_banquet_hall
            if (celebration_category_type) {
              this.state.categoryReq.celebration.finalCategory = celebration_category_type
            } else {
              this.state.categoryReq.celebration.finalCategory = '4'
            }
            this.state.categoryReq.celebration.remark = celebration_remark
            if (celebration_needAutoDistribute) {
              this.state.categoryReq.celebration.needAutoDistribute = celebration_needAutoDistribute ? "1" : '0'
            }
            if (celebration_reqOwnerId) {
              this.state.categoryReq.celebration.reqOwnerId = celebration_reqOwnerId
            }
          }
          //庆典or喜宴
          delete values["celebration_cityCode"]
          delete values["celebration_commission"]
          delete values["celebration_category_type"]
          delete values["celebration_hotel"]
          delete values['hotel']
          delete values["celebration_banquet_hall"]
          delete values["celebration_hotelTablesFrom"]
          delete values["celebration_hotelTablesEnd"]
          delete values["celebration_perBudgetFrom"]
          delete values["celebration_perBudgetEnd"]
          delete values["celebration_budgetFrom"]
          delete values["celebration_budgetEnd"]
          delete values["celebration_remark"]
          delete values["celebration_needAutoDistribute"]
          delete values["celebration_reqOwnerId"]
        } else if (this.state.businessCategory == '5') {
          //婚车
          var car_commission = values["car_commission"]
          var car_time = values["car_time"]
          var car_budgetFrom = values["car_budgetFrom"]
          var car_budgetEnd = values["car_budgetEnd"]
          var car_remark = values["car_remark"]
          var car_needAutoDistribute = values["car_needAutoDistribute"]
          var car_reqOwnerId = values["car_reqOwnerId"]

          //婚车
          if (this.state.carCityCode) {
            this.state.categoryReq.car.cityCode = this.state.carCityCode
            this.state.categoryReq.car.commission = car_commission
            if (car_time) {
              this.state.categoryReq.car.carTime = car_time.format('YYYY-MM-DD')
            }
            this.state.categoryReq.car.budgetFrom = car_budgetFrom
            this.state.categoryReq.car.budgetEnd = car_budgetEnd
            this.state.categoryReq.car.carJson = this.state.carBrandList
            this.state.categoryReq.car.finalCategory = '5'
            this.state.categoryReq.car.remark = car_remark
            if (car_needAutoDistribute) {
              this.state.categoryReq.car.needAutoDistribute = car_needAutoDistribute ? "1" : '0'
            }
            if (car_reqOwnerId) {
              this.state.categoryReq.car.reqOwnerId = car_reqOwnerId
            }
          }
          //婚车
          delete values["car_cityCode"]
          delete values["car_commission"]
          delete values["car_time"]
          delete values["car_budgetFrom"]
          delete values["car_budgetEnd"]
          delete values["car_remark"]
          delete values["car_needAutoDistribute"]
          delete values["car_reqOwnerId"]
        } else if (this.state.businessCategory == '6') {
          //一站式
          var oneStop_commission = values["oneStop_commission"]
          var oneStop_wedding_style = values["oneStop_wedding_style"]
          var oneStop_hotel = values["oneStop_hotel"]
          var oneStop_banquet_hall = values["oneStop_banquet_hall"]
          var oneStop_hotelTablesFrom = values["oneStop__hotelTablesFrom"]
          var oneStop_hotelTablesEnd = values["oneStop_hotelTablesEnd"]
          var oneStop_perBudgetFrom = values["oneStop_perBudgetFrom"]
          var oneStop_perBudgetEnd = values["oneStop_perBudgetEnd"]
          var oneStop_budgetFrom = values["oneStop_budgetFrom"]
          var oneStop_budgetEnd = values["oneStop_budgetEnd"]
          var oneStop_remark = values["oneStop_remark"]
          var oneStop_needAutoDistribute = values["oneStop_needAutoDistribute"]
          var oneStop_reqOwnerId = values["oneStop_reqOwnerId"]
          //一站式
          if (this.state.oneStopCityCode) {
            this.state.categoryReq.oneStop.cityCode = this.state.oneStopCityCode
            this.state.categoryReq.oneStop.commission = oneStop_commission
            this.state.categoryReq.oneStop.budgetFrom = oneStop_budgetFrom
            this.state.categoryReq.oneStop.budgetEnd = oneStop_budgetEnd
            this.state.categoryReq.oneStop.perBudgetEnd = oneStop_perBudgetFrom
            this.state.categoryReq.oneStop.perBudgetEnd = oneStop_perBudgetEnd
            this.state.categoryReq.oneStop.hotelTablesFrom = oneStop_hotelTablesFrom
            this.state.categoryReq.oneStop.hotelTablesEnd = oneStop_hotelTablesEnd
            this.state.categoryReq.oneStop.hotel = oneStop_hotel
            this.state.categoryReq.oneStop.hotelHall = oneStop_banquet_hall
            this.state.categoryReq.oneStop.weddingStyle = oneStop_wedding_style
            this.state.categoryReq.oneStop.finalCategory = '6'
            this.state.categoryReq.oneStop.remark = oneStop_remark
            if (oneStop_needAutoDistribute) {
              this.state.categoryReq.oneStop.needAutoDistribute = oneStop_needAutoDistribute ? "1" : '0'
            }
            if (oneStop_reqOwnerId) {
              this.state.categoryReq.oneStop.reqOwnerId = oneStop_reqOwnerId
            }
          }
          //一站式
          delete values["oneStop_cityCode"]
          delete values["oneStop_commission"]
          delete values["oneStop_wedding_style"]
          delete values["oneStop_hotel"]
          delete values["oneStop_banquet_hall"]
          delete values["oneStop__hotelTablesFrom"]
          delete values["oneStop_hotelTablesEnd"]
          delete values["oneStop_perBudgetFrom"]
          delete values["oneStop_perBudgetEnd"]
          delete values["oneStop_budgetFrom"]
          delete values["oneStop_budgetEnd"]
          delete values["oneStop_remark"]
          delete values["oneStop_needAutoDistribute"]
          delete values["oneStop_reqOwnerId"]
        } else if (this.state.businessCategory == '7') {
          //婚纱礼服
          var dress_commission = values["dress_commission"]
          var dress_use_way = values["dress_use_way"]
          var dress_type = values["dress_type"]
          var dress_model = values["dress_model"]
          var dress_num = values["dress_num"]
          var dress_budgetFrom = values["dress_budgetFrom"]
          var dress_budgetEnd = values["dress_budgetEnd"]
          var dress_remark = values["dress_remark"]
          var dress_needAutoDistribute = values["dress_needAutoDistribute"]
          var dress_reqOwnerId = values["dress_reqOwnerId"]
          //婚纱礼服
          if (this.state.dressCityCode) {
            this.state.categoryReq.dress.cityCode = this.state.dressCityCode
            this.state.categoryReq.dress.commission = dress_commission
            this.state.categoryReq.dress.budgetFrom = dress_budgetFrom
            this.state.categoryReq.dress.budgetEnd = dress_budgetEnd
            this.state.categoryReq.dress.dressModel = dress_model
            if (dress_model && dress_model.length > 0) {
              this.state.categoryReq.dress.dressModel = dress_model.join()
            }
            if (dress_type && dress_type.length > 0) {
              this.state.categoryReq.dress.dressType = dress_type.join()
            }
            this.state.categoryReq.dress.dressUseWay = dress_use_way
            this.state.categoryReq.dress.dressNum = dress_num
            this.state.categoryReq.dress.finalCategory = '7'
            this.state.categoryReq.dress.remark = dress_remark
            if (dress_needAutoDistribute) {
              this.state.categoryReq.dress.needAutoDistribute = dress_needAutoDistribute ? "1" : '0'
            }
            if (dress_reqOwnerId) {
              this.state.categoryReq.dress.reqOwnerId = dress_reqOwnerId
            }
          }

          //婚纱礼服
          delete values["dress_cityCode"]
          delete values["dress_commission"]
          delete values["dress_use_way"]
          delete values["dress_type"]
          delete values["dress_model"]
          delete values["dress_num"]
          delete values["dress_budgetFrom"]
          delete values["dress_budgetEnd"]
          delete values["dress_remark"]
          delete values["dress_needAutoDistribute"]
          delete values["dress_reqOwnerId"]
        }


        const categoryState = JSON.parse(JSON.stringify(this.state.categoryReq));

        //已定竞品
        var competition_banquet_brand = values["competition_banquet_brand"]
        var competition_banquet_budget = values["competition_banquet_budget"]
        var competition_wedding_brand = values["competition_wedding_brand"]
        var competition_wedding_budget = values["competition_wedding_budget"]
        var competition_photography_brand = values["competition_photography_brand"]
        var competition_photography_budget = values["competition_photography_budget"]
        var competition_celebration_brand = values["competition_celebration_brand"]
        var competition_celebration_budget = values["competition_celebration_budget"]
        var competition_car_brand = values["competition_car_brand"]
        var competition_car_budget = values["competition_car_budget"]
        var competition_oneStop_brand = values["competition_oneStop_brand"]
        var competition_oneStop_budget = values["competition_oneStop_budget"]
        var competition_wedding_dress_brand = values["competition_wedding_dress_brand"]
        var competition_wedding_dress_budget = values["competition_wedding_dress_budget"]
        //婚宴
        this.state.competitionCategoryReq.banquet.brand = competition_banquet_brand;
        this.state.competitionCategoryReq.banquet.price = competition_banquet_budget;
        // 婚庆
        this.state.competitionCategoryReq.wedding.brand = competition_wedding_brand;
        this.state.competitionCategoryReq.wedding.price = competition_wedding_budget;
        //婚纱摄影
        this.state.competitionCategoryReq.photography.brand = competition_photography_brand;
        this.state.competitionCategoryReq.photography.price = competition_photography_budget;
        //婚车
        this.state.competitionCategoryReq.car.brand = competition_car_brand;
        this.state.competitionCategoryReq.car.price = competition_car_budget;
        // 庆典or喜宴
        this.state.competitionCategoryReq.celebration.brand = competition_celebration_brand;
        this.state.competitionCategoryReq.celebration.price = competition_celebration_budget;
        //一站式
        this.state.competitionCategoryReq.oneStop.brand = competition_oneStop_brand;
        this.state.competitionCategoryReq.oneStop.price = competition_oneStop_budget;
        //礼服
        this.state.competitionCategoryReq.dress.brand = competition_wedding_dress_brand;
        this.state.competitionCategoryReq.dress.price = competition_wedding_dress_budget;
        const competitionCategoryState = JSON.parse(JSON.stringify(this.state.competitionCategoryReq));
        delete values['competition_banquet_brand']
        delete values['competition_banquet_budget']
        delete values['competition_wedding_brand']
        delete values['competition_wedding_budget']
        delete values['competition_photography_brand']
        delete values['competition_photography_budget']
        delete values['competition_celebration_brand']
        delete values['competition_celebration_budget']
        delete values['competition_car_brand']
        delete values['competition_car_budget']
        delete values['competition_oneStop_brand']
        delete values['competition_oneStop_budget']
        delete values['competition_wedding_dress_brand']
        delete values['competition_wedding_dress_budget']

        if (values["category"] && values["category"].length > 0) {
          values['category'] = values["category"].join()
        }

        var bookTagResult = {}
        if (values["bookTag"] && values["bookTag"].length > 0) {
          bookTagResult =
          {
            'category': values["bookTag"].join(),
            'bizContent': competitionCategoryState
          }
        }

        var weddingDateFrom
        var weddingDateEnd
        let date_range_time = values["weddingDate"]
        if (date_range_time) {
          delete values["weddingDate"]
          weddingDateFrom = moment(date_range_time[0]).format('YYYY-MM-DD')
          weddingDateEnd = moment(date_range_time[1]).format('YYYY-MM-DD')
        }

        if (values['contactTime']) {
          values['contactTime'] = moment(values['contactTime']).format('YYYY-MM-DD HH:mm')
        }

        if (values['channel'] && values['channel'].length > 0) {
          values['channel'] = values['channel'][values['channel'].length - 1]
        }

        const valuesResult = {
          ...values,
          'bookTag': bookTagResult,
          'weddingDateFrom': weddingDateFrom,
          'weddingDateEnd': weddingDateEnd,
          'likeCityCode': this.state.likeCityCode,
          'liveCityCode': this.state.liveCityCode,
          'workCityCode': this.state.workCityCode,
          'categoryReq': categoryState,
          'continue': this.state.is_skip

        }
        dispatch({
          type: 'leadsManagement/addLeads',
          payload: valuesResult,
          callback: this.onAddLeadsCallback,
        });
      } else {
        this.setState({
          buttonDisabled: false,
          spinning: false
        })
      }
    });
  };

  //添加线索回调
  onAddLeadsCallback = (status: boolean, msg: string, leads_id: string) => {
    this.setState({
      buttonDisabled: false,
      spinning: false
    })
    if (status) {
      message.success(msg);
      //添加线索成功后，并返回上一页
      this.handleBack();
    }
  };



  cityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.setState({
      likeCityCode: code,
    });
  };

  //居住地址回调
  liveAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.setState({
      liveCityCode: code,
    })
  };

  //工作地址回调
  workAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.setState({
      workCityCode: code,
    })
  };

  //业务品类选择监听
  onBusinessCategoryChange = (e: any) => {

    this.setState({
      businessCategory: e.target.value
    });
  }

  //已定竞品品类选择监听
  onCategoryChange = (checkedValues: any) => {
    this.setState({
      options: checkedValues
    })
  }


  onWechatOnChange = (e) => {
    const { form } = this.props;
    if (e.target.value.length > 0) {
      this.setState({
        phoneStatus: false
      })
      var phoneValue = form.getFieldValue('phone')
      if (phoneValue) {
        form.setFieldsValue({
          'phone': phoneValue
        })
      }
    } else {
      this.setState({
        phoneStatus: true
      })
    }
  }

  //手机号输入监听
  onPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { form } = this.props;

    const that = this
    if (e.target.value.length > 0) {
      that.setState({
        wechatStatus: false
      })
    } else {
      that.setState({
        wechatStatus: true
      })
    }

    if (CrmUtil.getCompanyType() !== 2) {//非喜铺公司才调用
      if (e.target.value.length == 11) {
        const valuesResult =
        {
          'type': "1",
          'phone': e.target.value
        }

        //获取客户信息
        Axios.post(URL.getCustomerInfo, valuesResult)
          .then(
            res => {
              if (res.code == 200) {
                if (res.data.result.customer_id) {
                  if (res.data.result.repeat_status == 1) {
                    that.showCustomerConfirm(res.data.result)
                  } else {
                    that.showParentCustomerConfirm("1", res.data.result)
                  }
                }
              }
            }
          );
        var wechatValue = form.getFieldValue('wechat')
        if (wechatValue) {
          form.setFieldsValue({
            'wechat': wechatValue
          })
        }
      }
    }

  }

  phonePattern = () => {
    if (this.state.customerInfoState.phone) {
      if (this.state.customerInfoState.phone.indexOf("*") != -1) {
        return undefined
      } else {
        return new RegExp(/^\d{11}$/, "g")
      }
    } else {
      return new RegExp(/^\d{11}$/, "g")
    }
  }

  onWechatOnBlur = (e) => {
    const that = this
    if (CrmUtil.getCompanyType() !== 2) {//非喜铺公司才调用
      if (e.target.value.length > 0) {
        const valuesResult =
        {
          'type': "2",
          'weChat': e.target.value
        }

        //通过微信号查看客户信息
        Axios.post(URL.getCustomerInfo, valuesResult)
          .then(
            res => {
              if (res.code == 200) {
                if (res.data.result.customer_id) {
                  if (res.data.result.repeat_status == 1) {
                    that.showCustomerConfirm(res.data.result)
                  } else {
                    that.showParentCustomerConfirm("2", res.data.result)
                  }
                }
              }
            }
          );
      }
    }

  }


  //是否同步客户信息弹框
  showCustomerConfirm = (customerInfoState: any) => {
    const that = this
    confirm({
      title: '该客户基础信息已存在，是否同步数据？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        that.setState({
          customerInfoState: customerInfoState,
          // options: bookTagIntArr
        })
      },
      onCancel() {
      },
    });
  }

  // //重复客户信息弹框
  // showCustomerConfirm = (customerInfoState: any) => {
  //   const { form } = this.props;
  //   const that = this
  //   confirm({
  //     title: '系统提示',
  //     okText: '重新录入',
  //     cancelText: '暂不录入',
  //     content: '该客户已存在，不允许录入重复客资',
  //     icon: <ExclamationCircleOutlined />,
  //     centered: true,
  //     onOk() {
  //       form.resetFields()
  //       that.setState({
  //         customerInfoState: {},
  //       })
  //     },
  //     onCancel() {
  //       that.handleBack()
  //     },
  //   });
  // }


  //是否同步客户信息弹框
  showParentCustomerConfirm = (type: any, customerInfoState: any) => {
    this.setState({
      selectingCustomer: customerInfoState,
      type: type
    })
    const valuesResult =
    {
      'type': '4',
      'customerId': customerInfoState.similar_id
    }
    //获取客户信息
    Axios.post(URL.getCustomerInfo, valuesResult)
      .then(
        res => {
          if (res.code == 200) {
            if (res.data.result.customer_id) {
              // this.showParentCustomerDialog(type,customerInfoState, res.data.result)
              this.setState({
                confirmVisible: true,
                targetSimilarCustomer: res.data.result
              })
            }
          }
        }
      );
  }


  showParentCustomerDialogOnOk = () => {
    const { form } = this.props;
    this.setState({
      customerInfoState: this.state.targetSimilarCustomer,
      confirmVisible: false
    })
    if (this.state.type == '2') {
      form.setFieldsValue({
        'wechat': this.state.targetSimilarCustomer.wechat
      })
    } else if (this.state.type == '1') {
      form.setFieldsValue({
        'phone': this.state.targetSimilarCustomer.phone
      })
    }
  }

  showParentCustomerDialogOnCancel = () => {
    this.setState({
      confirmVisible: false
    })
    const { form } = this.props;
    if (this.state.type == '2') {
      form.setFieldsValue({
        'wechat': ''
      })
    } else if (this.state.type == '1') {
      form.setFieldsValue({
        'phone': ''
      })
    }
    var phoneValue = form.getFieldValue('phone')
    var wechatValue = form.getFieldValue('wechat')
    if (!phoneValue && !wechatValue) {
      this.setState({
        wechatStatus: true,
        phoneStatus: true,
      })
    }
  }



  addParams = (params: any) => {
    this.setState({
      categoryParams: params
    })
  }

  //展开全部
  openAllform = () => {
    this.setState({
      isOpenAllform: this.state.isOpenAllform ? false : true
    })
  }


  render() {
    const { submitting } = this.props;
    const { form: { getFieldDecorator, getFieldValue }, leadsManagement: { distributePeopleConifg } } = this.props;
    const { form } = this.props;
    const { modalVisible, customerInfoState, options, configData, customerData } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },

    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };

    const parentMethods = {
      setCarBrandList: this.setCarBrandList,
      banquetCityAreaSelectChange: this.banquetCityAreaSelectChange,
      weddingCityAreaSelectChange: this.weddingCityAreaSelectChange,
      photographyCityAreaSelectChange: this.photographyCityAreaSelectChange,
      celebrationCityAreaSelectChange: this.celebrationCityAreaSelectChange,
      carCityAreaSelectChange: this.carCityAreaSelectChange,
      oneStopCityAreaSelectChange: this.oneStopCityAreaSelectChange,
      dressCityAreaSelectChange: this.dressCityAreaSelectChange,
      form: form
    };

    var bookTagIntArr: number[] = [];//保存转换后的整型字符
    if (customerInfoState.book_tag != undefined && customerInfoState.book_tag.category != undefined && customerInfoState.book_tag.category.length > 0) {
      const bookTagArray = customerInfoState.book_tag.category.split(",")
      bookTagIntArr = bookTagArray.map(function (data) {
        return +data;
      });
    }

    var bizContentDefault
    if (this.state.customerInfoState.book_tag && this.state.customerInfoState.book_tag.bizContent) {
      bizContentDefault = this.state.customerInfoState.book_tag.bizContent
    } else {
      bizContentDefault = {
        banquet: { "brand": "", "price": "" },
        wedding: { "brand": "", "price": "" },
        photography: { "brand": "", "price": "" },
        car: { "brand": "", "price": "" },
        celebration: { "brand": "", "price": "" },
        oneStop: { "brand": "", "price": "" },
        dress: { "brand": "", "price": "" }
      }
    }


    return (
      <PageHeaderWrapper title="新建客资">
        <Spin spinning={this.state.spinning} size='large'>
          <Card bordered={false}>
            <div className={styles.tableListForm}>
              <Form
                style={{
                  marginTop: 8,
                }}
              >
                <Card bordered={false} title="基础信息">
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={8}>
                      <FormItem label="客资来源" >
                        {getFieldDecorator('channel', {
                          rules: [{ required: true, message: '请选择客资来源', }],
                          initialValue: customerData ? customerData.channel_id : undefined,
                        })(
                          <Cascader
                            onChange={this.onChannelChange}
                            placeholder="请选择客资来源"
                            showSearch
                            style={{ width: '100%', }}
                            options={CrmUtil.getCompanyType() == 1 ? configData?.channel : configData?.bjcreatechannel} />
                        )}
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem label="客户姓名" >
                        {getFieldDecorator('name', {
                          rules: [{
                            required: true, pattern: new RegExp(/[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d]/, "g"), max: 8, message: '请输入有效客户姓名',
                          }],
                          getValueFromEvent: (event) => {
                            return event.target.value.replace(/[0-9]/, '')
                          },
                          initialValue: customerData ? customerData.customerName : customerInfoState.customer_name
                        })(
                          <Input maxLength={8} autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入客户姓名" />)}
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem label="手机号" >
                        {getFieldDecorator('phone', {
                          rules: [{ required: this.state.phoneStatus, pattern: this.phonePattern, min: 11, message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                            return event.target.value.replace(/\D/g, '')
                          },
                          initialValue: customerData ? customerData.phone : customerInfoState.phone
                        })(
                          <Input autoComplete="off" allowClear maxLength={11} style={{ width: '100%', }} placeholder="手机号/微信号二选一录入即可" onChange={this.onPhoneChange} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={8}>
                      <FormItem label="婚期">
                        {getFieldDecorator('weddingDate', {
                          rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, message: "请设置婚期" }],
                          initialValue: customerData && customerData.weddingDateFrom && customerData.weddingDateEnd ? [moment(customerData.weddingDateFrom, 'YYYY-MM-DD'), moment(customerData.weddingDateEnd, 'YYYY-MM-DD')]
                            : customerInfoState.wedding_date_from && customerInfoState.wedding_date_end ? [moment(customerInfoState.wedding_date_from, 'YYYY-MM-DD'), moment(customerInfoState.wedding_date_end, 'YYYY-MM-DD')]
                              : undefined
                        })(
                          <RangePicker style={{ width: '100%', }} format="YYYY-MM-DD"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="提供人">
                        {getFieldDecorator('recordUserId', {
                          rules: [{ required: true, message: "请选择提供人" }],
                          initialValue: customerData && customerData.record_user_id !== 0 ? customerData.record_user_id : undefined
                        })(
                          <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: '100%', marginLeft: '5px' }}
                            placeholder="请选择提供人">
                            {
                              (this.state.into_user_list && this.state.into_user_list.length > 0) ?
                                this.state.into_user_list.map(config => (
                                  <Option value={config.id}>{config.name}</Option>))
                                :
                                null
                            }
                          </Select>
                        )}
                      </FormItem>

                    </Col>

                    <Col span={8}>
                      <FormItem label="微信号" >
                        {getFieldDecorator('wechat', {
                          rules: [{
                            required: CrmUtil.getCompanyType() == 2 ? this.state.wechatStatus : false,
                            pattern: new RegExp(/^\w{1,20}$/g, "g"), message: '请输入有效微信号'
                          }],
                          getValueFromEvent: (event) => {
                            return event.target.value.replace(/[\u4e00-\u9fa5]/g, '')
                          },
                          initialValue: customerData ? customerData.weChat : customerInfoState.wechat
                        })(
                          <Input autoComplete="off" style={{ width: '100%', }} placeholder="手机号/微信号二选一录入即可" onChange={this.onWechatOnChange} onBlur={this.onWechatOnBlur} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>


                  {
                    <div>
                      <div style={{ display: CrmUtil.getCompanyType() == 2 ? 'none' : !this.state.isOpenAllform ? 'block' : 'none' }}>

                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={8} offset={10}>
                            <FormItem>
                              <Button style={{ width: 60 }} icon='down' shape="round" size='default' onClick={this.openAllform} ></Button>
                            </FormItem>
                          </Col>
                        </Row>
                      </div>
                      <div style={{ display: CrmUtil.getCompanyType() == 2 ? 'block' : this.state.isOpenAllform ? 'block' : 'none' }}>
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={8}>
                            <FormItem label={CrmUtil.getCompanyType() == 2 ? "跟进结果" : "回访结果"}>
                              {getFieldDecorator('followStatus', {
                                rules: [
                                  {
                                    required: false,
                                    message: CrmUtil.getCompanyType() == 2 ? "请选择跟进结果" : "请选择回访结果",
                                  },
                                ],
                              })(
                                <Select
                                  placeholder={CrmUtil.getCompanyType() == 2 ? "请选择跟进结果" : "请选择回访结果"}
                                  style={{
                                    width: '100%',
                                  }}
                                >
                                  {configData?.customerFollowStatus.map(customerFollowStatus => (
                                    <Option value={customerFollowStatus.id}>
                                      {customerFollowStatus.name}
                                    </Option>
                                  ))}
                                </Select>,
                              )}
                            </FormItem>
                          </Col>
                          <Col span={8}>
                            <FormItem label="性别" >
                              {getFieldDecorator('gender', {
                                rules: [{ required: false }],
                                initialValue: customerData ? customerData.gender : customerInfoState.gender ? customerInfoState.gender : undefined
                              })(
                                <Select placeholder="请选择性别" style={{ width: '100%', }}>
                                  {
                                    configData?.gender.map(gender => (
                                      <Option value={gender.id}>{gender.name}</Option>))
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col span={8}>
                            <FormItem label="方便联系时间">
                              {getFieldDecorator('contactTime', { rules: [{ required: false }], })(

                                <DatePicker style={{ width: '100%' }} placeholder="请选择时间" showTime={{ format: 'HH:mm', placeholder: '请选择时间' }}
                                  format="YYYY-MM-DD HH:mm" disabledDate={disabledDate}
                                />
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={8}>
                            <FormItem label="客户身份" >
                              {getFieldDecorator('identity', {
                                rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, message: "请选择客户身份" }],
                                initialValue: customerData ? customerData.identity : customerInfoState.identity ? customerInfoState.identity : undefined
                              })(
                                <Select placeholder="请选择客户身份" style={{ width: '100%', }} >
                                  {
                                    configData?.identity.map(identity => (
                                      <Option value={identity.id}>{identity.name}</Option>))
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          {
                            (CrmUtil.getCompanyType() !== 2) &&
                            <Col span={8}>
                              <FormItem label="提供人手机">
                                {getFieldDecorator('referrerPhone', {
                                  rules: [{ required: false, pattern: new RegExp(/^\d{11}$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\D/g, '')
                                  },
                                  initialValue: ''
                                })(
                                  <Input autoComplete="off" allowClear maxLength={11} style={{ width: '100%', }} placeholder="请输入提供人手机号" />
                                )}
                              </FormItem>
                            </Col>

                          }
                          {
                            (CrmUtil.getCompanyType() !== 2) &&
                            <Col span={8}>
                              <FormItem label="返佣">
                                {getFieldDecorator('commission', {
                                  initialValue: ''
                                })(
                                  <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                                )}
                              </FormItem>
                            </Col>
                          }
                        </Row>
                        <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                          <Col span={11}>
                            <FormItem label="居住地址">
                              <AreaSelect level3={true} areaSelectChange={this.liveAreaSelectChange}
                                selectedCode={customerData ? customerData.liveCityInfo.city_code
                                  : customerInfoState.live_city_code ? customerInfoState.live_city_code : undefined} />
                            </FormItem>
                          </Col>
                          <Col span={8}>
                            <FormItem >
                              {getFieldDecorator('liveAddress', {
                                rules: [{ required: false }],
                                initialValue: customerData ? customerData.liveAddress : customerInfoState.live_address
                              })(
                                <Input allowClear style={{ width: '100%', }} />
                              )}
                            </FormItem>
                          </Col>
                        </Row>

                        <Row gutter={{ md: 6, lg: 24, xl: 5 }}>
                          <Col span={11}>
                            <FormItem label="工作地址" >
                              <AreaSelect level3={true} areaSelectChange={this.workAreaSelectChange}
                                selectedCode={customerData ? customerData.workCityInfo.city_code
                                  : customerInfoState.work_city_code ? customerInfoState.work_city_code : undefined} />
                            </FormItem>
                          </Col>
                          <Col span={8}>
                            <FormItem >
                              {getFieldDecorator('workAddress', {
                                rules: [{ required: false }],
                                initialValue: customerData ? customerData.workAddress : customerInfoState.work_address
                              })(
                                <Input allowClear style={{ width: '100%', }} />
                              )}
                            </FormItem>
                          </Col>
                        </Row>

                        <Row gutter={{ md: 6, lg: 24, xl: 5 }}>
                          <Col span={11}>
                            <FormItem label="客户区域" >
                              <AreaSelect
                                selectedCode={customerData ? customerData.likeCityInfo.city_code
                                  : customerInfoState.like_city_code ? customerInfoState.like_city_code : undefined}
                                areaSelectChange={this.cityAreaSelectChange}
                                level3={true} />
                            </FormItem>
                          </Col>
                          <Col span={5} />

                        </Row>
                        {
                          (CrmUtil.getCompanyType() == 2 && configData?.activity && configData.activity.length > 0) ?
                            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                              <Col span={8}>
                                <FormItem label="投放活动" >
                                  {getFieldDecorator('activityId', {
                                    rules: [{ required: false }],
                                    initialValue: undefined
                                  })(
                                    <Select placeholder="请选择投放活动" style={{ width: '100%', }}>
                                      {
                                        configData.activity.map(activity => (
                                          <Option value={activity.id}>{activity.name}</Option>))
                                      }
                                    </Select>
                                  )}
                                </FormItem>
                              </Col>
                            </Row>
                            : undefined
                        }
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={11}>
                            <FormItem label="备注">
                              {getFieldDecorator('remark')(
                                <TextArea style={{ width: '100%', }} rows={3} placeholder="请输入备注信息" />
                              )}
                            </FormItem>
                          </Col>

                        </Row>

                      </div>

                      <div style={{ display: CrmUtil.getCompanyType() == 2 ? 'none' : this.state.isOpenAllform ? 'block' : 'none' }}>

                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={8} offset={10}>
                            <FormItem>
                              <Button style={{ width: 60 }} icon='up' shape="round" size='default' onClick={this.openAllform} ></Button>
                            </FormItem>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  }
                </Card>
                <Card bordered={false} title="联系人信息">
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={8}>
                      <FormItem label={CrmUtil.getCompanyType() == 2 ? "其他联系人" : "主联系人"} >
                        {getFieldDecorator('mainContactName', { rules: [{ required: false }], })(
                          <Input autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入联系人姓名" />
                        )}
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem label="联系人手机" >
                        {getFieldDecorator('mainContactPhone', {
                          rules: [{ required: false, pattern: new RegExp(/^\d{11}$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                            return event.target.value.replace(/\D/g, '')
                          },
                          initialValue: ''
                        })(
                          <Input autoComplete="off" allowClear maxLength={11} style={{ width: '100%', }} placeholder="请输入联系人手机号" />
                        )}
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem label="联系人身份" >
                        {getFieldDecorator('mainContactIdentity', { rules: [{ required: false }], })(
                          <Select placeholder="请选择联系人身份" style={{ width: '100%', }} >
                            {
                              configData?.identity.map(identity => (
                                <Option value={identity.id}>{identity.name}</Option>))
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Card>

                <Card bordered={false} title="意向信息">

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <FormItem label="业务品类">
                        {getFieldDecorator('category', { rules: [{ required: true, message: "请选择业务品类" }], })(
                          <Radio.Group style={{ width: '100%', }} onChange={this.onBusinessCategoryChange} >
                            {
                              configData?.category.map(category => (
                                <Radio value={category.id} >{category.name}</Radio>))
                            }
                          </Radio.Group>
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  {
                    configData && <SelectCategory
                      visible={true}
                      {...parentMethods}
                      getFieldDecorator={getFieldDecorator}
                      configData={configData}
                      submitting={submitting}
                      checkCategory={this.state.businessCategory}
                      receiveUser={this.state.receive_user}
                      is_invite={this.state.is_invite}
                    />
                  }


                  <br />
                  <Spin spinning={this.state.spinning} size='large'>
                    <div>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={24}>
                          <FormItem label="外定竞品">
                            {getFieldDecorator('bookTag', { rules: [{ required: false }], initialValue: options })(
                              <Checkbox.Group style={{ width: '100%', }} onChange={this.onCategoryChange} >
                                {
                                  configData?.category.map(category => (
                                    <Checkbox value={category.id} >{category.name}</Checkbox>))
                                }
                              </Checkbox.Group>,
                            )}
                          </FormItem>
                        </Col>
                      </Row>

                      <SellerCategory
                        visible={true}
                        getFieldDecorator={getFieldDecorator}
                        submitting={submitting} checkCategorys={this.state.options}
                        bizContent={bizContentDefault} />
                    </div>
                  </Spin>
                </Card>
                {
                  (CrmUtil.getCompanyTag() == 'YNMT') ? (
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={8}>
                        <FormItem label="指定接收人" >
                          {getFieldDecorator('ownerId', { rules: [{ required: false }], })(
                            <Select placeholder="请选择指定接收人" style={{ width: '100%', }} showSearch optionFilterProp="children">
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
                      </Col>
                    </Row>
                  ) : null
                }
              </Form>
            </div>


            <FormItem wrapperCol={{ span: 100, offset: 6 }} style={{ marginTop: 32 }}>
              <Button disabled={this.state.buttonDisabled} style={{ width: 200 }} type="primary" htmlType="submit" onClick={this.handleSubmit} loading={submitting}>提交客资信息 </Button>
            </FormItem>
          </Card >
        </Spin>
        <CustomerRepeatConfirmModal
          title="提示"
          goText="请选择父客户。"
          visible={this.state.confirmVisible}
          currentCustomer={this.state.selectingCustomer}
          targetSimilarCustomer={this.state.targetSimilarCustomer}
          onOk={this.showParentCustomerDialogOnOk}
          onCancel={this.showParentCustomerDialogOnCancel}
        />
      </PageHeaderWrapper >
    );
  }
}

export default Form.create<FormBasicFormProps>()(NewLeadsForm);
