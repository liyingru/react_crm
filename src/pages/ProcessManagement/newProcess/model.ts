import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";
import { ConfigData } from "../processList/data";
import { configRule, newRule, userListRule, detailRule, editRule } from "./service";
import { UserData } from "./data";
import { routerRedux } from "dva/router";
import { ListStructureItem } from "@/pages/SystemManagement/UserManagement/data";
import { queryListStructure } from "@/pages/SystemManagement/UserManagement/service";

export interface StateType {
    config: ConfigData;
    users: UserData[];
    listStructure: ListStructureItem[];
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        queryListStructure: Effect;
        config: Effect;
        new: Effect;
        userList: Effect;
        detail: Effect;
        edit: Effect;
        goList: Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'processManagementNewProcess',
    state: {
        config: {
            auditType: [],
            auditConfigStatus: [],
        },
        users: [],
        listStructure: [],
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
        *config({ payload }, { call, put }) {
            const response = yield call(configRule, payload);
            yield put({
                type: 'save',
                payload: {
                    config: response.data.result,
                }
            });
        },
        *new({ payload, callback }, { call, put }) {
            const response = yield call(newRule, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback && response.code == 200) callback();
        },
        *edit({ payload, callback }, { call, put }) {
            const response = yield call(editRule, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback && response.code == 200) callback();
        },
        *detail({ payload, callback }, { call, put }) {
            const response = yield call(detailRule, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback && response.code == 200) callback(response.data.result);
        },
        *userList({ payload }, { call, put }) {
            const response = yield call(userListRule, payload);
            yield put({
                type: 'save',
                payload: {
                    users: response.data.result.rows,
                }
            });
        },
        *goList({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload,
            });
            yield put(routerRedux.push('/process/processList'));
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
};

export default Model;