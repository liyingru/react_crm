import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getPublicRulesChannel, addPublicRule, editPublicRule, getChannel3Company
} from './service';
import { ConfigList, ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { RulesDetail } from '../DistributeRuleDetail/data';
import { SimpleCompany } from '../SunnyRulesList/data';
import { getRulesCompanyLsit } from '../SunnyRulesList/service';
import { getPublicRuleDetail } from '../DistributeRuleDetail/service';

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

export interface Channel3Company {
  xp?: ConfigListItem[],
  lan?: ConfigListItem[],
  nk?: ConfigListItem[],
}




export interface ReceiverGroupData {
  id: string;
  name: string;
}

export interface TableListParams {

}


export interface StateType {
  publicChannelsData: ConfigListItem[]|undefined,
  channel3Company: Channel3Company | undefined,
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
    getPublicChannels: Effect;
    getChannel3Company: Effect;
    getPublicRuleDetail: Effect;
    addPublicRule: Effect;
    editPublicRule: Effect;
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
  namespace: 'newDistributeRuleModel',
  state: {
    publicChannelsData: undefined,
    channel3Company: undefined,
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
    *addPublicRule({ payload ,callback}, { call, put }) {
      let res = yield call(addPublicRule, payload);
      if(callback)callback(res);
    },
    *editPublicRule({ payload ,callback}, { call, put }) {
      let res = yield call(editPublicRule, payload);
      if(callback)callback(res);
    },
    // 获取公域规则 可用的渠道
    *getPublicChannels({ payload, callback }, { call, put }) {
      let response = yield call(getPublicRulesChannel, payload);
      const rawChannels: ConfigListItem[] = response.data.result;
      container = [];
      rawChannels.map(val => expandRawChannels(val));
      yield put({
        type: 'save',
        payload: { publicChannelsData: container},
      });
      if(callback) callback(response.code == 200, container)
    },
    // 获取 喜铺 澜 尼克 3个公司的公域渠道
    *getChannel3Company({ payload }, { call, put }) {
      console.log("getChannel3Company");
      let response = yield call(getChannel3Company, payload);
      const channel3Company: Channel3Company = response.data.result;
      
      const xp = [], lan = [], nk = [];
      container = [];
      channel3Company.xp?.map(val => expandRawChannels(val));
      xp.push(...container);
      container = [];
      channel3Company.lan?.map(val => expandRawChannels(val));
      lan.push(...container);
      container = [];
      channel3Company.nk?.map(val => expandRawChannels(val));
      nk.push(...container);

      yield put({
        type: 'save',
        payload: { channel3Company : {
          xp,
          lan,
          nk,
        }},
      });
    },
    
    // 规则详情
    *getPublicRuleDetail({ payload, callback }, { call, put }) {
      let response = yield call(getPublicRuleDetail, payload);
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
  },

};

export default Model;

