import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Select } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model"
import component from '@/locales/zh-TW/component';

interface storeDetailSeriesInfoProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    detailsId: string,
    tab: number,
    // loading: boolean;
    storeDetailList: StateType;
}

interface storeDetailSeriesInfoState {
    currentGoodsId: string;
}
// 蜜月
class HoneyMoonSeriesInfo extends Component {
    render() {
        const { honeyMoonModel: { base } } = this.props;
        const { Option } = Select;
        function handleChange(value) {
            console.log(`selected ${value}`);
        }
        return (
            <Card style={{ width: '100%' }}>
                <Select defaultValue="lucy" style={{ width: 200, bottom: 15 }} onChange={handleChange}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                </Select>
                <div className={styles.content}>
                    <div className={styles.detailCon}>
                        <div className={styles.spanHeaderStyle}>
                            <span className={styles.titleCon}>套餐详情</span>
                        </div>

                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>

                                <li>
                                    <b>套系全称：</b>
                                    {/* {base && base.address} */}
                                </li>
                                <li>
                                    <b>副标题：</b>
                                    {/* {base && base.price} */}
                                </li>
                                <li>
                                    <b>出发城市：</b>
                                    {/* {base && base.desk} */}
                                </li>
                                <li>
                                    <b>运营管理：</b>
                                    {/* {base && base.level} */}
                                </li>
                                <li>
                                    <b>航班信息：</b>
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

//婚纱摄影、旅拍
class WeddingPhotoSeriesInfo extends Component {
    componentDidMount() {

    }
    render() {
        let goods = [];
        const { Option } = Select;
        const { storeGoodArr,changeCtrl } = this.props;
        goods = !!storeGoodArr.goods?storeGoodArr.goods:[];
        return (
            <Card style={{ width: '100%' }}>
                {
                    goods.length > 0?(
                        <Select defaultValue={goods[0].name} style={{ width: 200, bottom: 15 }} onChange={(e)=>changeCtrl(e)}>
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
                            <span className={styles.titleCon}>服装造型</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>

                                <li>
                                    <b>新娘造型：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.bride_dress_num}套
                                </li>
                                <li>
                                    <b>新郎造型：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.groom_dress_num}套
                                </li>
                                <li>
                                    <b>服装选择：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.dress_comment}
                                </li>
                                <li>
                                    <b>其他：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.dress_addition}
                                </li>
                            </ul>
                        </section>
                        <div className={styles.spanHeaderStyle} style={{ marginTop: 10 }}>
                            <span className={styles.titleCon}>拍摄照片</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>
                                <li>
                                    <Row>
                                        <Col span={12}>
                                            <b>拍摄：</b>
                                            {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.photo_base_num}张
                                        </Col>
                                        <Col span={12}>
                                            <b>精修：</b>
                                            {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.photo_design_num}张
                                        </Col>
                                    </Row>
                                </li>
                                <li>
                                    <b>入盘：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.photo_disk_num}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>其他：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.photo_comment}
                                </li>

                            </ul>
                        </section>
                        <div className={styles.spanHeaderStyle} style={{ marginTop: 10 }}>
                            <span className={styles.titleCon}>拍摄地点</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>
                                <li>
                                    <b>外景地：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.photo_outdoor}
                                </li>
                                <li>
                                    <b>内景地：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.photo_indoor}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>其他：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.photo_location_comment}
                                </li>

                            </ul>
                        </section>
                        <div className={styles.spanHeaderStyle} style={{ marginTop: 10 }}>
                            <span className={styles.titleCon}>服务团队</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>
                                <li>
                                    <b>摄影：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.service_photograph}
                                </li>
                                <li>
                                    <b>化妆：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.service_markup}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>其他：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.service_other}
                                </li>

                            </ul>
                        </section>
                        <div className={styles.spanHeaderStyle} style={{ marginTop: 10 }}>
                            <span className={styles.titleCon}>附赠产品</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>
                                <li>
                                    <b>相册：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.addition_album}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>相框：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.addition_photoframe}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>其他：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.addition_comment}
                                </li>

                            </ul>
                        </section>
                        <div className={styles.spanHeaderStyle} style={{ marginTop: 10 }}>
                            <span className={styles.titleCon}>补充说明</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>
                                <li>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.more_comment}
                                </li>

                            </ul>
                        </section>
                    </div>
                </div>
            </Card>
        );
    }

}

