import React, { Component, Fragment } from "react";
import styles from "./index.less";
import { List, message, Avatar, Spin, Typography, Button, Drawer, Divider, Row, Col, Modal } from "antd";
import ReactDOM from "react-dom";
import { FormComponentProps } from "antd/lib/form";
import StoreDetails from '../storeDetails';
import { StateType } from "../../model";
import { routerRedux } from 'dva/router';
import CustomerInfor from '../customerInfor';
import { Dispatch, Action } from "redux";
import { connect } from "dva";
const { confirm } = Modal;
import {
    storeHotelListModel,
    dressAndJourneyPhotoListModel,
    honeymoonListModel,
    clothingListModel,
    weddingServiceListModel,
    weddingCarModel
} from "../../data";


interface ListItemListProps extends FormComponentProps {
    dispatch: Dispatch<
        Action<'storeDetailList/recommend' | 'storeDetailList/goLinkDetail'>
    >;
    tab: number;
    gotoDetail: Function;
    recommend: Function;
    goLinkDetail: Function;
}

interface currentState {
    visible: boolean,
    visibleRecommand: boolean,
    recommendObj: Object;
    arrOtherButton:any;
}

interface listModelType {
    name: string;
    value: string;
}

interface showModel {
    header: string;
    level: string;
    list: listModelType[];
    footerButtonNum: number;
    recommendStatus: boolean;
    buttons:[];
    tags:string;
}

@connect(
    ({
        storeDetailList
    }: {
        storeDetailList: StateType;
    }) => ({
        storeDetailList
    })
)

class ListItemList extends Component<ListItemListProps, currentState> {
    constructor(props: ListItemListProps) {
        super(props);
        this.state = {
            visible: false,
            visibleRecommand: false,
            recommendObj: {},
            arrOtherButton:[]
        }
    }
    // 1 婚宴
    weddingBanquetCtrl = (model: storeHotelListModel) => {
        const hotelListModel: listModelType[] = [
            {
                name: '菜单价格',
                value: model.menu_price,
            },
            {
                name: '容纳桌数',
                value: model.desk_max_byhall,
            },
            {
                name: '特殊标签',
                value: model.feature,
            },
            {
                name: '商家名称',
                value: model.biz_name,
            },
            {
                name: '推荐等级',
                value: model.level,
            },
            {
                name: '到店礼',
                value: model.arrival_coupon,
            },
            {
                name: '其他信息',
                value: model.other,
            },
            {
                name: '上线日期',
                value: model.created,
            },
            {
                name: '确认率',
                value: model.confirm_rate,
            },
            {
                name: '计算补单',
                value: model.order,
            },
            {
                name: '合同始于',
                value: model.contract_start,
            },
            {
                name: '合同止于',
                value: model.contract_end,
            },
            {
                name: '合同提醒',
                value: model.contract_end_time,
            },

        ];
        const showmodel: Partial<showModel> = {};
        showmodel.list = hotelListModel;
        showmodel.header = `${model.name}(${model.city_name}_${model.region_name})`;
        showmodel.level = model.level;
        showmodel.footerButtonNum = 2;
        showmodel.recommendStatus = model.recommend_status;
        showmodel.buttons = this.weddingButton(model);
        return showmodel;
    }

