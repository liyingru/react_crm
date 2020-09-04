import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, Fragment, useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Radio,
  InputGroup,
  Spin
} from 'antd';

import { Dispatch } from 'redux';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import AreaSelect from '@/components/AreaSelect';
import { connect } from 'dva';
import { StateType } from './model';
import styles from './index.less';
import StoreList from './components/storeList';
import StoreDetails from './components/storeDetails';

const InputGroup = Input.Group;

const { RangePicker } = DatePicker;
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

const FormItem = Form.Item;
interface StoreDetailProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  storeDetailList: StateType;
}
interface currentState {
  tab: number;
  hotelObj: Object;
  photography: Object;
  travelPhoto: Object;
  celebration: Object;
  fullDress: Object;
  honeymoon: Object;
  data: Object;
  weddingConfig: Object;
  searchParams: Object;
  customerData: Object;
  resetArea: boolean;
  loading: boolean;
  detailLoading: boolean;
  cityInfo: string;
  travelFlag: boolean;

}
@connect(({ storeDetailList, loading }: { storeDetailList: StateType, loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['storeDetailList/initDataCtrl'],
  storeDetailList
}))
class StoreDetail extends Component<StoreDetailProps, currentState>{
  constructor(props: StoreDetailProps) {
    super(props);
    this.state = {
      tab: 1,
      hotelObj: {},
      photography: {},
      travelPhoto: {},
      celebration: {},
      fullDress: {},
      honeymoon: {},
      data: {},
      weddingConfig: {},
      searchParams: {},
      customerData: {},
      resetArea: false,
      loading: true,
      detailLoading: true,
      cityInfo: '',
      travelFlag: false
    }
  }

  componentDidMount() {
    const {
      location: {
        query: { customerId, reqId, cityInfo, category },
      },

    } = this.props;

    if (cityInfo) {
      this.setState({
        cityInfo: cityInfo
      })
    }

    if (category) {
      let categoryId = '';
      categoryId = parseInt(category);
      if (categoryId > 7) categoryId = '1';
      this.setState({
        tab: categoryId
      })
      this.initListCtrl(categoryId);
    }
    if (!category) {
      this.initListCtrl();
    }


    const obj = {};
    obj.customerId = customerId;
    obj.requirementId = reqId;

    const customerP = {};
    customerP.customerId = customerId;
    customerP.type = 2;

    const { dispatch } = this.props;
    dispatch({
      type: 'storeDetailList/configCtrl'
    })

    dispatch({
      type: 'storeDetailList/hotelConfig',
      payload: {},
      callback: this.hotelConfigCallback,
    });
    dispatch({
      type: 'storeDetailList/weddingConfig',
      payload: {},
      callback: this.weddingConfigCallback,
    });
    if (customerId) {
      dispatch({
        type: 'storeDetailList/customerDetail',
        payload: customerP,
        callback: this.customerDetailCtrl,
      });
    }
    if (reqId) {
      dispatch({
        type: 'storeDetailList/recommendCsDetailCtrl',
        payload: { reqId },
      });
    }

    dispatch({
      type: 'storeDetailList/queryCtrl',
      payload: {
        obj
      }
    });
    // 列表

  }
  // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /
  initListCtrl = (tab: number, params: Object, pagination: Object) => {
    const { dispatch, location: { query: { customerId, reqId }, } } = this.props;
    if (!tab) {
      tab = this.state.tab;
    }

    let firstParam = {
      'filter': params,
      category: tab,
      ...pagination,
      customerId: customerId ? customerId : '',
      reqId: reqId ? reqId : '',
    }

    dispatch({
      type: 'storeDetailList/newCategory',
      payload: firstParam,
    });
    this.setState({
      resetArea: false
    })
  }

  customerDetailCtrl = (data: Object) => {
    const res = data.data.result;
    this.setState({
      customerData: res
    });
  }

  hotelConfigCallback = (data: Object) => {
    const res = data.data.result;
    this.setState({
      data: res
    });
  }

  weddingConfigCallback = (data: Object) => {
    const res = data.data.result;
    this.setState({
      weddingConfig: res
    });
  }


  // / 列表组件->详情按钮点击
  gotoDetail = (id: any) => {
    // console.log('gotoDetail------bdvhdsbv' + id);
  }

  // / 列表组件->推荐按钮点击
  recommend = (id: any) => {
    // console.log('recommend' + id);
  }
  // 2020.3.20