// 婚庆服务
class WeddingServiceSeriesInfo extends Component {
    render() {
        let goods = [];
        const { Option } = Select;
        const { storeGoodArr,changeCtrl } = this.props;
        goods = !!storeGoodArr.goods?storeGoodArr.goods:[];
        return (
            <Card style={{ width: '100%' }}>
                {
                    goods.length > 0?(
                        <Select defaultValue={goods[0].name} style={{ width: 200, bottom: 15 }} onChange={(e)=>changeCtrl(e)}>
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
                            <span className={styles.titleCon}>套餐详情</span>
                        </div>
                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>

                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>套系特色：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.description }
                                </li>
                                <li>
                                    <b>婚礼团队：</b>
                                    <p> {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.teamEmcee?storeGoodArr.goods_info.teamEmcee:''}</p>
                                    <p>{storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.teamMakeup?storeGoodArr.goods_info.teamMakeup:''}</p>
                                    <p>{storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.teamCamera?storeGoodArr.goods_info.teamCamera:''}</p>
                                    <p>{storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.teamPhoto?storeGoodArr.goods_info.teamPhoto:''}</p>
                                    <p>{storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.teamOther?storeGoodArr.goods_info.teamOther:''}</p>


                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <b>场地布置：</b>

                                    <p>迎宾区： {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.regionWelcome}</p>
                                    <p>仪式区：{storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.regionCeremony}</p>
                                    <p>婚宴区： {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.regionDinning}</p>
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <p>花艺装饰：</p>
                                    {storeGoodArr&&storeGoodArr.decoration&&storeGoodArr.goods_info.decoration}
                                </li>
                                <li style={{ wordBreak: 'break-all' }}>
                                    <p>道具及灯光：</p>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.propLight}
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </Card>


        );
    }
}


//礼服
class WeddingDressSeriesInfo extends Component {
    render() {
        let goods = [];
        const { Option } = Select;
        const { storeGoodArr,changeCtrl } = this.props;
        goods = !!storeGoodArr.goods?storeGoodArr.goods:[];
        return (
            <Card style={{ width: '100%' }}>
                {
                    goods.length > 0?(
                        <Select defaultValue={goods[0].name} style={{ width: 200, bottom: 15 }} onChange={(e)=>changeCtrl(e)}>
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
                            <span className={styles.titleCon}>套餐详情</span>
                        </div>

                        <section style={{ marginTop: 10 }}>
                            <ul className={styles.sectionUl}>

                                <li>
                                    <b>名称：</b>
                                    {storeGoodArr&&storeGoodArr.name&&storeGoodArr.goods_info.name}

                                </li>
                                <li>
                                    <b>出售优惠价：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.hireDiscount}

                                </li>
                                <li>
                                    <b>衣服数量：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.clothes}

                                </li>
                                <li>
                                    <b>包含内容：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.intro}

                                </li>
                                <li>
                                    <b>补充说明：</b>
                                    {storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.addition}

                                </li>
                                <li>
                                    <b>套系详情：</b>
                                    <span dangerouslySetInnerHTML={{ __html: storeGoodArr&&storeGoodArr.goods_info&&storeGoodArr.goods_info.content }}>
                        </span>

                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </Card>
        );
    }
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

class StoreDetailSeriesInfo extends Component<storeDetailSeriesInfoProps, storeDetailSeriesInfoState> {
    constructor(props: storeDetailSeriesInfoProps) {
        super(props);
        this.state = {
            currentGoodsId: ''
        }
    }
    componentDidMount() {
        const { dispatch, detailsId, tab } = this.props;
        const { currentGoodsId } = this.state;
        this.getSeriesInfo(tab, detailsId, currentGoodsId)
    }

    componentWillReceiveProps(nextProps) {
        const { detailsId } = this.props;
        const { currentGoodsId } = this.state
        if (detailsId !== nextProps.detailsId) {
            this.getSeriesInfo(nextProps.tab, nextProps.detailsId, currentGoodsId)
            this.setState({
                detailsId: nextProps.detailsId,
            })
        }
    }


    getSeriesInfo(tab: number, detailsId: string, goodsId: string) {
        const { dispatch } = this.props;
        if (detailsId == '') { return }
        if (!detailsId) { return }
        let params = { "storeId": detailsId, "category": tab, "goodsId": goodsId };
        console.log('getSeriesInfo')
        dispatch({
            type: 'storeDetailList/storeGoods',
            payload: params,
        });
    }
    changeCtrl = (e:any)=>{
        const { dispatch, detailsId, tab } = this.props;
        let params = { "storeId": detailsId, "category": tab, "goodsId": e };
        dispatch({
            type: 'storeDetailList/storeGoods',
            payload: params,
        });
    }

    render() {
        const { tab, storeDetailList: { storeGoodsData } } = this.props;
        const { TabPane } = Tabs
        switch(tab){
            case 2 :
                // 婚庆
                return (
                    <WeddingServiceSeriesInfo storeGoodArr={storeGoodsData ? storeGoodsData : {}} changeCtrl={this.changeCtrl} />
                );
                break;
            case 3 :
                 //婚纱摄影
                return (
                    <WeddingPhotoSeriesInfo storeGoodArr={storeGoodsData ? storeGoodsData : {}} changeCtrl={this.changeCtrl}/> 
                );
                break;
            case 7 :
                // 礼服
                return (
                    <WeddingDressSeriesInfo storeGoodArr={storeGoodsData ? storeGoodsData : {}} changeCtrl={this.changeCtrl} />
                );
                break;
            default:
                break;
        }
        
        // 蜜月
        // return (
        //     <HoneyMoonSeriesInfo honeyMoonModel={newCategoryDetailData ? newCategoryDetailData : {}} />

        // );
        
    }
}
export default StoreDetailSeriesInfo;
