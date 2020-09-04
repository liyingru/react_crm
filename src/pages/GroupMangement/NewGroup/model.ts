import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerConfig,getGroupMember,getAddGroup,taskConfigCtrl} from './service';
import { ConfigList } from './commondata';
import { MemberDataList,AddGroupDataList } from './data';




export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;
  

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        fetch: Effect;
        configCtrl:Effect;
        searchMember:Effect;
        addGroup:Effect;
        taskConfigCtrl:Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}
export interface StateType {
  config: ConfigList;
  memberData:MemberDataList;
  addGroupData:AddGroupDataList
  defaultConfig:{}
}


const Model: ModelType = {
    namespace: 'newGroup',
    state: {
      config: {
        channel: [], //渠道
        customerLevel: [], //客户级别
        identity: [], //客户身份
        gender: [], //性别
        weddingStyle: [], //婚礼风格
        category: [], //业务品类
        contactTime: [], //方便联系时间
        contactWay: [], //跟进方式
        payType: [], //付款方式
        requirementStatus: [], //有效单状态
        followTag: [], //跟进标签
        leadsFollowStatus: [], //客资跟进状态
        customerFollowStatus: [], //客户跟进状态
        orderFollowStatus: [], //订单跟进状态
        leadsStatus: [], //客资状态
        banquetType: [], //婚宴类型
        carBrand: [], //车辆品牌
        photoStyle: [], //婚照风格
        hotelStar: [], //酒店星级
      },
      defaultConfig:{},
      memberData:[],
      addGroupData:[]
    },
  
    effects: {
      *configCtrl({ payload }, { call, put }) {
        const response = yield call(getCustomerConfig, payload);
        let arr = response.data.result;
        yield put({
          type: 'save',
          payload: {
            config:arr
          },
        })
      },
      // 任务配置 2020.3.5 星期四 13.30
    *taskConfigCtrl({ payload }, { call, put }) {
      let response = yield call(taskConfigCtrl, payload);
      yield put({
        type: 'save',
        payload: { defaultConfig: response.data.result },
      });
    },
      *searchMember({ payload }, { call, put }) {
        const response = yield call(getGroupMember, payload);
        let arr = response.data.result;
        yield put({
          type: 'save',
          payload: {
            memberData:arr
          },
        })
      },
      *addGroup({ payload,callback }, { call, put }) {
        const response = yield call(getAddGroup, payload);
        if (callback) callback(response.code == 200,response.msg);
        // let arr = response.data.result;
        // yield put({
        //   type: 'save',
        //   payload: {
        //     memberData:arr
        //   },
        // })
      },
    },
  
    reducers: {
      save(state, { payload }) {
        return {
          ...state,
          ...payload
        };
      },
    },
};
  
export default Model;
  