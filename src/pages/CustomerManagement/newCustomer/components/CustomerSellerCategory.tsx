
import { Button, Modal, Form, Input, Radio, Checkbox, DatePicker, Select, Radio, Card, Col, Row, Collapse, Switch } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './CustomerSellerCategory.less';
import { FormComponentProps, FormComponentProps } from 'antd/es/form';
import { isBlock } from '@babel/types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import NumericInput from '@/components/NumericInput';
import AreaSelect from '@/components/AreaSelect';
import { BanquetInfoState, WeddingInfoState, PhotographytInfoState, CarInfoState, CelebrationInfoState, OneStopInfoState, CarJsonInfoState, DressInfoState } from '../data';
import autoHeight from '@/pages/DashboardWorkplace/components/Radar/autoHeight';
import NumberRangeInput from '@/components/NumberRangeInput';
import TextArea from 'antd/lib/input/TextArea';
import CrmUtil from '@/utils/UserInfoStorage';
const { Option } = Select;
const { Panel } = Collapse;

//构建state类型
interface reqState {
  banquet: BanquetInfoState;//婚宴
  wedding: WeddingInfoState;// 婚庆
  photography: PhotographytInfoState;//婚纱摄影
  car: CarInfoState;//婚车
  celebration: CelebrationInfoState;// 到喜啦叫庆典 其它叫喜宴
  oneStop: OneStopInfoState;//一站式
  dress: DressInfoState;//礼服

}

interface pageState {
  banquetCityCode?: string
  weddingCityCode?: string
  photographyCityCode?: string
  carCityCode?: string
  celebrationCityCode?: string
  oneStopCityCode?: string
  dressCityCode?: string
  visible: boolean
  carBrandList: CarJsonInfoState[]
  buttonDisabled: boolean
}

function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')));
}


class SellerCategory extends React.Component<FormComponentProps, pageState, reqState> {

  //初始化
  reqState: reqState = {
    banquet: {},
    wedding: {},
    photography: {},
    car: {},
    celebration: {},
    oneStop: {},
    dress: {},
  }

