import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Spin, message, Modal, Drawer } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model"
import StoreDetailsContactList from '../storeDetailsContactList'
import StoreDetailsPreferential from '../storeDetailsPreferential'
import StoreDetailSeriesInfo from '../storeDetailsSeriesInfo';
import StoreDetailHotelMenu from '../storeDetailsHotelMenu';
import StoreDetailBanquetingHall from '../storeDetailsBanquetingHall';
import CrmMap from '@/components/CrmMap';


// （婚宴 和 庆典or喜宴 用的同一个详情组件 ）有菜单 和 宴会厅 而且是 同一个接口
class HotelInfoView extends Component {
  affixRef: any;

  constructor(props: Readonly<{}>) {
    super(props);
    this.affixRef = React.createRef();
    this.state = {
      childTab: 1,
      modalVisible: false,
      long: '',
      lat: ''
    }
  }

  componentDidMount() {
    window.addEventListener(
      "scroll",
      this.bindHandleScroll,
      true
    );
  }
  getGoodRequest(tab: number, detailsId: string) {

  }
  tabCtrl = (e: any, detailsId, tab) => {
    let childTab = parseInt(e);
    const { dispatch } = this.props;
    let params = {};
    params.storeId = detailsId;
    params.category = tab;
    if (!detailsId) { return }
    switch (childTab) {
      case 2:
        params.type = '';
        dispatch({
          type: 'storeDetailList/storeGoodCtrl',
          payload: params
        });
        break;
      case 3:
        params.type = 1;
        dispatch({
          type: 'storeDetailList/storeGoodCtrl',
          payload: params
        })
        break;
      default:
        break;
    }




  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }

