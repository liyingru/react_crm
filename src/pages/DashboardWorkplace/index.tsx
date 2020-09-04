import { Col, Button, Select, Row, Statistic, Card, Modal, Checkbox, Empty, message } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { connect } from 'dva';
import moment from 'moment';

import { ModalState } from './model';
import { DashboardWorkplaceParams, ReqrankingUser, OrderrankingUser, WorkNumbersType } from './data.d';

import WorkplaceConditions from './components/WorkplaceConditons';

import MyPerformanceWorkplace from './components/MyPerformanceWorkplace';
import SalesAssistantWorkplace from './components/SalesAssistantWorkplace';
import SalesPerformanceWorkplace from './components/SalesPerformanceWorkplace';
import ForecastPerformanceWorkplace from './components/ForecastPerformanceWorkplace';
import HonorListWorkplace from './components/HonorListWorkplace';
import SalesFunnelWorkplace from './components/SalesFunnelWorkplace';
import ApprovalCenterWorkplace from './components/ApprovalCenterWorkplace';
import CallAnalysisWorkplace from './components/CallAnalysisWorkplace';

import styles from './style.less';
import LOCAL from '@/utils/LocalStorageKeys';
import welcomeBg from '../assets/crm_logo.svg';

import {
  CurrentUser,
  SystemUser,
  BossSea,
  WorkPanel,
  MyPerformance,
  SalesAssistant,
  SalesPerformance,
  ForecastPerformance,
  HonorUser,
  SalesFunnel,
  ApprovalCenterOrder,
  CallAnalysis
} from './data.d';
import CrmUtil from '@/utils/UserInfoStorage';

const { Option } = Select;

interface DashboardWorkplaceState {
  currentUser: Partial<CurrentUser>;
  /** 1:个人和下属，2:所属部门，3:所属部门和下属部门，4:全公司 */
  dataAuthority: 1 | 2 | 3 | 4;
  bossSeaList: BossSea[];
  panels: Array<WorkPanel>;
  selectedPanels: Array<WorkPanel>;
  bossSeaVisible: boolean;
  customPanelVisible: boolean;
  companyId: string;
  structureId: string;
  startTime: string;
  endTime: string;
  nonorType: string;
  callAnalysisType: string;
}

interface DashboardWorkplaceProps {
  dashboardWorkplace: ModalState;
  currentUser: CurrentUser;
  workBenchNums: WorkNumbersType;
  userList: SystemUser[];

  companyList: [];
  structureList: [];

  bossSeaList: BossSea[];
  workPanelList: WorkPanel[];
  myPerformance: MyPerformance;
  salesAssistant: SalesAssistant;
  salesPerformance: SalesPerformance;
  forecastPerformance: ForecastPerformance;
  honorList: HonorUser[];
  reqrankingList: ReqrankingUser[];
  orderrankingList: OrderrankingUser[];
  salesFunnel: SalesFunnel;
  approvalCenterOrderList: ApprovalCenterOrder[];

  callAnalysisNormal: CallAnalysis;
  callAnalysisDialout: CallAnalysis;

  dispatch: Dispatch<any>;

  roleInfoLoading: boolean;
  myPerformanceLoading: boolean;
  salesAssistantLoading: boolean;
  salesPerformanceLoading: boolean;
  forecastPerformanceLoading: boolean;
  honorListLoading: boolean
  salesFunnelLoading: boolean;
  approvalCenterOrderListLoading: boolean;
  callAnalysisLoading: boolean;
}

// const PageHeaderContent: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
//   const loading = currentUser && Object.keys(currentUser).length;
//   if (!loading) {
//     return <Skeleton avatar paragraph={{ rows: 1 }} active />;
//   }
//   return (
//     <div className={styles.pageHeaderContent}>
//       <div className={styles.avatar}>
//         <Avatar size="small" src={currentUser.avatar} />
//       </div>
//       <div className={styles.content}>
//         <div className={styles.contentTitle}>
//           {currentUser.name}，祝你开心每一天！
//         </div>
//       </div>
//     </div>
//   );
// };

