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
  Divider,
  Transfer,
  Spin,
  Upload,
} from 'antd';

import React, { Component, ChangeEvent, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import AreaSelect from '@/components/AreaSelect';
import moment from 'moment';
import { StateType } from './model';

import { ConfigListItem, customerParams, cityInfo, preferentialInfo, productInfo } from './data';
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
import { ContractConfigData } from '../../data';
import PaymentPicture from './components/PaymentPicture';
import { routerRedux } from 'dva/router';
import { CustomerInfoState } from '@/pages/CustomerManagement/newCustomer/data';
import customerList from '@/pages/CustomerManagement/customerList';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import LOCAL from '@/utils/LocalStorageKeys';
import ImageUpload from '@/components/ImageUpload';
import CrmUtil from '@/utils/UserInfoStorage';
import WeddingCarSelector, { CarBrandInfo } from '@/components/WeddingCarSelector';
import { ConfigCommon } from '@/commondata';
import { CarBrandInfo } from '@/components/WeddingCarSelector';
import { unwatchFile } from 'fs';
import ProductEditor from '@/components/ProductEditor';
import { ProductInfo } from '../orderDetails/data';
const { confirm } = Modal;


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

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface CreateFormProps extends FormComponentProps {
  orderId: string
  categoryId: string
  visible: boolean;
  dispatch: Dispatch<
    Action<
      | 'contractManagement/addContract'
      | 'contractManagement/getContractConfig'
      | 'contractManagement/addContract'
      | 'contractManagement/getContractConfig'
      | 'contractManagement/searchUser'
      | 'contractManagement/searchProduct'
    >
  >;
  loading: boolean;
  contractManagement: StateType;
}

//构建state类型
interface pageState {
  isReset: boolean
  cityCode: string
  categoryName: string
  categoryId: string
  customerId: string
  orderId: string
  preferentialInfoList: preferentialInfo[]//用于显示控件的优惠
  preferentialList: preferentialInfo[]//最终提交的优惠
  preferentialInfoVisible: boolean
  customerInfoState: CustomerInfoState

  productInfoList: productInfo[]
  productInfoVisible: boolean
  dropDownTips: string
  configData: ConfigCommon | undefined;
  productIds: []
  selectedProducts: ProductInfo[]; // 临时选中的产品
  buttonDisabled: boolean

  fileList: [],
  imgList: [],

  spinning: boolean,
  selectedCarBrands: CarBrandInfo[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    contractManagement,
    loading,
  }: {
    contractManagement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    contractManagement,
    loading: loading.models.contractManagement,
  }),
)

@connect(() => ({}))
class NewContractCreateForm extends Component<CreateFormProps>  {

  static defaultProps = {

  };

  state: pageState = {
    isReset: false,
    cityCode: '',
    categoryName: '',
    categoryId: '',
    customerId: '',
    orderId: '',
    preferentialInfoList: [],
    preferentialList: [],
    preferentialInfoVisible: false,
    customerInfoState: {},
    productInfoList: [],
    productIds: [],
    selectedProducts: [],
    productInfoVisible: false,
    dropDownTips: "请输入关键字搜索产品",
    buttonDisabled: false,
    fileList: [],
    imgList: [],
    spinning: true,
    configData: undefined,
    selectedCarBrands: []
  }

  componentDidMount() {
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

    const { dispatch } = this.props;
    const { orderId, categoryId, categoryName, customerId } = this.props.location.query;
    console.log("接收到参数：categoryId = " + categoryId);
    this.setState({
      orderId: orderId,
      categoryId: categoryId,
      categoryName: categoryName,
      customerId: customerId
    })
    let values = {
      'orderId': orderId
    }
    //拉取配置信息
    dispatch({
      type: 'contractManagement/getContractConfig',
      payload: values,
    });

    //拉取配置信息
    dispatch({
      type: 'contractManagement/searchUser',
      payload: values,
    });

    const valuesResult =
    {
      'type': '4',
      'customerId': customerId,
      'needContact': '1',
      'category': categoryId
    }
    //获取客户信息
    Axios.post(URL.getCustomerInfo, valuesResult)
      .then(
        res => {
          if (res.code == 200) {
            if (res.data.result.customer_id) {
              this.setState({
                confirmVisible: true,
                customerInfoState: res.data.result,
                selectedCarBrands: res.data.result?.car_info ?? []
              })
            }
          }
          this.setState({
            confirmVisible: true,
            spinning: false
          })
        }
      );
  }


