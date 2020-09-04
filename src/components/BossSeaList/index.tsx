import React, { Component } from 'react';
import { Select, message, Modal } from 'antd';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import LOCAL from '@/utils/LocalStorageKeys';
const { Option } = Select;
import styles from './style.less';
import {
    BossSea
} from './data.d';
import CrmUtil from '@/utils/UserInfoStorage';
import { UserInfo } from '@/pages/user/login/data';

interface BossSeaListState {
    currentUser: UserInfo | undefined,
    companyId: string | undefined,
    bossSeaList: BossSea[],
    bossSeaVisible: boolean
}

interface BossSeaListProps {
    bossSeaOnChange?: ((seaId: string) => void);
}

class BossSeaList extends Component<BossSeaListProps, BossSeaListState> {
    state: BossSeaListState = {
        currentUser: undefined,
        companyId: undefined,
        bossSeaList: [],
        bossSeaVisible: false
    }

    componentDidMount() {
        try {
            const currentUserInfo = CrmUtil.getUserInfo();
            if (currentUserInfo !== undefined) {
                const dataAuthority: (1 | 2 | 3 | 4) = currentUserInfo.data_authority;
                const that = this;
                this.setState({
                    currentUser: currentUserInfo,
                    companyId: currentUserInfo.company_id
                }, () => {
                    if (that.state.companyId !== undefined) {
                        that.fetchSeaWorkPanelList();
                    }
                })

                console.log('currentUserInfo:', currentUserInfo);
                console.log('dataAuthority:', dataAuthority);
            }
        } catch {
            console.log('获取海域出错！！');
        }
    }

    fetchSeaWorkPanelList = () => {
        // const { dispatch } = this.props;
        const { companyId } = this.state;
        const that = this;
        const params = {
            companyId: companyId
        };
        Axios.post(URL.getBossSea, params).then(res => {
            if (res.code == 200) {
                let seaList = res.data.result;

                if (seaList && seaList.length > 0) {
                    localStorage && localStorage.setItem(LOCAL.SEA_LIST, JSON.stringify(seaList));
                    that.setState({
                        bossSeaList: seaList,
                        bossSeaVisible: true
                    });
                } else {
                    that.setState({
                        bossSeaVisible: false
                    });
                }
            }
        });
    }

    seaOnChange = (seaId: string) => {
        try {
            const { currentUser } = this.state;
            if (currentUser) {
                if (localStorage) {
                    let that = this;
                    const params = {
                        companyId: seaId
                    };
                    Axios.post(URL.setBossSea, params).then(res => {
                        if (res.code == 200) {
                            localStorage.setItem(LOCAL.SEA_ID, seaId);
                            Modal.info({
                                title: '提示',
                                content: '海域已切换，当前页面会自动刷新。',
                                centered: true,
                                onOk() {
                                    currentUser.company_id = seaId;
                                    localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(currentUser));
                                    that.setState({
                                        companyId: seaId
                                    }, () => {
                                        window.location.reload();
                                    });
                                },
                            });
                            // message.success('海域已切换');
                        }
                    });
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    render() {
        if (this.state == null) {
            return null;
        } else {
            const { bossSeaList, bossSeaVisible } = this.state;
            const current = localStorage.getItem(LOCAL.SEA_ID);
            return (
                <div className={styles.statItem} style={bossSeaVisible ? { display: 'block' } : { display: 'none' }}>
                    <Select
                        showSearch
                        style={{ width: 280 }}
                        value={current?.toString()}
                        placeholder='切换海域'
                        filterOption={(input, option) =>
                            option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.seaOnChange}>
                        {bossSeaList && bossSeaList.map((sea) => (
                            <Option value={sea.id.toString()} key={sea.name}>{sea.name}</Option>
                        ))}
                    </Select>
                </div>
            );
        }
    }
}

export default BossSeaList;