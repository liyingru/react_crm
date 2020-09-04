import React, { Component } from "react";
import styles from "./index.less";
import { List, message, Avatar, Spin, Card, Divider, Row, Col } from "antd";
import ListItemList from "../listItemList";
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action } from "redux";
import { connect } from "dva";
import { StateType } from "../../model";
// import { storeHotelListModel } from "../../data";
// import StateType from ''
// import reqwest from "reqwest";

interface storeListProps extends FormComponentProps {

    // 0 婚宴酒店, 1 婚纱摄影, 2 旅拍,3 婚庆服务,4 礼服,5 蜜月
    tab: number,
    params: { (key: string): string },
    dispatch: Dispatch<
        Action<
            | 'storeDetailList/hotelList'
            | 'storeDetailList/dressPhotoList'
            | 'storeDetailList/weddingList'
            | 'storeDetailList/hunqingList'
            | 'storeDetailList/clothingList'
            | 'storeDetailList/honeymoonList'
            | 'storeDetailList/newCategory'
        >
    >;
    loading: boolean;
    storeDetailList: StateType;
    gotoDetail: Function;
    recommend: Function;
}

interface storeListState {
    hasMore: any;
    loading: Boolean;
    data: Object
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

class StoreList extends Component<storeListProps, storeListState>  {
    state: storeListState = {
        hasMore: '',
        loading: false,
        data: {}
    };
    componentDidMount() {
       
    }
    constructor(props: any) {
        super(props);
    }
    initCallback = (data: Object) => {
        this.setState({
            data: data,
            loading: false
        }, () => { this.render() });
    }

    initListCtrl = (tab: number, params: Object, pagination: Object) => {
        const { dispatch,customerId,requirementId, } = this.props;
        let firstParam = {
            'filter': params,
            category: tab,
            ...pagination,
            customerId:customerId ? customerId:'',
            reqId:requirementId?requirementId:'',
        }
        
        dispatch({
            type: 'storeDetailList/newCategory',
            payload: firstParam,
            callback: this.initCallback,
        });
    }



    render() {
        const {
            storeDetailList: {
                hotelListData,
                dressPhotoListData,
                journeyPhtoListData,
                weddingServiceListData,
                clothingListData,
                honeymoonListData,
                newCategoryListData,
                
            },
            tab,
            gotoDetail,
            recommend,
            searchParams,
            customerData,
            customerId,
            requirementId,
        } = this.props;

        let { data } = this.state;
        data = newCategoryListData
        return (
            <div className={styles.container}>

                <List
                    dataSource={data && data.rows}
                    split={false}
                    bordered={false}
                    // grid={{ gutter: 16, column: 2 }}
                    pagination={{
                        ...data?.pagination,
                        onChange: (page) => {
                            this.initListCtrl(tab, searchParams, {
                                page,
                                pageSize: 10
                            })
                        }
                    }}
                    renderItem={item => (
                        <List.Item style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 24 }}>
                            <Card style={{ width: '100%' }}>
                                <ListItemList
                                    tab={tab}
                                    listData= {item}
                                    gotoDetail={gotoDetail}
                                    recommend={recommend}
                                    customerData={customerData}
                                    customerId={customerId}
                                    requirementId={requirementId}
                                />
                            </Card>
                        </List.Item>
                    )}
                >
                    {this.state.loading && this.state.hasMore && (
                        <div className="demo-loading-container">
                            <Spin />
                        </div>
                    )}
                </List>
            </div>
        );
    }
}

export default StoreList;
