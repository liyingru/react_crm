import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getMenuList, addMenu, editMenu, deleteMenu, planList, listAct } from './service';

import { MenuData, TableListData } from './data';

export interface StateType {
  data: TableListData;
  planList: string[]|undefined;
  actions: string[]|undefined;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getMenuList: Effect;
    addMenu: Effect;
    editMenu: Effect;
    deleteMenu: Effect;
    listAct: Effect;
    planList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const expand = function (menu: MenuData) : MenuData{

  if(menu.childlist&&menu.childlist.length>0) {

    menu.child = menu.childlist.map(item => {
      if(item.childlist&&item.childlist.length>0) {
        item.child = item.childlist;
        expand(item)
      }
      return item;
    })
  }
  
  return menu;
}
  

const Model: ModelType = {
  namespace: 'menuManagementModel',

  state: {
    data: {
      menus:[],
      total: 0,
    },
    planList:undefined,
  },

  effects: {
    *getMenuList({ payload }, { call, put }) {
      const response = yield call(getMenuList, payload);

      if(response.code == 200) {
        const rawMenuList: MenuData[] = response.data.result.rows;
        const menus = rawMenuList.map(val =>{
          if(val.childlist&&val.childlist.length>0) {

          } else {

          }
          return expand(val);
        } );
        console.log("finalMenus = " + JSON.stringify(menus));
        yield put({
          type: 'save', 
          payload: {
            data: {
              menus,
              tatal: response.data.result.total,
            }
          },
        });
      } else {

      }
    },

    *listAct({ payload, callback }, { call, put }) {
      const response = yield call(listAct, payload);
      if(response.code == 200) {
        yield put({
          type: 'save', 
          payload: {
            actions: response.data.result
          },
        });
      }
      if(callback) callback(response.code == 200);

    },

    *planList({ payload, callback }, { call, put }) {
      const response = yield call(planList, payload);
      if(response.code == 200) {
        yield put({
          type: 'save', 
          payload: {
            planList: response.data.result
          },
        });
      }
      if(callback) callback(response.code == 200);

    },

    *addMenu({ payload, callback }, { call }) {
      const response = yield call(addMenu, payload);
      if(callback) callback(response.code == 200);
    },
  
    *editMenu({ payload, callback }, { call }) {
      const response = yield call(editMenu, payload);
      if(callback) callback(response.code == 200);
    },
  
    *deleteMenu({ payload, callback }, { call }) {
      const response = yield call(deleteMenu, payload);
      if(callback) callback(response.code == 200);
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
