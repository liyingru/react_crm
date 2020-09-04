import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";
import { doRule, infoRule } from "./service";
import { ReviewData } from "./data";
import { routerRedux } from "dva/router";


export interface StateType {
    data: ReviewData | undefined,
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        do: Effect;
        info: Effect;
        leadDetail: Effect;
        orderDetail: Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'reviewManagementReviewDetail',
    state: {
        data: undefined,
    },

    effects: {
        *do({ payload, callback }, { call, put }) {
            const response = yield call(doRule, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback && response.code == 200) callback();
        },
        *info({ payload }, { call, put }) {
            const response = yield call(infoRule, payload);
            yield put({
                type: 'save',
                payload: {
                    data: response.data.result,
                }
            });
        },
        *leadDetail({ payload }, { call, put }) {
            yield put(routerRedux.push({
                pathname: '/claimTableList/leadsDetails',
                state: payload,
            }));
        },
        *orderDetail({ payload }, { call, put }) {
            yield put(routerRedux.push({
                pathname: '/order/orderManagement/orderDetails',
                query: payload,
            }));
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