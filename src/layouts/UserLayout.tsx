import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/crm_logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>{/* <SelectLang /> */}</div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>礼合CRM</span>
              </Link>
            </div>
            <div className={styles.desc}> 百合婚礼</div>
          </div>
          {children}
        </div>

        <DefaultFooter
          copyright="2019 百合婚礼技术部出品"
          links={[
            {
              key: 'BaiheWedding',
              title: '百合婚礼',
              href: 'https://hunli.baihe.com',
              blankTarget: true,
            },
            {
              key: 'LihePro',
              title: '礼合筹婚宝',
              href: '#',
              blankTarget: true,
            },
          ]}
        />

        {/* <div
         style={{
           padding: '0px 24px 24px',
           textAlign: 'center',
         }}
        >
         <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
           <img
             src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
             width="82px"
             alt="netlify logo"
           />
         </a>
        </div> */}
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