  travelCtrl = (e: any) => {
    let flag = e == 0 ? false : true;
    this.setState({
      travelFlag: flag
    })
  }


  renderAdvancedForm() {
    const {
      location: {
        query: { customerId, reqId, category },
      },
      form: { getFieldDecorator },
    } = this.props;
    let categoryId = '';
    categoryId = category;
    // if(categoryId > '7')categoryId = '1';
    if (JSON.stringify(this.state.data) == "{}" || JSON.stringify(this.state.weddingConfig) == "{}") {
      return;
    }

    return (
      // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline">
          {this.state.tab == 1 ? (
            // 婚宴
            <div>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="酒店名称">{getFieldDecorator('name')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="价格范围">
                    <InputGroup compact style={{ width: '100%' }}>
                      {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', textAlign: 'center' }} />)}
                      <Input
                        style={{
                          width: '20%',
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                          color: '#4a4a4a'
                        }}
                        placeholder="到"
                        disabled
                      />
                      {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                    </InputGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="最大桌数">
                    {getFieldDecorator('desk')(
                      // <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      //   {
                      //     this.state.data.desk.map(item => (
                      //       <Option value={item.id} key={item.name}>{item.name}</Option>))
                      //   }
                      // </Select>
                      <InputNumber min={0} max={999999} style={{ width: '100%' }} placeholder="请输入桌数" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="酒店地址">{getFieldDecorator('address')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="中介姓名">{getFieldDecorator('agencyName')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="酒店类型">
                    {getFieldDecorator('type')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        {
                          this.state.data.type.map(item => (
                            <Option value={item.id}>{item.name}</Option>))
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="意向城市">
                    {getFieldDecorator('city', {
                      trigger: 'areaSelectChange',
                      getValueFromEvent: (...rest) => rest
                    })(
                      <AreaSelect reset={this.state.resetArea} level3 selectedCode={this.state.cityInfo} areaSelectChange={this.areaSelectChange} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="特色标签">
                    {getFieldDecorator('feature')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        {
                          this.state.data.feature.map(item => (
                            <Option value={item.id} key={item.name}>{item.name}</Option>))
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="星级标签">
                    {getFieldDecorator('star')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        {
                          this.state.data.star.map(item => (
                            <Option value={item.id} key={item.name}>{item.name}</Option>))
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                <Col span={8}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('created')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Option value={1}>三日内</Option>
                        <Option value={2}>一周内</Option>
                        <Option value={3}>一个月内</Option>
                        <Option value={4}>三个月内</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={8}>
                  <div style={{ display: 'flex' }}>
                    <Button style={{ flexGrow: 1, marginLeft: 90, borderColor: '#1791FF', color: '#1791FF' }} onClick={e => { this.restCtrl(e, 0) }}>
                      重置
                  </Button>
                    <Button style={{ flexGrow: 1, marginLeft: '20px' }} type="primary" onClick={e => { this.validateCtrl(e, 0) }}>
                      搜索
                  </Button>

                  </div>
                </Col>
              </Row>
            </div>
          ) : null}
          {this.state.tab == 2 ? (
            // 婚庆
            <div>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="商户名称">{getFieldDecorator('name')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="价格范围">
                    <InputGroup compact style={{ width: '100%' }}>
                      {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', textAlign: 'center' }} />)}
                      <Input
                        style={{
                          width: '20%',
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                          color: '#4a4a4a'
                        }}
                        placeholder="到"
                        disabled
                      />
                      {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                    </InputGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="意向城市">
                    {getFieldDecorator('city', {
                      trigger: 'areaSelectChange',
                      getValueFromEvent: (...rest) => rest
                    })(
                      <AreaSelect reset={this.state.resetArea} level3 selectedCode={this.state.cityInfo} areaSelectChange={this.areaSelectChange} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('created')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Option value={1}>三日内</Option>
                        <Option value={2}>一周内</Option>
                        <Option value={3}>一个月内</Option>
                        <Option value={4}>三个月内</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ marginTop: 3.5 }} >
                  <Button type="primary" onClick={e => { this.validateCtrl(e, 3) }}>
                    搜索
                  </Button>
                  <Button style={{ marginLeft: 6 }} onClick={e => { this.restCtrl(e, 3) }}>
                    重置
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}
          {this.state.tab == 3 ? (
            // 婚纱摄影
            <div>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="商户名称">{getFieldDecorator('name')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="商户特色">
                    {getFieldDecorator('feature')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        {
                          this.state.weddingConfig.feature.map(item => (
                            <Option value={item.id} key={item.name}>{item.name}</Option>))
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="价格范围">
                    <InputGroup compact style={{ width: '100%' }}>
                      {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', textAlign: 'center' }} />)}
                      <Input
                        style={{
                          width: '20%',
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                          color: '#4a4a4a'
                        }}
                        placeholder="到"
                        disabled
                      />
                      {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                    </InputGroup>
                  </FormItem>
                </Col>

              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="意向城市">
                    {getFieldDecorator('city', {
                      trigger: 'areaSelectChange',
                      getValueFromEvent: (...rest) => rest
                    })(
                      <AreaSelect reset={this.state.resetArea} level3 selectedCode={this.state.cityInfo} areaSelectChange={this.areaSelectChange} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('created')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Option value={1}>三日内</Option>
                        <Option value={2}>一周内</Option>
                        <Option value={3}>一个月内</Option>
                        <Option value={4}>三个月内</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="是否旅拍">
                    {getFieldDecorator('travel')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear onChange={this.travelCtrl}>
                        <Option value={0}>否</Option>
                        <Option value={1}>是</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  {this.state.travelFlag ? (
                    <FormItem label="旅拍城市">
                      {getFieldDecorator('travelCity')(
                        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                          {
                            this.state.weddingConfig.travel.map(item => (
                              <Option value={item.id} key={item.name}>{item.name}</Option>))
                          }
                        </Select>,
                      )}
                    </FormItem>
                  )
                    : null}

                </Col>

                <Col span={8} offset={8}>
                  <div style={{ display: 'flex' }}>
                    <Button style={{ flexGrow: 1, marginLeft: 90, borderColor: '#1791FF', color: '#1791FF' }} onClick={e => { this.restCtrl(e, 1) }}>
                      重置
                  </Button>
                    <Button style={{ flexGrow: 1, marginLeft: '20px' }} type="primary" onClick={e => { this.validateCtrl(e, 1) }}>
                      搜索
                  </Button>

                  </div>
                </Col>


              </Row>
            </div>
          ) : null}
          {this.state.tab == 4 ? (
            // 庆典or喜宴
            <div>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="商户名称">{getFieldDecorator('name')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="价格范围">
                    <InputGroup compact style={{ width: '100%' }}>
                      {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', textAlign: 'center' }} />)}
                      <Input
                        style={{
                          width: '20%',
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                          color: '#4a4a4a'
                        }}
                        placeholder="到"
                        disabled
                      />
                      {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                    </InputGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="意向城市">
                    {getFieldDecorator('city', {
                      trigger: 'areaSelectChange',
                      getValueFromEvent: (...rest) => rest
                    })(
                      <AreaSelect reset={this.state.resetArea} level3 selectedCode={this.state.cityInfo} areaSelectChange={this.areaSelectChange} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('created')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Option value={1}>三日内</Option>
                        <Option value={2}>一周内</Option>
                        <Option value={3}>一个月内</Option>
                        <Option value={4}>三个月内</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ marginTop: 3.5 }} >
                  <Button type="primary" onClick={e => { this.validateCtrl(e, 2) }}>
                    搜索
                  </Button>
                  <Button style={{ marginLeft: 6 }} onClick={e => { this.restCtrl(e, 2) }}>
                    重置
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}
          {this.state.tab == 5 ? (
            // 婚车
            <div>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="商户名称">{getFieldDecorator('name')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="价格范围">
                    <InputGroup compact style={{ width: '100%' }}>
                      {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', textAlign: 'center' }} />)}
                      <Input
                        style={{
                          width: '20%',
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                          color: '#4a4a4a'
                        }}
                        placeholder="到"
                        disabled
                      />
                      {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                    </InputGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="意向城市">
                    {getFieldDecorator('city', {
                      trigger: 'areaSelectChange',
                      getValueFromEvent: (...rest) => rest
                    })(
                      <AreaSelect reset={this.state.resetArea} level3 selectedCode={this.state.cityInfo} areaSelectChange={this.areaSelectChange} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('created')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Option value={1}>三日内</Option>
                        <Option value={2}>一周内</Option>
                        <Option value={3}>一个月内</Option>
                        <Option value={4}>三个月内</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ marginTop: 3.5 }} >
                  <Button type="primary" onClick={e => { this.validateCtrl(e, 4) }}>
                    搜索
                  </Button>
                  <Button style={{ marginLeft: 6 }} onClick={e => { this.restCtrl(e, 4) }}>
                    重置
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}
          {this.state.tab == 6 ? (
            // 一站式
            <div>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="商户名称">{getFieldDecorator('name')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="价格范围">
                    <InputGroup compact style={{ width: '100%' }}>
                      {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', textAlign: 'center' }} />)}
                      <Input
                        style={{
                          width: '20%',
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                          color: '#4a4a4a'
                        }}
                        placeholder="到"
                        disabled
                      />
                      {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                    </InputGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="意向城市">
                    {getFieldDecorator('city', {
                      trigger: 'areaSelectChange',
                      getValueFromEvent: (...rest) => rest
                    })(
                      <AreaSelect reset={this.state.resetArea} level3 selectedCode={this.state.cityInfo} areaSelectChange={this.areaSelectChange} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('created')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Option value={1}>三日内</Option>
                        <Option value={2}>一周内</Option>
                        <Option value={3}>一个月内</Option>
                        <Option value={4}>三个月内</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ marginTop: 3.5 }} >
                  <Button type="primary" onClick={e => { this.validateCtrl(e, 5) }}>
                    搜索
                  </Button>
                  <Button style={{ marginLeft: 6 }} onClick={e => { this.restCtrl(e, 5) }}>
                    重置
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}
          {this.state.tab == 7 ? (
            // 婚纱礼服
            <div>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="商户名称">{getFieldDecorator('name')(<Input style={{ width: '100%', }} />)}</FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="价格范围">
                    <InputGroup compact style={{ width: '100%' }}>
                      {getFieldDecorator('payStart')(<InputNumber min={0} placeholder="最小值" style={{ width: '40%', textAlign: 'center' }} />)}
                      <Input
                        style={{
                          width: '20%',
                          borderLeft: 0,
                          pointerEvents: 'none',
                          backgroundColor: '#fff',
                          color: '#4a4a4a'
                        }}
                        placeholder="到"
                        disabled
                      />
                      {getFieldDecorator('payEnd')(<InputNumber placeholder="最大值" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                    </InputGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="意向城市">
                    {getFieldDecorator('city', {
                      trigger: 'areaSelectChange',
                      getValueFromEvent: (...rest) => rest
                    })(
                      <AreaSelect reset={this.state.resetArea} level3 selectedCode={this.state.cityInfo} areaSelectChange={this.areaSelectChange} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('created')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Option value={1}>三日内</Option>
                        <Option value={2}>一周内</Option>
                        <Option value={3}>一个月内</Option>
                        <Option value={4}>三个月内</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ marginTop: 3.5 }} >
                  <Button type="primary" onClick={e => { this.validateCtrl(e, 5) }}>
                    搜索
                  </Button>
                  <Button style={{ marginLeft: 6 }} onClick={e => { this.restCtrl(e, 5) }}>
                    重置
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}
        </Form>
      </div>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  handleStoreTab = (e: any) => {
    const value = parseInt(e.target.value);
    const { dispatch } = this.props;
    this.setState({
      tab: value,
      resetArea: false,
      cityInfo: ''
    })
    dispatch({
      type: 'storeDetailList/resetDetailEmpty',
      payload: this.state.tab,
    });
    this.restCtrl(e, value);
  }

  restCtrl = (e, num: Number) => {
    const { form, dispatch } = this.props;
    // 表单重置
    form.resetFields();
    let obj;
    if (num == 1) {
      obj = {
        "name": "", "payStart": "", "payEnd": "", "desk": "", "address": "", "agencyName": "", "type": "", "city": "", "feature": "", "star": "", "created": "", "region": ""
      }
    } else if (num == 2) {
      obj = {
        "name": "", "payStart": "", "payEnd": "", "city": "", "region": "", "created": "",
      }
    } else if (num == 3) {
      obj = {
        "name": "", "payStart": "", "features": "", "payEnd": "", "city": "", "region": "", "created": "",
      }
    } else if (num == 4) {
      obj = {
        "name": "", "payStart": "", "payEnd": "", "city": "", "region": "", "created": "",
      }
    } else if (num == 5) {
      obj = {
        "name": "", "payStart": "", "payEnd": "", "city": "", "region": "", "created": "",
      }
    } else {
      obj = {
        "name": "", "payStart": "", "payEnd": "", "city": "", "region": "", "created": "",
      }
    }
    // dispatch({
    //   type: 'trailHighSeasTableList/fetch',
    //   payload: {},
    // });
    this.setState({
      searchParams: obj,
      cityInfo: '',
      resetArea: true,

    }, () => {
      this.initListCtrl(this.state.tab, obj);//更新列表
    });


  }

  areaSelectChange = (code: string, province: string, city: string, district: string) => {

    const {
      location: {
        query: { customerId, reqId, cityInfo, category },
      },

    } = this.props;
    const obj = {};
    if (cityInfo) {
      // console.log('province======',city.substring(0, city - 1))
      if (province == '北京市' || province == '天津市' || province == '上海市' || province == '重庆市') {
        obj.region = city == '市辖区' ? '' : city;
        obj.city = province.substring(0, province.length - 1);
      } else {
        obj.region = district == undefined ? '' : district == '市辖区' ? '' : district;
        obj.city = city.substring(0, city.length - 1);
      }
      this.setState({
        searchParams: obj,
      });
    } else {
      this.setState({
        province,
        city,
        district,
      });
    }

  };

  validateCtrl = (e, num: Number) => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (values.city) {
          if (values.city[1] == '北京市' || values.city[1] == '天津市' || values.city[1] == '上海市' || values.city[1] == '重庆市') {
            values.region = values.city[2] == '市辖区' ? '' : values.city[2];
          } else {
            values.region = values.city[values.city.length - 1] == undefined ? '' : values.city[values.city.length - 1] == '市辖区' ? '' : values.city[values.city.length - 1];
          }

          values.city = values.city[values.city.length - 1] == undefined ? values.city[1] : values.city[2];
          values.city = values.city.substring(0, values.city.length - 1);

        } else {
          values.region = '';
          values.city = '';
        }
        const valuesResult = {
          ...values,
        }

        for (const i in valuesResult) {
          if (valuesResult[i] == undefined) {
            valuesResult[i] = '';
          }
        }
        if (valuesResult.page) {
          valuesResult.page = 1;
        }

        this.setState({
          searchParams: valuesResult,
          // resetArea:true
        });
        this.initListCtrl(this.state.tab, valuesResult);//更新列表
        // 搜索清空详情
        dispatch({
          type: 'storeDetailList/resetDetailEmpty',
          payload: this.state.tab,
        });
      }
    });
  }

  render() {
    const {
      location: {
        query: { customerId, reqId, category },
      },
      storeDetailList: { detailObj, config, detailLoading },
    } = this.props;
    let categoryId = '';
    let categoryDis = '';
    categoryId = category;
    categoryDis = category?.toString();
    console.log(categoryDis);
    if (categoryDis) {
      let categoryDisArray = categoryDis.split(',');
      categoryDisArray.map((item1) => {
        config.category.map((item2) => {
          if (item1 == item2.id) {
            item2.disable = false;
          } else {
            item2.disable = true;
          }
        })
      })

    }



    if (parseInt(categoryId) > 7) categoryId = '1';
    // console.log('categoryId========',categoryId)
    return (
      <PageHeaderWrapper>
        {/* <Spin spinning={this.state.loading}> */}
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={24}>
            <Card>
              <div className={styles.tabMenu}>
                <Radio.Group defaultValue={categoryId ? parseInt(categoryId) : parseInt("1")} buttonStyle="solid" onChange={e => { this.handleStoreTab(e) }}>
                  {config.category && config.category.map(item => {
                    // if(item.name == '婚纱礼服'){
                    //   return ''
                    // }
                    return <Radio.Button disabled={!item.disable ? false : item.disable} value={item.id}>{item.name}</Radio.Button>

                  })}
                </Radio.Group>
                <div className={styles.tableListForm} style={{ marginTop: 20 }}>{this.renderForm()}</div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={12}>
            <div>
              <StoreList tab={this.state.tab}
                searchParams={this.state.searchParams}
                gotoDetail={this.gotoDetail}
                recommend={this.recommend}
                loading={this.state.loading}
                customerData={this.state.customerData}
                customerId={customerId}
                requirementId={reqId}
                categoryId={parseInt(categoryId)}
              />
            </div>
          </Col>

          <Col span={12}>
            <div style={{ display: JSON.stringify(detailObj) === "{}" ? 'none' : 'block' }}>
              <Spin spinning={detailLoading} size="large">
                <StoreDetails tab={this.state.tab} detailsId={detailObj.merchantId} categoryId={categoryId} />
              </Spin>
            </div>
          </Col>

        </Row>
        {/* </Spin> */}
      </PageHeaderWrapper>

    )
  }


}

export default Form.create<StoreDetailProps>()(StoreDetail);
