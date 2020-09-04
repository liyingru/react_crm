import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getCompanyChannelList, companyCategory, getConfig, getQaRuleDetail,
  getGroupUserListCtrl, searchUserCtrl,distributeCompanyListCtrl,createRules,updateRules
} from './service';
import { ConfigList, ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { SimpleCompany } from '../SunnyRulesList/data';
import { getRulesCompanyLsit } from '../SunnyRulesList/service';
import { RulesDetail } from '../QaRuleDetail/data';


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
  configData: ConfigList | undefined,
  channelsData: {companyId: string, channels: ConfigListItem[]}[],
  categorysData: {companyId: string, categorys: ConfigListItem[]}[],
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
    getConfig: Effect;
    getChannelsByCompanyId: Effect;
    getCategorysByCompanyId: Effect;
    createRules:Effect;
    updateRules: Effect;
    getRulesDetailById: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    saveChannelsByCompanyId: Reducer<StateType>;
    saveCategorysByCompanyId: Reducer<StateType>;
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
  // container = [
  //   ...container,
  //   child
  // ]
  // if(child.children.length > 0) {
  //   child.children.map(val=>expandRawChannels(val))
  // }
}

const Model: ModelType = {
  namespace: 'newQaRuleModel',
  state: {
    configData: undefined,
    channelsData: [],
    categorysData: [],
    rulesDetail:undefined,
  },
  effects: {
    *getConfig({payload}, {call, put}) {
      let res = yield call(getConfig, payload);
      yield put({
        type: 'save',
        payload: { configData: res.data.result },
      });
    },
    
    // 添加规则
    *createRules({ payload ,callback}, { call, put }) {
      let res = yield call(createRules, payload);
      if(callback)callback(res);
    },
    *updateRules({ payload ,callback}, { call, put }) {
      let res = yield call(updateRules, payload);
      if(callback)callback(res);
    },
    // 客资
    *getChannelsByCompanyId({ payload, callback }, { call, put }) {
      let response = yield call(getCompanyChannelList, payload);
      const rawChannels: ConfigListItem[] = response.data.result;
      container = [];
      rawChannels.map(val => expandRawChannels(val));
      yield put({
        type: 'saveChannelsByCompanyId',
        payload: { 
          channelsData: container, 
          companyId: payload.companyId
        },
      });
      if(callback) callback(response.code == 200, container)
    },
    
    // 品类
    *getCategorysByCompanyId({ payload, callback }, { call, put }) {
      let response = yield call(companyCategory, payload);
      const categorysData: ConfigListItem[] = response.data.result;
      yield put({
        type: 'saveCategorysByCompanyId',
        payload: { 
          categorysData, 
          companyId: payload.companyId
        },
      });
      // yield put({
      //   type: 'save',
      //   payload: { categorysData },
      // });
      if(callback) callback(response.code == 200, container)
    },

    // 规则详情
    *getRulesDetailById({ payload, callback }, { call, put }) {
      let response = yield call(getQaRuleDetail, payload);
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
    saveChannelsByCompanyId(state, { payload }) {
      let channelsData = state?.channelsData;
      const companyId = payload.companyId;
      channelsData = channelsData?.filter(item=>item.companyId!=companyId) || [];
      channelsData = [
        ...channelsData,
        {
          companyId,
          channels: payload.channelsData
        }
      ]
      return {
        ...state,
        channelsData
      };
    },
    saveCategorysByCompanyId(state, { payload }) {
      let categorysData = state?.categorysData;
      const companyId = payload.companyId;
      categorysData = categorysData?.filter(item=>item.companyId!=companyId) || [];
      categorysData = [
        ...categorysData,
        {
          companyId,
          categorys: payload.categorysData
        }
      ]
      return {
        ...state,
        categorysData
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

