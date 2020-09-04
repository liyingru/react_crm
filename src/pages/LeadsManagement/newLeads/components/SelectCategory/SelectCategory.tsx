
import { Button, Modal, Form, Input, Radio, Checkbox, DatePicker, Select, Radio, Card, Col, Row, Collapse, Switch, Spin } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from '../category.less';
import { FormComponentProps } from 'antd/es/form';
import { isBlock } from '@babel/types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import NumericInput from '@/components/NumericInput';
import AreaSelect from '@/components/AreaSelect';
import NumberRangeInput from '@/components/NumberRangeInput';
import CrmUtil from '@/utils/UserInfoStorage';
import TextArea from 'antd/lib/input/TextArea';
import { CarJsonInfoState } from '../../data';
import { PlusOutlined } from '@ant-design/icons';
import WeddingCarSelector, { CarBrandInfo } from '@/components/WeddingCarSelector';
import { ConfigCommon } from '@/commondata';
const { Option } = Select;
const { Panel } = Collapse;

function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')));
}

interface categoryProps extends FormComponentProps {
  configData: ConfigCommon;
  setCarBrandList: (carBrandList: CarBrandInfo[]) => void;
  visible: boolean;
}

interface pageState {
  selectedCars: CarBrandInfo[]
}

class SelectCategory extends React.Component<categoryProps, pageState> {

  state: pageState = {
    selectedCars: []
  }

  getChildrenForCategory = (value) => {
    const { configData, } = this.props;
    var arry
    configData.category2 && configData.category2.forEach(category => {
      if (value == category.value) {
        if (category.children && category.children.length > 0) {
          arry = category.children
        }
      }
    });
    return arry
  }


  render() {
    const { checkCategory, submitting, visible, configData, getFieldDecorator, parentMethods, receiveUser, is_invite } = this.props;
    const { banquetCityAreaSelectChange, weddingCityAreaSelectChange,
      photographyCityAreaSelectChange, celebrationCityAreaSelectChange,
      carCityAreaSelectChange, oneStopCityAreaSelectChange, dressCityAreaSelectChange, form } = this.props

    if (visible && checkCategory) {
      return (
        <Fragment>
          <Collapse defaultActiveKey={['1']} style={{ marginLeft: 20, marginRight: 20 }}>
            <Panel header="品类信息" key="1">
              <div className={styles.tableListForm}>
                {checkCategory == '1' ? (//婚宴
                  <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚宴" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="意向区域" >
                          {getFieldDecorator('banquet_cityCode', {
                            rules: [{ required: true, message: "请选择意向区域", }],
                            initialValue: ''
                          })(
                            <AreaSelect areaSelectChange={banquetCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 2) ?
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="返佣">
                              {getFieldDecorator('banquet_commission', {
                                initialValue: ''
                              })(
                                <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                              )}
                            </FormItem>
                          </Col>
                        </Row> : undefined
                    }
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
                        <FormItem label="预定酒店">
                          {getFieldDecorator('hotel', {
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
                      (CrmUtil.getCompanyType() != 1 && is_invite == '1' && receiveUser.length > 0) ? (
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
                {checkCategory == '2' ? (//婚庆
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
                            <AreaSelect areaSelectChange={weddingCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 2) ?
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="返佣">
                              {getFieldDecorator('wedding_commission', {

                                initialValue: ''
                              })(
                                <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                              )}
                            </FormItem>
                          </Col>
                        </Row> : undefined
                    }
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
                          {getFieldDecorator('hotel', {
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
                      (CrmUtil.getCompanyType() !== 1 && is_invite == '1' && receiveUser.length > 0) ? (
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

                {checkCategory == '3' ? (//婚纱摄影
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
                            <AreaSelect areaSelectChange={photographyCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 2) ?
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="返佣">
                              {getFieldDecorator('photography_commission', {

                                initialValue: ''
                              })(
                                <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                              )}
                            </FormItem>
                          </Col>
                        </Row> : undefined
                    }
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
                      (CrmUtil.getCompanyType() != 1 && is_invite == '1' && receiveUser.length > 0) ? (
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
                {checkCategory == '4' ? (//庆典or喜宴
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
                            <AreaSelect areaSelectChange={celebrationCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 2) ?
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="返佣">
                              {getFieldDecorator('celebration_commission', {

                                initialValue: ''
                              })(
                                <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                              )}
                            </FormItem>
                          </Col>
                        </Row> : undefined
                    }
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
                          {getFieldDecorator('hotel', {
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
                      (CrmUtil.getCompanyType() != 1 && is_invite == '1' && receiveUser.length > 0) ? (
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
                {checkCategory == '5' ? (//婚车
                  <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚车" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="意向区域" >
                          {getFieldDecorator('car_cityCode', {
                            rules: [{ required: true, message: "请选择意向区域", }],
                            initialValue: ''
                          })(
                            <AreaSelect areaSelectChange={carCityAreaSelectChange} level3={true} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    {
                      (CrmUtil.getCompanyType() == 2) ?
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                          <Col span={12}>
                            <FormItem label="返佣">
                              {getFieldDecorator('car_commission', {

                                initialValue: ''
                              })(
                                <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                              )}
                            </FormItem>
                          </Col>
                        </Row> : undefined
                    }
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
                        <WeddingCarSelector
                          carBrandConfig={configData.carBrand}
                          setCarBrandList={(cars) => {
                            this.setState({ selectedCars: cars });
                            this.props.setCarBrandList(cars);
                          }}
                          selectedCarBrands={this.state.selectedCars}
                        />
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
                      (CrmUtil.getCompanyType() != 1 && is_invite == '1' && receiveUser.length > 0) ? (
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
                  </Card>
                ) : null
                }
                {
                  checkCategory == '6' ? (//一站式
                    <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="一站式" bordered={false}>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="意向区域" >
                            {getFieldDecorator('oneStop_cityCode', {
                              rules: [{ required: true, message: "请选择意向区域", }],
                              initialValue: ''
                            })(
                              <AreaSelect areaSelectChange={oneStopCityAreaSelectChange} level3={true} />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      {
                        (CrmUtil.getCompanyType() == 2) ?
                          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={12}>
                              <FormItem label="返佣">
                                {getFieldDecorator('oneStop_commission', {

                                  initialValue: ''
                                })(
                                  <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                                )}
                              </FormItem>
                            </Col>
                          </Row> : undefined
                      }
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
                        (CrmUtil.getCompanyType() != 1 && is_invite == '1' && receiveUser.length > 0) ? (
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
                  checkCategory == '7' ? (//婚纱礼服
                    <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚纱礼服" bordered={false}>
                      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col span={12}>
                          <FormItem label="意向区域" >
                            {getFieldDecorator('dress_cityCode', {
                              rules: [{ required: true, message: "请选择意向区域", }],
                              initialValue: ''
                            })(
                              <AreaSelect areaSelectChange={dressCityAreaSelectChange} level3={true} />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      {
                        (CrmUtil.getCompanyType() == 2) ?
                          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col span={12}>
                              <FormItem label="返佣">
                                {getFieldDecorator('dress_commission', {

                                  initialValue: ''
                                })(
                                  <Input style={{ width: '100%', }} placeholder="请输入返佣" />
                                )}
                              </FormItem>
                            </Col>
                          </Row> : undefined
                      }
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
                        (CrmUtil.getCompanyType() != 1 && is_invite == '1' && receiveUser.length > 0) ? (
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
        </Fragment >
      );
    } else {
      return (
        <Fragment />)
    }
  }
}
// export default SellerCategory;
export default Form.create<FormComponentProps>()(SelectCategory);
