import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addUser, queryListStructure, queryListPosition, queryUsersList, removeUser, updateUser, getCompanyList, getRoleList, getUserPermissionList, checkInOrOut, doLoginOut } from './service';

import { TableListData, ListStructureItem } from './data.d';
import { PositionData } from '../PositionManagement/data';
import { RoleData } from '../RoleManagement/data';
import { Permission } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';

export interface OStateType {
  data: TableListData;
  listStructure: ListStructureItem[];
  listPosition: PositionData[];
  roles: RoleData[];
  permission: Permission|undefined;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: OStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: OStateType;
  effects: {
    queryListStructure: Effect;
    queryListPosition: Effect;
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    detail: Effect;
    getCompanyList: Effect;
    getRoleList: Effect;
    getUserPermissionList: Effect;
    checkOutUser: Effect;
    doLoginOut: Effect;
  };
  reducers: {
    save: Reducer<OStateType>;
  };
}

let container: PositionData[] = new Array();
const expandPositions = function (child:PositionData) {
  console.log(child.id)
  container = [
    ...container,
    child
  ]
  if(child.childlist.length > 0) {
    child.childlist.map(val=>expandPositions(val))
  }
}

const Model: ModelType = {
  namespace: 'userManagementModel',

  state: {
    listStructure: [],
    listPosition: [],
    roles: [],
    data: {
      list: [],
      pagination: {},
    },    
    permission: undefined,
  },

  effects: {
    *queryListStructure({ payload, callback }, { call, put }) {
      const response = yield call(queryListStructure, payload);
      if(response.code == 200) {
        const listStructure = response.data.result.rows;
        yield put({
          type: 'save',
          payload: {listStructure: listStructure},
        });
      } else {
      }
      if(callback) callback(response.code == 200);
    },

    *queryListPosition({ payload, callback }, { call, put }) {
      const response = yield call(queryListPosition, payload);
      if(response.code == 200) {
        const rawPositionList:PositionData[] = response.data.result.rows;
        container = [];
        rawPositionList.map(val => expandPositions(val));
        console.log("finalPositions = " + JSON.stringify(container));
        yield put({
          type: 'save', 
          payload: {listPosition: container},
        });
      } else {
      }
      if(callback) callback(response.code==200)
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsersList, payload);
      const pageSize = payload.pageSize;
      const current = payload.page;
      if(response.code == 200) {
        const usersList = response.data.result.rows;
        yield put({
          type: 'save',
          payload: {
            data:{
              list: usersList,
              pagination: {
                total: response.data.result.total,
                pageSize: pageSize,
                current:current
              }
            }
          },
        });
      } else {
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      if (callback) callback(response.code == 200);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      if (callback) callback(response.code == 200);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response.code == 200);
    },

    *getUserPermissionList({ payload }, { call, put }) {
      const response = yield call(getUserPermissionList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          permission: response.data.result
        },
      });
    },
    
    *detail({payload, callback}, {call, put}) {
      //const response = yield call(checkUserDetail, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
    },

    *getCompanyList({ payload }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      if(response.code == 200) {
        const companyList = response.data.result.rows;
        yield put({
          type: 'save',
          payload: {
            list: companyList,
          },
        });
      } else {

      }
    },

    *getRoleList({ payload, callback }, { call, put }) {
      const response = yield call(getRoleList, payload);
      if(response.code == 200) {
        const roleList = response.data.result.rows;
        yield put({
          type: 'save',
          payload: {
            roles: roleList,
          },
        });
      } else {

      }
      if(callback) callback(response.code==200)
    },
    *checkOutUser({ payload, onSuccess }, { call, put }) {
      const response = yield call(checkInOrOut, payload);
      if(onSuccess&&response.code==200) onSuccess()
    },
    *doLoginOut({ payload, onSuccess }, { call, put }) {
      const response = yield call(doLoginOut, payload);
      if(onSuccess&&response.code==200) onSuccess()
    },
    
  },


  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },

  },
};

export default Model;
