import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getCompanyList, getPositionList, addPosition, deletePosition, editPosition } from './service';

import { TableListData, CompanyData, PositionData } from './data';

export interface StateType {
  data: TableListData;
  companyList?: CompanyData[]|undefined;
  positionOptions: PositionData[]|undefined;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCompanyList: Effect;
    getPositionList: Effect;
    getPositionOptions: Effect;
    addPosition: Effect;
    deletePosition: Effect;
    updatePosition: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
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
  namespace: 'positionManagementModel',

  state: {
    data: {
      list: [],
    },
    companyList: undefined,
    positionOptions:undefined,
  },


  effects: {
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList);
      if(response.code == 200) {
        const companyList: CompanyData[] = response.data.result.rows;
        const isAdmin = payload.isAdmin;
        if(isAdmin) {
          yield put({
            type: 'save',
            payload: {
              companyList
            }
          },);
          if(callback) {
            callback(companyList);
          }
        } else {
          const userCompanyId = payload.userCompanyId;
          const selfCompanyList = companyList.filter(companyItem => companyItem.id.toString() == userCompanyId.toString());
          yield put({
            type: 'save',
            payload: {
              companyList: selfCompanyList
            }
          },);
          if(callback) {
            callback(selfCompanyList);
          }
        }
      } else {
        if(callback) {
          callback(false);
        }
      }
    },
    *getPositionList({ payload }, { call, put }) {
      const response = yield call(getPositionList, payload);
      if(response.code == 200 && response.data.result.rows) {
        const rawPositionList:PositionData[] = response.data.result.rows;
        container = [];
        rawPositionList.map(val => expandPositions(val));
        console.log("finalPositions = " + JSON.stringify(container));
        yield put({
          type: 'save', 
          payload: {
            data: {
              list: container,
            }
          },
        });
      } else {
        yield put({
          type: 'save', 
          payload: {
            data: {
              list: [],
            }
          },
        });
      }
    },
    *getPositionOptions({ payload }, { call, put }) {
      const response = yield call(getPositionList, payload);
      if(response.code == 200) {
        const rawStructuresList = response.data.result.rows;
        container = [];
        rawStructuresList.map(val => expandPositions(val));

        // container = container.map(item => {
        //   if(item.pid !== '0') {
        //     item = {
        //       ...item,
        //       name: item.spacer + item.name
        //     }
        //   }
        //   return item;
        // })
        yield put({
          type: 'save',
          payload: {
            positionOptions:container
          },
        });
      } else {

      }
    },

    *addPosition({ payload, callback }, { call, put }) {
      const response = yield call(addPosition, payload);
      if (callback) callback(response.code == 200);
    },

    *deletePosition({ payload, callback }, { call, put }) {
      const response = yield call(deletePosition, payload);
      if (callback) callback(response.code == 200);
    },

    *updatePosition({ payload, callback }, { call, put }) {
      const response = yield call(editPosition, payload);
      if (callback) callback(response.code == 200);
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