    weddingButton = (model: any) => {
        var obj1 = {};
        var obj2 = {};
        var obj3 = {};
        var obj4 = {};
        var obj5 = {};
        var obj6 = {};
        if (model.toll_mode == 1) {
            obj1['color'] = 'danger';
            obj1['value'] = '讯'
        }
        if(model.coupon_flag == 1){
            obj2['color'] = 'success';
            obj2['value'] = '惠'
        }
        if (model.sign_flag == 1) {
            obj3['color'] = 'primary';
            obj3['value'] = '签'
        }
        if (model.status == 2) {
            obj4['color'] = 'warning';
            obj4['value'] = '顶'
        } else if (model.status == 3) {
            obj5['color'] = 'info';
            obj5['value'] = '黑'
        } else if (model.status == 4) {
            obj6['color'] = 'default';
            obj6['value'] = '停'
        }
        const arrOther = new Array(obj1,obj2,obj3,obj4,obj5,obj6);
        return arrOther;
    }
    // 2 婚庆
    weddingCelebrationCtrl = (model: weddingServiceListModel) => {
        const ListModel: listModelType[] = [
            {
                name: '价格范围',
                value: model.show_price,
            },
            {
                name: '风格标签',
                value: model.style_tag,
            },
            {
                name: '上线日期',
                value: model.created,
            },
        ];
        const showmodel: Partial<showModel> = {};
        showmodel.list = ListModel;
        showmodel.header = `${model.name}(${model.city_name}_${model.region_name})`;
        showmodel.level = model.level;
        showmodel.recommendStatus = model.recommend_status;
        showmodel.footerButtonNum = 2;
        showmodel.buttons = this.weddingCelebrationButton(model);
        return showmodel
    }
    weddingCelebrationButton = (model: any) => {
        var obj1 = {};
        var obj2 = {};
        var obj3 = {};
        var obj4 = {};
        var obj5 = {};

        if (!model || !model.coupons) {
            return '';
        }

        if (model.tollMode == 1) {
            obj1['color'] = 'danger';
            obj1['value'] = '讯'
        }
        if(model.cooperationFlag == 2){
            obj2['color'] = 'default';
            obj2['value'] = '停'
        }
        if (model.coupons.daodianli) {
            obj3['color'] = 'warning';
            obj3['value'] = '礼'
        }
        if (model.coupons.putong) {
            obj4['color'] = 'default';
            obj4['value'] = '惠'
        }
        if (model.coupons.show) {
            obj5['color'] = 'primary';
            obj5['value'] = '秀'
        }
        const arrOther = new Array(obj1,obj2,obj3,obj4,obj5);
        return arrOther;
    }
    // 3 婚纱摄影
    weddingPhotoCtrl = (model: dressAndJourneyPhotoListModel) => {
        const ListModel: listModelType[] = [
            {
                name: '价格范围',
                value: model.show_price,
            },
            {
                name: '商户特色',
                value: model.feature,
            },
            {
                name: '到店礼',
                value: model.arrival_coupon,
            },
            {
                name: '其他信息',
                value: model.other,
            },
            {
                name: '上线日期',
                value: model.created,
            },
        ];
        const showmodel: Partial<showModel> = {};
        showmodel.list = ListModel;
        showmodel.header = `${model.name}(${model.city_name}_${model.region_name})`;
        showmodel.level = model.level;
        showmodel.recommendStatus = model.recommend_status;
        showmodel.footerButtonNum = 2;
        showmodel.buttons = this.weddingPhotoButton(model);
        return showmodel
    }
    weddingPhotoButton = (model: any) => {
        var obj1 = {};
        var obj2 = {};
        var obj3 = {};

        if (model.toll_mode == 1) {
            obj1['color'] = 'danger';
            obj1['value'] = '讯'
        }
        if(model.hui_flag  == 1){
            obj2['color'] = 'success';
            obj2['value'] = '惠'
        }
        if (model.cooperating_flag == 2) {
            obj3['color'] = 'default';
            obj3['value'] = '停'
        }
        const arrOther = new Array(obj1,obj2,obj3);
        return arrOther;
    }
    //4 庆典or喜宴
    celebrationCtrl = (model: storeHotelListModel) => {
        const hotelListModel: listModelType[] = [
            {
                name: '菜单价格',
                value: model.menu_price,
            },
            {
                name: '容纳桌数',
                value: model.desk_max_byhall,
            },
            {
                name: '特殊标签',
                value: model.feature,
            },
            {
                name: '商家名称',
                value: model.biz_name,
            },
            {
                name: '推荐等级',
                value: model.level,
            },
            {
                name: '到店礼',
                value: model.arrival_coupon,
            },
            {
                name: '其他信息',
                value: model.other,
            },
            {
                name: '上线日期',
                value: model.created,
            },
            {
                name: '确认率',
                value: model.confirm_rate,
            },
            {
                name: '计算补单',
                value: model.order,
            },
            {
                name: '合同始于',
                value: model.contract_start,
            },
            {
                name: '合同止于',
                value: model.contract_end,
            },
            {
                name: '合同提醒',
                value: model.contract_end_time,
            },

        ];
        const showmodel: Partial<showModel> = {};
        showmodel.list = hotelListModel;
        showmodel.header = `${model.name}(${model.city_name}_${model.region_name})`;
        showmodel.level = model.level;
        showmodel.footerButtonNum = 2;
        showmodel.recommendStatus = model.recommend_status;
        showmodel.buttons = this.weddingButton(model);
        return showmodel
    }
    // 5 婚车
    weddingCarCtrl = (model: weddingCarModel) => {
        const ListModel: listModelType[] = [
            {
                name: '价格范围',
                value: model.show_price,
            },
            {
                name: '上线日期',
                value: model.created,
            },
        ];
        const showmodel: Partial<showModel> = {};
        showmodel.list = ListModel;
        showmodel.header = `${model.name}(${model.city_name}_${model.region_name})`;
        showmodel.level = model.level;
        showmodel.footerButtonNum = 2;
        showmodel.recommendStatus = model.recommend_status;
        return showmodel
    }
    // 6 一站式
    getHoneymoonModelList = (model: honeymoonListModel) => {
        const ListModel: listModelType[] = [
            {
                name: '价格范围',
                value: model.show_price,
            },
            {
                name: '商户特色',
                value: model.feature,
            },
            {
                name: '到店礼',
                value: model.arrival_coupon,
            },
            {
                name: '其他信息',
                value: model.other,
            },
            {
                name: '上线日期',
                value: model.created,
            },
        ];
        const showmodel: Partial<showModel> = {};
        showmodel.list = ListModel;
        showmodel.header = `${model.name}(${model.city_name}_${model.region_name})`;
        showmodel.level = model.level;
        showmodel.recommendStatus = model.recommend_status;
        showmodel.footerButtonNum = 2;
        return showmodel
    }
    // 7 婚纱礼服
    weddingFullDressCtrl = (model: clothingListModel) => {
        const ListModel: listModelType[] = [
            {
                name: '价格范围',
                value: model.show_price,
            },
            {
                name: '标签',
                value: model.feature,
            },
            {
                name: '上线日期',
                value: model.created_at,
            },
        ];
        const showmodel: Partial<showModel> = {};
        showmodel.list = ListModel;
        showmodel.header = `${model.name}(${model.city_name}_${model.region_name})`;
        showmodel.level = model.level;
        showmodel.recommendStatus = model.recommend_status;
        showmodel.footerButtonNum = 1;
        showmodel.buttons = this.weddingFullDressButton(model);
        return showmodel
    }

