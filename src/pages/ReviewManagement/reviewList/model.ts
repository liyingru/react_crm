import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";
import { ReviewList, ConfigData } from "./data";
import { configRule, listRule } from "./service";
import { routerRedux } from "dva/router";


export interface StateType {
    list: ReviewList;
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
        list: Effect;
        config: Effect;
        option: Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'reviewManagementReviewList',
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
            auditPhase: [],
        }
    },

    effects: {
        *list({ payload, callback }, { call, put }) {
            const response = yield call(listRule, payload);
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
        // 跳转到审批流详情
        *option({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload,
            });
            if(payload.type == 4) {
                // 如果是拉重单类型，单独跳转到拉重单的详情页
                yield put(routerRedux.push({
                    pathname: '/review/reviewlist/repeatDetail',
                    state: payload,
                }));
            } else if(payload.type == 7 || payload.type == 8) {
                // 如果是有效单退回公海/死海类型，单独跳转到有效单退回公海/死海的详情页
                yield put(routerRedux.push({
                    pathname: '/review/reviewlist/requirementBackToSeasDetail',
                    state: {
                        ...payload,
                        reviewType: payload.type == 7 ? 1 : 2,
                    },
                }));
            } else if(payload.type == 9) {
                // 如果是有效单关闭类型
                yield put(routerRedux.push({
                    pathname: '/review/reviewlist/requirementBackToSeasDetail',
                    state: {
                        ...payload,
                        reviewType: 3,
                    },
                }));
            } else {
                yield put(routerRedux.push({
                    pathname: '/review/reviewlist/detail',
                    state: payload,
                }));
            }
            
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