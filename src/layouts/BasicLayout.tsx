/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import { LeftOutlined } from '@ant-design/icons';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import logo from '../assets/crm_logo.svg';
import { globalContext } from '@/utils/context';
import SocketIO from '@/utils/socketIO';
import LOCAL from '@/utils/LocalStorageKeys';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="抱歉, 您没有权限访问这个页面。"
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
interface RawMenuData {
  id: string;
  name: string;
  is_menu: 0 | 1;
  icon: string;
  pid: string;
  hasChild: 0 | 1;
  childlist: RawMenuData[];
  child?: RawMenuData[];
  status: 0 | 1;
  code: string;
  path: string;
  weight: number;
  spacer: string;
  remark: string;
  menu_type: 0 | 1 | 2;
}
// interface MenuData {
//   path: string;
//   name: string;
//   icon: string;
//   children: MenuData[];
// }
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
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
);

const footerRender: BasicLayoutProps['footerRender'] = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      <div
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
      </div>
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */

  const [menuData, setMenuData] = useState([]);

  const makeMenusJson = (rawMenus: RawMenuData[]): any => {
    const menus = [];

    for (let i = 0; i < rawMenus.length; i++) {
      const children = [];

      for (let j = 0; j < rawMenus[i].childlist.length; j++) {
        children[j] = {
          path: rawMenus[i].childlist[j].path ? rawMenus[i].childlist[j].path : '',
          name: rawMenus[i].childlist[j].name,
          icon: rawMenus[i].childlist[j].icon,
        };
      }

      menus[i] = {
        path: rawMenus[i].path ? rawMenus[i].path : '',
        name: rawMenus[i].name,
        icon: rawMenus[i].icon,
        children,
      };
    }

    return menus;
  };

  // const loadMenu = async () => {
  //   await fetch('/menu.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       setMenuData(data || []);
  //     });
  // };

  useEffect(() => {
    Axios.post(URL.leftMenu).then(res => {
      if (res.code == 200) {
        const rawMenus: RawMenuData[] = res.data.result;
        const data = makeMenusJson(rawMenus);
        setMenuData(data || []);
      } else {
      }
    }); // loadMenu();

    if (LOCAL.ENABLED_SOCKET_IO) {
      if (SocketIO.currentSocket == undefined || SocketIO.currentSocket == null) {
        SocketIO.socketStart();
      }
    }

  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const back = () => {
    history.back();
  };

  const reloadCheck = () => {
    const forceReload = localStorage && localStorage.getItem('forceReload');
    if (forceReload == '1') {
      localStorage.setItem('forceReload', '0');
      window.location.reload();
    }
    return (children);
  }

  return (
    <ProLayout
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        // localStorage?.setItem(LOCAL.AUTO_REFRESH, '1');
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0; // return first && <Button onClick={back}><LeftOutlined />返回</Button>
        return first ? (
          <div
            style={{
              float: 'left',
            }}
          >
            <a
              onClick={back}
              style={{
                marginRight: 20,
              }}
            >
              <LeftOutlined />
            </a>
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          </div>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={footerRender}
      menuDataRender={() => menuData}
      rightContentRender={rightProps =>
        <div style={{ float: 'right' }}>
          <globalContext.Provider
            value={{
              unreadCount: (localStorage && localStorage.getItem(LOCAL.UNREAD_MESSAGE_COUNT)) ?? '0'
            }}>
            <RightContent {...rightProps} style={{ width: '100%' }} />
          </globalContext.Provider>
        </div>}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {reloadCheck()}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