const ExtraContent: React.FC<{
  companyId: string,
  seaList: Array<BossSea>,
  visible: boolean,
  seaOnChange: ((seaId: string) => void),
  customOnClick: (() => void)
}> = ({ companyId, seaList, visible, seaOnChange, customOnClick }) => {
  try {
    return (
      <div className={styles.extraContent}>
        <div className={styles.statItem} style={visible ? { display: 'block' } : { display: 'none' }}>
          {/* <Select
            showSearch
            style={{ width: 280 }}
            value={companyId.toString()}
            placeholder='切换海域'
            filterOption={(input, option) =>
              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={seaOnChange}>
            {seaList && seaList.map((sea) => (
              <Option value={sea.id.toString()} key={sea.name}>{sea.name}</Option>
            ))}
          </Select> */}
        </div>
        <div className={styles.statItem}>
          <Button onClick={customOnClick}>自定义显示</Button>
        </div>
      </div>
    );
  } catch {
    return (<div></div>);
  }
}

const CustomPanelModel: React.FC<{
  panels: Array<WorkPanel>,
  visible: boolean,
  handleOk: (() => void),
  onCancel?: (() => void),
  checkboxOnChange: ((e: CheckboxChangeEvent) => void)
}> = ({ panels, visible, handleOk, onCancel, checkboxOnChange }) => {
  if (panels !== undefined) {
    return (
      <Modal
        key="CustomPanelModel"
        title="请选择展示的数据看板"
        centered
        width={500}
        visible={visible}
        onOk={handleOk}
        onCancel={onCancel}
      >
        <Row>
          {
            panels.map((panel, index) => {
              return (
                <Col span={6}>
                  <Checkbox value={index} key={index} checked={panel.is_show} onChange={checkboxOnChange} style={{ marginBottom: 15 }}>{panel.name}</Checkbox>
                </Col>
              );
            })
          }
        </Row>
      </Modal >
    );
  } else {
    return (<Empty />);
  }
}

@connect(
  ({
    dashboardWorkplace: {
      currentUser,
      companyList,
      structureList,
      userList,

      bossSeaList,
      workPaneList,
      workBenchNums,
      myPerformance,
      salesAssistant,
      salesPerformance,
      forecastPerformance,
      honorList,
      reqrankingList,
      orderrankingList,
      salesFunnel,
      approvalCenterOrderList,
      callAnalysisNormal,
      callAnalysisDialout },
    loading,
  }: {
    dashboardWorkplace: ModalState;
    loading: { effects: any };
  }) => ({
    currentUser,
    companyList,
    structureList,
    userList,

    bossSeaList,
    workPaneList,
    workBenchNums,
    myPerformance,
    salesAssistant,
    salesPerformance,
    forecastPerformance,
    honorList,
    reqrankingList,
    orderrankingList,
    salesFunnel,
    approvalCenterOrderList,
    callAnalysisNormal,
    callAnalysisDialout,
    roleInfoLoading: loading.effects['dashboardWorkplace/fetchRoleInfo'],
    myPerformanceLoading: loading.effects['dashboardWorkplace/fetchMyPerformance'],
    salesAssistantLoading: loading.effects['dashboardWorkplace/fetchSalesAssistant'],
    salesPerformanceLoading: loading.effects['dashboardWorkplace/fetchSalesPerformance'],
    forecastPerformanceLoading: loading.effects['dashboardWorkplace/fetchForecastPerformance'],
    honorListLoading: loading.effects['dashboardWorkplace/fetchHonorList'],
    salesFunnelLoading: loading.effects['dashboardWorkplace/fetchSalesFunnel'],
    approvalCenterOrderListLoading: loading.effects['dashboardWorkplace/fetchApprovalCenter'],
    callAnalysisLoading: loading.effects['dashboardWorkplace/fetchCallAnalysis']
  }),
)

