import React, { Component, Fragment } from "react";
import styles from "./index.less";
import { message, Button, Icon, Modal, Radio } from "antd";
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model";
const { confirm } = Modal;
import { routerRedux } from 'dva/router';

interface storeListProps extends FormComponentProps {
  // 0 婚宴酒店, 1 婚纱摄影, 2 旅拍,3 婚庆服务,4 礼服,5 蜜月
  tab: number,
  params: {},
  dispatch: Dispatch<any>;
  submitting: boolean;
  storeDetailList: StateType;
  loading: boolean;
  valueText: number
}

interface storeListState {
  hasMore: any;
  loading: Boolean;
  data: Object;
  recommendFlag: boolean;
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
  })
)

class CustomerInfor extends Component<storeListProps, storeListState>  {
  state: storeListState = {
    hasMore: '',
    loading: false,
    data: {},
    recommendFlag: false,
    valueText: 1,
  };
  componentDidMount() { }
  //保存推荐
  saveRecommendCtrl = (tab: number, arr: Object) => {
    const { dispatch, customerId, requirementId } = this.props;
    const { valueText } = this.state;
    this.setState({
      recommendFlag: true
    })
    dispatch({
      type: 'storeDetailList/saveRecommendCtrl',
      payload: {
        filter: arr,
        customerId: customerId,
        requirementId: requirementId,
        category: tab,
        isSend: valueText
      },
      callback: this.recommenCallback
    });

  }
  // 推荐 成功回调
  recommenCallback = (data: any) => {
    const self = this;
    if (data.code == 200) {
      confirm({
        title: data.msg,
        okText: '确定',
        cancelText: '取消',
        centered: true,
        onOk() {
          // window.location.reload();
          self.props.closeDialogCtrl(1);
          // self.props.dispatch(routerRedux.push({
          //     pathname: '/demand/demandManagement/demandDetails',
          //     query: {
          //       selectVal:1,
          //     }
          // }));


        },
        onCancel() { },
      });
    } else { }
    self.setState({
      recommendFlag: false
    })
  }
  // 重置
  recommendResetCtrl = (type: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeDetailList/recommendResetCtrl',
      payload: {
        type: type
      }
    });
  }
  // 删除推荐酒店
  itemDeleteCtrl(index: Number, type: Number) {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeDetailList/itemDeleteCtrl',
      payload: {
        index: index,
        type: type
      }
    });
  }
  // 生成酒店列表
  recommendHotelItem = (arr: any) => {
    // console.log(arr)
    if (arr.length > 0) {
      arr.map((item, index) => {
        return (
          <div key={index} className={styles.hotelist}>
            <p>{item.name}</p>
            {arr.length > 0 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                style={{ marginLeft: 3, marginTop: 4 }}
                onClick={() => this.itemDeleteCtrl(index, item.tab)}
              />
            ) : null}
          </div>
        )
      });
    }
  }

  onChangeText = e => {
    this.setState({
      valueText: e.target.value,
    });
  };

  render() {
    const {
      recommendObj: { tab },
      customerData,
      storeDetailList: {
        recommendBanquet,
        recommendWedding,
        recommendPhotography,
        recommendCelebration,
        recommendCar,
        recommendOneStop,
        recommendDress,
        recommendDetail
      }
    } = this.props;
    let initRes = tab == 1 ? recommendBanquet : tab == 2 ? recommendWedding : tab == 3 ? recommendPhotography : tab == 4 ? recommendCelebration : tab == 5 ? recommendCar : tab == 6 ? recommendOneStop : recommendDress;
    let cUser = customerData.customerData;
    // console.log('recommendDetail========tab'+tab, recommendDetail)
    return (
      <div className={styles.customerInfor}>
        {!!recommendDetail ?
          <div>
            <div className={styles.h1}>客户信息</div>
            <div className={styles.h2}>
              <p className={styles.p1}>客户姓名:</p>
              <p className={styles.p2}>{recommendDetail?.customer_name}</p>
            </div>
            <div className={styles.h2}>
              <p className={styles.p1}>婚期:</p>
              <p className={styles.p2}>{!recommendDetail?.wedding_date ? '未填写' : recommendDetail.wedding_date}</p>
            </div>
            <div className={styles.h2}>
              <p className={styles.p1}>业务品类:</p>
              <p className={styles.p2}>{!recommendDetail?.category_txt ? '未填写' : recommendDetail.category_txt}</p>
            </div>

            {tab == 1 ? (
              <Fragment>
                <div className={styles.h2}>
                  <p className={styles.p1}>意向区域:</p>
                  <p className={styles.p2}>{!recommendDetail?.city_info ? '未填写' : recommendDetail.city_info.full}</p>
                </div>
                <div className={styles.h2}>
                  <p className={styles.p1}>婚礼桌数:</p>
                  <p className={styles.p2}>{!recommendDetail?.hotel_tables ? '未填写' : recommendDetail.hotel_tables}</p>
                </div>
                <div className={styles.h2}>
                  <p className={styles.p1}>场地类型:</p>
                  <p className={styles.p2}>{!recommendDetail?.site_type_txt ? '未填写' : recommendDetail.site_type_txt}</p>
                </div>
                <div className={styles.h2}>
                  <p className={styles.p1}>档期类型:</p>
                  <p className={styles.p2}>{!recommendDetail?.schedule_type_txt ? '未填写' : recommendDetail.schedule_type_txt}</p>
                </div>
                <div className={styles.h2}>
                  <p className={styles.p1}>每桌预算:</p>
                  <p className={styles.p2}>{!recommendDetail?.per_budget ? '未填写' : recommendDetail.per_budget}</p>
                </div>
                <div className={styles.h2}>
                  <p className={styles.p1}>婚宴预算:</p>
                  <p className={styles.p2}>{!recommendDetail?.budget ? '未填写' : recommendDetail.budget}</p>
                </div>
              </Fragment>
            ) : null
            }
            {
              tab == 2 ? (
                <Fragment>
                  <div className={styles.h2}>
                    <p className={styles.p1}>意向区域:</p>
                    <p className={styles.p2}>{!recommendDetail?.city_info ? '未填写' : recommendDetail.city_info.full}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚礼风格:</p>
                    <p className={styles.p2}>{!recommendDetail?.wedding_style_txt ? '未填写' : recommendDetail.wedding_style_txt}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚礼桌数:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel_tables ? '未填写' : recommendDetail.hotel_tables}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>每桌预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.per_budget ? '未填写' : recommendDetail.per_budget}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>预定酒店:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel ? '未填写' : recommendDetail.hotel}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>宴会厅:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel_hall ? '未填写' : recommendDetail.hotel_hall}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚庆预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.budget ? '未填写' : recommendDetail.budget}</p>
                  </div>
                </Fragment>
              ) : null
            }
            {
              tab == 3 ? (
                <Fragment>
                  <div className={styles.h2}>
                    <p className={styles.p1}>意向区域:</p>
                    <p className={styles.p2}>{!recommendDetail?.city_info ? '未填写' : recommendDetail.city_info.full}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>拍照风格:</p>
                    <p className={styles.p2}>{!recommendDetail?.photo_style_txt ? '未填写' : recommendDetail.photo_style_txt}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚摄预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.budget ? '未填写' : recommendDetail.budget}</p>
                  </div>
                </Fragment>
              ) : null
            }
            {
              tab == 4 ? (
                <Fragment>
                  <div className={styles.h2}>
                    <p className={styles.p1}>意向区域:</p>
                    <p className={styles.p2}>{!recommendDetail?.city_info ? '未填写' : recommendDetail.city_info.full}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>举办桌数:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel_tables ? '未填写' : recommendDetail.hotel_tables}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>预定酒店:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel ? '未填写' : recommendDetail.hotel}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>宴会厅:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel_hall ? '未填写' : recommendDetail.hotel_hall}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>每桌预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.per_budget ? '未填写' : recommendDetail.per_budget}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>{`${React.$celebrationOrWeddingBanquet()}预算:`}</p>
                    <p className={styles.p2}>{!recommendDetail?.budget ? '未填写' : recommendDetail.budget}</p>
                  </div>
                </Fragment>
              ) : null
            }
            {
              tab == 5 ? (
                <Fragment>
                  <div className={styles.h2}>
                    <p className={styles.p1}>意向区域:</p>
                    <p className={styles.p2}>{!recommendDetail?.city_info ? '未填写' : recommendDetail.city_info.full}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>用车时间:</p>
                    <p className={styles.p2}>{!recommendDetail?.car_time ? '未填写' : recommendDetail.car_time}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>选择品牌:</p>
                    <p className={styles.p2}>{!recommendDetail?.car_brand ? '未填写' : recommendDetail.car_brand}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>用车数量:</p>
                    <p className={styles.p2}>{!recommendDetail?.car_num ? '未填写' : recommendDetail.car_num}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚车预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.budget ? '未填写' : recommendDetail.budget}</p>
                  </div>
                </Fragment>
              ) : null
            }
            {
              tab == 6 ? (
                <Fragment>
                  <div className={styles.h2}>
                    <p className={styles.p1}>意向区域:</p>
                    <p className={styles.p2}>{!recommendDetail?.city_info ? '未填写' : recommendDetail.city_info.full}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚礼风格:</p>
                    <p className={styles.p2}>{!recommendDetail?.wedding_style ? '未填写' : recommendDetail.wedding_style}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚礼桌数:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel_tables ? '未填写' : recommendDetail.hotel_tables}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>每桌预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.per_budget ? '未填写' : recommendDetail.per_budget}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>预定酒店:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel ? '未填写' : recommendDetail.hotel}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>宴会厅:</p>
                    <p className={styles.p2}>{!recommendDetail?.hotel_hall ? '未填写' : recommendDetail.hotel_hall}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>整体预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.budget ? '未填写' : recommendDetail.budget}</p>
                  </div>
                </Fragment>
              ) : null
            }
            {
              tab == 7 ? (
                <Fragment>
                  <div className={styles.h2}>
                    <p className={styles.p1}>意向区域:</p>
                    <p className={styles.p2}>{!recommendDetail?.city_info ? '未填写' : recommendDetail.city_info.full}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>使用方式:</p>
                    <p className={styles.p2}>{!recommendDetail?.dress_use_way_txt ? '未填写' : recommendDetail.dress_use_way_txt}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>服饰类型:</p>
                    <p className={styles.p2}>{!recommendDetail?.dress_type_txt ? '未填写' : recommendDetail.dress_type_txt}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>礼服款式:</p>
                    <p className={styles.p2}>{!recommendDetail?.dress_model_txt ? '未填写' : recommendDetail.dress_model_txt}</p>
                  </div>
                  <div className={styles.h2}>
                    <p className={styles.p1}>婚服预算:</p>
                    <p className={styles.p2}>{!recommendDetail?.budget ? '未填写' : recommendDetail.budget}</p>
                  </div>
                </Fragment>
              ) : null

            }

          </div> : null
        }
        <div className={styles.h1}>推荐酒店</div>
        <div className={styles.hotelList}>
          {
            initRes.map((item, index) => {
              return (
                <div key={index} className={styles.hotelist}>
                  <p>{item.name}</p>
                  {initRes.length > 0 ? (
                    <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      style={{ marginLeft: 3, marginTop: 4 }}
                      onClick={() => this.itemDeleteCtrl(index, item.tab)}
                    />
                  ) : null}
                </div>
              )
            })
          }
          {/* {this.recommendHotelItem(initRes)} */}
        </div>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          短信配置:&nbsp;&nbsp;
                <Radio.Group onChange={this.onChangeText} value={this.state.valueText}>
            <Radio value={1}>正常发送</Radio>
            <Radio value={0}>客户隐发</Radio>
          </Radio.Group>
        </div>
        <div className={styles.bt}>
          <Button style={{ width: 100 }} disabled={this.state.recommendFlag} type="primary" onClick={() => { this.saveRecommendCtrl(tab, initRes) }}>保存推荐</Button>
          <Button style={{ marginLeft: 50 }} onClick={() => { this.recommendResetCtrl(tab) }}>重置</Button>
        </div>
      </div>
    );
  }
}

export default CustomerInfor;
