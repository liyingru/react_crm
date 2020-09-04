import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";
import { getImportLog } from "./service";
import { ImportLog } from "./data";

export interface StateType {
    importLog:ImportLog[];
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        importLog:Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'passengerImport',
    state: {
        importLog:[]
    },

    effects: {
        *importLog({ payload,callback }, { call, put }){
            const response = yield call(getImportLog, payload);
            yield put({
              type: 'save',
              payload: {
                importLog: response.data.result
              },
            });
            if(callback) callback(response);
          }
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