    weddingFullDressButton = (model: any) => {
        var obj1 = {};
        if (!model || !model.coupons) {
            return ''
        }
        if (model.cooperation == 2) {
            obj1['color'] = 'default';
            obj1['value'] = '停'
        }
        const arrOther = new Array(obj1);
        return arrOther;
    }


    clickAction = (type: any) => {
        // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /
        const {
            listData,
            tab,
            gotoDetail,
            recommend,
            dispatch
        } = this.props;
        let id: string = '';
        let obj = {};
        obj.tab = tab;
        id = listData.id;
        obj.merchantId = listData.id;
        obj.name = listData.name;
        obj.city = listData.city_name;
        obj.district = listData.region_name;
        obj.level = listData.level;
        obj.features = listData.feature;
        obj.priceRange = listData.price;
        obj.manager = listData.manager;
        obj.managerMobile = listData.manager_mobile;

        if (type == 1) {
            //gotoDetail(id);
            this.setState({
                recommendObj: obj
            });
            dispatch({
                type: 'storeDetailList/goLinkDetail',
                payload: {
                    obj: obj
                }
            });
        }
        if (type == 2) {
            dispatch({
                type: 'storeDetailList/recommend',
                payload: {
                    recommend: obj
                },
                callback: () => {
                    recommend(id);
                }
            });
            this.setState({
                recommendObj: obj
            })
        }

        if (type == 3) {
            confirm({
                title: '微信号',
                okText: '确定',
                cancelText: '取消',
                centered: true,
                onOk() { },
                onCancel() { },
            });
        }

    }

    gotoDetailClick = () => {
        this.setState({
            visible: true,
        });
        this.clickAction(1);
    }
    // 微信推荐
    recommendWeChat = () => {
        this.clickAction(3);
    }
    // 推荐商家
    gotoRecommentClick = () => {
        this.setState({
            visibleRecommand: true,
        });
        this.clickAction(2);
    }
    // 推荐成功 浮层关闭
    closeDialogCtrl = (num: any) => {
        if (num) {
            this.setState({
                visibleRecommand: false,
            });
             history.back();
        }

    }

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onCloseRecommand = () => {
        this.setState({
            visibleRecommand: false,
        });
    }

    renderStyle = (type:any) => {
        var type
        if(type == 'danger'){
            type = styles.danger
        }else if(type == 'success'){
            type = styles.success
        }else if(type == 'default'){
            type = styles.default
        }else if(type == 'warning'){
            type = styles.warning
        }else if(type == 'info'){
            type = styles.info
        }else if(type == 'primary'){
            type = styles.primary
        }
        return type
    }

