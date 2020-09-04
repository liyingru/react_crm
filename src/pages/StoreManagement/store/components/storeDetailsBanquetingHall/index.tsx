import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Select } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model"
import component from '@/locales/zh-TW/component';
import PicBrowser from '@/components/PicBrowser';


interface storeDetailBanquetingHallProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    detailsId: string,
    storeDetailList: StateType;
    menuTab: Number;
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

class StoreDetailBanquetingHall extends Component<storeDetailBanquetingHallProps> {
    constructor(props: storeDetailBanquetingHallProps) {
        super(props);
        this.state = {
            detailsId: 1,
            menuTab: 0
        }
    }
    componentDidMount() {
        const { dispatch, detailsId, tab } = this.props;
        // this.getGoodRequest(tab, detailsId);
    }
    componentWillReceiveProps(nextProps) {
        // const { detailsId, menuTab } = this.state;
        // const {nameKey } = this.props;
        // console.log('nextProps.nameKey======hall',nextProps.nameKey)
        // if (menuTab != nextProps.nameKey) {
        //     console.log('调用宴会厅了',nextProps.nameKey)
        //     this.getGoodRequest(nextProps.tab, nextProps.detailsId)
        //     this.setState({
        //         detailsId: nextProps.detailsId,
        //         menuTab: nameKey
        //     });
        // }
    }

    getGoodRequest(tab: number, detailsId: string) {
        const { dispatch } = this.props;
        // if(detailsId == ''){ return }
        if (!detailsId) { return }
        let params = { "storeId": detailsId, "category": tab };
        dispatch({
            type: 'storeDetailList/storeGoodCtrl',
            payload: params
        })
    }
    handleChange = (value: any) => {
        const { dispatch, detailsId, tab } = this.props;
        let params = { "storeId": detailsId, "category": tab, 'goodsId': value };
        dispatch({
            type: 'storeDetailList/storeGoodCtrl',
            payload: params
        })
    }

    render() {
        let goods = [];
        const { tab, storeDetailList: { storeGoodArr } } = this.props;
        const { TabPane } = Tabs
        const { Option } = Select;
        console.log('storeGoodArr==========宴会厅的',storeGoodArr);
        goods = !!storeGoodArr.goods?storeGoodArr.goods:[];
        return (
            <Card style={{ width: '100%' }}>
               {
                    goods.length > 0?(
                        <Select defaultValue={goods[0].name} style={{ width: 200, bottom: 15 }} onChange={this.handleChange}>
                    {
                        goods && goods.map(item => (
                            <Option value={item.id} key={item.name}>{item.name}</Option>))
                    }
                </Select>
                    ):null
                }
                <div className={styles.content}>
                    <div className={styles.detailCon}>
                        <div className={styles.spanHeaderStyle}>
                            <span className={styles.titleCon}>宴会厅信息</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>

                                <li>
                                    <Row>
                                        <Col span={12}><b>宴会厅名称：{storeGoodArr.goods_info?.name ? storeGoodArr.goods_info.name : '-'}</b></Col>
                                        <Col span={12}><b>状态：{storeGoodArr.goods_info?.status == '1' ? '正常' : '禁用'}</b></Col>
                                    </Row>
                                </li>
                                <li>
                                    <Row>
                                        <Col span={12}><b>最佳桌数：{storeGoodArr.goods_info?.desk_best_num}</b></Col>
                                        <Col span={12}><b>最小桌数：{storeGoodArr.goods_info?.desk_min_num}</b></Col>
                                    </Row>
                                </li>
                                <li>
                                    <Row>
                                        <Col span={12}><b>面积：{storeGoodArr.goods_info?.room_area ? storeGoodArr.goods_info.room_area : '-'}</b></Col>
                                        <Col span={12}><b>层高：{storeGoodArr.goods_info?.floor_height ? storeGoodArr.goods_info.floor_height : '-'}</b></Col>
                                    </Row>
                                </li>
                                <li>
                                    <Row>
                                        <Col span={12}><b>柱子：{storeGoodArr.goods_info?.pillar_num ? storeGoodArr.goods_info.pillar_num : '-'}根</b></Col>
                                        <Col span={12}><b>最低消费：{storeGoodArr.goods_info?.minimum_require ? storeGoodArr.goods_info.minimum_require : '-'}</b></Col>
                                    </Row>
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>其他：</b>
                                    {storeGoodArr.goods_info?.other ? storeGoodArr.goods_info.other : '-'}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>备注：</b>
                                    {storeGoodArr.goods_info?.comment ? storeGoodArr.goods_info.comment : '-'}
                                </li>
                                <li style={{ display: 'flex' }}>
                                    <b style={{ display: 1 }}>图片：</b>
                                    {
                                        storeGoodArr.goods_images && storeGoodArr.goods_images.map(item => (
                                            // <img style={{ width: 'auto', display: 'block', marginRight: '10px', marginBottom: '10px' }} src={item.tiny} />
                                            <div style={{ padding: 5 }}>
                                                <PicBrowser wt={80} ht={50} imgSrc={item.large} />
                                            </div>
                                            ))

                                    }
                                </li>
                                <li style={{ display: 'flex' }}>
                                    <b style={{ display: 1 }}>360全景： {storeGoodArr.full_images?.other ? storeGoodArr.full_images.other : '无'}</b>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </Card>

        );
    }
}
export default StoreDetailBanquetingHall;