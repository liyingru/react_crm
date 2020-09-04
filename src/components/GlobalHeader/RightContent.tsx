import { Button, message } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva'; // import { formatMessage } from 'umi-plugin-react/locale';

import { ConnectProps, ConnectState } from '@/models/connect';
// import SelectLang from '../SelectLang';

import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import LOCAL from '@/utils/LocalStorageKeys';
import styles from './index.less';
import Avatar from './AvatarDropdown';
import NoticeIconView from './NoticeIconView';
import BossSeaList from '../BossSeaList';
import CrmUtil from '@/utils/UserInfoStorage';
// import HeaderSearch from '../HeaderSearch';
import ImportListModal from "@/components/CustomerImportModal"

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  if (CrmUtil.getCompanyTag() == 'SJZX' || CrmUtil.getCompanyTag() == 'DXL') {
    try {
      const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : '{}';
      const currentUserInfo = JSON.parse(currentUserInfoStr);
      const isChekIn = !!(
        currentUserInfo.check_in_or_out == 1 || currentUserInfo.check_in_or_out == '1'
      );
      const [checkInVisible, setCheckInVisible] = useState(!isChekIn);
      const [checkOutVisible, setCheckOutVisible] = useState(isChekIn);
      return (
        <div className={className}>
          {CrmUtil.getCompanyType() == 2 && <BossSeaList />}
          <ImportListModal />
          <Button
            type="primary"
            ghost
            style={{
              display: checkInVisible ? 'inline-block' : 'none',
            }}
            onClick={() => {
              const params = {
                checkId: currentUserInfo.id,
                checkInOrOut: '1',
              };
              Axios.post(URL.checkInOrOut, params).then(res => {
                if (res.code == 200) {
                  setCheckInVisible(false);
                  setCheckOutVisible(true);
                  currentUserInfo.check_in_or_out = 1;
                  localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(currentUserInfo));
                  message.success('上线成功');
                }
              });
            }}
          >
            上线
          </Button>
          <Button
            type="danger"
            ghost
            style={{
              display: checkOutVisible ? 'inline-block' : 'none',
            }}
            onClick={() => {
              const params = {
                checkId: currentUserInfo.id,
                checkInOrOut: '2',
              };
              Axios.post(URL.checkInOrOut, params).then(res => {
                if (res.code == 200) {
                  setCheckInVisible(true);
                  setCheckOutVisible(false);
                  currentUserInfo.check_in_or_out = 2;
                  localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(currentUserInfo));
                  message.success('离线成功');
                }
              });
            }}
          >
            离线
          </Button>
          {CrmUtil.getCompanyType() == 1 && <NoticeIconView />}
          <Avatar />
        </div>
      );
    } catch {
      return (
        <div className={className}>
          {CrmUtil.getCompanyType() == 2 && <BossSeaList />}
          <ImportListModal />
          {CrmUtil.getCompanyType() == 1 && <NoticeIconView />}
          <Avatar />
        </div>
      );
    }
  } else {
    return (
      <div className={className}>
        {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder={formatMessage({
         id: 'component.globalHeader.search',
        })}
        defaultValue="umi ui"
        dataSource={[
         formatMessage({
           id: 'component.globalHeader.search.example1',
         }),
         formatMessage({
           id: 'component.globalHeader.search.example2',
         }),
         formatMessage({
           id: 'component.globalHeader.search.example3',
         }),
        ]}
        onSearch={value => {
         console.log('input', value);
        }}
        onPressEnter={value => {
         console.log('enter', value);
        }}
        /> */}
        {/* <Tooltip
        title={formatMessage({
         id: 'component.globalHeader.help',
        })}
        >
        <a
         target="_blank"
         href="https://pro.ant.design/docs/getting-started"
         rel="noopener noreferrer"
         className={styles.action}
        >
         <Icon type="question-circle-o" />
        </a>
        </Tooltip> */}
        <BossSeaList />
        <ImportListModal />
        {CrmUtil.getCompanyType() == 1 && <NoticeIconView />}
        <Avatar />
        {/* <SelectLang className={styles.action} /> */}
      </div>
    );
  }
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