    render() {
        const {
            listData,
            tab,
            customerData,
        } = this.props;

        let { recommendObj } = this.state;
        let list: listModelType[] = [];
        let headerString: string = '';
        let recommandLevel: string = '';
        let footerNum: number = 2;
        let recommendStatus: number = 1;
        let other : any = [];
        // 2020-3-9 1: 婚宴/ 2:婚庆 / 3:婚纱摄影 / 4:庆典or喜宴 / 5:婚车 / 6:一站式 / 7:婚纱礼服 /

        switch (tab) {
            case 1:
                // 婚宴
                const model = this.weddingBanquetCtrl(listData);
                other = model.buttons;
                list = model.list ? model.list : [];
                headerString = model.header ? model.header : '';
                recommandLevel = model.level ? model.level : '';
                recommendStatus = model.recommendStatus ? model.recommendStatus : '';
                break;
            case 2:
                // 婚庆
                const forth = this.weddingCelebrationCtrl(listData);
                other = forth.buttons;
                list = forth.list ? forth.list : [];
                headerString = forth.header ? forth.header : '';
                recommendStatus = forth.recommendStatus ? forth.recommendStatus : '';
                break;
            case 3:
                // 婚纱摄影
                const secondModel = this.weddingPhotoCtrl(listData)
                other = secondModel.buttons;
                list = secondModel.list ? secondModel.list : [];
                headerString = secondModel.header ? secondModel.header : '';
                recommandLevel = secondModel.level ? secondModel.level : '';
                recommendStatus = secondModel.recommendStatus ? secondModel.recommendStatus : '';
                break;
            case 4:
                // 庆典or喜宴
                // const celebrationData = this.celebrationCtrl(listData);
                const celebrationData = this.weddingBanquetCtrl(listData);
                other = celebrationData.buttons;
                list = celebrationData.list ? celebrationData.list : [];
                headerString = celebrationData.header ? celebrationData.header : '';
                recommandLevel = celebrationData.level ? celebrationData.level : '';
                recommendStatus = celebrationData.recommendStatus ? celebrationData.recommendStatus : '';
                break;
            case 5:
                // 婚车
                const carModel = this.weddingCarCtrl(listData);
                list = carModel.list ? carModel.list : [];
                headerString = carModel.header ? carModel.header : '';
                recommandLevel = carModel.level ? carModel.level : '';
                recommendStatus = carModel.recommendStatus ? carModel.recommendStatus : '';
                break;
            case 6:
                // 一站式
                break;
            case 7:
                // 婚纱礼服
                const fifth = this.weddingFullDressCtrl(listData);
                other = fifth.buttons;
                list = fifth.list ? fifth.list : [];
                headerString = fifth.header ? fifth.header : '';
                recommandLevel = fifth.level ? fifth.level : '';
                recommendStatus = fifth.recommendStatus ? fifth.recommendStatus : '';
                footerNum = 1

                break;
            default:
                break;
        }

        let recommenFlag = false;
        if (this.props.requirementId && this.props.customerId) {
            recommenFlag = true;
        } else {
            recommenFlag = false;
        }
        console.log('other---',other)
        return (
            < div>
                <List
                    size="small"
                    header={
                        <Row gutter={24} style={{ background: '#FAFAFA', padding: 10 }}>
                            <Col span={15} >
                                <div>
                                    <div className={styles.headerCon}>
                                        <h3>{headerString}</h3>
                                    </div>
                                    {
                                        (tab == 1|| tab == 4)?(
                                            <div className={styles.headerCon} >
                                            <p>推荐等级:{recommandLevel}</p>
                                        </div>
                                        ):null
                                    }
                                </div>
                            </Col>
                            <Col span={9} style={{}}>
                                <div >
                                    <div className={styles.footerCon} style={{ marginBottom: 10 }}>
                                        {other && other.map(item=> item.value ? <Button className={styles[item.color]}>{item.value}</Button> :'')}
                                        {
                                            recommenFlag && recommendStatus == 1
                                                ? <Fragment>
                                                    <Button onClick={this.gotoRecommentClick} className={styles.buttonStyle}>推荐</Button>
                                                    &nbsp;&nbsp;&nbsp;
                                    </Fragment>
                                                : ''
                                        }
                                        <Button onClick={this.gotoDetailClick} className={styles.buttonStyle}>详情</Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    }
                    bordered={false}
                    split={false}
                    dataSource={list}
                    renderItem={item => (
                        <List.Item>
                            <b>{item.name}</b>:{item?.value}
                        </List.Item>
                    )}
                />
                <Drawer
                    width="60%"
                    placement="right"
                    closable={true}
                    onClose={this.onCloseRecommand}
                    visible={this.state.visibleRecommand}
                >
                    <CustomerInfor closeDialogCtrl={this.closeDialogCtrl} customerId={this.props.customerId} requirementId={this.props.requirementId} category={this.props.category} recommendObj={this.state.recommendObj} customerData={customerData} />
                </Drawer>
            </div >
        );

    }

};
export default ListItemList;