class DashboardWorkplace extends Component<DashboardWorkplaceProps, DashboardWorkplaceState> {
  state: DashboardWorkplaceState = {
    currentUser: {},
    dataAuthority: 1,
    bossSeaList: [],
    companyId: '',
    structureId: '',
    startTime: moment().format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    nonorType: 'nonor',
    callAnalysisType: 'normal',
    panels: [],
    selectedPanels: [],
    bossSeaVisible: false,
    customPanelVisible: false
  };

  componentDidMount() {
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    if (currentUserInfoStr) {
      const currentUserInfo = JSON.parse(currentUserInfoStr);
      //this.state.currentUser = currentUserInfo;
      // 1:个人和下属，2:所属部门，3:所属部门和下属部门，4:全公司
      const dataAuthority: (1 | 2 | 3 | 4) = currentUserInfo.data_authority;
      const that = this;

      this.setState({
        dataAuthority,
        currentUser: currentUserInfo,
        companyId: currentUserInfo.company_id
      }, () => {
        if (CrmUtil.getCompanyType() != 3) {
          that.fetchSeaWorkPanelList();
        }
      })

      let areaData = JSON.parse(localStorage.getItem(LOCAL.CITY_AREA));
      if (areaData === null || areaData === undefined) {
        fetch('/area.json')
          .then(res => res.json())
          .then(json => {
            localStorage.setItem(LOCAL.CITY_AREA, JSON.stringify(json));
          });
      }
    }
  }

