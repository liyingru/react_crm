import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";
import { processListRule, configRule, processDeleteRule, processEditRule } from "./service";
import { ProcessList, ConfigData } from "./data";
import { routerRedux } from "dva/router";

export interface StateType {
    list: ProcessList;
    config: ConfigData;
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        processList: Effect;
        config: Effect;
        modify: Effect;
        new: Effect;
        delete: Effect;
        edit: Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'processManagementProcessList',
    state: {
        list: {
            total: 0,
            page: 1,
            page_size: 10,
            rows: [],
        },
        config: {
            auditType: [],
            auditConfigStatus: [],
        }
    },

    effects: {
        *processList({ payload, callback }, { call, put }) {
            const response = yield call(processListRule, payload);
            yield put({
                type: 'save',
                payload: {
                    list: response.data.result,
                }
            });
            if (callback && response.code == 200) callback(response.data.result.total);
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
        *modify({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload,
            });
            yield put(routerRedux.push({
                pathname: '/process/processList/modifyProcess',
                state: payload,
              }));
        },
        *new({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload,
            });
            yield put(routerRedux.push('/process/newProcess'));
        },
        *delete({ payload, callback }, { call, put }) {
            const response = yield call(processDeleteRule, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback && response.code == 200) callback();
        },
        *edit({ payload, callback }, { call, put }) {
            const response = yield call(processEditRule, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback && response.code == 200) callback();
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