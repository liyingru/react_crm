import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Select } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model"
import component from '@/locales/zh-TW/component';

interface storeDetailHotelMenuProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    detailsId: string,
    tab: number,
    menuTab: number,
    // loading: boolean;
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

class StoreDetailHotelMenu extends Component<storeDetailHotelMenuProps> {
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
        // console.log('nextProps.nameKey',nextProps.nameKey)
        // if (menuTab != nextProps.nameKey) {
        //     console.log('调用菜单了'+menuTab, nameKey)
        //     this.getGoodRequest(nextProps.tab, nextProps.detailsId)
        //     this.setState({
        //         detailsId: nextProps.detailsId,
        //         menuTab: nextProps.nameKey
        //     });
        // }
    }

    getGoodRequest(tab: number, detailsId: string) {
        const { dispatch } = this.props;
        if (!detailsId) { return }
        let params = { "storeId": detailsId, "category": tab, 'type': 1 };
        dispatch({
            type: 'storeDetailList/storeGoodCtrl',
            payload: params
        })
    }
    handleChange = (value: any) => {
        const { dispatch, detailsId, tab } = this.props;
        let params = { "storeId": detailsId, "category": tab, 'goodsId': value, 'type': 1 };
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
        console.log('storeGoodArr==========菜单的',storeGoodArr)
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
                            <span className={styles.titleCon}>基本信息</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>

                                <li>
                                    <Row>
                                        <Col span={12}><b>菜单名称：{storeGoodArr.goods_info?.name ? storeGoodArr.goods_info.name : '-'}</b></Col>
                                        <Col span={12}><b>菜单年份：{storeGoodArr.goods_info?.year ? storeGoodArr.goods_info.year : '-'}</b></Col>
                                    </Row>
                                </li>
                                <li>
                                    <Row>
                                        <Col span={12}><b>菜单价格：{storeGoodArr.goods_info?.price ? storeGoodArr.goods_info.price : '-'}</b></Col>
                                        <Col span={12}><b>菜单类别：{storeGoodArr.goods_info?.type ? storeGoodArr.goods_info.type : '-'}</b></Col>
                                    </Row>
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>价格备注：{storeGoodArr.goods_info?.comment ? storeGoodArr.goods_info.comment : '-'}</b>
                                    {/* {base && base.desk} */}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>附加信息：{storeGoodArr.goods_info?.desc ? storeGoodArr.goods_info.desc : '-'}</b>
                                    {/* {base && base.level} */}
                                </li>
                            </ul>
                        </section>
                        <div className={styles.spanHeaderStyle}>
                            <span className={styles.titleCon}>套餐详情</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>套餐名称：{storeGoodArr.goods_info?.name ? storeGoodArr.goods_info.name : '-'}</b>
                                    {/* {base && base.desk} */}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>套餐内容：{storeGoodArr.goods_info?.comment ? storeGoodArr.goods_info.comment : '-'}</b>
                                    {/* {base && base.level} */}
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </Card>

        );
    }
}
export default StoreDetailHotelMenu;