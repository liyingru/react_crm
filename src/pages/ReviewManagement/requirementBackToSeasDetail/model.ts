import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";
import { infoRule, doRule, redistribute  } from "./service";
import { ReviewData } from "../reviewDetail/data";
import { routerRedux } from "dva/router";


export interface StateType {
    data: ReviewData|undefined,
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        info: Effect;
        do: Effect;
        redistribute: Effect;
        toReqDetail: Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'reviewManagementRequirBackToSeaDetail',
    state: {
        data: undefined,
    },

    effects: {
        // 请求详情
        *info({ payload }, { call, put }) {
            const response = yield call(infoRule, payload);
            yield put({
                type: 'save',
                payload: {
                    data: response.data.result,
                }
            });
        },
        // 退回公海/死海
        *do({ payload, callback }, { call, put }) {
            const response = yield call(doRule, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback) callback(response.code == 200);
        },
        // 重新指派接收人
        *redistribute({ payload, callback }, { call, put }) {
            const response = yield call(redistribute, payload);
            yield put({
                type: 'save',
                payload,
            });
            if (callback) callback(response.code == 200);
        },

        *toReqDetail({ payload }, { call, put }) {
            console.log("传入参数： " + JSON.stringify(payload));
            yield put(routerRedux.push({
                pathname: "/demand/demandManagement/demandDetails",
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