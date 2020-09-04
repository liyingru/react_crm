import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/leaves/Documents/baihe_project/crm/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';
import wrapChildrenWithAliveScope from 'umi-plugin-keep-alive/lib/wrapChildrenWithAliveScope';

const Router = wrapChildrenWithAliveScope(
  require('dva/router').routerRedux.ConnectedRouter,
);

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__login" */ '../user/login'),
              LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                .default,
            })
          : require('../user/login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/leaves/Documents/baihe_project/crm/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__SecurityLayout" */ '../../layouts/SecurityLayout'),
          LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/SecurityLayout').default,
    routes: [
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
              LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/BasicLayout').default,
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/dashboardWorkplace',
            exact: true,
          },
          {
            name: '工作台',
            path: '/dashboardWorkplace',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DashboardWorkplace__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DashboardWorkplace/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DashboardWorkplace" */ '../DashboardWorkplace'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DashboardWorkplace').default,
            exact: true,
          },
          {
            name: '服务流程管理',
            path: '/lihePro',
            exact: true,
          },
          {
            name: '服务流程-流程列表',
            path: '/lihePro/Home',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LiheProManagement__LiheProHome__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LiheProManagement/LiheProHome/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LiheProManagement__LiheProHome" */ '../LiheProManagement/LiheProHome'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LiheProManagement/LiheProHome').default,
            exact: true,
          },
          {
            name: '服务流程-流程详情',
            path: '/lihePro/Detail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LiheProManagement__LiheProDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LiheProManagement/LiheProDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LiheProManagement__LiheProDetail" */ '../LiheProManagement/LiheProDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LiheProManagement/LiheProDetail').default,
            exact: true,
          },
          {
            name: '线索公海',
            path: '/claimTableList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__TrailHighSeas__ClaimTableList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TrailHighSeas/ClaimTableList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__TrailHighSeas__ClaimTableList" */ '../TrailHighSeas/ClaimTableList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../TrailHighSeas/ClaimTableList').default,
            exact: true,
          },
          {
            name: '线索公海-线索详情',
            path: '/claimTableList/leadsDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__leadsDetails__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/leadsDetails/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__leadsDetails" */ '../LeadsManagement/leadsDetails'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/leadsDetails').default,
            exact: true,
          },
          {
            name: '客诉管理',
            path: '/customerComplaintManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerComplaintManagement__list__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerComplaintManagement/list/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerComplaintManagement__list" */ '../CustomerComplaintManagement/list'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerComplaintManagement/list').default,
            exact: true,
          },
          {
            name: '客诉单详情',
            path: '/customerComplaintManagement/detail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerComplaintManagement__detail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerComplaintManagement/detail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerComplaintManagement__detail" */ '../CustomerComplaintManagement/detail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerComplaintManagement/detail').default,
            exact: true,
          },
          {
            name: '线索',
            path: '/leads',
            exact: true,
          },
          {
            name: '新建线索',
            path: '/leads/newLeads',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '我的线索',
            path: '/leads/leadsManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__leadsList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/leadsList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__leadsList" */ '../LeadsManagement/leadsList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/leadsList').default,
            exact: true,
          },
          {
            name: '到喜啦线索列表',
            path: '/leads/dxlLeadsManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DxlLeadsManagement__dxlLeadsList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DxlLeadsManagement/dxlLeadsList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DxlLeadsManagement__dxlLeadsList" */ '../DxlLeadsManagement/dxlLeadsList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DxlLeadsManagement/dxlLeadsList').default,
            exact: true,
          },
          {
            name: '到喜啦线索列表-新建客资',
            path: '/leads/dxlLeadsManagement/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '线索分配',
            path: '/leads/distributeList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__distributeList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/distributeList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__distributeList" */ '../LeadsManagement/distributeList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/distributeList').default,
            exact: true,
          },
          {
            name: '线索分配-线索详情',
            path: '/leads/distributeList/leadsDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__leadsDetails__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/leadsDetails/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__leadsDetails" */ '../LeadsManagement/leadsDetails'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/leadsDetails').default,
            exact: true,
          },
          {
            name: '我的线索-新建客资',
            path: '/leads/leadsManagement/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '线索详情',
            path: '/leads/leadsManagement/leadsDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__leadsDetails__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/leadsDetails/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__leadsDetails" */ '../LeadsManagement/leadsDetails'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/leadsDetails').default,
            exact: true,
          },
          {
            name: '有效单管理',
            path: '/demand',
            exact: true,
          },
          {
            name: '有效单公海',
            path: '/demand/demandCommonSea',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DemandManagement__demandCommonSea__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DemandManagement/demandCommonSea/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DemandManagement__demandCommonSea" */ '../DemandManagement/demandCommonSea'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DemandManagement/demandCommonSea').default,
            exact: true,
          },
          {
            name: '有效单死海',
            path: '/demand/demandCommonDeadSea',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DemandManagement__demandCommonSea__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DemandManagement/demandCommonSea/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DemandManagement__demandCommonSea" */ '../DemandManagement/demandCommonSea'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DemandManagement/demandCommonSea').default,
            exact: true,
          },
          {
            name: '全部有效单',
            path: '/demand/demandListAll',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DemandManagement__demandList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DemandManagement/demandList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DemandManagement__demandList" */ '../DemandManagement/demandList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DemandManagement/demandList').default,
            exact: true,
          },
          {
            name: '我的有效单列表',
            path: '/demand/demandManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DemandManagement__demandList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DemandManagement/demandList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DemandManagement__demandList" */ '../DemandManagement/demandList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DemandManagement/demandList').default,
            exact: true,
          },
          {
            name: '有效单质检',
            path: '/demand/demandsQaList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DemandManagement__demandList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DemandManagement/demandList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DemandManagement__demandList" */ '../DemandManagement/demandList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DemandManagement/demandList').default,
            exact: true,
          },
          {
            name: '有效单列表-新建客资',
            path: '/demand/demandManagement/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '有效单详情',
            path: '/demand/demandManagement/demandDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__dxl__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/dxl/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__dxl" */ '../CustomerManagement/customerDetail/dxl'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/dxl').default,
            exact: true,
          },
          {
            name: '有效单详情',
            path: '/demand/demandsQaList/demandDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__dxl__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/dxl/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__dxl" */ '../CustomerManagement/customerDetail/dxl'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/dxl').default,
            exact: true,
          },
          {
            name: '有效单详情',
            path: '/demand/demandListAll/demandDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__dxl__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/dxl/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__dxl" */ '../CustomerManagement/customerDetail/dxl'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/dxl').default,
            exact: true,
          },
          {
            name: '有效单详情',
            path: '/demand/demandCommonSea/demandDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__dxl__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/dxl/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__dxl" */ '../CustomerManagement/customerDetail/dxl'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/dxl').default,
            exact: true,
          },
          {
            name: '有效单详情',
            path: '/demand/demandCommonDeadSea/demandDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__dxl__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/dxl/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__dxl" */ '../CustomerManagement/customerDetail/dxl'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/dxl').default,
            exact: true,
          },
          {
            name: '客户',
            path: '/customer',
            exact: true,
          },
          {
            name: '客户列表',
            path: '/customer/customerManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerList" */ '../CustomerManagement/customerList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerList').default,
            exact: true,
          },
          {
            name: '新建客资',
            icon: 'smile',
            path: '/customer/customerManagement/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '客户详情',
            path: '/customer/customerManagement/customerDetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__dxl__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/dxl/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__dxl" */ '../CustomerManagement/customerDetail/dxl'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/dxl').default,
            exact: true,
          },
          {
            name: '发起客户重单',
            path: '/customer/customerManagement/startDuplicateCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__startDuplicateCustomer__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/startDuplicateCustomer/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__startDuplicateCustomer" */ '../CustomerManagement/startDuplicateCustomer'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/startDuplicateCustomer').default,
            exact: true,
          },
          {
            name: '客资导入',
            path: '/passengerImport',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__PassengerImport__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/PassengerImport/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__PassengerImport" */ '../PassengerImport'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../PassengerImport').default,
            exact: true,
          },
          {
            name: '订单',
            path: '/order',
            exact: true,
          },
          {
            name: '订单列表',
            path: '/order/orderManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__orderHome__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/orderHome/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__orderHome" */ '../OrderManagement/orderHome'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/orderHome').default,
            exact: true,
          },
          {
            name: '新建订单',
            path: '/order/newOrder',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__newOrder__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/newOrder/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__newOrder" */ '../OrderManagement/newOrder'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/newOrder').default,
            exact: true,
          },
          {
            name: '新建订单-新建客资',
            path: '/order/newOrder/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '订单详情页',
            path: '/order/orderManagement/orderDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__orderDetails__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/orderDetails/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__orderDetails" */ '../OrderManagement/orderDetails'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/orderDetails').default,
            exact: true,
          },
          {
            name: '新建合同',
            path: '/order/orderManagement/newContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__newContractNew__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/newContractNew/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__newContractNew" */ '../OrderManagement/newContractNew'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/newContractNew').default,
            exact: true,
          },
          {
            name: '编辑合同',
            path: '/order/orderManagement/editContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__editContract__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/editContract/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__editContract" */ '../OrderManagement/editContract'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/editContract').default,
            exact: true,
          },
          {
            name: '销售',
            path: '/saleManagement',
            exact: true,
          },
          {
            name: '婚宴销售列表',
            path: '/saleManagement/hy/saleList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SaleManagement__saleList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SaleManagement/saleList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SaleManagement__saleList" */ '../SaleManagement/saleList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SaleManagement/saleList').default,
            exact: true,
          },
          {
            name: '婚宴销售列表-新建客资',
            icon: 'smile',
            path: '/saleManagement/hy/saleList/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '婚宴销售列表-领取订单',
            path: '/saleManagement/hy/saleList/getOrder',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SaleManagement__getOrder__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SaleManagement/getOrder/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SaleManagement__getOrder" */ '../SaleManagement/getOrder'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SaleManagement/getOrder').default,
            exact: true,
          },
          {
            name: '婚宴销售列表-获取订单-新建客资',
            icon: 'smile',
            path: '/saleManagement/hy/saleList/getOrder/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '婚宴销售列表-订单详情页',
            path: '/saleManagement/hy/saleList/orderDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '婚宴销售列表-客户详情页',
            path: '/saleManagement/hy/saleList/customerDetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '婚宴销售列表-订单详情页-新建合同',
            path: '/saleManagement/hy/saleList/orderDetails/newContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__newContractNew__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/newContractNew/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__newContractNew" */ '../OrderManagement/newContractNew'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/newContractNew').default,
            exact: true,
          },
          {
            name: '婚宴销售列表-订单详情页-编辑合同',
            path: '/saleManagement/hy/saleList/orderDetails/editContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__editContract__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/editContract/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__editContract" */ '../OrderManagement/editContract'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/editContract').default,
            exact: true,
          },
          {
            name: '婚庆销售列表',
            path: '/saleManagement/hq/saleList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SaleManagement__saleList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SaleManagement/saleList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SaleManagement__saleList" */ '../SaleManagement/saleList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SaleManagement/saleList').default,
            exact: true,
          },
          {
            name: '婚庆销售列表-新建客资',
            icon: 'smile',
            path: '/saleManagement/hq/saleList/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '婚庆销售列表-领取订单',
            path: '/saleManagement/hq/saleList/getOrder',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SaleManagement__getOrder__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SaleManagement/getOrder/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SaleManagement__getOrder" */ '../SaleManagement/getOrder'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SaleManagement/getOrder').default,
            exact: true,
          },
          {
            name: '婚庆销售列表-获取订单-新建客资',
            icon: 'smile',
            path: '/saleManagement/hq/saleList/getOrder/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '婚庆销售列表-订单详情页',
            path: '/saleManagement/hq/saleList/orderDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '婚庆销售列表-客户详情页',
            path: '/saleManagement/hq/saleList/customerDetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '婚庆销售列表-订单详情页-新建合同',
            path: '/saleManagement/hq/saleList/orderDetails/newContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__newContractNew__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/newContractNew/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__newContractNew" */ '../OrderManagement/newContractNew'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/newContractNew').default,
            exact: true,
          },
          {
            name: '婚庆销售列表-订单详情页-编辑合同',
            path: '/saleManagement/hq/saleList/orderDetails/editContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__editContract__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/editContract/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__editContract" */ '../OrderManagement/editContract'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/editContract').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表',
            path: '/saleManagement/hslf/saleList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SaleManagement__saleList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SaleManagement/saleList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SaleManagement__saleList" */ '../SaleManagement/saleList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SaleManagement/saleList').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表-新建客资',
            icon: 'smile',
            path: '/saleManagement/hslf/saleList/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表-领取订单',
            path: '/saleManagement/hslf/saleList/getOrder',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SaleManagement__getOrder__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SaleManagement/getOrder/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SaleManagement__getOrder" */ '../SaleManagement/getOrder'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SaleManagement/getOrder').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表-获取订单-新建客资',
            icon: 'smile',
            path: '/saleManagement/hslf/saleList/getOrder/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表-订单详情页',
            path: '/saleManagement/hslf/saleList/orderDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表-客户详情页',
            path: '/saleManagement/hslf/saleList/customerDetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表-订单详情页-新建合同',
            path: '/saleManagement/hslf/saleList/orderDetails/newContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__newContractNew__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/newContractNew/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__newContractNew" */ '../OrderManagement/newContractNew'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/newContractNew').default,
            exact: true,
          },
          {
            name: '婚纱礼服销售列表-订单详情页-编辑合同',
            path: '/saleManagement/hslf/saleList/orderDetails/editContract',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderManagement__editContract__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/OrderManagement/editContract/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderManagement__editContract" */ '../OrderManagement/editContract'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderManagement/editContract').default,
            exact: true,
          },
          {
            name: '产品管理',
            path: '/product',
            exact: true,
          },
          {
            name: '产品列表',
            path: '/product/productHome',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ProductManagement__ProductHome__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ProductManagement/ProductHome/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ProductManagement__ProductHome" */ '../ProductManagement/ProductHome'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ProductManagement/ProductHome').default,
            exact: true,
          },
          {
            name: '新建产品',
            path: '/product/newProduct',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ProductManagement__NewProduct__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ProductManagement/NewProduct/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ProductManagement__NewProduct" */ '../ProductManagement/NewProduct'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ProductManagement/NewProduct').default,
            exact: true,
          },
          {
            name: '产品详情',
            path: '/product/productDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ProductManagement__ProductDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ProductManagement/ProductDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ProductManagement__ProductDetail" */ '../ProductManagement/ProductDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ProductManagement/ProductDetail').default,
            exact: true,
          },
          {
            name: '新建商家',
            path: '/product/newSeller',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ProductManagement__NewSeller__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ProductManagement/NewSeller/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ProductManagement__NewSeller" */ '../ProductManagement/NewSeller'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ProductManagement/NewSeller').default,
            exact: true,
          },
          {
            name: '系统管理',
            path: '/system',
            exact: true,
          },
          {
            name: '公司管理',
            path: '/system/companyManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SystemManagement__CompanyManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SystemManagement/CompanyManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SystemManagement__CompanyManagement" */ '../SystemManagement/CompanyManagement'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SystemManagement/CompanyManagement').default,
            exact: true,
          },
          {
            name: '部门管理',
            path: '/system/structureManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SystemManagement__StructureManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SystemManagement/StructureManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SystemManagement__StructureManagement" */ '../SystemManagement/StructureManagement'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SystemManagement/StructureManagement').default,
            exact: true,
          },
          {
            name: '职位管理',
            path: '/system/positionManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SystemManagement__PositionManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SystemManagement/PositionManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SystemManagement__PositionManagement" */ '../SystemManagement/PositionManagement'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SystemManagement/PositionManagement').default,
            exact: true,
          },
          {
            name: '角色管理',
            path: '/system/roleManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SystemManagement__RoleManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SystemManagement/RoleManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SystemManagement__RoleManagement" */ '../SystemManagement/RoleManagement'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SystemManagement/RoleManagement').default,
            exact: true,
          },
          {
            name: '菜单管理',
            path: '/system/menuManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SystemManagement__MenuManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SystemManagement/MenuManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SystemManagement__MenuManagement" */ '../SystemManagement/MenuManagement'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SystemManagement/MenuManagement').default,
            exact: true,
          },
          {
            name: '用户管理',
            path: '/system/userManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SystemManagement__UserManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SystemManagement/UserManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SystemManagement__UserManagement" */ '../SystemManagement/UserManagement'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SystemManagement/UserManagement').default,
            exact: true,
          },
          {
            name: '数据配置',
            path: '/dataConfig',
            exact: true,
          },
          {
            name: '投放活动',
            path: '/dataConfig/activityManagement',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DataConfigManagement__activityConfig__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DataConfigManagement/activityConfig/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DataConfigManagement__activityConfig" */ '../DataConfigManagement/activityConfig'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DataConfigManagement/activityConfig').default,
            exact: true,
          },
          {
            name: '数据配置-客资来源',
            path: '/dataConfig/customerFromConfig',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DataConfigManagement__customerFromConfig__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/DataConfigManagement/customerFromConfig/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DataConfigManagement__customerFromConfig" */ '../DataConfigManagement/customerFromConfig'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../DataConfigManagement/customerFromConfig').default,
            exact: true,
          },
          {
            name: '商家管理',
            path: '/store',
            exact: true,
          },
          {
            name: '商家明细',
            path: '/store/storeDetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__StoreManagement__store__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/StoreManagement/store/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__StoreManagement__store" */ '../StoreManagement/store'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../StoreManagement/store').default,
            exact: true,
          },
          {
            name: '分组',
            path: '/group',
            exact: true,
          },
          {
            name: '分组管理',
            path: '/group/grouphome',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__GroupMangement__groupHome__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/GroupMangement/groupHome/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__GroupMangement__groupHome" */ '../GroupMangement/groupHome'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../GroupMangement/groupHome').default,
            exact: true,
          },
          {
            name: '新建分组',
            path: '/group/groupnew',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__GroupMangement__NewGroup__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/GroupMangement/NewGroup/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__GroupMangement__NewGroup" */ '../GroupMangement/NewGroup'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../GroupMangement/NewGroup').default,
            exact: true,
          },
          {
            name: '分组详情',
            path: '/groupdetail/:id',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__GroupMangement__GroupDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/GroupMangement/GroupDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__GroupMangement__GroupDetail" */ '../GroupMangement/GroupDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../GroupMangement/GroupDetail').default,
            exact: true,
          },
          {
            name: '客资来源管理',
            path: '/sunnyrules',
            exact: true,
          },
          {
            name: '数据分配规则列表',
            path: '/sunnyrules/distributeruleslist',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__DistributeRulesList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/DistributeRulesList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__DistributeRulesList" */ '../SunnyRulesManagement/DistributeRulesList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/DistributeRulesList').default,
            exact: true,
          },
          {
            name: '新建数据分配规则',
            path: '/sunnyrules/distributeruleslist/newdistributerules',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__NewDistributeRules__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/NewDistributeRules/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__NewDistributeRules" */ '../SunnyRulesManagement/NewDistributeRules'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/NewDistributeRules').default,
            exact: true,
          },
          {
            name: '编辑数据分配规则',
            path: '/sunnyrules/distributeruleslist/editdistributerules',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__NewDistributeRules__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/NewDistributeRules/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__NewDistributeRules" */ '../SunnyRulesManagement/NewDistributeRules'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/NewDistributeRules').default,
            exact: true,
          },
          {
            name: '数据分配规则详情',
            path: '/sunnyrules/distributeruleslist/distributeruledetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__DistributeRuleDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/DistributeRuleDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__DistributeRuleDetail" */ '../SunnyRulesManagement/DistributeRuleDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/DistributeRuleDetail').default,
            exact: true,
          },
          {
            name: '数据分配规则的数据明细',
            path:
              '/sunnyrules/distributeruleslist/distributeruledetail/datasheet',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__DistributeRuleDataSheet__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/DistributeRuleDataSheet/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__DistributeRuleDataSheet" */ '../SunnyRulesManagement/DistributeRuleDataSheet'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/DistributeRuleDataSheet')
                  .default,
            exact: true,
          },
          {
            name: 'QA配规则列表',
            path: '/sunnyrules/qaruleslist',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__QaRulesList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/QaRulesList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__QaRulesList" */ '../SunnyRulesManagement/QaRulesList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/QaRulesList').default,
            exact: true,
          },
          {
            name: '新建QA规则',
            path: '/sunnyrules/qaruleslist/newqarules',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__NewQaRules__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/NewQaRules/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__NewQaRules" */ '../SunnyRulesManagement/NewQaRules'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/NewQaRules').default,
            exact: true,
          },
          {
            name: '编辑QA规则',
            path: '/sunnyrules/qaruleslist/editqarules',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__NewQaRules__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/NewQaRules/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__NewQaRules" */ '../SunnyRulesManagement/NewQaRules'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/NewQaRules').default,
            exact: true,
          },
          {
            name: 'QA规则详情',
            path: '/sunnyrules/qaruleslist/qaruledetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__QaRuleDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/QaRuleDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__QaRuleDetail" */ '../SunnyRulesManagement/QaRuleDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/QaRuleDetail').default,
            exact: true,
          },
          {
            name: '客资来源列表',
            path: '/sunnyrules/sunnyruleslist',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__SunnyRulesList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/SunnyRulesList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__SunnyRulesList" */ '../SunnyRulesManagement/SunnyRulesList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/SunnyRulesList').default,
            exact: true,
          },
          {
            name: '规则配置详情',
            path: '/sunnyrules/sunnyruleslist/ruledetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__RuleDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/RuleDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__RuleDetail" */ '../SunnyRulesManagement/RuleDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/RuleDetail').default,
            exact: true,
          },
          {
            name: '新建规则',
            path: '/sunnyrules/newrules',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__NewSunnyRules__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/NewSunnyRules/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__NewSunnyRules" */ '../SunnyRulesManagement/NewSunnyRules'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/NewSunnyRules').default,
            exact: true,
          },
          {
            name: '编辑规则',
            path: '/sunnyrules/sunnyruleslist/editrules',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__SunnyRulesManagement__NewSunnyRules__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/SunnyRulesManagement/NewSunnyRules/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__SunnyRulesManagement__NewSunnyRules" */ '../SunnyRulesManagement/NewSunnyRules'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../SunnyRulesManagement/NewSunnyRules').default,
            exact: true,
          },
          {
            name: '任务管理',
            path: '/task',
            exact: true,
          },
          {
            name: '任务列表',
            path: '/task/tasklist',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__TaskManagement__TaskList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TaskManagement/TaskList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__TaskManagement__TaskList" */ '../TaskManagement/TaskList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../TaskManagement/TaskList').default,
            exact: true,
          },
          {
            name: '任务详情',
            path: '/task/taskdetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__TaskManagement__TaskDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TaskManagement/TaskDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__TaskManagement__TaskDetail" */ '../TaskManagement/TaskDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../TaskManagement/TaskDetail').default,
            exact: true,
          },
          {
            name: '新建任务',
            path: '/task/newtask',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__TaskManagement__NewTask__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TaskManagement/NewTask/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__TaskManagement__NewTask" */ '../TaskManagement/NewTask'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../TaskManagement/NewTask').default,
            exact: true,
          },
          {
            path: '/review/reviewlist',
            name: '审核管理',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ReviewManagement__reviewList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ReviewManagement/reviewList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ReviewManagement__reviewList" */ '../ReviewManagement/reviewList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ReviewManagement/reviewList').default,
            exact: true,
          },
          {
            path: '/review/reviewlist/detail',
            name: '审核详情',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ReviewManagement__reviewDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ReviewManagement/reviewDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ReviewManagement__reviewDetail" */ '../ReviewManagement/reviewDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ReviewManagement/reviewDetail').default,
            exact: true,
          },
          {
            path: '/review/reviewlist/repeatDetail',
            name: '客户重复详情',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ReviewManagement__repeatDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ReviewManagement/repeatDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ReviewManagement__repeatDetail" */ '../ReviewManagement/repeatDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ReviewManagement/repeatDetail').default,
            exact: true,
          },
          {
            path: '/review/reviewlist/requirementBackToSeasDetail',
            name: '有效单退回公海/死海审批',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ReviewManagement__requirementBackToSeasDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ReviewManagement/requirementBackToSeasDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ReviewManagement__requirementBackToSeasDetail" */ '../ReviewManagement/requirementBackToSeasDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ReviewManagement/requirementBackToSeasDetail')
                  .default,
            exact: true,
          },
          {
            path: '/process',
            name: '流程管理',
            exact: true,
          },
          {
            name: '流程列表',
            path: '/process/processList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ProcessManagement__processList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ProcessManagement/processList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ProcessManagement__processList" */ '../ProcessManagement/processList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ProcessManagement/processList').default,
            exact: true,
          },
          {
            name: '新建审批流',
            path: '/process/newProcess',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ProcessManagement__newProcess__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ProcessManagement/newProcess/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ProcessManagement__newProcess" */ '../ProcessManagement/newProcess'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ProcessManagement/newProcess').default,
            exact: true,
          },
          {
            name: '修改审批流',
            path: '/process/processList/modifyProcess',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ProcessManagement__newProcess__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ProcessManagement/newProcess/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ProcessManagement__newProcess" */ '../ProcessManagement/newProcess'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ProcessManagement/newProcess').default,
            exact: true,
          },
          {
            name: '修改密码',
            path: '/changepassword',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ChangePassword__changePassword__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ChangePassword/changePassword/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ChangePassword__changePassword" */ '../ChangePassword/changePassword'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ChangePassword/changePassword').default,
            exact: true,
          },
          {
            name: '回款管理',
            icon: 'smile',
            path: '/money/moneyhome',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MoneyManagement__moneyList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/MoneyManagement/moneyList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MoneyManagement__moneyList" */ '../MoneyManagement/moneyList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../MoneyManagement/moneyList').default,
            exact: true,
          },
          {
            name: '回款详情',
            path: '/money/moneydetails',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MoneyManagement__moneyDetails__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/MoneyManagement/moneyDetails/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MoneyManagement__moneyDetails" */ '../MoneyManagement/moneyDetails'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../MoneyManagement/moneyDetails').default,
            exact: true,
          },
          {
            name: '目标管理',
            icon: 'pie-chart',
            path: '/targetManagement',
            exact: true,
          },
          {
            name: '客服目标',
            path: '/targetManagement/customerServiceTarget',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__TargetManagement__customerServiceTarget__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TargetManagement/customerServiceTarget/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__TargetManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TargetManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__TargetManagement__customerServiceTarget" */ '../TargetManagement/customerServiceTarget'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../TargetManagement/customerServiceTarget').default,
            exact: true,
          },
          {
            name: '销售目标',
            path: '/targetManagement/salesTarget',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__TargetManagement__salesTarget__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TargetManagement/salesTarget/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__TargetManagement__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/TargetManagement/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__TargetManagement__salesTarget" */ '../TargetManagement/salesTarget'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../TargetManagement/salesTarget').default,
            exact: true,
          },
          {
            name: '消息中心',
            path: '/messageCenter',
            exact: true,
          },
          {
            name: '消息中心 - 消息中心列表',
            path: '/messageCenter/messageCenterList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MessageCenter__messageCenterList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/MessageCenter/messageCenterList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MessageCenter__messageCenterList" */ '../MessageCenter/messageCenterList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../MessageCenter/messageCenterList').default,
            exact: true,
          },
          {
            name: '商家地图',
            path: '/storeMap',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__CrmMap" */ '../CrmMap'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CrmMap').default,
            exact: true,
          },
          {
            name: '话术管理',
            path: '/colloQuialism',
            exact: true,
          },
          {
            name: '话术管理 - 话术列表',
            path: '/colloQuialism/colloQuialismList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ColloQuialism__colloQuialismList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ColloQuialism/colloQuialismList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ColloQuialism__colloQuialismList" */ '../ColloQuialism/colloQuialismList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ColloQuialism/colloQuialismList').default,
            exact: true,
          },
          {
            name: '话术管理 - 反馈评价',
            path: '/colloQuialism/feedbackEvaluation',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ColloQuialism__feedbackEvaluation__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/ColloQuialism/feedbackEvaluation/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ColloQuialism__feedbackEvaluation" */ '../ColloQuialism/feedbackEvaluation'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../ColloQuialism/feedbackEvaluation').default,
            exact: true,
          },
          {
            name: '质检列表',
            path: '/qualityAssuranceList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__QAManagement__qualityAssuranceList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/QAManagement/qualityAssuranceList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__QAManagement__qualityAssuranceList" */ '../QAManagement/qualityAssuranceList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../QAManagement/qualityAssuranceList').default,
            exact: true,
          },
          {
            name: '质检详情',
            path: '/qualityAssuranceList/qualityAssuranceDetail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__QAManagement__qualityAssuranceDetail__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/QAManagement/qualityAssuranceDetail/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__QAManagement__qualityAssuranceDetail" */ '../QAManagement/qualityAssuranceDetail'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../QAManagement/qualityAssuranceDetail').default,
            exact: true,
          },
          {
            name: '北京BI',
            path: '/beiJingBI',
            exact: true,
          },
          {
            name: '北京BI - 北京BI列表',
            path: '/beiJingBI/list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__BeiJingBI__list__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/BeiJingBI/list/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__BeiJingBI__list" */ '../BeiJingBI/list'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../BeiJingBI/list').default,
            exact: true,
          },
          {
            name: '北京BI-新建客资',
            path: '/beiJingBI/list/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '邀约BI列表',
            path: '/bjReqBIList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__BeiJingBI__list__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/BeiJingBI/list/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__BeiJingBI__list" */ '../BeiJingBI/list'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../BeiJingBI/list').default,
            exact: true,
          },
          {
            name: '客户详情',
            path: '/beiJingBI/list/customerDetail_xp',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '提供人列表-集团版',
            path: '/bjSunnyGroupRecoderList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__sunnyListForGroup__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/sunnyListForGroup/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__sunnyListForGroup" */ '../CustomerManagement/sunnyListForGroup'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/sunnyListForGroup').default,
            exact: true,
          },
          {
            name: '提供人详情页',
            path: '/bjSunnyGroupRecoderList/detail_xp',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '新建客资-集团版',
            path: '/bjSunnyGroupRecoderList/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '提供人列表',
            path: '/bjRecoderList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__sunnyList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/sunnyList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__sunnyList" */ '../CustomerManagement/sunnyList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/sunnyList').default,
            exact: true,
          },
          {
            name: '提供人列表-新建客资',
            path: '/bjRecoderList/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '提供人详情页',
            path: '/bjRecoderList/detail_xp',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '需求人列表',
            path: '/bjLeadsList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__sunnyList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/sunnyList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__sunnyList" */ '../CustomerManagement/sunnyList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/sunnyList').default,
            exact: true,
          },
          {
            name: '需求人列表-新建客资',
            path: '/bjLeadsList/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '线索详情页',
            path: '/bjLeadsList/detail_xp',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '邀约列表',
            path: '/bjReqList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__sunnyList__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/sunnyList/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__sunnyList" */ '../CustomerManagement/sunnyList'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/sunnyList').default,
            exact: true,
          },
          {
            name: '邀约列表-新建客资',
            path: '/bjReqList/newCustomer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LeadsManagement__newLeads__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/LeadsManagement/newLeads/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LeadsManagement__newLeads" */ '../LeadsManagement/newLeads'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../LeadsManagement/newLeads').default,
            exact: true,
          },
          {
            name: '调休列表',
            path: '/paidLeaveTable/paidLeaveTableHome',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__PaidLeaveTable__PaidLeaveTableHome__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/PaidLeaveTable/PaidLeaveTableHome/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__PaidLeaveTable__PaidLeaveTableHome" */ '../PaidLeaveTable/PaidLeaveTableHome'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../PaidLeaveTable/PaidLeaveTableHome').default,
            exact: true,
          },
          {
            name: '有效单详情页',
            path: '/bjReqList/detail_xp',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerManagement__customerDetail__xp__model.ts' */ '/Users/leaves/Documents/baihe_project/crm/src/pages/CustomerManagement/customerDetail/xp/model.ts').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerManagement__customerDetail__xp" */ '../CustomerManagement/customerDetail/xp'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerManagement/customerDetail/xp').default,
            exact: true,
          },
          {
            name: '通用错误页',
            path: '/error',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__Error" */ '../Error'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../Error').default,
            exact: true,
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                  LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                    .default,
                })
              : require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/leaves/Documents/baihe_project/crm/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        name: '通用错误页',
        path: '/error',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Error" */ '../Error'),
              LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                .default,
            })
          : require('../Error').default,
        exact: true,
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/leaves/Documents/baihe_project/crm/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    name: '通用错误页',
    path: '/error',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__Error" */ '../Error'),
          LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
            .default,
        })
      : require('../Error').default,
    exact: true,
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
          LoadingComponent: require('/Users/leaves/Documents/baihe_project/crm/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('/Users/leaves/Documents/baihe_project/crm/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