  handleSubmit = (e: React.FormEvent, isCheck: any) => {
    const { dispatch, form } = this.props;
    const { selectedProducts, productIds, preferentialList } = this.state;
    const { fileList, imgList } = this.state;

    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {

        var totalAmount = form.getFieldValue('totalAmount')
        if (totalAmount) {
          var firstPlanAmount = form.getFieldValue('firstPlanAmount')
          var secondPlanAmount = form.getFieldValue('secondPlanAmount')
          var thirdPlanAmount = form.getFieldValue('thirdPlanAmount')
          var fourthPlanAmount = form.getFieldValue('fourthPlanAmount')

          if (firstPlanAmount && secondPlanAmount && thirdPlanAmount && fourthPlanAmount) {
            if (parseFloat(firstPlanAmount) + parseFloat(secondPlanAmount) + parseFloat(thirdPlanAmount) + parseFloat(fourthPlanAmount) !== parseFloat(totalAmount)) {
              message.error("回款计划总额必须等于合同金额")
              return
            }
          } else {
            if (!firstPlanAmount && !secondPlanAmount && !thirdPlanAmount && !fourthPlanAmount) {
              //回款都没填则不进行校验
            } else {
              if (parseFloat(firstPlanAmount ? firstPlanAmount : '0') + parseFloat(secondPlanAmount ? secondPlanAmount : '0') + parseFloat(thirdPlanAmount ? thirdPlanAmount : '0') + parseFloat(fourthPlanAmount ? fourthPlanAmount : '0') !== parseFloat(totalAmount)) {
                message.error("回款计划总额必须等于合同金额")
                return
              }
            }
          }
        }

        var bride = values["bride"]
        var brideMobile = values["brideMobile"]
        var groom = values["groom"]
        var groomMobile = values["groomMobile"]
        var contact = values["contact"]
        var contactMobile = values["contactMobile"]

        if (!bride && !brideMobile && !groom && !groomMobile && !contact && !contactMobile) {
          message.error("新郎、新娘、联系人信息必填一组")
          return
        } else {
          if ((bride && brideMobile) || (groom && groomMobile) || (contact && contactMobile)) {
            //填写了某一组即可
          } else {
            message.error("新郎、新娘、联系人信息必填一组")
            return
          }
        }

        if (brideMobile && brideMobile.indexOf('*') != -1) {
          values["brideMobile"] = this.state.customerInfoState.bride_encrypt_mobile
        }

        if (groomMobile && groomMobile.indexOf('*') != -1) {
          values["groomMobile"] = this.state.customerInfoState.groom_encrypt_mobile
        }

        if (contactMobile && contactMobile.indexOf('*') != -1) {
          values["contactMobile"] = this.state.customerInfoState.contact_encrypt_mobile
        }

        if (values['weddingDate']) {
          values['weddingDate'] = moment(values['weddingDate']).format('YYYY-MM-DD');
        }

        if (values['carTime']) {
          values['carTime'] = moment(values['carTime']).format('YYYY-MM-DD');
        }

        if (this.state.selectedCarBrands && this.state.selectedCarBrands.length > 0) {
          values["carJson"] = this.state.selectedCarBrands;
        }

        if (selectedProducts.length > 0) {
          const productsIds: string[] = [];
          selectedProducts.map(item => productsIds.push(item.id))
          values['productIds'] = productsIds.join()
        } else {
          values['productIds'] = ''
        }

        if (values["dressType"] && values["dressType"].length > 0) {
          values['dressType'] = values["dressType"].join()
        }

        if (values["dressModel"] && values["dressModel"].length > 0) {
          values['dressModel'] = values["dressModel"].join()
        }

        var preferentialInfoStr = ''
        if (preferentialList.length > 0) {
          preferentialInfoStr = JSON.stringify(preferentialList);
        }

        fileList && fileList.map(item => {
          if (item && item.url) {
            imgList.push(item.url)
          }
        })

        // 酒店特色
        if (values["banquet_hotel_feature"] && values["banquet_hotel_feature".length > 0]) {
          values["banquet_hotel_feature"] = values["banquet_hotel_feature"].join(',');
        }

        if (imgList.length > 0) {
          values['contractPic'] = imgList.join()
        } else {
          values['contractPic'] = ''
        }

        this.setState({
          spinning: true,
          buttonDisabled: true
        })

        const valuesResult = {
          ...values,
          'orderId': this.state.orderId,
          'customerId': this.state.customerId,
          'category': this.state.categoryId,
          'preferentialInfo': preferentialInfoStr,
          'isCheck': isCheck
        }
        dispatch({
          type: 'contractManagement/addContract',
          payload: valuesResult,
          callback: this.onAddContractCallback
        });
      } else {
        this.setState({
          buttonDisabled: false,
          spinning: false
        })
      }
    });
  };

  //创建合同回调
  onAddContractCallback = (status: boolean, msg: string, value: string) => {
    this.setState({
      buttonDisabled: false,
      spinning: false
    })
    if (status) {
      message.success(msg);
      this.setState({
        isReset: true
      })
      history.back();
    }
  };

  //意向区域
  weddingCityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.state.cityCode = code
    const { form } = this.props;
    if (code) {
      form.setFieldsValue({
        'likeCityCode': code
      })
    }
  };

  isSecondaryCategoryIn = (categoryId: string | undefined, firstCategoryId: string) => {
    const { configData } = this.state;

    if (categoryId && configData && configData.category2) {
      const targetCategory = configData.category2.filter(item => item.value + "" == firstCategoryId);
      const childrenCategories = targetCategory[0].children;
      const result = childrenCategories.filter(item => item.value + "" == categoryId.toString());
      return !!(result[0]);
    }
    return false;
  }

  handleSelectCars = (carBrandList: CarBrandInfo[]) => {
    console.log("handleSelectCars  = " + JSON.stringify(carBrandList));
    this.setState({
      selectedCarBrands: carBrandList
    })
  }

  /**
     * 	"category": [{
        "id": 1,
        "name": "婚宴"
      }, {
        "id": 2,
        "name": "婚庆"
      }, {
        "id": 3,
        "name": "婚纱摄影"
      }, {
        "id": 4,
        "name": React.$celebrationOrWeddingBanquet()
      }, {
        "id": 5,
        "name": "婚车"
      }, {
        "id": 6,
        "name": "一站式"
      },{
        "id": 7,
        "name": "婚纱礼服"
      }],
     */

  // 意向区域
  getLikeCityCodeUI = () => {
    const { form: { getFieldDecorator, getFieldValue }, } = this.props;
    const { customerInfoState } = this.state
    const getCompanyType = CrmUtil.getCompanyType();
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label="意向区域" >
            {getFieldDecorator('likeCityCode', {
              rules: [{ required: getCompanyType == 2 ? true : false, message: "请选择意向区域", }],
            })(
              <AreaSelect selectedCode={customerInfoState.city_code ? customerInfoState.city_code : undefined} areaSelectChange={this.weddingCityAreaSelectChange} level3={true} />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 预算
  getWeddingBudgetUI = (label: string) => {
    const { form: { getFieldDecorator, getFieldValue }, } = this.props;
    const { customerInfoState } = this.state

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label={label}>
            {getFieldDecorator('budget', {
              rules: [{ required: true, message: "请填写具体预算", }],
              initialValue: customerInfoState.budget ? customerInfoState.budget.split('-')[0] : undefined

            })(
              <NumericInput maxLength={10} autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请输入婚宴预算" />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 酒店名称/婚礼场地 
  getHotelUI = (label: string) => {
    const { form: { getFieldDecorator }, } = this.props;
    const { customerInfoState } = this.state

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label={label} >
            {getFieldDecorator('hotel', {
              rules: [{ required: false, },],
              initialValue: customerInfoState.hotel ? customerInfoState.hotel : undefined
            })(<Input allowClear maxLength={20} autoComplete="off" style={{ width: '100%', }} placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 婚礼风格/策划风格
  getWeddingStylelUI = (label: string) => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label={label} >
            {getFieldDecorator('weddingStyle', {
              rules: [{ required: false, message: '请选择风格', }],
              initialValue: customerInfoState.wedding_style ? customerInfoState.wedding_style : undefined
            })(
              <Select
                style={{ width: '100%' }}
                placeholder="请选择风格"
              >
                {
                  configData.weddingStyle.map(weddingStyle => (
                    <Option key={weddingStyle.id} value={weddingStyle.id}>{weddingStyle.name}</Option>))
                }
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 宴会厅
  getHotelHallUI = () => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label="宴会厅">
            {getFieldDecorator('hotelHall', {
              rules: [{ required: false }],
              initialValue: customerInfoState.hotel_hall ? customerInfoState.hotel_hall : undefined,
            })(
              <Input allowClear autoComplete="off" maxLength={20} style={{ width: '100%', }} placeholder="请输入宴会厅" />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 婚礼桌数/桌数
  getHotelTables = (label: string) => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label={label}>
            {getFieldDecorator('hotelTables', {
              rules: [{ required: false, message: "请填写有效桌数", pattern: new RegExp(/^[0-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
                const validNum = event.target.value.replace(/\D/g, '');
                return validNum && validNum.length > 0 ? parseInt(validNum) : undefined
              },
              initialValue: customerInfoState.hotel_tables ? customerInfoState.hotel_tables.split('-')[0] : undefined
            })(
              <Input autoComplete="off" maxLength={10} style={{ width: '100%', }} suffix="桌" placeholder="请输入婚礼桌数" />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 档期
  getScheduleUI = (label: string) => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label={label} >
            {getFieldDecorator('schedule', {
              rules: [{ required: false, message: '请选择档期', }],
              initialValue: customerInfoState?.schedule ? customerInfoState?.schedule : undefined
            })(
              <Select
                style={{ width: '100%' }}
                placeholder="请选择档期"
              >
                {
                  configData.scheduleType?.map(scheduleType => (
                    <Option key={scheduleType.id} value={scheduleType.id}>{scheduleType.name}</Option>))
                }
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 每桌预算
  getPerBudgetUI = (label: string) => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label="每桌预算">
            {getFieldDecorator('perBudget', {
              rules: [{ required: false, message: "请填写具体预算", }], getValueFromEvent: (event) => {
                return event.target.value.replace(/\D/g, '')
              },
              initialValue: customerInfoState.per_budget ? customerInfoState.per_budget.split('-')[0] : undefined
            })(
              <NumericInput maxLength={10} autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请输入每桌预算" />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 使用方式
  getDressUseWayUI = () => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
        <Col span={10}>
          <FormItem label="使用方式">
            {getFieldDecorator('dressUseWay', {
              rules: [{ required: false, message: "请选择使用方式", }],
              initialValue: customerInfoState?.dress_use_way ? customerInfoState?.dress_use_way : undefined

            })(
              <Radio.Group style={{ width: '100%' }}>
                {
                  configData.dressUseWay.map(dressUseWay => (
                    <Radio key={dressUseWay.id} value={dressUseWay.id}>{dressUseWay.name}</Radio>))
                }
              </Radio.Group>
            )}
          </FormItem>
        </Col>
      </Row>
    )

  }

  // 服饰类型
  getDressTypeUI = () => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
        <Col span={10}>
          <FormItem label="服饰类型">
            {getFieldDecorator('dressType', {
              rules: [{ required: false, message: "请选择服饰类型", }],
              initialValue: customerInfoState.dress_type ? customerInfoState.dress_type?.split(',').map(Number) : undefined

            })(
              <Checkbox.Group style={{ width: '100%' }}>
                {
                  configData.dressType.map(dressType => (
                    <Checkbox key={dressType.id} value={dressType.id}>{dressType.name}</Checkbox>))
                }
              </Checkbox.Group>
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 礼服款式
  getDressModelUI = () => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state;

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
        <Col span={24}>
          <FormItem label="礼服款式">
            {getFieldDecorator('dressModel', {
              rules: [{ required: false, message: "请选择礼服款式", }],
              initialValue: customerInfoState.dress_model ? customerInfoState.dress_model?.split(',').map(Number) : undefined

            })(
              <Checkbox.Group >
                {
                  configData.dressModel.map(dressModel => (
                    <Checkbox key={dressModel.id} value={dressModel.id}>{dressModel.name}</Checkbox>))
                }
              </Checkbox.Group>
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 礼服数量 
  getDressNumUI = () => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state;

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label="礼服数量">
            {getFieldDecorator('dressNum', {
              rules: [{ required: false, message: "请填写有效数量", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
                return event.target.value.replace(/\D/g, '')
              },
              initialValue: customerInfoState?.dress_num ? customerInfoState?.dress_num : undefined

            })(
              <Input autoComplete="off" maxLength={6} style={{ width: '100%', }} suffix="套" placeholder="请输入礼服数量" />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 拍照风格
  getPhotoStyleUI = () => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state;

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label="拍照风格">
            {getFieldDecorator('photoStyle', {
              rules: [{ required: false, message: "请选择拍照风格", }],
              initialValue: customerInfoState.photo_style ? customerInfoState.photo_style : undefined
            })(
              <Select
                placeholder="请选择拍照风格" style={{ width: '100%', }}>
                {
                  configData.photoStyle.map(photoStyle => (
                    <Option key={photoStyle.id} value={photoStyle.id}>{photoStyle.name}</Option>))
                }
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  // 用车时间
  getCarTimeUI = () => {
    const { form: { getFieldDecorator }, } = this.props;
    const { configData, customerInfoState } = this.state;

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label="用车时间">
            {getFieldDecorator('carTime', { rules: [{ required: false, message: "请选择用车时间" }], initialValue: customerInfoState.car_time ? moment(customerInfoState.car_time, 'YYYY-MM-DD') : undefined })(
              <DatePicker disabled={false} placeholder="请选择用车时间" style={{ width: '100%', }} format="YYYY-MM-DD" />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }


  renderCategoryView = (category: any) => {
    const { form: { getFieldDecorator } } = this.props;
    const { configData } = this.state;
    if (!configData) return null;
    const getCompanyType = CrmUtil.getCompanyType();
    const hotelTablesLabel = getCompanyType !== 1 ? '桌数' : category === 4 ? '举办桌数' : '婚礼桌数';
    const hoteLabel = getCompanyType != 1 ? '预定酒店' : '婚礼场地';
    const weddingBudgetLabel = getCompanyType != 1 ? '预算' : category == 1 ? '婚宴预算' : category == 2 ? '婚庆预算' : category == 4 ? '庆典预算' : category == 6 ? '一站式预算' : ' 预算';

    const { customerInfoState } = this.state;
    console.log('customerInfoState', customerInfoState);

    return (
      <Fragment>
        {/* 意向区域 */}
        {this.getLikeCityCodeUI()}
        {/* **婚宴 婚庆 庆典** */}
        {
          (category == 1 || category == 2 || category == 4 || category == 6 || this.isSecondaryCategoryIn(category, "4")) &&
          <>
            {/* 策划风格 */}
            {this.getWeddingStylelUI('策划风格')}
            {/* 场地类型 */}
            {getCompanyType != 1 && <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
              <Col span={24}>
                <FormItem label="场地类型">
                  {getFieldDecorator('siteType', {
                    rules: [{ required: false, message: "请选择场地类型", }],
                    initialValue: customerInfoState?.site_type ? customerInfoState?.site_type : undefined

                  })(
                    <Radio.Group >
                      {
                        configData && configData.siteType && configData.siteType?.length > 0 ? configData.siteType?.map(siteType => (
                          <Radio value={siteType.id}>{siteType.name}</Radio>)) : ''
                      }
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>}
            {/* 档期类型 */}
            {this.getScheduleUI('档期类型')}
            {/* 桌数 */}
            {this.getHotelTables(hotelTablesLabel)}
            {/* 每桌预算 */}
            {this.getPerBudgetUI('每桌预算')}
            {/* 预定酒店 */}
            {this.getHotelUI(hoteLabel)}
            {/* 酒店特色 */}
            {getCompanyType != 1 && <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
              <Col span={24}>
                <FormItem label="酒店特色">
                  {getFieldDecorator('hotelFeature', {
                    rules: [{ required: false, message: "请选择酒店特色", }],
                    initialValue: customerInfoState?.hotel_feature ? customerInfoState?.hotel_feature : undefined

                  })(
                    <Checkbox.Group>
                      {
                        configData && configData.hotelFeature && configData.hotelFeature?.length > 0 ? configData.hotelFeature.map(hotelFeature => (
                          <Checkbox value={hotelFeature.id}>{hotelFeature.name}</Checkbox>)) : ''
                      }
                    </Checkbox.Group>
                  )}
                </FormItem>
              </Col>
            </Row>}
            {/* 宴会厅 */}
            {this.getHotelHallUI()}
          </>
        }
        {/* **婚纱礼服** */}
        {
          category == 7 && <>
            {/* 使用方式 */}
            {this.getDressUseWayUI()}
            {/* 服饰类型 */}
            {this.getDressTypeUI()}
            {/* 礼服款式 */}
            {this.getDressModelUI()}
            {/* 礼服数量 */}
            {this.getDressNumUI()}
          </>
        }
        {/* **婚纱摄影** */}
        {
          category == 3 && <>
            {/* 拍照风格 */}
            {this.getPhotoStyleUI()}
          </>
        }
        {/* **婚车** */}
        {
          category == 5 && <>
            {/* 用车时间 */}
            {this.getCarTimeUI()}
            {/* 品牌 */}
            {getCompanyType != 1 && <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={10}>
                <WeddingCarSelector
                  selectedCarBrands={this.state.selectedCarBrands}
                  setCarBrandList={this.handleSelectCars}
                  carBrandConfig={configData.carBrand}
                />
                {/* <FormItem label="品牌"> */}
                {/* <Button style={{ width: 120, marginBottom: 10 }} type="primary" onClick={this.showCarBrandView}><PlusOutlined />添加</Button>
                  <div> . 奔驰8辆|宝马1辆|法拉利1辆</div> */}
                {/* <div>
                    {
                      this.state.carBrandList.map((item, index) => (
                        item.carBrandName != '' && item.carNum != '' ? (
                          <span>{index == 0 ? '' : '、'}{item.carBrandName}{item.carNum}辆</span>)
                          : ''
                      ))
                    }
                  </div> */}
                {/* </FormItem> */}
              </Col>
            </Row>}
          </>
        }

        {/* 预算 */}
        {this.getWeddingBudgetUI(weddingBudgetLabel)}
      </Fragment>
    )
  }


  // 添加优惠信息视图展示
  showPreferentialInfoView = (e: React.FormEvent) => {
    if (this.state.preferentialInfoList.length == 0) {
      this.state.preferentialInfoList.push({ type: "", content: "", typeName: "" })
    }

    this.setState({
      preferentialInfoVisible: true
    })
  }

  // 添加优惠
  addPreferential = (e: React.FormEvent) => {
    this.state.preferentialInfoList.push({ type: "", content: "", typeName: "" })
    this.setState((prevState) => {
      const list = [...prevState.preferentialInfoList];
      return { preferentialInfoList: list }
    })
  }

  // 优惠取消
  handleCancelPreferential = (e: React.FormEvent) => {
    this.setState({
      preferentialInfoVisible: false
    })


  }


  // 优惠确认
  handleOkPreferential = (e: React.FormEvent) => {
    this.setState((prevState) => {
      const list = [...prevState.preferentialInfoList];
      return { preferentialList: list }

    })
    this.setState({
      preferentialInfoVisible: false
    })

  }

  //优惠类型监听
  preferentialTypeChange = (e, index) => {
    this.state.preferentialInfoList[index].type = e.key;
    this.state.preferentialInfoList[index].typeName = e.label
  }

  //优惠内容监听
  preferentialContentChange = (e, index) => {
    this.state.preferentialInfoList[index].content = e.target.value;
  }

  //删除优惠信息
  deletePreferential = (e: React.FormEvent, item: any) => {
    var preferentialArray = removeAaary(this.state.preferentialInfoList, item)
    this.setState({
      preferentialInfoList: preferentialArray,
    })
  }


  // 显示添加产品视图
  showProductInfoView = (e: React.FormEvent) => {
    this.setState({
      productInfoVisible: true
    })
  }


  // 产品取消
  handleCancelProduct = (e: React.FormEvent) => {
    const { form } = this.props;

    form.setFieldsValue({
      'productIds': []
    })

    this.setState({
      productInfoVisible: false,
    })
  }


  // 产品确认
  handleOkProduct = (e: React.FormEvent) => {
    const { form } = this.props;
    const { contractManagement: { contractConfig } } = this.props;
    const ids = form.getFieldValue("productIds")
    var selectProductList = [];
    var selectProductIds = [];
    if (ids && ids.length > 0) {
      selectProductIds.push(...ids)
      contractConfig.productList.forEach((product, index) => {
        ids.forEach(id => {
          if (product.id == id) {
            selectProductList.push(product)
          }
        });
      })

      const newProductArr = concatArray(this.state.productInfoList, selectProductList)
      const newIdsArr = concatArray(this.state.productIds, selectProductIds)
      this.setState({
        productInfoList: newProductArr,
        productIds: newIdsArr,
        productInfoVisible: false
      })

      form.setFieldsValue({
        'productIds': []
      })
    } else {
      message.info('请选择产品')
      return
    }
  }

  //删除产品信息
  deleteProduct = (e: React.FormEvent, item: any) => {
    var productArray = removeAaary(this.state.productInfoList, item)
    this.setState({
      productInfoList: productArray,
    })
  }

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  renderFooter = () => (
    <Button size="small" style={{ float: 'right', margin: 5 }} onClick={this.getMock}>
      reload
    </Button>
  );

  getPreferentialTodoItem(obj: any) {
    const { checkCategorys, submitting, bizContent, configData } = this.props;
    const { form: { getFieldDecorator, getFieldValue }, } = this.props;
    const { contractManagement: { contractConfig, userList }, } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      obj.map((item, index) => {
        return (
          <div className={styles.modalListForm}>
            <div key={index} style={{ marginBottom: 10 }}>
              <Card style={{ width: '90%' }}>
                <div className={styles.picWrap}>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                    <Col span={24}>
                      <FormItem label={"优惠类型" + (index + 1)}>
                        <Select labelInValue={true} placeholder="请选择优惠类型" style={{ width: '100%', }} onChange={(e) => this.preferentialTypeChange(e, index)}>
                          {
                            contractConfig.preferentialTypeList.map(preferentialInfo => (
                              <Option key={preferentialInfo.id} value={preferentialInfo.id}>{preferentialInfo.name}</Option>))
                          }
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={24}>
                      <FormItem label="优惠内容">
                        <TextArea rows={3} autoComplete="off" style={{ width: '100%', marginTop: 20 }} placeholder="请填写优惠内容" onChange={(e) => this.preferentialContentChange(e, index)} />
                      </FormItem>
                    </Col>
                  </Row>
                  <CloseOutlined className={styles.deleteBt} onClick={(e) => { this.deletePreferential(e, item) }} />
                </div>
              </Card>
            </div>
          </div>
        )
      })
    )
  }

  onUploadDone = (fileList) => {
    this.setState({
      fileList: fileList,
    })
  }




  brideMobilePattern = () => {
    if (this.state.customerInfoState.bride_mobile) {
      if (this.state.customerInfoState.bride_mobile.indexOf("*") != -1) {
        return undefined
      } else {
        return new RegExp(/^\d{11}$/, "g")
      }
    } else {
      return new RegExp(/^\d{11}$/, "g")
    }
  }

  groomMobilePattern = () => {
    if (this.state.customerInfoState.groom_mobile) {
      if (this.state.customerInfoState.groom_mobile.indexOf("*") != -1) {
        return undefined
      } else {
        return new RegExp(/^\d{11}$/, "g")
      }
    } else {
      return new RegExp(/^\d{11}$/, "g")
    }
  }

  contactMobilePattern = () => {
    if (this.state.customerInfoState.contact_mobile) {
      if (this.state.customerInfoState.contact_mobile.indexOf("*") != -1) {
        return undefined
      } else {
        return new RegExp(/^\d{11}$/, "g")
      }
    } else {
      return new RegExp(/^\d{11}$/, "g")
    }
  }

  /**
   * 搜索产品
   */
  handleSearchProductByKeyword = (keyword: string, hookback: (productList: ProductInfo[], total: number) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contractManagement/searchProduct',
      payload: {
        keyword,
      },
      callback: (productList: ProductInfo[], total: number) => {
        hookback(productList, total);
      }
    });
  }

  /**
   * 解绑产品
   */
  handleUnbindProduct = (product: ProductInfo) => {
    let { selectedProducts } = this.state;
    selectedProducts = selectedProducts.filter(item => item.id != product.id);
    this.setState({ selectedProducts })
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, } = this.props;
    const { contractManagement: { contractConfig, userList }, submitting } = this.props;
    const { customerInfoState, configData } = this.state
    if (!configData) return null;

    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    let currentUserInfo;
    try {
      if (currentUserInfoStr) {
        currentUserInfo = JSON.parse(currentUserInfoStr);
      } else {

      }
    } catch (e) {
      currentUserInfo = currentUserInfoStr;
    }


    return (
      <PageHeaderWrapper title='新建合同'>
        <Spin spinning={this.state.spinning} size='large'>
          <Card bordered={false} >
            <div className={styles.tableListForm}>
              <Form style={{ marginTop: 8, width: '100%' }}>
                <Card bordered={false} title='基本信息'>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="合同编号" >
                        {getFieldDecorator('contractNum', { rules: [{ required: true, message: '请输入合同编号', }], })(
                          <Input autoComplete="off" allowClear maxLength={20} style={{ width: '100%', }} placeholder="请输入合同编号（合同编号只支持字母与数字）" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="合同标题" >
                        {getFieldDecorator('contractAlias', { rules: [{ required: false, message: '请输入合同标题', }], })(
                          <Input autoComplete="off" allowClear maxLength={20} style={{ width: '100%', }} placeholder="请输入合同标题" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="合同类型" ><div style={{ color: '#BFBFBF' }}>{this.state.categoryName}</div>
                      </FormItem>
                    </Col>

                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="客户姓名" ><div style={{ color: '#BFBFBF' }}>{contractConfig.baseInfo.customer_name}</div>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="合同金额">
                        {getFieldDecorator('totalAmount', {
                          rules: [{ required: true, message: '请输入合同金额' }],
                          initialValue: ''
                        })(
                          <NumericInput autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请输入合同金额" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="执行时间" >
                        {getFieldDecorator('weddingDate', {
                          rules: [{ required: false, message: '请选择执行时间' }],
                          initialValue: '',
                        })(
                          <DatePicker placeholder="请选择执行时间" style={{ width: '100%', }} format="YYYY-MM-DD"

                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="婚博单号" >
                        {getFieldDecorator('expoNum', { rules: [{ required: false, message: '请输入婚博单号', }], })(
                          <Input autoComplete="off" maxLength={20} allowClear style={{ width: '100%', }} placeholder="请输入婚博单号" />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Card>
                <Card bordered={false} title='回款计划'>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: 15 }}>
                    <Col span={10}>
                      <label style={{ color: 'red', marginLeft: 40 }}>（ 注：请先确保合同金额填写完整后，再录入回款计划 ）</label>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="预付首款">
                        {getFieldDecorator('firstPlanAmount', {
                          rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, message: '请输入有效金额' }],

                        })(
                          <NumericInput disabled={this.props.form.getFieldValue('totalAmount') ? false : true} autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请输入第1期计划回款金额" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="第二期">
                        {getFieldDecorator('secondPlanAmount', {
                          rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, message: '请输入有效金额' }],

                        })(
                          <NumericInput disabled={this.props.form.getFieldValue('totalAmount') ? false : true} autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请输入第2期计划回款金额" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="第三期">
                        {getFieldDecorator('thirdPlanAmount', {
                          rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, message: '请输入有效金额' }],

                        })(
                          <NumericInput disabled={this.props.form.getFieldValue('totalAmount') ? false : true} autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请输入第3期计划回款金额" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="第四期">
                        {getFieldDecorator('fourthPlanAmount', {
                          rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, message: '请输入有效金额' }],

                        })(
                          <NumericInput disabled={this.props.form.getFieldValue('totalAmount') ? false : true} autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请输入第4期计划回款金额" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Card>
                <Card bordered={false} title='客户信息'>
                  {
                    (CrmUtil.getCompanyType() != 2) ?
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: 15 }}>
                        <Col span={10}>
                          <label style={{ color: 'red', marginLeft: 40 }}>（ 注：新娘、新郎、联系人三个角色三者必填一组 ）</label>
                        </Col>
                      </Row> : null
                  }
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="新娘姓名" >
                        {getFieldDecorator('bride', {
                          rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, pattern: new RegExp(/[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d]/, "g"), message: '请输入新娘名称', }],
                          getValueFromEvent: (event) => {
                            return event.target.value.replace(/[0-9]/, '')
                          },
                          initialValue: customerInfoState.bride_name,
                        })(
                          <Input disabled={customerInfoState.bride_name ? true : false} maxLength={8} autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入新娘姓名" />)}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="新娘手机号" >
                        {getFieldDecorator('brideMobile', {
                          rules: [{ required: CrmUtil.getCompanyType() == 2 ? true : false, pattern: this.brideMobilePattern, min: 11, message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                            return event.target.value.replace(/\D/g, '')
                          },
                          initialValue: customerInfoState.bride_mobile,
                        })(
                          <Input disabled={customerInfoState.bride_mobile ? true : false} autoComplete="off" allowClear maxLength={11} style={{ width: '100%', }} placeholder="请输入新娘手机号" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="新郎姓名" >
                        {getFieldDecorator('groom', {
                          rules: [{ required: false, pattern: new RegExp(/[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d]/, "g"), message: '请输入有效新郎姓名', }],
                          getValueFromEvent: (event) => {
                            return event.target.value.replace(/[0-9]/, '')
                          },
                          initialValue: customerInfoState.groom_name,
                        })(
                          <Input disabled={customerInfoState.groom_name ? true : false} maxLength={8} autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入新郎姓名" />)}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="新郎手机号" >
                        {getFieldDecorator('groomMobile', {
                          rules: [{ required: false, pattern: this.groomMobilePattern, min: 11, message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                            return event.target.value.replace(/\D/g, '')
                          },
                          initialValue: customerInfoState.groom_mobile,
                        })(
                          <Input disabled={customerInfoState.groom_mobile ? true : false} autoComplete="off" allowClear maxLength={11} style={{ width: '100%', }} placeholder="请输入新郎手机号" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="联系人姓名" >
                        {getFieldDecorator('contact', {
                          rules: [{ required: false, pattern: new RegExp(/[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d]/, "g"), message: '请输入有效联系人姓名', }],
                          getValueFromEvent: (event) => {
                            return event.target.value.replace(/[0-9]/, '')
                          },
                          initialValue: customerInfoState.contact_name,
                        })(
                          <Input disabled={customerInfoState.contact_name ? true : false} autoComplete="off" maxLength={8} allowClear style={{ width: '100%', }} placeholder="请输入联系人姓名" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>

                      <FormItem label="联系人电话" >
                        {getFieldDecorator('contactMobile', {
                          rules: [{ required: false, pattern: this.contactMobilePattern, message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                            return event.target.value.replace(/\D/g, '')
                          },
                          initialValue: customerInfoState.contact_mobile
                        })(
                          <Input disabled={customerInfoState.contact_mobile ? true : false} autoComplete="off" allowClear maxLength={11} style={{ width: '100%', }} placeholder="请输入联系人电话" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col span={10}>
                      <FormItem label="联系人身份" >
                        {getFieldDecorator('contactIdentity', {
                          rules: [{ required: false }],
                          initialValue: customerInfoState.contact_identity ? customerInfoState.contact_identity : undefined
                        })(
                          <Select disabled={customerInfoState.contact_identity ? true : false} placeholder="请选择联系人身份" style={{ width: '100%', }} >
                            {
                              configData.identity.map(identity => (
                                <Option key={identity.id} value={identity.id}>{identity.name}</Option>))
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {this.renderCategoryView(this.state.categoryId)}
                </Card>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={10}>
                    <Card bordered={false} title='优惠信息' style={{ width: '100%' }} >
                      <Button type="primary" onClick={(e) => { this.showPreferentialInfoView(e) }} loading={submitting}>关联优惠 </Button>
                      <Modal
                        title="填写优惠"
                        visible={this.state.preferentialInfoVisible}
                        onOk={this.handleOkPreferential}
                        onCancel={this.handleCancelPreferential}
                      >
                        <div className={styles.modalListForm}>
                          <FormItem >
                            <Button style={{ marginBottom: 10 }} type="primary" onClick={(e) => { this.addPreferential(e) }} loading={submitting}>添加优惠 </Button>
                          </FormItem>
                          <div style={{ marginTop: -2, height: 350, overflowY: 'auto' }}>
                            {this.getPreferentialTodoItem(this.state.preferentialInfoList)}
                          </div>
                        </div>
                      </Modal>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={16}>
                          <div style={{ marginLeft: 20 }}>
                            {
                              this.state.preferentialList.map((item, index) => (
                                item.typeName != '' && item.content != '' ? (
                                  <span>优惠{index + 1}：{item.typeName}<br />优惠内容：{item.content}<br /><br /></span>)
                                  : ''))
                            }
                          </div>
                        </Col>

                      </Row>
                    </Card>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={10}>
                    <Card bordered={false} title='产品信息' style={{ width: '100%' }} >
                      <ProductEditor
                        bindedProducts={this.state.selectedProducts}
                        bindProduct={products => {
                          const { selectedProducts } = this.state;
                          if (products && products.length > 0) {
                            selectedProducts.push(...products)
                            this.setState({ selectedProducts })
                          }
                        }}
                        unbindProduct={this.handleUnbindProduct}
                        onSearchProductByKeyWord={this.handleSearchProductByKeyword}
                      />
                    </Card>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={15}>
                    <FormItem label="合同照片">
                      {getFieldDecorator('contractPic', {
                        rules: [{ required: false, message: '请上传合同照片', }],
                      })(
                        <ImageUpload onUploadDone={this.onUploadDone} ></ImageUpload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={10}>
                    <FormItem label="备注">
                      {getFieldDecorator('remark', { rules: [{ required: false }], })(
                        <TextArea rows={3} allowClear style={{ width: '100%', }} placeholder="请输入备注" />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <FormItem wrapperCol={{ span: 100, offset: 1 }} style={{ marginTop: 32, marginLeft: 50 }}>
                  <Button disabled={this.state.buttonDisabled} style={{ marginLeft: 20, width: 150 }} type="primary" htmlType="submit" onClick={(e) => { this.handleSubmit(e, 1) }}  >提交 </Button>
                  <Button disabled={this.state.buttonDisabled} style={{ width: 150, marginLeft: 50 }} htmlType="submit" onClick={(e) => { this.handleSubmit(e, 0) }}>暂存</Button>
                </FormItem>
              </Form>
            </div>
          </Card >
        </Spin>
      </PageHeaderWrapper >
    );
  }

}
export default Form.create<CreateFormProps>()(NewContractCreateForm);
