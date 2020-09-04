import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getChannelList,
  getGroupUserListCtrl, searchUserCtrl,distributeCompanyListCtrl,addRuleCtrl,updateRuleCtrl
} from './service';
import { ConfigList, ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { getRulesDetail } from '../RuleDetail/service';
import { RulesDetail } from '../RuleDetail/data';
import { SimpleCompany } from '../SunnyRulesList/data';
import { getRulesCompanyLsit } from '../SunnyRulesList/service';


export interface ReceiverUserData {
  account: string;
  company_name: string;
  id: string;
  job_number: string;
  name: string;
  position_id: string;
  role_id: string;
  structure_id: string;
  structure_name: string;
}


export interface ReceiverGroupData {
  id: string;
  name: string;
}

export interface TableListParams {

}


export interface StateType {
  channelsData: ConfigListItem[]|undefined,
  searchUserData: ReceiverUserData[] | undefined,
  getGroupUserData: ReceiverGroupData[] | undefined,
  distributeCompany:{id: number, name: string}[]|undefined,
  rulesDetail: RulesDetail|undefined,
  newInvitationArr:[],
  newDemandConfirmationArr:[],
  companyList: SimpleCompany[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getChannels: Effect;
    getChannelsByAll: Effect;
    getRulesCompanyLsit: Effect;
    submit: Effect;
    getGroupUserListCtrl: Effect;
    searchUserCtrl: Effect;
    distributeCompanyListCtrl:Effect;
    addRuleCtrl:Effect;
    updateRuleCtrl: Effect;
    getRulesDetailById: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

let container: ConfigListItem[] = new Array();
const expandRawChannels = function (child:ConfigListItem) {
  if(child.children && child.children.length > 0) {
    child.children.map(val=>expandRawChannels(val))
  } else {
    container = [
      ...container,
      child
    ]
  }
}

const Model: ModelType = {
  namespace: 'newRuleModel',
  state: {
    channelsData: undefined,
    searchUserData: undefined,
    getGroupUserData: undefined,
    distributeCompany: undefined,

    rulesDetail:undefined,

    newInvitationArr:[],
    newDemandConfirmationArr:[],
    companyList: [],
  },
  effects: {
    
    // 添加规则
    *addRuleCtrl({ payload ,callback}, { call, put }) {
      let res = yield call(addRuleCtrl, payload);
      if(callback)callback(res);
    },
    *updateRuleCtrl({ payload ,callback}, { call, put }) {
      let res = yield call(updateRuleCtrl, payload);
      if(callback)callback(res);
    },
    // 客资
    *getChannels({ payload, callback }, { call, put }) {
      let response = yield call(getChannelList, payload);
      const rawChannels: ConfigListItem[] = response.data.result;
      container = [];
      rawChannels.map(val => expandRawChannels(val));
      console.log("containers = " + JSON.stringify(container))
      yield put({
        type: 'save',
        payload: { channelsData: container},
      });
      if(callback) callback(response.code == 200, container)
    },
    // 客资-全部
    *getChannelsByAll({ payload, callback }, { call, put }) {
      let response = yield call(getChannelList, payload);
      const rawChannels: ConfigListItem[] = response.data.result;
      container = [];
      rawChannels.map(val => expandRawChannels(val));
      if(callback) callback(response.code == 200, container)
    },
    
    *getRulesCompanyLsit({ payload }, { call, put }) {
      console.log("getRulesCompanyLsit");
      const response = yield call(getRulesCompanyLsit, payload);
      yield put({
        type: 'save',
        payload: {
          companyList: response.data.result
        },
      })
    },
    *submit({ payload }, { call, put }) {
      let response = yield call(addRuleCtrl, payload);
      const channelsData = response.data.result.channel
      yield put({
        type: 'save',
        payload: { channelsData },
      });
    },
    // 搜索用户
    *searchUserCtrl({ payload, callback }, { call, put }) {
      let response = yield call(searchUserCtrl, payload);
      yield put({
        type: 'save',
        payload: { searchUserData: response.data.result },
      });
    },
    // 搜索组
    *getGroupUserListCtrl({ payload, callback }, { call, put }) {
      let response = yield call(getGroupUserListCtrl, payload);
      yield put({
        type: 'save',
        payload: { getGroupUserData: response.data.result },
      });
    },
    // 派发公司
    *distributeCompanyListCtrl({ payload, callback }, { call, put }) {
      let response = yield call(distributeCompanyListCtrl, payload);
      yield put({
        type: 'save',
        payload: { distributeCompany: response.data.result },
      });
    },

    // 规则详情
    *getRulesDetailById({ payload, callback }, { call, put }) {
      let response = yield call(getRulesDetail, payload);
      yield put({
        type: 'save',
        payload: { rulesDetail: response.data.result },
      });
      if(callback) callback(response.code==200, response.data.result);
    },

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    newInvitationCtrl(state: any, { payload }) {
      const newState = Object.assign({}, state, {
        newInvitationArr: payload.obj,
      });
      return newState
    },
    newDemandConfirmationCtrl(state: any, { payload }) {
      const newState = Object.assign({}, state, {
        newDemandConfirmationArr: payload.obj,
      });
      return newState
    },
  },

};

export default Model;