  state: pageState = {

    visible: false,
    carBrandList: [],
    buttonDisabled: false,
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

  // 提交表单
  validateCtrl = (e: React.FormEvent) => {

    const { validate, form, setButtonDisabled } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setButtonDisabled(true)
        //婚宴
        var banquet_site_type = values["banquet_site_type"]
        var banquet_schedule_type = values["banquet_schedule_type"]
        var banquet_hotel_feature = values["banquet_hotel_feature"]
        var banquet_hotelTablesFrom = values["banquet_hotelTablesFrom"]
        var banquet_hotelTablesEnd = values["banquet_hotelTablesEnd"]
        var banquet_perBudgetFrom = values["banquet_perBudgetFrom"]
        var banquet_perBudgetEnd = values["banquet_perBudgetEnd"]
        var banquet_budgetFrom = values["banquet_budgetFrom"]
        var banquet_budgetEnd = values["banquet_budgetEnd"]
        var banquet_remark = values["banquet_remark"]
        var banquet_needAutoDistribute = values["banquet_needAutoDistribute"]
        var banquet_reqOwnerId = values["banquet_reqOwnerId"]


        //婚庆
        var wedding_style = values["wedding_style"]
        var wedding_category_type = values["wedding_category_type"]
        var wedding_hotel = values["wedding_hotel"]
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

        //婚纱摄影
        var photography_style = values["photography_style"]
        var photography_category_type = values["photography_category_type"]
        var photography_budgetFrom = values["photography_budgetFrom"]
        var photography_budgetEnd = values["photography_budgetEnd"]
        var photography_remark = values["photography_remark"]
        var photography_needAutoDistribute = values["photography_needAutoDistribute"]
        var photography_reqOwnerId = values["photography_reqOwnerId"]

        //庆典or喜宴
        var celebration_category_type = values["celebration_category_type"]
        var celebration_hotel = values["celebration_hotel"]
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

        //一站式
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

        //婚纱礼服
        var dress_use_way = values["dress_use_way"]
        var dress_type = values["dress_type"]
        var dress_model = values["dress_model"]
        var dress_num = values["dress_num"]
        var dress_budgetFrom = values["dress_budgetFrom"]
        var dress_budgetEnd = values["dress_budgetEnd"]
        var dress_remark = values["dress_remark"]
        var dress_needAutoDistribute = values["dress_needAutoDistribute"]
        var dress_reqOwnerId = values["dress_reqOwnerId"]

        //婚车
        var car_time = values["car_time"]
        var car_budgetFrom = values["car_budgetFrom"]
        var car_budgetEnd = values["car_budgetEnd"]
        var car_remark = values["car_remark"]
        var car_needAutoDistribute = values["car_needAutoDistribute"]
        var car_reqOwnerId = values["car_reqOwnerId"]


        //婚宴
        if (this.state.banquetCityCode) {
          this.reqState.banquet.cityCode = this.state.banquetCityCode
          this.reqState.banquet.budgetFrom = banquet_budgetFrom
          this.reqState.banquet.budgetEnd = banquet_budgetEnd
          this.reqState.banquet.perBudgetFrom = banquet_perBudgetFrom
          this.reqState.banquet.perBudgetEnd = banquet_perBudgetEnd
          this.reqState.banquet.hotelTablesFrom = banquet_hotelTablesFrom
          this.reqState.banquet.hotelTablesEnd = banquet_hotelTablesEnd
          this.reqState.banquet.scheduleType = banquet_schedule_type
          if (banquet_hotel_feature && banquet_hotel_feature.length > 0) {
            this.reqState.banquet.hotelFeature = banquet_hotel_feature.join()
          }
          this.reqState.banquet.siteType = banquet_site_type
          this.reqState.banquet.finalCategory = '1'
          this.reqState.banquet.remark = banquet_remark
          this.reqState.banquet.needAutoDistribute = banquet_needAutoDistribute ? "1" : '0'
          this.reqState.banquet.reqOwnerId = banquet_reqOwnerId
        }

        //婚庆
        if (this.state.weddingCityCode) {
          this.reqState.wedding.cityCode = this.state.weddingCityCode
          this.reqState.wedding.budgetFrom = wedding_budgetFrom
          this.reqState.wedding.budgetEnd = wedding_budgetEnd
          this.reqState.wedding.perBudgetFrom = wedding_perBudgetFrom
          this.reqState.wedding.perBudgetEnd = wedding_perBudgetEnd
          this.reqState.wedding.hotelTablesFrom = wedding_hotelTablesFrom
          this.reqState.wedding.hotelTablesEnd = wedding_hotelTablesEnd
          this.reqState.wedding.hotel = wedding_hotel
          this.reqState.wedding.hotelHall = wedding_banquet_hall
          this.reqState.wedding.weddingStyle = wedding_style
          if (wedding_category_type) {
            this.reqState.wedding.finalCategory = wedding_category_type
          } else {
            this.reqState.wedding.finalCategory = '2'
          }
          this.reqState.wedding.remark = wedding_remark
          this.reqState.wedding.needAutoDistribute = wedding_needAutoDistribute ? "1" : '0'
          this.reqState.wedding.reqOwnerId = wedding_reqOwnerId
        }

        //婚纱摄影
        if (this.state.photographyCityCode) {
          this.reqState.photography.cityCode = this.state.photographyCityCode
          this.reqState.photography.photoStyle = photography_style
          this.reqState.photography.budgetFrom = photography_budgetFrom
          this.reqState.photography.budgetEnd = photography_budgetEnd
          if (photography_category_type) {
            this.reqState.photography.finalCategory = photography_category_type
          } else {
            this.reqState.photography.finalCategory = '3'
          }

          this.reqState.photography.remark = photography_remark
          this.reqState.photography.needAutoDistribute = photography_needAutoDistribute ? "1" : '0'
          this.reqState.photography.reqOwnerId = photography_reqOwnerId
        }

        //庆典or喜宴
        if (this.state.celebrationCityCode) {
          this.reqState.celebration.cityCode = this.state.celebrationCityCode
          this.reqState.celebration.budgetFrom = celebration_budgetFrom
          this.reqState.celebration.budgetEnd = celebration_budgetEnd
          this.reqState.celebration.perBudgetFrom = celebration_perBudgetFrom
          this.reqState.celebration.perBudgetEnd = celebration_perBudgetEnd
          this.reqState.celebration.hotelTablesFrom = celebration_hotelTablesFrom
          this.reqState.celebration.hotelTablesEnd = celebration_hotelTablesEnd
          this.reqState.celebration.hotel = celebration_hotel
          this.reqState.celebration.hotelHall = celebration_banquet_hall
          if (celebration_category_type) {
            this.reqState.celebration.finalCategory = celebration_category_type
          } else {
            this.reqState.celebration.finalCategory = '4'
          }
          this.reqState.celebration.remark = celebration_remark
          this.reqState.celebration.needAutoDistribute = celebration_needAutoDistribute ? "1" : '0'
          this.reqState.celebration.reqOwnerId = celebration_reqOwnerId
        }

        //婚车
        if (this.state.carCityCode) {
          this.reqState.car.cityCode = this.state.carCityCode
          if (car_time) {
            this.reqState.car.carTime = car_time.format('YYYY-MM-DD')
          }
          this.reqState.car.budgetFrom = car_budgetFrom
          this.reqState.car.budgetEnd = car_budgetEnd
          this.reqState.car.carJson = this.state.carBrandList
          this.reqState.car.finalCategory = '5'
          this.reqState.car.remark = car_remark
          this.reqState.car.needAutoDistribute = car_needAutoDistribute ? "1" : '0'
          this.reqState.car.reqOwnerId = car_reqOwnerId
        }

        //一站式
        if (this.state.oneStopCityCode) {
          this.reqState.oneStop.cityCode = this.state.oneStopCityCode
          this.reqState.oneStop.budgetFrom = oneStop_budgetFrom
          this.reqState.oneStop.budgetEnd = oneStop_budgetEnd
          this.reqState.oneStop.perBudgetEnd = oneStop_perBudgetFrom
          this.reqState.oneStop.perBudgetEnd = oneStop_perBudgetEnd
          this.reqState.oneStop.hotelTablesFrom = oneStop_hotelTablesFrom
          this.reqState.oneStop.hotelTablesEnd = oneStop_hotelTablesEnd
          this.reqState.oneStop.hotel = oneStop_hotel
          this.reqState.oneStop.hotelHall = oneStop_banquet_hall
          this.reqState.oneStop.weddingStyle = oneStop_wedding_style
          this.reqState.oneStop.finalCategory = '6'
          this.reqState.oneStop.remark = oneStop_remark
          this.reqState.oneStop.needAutoDistribute = oneStop_needAutoDistribute ? "1" : '0'
          this.reqState.oneStop.reqOwnerId = oneStop_reqOwnerId
        }


        //婚纱礼服
        if (this.state.dressCityCode) {
          this.reqState.dress.cityCode = this.state.dressCityCode
          this.reqState.dress.budgetFrom = dress_budgetFrom
          this.reqState.dress.budgetEnd = dress_budgetEnd
          this.reqState.dress.dressModel = dress_model
          if (dress_model && dress_model.length > 0) {
            this.reqState.dress.dressModel = dress_model.join()
          }
          if (dress_type && dress_type.length > 0) {
            this.reqState.dress.dressType = dress_type.join()
          }
          this.reqState.dress.dressUseWay = dress_use_way
          this.reqState.dress.dressNum = dress_num
          this.reqState.dress.finalCategory = '7'
          this.reqState.dress.remark = dress_remark
          this.reqState.dress.needAutoDistribute = dress_needAutoDistribute ? "1" : '0'
          this.reqState.dress.reqOwnerId = dress_reqOwnerId
        }



        const newState = JSON.parse(JSON.stringify(this.reqState));
        validate(newState);
      } else {
        setButtonDisabled(false)
      }
    });
  }


  // 添加用车品牌
  showCarBrandView = (e: React.FormEvent) => {
    if (this.state.carBrandList.length == 0) {
      this.state.carBrandList.push({ carBrand: "", carNum: "", carBrandName: "" })
    }

    this.setState({
      visible: true
    })
  }

  // 添加用车品牌
  addCarBrand = (e: React.FormEvent) => {
    this.state.carBrandList.push({ carBrand: "", carNum: "", carBrandName: "" })
    this.setState((prevState) => {
      const list = [...prevState.carBrandList];
      return { carBrandList: list }
    })
  }

  // 取消
  handleCancel = (e: React.FormEvent) => {
    this.setState({
      visible: false
    })
    this.state.carBrandList = []
  }


  // 确认
  handleOk = (e: React.FormEvent) => {
    this.setState((prevState) => {
      const list = [...prevState.carBrandList];
      return { carBrandList: list }
    })
    this.setState({
      visible: false
    })

  }


  carBrandChange = (e, index) => {
    var keys = e.split('|')
    this.state.carBrandList[index].carBrand = keys[0];
    this.state.carBrandList[index].carBrandName = keys[1]
  }

  carNumChange = (e, index) => {
    this.state.carBrandList[index].carNum = e.target.value;
  }


  // onNumberRangeInput = (e, index) =>


  getTodoItem(obj) {
    const { checkCategorys, submitting, bizContent, configData } = this.props;
    const { form: { getFieldDecorator, getFieldValue }, } = this.props;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      obj.map((item, index) => {
        return (
          <div className={styles.tableListForm}>
            <div key={index} style={{ marginBottom: 10 }}>
              <Card style={{ width: '100%' }}>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={24}>
                    <FormItem label="品牌要求">
                      <Select placeholder="请选择品牌" style={{ width: '100%', }} onChange={(e) => this.carBrandChange(e, index)}>
                        {
                          configData.carBrand.map(carBrand => (
                            <Option value={carBrand.id + "|" + carBrand.name}>{carBrand.name}</Option>))
                        }
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={24}>
                    <FormItem label="车辆数量">
                      <Input autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入车辆数量" onChange={(e) => this.carNumChange(e, index)} />
                    </FormItem>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        )
      })
    )
  }


  getChildrenForCategory = (value) => {
    const { configData, } = this.props;
    var arry
    configData.category2.forEach(category => {
      if (value == category.value) {
        if (category.children && category.children.length > 0) {
          arry = category.children
        }
      }
    });
    return arry
  }


  render() {
    const { checkCategorys, submitting, bizContent, configData, getFieldValue, buttonDisabled, receiveUser } = this.props;
    const { form: { getFieldDecorator, } } = this.props;
    const { form } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    // console.log("按钮状态：" + buttonDisabled)


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

    if (checkCategorys && checkCategorys.length > 0) {
      return (
        <Fragment>
          <Collapse defaultActiveKey={['1']} style={{ marginLeft: 20, marginRight: 20 }}>
            <Panel header="品类信息" key="1">
              <div className={styles.tableListForm}>
                {checkCategorys.indexOf(1) != -1 ? (//婚宴
                  <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚宴" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="意向区域" >
                          {getFieldDecorator('banquet_cityCode', {
                            rules: [{ required: true, message: "请选择意向区域", }],
                            initialValue: ''
                          })(
                            <AreaSelect areaSelectChange={this.banquetCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚礼桌数">
                          <NumberRangeInput myForm={form} minimumField='banquet_hotelTablesFrom' maximumField='banquet_hotelTablesEnd' />
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                      <Col span={24}>
                        <FormItem label="场地类型">
                          {getFieldDecorator('banquet_site_type', {
                            rules: [{ required: false, message: "请选择场地类型", }],
                            initialValue: ''

                          })(
                            <Radio.Group >
                              {
                                configData.siteType.map(siteType => (
                                  <Radio value={siteType.id}>{siteType.name}</Radio>))
                              }
                            </Radio.Group>
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                      <Col span={13}>
                        <FormItem label="档期类型">
                          {getFieldDecorator('banquet_schedule_type', {
                            rules: [{ required: false, message: "请选择档期类型", }],
                            initialValue: ''

                          })(
                            <Radio.Group style={{ flexGrow: 1 }} >
                              {
                                configData.scheduleType?.map(scheduleType => (
                                  <Radio value={scheduleType.id}>{scheduleType.name}</Radio>))
                              }
                            </Radio.Group>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                      <Col span={24}>
                        <FormItem label="酒店特色">
                          {getFieldDecorator('banquet_hotel_feature', {
                            rules: [{ required: false, message: "请选择酒店特色", }],
                            initialValue: ''

                          })(
                            <Checkbox.Group  >
                              {
                                configData.hotelFeature.map(hotelFeature => (
                                  <Checkbox value={hotelFeature.id}>{hotelFeature.name}</Checkbox>))
                              }
                            </Checkbox.Group>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="每桌预算">
                          <NumberRangeInput myForm={form} minimumField='banquet_perBudgetFrom' maximumField='banquet_perBudgetEnd' />
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>

                        <FormItem label="婚宴预算">
                          <NumberRangeInput myForm={form} minimumField='banquet_budgetFrom' maximumField='banquet_budgetEnd' />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="备注">
                          {getFieldDecorator('banquet_remark')(
                            <TextArea maxLength={300} rows={3} placeholder="请输入备注信息" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 1) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="是否自动分配" > {getFieldDecorator('banquet_needAutoDistribute', { rules: [{ required: false }], initialValue: true, valuePropName: 'checked' })(
                              <Switch size="default" defaultChecked={true} />)}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    {
                      (CrmUtil.getCompanyType() == 2 && receiveUser.length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="邀约人" >
                              {getFieldDecorator('banquet_reqOwnerId', { rules: [{ required: false }], })(
                                <Select placeholder="请选择指定邀约人" style={{ width: '100%', }} >
                                  {
                                    receiveUser.map(user => (
                                      <Option value={user.id}>{user.name}</Option>))
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                  </Card>
                ) : null
                }
                {checkCategorys.indexOf(2) != -1 ? (//婚庆
                  <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚庆" bordered={false}>
                    {
                      (this.getChildrenForCategory(2) && this.getChildrenForCategory(2).length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={24}>
                            <FormItem label="二级品类">
                              {getFieldDecorator('wedding_category_type', {
                                rules: [{ required: true, message: "请选择二级品类", }],
                                initialValue: ''
                              })(
                                <Radio.Group >
                                  {
                                    this.getChildrenForCategory(2).map((category) => (
                                      <Radio value={category.value} >{category.label}</Radio>))
                                  }
                                </Radio.Group>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="意向区域" >
                          {getFieldDecorator('wedding_cityCode', {
                            rules: [{ required: true, message: "请选择意向区域", }],
                            initialValue: ''
                          })(
                            <AreaSelect areaSelectChange={this.weddingCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                      <Col span={24}>
                        <FormItem label="婚礼风格">
                          {getFieldDecorator('wedding_style', {
                            rules: [{ required: false, message: "请选择婚礼风格", }],
                            initialValue: ''

                          })(
                            <Radio.Group >
                              {
                                configData.weddingStyle.map(weddingStyle => (
                                  <Radio value={weddingStyle.id}>{weddingStyle.name}</Radio>))
                              }
                            </Radio.Group>
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚礼桌数">
                          <NumberRangeInput myForm={form} minimumField='wedding_hotelTablesFrom' maximumField='wedding_hotelTablesEnd' />
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="每桌预算">
                          <NumberRangeInput myForm={form} minimumField='wedding_perBudgetFrom' maximumField='wedding_perBudgetEnd' />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="预定酒店">
                          {getFieldDecorator('wedding_hotel', {
                            rules: [{ required: false, message: "请输入酒店名称", }],
                            initialValue: ''

                          })(
                            <Input autoComplete="off" maxLength={30} style={{ width: '100%', }} placeholder="请输入酒店名称" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="宴会厅">
                          {getFieldDecorator('wedding_banquet_hall', {
                            rules: [{ required: false, message: "请输入宴会厅", }],
                            initialValue: ''

                          })(
                            <Input autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入宴会厅" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚庆预算">
                          <NumberRangeInput myForm={form} minimumField='wedding_budgetFrom' maximumField='wedding_budgetEnd' />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="备注">
                          {getFieldDecorator('wedding_remark')(
                            <TextArea maxLength={300} rows={3} placeholder="请输入备注信息" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 1) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="是否自动分配" > {getFieldDecorator('wedding_needAutoDistribute', { rules: [{ required: false }], initialValue: true, valuePropName: 'checked' })(
                              <Switch size="default" defaultChecked={true} />)}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    {
                      (CrmUtil.getCompanyType() == 2 && receiveUser.length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="邀约人" >
                              {getFieldDecorator('wedding_reqOwnerId', { rules: [{ required: false }], })(
                                <Select placeholder="请选择指定邀约人" style={{ width: '100%', }} >
                                  {
                                    receiveUser.map(user => (
                                      <Option value={user.id}>{user.name}</Option>))
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                  </Card>
                ) : null
                }

                {checkCategorys.indexOf(3) != -1 ? (//婚纱摄影
                  <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚纱摄影" bordered={false}>
                    {
                      (this.getChildrenForCategory(3) && this.getChildrenForCategory(3).length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={24}>
                            <FormItem label="二级品类">
                              {getFieldDecorator('photography_category_type', {
                                rules: [{ required: true, message: "请选择二级品类", }],
                                initialValue: ''
                              })(
                                <Radio.Group >
                                  {
                                    this.getChildrenForCategory(3).map((category) => (
                                      <Radio value={category.value} >{category.label}</Radio>))
                                  }
                                </Radio.Group>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="意向区域" >
                          {getFieldDecorator('photography_cityCode', {
                            rules: [{ required: true, message: "请选择意向区域", }],
                            initialValue: ''
                          })(
                            <AreaSelect areaSelectChange={this.photographyCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={24}>
                        <FormItem label="拍照风格">
                          {getFieldDecorator('photography_style', {
                            rules: [{ required: false, message: "请选择拍照风格", }],
                            initialValue: ''

                          })(
                            <Radio.Group >
                              {
                                configData.photoStyle.map(photoStyle => (
                                  <Radio value={photoStyle.id}>{photoStyle.name}</Radio>))
                              }
                            </Radio.Group>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚纱摄影预算">
                          <NumberRangeInput myForm={form} minimumField='photography_budgetFrom' maximumField='photography_budgetEnd' />

                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="备注">
                          {getFieldDecorator('photography_remark')(
                            <TextArea maxLength={300} rows={3} placeholder="请输入备注信息" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 1) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="是否自动分配" > {getFieldDecorator('photography_needAutoDistribute', { rules: [{ required: false }], initialValue: true, valuePropName: 'checked' })(
                              <Switch size="default" defaultChecked={true} />)}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    {
                      (CrmUtil.getCompanyType() == 2 && receiveUser.length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="邀约人" >
                              {getFieldDecorator('photography_reqOwnerId', { rules: [{ required: false }], })(
                                <Select placeholder="请选择指定邀约人" style={{ width: '100%', }} >
                                  {
                                    receiveUser.map(user => (
                                      <Option value={user.id}>{user.name}</Option>))
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                  </Card>
                ) : null
                }
                {checkCategorys.indexOf(4) != -1 ? (//庆典or喜宴
                  <Card style={{ width: '100%', marginBottom: 10, marginLeft: 20 }} title={React.$celebrationOrWeddingBanquet()} bordered={false}>
                    {
                      (this.getChildrenForCategory(4) && this.getChildrenForCategory(4).length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={24}>
                            <FormItem label="二级品类">
                              {getFieldDecorator('celebration_category_type', {
                                rules: [{
                                  required: true, message: `请选择二级类型`,
                                }],
                                initialValue: ''
                              })(
                                <Radio.Group >
                                  {
                                    this.getChildrenForCategory(4).map((category) => (
                                      <Radio value={category.value} >{category.label}</Radio>))
                                  }
                                </Radio.Group>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="意向区域" >
                          {getFieldDecorator('celebration_cityCode', {
                            rules: [{ required: true, message: "请选择意向区域", }],
                            initialValue: ''
                          })(
                            <AreaSelect areaSelectChange={this.celebrationCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="举办桌数">
                          <NumberRangeInput myForm={form} minimumField='celebration_hotelTablesFrom' maximumField='celebration_hotelTablesEnd' />

                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="预定酒店">
                          {getFieldDecorator('celebration_hotel', {
                            rules: [{ required: false, message: "请填写具体预算", }],
                            initialValue: ''
                          })(
                            <Input autoComplete="off" maxLength={30} style={{ width: '100%', }} placeholder="请输入酒店名称" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="宴会厅">
                          {getFieldDecorator('celebration_banquet_hall', {
                            rules: [{ required: false, message: "请填写具体预算", }],
                            initialValue: ''
                          })(
                            <Input autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入宴会厅" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="每桌预算">
                          <NumberRangeInput myForm={form} minimumField='celebration_perBudgetFrom' maximumField='celebration_perBudgetEnd' />

                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label={`${React.$celebrationOrWeddingBanquet()}预算`}>
                          <NumberRangeInput myForm={form} minimumField='celebration_budgetFrom' maximumField='celebration_budgetEnd' />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="备注">
                          {getFieldDecorator('celebration_remark')(
                            <TextArea maxLength={300} rows={3} placeholder="请输入备注信息" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 1) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="是否自动分配" > {getFieldDecorator('celebration_needAutoDistribute', { rules: [{ required: false }], initialValue: true, valuePropName: 'checked' })(
                              <Switch size="default" defaultChecked={true} />)}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    {
                      (CrmUtil.getCompanyType() == 2 && receiveUser.length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="邀约人" >
                              {getFieldDecorator('celebration_reqOwnerId', { rules: [{ required: false }], })(
                                <Select placeholder="请选择指定邀约人" style={{ width: '100%', }} >
                                  {
                                    receiveUser.map(user => (
                                      <Option value={user.id}>{user.name}</Option>))
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                  </Card>
                ) : null
                }
                {checkCategorys.indexOf(5) != -1 ? (//婚车
                  <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚车" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="意向区域" >
                          {getFieldDecorator('car_cityCode', {
                            rules: [{ required: true, message: "请选择意向区域", }],
                            initialValue: ''
                          })(
                            <AreaSelect areaSelectChange={this.carCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="用车时间">
                          {getFieldDecorator('car_time', {
                            rules: [{ required: false, message: "请选择用车时间", }],
                            initialValue: ''
                          })(
                            <DatePicker style={{ width: '100%', }} format="YYYY-MM-DD"
                              disabledDate={disabledDate}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>

                        <FormItem label="品牌要求">
                          <Button style={{ width: 120, marginBottom: 10 }} type="primary" onClick={(e) => { this.showCarBrandView(e) }} loading={submitting}>添加 </Button>
                          <br />
                          {/* <div > . 奔驰8辆|宝马1辆|法拉利1辆</div> */}
                          <div >
                            {
                              this.state.carBrandList.map((item, index) => (
                                item.carBrandName != '' && item.carNum != '' ? (
                                  <span>{index == 0 ? '' : '、'}{item.carBrandName}{item.carNum}辆</span>)
                                  : ''
                              ))
                            }
                          </div>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚车预算">
                          <NumberRangeInput myForm={form} minimumField='car_budgetFrom' maximumField='car_budgetEnd' />

                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="备注">
                          {getFieldDecorator('car_remark')(
                            <TextArea maxLength={300} rows={3} placeholder="请输入备注信息" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 1) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="是否自动分配" > {getFieldDecorator('car_needAutoDistribute', { rules: [{ required: false }], initialValue: true, valuePropName: 'checked' })(
                              <Switch size="default" defaultChecked={true} />)}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    {
                      (CrmUtil.getCompanyType() == 2 && receiveUser.length > 0) ? (
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="邀约人" >
                              {getFieldDecorator('car_reqOwnerId', { rules: [{ required: false }], })(
                                <Select placeholder="请选择指定邀约人" style={{ width: '100%', }} >
                                  {
                                    receiveUser.map(user => (
                                      <Option value={user.id}>{user.name}</Option>))
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null
                    }
                    <Modal
                      title="用车品牌"
                      visible={this.state.visible}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                    >
                      <div className={styles.tableListForm}>
                        <FormItem label="填写品牌要求">
                          <Button style={{ width: 100, marginBottom: 10 }} type="primary" onClick={(e) => { this.addCarBrand(e) }} loading={submitting}>+添加 </Button>
                        </FormItem>
                        <div style={{ marginTop: -2, height: 400, overflowY: 'auto' }}>
                          {this.getTodoItem(this.state.carBrandList)}
                        </div>
                      </div>
                    </Modal>
                  </Card>
                ) : null
                }
                {
                  checkCategorys.indexOf(6) != -1 ? (//一站式
                    <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="一站式" bordered={false}>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="意向区域" >
                            {getFieldDecorator('oneStop_cityCode', {
                              rules: [{ required: true, message: "请选择意向区域", }],
                              initialValue: ''
                            })(
                              <AreaSelect areaSelectChange={this.oneStopCityAreaSelectChange} level3={true} />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                        <Col span={24}>
                          <FormItem label="婚礼风格">
                            {getFieldDecorator('oneStop_wedding_style', {
                              rules: [{ required: false, message: "请选择婚礼风格", }],
                              initialValue: ''

                            })(
                              <Radio.Group >
                                {
                                  configData.weddingStyle.map(weddingStyle => (
                                    <Radio value={weddingStyle.id}>{weddingStyle.name}</Radio>))
                                }
                              </Radio.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="婚礼桌数">
                            <NumberRangeInput myForm={form} minimumField='oneStop_hotelTablesFrom' maximumField='oneStop_hotelTablesEnd' />

                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="每桌预算">
                            <NumberRangeInput myForm={form} minimumField='oneStop_perBudgetFrom' maximumField='oneStop_perBudgetEnd' />

                          </FormItem>
                        </Col>
                      </Row>

                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="预定酒店">
                            {getFieldDecorator('oneStop_hotel', {
                              rules: [{ required: false, message: "请输入酒店名称", }],
                              initialValue: ''
                            })(
                              <Input autoComplete="off" maxLength={30} style={{ width: '100%', }} placeholder="请输入酒店名称" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="宴会厅">
                            {getFieldDecorator('oneStop_banquet_hall', {
                              rules: [{ required: false, message: "请输入宴会厅", }],
                              initialValue: ''
                            })(
                              <Input autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入宴会厅" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="整体预算">
                            <NumberRangeInput myForm={form} minimumField='oneStop_budgetFrom' maximumField='oneStop_budgetEnd' />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="备注">
                            {getFieldDecorator('oneStop_remark')(
                              <TextArea maxLength={300} rows={3} placeholder="请输入备注信息" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      {
                        (CrmUtil.getCompanyType() == 1) ? (
                          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={12}>
                              <FormItem label="是否自动分配" > {getFieldDecorator('oneStop_needAutoDistribute', { rules: [{ required: false }], initialValue: true, valuePropName: 'checked' })(
                                <Switch size="default" defaultChecked={true} />)}
                              </FormItem>
                            </Col>
                          </Row>
                        ) : null
                      }
                      {
                        (CrmUtil.getCompanyType() == 2 && receiveUser.length > 0) ? (
                          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={12}>
                              <FormItem label="邀约人" >
                                {getFieldDecorator('oneStop_reqOwnerId', { rules: [{ required: false }], })(
                                  <Select placeholder="请选择指定邀约人" style={{ width: '100%', }} >
                                    {
                                      receiveUser.map(user => (
                                        <Option value={user.id}>{user.name}</Option>))
                                    }
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                        ) : null
                      }
                    </Card>
                  ) : null
                }
                {
                  checkCategorys.indexOf(7) != -1 ? (//婚纱礼服
                    <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚纱礼服" bordered={false}>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="意向区域" >
                            {getFieldDecorator('dress_cityCode', {
                              rules: [{ required: true, message: "请选择意向区域", }],
                              initialValue: ''
                            })(
                              <AreaSelect areaSelectChange={this.dressCityAreaSelectChange} level3={true} />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                        <Col span={12}>
                          <FormItem label="使用方式">
                            {getFieldDecorator('dress_use_way', {
                              rules: [{ required: false, message: "请选择使用方式", }],
                              initialValue: ''

                            })(
                              <Radio.Group style={{ width: '100%' }}>
                                {
                                  configData.dressUseWay.map(dressUseWay => (
                                    <Radio value={dressUseWay.id}>{dressUseWay.name}</Radio>))
                                }
                              </Radio.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                        <Col span={12}>
                          <FormItem label="服饰类型">
                            {getFieldDecorator('dress_type', {
                              rules: [{ required: false, message: "请选择服饰类型", }],
                              initialValue: ''

                            })(
                              <Checkbox.Group style={{ width: '100%' }}>
                                {
                                  configData.dressType.map(dressType => (
                                    <Checkbox value={dressType.id}>{dressType.name}</Checkbox>))
                                }
                              </Checkbox.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                        <Col span={24}>
                          <FormItem label="礼服款式">
                            {getFieldDecorator('dress_model', {
                              rules: [{ required: false, message: "请选择礼服款式", }],
                              initialValue: ''

                            })(
                              <Checkbox.Group  >
                                {
                                  configData.dressModel.map(dressModel => (
                                    <Checkbox value={dressModel.id}>{dressModel.name}</Checkbox>))
                                }
                              </Checkbox.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="礼服数量">
                            {getFieldDecorator('dress_num', {
                              rules: [{ required: false, message: "请填写有效数量", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
                                return event.target.value.replace(/\D/g, '')
                              },
                              initialValue: ''

                            })(
                              <Input autoComplete="off" maxLength={6} style={{ width: '100%', }} suffix="套" placeholder="请填写礼服数量" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="婚服预算">
                            <NumberRangeInput myForm={form} minimumField='dress_budgetFrom' maximumField='dress_budgetEnd' />

                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="备注">
                            {getFieldDecorator('dress_remark')(
                              <TextArea maxLength={300} rows={3} placeholder="请输入备注信息" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      {
                        (CrmUtil.getCompanyType() == 1) ? (
                          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={12}>
                              <FormItem label="是否自动分配" > {getFieldDecorator('dress_needAutoDistribute', { rules: [{ required: false }], initialValue: true, valuePropName: 'checked' })(
                                <Switch size="default" defaultChecked={true} />)}
                              </FormItem>
                            </Col>
                          </Row>
                        ) : null
                      }
                      {
                        (CrmUtil.getCompanyType() == 2 && receiveUser.length > 0) ? (
                          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={12}>
                              <FormItem label="邀约人" >
                                {getFieldDecorator('dress_reqOwnerId', { rules: [{ required: false }], })(
                                  <Select placeholder="请选择指定邀约人" style={{ width: '100%', }} >
                                    {
                                      receiveUser.map(user => (
                                        <Option value={user.id}>{user.name}</Option>))
                                    }
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                        ) : null
                      }
                    </Card>
                  ) : null
                }
              </div>
            </Panel>
          </Collapse>
          <FormItem wrapperCol={{ span: 100, offset: 4 }} style={{ marginTop: 32 }}>
            <Button disabled={buttonDisabled} style={{ marginLeft: 50, width: 200 }} type="primary" htmlType="submit" onClick={(e) => { this.validateCtrl(e) }} loading={submitting}>提交客资信息 </Button>
          </FormItem>
        </Fragment >
      );
    } else {
      return (
        <Fragment >
          <FormItem wrapperCol={{ span: 100, offset: 4 }} style={{ marginTop: 32 }}>
            <Button disabled={buttonDisabled} style={{ marginLeft: 50, width: 200 }} type="primary" htmlType="submit" onClick={(e) => { this.validateCtrl(e) }} loading={submitting}>提交客资信息 </Button>
          </FormItem>
        </Fragment>)
    }
  }
}
// export default SellerCategory;
export default Form.create<FormComponentProps>()(SellerCategory);


