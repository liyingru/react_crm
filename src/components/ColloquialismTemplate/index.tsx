import React, { Component } from 'react';
import styles from './index.less';
import { Tabs, Select, AutoComplete } from 'antd';
import { HeartTwoTone, HeartFilled, HeartOutlined } from '@ant-design/icons';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';
const { TabPane } = Tabs;
const { Option } = Select;

class ColloquialismTemplate extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            loading: false,
            isNull: '查询话术，请先搜索关键字',
            name: ''
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
        this.initDataCtrl('', '');
        // this.checkHtmlTxtCtrl();
    }
    initDataCtrl = (keyword: any, id: any) => {
        this.setState({ loading: true, list: [] })
        let params = {};
        if (keyword) {
            params.keyword = keyword;
        }
        if (id) {
            params.id = id;
        }
        Axios.post(URL.getSearchKnowledge, params).then(
            res => {
                if (res.code == 200) {
                    res.data.result.rows.map((item) => {
                        item.answer && item.answer.map((target) => {
                            return target.isLength = false
                        });
                    });
                    this.setState({
                        list: res.data.result.rows,
                        loading: false,
                        isNull: '没有搜索到相关内容'
                    });
                }
            }
        );
    }
    checkHtmlTxtCtrl = (id: any) => {
        let params = {};
        params.id = id;
        Axios.post(URL.setPvToAnswer, params).then(
            res => {
                if (res.code == 200) {

                }
            }
        );
    }

    timeOut: NodeJS.Timeout | undefined = undefined;
    currentKeyWord: string | undefined = undefined;

    searchNameCtrl = (currentKey: string) => {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }
        if (!currentKey) {
            this.setState({
                list: [],
            })
        };
        this.setState({
            list: []
        })
        this.currentKeyWord = currentKey;
        this.timeOut = setTimeout(() => {
            this.initDataCtrl(currentKey, '');
        }, 1000);

    };

    onChangeInputText = (value: any) => {
        if (!value) return;
        this.initDataCtrl('', value.id)
        this.setState({
            name: value.title
        })
    }

    tabCtrl = (loading: any, list: any, isNull: any) => {
        return (
            <Tabs defaultActiveKey="1" type="card">
                <TabPane
                    tab={<span>话术检索</span>}
                    key="1"
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder={"请输入关键词"}
                        optionFilterProp="children"
                        style={{ width: '60%' }}
                        filterOption={false}
                        showArrow={false}
                        loading={loading}
                        defaultActiveFirstOption={false}
                        onSearch={this.searchNameCtrl}
                        onChange={this.onChangeInputText}
                        value={this.state.name}
                        notFoundContent={null}
                    >
                        {list && list.map(item =>
                            <Option value={item} label={item.keyword} key={item.id}>
                                <div>标题：{item.title}</div>
                            </Option>)
                        }
                    </Select>
                    {list.length == 0 ? <div className={styles.initData}>{isNull}</div> : <>{this.contentListCtrl(list)}</>}

                </TabPane>
                <TabPane
                    tab={<span>个人收藏</span>}
                    key="2"
                >
                    开发中...敬请期待
                </TabPane>
            </Tabs>
        )
    }

    contentListCtrl = (listArr: any) => {
        return (
            <div className={styles.list}>
                {listArr.map((item: any, index: any) =>
                    <div className={styles.h1} key={item.title}>
                        <div className={styles.p1} onClick={() => { this.clickCtrl(index) }}>话术标题：{item.title}</div>
                        <div className={styles.p2}>
                            {item.answer && item.answer.map((item: any, chilIndex: any) =>
                                <div className={styles.childWrap}>
                                    {!item.isLength ? (
                                        <>
                                            <span style={{ display: 'block', fontWeight: 'bold' }}>答案{chilIndex + 1}:</span>
                                            {item.content.substring(0, 50)}
                                            {item.content.length > 50 ? this.lookAllCtrlHtml(index, chilIndex, item.id) : ''}
                                        </>
                                    ) : (
                                            <>
                                                <span style={{ display: 'block', fontWeight: 'bold' }}>答案{chilIndex + 1}:</span>
                                                {item.content}
                                                {this.putItHtml(index, chilIndex)}
                                            </>
                                        )}
                                    {/* <p className={styles.like} onClick={() => { this.likeCtrl(index,chilIndex,item.id) }}>{item.like ? <HeartOutlined /> : <HeartFilled />}</p>
                                    <p className={styles.discuss}>
                                        <span onClick={() => { this.niceCtrl(index,chilIndex,item.id) }} className={styles.lfBt}>有用</span>
                                        <span onClick={() => { this.underDownCtrl(index,chilIndex,item.id) }} className={styles.rtBt}>吐槽</span>
                                    </p> */}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        )
    }
    clickCtrl = (index: any) => {
        console.log(index)
    }
    // 查看全部
    lookAllCtrlHtml = (index: any, chilIndex: any, id: any) => {
        return (<><span onClick={() => { this.lookAllTxt(index, chilIndex, id) }} className={styles.lookAll}>...<span>&gt; 查看全部</span></span></>);
    }
    lookAllTxt = (index: any, chilIndex: any, id: any) => {
        this.checkHtmlTxtCtrl(id);
        this.setState((prevState) => {
            this.state.list[index].answer[chilIndex].isLength = true;
            const list = [...prevState.list];
            return { list: list }
        })
    }
    // 收起
    putItHtml = (index: any, chilIndex: any) => {
        return (<><span onClick={() => { this.putItHtmlTxt(index, chilIndex) }} className={styles.lookAll}><span> &gt; 收起</span></span></>)
    }

    putItHtmlTxt = (index: any, chilIndex: any) => {
        this.setState((prevState) => {
            this.state.list[index].answer[chilIndex].isLength = false;
            const list = [...prevState.list];
            return { list: list }
        })
    }
    // 收藏
    likeCtrl = (index: any, chilIndex: any, id: any) => {
        this.setState((prevState) => {
            this.state.list[index].answer[chilIndex].like = !this.state.list[index].answer[chilIndex].like;
            const list = [...prevState.list];
            return { list: list }
        })
    }
    // 有用
    niceCtrl = (index: any, chilIndex: any, id: any) => {
        console.log(index)
    }
    // 吐槽
    underDownCtrl = (index: any, chilIndex: any, id: any) => {
        console.log(index)
    }
    render() {
        //const { data } = this.props;
        const { loading, list, isNull } = this.state;
        return (
            <div className={styles.wrap}>
                {this.tabCtrl(loading, list, isNull)}
            </div>
        )
    }
}
export default ColloquialismTemplate;