  // componentWillReceiveProps() {
  //   if (localStorage) {
  //     let seaList = JSON.parse(localStorage.getItem(LOCAL.SEA_LIST));
  //     let seaId = localStorage.getItem(LOCAL.SEA_ID);
  //     if (seaList && seaId) {
  //       this.setState({
  //         companyId: seaId,
  //         bossSeaList: seaList,
  //       });
  //     }
  //   }
  // }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardWorkplace/clear',
    });
  }

  companyOnChange = (value: string) => {
    this.state.companyId = value;
    console.log(`公司ID： ${this.state.companyId}`);
    const params: Partial<DashboardWorkplaceParams> = {
      companyId: value
    };
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'dashboardWorkplace/fetchStructureList',
      payload: params,
      callback: (res: any) => {
        if (res.code === 200) {
          that.fetchAll(false);
        }
      }
    });
  }

  bossSeaOnChange = (seaId: string) => {
    try {
      const { dispatch } = this.props;
      const { currentUser } = this.state;
      let that = this;
      currentUser.company_id = seaId;
      if (localStorage) {
        localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(currentUser));
        this.setState({
          companyId: seaId
        })
        dispatch({
          type: 'dashboardWorkplace/setBossSeaList',
          payload: {
            companyId: seaId
          },
          callback: (res: any) => {
            if (res.code === 200) {
              localStorage.setItem(LOCAL.SEA_ID, seaId);
              localStorage.setItem('forceReload', '1');
              message.success('海域已切换');
              that.fetchAll(false);
            }
          }
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  customPanelModelShow = () => {
    this.setState({
      customPanelVisible: true
    });
  }

  customPanelModelCheckboxOnChange = (e: CheckboxChangeEvent) => {
    var items = this.state.panels;
    if (items !== undefined) {
      if (e.target.checked) {
        this.state.panels[e.target.value].is_show = 1;
      } else {
        this.state.panels[e.target.value].is_show = 0;
      }
      this.setState({
        panels: items
      });
    }
  }

  structureOnChange = (value: string) => {
    let that = this;
    this.state.structureId = value;
    console.log(`部门ID： ${this.state.structureId}`);
    const { dispatch } = this.props;
    const filter = {
      company_id: this.state.companyId,
      structure_id: value,
    }
    const op = {};
    for (let key in filter) {
      if (key == 'company_id') {
        op[key] = '=';
      }
      else if (key == 'structure_id') {
        op[key] = '=';
      }
      else {
        op[key] = 'IN';
      }
    }
    dispatch({
      type: 'dashboardWorkplace/fetchUsersList',
      payload: { filter, op },
      callback: (res: any) => {
        if (res.code === 200) {
          that.fetchAll(false);
        }
      }
    });
  }

  onUserChange = (type: number, value: string) => {
    const { dispatch } = this.props;
    const { companyId, structureId, startTime, endTime, callAnalysisType } = this.state;
    const params: Partial<DashboardWorkplaceParams> = {
      showUserId: value,
      startTime: startTime,
      endTime: endTime,
      type: callAnalysisType
    };

    if (companyId && companyId.length > 0) {
      params['companyId'] = companyId;
    }

    if (structureId && structureId.length > 0) {
      params['structureId'] = structureId;
    }
    switch (type) {
      case 1:
        console.log(`我的业绩：用户 ${value}`);
        dispatch({
          type: 'dashboardWorkplace/fetchMyPerformance',
          payload: params
        });
        break;
      case 2:
        console.log(`销售助手：用户 ${value}`);
        dispatch({
          type: 'dashboardWorkplace/fetchSalesAssistant',
          payload: params
        });
        break;
      case 3:
        console.log(`销售业绩：用户 ${value}`);
        dispatch({
          type: 'dashboardWorkplace/fetchSalesPerformance',
          payload: params
        });
        break;
      case 4:
        console.log(`预测业绩：用户 ${value}`);
        dispatch({
          type: 'dashboardWorkplace/fetchForecastPerformance',
          payload: params
        });
        break;
      case 5:
        console.log(`荣誉榜：用户 ${value}`);
        dispatch({
          type: 'dashboardWorkplace/fetchHonorList',
          payload: params
        });
        break;
      case 6:
        console.log(`销售漏斗：用户 ${value}`);
        dispatch({
          type: 'dashboardWorkplace/fetchSalesFunnel',
          payload: params
        });
        break;
      case 7:
        console.log(`审批中心：用户 ${value}`);
        break;
      case 8:
        console.log(`呼叫分析：用户 ${value}`);
        dispatch({
          type: 'dashboardWorkplace/fetchCallAnalysis',
          payload: params
        });
        break;
    }
  }

  justLookAtMe = (type: number, checked: boolean) => {
    const { dispatch } = this.props;
    const { currentUser, companyId, structureId, startTime, endTime, callAnalysisType } = this.state;
    const params: Partial<DashboardWorkplaceParams> = {
      startTime: startTime,
      endTime: endTime,
      type: callAnalysisType
    };

    if (checked) {
      params['showUserId'] = currentUser.id;
    }

    if (companyId && companyId.length > 0) {
      params['companyId'] = companyId;
    }

    if (structureId && structureId.length > 0) {
      params['structureId'] = structureId;
    }
    switch (type) {
      case 1:
        console.log(`我的业绩：只看自己 ${checked}`);
        dispatch({
          type: 'dashboardWorkplace/fetchMyPerformance',
          payload: params
        });
        break;
      case 2:
        console.log(`销售助手：只看自己 ${checked}`);
        dispatch({
          type: 'dashboardWorkplace/fetchSalesAssistant',
          payload: params
        });
        break;
      case 3:
        console.log(`销售业绩：只看自己 ${checked}`);
        dispatch({
          type: 'dashboardWorkplace/fetchSalesPerformance',
          payload: params
        });
        break;
      case 4:
        console.log(`预测业绩：只看自己 ${checked}`);
        dispatch({
          type: 'dashboardWorkplace/fetchForecastPerformance',
          payload: params
        });
        break;
      case 5:
        console.log(`荣誉榜：只看自己 ${checked}`);
        dispatch({
          type: 'dashboardWorkplace/fetchHonorList',
          payload: params
        });
        break;
      case 6:
        console.log(`销售漏斗：只看自己 ${checked}`);
        dispatch({
          type: 'dashboardWorkplace/fetchSalesFunnel',
          payload: params
        });
        break;
      case 7:
        console.log(`审批中心：只看自己 ${checked}`);
        break;
      case 8:
        console.log(`呼叫分析：只看自己 ${checked}`);
        dispatch({
          type: 'dashboardWorkplace/fetchCallAnalysis',
          payload: params
        });
        break;
    }
  }

  onTimeChange = (time: Array<string>) => {
    console.log(time);
    this.state.startTime = time[0];
    this.state.endTime = time[1];
    this.fetchAll(false);
  }

  onTimeRangeChange = (start: string, end: string) => {
    this.state.startTime = start;
    this.state.endTime = end;
    this.fetchAll(false);
  }

  onHonorTabChange = (activeKey: any) => {
    console.log(`Tab：${activeKey}`);
    this.fetchHonorData(activeKey);
  }

  onCallAnalysisTabChange = (activeKey: any) => {
    console.log(`Tab：${activeKey}`);
    this.fetchCallAnalysis(activeKey);
  }

  fetchSeaWorkPanelList = () => {
    const { dispatch } = this.props;
    const { currentUser } = this.state;
    const that = this;
    // dispatch({
    //   type: 'dashboardWorkplace/fetchBossSeaList',
    //   payload: { companyId: currentUser.company_id },
    //   callback: (res: any) => {
    //     if (res.code === 200) {
    //       let seaList = res.data.result;
    //       if (seaList && seaList.length > 0) {
    //         localStorage && localStorage.setItem(LOCAL.SEA_LIST, JSON.stringify(seaList));
    //         that.setState({
    //           bossSeaList: seaList,
    //           bossSeaVisible: true
    //         });
    //       } else {
    //         that.setState({
    //           bossSeaVisible: false
    //         });
    //       }
    dispatch({
      type: 'dashboardWorkplace/fetchWorkPanelList',
      callback: (workPanelListRes: any) => {
        if (workPanelListRes.code === 200) {
          let dataPanels = workPanelListRes.data.result;
          var tempPanels: Array<WorkPanel> = [];
          dataPanels && dataPanels.map((panel) => {
            if (panel.is_show) {
              tempPanels.push(panel);
            }
          })
          that.setState({
            panels: dataPanels,
            selectedPanels: tempPanels
          }, () => {
            that.fetchAll(true);
          });
        }
      }
    });
    //   }
    // }
    // });
  }

  fetchAll = (isInit: boolean) => {
    const { dispatch } = this.props;
    const { currentUser, dataAuthority, companyId, structureId, startTime, endTime, callAnalysisType } = this.state;

    try {
      let params: Partial<DashboardWorkplaceParams> = {
        showUserId: currentUser.id,
        startTime: startTime,
        endTime: endTime,
        type: callAnalysisType
      };

      if (companyId && companyId.length > 0) {
        params = {
          ...params,
          companyId
        }
        //params['companyId'] = companyId;
      }

      if (structureId && structureId.length > 0) {
        params = {
          ...params,
          structureId
        }
        //params['structureId'] = structureId;
      }

      dispatch({
        type: isInit ? 'dashboardWorkplace/init' : 'dashboardWorkplace/fetchAll',
        payload: params,
        dataAuthority
      });
    } catch (e) {
      console.log(e);
    }
  }

  fetchHonorData = (listType: string) => {
    const { dispatch } = this.props;
    var { currentUser, companyId, structureId, startTime, endTime } = this.state;
    var params: Partial<DashboardWorkplaceParams> = {
      showUserId: currentUser.id,
      startTime: startTime,
      endTime: endTime
    };

    if (companyId && companyId.length > 0) {
      params['companyId'] = companyId;
    }

    if (structureId && structureId.length > 0) {
      params['structureId'] = structureId;
    }

    if (listType === 'nonor') {
      dispatch({
        type: 'dashboardWorkplace/fetchHonorList',
        payload: params
      });
    } else if (listType === 'reqranking') {
      dispatch({
        type: 'dashboardWorkplace/fetchReqrankingList',
        payload: params
      });
    } else if (listType === 'orderranking') {
      dispatch({
        type: 'dashboardWorkplace/fetchOrderrankingList',
        payload: params
      });
    }
  }

  fetchCallAnalysis = (callType: string) => {
    const { dispatch } = this.props;
    var { currentUser, companyId, structureId, startTime, endTime, callAnalysisType } = this.state;
    callAnalysisType = callType;
    var params: Partial<DashboardWorkplaceParams> = {
      showUserId: currentUser.id,
      startTime: startTime,
      endTime: endTime,
      type: callAnalysisType
    };

    if (companyId && companyId.length > 0) {
      params['companyId'] = companyId;
    }

    if (structureId && structureId.length > 0) {
      params['structureId'] = structureId;
    }

    dispatch({
      type: 'dashboardWorkplace/fetchCallAnalysis',
      payload: params
    });
  }

  randerPanel(dataAuthority: any, panel: WorkPanel) {
    if (panel === undefined) {
      return (<Empty />);
    }
    const {
      userList,

      myPerformance,
      salesAssistant,
      salesPerformance,
      forecastPerformance,
      honorList,
      reqrankingList,
      orderrankingList,
      salesFunnel,
      approvalCenterOrderList,
      callAnalysisNormal,
      callAnalysisDialout,

      myPerformanceLoading,
      salesAssistantLoading,
      salesPerformanceLoading,
      forecastPerformanceLoading,
      honorListLoading,
      salesFunnelLoading,
      approvalCenterOrderListLoading,
      callAnalysisLoading
    } = this.props;
    switch (panel.type) {
      case 'my_performance':
        return (
          <MyPerformanceWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            data={myPerformance}
            loading={myPerformanceLoading}
            onChange={this.onUserChange}
            justLookAtMe={this.justLookAtMe}
          />);
      case 'sales_assist':
        return (
          <SalesAssistantWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            data={salesAssistant}
            loading={salesAssistantLoading}
            onChange={this.onUserChange}
            justLookAtMe={this.justLookAtMe}
          />);
      case 'sales_performance':
        return (
          <SalesPerformanceWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            data={salesPerformance}
            loading={salesPerformanceLoading}
            onChange={this.onUserChange}
            justLookAtMe={this.justLookAtMe}
          />
        );
      case 'prediction_performance':
        return (
          <ForecastPerformanceWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            data={forecastPerformance}
            loading={forecastPerformanceLoading}
            onChange={this.onUserChange}
            justLookAtMe={this.justLookAtMe}
          />
        );
      case 'honor_roll':
        return (
          <HonorListWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            honorData={honorList}
            reqrankingData={reqrankingList}
            orderrankingData={orderrankingList}
            loading={honorListLoading}
            onChange={this.onUserChange}
            onTabChange={this.onHonorTabChange}
            justLookAtMe={this.justLookAtMe}
          />
        );
      case 'sales_funnel':
        return (
          <SalesFunnelWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            data={salesFunnel}
            loading={salesFunnelLoading}
            onChange={this.onUserChange}
            justLookAtMe={this.justLookAtMe}
          />
        );
        break;
      case 'examine_center':
        return (
          <ApprovalCenterWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            data={approvalCenterOrderList}
            loading={approvalCenterOrderListLoading}
            onChange={this.onUserChange}
            justLookAtMe={this.justLookAtMe}
          />
        );
      case 'call_analysis':
        return (
          <CallAnalysisWorkplace
            showOnlySelf={dataAuthority <= 1}
            userList={userList}
            normalData={callAnalysisNormal}
            dialoutData={callAnalysisDialout}
            loading={callAnalysisLoading}
            onTabChange={this.onCallAnalysisTabChange}
            onChange={this.onUserChange}
            justLookAtMe={this.justLookAtMe}
          />
        );
      default:
        return (<Empty />);
    }
  }

  render() {
    if (CrmUtil.getCompanyType() != 1) {
      return <div className={styles.welcomeBg}>
        {/* <span>欢迎使用CRM系统</span> */}
        <img
          src="https://ck-1255482171.image.myqcloud.com/img/crm_welcome.png"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    }
    const {
      workBenchNums,
      companyList,
      structureList,
      roleInfoLoading
    } = this.props;

    const { dispatch } = this.props;
    const { companyId, dataAuthority, bossSeaList, bossSeaVisible, customPanelVisible, panels, selectedPanels } = this.state;
    let that = this;

    let panelsCreate = () => {
      var panelsRander = [];
      var nextIndex = 0;
      if (selectedPanels && selectedPanels.length > 0) {
        let rows = Math.ceil(selectedPanels.length / 2);
        for (var index = 0; index < rows; index++) {
          if (nextIndex < selectedPanels.length - 1) {
            panelsRander.push(
              <Row gutter={24}>
                <Col span={12}>
                  {this.randerPanel(dataAuthority, selectedPanels[nextIndex])}
                </Col>
                <Col span={12}>
                  {this.randerPanel(dataAuthority, selectedPanels[nextIndex + 1])}
                </Col>
              </Row>
            );
          } else {
            panelsRander.push(
              <Row gutter={24}>
                <Col span={12}>
                  {this.randerPanel(dataAuthority, selectedPanels[nextIndex])}
                </Col>
              </Row>
            );
          }
          nextIndex += 2;
        }
      }

      return panelsRander;
    }

    return (
      <PageHeaderWrapper extraContent={<ExtraContent companyId={companyId} seaList={bossSeaList} visible={bossSeaVisible} seaOnChange={this.bossSeaOnChange} customOnClick={this.customPanelModelShow} />} >
        <CustomPanelModel panels={panels} visible={customPanelVisible} handleOk={() => {
          var tempPanels: Array<WorkPanel> = [];
          panels && panels.map((panel) => {
            if (panel.is_show) {
              tempPanels.push(panel);
            }
          })
          let json = JSON.stringify(panels);
          dispatch({
            type: 'dashboardWorkplace/setWorkPanelList',
            payload: { workList: json },
            callback: (res) => {
              if (res.code === 200) {
                that.setState({
                  customPanelVisible: false,
                  selectedPanels: tempPanels
                });
              } else {
                message.error('保存失败，请重试');
              }
            }
          });
        }} onCancel={() => {
          this.setState({
            customPanelVisible: false
          });
        }} checkboxOnChange={this.customPanelModelCheckboxOnChange} />
        {
          dataAuthority > 1 ?
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col span={24}>
                <WorkplaceConditions
                  loading={roleInfoLoading}
                  companyList={companyList}
                  structureList={structureList}
                  companyOnChange={this.companyOnChange}
                  structureOnChange={this.structureOnChange}
                  onTimeChange={this.onTimeChange}
                  onTimeRangeChange={this.onTimeRangeChange}
                />
              </Col>
            </Row>
            :
            <Card className={styles.projectList} style={{ marginBottom: 24, textAlign: 'center' }} bordered={false} >
              <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={4}>
                  <Statistic title="新进leads数" value={workBenchNums ? workBenchNums.leads_new : 0} />
                </Col>
                <Col span={4}>
                  <Statistic title="待跟进leads数" value={workBenchNums ? workBenchNums.leads_follow : 0} />
                </Col>
                <Col span={4}>
                  <Statistic title="待回访leads数" value={workBenchNums ? workBenchNums.leads_visit : 0} />
                </Col>
                <Col span={4}>
                  <Statistic title="建有效单数" value={workBenchNums ? workBenchNums.order_create : 0} />
                </Col>
                <Col span={4}>
                  <Statistic title="生成确认单数" value={workBenchNums ? workBenchNums.order_confirm : 0} />
                </Col>
                <Col span={4}>
                  <Statistic title="已签单数" value={workBenchNums ? workBenchNums.order_contract : 0} />
                </Col>
              </Row>
            </Card>
        }
        {
          panelsCreate()
        }
      </PageHeaderWrapper >
    );
  }
}

export default DashboardWorkplace;
