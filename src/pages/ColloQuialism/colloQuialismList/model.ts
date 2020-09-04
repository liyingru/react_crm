import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import { fetchListRule, fetchCategoryListRule, changeCategoryRule, deleteCategoryRule, addKnowledge, editKnowledge, delKnowledge } from './service';

import { ColloquialismListData, CategoryItem } from './data';

export interface StateType {
  data: ColloquialismListData;
  categoryList: CategoryItem[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    fetchCategoryList: Effect;
    deleteCategory: Effect;
    changeCategoryList: Effect;
    addKnowledge: Effect;
    editKnowledge: Effect;
    delKnowledge: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'colloquialismListModel',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    categoryList: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      payload = {
        ...payload,
        page: payload.page?payload.page:1,
        pageSize: payload.pageSize?payload.pageSize:10,
      }
      const response = yield call(fetchListRule, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: payload ? payload.page : 1,
      }
      
      let data = {
        list: response.data.result.rows,
        pagination: pagination,
      };
      yield put({
        type: 'save',
        payload: {data},
      });
      if (callback) callback(response);
    },
    *fetchCategoryList({ payload, callback }, { call, put }) {
      const response = yield call(fetchCategoryListRule, payload);
      yield put({
        type: 'save',
        payload: {
          categoryList: response.code == 200 ? response.data.result : []
        }
      });
      if (callback && response.code == 200) callback();
    },
    *deleteCategory({ payload, callback }, { call, put }) {
      const response = yield call(deleteCategoryRule, payload);
      if (callback && response.code == 200) callback();
    },
    *changeCategoryList({ payload, callback }, { call, put }) {
      const response = yield call(changeCategoryRule, payload);
      if (callback && response.code == 200) callback();
    },
    *addKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(addKnowledge, payload);
      if (callback) callback(response.code == 200);
    },
    *editKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(editKnowledge, payload);
      if (callback) callback(response.code == 200);
    },
    *delKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(delKnowledge, payload);
      if (callback) callback(response.code == 200);
    },
    
    
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
}


export default Model;