import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";
import { doRule, infoRule } from "./service";
import {  RepeatDetailData } from "./data";
import { routerRedux } from "dva/router";


export interface StateType {
    data: RepeatDetailData | undefined,
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
        orderDetail: Effect;
        toCustomerDetail: Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'reviewManagementRepeatDetail',
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
            if (callback) callback(response.code == 200);
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
        *orderDetail({ payload }, { call, put }) {
            yield put(routerRedux.push({
                pathname: '/order/orderManagement/orderDetails',
                query: payload,
            }));
        },
        *toCustomerDetail({ payload }, { put }) {
            yield put(routerRedux.push({
                pathname: '/customer/customerManagement/customerDetail',
                state: payload,
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