  bindHandleScroll = () => {
    try {
      this.affixRef.current.updatePosition();
    } catch {

    }
  }
  // 查看地图
  lookMapCtrl = (long: any, lat: any, category: any, hotleName: any) => {
    this.setState({
      modalVisible: true,
      long: long,
      lat: lat,
      category: category,
      hotleName: hotleName
    });
  }
  handleAddContactModalOk = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 关闭地图浮层
  handleAddContactModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  render() {

    const { hotelDetailModel: { base }, tab, detailsId, detailLoading } = this.props;
    const { hotelDetailModel: { service } } = this.props;
    const { TabPane } = Tabs;
    let tags = []
    if (base) {
      tags = base.feature ? base.feature.split(',') : [];
    }
    return (
      <Affix className={styles.contentViewStyle} ref={this.affixRef}>
        <Card style={{ width: '100%' }}>
          <div className={styles.content}>
            <div className={styles.titleStyle}>
              {base && base.name}({base && base.city_name}-{base && base.region_name})
                    </div>
            <Tabs type="card" onChange={(e) => this.tabCtrl(e, detailsId, tab)}>
              <TabPane tab="基本信息" key="1">
                <div className={styles.detailCon}>
                  <div className={styles.spanHeaderStyle}>
                    <span className={styles.titleCon}>基本信息</span>
                  </div>
                  <section style={{ marginTop: 10 }}>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>所在城市：</b>{base && base.city_name}</Col>
                          <Col span={12}><b>行政区域：</b>{base && base.region_name}</Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col span={12}><b>酒店类型：</b>{base && base.type}</Col>
                          <Col span={12}><b>星级标签：</b>{base && base.star}</Col>
                        </Row>
                      </li>
                      <li>
                        <b>酒店地址：</b>{base && base.address} &nbsp;
                        {base && base.address ? (<span onClick={() => { this.lookMapCtrl(base.longitude, base.latitude, base.category, base.biz_name) }} style={{ color: '#2d8642', cursor: 'pointer' }}>查看地图&gt;</span>) : ''}

                      </li>
                      <li>
                        <b>特色标签：</b>
                        {tags && tags.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>价格范围：</b>{base && base.price}
                      </li>
                      <li>
                        <b>桌数范围：</b>{base && base.desk}
                      </li>
                      <li>
                        <b>推荐等级：</b>{base && base.level}
                      </li>
                      <li>
                        <b>商户名称：</b>{base && base.biz_name}
                      </li>
                      <li>
                        <b>酒店简介：</b>{base && base.desc && base.desc.desc}
                      </li>
                      <li>
                        <b>详细简介：</b>{base && base.desc && base.desc.comment}
                      </li>
                      <li>
                        <b>酒店备注：</b>{base && base.desc && base.desc.remark}
                      </li>
                      <li>
                        <b>买点介绍：</b>{base && base.desc && base.desc.feature}
                      </li>
                      <li>
                        <b>其他信息：</b>{base && base && base.other}
                      </li>
                      <li>
                        <b>客服备注：</b>{base && base && base.kefu_remark}
                      </li>
                    </ul>
                  </section>
                  <div className={styles.spanHeaderStyle} style={{ marginTop: 10 }}>
                    <span className={styles.titleCon}>服务描述</span>
                  </div>
                  <section style={{ marginTop: 10 }}>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>地铁：</b>{base && base.service && base.service.subway}</Col>
                          <Col span={12}><b>公交：</b>{base && base.service && base.service.bus}</Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col span={12}><b>停车：</b>{base && base.service && base.service.parking_flag == 1 ? '有' : ''}</Col>
                          <Col span={12}><b>草坪：</b>{base && base.service && base.service.turf_flag == 1 ? '有' : ''}</Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col span={12}><b>化妆间：</b>{base && base.service && base.service.dressing_room_flag == 1 ? '有' : ''}</Col>
                          <Col span={12}><b>婚房：</b>{base && base.service && base.service.marriage_room_flag == 1 ? '有' : ''}</Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col span={12}><b>进场费：</b>{base && base.service && base.service.entry_fee_flag == 1 ? '有' : ''}</Col>
                          <Col span={12}><b>开瓶费：</b>{base && base.service && base.service.open_fee_flag == 1 ? '有' : ''}</Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col span={12}><b>教堂：</b>{base && base.service && base.service.church_flag == 1 ? '有' : ''}</Col>
                          <Col span={12}><b>服务费：</b>{base && base.service && base.service.service_fee_flag == 1 ? '有' : ''}</Col>
                        </Row>
                      </li>
                    </ul>
                  </section>
                </div>
              </TabPane>
              <TabPane tab="宴会厅" key="2">
                <StoreDetailBanquetingHall detailsId={detailsId} nameKey={2} tab={tab} />
              </TabPane>
              <TabPane tab="菜单" key="3">
                <StoreDetailHotelMenu detailsId={detailsId} nameKey={3} tab={tab} />
              </TabPane>
              <TabPane tab="联系人" key="4">
                <StoreDetailsContactList detailsId={detailsId} tab={tab} />
              </TabPane>
              <TabPane tab="酒店活动" key="5">
                <StoreDetailsPreferential detailsId={detailsId} tab={tab} />
              </TabPane>
            </Tabs>

          </div>
        </Card>
        <Drawer
          width="90%"
          placement="right"
          closable={true}
          onClose={this.handleAddContactModalOk}
          visible={this.state.modalVisible}
        >
          <CrmMap
            long={this.state.long}
            lat={this.state.lat}
            category={this.state.category}
            hotleName={this.state.hotleName}
            visible={this.state.modalVisible}
          />
        </Drawer>

      </Affix>
    );
  }
}
// 婚纱摄影 有套系
class WeddingPhoto extends Component {
  affixRef: any;
  constructor(props: Readonly<{}>) {
    super(props);
    this.affixRef = React.createRef();
    this.state = {
      modalVisible: false,
      long: '',
      lat: '',
    }
  }
  // 查看地图
  lookMapCtrl = (long: any, lat: any, category: any, hotleName: any) => {
    this.setState({
      modalVisible: true,
      long: long,
      lat: lat,
      category: category,
      hotleName: hotleName
    });
  }
  handleAddContactModalOk = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 关闭地图浮层
  handleAddContactModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  componentDidMount() {
    window.addEventListener(
      "scroll",
      this.bindHandleScroll,
      true
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }


  bindHandleScroll = () => {
    try {
      this.affixRef.current.updatePosition();
    } catch {

    }
  }

  render() {

    const { weddingPhotoModel: { base }, tab, detailsId } = this.props;
    const { TabPane } = Tabs
    let features = []
    let promise = []
    if (base) {
      features = base.features ? base.features.split(',') : [];
      promise = base.promise ? base.promise.split(',') : [];
    }

    return (
      <Affix className={styles.contentViewStyle} ref={this.affixRef}>
        <Card style={{ width: '100%' }}>
          <div className={styles.content}>
            <div className={styles.titleStyle}>
              {base && base.name}({base && base.city_name}-{base && base.region_name})
                    </div>

            <Tabs type="card">
              <TabPane tab="基本信息" key="1">
                <div className={styles.detailCon}>
                  <div className={styles.spanHeaderStyle}>
                    <span className={styles.titleCon}>基本信息</span>
                  </div>
                  <section style={{ marginTop: 10 }}>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>所在城市：</b>{base && base.city_name}</Col>
                          <Col span={12}><b>营业时间：</b>{base && base.time_open}</Col>
                        </Row>
                      </li>
                      <li>
                        <b>特色标签：</b>
                        {features && features.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>服务承诺：</b>
                        {promise && promise.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>总店地址：</b>{base && base.address}
                        &nbsp;
                        {base && base.address ? (<span onClick={() => { this.lookMapCtrl(base.geohash[1], base.geohash[0], base.category, base.name) }} style={{ color: '#2d8642', cursor: 'pointer' }}>查看地图&gt;</span>) : ''}

                      </li>
                      <li>
                        <b>商户简介：</b>
                        <div className={styles.wrap} dangerouslySetInnerHTML={{ __html: base && base.comment }}>
                        </div>
                      </li>
                    </ul>
                  </section>
                </div>
              </TabPane>

              <TabPane tab="套系" key="2" >
                <StoreDetailSeriesInfo key="2" detailsId={detailsId} tab={tab} />
              </TabPane>
              <TabPane tab="商户活动" key="3">
                <StoreDetailsPreferential detailsId={detailsId} tab={tab} />

              </TabPane>
              <TabPane tab="联系人" key="4">
                <StoreDetailsContactList detailsId={detailsId} tab={tab} />

              </TabPane>
            </Tabs>


          </div>
        </Card>
        <Drawer
          width="90%"
          placement="right"
          closable={true}
          onClose={this.handleAddContactModalOk}
          visible={this.state.modalVisible}
        >
          <CrmMap
            long={this.state.long}
            lat={this.state.lat}
            category={this.state.category}
            hotleName={this.state.hotleName}
            visible={this.state.modalVisible}
          />
        </Drawer>
      </Affix>
    );

  }
}
// 婚庆 有套系
class WeddingService extends Component {
  affixRef: any;
  constructor(props: Readonly<{}>) {
    super(props);
    this.affixRef = React.createRef();
    this.state = {
      modalVisible: false,
      long: '',
      lat: '',
    }
  }

  componentDidMount() {
    window.addEventListener(
      "scroll",
      this.bindHandleScroll,
      true
    );
  }
  // 查看地图
  lookMapCtrl = (long: any, lat: any, category: any, hotleName: any) => {
    this.setState({
      modalVisible: true,
      long: long,
      lat: lat,
      category: category,
      hotleName: hotleName
    });
  }
  handleAddContactModalOk = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 关闭地图浮层
  handleAddContactModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }


  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }

  bindHandleScroll = () => {
    try {
      this.affixRef.current.updatePosition();
    } catch {

    }
  }

  render() {

    const { weddingServiceModel: { base }, tab, detailsId } = this.props;
    const { TabPane } = Tabs;
    let styleTags = [];
    let features = [];
    let hotel = [];
    let branches = [];

    if (base) {
      styleTags = base.style_tag ? base.style_tag.split(',') : [];
      features = base.feature ? base.feature.split(',') : [];
      hotel = base.hotel ? base.hotel : [];
      branches = base.branches ? base.branches : [];
    }
    // console.log('weddingServiceModel',base)

    // console.log('!!weddingServiceModel',!!weddingServiceModel)



    return (
      <Affix className={styles.contentViewStyle} ref={this.affixRef}>
        <Card style={{ width: '100%' }}>
          <div className={styles.content}>
            <div className={styles.titleStyle}>
              {base && base.name}({base && base.city_name}-{base && base.region_name})
                    </div>

            <Tabs type="card">
              <TabPane tab="基本信息" key="1">
                <div className={styles.detailCon}>
                  <div className={styles.spanHeaderStyle}>
                    <span className={styles.titleCon}>基本信息</span>
                  </div>
                  <section>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>所在城市：</b>{base && base?.city_name}</Col>
                          <Col span={12}><b>行政区域：</b>{base && base?.region_name}</Col>
                        </Row>
                      </li>
                      <li>
                        <b>合作类型：</b>{base && base.cooperation_flag}
                      </li>
                      <li>
                        <b>推荐类型：</b>{base && base.recommend_flag}
                      </li>
                      <li>
                        <b>婚庆地址：</b>{base && base.address}
                        &nbsp;
                        {base && base.address ? (<span onClick={() => { this.lookMapCtrl(base.longitude, base.latitude, base.category, base.name) }} style={{ color: '#2d8642', cursor: 'pointer' }}>查看地图&gt;</span>) : ''}
                      </li>
                      <li>
                        <b>分店地址：</b>
                        {branches && !!branches.map((item) => {
                          return (
                            <span key={item}>
                              {item.name}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>风格标签：</b>
                        {styleTags && styleTags.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>价格范围：</b>{base && base.show_price}
                      </li>
                      <li>
                        <b>一句话卖点：</b>{base && base.biz_selling_point}
                      </li>
                      <li>
                        <b>详情介绍：</b>
                        <div className={styles.wrap} dangerouslySetInnerHTML={{ __html: base && base.description }}>
                        </div>
                      </li>
                      <li>
                        <b>其他信息：</b>{base && base.other}
                      </li>
                      <li>
                        <b>约定推荐金额：</b>{base && base.recommend_fee}
                      </li>
                      <li>
                        <b>商户特色：</b>
                        {features && features.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>绑定酒店：</b>
                        {hotel && hotel.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item.name}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>客服备注：</b>{base && base.kefu_remark}
                      </li>
                    </ul>
                  </section>
                </div>
              </TabPane>

              <TabPane tab="套系" key="2">
                <StoreDetailSeriesInfo key="2" detailsId={detailsId} tab={tab} />
              </TabPane>
              <TabPane tab="优惠活动" key="3">
                <StoreDetailsPreferential detailsId={detailsId} tab={tab} />

              </TabPane>
              <TabPane tab="联系人" key="4">
                <StoreDetailsContactList detailsId={detailsId} tab={tab} />

              </TabPane>
            </Tabs>


          </div >
        </Card>
        <Drawer
          width="90%"
          placement="right"
          closable={true}
          onClose={this.handleAddContactModalOk}
          visible={this.state.modalVisible}
        >
          <CrmMap
            long={this.state.long}
            lat={this.state.lat}
            category={this.state.category}
            hotleName={this.state.hotleName}
            visible={this.state.modalVisible}
          />
        </Drawer>

      </Affix>
    );

  }
}

class JourneyPhoto extends Component {
  affixRef: any;
  constructor(props: Readonly<{}>) {
    super(props);
    this.affixRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener(
      "scroll",
      this.bindHandleScroll,
      true
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }

  bindHandleScroll = () => {
    try {
      this.affixRef.current.updatePosition();
    } catch {

    }
  }

  render() {

    const { journeyPhotoModel } = this.props;
    const { journeyPhotoModel: { base }, tab, detailsId } = this.props;
    const { TabPane } = Tabs;
    let features = []
    if (base) {
      features = base.feature ? base.feature.split(',') : [];
    }

    //.log(journeyPhotoModel,'------88888888888')

    return (
      <Affix className={styles.contentViewStyle} ref={this.affixRef}>
        <Card style={{ width: '100%' }}>
          <div className={styles.content}>
            <div className={styles.titleStyle}>
              {base && base.name}({base && base.city_name}-{base && base.region_name})
                    </div>

            <Tabs type="card" >
              <TabPane tab="基本信息" key="1">
                <div className={styles.detailCon}>
                  <div className={styles.spanHeaderStyle}>
                    <span className={styles.titleCon}>基本信息</span>
                  </div>
                  <section>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>所在城市：</b>{base && base.city_name}</Col>
                          <Col span={12}><b>营业时间：</b>{base && base.time_open}</Col>
                        </Row>
                      </li>
                      <li>
                        <b>商户特色：</b>
                        {features && features.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>总店地址：</b>{base && base.address}
                      </li>
                      <li>
                        <b>商户简介：</b>
                        <div className={styles.wrap} dangerouslySetInnerHTML={{ __html: base && base.comment }}>
                        </div>
                      </li>
                    </ul>
                  </section>
                </div>
              </TabPane>

              <TabPane tab="套系" key="2">

              </TabPane>
              <TabPane tab="优惠活动" key="3">
                <StoreDetailsPreferential detailsId={detailsId} tab={tab} />

              </TabPane>
              <TabPane tab="联系人" key="4">
                <StoreDetailsContactList detailsId={detailsId} tab={tab} />

              </TabPane>
            </Tabs>


          </div >
        </Card>

      </Affix>
    );

  }
}
// 婚纱礼服 有套系
class WeddingDresses extends Component {
  affixRef: any;
  constructor(props: Readonly<{}>) {
    super(props);
    this.affixRef = React.createRef();
    this.state = {
      modalVisible: false,
      long: '',
      lat: ''
    }
  }

  componentDidMount() {
    window.addEventListener(
      "scroll",
      this.bindHandleScroll,
      true
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }

  bindHandleScroll = () => {
    try {
      this.affixRef.current.updatePosition();
    } catch {

    }
  }
  // 查看地图
  lookMapCtrl = (long: any, lat: any, category: any, hotleName: any) => {
    this.setState({
      modalVisible: true,
      long: long,
      lat: lat,
      category: category,
      hotleName: hotleName
    });
  }
  handleAddContactModalOk = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 关闭地图浮层
  handleAddContactModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    const { dressesModel } = this.props;
    const { dressesModel: { base }, tab, detailsId } = this.props;
    const { TabPane } = Tabs;
    let style = []
    if (base) {
      style = base.styles ? base.styles.split(',') : [];
    }


    return (
      <Affix className={styles.contentViewStyle} ref={this.affixRef}>
        <Card style={{ width: '100%' }}>
          <div className={styles.content}>
            <div className={styles.titleStyle}>
              {base && base.name}({base && base.city_name}-{base && base.region_name})
                    </div>

            <Tabs type="card">
              <TabPane tab="基本信息" key="1">
                <div className={styles.detailCon}>
                  <div className={styles.spanHeaderStyle}>
                    <span className={styles.titleCon}>基本信息</span>
                  </div>
                  <section>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>所在城市：</b>{base && base.city_name}</Col>
                          <Col span={12}><b>行政区域：</b>{base && base.region_name}</Col>
                        </Row>
                      </li>
                      <li>
                        <b>合作类型：</b>{base && base.cooperation}
                      </li>
                      <li>
                        <b>礼服地址：</b>{base && base.address}
                        &nbsp;
                        {base && base.address ? (<span onClick={() => { this.lookMapCtrl(base.longitude, base.latitude, base.category, base.name) }} style={{ color: '#2d8642', cursor: 'pointer' }}>查看地图&gt;</span>) : ''}
                      </li>
                      <li>
                        <b>标签：</b>
                        {style && style.map((item) => {
                          return (
                            <span key={item} className={styles.tagStyle}>
                              {item}
                            </span>
                          );
                        })}
                      </li>
                      <li>
                        <b>价格范围：</b>{base && base.show_price}
                      </li>
                      <li>
                        <b>营业时间：</b>{base && base.opening}
                      </li>
                      <li>
                        <b>详情介绍：</b>
                        <div className={styles.wrap} dangerouslySetInnerHTML={{ __html: base && base.content }}>
                        </div>
                      </li>
                    </ul>
                  </section>
                </div>
              </TabPane>

              <TabPane tab="套系" key="2">
                <StoreDetailSeriesInfo key="2" detailsId={detailsId} tab={tab} />
              </TabPane>
              <TabPane tab="优惠活动" key="3">
                <StoreDetailsPreferential detailsId={detailsId} tab={tab} />

              </TabPane>
              <TabPane tab="联系人" key="4">
                <StoreDetailsContactList detailsId={detailsId} tab={tab} />

              </TabPane>
            </Tabs>


          </div >
        </Card>
        <Drawer
          width="90%"
          placement="right"
          closable={true}
          onClose={this.handleAddContactModalOk}
          visible={this.state.modalVisible}
        >
          <CrmMap
            long={this.state.long}
            lat={this.state.lat}
            category={this.state.category}
            hotleName={this.state.hotleName}
            visible={this.state.modalVisible}
          />
        </Drawer>
      </Affix>
    );

  }
}

class ThHoneymoon extends Component {
  affixRef: any;
  constructor(props: Readonly<{}>) {
    super(props);
    this.affixRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener(
      "scroll",
      this.bindHandleScroll,
      true
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }

  bindHandleScroll = () => {
    try {
      this.affixRef.current.updatePosition();
    } catch {

    }
  }

  render() {

    const { honeymoonModel } = this.props;
    const { honeymoonModel: { base }, tab, detailsId } = this.props;
    const { TabPane } = Tabs;


    return (
      <Affix className={styles.contentViewStyle} ref={this.affixRef}>
        <Card style={{ width: '100%' }}>
          <div className={styles.content}>
            <div className={styles.titleStyle}>
              {base && base.name}({base && base.city_name}-{base && base.region_name})
                    </div>

            <Tabs type="card" >
              <TabPane tab="基本信息" key="1">
                <div className={styles.detailCon}>
                  <div className={styles.spanHeaderStyle}>
                    <span className={styles.titleCon}>基本信息</span>
                  </div>
                  <section>
                    <ul className={styles.sectionUl}>
                      <li>
                        <Row>
                          <Col span={12}><b>所在城市：</b>{base && base.city_name}</Col>
                          <Col span={12}><b>行政区域：</b>{base && base.region_name}</Col>
                        </Row>
                      </li>
                      <li>
                        <b>合作类型：</b>{base && base.cooperation}
                      </li>
                      <li>
                        <b>礼服地址：</b>{base && base.address}
                      </li>
                      <li>
                        <b>价格范围：</b>{base && base.show_price}
                      </li>
                      <li>
                        <b>营业时间：</b>{base && base.time_open}
                      </li>
                      <li>
                        <b>详情介绍：</b>
                        <div className={styles.wrap} dangerouslySetInnerHTML={{ __html: base && base.comment }}>
                        </div>
                      </li>
                      <li>
                        <b>其他信息：</b>{base && base.other}
                      </li>
                    </ul>
                  </section>
                </div>
              </TabPane>

              <TabPane tab="套系" key="2">
                <StoreDetailSeriesInfo detailsId={detailsId} tab={tab} />
              </TabPane>
              <TabPane tab="优惠活动" key="3">
                <StoreDetailsPreferential detailsId={detailsId} tab={tab} />

              </TabPane>

            </Tabs>


          </div >
        </Card>

      </Affix>
    );

  }
}
// 婚车
class WeddingCar extends Component {
  affixRef: any;
  constructor(props: Readonly<{}>) {
    super(props);
    this.affixRef = React.createRef();
    this.state = {
      modalVisible: false,
      long: '',
      lat: ''
    }
  }
  // 查看地图
  lookMapCtrl = (long: any, lat: any, category: any, hotleName: any) => {
    this.setState({
      modalVisible: true,
      long: long,
      lat: lat,
      category: category,
      hotleName: hotleName
    });
  }
  handleAddContactModalOk = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 关闭地图浮层
  handleAddContactModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  componentDidMount() {
    window.addEventListener(
      "scroll",
      this.bindHandleScroll,
      true
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }

  bindHandleScroll = () => {
    try {
      this.affixRef.current.updatePosition();
    } catch {

    }
  }

  render() {

    const { weddingCarModel: { base }, tab, detailsId, WeddingCar, callPhoneCtrl } = this.props;
    let features = []
    let promise = []

    if (base) {
      features = base.features ? base.features.split(',') : [];
      promise = base.promise ? base.promise.split(',') : [];
      base.longitude = '30.309892';
      base.latitude = '120.222222';
    }

    return (
      <Affix className={styles.contentViewStyle} ref={this.affixRef}>
        <Card style={{ width: '100%' }}>
          <div className={styles.content}>
            <div className={styles.titleStyle}>
              {base && base.name}({base && base.city_name}-{base && base.region_name})
            </div>

            <div className={styles.detailCon}>
              <div className={styles.spanHeaderStyle}>
                <span className={styles.titleCon}>基本信息</span>
              </div>
              <section style={{ marginTop: 10 }}>
                <ul className={styles.sectionUl}>
                  <li>
                    <Row>
                      <Col span={12}><b>所在城市：</b>{base && base.city_name}</Col>
                      <Col span={12}><b>行政区域：</b>{base && base.region_name}</Col>
                    </Row>
                  </li>
                  <li>
                    <b>商户名全称：</b>{base && base.name}
                  </li>
                  <li>
                    <b>经营品牌：</b>{base && base.brand}
                  </li>
                  <li>
                    <b>公司地址：</b>{base && base.address}21312
                    &nbsp;
                    {base && base.address ? (<span onClick={() => { this.lookMapCtrl(base.longitude, base.latitude, base.category, base.biz_name) }} style={{ color: '#2d8642', cursor: 'pointer' }}>查看地图&gt;</span>) : ''}
                  </li>
                  <li>
                    <b>价格范围：</b>{base && base.show_price}
                  </li>
                  <li>
                    <b>联系方式：</b>
                    {base && base.mobile ? (
                      <a onClick={() => { callPhoneCtrl(base.encrypt_mobile, base.id) }}>{base.mobile}</a>
                    ) : ''}
                  </li>
                </ul>
              </section>
            </div>

          </div>
        </Card>
        <Drawer
          width="90%"
          placement="right"
          closable={true}
          onClose={this.handleAddContactModalOk}
          visible={this.state.modalVisible}
        >
          <CrmMap
            long={this.state.long}
            lat={this.state.lat}
            category={this.state.category}
            hotleName={this.state.hotleName}
            visible={this.state.modalVisible}
          />
        </Drawer>
      </Affix>
    );

  }
}

interface StoreDetails extends FormComponentProps {
  detailsId: string,
  // 0 婚宴酒店, 1 婚纱摄影, 2 旅拍,3 婚庆服务,4 礼服,5 蜜月
  tab: number,

  dispatch: Dispatch<
    // Action<
    //   | 'storeDetailList/hotelDetail'
    //   | 'storeDetailList/newCategoryDetail'
    // >
    Action<any>
  >;
  loading: boolean;
  storeDetailList: StateType;
}

@connect(
  ({
    storeDetailList,
    loading,
  }: {
    storeDetailList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    storeDetailList,
    loading: loading.models.storeDetailList,
  }),
)
class DetailsInfo extends Component<StoreDetails>{

  constructor(props: StoreDetails) {
    super(props);
    this.state = {
      detailsId: 1
    }
  }

  componentDidMount() {
    const { dispatch, detailsId, tab } = this.props;

    // const {storeDetailList: {detailObj}} = this.props;
    // 婚宴酒店
    // let params = { "hotelId": detailsId };
    // dispatch({
    //   type: 'storeDetailList/hotelDetail',
    //   payload: params,
    // });
    // this.getDetailsRequest(detailObj.tab, detailObj.id)

  }

  componentWillReceiveProps(nextProps) {
    const { detailsId } = this.state;
    // console.log(nextProps)
    // console.log(detailsId)
    if (detailsId !== nextProps.detailsId) {
      this.getDetailsRequest(nextProps.tab, nextProps.detailsId)
      this.setState({
        detailsId: nextProps.detailsId,
      })
    }

  }
  callPhoneCtrl = (tel: any, id: any) => {
    const { detailsId } = this.state;
    const { dispatch, tab } = this.props;
    if (!detailsId) { return }
    let params = { phone: tel, id: id, type: 'merchant', categoryId: tab };
    dispatch({
      type: 'storeDetailList/moorPhoneDialoutCtrl',
      payload: params,
      callback: (data: any) => {
        if (data.code == 200) {
          message.success('外呼成功')
        }
      }
    })
  }

  getDetailsRequest(tab: number, detailsId: string) {
    const { dispatch } = this.props;
    // if(detailsId == ''){ return }
    if (!detailsId) { return }
    let params = { "storeId": detailsId, "category": tab };
    dispatch({
      type: 'storeDetailList/newCategoryDetail',
      payload: params
    });
  }

  render() {
    const { dispatch, tab, storeDetailList: { newCategoryDetailData, detailLoading }, detailsId } = this.props;
    const { TabPane } = Tabs
    // console.log(this.props)
    // console.log(newCategoryDetailData, '-------newCategoryDetailData')

    // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /

    if (tab == 1) {
      // 婚宴
      return (
        <HotelInfoView hotelDetailModel={newCategoryDetailData ? newCategoryDetailData : {}} tab={tab} detailsId={detailsId} detailLoading={detailLoading} dispatch={dispatch} />

      );
    } else if (tab == 2) {
      // 婚庆
      return (
        <WeddingService weddingServiceModel={newCategoryDetailData ? newCategoryDetailData : {}} tab={tab} detailsId={detailsId} />

      );
    } else if (tab == 3) {
      // 婚纱摄影
      return (
        <WeddingPhoto weddingPhotoModel={newCategoryDetailData ? newCategoryDetailData : {}} tab={tab} detailsId={detailsId} />
      );
    } else if (tab == 4) {
      // 庆典or喜宴
      return (
        <HotelInfoView hotelDetailModel={newCategoryDetailData ? newCategoryDetailData : {}} detailLoading={detailLoading} tab={tab} detailsId={detailsId} dispatch={dispatch} />
      );
    } else if (tab == 5) {
      // 婚车
      return (
        <WeddingCar callPhoneCtrl={this.callPhoneCtrl} weddingCarModel={newCategoryDetailData ? newCategoryDetailData : {}} tab={tab} detailsId={detailsId} />
      );
    } else if (tab == 6) {
      // 一站式
      return (
        <div></div>
      );
    } else if (tab == 7) {
      // 礼服
      return (
        <WeddingDresses dressesModel={newCategoryDetailData ? newCategoryDetailData : {}} tab={tab} detailsId={detailsId} />

      );
    }


  }
}


export default DetailsInfo;
