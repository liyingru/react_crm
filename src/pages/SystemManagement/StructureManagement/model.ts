import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getCompanyList, getStructureList, addStructure, deleteStructure, editStructure } from './service';

import { TableListData, CompanyData, StructureData } from './data';

export interface StateType {
  data: TableListData;
  companyList?: CompanyData[]|undefined;
  structureOptions: StructureData[]|undefined;
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
    getStructureList: Effect;
    getStructuresByCompanyId: Effect;
    addStructure: Effect;
    deleteStructure: Effect;
    updateStructure: Effect;
  };
  reducers: {
    showStructureList: Reducer<StateType>;
  };
}

let container: StructureData[] = new Array();

const expandStructures = function (child:StructureData) {
  console.log(child.id)
  container = [
    ...container,
    child
  ]
  if(child.childlist.length > 0) {
    child.childlist.map(val=>expandStructures(val))
  }
  
}
  

const Model: ModelType = {
  namespace: 'structureManagementModel',

  state: {
    data: {
      company:{
        id:"",
        name: ""
      },
      list: [],
      // pagination: {
      //   total: 0,
      //   pageSize: 10,
      //   current:1
      // },
      
    },
    companyList: undefined,
    structureOptions:undefined,
  },


  effects: {
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList);
      if(response.code == 200) {
        const companyList: CompanyData[] = response.data.result.rows;
        const isAdmin = payload.isAdmin;
        if(isAdmin) {
          yield put({
            type: 'showStructureList',
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
            type: 'showStructureList',
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
    *getStructureList({ payload }, { call, put }) {
      const response = yield call(getStructureList, payload);
      // const pageSize = payload.pageSize;
      // const current = payload.page;
      if(response.code == 200) {
        let rawStructuresList = [];
        const responseList = response.data.result.rows;
        const targetCompanyStructuresArr = responseList.filter(item=>item.company_id+"" == payload.companyId+"");
        if(targetCompanyStructuresArr && targetCompanyStructuresArr.length > 0) {
          rawStructuresList = targetCompanyStructuresArr[0].structureList;
        }
        container = [];
        rawStructuresList.map(val => expandStructures(val));
        yield put({
          type: 'showStructureList', 
          payload: {
            data: {
              company: {
                id:targetCompanyStructuresArr[0].company_id,
                name:targetCompanyStructuresArr[0].company_name,
              },
              list: container,
            }
          },
        });
      } else {

      }
    },
    *getStructuresByCompanyId({ payload }, { call, put }) {
      const response = yield call(getStructureList, payload);
      if(response.code == 200) {
        const rawStructuresList = response.data.result.rows.length == 1 ? response.data.result.rows[0].structureList : response.data.result.rows.filter(item=>item.company_id+""==payload.companyId+"")[0]?.structureList;
        container = [];
        rawStructuresList?.map(val => expandStructures(val));
        yield put({
          type: 'showStructureList',
          payload: {
            structureOptions:container
          },
        });
      } else {

      }
    },

    *addStructure({ payload, callback }, { call, put }) {
      const response = yield call(addStructure, payload);
      if (callback) callback(response.code == 200);
    },

    *deleteStructure({ payload, callback }, { call, put }) {
      const response = yield call(deleteStructure, payload);
      if (callback) callback(response.code == 200);
    },

    *updateStructure({ payload, callback }, { call, put }) {
      const response = yield call(editStructure, payload);
      if (callback) callback(response.code == 200);
    },
  },

  reducers: {

    showStructureList(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },

  },
};

export default Model;
